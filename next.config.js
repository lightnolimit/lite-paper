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
    // Only ignore type errors in production builds when explicitly set
    ignoreBuildErrors:
      process.env.NODE_ENV === 'production' && process.env.IGNORE_BUILD_ERRORS === 'true',
  },

  /**
   * Optimize asset loading for third-party libraries
   */
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'framer-motion',
      '@iconify/react',
      'react-markdown',
      'react-syntax-highlighter',
      'marked',
      'marked-highlight',
      'prismjs',
      'dompurify',
      'next-themes',
      'react-use',
    ],
    viewTransition: true,
  },

  /**
   * Webpack configuration for bundle optimization
   */
  webpack: (config, { isServer }) => {
    // Optimize dynamic imports
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    return config;
  },

  // Headers configuration removed as it doesn't work with 'export' mode
  // These headers can be added through Cloudflare Pages custom headers
};

module.exports = nextConfig;
