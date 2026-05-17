/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Phase 5: fail on TODO/FIXME/HACK in product code (`src/`, `tests/`).
 * Scripts/prompts are excluded (sprint-heading false positives).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import {
  AUDIT_CODE_EXTENSIONS,
  AUDIT_REPO_ROOT,
  AUDIT_SKIP_DIR_NAMES
} from './audit-scope.config.mjs'

const SCAN_ROOTS = ['src', 'tests']
const MARKER_RE = /\b(TODO|FIXME|HACK)\b/

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

function collectFiles() {
  const files = []
  for (const root of SCAN_ROOTS) {
    walk(join(AUDIT_REPO_ROOT, root), files)
  }
  return files
}

const hits = []
for (const file of collectFiles()) {
  const rel = file.slice(AUDIT_REPO_ROOT.length + 1).replace(/\\/g, '/')
  const lines = readFileSync(file, 'utf8').split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    if (MARKER_RE.test(lines[i])) {
      hits.push({ file: rel, line: i + 1, text: lines[i].trim() })
    }
  }
}

if (hits.length > 0) {
  console.error(`[audit:todo-debt] ${hits.length} marker(s) in src/tests:`)
  for (const h of hits) {
    console.error(`  ${h.file}:${h.line}  ${h.text.slice(0, 120)}`)
  }
  console.error('[audit:todo-debt] fix code, or document §N deferred without TODO/FIXME/HACK tokens')
  process.exit(1)
}

console.log('[audit:todo-debt] OK (0 markers in src/, tests/)')
