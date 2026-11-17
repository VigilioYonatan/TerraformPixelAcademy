/**
 * Authentic CodeMirror 6 offline-safe HCL editor with dynamic Dark/Light theme Compartment,
 * undo/redo history, bracket matching/closing, 2-space indentation, WCAG 2.1.2 Escape-then-Tab
 * focus release, and resilient `<textarea>` fallback.
 */
import { hclStreamParser } from './hclLanguage.js';
import type { Compartment as CompartmentType, EditorView as EditorViewType, Extension } from './vendor/codemirror6.mjs';

type Cm6Module = typeof import('./vendor/codemirror6.mjs');

export type EditorTheme = 'light' | 'dark';

interface ActiveEditorSession {
  view: EditorViewType;
  textarea: HTMLTextAreaElement;
  host: HTMLDivElement;
  themeCompartment: CompartmentType;
  theme: EditorTheme;
  cm: Cm6Module;
}

let cm6Loader: Promise<Cm6Module | null> | null = null;
let activeSession: ActiveEditorSession | null = null;
let activationToken = 0;

function loadCm6(): Promise<Cm6Module | null> {
  if (!cm6Loader) {
    cm6Loader = import('./vendor/codemirror6.mjs').catch((error) => {
      console.warn('[TerraPixel] CodeMirror 6 no disponible; se conserva textarea accesible.', error);
      return null;
    });
  }
  return cm6Loader;
}

function buildThemeExtension(cm: Cm6Module, theme: EditorTheme): Extension {
  return [
    cm.EditorView.darkTheme.of(theme === 'dark'),
    cm.EditorView.editorAttributes.of({
      class: theme === 'light' ? 'cm-terrapixel cm-terrapixel-light' : 'cm-terrapixel cm-terrapixel-dark',
      'data-editor-theme': theme
    })
  ];
}

export function disposeCodeEditor(): void {
  activationToken++;
  if (!activeSession) return;
  const { view, textarea, host } = activeSession;
  activeSession = null;
  try {
    view.destroy();
  } catch {
    // View already detached during route transition.
  }
  host.remove();
  textarea.hidden = false;
}

export function updateEditorTheme(theme: EditorTheme): boolean {
  if (!activeSession) return false;
  if (activeSession.theme === theme) return true;
  activeSession.theme = theme;
  activeSession.view.dispatch({
    effects: activeSession.themeCompartment.reconfigure(buildThemeExtension(activeSession.cm, theme))
  });
  return true;
}

export function getActiveEditorState(): { active: boolean; theme: EditorTheme | null; value: string } {
  if (!activeSession) {
    return { active: false, theme: null, value: '' };
  }
  return {
    active: true,
    theme: activeSession.theme,
    value: activeSession.view.state.doc.toString()
  };
}

export function undoEditorChange(): boolean {
  if (!activeSession) return false;
  return activeSession.cm.undo(activeSession.view);
}

export function redoEditorChange(): boolean {
  if (!activeSession) return false;
  return activeSession.cm.redo(activeSession.view);
}

/**
 * Mounts CodeMirror 6 over `#code-editor` after view render.
 * Stale async activations from superseded route transitions are safely discarded.
 */
export async function activateCodeEditor(onChange: (value: string) => void, theme: EditorTheme): Promise<boolean> {
  const textarea = document.querySelector<HTMLTextAreaElement>('#code-editor');
  if (!textarea) return false;

  // If an active CM6 instance is already bound to this exact textarea, sync theme & external doc updates
  if (activeSession && activeSession.textarea === textarea && textarea.isConnected) {
    updateEditorTheme(theme);
    const currentDoc = activeSession.view.state.doc.toString();
    if (currentDoc !== textarea.value) {
      activeSession.view.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: textarea.value }
      });
    }
    return true;
  }

  disposeCodeEditor();
  const myToken = ++activationToken;

  const cm = await loadCm6();
  if (!cm || myToken !== activationToken || !textarea.isConnected) {
    return false;
  }

  const host = document.createElement('div');
  host.className = 'cm6-mount';
  host.dataset.testid = 'cm6-editor-host';
  textarea.after(host);
  textarea.hidden = true;

  const themeCompartment = new cm.Compartment();
  const hclLanguage = cm.StreamLanguage.define(hclStreamParser);
  const ariaLabel = textarea.getAttribute('aria-label') || 'Editor main.tf';

  const state = cm.EditorState.create({
    doc: textarea.value,
    extensions: [
      cm.lineNumbers(),
      cm.highlightActiveLineGutter(),
      cm.highlightActiveLine(),
      cm.drawSelection(),
      cm.history(),
      cm.bracketMatching(),
      cm.closeBrackets(),
      cm.EditorState.tabSize.of(2),
      cm.indentUnit.of('  '),
      hclLanguage.extension,
      cm.syntaxHighlighting(cm.classHighlighter),
      cm.EditorView.contentAttributes.of({
        'aria-label': ariaLabel,
        spellcheck: 'false',
        autocapitalize: 'off',
        autocorrect: 'off'
      }),
      cm.keymap.of([...cm.closeBracketsKeymap, ...cm.defaultKeymap, ...cm.historyKeymap, cm.indentWithTab]),
      themeCompartment.of(buildThemeExtension(cm, theme)),
      cm.EditorView.updateListener.of((update) => {
        if (!update.docChanged) return;
        const nextValue = update.state.doc.toString();
        textarea.value = nextValue;
        onChange(nextValue);
      })
    ]
  });

  const view = new cm.EditorView({
    state,
    parent: host
  });

  activeSession = {
    view,
    textarea,
    host,
    themeCompartment,
    theme,
    cm
  };

  const indicator = document.querySelector<HTMLElement>('.editor-tag');
  if (indicator) {
    indicator.textContent = 'HCL · CodeMirror 6 offline (Esc + Tab para salir)';
  }
  return true;
}
