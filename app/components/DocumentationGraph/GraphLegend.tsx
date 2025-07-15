'use client';

import React from 'react';

interface GraphLegendProps {
  themeColors: Record<string, string>;
  searchTerm: string;
  searchResults: { nodes: Array<{ id: string; title: string }>; hasResults: boolean };
  isSidebarView: boolean;
}

const GraphLegend: React.FC<GraphLegendProps> = React.memo(
  ({ themeColors, searchTerm, searchResults, isSidebarView }) => {
    return (
      <>
        {/* Compact legend */}
        <div
          className={`graph-legend mt-2 flex flex-wrap justify-center gap-3 text-xs opacity-75 ${
            isSidebarView ? 'text-xs' : 'text-sm'
          }`}
        >
          <div className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: themeColors.primary }}
            />
            <span
              style={{ fontSize: isSidebarView ? '9px' : '11px', fontFamily: 'var(--mono-font)' }}
            >
              Pages
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: themeColors.current }}
            />
            <span
              style={{ fontSize: isSidebarView ? '9px' : '11px', fontFamily: 'var(--mono-font)' }}
            >
              Current
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-6 h-0"
              style={{
                borderTop: `1px solid ${themeColors.connected}`,
                opacity: 0.6,
              }}
            />
            <span
              style={{ fontSize: isSidebarView ? '9px' : '11px', fontFamily: 'var(--mono-font)' }}
            >
              Folder
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-6 h-0"
              style={{
                borderTop: `1px dashed ${themeColors.accent}`,
                opacity: 0.4,
              }}
            />
            <span
              style={{ fontSize: isSidebarView ? '9px' : '11px', fontFamily: 'var(--mono-font)' }}
            >
              Tags
            </span>
          </div>
          {searchTerm && (
            <div className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: themeColors.search }}
              />
              <span
                style={{ fontSize: isSidebarView ? '9px' : '11px', fontFamily: 'var(--mono-font)' }}
              >
                Matches
              </span>
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
      </>
    );
  }
);

GraphLegend.displayName = 'GraphLegend';

export default GraphLegend;
