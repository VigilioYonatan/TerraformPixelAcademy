/**
 * Declarative Preact Plan Explorer, Local `terraform show -json` Inspector,
 * and Senior Release Gate (`#/planes` — `F3-07`).
 * Strict metadata-only boundary: never reads or renders `before`, `after`,
 * `variables`, `outputs`, or embedded credentials; never authorizes `terraform apply`.
 */
import type { PlanFixture } from './fixtures.js';
import type { PlanAnalysis } from './planInspector.js';
import type { GateAnswers, GateReview } from './releaseGate.js';
import { ROUTES } from './uiShared.js';
import { h } from './vendor/preact.mjs';

export interface PlanFixturesPanelProps {
  fixtures: readonly PlanFixture[];
  selectedPlanId: string;
  showPlanRisks: boolean;
}

export interface SeniorReleaseGateProps {
  gateAnswers: GateAnswers;
  gateReview: GateReview | null;
}

export interface LocalPlanInspectorProps {
  userPlan: PlanAnalysis | null;
  userPlanError: string;
  gateAnswers: GateAnswers;
  gateReview: GateReview | null;
}

export interface PlansExplorerPageProps {
  fixtures: readonly PlanFixture[];
  selectedPlanId: string;
  showPlanRisks: boolean;
  userPlan: PlanAnalysis | null;
  userPlanError: string;
  gateAnswers: GateAnswers;
  gateReview: GateReview | null;
}

const ACTION_SYMBOLS: Readonly<Record<string, string>> = {
  create: '+',
  update: '~',
  delete: '−',
  replace: '−/+',
  'no-op': '='
};

const ACTION_SPANISH: Readonly<Record<string, string>> = {
  create: 'Crear',
  update: 'Actualizar',
  delete: 'Eliminar',
  replace: 'Reemplazar',
  'no-op': 'Sin cambios'
};

const GATE_CONTROLS: ReadonlyArray<readonly [keyof Omit<GateAnswers, 'environment'>, string]> = [
  ['provenanceVerified', 'Cotejé origen, commit, workspace y digest del plan'],
  ['ownersApproved', 'Owners del entorno revisaron el cambio'],
  ['driftInvestigated', 'Investigación del drift documentada'],
  ['destructiveReviewed', 'Revisé los reemplazos/eliminaciones por recurso'],
  ['rollbackDocumented', 'Runbook, rollback y condiciones de parada documentados'],
  ['costReviewed', 'Revisé costos, cuotas y presupuesto']
];

function chip(text: string, variant = 'purple') {
  return h('span', { className: `chip chip-${variant}` }, text);
}

export function PlanFixturesPanel({ fixtures, selectedPlanId, showPlanRisks }: PlanFixturesPanelProps) {
  const fixture = fixtures.find((p) => p.id === selectedPlanId) || fixtures[0];
  if (!fixture) {
    return h(
      'div',
      { className: 'content-panel', role: 'status' },
      h('h2', {}, 'Sin planes sintéticos disponibles'),
      h('p', { className: 'prose' }, 'No se encontraron escenarios sintéticos de plan para previsualizar.')
    );
  }
  const risky = fixture.resources.filter((r) => r.action === 'delete' || r.action === 'replace').length;

  return h(
    'div',
    { className: 'plan-layout' },
    h(
      'aside',
      { className: 'fixture-menu', 'aria-label': 'Planes sintéticos de estudio' },
      ...fixtures.map((p) =>
        h(
          'button',
          {
            key: p.id,
            type: 'button',
            className: `fixture-select ${p.id === fixture.id ? 'active' : ''}`.trim(),
            'data-action': 'plan',
            'data-id': p.id,
            'aria-pressed': String(p.id === fixture.id)
          },
          h('strong', {}, p.title),
          h('small', {}, `${p.environment} · ${p.resources.length} recursos`)
        )
      )
    ),
    h(
      'div',
      { className: 'content-panel' },
      h(
        'div',
        { className: 'flex space-between' },
        h(
          'div',
          {},
          h('div', { className: 'eyebrow' }, `PLAN DIDÁCTICO · ${fixture.environment.toUpperCase()}`),
          h('h2', { style: 'margin-top:8px' }, fixture.title)
        ),
        chip('SYNTHETIC_FIXTURE', 'yellow')
      ),
      h('p', { className: 'prose' }, fixture.summary),
      h('div', { className: 'space16' }),
      h(
        'div',
        { className: 'plan-toolbar' },
        chip(`${fixture.resources.length} recursos`, 'purple'),
        chip(`${risky} operaciones destructivas`, risky ? 'red' : 'green'),
        h(
          'button',
          {
            type: 'button',
            className: 'btn btn-sm btn-soft',
            'data-action': 'reveal-plan',
            'aria-pressed': String(showPlanRisks)
          },
          showPlanRisks ? 'Ocultar análisis' : 'Mostrar análisis de riesgo'
        )
      ),
      h('div', { className: 'space16' }),
      ...fixture.resources.map((r) =>
        h(
          'div',
          { key: r.name, className: 'plan-resource' },
          h(
            'div',
            { className: 'plan-resource-head' },
            h(
              'code',
              {},
              h('strong', { className: `action-${r.action}` }, ACTION_SYMBOLS[r.action] || '?'),
              ` ${r.name}`
            ),
            chip(
              ACTION_SPANISH[r.action] || r.action,
              r.action === 'replace' || r.action === 'delete' ? 'red' : r.action === 'create' ? 'green' : 'cyan'
            )
          ),
          h('div', { className: 'detail' }, r.detail),
          showPlanRisks ? h('div', { className: 'risk' }, `⚑ ${r.risk}`) : null
        )
      ),
      h(
        'div',
        { className: 'notice' },
        'La clasificación de operaciones se realiza sobre datos preparados. Un plan real debe revisarse desde un origen autorizado, con entorno y versión exactos.'
      )
    )
  );
}

