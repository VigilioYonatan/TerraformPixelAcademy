/** Build only; runtime remains dependency-free for reliable offline launch. */
export default {
  base: './',
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: false,
    cssCodeSplit: false
  }
};
