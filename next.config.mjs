/** @type {import('next').NextConfig} */

// `NEXT_OUTPUT=export` produces a fully static bundle in ./out for GitHub Pages.
// Left unset, the app builds normally for Vercel.
const isStaticExport = process.env.NEXT_OUTPUT === 'export';

const nextConfig = {
  reactStrictMode: true,
  output: isStaticExport ? 'export' : undefined,
  images: {
    // The portfolio ships its own optimised assets and must stay export-safe.
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },
  // three.js ships untranspiled ESM examples; let Next handle them.
  transpilePackages: ['three'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
};

export default nextConfig;
