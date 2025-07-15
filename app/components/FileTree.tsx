'use client';

import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useMemo, useCallback } from 'react';

import { useTheme } from '../providers/ThemeProvider';

import styles from './FileTree.module.css';

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
  defaultOpenAll?: boolean;
};

type FileTreeItemProps = {
  item: FileItem;
  onSelect: (item: FileItem) => void;
  depth: number;
  onToggle: (path: string) => void;
  currentPath?: string;
};

// Define types for icon paths
type FolderIcons = {
  open: string;
  closed: string;
};

type FileOrFolderIcon = string | FolderIcons;

// Memoized icon getter function to prevent recreation on every render
const getCustomIcon = (item: FileItem): FileOrFolderIcon | null => {
  if (item.type === 'directory') {
    // Custom folder icon for @rally (case insensitive)
    if (item.name.toLowerCase() === '@rally') {
      return {
        open: '/assets/icons/pfp-rally-icon.png',
        closed: '/assets/icons/pfp-rally-icon.png',
      };
    }

    // Return null for default folder icons (will use Iconify)
    return null;
  } else {
    // Custom file icons for Platform.md in each Phase
    if (item.name === 'Platform.md') {
      // Check for Phase in the path
      if (item.path.includes('rally.sh/platform')) {
        return '/assets/icons/sh-rally-icon.png';
      } else if (item.path.includes('banshee.sh/banshee-platform')) {
        return '/assets/icons/sh-banshee-icon.png';
      } else if (item.path.includes('phantasy-bot/platform')) {
        return '/assets/icons/sh-okiya-icon.png';
      }
    }

    // Return null for default file icon (will use Iconify)
    return null;
  }
};

const FileTreeItem: React.FC<FileTreeItemProps> = React.memo(
  ({ item, onSelect, depth, onToggle, currentPath }) => {
    const { prefersReducedMotion } = useTheme();
    const isActive = currentPath === item.path;
    const isDirectory = item.type === 'directory';
    const hasChildren = isDirectory && item.children && item.children.length > 0;

    // Memoize icon data to prevent recalculation
    const iconData = useMemo(() => getCustomIcon(item), [item]);

    const iconSrc = iconData
      ? isDirectory
        ? item.expanded
          ? (iconData as FolderIcons).open
          : (iconData as FolderIcons).closed
        : (iconData as string)
      : null;

    // Check if this is a custom icon
    const isCustomIcon = iconSrc !== null;

    // Memoize click handlers
    const handleClick = useCallback(() => {
      if (isDirectory && hasChildren) {
        onToggle(item.path);
      } else {
        onSelect(item);
      }
    }, [isDirectory, hasChildren, onToggle, onSelect, item]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
          e.preventDefault();
        }
      },
      [handleClick]
    );

    // Use standard depth for the container, but only apply padding for nested items (depth > 1)
    return (
      <div style={{ paddingLeft: depth > 1 ? `${(depth - 1) * 12}px` : '0px' }}>
        <div
          className={`${styles.fileTreeItem} flex items-center py-0.5 ${isActive ? 'active' : ''}`}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role={isDirectory ? 'button' : 'link'}
          aria-expanded={isDirectory ? item.expanded : undefined}
          style={{
            cursor: 'pointer',
            fontFamily: 'var(--mono-font)',
            letterSpacing: '-0.5px',
            fontSize: '0.8rem',
          }}
        >
          {isDirectory && (
            <motion.span
              className="mr-1"
              style={{
                display: 'inline-block',
                width: '20px',
              }}
              animate={{
                rotate: item.expanded ? 90 : 0,
              }}
              transition={{
                duration: prefersReducedMotion ? 0.01 : 0.2,
                ease: 'easeOut',
              }}
            >
              {hasChildren ? '›' : ' '}
            </motion.span>
          )}

          <span className="mr-2 flex items-center">
            {isCustomIcon ? (
              <Image
                src={iconSrc}
                alt={isDirectory ? (item.expanded ? 'Folder Open' : 'Folder') : 'File'}
                width={16}
                height={16}
                className="inline rounded-sm border dark:border-white border-black"
                style={{
                  borderWidth: '1px',
                  overflow: 'hidden',
                }}
              />
            ) : isDirectory ? (
              <Icon
                icon={item.expanded ? 'mingcute:folder-open-line' : 'mingcute:folder-line'}
                className="w-4 h-4"
              />
            ) : (
              <Icon icon="mingcute:file-line" className="w-4 h-4" />
            )}
          </span>

          <span className="truncate">
            {item.type === 'file' ? item.name.replace(/ /g, '-').toLowerCase() : item.name}
          </span>
        </div>

        <AnimatePresence>
          {isDirectory && item.expanded && item.children && (
            <motion.div
              className="file-tree-children pl-2"
              initial={{
                height: 0,
                opacity: prefersReducedMotion ? 1 : 0,
              }}
              animate={{
                height: 'auto',
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: prefersReducedMotion ? 1 : 0,
              }}
              transition={{
                duration: prefersReducedMotion ? 0.01 : 0.2,
                ease: 'easeInOut',
              }}
              style={{ overflow: 'hidden' }}
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FileTreeItem.displayName = 'FileTreeItem';

const FileTree: React.FC<FileTreeProps> = ({
  items,
  onSelect,
  currentPath,
  defaultOpenAll = false,
}) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(() => {
    if (defaultOpenAll && currentPath) {
      // Only expand the path to the current file
      const expanded: Record<string, boolean> = {};

      // Find the path to the current file
      const findPathToFile = (
        items: FileItem[],
        targetPath: string,
        parentPaths: string[] = []
      ): string[] | null => {
        for (const item of items) {
          if (item.path === targetPath) {
            return parentPaths;
          }
          if (item.type === 'directory' && item.children) {
            const result = findPathToFile(item.children, targetPath, [...parentPaths, item.path]);
            if (result) return result;
          }
        }
        return null;
      };

      const pathsToExpand = findPathToFile(items, currentPath);
      if (pathsToExpand) {
        pathsToExpand.forEach((path) => {
          expanded[path] = true;
        });
      }

      return expanded;
    }
    return {};
  });
  const router = useRouter();

  const toggleItem = useCallback((path: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  }, []);

  // Optimized state mapping with better performance
  const itemsWithState = useMemo(() => {
    const addStateToItems = (items: FileItem[]): FileItem[] => {
      return items.map((item) => ({
        ...item,
        expanded: expandedItems[item.path] ?? false,
        children: item.children ? addStateToItems(item.children) : undefined,
      }));
    };

    return addStateToItems(items);
  }, [items, expandedItems]);

  return (
    <div className={styles.fileTree}>
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

export default React.memo(FileTree);
