'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export type FileItem = {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileItem[];
  expanded?: boolean;
};

type FileTreeProps = {
  items: FileItem[];
  onSelect: (item: FileItem) => void;
  currentPath?: string;
};

type FileTreeItemProps = {
  item: FileItem;
  onSelect: (item: FileItem) => void;
  depth: number;
  onToggle: (path: string) => void;
  currentPath?: string;
};

const FileTreeItem: React.FC<FileTreeItemProps> = ({ 
  item, 
  onSelect, 
  depth, 
  onToggle,
  currentPath
}) => {
  const isActive = currentPath === item.path;
  const isDirectory = item.type === 'directory';
  const hasChildren = isDirectory && item.children && item.children.length > 0;
  
  // Use standard depth for the container, but add extra indent for files inside folders  
  return (
    <div style={{ paddingLeft: `${depth * 12}px` }}>
      <div 
        className={`file-tree-item flex items-center py-1 ${isActive ? 'active' : ''}`}
        onClick={() => {
          if (isDirectory && hasChildren) {
            onToggle(item.path);
          } else {
            onSelect(item);
          }
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (isDirectory && hasChildren) {
              onToggle(item.path);
            } else {
              onSelect(item);
            }
            e.preventDefault();
          }
        }}
        tabIndex={0}
        role={isDirectory ? 'button' : 'link'}
        aria-expanded={isDirectory ? item.expanded : undefined}
        style={{ 
          cursor: isDirectory ? 'pointer' : 'pointer',
          fontFamily: 'var(--mono-font)', 
          letterSpacing: '-0.5px',
          fontSize: '0.9rem'
        }}
      >
        {isDirectory && (
          <span className="mr-1 transform transition-transform" style={{ 
            transform: item.expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            display: 'inline-block',
            width: '20px',
          }}>
            {hasChildren ? '›' : ' '}
          </span>
        )}
        
        <span className="mr-2 flex items-center">
          {isDirectory ? (
            item.expanded ? (
              <Image 
                src="/assets/icons/pixel-folder-open.svg" 
                alt="Folder Open" 
                width={16} 
                height={16} 
                className="inline"
              />
            ) : (
              <Image 
                src="/assets/icons/pixel-folder.svg" 
                alt="Folder" 
                width={16} 
                height={16} 
                className="inline"
              />
            )
          ) : (
            <Image 
              src="/assets/icons/pixel-file.svg" 
              alt="File" 
              width={16} 
              height={16} 
              className="inline"
            />
          )}
        </span>
        
        <span className="truncate">{item.name}</span>
      </div>
      
      {isDirectory && item.expanded && item.children && (
        <div className="file-tree-children pl-2">
          {item.children.map((child) => (
            <FileTreeItem
              key={child.path}
              item={child}
              onSelect={onSelect}
              depth={depth + 1}
              onToggle={onToggle}
              currentPath={currentPath}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileTree: React.FC<FileTreeProps> = ({ items, onSelect, currentPath }) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  const toggleItem = (path: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };
  
  // Add expanded state to each item
  const itemsWithState = React.useMemo(() => {
    const addStateToItems = (items: FileItem[]): FileItem[] => {
      return items.map((item) => {
        const children = item.children ? addStateToItems(item.children) : undefined;
        return {
          ...item,
          expanded: expandedItems[item.path] ?? false,
          children,
        };
      });
    };
    
    return addStateToItems(items);
  }, [items, expandedItems]);
  
  return (
    <div className="file-tree">
      {itemsWithState.map((item) => (
        <FileTreeItem
          key={item.path}
          item={item}
          onSelect={onSelect}
          depth={1}
          onToggle={toggleItem}
          currentPath={currentPath}
        />
      ))}
    </div>
  );
};

export default FileTree; 