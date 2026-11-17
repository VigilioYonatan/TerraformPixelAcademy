/**
 * Declarative Preact Learner Profile, XP, 3-Level & 8-Track Progress, and Badges (`#/progreso` — `F3-08`).
 */
import type { Lesson, Track } from './curriculum.js';
import { calculateXP, type AcademyState } from './engine.js';
import { findNextLesson } from './uiHome.js';
import { ROUTES, iconFor, mascotUrl } from './uiShared.js';
import { h } from './vendor/preact.mjs';

export interface ProfileProgressProps {
  state: AcademyState;
  lessons: readonly Lesson[];
  tracks: readonly Track[];
}

export interface TrackProgressItem {
  track: Track;
  done: number;
  total: number;
  href: string;
}

const SENIOR_TOTAL = 18;

function chip(text: string, variant = 'purple') {
  return h('span', { className: `chip chip-${variant}` }, text);
}

function sectionHead(eyebrow: string, title: string, side: unknown = null) {
  return h(
    'div',
    { className: 'section-heading' },
    h('div', {}, h('div', { className: 'eyebrow' }, eyebrow), h('h2', {}, title)),
    side
  );
}

function progressBar(done: number, total: number, labelText = 'Progreso') {
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

export function computeTrackProgress(
  tracks: readonly Track[],
  lessons: readonly Lesson[],
  state: AcademyState
): TrackProgressItem[] {
  return tracks.map((track) => {
    if (track.from.startsWith('S')) {
      return {
        track,
        done: state.seniorCompleted.length,
        total: SENIOR_TOTAL,
        href: ROUTES.senior
      };
    }
    const startIdx = lessons.findIndex((item) => item.id === track.from);
    const endIdx = lessons.findIndex((item) => item.id === track.to);
    const slice = startIdx >= 0 && endIdx >= startIdx ? lessons.slice(startIdx, endIdx + 1) : [];
    const done = slice.filter((item) => state.completed.includes(item.id)).length;
    return {
      track,
      done,
      total: slice.length,
      href: `#/leccion/${track.from}`
    };
  });
}

export function ProfileProgressPage({ state, lessons, tracks }: ProfileProgressProps) {
  const done = state.completed.length;
  const seniorDone = state.seniorCompleted.length;
  const gamesWon = Object.values(state.gameWins).reduce((a, b) => a + b, 0);

  const counts = (['Básico', 'Intermedio', 'Avanzado'] as const).map((level) => ({
    level,
    count: lessons.filter((l) => l.level === level && state.completed.includes(l.id)).length
  }));

  const trackProgress = computeTrackProgress(tracks, lessons, state);

  const badges = [
    {
      title: 'Primer commit',
      needed: state.completed.length >= 1,
      icon: 'hola',
      description: 'Tu primera lección superada'
    },
    {
      title: 'HCL Explorer',
      needed: counts[0].count >= 6,
      icon: 'codificando',
      description: '6 lecciones de fundamentos'
    },
    { title: 'Builder', needed: counts[0].count === 12, icon: 'arquitectura', description: 'Básico completo' },
    { title: 'DevSecOps', needed: counts[1].count === 12, icon: 'deploy', description: 'Intermedio completo' },
    { title: 'Cloud Architect', needed: counts[2].count === 12, icon: 'idea', description: 'Avanzado completo' },
    {
      title: 'Senior Reviewer',
      needed: state.seniorCompleted.length === SENIOR_TOTAL,
      icon: 'senior',
      description: '18 casos autoevaluados'
    }
  ] as const;

  const next = findNextLesson(lessons, state.completed);

  return h(
    'div',
    { id: 'profile-progress-page' },
    h('div', { className: 'breadcrumb' }, h('a', { href: ROUTES.home }, 'Inicio'), ' / ', h('span', {}, 'Progreso')),
    h('div', { className: 'eyebrow' }, 'MI PERFIL DE APRENDIZAJE'),
    h('h1', { className: 'page-title' }, 'Tus logros en IaC'),
    h(
      'p',
      { className: 'page-lead' },
      'Tu progreso se guarda en este navegador, sin cuenta ni telemetría. Exporta un respaldo JSON si vas a cambiar de dispositivo.'
    ),
    h('div', { className: 'space24' }),
    h(
      'div',
      { className: 'cards-4' },
      h(
        'div',
        { className: 'stat-pill' },
        h('span', { className: 'icon-kpi', 'aria-hidden': 'true' }, '✧'),
        h(
          'div',
          {},
          h('div', { className: 'number' }, calculateXP(state).toLocaleString('es-PE')),
          h('div', { className: 'caption' }, 'XP de práctica')
        )
      ),
      h(
        'div',
        { className: 'stat-pill' },
        h('span', { className: 'icon-kpi', 'aria-hidden': 'true' }, '▣'),
        h(
          'div',
          {},
          h('div', { className: 'number' }, `${done}/36`),
          h('div', { className: 'caption' }, 'Lecciones evaluadas')
        )
      ),
      h(
        'div',
        { className: 'stat-pill' },
        h('span', { className: 'icon-kpi', 'aria-hidden': 'true' }, '♛'),
        h(
          'div',
          {},
          h('div', { className: 'number' }, `${seniorDone}/18`),
          h('div', { className: 'caption' }, 'Casos Senior completados*')
        )
      ),
      h(
        'div',
        { className: 'stat-pill' },
        h('span', { className: 'icon-kpi', 'aria-hidden': 'true' }, '◆'),
        h(
          'div',
          {},
          h('div', { className: 'number' }, String(gamesWon)),
          h('div', { className: 'caption' }, 'Juegos ganados')
        )
      )
    ),
    h(
      'section',
      { className: 'section' },
      sectionHead('CONTINUIDAD', 'Avance por nivel'),
      h(
        'div',
        { className: 'cards-3' },
        ...counts.map((item) =>
          h(
            'div',
            { key: item.level, className: 'card' },
            h(
              'div',
              { className: 'flex space-between' },
              h('h3', { className: 'heading-21' }, item.level),
              chip(`${item.count}/12`, 'purple')
            ),
            h('div', { className: 'space24' }),
            progressBar(item.count, 12, `Progreso nivel ${item.level}`),
            h(
              'p',
              { className: 'card-desc my-14' },
              item.count === 12 ? 'Nivel completado' : `${12 - item.count} lecciones pendientes`
            ),
            h(
              'a',
              {
                href: `#/aprender?nivel=${encodeURIComponent(item.level)}`,
                className: 'btn btn-sm btn-soft'
              },
              'Abrir nivel →'
            )
          )
        )
      )
    ),
    h(
      'section',
      { className: 'section', id: 'tracks-progress-section' },
      sectionHead('8 ESPECIALIDADES', 'Avance por itinerario'),
      h(
        'div',
        { className: 'cards-4' },
        ...trackProgress.map(({ track, done: trackDone, total, href }) =>
          h(
            'div',
            { key: track.title, className: 'card track-progress-card' },
            h(
              'div',
              { className: 'flex space-between' },
              h('span', { className: 'track-icon', 'aria-hidden': 'true' }, iconFor(track.icon)),
              chip(`${trackDone}/${total}`, trackDone === total && total > 0 ? 'green' : 'cyan')
            ),
            h('h3', { className: 'card-title mt-10' }, track.title),
            h('p', { className: 'card-desc' }, `${track.from} — ${track.to} · ${track.description}`),
            h('div', { className: 'space12' }),
            progressBar(trackDone, total, `Progreso itinerario ${track.title}`),
            h('div', { className: 'space12' }),
            h('a', { href, className: 'btn btn-sm btn-soft' }, 'Abrir itinerario →')
          )
        )
      )
    ),
    h(
      'section',
      { className: 'section' },
      sectionHead('PIXEL ACHIEVEMENTS', 'Galería de insignias'),
      h(
        'div',
        { className: 'badge-grid' },
        ...badges.map((b) =>
          h(
            'div',
            { key: b.title, className: `badge-card ${b.needed ? '' : 'locked'}`.trim() },
            h('img', { src: mascotUrl(b.icon), alt: '', className: 'image-pixel' }),
            h('strong', {}, b.title),
            h('small', {}, b.description),
            h('div', { className: 'space12' }),
            chip(b.needed ? 'Desbloqueada' : 'Bloqueada', b.needed ? 'green' : 'purple')
          )
        )
      )
    ),
    h(
      'section',
      { className: 'section' },
      sectionHead('REPASO', 'Continúa donde quedaste'),
      h(
        'div',
        { className: 'cards-2' },
        h(
          'div',
          { className: 'card' },
          h('h3', { className: 'card-title' }, 'Próxima lección'),
          h('p', { className: 'card-desc' }, `${next.id} — ${next.title}`),
          h('div', { className: 'space16' }),
          h('a', { href: `#/leccion/${next.id}`, className: 'btn btn-primary' }, 'Continuar →')
        ),
        h(
          'div',
          { className: 'card' },
          h('h3', { className: 'card-title' }, 'Guardado local'),
          h(
            'p',
            { className: 'card-desc' },
            'Tu JSON de progreso incluye respuestas, ejercicios, decisiones y ADR escritos. No compartas su contenido si incluye datos privados.'
          ),
          h('div', { className: 'space16' }),
          h(
            'button',
            { type: 'button', className: 'btn btn-soft', 'data-action': 'export-progress' },
            '↓ Exportar respaldo'
          )
        )
      )
    ),
    h('div', { className: 'space24' }),
    h(
      'div',
      { className: 'notice' },
      'XP e insignias son indicadores de práctica educativa. Senior Mode registra autoevaluación; no garantiza experiencia laboral, certificación oficial ni despliegues validados.'
    )
  );
}
