/**
 * Declarative Preact Mini-Games Hub (`#/juegos`) & Interactive 3D Game Stage (`#/juego/:id`).
 * Combines a lazy-loaded Three.js 3D Infrastructure Arena with accessible keyboard controls,
 * immediate technical feedback, and non-inflating XP persistence (`F3-04` + Three.js 3D upgrade).
 */
import type { AcademyState } from './engine.js';
import type { Game } from './games.js';
import type { GameSession } from './store.js';
import { iconFor, mascotUrl, ROUTES } from './uiShared.js';
import { h } from './vendor/preact.mjs';

function chip(text: string, variant = 'purple') {
  return h('span', { className: `chip chip-${variant}` }, text);
}

export interface GamesHubProps {
  games: readonly Game[];
  state: AcademyState;
}

export interface GameStageProps {
  game: Game;
  session: GameSession;
}

const ARENA_LABELS: Record<string, string> = {
  g1: 'Topología Orbital 3D',
  g2: 'Pipeline CI/CD 3D',
  g3: 'Radar de Riesgos 3D',
  g4: 'Guardia de Drift 3D',
  g5: 'Arquitectura Multi-Capa 3D'
};

export function GamesHub({ games, state }: GamesHubProps) {
  return h(
    'div',
    { id: 'games-hub' },
    h('div', { className: 'breadcrumb' }, h('a', { href: ROUTES.home }, 'Inicio'), ' / ', h('span', {}, 'Minijuegos')),
    h('div', { className: 'eyebrow' }, 'PRACTICA JUGANDO · ARENA 3D INTERACTIVA'),
    h('h1', { className: 'page-title' }, 'Desafíos rápidos de IaC en 3D'),
    h(
      'p',
      { className: 'page-lead' },
      'Cada desafío combina una topología interactiva 3D con Three.js, explicación inmediata y control por mouse o teclado (1, 2, 3). Superar el 80 % suma XP una sola vez por mejora de récord.'
    ),
    h('div', { className: 'space24' }),
    h(
      'div',
      { className: 'games-grid' },
      ...games.map((g, i) =>
        h(
          'div',
          { key: g.id, className: 'card game-card' },
          h(
            'div',
            { className: 'flex space-between' },
            chip(g.eyebrow, i % 2 ? 'cyan' : 'purple'),
            chip(`Mejor: ${state.gameWins[g.id] || 0}/${g.questions.length}`, 'green')
          ),
          h('div', { className: 'icon-game', 'aria-hidden': 'true' }, iconFor(g.icon)),
          h('h3', {}, g.title),
          h('div', { className: 'eyebrow eyebrow-xs' }, ARENA_LABELS[g.id] || 'Escenario 3D'),
          h('p', {}, g.description),
          h('a', { href: `#/juego/${g.id}`, className: 'btn btn-primary' }, '▶ Jugar en Arena 3D')
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
          h('div', { className: 'eyebrow' }, 'DESAFÍO EXTRA'),
          h('h3', {}, '¿Y si una decisión de Terraform falla en producción?'),
          h(
            'p',
            {},
            'Senior Mode añade 18 incidentes reales simulados, revisión técnica y documentación ADR verificable.'
          ),
          h('div', { className: 'space16' }),
          h('a', { href: ROUTES.senior, className: 'btn btn-primary' }, 'Ir a Senior Mode →')
        ),
        h('img', { src: mascotUrl('alerta'), alt: 'Terra reaccionando a una alerta' })
      )
    )
  );
}

