import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

test.describe('BDD E2E HTTP: Preact Views F3-03..F3-07 (Lesson, Games, 54 Labs, SVG Graph & Plan Gate)', () => {
  test('F3-03: LessonClassroom (#/leccion/B01 -> B02) keeps CodeMirror 6 mounted on Favorite/Quiz and switches cleanly across lessons', async ({
    page
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.goto('/#/leccion/B01');
    await expect(page.locator('#lesson-classroom')).toBeVisible();
    await expect(page.locator('.cm-editor')).toBeVisible();

    const favButton = page.locator('[data-action="favorite"]');
    await expect(favButton).toHaveAttribute('aria-pressed', 'false');
    await favButton.click();
    await expect(favButton).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.cm-editor')).toBeVisible();

    await page.getByRole('link', { name: /Siguiente: B02/i }).click();
    await expect(page.getByRole('heading', { name: /Instalación y CLI/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Editor main.tf' })).toContainText('terraform {');
    expect(errors).toEqual([]);
  });

  test('F3-04: GamesHub (#/juegos) and GameStage (#/juego/g1) complete full playthrough without inflating XP on replay', async ({
    page
  }) => {
    await page.goto('/#/juegos');
    await expect(page.locator('#games-hub')).toBeVisible();
    await expect(page.locator('.game-card')).toHaveCount(5);

    await page.locator('a[href="#/juego/g1"]').click();
    await expect(page.locator('#game-stage-active')).toBeVisible();

    // Answer all 5 questions in g1 correctly ([0, 1, 1, 0, 1]) -> wins game (+100 XP)
    const correctIndices = [0, 1, 1, 0, 1];
    for (const idx of correctIndices) {
      await page.locator(`[data-action="game-answer"][data-index="${idx}"]`).click();
      await expect(page.locator('#game-stage-active .feedback')).toBeVisible();
      await page.locator('[data-action="next-game"]').click();
    }

    await expect(page.locator('#game-stage-result')).toBeVisible();
    await expect(page.locator('#game-stage-result')).toContainText('¡Reto superado!');
    await page.goto('/#/progreso');
    await expect(page.locator('.stat-pill .number').first()).toHaveText('100');

    // Replay g1 with exact same winning answers -> XP must NOT inflate above 100 XP
    await page.goto('/#/juego/g1');
    await page.getByRole('button', { name: /Volver a jugar/i }).click();
    await expect(page.locator('#game-stage-active')).toBeVisible();
    await expect(page.locator('#game-stage-active')).toContainText('Pregunta 1/5');
    for (const idx of correctIndices) {
      await page.locator(`[data-action="game-answer"][data-index="${idx}"]`).click();
      await page.locator('[data-action="next-game"]').click();
    }
    await expect(page.locator('#game-stage-result')).toBeVisible();
    await page.goto('/#/progreso');
    await expect(page.locator('.stat-pill .number').first()).toHaveText('100');
  });

  test('F3-05: LabsDirectory (#/laboratorios) exposes all 54 ZIPs (36 B/I/A + 18 Senior), filters by category/search, and downloads S18.zip', async ({
    page
  }) => {
    await page.goto('/#/laboratorios');
    await expect(page.locator('#labs-directory')).toBeVisible();
    await expect(page.locator('.lab-pack-row')).toHaveCount(36);
    await expect(page.locator('.senior-pack-row')).toHaveCount(18);

    // Filter to Senior Mode (18)
    await page.locator('[data-action="labs-category"][data-id="Senior"]').click();
    await expect(page.locator('.lab-pack-row')).toHaveCount(0);
    await expect(page.locator('.senior-pack-row')).toHaveCount(18);

    // Search for S18 and verify real HTTP ZIP download
    const search = page.getByLabel('Buscar paquetes de laboratorio');
    await search.fill('S18');
    await expect(search).toBeFocused();
    await expect(page.locator('.senior-pack-row')).toHaveCount(1);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('.senior-pack-row a[download="S18-incident.zip"]').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('S18-incident.zip');
  });

  test('F3-06: GraphExplorer (#/grafo) supports keyboard Arrow navigation across SVG nodes and flags circular topology', async ({
    page
  }) => {
    await page.goto('/#/grafo');
    await expect(page.locator('#graph-explorer')).toBeVisible();

    const vpcNode = page.locator('g.graph-node[data-id="vpc"]');
    await vpcNode.focus();
    await expect(vpcNode).toBeFocused();
    await expect(page.locator('.graph-detail')).toContainText('VPC');

    // Press ArrowRight -> moves selection and DOM focus to second node (`subnet`)
    await page.keyboard.press('ArrowRight');
    const subnetNode = page.locator('g.graph-node[data-id="subnet"]');
    await expect(subnetNode).toBeFocused();
    await expect(page.locator('.graph-detail')).toContainText('Subnet');
    await expect(page.locator('.graph-detail')).toContainText('Depende de: VPC');

    // Switch to circular dependency topology and verify cycle alert
    await page.locator('[data-action="graph"][data-id="cycle"]').click();
    await expect(page.locator('#graph-explorer .alert')).toContainText('Dependencia circular detectada');
  });

  test('F3-07: PlansExplorerPage (#/planes) inspects local plan.json without leaking secrets and runs SeniorReleaseGate', async ({
    page
  }) => {
    await page.goto('/#/planes');
    await expect(page.locator('#plans-explorer-page')).toBeVisible();

    await page.locator('[data-action="reveal-plan"]').click();
    await expect(page.locator('.plan-resource .risk').first()).toBeVisible();

    const canary = 'CANARY_E2E_SECRET_DO_NOT_LEAK_555';
    const planPayload = Buffer.from(
      JSON.stringify({
        format_version: '1.2',
        terraform_version: '1.10.5',
        variables: { secret_key: { value: canary } },
        resource_changes: [
          {
            address: 'terraform_data.critical',
            provider_name: 'terraform.io/builtin/terraform',
            change: {
              actions: ['delete', 'create'],
              before: { secret: canary }
            }
          }
        ],
        resource_drift: [
          {
            address: 'terraform_data.drifted_tag',
            change: { actions: ['update'], before: { secret: canary } }
          }
        ]
      })
    );

    await page.locator('#user-plan-json').setInputFiles({
      name: 'plan.json',
      mimeType: 'application/json',
      buffer: planPayload
    });

    await expect(page.locator('#release-gate')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(canary);

    await page.locator('[data-action="run-release-gate"]').click();
    await expect(page.locator('#release-gate .feedback h3')).toHaveText('BLOCKED');

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
    await expect(page.locator('#release-gate .feedback h3')).toHaveText('READY_FOR_HUMAN_REVIEW');

    // Export Markdown gate report and verify zero secret leakage
    const dlPromise = page.waitForEvent('download');
    await page.locator('[data-action="export-release-gate"]').click();
    const dl = await dlPromise;
    const savedPath = await dl.path();
    expect(savedPath).toBeTruthy();
    if (savedPath) {
      const mdContent = await readFile(savedPath, 'utf8');
      expect(mdContent).toContain('READY_FOR_HUMAN_REVIEW');
      expect(mdContent).not.toContain(canary);
    }
  });
});
