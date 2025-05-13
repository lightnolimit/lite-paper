'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSwitcher from './ThemeSwitcher';
import BackgroundSelector from './BackgroundSelector';

const navItems = [
  { label: 'Discord', href: 'https://discord.com' },
  { label: 'Github', href: 'https://github.com' },
  { label: 'Docs', href: '/docs' },
  { label: 'API', href: '/api' },
  { label: 'Playground', href: '/playground' }
];

export default function Navigation() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
  
  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-sm border-b border-border-color" style={{ backgroundColor: 'var(--background-color)', borderColor: 'var(--border-color)' }}>
      <div className="container max-w-5xl mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        <Link 
          href="/"
          className="font-yeezy font-bold text-xl flex items-center gap-2"
          style={{ color: 'var(--text-color)' }}
          tabIndex={0} // Make focusable with keyboard
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-color to-secondary-color" style={{ 
            backgroundImage: `linear-gradient(to right, var(--primary-color), var(--secondary-color))`
          }}>
            PROJECT
          </span>
          <span>DOCS</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <div 
                key={item.label} 
                className="relative"
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link 
                  href={item.href}
                  className="font-yeezy font-light transition-colors hover:text-primary-color"
                  style={{ color: 'var(--muted-color)' }}
                  tabIndex={0} // Make focusable with keyboard
                >
                  {item.label}
                </Link>
                {hoveredItem === item.label && (
                  <motion.div 
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: 'var(--primary-color)' }}
                    initial={{ opacity: 0, width: '0%' }}
                    animate={{ opacity: 1, width: '100%' }}
                    exit={{ opacity: 0, width: '0%' }}
                  />
                )}
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
          
          <div className="flex md:hidden items-center gap-3">
            {/* Theme switcher in header for mobile */}
            <ThemeSwitcher className="hover:text-primary-color" />
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: 'var(--text-color)' }}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
              tabIndex={0} // Make focusable with keyboard
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <nav className="flex flex-col gap-1 p-4 border-t shadow-lg" style={{ backgroundColor: 'var(--background-color)', borderColor: 'var(--border-color)' }}>
              {navItems.map((item) => (
                <Link 
                  key={item.label}
                  href={item.href}
                  className="font-yeezy py-2 px-4 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  style={{ color: 'var(--text-color)' }}
                  onClick={() => setMobileMenuOpen(false)}
                  tabIndex={0} // Make focusable with keyboard
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Background selector for mobile menu */}
              <div className="py-2 px-4">
                <div className="text-sm mb-2" style={{ color: 'var(--muted-color)' }}>Background:</div>
                <BackgroundSelector />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 