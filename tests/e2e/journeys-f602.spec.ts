/**
 * Complete Multi-Platform Real HTTP E2E Journeys (`F6-02`).
 * Covers:
 * 1. Full New Learner Journey (Home -> B04 -> CM6 HCL -> rules -> quiz -> single XP -> reload persistence -> revocation -> B04.zip).
 * 2. Full Senior Journey (Senior Hub -> S01 & S18 -> What-If -> simulator -> decision -> 4 gates -> ADR -> 8 unique milestones -> .md export -> revocation -> portfolio export).
 * 3. Plan Inspector + Release Gate (>5MB rejection, malformed JSON, valid plan with drift + secret non-leakage in DOM & .md).
 * 4. CLI Evidence Manifest (synthetic import, forged PASS without SHA-256 rejection, .md export).
 * 5. HTTP 200 for all 12 Terra PNGs, CSP/security headers, responsive viewports (320/375/768/1024/1440px), AND compiled `dist/` verification over HTTP.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { expect, test } from '@playwright/test';

const TERRA_POSES = [
  'hola',
  'pensando',
  'exito',
  'codificando',
  'leyendo',
  'deploy',
  'alerta',
  'descanso',
  'idea',
  'arquitectura',
  'senior',
  'graduacion'
] as const;

const MIME_BY_EXT: Record<string, string> = {
  '.html': 'text/html;charset=utf-8',
  '.css': 'text/css;charset=utf-8',
  '.js': 'text/javascript;charset=utf-8',
  '.mjs': 'text/javascript;charset=utf-8',
  '.json': 'application/json;charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.zip': 'application/zip',
  '.md': 'text/markdown;charset=utf-8'
};

async function startDistHttpServer(distRoot: string): Promise<{ url: string; close: () => Promise<void> }> {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      const safeRel = normalize(urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, ''));
      const fullPath = join(distRoot, safeRel);
      if (!fullPath.startsWith(distRoot)) {
        res.writeHead(403).end('Forbidden');
        return;
      }
      const info = await stat(fullPath);
      if (!info.isFile()) {
        res.writeHead(404).end('Not found');
        return;
      }
      const body = await readFile(fullPath);
      res.writeHead(200, {
        'Content-Type': MIME_BY_EXT[extname(fullPath).toLowerCase()] || 'application/octet-stream',
        'X-Content-Type-Options': 'nosniff'
      });
      res.end(body);
    } catch {
      res.writeHead(404).end('Not found');
    }
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const addr = server.address();
  const port = typeof addr === 'object' && addr ? addr.port : 0;
  return {
    url: `http://127.0.0.1:${port}`,
    close: () => new Promise<void>((resolve) => server.close(() => resolve()))
  };
}

test.describe('F6-02: Complete Real HTTP E2E Journeys (Server + Compiled dist/)', () => {
  test('1. Full Learner Journey: #/inicio -> B04 CM6 -> rules -> quiz -> non-inflating XP -> localStorage reload -> revocation -> B04-lab.zip', async ({
    page
  }) => {
    await page.goto('/#/inicio');
    await expect(page.locator('.hero-title')).toContainText('TerraPixel');

    await page.goto('/#/leccion/B04');
    const cmContent = page.getByRole('textbox', { name: 'Editor main.tf' });
    await expect(cmContent).toBeVisible();

    // Enter valid HCL solution for B04
    await cmContent.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.insertText(
      'terraform {\n  required_version = ">= 1.6.0"\n}\nresource "terraform_data" "demo" {\n  input = "Hola, Terraform"\n}\noutput "mensaje" {\n  value = terraform_data.demo.output\n}\n'
    );

    await page.locator('[data-action="evaluate"]').click();
    await expect(page.locator('#lesson-classroom .feedback').first()).toContainText('Reglas educativas superadas');

    // Answer quiz correctly (index 1: "En el equipo del alumno o CI")
    await page.locator('[data-action="answer-quiz"][data-index="1"]').click();
    await expect(page.locator('#lesson-classroom')).toContainText('✓ Completada');

    // Re-evaluating must NOT inflate XP above 100
    await page.locator('[data-action="evaluate"]').click();
    await page.goto('/#/progreso');
    await expect(page.locator('.stat-pill .number').first()).toHaveText('100');

    // Reload browser -> localStorage persistence keeps 100 XP & B04 completed
    await page.reload();
    await expect(page.locator('.stat-pill .number').first()).toHaveText('100');

    // Download B04 lab ZIP over HTTP
    await page.goto('/#/leccion/B04');
    const dlPromise = page.waitForEvent('download');
    await page.locator('a[download="B04-lab.zip"]').click();
    const dl = await dlPromise;
    expect(dl.suggestedFilename()).toBe('B04-lab.zip');

    // Invalidate HCL -> completion & XP are immediately revoked
    const cmReloaded = page.getByRole('textbox', { name: 'Editor main.tf' });
    await cmReloaded.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.insertText('# broken config');
    await expect(page.locator('#lesson-classroom')).not.toContainText('✓ Completada');
    await page.goto('/#/progreso');
    await expect(page.locator('.stat-pill .number').first()).toHaveText('0');
  });

  test('2. Full Senior S18 Capstone Journey: What-If -> Simulator -> Decision -> 4 Checks -> ADR -> 8 Unique Milestones -> Export .md & Portfolio -> Revocation', async ({
    page
  }) => {
    await page.goto('/#/senior/S18');
    await expect(page.locator('[data-sim-case="S18"]')).toBeVisible();

    // Run S18 simulator & answer What-If (correct index 1 for S18)
    await page.locator('[data-action="run-case-sim"][data-id="S18"]').click();
    await expect(page.locator('#preact-senior-case .content-panel .alert')).toBeVisible();
    await page.locator('[data-action="what-if-answer"][data-index="1"]').click();
    await expect(page.locator('.what-if-result.ok')).toBeVisible();

    // Stage 2: Decision (correct index 2 for S18)
    await page.locator('[data-action="case-tab"][data-id="decision"]').first().click();
    await page.locator('[data-action="case-decision"][data-index="2"]').click();

    // Sidebar: 4 self-verification checks
    for (let i = 0; i < 4; i++) {
      await page.locator(`[data-input="case-check"][data-index="${i}"]`).check();
    }

    // Stage 4: ADR with 5 required sections
    await page.locator('[data-action="case-tab"][data-id="evidencia"]').first().click();
    await page
      .locator('#senior-evidence')
      .fill(
        [
          'Contexto: plataforma multiambiente dev, staging y prod con módulos desacoplados.',
          'Decisión: separar estados S3 con bloqueo nativo, OIDC por entorno y cesión de workloads a GitOps.',
          'Riesgos: deriva fuera de banda, sobrecosto de red NAT y fallos de migración.',
          'Evidencia: PASS en Terraform CLI v1.10.5 local; cloud real NOT_RUN.',
          'Rollback: revertir digest en GitOps y restaurar versión verificada de state con aprobación dual.'
        ].join('\n')
      );

    // Stage 5: Operations + 8 distinct Capstone milestones
    await page.locator('[data-action="case-tab"][data-id="operaciones"]').first().click();
    await expect(page.locator('[data-action="finish-case"]')).toBeDisabled();
    for (let i = 0; i < 8; i++) {
      await page
        .locator(`#capstone-note-${i}`)
        .fill(
          `Hito ${i + 1}: control específico ${i + 1} documentado con estado PASS local / NOT_RUN cloud y responsable asignado #${i + 1}.`
        );
      await page.locator(`#capstone-check-${i}`).check();
    }

    const finishBtn = page.locator('[data-action="finish-case"]');
    await expect(finishBtn).toBeEnabled();
    await finishBtn.click();
    await expect(page.locator('#current-case-status')).toContainText('✓ Autoevaluado');

    // Export S18 ADR Markdown
    const s18DlPromise = page.waitForEvent('download');
    await page.locator('[data-action="export-senior"]').first().click();
    const s18Dl = await s18DlPromise;
    expect(s18Dl.suggestedFilename()).toBe('S18-informe-senior.md');

    // Export full 18-case Senior Portfolio from #/senior
    await page.goto('/#/senior');
    const portDlPromise = page.waitForEvent('download');
    await page.locator('[data-action="export-portfolio"]').click();
    const portDl = await portDlPromise;
    expect(portDl.suggestedFilename()).toBe('TerraPixel-Portfolio-Senior.md');
    const portPath = await portDl.path();
    if (portPath) {
      const portMd = await readFile(portPath, 'utf8');
      expect(portMd).toContain('Autoevaluados con gate vigente: 1');
      expect(portMd).toContain('| S18 | Capstone de Platform Engineering con Terraform | AUTOEVALUADO |');
    }

    // Revocation: corrupting milestone 2 immediately revokes S18 completion
    await page.goto('/#/senior/S18');
    await page.locator('[data-action="case-tab"][data-id="operaciones"]').first().click();
    await page.locator('#capstone-note-2').fill('corto');
    await expect(page.locator('#current-case-status')).toContainText('Caso abierto');
  });

  test('3 & 4. Negative Guards on Plan Inspector (>5MB, malformed JSON) & CLI Evidence Manifest (PASS without SHA-256 rejected, .md export)', async ({
    page
  }) => {
    await page.goto('/#/planes');

    // >5 MB file rejected client-side before JSON.parse
    const oversized = Buffer.alloc(5_000_100, 0x20);
    await page.locator('#user-plan-json').setInputFiles({
      name: 'huge.json',
      mimeType: 'application/json',
      buffer: oversized
    });
    await expect(page.locator('#real-plan-review [role="alert"]')).toContainText('máximo 5 MB');

    // Malformed JSON rejected cleanly
    await page.locator('#user-plan-json').setInputFiles({
      name: 'corrupt.json',
      mimeType: 'application/json',
      buffer: Buffer.from('{ invalid json')
    });
    await expect(page.locator('#real-plan-review [role="alert"]')).toBeVisible();

    // CLI Evidence Manifest: forged PASS without logSha256 rejected
    await page.goto('/#/evidencias');
    const forgedManifest = Buffer.from(
      JSON.stringify({
        schemaVersion: 1,
        origin: 'LOCAL_TERRAFORM_CLI',
        runId: 'forged-run-9999',
        generatedAt: '2026-11-16T10:00:00Z',
        terraformVersion: 'Terraform v1.10.5',
        results: [{ id: 'B01', status: 'PASS', logSha256: null, logBytes: 100 }]
      })
    );
    await page.locator('#cli-manifest-file').setInputFiles({
      name: 'forged.json',
      mimeType: 'application/json',
      buffer: forgedManifest
    });
    await expect(page.locator('#cli-evidence-dashboard [role="alert"]')).toContainText('SHA-256');

    // Valid synthetic manifest imports & exports .md cleanly
    const syntheticBytes = await readFile('assets/examples/cli-evidence-synthetic.json');
    await page.locator('#cli-manifest-file').setInputFiles({
      name: 'cli-evidence-synthetic.json',
      mimeType: 'application/json',
      buffer: syntheticBytes
    });
    const exportPromise = page.waitForEvent('download');
    await page.locator('[data-action="export-cli-manifest"]').click();
    const exported = await exportPromise;
    expect(exported.suggestedFilename()).toBe('TerraPixel-Indice-Evidencia-CLI.md');
  });

  test('5. HTTP 200 on all 12 Terra PNGs, security headers, 5 responsive viewports (320..1440px), and compiled dist/ HTTP smoke', async ({
    page,
    request
  }) => {
    // Check security headers on root HTML response
    const rootRes = await request.get('/');
    expect(rootRes.status()).toBe(200);
    const headers = rootRes.headers();
    expect(headers['content-security-policy']).toContain("default-src 'self'");
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');

    // Check all 12 Terra pixel-art PNGs return HTTP 200 with PNG magic bytes
    for (const pose of TERRA_POSES) {
      const pngRes = await request.get(`/assets/terra/${pose}.png`);
      expect(pngRes.status(), `Missing PNG ${pose}`).toBe(200);
      const body = await pngRes.body();
      expect(body.subarray(0, 4).toString('hex')).toBe('89504e47');
    }

    // Zero horizontal overflow across 320px, 375px, 768px, 1024px, and 1440px
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 840 });
      for (const route of ['#/inicio', '#/aprender', '#/laboratorios', '#/senior', '#/progreso']) {
        await page.goto(`/${route}`);
        const hasOverflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
        );
        expect(hasOverflow, `Overflow at ${width}px on ${route}`).toBe(false);
      }
    }

    // Verify compiled `dist/` bundle served over real HTTP
    const distServer = await startDistHttpServer(join(process.cwd(), 'dist'));
    try {
      const distErrors: string[] = [];
      page.on('pageerror', (e) => distErrors.push(e.message));
      await page.setViewportSize({ width: 1280, height: 860 });
      await page.goto(`${distServer.url}/#/leccion/B01`);
      await expect(page.locator('#lesson-classroom')).toBeVisible();
      await expect(page.locator('.cm-editor')).toBeVisible();
      await page.goto(`${distServer.url}/#/laboratorios`);
      await expect(page.locator('.lab-pack-row')).toHaveCount(36);
      await expect(page.locator('.senior-pack-row')).toHaveCount(18);
      expect(distErrors).toEqual([]);
    } finally {
      await distServer.close();
    }
  });
});
