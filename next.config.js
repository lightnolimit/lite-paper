/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Environment variables accessible in the browser
   */
  env: {
    NEXT_PUBLIC_BACKGROUND_TYPE: process.env.NEXT_PUBLIC_BACKGROUND_TYPE || 'wave',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://phantasy-docs.example.com',
  },
  
  /**
   * Image optimization configuration
   */
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.phantasy.io',
      },
    ],
  },
  
  /**
   * Output configuration
   * - Using 'standalone' for optimized production build
   */
  output: 'standalone',
  
  /**
   * Enable React strict mode
   */
  reactStrictMode: true,
  

  /**
   * Trailing slash configuration - consistent URL handling
   */
  trailingSlash: false,
  
  /**
   * TypeScript configuration
   */
  typescript: {
    // Handle TypeScript errors at build time for better code quality
    ignoreBuildErrors: false,
  },

  /**
   * Optimize asset loading for third-party libraries
   */
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', '@react-three/fiber', '@react-three/drei'],
  },
  
  /**
   * Configure headers for security and caching
   */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/favicon/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 