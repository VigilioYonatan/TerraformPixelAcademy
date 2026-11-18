/**
 * Shared UI route constants, mascot paths, inline code formatter, and deterministic icon glyphs
 * consumed across declarative Preact views.
 */
import { h } from './vendor/preact.mjs';
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
};
const ICON_GLYPHS = {
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
export function iconFor(name) {
    return ICON_GLYPHS[name] || '◆';
}
export function mascotUrl(pose) {
    return `./assets/terra/${pose}.png`;
}
export function renderInlineText(text) {
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((part, idx) => part.startsWith('`') && part.endsWith('`') && part.length > 2
        ? h('code', { key: `ic-${idx}`, className: 'inline-code' }, part.slice(1, -1))
        : part);
}
