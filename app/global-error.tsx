'use client';

import React from 'react';

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
  React.useEffect(() => {
    // Log the error to console in global error case
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
          <div
            style={{
              maxWidth: '500px',
              margin: '0 auto',
              padding: '2rem',
              backgroundColor: '#FFF',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
              border: '1px solid #222',
              color: '#2E3A23',
            }}
          >
            <div
              style={{
                fontSize: '4rem',
                fontWeight: 'bold',
                color: '#678D58',
                marginBottom: '1rem',
              }}
            >
              &#x26A0;
            </div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Critical Error
            </h1>

            <p style={{ marginBottom: '1.5rem', color: '#6E7D61' }}>
              We&apos;ve encountered a critical error. Please try refreshing the page.
            </p>

            <button
              onClick={reset}
              style={{
                backgroundColor: '#678D58',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.25rem',
                fontWeight: 'bold',
                cursor: 'pointer',
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
                  backgroundColor: '#f5f5f5',
                  borderRadius: '0.5rem',
                  overflow: 'auto',
                  maxHeight: '10rem',
                }}
              >
                <p style={{ fontSize: '0.75rem', marginBottom: '0.5rem', color: '#6E7D61' }}>
                  Error details (only visible in development):
                </p>
                <pre
                  style={{
                    fontSize: '0.7rem',
                    color: '#d32f2f',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
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
