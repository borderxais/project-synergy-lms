import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

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
  css: {
    // Enable PostCSS processing but with inline minimal config
    postcss: {
        plugins: [
          tailwindcss,
          autoprefixer,
        ],
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
    // Ensure CSS processing works properly
    cssCodeSplit: true,
    cssMinify: true,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        warn(warning);
      },
    },
  },
});
