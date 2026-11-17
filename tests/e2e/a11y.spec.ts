/**
 * Automated WCAG 2.2 Level A & AA Accessibility Suite (`F6-03`).
 * Runs `@axe-core/playwright` across all 14 routes + 404 in BOTH `dark` and `light` themes,
 * and verifies keyboard skip-link, `:focus-visible`, 200% text/viewport zoom without clipping,
 * and `prefers-reduced-motion: reduce`.
 */
import AxeBuilder from '@axe-core/playwright';
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
  '#/ruta-no-existente-404'
] as const;

test.describe('F6-03: WCAG 2.2 AA Automated Axe Audit (14 routes + 404 × Dark & Light) + Keyboard & Zoom', () => {
  test.setTimeout(90_000);

  for (const theme of ['dark', 'light'] as const) {
    test(`Zero WCAG 2.2 A/AA axe-core violations across all 15 screens in ${theme} theme`, async ({ page }) => {
      await page.goto('/#/ajustes');
      await page.getByLabel('Tema').selectOption(theme);
      await expect(page.locator('body')).toHaveAttribute('data-theme', theme);

      const allViolations: string[] = [];
      for (const route of ALL_SCREENS) {
        await page.goto(`/${route}`);
        await expect(page.locator('#main-content')).toBeVisible();

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();

        for (const v of results.violations) {
          allViolations.push(
            `[${route}][${theme}] ${v.id} (${v.impact}): ${v.help} -> ${v.nodes.map((n) => n.html).join(' | ')}`
          );
        }
      }
      expect(allViolations, `WCAG 2.2 AA violations in ${theme} theme`).toEqual([]);
    });
  }

  test('Keyboard skip-link, :focus-visible outline, 200% zoom reflow, and prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#/inicio');

    // First Tab lands on skip-link ("Saltar al contenido") with visible focus indicator
    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Saltar al contenido' });
    await expect(skipLink).toBeFocused();
    const outlineStyle = await skipLink.evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outlineStyle).not.toBe('none');

    // Activating skip-link navigates focus/hash target to #main-content
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main-content$/);

    // Reduced motion collapses decorative hero Terra animation duration
    await page.goto('/#/inicio');
    const animDuration = await page
      .locator('.hero-terra')
      .evaluate((el) => parseFloat(getComputedStyle(el).animationDuration));
    expect(animDuration).toBeLessThan(0.05);

    // 200% zoom equivalent (640px CSS width + max fontScale 1.3): zero document horizontal overflow
    await page.goto('/#/ajustes');
    await page.getByLabel('Tamaño de texto').selectOption('1.3');
    await page.setViewportSize({ width: 640, height: 720 });
    for (const route of ['#/inicio', '#/aprender', '#/leccion/B04', '#/senior/S18', '#/progreso', '#/recursos']) {
      await page.goto(`/${route}`);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
      );
      expect(overflow, `200% zoom overflow on ${route}`).toBe(false);
    }
  });
});
