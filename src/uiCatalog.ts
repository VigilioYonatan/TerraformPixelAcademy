/** Declarative Preact learning catalogue with reactive filtering and track icons. */
import type { Lesson, Track } from './curriculum.js';
import type { AcademyState } from './engine.js';
import { filterLessons } from './store.js';
import { ROUTES, iconFor } from './uiShared.js';
import { h } from './vendor/preact.mjs';

export interface CatalogProps {
  lessons: readonly Lesson[];
  tracks: readonly Track[];
  state: AcademyState;
  level: string;
  searchQuery?: string;
}

const levels = ['Todos', 'Básico', 'Intermedio', 'Avanzado'] as const;

export function LearningCatalog({ lessons, tracks, state, level, searchQuery = '' }: CatalogProps) {
  const displayed = filterLessons(lessons, level, searchQuery);

  return h(
    'div',
    { id: 'learning-catalog' },
    h('div', { className: 'breadcrumb' }, h('a', { href: ROUTES.home }, 'Inicio'), ' / Aprender'),
    h('div', { className: 'eyebrow' }, 'APRENDER TERRAFORM'),
    h('h1', { className: 'page-title' }, 'Tu mapa hacia IaC profesional'),
    h(
      'p',
      { className: 'page-lead' },
      '36 lecciones en tres niveles. Aprende HCL en navegador y descarga los proyectos Terraform para verificar la práctica en tu propio equipo.'
    ),
    h('div', { className: 'space24' }),
    h(
      'div',
      { className: 'flex space-between', style: 'flex-wrap:wrap' },
      h(
        'div',
        { className: 'tabs', style: 'margin-bottom:0;border-bottom:0' },
        ...levels.map((name) =>
          h(
            'button',
            {
              key: name,
              type: 'button',
              className: `tab ${level === name ? 'active' : ''}`,
              'data-action': 'level',
              'data-id': name,
              'aria-pressed': String(level === name)
            },
            name
          )
        )
      ),
      h('input', {
        className: 'search-bar',
        type: 'search',
        id: 'lesson-search',
        value: searchQuery,
        placeholder: 'Buscar lecciones, conceptos…',
        'aria-label': 'Buscar lecciones'
      })
    ),
    h('div', { className: 'space16' }),
    displayed.length > 0
      ? h(
          'div',
          { className: 'lesson-list', id: 'lesson-list' },
          ...displayed.map((l) => {
            const done = state.completed.includes(l.id);
            const fav = state.favorites.includes(l.id);
            return h(
              'a',
              {
                key: l.id,
                href: `#/leccion/${l.id}`,
                className: `list-card lesson-tile ${done ? 'done' : ''}`,
                'data-title': `${l.title} ${l.subtitle} ${l.id}`.toLowerCase()
              },
              h('div', { className: 'lesson-index' }, done ? '✓' : l.id),
              h('div', { className: 'list-card-info' }, h('h3', {}, l.title), h('p', {}, l.subtitle)),
              h(
                'div',
                { className: 'flex' },
                h('span', { className: 'mini-strong color-purple' }, `${l.xp} XP`),
                fav ? h('span', { title: 'Favorito' }, '★') : null,
                h('span', { className: 'list-chevron' }, '›')
              )
            );
          })
        )
      : h(
          'div',
          { className: 'card', role: 'status' },
          h('h3', { className: 'card-title' }, 'Sin coincidencias'),
          h(
            'p',
            { className: 'card-desc' },
            'No se encontraron lecciones para ese filtro. Prueba con otro término o nivel.'
          )
        ),
    h('div', { className: 'space24' }),
    h(
      'div',
      { className: 'notice' },
      'Las 36 lecciones están disponibles sin bloqueos. Completar significa superar reglas didácticas y un quiz, no ejecutar Terraform CLI.'
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
          h('div', { className: 'eyebrow' }, '8 ESPECIALIDADES'),
          h('h2', {}, 'Itinerarios de especialización')
        )
      ),
      h(
        'div',
        { className: 'cards-4' },
        ...tracks.map((t) =>
          h(
            'div',
            { className: 'track-card', key: t.title },
            h('div', { className: 'track-icon', 'aria-hidden': 'true' }, iconFor(t.icon)),
            h('span', { className: 'track-arrow', 'aria-hidden': 'true' }, '↗'),
            h('h3', {}, t.title),
            h('p', {}, t.description),
            h(
              'div',
              { className: 'track-card-bottom' },
              h('span', {}, t.from, ' — ', t.to),
              h(
                'a',
                {
                  className: 'btn btn-sm btn-soft',
                  href: t.from.startsWith('S') ? ROUTES.senior : `#/leccion/${t.from}`
                },
                'Abrir →'
              )
            )
          )
        )
      )
    )
  );
}
