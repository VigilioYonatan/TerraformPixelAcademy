#!/usr/bin/env python3
"""Browser checks for Preact shell and offline plan release gate.
Embedded data modules: NOT an HTTP-origin E2E or proof of Terraform execution.
"""
from pathlib import Path
import re, base64
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parent.parent

def mod(filename):
 body=(root/'app'/filename).read_text(encoding='utf-8')
 body=re.sub(r"from '(\./[^']+\.(?:js|mjs))'",lambda m:"from '"+mod(m.group(1)[2:])+"'",body)
 return 'data:text/javascript;base64,'+base64.b64encode(body.encode()).decode()

html=(root/'index.html').read_text().replace('<link rel="stylesheet" href="./styles.css" />','<style>'+(root/'styles.css').read_text()+'</style>')
html=html.replace('<script type="module" src="./app/main.js"></script>','<script type="module" src="'+mod('main.js')+'"></script>')
checks=0
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1280,'height':900},accept_downloads=True)
 errors=[]
 page.on('pageerror',lambda err:errors.append(str(err)))
 page.set_content(html,wait_until='load');page.wait_for_timeout(120)
 assert page.locator('header.header').count()==1
 assert page.locator('footer.footer').count()==1
 assert page.locator('a.skip-link').count()==1
 assert page.locator('nav.nav-links a.nav-link').count()==6
 checks+=4
 page.evaluate('location.hash="#/planes"');page.wait_for_timeout(80)
 payload=b'{"format_version":"1.2","terraform_version":"1.10.5","variables":{"token":{"value":"CANARY_NEVER_DISPLAY_67890"}},"resource_changes":[{"address":"terraform_data.demo","change":{"actions":["delete","create"],"before":{"token":"CANARY_NEVER_DISPLAY_67890"}}}]}'
 page.locator('#user-plan-json').set_input_files({'name':'plan.json','mimeType':'application/json','buffer':payload})
 page.wait_for_timeout(100)
 assert page.locator('#release-gate').count()==1
 assert 'CANARY_NEVER_DISPLAY_67890' not in page.locator('body').inner_text()
 checks+=2
 page.locator('[data-action="run-release-gate"]').click()
 assert page.locator('.release-gate .feedback h3').inner_text()=='BLOCKED'
 checks+=1
 for key in ['provenanceVerified','ownersApproved','driftInvestigated','destructiveReviewed','rollbackDocumented','costReviewed']:
  page.locator(f'[data-input="gate-check"][data-id="{key}"]').check()
 page.locator('[data-action="run-release-gate"]').click()
 assert 'READY_FOR_HUMAN_REVIEW' in page.locator('.release-gate .feedback h3').inner_text()
 checks+=1
 # Evidence changes invalidate the previously displayed status until re-evaluation.
 page.locator('[data-input="gate-check"][data-id="provenanceVerified"]').uncheck()
 assert page.locator('.release-gate .feedback').count()==0
 page.locator('[data-action="run-release-gate"]').click()
 assert page.locator('.release-gate .feedback h3').inner_text()=='BLOCKED'
 page.locator('[data-input="gate-check"][data-id="provenanceVerified"]').check()
 page.locator('[data-action="run-release-gate"]').click()
 checks+=2
 with page.expect_download(timeout=10000) as dl:
  page.locator('[data-action="export-release-gate"]').click()
 saved=Path(dl.value.path()).read_text()
 assert 'READY_FOR_HUMAN_REVIEW' in saved
 assert 'CANARY_NEVER_DISPLAY_67890' not in saved
 checks+=2
 page.locator('[data-action="clear-user-plan"]').click()
 assert page.locator('#release-gate').count()==0
 checks+=1
 page.evaluate('location.hash="#/senior"');page.wait_for_timeout(80)
 assert page.locator('.senior-case').count()==18
 page.locator('#senior-search').fill('for_each')
 assert page.locator('.senior-case:visible').count()>=1
 assert page.locator('.senior-case:visible').count()<18
 page.locator('#senior-search').fill('')
 assert page.locator('.senior-case:visible').count()==18
 checks+=3
 page.evaluate('location.hash="#/senior/S18"');page.wait_for_timeout(80)
 assert page.locator('nav.nav-links a[aria-current="page"]').count()==1
 checks+=1
 page.set_viewport_size({'width':390,'height':844})
 page.locator('[data-action="toggle-menu"]').click()
 assert page.locator('.mobile-menu').count()==1
 assert page.locator('.mobile-menu a.nav-link').count()==9
 checks+=2
 assert not errors, errors
 print(f'PREACT SHELL & RELEASE GATE: {checks} embedded browser assertions PASS; {len(errors)} page errors. HTTP-origin navigation NOT_VERIFIED.')
 browser.close()
