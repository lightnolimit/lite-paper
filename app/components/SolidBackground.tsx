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
const SolidBackground = React.memo((): React.ReactElement => {
  return (
    <div 
      className="fixed inset-0 w-full h-full -z-10"
      style={{ backgroundColor: 'var(--background-color)' }}
      aria-hidden="true"
    />
  );
});

SolidBackground.displayName = 'SolidBackground';

export default SolidBackground; 