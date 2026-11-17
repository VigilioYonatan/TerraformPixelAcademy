import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.md': 'text/markdown; charset=utf-8',
  '.tf': 'text/plain; charset=utf-8',
  '.hcl': 'text/plain; charset=utf-8',
  '.zip': 'application/zip',
  '.woff2': 'font/woff2'
};
const port = Number(process.env.PORT || 4173);

const server = createServer(async (req, res) => {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      res.end('Método no permitido');
      return;
    }
    const path = decodeURIComponent(new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`).pathname);
    const publicPath = path === '/' ? '/index.html' : path;
    if (
      !(
        /^\/(?:index\.html|styles\.css)$/.test(publicPath) ||
        /^\/app\/[a-zA-Z0-9_-]+\.js$/.test(publicPath) ||
        /^\/app\/vendor\/(?:preact|codemirror6)\.mjs$/.test(publicPath) ||
        /^\/assets\/[a-zA-Z0-9_./-]+$/.test(publicPath) ||
        publicPath === '/docs/TERRAFORM_ACADEMY_MASTER_SPEC_V1_1_AUDITADA.md'
      )
    ) {
      res.writeHead(404);
      res.end('No encontrado');
      return;
    }
    const target = resolve(root, `.${publicPath}`);
    if (target !== root && !target.startsWith(root + sep)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    const info = await stat(target);
    if (!info.isFile()) throw new Error('not file');
    const bytes = await readFile(target);
    res.writeHead(200, {
      'Content-Type': mime[extname(target)] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'Referrer-Policy': 'no-referrer',
      'Cache-Control': 'no-cache',
      'Content-Length': bytes.length,
      'X-Frame-Options': 'DENY',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
    });
    if (req.method === 'HEAD') res.end();
    else res.end(bytes);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('No encontrado');
  }
});

server.listen(port, process.env.HOST || '127.0.0.1', () =>
  console.log(`TerraPixel Academy: http://localhost:${port} (Ctrl+C para detener)`)
);
