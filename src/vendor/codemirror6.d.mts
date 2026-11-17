export type Extension = {readonly extension?: Extension} | readonly Extension[];

export interface TextDoc {
  toString(): string;
  readonly length: number;
}

export interface ViewUpdate {
  readonly docChanged: boolean;
  readonly state: EditorState;
  readonly view: EditorView;
}

export class Compartment {
  of(ext: Extension): Extension;
  reconfigure(content: Extension): unknown;
}

export interface EditorStateConfig {
  doc?: string;
  extensions?: Extension;
}

export class EditorState {
  readonly doc: TextDoc;
  static create(config?: EditorStateConfig): EditorState;
  static tabSize: {of(size: number): Extension};
}

export interface KeyBinding {
  key?: string;
  run?: (target: EditorView) => boolean;
  shift?: (target: EditorView) => boolean;
  preventDefault?: boolean;
}

export interface EditorViewConfig {
  state?: EditorState;
  parent?: Element | DocumentFragment;
}

export class EditorView {
  readonly dom: HTMLElement;
  readonly contentDOM: HTMLElement;
  readonly state: EditorState;
  constructor(config?: EditorViewConfig);
  dispatch(...specs: unknown[]): void;
  destroy(): void;
  focus(): void;
  static updateListener: {of(listener: (update: ViewUpdate) => void): Extension};
  static darkTheme: {of(dark: boolean): Extension};
  static contentAttributes: {of(attrs: Record<string, string>): Extension};
  static editorAttributes: {of(attrs: Record<string, string>): Extension};
  static lineWrapping: Extension;
  static theme(spec: Record<string, Record<string, string>>, options?: {dark?: boolean}): Extension;
}

export interface StringStream {
  eol(): boolean;
  sol(): boolean;
  peek(): string | undefined;
  next(): string | undefined;
  eat(match: string | RegExp | ((ch: string) => boolean)): string | undefined;
  eatWhile(match: string | RegExp | ((ch: string) => boolean)): boolean;
  eatSpace(): boolean;
  skipToEnd(): void;
  skipTo(ch: string): boolean | undefined;
  match(pattern: string | RegExp, consume?: boolean, caseFold?: boolean): boolean | RegExpMatchArray | null;
  current(): string;
  pos: number;
  string: string;
}

export interface StreamParser<State> {
  name?: string;
  startState?: (indentUnit: number) => State;
  token: (stream: StringStream, state: State) => string | null;
  copyState?: (state: State) => State;
  languageData?: Record<string, unknown>;
}

export class StreamLanguage<State> {
  readonly extension: Extension;
  static define<State>(spec: StreamParser<State>): StreamLanguage<State>;
}

export interface TagSpec {
  tag: unknown;
  color?: string;
  fontWeight?: string;
  fontStyle?: string;
}

export class HighlightStyle {
  static define(specs: readonly TagSpec[], options?: {themeType?: 'dark' | 'light'}): HighlightStyle;
}

export const keymap: {of(bindings: readonly KeyBinding[]): Extension};
export function lineNumbers(): Extension;
export function highlightActiveLine(): Extension;
export function highlightActiveLineGutter(): Extension;
export function drawSelection(): Extension;
export function placeholder(content: string): Extension;

export const defaultKeymap: readonly KeyBinding[];
export const historyKeymap: readonly KeyBinding[];
export const indentWithTab: KeyBinding;
export function history(): Extension;
export function undo(target: EditorView): boolean;
export function redo(target: EditorView): boolean;

export const indentUnit: {of(value: string): Extension};
export function bracketMatching(): Extension;
export function syntaxHighlighting(highlighter: unknown, options?: {fallback?: boolean}): Extension;

export function closeBrackets(): Extension;
export const closeBracketsKeymap: readonly KeyBinding[];

export const tags: Record<string, unknown>;
export const classHighlighter: unknown;
