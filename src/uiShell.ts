/**
 * Preact-owned, 100% declarative app chrome (`AppShell`, `Header`, `Navigation`, `Footer`, `Toast`).
 * Zero raw HTML string injection: all 14 routes + 404 render as native Preact VNodes (`F3-08`).
 */
import type { ToastMessage } from './store.js';
import { h, type VNode } from './vendor/preact.mjs';

export interface ShellProps {
  page: string;
  mobileMenu: boolean;
  seniorEnabled: boolean;
  view: VNode;
  toast?: ToastMessage | null;
}

export const NAV_ITEMS = [
  { label: 'Inicio', slug: 'inicio', icon: '⌂' },
  { label: 'Aprender', slug: 'aprender', icon: '▣' },
  { label: 'Minijuegos', slug: 'juegos', icon: '✦' },
  { label: 'Laboratorios', slug: 'laboratorios', icon: '⌘' },
  { label: 'Visualizar', slug: 'grafo', icon: '⬡' },
  { label: 'Planes', slug: 'planes', icon: '▤' },
  { label: 'Senior Mode', slug: 'senior', icon: '♛' },
  { label: 'Evidencias', slug: 'evidencias', icon: '✓' },
  { label: 'Recursos', slug: 'recursos', icon: '↗' }
] as const;

function Navigation({ page }: { page: string }) {
  return h(
    'div',
    { className: 'nav-items' },
    ...NAV_ITEMS.map((item) =>
      h(
        'a',
        {
          key: item.slug,
          href: `#/${item.slug}`,
          className: `nav-link ${page === item.slug ? 'active' : ''}`.trim(),
          'aria-current': page === item.slug ? 'page' : undefined
        },
        h('span', { className: 'nav-emoji', 'aria-hidden': 'true' }, item.icon),
        item.label
      )
    )
  );
}

function Header({ page, mobileMenu, seniorEnabled }: Omit<ShellProps, 'view' | 'toast'>) {
  return h(
    'header',
    { className: 'header' },
    h(
      'div',
      { className: 'container nav-inner' },
      h(
        'a',
        { href: '#/inicio', className: 'brand', 'aria-label': 'TerraPixel Academy, inicio' },
        h('img', { className: 'brand-mark', src: './assets/icons/mark.svg', alt: '' }),
        h(
          'span',
          {},
          h('span', { className: 'brand-name' }, 'Terra', h('b', {}, 'Pixel')),
          h('span', { className: 'brand-sub' }, 'ACADEMY · IAC')
        )
      ),
      h('nav', { className: 'nav-links', 'aria-label': 'Navegación principal' }, h(Navigation, { page })),
      h(
        'div',
        { className: 'nav-actions' },
        h(
          'button',
          {
            type: 'button',
            className: `senior-toggle ${seniorEnabled ? 'on' : ''}`.trim(),
            'data-action': 'toggle-senior',
            'aria-label': seniorEnabled ? 'Desactivar Senior Mode' : 'Activar Senior Mode',
            'aria-pressed': String(seniorEnabled)
          },
          '♛  Senior ',
          seniorEnabled ? 'ON' : 'Mode'
        ),
        h(
          'a',
          { className: 'header-icon', href: '#/progreso', title: 'Mi progreso', 'aria-label': 'Mi progreso' },
          '◷'
        ),
        h('a', { className: 'header-icon', href: '#/ajustes', title: 'Ajustes', 'aria-label': 'Ajustes' }, '⚙'),
        h(
          'button',
          {
            type: 'button',
            className: 'header-icon menu-btn',
            'data-action': 'toggle-menu',
            'aria-label': mobileMenu ? 'Cerrar navegación' : 'Abrir navegación',
            'aria-expanded': String(mobileMenu)
          },
          '☰'
        )
      )
    ),
    mobileMenu ? h('nav', { className: 'mobile-menu', 'aria-label': 'Menú móvil' }, h(Navigation, { page })) : null
  );
}

function Footer() {
  return h(
    'footer',
    { className: 'footer' },
    h(
      'div',
      { className: 'container footer-inner' },
      h(
        'div',
        {},
        h(
          'div',
          { className: 'flex' },
          h('img', { width: 33, height: 33, src: './assets/icons/mark.svg', alt: '' }),
          h('b', {}, 'TerraPixel Academy'),
          h('span', { className: 'chip chip-purple' }, 'Independiente')
        ),
        h(
          'p',
          { style: 'margin-top:11px' },
          'Aprendizaje de IaC con simulaciones educativas explícitas. No afiliado, patrocinado ni certificado por HashiCorp. Terraform es una marca de HashiCorp.'
        )
      ),
      h(
        'div',
        { className: 'flex-wrap' },
        h('a', { className: 'footer-link', href: '#/recursos' }, 'Recursos'),
        h('a', { className: 'footer-link', href: '#/ajustes' }, 'Privacidad y datos'),
        h('a', { className: 'footer-link', href: '#/senior' }, 'Senior Mode'),
        h('a', { className: 'footer-link', href: '#/evidencias' }, 'Evidencias CLI')
      )
    )
  );
}

export function AppShell({ page, mobileMenu, seniorEnabled, view, toast }: ShellProps) {
  return h(
    'div',
    { className: 'app-shell' },
    h('a', { href: '#main-content', className: 'skip-link' }, 'Saltar al contenido'),
    h(Header, { page, mobileMenu, seniorEnabled }),
    h('main', { className: 'container', id: 'main-content', tabIndex: -1 }, view),
    h(Footer, {}),
    toast
      ? h(
          'div',
          {
            id: 'toast',
            className: `toast ${toast.error ? 'error' : ''}`.trim(),
            role: 'status',
            'aria-live': 'polite'
          },
          toast.message
        )
      : null
  );
}
