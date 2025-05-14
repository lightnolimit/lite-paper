'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Type for valid background types
 */
type BackgroundType = 'wave' | 'stars' | 'dither' | 'solid';

/**
 * Props for the BackgroundSelector component
 * @typedef {Object} BackgroundSelectorProps
 * @property {string} [className] - Optional CSS class name for styling
 */
type BackgroundSelectorProps = {
  className?: string;
};

/**
 * BackgroundSelector component that allows users to switch between different background types
 * 
 * Displays buttons for each background type and stores the selection in localStorage.
 * 
 * @param {BackgroundSelectorProps} props - Component props
 * @returns {React.ReactElement} Rendered BackgroundSelector component
 */
export default function BackgroundSelector({ className = "" }: BackgroundSelectorProps) {
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('wave');
  
  /**
   * Initialize background type from localStorage or environment variable
   * 
   * Loads the background preference in the following order:
   * 1. From localStorage if valid
   * 2. From environment variable NEXT_PUBLIC_BACKGROUND_TYPE
   * 3. Defaults to 'wave' if neither is available
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Get stored preference or use default
    const storedType = localStorage.getItem('backgroundType') as BackgroundType | null;
    const isValidType = storedType === 'wave' || storedType === 'stars' || storedType === 'dither' || storedType === 'solid';
    
    // Use stored preference if valid, or fallback to env/default
    const envType = (process.env.NEXT_PUBLIC_BACKGROUND_TYPE || 'wave') as BackgroundType;
    const finalType = isValidType ? storedType : envType;
    
    setBackgroundType(finalType);
    
    if (!isValidType && storedType !== null) {
      localStorage.setItem('backgroundType', envType);
    }
  }, []);
  
  /**
   * Update the background type based on user selection
   * 
   * Saves selection to localStorage and refreshes the page to apply changes.
   * 
   * @param {BackgroundType} type - The selected background type
   */
  const handleBackgroundChange = (type: BackgroundType) => {
    setBackgroundType(type);
    localStorage.setItem('backgroundType', type);
    
    // Force a page reload to apply the change
    window.location.reload();
  };
  
  // Common button styling
  const getButtonStyles = (type: BackgroundType) => ({
    className: `px-2 py-1 rounded text-sm ${backgroundType === type ? 'bg-primary-color text-background-color' : 'bg-card-color hover:bg-gray-200 dark:hover:bg-gray-700'}`,
    style: { 
      border: '1px solid var(--border-color)',
      color: backgroundType === type ? 'var(--background-color)' : 'var(--text-color)'
    },
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    'aria-label': `Switch to ${type} background`,
    title: `Switch to ${type} background`,
    'aria-pressed': backgroundType === type
  });
  
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <motion.button
        onClick={() => handleBackgroundChange('wave')}
        {...getButtonStyles('wave')}
      >
        Wave
      </motion.button>
      
      <motion.button
        onClick={() => handleBackgroundChange('stars')}
        {...getButtonStyles('stars')}
      >
        Stars
      </motion.button>
      
      <motion.button
        onClick={() => handleBackgroundChange('dither')}
        {...getButtonStyles('dither')}
      >
        Dither
      </motion.button>
      
      <motion.button
        onClick={() => handleBackgroundChange('solid')}
        {...getButtonStyles('solid')}
      >
        Solid
      </motion.button>
    </div>
  );
} 