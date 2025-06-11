'use client';

import React from 'react';
import Link from 'next/link';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
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
  { label: 'Deploy', href: '/docs/deployment/overview' }
];

/**
 * Social media links with icons
 */
const socialLinks = [
  { 
    name: 'Discord', 
    href: 'https://discord.com', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
        <path fill="currentColor" d="M22 11V8h-1V6h-1V5h-2V4h-3v1H9V4H6v1H4v1H3v2H2v3H1v7h2v1h2v1h2v-2H6v-1h2v1h1v1h6v-1h1v-1h2v1h-1v2h2v-1h2v-1h2v-7ZM9 15H7v-1H6v-2h1v-1h2v1h1v2H9Zm9-1h-1v1h-2v-1h-1v-2h1v-1h2v1h1Z" strokeWidth="0.5" stroke="#000"/>
      </svg>
    )
  },
  { 
    name: 'X', 
    href: 'https://x.com', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
        <path fill="currentColor" d="M15.5 10V9h1V8h1V7h1V6h1V5h1V4h1V3h1V2h-3v1h-1v1h-1v1h-1v1h-1v1h-2V7h-1V6h-1V4h-1V3h-1V2h-7v1h1v1h1v1h1v2h1v1h1v2h1v1h1v2h1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h3v-1h1v-1h1v-1h1v-1h1v-1h2v1h1v1h1v2h1v1h1v1h7v-1h-1v-1h-1v-1h-1v-2h-1v-1h-1v-2h-1v-1h-1v-2h-1v-1zm0 4v1h1v2h1v1h1v2h-3v-2h-1v-1h-1v-1h-1v-2h-1v-1h-1v-1h-1v-2h-1V9h-1V7h-1V6h-1V4h3v1h1v2h1v1h1v2h1v1h1v1h1v2z" strokeWidth="0.5" stroke="#000"/>
      </svg>
    )
  },
  { 
    name: 'Twitch', 
    href: 'https://twitch.tv', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
        <path fill="currentColor" d="M6 1v1H5v1H4v1H3v1H2v14h5v4h1v-1h1v-1h1v-1h1v-1h4v-1h1v-1h1v-1h1v-1h1V1Zm14 11h-1v1h-1v1h-5v1h-1v1h-1v1h-1v-3H7V3h13Z" strokeWidth="0.5" stroke="#000"/>
        <path fill="currentColor" d="M16 5h2v5h-2zm-5 0h2v5h-2z" strokeWidth="0.5" stroke="#000"/>
      </svg>
    )
  },
  { 
    name: 'YouTube', 
    href: 'https://youtube.com', 
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
        <path fill="currentColor" d="M22 7V5h-2V4H4v1H2v2H1v10h1v2h2v1h16v-1h2v-2h1V7zm-10 8h-2V9h2v1h2v1h2v2h-2v1h-2z" strokeWidth="0.5" stroke="#000"/>
      </svg>
    )
  }
];

// Mobile menu animation variants (to be memoized in component)

// Memoized animation configurations
const bracketAnimationConfig = {
  duration: 0.4,
  times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
  ease: "easeOut" as const
};

