#!/usr/bin/env python3
"""Headless actual vendored CodeMirror interaction in embedded DOM; no network."""
from pathlib import Path
import base64
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parent.parent
vendor=root/'assets/vendor/codemirror5'
editor=(root/'app/editor.js').read_text()
module='data:text/javascript;base64,'+base64.b64encode(editor.encode()).decode()
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1000,'height':720})
 errors=[]
 page.on('pageerror',lambda exc: errors.append(str(exc)))
 page.set_content('<html><head><style>'+ (vendor/'codemirror.css').read_text()+'</style></head><body><span class="editor-tag">HCL · textarea</span><textarea id="code-editor">resource "terraform_data" "lab" {\n input = "hi"\n}</textarea></body></html>')
 for script in ['codemirror.js','mode-hcl.js','matchbrackets.js','closebrackets.js']:
  page.add_script_tag(content=(vendor/script).read_text())
 page.evaluate('''async url => {window.editorBridge=await import(url);window.lastCode='';window.editorActivated=await window.editorBridge.activateCodeEditor(value=>{window.lastCode=value;},'dark');}''',module)
 assert page.evaluate('window.editorActivated')
 assert page.locator('.CodeMirror').count()==1
 assert 'CodeMirror' in page.locator('.CodeMirror').get_attribute('class')
 assert page.locator('.CodeMirror-linenumber').count()>=2
 assert page.locator('.cm-keyword').count()>=1
 page.locator('.CodeMirror textarea').focus()
 page.keyboard.press('Control+End')
 page.keyboard.type('\n')
 page.keyboard.type('output "status" {')
 page.keyboard.press('Enter')
 page.keyboard.press('Tab')
 page.keyboard.type('value = "ok"')
 page.wait_for_timeout(120)
 code=page.evaluate('window.lastCode')
 assert 'output "status"' in code
 assert 'value = "ok"' in code
 page.evaluate('window.editorBridge.disposeCodeEditor()')
 assert page.locator('.CodeMirror').count()==0
 assert page.locator('textarea#code-editor').count()==1
 assert not errors,errors
 print('EDITOR EMBEDDED: PASS 8 checks (real CodeMirror 5.58.3, no HTTP or Terraform validation)')
 browser.close()
