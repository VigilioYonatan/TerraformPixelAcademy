/**
 * Declarative Preact Landing view (`#/inicio` — `F3-02`).
 * Renders hero, 3-tier learning map, Terra feature cards, live KPI progress,
 * and Senior Mode callout without raw HTML string concatenation.
 */
import type { Lesson } from './curriculum.js';
import { calculateXP, type AcademyState } from './engine.js';
import type { HomeShowcaseTab } from './store.js';
import { ROUTES, mascotUrl } from './uiShared.js';
import { h } from './vendor/preact.mjs';

export interface HomeProps {
  state: AcademyState;
  lessons: readonly Lesson[];
  showcaseTab?: HomeShowcaseTab;
}

const SHOWCASE_PANELS: Record<
  HomeShowcaseTab,
  {
    badge: string;
    title: string;
    summary: string;
    code: string;
    ctaLabel: string;
    ctaHref: string;
    status: string;
  }
> = {
  hcl: {
    badge: 'CodeMirror 6 · Offline ESM',
    title: 'Edita HCL con validación inmediata y salida Esc + Tab',
    summary: 'Resaltado de sintaxis HCL, deshacer/rehacer y reglas didácticas sin enviar código a ningún servidor.',
    code: 'resource "terraform_data" "service" {\n  input = "cluster-prod-v2"\n}\noutput "academy_evidence" {\n  value = terraform_data.service.output\n}',
    ctaLabel: 'Abrir editor en B04 →',
    ctaHref: '#/leccion/B04',
    status: '37/37 labs PASS con Terraform v1.10.5'
  },
  plan: {
    badge: 'Release Gate · Cero fuga de secretos',
    title: 'Inspecciona terraform show -json con orden y drift',
    summary: 'Distingue delete-then-create, create-before-destroy y forget sin leer before/after ni credenciales.',
    code: 'PLAN SUMMARY · USER_SUPPLIED_JSON\n  + create: 2   -/+ replace (delete-then-create): 1\n  ~ drift: 1    * forget (STATE_FORGET): 1\n  GATE => READY_FOR_HUMAN_REVIEW (nunca auto-apply)',
    ctaLabel: 'Probar Inspector & Gate →',
    ctaHref: '#/planes',
    status: '50 rondas fuzzing anti-secretos PASS'
  },
  arena: {
    badge: 'Three.js · WebGL Interactivo',
    title: 'Resuelve escenarios IaC en Arena 3D por mouse o teclado',
    summary: '5 topologías 3D con inspección raycasted de módulos, atajos 1/2/3 y feedback visual en vivo.',
    code: 'ARENA 3D · TOPOLOGÍA ORBITAL\n  [1] terraform init      -> Estabiliza Provider Core\n  [2] terraform output    -> Solo lee outputs\n  [3] terraform fmt       -> Solo formatea HCL',
    ctaLabel: 'Entrar a Arena 3D →',
    ctaHref: '#/juegos',
    status: '5 arenas 3D · 0 violaciones CSP/Axe'
  }
};

const LEVEL_META = [
  {
    eyebrow: '01 · FUNDAMENTOS',
    level: 'Básico',
    modifier: '',
    summary: 'Tu primer recurso, HCL, variables, estado y CLI.'
  },
  {
    eyebrow: '02 · PRODUCTIVIDAD',
    level: 'Intermedio',
    modifier: 'intermediate',
    summary: 'Módulos, testing, remote state y buenas prácticas CI.'
  },
  {
    eyebrow: '03 · PRODUCCIÓN',
    level: 'Avanzado',
    modifier: 'advanced',
    summary: 'Cloud, seguridad, políticas, FinOps y operaciones.'
  }
] as const;

function chip(text: string, variant = 'purple') {
  return h('span', { className: `chip chip-${variant}` }, text);
}

function progressBar(done: number, total: number, labelText = 'Progreso') {
  const safeMax = Math.max(1, total);
  const clamped = Math.min(safeMax, Math.max(0, done));
  return h('progress', {
    className: 'progress-native',
    value: total ? clamped : 0,
    max: safeMax,
    'aria-label': labelText,
    'aria-valuenow': done,
    'aria-valuemin': 0,
    'aria-valuemax': total
  });
}

export function findNextLesson(lessons: readonly Lesson[], completed: readonly string[]): Lesson {
  return lessons.find((item) => !completed.includes(item.id)) || lessons[0];
}

