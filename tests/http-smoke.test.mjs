import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const PORT = 42741;
let server;
async function up() {
  for (let i = 0; i < 30; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/`, { signal: AbortSignal.timeout(1000) });
      if (r.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Local HTTP server did not start');
}
test('clean HTTP execution serves web app and assets but not sources', async () => {
  server = spawn(process.execPath, ['scripts/server.mjs'], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'ignore'
  });
  try {
    await up();
    for (const pathname of [
      '/',
      '/index.html',
      '/styles.css',
      '/app/main.js',
      '/app/seniorReport.js',
      '/assets/senior/S18.zip',
      '/assets/labs/B04.zip',
      '/assets/terra/hola.png'
    ]) {
      const r = await fetch(`http://127.0.0.1:${PORT}${pathname}`);
      assert.equal(r.status, 200, pathname);
      assert.ok((await r.arrayBuffer()).byteLength > 50, pathname);
    }
    const page = await fetch(`http://127.0.0.1:${PORT}/`);
    assert.match(page.headers.get('content-security-policy') ?? '', /script-src 'self'/);
    assert.equal(page.headers.get('x-frame-options'), 'DENY');
    for (const pathname of [
      '/app/vendor/preact.mjs',
      '/app/planInspector.js',
      '/app/planReport.js',
      '/assets/vendor/codemirror5/codemirror.js',
      '/assets/vendor/codemirror5/mode-hcl.js'
    ]) {
      const r = await fetch(`http://127.0.0.1:${PORT}${pathname}`);
      assert.equal(r.status, 200, pathname);
      assert.ok((await r.arrayBuffer()).byteLength > 100, pathname);
    }
    for (const pathname of [
      '/src/main.ts',
      '/package.json',
      '/labs/senior/S01/incident.json',
      '/.gitignore',
      '/assets/../../package.json'
    ]) {
      const r = await fetch(`http://127.0.0.1:${PORT}${pathname}`);
      assert.equal(r.status, 404, pathname);
    }
    assert.equal((await fetch(`http://127.0.0.1:${PORT}/`, { method: 'POST' })).status, 405);
  } finally {
    server?.kill('SIGTERM');
  }
});
