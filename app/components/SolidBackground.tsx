'use client';

import React from 'react';

/**
 * SolidBackground component
 * 
 * Provides a simple solid background with no animations,
 * using the theme's default background color.
 * 
 * @returns {React.ReactElement} Solid background component
 */
export default function SolidBackground(): React.ReactElement {
  return (
    <div 
      className="fixed inset-0 w-full h-full -z-10"
      style={{ backgroundColor: 'var(--background-color)' }}
      aria-hidden="true"
    />
  );
} 