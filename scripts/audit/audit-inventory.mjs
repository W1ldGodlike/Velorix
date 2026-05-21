/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Полный список файлов в scope аудита (для baseline и diff между итерациями).
 */
import { readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  AUDIT_CODE_EXTENSIONS,
  AUDIT_CODE_ROOT_FILES,
  AUDIT_CODE_ROOTS,
  AUDIT_REPO_ROOT,
  AUDIT_SKIP_DIR_NAMES
} from '../audit-scope.config.mjs'

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) {
      if (!AUDIT_SKIP_DIR_NAMES.has(name)) {
        walk(p, out)
      }
      continue
    }
    if (AUDIT_CODE_EXTENSIONS.test(name)) {
      out.push(p)
    }
  }
  return out
}

const files = []
for (const root of AUDIT_CODE_ROOTS) {
  const abs = join(AUDIT_REPO_ROOT, root)
  try {
    files.push(...walk(abs).map((p) => p.slice(AUDIT_REPO_ROOT.length + 1).replace(/\\/g, '/')))
  } catch {
    // root may not exist in partial checkout
  }
}
for (const f of AUDIT_CODE_ROOT_FILES) {
  try {
    statSync(join(AUDIT_REPO_ROOT, f))
    files.push(f.replace(/\\/g, '/'))
  } catch {
    // optional file
  }
}

files.sort()
const manifest = {
  generatedAt: new Date().toISOString(),
  repoRoot: AUDIT_REPO_ROOT,
  codeRoots: AUDIT_CODE_ROOTS,
  skipDirNames: [...AUDIT_SKIP_DIR_NAMES],
  fileCount: files.length,
  files
}

const outPath = join(AUDIT_REPO_ROOT, 'docs', 'audit-manifest.json')
writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
console.log(`[audit:inventory] ${files.length} files → docs/audit-manifest.json`)
