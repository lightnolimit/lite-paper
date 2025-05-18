'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import logger from './utils/logger';

// Create a page-specific logger
const notFoundLogger = logger;

/**
 * Custom 404 Not Found page
 * 
 * Displays when a user navigates to a URL that doesn't exist
 * in the application. Shows a friendly error message and
 * provides navigation back to the documentation homepage.
 */
export default function NotFound() {
  // Log that the 404 page was shown
  React.useEffect(() => {
    notFoundLogger.info('404 Not Found page rendered');
  }, []);
  
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="doc-card p-8 max-w-md w-full text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="text-9xl font-title font-bold" style={{ color: 'var(--primary-color)' }}>
            404
          </div>
        </div>
        
        <h1 className="text-2xl font-title mb-4">Page Not Found</h1>
        
        <p className="mb-6 text-muted-color">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        <div className="relative inline-block">
          <span className="bracket-left text-4xl" style={{ color: 'var(--primary-color)' }}>[</span>
          <Link 
            href="/docs/introduction/synopsis"
            className="nav-button px-6 py-2 mx-1 inline-block transition-all duration-300 hover:text-white"
          >
            Return to Documentation
          </Link>
          <span className="bracket-right text-4xl" style={{ color: 'var(--primary-color)' }}>]</span>
        </div>
        
        <div className="mt-8 text-sm text-muted-color">
          <p>Looking for something specific? Visit our <Link href="/docs" className="text-primary-color hover:underline">documentation index</Link>.</p>
        </div>
      </motion.div>
    </main>
  );
} 