import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  // Use relative path for production and Docker deployment
  base: './',
  plugins: [react(), visualizer()],
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
      components: '/src/components',
      assets: '/src/assets',
      services: '/src/services',
      utils: '/src/utils',
    },
  },
  // Add server config for Docker development
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
