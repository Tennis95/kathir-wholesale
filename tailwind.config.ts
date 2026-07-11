import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        kathir: {
          // Primary Brand Colors
          primary: '#8FD3F4',       // Primary Light Sky Blue
          secondary: '#4FA9D9',     // Secondary Blue
          bgSoft: '#F8FCFF',        // Very soft blue-white background
          cardBg: '#FFFFFF',        // Card background

          // Text Colors
          textPrimary: '#1F2937',   // Dark gray - primary text
          textSecondary: '#6B7280', // Medium gray - secondary text

          // Accent Colors
          gold: '#F5B301',          // Golden Yellow - CTA accents
          brown: '#7A3E1D',         // Warm Brown - logo text & accents
          green: '#6DBE45',         // Fresh Green - success/availability

          // Legacy colors (for backward compatibility)
          lightsky: '#8FD3F4',      // PRIMARY - Light Sky Blue
          skyblue: '#4FA9D9',       // Sky Blue (secondary)
          rustbrown: '#A0522D',     // Rust Brown - text & details
          darkbrown: '#6B3E24',     // Dark Brown - accents
        },
      },
    },
  },
  plugins: [],
}
export default config
