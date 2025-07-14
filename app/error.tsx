'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import logger from './utils/logger';

// Create an error page-specific logger
const errorLogger = logger;

/**
 * Props for the Error component
 */
interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Custom Error page
 *
 * Displays when an error occurs in the application.
 * Shows a friendly error message, provides the ability to try again,
 * and logs the error for debugging.
 *
 * @param props - The component props
 */
export default function Error({ error, reset }: ErrorProps) {
  // Log the error when the component mounts
  React.useEffect(() => {
    errorLogger.error('Application error:', error);
  }, [error]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="doc-card p-8 max-w-md w-full text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="font-mono text-6xl font-bold" style={{ color: 'var(--primary-color)' }}>
            &#x2715;
          </div>
        </div>

        <h1 className="text-2xl font-title mb-4">Something Went Wrong</h1>

        <p className="mb-6 text-muted-color">
          We&apos;ve encountered an unexpected error. Our team has been notified.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button onClick={reset} className="relative inline-block">
            <span className="bracket-left text-2xl" style={{ color: 'var(--primary-color)' }}>
              [
            </span>
            <span className="nav-button px-4 py-2 mx-1 inline-block transition-all duration-300 hover:text-white">
              Try Again
            </span>
            <span className="bracket-right text-2xl" style={{ color: 'var(--primary-color)' }}>
              ]
            </span>
          </button>

          <Link href="/docs" className="relative inline-block">
            <span className="bracket-left text-2xl" style={{ color: 'var(--primary-color)' }}>
              [
            </span>
            <span className="nav-button px-4 py-2 mx-1 inline-block transition-all duration-300 hover:text-white">
              Go to Docs
            </span>
            <span className="bracket-right text-2xl" style={{ color: 'var(--primary-color)' }}>
              ]
            </span>
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 text-left p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto max-h-40">
            <p className="text-sm font-mono mb-2 text-muted-color">
              Error details (only visible in development):
            </p>
            <pre className="text-xs text-red-500 dark:text-red-400 whitespace-pre-wrap break-words">
              {error.message}
              {error.stack && (
                <>
                  <br />
                  {error.stack.split('\n').slice(1).join('\n')}
                </>
              )}
            </pre>
          </div>
        )}
      </motion.div>
    </main>
  );
}
