import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    base: '/',
    publicDir: 'public',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      cssCodeSplit: true,
      sourcemap: false,
      minify: 'esbuild' as const,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) {
              return 'vendor-react';
            }
            if (/[\\/]node_modules[\\/]lucide-react[\\/]/.test(id)) {
              return 'vendor-icons';
            }
            if (/[\\/]node_modules[\\/](motion|motion-dom|motion-utils|framer-motion)[\\/]/.test(id)) {
              return 'vendor-motion';
            }
          },
        },
      },
    },
    server: {
      port: 3000,
      host: true,
    },
  };
});
