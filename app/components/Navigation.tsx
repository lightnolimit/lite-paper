'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';

import { useCommandPalette } from '../providers/CommandPaletteProvider';
import { useTheme } from '../providers/ThemeProvider';

import SettingsMenu from './SettingsMenu';

/**
 * Props for the Navigation component
 *
 * @typedef {Object} NavigationProps
 * @property {string} [docsPath] - Current documentation path (optional)
 * @property {Function} [onToggleSidebar] - Function to toggle the sidebar (optional)
 * @property {boolean} [sidebarVisible] - Whether the sidebar is visible (optional)
 */
type NavigationProps = {
  docsPath?: string;
  onToggleSidebar?: () => void;
  sidebarVisible?: boolean;
};

/**
 * Navigation item type definition
 */
type NavItem = {
  /** Display text for the navigation link */
  label: string;
  /** URL the navigation item links to */
  href: string;
};

/**
 * Main navigation links
 */
const navItems: NavItem[] = [
  { label: 'Docs', href: '/docs/getting-started/introduction' },
  { label: 'API', href: '/docs/api-reference/overview' },
  { label: 'Guide', href: '/docs/user-guide/basic-usage' },
  { label: 'Deploy', href: '/docs/deployment/overview' },
  { label: 'AI/LLMs', href: '/llms' },
];

// Mobile menu animation variants (to be memoized in component)

// Memoized animation configurations
const bracketAnimationConfig = {
  duration: 0.4,
  times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
  ease: 'easeOut' as const,
};

const exitAnimationConfig = {
  duration: 0.3,
  times: [0, 0.2, 0.4, 0.6, 0.8, 1],
  ease: 'easeOut' as const,
};

/**
 * Main navigation component for the application
 *
 * Provides navigation links, theme switcher, background selector, and
 * responsive mobile menu with animations.
 *
 * @param {NavigationProps} props - Component props
 * @returns {React.ReactElement} Rendered Navigation component
 */
