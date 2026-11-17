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

type PixelIconSlug = (typeof NAV_ITEMS)[number]['slug'] | 'progreso' | 'ajustes' | 'menu';

const PIXEL_ICONS: Record<
  PixelIconSlug,
  { tone: string; rects: ReadonlyArray<readonly [number, number, number, number]> }
> = {
  inicio: {
    tone: 'cyan',
    rects: [
      [7, 1, 2, 2],
      [5, 3, 6, 2],
      [3, 5, 10, 2],
      [2, 7, 12, 2],
      [3, 9, 3, 5],
      [10, 9, 3, 5],
      [6, 9, 4, 2]
    ]
  },
  aprender: {
    tone: 'cyan',
    rects: [
      [1, 3, 6, 10],
      [9, 3, 6, 10],
      [7, 4, 2, 9],
      [3, 5, 3, 2],
      [3, 8, 3, 2],
      [10, 5, 3, 2],
      [10, 8, 3, 2]
    ]
  },
  juegos: {
    tone: 'purple',
    rects: [
      [2, 5, 12, 6],
      [1, 7, 14, 3],
      [4, 6, 2, 4],
      [3, 7, 4, 2],
      [10, 6, 2, 2],
      [11, 8, 2, 2]
    ]
  },
  laboratorios: {
    tone: 'cyan',
    rects: [
      [1, 2, 14, 2],
      [1, 4, 2, 9],
      [13, 4, 2, 9],
      [1, 12, 14, 2],
      [4, 6, 2, 2],
      [6, 8, 2, 2],
      [4, 10, 2, 2],
      [8, 10, 4, 2]
    ]
  },
  grafo: {
    tone: 'purple',
    rects: [
      [6, 2, 4, 4],
      [2, 10, 4, 4],
      [10, 10, 4, 4],
      [7, 6, 2, 2],
      [4, 8, 8, 2]
    ]
  },
  planes: {
    tone: 'cyan',
    rects: [
      [3, 1, 8, 2],
      [3, 3, 2, 12],
      [11, 3, 2, 12],
      [3, 13, 10, 2],
      [6, 5, 4, 2],
      [6, 8, 4, 2],
      [6, 11, 3, 2]
    ]
  },
  senior: {
    tone: 'gold',
    rects: [
      [2, 4, 2, 7],
      [7, 2, 2, 9],
      [12, 4, 2, 7],
      [4, 7, 3, 4],
      [9, 7, 3, 4],
      [2, 11, 12, 3]
    ]
  },
  evidencias: {
    tone: 'green',
    rects: [
      [3, 2, 10, 2],
      [2, 4, 12, 5],
      [4, 9, 8, 3],
      [6, 12, 4, 2],
      [5, 7, 2, 2],
      [7, 9, 2, 2],
      [9, 5, 2, 4]
    ]
  },
  recursos: {
    tone: 'purple',
    rects: [
      [3, 2, 10, 12],
      [5, 2, 6, 4],
      [5, 11, 2, 3],
      [9, 11, 2, 3],
      [7, 9, 2, 2]
    ]
  },
  progreso: {
    tone: 'cyan',
    rects: [
      [2, 10, 3, 4],
      [6, 7, 3, 7],
      [10, 3, 3, 11]
    ]
  },
  ajustes: {
    tone: 'purple',
    rects: [
      [6, 1, 4, 2],
      [6, 13, 4, 2],
      [1, 6, 2, 4],
      [13, 6, 2, 4],
      [3, 3, 10, 10],
      [6, 6, 4, 4]
    ]
  },
  menu: {
    tone: 'cyan',
    rects: [
      [2, 3, 12, 2],
      [2, 7, 12, 2],
      [2, 11, 12, 2]
    ]
  }
};

function NavPixelIcon({ slug }: { slug: PixelIconSlug }) {
  const spec = PIXEL_ICONS[slug];
  return h(
    'svg',
    {
      className: `nav-px nav-px-${spec.tone}`,
      viewBox: '0 0 16 16',
      width: 16,
      height: 16,
      shapeRendering: 'crispEdges',
      'aria-hidden': 'true'
    },
    ...spec.rects.map(([x, y, width, height], idx) => h('rect', { key: `${slug}-${idx}`, x, y, width, height }))
  );
}

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
        h(NavPixelIcon, { slug: item.slug }),
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
        { href: '#/inicio', className: 'brand' },
        h('img', { className: 'brand-mark', src: './assets/icons/mark.svg', alt: '' }),
        h(
          'span',
          {},
          h('span', { className: 'brand-name' }, 'Terra', h('b', {}, 'Pixel')),
          ' ',
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
          h(NavPixelIcon, { slug: 'senior' }),
          h('span', { className: 'senior-toggle-label' }, 'Senior ', seniorEnabled ? 'ON' : 'Mode')
        ),
        h(
          'a',
          { className: 'header-icon', href: '#/progreso', title: 'Mi progreso', 'aria-label': 'Mi progreso' },
          h(NavPixelIcon, { slug: 'progreso' })
        ),
        h(
          'a',
          { className: 'header-icon', href: '#/ajustes', title: 'Ajustes', 'aria-label': 'Ajustes' },
          h(NavPixelIcon, { slug: 'ajustes' })
        ),
        h(
          'button',
          {
            type: 'button',
            className: 'header-icon menu-btn',
            'data-action': 'toggle-menu',
            'aria-label': mobileMenu ? 'Cerrar navegación' : 'Abrir navegación',
            'aria-expanded': String(mobileMenu)
          },
          h(NavPixelIcon, { slug: 'menu' })
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
          { className: 'mt-11' },
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
