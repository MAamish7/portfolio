import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  // GitHub Pages serves this app from a subdirectory; VITE_BASE supplies it.
  // Unset (local dev, Vercel) it falls back to the domain root.
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    // shadcn convention: "@/..." resolves to src/
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
