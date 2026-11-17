import { ROUTES } from './uiShared.js';
import { h } from './vendor/preact.mjs';
const FONT_SCALE_OPTIONS = [
    [0.9, 'Compacto'],
    [1, 'Normal'],
    [1.15, 'Grande'],
    [1.3, 'Muy grande']
];
export function SettingsPage({ state }) {
    return h('div', { id: 'settings-page' }, h('div', { className: 'breadcrumb' }, h('a', { href: ROUTES.home }, 'Inicio'), ' / ', h('span', {}, 'Ajustes')), h('div', { className: 'eyebrow' }, 'PREFERENCIAS Y PRIVACIDAD'), h('h1', { className: 'page-title' }, 'Tu academia, a tu manera'), h('p', { className: 'page-lead' }, 'Controla apariencia, movimiento y progreso. Todo funciona localmente, sin inicio de sesión y sin enviar tus ejercicios a un servidor.'), h('div', { className: 'space24' }), h('div', { className: 'settings-layout' }, h('div', { className: 'content-panel' }, h('h2', {}, 'Experiencia'), h('div', { className: 'settings-item' }, h('div', {}, h('h4', {}, 'Tema'), h('p', {}, 'Claro u oscuro')), h('select', {
        className: 'input-select',
        'data-input': 'theme',
        'aria-label': 'Tema',
        value: state.theme
    }, h('option', { value: 'dark', selected: state.theme === 'dark' }, 'Oscuro'), h('option', { value: 'light', selected: state.theme === 'light' }, 'Claro'))), h('div', { className: 'settings-item' }, h('div', {}, h('h4', {}, 'Senior Mode'), h('p', {}, 'Muestra preguntas y retos avanzados')), h('button', {
        type: 'button',
        className: `btn btn-sm ${state.seniorEnabled ? 'btn-primary' : ''}`.trim(),
        'data-action': 'toggle-senior',
        'aria-pressed': String(state.seniorEnabled)
    }, state.seniorEnabled ? 'Activado' : 'Desactivado')), h('div', { className: 'settings-item' }, h('div', {}, h('h4', {}, 'Reducir movimiento'), h('p', {}, 'Desactiva animaciones decorativas')), h('button', {
        type: 'button',
        className: `btn btn-sm ${state.reducedMotion ? 'btn-primary' : ''}`.trim(),
        'data-action': 'toggle-motion',
        'aria-pressed': String(state.reducedMotion)
    }, state.reducedMotion ? 'Sí' : 'No')), h('div', { className: 'settings-item' }, h('div', {}, h('h4', {}, 'Tamaño de texto'), h('p', {}, 'Escala general de lectura')), h('select', {
        className: 'input-select',
        'data-input': 'font-scale',
        'aria-label': 'Tamaño de texto',
        value: String(state.fontScale)
    }, ...FONT_SCALE_OPTIONS.map(([scale, label]) => h('option', { key: String(scale), value: String(scale), selected: state.fontScale === scale }, label)))), h('div', { className: 'settings-item' }, h('div', {}, h('h4', {}, 'Idioma'), h('p', {}, 'La versión completa se ofrece en español')), h('span', { className: 'chip' }, 'Español'))), h('div', { className: 'content-panel' }, h('h2', {}, 'Datos locales'), h('p', { className: 'prose' }, 'El almacenamiento usa localStorage. No existe cuenta, sincronización ni analítica remota en la app. Puedes hacer backup, restaurar y borrar tus datos del navegador.'), h('div', { className: 'space24' }), h('div', { className: 'flex-wrap' }, h('button', { type: 'button', className: 'btn btn-primary', 'data-action': 'export-progress' }, '↓ Exportar JSON'), h('button', { type: 'button', className: 'btn', 'data-action': 'import-progress' }, '↑ Importar JSON'), h('input', {
        type: 'file',
        id: 'progress-file',
        accept: 'application/json,.json',
        style: 'display:none',
        'aria-label': 'Cargar archivo de progreso'
    })), h('div', { className: 'space24' }), h('div', { className: 'alert' }, 'El respaldo incluye código editado, decisiones y evidencia Senior. Consérvalo como información personal. La importación reemplaza el progreso actual después de validación de estructura.'), h('div', { className: 'space24' }), h('button', { type: 'button', className: 'btn btn-danger', 'data-action': 'reset-progress' }, 'Eliminar todo mi progreso'), h('div', { className: 'space24' }), h('h3', { style: 'font-size:17px' }, 'Sobre los laboratorios'), h('p', { className: 'prose' }, 'Los comandos CLI se ejecutan en tu equipo. Los simuladores no hacen apply ni gestionan cuentas cloud.'))), h('section', { className: 'section' }, h('div', { className: 'card' }, h('h3', {}, 'Diseño e identidad original'), h('p', { className: 'card-desc' }, 'TerraPixel emplea identidad visual propia e independiente con 12 poses pixel-art originales de Terra; se archiva localmente la referencia conceptual inicial del proyecto.'), h('div', { className: 'space16' }), h('a', {
        href: './assets/reference/concepto-aprobado.png',
        target: '_blank',
        rel: 'noopener noreferrer',
        className: 'btn btn-soft'
    }, '↗ Ver boceto de referencia archivado'))));
}