export function GameStage({ game, session }: GameStageProps) {
  if (session.finished) {
    const won = session.score >= Math.ceil(game.questions.length * 0.8);
    return h(
      'div',
      { id: 'game-stage-result' },
      h(
        'div',
        { className: 'breadcrumb' },
        h('a', { href: ROUTES.games }, 'Minijuegos'),
        ' / ',
        h('span', {}, game.title)
      ),
      h(
        'div',
        { className: 'game-stage card game-result', role: 'status', 'aria-live': 'polite' },
        h('div', { className: 'eyebrow' }, 'JUEGO FINALIZADO'),
        h('img', {
          src: mascotUrl(won ? 'exito' : 'pensando'),
          alt: won ? 'Terra celebrando el reto superado' : 'Terra invitando a repasar las explicaciones'
        }),
        h('h2', {}, won ? '¡Reto superado!' : 'Buen intento, sigue practicando'),
        h(
          'p',
          { className: 'prose my-15' },
          'Respuestas correctas: ',
          h('strong', {}, `${session.score} de ${game.questions.length}`),
          `. ${won ? 'Has logrado el objetivo de conocimiento y estabilizado la topología 3D.' : 'Lee las explicaciones e inténtalo de nuevo.'}`
        ),
        chip(won ? '+20 XP por respuesta acertada' : 'Practica y mejora', won ? 'green' : 'yellow'),
        h('div', { className: 'space24' }),
        h(
          'div',
          { className: 'flex-wrap justify-center' },
          h(
            'button',
            { type: 'button', className: 'btn btn-primary', 'data-action': 'restart-game', 'data-id': game.id },
            '↺ Volver a jugar'
          ),
          h('a', { href: ROUTES.games, className: 'btn' }, 'Todos los juegos')
        )
      )
    );
  }

  const question = game.questions[session.at];
  const answered = session.last !== null;
  const isCorrect = answered && session.last === question.correct;
  const currentPose = !answered ? 'pensando' : isCorrect ? 'exito' : 'alerta';
  const integrityPct = Math.round(
    ((session.score + (answered && !isCorrect ? 0 : 1)) / (game.questions.length + 1)) * 100
  );

  return h(
    'div',
    { id: 'game-stage-active', 'data-game-id': game.id },
    h(
      'div',
      { className: 'breadcrumb' },
      h('a', { href: ROUTES.games }, 'Minijuegos'),
      ' / ',
      h('span', {}, game.title)
    ),
    h(
      'div',
      { className: 'game-stage-wide' },
      h(
        'div',
        { className: 'flex space-between wrap gap-12' },
        h(
          'div',
          {},
          h('div', { className: 'eyebrow' }, `${game.eyebrow} · ${ARENA_LABELS[game.id] || 'ARENA 3D'}`),
          h('h1', { className: 'page-title' }, game.title)
        ),
        h('img', {
          src: mascotUrl(currentPose),
          alt: !answered
            ? 'Terra analizando la pregunta'
            : isCorrect
              ? 'Terra confirma acierto'
              : 'Terra señala riesgo',
          className: 'portrait'
        })
      ),
      h(
        'div',
        {
          className: 'game-progress',
          role: 'progressbar',
          'aria-label': 'Progreso de la partida',
          'aria-valuenow': session.at + 1,
          'aria-valuemin': 1,
          'aria-valuemax': game.questions.length
        },
        ...game.questions.map((qItem, i) =>
          h('span', {
            key: `${game.id}-step-${qItem.question.slice(0, 12)}-${i}`,
            className: i < session.at ? 'done' : i === session.at ? 'active' : ''
          })
        )
      ),
      h(
        'div',
        { className: 'game-3d-layout mt-22' },
        h(
          'section',
          { className: 'card game-3d-panel', 'aria-label': 'Arena 3D interactiva' },
          h(
            'div',
            { className: 'flex space-between wrap gap-8 mb-14' },
            chip(ARENA_LABELS[game.id] || 'Arena 3D', 'cyan'),
            chip(`Integridad ${integrityPct}%`, isCorrect || !answered ? 'green' : 'red')
          ),
          h(
            'div',
            {
              id: 'game-3d-viewport',
              className: 'game-3d-viewport',
              'data-game-3d': game.id
            },
            h(
              'div',
              { className: 'game-3d-fallback' },
              h('span', { className: 'eyebrow' }, 'VISTA TÁCTICA DE INFRAESTRUCTURA'),
              h(
                'p',
                { className: 'small-note mt-6' },
                'Arrastra para rotar · Haz clic en un nodo 3D para inspeccionarlo.'
              )
            )
          ),
          h(
            'div',
            { id: 'game-3d-inspector', className: 'notice mt-12', role: 'status', 'aria-live': 'polite' },
            h('strong', {}, 'Nodo activo: '),
            'Selecciona un módulo 3D o responde para avanzar en la topología.'
          ),
          h(
            'div',
            { className: 'flex-wrap mt-12' },
            h(
              'button',
              { type: 'button', className: 'btn btn-sm btn-soft', 'data-action': 'game-cam-iso' },
              'Isométrica'
            ),
            h(
              'button',
              { type: 'button', className: 'btn btn-sm btn-soft', 'data-action': 'game-cam-top' },
              'Vista superior'
            ),
            h(
              'button',
              { type: 'button', className: 'btn btn-sm btn-soft', 'data-action': 'game-cam-rotate' },
              'Auto-rotar'
            ),
            h('button', { type: 'button', className: 'btn btn-sm', 'data-action': 'game-cam-reset' }, '↺ Centrar')
          )
        ),
        h(
          'section',
          { className: 'card', 'aria-label': 'Pregunta y decisión' },
          h(
            'div',
            { className: 'flex space-between' },
            chip(`Pregunta ${session.at + 1}/${game.questions.length}`),
            chip(`${session.score} aciertos`, 'green')
          ),
          h('h2', { className: 'game-question' }, question.question),
          ...question.options.map((choice, i) => {
            const isChosen = session.last === i;
            const statusClass = isChosen ? (isCorrect ? 'correct' : 'incorrect') : '';
            return h(
              'button',
              {
                key: `${game.id}-q${session.at}-opt-${i}`,
                type: 'button',
                className: `quiz-answer ${statusClass}`.trim(),
                'data-action': 'game-answer',
                'data-id': game.id,
                'data-index': i,
                disabled: answered
              },
              h('span', { className: 'quiz-letter' }, String(i + 1)),
              h('span', {}, choice)
            );
          }),
          h('p', { className: 'small-note mt-10' }, 'Atajo rápido: pulsa las teclas 1, 2 o 3 para elegir una opción.'),
          answered
            ? h(
                'div',
                {},
                h('div', { className: 'space16' }),
                h(
                  'div',
                  { className: `feedback ${isCorrect ? '' : 'fail'}`.trim(), role: 'status', 'aria-live': 'polite' },
                  h('h3', {}, isCorrect ? '✓ Correcto (+20 XP)' : '⨯ Hay una mejor decisión'),
                  h('p', {}, question.explanation)
                ),
                h('div', { className: 'space16' }),
                h(
                  'button',
                  { type: 'button', className: 'btn btn-primary', 'data-action': 'next-game', 'data-id': game.id },
                  session.at >= game.questions.length - 1 ? 'Ver resultado →' : 'Siguiente pregunta →'
                )
              )
            : null
        )
      )
    )
  );
}
