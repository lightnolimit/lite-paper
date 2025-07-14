'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';

import { documentationTree } from '../data/documentation';
import { useTheme } from '../providers/ThemeProvider';

import { FileItem } from './FileTree';

// Types for our graph system
interface GraphNode {
  id: string;
  title: string;
  path: string;
  type: 'file' | 'directory';
  x: number;
  y: number;
  level: number;
  connections: string[];
  visible: boolean;
  searchRelevance: number; // 0-1, for search scoring
}

interface GraphLink {
  source: string;
  target: string;
  strength: number;
  visible: boolean;
}

interface DocumentationGraphProps {
  currentPath?: string;
  onNodeClick?: (path: string) => void;
  className?: string;
}

/**
 * Interactive documentation graph component with focused view
 *
 * Features:
 * - Shows only current node + connections to reduce clutter
 * - Theme-aware colors (sakura pink/matcha green)
 * - Efficient search with relevance scoring
 * - Smooth animations and transitions
 */
export default function DocumentationGraph({
  currentPath,
  onNodeClick,
  className = '',
}: DocumentationGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  // Zoom and pan state with limits
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 2;
  const PAN_LIMIT = 200; // Maximum pan distance from center
  const [clickedNodeId, setClickedNodeId] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [pendingSwitchNodeId, setPendingSwitchNodeId] = useState<string | null>(null);
  const { isDarkMode, prefersReducedMotion } = useTheme();

  // Theme-aware color scheme
  const themeColors = useMemo(() => {
    if (isDarkMode) {
      return {
        // Dark mode - Sakura pink aesthetic
        primary: '#FF85A1', // Sakura pink
        secondary: '#FFC4DD', // Light pink
        accent: '#FF4989', // Bright pink
        connected: '#FFB3C6', // Medium pink
        current: '#FF6B9D', // Deep pink
        search: '#FFCC99', // Warm orange
        muted: '#9C9CAF', // Gray
        background: '#0F0F12',
      };
    } else {
      return {
        // Light mode - Matcha green aesthetic
        primary: '#678D58', // Matcha green
        secondary: '#A3C9A8', // Light green
        accent: '#557153', // Forest green
        connected: '#8FB287', // Medium green
        current: '#4A6B42', // Deep green
        search: '#B8860B', // Gold
        muted: '#6E7D61', // Gray
        background: '#F3F5F0',
      };
    }
  }, [isDarkMode]);

  // Extract and build graph structure
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
          visible: false, // Initially hidden
          searchRelevance: 0,
        };

        // Create parent-child connections
        if (parentPath) {
          node.connections.push(parentPath);
          extractedLinks.push({
            source: parentPath,
            target: nodeId,
            strength: 1,
            visible: false,
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
          });
        }
      });
    };

    createLogicalConnections();

    return { graphNodes: extractedNodes, graphLinks: extractedLinks };
  }, [dimensions]);

  // Efficient search with relevance scoring
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return { nodes: [], hasResults: false };

    const query = searchTerm.toLowerCase().trim();
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
  }, [searchTerm, graphNodes, currentPath]);

  // Update node visibility based on current focus and search
  const visibleElements = useMemo(() => {
    const visibleNodes = new Set<string>();
    const visibleLinks = new Set<string>();

    if (searchTerm.trim()) {
      // Show search results
      searchResults.nodes.slice(0, 8).forEach((node) => {
        visibleNodes.add(node.id);
        // Show connections between search results
        node.connections.forEach((connId) => {
          if (searchResults.nodes.some((n) => n.id === connId)) {
            visibleNodes.add(connId);
            visibleLinks.add(`${node.id}-${connId}`);
            visibleLinks.add(`${connId}-${node.id}`);
          }
        });
      });
    } else {
      // Focus mode: show current node + direct connections
      const focusNode = focusedNodeId || currentPath;
      if (focusNode) {
        visibleNodes.add(focusNode);

        // Find and show direct connections
        const currentNode = graphNodes.find((n) => n.id === focusNode);
        if (currentNode) {
          currentNode.connections.forEach((connId) => {
            visibleNodes.add(connId);
            visibleLinks.add(`${focusNode}-${connId}`);
            visibleLinks.add(`${connId}-${focusNode}`);
          });

          // Show nodes that connect to current
          graphNodes.forEach((node) => {
            if (node.connections.includes(focusNode)) {
              visibleNodes.add(node.id);
              visibleLinks.add(`${node.id}-${focusNode}`);
              visibleLinks.add(`${focusNode}-${node.id}`);
            }
          });
        }
      } else {
        // No focus: show a few central nodes
        const centralNodes = graphNodes.filter((n) => n.connections.length > 1).slice(0, 3);
        centralNodes.forEach((node) => visibleNodes.add(node.id));
      }
    }

    return { visibleNodes, visibleLinks };
  }, [searchTerm, searchResults, focusedNodeId, currentPath, graphNodes]);

  // Position nodes with current node at center
  useEffect(() => {
    if (!graphNodes.length) return;

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const isSidebarView = dimensions.height <= 300;

    // Find the current or focused node
    const currentNode = graphNodes.find((n) => n.id === (focusedNodeId || currentPath));

    // Position nodes in a centered layout
    const positionedNodes = graphNodes.map((node) => {
      const newNode = { ...node };

      if (node.id === (focusedNodeId || currentPath)) {
        // Current node goes to center
        newNode.x = centerX;
        newNode.y = centerY;
      } else if (currentNode && currentNode.connections.includes(node.id)) {
        // Connected nodes form a circle around the center
        const connectionIndex = currentNode.connections.indexOf(node.id);
        const totalConnections = currentNode.connections.length;
        const angle = (connectionIndex / totalConnections) * 2 * Math.PI;
        const radius = isSidebarView ? 80 : 120;

        newNode.x = centerX + Math.cos(angle) * radius;
        newNode.y = centerY + Math.sin(angle) * radius;
      } else if (currentNode) {
        // Other nodes that connect to the current node
        const connectingNodes = graphNodes.filter((n) => n.connections.includes(currentNode.id));
        const nodeIndex = connectingNodes.findIndex((n) => n.id === node.id);

        if (nodeIndex !== -1) {
          const angle = (nodeIndex / connectingNodes.length) * 2 * Math.PI + Math.PI;
          const radius = isSidebarView ? 140 : 200;

          newNode.x = centerX + Math.cos(angle) * radius;
          newNode.y = centerY + Math.sin(angle) * radius;
        } else {
          // Random position for unconnected nodes (off-screen)
          const angle = Math.random() * 2 * Math.PI;
          const radius = isSidebarView ? 300 : 400;
          newNode.x = centerX + Math.cos(angle) * radius;
          newNode.y = centerY + Math.sin(angle) * radius;
        }
      } else {
        // No current node selected - spread nodes evenly
        const nodeIndex = graphNodes.indexOf(node);
        const totalNodes = Math.min(graphNodes.length, 8);
        const angle = (nodeIndex / totalNodes) * 2 * Math.PI;
        const radius = isSidebarView ? 100 : 150;

        newNode.x = centerX + Math.cos(angle) * radius;
        newNode.y = centerY + Math.sin(angle) * radius;
      }

      return newNode;
    });

    setNodes(positionedNodes);
    setLinks(graphLinks);
  }, [graphNodes, graphLinks, dimensions, focusedNodeId, currentPath]);

  // Zoom functionality with buttons
  const zoomIn = useCallback(() => {
    const newScale = Math.min(MAX_SCALE, scale * 1.2);
    setScale(newScale);
  }, [scale]);

  const zoomOut = useCallback(() => {
    const newScale = Math.max(MIN_SCALE, scale / 1.2);
    setScale(newScale);
  }, [scale]);

  // Zoom with wheel (prevent page scroll)
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      // Only handle if the mindmap is focused/hovered
      const container = e.currentTarget.closest('.graph-container');
      if (!container || !container.contains(e.target as Node)) return;

      e.preventDefault();
      e.stopPropagation();

      if (e.deltaY > 0) {
        zoomOut();
      } else {
        zoomIn();
      }
    },
    [zoomIn, zoomOut]
  );

  // Reset zoom and pan
  const resetZoom = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  // Drag functionality with limits
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      // Only start drag on SVG background, not on nodes
      if ((e.target as SVGElement).tagName !== 'svg') return;

      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setDragOffset({ x: translate.x, y: translate.y });
      e.currentTarget.style.cursor = 'grabbing';
    },
    [translate]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      // Calculate new translation with limits
      let newX = dragOffset.x + deltaX;
      let newY = dragOffset.y + deltaY;

      // Apply pan limits
      const maxPan = PAN_LIMIT * scale;
      newX = Math.max(-maxPan, Math.min(maxPan, newX));
      newY = Math.max(-maxPan, Math.min(maxPan, newY));

      setTranslate({ x: newX, y: newY });
    },
    [isDragging, dragStart, dragOffset, scale]
  );

  const handleMouseUp = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(false);
    e.currentTarget.style.cursor = 'grab';
  }, []);

  // Add keyboard shortcut for zoom reset
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '0' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        resetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetZoom]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set focus when current path changes
  useEffect(() => {
    if (currentPath) {
      setFocusedNodeId(currentPath);
    }
  }, [currentPath]);

  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      if (isNavigating) return; // Prevent multiple clicks during navigation

      // Don't navigate immediately, just show the new relational nodes and switch button
      setClickedNodeId(node.id);
      setFocusedNodeId(node.id);
      setPendingSwitchNodeId(node.id);

      // Clear the click animation after a short delay
      setTimeout(
        () => {
          setClickedNodeId(null);
        },
        prefersReducedMotion ? 50 : 600
      );
    },
    [isNavigating, prefersReducedMotion]
  );

  const handleSwitchClick = useCallback(
    (node: GraphNode) => {
      if (isNavigating) return;

      setIsNavigating(true);
      setPendingSwitchNodeId(null);

      // Navigate after a brief delay
      setTimeout(() => {
        onNodeClick?.(node.path);
        setIsNavigating(false);
      }, 100);
    },
    [onNodeClick, isNavigating]
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const getNodeColor = useCallback(
    (node: GraphNode): string => {
      if (searchTerm && node.searchRelevance > 0) {
        return themeColors.search;
      }
      if (node.id === currentPath) {
        return themeColors.current;
      }
      if (node.id === focusedNodeId) {
        return themeColors.accent;
      }
      if (node.type === 'directory') {
        return themeColors.secondary;
      }
      return themeColors.primary;
    },
    [searchTerm, currentPath, focusedNodeId, themeColors]
  );

  const getNodeRadius = useCallback(
    (node: GraphNode): number => {
      const isSidebarView = dimensions.height <= 300;
      const baseScale = isSidebarView ? 0.6 : 1;

      if (node.id === currentPath) return 8 * baseScale;
      if (node.id === focusedNodeId) return 7 * baseScale;
      if (searchTerm && node.searchRelevance > 0.8) return 7 * baseScale;
      return node.type === 'directory' ? 6 * baseScale : 5 * baseScale;
    },
    [dimensions.height, currentPath, focusedNodeId, searchTerm]
  );

  const isSidebarView = dimensions.height <= 300;

  return (
    <div className={`documentation-graph ${className}`}>
      {/* Search Input */}
      <div className="mb-2">
        <input
          type="text"
          placeholder={isSidebarView ? 'Search docs...' : 'Search documents...'}
          value={searchTerm}
          onChange={handleSearchChange}
          className={`w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            isSidebarView ? 'text-xs py-1 px-2' : ''
          }`}
          style={{
            fontFamily: 'var(--mono-font)',
          }}
        />
      </div>

      {/* Graph Container */}
      <div
        className={`graph-container border border-gray-300 dark:border-gray-700 rounded overflow-hidden relative ${
          isSidebarView ? 'h-48' : 'h-96'
        }`}
      >
        {/* Fixed mind-map label */}
        <div
          className="absolute top-2 right-3 text-xs pointer-events-none z-10"
          style={{
            fontSize: isSidebarView ? '8px' : '10px',
            fontFamily: 'var(--mono-font)',
            color: isDarkMode ? 'rgba(240, 240, 245, 0.4)' : 'rgba(46, 58, 35, 0.4)',
          }}
        >
          mind-map {scale !== 1 ? `(${Math.round(scale * 100)}%)` : ''}
        </div>

        {/* Zoom controls */}
        {!isSidebarView && (
          <div className="absolute bottom-2 right-3 flex items-center gap-1 z-10">
            <button
              onClick={zoomOut}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              style={{
                fontSize: '14px',
                fontFamily: 'var(--mono-font)',
                color: isDarkMode ? 'rgba(240, 240, 245, 0.6)' : 'rgba(46, 58, 35, 0.6)',
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(240, 240, 245, 0.2)' : 'rgba(46, 58, 35, 0.2)',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Zoom out"
              disabled={scale <= MIN_SCALE}
            >
              −
            </button>
            <button
              onClick={zoomIn}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              style={{
                fontSize: '14px',
                fontFamily: 'var(--mono-font)',
                color: isDarkMode ? 'rgba(240, 240, 245, 0.6)' : 'rgba(46, 58, 35, 0.6)',
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(240, 240, 245, 0.2)' : 'rgba(46, 58, 35, 0.2)',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Zoom in"
              disabled={scale >= MAX_SCALE}
            >
              +
            </button>
            {(scale !== 1 || translate.x !== 0 || translate.y !== 0) && (
              <button
                onClick={resetZoom}
                className="px-2 py-1 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ml-1"
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--mono-font)',
                  color: isDarkMode ? 'rgba(240, 240, 245, 0.6)' : 'rgba(46, 58, 35, 0.6)',
                  border: '1px solid',
                  borderColor: isDarkMode ? 'rgba(240, 240, 245, 0.2)' : 'rgba(46, 58, 35, 0.2)',
                }}
                title="Reset view (Ctrl/Cmd + 0)"
              >
                Reset
              </button>
            )}
          </div>
        )}

        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="documentation-graph-svg"
          viewBox={`${-translate.x / scale} ${-translate.y / scale} ${dimensions.width / scale} ${dimensions.height / scale}`}
          style={{
            backgroundColor: 'var(--card-color)',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Gradient definitions */}
          <defs>
            <radialGradient id="node-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background particles */}
          {!isSidebarView && (
            <g className="background-particles" opacity="0.1">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.circle
                  key={`particle-${i}`}
                  r={1}
                  fill={themeColors.primary}
                  initial={{
                    x: Math.random() * dimensions.width,
                    y: Math.random() * dimensions.height,
                  }}
                  animate={{
                    x: Math.random() * dimensions.width,
                    y: Math.random() * dimensions.height,
                  }}
                  transition={{
                    duration: Math.random() * 20 + 10,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'linear',
                  }}
                />
              ))}
            </g>
          )}

          {/* Links */}
          <g className="links">
            {links.map((link, index) => {
              const sourceNode = nodes.find((n) => n.id === link.source);
              const targetNode = nodes.find((n) => n.id === link.target);

              if (!sourceNode || !targetNode) return null;

              const linkKey = `${link.source}-${link.target}`;
              const isVisible = visibleElements.visibleLinks.has(linkKey);

              if (!isVisible) return null;

              return (
                <motion.line
                  key={`link-${index}`}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={themeColors.connected}
                  strokeWidth={isSidebarView ? 1 : 1.5}
                  strokeOpacity={0.6}
                  initial={{
                    pathLength: prefersReducedMotion ? 1 : 0,
                    opacity: prefersReducedMotion ? 0.6 : 0,
                  }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  exit={{
                    pathLength: prefersReducedMotion ? 1 : 0,
                    opacity: prefersReducedMotion ? 0.6 : 0,
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0.01 : 0.8,
                    delay: prefersReducedMotion ? 0 : index * 0.1,
                    ease: 'easeInOut',
                  }}
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {nodes.map((node, nodeIndex) => {
              const isVisible = visibleElements.visibleNodes.has(node.id);

              if (!isVisible) return null;

              const nodeColor = getNodeColor(node);
              const nodeRadius = getNodeRadius(node);

              return (
                <motion.g
                  key={node.id}
                  className="node-group cursor-pointer"
                  initial={{
                    scale: prefersReducedMotion ? 1 : 0,
                    opacity: prefersReducedMotion ? 1 : 0,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  exit={{
                    scale: prefersReducedMotion ? 1 : 0,
                    opacity: prefersReducedMotion ? 1 : 0,
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0.01 : 0.5,
                    delay: prefersReducedMotion ? 0 : nodeIndex * 0.05,
                  }}
                  whileHover={
                    prefersReducedMotion
                      ? {}
                      : {
                          scale: 1.1,
                          transition: { duration: 0.2 },
                        }
                  }
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                  onClick={() => handleNodeClick(node)}
                >
                  {/* Node glow */}
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeRadius + 3}
                    fill={nodeColor}
                    opacity={0.2}
                    filter="url(#glow)"
                  />

                  {/* Main node */}
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeRadius}
                    fill={nodeColor}
                    stroke="white"
                    strokeWidth={node.id === currentPath ? 2 : 1}
                  />

                  {/* Node gradient overlay */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeRadius}
                    fill="url(#node-gradient)"
                    pointerEvents="none"
                  />

                  {/* Node label */}
                  <motion.text
                    x={node.x}
                    y={node.y + nodeRadius + (isSidebarView ? 8 : 12)}
                    textAnchor="middle"
                    className="text-xs fill-current text-gray-700 dark:text-gray-300 font-medium pointer-events-none"
                    style={{
                      fontSize: isSidebarView ? '8px' : '10px',
                      fontFamily: 'var(--mono-font)',
                    }}
                  >
                    {isSidebarView
                      ? node.title.length > 6
                        ? `${node.title.slice(0, 6)}...`
                        : node.title
                      : node.title.length > 12
                        ? `${node.title.slice(0, 12)}...`
                        : node.title}
                  </motion.text>

                  {/* Current page indicator */}
                  {node.id === currentPath && (
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={nodeRadius + 5}
                      fill="none"
                      stroke={themeColors.current}
                      strokeWidth={1.5}
                      strokeDasharray="3,3"
                      animate={{
                        rotate: 360,
                        strokeDashoffset: [0, -6],
                      }}
                      transition={{
                        rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                        strokeDashoffset: { duration: 1, repeat: Infinity, ease: 'linear' },
                      }}
                    />
                  )}

                  {/* Click confirmation indicator */}
                  {node.id === clickedNodeId && (
                    <>
                      {/* Expanding confirmation ring */}
                      <motion.circle
                        cx={node.x}
                        cy={node.y}
                        r={nodeRadius}
                        fill="none"
                        stroke={themeColors.accent}
                        strokeWidth={2}
                        initial={{ r: nodeRadius, opacity: 0.8 }}
                        animate={{ r: nodeRadius + 15, opacity: 0 }}
                        transition={{
                          duration: prefersReducedMotion ? 0.01 : 0.6,
                          ease: 'easeOut',
                        }}
                      />

                      {/* Check icon or confirmation symbol */}
                      <motion.text
                        x={node.x}
                        y={node.y + 2}
                        textAnchor="middle"
                        className="pointer-events-none"
                        style={{
                          fontSize: isSidebarView ? '8px' : '12px',
                          fontFamily: 'var(--mono-font)',
                          fill: themeColors.accent,
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          duration: prefersReducedMotion ? 0.01 : 0.3,
                          delay: prefersReducedMotion ? 0 : 0.1,
                        }}
                      >
                        ✓
                      </motion.text>
                    </>
                  )}

                  {/* Switch button for pending navigation */}
                  {node.id === pendingSwitchNodeId && node.id !== currentPath && (
                    <motion.g
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        duration: prefersReducedMotion ? 0.01 : 0.3,
                        delay: prefersReducedMotion ? 0 : 0.4,
                      }}
                    >
                      {/* Switch button background */}
                      <motion.rect
                        x={node.x - (isSidebarView ? 18 : 24)}
                        y={node.y - nodeRadius - (isSidebarView ? 20 : 28)}
                        width={isSidebarView ? 36 : 48}
                        height={isSidebarView ? 14 : 18}
                        rx={isSidebarView ? 7 : 9}
                        fill={themeColors.accent}
                        stroke="white"
                        strokeWidth={1}
                        className="cursor-pointer"
                        whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                        whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSwitchClick(node);
                        }}
                      />

                      {/* Switch button text */}
                      <motion.text
                        x={node.x}
                        y={node.y - nodeRadius - (isSidebarView ? 16 : 22)}
                        textAnchor="middle"
                        className="cursor-pointer pointer-events-none"
                        style={{
                          fontSize: isSidebarView ? '7px' : '9px',
                          fontFamily: 'var(--mono-font)',
                          fill: 'white',
                          fontWeight: 'bold',
                          dominantBaseline: 'central',
                        }}
                      >
                        switch?
                      </motion.text>
                    </motion.g>
                  )}
                </motion.g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Compact legend */}
      <div
        className={`graph-legend mt-2 flex justify-center gap-3 text-xs opacity-75 ${
          isSidebarView ? 'text-xs' : 'text-sm'
        }`}
      >
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColors.primary }} />
          <span style={{ fontSize: isSidebarView ? '9px' : '11px' }}>Pages</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColors.current }} />
          <span style={{ fontSize: isSidebarView ? '9px' : '11px' }}>Current</span>
        </div>
        {searchTerm && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColors.search }} />
            <span style={{ fontSize: isSidebarView ? '9px' : '11px' }}>Matches</span>
          </div>
        )}
      </div>

      {/* Search results info */}
      {searchTerm && (
        <div className="mt-1 text-xs text-center opacity-75">
          {searchResults.hasResults
            ? `${searchResults.nodes.length} result${searchResults.nodes.length !== 1 ? 's' : ''}`
            : 'No matches found'}
        </div>
      )}
    </div>
  );
}
