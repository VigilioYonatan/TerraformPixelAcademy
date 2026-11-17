import { ROUTES, iconFor, mascotUrl } from './uiShared.js';
import { h } from './vendor/preact.mjs';
function chip(text, variant = 'purple') {
    return h('span', { className: `chip chip-${variant}` }, text);
}
export function GamesHub({ games, state }) {
    return h('div', { id: 'games-hub' }, h('div', { className: 'breadcrumb' }, h('a', { href: ROUTES.home }, 'Inicio'), ' / ', h('span', {}, 'Minijuegos')), h('div', { className: 'eyebrow' }, 'APRENDE JUGANDO'), h('h1', { className: 'page-title' }, 'Minijuegos IaC'), h('p', { className: 'page-lead' }, 'Cinco mecánicas, veintiuna preguntas y feedback específico. Los juegos comprueban conocimientos; no simulan una ejecución real de Terraform.'), h('div', { className: 'space24' }), h('div', { className: 'games-grid' }, ...games.map((g, i) => h('div', { key: g.id, className: 'card game-card' }, h('div', { className: 'flex space-between' }, chip(g.eyebrow, i % 2 ? 'cyan' : 'purple'), chip(`Mejor: ${state.gameWins[g.id] || 0}/${g.questions.length}`, 'green')), h('div', { style: 'font-size:36px;color:var(--purple)', 'aria-hidden': 'true' }, iconFor(g.icon)), h('h3', {}, g.title), h('p', {}, g.description), h('a', { href: `#/juego/${g.id}`, className: 'btn btn-primary' }, '▶ Jugar')))), h('section', { className: 'section' }, h('div', { className: 'senior-banner' }, h('div', {}, h('div', { className: 'eyebrow' }, 'DESAFÍO EXTRA'), h('h3', {}, '¿Y si una decisión de Terraform falla en producción?'), h('p', {}, 'Senior Mode añade incidentes sintéticos, revisión técnica y documentación de decisiones verificable.'), h('div', { className: 'space16' }), h('a', { href: ROUTES.senior, className: 'btn btn-primary' }, 'Ir a Senior Mode →')), h('img', { src: mascotUrl('alerta'), alt: 'Terra reaccionando a una alerta' }))));
}
export function GameStage({ game, session }) {
    if (session.finished) {
        const won = session.score >= Math.ceil(game.questions.length * 0.8);
        return h('div', { id: 'game-stage-result' }, h('div', { className: 'breadcrumb' }, h('a', { href: ROUTES.games }, 'Minijuegos'), ' / ', h('span', {}, game.title)), h('div', { className: 'game-stage card game-result', role: 'status', 'aria-live': 'polite' }, h('div', { className: 'eyebrow' }, 'JUEGO FINALIZADO'), h('img', {
            src: mascotUrl(won ? 'exito' : 'pensando'),
            alt: won ? 'Terra celebrando el reto superado' : 'Terra invitando a repasar las explicaciones'
        }), h('h2', {}, won ? '¡Reto superado!' : 'Buen intento, sigue practicando'), h('p', { className: 'prose', style: 'margin:15px 0' }, 'Respuestas correctas: ', h('strong', {}, `${session.score} de ${game.questions.length}`), `. ${won ? 'Has logrado el objetivo de conocimiento.' : 'Lee las explicaciones e inténtalo de nuevo.'}`), chip(won ? '+20 XP por respuesta acertada' : 'Practica y mejora', won ? 'green' : 'yellow'), h('div', { className: 'space24' }), h('div', { className: 'flex-wrap', style: 'justify-content:center' }, h('button', { type: 'button', className: 'btn btn-primary', 'data-action': 'restart-game', 'data-id': game.id }, '↺ Volver a jugar'), h('a', { href: ROUTES.games, className: 'btn' }, 'Todos los juegos'))));
    }
    const question = game.questions[session.at];
    const answered = session.last !== null;
    const isCorrect = answered && session.last === question.correct;
    const currentPose = !answered ? 'pensando' : isCorrect ? 'exito' : 'alerta';
    return h('div', { id: 'game-stage-active', 'data-game-id': game.id }, h('div', { className: 'breadcrumb' }, h('a', { href: ROUTES.games }, 'Minijuegos'), ' / ', h('span', {}, game.title)), h('div', { className: 'game-stage' }, h('div', { className: 'flex space-between' }, h('div', {}, h('div', { className: 'eyebrow' }, game.eyebrow), h('h1', { className: 'page-title' }, game.title)), h('img', {
        src: mascotUrl(currentPose),
        alt: !answered
            ? 'Terra analizando la pregunta'
            : isCorrect
                ? 'Terra confirma acierto'
                : 'Terra señala riesgo',
        className: 'portrait'
    })), h('div', {
        className: 'game-progress',
        role: 'progressbar',
        'aria-label': 'Progreso de la partida',
        'aria-valuenow': session.at + 1,
        'aria-valuemin': 1,
        'aria-valuemax': game.questions.length
    }, ...game.questions.map((qItem, i) => h('span', {
        key: `${game.id}-step-${qItem.question.slice(0, 12)}-${i}`,
        className: i < session.at ? 'done' : i === session.at ? 'active' : ''
    }))), h('div', { className: 'card', style: 'margin-top:22px' }, h('div', { className: 'flex space-between' }, chip(`Pregunta ${session.at + 1}/${game.questions.length}`), chip(`${session.score} aciertos`, 'green')), h('h2', { className: 'game-question' }, question.question), ...question.options.map((choice, i) => {
        const isChosen = session.last === i;
        const statusClass = isChosen ? (isCorrect ? 'correct' : 'incorrect') : '';
        return h('button', {
            key: `${game.id}-${session.at}-${i}`,
            type: 'button',
            'data-action': 'game-answer',
            'data-id': game.id,
            'data-index': i,
            disabled: answered,
            className: `quiz-answer ${statusClass}`.trim()
        }, h('span', { className: 'quiz-letter' }, String.fromCharCode(65 + i)), h('span', {}, choice));
    }), answered
        ? h('div', {}, h('div', { className: 'space16' }), h('div', {
            className: `feedback ${isCorrect ? '' : 'fail'}`.trim(),
            role: 'status',
            'aria-live': 'polite'
        }, h('h3', {}, isCorrect ? '✓ Correcto' : '○ Hay una mejor decisión'), h('p', {}, question.explanation)), h('div', { className: 'space16' }), h('button', {
            type: 'button',
            className: 'btn btn-primary',
            'data-action': 'next-game',
            'data-id': game.id
        }, session.at === game.questions.length - 1 ? 'Ver resultado →' : 'Siguiente pregunta →'))
        : null)));
}
