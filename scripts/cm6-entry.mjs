export { EditorState, Compartment } from '@codemirror/state';
export {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  drawSelection,
  placeholder
} from '@codemirror/view';
export { defaultKeymap, history, historyKeymap, indentWithTab, undo, redo } from '@codemirror/commands';
export {
  StreamLanguage,
  indentUnit,
  bracketMatching,
  syntaxHighlighting,
  HighlightStyle
} from '@codemirror/language';
export { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
export { tags, classHighlighter } from '@lezer/highlight';
