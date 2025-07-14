'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { useTheme } from '../providers/ThemeProvider';

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
const BackgroundSelector = React.memo(({ className = '' }: BackgroundSelectorProps) => {
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('wave');
  const { prefersReducedMotion } = useTheme();

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
    const isValidType =
      storedType === 'wave' ||
      storedType === 'stars' ||
      storedType === 'dither' ||
      storedType === 'solid';

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
  const handleBackgroundChange = useCallback((type: BackgroundType) => {
    setBackgroundType(type);
    localStorage.setItem('backgroundType', type);

    // Force a page reload to apply the change
    window.location.reload();
  }, []);

  // Memoized animation variants (disabled if motion is reduced)
  const buttonAnimations = useMemo(() => {
    if (prefersReducedMotion) {
      return {};
    }
    return {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
    };
  }, [prefersReducedMotion]);

  // Memoized base styles for active and inactive states
  const baseButtonStyles = useMemo(
    () => ({
      border: '1px solid var(--border-color)',
    }),
    []
  );

  const activeButtonStyles = useMemo(
    () => ({
      ...baseButtonStyles,
      color: 'var(--background-color)',
      backgroundColor: 'var(--primary-color)',
    }),
    [baseButtonStyles]
  );

  const inactiveButtonStyles = useMemo(
    () => ({
      ...baseButtonStyles,
      color: 'var(--text-color)',
      backgroundColor: '',
    }),
    [baseButtonStyles]
  );

  // Optimized button style generator
  const getButtonStyles = useCallback(
    (type: BackgroundType) => {
      const isActive = backgroundType === type;
      return {
        className: `px-2 py-1 rounded text-sm ${isActive ? 'active-bg-button' : 'bg-card-color hover:bg-gray-200 dark:hover:bg-gray-700'}`,
        style: isActive ? activeButtonStyles : inactiveButtonStyles,
        ...buttonAnimations,
        'aria-label': `Switch to ${type} background`,
        title: `Switch to ${type} background`,
        'aria-pressed': isActive,
      };
    },
    [backgroundType, activeButtonStyles, inactiveButtonStyles, buttonAnimations]
  );

  // Memoized button configurations
  const buttonConfigs = useMemo(
    () => [
      { type: 'wave' as BackgroundType, label: 'Wave' },
      { type: 'stars' as BackgroundType, label: 'Stars' },
      { type: 'dither' as BackgroundType, label: 'Dither' },
      { type: 'solid' as BackgroundType, label: 'Solid' },
    ],
    []
  );

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {buttonConfigs.map(({ type, label }) => {
        const buttonProps = getButtonStyles(type);

        return prefersReducedMotion ? (
          <button
            key={type}
            onClick={() => handleBackgroundChange(type)}
            className={buttonProps.className}
            style={buttonProps.style}
            aria-label={buttonProps['aria-label']}
            title={buttonProps.title}
            aria-pressed={buttonProps['aria-pressed']}
          >
            {label}
          </button>
        ) : (
          <motion.button key={type} onClick={() => handleBackgroundChange(type)} {...buttonProps}>
            {label}
          </motion.button>
        );
      })}
    </div>
  );
});

BackgroundSelector.displayName = 'BackgroundSelector';

export default BackgroundSelector;
