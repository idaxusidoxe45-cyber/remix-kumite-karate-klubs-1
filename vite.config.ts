import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

const PRERENDERED_SUBROUTES = new Set([
  '/about',
  '/coaches',
  '/schedule',
  '/gallery',
  '/contacts',
]);

export default defineConfig(({ isSsrBuild }) => {
  return {
    base: '/',
    publicDir: 'public',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'prerendered-routes-preview',
        configurePreviewServer(server) {
          server.middlewares.use((req, _res, next) => {
            if (req.url) {
              const [pathname, query] = req.url.split('?');
              const clean = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
              if (PRERENDERED_SUBROUTES.has(clean)) {
                req.url = `${clean}/index.html${query ? `?${query}` : ''}`;
              }
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      cssCodeSplit: true,
      sourcemap: false,
      minify: isSsrBuild ? false : ('esbuild' as const),
      manifest: !isSsrBuild,
      rollupOptions: isSsrBuild
        ? {
            output: {
              inlineDynamicImports: true,
            },
          }
        : {
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
    preview: {
      port: 4173,
      host: true,
    },
  };
});
