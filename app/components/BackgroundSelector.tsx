'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Type for valid background types
type BackgroundType = 'wave' | 'stars' | 'dither';

export default function BackgroundSelector({ className = "" }) {
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('wave');
  
  // Initialize from localStorage or environment variable
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Get stored preference or use default
    const storedType = localStorage.getItem('backgroundType') as BackgroundType | null;
    const isValidType = storedType === 'wave' || storedType === 'stars' || storedType === 'dither';
    
    // Use stored preference if valid, or fallback to env/default
    const envType = (process.env.NEXT_PUBLIC_BACKGROUND_TYPE || 'wave') as BackgroundType;
    const finalType = isValidType ? storedType : envType;
    
    setBackgroundType(finalType);
    
    if (!isValidType && storedType !== null) {
      localStorage.setItem('backgroundType', envType);
    }
  }, []);
  
  // Update background type
  const handleBackgroundChange = (type: BackgroundType) => {
    setBackgroundType(type);
    localStorage.setItem('backgroundType', type);
    
    // Force a page reload to apply the change
    window.location.reload();
  };
  
  // Common button styling
  const getButtonStyles = (type: BackgroundType) => ({
    className: `px-2 py-1 rounded text-sm ${backgroundType === type ? 'bg-primary-color text-background-color' : 'bg-card-color'}`,
    style: { 
      border: '1px solid var(--border-color)',
      color: backgroundType === type ? 'var(--background-color)' : 'var(--text-color)'
    },
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    'aria-label': `Switch to ${type} background`,
    title: `Switch to ${type} background`
  });
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
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
    </div>
  );
} 