export function SeniorReleaseGate({ gateAnswers, gateReview }: SeniorReleaseGateProps) {
  return h(
    'div',
    { className: 'release-gate', id: 'release-gate' },
    h('div', { className: 'eyebrow' }, 'SENIOR · RELEASE GATE'),
    h('h3', {}, '¿Este plan estaría listo para revisión humana?'),
    h(
      'p',
      { className: 'small-note' },
      'Evaluación local orientativa: los controles marcados son declaraciones tuyas, no verificaciones externas. Nunca concede permiso de apply.'
    ),
    h('label', { className: 'field-label', htmlFor: 'review-environment' }, 'Ambiente declarado'),
    h(
      'select',
      {
        className: 'search-bar',
        id: 'review-environment',
        'data-input': 'review-environment',
        value: gateAnswers.environment
      },
      h('option', { value: 'prod', selected: gateAnswers.environment === 'prod' }, 'Producción'),
      h('option', { value: 'staging', selected: gateAnswers.environment === 'staging' }, 'Staging'),
      h('option', { value: 'dev', selected: gateAnswers.environment === 'dev' }, 'Development')
    ),
    ...GATE_CONTROLS.map(([key, labelText]) =>
      h(
        'label',
        { key, className: 'check-row' },
        h('input', {
          type: 'checkbox',
          'data-input': 'gate-check',
          'data-id': key,
          checked: gateAnswers[key]
        }),
        labelText
      )
    ),
    h(
      'div',
      { className: 'flex-wrap', style: 'margin-top:10px' },
      h(
        'button',
        { type: 'button', className: 'btn btn-primary', 'data-action': 'run-release-gate' },
        'Evaluar gate didáctico →'
      ),
      gateReview
        ? h(
            'button',
            { type: 'button', className: 'btn btn-soft', 'data-action': 'export-release-gate' },
            '↓ Informe gate .md'
          )
        : null
    ),
    gateReview
      ? h(
          'div',
          {
            className: `feedback ${gateReview.status === 'READY_FOR_HUMAN_REVIEW' ? '' : 'fail'}`.trim(),
            role: 'status',
            'aria-live': 'polite'
          },
          h('h3', {}, gateReview.status),
          h('p', {}, `${gateReview.checksPassed}/${gateReview.checksRequired} controles declarados`),
          ...gateReview.findings.map((f) =>
            h(
              'div',
              { key: `${f.id}-${f.message.slice(0, 20)}`, className: 'side-step' },
              `${f.id} (${f.severity}): ${f.message}`
            )
          )
        )
      : null
  );
}

