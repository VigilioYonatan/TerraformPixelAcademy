import { cp, mkdir } from 'node:fs/promises';

await mkdir('dist', { recursive: true });
// Merge static assets, labs, docs and offline ESM fallback alongside Vite hashed chunks
for (const folder of ['assets', 'docs', 'app']) {
  await cp(folder, `dist/${folder}`, { recursive: true, force: true });
}
await cp('styles.css', 'dist/styles.css', { force: true });
console.log('Assets/terra, 54 packs ZIP, docs y modulos offline sincronizados en dist/.');
