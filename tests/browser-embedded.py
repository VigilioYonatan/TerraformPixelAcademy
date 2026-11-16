#!/usr/bin/env python3
"""Browser-interaction smoke via inline ES modules. Does not verify HTTP assets or persistence.

Uses embedded modules because browser navigation to localhost is blocked in this runner.
Requires Python Playwright and locally installed Chromium; no npm/browser download.
"""
from pathlib import Path
import re,base64
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parent.parent

def module(name):
 text=(root/'app'/name).read_text()
 text=re.sub(r"from '(\./[^']+\.(?:js|mjs))'",lambda m:"from '"+module(m.group(1)[2:])+"'",text)
 return 'data:text/javascript;base64,'+base64.b64encode(text.encode()).decode()

html=(root/'index.html').read_text().replace('<link rel="stylesheet" href="./styles.css" />', '<style>'+(root/'styles.css').read_text()+'</style>')
html=html.replace('<script type="module" src="./app/main.js"></script>','<script type="module" src="'+module('main.js')+'"></script>')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1280,'height':900},accept_downloads=True)
 errors=[]
 page.on('pageerror',lambda exc:errors.append(str(exc)))
 page.set_content(html,wait_until='load');page.wait_for_timeout(200)
 assert 'TerraPixel' in page.locator('h1').first.inner_text()
 checked=0
 for route in ['inicio','aprender','leccion/B04','juegos','laboratorios','grafo','planes','senior','senior/S01','senior/S18','progreso','ajustes','recursos']:
  page.evaluate('(route)=>location.hash="#/"+route',route)
  page.wait_for_timeout(75)
  assert page.locator('h1').count()>=1,route
  assert 'No encontré esta ruta' not in page.locator('body').inner_text(),route
  checked+=1
 # User-supplied plan.json is inspected locally without displaying secrets.
 page.evaluate('location.hash="#/planes"');page.wait_for_timeout(100)
 assert page.locator('#user-plan-json').count()==1
 payload=b'{"format_version":"1.0","terraform_version":"1.10.5","variables":{"token":{"value":"DO_NOT_LEAK_123"}},"resource_changes":[{"address":"terraform_data.foo","change":{"actions":["delete","create"],"before":{"value":"DO_NOT_LEAK_123"},"before_sensitive":{"value":true}}}],"resource_drift":[{"address":"terraform_data.drifted","change":{"actions":["update"],"before":{"secret":"DO_NOT_LEAK_123"}}}]}'
 page.locator('#user-plan-json').set_input_files({'name':'plan.json','mimeType':'application/json','buffer':payload})
 page.wait_for_timeout(130)
 assert page.locator('.plan-import-results .plan-resource').count()==2
 assert '1 destructivos' in page.locator('#real-plan-review').inner_text()
 assert 'DO_NOT_LEAK_123' not in page.locator('body').inner_text()
 assert '1 eventos drift' in page.locator('#real-plan-review').inner_text()
 with page.expect_download(timeout=10000) as plan_export:
  page.locator('[data-action="export-user-plan"]').click()
 assert plan_export.value.suggested_filename=='TerraPixel-Revision-Plan-Local.md'
 exported=Path(plan_export.value.path()).read_text()
 assert 'terraform_data.drifted' in exported
 assert 'DO_NOT_LEAK_123' not in exported
 page.locator('[data-action="clear-user-plan"]').click()
 assert page.locator('.plan-import-results').count()==0
 checked+=1
 # S09: truly use entered CIDRs, not hardcoded fixtures.
 page.evaluate('location.hash="#/senior/S09"');page.wait_for_timeout(90)
 page.locator('[data-input="cidr-b"]').fill('10.41.0.0/16')
 page.locator('[data-action="check-cidr"]').click()
 assert 'Sin superposición' in page.locator('body').inner_text()
 page.locator('[data-input="cidr-b"]').fill('10.40.10.0/24')
 page.locator('[data-action="check-cidr"]').click()
 assert 'BLOQUEADO' in page.locator('body').inner_text();checked+=1
 # S11: differing commits blocked, matching commits pass.
 page.evaluate('location.hash="#/senior/S11"');page.wait_for_timeout(90)
 page.locator('[data-input="applied-commit"]').fill('a1b2')
 page.locator('[data-action="check-integrity"]').click()
 assert 'Coincidencia local' in page.locator('body').inner_text()
 page.locator('[data-input="applied-commit"]').fill('bad123')
 page.locator('[data-action="check-integrity"]').click()
 assert 'BLOQUEADO' in page.locator('body').inner_text();checked+=1
 # S14: cost estimate reacts to user input.
 page.evaluate('location.hash="#/senior/S14"');page.wait_for_timeout(90)
 page.locator('[data-input="replicas"]').fill('1')
 page.locator('[data-action="check-cost"]').click()
 assert 'USD 61/mes' in page.locator('body').inner_text();checked+=1
 # S01 end to end: choice, 4 checklist controls, ADR, export, completion
 page.evaluate('location.hash="#/senior/S01"');page.wait_for_timeout(90)
 page.locator('[data-action="case-tab"][data-id="decision"]').first.click()
 page.locator('[data-action="case-decision"][data-index="1"]').click()
 for i in range(4):
  page.locator(f'[data-input="case-check"][data-index="{i}"]').check()
 page.locator('[data-action="case-tab"][data-id="evidencia"]').first.click()
 adr='''Contexto: cambio de claves altera identidad de recursos administrados.
Decisión: bloquear apply y revisar moved con direcciones y plan.
Riesgos: reemplazo destructivo y pérdida de disponibilidad del servicio.
Evidencia: NOT_RUN, solo fixture sintético sin ejecutar terraform plan.
Rollback: mantener configuración anterior y restaurar bajo aprobación.'''
 page.locator('#senior-evidence').fill(adr)
 page.locator('[data-action="case-tab"][data-id="investigar"]').first.click()
 page.locator('[data-action="what-if-answer"][data-index="0"]').click()
 assert page.locator('[data-action="finish-case"]').is_enabled()
 with page.expect_download(timeout=10000) as info:page.locator('[data-action="export-senior"]').first.click()
 download=info.value
 assert download.suggested_filename=='S01-informe-senior.md'
 page.locator('[data-action="finish-case"]').click()
 assert 'Autoevaluado' in page.locator('body').inner_text();checked+=1
 # Invalidate what-if to revoke Senior badge and disable the gate.
 page.locator('[data-action="case-tab"][data-id="investigar"]').first.click()
 page.locator('[data-action="what-if-answer"][data-index="1"]').click()
 assert page.locator('[data-action="finish-case"]').is_disabled()
 assert 'Caso abierto' in page.locator('body').inner_text();checked+=1
 # S18 gate: capstone cannot finish before 8 declarations.
 page.evaluate('location.hash="#/senior/S18"');page.wait_for_timeout(90)
 assert page.locator('[data-action="finish-case"]').is_disabled();checked+=1
 # Responsive layout sanity: no document-level horizontal overflow on mobile.
 page.set_viewport_size({'width':390,'height':844})
 for route in ['inicio','aprender','leccion/B04','senior','senior/S01','senior/S18','ajustes']:
  page.evaluate('(route)=>location.hash="#/"+route',route)
  page.wait_for_timeout(60)
  metrics=page.evaluate('({scroll:document.documentElement.scrollWidth,viewport:innerWidth})')
  if metrics['scroll']>metrics['viewport']+2:
   offenders=page.evaluate('''() => [...document.querySelectorAll('*')].map(x=>({name:x.tagName.toLowerCase()+'.'+x.className, right:Math.round(x.getBoundingClientRect().right), width:Math.round(x.getBoundingClientRect().width)})).filter(x=>x.right>innerWidth+3 && x.width>0).sort((a,b)=>b.right-a.right).slice(0,15)''')
   print('OVERFLOW',route,metrics,offenders)
  assert metrics['scroll']<=metrics['viewport']+2,(route,metrics)
  checked+=1
 assert not errors, errors
 print(f'BROWSER EMBEDDED: PASS {checked} checks; 0 JS page errors. Does NOT verify HTTP navigation, images, storage or real Terraform.')
 browser.close()
