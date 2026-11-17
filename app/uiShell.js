import { h } from './vendor/preact.mjs';
const navItems = [
    { label: 'Inicio', slug: 'inicio', icon: '⌂' },
    { label: 'Aprender', slug: 'aprender', icon: '▣' },
    { label: 'Minijuegos', slug: 'juegos', icon: '✦' },
    { label: 'Laboratorios', slug: 'laboratorios', icon: '⌘' },
    { label: 'Visualizar', slug: 'grafo', icon: '⬡' },
    { label: 'Senior Mode', slug: 'senior', icon: '♛' }
];
function Navigation({ page }) {
    return h('div', { className: 'nav-items' }, ...navItems.map((item) => h('a', {
        key: item.slug,
        href: `#/${item.slug}`,
        className: `nav-link ${page === item.slug ? 'active' : ''}`,
        'aria-current': page === item.slug ? 'page' : undefined
    }, h('span', { className: 'nav-emoji', 'aria-hidden': 'true' }, item.icon), item.label)));
}
function Header({ page, mobileMenu, seniorEnabled }) {
    return h('header', { className: 'header' }, h('div', { className: 'container nav-inner' }, h('a', { href: '#/inicio', className: 'brand', 'aria-label': 'TerraPixel Academy, inicio' }, h('img', { className: 'brand-mark', src: './assets/icons/mark.svg', alt: '' }), h('span', {}, h('span', { className: 'brand-name' }, 'Terra', h('b', {}, 'Pixel')), h('span', { className: 'brand-sub' }, 'ACADEMY · IAC'))), h('nav', { className: 'nav-links', 'aria-label': 'Navegación principal' }, h(Navigation, { page })), h('div', { className: 'nav-actions' }, h('button', {
        type: 'button',
        className: `senior-toggle ${seniorEnabled ? 'on' : ''}`,
        'data-action': 'toggle-senior',
        'aria-label': seniorEnabled ? 'Desactivar Senior Mode' : 'Activar Senior Mode',
        'aria-pressed': String(seniorEnabled)
    }, '♛  Senior ', seniorEnabled ? 'ON' : 'Mode'), h('a', { className: 'header-icon', href: '#/progreso', title: 'Mi progreso', 'aria-label': 'Mi progreso' }, '◷'), h('a', { className: 'header-icon', href: '#/ajustes', title: 'Ajustes', 'aria-label': 'Ajustes' }, '⚙'), h('button', {
        type: 'button',
        className: 'header-icon menu-btn',
        'data-action': 'toggle-menu',
        'aria-label': mobileMenu ? 'Cerrar navegación' : 'Abrir navegación',
        'aria-expanded': String(mobileMenu)
    }, '☰'))), mobileMenu
        ? h('nav', { className: 'mobile-menu', 'aria-label': 'Menú móvil' }, h(Navigation, { page }), h('a', { className: 'nav-link', href: '#/planes' }, '▤  Explorar planes'), h('a', { className: 'nav-link', href: '#/recursos' }, '↗  Recursos'), h('a', { className: 'nav-link', href: '#/evidencias' }, '▣  Evidencias CLI'))
        : null);
}
function Footer() {
    return h('footer', { className: 'footer' }, h('div', { className: 'container footer-inner' }, h('div', {}, h('div', { className: 'flex' }, h('img', { width: 33, height: 33, src: './assets/icons/mark.svg', alt: '' }), h('b', {}, 'TerraPixel Academy'), h('span', { className: 'chip chip-purple' }, 'Independiente')), h('p', { style: 'margin-top:11px' }, 'Aprendizaje de IaC con simulaciones educativas explícitas. No afiliado, patrocinado ni certificado por HashiCorp. Terraform es una marca de HashiCorp.')), h('div', { className: 'flex-wrap' }, h('a', { className: 'footer-link', href: '#/recursos' }, 'Recursos'), h('a', { className: 'footer-link', href: '#/ajustes' }, 'Privacidad y datos'), h('a', { className: 'footer-link', href: '#/senior' }, 'Senior Mode'), h('a', { className: 'footer-link', href: '#/evidencias' }, 'Evidencias CLI'))));
}
export function AppShell({ page, mobileMenu, seniorEnabled, content, view, toast }) {
    return h('div', { className: 'app-shell' }, h('a', { href: '#main-content', className: 'skip-link' }, 'Saltar al contenido'), h(Header, { page, mobileMenu, seniorEnabled }), view
        ? h('main', { className: 'container', id: 'main-content', tabIndex: -1 }, view)
        : h('main', {
            className: 'container',
            id: 'main-content',
            tabIndex: -1,
            // Transitional HTML bridge strictly for remaining F3-03..F3-08 views; all dynamic user strings are escaped via engine.escapeHtml.
            dangerouslySetInnerHTML: { __html: content }
        }), h(Footer, {}), toast
        ? h('div', {
            id: 'toast',
            className: `toast ${toast.error ? 'error' : ''}`.trim(),
            role: 'status',
            'aria-live': 'polite'
        }, toast.message)
        : null);
}
