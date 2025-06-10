'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { documentationTree } from '../data/documentation';
import { FileItem } from './FileTree';
import { useTheme } from '../providers/ThemeProvider';

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
  className = '' 
}: DocumentationGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const { isDarkMode, prefersReducedMotion } = useTheme();

  // Theme-aware color scheme
  const themeColors = useMemo(() => {
    if (isDarkMode) {
      return {
        // Dark mode - Sakura pink aesthetic
        primary: '#FF85A1',      // Sakura pink
        secondary: '#FFC4DD',    // Light pink  
        accent: '#FF4989',       // Bright pink
        connected: '#FFB3C6',    // Medium pink
        current: '#FF6B9D',      // Deep pink
        search: '#FFCC99',       // Warm orange
        muted: '#9C9CAF',        // Gray
        background: '#0F0F12'
      };
    } else {
      return {
        // Light mode - Matcha green aesthetic
        primary: '#678D58',      // Matcha green
        secondary: '#A3C9A8',    // Light green
        accent: '#557153',       // Forest green
        connected: '#8FB287',    // Medium green
        current: '#4A6B42',      // Deep green
        search: '#B8860B',       // Gold
        muted: '#6E7D61',        // Gray
        background: '#F3F5F0'
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
          searchRelevance: 0
        };

        // Create parent-child connections
        if (parentPath) {
          node.connections.push(parentPath);
          extractedLinks.push({
            source: parentPath,
            target: nodeId,
            strength: 1,
            visible: false
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
        ['code-examples', 'best-practices']
      ];
      
      relatedPairs.forEach(([term1, term2]) => {
        const node1 = extractedNodes.find(n => n.path.includes(term1));
        const node2 = extractedNodes.find(n => n.path.includes(term2));
        
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
            visible: false
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
    const results = graphNodes.map(node => {
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
    .filter(node => node.searchRelevance > 0)
    .sort((a, b) => b.searchRelevance - a.searchRelevance);
    
    return { nodes: results, hasResults: results.length > 0 };
  }, [searchTerm, graphNodes, currentPath]);

  // Update node visibility based on current focus and search
  const visibleElements = useMemo(() => {
    const visibleNodes = new Set<string>();
    const visibleLinks = new Set<string>();
    
    if (searchTerm.trim()) {
      // Show search results
      searchResults.nodes.slice(0, 8).forEach(node => {
        visibleNodes.add(node.id);
        // Show connections between search results
        node.connections.forEach(connId => {
          if (searchResults.nodes.some(n => n.id === connId)) {
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
        const currentNode = graphNodes.find(n => n.id === focusNode);
        if (currentNode) {
          currentNode.connections.forEach(connId => {
            visibleNodes.add(connId);
            visibleLinks.add(`${focusNode}-${connId}`);
            visibleLinks.add(`${connId}-${focusNode}`);
          });
          
          // Show nodes that connect to current
          graphNodes.forEach(node => {
            if (node.connections.includes(focusNode)) {
              visibleNodes.add(node.id);
              visibleLinks.add(`${node.id}-${focusNode}`);
              visibleLinks.add(`${focusNode}-${node.id}`);
            }
          });
        }
      } else {
        // No focus: show a few central nodes
        const centralNodes = graphNodes
          .filter(n => n.connections.length > 1)
          .slice(0, 3);
        centralNodes.forEach(node => visibleNodes.add(node.id));
      }
    }
    
    return { visibleNodes, visibleLinks };
  }, [searchTerm, searchResults, focusedNodeId, currentPath, graphNodes]);

  // Position nodes using simple force simulation
  useEffect(() => {
    if (!graphNodes.length) return;

    const simulation = {
      nodes: [...graphNodes],
      links: [...graphLinks]
    };

    const iterations = 80;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const isSidebarView = dimensions.height <= 300;

    for (let i = 0; i < iterations; i++) {
      // Gentle attraction to center
      simulation.nodes.forEach(node => {
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        node.x += dx * 0.02;
        node.y += dy * 0.02;
      });

      // Node repulsion
      const minDistance = isSidebarView ? 50 : 80;
      for (let j = 0; j < simulation.nodes.length; j++) {
        for (let k = j + 1; k < simulation.nodes.length; k++) {
          const nodeA = simulation.nodes[j];
          const nodeB = simulation.nodes[k];
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < minDistance && distance > 0) {
            const force = (minDistance - distance) / distance * 0.1;
            const fx = dx * force;
            const fy = dy * force;
            
            nodeA.x -= fx;
            nodeA.y -= fy;
            nodeB.x += fx;
            nodeB.y += fy;
          }
        }
      }

      // Link forces
      simulation.links.forEach(link => {
        const source = simulation.nodes.find(n => n.id === link.source);
        const target = simulation.nodes.find(n => n.id === link.target);
        
        if (source && target) {
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const targetDistance = isSidebarView ? 60 : 100;
          
          if (distance > 0) {
            const force = (distance - targetDistance) / distance * link.strength * 0.05;
            const fx = dx * force;
            const fy = dy * force;
            
            source.x += fx;
            source.y += fy;
            target.x -= fx;
            target.y -= fy;
          }
        }
      });

      // Keep nodes in bounds
      const margin = 30;
      simulation.nodes.forEach(node => {
        node.x = Math.max(margin, Math.min(dimensions.width - margin, node.x));
        node.y = Math.max(margin, Math.min(dimensions.height - margin, node.y));
      });
    }

    setNodes(simulation.nodes);
    setLinks(simulation.links);
  }, [graphNodes, graphLinks, dimensions]);

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

  const handleNodeClick = useCallback((node: GraphNode) => {
    setFocusedNodeId(node.id);
    onNodeClick?.(node.path);
  }, [onNodeClick]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const getNodeColor = useCallback((node: GraphNode): string => {
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
  }, [searchTerm, currentPath, focusedNodeId, themeColors]);

  const getNodeRadius = useCallback((node: GraphNode): number => {
    const isSidebarView = dimensions.height <= 300;
    const baseScale = isSidebarView ? 0.6 : 1;
    
    if (node.id === currentPath) return 8 * baseScale;
    if (node.id === focusedNodeId) return 7 * baseScale;
    if (searchTerm && node.searchRelevance > 0.8) return 7 * baseScale;
    return node.type === 'directory' ? 6 * baseScale : 5 * baseScale;
  }, [dimensions.height, currentPath, focusedNodeId, searchTerm]);

  const isSidebarView = dimensions.height <= 300;

  return (
    <div className={`documentation-graph ${className}`}>
      {/* Search Input */}
      <div className="mb-2">
        <input
          type="text"
          placeholder={isSidebarView ? "Search docs..." : "Search documents..."}
          value={searchTerm}
          onChange={handleSearchChange}
          className={`w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            isSidebarView ? 'text-xs py-1 px-2' : ''
          }`}
          style={{ 
            fontFamily: 'var(--mono-font)'
          }}
        />
      </div>

      {/* Graph Container */}
      <div className={`graph-container border border-gray-300 dark:border-gray-700 rounded overflow-hidden ${
        isSidebarView ? 'h-48' : 'h-96'
      }`}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="documentation-graph-svg"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          style={{ backgroundColor: 'var(--card-color)' }}
        >
          {/* Gradient definitions */}
          <defs>
            <radialGradient id="node-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Mind-map label */}
          <text
            x={dimensions.width - 10}
            y={15}
            textAnchor="end"
            className="text-xs fill-current pointer-events-none"
            style={{ 
              fontSize: isSidebarView ? '8px' : '10px',
              fontFamily: 'var(--mono-font)',
              fill: isDarkMode ? 'rgba(240, 240, 245, 0.4)' : 'rgba(46, 58, 35, 0.4)'
            }}
          >
            mind-map
          </text>

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
                    repeatType: "reverse",
                    ease: "linear"
                  }}
                />
              ))}
            </g>
          )}

          {/* Links */}
          <g className="links">
            {links.map((link, index) => {
              const sourceNode = nodes.find(n => n.id === link.source);
              const targetNode = nodes.find(n => n.id === link.target);
              
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
                  initial={{ pathLength: prefersReducedMotion ? 1 : 0, opacity: prefersReducedMotion ? 0.6 : 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  exit={{ pathLength: prefersReducedMotion ? 1 : 0, opacity: prefersReducedMotion ? 0.6 : 0 }}
                  transition={{ 
                    duration: prefersReducedMotion ? 0.01 : 0.8,
                    delay: prefersReducedMotion ? 0 : index * 0.1,
                    ease: "easeInOut"
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
                    opacity: prefersReducedMotion ? 1 : 0
                  }}
                  animate={{ 
                    scale: 1,
                    opacity: 1
                  }}
                  exit={{
                    scale: prefersReducedMotion ? 1 : 0,
                    opacity: prefersReducedMotion ? 1 : 0
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0.01 : 0.5,
                    delay: prefersReducedMotion ? 0 : nodeIndex * 0.05
                  }}
                  whileHover={prefersReducedMotion ? {} : { 
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
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
                      fontFamily: 'var(--mono-font)'
                    }}
                  >
                    {isSidebarView ? 
                      (node.title.length > 6 ? `${node.title.slice(0, 6)}...` : node.title) :
                      (node.title.length > 12 ? `${node.title.slice(0, 12)}...` : node.title)
                    }
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
                        strokeDashoffset: [0, -6]
                      }}
                      transition={{
                        rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                        strokeDashoffset: { duration: 1, repeat: Infinity, ease: "linear" }
                      }}
                    />
                  )}
                </motion.g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Compact legend */}
      <div className={`graph-legend mt-2 flex justify-center gap-3 text-xs opacity-75 ${
        isSidebarView ? 'text-xs' : 'text-sm'
      }`}>
        <div className="flex items-center gap-1">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: themeColors.primary }}
          />
          <span style={{ fontSize: isSidebarView ? '9px' : '11px' }}>Pages</span>
        </div>
        <div className="flex items-center gap-1">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: themeColors.current }}
          />
          <span style={{ fontSize: isSidebarView ? '9px' : '11px' }}>Current</span>
        </div>
        {searchTerm && (
          <div className="flex items-center gap-1">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: themeColors.search }}
            />
            <span style={{ fontSize: isSidebarView ? '9px' : '11px' }}>Matches</span>
          </div>
        )}
      </div>

      {/* Search results info */}
      {searchTerm && (
        <div className="mt-1 text-xs text-center opacity-75">
          {searchResults.hasResults 
            ? `${searchResults.nodes.length} result${searchResults.nodes.length !== 1 ? 's' : ''}`
            : 'No matches found'
          }
        </div>
      )}
    </div>
  );
}