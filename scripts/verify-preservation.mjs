/** Verify that every release baseline path still exists, without rewriting source files. */
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
for (const baseline of ['BASELINE_V1_4_FILES.txt', 'BASELINE_V1_5_1_FILES.txt']) {
  const manifest = (await readFile(join(root, 'docs', baseline), 'utf8'))
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith('#'));
  const missing = [];
  for (const rel of manifest) {
    try {
      if (!(await stat(join(root, rel))).isFile()) missing.push(rel);
    } catch {
      missing.push(rel);
    }
  }
  if (missing.length) {
    console.error(
      `PRESERVATION FAIL: ${baseline}, ${missing.length}/${manifest.length} paths missing`,
      missing.slice(0, 30)
    );
    process.exitCode = 1;
  } else console.log(`PRESERVATION PASS: ${baseline}, ${manifest.length}/${manifest.length} paths retained.`);
}
