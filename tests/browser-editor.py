#!/usr/bin/env python3
"""Cross-platform HTTP CodeMirror 6 interaction smoke test (F6-02).

Uses Python `playwright` over localhost HTTP if installed; otherwise delegates to the
pinned Node `@playwright/test` runner (`tests/e2e/editor.spec.ts`), or fails closed (`exit 3`).
"""
from pathlib import Path
import os, socket, subprocess, sys, time

root = Path(__file__).resolve().parent.parent

try:
    from playwright.sync_api import sync_playwright  # type: ignore
except ModuleNotFoundError:
    pw_cli = root / 'node_modules' / '@playwright' / 'test' / 'cli.js'
    if pw_cli.is_file():
        res = subprocess.run(['node', str(pw_cli), 'test', 'tests/e2e/editor.spec.ts'], cwd=str(root))
        sys.exit(res.returncode)
    sys.stderr.write('BLOCKED: neither Python playwright nor @playwright/test is installed.\n')
    sys.exit(3)


def find_chromium() -> str | None:
    env_bin = os.environ.get('CHROMIUM_BIN')
    if env_bin and Path(env_bin).is_file():
        return env_bin
    local_app = os.environ.get('LOCALAPPDATA', '')
    if local_app:
        ms_pw = Path(local_app) / 'ms-playwright'
        if ms_pw.is_dir():
            for cand in sorted(ms_pw.glob('chromium-*/chrome-win64/chrome.exe'), reverse=True):
                if cand.is_file():
                    return str(cand)
    for linux_path in ('/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'):
        if Path(linux_path).is_file():
            return linux_path
    return None


def pick_free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('127.0.0.1', 0))
        return int(s.getsockname()[1])


port = pick_free_port()
proc = subprocess.Popen(
    ['node', str(root / 'scripts' / 'server.mjs')],
    cwd=str(root),
    env={**os.environ, 'HOST': '127.0.0.1', 'PORT': str(port)},
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
)

try:
    base_url = f'http://127.0.0.1:{port}'
    for _ in range(40):
        try:
            with socket.create_connection(('127.0.0.1', port), timeout=0.25):
                break
        except OSError:
            time.sleep(0.1)

    exec_path = find_chromium()
    launch_kwargs = {'headless': True, 'args': ['--no-sandbox', '--disable-dev-shm-usage']}
    if exec_path:
        launch_kwargs['executable_path'] = exec_path

    with sync_playwright() as pw:
        browser = pw.chromium.launch(**launch_kwargs)
        page = browser.new_page(viewport={'width': 1100, 'height': 760})
        errors: list[str] = []
        page.on('pageerror', lambda exc: errors.append(str(exc)))
        page.goto(f'{base_url}/#/leccion/B04', wait_until='networkidle')
        assert page.locator('.cm-editor').count() == 1
        assert page.locator('.cm-editor').get_attribute('data-editor-theme') == 'dark'
        assert page.locator('.cm-lineNumbers .cm-gutterElement').count() >= 2
        assert page.locator('.tok-keyword').count() >= 1
        page.locator('[data-action="theme-toggle"]').click()
        assert page.locator('.cm-editor').get_attribute('data-editor-theme') == 'light'
        assert not errors, errors
        print(f'EDITOR HTTP SMOKE: PASS over {base_url} (real CodeMirror 6 ESM, dark/light Compartment)')
        browser.close()
finally:
    proc.terminate()
    proc.wait(timeout=5)