export default function Navigation({
  docsPath,
  onToggleSidebar,
  sidebarVisible,
}: NavigationProps): React.ReactElement {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, prefersReducedMotion } = useTheme();
  const { openCommandPalette } = useCommandPalette();
  const isDocsPage = docsPath !== undefined;

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Memoized bracket animation variants (simplified if motion is reduced)
  const leftBracketVariants = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 0, color: 'var(--primary-color)' },
        animate: { opacity: 1, color: 'var(--primary-color)', transition: { duration: 0.05 } },
        exit: { opacity: 0, color: 'var(--primary-color)', transition: { duration: 0.05 } },
      };
    }
    return {
      initial: {
        opacity: 0,
        x: -10,
        color: 'var(--primary-color)',
      },
      animate: {
        opacity: [0, 0.4, 0, 0.7, 0, 1, 0, 0, 0, 0.5, 1],
        x: [-10, -9, -7, -5, -4, -2, 0, 0, 0, 0, 0],
        scale: [1, 1.2, 0.8, 1.1, 0.9, 1.0, 0.95, 1.1, 0.9, 1.0, 1],
        color: [
          'var(--primary-color)',
          'transparent',
          isDarkMode ? '#FFF' : '#000',
          'transparent',
          'transparent',
          'var(--primary-color)',
          'transparent',
          'transparent',
          'transparent',
          isDarkMode ? '#FFF' : '#000',
          'var(--primary-color)',
        ],
        transition: {
          ...bracketAnimationConfig,
          scale: { ...bracketAnimationConfig, ease: 'easeInOut' },
          opacity: { ...bracketAnimationConfig, ease: 'linear' },
          color: { ...bracketAnimationConfig, ease: 'linear' },
        },
      },
      exit: {
        opacity: [1, 0, 0.7, 0, 0.4, 0],
        x: [-2, -4, -5, -7, -9, -10],
        color: 'var(--primary-color)',
        transition: {
          ...exitAnimationConfig,
          opacity: { ...exitAnimationConfig, ease: 'linear' },
        },
      },
    };
  }, [isDarkMode, prefersReducedMotion]);

  const rightBracketVariants = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 0, color: 'var(--primary-color)' },
        animate: { opacity: 1, color: 'var(--primary-color)', transition: { duration: 0.05 } },
        exit: { opacity: 0, color: 'var(--primary-color)', transition: { duration: 0.05 } },
      };
    }
    return {
      initial: {
        opacity: 0,
        x: 10,
        color: 'var(--primary-color)',
      },
      animate: {
        opacity: [0, 0.4, 0, 0.7, 0, 1, 0, 0, 0, 0.5, 1],
        x: [10, 9, 7, 5, 4, 2, 0, 0, 0, 0, 0],
        scale: [1, 1.2, 0.8, 1.1, 0.9, 1.0, 0.95, 1.1, 0.9, 1.0, 1],
        color: [
          'var(--primary-color)',
          'transparent',
          isDarkMode ? '#FFF' : '#000',
          'transparent',
          'transparent',
          'var(--primary-color)',
          'transparent',
          'transparent',
          'transparent',
          isDarkMode ? '#FFF' : '#000',
          'var(--primary-color)',
        ],
        transition: {
          ...bracketAnimationConfig,
          scale: { ...bracketAnimationConfig, ease: 'easeInOut' },
          opacity: { ...bracketAnimationConfig, ease: 'linear' },
          color: { ...bracketAnimationConfig, ease: 'linear' },
        },
      },
      exit: {
        opacity: [1, 0, 0.7, 0, 0.4, 0],
        x: [2, 4, 5, 7, 9, 10],
        color: 'var(--primary-color)',
        transition: {
          ...exitAnimationConfig,
          opacity: { ...exitAnimationConfig, ease: 'linear' },
        },
      },
    };
  }, [isDarkMode, prefersReducedMotion]);

  // Memoized mobile menu variants (simplified if motion is reduced)
  const mobileMenuVariants = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      };
    }
    return {
      hidden: { opacity: 0, height: 0 },
      visible: { opacity: 1, height: 'auto' },
      exit: { opacity: 0, height: 0 },
    };
  }, [prefersReducedMotion]);

  // Memoized click handlers
  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen(!mobileMenuOpen);
  }, [mobileMenuOpen]);

  const handleMobileNavClick = useCallback(() => {
    setMobileMenuOpen(false);
    setHoveredItem(null);
  }, []);

  const handleSidebarToggle = useCallback(() => {
    if (onToggleSidebar) {
      onToggleSidebar();
      setMobileMenuOpen(false);
    }
  }, [onToggleSidebar]);

  /**
   * Renders a navigation link with hover effects
   * @param {NavItem} item - The navigation item to render
   * @param {boolean} isMobile - Whether this is in the mobile menu
   * @returns {React.ReactElement} A navigation link
   */
  const renderNavLink = useCallback(
    (item: NavItem, isMobile = false): React.ReactElement => (
      <Link
        key={item.label}
        href={item.href}
        className={`transition-colors nav-link ${isMobile ? 'py-2 px-4' : ''} relative`}
        style={{
          color: 'var(--text-color)',
          fontFamily: 'var(--mono-font)',
          ...(isMobile ? {} : { letterSpacing: '-0.5px', fontSize: '0.9rem' }),
        }}
        onClick={isMobile ? handleMobileNavClick : undefined}
        onMouseEnter={() => setHoveredItem(item.label)}
        onMouseLeave={() => setHoveredItem(null)}
        tabIndex={0}
      >
        <div className="flex items-center relative">
          <AnimatePresence>
            {hoveredItem === item.label ? (
              <motion.span
                className="bracket-left"
                style={{ left: '-1.5rem' }}
                key="bracket-left"
                variants={leftBracketVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                「
              </motion.span>
            ) : null}
          </AnimatePresence>

          <span className="px-2">{item.label}</span>

          <AnimatePresence>
            {hoveredItem === item.label ? (
              <motion.span
                className="bracket-right"
                style={{ right: '-1.5rem' }}
                key="bracket-right"
                variants={rightBracketVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                」
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>
      </Link>
    ),
    [hoveredItem, leftBracketVariants, rightBracketVariants, handleMobileNavClick]
  );

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 header-bar border-b"
      style={{ backgroundColor: 'var(--card-color)' }}
    >
      <div className="max-w-full mx-auto px-5 md:px-8 flex items-center justify-between h-12">
        {/* Logo and site title */}
        <Link
          href="/"
          className="flex items-center gap-2"
          style={{ color: 'var(--text-color)' }}
          tabIndex={0}
        >
          <Image
            src={
              isDarkMode
                ? '/assets/logo/phantasy-icon-pink.png'
                : '/assets/logo/phantasy-icon-black.png'
            }
            alt="Phantasy Logo"
            width={32}
            height={32}
            className="h-8 w-auto logo-image"
          />
          <span
            className="font-title text-xl tracking-tighter"
            style={{ fontFamily: 'var(--title-font)' }}
          >
            Lite Paper
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {renderNavLink(item)}
              </div>
            ))}

            {/* Separator between nav links and social icons */}
            <div
              className="h-6 w-px bg-gray-300 dark:bg-gray-700 ml-2 mr-2"
              aria-hidden="true"
            ></div>
          </nav>

          {/* Command Palette indicator */}
          <button
            onClick={openCommandPalette}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{
              color: 'var(--muted-color)',
              fontFamily: 'var(--mono-font)',
              fontSize: '0.875rem',
            }}
            title="Open command palette"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <kbd
              className="hidden lg:inline-block px-1.5 py-0.5 text-xs border rounded"
              style={{ borderColor: 'var(--border-color)' }}
            >
              {typeof navigator !== 'undefined' && navigator.platform?.toLowerCase().includes('mac')
                ? '⌘'
                : 'Ctrl'}
              K
            </kbd>
          </button>

          {/* Desktop Settings Menu */}
          <div className="hidden md:flex items-center gap-2">
            {/* Settings menu with theme and background options */}
            <SettingsMenu className="hover:text-primary-color" />
          </div>

          {/* Mobile menu toggle and settings */}
          <div className="flex md:hidden items-center gap-3">
            {/* Settings menu for mobile */}
            <SettingsMenu className="hover:text-primary-color" isCompact={true} />

            {/* Mobile menu button */}
            <button
              onClick={handleMobileMenuToggle}
              style={{ color: 'var(--text-color)' }}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
              tabIndex={0}
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            transition={{ duration: 0.2 }}
            className="md:hidden"
          >
            <nav
              className="flex flex-col gap-1 p-3 border-t shadow-lg"
              style={{
                backgroundColor: 'var(--background-color)',
                borderColor: 'var(--border-color)',
              }}
            >
              {/* Navigation links */}
              {navItems.map((item) => (
                <div key={item.label}>{renderNavLink(item, true)}</div>
              ))}

              {/* File tree toggle for mobile docs pages */}
              {isDocsPage && onToggleSidebar && (
                <div
                  className="pt-4 pb-2 px-4 border-t mt-2 mb-0"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <button
                    onClick={handleSidebarToggle}
                    className="flex items-center gap-2 py-0.5 w-full hover:text-primary-color transition-colors"
                    style={{ color: 'var(--text-color)' }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                      />
                    </svg>
                    <span style={{ paddingTop: '0px' }}>
                      {sidebarVisible ? 'Hide Documentation Tree' : 'Show Documentation Tree'}
                    </span>
                  </button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
