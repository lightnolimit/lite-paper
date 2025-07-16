'use client';

import React from 'react';

import { createLogger } from './utils/logger';

const logger = createLogger('GlobalError');

/**
 * Props for the GlobalError component
 */
interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global Error component
 *
 * This component handles errors that occur at the root level,
 * outside of the app layout. It provides a simplified error page
 * that doesn't depend on any application-level components.
 *
 * @param props - The component props
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    // Log the error to console in global error case
    logger.error('Global application error:', error);

    // Check for dark mode preference
    const darkModePreference =
      localStorage.getItem('darkMode') === 'true' ||
      (localStorage.getItem('darkMode') === null &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    setIsDarkMode(darkModePreference);
  }, [error]);

  // Theme-aware styles
  const themeStyles = {
    container: {
      backgroundColor: isDarkMode ? '#1A1A1F' : '#FFFFFF',
      color: isDarkMode ? '#F0F0F5' : '#2E3A23',
      border: `1px solid ${isDarkMode ? '#2E2E3A' : '#D7E4C0'}`,
      boxShadow: isDarkMode ? '0 4px 16px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.07)',
    },
    icon: {
      color: isDarkMode ? '#FF85A1' : '#678D58',
    },
    mutedText: {
      color: isDarkMode ? '#9C9CAF' : '#6E7D61',
    },
    button: {
      backgroundColor: isDarkMode ? '#FF85A1' : '#678D58',
      color: isDarkMode ? '#000000' : '#FFFFFF',
    },
    errorDetails: {
      backgroundColor: isDarkMode ? '#2E2E3A' : '#F5F5F5',
      color: isDarkMode ? '#9C9CAF' : '#6E7D61',
    },
    errorText: {
      color: isDarkMode ? '#FFB3C6' : '#D32F2F',
    },
  };

  return (
    <html lang="en" className={isDarkMode ? 'dark' : ''}>
      <head>
        <style>{`
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background-color: ${isDarkMode ? '#0B0D0F' : '#FAFBF9'};
            color: ${isDarkMode ? '#F0F0F5' : '#2E3A23'};
            transition: background-color 0.3s ease, color 0.3s ease;
          }
        `}</style>
      </head>
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
          <div
            style={{
              maxWidth: '500px',
              margin: '0 auto',
              padding: '2rem',
              borderRadius: '0.75rem',
              transition: 'all 0.3s ease',
              ...themeStyles.container,
            }}
          >
            <div
              style={{
                fontSize: '4rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                transition: 'color 0.3s ease',
                ...themeStyles.icon,
              }}
            >
              &#x26A0;
            </div>

            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                transition: 'color 0.3s ease',
              }}
            >
              Critical Error
            </h1>

            <p
              style={{
                marginBottom: '1.5rem',
                transition: 'color 0.3s ease',
                ...themeStyles.mutedText,
              }}
            >
              We&apos;ve encountered a critical error. Please try refreshing the page.
            </p>

            <button
              onClick={reset}
              style={{
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.25rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                ...themeStyles.button,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.opacity = '0.8';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Try Again
            </button>

            {process.env.NODE_ENV === 'development' && (
              <div
                style={{
                  marginTop: '2rem',
                  textAlign: 'left',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  overflow: 'auto',
                  maxHeight: '10rem',
                  transition: 'background-color 0.3s ease',
                  ...themeStyles.errorDetails,
                }}
              >
                <p
                  style={{
                    fontSize: '0.75rem',
                    marginBottom: '0.5rem',
                    transition: 'color 0.3s ease',
                    ...themeStyles.mutedText,
                  }}
                >
                  Error details (only visible in development):
                </p>
                <pre
                  style={{
                    fontSize: '0.7rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    transition: 'color 0.3s ease',
                    ...themeStyles.errorText,
                  }}
                >
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
          </div>
        </main>
      </body>
    </html>
  );
}
