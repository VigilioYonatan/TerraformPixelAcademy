#!/usr/bin/env python3
"""Interaction tests for 18 Senior drills + capstone, embedded ES modules.
Cannot validate real network-origin persistence, Terraform CLI, PNG loading or external APIs.
"""
from pathlib import Path
import re,base64
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parent.parent

def mod(filename):
 body=(root/'app'/filename).read_text(encoding='utf-8')
 body=re.sub(r"from '(\./[^']+\.(?:js|mjs))'",lambda m:"from '"+mod(m.group(1)[2:])+"'",body)
 return 'data:text/javascript;base64,'+base64.b64encode(body.encode()).decode()

html=(root/'index.html').read_text().replace('<link rel="stylesheet" href="./styles.css" />','<style>'+(root/'styles.css').read_text()+'</style>')
html=html.replace('<script type="module" src="./app/main.js"></script>','<script type="module" src="'+mod('main.js')+'"></script>')
checked=0
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1280,'height':860},accept_downloads=True)
 errors=[]
 page.on('pageerror',lambda err:errors.append(str(err)))
 page.set_content(html,wait_until='load');page.wait_for_timeout(150)
 for i in range(1,19):
  sid=f'S{i:02d}'
  page.evaluate('(route)=>location.hash=route',f'#/senior/{sid}');page.wait_for_timeout(36)
  assert page.locator('.what-if').count()==1,f'what-if missing {sid}'
  assert page.locator('[data-action="what-if-answer"]').count()==2,sid
  page.locator('[data-action="what-if-answer"]').first.click()
  assert page.locator('.what-if-result').count()==1,sid
  assert 'sintético' in page.locator('.what-if-result').inner_text(),sid
  checked+=1
 page.evaluate('location.hash="#/senior"');page.wait_for_timeout(80)
 with page.expect_download(timeout=12000) as download_info:page.locator('[data-action="export-portfolio"]').click()
 download=download_info.value
 assert download.suggested_filename=='TerraPixel-Portfolio-Senior.md'
 portfolio=Path(download.path()).read_text()
 for i in range(1,19):assert f'S{i:02d}' in portfolio
 assert 'NOT_RUN' in portfolio and 'Autoevaluados con gate vigente' in portfolio
 checked+=1
 # Complete S18 with durable, individual note per milestone (still only self assessment).
 page.evaluate('location.hash="#/senior/S18"');page.wait_for_timeout(100)
 page.locator('[data-action="case-tab"][data-id="decision"]').first.click()
 # Correct S18 choice is the third alternative
 page.locator('[data-action="case-decision"][data-index="2"]').click()
 for i in range(4):page.locator(f'[data-input="case-check"][data-index="{i}"]').check()
 page.locator('[data-action="case-tab"][data-id="evidencia"]').first.click()
 adr='''Contexto: falta contrato de estado y owners de plataformas en todos los entornos.
Decisión: exigir módulos acotados, estados separados por responsabilidad y ocho entregables.
Riesgos: drift, escalado de permisos y cambios destructivos no autorizados.
Evidencia: NOT_RUN, no hay Terraform CLI ni cloud en la academia.
Rollback: congelar cambios, recuperar con aprobación y comprobar restore en sandbox.'''
 page.locator('#senior-evidence').fill(adr)
 page.locator('[data-action="case-tab"][data-id="investigar"]').first.click()
 page.locator('[data-action="what-if-answer"][data-index="1"]').click()
 page.locator('[data-action="case-tab"][data-id="operaciones"]').first.click()
 assert page.locator('[data-action="finish-case"]').is_disabled()
 for i in range(8):
  item=page.locator(f'#capstone-note-{i}')
  item.fill(f'Hito {i+1}: estado NOT_RUN, revisar el riesgo único del control {i+1} y registrar un artefacto de respaldo bajo el owner {i+1}.')
  page.locator(f'#capstone-check-{i}').check()
 assert page.locator('[data-action="finish-case"]').is_enabled()
 checked+=1
 page.locator('[data-action="finish-case"]').click()
 assert 'Autoevaluado' in page.locator('body').inner_text()
 checked+=1
 # Changing one note invalidates S18 completion, and the UI blocks re-completion.
 page.locator('#capstone-note-3').fill('x')
 assert page.locator('#capstone-check-3').is_disabled()
 assert page.locator('[data-action="finish-case"]').is_disabled()
 assert 'Caso abierto' in page.locator('body').inner_text()
 checked+=1
 # Mobile and tablet horizontal checks on S18 detailed evidence view
 for size in [320,390,768,1440]:
  page.set_viewport_size({'width':size,'height':920})
  for route in ['senior','senior/S18','senior/S09']:
   page.evaluate('(value)=>location.hash="#/"+value',route);page.wait_for_timeout(45)
   width=page.evaluate('document.documentElement.scrollWidth');view=page.evaluate('window.innerWidth')
   assert width<=view+2,(size,route,width,view)
   checked+=1
 assert not errors,errors
 print(f'SENIOR EMBEDDED BROWSER: {checked} checks PASS; {len(errors)} JS errors. No HTTP-origin/E2E or Terraform execution implied.')
 browser.close()
