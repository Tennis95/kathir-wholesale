import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output for Render deployment
  output: 'standalone',

  typescript: {
    ignoreBuildErrors: false,
  },

  experimental: {
    optimizePackageImports: ["motion", "lodash"],
    // Skip error page pre-rendering which causes issues on Render
    skipMiddlewareUrlNormalization: false,
  },

  // Disable static generation timeout to prevent Render build errors
  onDemandEntries: {
    maxInactiveAge: 1000 * 60 * 60 * 24,
    pagesBufferLength: 5,
  },

  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
