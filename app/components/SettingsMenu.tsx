'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSwitcher from './ThemeSwitcher';
import BackgroundSelector from './BackgroundSelector';
import Image from 'next/image';

/**
 * Props for the SettingsMenu component
 * @typedef {Object} SettingsMenuProps
 * @property {string} [className] - Optional CSS class name for styling
 * @property {boolean} [isCompact] - Whether to display in compact mode for mobile
 */
type SettingsMenuProps = {
  className?: string;
  isCompact?: boolean;
};

/**
 * SettingsMenu component that provides access to theme and background settings
 * 
 * Displays a settings icon that reveals a dropdown with theme switcher and 
 * background selector controls when clicked.
 * 
 * @param {SettingsMenuProps} props - Component props
 * @returns {React.ReactElement} Rendered SettingsMenu component
 */
const SettingsMenu = React.memo(({ 
  className = "", 
  isCompact = false 
}: SettingsMenuProps): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Memoized animation variants
  const menuVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: -10,
      scale: 0.95,
      transformOrigin: isCompact ? 'center top' : 'top right'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    },
    exit: { 
      opacity: 0, 
      y: -10,
      scale: 0.95
    }
  }), [isCompact]);

  // Memoized button animations
  const buttonAnimations = useMemo(() => ({
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.95 }
  }), []);

  // Memoized transition config
  const transitionConfig = useMemo(() => ({ duration: 0.2 }), []);
  
  // Optimized toggle function
  const toggleMenu = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  // Optimized event handlers
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);
  
  // Close menu when clicking outside
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);
  
  // Close menu when pressing Escape
  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleEscape]);

  // Memoized style objects
  const dropdownStyle = useMemo(() => ({
    backgroundColor: 'var(--card-color)',
    borderColor: 'var(--border-color)',
    width: 'max-content',
    minWidth: '16rem',
    maxWidth: 'calc(100vw - 1rem)'
  }), []);

  const buttonStyle = useMemo(() => ({
    color: 'var(--text-color)'
  }), []);

  const headingStyle = useMemo(() => ({
    color: 'var(--muted-color)',
    fontFamily: 'var(--mono-font)',
    marginTop: '0'
  }), []);

  const textStyle = useMemo(() => ({
    color: 'var(--text-color)'
  }), []);
  
  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Settings toggle button */}
      <motion.button
        onClick={toggleMenu}
        className={`p-2 rounded-full flex items-center justify-center ${isOpen ? 'bg-primary-color text-background-color' : ''}`}
        {...buttonAnimations}
        aria-label="Settings menu"
        title="Settings"
        aria-expanded={isOpen}
        aria-controls="settings-dropdown"
        style={buttonStyle}
      >
        <Image 
          src="/assets/icons/pixel-cog-solid.svg"
          alt="Settings"
          width={20}
          height={20}
          style={{ display: 'block' }}
          aria-hidden="true"
        />
      </motion.button>
      
      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="settings-dropdown"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            transition={transitionConfig}
            className={`absolute z-50 mt-2 p-3 rounded-lg shadow-lg border doc-card ${
              isCompact 
                ? 'right-0 top-full' 
                : 'right-0 top-full'
            }`}
            style={dropdownStyle}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="settings-menu-button"
          >
            <div className="flex flex-col items-start justify-start space-y-2">
              {/* Theme section */}
              <div className="w-full">
                <h3 className="text-sm font-medium mb-1" style={headingStyle}>
                  APPEARANCE
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={textStyle}>Theme</span>
                  <ThemeSwitcher />
                </div>
              </div>
              
              {/* Background section */}
              <div>
                <h3 className="text-sm font-medium mb-1" style={headingStyle}>
                  BACKGROUND
                </h3>
                <BackgroundSelector className="w-full justify-between" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

SettingsMenu.displayName = 'SettingsMenu';

export default SettingsMenu; 