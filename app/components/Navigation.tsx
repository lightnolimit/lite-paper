'use client';

import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSwitcher from './ThemeSwitcher';
import BackgroundSelector from './BackgroundSelector';
import Image from 'next/image';
import { useTheme } from '../providers/ThemeProvider';

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
  { label: 'Discord', href: 'https://discord.com' },
  { label: 'Github', href: 'https://github.com' },
  { label: 'Docs', href: '/docs' },
  { label: 'API', href: '/api' },
  { label: 'Playground', href: '/playground' }
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
        <path fill="currentColor" d="M15.5 10V9h1V8h1V7h1V6h1V5h1V4h1V3h1V2h-3v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2V7h-1V6h-1V4h-1V3h-1V2h-7v1h1v1h1v1h1v2h1v1h1v2h1v1h1v2h1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h3v-1h1v-1h1v-1h1v-1h1v-1h2v1h1v1h1v2h1v1h1v1h7v-1h-1v-1h-1v-1h-1v-2h-1v-1h-1v-2h-1v-1h-1v-2h-1v-1zm0 4v1h1v2h1v1h1v2h-3v-2h-1v-1h-1v-1h-1v-2h-1v-1h-1v-1h-1v-2h-1V9h-1V7h-1V6h-1V4h3v1h1v2h1v1h1v2h1v1h1v1h1v2z" strokeWidth="0.5" stroke="#000"/>
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

/**
 * Mobile menu animation variants for framer-motion
 */
const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 }
};

/**
 * Main navigation component for the application
 * 
 * Provides navigation links, theme switcher, background selector, and
 * responsive mobile menu with animations.
 * 
 * @returns {React.ReactElement} Rendered Navigation component
 */
export default function Navigation(): React.ReactElement {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode } = useTheme();
  
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
  
  /**
   * Renders a navigation link with hover effects
   * @param {NavItem} item - The navigation item to render
   * @param {boolean} isMobile - Whether this is in the mobile menu
   * @returns {React.ReactElement} A navigation link
   */
  const renderNavLink = (item: NavItem, isMobile = false): React.ReactElement => (
    <Link 
      key={item.label}
      href={item.href}
      className={`transition-colors nav-link ${isMobile ? 'py-2 px-4' : ''}`}
      style={{ 
        color: 'var(--text-color)',
        fontFamily: 'var(--mono-font)',
        ...(isMobile ? {} : { letterSpacing: '-0.5px', fontSize: '0.9rem' })
      }}
      onClick={isMobile ? () => {
        setMobileMenuOpen(false);
        setHoveredItem(null);
      } : undefined}
      onMouseEnter={() => setHoveredItem(item.label)}
      onMouseLeave={() => setHoveredItem(null)}
      tabIndex={0}
    >
      <span className="bracket-left">{hoveredItem === item.label ? '「' : ''}</span>
      {item.label}
      <span className="bracket-right">{hoveredItem === item.label ? '」' : ''}</span>
    </Link>
  );
  
  return (
    <header className="fixed top-0 left-0 right-0 z-40 header-bar border-b" style={{ backgroundColor: 'var(--card-color)' }}>
      <div className="w-full px-4 md:px-8 flex items-center justify-between h-16">
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
          <span className="font-mono text-xl tracking-tighter" style={{ fontFamily: 'var(--mono-font)' }}>DOCS</span>
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
            
            {/* Separator */}
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" aria-hidden="true"></div>
            
            {/* Background switcher */}
            <BackgroundSelector />
            
            {/* Another separator */}
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" aria-hidden="true"></div>
            
            {/* Theme switcher in header for desktop */}
            <ThemeSwitcher className="hover:text-primary-color" />
          </nav>
          
          {/* Mobile menu toggle and theme switcher */}
          <div className="flex md:hidden items-center gap-3">
            {/* Theme switcher in header for mobile */}
            <ThemeSwitcher className="hover:text-primary-color" />
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
          
          {/* Social Media Icons */}
          <div className="flex items-center gap-2 mr-2">
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
            <nav className="flex flex-col gap-1 p-4 border-t shadow-lg" style={{ backgroundColor: 'var(--background-color)', borderColor: 'var(--border-color)' }}>
              {navItems.map((item) => (
                <div key={item.label}>
                  {renderNavLink(item, true)}
                </div>
              ))}
              
              {/* Background selector for mobile menu */}
              <div className="py-2 px-4">
                <div className="text-sm mb-2" style={{ color: 'var(--muted-color)', fontFamily: 'var(--mono-font)' }}>Background:</div>
                <BackgroundSelector />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 