const assetBase = './assets/vendor/codemirror5/';
let loader = null;
let active = null;
let pending = 0;
let initialized = false;
function loadScript(name) {
    return new Promise((resolve, reject) => {
        const element = document.createElement('script');
        element.src = assetBase + name;
        element.async = false;
        element.onload = () => resolve();
        element.onerror = () => reject(new Error(`No se pudo cargar el editor: ${name}`));
        document.head.append(element);
    });
}
function ensureLoaded() {
    if (window.CodeMirror?.modes?.['terrapixel-hcl'])
        return Promise.resolve(true);
    if (loader)
        return loader;
    loader = (async () => {
        try {
            if (!initialized) {
                await loadScript('codemirror.js');
                await loadScript('mode-hcl.js');
                await loadScript('matchbrackets.js');
                await loadScript('closebrackets.js');
                initialized = true;
            }
            return typeof window.CodeMirror?.fromTextArea === 'function';
        }
        catch (error) {
            console.warn('[TerraPixel] Editor avanzado no disponible; se usará textarea.', error);
            return false;
        }
    })();
    return loader;
}
export function disposeCodeEditor() {
    pending++;
    if (active) {
        try {
            active.toTextArea();
        }
        catch { /* Elemento ya retirado. */ }
        active = null;
    }
}
/** Call after a view is rendered; old async loads are discarded on navigation. */
export async function activateCodeEditor(onChange, theme) {
    const token = ++pending;
    const textarea = document.querySelector('#code-editor');
    if (!textarea)
        return false;
    if (!await ensureLoaded() || token !== pending || !textarea.isConnected || !window.CodeMirror)
        return false;
    const editor = window.CodeMirror.fromTextArea(textarea, {
        mode: 'terrapixel-hcl', lineNumbers: true, lineWrapping: false,
        indentUnit: 2, tabSize: 2, indentWithTabs: false, matchBrackets: true, autoCloseBrackets: true,
        extraKeys: { Tab: (cm) => cm.replaceSelection('  ') }
    });
    active = editor;
    editor.on('change', () => onChange(editor.getValue()));
    editor.setOption('theme', theme === 'light' ? 'default' : 'default');
    const indicator = document.querySelector('.editor-tag');
    if (indicator)
        indicator.textContent = 'HCL · CodeMirror offline (v5)';
    return true;
}
