import { expect, test } from '@playwright/test';

test.describe('BDD E2E HTTP: Preact Home, Reactive Store, and Real CodeMirror 6 HCL Editor (F2-01..F3-02)', () => {
  test('Landing (#/inicio) and Catalog (#/aprender) render in Preact with live reactive search and zero page errors', async ({
    page
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/#/inicio');
    await expect(page.locator('#home-landing')).toBeVisible();
    await expect(page.getByRole('heading', { name: /TerraPixel\s*Academy/i })).toBeVisible();

    await page.getByRole('link', { name: /Empezar gratis/i }).click();
    await expect(page.locator('#learning-catalog')).toBeVisible();

    const searchInput = page.getByLabel('Buscar lecciones');
    await searchInput.fill('Data sources');
    await expect(searchInput).toBeFocused();
    await expect(page.locator('.lesson-tile')).toHaveCount(1);
    await expect(page.locator('.lesson-tile').first()).toContainText('I03');

    await searchInput.fill('termino-inexistente-xyz');
    await expect(page.getByRole('status')).toContainText('Sin coincidencias');
    expect(pageErrors).toEqual([]);
  });

  test('CodeMirror 6 mounts over HTTP with HCL highlighting, Undo/Redo, Escape+Tab focus exit (WCAG 2.1.2), Dark/Light theme, and badge revocation', async ({
    page
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/#/leccion/B04');
    const cmEditor = page.locator('.cm-editor');
    await expect(cmEditor).toBeVisible();
    await expect(cmEditor).toHaveAttribute('data-editor-theme', 'dark');
    await expect(page.locator('.editor-tag')).toContainText('CodeMirror 6');
    await expect(page.locator('.cm-lineNumbers .cm-gutterElement', { hasText: /^1$/ })).toBeVisible();
    await expect(page.locator('.cm-content .tok-keyword').first()).toBeVisible();

    const textbox = page.getByRole('textbox', { name: 'Editor main.tf' });
    await textbox.click();
    await page.keyboard.press('Control+a');
    const validHcl = [
      'resource "terraform_data" "demo" {',
      '  input = "Hola, Terraform"',
      '}',
      'output "saludo" {',
      '  value = terraform_data.demo.output',
      '}'
    ].join('\n');
    await page.keyboard.insertText(validHcl);
    await expect(textbox).toContainText('input = "Hola, Terraform"');

    // Verify Undo & Redo inside CodeMirror 6 history
    await page.keyboard.press('Enter');
    await page.keyboard.type('# nota temporal');
    await expect(textbox).toContainText('# nota temporal');
    await page.keyboard.press('Control+z');
    await expect(textbox).not.toContainText('# nota temporal');
    await page.keyboard.press('Control+y');
    await expect(textbox).toContainText('# nota temporal');

    // Verify WCAG 2.1.2 No Keyboard Trap: Escape releases Tab so next Tab focuses toolbar button
    await page.keyboard.press('Escape');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /Evaluar reglas/i })).toBeFocused();

    // Evaluate HCL rules + answer quiz to complete B04
    await page.keyboard.press('Enter');
    await expect(page.locator('.feedback').first()).toContainText('Reglas educativas superadas');
    await page.getByRole('button', { name: /En el equipo del alumno o CI/i }).click();
    await expect(page.locator('#toast')).toContainText('¡Lección B04 completada!');
    await expect(page.locator('.lesson-header')).toContainText('Completada');

    // Switch theme in #/ajustes to Light and verify CM6 Compartment switches to light theme & preserves code
    await page.goto('/#/ajustes');
    await page.getByLabel('Tema').selectOption('light');
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'light');

    await page.goto('/#/leccion/B04');
    await expect(page.locator('.cm-editor')).toHaveAttribute('data-editor-theme', 'light');
    await expect(page.locator('.cm-editor')).toHaveClass(/cm-terrapixel-light/);
    await expect(page.getByRole('textbox', { name: 'Editor main.tf' })).toContainText('Hola, Terraform');

    // Break required HCL rule and verify completion badge is immediately revoked
    await page.getByRole('textbox', { name: 'Editor main.tf' }).click();
    await page.keyboard.press('Control+a');
    await page.keyboard.insertText('resource "terraform_data" "demo" {}');
    await expect(page.locator('.lesson-header')).not.toContainText('Completada');
    expect(pageErrors).toEqual([]);
  });

  test('Senior Case S01 updates ADR count, gate button, and completion revocation declaratively via store', async ({
    page
  }) => {
    await page.goto('/#/senior/S01');
    await page.locator('[data-action="what-if-answer"][data-index="0"]').click();
    await page.locator('[data-action="case-tab"][data-id="decision"]').first().click();
    await page.locator('[data-action="case-decision"][data-index="1"]').click();
    for (let i = 0; i < 4; i++) {
      await page.locator(`[data-input="case-check"][data-index="${i}"]`).check();
    }
    await page.locator('[data-action="case-tab"][data-id="evidencia"]').first().click();
    const adrField = page.locator('#senior-evidence');
    await adrField.fill(
      [
        'Contexto: cambio de claves en for_each altera las direcciones de estado.',
        'Decisión: bloquear apply directo y declarar bloques moved auditados.',
        'Riesgos: destruccion accidental y corte del servicio productivo.',
        'Evidencia: NOT_RUN en Terraform CLI; validado sobre fixture educativo.',
        'Rollback: revertir PR y conservar estado previo respaldado.'
      ].join('\n')
    );
    await expect(adrField).toBeFocused();
    const finishBtn = page.locator('[data-action="finish-case"]');
    await expect(finishBtn).toBeEnabled();
    await finishBtn.click();
    await expect(page.locator('#current-case-status')).toContainText('Autoevaluado');

    // Invalidating ADR revokes completion declaratively without manual .innerHTML hacks
    await adrField.fill('Texto demasiado corto sin secciones.');
    await expect(finishBtn).toBeDisabled();
    await expect(page.locator('#current-case-status')).toContainText('Caso abierto');
  });
});