const exitAnimationConfig = {
  duration: 0.3,
  times: [0, 0.2, 0.4, 0.6, 0.8, 1],
  ease: "easeOut" as const
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
  sidebarVisible 
}: NavigationProps): React.ReactElement {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, prefersReducedMotion } = useTheme();
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
        exit: { opacity: 0, color: 'var(--primary-color)', transition: { duration: 0.05 } }
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
          'var(--primary-color)'
        ],
        transition: {
          ...bracketAnimationConfig,
          scale: { ...bracketAnimationConfig, ease: "easeInOut" },
          opacity: { ...bracketAnimationConfig, ease: "linear" },
          color: { ...bracketAnimationConfig, ease: "linear" },
        }
      },
      exit: { 
        opacity: [1, 0, 0.7, 0, 0.4, 0],
        x: [-2, -4, -5, -7, -9, -10],
        color: 'var(--primary-color)',
        transition: { 
          ...exitAnimationConfig,
          opacity: { ...exitAnimationConfig, ease: "linear" },
        } 
      }
    };
  }, [isDarkMode, prefersReducedMotion]);

  const rightBracketVariants = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 0, color: 'var(--primary-color)' },
        animate: { opacity: 1, color: 'var(--primary-color)', transition: { duration: 0.05 } },
        exit: { opacity: 0, color: 'var(--primary-color)', transition: { duration: 0.05 } }
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
          'var(--primary-color)'
        ],
        transition: {
          ...bracketAnimationConfig,
          scale: { ...bracketAnimationConfig, ease: "easeInOut" },
          opacity: { ...bracketAnimationConfig, ease: "linear" },
          color: { ...bracketAnimationConfig, ease: "linear" },
        }
      },
      exit: { 
        opacity: [1, 0, 0.7, 0, 0.4, 0],
        x: [2, 4, 5, 7, 9, 10],
        color: 'var(--primary-color)',
        transition: { 
          ...exitAnimationConfig,
          opacity: { ...exitAnimationConfig, ease: "linear" },
        } 
      }
    };
  }, [isDarkMode, prefersReducedMotion]);

  // Memoized mobile menu variants (simplified if motion is reduced)
  const mobileMenuVariants = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
      };
    }
    return {
      hidden: { opacity: 0, height: 0 },
      visible: { opacity: 1, height: 'auto' },
      exit: { opacity: 0, height: 0 }
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
  const renderNavLink = useCallback((item: NavItem, isMobile = false): React.ReactElement => (
    <Link 
      key={item.label}
      href={item.href}
      className={`transition-colors nav-link ${isMobile ? 'py-2 px-4' : ''} relative`}
      style={{ 
        color: 'var(--text-color)',
        fontFamily: 'var(--mono-font)',
        ...(isMobile ? {} : { letterSpacing: '-0.5px', fontSize: '0.9rem' })
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
              style={{ left: "-1.5rem" }}
              key="bracket-left"
              variants={leftBracketVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >「</motion.span>
          ) : null}
        </AnimatePresence>
        
        <span className="px-2">{item.label}</span>
        
        <AnimatePresence>
          {hoveredItem === item.label ? (
            <motion.span 
              className="bracket-right"
              style={{ right: "-1.5rem" }}
              key="bracket-right"
              variants={rightBracketVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >」</motion.span>
          ) : null}
        </AnimatePresence>
      </div>
    </Link>
  ), [hoveredItem, leftBracketVariants, rightBracketVariants, handleMobileNavClick]);
  
  return (
          <header className="fixed top-0 left-0 right-0 z-40 header-bar border-b" style={{ backgroundColor: 'var(--card-color)' }}>
        <div className="max-w-full mx-auto px-5 md:px-8 flex items-center justify-between h-14">
        {/* Logo and site title */}
        <Link 
          href="/"
          className="flex items-center gap-2"
          style={{ color: 'var(--text-color)' }}
          tabIndex={0}
        >
          <Image 
            src={isDarkMode ? "/assets/logo/phantasy-icon-pink.png" : "/assets/logo/phantasy-icon-black.png"}
            alt="Phantasy Logo"
            width={32}
            height={32}
            className="h-8 w-auto logo-image"
          />
          <span className="font-mono text-xl tracking-tighter uppercase" style={{ fontFamily: 'var(--mono-font)' }}>LITE PAPER</span>
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
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 ml-2 mr-2" aria-hidden="true"></div>
          </nav>
          
          {/* Desktop Social Media Icons */}
          <div className="hidden md:flex items-center gap-2">
            {socialLinks.map(link => (
              <a 
                key={link.name}
                href={link.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={link.name} 
                className="hover:opacity-80 transition-opacity"
              >
                {link.icon}
              </a>
            ))}
            
            {/* Separator between social icons and settings */}
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 ml-2 mr-2" aria-hidden="true"></div>
            
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
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
            <nav className="flex flex-col gap-1 p-3 border-t shadow-lg" style={{ backgroundColor: 'var(--background-color)', borderColor: 'var(--border-color)' }}>
              {/* Navigation links */}
              {navItems.map((item) => (
                <div key={item.label}>
                  {renderNavLink(item, true)}
                </div>
              ))}
              
              {/* File tree toggle for mobile docs pages */}
              {isDocsPage && onToggleSidebar && (
                <div className="pt-4 pb-2 px-4 border-t mt-2 mb-0" style={{ borderColor: 'var(--border-color)' }}>
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
                    <span style={{ paddingTop: '0px' }}>{sidebarVisible ? "Hide Documentation Tree" : "Show Documentation Tree"}</span>
                  </button>
                </div>
              )}
              
              {/* Social links for mobile */}
              <div className="pt-4 px-4 mt-1 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center mb-1">
                  <span className="text-sm mr-3" style={{ color: 'var(--muted-color)', fontFamily: 'var(--mono-font)' }}>
                    Follow Us:
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {socialLinks.map(link => (
                      <a 
                        key={link.name}
                        href={link.href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label={link.name} 
                        className="hover:opacity-80 transition-opacity flex items-center gap-2"
                        style={{ color: 'var(--text-color)' }}
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 