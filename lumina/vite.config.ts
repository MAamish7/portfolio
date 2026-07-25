import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // shadcn convention: "@/..." resolves to src/
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
