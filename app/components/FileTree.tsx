'use client';

import React, { useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type FileItem = {
  type: 'file' | 'directory';
  name: string;
  path: string;
  children?: FileItem[];
};

type FileTreeProps = {
  items: FileItem[];
  onSelect: (item: FileItem) => void;
  currentPath?: string;
};

export default function FileTree({ items, onSelect, currentPath }: FileTreeProps) {
  return (
    <div className="file-tree">
      {items.map((item) => (
        <FileTreeItem
          key={item.path}
          item={item}
          onSelect={onSelect}
          currentPath={currentPath}
          level={0}
        />
      ))}
    </div>
  );
}

type FileTreeItemProps = {
  item: FileItem;
  onSelect: (item: FileItem) => void;
  currentPath?: string;
  level: number;
};

function FileTreeItem({ item, onSelect, currentPath, level }: FileTreeItemProps) {
  const [isOpen, setIsOpen] = useState(level === 0);
  const isActive = currentPath === item.path;
  
  const handleToggle = () => {
    if (item.type === 'directory') {
      setIsOpen(!isOpen);
    } else {
      onSelect(item);
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Handle Enter or Space to activate item
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };
  
  // Helper: choose icon for folder state
  const getFolderIcon = () => {
    if (item.type === 'directory') {
      if (isOpen && isActive) {
        // Open and active
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M2 16H1V3h1V2h7v1h1v1h9v1h1v4H5v1H4v2H3v2H2z" strokeWidth="0.5" stroke="#000"/><path fill="currentColor" d="M23 10v2h-1v2h-1v2h-1v2h-1v3h-1v1H3v-1H2v-3h1v-2h1v-2h1v-2h1v-2z" strokeWidth="0.5" stroke="#000"/></svg>
        );
      } else if (isOpen) {
        // Open
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M6 10v2H5v2H4v2H3v2H2v3h1v1h15v-1h1v-3h1v-2h1v-2h1v-2h1v-2zm14 4h-1v2h-1v2h-1v2H4v-2h1v-2h1v-2h1v-2h13z" strokeWidth="0.5" stroke="#000"/><path fill="currentColor" d="M20 5v4h-2V6H9V5H8V4H3v10H2v2H1V3h1V2h7v1h1v1h9v1z" strokeWidth="0.5" stroke="#000"/></svg>
        );
      } else if (isActive) {
        // Closed but active
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M23 6v15h-1v1H2v-1H1V3h1V2h9v1h1v1h1v1h9v1z" strokeWidth="0.5" stroke="#000"/></svg>
        );
      } else {
        // Closed
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M22 6V5h-9V4h-1V3h-1V2H2v1H1v18h1v1h20v-1h1V6zm-1 14H3V4h7v1h1v1h1v1h9z" strokeWidth="0.5" stroke="#000"/></svg>
        );
      }
    }
    // File icon
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M3 22h18V8h-2V6h-2v2h-2V6h2V4h-2V2H3zm2-2V4h8v6h6v10z" strokeWidth="0.5" stroke="#000"/></svg>
    );
  };
  
  return (
    <div>
      <div 
        className={`file-tree-item ${isActive ? 'active' : ''} group flex items-center gap-1`}
        style={{ paddingLeft: `${level * 0.5}rem` }}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role={item.type === 'directory' ? 'button' : 'link'}
        aria-expanded={item.type === 'directory' ? isOpen : undefined}
        aria-current={isActive ? 'page' : undefined}
      >
        {getFolderIcon()}
        <span className="text-sm">{item.name}</span>
      </div>
      
      {item.type === 'directory' && item.children && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {item.children.map((child) => (
                <FileTreeItem
                  key={child.path}
                  item={child}
                  onSelect={onSelect}
                  currentPath={currentPath}
                  level={level + 1}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
} 