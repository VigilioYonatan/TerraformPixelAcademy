import {defineConfig} from 'vite';

/** Build only; runtime remains dependency-free for reliable offline launch. */
export default defineConfig({
  base: './',
  publicDir: false,
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: false,
    cssCodeSplit: false,
    manifest: true
  }
});
