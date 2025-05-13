'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BackgroundSelector({ className = "" }) {
  const [backgroundType, setBackgroundType] = useState<string>('wave');
  
  // Initialize from the current environment variable
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get from localStorage first for persistence
      const storedType = localStorage.getItem('backgroundType');
      if (storedType === 'wave' || storedType === 'stars') {
        setBackgroundType(storedType);
      } else {
        // Use default from Next.js config/env
        const envType = process.env.NEXT_PUBLIC_BACKGROUND_TYPE || 'wave';
        setBackgroundType(envType);
        localStorage.setItem('backgroundType', envType);
      }
    }
  }, []);
  
  // Update when changed
  const handleBackgroundChange = (type: string) => {
    if (type === 'wave' || type === 'stars') {
      setBackgroundType(type);
      localStorage.setItem('backgroundType', type);
      
      // Force a page reload to apply the change
      window.location.reload();
    }
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.button
        onClick={() => handleBackgroundChange('wave')}
        className={`px-2 py-1 rounded text-sm ${backgroundType === 'wave' ? 'bg-primary-color text-background-color' : 'bg-card-color'}`}
        style={{ 
          border: '1px solid var(--border-color)',
          color: backgroundType === 'wave' ? 'var(--background-color)' : 'var(--text-color)'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Switch to wave background"
        title="Switch to wave background"
      >
        Wave
      </motion.button>
      
      <motion.button
        onClick={() => handleBackgroundChange('stars')}
        className={`px-2 py-1 rounded text-sm ${backgroundType === 'stars' ? 'bg-primary-color text-background-color' : 'bg-card-color'}`}
        style={{ 
          border: '1px solid var(--border-color)',
          color: backgroundType === 'stars' ? 'var(--background-color)' : 'var(--text-color)'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Switch to stars background"
        title="Switch to stars background"
      >
        Stars
      </motion.button>
    </div>
  );
} 