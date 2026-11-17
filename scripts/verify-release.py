#!/usr/bin/env python3
"""Verify each extracted release file against SHA256SUMS.txt without networking."""
from pathlib import Path
from hashlib import sha256
import sys
ROOT=Path(__file__).resolve().parent.parent
index=ROOT/'SHA256SUMS.txt'
if not index.is_file():
    sys.exit('FAIL: SHA256SUMS.txt falta')
expected={}
for line in index.read_text(encoding='utf8').splitlines():
    if not line.strip():continue
    digest, sep, path=line.partition('  ')
    if not sep or len(digest)!=64 or any(c not in '0123456789abcdef' for c in digest):
        sys.exit(f'FAIL: entrada malformada: {line[:140]}')
    relative=Path(path)
    if relative.is_absolute() or '..' in relative.parts or path=='SHA256SUMS.txt' or path in expected:
        sys.exit(f'FAIL: ruta inválida o repetida en manifiesto: {path}')
    expected[path]=digest
IGNORED_ROOTS={'.git','node_modules','coverage','playwright-report','test-results','terraform-verification-results','.tools','.vitest'}
current={p.relative_to(ROOT).as_posix() for p in ROOT.rglob('*') if p.is_file() and p!=index and p.relative_to(ROOT).parts[0] not in IGNORED_ROOTS}
issues=[]
for name in sorted(current^expected.keys()):
    issues.append(f'file absent from index or tree: {name}')
for name in sorted(current & expected.keys()):
    actual=sha256((ROOT/name).read_bytes()).hexdigest()
    if actual!=expected[name]:issues.append(f'SHA256 mismatch: {name}')
for error in issues[:20]:print('FAIL:',error)
print(f'VERIFY RELEASE: {len(expected)} files; {len(issues)} problems; {"PASS" if not issues else "FAIL"}')
sys.exit(bool(issues))
