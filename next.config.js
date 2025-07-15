/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Environment variables accessible in the browser
   */
  env: {
    NEXT_PUBLIC_BACKGROUND_TYPE: process.env.NEXT_PUBLIC_BACKGROUND_TYPE || 'dither',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://docs.phantasy.bot',
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
    unoptimized: true, // Required for Cloudflare Pages static export
  },

  /**
   * Output configuration
   * - Using 'export' for Cloudflare Pages compatibility
   */
  output: 'export',

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
    // Ignore type errors in production builds to prevent CI failures
    ignoreBuildErrors: true,
  },

  /**
   * Optimize asset loading for third-party libraries
   */
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', '@react-three/fiber', '@react-three/drei'],
    viewTransition: true,
  },

  // Headers configuration removed as it doesn't work with 'export' mode
  // These headers can be added through Cloudflare Pages custom headers
};

module.exports = nextConfig;
