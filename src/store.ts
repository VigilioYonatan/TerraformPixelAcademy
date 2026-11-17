/**
 * Reactive UI & Academy state container (`F3-01`).
 * Centralizes persistent `AcademyState` and transient UI state so Preact views
 * re-render declaratively without imperative `.innerHTML` or `el.hidden` DOM mutations.
 */
import type { CliManifest } from './cliEvidence.js';
import type { Lesson } from './curriculum.js';
import {
  defaultState,
  loadState,
  reconcileLessonCompletion,
  saveState,
  type AcademyState,
  type EvalResult
} from './engine.js';
import type { PlanAnalysis } from './planInspector.js';
import { emptyGateAnswers, type GateAnswers, type GateReview } from './releaseGate.js';
import type { Case } from './senior.js';
import { reconcileSeniorCompletion } from './seniorProgress.js';

export type CaseTabId = 'investigar' | 'decision' | 'review' | 'evidencia' | 'operaciones';
export type LabsCategory = 'Todos' | 'Básico' | 'Intermedio' | 'Avanzado' | 'Senior';

export interface GameSession {
  id: string;
  at: number;
  score: number;
  last: number | null;
  finished: boolean;
}

export interface ToastMessage {
  id: number;
  message: string;
  error: boolean;
}

export interface SimulatorInputs {
  cidrA: string;
  cidrB: string;
  approvedCommit: string;
  appliedCommit: string;
  simulatedReplicas: number;
}

export interface AcademyStoreState {
  academy: AcademyState;
  mobileMenu: boolean;
  activeLevel: string;
  lessonSearch: string;
  seniorSearch: string;
  glossarySearch: string;
  labsCategory: LabsCategory;
  labsSearch: string;
  caseTab: CaseTabId;
  selectedPlan: string;
  selectedGraph: string;
  selectedNode: string;
  showPlanRisks: boolean;
  evals: Record<string, EvalResult | undefined>;
  showSeniorFix: boolean;
  seniorSimResult: string;
  simInputs: SimulatorInputs;
  cliManifest: CliManifest | null;
  cliManifestError: string;
  userPlan: PlanAnalysis | null;
  userPlanError: string;
  gateAnswers: GateAnswers;
  gateReview: GateReview | null;
  gameSession: GameSession | null;
  toast: ToastMessage | null;
}

export interface StoreDeps {
  lessons: readonly Lesson[];
  seniorCases: readonly Case[];
  initialAcademy?: AcademyState;
  persistFn?: (academy: AcademyState) => boolean;
}

export interface AcademyStore {
  getState(): AcademyStoreState;
  update(mutator: (draft: AcademyStoreState) => void, options?: { persist?: boolean }): void;
  persistQuietly(): void;
  resetAcademy(): void;
  replaceAcademy(incoming: AcademyState): { invalidatedSenior: string[]; invalidatedLessons: string[] };
  showToast(message: string, error?: boolean): number;
  clearToast(id?: number): void;
  subscribe(listener: () => void): () => void;
}

const VALID_CASE_TABS: readonly CaseTabId[] = ['investigar', 'decision', 'review', 'evidencia', 'operaciones'];

export function isCaseTabId(value: string): value is CaseTabId {
  return (VALID_CASE_TABS as readonly string[]).includes(value);
}

export function filterLessons(allLessons: readonly Lesson[], level: string, query: string): readonly Lesson[] {
  const normalized = query.toLowerCase().trim();
  return allLessons.filter((item) => {
    if (level !== 'Todos' && item.level !== level) return false;
    if (!normalized) return true;
    const haystack = `${item.id} ${item.title} ${item.subtitle}`.toLowerCase();
    return haystack.includes(normalized);
  });
}

export function filterSeniorCases(allCases: readonly Case[], query: string): readonly Case[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return allCases;
  return allCases.filter((item) => {
    const haystack = `${item.id} ${item.title} ${item.pillar} ${item.subtitle}`.toLowerCase();
    return haystack.includes(normalized);
  });
}

export function filterGlossary(
  entries: readonly (readonly [string, string])[],
  query: string
): readonly (readonly [string, string])[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return entries;
  return entries.filter(([term, description]) => `${term} ${description}`.toLowerCase().includes(normalized));
}

const VALID_LAB_CATEGORIES: readonly LabsCategory[] = ['Todos', 'Básico', 'Intermedio', 'Avanzado', 'Senior'];

export function isLabsCategory(value: string): value is LabsCategory {
  return (VALID_LAB_CATEGORIES as readonly string[]).includes(value);
}

export function filterLabPacks(
  allLessons: readonly Lesson[],
  allSenior: readonly Case[],
  category: LabsCategory,
  query: string
): { lessons: readonly Lesson[]; seniorCases: readonly Case[] } {
  const normalized = query.toLowerCase().trim();
  const matchedLessons =
    category === 'Senior'
      ? []
      : allLessons.filter((item) => {
          if (category !== 'Todos' && item.level !== category) return false;
          if (!normalized) return true;
          return `${item.id} ${item.title} ${item.subtitle} ${item.level}`.toLowerCase().includes(normalized);
        });
  const matchedSenior =
    category !== 'Todos' && category !== 'Senior'
      ? []
      : allSenior.filter((item) => {
          if (!normalized) return true;
          return `${item.id} ${item.title} ${item.pillar} ${item.severity} ${item.subtitle}`
            .toLowerCase()
            .includes(normalized);
        });
  return { lessons: matchedLessons, seniorCases: matchedSenior };
}

export function resolveGameSession(current: GameSession | null, gameId: string): GameSession {
  if (current && current.id === gameId) return current;
  return { id: gameId, at: 0, score: 0, last: null, finished: false };
}

export function createAcademyStore({
  lessons,
  seniorCases,
  initialAcademy,
  persistFn = saveState
}: StoreDeps): AcademyStore {
  const lessonIds = lessons.map((item) => item.id);
  const seniorIds = seniorCases.map((item) => item.id);
  const academy = initialAcademy ?? loadState(lessonIds, seniorIds);
  reconcileSeniorCompletion(academy, seniorCases);
  reconcileLessonCompletion(academy, lessons);

  let toastSeq = 0;
  const listeners = new Set<() => void>();

  const state: AcademyStoreState = {
    academy,
    mobileMenu: false,
    activeLevel: 'Todos',
    lessonSearch: '',
    seniorSearch: '',
    glossarySearch: '',
    labsCategory: 'Todos',
    labsSearch: '',
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

  const showToast = (message: string, error = false): number => {
    const id = ++toastSeq;
    state.toast = { id, message, error };
    emit();
    return id;
  };

  const clearToast = (id?: number): void => {
    if (!state.toast) return;
    if (id !== undefined && state.toast.id !== id) return;
    state.toast = null;
    emit();
  };

  const persistInternal = (): void => {
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
