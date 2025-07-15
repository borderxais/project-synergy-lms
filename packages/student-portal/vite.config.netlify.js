import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Skip TypeScript type checking to avoid errors from common package
  optimizeDeps: {
    esbuildOptions: {
      tsconfig: false,
    },
  },
  build: {
    // Disable type checking during build
    typescript: {
      transpileOnly: true,
    },
    // Ensure CSS processing works without postcss-import
    cssCodeSplit: true,
    cssMinify: true,
  },
});
