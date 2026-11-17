import { calculateXP } from './engine.js';
import { ROUTES, mascotUrl } from './uiShared.js';
import { h } from './vendor/preact.mjs';
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
];
function chip(text, variant = 'purple') {
    return h('span', { className: `chip chip-${variant}` }, text);
}
function progressBar(done, total, labelText = 'Progreso') {
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
export function findNextLesson(lessons, completed) {
    return lessons.find((item) => !completed.includes(item.id)) || lessons[0];
}
export function HomePage({ state, lessons }) {
    const done = state.completed.length;
    const seniorDone = state.seniorCompleted.length;
    const totalGamesWon = Object.values(state.gameWins).reduce((sum, count) => sum + count, 0);
    const next = findNextLesson(lessons, state.completed);
    const primaryHref = done > 0 ? `#/leccion/${next.id}` : ROUTES.learn;
    const primaryLabel = done > 0 ? '▶  Continuar mi ruta' : '▶  Empezar gratis';
    return h('div', { id: 'home-landing' }, h('section', { className: 'hero' }, h('div', { className: 'hero-content' }, h('div', { className: 'hero-flag' }, '✦   TU AVENTURA EN INFRASTRUCTURE AS CODE'), h('h1', { className: 'hero-title' }, 'Terra', h('span', {}, 'Pixel'), h('br', {}), 'Academy'), h('div', { className: 'hero-subtitle' }, 'Construye, versiona y entrega infraestructura como código.'), h('p', { className: 'hero-desc' }, 'Domina Terraform con lecciones interactivas, editor HCL CodeMirror 6, planes de ejemplo, laboratorios locales y desafíos de ingeniería Senior. Aprende haciendo, sin cuenta.'), h('div', { className: 'hero-buttons' }, h('a', { href: primaryHref, className: 'btn btn-primary btn-lg' }, primaryLabel), h('a', { href: ROUTES.senior, className: 'btn btn-ghost btn-lg' }, 'Explorar Senior Mode ↗')), h('div', { className: 'hero-numbers' }, h('div', {}, h('b', {}, '36'), h('span', {}, 'Lecciones')), h('div', {}, h('b', {}, '18'), h('span', {}, 'Senior')), h('div', {}, h('b', {}, '8'), h('span', {}, 'Rutas')), h('div', {}, h('b', {}, '5'), h('span', {}, 'Juegos')))), h('div', { className: 'hero-art' }, h('div', { className: 'hero-orbit' }), h('span', { className: 'hero-cloud', 'aria-hidden': 'true' }, '☁'), h('span', { className: 'hero-cloud left', 'aria-hidden': 'true' }, '☁'), h('img', {
        className: 'hero-terra',
        src: mascotUrl('hola'),
        alt: 'Terra, mascota pixel-art de TerraPixel Academy con casco de ingeniería'
    }), h('div', { className: 'hero-floating' }, 'resource ', h('span', {}, '"terraform_data"'), ' { }'), h('div', { className: 'hero-glow' }))), h('section', { className: 'section' }, h('div', { className: 'section-heading' }, h('div', {}, h('div', { className: 'eyebrow' }, 'LEARNING MAP'), h('h2', {}, 'Tu ruta de aprendizaje')), h('a', { href: ROUTES.learn, className: 'btn btn-sm btn-soft' }, 'Ver todo el currículo →')), h('div', { className: 'level-grid' }, ...LEVEL_META.map((meta) => {
        const levelItems = lessons.filter((item) => item.level === meta.level);
        const finished = levelItems.filter((item) => state.completed.includes(item.id)).length;
        return h('a', {
            key: meta.level,
            className: `level-card ${meta.modifier}`.trim(),
            href: `${ROUTES.learn}?nivel=${encodeURIComponent(meta.level)}`
        }, h('div', { className: 'flex space-between' }, h('span', { className: 'level-count' }, meta.eyebrow), chip(`${finished}/12`, 'purple')), h('h3', {}, meta.level), h('p', {}, meta.summary), progressBar(finished, 12, `Progreso nivel ${meta.level}`), h('div', { className: 'flex space-between mt-18' }, h('span', { className: 'mini-strong' }, '12 lecciones'), h('span', { className: 'color-purple' }, 'Explorar →')));
    }))), h('section', { className: 'section' }, h('div', { className: 'section-heading' }, h('div', {}, h('div', { className: 'eyebrow' }, 'TERRA TE ACOMPAÑA'), h('h2', {}, 'Una aventura de ingeniería con criterio'))), h('div', { className: 'cards-3' }, h('div', { className: 'card' }, h('img', { src: mascotUrl('codificando'), alt: 'Terra codificando', className: 'portrait' }), h('h3', { className: 'card-title' }, 'Practica HCL'), h('p', { className: 'card-desc' }, 'Completa ejercicios en un editor CodeMirror 6 accesible con reglas explicadas; Terraform CLI se ejecuta solo en los laboratorios locales.'), h('a', { href: '#/leccion/B04', className: 'btn btn-sm btn-soft' }, 'Ir al editor →')), h('div', { className: 'card' }, h('img', { src: mascotUrl('arquitectura'), alt: 'Terra mostrando un diagrama', className: 'portrait' }), h('h3', { className: 'card-title' }, 'Entiende el plan'), h('p', { className: 'card-desc' }, 'Explora cambios, reemplazos, grafos y riesgos con datos sintéticos claramente señalados.'), h('a', { href: ROUTES.plan, className: 'btn btn-sm btn-soft' }, 'Visualizar planes →')), h('div', { className: 'card' }, h('img', { src: mascotUrl('senior'), alt: 'Terra en modo Senior', className: 'portrait' }), h('h3', { className: 'card-title' }, 'Piensa como Senior'), h('p', { className: 'card-desc' }, '18 incidentes con decisiones, evidencias, revisión de riesgo y un proyecto final de plataforma.'), h('a', { href: ROUTES.senior, className: 'btn btn-sm btn-soft' }, 'Abrir Senior Mode →')))), h('section', { className: 'section' }, h('div', { className: 'section-heading' }, h('div', {}, h('div', { className: 'eyebrow' }, 'TU PROGRESO'), h('h2', {}, 'Cada decisión cuenta'))), h('div', { className: 'card' }, h('div', { className: 'flex space-between items-start' }, h('div', {}, h('h3', { className: 'heading-21' }, 'Preparación para Platform Engineering'), h('p', { className: 'text-sub sub-lead-sm' }, `${done} de 36 lecciones completadas. Avanza a tu ritmo y conserva el progreso localmente.`)), chip(`${Math.round((done / 36) * 100)}%`, 'purple')), h('div', { className: 'space24' }), progressBar(done, 36, 'Progreso general de lecciones'), h('div', { className: 'space24' }), h('div', { className: 'cards-4' }, h('div', { className: 'stat-pill' }, h('span', { className: 'icon-kpi' }, '✧'), h('div', {}, h('div', { className: 'number' }, calculateXP(state).toLocaleString('es-PE')), h('div', { className: 'caption' }, 'XP de práctica'))), h('div', { className: 'stat-pill' }, h('span', { className: 'icon-kpi' }, '▣'), h('div', {}, h('div', { className: 'number' }, `${done}/36`), h('div', { className: 'caption' }, 'Lecciones evaluadas'))), h('div', { className: 'stat-pill' }, h('span', { className: 'icon-kpi' }, '♛'), h('div', {}, h('div', { className: 'number' }, `${seniorDone}/18`), h('div', { className: 'caption' }, 'Casos Senior completados*'))), h('div', { className: 'stat-pill' }, h('span', { className: 'icon-kpi' }, '◆'), h('div', {}, h('div', { className: 'number' }, String(totalGamesWon)), h('div', { className: 'caption' }, 'Juegos ganados')))), h('div', { className: 'space16' }), h('p', { className: 'small-note' }, '* Senior representa una práctica guiada/autoevaluación, no acreditación profesional ni ejecución Terraform verificada.'))), h('section', { className: 'section' }, h('div', { className: 'senior-banner' }, h('div', {}, h('div', { className: 'eyebrow eyebrow-banner' }, '♛ SOLO PARA QUIEN REVISA EL RIESGO'), h('h3', {}, 'Senior Mode: más allá del terraform apply'), h('p', {}, 'Practica drift, state, OIDC, pipeline integrity, controles de costos, incidentes y arquitectura multiambiente. Tu evidencia importa más que el botón verde.'), h('div', { className: 'space16' }), h('a', { href: ROUTES.senior, className: 'btn btn-primary' }, 'Abrir los 18 casos →')), h('img', { src: mascotUrl('senior'), alt: 'Mascota Terra con corona' }))));
}
