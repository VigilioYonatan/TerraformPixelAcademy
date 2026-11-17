import { lexHcl } from './hclLex.js';
export const defaultState = () => ({
    version: 1,
    theme: 'dark',
    seniorEnabled: false,
    reducedMotion: false,
    fontScale: 1,
    completed: [],
    seniorCompleted: [],
    quizAnswers: {},
    code: {},
    seniorEvidence: {},
    seniorDecisions: {},
    seniorDrillAnswers: {},
    seniorChecklist: {},
    gameWins: {},
    capstoneDone: [],
    capstoneEvidence: {},
    favorites: []
});
export const unique = (values) => [...new Set(values)];
export const calculateXP = (state) => {
    const basic = state.completed.filter((v) => v.startsWith('B')).length * 100;
    const intermediate = state.completed.filter((v) => v.startsWith('I')).length * 140;
    const advanced = state.completed.filter((v) => v.startsWith('A')).length * 180;
    const senior = state.seniorCompleted.filter((v) => v !== 'S18').length * 300 + (state.seniorCompleted.includes('S18') ? 800 : 0);
    const games = Object.values(state.gameWins).reduce((sum, val) => sum + (Number.isFinite(val) ? Math.max(0, Math.min(100, val)) * 20 : 0), 0);
    return basic + intermediate + advanced + senior + games;
};
const STORAGE_KEY = 'terrapixel-academy-v1';
const safeDict = (value) => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
export function sanitizeState(input, allowedLessons, allowedSenior) {
    if (!input || typeof input !== 'object' || input.version !== 1)
        throw new Error('Formato de progreso incompatible. Se requiere versión 1.');
    const value = safeDict(input), base = defaultState();
    const lessons = new Set(allowedLessons), seniors = new Set(allowedSenior);
    const filtered = (v, allowed) => Array.isArray(v)
        ? unique(v.filter((item) => typeof item === 'string' && allowed.has(item))).slice(0, 100)
        : [];
    const filteredMap = (raw, valid, parse) => {
        const result = {};
        for (const [key, value] of Object.entries(safeDict(raw)).slice(0, 150)) {
            if (!valid.has(key))
                continue;
            const found = parse(value);
            if (found !== undefined)
                result[key] = found;
        }
        return result;
    };
    return {
        ...base,
        theme: value.theme === 'light' ? 'light' : 'dark',
        seniorEnabled: value.seniorEnabled === true,
        reducedMotion: value.reducedMotion === true,
        fontScale: typeof value.fontScale === 'number' && value.fontScale >= 0.8 && value.fontScale <= 1.4 ? value.fontScale : 1,
        completed: filtered(value.completed, lessons),
        seniorCompleted: filtered(value.seniorCompleted, seniors),
        quizAnswers: filteredMap(value.quizAnswers, lessons, (v) => Number.isInteger(v) && v >= 0 && v < 6 ? v : undefined),
        code: filteredMap(value.code, lessons, (v) => (typeof v === 'string' ? v.slice(0, 30000) : undefined)),
        seniorEvidence: filteredMap(value.seniorEvidence, seniors, (v) => typeof v === 'string' ? v.slice(0, 12000) : undefined),
        seniorDecisions: filteredMap(value.seniorDecisions, seniors, (v) => Number.isInteger(v) && v >= 0 && v < 4 ? v : undefined),
        seniorDrillAnswers: filteredMap(value.seniorDrillAnswers, seniors, (v) => Number.isInteger(v) && v >= 0 && v <= 1 ? v : undefined),
        seniorChecklist: filteredMap(value.seniorChecklist, seniors, (v) => Array.isArray(v) ? [...new Set(v.filter((n) => Number.isInteger(n) && n >= 0 && n < 4))].slice(0, 4) : undefined),
        gameWins: Object.fromEntries(Object.entries(safeDict(value.gameWins)).filter((entry) => /^g[1-5]$/.test(entry[0]) &&
            typeof entry[1] === 'number' &&
            Number.isInteger(entry[1]) &&
            entry[1] >= 0 &&
            entry[1] <= 100)),
        capstoneDone: Array.isArray(value.capstoneDone)
            ? [
                ...new Set(value.capstoneDone.filter((n) => Number.isInteger(n) && n >= 0 && n < 8))
            ]
            : [],
        capstoneEvidence: Object.fromEntries(Object.entries(safeDict(value.capstoneEvidence))
            .filter(([k, v]) => /^[0-7]$/.test(k) && typeof v === 'string')
            .map(([k, v]) => [k, v.slice(0, 2500)])),
        favorites: filtered(value.favorites, new Set([...allowedLessons, ...allowedSenior]))
    };
}
export function loadState(allowedLessons, allowedSenior) {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? sanitizeState(JSON.parse(raw), allowedLessons, allowedSenior) : defaultState();
    }
    catch {
        return defaultState();
    }
}
export function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        return true;
    }
    catch {
        return false;
    }
}
/** Revoke forged or stale badges when a student changes code or quiz answers. */
export function reconcileLessonCompletion(state, lessons) {
    const byId = new Map(lessons.map((lesson) => [lesson.id, lesson]));
    const before = state.completed;
    state.completed = before.filter((id) => {
        const lesson = byId.get(id);
        return (!!lesson &&
            state.quizAnswers[id] === lesson.correct &&
            evaluateLesson(lesson, state.code[id] ?? lesson.starter).ok);
    });
    return before.filter((id) => !state.completed.includes(id));
}
/** Mask comment text while preserving quoted strings and ignoring heredoc bodies. */
export function stripComments(code) {
    return lexHcl(code).code.replace(/[ \t]{2,}(?=\n|$)/g, ' ');
}
export function balancedHcl(code) {
    const lexed = lexHcl(code);
    if (!lexed.terminated)
        return false;
    const cleaned = lexed.code;
    let inString = false, escaped = false;
    const stack = [];
    const pairs = { '}': '{', ']': '[', ')': '(' };
    for (const c of cleaned) {
        if (inString) {
            if (escaped) {
                escaped = false;
                continue;
            }
            if (c === '\\') {
                escaped = true;
                continue;
            }
            if (c === '"')
                inString = false;
            continue;
        }
        if (c === '"') {
            inString = true;
            continue;
        }
        if ('{[('.includes(c))
            stack.push(c);
        if ('}])'.includes(c) && stack.pop() !== pairs[c])
            return false;
    }
    return !inString && stack.length === 0;
}
export function evaluateLesson(lesson, code) {
    const active = stripComments(code);
    const checks = [
        { ok: code.length >= 12 && code.length <= 30000, label: 'Hay configuración para evaluar (límite 30 KB)' },
        { ok: !/(?:#\s*TODO|____|<REEMPLAZA>)/i.test(code), label: 'Se completó la parte pendiente del ejercicio' },
        { ok: balancedHcl(code), label: 'Delimitadores y comillas equilibrados (comprobación básica)' },
        ...lesson.required.map((r, i) => {
            try {
                return {
                    ok: new RegExp(r, 'm').test(active),
                    label: `Regla educativa ${i + 1}: ${i === 0 ? 'estructura esperada' : 'expresión requerida'}`
                };
            }
            catch {
                return { ok: false, label: `Regla ${i + 1} no disponible` };
            }
        })
    ];
    return {
        ok: checks.every((check) => check.ok),
        checks,
        provenance: 'BROWSER_RULES',
        note: 'Solo se comprueban reglas didácticas del texto. No se ha ejecutado Terraform CLI, no hay parseo HCL completo ni acceso a infraestructura.'
    };
}
/** Structural ADR gate only. A human must still inspect all real-world claims. */
export function canCompleteSenior(correctDecision, checks, evidence) {
    const reasons = [];
    if (!correctDecision)
        reasons.push('Resuelve correctamente la decisión técnica.');
    if (checks.length !== 4 || new Set(checks).size !== 4 || checks.some((n) => !Number.isInteger(n) || n < 0 || n > 3))
        reasons.push('Completa los cuatro controles de autoverificación.');
    const trimmed = evidence.trim();
    if (trimmed.length < 120)
        reasons.push('Documenta al menos 120 caracteres de evidencia/ADR propio.');
    // Support Markdown headings and paragraph labels (including a one-line ADR).
    const sections = {};
    const headings = /((?:^|\n|[.;]\s+)(?:#{1,4}\s*)?)(contexto|diagn[oó]stico|decisi[oó]n|riesgos?|evidencia|rollback|reversi[oó]n|recuperaci[oó]n)\s*[:-]\s*/gim;
    const matches = [...trimmed.matchAll(headings)];
    for (let i = 0; i < matches.length; i++) {
        const m = matches[i], key = (m[2] || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
        const category = key === 'diagnostico'
            ? 'contexto'
            : key === 'reversion' || key === 'recuperacion'
                ? 'rollback'
                : key.startsWith('riesgo')
                    ? 'riesgo'
                    : key;
        const start = m.index ?? 0;
        const end = i + 1 < matches.length ? (matches[i + 1].index ?? trimmed.length) : trimmed.length;
        const body = trimmed.slice(start + m[0].length, end).trim();
        if (body.length >= 8 && !/^(?:todo|tbd|pendiente|\.{3}|x+|\[.*\])$/i.test(body))
            sections[category] = body;
    }
    for (const [key, name] of [
        ['contexto', 'contexto o diagnóstico'],
        ['decision', 'decisión'],
        ['riesgo', 'riesgos'],
        ['evidencia', 'evidencia y su estado real'],
        ['rollback', 'rollback o recuperación']
    ]) {
        if (!sections[key])
            reasons.push(`Incluye la sección ${name} con una explicación (no solo el título).`);
    }
    if (sections.evidencia && !/\b(PASS|FAIL|NOT_RUN|BLOCKED)\b/i.test(sections.evidencia))
        reasons.push('Clasifica la evidencia usando PASS, FAIL, NOT_RUN o BLOCKED.');
    return { ok: reasons.length === 0, reasons };
}
export function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c);
}
export function slugFilename(id) {
    return /^[A-Z]\d{2}$/.test(id) ? id : 'academy';
}
