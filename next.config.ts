import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output for Render deployment
  output: 'standalone',

  // Disable static generation entirely - all pages are dynamic
  staticPageGenerationTimeout: 0,

  typescript: {
    ignoreBuildErrors: false,
  },

  experimental: {
    optimizePackageImports: ["motion", "lodash"],
  },
};

export default nextConfig;
