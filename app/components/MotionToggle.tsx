'use client';

import { motion } from 'framer-motion';
import React, { useMemo, useCallback } from 'react';

import { useTheme } from '../providers/ThemeProvider';

/**
 * Props for the MotionToggle component
 * @typedef {Object} MotionToggleProps
 * @property {string} [className] - Optional CSS class name for styling
 */
type MotionToggleProps = {
  className?: string;
};

/**
 * MotionToggle component that toggles between full motion and reduced motion
 *
 * Displays a motion icon when animations are enabled and a static icon when disabled.
 * Uses framer-motion for hover and tap animations (unless motion is reduced).
 *
 * @param {MotionToggleProps} props - Component props
 * @returns {React.ReactElement} Rendered MotionToggle component
 */
const MotionToggle = React.memo(({ className = '' }: MotionToggleProps): React.ReactElement => {
  const { prefersReducedMotion, toggleReducedMotion } = useTheme();

  // Memoized animation settings for button (disabled if motion is reduced)
  const buttonAnimations = useMemo(() => {
    if (prefersReducedMotion) {
      return {};
    }
    return {
      whileHover: { scale: 1.1 },
      whileTap: { scale: 0.95 },
    };
  }, [prefersReducedMotion]);

  // Memoized ARIA labels based on current state
  const ariaAttrs = useMemo(
    () => ({
      'aria-label': prefersReducedMotion ? 'Enable animations' : 'Reduce animations',
      title: prefersReducedMotion ? 'Enable animations' : 'Reduce animations',
    }),
    [prefersReducedMotion]
  );

  // Memoized style object
  const buttonStyle = useMemo(
    () => ({
      color: 'var(--text-color)',
    }),
    []
  );

  // Optimized motion toggle handler
  const handleToggleMotion = useCallback(() => {
    toggleReducedMotion();
  }, [toggleReducedMotion]);

  /**
   * Renders the appropriate icon based on the current motion preference
   * @returns {React.ReactElement} The motion or static icon SVG
   */
  const renderMotionIcon = useCallback((): React.ReactElement => {
    if (prefersReducedMotion) {
      // Static icon (reduced motion)
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          style={{ display: 'block' }}
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
          />
        </svg>
      );
    } else {
      // Motion icon (animations enabled)
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          style={{ display: 'block' }}
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
          />
        </svg>
      );
    }
  }, [prefersReducedMotion]);

  // Memoized text display
  const displayText = useMemo(() => {
    return prefersReducedMotion ? 'Static' : 'Motion';
  }, [prefersReducedMotion]);

  const ButtonComponent = prefersReducedMotion ? 'button' : motion.button;
  const buttonProps = prefersReducedMotion ? {} : buttonAnimations;

  return (
    <ButtonComponent
      onClick={handleToggleMotion}
      className={`p-2 rounded-full flex items-center gap-2 ${className}`}
      style={buttonStyle}
      {...buttonProps}
      {...ariaAttrs}
      tabIndex={0}
    >
      {renderMotionIcon()}
      <span className="text-sm">{displayText}</span>
    </ButtonComponent>
  );
});

MotionToggle.displayName = 'MotionToggle';

export default MotionToggle;
