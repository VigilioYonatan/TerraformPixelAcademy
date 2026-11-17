import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

test.describe('BDD E2E HTTP: F3-08..F5-01 Pure Preact Routes, 18 Simulators, Modern Plan Semantics & 37/37 CLI Manifest', () => {
  test('F3-08: Desktop nav exposes Planes/Evidencias/Recursos; #/progreso shows 8 tracks; #/ajustes, #/recursos, and 404 work declaratively without overflow', async ({
    page
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.setViewportSize({ width: 1366, height: 860 });
    await page.goto('/#/progreso');

    // Desktop nav exposes Planes, Evidencias, and Recursos without horizontal scroll overflow
    await expect(page.locator('header .nav-links a[href="#/planes"]')).toBeVisible();
    await expect(page.locator('header .nav-links a[href="#/evidencias"]')).toBeVisible();
    await expect(page.locator('header .nav-links a[href="#/recursos"]')).toBeVisible();
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasOverflow).toBe(false);

    // 8 specialization tracks rendered on #/progreso
    await expect(page.locator('#profile-progress-page')).toBeVisible();
    await expect(page.locator('.track-progress-card')).toHaveCount(8);

    // #/ajustes switches theme and reduced motion declaratively
    await page.goto('/#/ajustes');
    await expect(page.locator('#settings-page')).toBeVisible();
    await page.getByLabel('Tema').selectOption('light');
    await expect(page.locator('body')).toHaveAttribute('data-theme', 'light');
    await page.locator('[data-action="toggle-motion"]').click();
    await expect(page.locator('body')).toHaveClass(/reduce-motion/);

    // #/recursos reactive glossary search preserves input focus
    await page.goto('/#/recursos');
    await expect(page.locator('#resources-page')).toBeVisible();
    const glossarySearch = page.getByLabel('Buscar glosario');
    await glossarySearch.fill('Ephemeral');
    await expect(glossarySearch).toBeFocused();
    await expect(page.locator('.glossary-tile')).toHaveCount(1);
    await expect(page.locator('.glossary-tile')).toContainText('Ephemeral');

    // Unknown route renders declarative NotFoundPage
    await page.goto('/#/ruta-inexistente-404');
    await expect(page.locator('#not-found-page')).toBeVisible();
    await expect(page.locator('#not-found-page')).toContainText('No encontré esta ruta');
    expect(errors).toEqual([]);
  });

  test('F4-01 & F4-02: Lesson A09 links directly to S14; Senior Hub filters by Crítico + IAM (S10); S10 OIDC & S16 GitOps simulators evaluate hypotheses', async ({
    page
  }) => {
    await page.goto('/#/leccion/A09');
    await page.locator('header [data-action="toggle-senior"]').click();

    const callout = page.locator('#lesson-senior-callout');
    await expect(callout).toBeVisible();
    await expect(callout).toContainText('Gobernanza FinOps');
    await expect(callout.locator('a[href="#/senior/S14"]')).toBeVisible();

    // Filter Senior Hub by Severity = Crítico and Pillar = IAM -> S10
    await page.goto('/#/senior');
    await page.locator('[data-action="senior-severity"][data-id="Crítico"]').click();
    await page.getByLabel('Filtrar por dominio técnico').selectOption('IAM');
    await expect(page.locator('.senior-case')).toHaveCount(1);
    await page.locator('.senior-case[href="#/senior/S10"]').click();

    // Run S10 OIDC simulator: default wildcard `*` is BLOCKED; scoped env subject is SAFE
    await expect(page.locator('[data-sim-case="S10"]')).toBeVisible();
    await page.locator('[data-action="run-case-sim"][data-id="S10"]').click();
    await expect(page.locator('#preact-senior-case .content-panel .alert')).toContainText('demasiado abierta');

    await page.getByLabel('Claim sub OIDC').fill('repo:vigilio/platform:environment:prod');
    await page.locator('[data-input="sim-bool"][data-id="oidcProtectedEnv"]').check();
    await page.locator('[data-action="run-case-sim"][data-id="S10"]').click();
    await expect(page.locator('#preact-senior-case .content-panel .alert')).toContainText('Federación OIDC acotada');

    // Verify S16 GitOps ownership simulator detects controller conflict vs clean boundary
    await page.goto('/#/senior/S16');
    await expect(page.locator('[data-sim-case="S16"]')).toBeVisible();
    await page.locator('[data-action="run-case-sim"][data-id="S16"]').click();
    await expect(page.locator('#preact-senior-case .content-panel .alert')).toContainText('GUERRA DE RECONCILIACIÓN');

    await page.locator('[data-input="sim-bool"][data-id="tfOwnsWorkloads"]').uncheck();
    await page.locator('[data-action="run-case-sim"][data-id="S16"]').click();
    await expect(page.locator('#preact-senior-case .content-panel .alert')).toContainText('Frontera limpia');
  });

  test('F4-03 & F5-01: #/planes surfaces delete-then-create, create-before-destroy & forget (STATE_FORGET); #/evidencias loads real 37/37 v1.10.5 CLI manifest', async ({
    page
  }) => {
    await page.goto('/#/planes');
    const modernPlan = Buffer.from(
      JSON.stringify({
        format_version: '1.2',
        terraform_version: '1.10.5',
        resource_changes: [
          { address: 'aws_db_instance.primary', change: { actions: ['delete', 'create'] } },
          { address: 'aws_launch_template.app', change: { actions: ['create', 'delete'] } },
          { address: 'aws_s3_bucket.detached', change: { actions: ['forget'] } }
        ]
      })
    );

    await page.locator('#user-plan-json').setInputFiles({
      name: 'modern-plan.json',
      mimeType: 'application/json',
      buffer: modernPlan
    });

    await expect(page.locator('#real-plan-review')).toContainText('replace (delete-then-create)');
    await expect(page.locator('#real-plan-review')).toContainText('replace (create-before-destroy)');
    await expect(page.locator('#real-plan-review')).toContainText('forget: 1');

    for (const key of [
      'provenanceVerified',
      'ownersApproved',
      'driftInvestigated',
      'destructiveReviewed',
      'rollbackDocumented',
      'costReviewed'
    ]) {
      await page.locator(`[data-input="gate-check"][data-id="${key}"]`).check();
    }
    await page.locator('[data-action="run-release-gate"]').click();
    await expect(page.locator('#release-gate .feedback')).toContainText('NEEDS_EVIDENCE');
    await expect(page.locator('#release-gate .feedback')).toContainText('STATE_FORGET');

    // Load real 37/37 Terraform v1.10.5 CLI manifest on #/evidencias
    await page.goto('/#/evidencias');
    const realManifestBytes = await readFile('assets/examples/cli-evidence-v1.10.5.json');
    await page.locator('#cli-manifest-file').setInputFiles({
      name: 'CLI-EVIDENCE-MANIFEST.json',
      mimeType: 'application/json',
      buffer: realManifestBytes
    });

    await expect(page.locator('#cli-evidence-dashboard')).toContainText('SIN ATESTACIÓN EXTERNA');
    await expect(page.locator('#cli-evidence-dashboard')).toContainText('Terraform declarado: Terraform v1.10.5');
    await expect(page.locator('#cli-evidence-dashboard .stat-pill .number').first()).toHaveText('37');
    await expect(page.locator('.evidence-row')).toHaveCount(37);
  });
});