export function HomePage({ state, lessons, showcaseTab = 'hcl' }: HomeProps) {
  const done = state.completed.length;
  const seniorDone = state.seniorCompleted.length;
  const totalGamesWon = Object.values(state.gameWins).reduce((sum, count) => sum + count, 0);
  const next = findNextLesson(lessons, state.completed);
  const primaryHref = done > 0 ? `#/leccion/${next.id}` : ROUTES.learn;
  const primaryLabel = done > 0 ? '▶  Continuar mi ruta' : '▶  Empezar gratis';
  const activeShowcase = SHOWCASE_PANELS[showcaseTab] || SHOWCASE_PANELS.hcl;

  return h(
    'div',
    { id: 'home-landing' },
    h(
      'section',
      { className: 'hero' },
      h(
        'div',
        { className: 'hero-content' },
        h(
          'div',
          { className: 'hero-flag' },
          h('span', { className: 'live-dot', 'aria-hidden': 'true' }),
          'TU AVENTURA EN INFRASTRUCTURE AS CODE'
        ),
        h('h1', { className: 'hero-title' }, 'Terra', h('span', {}, 'Pixel'), h('br', {}), 'Academy'),
        h('div', { className: 'hero-subtitle' }, 'Construye, versiona y entrega infraestructura como código.'),
        h(
          'p',
          { className: 'hero-desc' },
          'Domina Terraform con lecciones interactivas, editor HCL CodeMirror 6, planes de ejemplo, laboratorios locales y desafíos de ingeniería Senior. Aprende haciendo, sin cuenta.'
        ),
        h(
          'div',
          { className: 'hero-buttons' },
          h('a', { href: primaryHref, className: 'btn btn-primary btn-lg' }, primaryLabel),
          h('a', { href: ROUTES.senior, className: 'btn btn-ghost btn-lg' }, '♛ Explorar Senior Mode ↗')
        ),
        h(
          'div',
          { className: 'hero-proof' },
          h(
            'div',
            { className: 'avatar-stack', 'aria-hidden': 'true' },
            h('span', {}, '⌘'),
            h('span', {}, '◈'),
            h('span', {}, '♛')
          ),
          h('span', {}, h('strong', {}, '36 lecciones'), ' · 54 packs ZIP · 18 casos Senior · Arena 3D')
        )
      ),
      h(
        'div',
        { className: 'hero-art' },
        h('div', { className: 'art-ring ring-one', 'aria-hidden': 'true' }),
        h('div', { className: 'art-ring ring-two', 'aria-hidden': 'true' }),
        h('span', { className: 'orbit-chip chip-top', 'aria-hidden': 'true' }, '◈ CM6 · HCL'),
        h('span', { className: 'orbit-chip chip-left', 'aria-hidden': 'true' }, '✓ 37/37 TF CLI'),
        h('span', { className: 'orbit-chip chip-bottom', 'aria-hidden': 'true' }, '♛ 18 Senior'),
        h('img', {
          className: 'hero-terra',
          src: mascotUrl('hola'),
          alt: 'Terra, mascota pixel-art de TerraPixel Academy con casco de ingeniería'
        }),
        h('div', { className: 'hero-glow' })
      ),
      h('div', { className: 'hero-side-label', 'aria-hidden': 'true' }, 'TERRAFORM IAC / EDICIÓN 2026')
    ),
    h(
      'section',
      { className: 'stats-strip', 'aria-label': 'Resumen de contenido de la academia' },
      h(
        'div',
        {},
        h('span', { className: 'stat-symbol', 'aria-hidden': 'true' }, '▣'),
        h('strong', {}, '36'),
        h('small', {}, 'LECCIONES')
      ),
      h(
        'div',
        {},
        h('span', { className: 'stat-symbol', 'aria-hidden': 'true' }, '♛'),
        h('strong', {}, '18'),
        h('small', {}, 'CASOS SENIOR')
      ),
      h(
        'div',
        {},
        h('span', { className: 'stat-symbol', 'aria-hidden': 'true' }, '⑂'),
        h('strong', {}, '8'),
        h('small', {}, 'ITINERARIOS')
      ),
      h(
        'div',
        {},
        h('span', { className: 'stat-symbol', 'aria-hidden': 'true' }, '◆'),
        h('strong', {}, '5'),
        h('small', {}, 'ARENAS 3D')
      )
    ),
    h(
      'section',
      { className: 'section' },
      h(
        'div',
        { className: 'section-heading' },
        h('div', {}, h('div', { className: 'eyebrow' }, 'LEARNING MAP'), h('h2', {}, 'Tu ruta de aprendizaje')),
        h('a', { href: ROUTES.learn, className: 'btn btn-sm btn-soft' }, 'Ver todo el currículo →')
      ),
      h(
        'div',
        { className: 'level-grid' },
        ...LEVEL_META.map((meta, idx) => {
          const levelItems = lessons.filter((item) => item.level === meta.level);
          const finished = levelItems.filter((item) => state.completed.includes(item.id)).length;
          return h(
            'a',
            {
              key: meta.level,
              className: `level-card ${meta.modifier}`.trim(),
              href: `${ROUTES.learn}?nivel=${encodeURIComponent(meta.level)}`
            },
            h('div', { className: 'level-ghost-num', 'aria-hidden': 'true' }, `0${idx + 1}`),
            h(
              'div',
              { className: 'flex space-between' },
              h('span', { className: 'level-count' }, meta.eyebrow),
              chip(`${finished}/12`, 'purple')
            ),
            h('h3', {}, meta.level),
            h('p', {}, meta.summary),
            progressBar(finished, 12, `Progreso nivel ${meta.level}`),
            h(
              'div',
              { className: 'flex space-between mt-18' },
              h('span', { className: 'mini-strong' }, '12 lecciones'),
              h('span', { className: 'round-arrow', 'aria-hidden': 'true' }, '→')
            )
          );
        })
      )
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
          h('div', { className: 'eyebrow' }, 'TERRA TE ACOMPAÑA'),
          h('h2', {}, 'Una aventura de ingeniería con criterio')
        )
      ),
      h(
        'div',
        { className: 'cards-3' },
        h(
          'div',
          { className: 'card' },
          h('img', { src: mascotUrl('codificando'), alt: 'Terra codificando', className: 'portrait' }),
          h('h3', { className: 'card-title' }, 'Practica HCL'),
          h(
            'p',
            { className: 'card-desc' },
            'Completa ejercicios en un editor CodeMirror 6 accesible con reglas explicadas; Terraform CLI se ejecuta solo en los laboratorios locales.'
          ),
          h('a', { href: '#/leccion/B04', className: 'btn btn-sm btn-soft' }, 'Ir al editor →')
        ),
        h(
          'div',
          { className: 'card' },
          h('img', { src: mascotUrl('arquitectura'), alt: 'Terra mostrando un diagrama', className: 'portrait' }),
          h('h3', { className: 'card-title' }, 'Entiende el plan'),
          h(
            'p',
            { className: 'card-desc' },
            'Explora cambios, reemplazos, grafos y riesgos con datos sintéticos claramente señalados.'
          ),
          h('a', { href: ROUTES.plan, className: 'btn btn-sm btn-soft' }, 'Visualizar planes →')
        ),
        h(
          'div',
          { className: 'card' },
          h('img', { src: mascotUrl('senior'), alt: 'Terra en modo Senior', className: 'portrait' }),
          h('h3', { className: 'card-title' }, 'Piensa como Senior'),
          h(
            'p',
            { className: 'card-desc' },
            '18 incidentes con decisiones, evidencias, revisión de riesgo y un proyecto final de plataforma.'
          ),
          h('a', { href: ROUTES.senior, className: 'btn btn-sm btn-soft' }, 'Abrir Senior Mode →')
        )
      )
    ),
    h(
      'section',
      { className: 'section' },
      h(
        'div',
        { className: 'section-heading' },
        h('div', {}, h('div', { className: 'eyebrow' }, 'TU PROGRESO'), h('h2', {}, 'Cada decisión cuenta'))
      ),
      h(
        'div',
        { className: 'card' },
        h(
          'div',
          { className: 'flex space-between items-start' },
          h(
            'div',
            {},
            h('h3', { className: 'heading-21' }, 'Preparación para Platform Engineering'),
            h(
              'p',
              { className: 'text-sub sub-lead-sm' },
              `${done} de 36 lecciones completadas. Avanza a tu ritmo y conserva el progreso localmente.`
            )
          ),
          chip(`${Math.round((done / 36) * 100)}%`, 'purple')
        ),
        h('div', { className: 'space24' }),
        progressBar(done, 36, 'Progreso general de lecciones'),
        h('div', { className: 'space24' }),
        h(
          'div',
          { className: 'cards-4' },
          h(
            'div',
            { className: 'stat-pill' },
            h('span', { className: 'icon-kpi' }, '✧'),
            h(
              'div',
              {},
              h('div', { className: 'number' }, calculateXP(state).toLocaleString('es-PE')),
              h('div', { className: 'caption' }, 'XP de práctica')
            )
          ),
          h(
            'div',
            { className: 'stat-pill' },
            h('span', { className: 'icon-kpi' }, '▣'),
            h(
              'div',
              {},
              h('div', { className: 'number' }, `${done}/36`),
              h('div', { className: 'caption' }, 'Lecciones evaluadas')
            )
          ),
          h(
            'div',
            { className: 'stat-pill' },
            h('span', { className: 'icon-kpi' }, '♛'),
            h(
              'div',
              {},
              h('div', { className: 'number' }, `${seniorDone}/18`),
              h('div', { className: 'caption' }, 'Casos Senior completados*')
            )
          ),
          h(
            'div',
            { className: 'stat-pill' },
            h('span', { className: 'icon-kpi' }, '◆'),
            h(
              'div',
              {},
              h('div', { className: 'number' }, String(totalGamesWon)),
              h('div', { className: 'caption' }, 'Juegos ganados')
            )
          )
        ),
        h('div', { className: 'space16' }),
        h(
          'p',
          { className: 'small-note' },
          '* Senior representa una práctica guiada/autoevaluación, no acreditación profesional ni ejecución Terraform verificada.'
        )
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
          h('div', { className: 'eyebrow eyebrow-banner' }, '♛ SOLO PARA QUIEN REVISA EL RIESGO'),
          h('h3', {}, 'Senior Mode: más allá del terraform apply'),
          h(
            'p',
            {},
            'Practica drift, state, OIDC, pipeline integrity, controles de costos, incidentes y arquitectura multiambiente. Tu evidencia importa más que el botón verde.'
          ),
          h('div', { className: 'space16' }),
          h('a', { href: ROUTES.senior, className: 'btn btn-primary' }, 'Abrir los 18 casos →')
        ),
        h('img', { src: mascotUrl('senior'), alt: 'Mascota Terra con corona' })
      )
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
          h('div', { className: 'eyebrow' }, 'FLUJO EN VIVO · SIN FRICCIÓN'),
          h('h2', {}, 'Explora la plataforma antes de empezar')
        )
      ),
      h(
        'div',
        { className: 'showcase-card' },
        h(
          'div',
          { className: 'tabs tabs-flush' },
          h(
            'button',
            {
              type: 'button',
              className: `tab ${showcaseTab === 'hcl' ? 'active' : ''}`.trim(),
              'data-action': 'home-showcase',
              'data-id': 'hcl',
              'aria-pressed': String(showcaseTab === 'hcl')
            },
            '01 · Editor HCL'
          ),
          h(
            'button',
            {
              type: 'button',
              className: `tab ${showcaseTab === 'plan' ? 'active' : ''}`.trim(),
              'data-action': 'home-showcase',
              'data-id': 'plan',
              'aria-pressed': String(showcaseTab === 'plan')
            },
            '02 · Plan & Gate'
          ),
          h(
            'button',
            {
              type: 'button',
              className: `tab ${showcaseTab === 'arena' ? 'active' : ''}`.trim(),
              'data-action': 'home-showcase',
              'data-id': 'arena',
              'aria-pressed': String(showcaseTab === 'arena')
            },
            '03 · Arena 3D'
          )
        ),
        h(
          'div',
          { className: 'showcase-grid mt-14' },
          h(
            'div',
            {},
            chip(activeShowcase.badge, 'cyan'),
            h('h3', { className: 'heading-21 mt-10' }, activeShowcase.title),
            h('p', { className: 'prose mt-8' }, activeShowcase.summary),
            h('div', { className: 'flex-wrap mt-14' }, chip(activeShowcase.status, 'green')),
            h(
              'div',
              { className: 'mt-18' },
              h('a', { href: activeShowcase.ctaHref, className: 'btn btn-primary btn-sm' }, activeShowcase.ctaLabel)
            )
          ),
          h('pre', { className: 'code-preview' }, h('code', {}, activeShowcase.code))
        )
      )
    )
  );
}
