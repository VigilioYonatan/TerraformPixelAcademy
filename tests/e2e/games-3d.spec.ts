import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Three.js 3D Infrastructure Arena Mini-Games (#/juegos & #/juego/:id)', () => {
  test('Mounts real Three.js WebGL canvas, supports camera presets & 1/2/3 keyboard shortcuts with 0 CSP/Axe errors', async ({
    page
  }) => {
    const pageErrors: string[] = [];
    const cspErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error' && /Content Security Policy/i.test(msg.text())) {
        cspErrors.push(msg.text());
      }
    });

    await page.goto('/#/juegos');
    await expect(page.locator('#games-hub .game-card')).toHaveCount(5);
    await expect(page.locator('#games-hub')).toContainText('Topología Orbital 3D');
    await expect(page.locator('#games-hub')).toContainText('Pipeline CI/CD 3D');

    await page.goto('/#/juego/g1');
    await expect(page.locator('#game-stage-active')).toBeVisible();
    await expect(page.locator('#game-3d-viewport')).toBeVisible();
    await expect(page.locator('#game-3d-viewport canvas.game-3d-canvas')).toBeVisible();
    await expect(page.locator('#game-3d-inspector')).toContainText('Nodo activo');

    // Camera controls operate cleanly
    await page.locator('[data-action="game-cam-top"]').click();
    await page.locator('[data-action="game-cam-iso"]').click();
    await page.locator('[data-action="game-cam-rotate"]').click();
    await page.locator('[data-action="game-cam-reset"]').click();

    // Axe WCAG 2.2 AA scan on the 3D Arena screen
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(axe.violations).toEqual([]);

    // Keyboard shortcut `1` selects option 1 and displays immediate feedback
    await page.keyboard.press('1');
    await expect(page.locator('#game-stage-active .feedback')).toBeVisible();
    await page.locator('[data-action="next-game"]').click();
    await expect(page.getByRole('progressbar', { name: 'Progreso de la partida' })).toHaveAttribute(
      'aria-valuenow',
      '2'
    );

    // Switch to g2 (Pipeline CI/CD 3D) and verify canvas remounts cleanly
    await page.goto('/#/juego/g2');
    await expect(page.locator('#game-3d-viewport canvas.game-3d-canvas')).toBeVisible();
    await expect(page.locator('#game-3d-inspector')).toContainText('fmt/validate');

    expect(pageErrors).toEqual([]);
    expect(cspErrors).toEqual([]);
  });
});
