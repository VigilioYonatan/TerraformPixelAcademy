#!/usr/bin/env python3
"""Preact catalog and CLI evidence import/export browser interaction smoke.
Embedded modules: NO HTTP origin E2E, real Terraform execution, or log verification.
"""
from pathlib import Path
import re,base64
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parent.parent

def mod(filename):
 body=(root/'app'/filename).read_text()
 body=re.sub(r"from '(\./[^']+\.(?:js|mjs))'",lambda m:"from '"+mod(m.group(1)[2:])+"'",body)
 return 'data:text/javascript;base64,'+base64.b64encode(body.encode()).decode()
html=(root/'index.html').read_text().replace('<link rel="stylesheet" href="./styles.css" />','<style>'+(root/'styles.css').read_text()+'</style>')
html=html.replace('<script type="module" src="./app/main.js"></script>','<script type="module" src="'+mod('main.js')+'"></script>')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1280,'height':900},accept_downloads=True)
 errors=[]
 page.on('pageerror',lambda err:errors.append(str(err)))
 page.set_content(html,wait_until='load');page.wait_for_timeout(100)
 checks=0
 page.evaluate('location.hash="#/aprender"');page.wait_for_timeout(70)
 assert page.locator('#learning-catalog').count()==1
 assert page.locator('.lesson-tile').count()==36
 checks+=2
 page.locator('[data-action="level"][data-id="Intermedio"]').click()
 assert page.locator('.lesson-tile').count()==12
 assert page.locator('[data-action="level"][data-id="Intermedio"]').get_attribute('aria-pressed')=='true'
 checks+=2
 page.locator('#lesson-search').fill('testing')
 assert page.locator('.lesson-tile:visible').count()<12
 page.locator('#lesson-search').fill('')
 assert page.locator('.lesson-tile:visible').count()==12
 checks+=2
 page.evaluate('location.hash="#/evidencias"');page.wait_for_timeout(85)
 assert page.locator('#cli-evidence-dashboard').count()==1
 assert 'Aún no hay resultados importados' in page.locator('body').inner_text()
 checks+=2
 source=(root/'assets/examples/cli-evidence-synthetic.json').read_bytes()
 page.locator('#cli-manifest-file').set_input_files({'name':'cli-evidence-synthetic.json','mimeType':'application/json','buffer':source})
 page.wait_for_timeout(100)
 assert page.locator('.evidence-row').count()==3
 assert 'SIMULACIÓN' in page.locator('#cli-evidence-dashboard').inner_text()
 assert 'SIN RESULTADO' in page.locator('#cli-evidence-dashboard').inner_text()
 checks+=3
 with page.expect_download(timeout=10000) as download:
  page.locator('[data-action="export-cli-manifest"]').click()
 contents=Path(download.value.path()).read_text()
 assert 'AUTODECLARADO' in contents and 'SYNTHETIC_EXAMPLE' in contents
 assert 'Terraform v1.10.5' not in contents
 checks+=2
 # Reject forged certificate-like payload and never render it.
 malicious=source.replace(b'SYNTHETIC_EXAMPLE',b'OFFICIALLY_CERTIFIED')
 page.locator('#cli-manifest-file').set_input_files({'name':'forged.json','mimeType':'application/json','buffer':malicious})
 page.wait_for_timeout(100)
 assert page.locator('#cli-evidence-dashboard [role="alert"]').count()==1
 assert page.locator('.evidence-row').count()==0
 checks+=2
 # On mobile no horizontal scroll to hide controls.
 page.set_viewport_size({'width':390,'height':844})
 page.wait_for_timeout(60)
 assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1')
 checks+=1
 page.evaluate('location.hash="#/senior"');page.wait_for_timeout(70)
 assert page.locator('a[href="#/evidencias"]').count()>=1
 checks+=1
 assert not errors,errors
 print(f'CATALOG & CLI EVIDENCE: {checks} Chromium embedded checks PASS; no JS errors. HTTP-origin not tested.')
 browser.close()
