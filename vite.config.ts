import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Production optimizations
    target: 'es2015',
    minify: 'esbuild', // Use esbuild for faster builds (default)
    // Remove console.log and debugger in production
    ...(mode === 'production' && {
      esbuildOptions: {
        drop: ['console', 'debugger'],
      },
    }),
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
          ],
          'vendor-charts': ['recharts'],
        },
      },
    },
    // Optimize chunks
    chunkSizeWarningLimit: 1000, // Increase to 1000kb for warning
    cssCodeSplit: true,
    sourcemap: mode !== 'production', // Only in dev
    reportCompressedSize: false, // Faster builds
  },
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
    ],
  },
}));

