/** CodeMirror 5.58.3 offline enhancement. Textarea remains a fully usable fallback. */
type CodeMirrorInstance = {
  getValue(): string;
  toTextArea(): void;
  on(event: string, handler: () => void): void;
  setOption(key: string, value: unknown): void;
};
type CodeMirrorFactory = {
  fromTextArea(element: HTMLTextAreaElement, options: Record<string, unknown>): CodeMirrorInstance;
  modes?: Record<string, unknown>;
};
declare global {
  interface Window { CodeMirror?: CodeMirrorFactory }
}
const assetBase = './assets/vendor/codemirror5/';
let loader: Promise<boolean> | null = null;
let active: CodeMirrorInstance | null = null;
let pending = 0;
let initialized = false;
function loadScript(name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const element=document.createElement('script');
    element.src=assetBase+name;
    element.async=false;
    element.onload=()=>resolve();
    element.onerror=()=>reject(new Error(`No se pudo cargar el editor: ${name}`));
    document.head.append(element);
  });
}
function ensureLoaded():Promise<boolean> {
  if(window.CodeMirror?.modes?.['terrapixel-hcl'])return Promise.resolve(true);
  if(loader)return loader;
  loader=(async()=>{
    try {
      if(!initialized){
        await loadScript('codemirror.js');
        await loadScript('mode-hcl.js');
        await loadScript('matchbrackets.js');
        await loadScript('closebrackets.js');
        initialized=true;
      }
      return typeof window.CodeMirror?.fromTextArea==='function';
    }catch(error){console.warn('[TerraPixel] Editor avanzado no disponible; se usará textarea.',error);return false;}
  })();
  return loader;
}
export function disposeCodeEditor():void {
  pending++;
  if(active){try{active.toTextArea();}catch{ /* Elemento ya retirado. */ } active=null;}
}
/** Call after a view is rendered; old async loads are discarded on navigation. */
export async function activateCodeEditor(onChange:(value:string)=>void,theme:'light'|'dark'):Promise<boolean> {
  const token=++pending;
  const textarea=document.querySelector<HTMLTextAreaElement>('#code-editor');
  if(!textarea)return false;
  if(!await ensureLoaded() || token!==pending || !textarea.isConnected || !window.CodeMirror)return false;
  const editor=window.CodeMirror.fromTextArea(textarea,{
    mode:'terrapixel-hcl',lineNumbers:true,lineWrapping:false,
    indentUnit:2,tabSize:2,indentWithTabs:false,matchBrackets:true,autoCloseBrackets:true,
    extraKeys:{Tab:(cm:{replaceSelection:(text:string)=>void})=>cm.replaceSelection('  ')}
  });
  active=editor;
  editor.on('change',()=>onChange(editor.getValue()));
  editor.setOption('theme',theme==='light'?'default':'default');
  const indicator=document.querySelector<HTMLElement>('.editor-tag');
  if(indicator)indicator.textContent='HCL · CodeMirror offline (v5)';
  return true;
}
