/**
 * Shared UI route constants, mascot paths, and deterministic icon glyphs
 * consumed across declarative Preact views.
 */
export const ROUTES = {
  home: '#/inicio',
  learn: '#/aprender',
  games: '#/juegos',
  labs: '#/laboratorios',
  graph: '#/grafo',
  plan: '#/planes',
  senior: '#/senior',
  evidence: '#/evidencias',
  progress: '#/progreso',
  settings: '#/ajustes',
  resources: '#/recursos'
} as const;

const ICON_GLYPHS: Readonly<Record<string, string>> = {
  'book-open': '▣',
  boxes: '⬡',
  shield: '◈',
  'git-branch': '⑂',
  database: '▤',
  'trending-down': '↘',
  network: '◇',
  crown: '♛',
  brain: '❖',
  workflow: '⑂',
  bug: '⚑',
  'git-pull-request': '↔'
};

export function iconFor(name: string): string {
  return ICON_GLYPHS[name] || '◆';
}

export function mascotUrl(pose: string): string {
  return `./assets/terra/${pose}.png`;
}
