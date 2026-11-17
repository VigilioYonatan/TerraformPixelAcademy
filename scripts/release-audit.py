#!/usr/bin/env python3
"""Audit source/package consistency. No Terraform CLI execution implied."""
import sys, pathlib, zipfile, hashlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
errors = []
checks = 0

def require(ok,msg):
 global checks
 checks+=1
 if not ok:errors.append(msg)

for item in ['TODO_LO_QUE_DEBE_TENER_ESTA_APP.md','index.html','styles.css','app/main.js','src/main.ts','scripts/server.mjs','assets/reference/concepto-aprobado.png','docs/AUDITORIA_TOTAL_ZERO_OMISSIONS.md','docs/AUDITORIA_FINAL_V1_3.md','docs/SENIOR_MODE_AUDIT_V1_3.md','src/seniorProgress.ts','src/seniorWhatIf.ts','scripts/verify-terraform-labs.sh','scripts/verify-terraform-labs.ps1','src/uiShell.ts','src/uiSeniorHub.ts','src/releaseGate.ts','tools/typescript/LICENSE.txt','docs/AUDITORIA_FINAL_V1_6.md','docs/BASELINE_V1_5_1_FILES.txt']:
 require((ROOT/item).is_file(),f'missing {item}')
all_tests=[]
for prefix in 'BIA':
 for num in range(1,13):
  id=f'{prefix}{num:02d}';d=ROOT/'labs/offline'/id;z=ROOT/'assets/labs'/f'{id}.zip';require(z.exists(),f'missing ZIP {id}')
  for fn in ['main.tf','practice.tftest.hcl','README.md','STATUS.md','exercise-template.tf.txt','solution-reference.tf.txt']:
   require((d/fn).is_file(),f'missing {id}/{fn}')
  if not z.is_file():continue
  with zipfile.ZipFile(z) as bundle:
   require(bundle.testzip() is None,f'CRC invalid {id}')
   for f in d.iterdir():
    if not f.is_file():continue
    path=f'{id}/{f.name}'
    require(path in bundle.namelist(),f'archive missing {path}')
    if path in bundle.namelist():require(bundle.read(path)==f.read_bytes(),f'diverging {path}')
  main=(d/'main.tf').read_text()
  test=(d/'practice.tftest.hcl').read_text()
  require('output "academy_evidence"' in main,f'missing topic evidence {id}')
  require('output.academy_evidence' in test,f'missing topic assertion {id}')
  require('backend "s3"' not in main and 'resource "aws_' not in main,f'unsafe cloud example in {id}')
  all_tests.append(main)
require(len(set(all_tests))==36,'HCL labs are not unique')
for num in range(1,19):
 id=f'S{num:02d}';d=ROOT/'labs/senior'/id;z=ROOT/'assets/senior'/f'{id}.zip';require(z.exists(),f'missing Senior ZIP {id}')
 for fn in ['WHAT-IF-SCENARIO.json','WHAT-IF-WORKSHEET.md','CASE-REVIEW-SHEET.md']:
  require((d/fn).is_file(),f'missing new Senior file {id}/{fn}')
 if not z.is_file():continue
 with zipfile.ZipFile(z) as bundle:
  require(bundle.testzip() is None,f'CRC invalid Senior {id}')
  require(len(bundle.namelist())==len(set(bundle.namelist())),f'duplicate archive entries {id}')
  require(all(not name.startswith('/') and '..' not in pathlib.PurePosixPath(name).parts for name in bundle.namelist()),f'unsafe ZIP names {id}')
  for file in d.rglob('*'):
   if not file.is_file():continue
   path=f'{id}/{file.relative_to(d).as_posix()}'
   require(path in bundle.namelist(),f'missing Senior archive entry {path}')
   if path in bundle.namelist():require(bundle.read(path)==file.read_bytes(),f'divergent Senior {path}')
for file in (ROOT/'assets/terra').glob('*.png'):
 require(file.read_bytes().startswith(b'\x89PNG\r\n\x1a\n'),f'bad PNG {file}')
IGNORED_ROOTS = {'.git', 'node_modules', 'dist', 'coverage', 'playwright-report', 'test-results', 'terraform-verification-results', '.tools', '.vitest'}
for file in ROOT.rglob('*'):
 rel_parts = file.relative_to(ROOT).parts
 if file.is_file() and (not rel_parts or rel_parts[0] not in IGNORED_ROOTS):
  if re.search(rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|ghp_[A-Za-z0-9]{36}|AKIA[0-9A-Z]{16}',file.read_bytes()[:5_000_000]):errors.append(f'potential key material {file}')
print(f'{checks} structural/archive validations: {"PASS" if not errors else "FAIL"}')
for err in errors: print('FAIL:',err)
sys.exit(bool(errors))
