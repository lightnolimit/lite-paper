import { useMemo, useCallback } from 'react';

import { documentationTree } from '../../data/documentation';
import { useDebounce } from '../../hooks/useDebounce';
import type { FileItem } from '../../types/documentation';

export interface GraphNode {
  id: string;
  title: string;
  path: string;
  type: 'file' | 'directory';
  x: number;
  y: number;
  level: number;
  connections: string[];
  visible: boolean;
  searchRelevance: number;
  tags?: string[];
}

export interface GraphLink {
  source: string;
  target: string;
  strength: number;
  visible: boolean;
  linkType: 'structural' | 'tag';
}

export const useGraphLogic = (
  dimensions: { width: number; height: number },
  searchTerm: string,
  currentPath?: string
) => {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Build graph structure with memoization
  const { graphNodes, graphLinks } = useMemo(() => {
    const extractedNodes: GraphNode[] = [];
    const extractedLinks: GraphLink[] = [];

    // Recursive function to extract nodes from file tree
    function extractNodes(items: FileItem[], level = 0, parentPath = '') {
      items.forEach((item) => {
        const nodeId = item.path;
        const node: GraphNode = {
          id: nodeId,
          title: item.name,
          path: item.path,
          type: item.type,
          level,
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          connections: [],
          visible: false,
          searchRelevance: 0,
          tags: item.tags,
        };

        // Create parent-child connections
        if (parentPath) {
          node.connections.push(parentPath);
          extractedLinks.push({
            source: parentPath,
            target: nodeId,
            strength: 1,
            visible: false,
            linkType: 'structural',
          });
        }

        extractedNodes.push(node);

        // Process children
        if (item.children) {
          extractNodes(item.children, level + 1, nodeId);
        }
      });
    }

    extractNodes(documentationTree);

    // Create logical connections for related content
    const createLogicalConnections = () => {
      const relatedPairs = [
        ['installation', 'quick-start'],
        ['basic-usage', 'configuration'],
        ['overview', 'authentication'],
        ['endpoints', 'authentication'],
        ['code-examples', 'best-practices'],
      ];

      relatedPairs.forEach(([term1, term2]) => {
        const node1 = extractedNodes.find((n) => n.path.includes(term1));
        const node2 = extractedNodes.find((n) => n.path.includes(term2));

        if (node1 && node2) {
          // Add bidirectional connections
          if (!node1.connections.includes(node2.id)) {
            node1.connections.push(node2.id);
          }
          if (!node2.connections.includes(node1.id)) {
            node2.connections.push(node1.id);
          }

          extractedLinks.push({
            source: node1.id,
            target: node2.id,
            strength: 0.7,
            visible: false,
            linkType: 'structural',
          });
        }
      });
    };

    createLogicalConnections();

    // Create tag-based connections
    const createTagConnections = () => {
      const nodesWithTags = extractedNodes.filter((node) => node.tags && node.tags.length > 0);

      for (let i = 0; i < nodesWithTags.length; i++) {
        for (let j = i + 1; j < nodesWithTags.length; j++) {
          const node1 = nodesWithTags[i];
          const node2 = nodesWithTags[j];

          const sharedTags = node1.tags!.filter((tag) => node2.tags!.includes(tag));

          if (sharedTags.length > 0) {
            const existingLink = extractedLinks.find(
              (link) =>
                (link.source === node1.id && link.target === node2.id) ||
                (link.source === node2.id && link.target === node1.id)
            );

            if (!existingLink) {
              if (!node1.connections.includes(node2.id)) {
                node1.connections.push(node2.id);
              }
              if (!node2.connections.includes(node1.id)) {
                node2.connections.push(node1.id);
              }

              const strength = Math.min(0.3 + sharedTags.length * 0.2, 0.9);

              extractedLinks.push({
                source: node1.id,
                target: node2.id,
                strength,
                visible: false,
                linkType: 'tag',
              });
            }
          }
        }
      }
    };

    createTagConnections();

    return { graphNodes: extractedNodes, graphLinks: extractedLinks };
  }, [dimensions]);

  // Efficient search with relevance scoring
  const searchResults = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return { nodes: [], hasResults: false };

    const query = debouncedSearchTerm.toLowerCase().trim();
    const results = graphNodes
      .map((node) => {
        const title = node.title.toLowerCase();
        const path = node.path.toLowerCase();

        let relevance = 0;

        // Exact title match gets highest score
        if (title === query) relevance = 1.0;
        // Title starts with query gets high score
        else if (title.startsWith(query)) relevance = 0.9;
        // Title contains query gets medium score
        else if (title.includes(query)) relevance = 0.7;
        // Path contains query gets low score
        else if (path.includes(query)) relevance = 0.4;

        // Boost score if it's the current node or connected to current
        if (currentPath) {
          if (node.id === currentPath) relevance += 0.2;
          else if (node.connections.includes(currentPath)) relevance += 0.1;
        }

        return { ...node, searchRelevance: Math.min(relevance, 1.0) };
      })
      .filter((node) => node.searchRelevance > 0)
      .sort((a, b) => b.searchRelevance - a.searchRelevance);

    return { nodes: results, hasResults: results.length > 0 };
  }, [debouncedSearchTerm, graphNodes, currentPath]);

  // Get node color based on state
  const getNodeColor = useCallback(
    (node: GraphNode, themeColors: Record<string, string>): string => {
      if (debouncedSearchTerm && node.searchRelevance > 0) {
        return themeColors.search;
      }
      if (node.id === currentPath) {
        return themeColors.current;
      }
      if (node.type === 'directory') {
        return themeColors.secondary;
      }
      return themeColors.primary;
    },
    [debouncedSearchTerm, currentPath]
  );

  // Get node radius based on state
  const getNodeRadius = useCallback(
    (node: GraphNode, isSidebarView: boolean): number => {
      const baseScale = isSidebarView ? 0.6 : 1;

      if (node.id === currentPath) return 8 * baseScale;
      if (debouncedSearchTerm && node.searchRelevance > 0.8) return 7 * baseScale;
      return node.type === 'directory' ? 6 * baseScale : 5 * baseScale;
    },
    [currentPath, debouncedSearchTerm]
  );

  return {
    graphNodes,
    graphLinks,
    searchResults,
    getNodeColor,
    getNodeRadius,
  };
};
