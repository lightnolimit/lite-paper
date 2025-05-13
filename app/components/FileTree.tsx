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
        {item.type === 'directory' ? (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-4 h-4 text-gray-400 group-hover:text-[#8a56ff]"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        )}
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