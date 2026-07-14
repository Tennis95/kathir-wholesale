import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimized standalone output for Vercel deployment
  output: 'standalone',

  typescript: {
    ignoreBuildErrors: false,
  },

  experimental: {
    optimizePackageImports: ["motion", "lodash"],
  },
};

export default nextConfig;
