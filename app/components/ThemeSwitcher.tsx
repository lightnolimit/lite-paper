'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../providers/ThemeProvider';

/**
 * Props for the ThemeSwitcher component
 * @typedef {Object} ThemeSwitcherProps
 * @property {string} [className] - Optional CSS class name for styling
 */
type ThemeSwitcherProps = {
  className?: string;
};

/**
 * ThemeSwitcher component that toggles between light and dark mode
 * 
 * Displays a sun icon in dark mode and a moon icon in light mode.
 * Uses framer-motion for hover and tap animations.
 * 
 * @param {ThemeSwitcherProps} props - Component props
 * @returns {React.ReactElement} Rendered ThemeSwitcher component
 */
export default function ThemeSwitcher({ className = "" }: ThemeSwitcherProps): React.ReactElement {
  const { isDarkMode, toggleTheme } = useTheme();

  // Animation settings for button
  const buttonAnimations = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.95 }
  };

  // ARIA labels based on current mode
  const ariaAttrs = {
    'aria-label': isDarkMode ? "Switch to light mode" : "Switch to dark mode",
    'title': isDarkMode ? "Switch to light mode" : "Switch to dark mode"
  };

  /**
   * Renders the appropriate icon based on the current theme
   * @returns {React.ReactElement} The sun or moon icon SVG
   */
  const renderThemeIcon = (): React.ReactElement => {
    if (isDarkMode) {
      // Pixel Sun (light mode icon)
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          style={{ display: 'block' }}
          aria-hidden="true"
        >
          <path fill="currentColor" d="M21 11v-1h1V9h1V7h-3V6h-2V4h-1V1h-2v1h-1v1h-1v1h-2V3h-1V2H9V1H7v3H6v2H4v1H1v2h1v1h1v1h1v2H3v1H2v1H1v2h3v1h2v2h1v3h2v-1h1v-1h1v-1h2v1h1v1h1v1h2v-3h1v-2h2v-1h3v-2h-1v-1h-1v-1h-1v-2zm-2 2v1h1v1h1v1h-3v1h-1v1h-1v3h-1v-1h-1v-1h-1v-1h-2v1h-1v1H9v1H8v-3H7v-1H6v-1H3v-1h1v-1h1v-1h1v-2H5v-1H4V9H3V8h3V7h1V6h1V3h1v1h1v1h1v1h2V5h1V4h1V3h1v2h1v2h1v1h3v1h-1v1h-1v1h-1v2z" strokeWidth="0.5" stroke="#000" />
          <path fill="currentColor" d="M16 10V9h-1V8h-1V7h-4v1H9v1H8v1H7v4h1v1h1v1h1v1h4v-1h1v-1h1v-1h1v-4zm-1 4h-1v1h-4v-1H9v-4h1V9h4v1h1z" strokeWidth="0.5" stroke="#000" />
        </svg>
      );
    } else {
      // Pixel Moon (dark mode icon)
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          style={{ display: 'block' }}
          aria-hidden="true"
        >
          <path fill="currentColor" d="M21 17v1h-2v1h-4v-1h-2v-1h-2v-1h-1v-2H9v-2H8V8h1V6h1V4h1V3h2V2h2V1h-5v1H8v1H6v1H5v1H4v2H3v2H2v6h1v2h1v2h1v1h1v1h2v1h2v1h6v-1h2v-1h2v-1h1v-1h1v-2zM8 20v-1H6v-2H5v-2H4V9h1V7h1V5h2v1H7v2H6v4h1v2h1v2h1v1h1v1h1v1h2v1h2v1h-5v-1z" strokeWidth="0.5" stroke="#000" />
        </svg>
      );
    }
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={`p-2 rounded-full ${className}`}
      style={{ color: 'var(--text-color)' }}
      {...buttonAnimations}
      {...ariaAttrs}
      tabIndex={0}
    >
      {renderThemeIcon()}
    </motion.button>
  );
} 