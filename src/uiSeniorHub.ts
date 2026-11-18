/** Senior dashboard as native, declarative Preact UI with search, severity, and pillar filters (`F4-02`). */
import type { AcademyState } from './engine.js';
import type { Case } from './senior.js';
import { filterSeniorCases } from './store.js';
import { ROUTES, renderInlineText } from './uiShared.js';
import { h } from './vendor/preact.mjs';

export interface SeniorHubProps {
  state: AcademyState;
  cases: readonly Case[];
  searchQuery?: string;
  severityFilter?: string;
  pillarFilter?: string;
}

const SEVERITY_TABS = ['Todas', 'Crítico', 'Alto'] as const;

function chip(value: string, tone = 'purple') {
  return h('span', { className: `chip chip-${tone}` }, value);
}

function stat(value: string | number, description: string, icon: string) {
  return h(
    'div',
    { className: 'stat-pill' },
    h('span', { className: 'icon-hub' }, icon),
    h('div', {}, h('div', { className: 'number' }, String(value)), h('div', { className: 'caption' }, description))
  );
}

export function SeniorDashboard({
  state,
  cases,
  searchQuery = '',
  severityFilter = 'Todas',
  pillarFilter = 'Todos'
}: SeniorHubProps) {
  const completed = state.seniorCompleted.length;
  const pillars = ['Todos', ...new Set(cases.map((c) => c.pillar))];
  const filteredCases = filterSeniorCases(cases, searchQuery, severityFilter, pillarFilter);

  return h(
    'div',
    { id: 'senior-dashboard' },
    h('div', { className: 'breadcrumb' }, h('a', { href: ROUTES.home }, 'Inicio'), ' / ', h('span', {}, 'Senior Mode')),
    h(
      'section',
      { className: 'senior-hero' },
      h(
        'div',
        {},
        h('div', { className: 'eyebrow eyebrow-senior-hero' }, '♛ TERRAPIXEL · SENIOR MODE'),
        h('h1', {}, 'Decide como un', h('br', {}), h('span', { className: 'accent-senior-hero' }, 'Platform Engineer')),
        h(
          'p',
          { className: 'hero-desc' },
          'Investiga incidentes de Terraform, revisa planes, protege el state y defiende tus decisiones con evidencia.'
        ),
        h(
          'div',
          { className: 'flex-wrap' },
          h(
            'button',
            { type: 'button', className: 'btn btn-primary', 'data-action': 'toggle-senior' },
            state.seniorEnabled ? '✓ Senior Mode activo' : 'Activar Senior Mode'
          ),
          h('a', { className: 'btn btn-ghost', href: '#/senior/S01' }, 'Empezar S01 →'),
          h(
            'button',
            { type: 'button', className: 'btn btn-soft', 'data-action': 'export-portfolio' },
            '↓ Portafolio Senior (18 ADR)'
          ),
          h('a', { className: 'btn btn-soft', href: ROUTES.plan }, 'Revisar gate de plan →'),
          h('a', { className: 'btn btn-soft', href: ROUTES.evidence }, 'Evidencias CLI →')
        )
      ),
      h('img', { src: './assets/terra/senior.png', alt: 'Terra, ingeniero Senior en pixel art' })
    ),
    h('div', { className: 'space24' }),
    h(
      'div',
      { className: 'cards-4' },
      stat(cases.length, 'Escenarios', '♛'),
      stat(pillars.length - 1, 'Dominios técnicos', '⚑'),
      stat(completed, 'Casos autoevaluados', '✓'),
      stat(`${Math.round((completed / Math.max(1, cases.length)) * 100)}%`, 'Avance Senior', '✦')
    ),
    h('div', { className: 'space24' }),
    h(
      'div',
      { className: 'notice' },
      'Una autoevaluación comprueba respuestas y formato del ADR. NO verifica semánticamente evidencias ni acredita experiencia profesional. Las simulaciones no ejecutan Terraform real.'
    ),
    h(
      'section',
      { className: 'section' },
      h(
        'div',
        { className: 'section-heading' },
        h(
          'div',
          {},
          h('div', { className: 'eyebrow' }, '18 ESCENARIOS · INFRASTRUCTURE AS CODE'),
          h('h2', {}, 'Mapa Senior')
        ),
        chip(`${completed}/${cases.length} completados`)
      ),
      h(
        'div',
        { className: 'senior-toolbar' },
        h(
          'div',
          { className: 'tabs tabs-flush' },
          ...SEVERITY_TABS.map((sev) =>
            h(
              'button',
              {
                key: sev,
                type: 'button',
                className: `tab ${severityFilter === sev ? 'active' : ''}`.trim(),
                'data-action': 'senior-severity',
                'data-id': sev,
                'aria-pressed': String(severityFilter === sev)
              },
              sev === 'Todas' ? 'Severidad: Todas' : sev
            )
          )
        ),
        h(
          'div',
          { className: 'senior-toolbar-controls' },
          h(
            'select',
            {
              id: 'senior-pillar-filter',
              className: 'input-select',
              'data-input': 'senior-pillar',
              'aria-label': 'Filtrar por dominio técnico',
              value: pillarFilter
            },
            ...pillars.map((pillar) =>
              h(
                'option',
                { key: pillar, value: pillar, selected: pillarFilter === pillar },
                pillar === 'Todos' ? 'Dominio: Todos' : pillar
              )
            )
          ),
          h('input', {
            id: 'senior-search',
            type: 'search',
            className: 'search-bar',
            value: searchQuery,
            placeholder: 'Buscar incidentes, dominios o controles…',
            'aria-label': 'Buscar casos Senior'
          })
        )
      ),
      filteredCases.length > 0
        ? h(
            'div',
            { className: 'cards-3', id: 'senior-case-list' },
            ...filteredCases.map((c) => {
              const done = state.seniorCompleted.includes(c.id);
              const cleanSummary = c.subtitle.replace(/^Contexto:\s*/i, '');
              return h(
                'a',
                {
                  key: c.id,
                  href: `#/senior/${c.id}`,
                  className: 'senior-case',
                  'data-severity': done ? 'done' : c.severity,
                  'data-title': `${c.id} ${c.title} ${c.pillar} ${c.subtitle}`.toLowerCase()
                },
                h('span', { className: 'senior-case-num', 'aria-hidden': 'true' }, c.id.replace('S', '')),
                h(
                  'div',
                  { className: 'flex space-between' },
                  chip(c.id),
                  chip(
                    done ? '✓ Autoevaluado' : c.severity,
                    done ? 'green' : c.severity === 'Crítico' ? 'red' : 'yellow'
                  )
                ),
                h('div', { className: 'eyebrow eyebrow-xs' }, c.pillar),
                h('h3', {}, ...renderInlineText(c.title)),
                h('p', {}, ...renderInlineText(cleanSummary)),
                h(
                  'div',
                  { className: 'flex space-between' },
                  h('span', { className: 'xp-pill small-note' }, `${c.xp} XP`),
                  h('span', { className: 'color-purple link-cta-sm' }, 'Abrir caso →')
                )
              );
            })
          )
        : h(
            'div',
            { className: 'card', role: 'status' },
            h('h3', { className: 'card-title' }, 'Sin casos coincidentes'),
            h('p', { className: 'card-desc' }, 'No hay escenarios Senior que coincidan con tu filtro.')
          )
    ),
    h(
      'section',
      { className: 'section' },
      h(
        'div',
        { className: 'senior-banner' },
        h(
          'div',
          {},
          h('div', { className: 'eyebrow' }, 'CAPSTONE S18 · OCHO HITOS'),
          h('h3', {}, 'Diseña una plataforma IaC con límites claros'),
          h('p', {}, 'Estados, módulos, controles, costos y recuperación documentados en un laboratorio local.'),
          h('div', { className: 'space16' }),
          h('a', { href: '#/senior/S18', className: 'btn btn-primary' }, 'Abrir proyecto final →')
        ),
        h('img', { src: './assets/terra/graduacion.png', alt: 'Terra celebra su graduación' })
      )
    )
  );
}
