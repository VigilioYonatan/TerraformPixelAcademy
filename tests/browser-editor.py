#!/usr/bin/env python3
"""Headless vendored CodeMirror 6 interaction in embedded DOM; no network."""
from pathlib import Path
import base64, os, re
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parent.parent

def module_data_uri(rel_name: str) -> str:
    text = (root / 'app' / rel_name).read_text(encoding='utf-8')
    text = re.sub(
        r"(?:from|import\()\s*'(\./[^']+\.(?:js|mjs))'\)?",
        lambda m: (
            f"import('{module_data_uri(m.group(1)[2:])}')"
            if m.group(0).startswith('import(')
            else f"from '{module_data_uri(m.group(1)[2:])}'"
        ),
        text,
    )
    return 'data:text/javascript;base64,' + base64.b64encode(text.encode('utf-8')).decode('ascii')

def find_chromium() -> str | None:
    local_app = os.environ.get('LOCALAPPDATA', '')
    if local_app:
        for rev in ('chromium-1254', 'chromium-1194'):
            cand = Path(local_app) / 'ms-playwright' / rev / 'chrome-win64' / 'chrome.exe'
            if cand.is_file():
                return str(cand)
    if Path('/usr/bin/chromium').is_file():
        return '/usr/bin/chromium'
    return None

editor_uri = module_data_uri('editor.js')
styles = (root / 'styles.css').read_text(encoding='utf-8')
exec_path = find_chromium()

with sync_playwright() as pw:
    launch_kwargs = {'headless': True, 'args': ['--no-sandbox', '--disable-dev-shm-usage']}
    if exec_path:
        launch_kwargs['executable_path'] = exec_path
    browser = pw.chromium.launch(**launch_kwargs)
    page = browser.new_page(viewport={'width': 1000, 'height': 720})
    errors = []
    page.on('pageerror', lambda exc: errors.append(str(exc)))
    page.set_content(
        '<html><head><style>'
        + styles
        + '</style></head><body data-theme="dark"><div class="editor-card"><span class="editor-tag">HCL · textarea</span>'
        + '<textarea id="code-editor" aria-label="Editor main.tf">resource "terraform_data" "lab" {\n  input = "hi"\n}</textarea></div></body></html>'
    )
    page.evaluate(
        """async url => {
            window.editorBridge = await import(url);
            window.lastCode = '';
            window.editorActivated = await window.editorBridge.activateCodeEditor(value => { window.lastCode = value; }, 'dark');
        }""",
        editor_uri,
    )
    assert page.evaluate('window.editorActivated') is True
    assert page.locator('.cm-editor').count() == 1
    assert page.locator('.cm-editor').get_attribute('data-editor-theme') == 'dark'
    assert page.locator('.cm-lineNumbers .cm-gutterElement').count() >= 2
    assert page.locator('.tok-keyword').count() >= 1
    page.get_by_role('textbox', name='Editor main.tf').click()
    page.keyboard.press('Control+End')
    page.keyboard.type('\noutput "status" {\n  value = "ok"\n}')
    code = page.evaluate('window.lastCode')
    assert 'output "status"' in code
    assert 'value = "ok"' in code
    page.evaluate("window.editorBridge.updateEditorTheme('light')")
    assert page.locator('.cm-editor').get_attribute('data-editor-theme') == 'light'
    page.evaluate('window.editorBridge.disposeCodeEditor()')
    assert page.locator('.cm-editor').count() == 0
    assert page.locator('textarea#code-editor').is_visible()
    assert not errors, errors
    print('EDITOR EMBEDDED: PASS 10 checks (real CodeMirror 6 offline ESM, dark/light Compartment, dispose)')
    browser.close()
