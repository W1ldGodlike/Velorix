/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Структурный аудит: размер файлов, TODO/FIXME, кандидаты на split (фаза 1/4 плана).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import {
  AUDIT_CODE_EXTENSIONS,
  AUDIT_CODE_ROOT_FILES,
  AUDIT_CODE_ROOTS,
  AUDIT_LARGE_MODULE_CANDIDATES,
  AUDIT_REPO_ROOT,
  AUDIT_SKIP_DIR_NAMES
} from './audit-scope.config.mjs'

const LINE_WARN = 400
const LINE_ERROR = 800

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

function collectScopeFiles() {
  const files = []
  for (const root of AUDIT_CODE_ROOTS) {
    try {
      files.push(...walk(join(AUDIT_REPO_ROOT, root)))
    } catch {
      // skip
    }
  }
  for (const f of AUDIT_CODE_ROOT_FILES) {
    const abs = join(AUDIT_REPO_ROOT, f)
    try {
      statSync(abs)
      files.push(abs)
    } catch {
      // skip
    }
  }
  return files
}

const files = collectScopeFiles()
const large = []
let todoTotal = 0

for (const file of files) {
  const text = readFileSync(file, 'utf8')
  const lines = text.split(/\r?\n/).length
  const rel = file.slice(AUDIT_REPO_ROOT.length + 1).replace(/\\/g, '/')
  const todos = (text.match(/\b(TODO|FIXME|HACK)\b/g) ?? []).length
  todoTotal += todos
  if (lines >= LINE_WARN) {
    large.push({ file: rel, lines, todos })
  }
}

large.sort((a, b) => b.lines - a.lines)

console.log(`[audit:structural] scope: ${files.length} files`)
console.log(`[audit:structural] TODO/FIXME/HACK total: ${todoTotal}`)
console.log(`[audit:structural] files >= ${LINE_WARN} lines: ${large.length}`)

for (const row of large.slice(0, 25)) {
  const flag = row.lines >= LINE_ERROR ? '!' : ' '
  console.log(`  [${flag}] ${row.lines} lines  todos=${row.todos}  ${row.file}`)
}

const LINE_LARGE_MODULE_MAX = 500

console.log('[audit:structural] configured large-module candidates:')
let largeModuleFail = false
for (const p of AUDIT_LARGE_MODULE_CANDIDATES) {
  const abs = join(AUDIT_REPO_ROOT, p)
  try {
    const lines = readFileSync(abs, 'utf8').split(/\r?\n/).length
    const over = lines > LINE_LARGE_MODULE_MAX
    console.log(`  ${over ? '!' : ' '} ${lines}  ${p}`)
    if (over) {
      largeModuleFail = true
      console.error(
        `[audit:structural] FAIL ${p}: ${lines} lines (max ${LINE_LARGE_MODULE_MAX} per phase-4 criterion)`
      )
    }
  } catch {
    console.log(`  ?  ${p} (missing)`)
    largeModuleFail = true
    console.error(`[audit:structural] FAIL missing large-module candidate: ${p}`)
  }
}

if (largeModuleFail) {
  process.exit(1)
}

console.log('[audit:structural] OK (informational)')
