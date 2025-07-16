'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';

import { useDebouncedCallback } from '../../hooks/useDebounce';
import { useTheme } from '../../providers/ThemeProvider';

import GraphControls from './GraphControls';
import GraphLegend from './GraphLegend';
import GraphLinks from './GraphLinks';
import GraphNode from './GraphNode';
import { useGraphLogic, type GraphNode as GraphNodeType, type GraphLink } from './useGraphLogic';

interface OptimizedDocumentationGraphProps {
  currentPath?: string;
  onNodeClick?: (path: string) => void;
  className?: string;
}

export default function OptimizedDocumentationGraph({
  currentPath,
  onNodeClick,
  className = '',
}: OptimizedDocumentationGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [nodes, setNodes] = useState<GraphNodeType[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedNodeId, setFocusedNodeId] = useState<string | undefined>(undefined);

  // Zoom and pan state
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Interaction state
  const [clickedNodeId, setClickedNodeId] = useState<string | undefined>(undefined);
  const [isNavigating, setIsNavigating] = useState(false);
  const [pendingSwitchNodeId, setPendingSwitchNodeId] = useState<string | undefined>(undefined);

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 2;
  const PAN_LIMIT = 200;

  const { isDarkMode, prefersReducedMotion } = useTheme();

  // Use the extracted graph logic
  const { graphNodes, graphLinks, searchResults, getNodeColor, getNodeRadius } = useGraphLogic(
    dimensions,
    searchTerm,
    currentPath
  );

  // Theme-aware color scheme - consistent between server and client
  const themeColors = useMemo(() => {
    return {
      primary: isDarkMode ? '#FF85A1' : '#678D58',
      secondary: isDarkMode ? '#FFC4DD' : '#A3C9A8',
      accent: isDarkMode ? '#FF4989' : '#2D4A2A',
      connected: isDarkMode ? '#FFB3C6' : '#8FB287',
      current: isDarkMode ? '#FF6B9D' : '#4A6B42',
      search: isDarkMode ? '#FFCC99' : '#B8860B',
      muted: isDarkMode ? '#9C9CAF' : '#6E7D61',
      background: isDarkMode ? '#1A1A1F' : '#F3F5F0',
    };
  }, [isDarkMode]);

  // Update node visibility based on current focus and search
  const visibleElements = useMemo(() => {
    const visibleNodes = new Set<string>();
    const visibleLinks = new Set<string>();

    if (searchTerm.trim()) {
      searchResults.nodes.slice(0, 8).forEach((node) => {
        visibleNodes.add(node.id);
        node.connections.forEach((connId) => {
          if (searchResults.nodes.some((n) => n.id === connId)) {
            visibleNodes.add(connId);
            visibleLinks.add(`${node.id}-${connId}`);
            visibleLinks.add(`${connId}-${node.id}`);
          }
        });
      });
    } else {
      const focusNode = focusedNodeId || currentPath;
      if (focusNode) {
        visibleNodes.add(focusNode);

        const currentNode = graphNodes.find((n) => n.id === focusNode);
        if (currentNode) {
          currentNode.connections.forEach((connId) => {
            visibleNodes.add(connId);
            visibleLinks.add(`${focusNode}-${connId}`);
            visibleLinks.add(`${connId}-${focusNode}`);
          });

          graphNodes.forEach((node) => {
            if (node.connections.includes(focusNode)) {
              visibleNodes.add(node.id);
              visibleLinks.add(`${node.id}-${focusNode}`);
              visibleLinks.add(`${focusNode}-${node.id}`);
            }
          });
        }
      } else {
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

    const currentNode = graphNodes.find((n) => n.id === (focusedNodeId || currentPath));

    const positionedNodes = graphNodes.map((node) => {
      const newNode = { ...node };

      if (node.id === (focusedNodeId || currentPath)) {
        newNode.x = centerX;
        newNode.y = centerY;
      } else if (currentNode && currentNode.connections.includes(node.id)) {
        const connectionIndex = currentNode.connections.indexOf(node.id);
        const totalConnections = currentNode.connections.length;
        const angle = (connectionIndex / totalConnections) * 2 * Math.PI;
        const radius = isSidebarView ? 80 : 120;

        newNode.x = centerX + Math.cos(angle) * radius;
        newNode.y = centerY + Math.sin(angle) * radius;
      } else if (currentNode) {
        const connectingNodes = graphNodes.filter((n) => n.connections.includes(currentNode.id));
        const nodeIndex = connectingNodes.findIndex((n) => n.id === node.id);

        if (nodeIndex !== -1) {
          const angle = (nodeIndex / connectingNodes.length) * 2 * Math.PI + Math.PI;
          const radius = isSidebarView ? 140 : 200;

          newNode.x = centerX + Math.cos(angle) * radius;
          newNode.y = centerY + Math.sin(angle) * radius;
        } else {
          const angle = Math.random() * 2 * Math.PI;
          const radius = isSidebarView ? 300 : 400;
          newNode.x = centerX + Math.cos(angle) * radius;
          newNode.y = centerY + Math.sin(angle) * radius;
        }
      } else {
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

  // Debounced search handler
  const handleSearchChange = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, 300);

  // Zoom functionality
  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(MAX_SCALE, prev * 1.2));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(MIN_SCALE, prev / 1.2));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  // Mouse interaction handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
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

      let newX = dragOffset.x + deltaX;
      let newY = dragOffset.y + deltaY;

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

  // Node interaction handlers
  const handleNodeClick = useCallback(
    (node: GraphNodeType) => {
      if (isNavigating) return;

      setClickedNodeId(node.id);
      setFocusedNodeId(node.id);
      setPendingSwitchNodeId(node.id);

      setTimeout(
        () => {
          setClickedNodeId(undefined);
        },
        prefersReducedMotion ? 50 : 600
      );
    },
    [isNavigating, prefersReducedMotion]
  );

  const handleSwitchClick = useCallback(
    (node: GraphNodeType) => {
      if (isNavigating) return;

      setIsNavigating(true);
      setPendingSwitchNodeId(undefined);

      setTimeout(() => {
        onNodeClick?.(node.path);
        setIsNavigating(false);
      }, 100);
    },
    [onNodeClick, isNavigating]
  );

  // Handle container resize
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setDimensions({ width: rect.width, height: rect.height });
        }
      }
    };

    let resizeObserver: ResizeObserver | null = null;

    if (svgRef.current) {
      handleResize();

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const { width, height } = entry.contentRect;
            if (width > 0 && height > 0) {
              setDimensions({ width, height });
            }
          }
        });
        resizeObserver.observe(svgRef.current);
      }

      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Set focus when current path changes
  useEffect(() => {
    if (currentPath) {
      setFocusedNodeId(currentPath);
    }
  }, [currentPath]);

  const isSidebarView = dimensions.height <= 300;

  return (
    <div className={`documentation-graph ${className}`}>
      {/* Search Input */}
      <div className="mb-2">
        <input
          type="text"
          placeholder={isSidebarView ? 'Search docs...' : 'Search documents...'}
          onChange={handleSearchChange}
          className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            isSidebarView ? 'text-xs py-1 px-2' : 'text-sm'
          }`}
          style={{
            fontFamily: 'var(--mono-font)',
            backgroundColor: 'var(--toc-bg-color)',
            borderColor: 'var(--toc-border-color)',
            color: 'var(--mindmap-text-color)',
          }}
        />
      </div>

      {/* Graph Container */}
      <div
        className={`graph-container border border-gray-300 dark:border-gray-700 rounded overflow-hidden relative ${
          isSidebarView ? 'h-48' : 'h-96'
        }`}
      >
        {/* Mind-map label */}
        <div
          className="absolute top-2 right-3 text-xs pointer-events-none z-10"
          style={{
            fontSize: isSidebarView ? '8px' : '10px',
            fontFamily: 'var(--mono-font)',
            color: 'var(--toc-text-color)',
            opacity: 0.4,
          }}
        >
          mind-map {scale !== 1 ? `(${Math.round(scale * 100)}%)` : ''}
        </div>

        {/* Zoom controls */}
        <GraphControls
          scale={scale}
          translate={translate}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
          minScale={MIN_SCALE}
          maxScale={MAX_SCALE}
          isSidebarView={isSidebarView}
        />

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

          {/* Links */}
          <GraphLinks
            links={links}
            nodes={nodes}
            visibleLinks={visibleElements.visibleLinks}
            themeColors={themeColors}
            isSidebarView={isSidebarView}
          />

          {/* Nodes */}
          <g className="nodes">
            {nodes.map((node, nodeIndex) => {
              const isVisible = visibleElements.visibleNodes.has(node.id);
              if (!isVisible) return null;

              return (
                <GraphNode
                  key={node.id}
                  node={node}
                  index={nodeIndex}
                  currentPath={currentPath}
                  focusedNodeId={focusedNodeId}
                  clickedNodeId={clickedNodeId}
                  pendingSwitchNodeId={pendingSwitchNodeId}
                  themeColors={themeColors}
                  isSidebarView={isSidebarView}
                  onNodeClick={handleNodeClick}
                  onSwitchClick={handleSwitchClick}
                  getNodeColor={(node) => getNodeColor(node, themeColors)}
                  getNodeRadius={(node) => getNodeRadius(node, isSidebarView)}
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* Legend */}
      <GraphLegend
        searchTerm={searchTerm}
        searchResults={searchResults}
        isSidebarView={isSidebarView}
      />
    </div>
  );
}
