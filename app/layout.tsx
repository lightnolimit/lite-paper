import type { Metadata, Viewport } from 'next';

import './globals.css';
import { ChatBotProvider } from './components/ChatBotProvider';
import { ThemeProvider } from './providers/ThemeProvider';

/**
 * Default metadata for the application
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://phantasy-docs.example.com'),
  title: {
    template: '%s | Phantasy Documentation',
    default: 'Phantasy Documentation',
  },
  description: 'Official documentation for the Phantasy platform and ecosystem',
  keywords: ['phantasy', 'documentation', 'blockchain', 'web3', 'crypto', 'defi', 'nft', 'gaming'],
  authors: [{ name: 'Phantasy Team', url: 'https://phantasy.io' }],
  creator: 'Phantasy',
  publisher: 'Phantasy',
  applicationName: 'Phantasy Documentation',
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
    },
  },
  category: 'Technology',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: ['/favicon/favicon.ico'],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon/favicon.svg',
        color: '#FF85A1',
      },
    ],
  },
  manifest: '/favicon/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://phantasy-docs.example.com',
    title: 'Phantasy Documentation',
    description: 'Official documentation for the Phantasy platform and ecosystem',
    siteName: 'Phantasy Docs',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Phantasy Documentation',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phantasy Documentation',
    description: 'Official documentation for the Phantasy platform and ecosystem',
    creator: '@phantasy',
    images: ['/images/twitter-card.png'],
  },
  verification: {
    google: 'google-site-verification-code', // Replace with actual verification code when available
  },
  appleWebApp: {
    capable: true,
    title: 'Phantasy Docs',
    statusBarStyle: 'black-translucent',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

/**
 * Default viewport settings
 */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1E1E2E' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

/**
 * Root layout component that wraps all pages
 * - Handles theme application
 * - Sets up favicons and metadata
 * - Provides global site structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="theme-transition" suppressHydrationWarning>
      <head>
        {/* Favicons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#FF85A1" />
        <meta name="theme-color" content="#FF85A1" />
        <meta name="apple-mobile-web-app-title" content="Phantasy Docs" />
        <meta name="application-name" content="Phantasy Docs" />

        {/* Theme initialization script - prevents theme flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Apply theme before React hydrates to prevent flash
                  var storedPreference = localStorage.getItem('darkMode');
                  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var darkModeEnabled = storedPreference === 'true' || 
                    (storedPreference === null && prefersDark);
                  
                  if (darkModeEnabled) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  console.log('Error applying initial theme', e);
                }
              })();
            `,
          }}
        />

        {/* Code block functionality */}
        <script src="/js/codeblock.js" defer />
      </head>
      <body className="min-h-screen font-urbanist">
        <ThemeProvider>
          {children}
          <ChatBotProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
