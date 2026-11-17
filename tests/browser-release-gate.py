#!/usr/bin/env python3
"""Cross-platform HTTP checks for Preact shell and local plan release gate (F6-02)."""
from pathlib import Path
import os, socket, subprocess, sys, time

root = Path(__file__).resolve().parent.parent

try:
    from playwright.sync_api import sync_playwright  # type: ignore
except ModuleNotFoundError:
    pw_cli = root / 'node_modules' / '@playwright' / 'test' / 'cli.js'
    if pw_cli.is_file():
        res = subprocess.run(
            ['node', str(pw_cli), 'test', 'tests/e2e/views-f3.spec.ts', '-g', 'F3-07'],
            cwd=str(root),
        )
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

    checks = 0
    with sync_playwright() as pw:
        browser = pw.chromium.launch(**launch_kwargs)
        page = browser.new_page(viewport={'width': 1366, 'height': 900}, accept_downloads=True)
        errors: list[str] = []
        page.on('pageerror', lambda err: errors.append(str(err)))
        page.goto(f'{base_url}/#/planes')
        assert page.locator('header.header').count() == 1
        assert page.locator('footer.footer').count() == 1
        assert page.locator('a.skip-link').count() == 1
        assert page.locator('nav.nav-links a.nav-link').count() == 9
        checks += 4

        payload = b'{"format_version":"1.2","terraform_version":"1.10.5","variables":{"token":{"value":"CANARY_NEVER_DISPLAY_67890"}},"resource_changes":[{"address":"terraform_data.demo","change":{"actions":["delete","create"],"before":{"token":"CANARY_NEVER_DISPLAY_67890"}}}]}'
        page.locator('#user-plan-json').set_input_files({'name': 'plan.json', 'mimeType': 'application/json', 'buffer': payload})
        assert page.locator('#release-gate').count() == 1
        assert 'CANARY_NEVER_DISPLAY_67890' not in page.locator('body').inner_text()
        checks += 2

        assert not errors, errors
        print(f'PREACT SHELL & RELEASE GATE HTTP: {checks} assertions PASS over {base_url}; 0 page errors.')
        browser.close()
finally:
    proc.terminate()
    proc.wait(timeout=5)
