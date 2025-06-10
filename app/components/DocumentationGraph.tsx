'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { documentationTree, FileItem } from '../data/documentation';

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
  color?: string;
}

interface GraphLink {
  source: string;
  target: string;
  strength: number;
}

interface DocumentationGraphProps {
  currentPath?: string;
  onNodeClick?: (path: string) => void;
  className?: string;
}

/**
 * Interactive documentation graph component inspired by Obsidian
 * 
 * Features:
 * - Force-directed layout
 * - Interactive nodes and links
 * - Highlight current page
 * - Search and filter
 * - Zoom and pan
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
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Color scheme for different node types
  const nodeColors = {
    file: '#8a56ff',
    directory: '#61dafb',
    current: '#ff6b6b',
    connected: '#4ecdc4',
    search: '#feca57'
  };

  // Extract nodes and create graph structure
  const { graphNodes, graphLinks } = useMemo(() => {
    const extractedNodes: GraphNode[] = [];
    const extractedLinks: GraphLink[] = [];
    
    // Recursive function to extract nodes from file tree
    function extractNodes(items: FileItem[], level = 0, parentPath = '') {
      items.forEach((item, index) => {
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
          color: item.type === 'file' ? nodeColors.file : nodeColors.directory
        };

        // Create connection to parent if exists
        if (parentPath && item.type === 'file') {
          node.connections.push(parentPath);
          extractedLinks.push({
            source: parentPath,
            target: nodeId,
            strength: 1
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

    // Create cross-references based on content analysis
    // This would typically analyze markdown content for links
    // For now, we'll create some logical connections
    const createLogicalConnections = () => {
      extractedNodes.forEach(node => {
        extractedNodes.forEach(otherNode => {
          if (node.id !== otherNode.id) {
            // Connect getting-started items
            if (node.path.includes('getting-started') && otherNode.path.includes('getting-started')) {
              if (!extractedLinks.some(link => 
                (link.source === node.id && link.target === otherNode.id) ||
                (link.source === otherNode.id && link.target === node.id)
              )) {
                extractedLinks.push({
                  source: node.id,
                  target: otherNode.id,
                  strength: 0.5
                });
              }
            }
            
            // Connect related topics
            const relatedPairs = [
              ['installation', 'quick-start'],
              ['basic-usage', 'advanced-features'],
              ['configuration', 'troubleshooting'],
              ['overview', 'authentication'],
              ['code-examples', 'best-practices']
            ];
            
            relatedPairs.forEach(([term1, term2]) => {
              if ((node.path.includes(term1) && otherNode.path.includes(term2)) ||
                  (node.path.includes(term2) && otherNode.path.includes(term1))) {
                if (!extractedLinks.some(link => 
                  (link.source === node.id && link.target === otherNode.id) ||
                  (link.source === otherNode.id && link.target === node.id)
                )) {
                  extractedLinks.push({
                    source: node.id,
                    target: otherNode.id,
                    strength: 0.7
                  });
                }
              }
            });
          }
        });
      });
    };

    createLogicalConnections();

    return { graphNodes: extractedNodes, graphLinks: extractedLinks };
  }, [dimensions, documentationTree]);

  // Force simulation for positioning
  useEffect(() => {
    if (!graphNodes.length) return;

    const simulation = {
      nodes: [...graphNodes],
      links: [...graphLinks]
    };

    // Simple force simulation implementation
    const iterations = 100;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    for (let i = 0; i < iterations; i++) {
      // Attraction to center
      simulation.nodes.forEach(node => {
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        node.x += dx * 0.01;
        node.y += dy * 0.01;
      });

      // Repulsion between nodes
      for (let j = 0; j < simulation.nodes.length; j++) {
        for (let k = j + 1; k < simulation.nodes.length; k++) {
          const nodeA = simulation.nodes[j];
          const nodeB = simulation.nodes[k];
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const force = (100 - distance) / distance;
            const fx = dx * force * 0.1;
            const fy = dy * force * 0.1;
            
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
          const targetDistance = 80;
          
          if (distance > 0) {
            const force = (distance - targetDistance) / distance * link.strength * 0.1;
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
      simulation.nodes.forEach(node => {
        node.x = Math.max(30, Math.min(dimensions.width - 30, node.x));
        node.y = Math.max(30, Math.min(dimensions.height - 30, node.y));
      });
    }

    setNodes(simulation.nodes);
    setLinks(simulation.links);
  }, [graphNodes, graphLinks, dimensions]);

  // Filter nodes based on search
  const filteredNodes = useMemo(() => {
    if (!searchTerm) return nodes;
    
    return nodes.map(node => ({
      ...node,
      color: node.title.toLowerCase().includes(searchTerm.toLowerCase()) 
        ? nodeColors.search 
        : node.color
    }));
  }, [nodes, searchTerm]);

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
  }, [isFullscreen]);

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node.id);
    onNodeClick?.(node.path);
  };

  const getNodeRadius = (node: GraphNode) => {
    if (node.id === currentPath) return 12;
    if (node.id === selectedNode) return 10;
    return node.type === 'directory' ? 8 : 6;
  };

  const getNodeColor = (node: GraphNode) => {
    if (node.id === currentPath) return nodeColors.current;
    if (node.title.toLowerCase().includes(searchTerm.toLowerCase())) return nodeColors.search;
    
    // Highlight connected nodes
    const isConnected = links.some(link => 
      (link.source === selectedNode && link.target === node.id) ||
      (link.target === selectedNode && link.source === node.id)
    );
    
    if (selectedNode && isConnected) return nodeColors.connected;
    
    return node.color || (node.type === 'file' ? nodeColors.file : nodeColors.directory);
  };

  return (
    <div className={`documentation-graph ${className}`}>
      {/* Controls */}
      <div className="graph-controls flex gap-2 mb-4 items-center">
        <input
          type="text"
          placeholder="Search documentation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="px-4 py-2 rounded-lg bg-primary-color text-white hover:bg-opacity-80 transition-colors"
        >
          {isFullscreen ? 'Exit' : 'Fullscreen'}
        </button>
      </div>

      {/* Graph SVG */}
      <motion.div
        className={`graph-container border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden ${
          isFullscreen ? 'fixed inset-4 z-50 bg-white dark:bg-gray-900' : 'h-96'
        }`}
        animate={{
          height: isFullscreen ? 'calc(100vh - 2rem)' : '24rem'
        }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="documentation-graph-svg"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        >
          {/* Background */}
          <rect width="100%" height="100%" fill="var(--card-color)" />
          
          {/* Links */}
          <g className="links">
            {links.map((link, index) => {
              const sourceNode = filteredNodes.find(n => n.id === link.source);
              const targetNode = filteredNodes.find(n => n.id === link.target);
              
              if (!sourceNode || !targetNode) return null;
              
              const isHighlighted = selectedNode && 
                (link.source === selectedNode || link.target === selectedNode);
              
              return (
                <line
                  key={`link-${index}`}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={isHighlighted ? nodeColors.connected : '#666'}
                  strokeWidth={isHighlighted ? 2 : 1}
                  strokeOpacity={isHighlighted ? 0.8 : 0.3}
                  className="transition-all duration-300"
                />
              );
            })}
          </g>
          
          {/* Nodes */}
          <g className="nodes">
            {filteredNodes.map((node) => (
              <g key={node.id} className="node-group">
                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={getNodeRadius(node)}
                  fill={getNodeColor(node)}
                  stroke="#fff"
                  strokeWidth={node.id === selectedNode ? 3 : 2}
                  className="cursor-pointer transition-all duration-300 hover:scale-110"
                  onClick={() => handleNodeClick(node)}
                />
                
                {/* Node label */}
                <text
                  x={node.x}
                  y={node.y + getNodeRadius(node) + 15}
                  textAnchor="middle"
                  className="text-xs fill-current text-gray-700 dark:text-gray-300 font-medium pointer-events-none"
                  style={{ fontSize: node.id === currentPath ? '12px' : '10px' }}
                >
                  {node.title.length > 15 ? `${node.title.slice(0, 15)}...` : node.title}
                </text>
                
                {/* Current page indicator */}
                {node.id === currentPath && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={getNodeRadius(node) + 4}
                    fill="none"
                    stroke={nodeColors.current}
                    strokeWidth={2}
                    strokeDasharray="4,4"
                    className="animate-pulse"
                  />
                )}
              </g>
            ))}
          </g>
        </svg>
      </motion.div>

      {/* Legend */}
      <div className="graph-legend mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: nodeColors.file }}></div>
          <span>Files</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: nodeColors.directory }}></div>
          <span>Directories</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: nodeColors.current }}></div>
          <span>Current Page</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: nodeColors.connected }}></div>
          <span>Connected</span>
        </div>
      </div>

      {/* Node info panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="node-info mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
          >
            {(() => {
              const node = filteredNodes.find(n => n.id === selectedNode);
              if (!node) return null;
              
              const connections = links.filter(link => 
                link.source === selectedNode || link.target === selectedNode
              );
              
              return (
                <div>
                  <h3 className="font-bold text-lg mb-2">{node.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Type: {node.type} | Path: {node.path}
                  </p>
                  <p className="text-sm">
                    Connected to {connections.length} other page{connections.length !== 1 ? 's' : ''}
                  </p>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="mt-2 text-sm text-primary-color hover:underline"
                  >
                    Clear selection
                  </button>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 