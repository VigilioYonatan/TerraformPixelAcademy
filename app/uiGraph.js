import { ROUTES, mascotUrl } from './uiShared.js';
import { h } from './vendor/preact.mjs';
function chip(text, variant = 'purple') {
    return h('span', { className: `chip chip-${variant}` }, text);
}
/**
 * Computes direct upstream dependencies, transitive downstream blast radius,
 * and cycle participation safely using visited-set BFS.
 */
export function analyzeGraphNode(nodes, targetId) {
    const target = nodes.find((n) => n.id === targetId);
    if (!target) {
        return { upstreamIds: [], downstreamIds: [], hasCycle: false };
    }
    const upstreamIds = target.dep.filter((depId) => nodes.some((n) => n.id === depId));
    // Build reverse adjacency: if B depends on A, A's change impacts B
    const dependentsMap = new Map();
    for (const node of nodes) {
        for (const depId of node.dep) {
            const list = dependentsMap.get(depId) ?? [];
            list.push(node.id);
            dependentsMap.set(depId, list);
        }
    }
    const visited = new Set();
    const queue = [...(dependentsMap.get(targetId) ?? [])];
    let hasCycle = false;
    while (queue.length > 0) {
        const current = queue.shift();
        if (!current)
            continue;
        if (current === targetId) {
            hasCycle = true;
            continue;
        }
        if (visited.has(current))
            continue;
        visited.add(current);
        for (const nextId of dependentsMap.get(current) ?? []) {
            if (nextId === targetId) {
                hasCycle = true;
            }
            else if (!visited.has(nextId)) {
                queue.push(nextId);
            }
        }
    }
    return {
        upstreamIds,
        downstreamIds: [...visited],
        hasCycle
    };
}
export function GraphExplorer({ graphs, selectedGraphId, selectedNodeId }) {
    if (graphs.length === 0) {
        return h('div', { id: 'graph-explorer-empty', className: 'empty-state', role: 'status' }, h('img', { src: mascotUrl('descanso'), alt: 'Terra en pausa', width: 180, className: 'mx-auto' }), h('h1', { className: 'page-title' }, 'Sin topologías disponibles'), h('p', {}, 'No se encontraron definiciones de grafos para visualizar en este momento.'), h('div', { className: 'space24' }), h('a', { href: ROUTES.home, className: 'btn btn-primary' }, 'Volver al inicio →'));
    }
    const graph = graphs.find((g) => g.id === selectedGraphId) || graphs[0];
    if (graph.nodes.length === 0) {
        return h('div', { id: 'graph-explorer-error', className: 'content-panel', role: 'alert' }, h('h1', { className: 'page-title' }, graph.title), h('p', { className: 'prose' }, 'Esta topología no contiene nodos válidos para representar.'), h('div', { className: 'space16' }), h('a', { href: ROUTES.home, className: 'btn btn-soft' }, 'Volver al inicio →'));
    }
    const activeNode = graph.nodes.find((n) => n.id === selectedNodeId) || graph.nodes[0];
    const analysis = analyzeGraphNode(graph.nodes, activeNode.id);
    const labelById = new Map(graph.nodes.map((n) => [n.id, n.label]));
    const edges = graph.nodes.flatMap((n) => n.dep.flatMap((ref) => {
        const from = graph.nodes.find((x) => x.id === ref);
        return from
            ? [
                h('line', {
                    key: `${from.id}->${n.id}`,
                    className: 'edge',
                    x1: from.x + 65,
                    y1: from.y + 19,
                    x2: n.x + 65,
                    y2: n.y + 19,
                    'marker-end': 'url(#edge-arrow)'
                })
            ]
            : [];
    }));
    return h('div', { id: 'graph-explorer' }, h('div', { className: 'breadcrumb' }, h('a', { href: ROUTES.home }, 'Inicio'), ' / ', h('span', {}, 'Visualizador')), h('div', { className: 'eyebrow' }, 'INFRASTRUCTURE GRAPH'), h('h1', { className: 'page-title' }, 'Observa las dependencias'), h('p', { className: 'page-lead' }, 'Grafo interactivo basado en topologías ficticias: qué recurso depende de cuál, dónde hay acoplamiento y cómo acotar el blast radius. Usa Tab y las flechas del teclado para recorrer nodos.'), h('div', { className: 'space24' }), h('div', { className: 'tabs' }, ...graphs.map((g) => h('button', {
        key: g.id,
        type: 'button',
        className: `tab ${graph.id === g.id ? 'active' : ''}`.trim(),
        'data-action': 'graph',
        'data-id': g.id,
        'aria-pressed': String(graph.id === g.id)
    }, g.title))), h('div', { className: 'content-panel' }, h('div', { className: 'flex space-between items-start' }, h('div', {}, h('h2', {}, graph.title), h('p', { className: 'prose' }, graph.description)), chip('SIMULACIÓN VISUAL', 'yellow')), analysis.hasCycle
        ? h('div', { className: 'alert mt-14', role: 'status' }, h('strong', {}, '⚠ Dependencia circular detectada: '), 'Terraform rechazará construir el grafo acíclico dirigido (DAG) hasta romper esta referencia mutua entre módulos/recursos.')
        : null, h('div', { className: 'space16' }), h('div', { className: 'graph-frame' }, h('svg', {
        viewBox: '0 0 930 350',
        role: 'group',
        'aria-label': `Grafo de dependencias de ${graph.title}`
    }, h('defs', {}, h('marker', {
        id: 'edge-arrow',
        markerWidth: '7',
        markerHeight: '7',
        refX: '6',
        refY: '3.5',
        orient: 'auto'
    }, h('path', { d: 'M 0 0 L 7 3.5 L 0 7 z', fill: '#b38bff' }))), ...edges, ...graph.nodes.map((n) => {
        const isSelected = activeNode.id === n.id;
        return h('g', {
            key: n.id,
            className: `graph-node ${isSelected ? 'active' : ''}`.trim(),
            'data-action': 'graph-node',
            'data-id': n.id,
            role: 'button',
            tabindex: 0,
            'aria-pressed': String(isSelected),
            'aria-label': `Ver nodo ${n.label}`
        }, h('rect', { x: n.x, y: n.y, rx: 11, width: 130, height: 46 }), h('text', { x: n.x + 65, y: n.y + 27, 'text-anchor': 'middle' }, n.label));
    }))), h('div', { className: 'graph-legend' }, ...graph.nodes.map((n) => h('button', {
        key: `legend-${n.id}`,
        type: 'button',
        className: `btn btn-sm ${n.id === activeNode.id ? 'btn-primary' : ''}`.trim(),
        'data-action': 'graph-node',
        'data-id': n.id,
        'aria-pressed': String(n.id === activeNode.id)
    }, n.label))), h('div', {
        className: 'graph-detail',
        role: 'region',
        'aria-live': 'polite',
        'aria-label': 'Detalle del nodo seleccionado'
    }, h('div', { className: 'flex-wrap' }, chip(activeNode.category, 'purple'), chip(activeNode.level, activeNode.level === 'Error' ? 'red' : 'cyan')), h('h3', { className: 'my-10' }, activeNode.label), h('p', { className: 'prose' }, activeNode.description), h('p', { className: 'small-note' }, `Depende de: ${analysis.upstreamIds.length ? analysis.upstreamIds.map((id) => labelById.get(id) || id).join(', ') : 'ningún otro nodo'}.`), h('p', { className: 'small-note mt-4' }, `Radio de impacto aguas abajo: ${analysis.downstreamIds.length ? analysis.downstreamIds.map((id) => labelById.get(id) || id).join(', ') : 'sin consumidores dependientes'}.`)), h('div', { className: 'notice' }, 'Estos diagramas no provienen de terraform graph real. Son casos de estudio para aprender modelado, propiedad y dependencias.')), h('div', { className: 'space24' }), h('a', { href: ROUTES.plan, className: 'btn btn-primary' }, 'Explorar cambios de plan →'));
}
