import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_BACKGROUND_TYPE: process.env.NEXT_PUBLIC_BACKGROUND_TYPE || 'wave',
  }
};

export default nextConfig;
