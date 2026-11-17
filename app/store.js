import { defaultState, loadState, reconcileLessonCompletion, saveState } from './engine.js';
import { emptyGateAnswers } from './releaseGate.js';
import { reconcileSeniorCompletion } from './seniorProgress.js';
const VALID_CASE_TABS = ['investigar', 'decision', 'review', 'evidencia', 'operaciones'];
export function isCaseTabId(value) {
    return VALID_CASE_TABS.includes(value);
}
export function filterLessons(allLessons, level, query) {
    const normalized = query.toLowerCase().trim();
    return allLessons.filter((item) => {
        if (level !== 'Todos' && item.level !== level)
            return false;
        if (!normalized)
            return true;
        const haystack = `${item.id} ${item.title} ${item.subtitle}`.toLowerCase();
        return haystack.includes(normalized);
    });
}
export function filterSeniorCases(allCases, query) {
    const normalized = query.toLowerCase().trim();
    if (!normalized)
        return allCases;
    return allCases.filter((item) => {
        const haystack = `${item.id} ${item.title} ${item.pillar} ${item.subtitle}`.toLowerCase();
        return haystack.includes(normalized);
    });
}
export function filterGlossary(entries, query) {
    const normalized = query.toLowerCase().trim();
    if (!normalized)
        return entries;
    return entries.filter(([term, description]) => `${term} ${description}`.toLowerCase().includes(normalized));
}
export function createAcademyStore({ lessons, seniorCases, initialAcademy, persistFn = saveState }) {
    const lessonIds = lessons.map((item) => item.id);
    const seniorIds = seniorCases.map((item) => item.id);
    const academy = initialAcademy ?? loadState(lessonIds, seniorIds);
    reconcileSeniorCompletion(academy, seniorCases);
    reconcileLessonCompletion(academy, lessons);
    let toastSeq = 0;
    const listeners = new Set();
    const state = {
        academy,
        mobileMenu: false,
        activeLevel: 'Todos',
        lessonSearch: '',
        seniorSearch: '',
        glossarySearch: '',
        caseTab: 'investigar',
        selectedPlan: 'p2',
        selectedGraph: 'network',
        selectedNode: '',
        showPlanRisks: false,
        evals: {},
        showSeniorFix: false,
        seniorSimResult: '',
        simInputs: {
            cidrA: '10.40.0.0/16',
            cidrB: '10.40.8.0/21',
            approvedCommit: 'a1b2',
            appliedCommit: 'c9d8',
            simulatedReplicas: 6
        },
        cliManifest: null,
        cliManifestError: '',
        userPlan: null,
        userPlanError: '',
        gateAnswers: emptyGateAnswers(),
        gateReview: null,
        gameSession: null,
        toast: null
    };
    const emit = () => {
        for (const listener of listeners) {
            listener();
        }
    };
    const showToast = (message, error = false) => {
        const id = ++toastSeq;
        state.toast = { id, message, error };
        emit();
        return id;
    };
    const clearToast = (id) => {
        if (!state.toast)
            return;
        if (id !== undefined && state.toast.id !== id)
            return;
        state.toast = null;
        emit();
    };
    const persistInternal = () => {
        const saved = persistFn(state.academy);
        if (!saved) {
            const id = ++toastSeq;
            state.toast = {
                id,
                message: 'El navegador no permitió guardar el progreso. Puedes exportarlo manualmente.',
                error: true
            };
        }
    };
    return {
        getState() {
            return state;
        },
        update(mutator, options) {
            mutator(state);
            if (options?.persist) {
                persistInternal();
            }
            emit();
        },
        persistQuietly() {
            persistInternal();
        },
        resetAcademy() {
            state.academy = defaultState();
            state.evals = {};
            persistInternal();
            emit();
        },
        replaceAcademy(incoming) {
            state.academy = incoming;
            const invalidatedSenior = reconcileSeniorCompletion(state.academy, seniorCases);
            const invalidatedLessons = reconcileLessonCompletion(state.academy, lessons);
            state.evals = {};
            persistInternal();
            emit();
            return { invalidatedSenior, invalidatedLessons };
        },
        showToast,
        clearToast,
        subscribe(listener) {
            listeners.add(listener);
            return () => {
                listeners.delete(listener);
            };
        }
    };
}