export function LocalPlanInspector({ userPlan, userPlanError, gateAnswers, gateReview }: LocalPlanInspectorProps) {
  const summaryBadges = userPlan
    ? Object.entries(userPlan.summary)
        .filter(([, num]) => num > 0)
        .map(([name, num]) =>
          h(
            'span',
            {
              key: name,
              className: `chip chip-${name === 'delete' || name === 'replace' ? 'red' : 'cyan'}`
            },
            `${name}: ${num}`
          )
        )
    : [];

  return h(
    'section',
    { className: 'content-panel', style: 'margin-top:24px', id: 'real-plan-review' },
    h(
      'div',
      { className: 'flex space-between' },
      h(
        'div',
        {},
        h('div', { className: 'eyebrow' }, 'ANÁLISIS LOCAL · ARCHIVO DEL ESTUDIANTE'),
        h('h2', { style: 'margin:8px 0' }, 'Inspeccionar terraform show -json')
      ),
      chip('SIN SUBIR A SERVIDOR', 'green')
    ),
    h(
      'p',
      { className: 'prose' },
      'Carga un ',
      h('code', {}, 'plan.json'),
      ' generado en tu propio entorno con ',
      h('code', {}, 'terraform show -json plan.tfplan > plan.json'),
      '. La app analiza operaciones y drift declarados, sin leer valores before/after, variables ni outputs. ',
      h('strong', {}, 'Los nombres y direcciones pueden revelar información interna.')
    ),
    h('label', { className: 'field-label', htmlFor: 'user-plan-json' }, 'Archivo local plan.json (máx. 5 MB)'),
    h('input', {
      type: 'file',
      id: 'user-plan-json',
      accept: '.json,application/json',
      'aria-label': 'Seleccionar plan JSON de Terraform'
    }),
    h('div', { className: 'space12' }),
    h(
      'div',
      { className: 'flex-wrap' },
      h(
        'button',
        { type: 'button', className: 'btn btn-sm', 'data-action': 'clear-user-plan' },
        'Olvidar archivo analizado'
      ),
      userPlan
        ? h(
            'button',
            { type: 'button', className: 'btn btn-sm btn-primary', 'data-action': 'export-user-plan' },
            '↓ Informe local (.md)'
          )
        : null,
      h(
        'a',
        {
          className: 'btn btn-sm btn-soft',
          href: './assets/examples/plan-sintetico.json',
          download: 'plan-sintetico.json'
        },
        '↓ Ejemplo plan-sintetico.json'
      )
    ),
    userPlanError ? h('div', { className: 'alert', role: 'alert', style: 'margin-top:12px' }, userPlanError) : null,
    userPlan ? h(SeniorReleaseGate, { gateAnswers, gateReview }) : null,
    userPlan
      ? h(
          'div',
          {},
          h(
            'div',
            { className: 'notice', role: 'status', style: 'margin-top:15px' },
            h('b', {}, 'Procedencia: USER_SUPPLIED_TERRAFORM_JSON'),
            ` · Terraform ${userPlan.terraformVersion} · ${userPlan.total} cambios · ${userPlan.destructive} destructivos · ${userPlan.sensitiveCount} marcados sensitive · ${userPlan.driftCount} eventos drift. No se verifica ejecución cloud.`
          ),
          h('div', { className: 'flex-wrap', style: 'margin:16px 0' }, ...summaryBadges),
          h(
            'div',
            { className: 'plan-import-results' },
            ...userPlan.changes.map((item, idx) =>
              h(
                'div',
                { key: `chg-${item.address}-${idx}`, className: 'plan-resource' },
                h(
                  'div',
                  { className: 'plan-resource-head' },
                  h('code', {}, item.address),
                  h(
                    'div',
                    { className: 'flex-wrap' },
                    chip(
                      item.replaceOrder ? `${item.kind} (${item.replaceOrder})` : item.kind,
                      item.kind === 'delete' || item.kind === 'replace'
                        ? 'red'
                        : item.kind === 'forget'
                          ? 'yellow'
                          : 'cyan'
                    )
                  )
                ),
                h(
                  'div',
                  { className: 'detail' },
                  `Provider: ${item.provider} · ${item.sensitive ? 'Datos sensibles presentes (no mostrados)' : 'Sin indicador sensitive en el cambio'}`
                )
              )
            )
          ),
          h('div', { className: 'notice' }, ...userPlan.notices.map((note) => h('p', { key: note }, note))),
          userPlan.driftCount > 0
            ? h(
                'div',
                {},
                h('h3', { style: 'margin:16px 0 10px' }, 'Drift reportado por Terraform (metadatos)'),
                h(
                  'div',
                  { className: 'plan-import-results' },
                  ...userPlan.drift.map((item, idx) =>
                    h(
                      'div',
                      { key: `drift-${item.address}-${idx}`, className: 'plan-resource' },
                      h('code', {}, item.address),
                      ' ',
                      chip(item.kind, item.kind === 'delete' || item.kind === 'replace' ? 'red' : 'yellow')
                    )
                  )
                )
              )
            : null
        )
      : null
  );
}

export function PlansExplorerPage({
  fixtures,
  selectedPlanId,
  showPlanRisks,
  userPlan,
  userPlanError,
  gateAnswers,
  gateReview
}: PlansExplorerPageProps) {
  return h(
    'div',
    { id: 'plans-explorer-page' },
    h(
      'div',
      { className: 'breadcrumb' },
      h('a', { href: ROUTES.home }, 'Inicio'),
      ' / ',
      h('span', {}, 'Plan Explorer')
    ),
    h('div', { className: 'eyebrow' }, 'LEER ANTES DE APLICAR'),
    h('h1', { className: 'page-title' }, 'Plan Explorer'),
    h(
      'p',
      { className: 'page-lead' },
      'Compara operaciones de infraestructura y detecta cambios peligrosos. Todos los planes de la galería superior son ',
      h('strong', {}, 'sintéticos'),
      ' para aprendizaje, no resultados de Terraform CLI.'
    ),
    h('div', { className: 'space24' }),
    h(PlanFixturesPanel, { fixtures, selectedPlanId, showPlanRisks }),
    h('div', { className: 'space24' }),
    h(LocalPlanInspector, { userPlan, userPlanError, gateAnswers, gateReview }),
    h('div', { className: 'space24' }),
    h('a', { href: '#/senior/S11', className: 'btn btn-primary' }, 'Resolver caso S11: plan integrity →')
  );
}
