/** @type {import('next').NextConfig} */

// `NEXT_OUTPUT=export` produces a fully static bundle in ./out for GitHub Pages.
// Left unset, the app builds normally for Vercel.
const isStaticExport = process.env.NEXT_OUTPUT === 'export';

// GitHub Pages serves a project repo from /<repo>, not the domain root, so
// every asset URL has to be prefixed. Vercel serves from the root and leaves
// this unset.
const basePath = process.env.NEXT_BASE_PATH ?? '';

const nextConfig = {
  reactStrictMode: true,
  output: isStaticExport ? 'export' : undefined,
  basePath,
  assetPrefix: basePath || undefined,
  // Emit /about/index.html rather than /about.html so static hosts resolve
  // clean URLs without extra rewrite rules.
  trailingSlash: isStaticExport,
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
