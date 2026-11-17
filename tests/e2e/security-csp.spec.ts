import { expect, test } from '@playwright/test';

const ALL_SCREENS = [
  '#/inicio',
  '#/aprender',
  '#/leccion/B04',
  '#/juegos',
  '#/juego/g1',
  '#/laboratorios',
  '#/grafo',
  '#/planes',
  '#/senior',
  '#/senior/S01',
  '#/senior/S18',
  '#/evidencias',
  '#/progreso',
  '#/ajustes',
  '#/recursos',
  '#/ruta-inexistente-csp'
] as const;

test.describe('F7-01 & F7-03: Strict CSP (style-src self, zero unsafe-inline) & Brand Asset Restriction', () => {
  test('All 14 routes + 404 + CodeMirror 6 + fontScale + Plan Gate emit 0 CSP violations, while injected inline <style> is actively blocked', async ({
    page,
    request
  }) => {
    await page.addInitScript(() => {
      const win = window as unknown as { __cspViolations: Array<{ directive: string; blockedURI: string }> };
      win.__cspViolations = [];
      document.addEventListener('securitypolicyviolation', (event) => {
        win.__cspViolations.push({
          directive: event.effectiveDirective,
          blockedURI: event.blockedURI
        });
      });
    });

    const pageErrors: string[] = [];
    const cspConsoleErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error' && /Content Security Policy/i.test(msg.text())) {
        cspConsoleErrors.push(msg.text());
      }
    });

    const rootRes = await request.get('/');
    const cspHeader = rootRes.headers()['content-security-policy'] ?? '';
    expect(cspHeader).toContain("default-src 'self'");
    expect(cspHeader).toContain("script-src 'self'");
    expect(cspHeader).toContain("style-src 'self'");
    expect(cspHeader).not.toContain('unsafe-inline');
    expect(cspHeader).not.toContain('unsafe-eval');

    // F7-03: historical concept PNG with third-party logos is blocked from public HTTP serving (404), while original mark.svg is 200
    const refRes = await request.get('/assets/reference/concepto-aprobado.png');
    expect(refRes.status()).toBe(404);
    const markRes = await request.get('/assets/icons/mark.svg');
    expect(markRes.status()).toBe(200);

    await page.goto('/#/inicio');
    for (const route of ALL_SCREENS) {
      await page.goto(`/${route}`);
      await expect(page.locator('main#main-content h1').first()).toBeVisible();
    }

    // Exercise CodeMirror 6 HCL mount and typing under strict `style-src 'self'`
    await page.goto('/#/leccion/B04');
    await expect(page.locator('.cm-editor')).toBeVisible();
    await expect(page.locator('.cm-editor')).toHaveAttribute('data-editor-theme', 'dark');
    await page.getByRole('textbox', { name: 'Editor main.tf' }).click();
    await page.keyboard.type('\n# Comentario bajo CSP estricta');

    // Exercise fontScale & theme via data attributes on #/ajustes without inline styles
    await page.goto('/#/ajustes');
    await page.locator('[data-input="font-scale"]').selectOption('1.3');
    await expect(page.locator('html')).toHaveAttribute('data-font-scale', '1.3');
    await page.locator('[data-input="theme"]').selectOption('light');
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('a[href*="concepto-aprobado.png"]')).toHaveCount(0);

    await page.goto('/#/leccion/B04');
    await expect(page.locator('.cm-editor')).toHaveAttribute('data-editor-theme', 'light');

    const violationsBeforeNegative = await page.evaluate(
      () => (window as unknown as { __cspViolations: Array<{ directive: string; blockedURI: string }> }).__cspViolations
    );
    expect(violationsBeforeNegative).toEqual([]);
    expect(cspConsoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);

    // Negative security test: prove browser genuinely blocks inline <style> injection under `style-src 'self'`
    const blockedViolation = await page.evaluate(
      () =>
        new Promise<{ directive: string; blockedURI: string }>((resolve) => {
          document.addEventListener(
            'securitypolicyviolation',
            (e) => resolve({ directive: e.effectiveDirective, blockedURI: e.blockedURI }),
            { once: true }
          );
          const rogueStyle = document.createElement('style');
          rogueStyle.textContent = 'body { background: red !important; }';
          document.head.appendChild(rogueStyle);
        })
    );
    expect(blockedViolation.directive).toMatch(/^style-src/);
    expect(blockedViolation.blockedURI).toBe('inline');
  });
});
