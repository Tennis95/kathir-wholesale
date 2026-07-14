import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output for Render deployment
  output: 'standalone',

  typescript: {
    ignoreBuildErrors: false,
  },

  experimental: {
    optimizePackageImports: ["motion", "lodash"],
  },
};

export default nextConfig;
