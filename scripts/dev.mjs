import {spawn} from 'node:child_process';
import {statSync} from 'node:fs';
import {resolve} from 'node:path';

const tscEntry = resolve('tools/typescript/bin/tsc');
const viteEntry = resolve('node_modules/vite/bin/vite.js');
try {
  statSync(viteEntry);
} catch {
  console.error('Vite no esta instalado en node_modules/. Ejecuta `npm ci` (o usa `npm start` para modo offline).');
  process.exit(1);
}

const tsc = spawn(process.execPath, [tscEntry, '-p', 'tsconfig.json', '--watch', '--preserveWatchOutput'], {
  stdio: 'inherit'
});
const vite = spawn(process.execPath, [viteEntry, '--host', '127.0.0.1'], {
  stdio: 'inherit'
});

const stop = () => {
  tsc.kill();
  vite.kill();
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
