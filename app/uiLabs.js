import { filterLabPacks } from './store.js';
import { ROUTES } from './uiShared.js';
import { h } from './vendor/preact.mjs';
const LAB_CLI_STEPS = [
    'terraform version',
    'terraform fmt -check',
    'terraform init -backend=false',
    'terraform validate',
    'terraform test'
];
const CATEGORY_TABS = [
    { id: 'Todos', label: 'Todos (54)' },
    { id: 'Básico', label: 'Básico (12)' },
    { id: 'Intermedio', label: 'Intermedio (12)' },
    { id: 'Avanzado', label: 'Avanzado (12)' },
    { id: 'Senior', label: 'Senior Mode (18)' }
];
function chip(text, variant = 'purple') {
    return h('span', { className: `chip chip-${variant}` }, text);
}
function sectionHead(eyebrow, title, badgeText) {
    return h('div', { className: 'section-heading' }, h('div', {}, h('div', { className: 'eyebrow' }, eyebrow), h('h2', {}, title)), badgeText ? chip(badgeText, 'purple') : null);
}
export function LabsDirectory({ lessons, seniorCases, category, searchQuery }) {
    const { lessons: matchedLessons, seniorCases: matchedSenior } = filterLabPacks(lessons, seniorCases, category, searchQuery);
    const totalVisible = matchedLessons.length + matchedSenior.length;
    const visibleLevels = ['Básico', 'Intermedio', 'Avanzado'].filter((lvl) => matchedLessons.some((item) => item.level === lvl));
    return h('div', { id: 'labs-directory' }, h('div', { className: 'breadcrumb' }, h('a', { href: ROUTES.home }, 'Inicio'), ' / ', h('span', {}, 'Laboratorios')), h('div', { className: 'eyebrow' }, 'PRÁCTICA AUTÉNTICA · 54 PAQUETES LOCALES'), h('h1', { className: 'page-title' }, 'Laboratorios Terraform y Bundles Senior'), h('p', { className: 'page-lead' }, '36 paquetes individuales de ejercicios HCL con .tftest.hcl más 18 bundles de incidentes Senior (con what-if, rúbricas, ADR y el proyecto multiambiente S18). Descárgalos para verificar con tu propia Terraform CLI sin requerir cuenta cloud.'), h('div', { className: 'space24' }), h('div', { className: 'alert' }, h('strong', {}, 'Importante: '), 'las 54 descargas están incluidas localmente. En el navegador ', h('b', {}, 'NO'), ' se ejecuta Terraform ni se solicitan credenciales cloud; las referencias a AWS/S3 están aisladas en plantillas .txt y los 37 ejercicios ejecutables permanecen en estado ', h('code', {}, 'NOT_RUN'), ' hasta correr la CLI real en tu equipo.'), h('div', { className: 'space24' }), h('div', { className: 'card', style: 'margin-bottom:20px' }, h('h3', { className: 'card-title' }, 'Comienza con Terraform CLI en tu equipo'), h('p', { className: 'card-desc' }, 'Prueba un paquete individual (por ejemplo B04) o ejecuta el verificador aislado de los 37 escenarios locales para generar tu manifiesto de evidencias.'), ...LAB_CLI_STEPS.map((cmd) => h('div', { key: cmd, className: 'terminal-command' }, h('code', {}, cmd), h('button', { type: 'button', 'data-action': 'copy', 'data-value': cmd }, 'Copiar'))), h('div', { className: 'terminal-command' }, h('code', {}, 'npm run verify:terraform:local'), h('button', { type: 'button', 'data-action': 'copy', 'data-value': 'npm run verify:terraform:local' }, 'Copiar')), h('div', { className: 'space16' }), h('div', { className: 'flex-wrap' }, h('a', { href: ROUTES.evidence, className: 'btn btn-sm btn-primary' }, '▣ Importar manifiesto en Evidencias CLI →'), h('a', { href: ROUTES.senior, className: 'btn btn-sm btn-soft' }, '♛ Ir a Senior Hub →'))), h('div', { className: 'flex space-between', style: 'flex-wrap:wrap;gap:12px' }, h('div', { className: 'tabs', style: 'margin-bottom:0;border-bottom:0' }, ...CATEGORY_TABS.map((tab) => h('button', {
        key: tab.id,
        type: 'button',
        className: `tab ${category === tab.id ? 'active' : ''}`.trim(),
        'data-action': 'labs-category',
        'data-id': tab.id,
        'aria-pressed': String(category === tab.id)
    }, tab.label))), h('input', {
        id: 'labs-search',
        type: 'search',
        className: 'search-bar',
        value: searchQuery,
        placeholder: 'Buscar entre los 54 paquetes ZIP…',
        'aria-label': 'Buscar paquetes de laboratorio'
    })), totalVisible === 0
        ? h('section', { className: 'section' }, h('div', { className: 'card', role: 'status' }, h('h3', { className: 'card-title' }, 'Sin paquetes coincidentes'), h('p', { className: 'card-desc' }, 'No hay laboratorios ni bundles Senior para ese criterio de búsqueda.')))
        : null, ...visibleLevels.map((lvl) => {
        const levelItems = matchedLessons.filter((item) => item.level === lvl);
        return h('section', { key: lvl, className: 'section' }, sectionHead('LAB PACKS · LECCIONES HCL', lvl, `${levelItems.length} ZIP`), h('div', { className: 'lesson-list' }, ...levelItems.map((l) => h('div', { key: l.id, className: 'list-card lab-pack-row' }, h('div', { className: 'lesson-index' }, l.id), h('div', { className: 'list-card-info' }, h('h3', {}, l.title), h('p', {}, 'main.tf · practice.tftest.hcl · README · STATUS · solución')), h('div', { className: 'flex' }, h('a', { className: 'btn btn-sm btn-soft', href: `#/leccion/${l.id}` }, 'Aula →'), h('a', {
            className: 'btn btn-sm btn-primary',
            href: `./assets/labs/${l.id}.zip`,
            download: `${l.id}-lab.zip`
        }, '↓ ZIP'))))));
    }), matchedSenior.length > 0
        ? h('section', { className: 'section', id: 'senior-lab-packs' }, sectionHead('SENIOR INCIDENT BUNDLES · S01–S18', 'Paquetes de incidentes, ADR y Capstone S18', `${matchedSenior.length} ZIP`), h('div', { className: 'lesson-list' }, ...matchedSenior.map((c) => h('div', { key: c.id, className: 'list-card senior-pack-row' }, h('div', { className: 'lesson-index' }, c.id), h('div', { className: 'list-card-info' }, h('div', { className: 'flex-wrap', style: 'margin-bottom:4px' }, chip(c.severity, c.severity === 'Crítico' ? 'red' : 'yellow'), chip(c.pillar, 'cyan')), h('h3', {}, c.title), h('p', {}, c.id === 'S18'
            ? 'incident.json · WHAT-IF · REVIEW-GATES · CASE-REVIEW-SHEET · capstone/ multiambiente (.tf + .tftest.hcl)'
            : 'incident.json · WHAT-IF-SCENARIO · WHAT-IF-WORKSHEET · REVIEW-GATES · CASE-REVIEW-SHEET')), h('div', { className: 'flex' }, h('a', { className: 'btn btn-sm btn-soft', href: `#/senior/${c.id}` }, 'Caso →'), h('a', {
            className: 'btn btn-sm btn-primary',
            href: `./assets/senior/${c.id}.zip`,
            download: `${c.id}-incident.zip`
        }, '↓ ZIP'))))))
        : null, h('section', { className: 'section' }, h('div', { className: 'notice' }, 'Para prácticas opcionales en nube real, usa exclusivamente una cuenta sandbox aislada con presupuesto, cuotas, bloqueo de state y destrucción programada. Nunca guardes credenciales en código fuente, state compartido ni artefactos de CI.')));
}
