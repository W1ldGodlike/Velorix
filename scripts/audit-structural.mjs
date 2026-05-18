/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Структурный аудит: TODO/FIXME; лимит строк на файл по всему audit-scope (фаза 4).
 * > MAX: split или запись в AUDIT_STRUCTURAL_OVERSIZE_JUSTIFIED (glob + reason).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import {
  AUDIT_CODE_EXTENSIONS,
  AUDIT_CODE_ROOT_FILES,
  AUDIT_CODE_ROOTS,
  AUDIT_REPO_ROOT,
  AUDIT_SKIP_DIR_NAMES,
  AUDIT_STRUCTURAL_MAX_LINES,
  AUDIT_STRUCTURAL_OVERSIZE_JUSTIFIED
} from './audit-scope.config.mjs'

const LINE_WARN = 400
const MIN_JUSTIFIED_REASON_CHARS = 20

function globMatch(pattern, relPath) {
  const re = new RegExp(
    '^' +
      pattern
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*\*/g, '<<<GLOBSTAR>>>')
        .replace(/\*/g, '[^/]*')
        .replace(/<<<GLOBSTAR>>>/g, '.*') +
      '$'
  )
  return re.test(relPath)
}

function findOversizeJustification(relPath) {
  for (const entry of AUDIT_STRUCTURAL_OVERSIZE_JUSTIFIED) {
    if (globMatch(entry.glob, relPath)) {
      return entry
    }
  }
  return null
}

function validateJustifiedConfig() {
  const errors = []
  for (const entry of AUDIT_STRUCTURAL_OVERSIZE_JUSTIFIED) {
    if (!entry?.glob?.trim()) {
      errors.push('AUDIT_STRUCTURAL_OVERSIZE_JUSTIFIED: missing glob')
      continue
    }
    const reason = entry.reason?.trim() ?? ''
    if (reason.length < MIN_JUSTIFIED_REASON_CHARS) {
      errors.push(
        `AUDIT_STRUCTURAL_OVERSIZE_JUSTIFIED: "${entry.glob}" reason must be >= ${MIN_JUSTIFIED_REASON_CHARS} chars`
      )
    }
  }
  if (errors.length > 0) {
    for (const msg of errors) {
      console.error(`[audit:structural] ${msg}`)
    }
    process.exit(1)
  }
}

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

validateJustifiedConfig()

const files = collectScopeFiles()
const large = []
const overMax = []
const justifiedOversize = []
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
  if (lines > AUDIT_STRUCTURAL_MAX_LINES) {
    const justification = findOversizeJustification(rel)
    if (justification) {
      justifiedOversize.push({ file: rel, lines, reason: justification.reason.trim() })
    } else {
      overMax.push({ file: rel, lines })
    }
  }
}

large.sort((a, b) => b.lines - a.lines)
overMax.sort((a, b) => b.lines - a.lines)
justifiedOversize.sort((a, b) => b.lines - a.lines)

console.log(`[audit:structural] scope: ${files.length} files`)
console.log(
  `[audit:structural] max lines per file: ${AUDIT_STRUCTURAL_MAX_LINES} (whole scope; oversize only with justified glob+reason)`
)
if (AUDIT_STRUCTURAL_OVERSIZE_JUSTIFIED.length > 0) {
  console.log(
    `[audit:structural] justified oversize globs: ${AUDIT_STRUCTURAL_OVERSIZE_JUSTIFIED.map((e) => e.glob).join(', ')}`
  )
}
console.log(`[audit:structural] TODO/FIXME/HACK total: ${todoTotal}`)
console.log(`[audit:structural] files >= ${LINE_WARN} lines: ${large.length}`)

for (const row of large.slice(0, 25)) {
  const over = row.lines > AUDIT_STRUCTURAL_MAX_LINES ? '!' : ' '
  console.log(`  [${over}] ${row.lines} lines  todos=${row.todos}  ${row.file}`)
}

if (justifiedOversize.length > 0) {
  console.log(
    `[audit:structural] justified oversize (>${AUDIT_STRUCTURAL_MAX_LINES}): ${justifiedOversize.length}`
  )
  for (const row of justifiedOversize) {
    console.log(`  ~ ${row.lines}  ${row.file}`)
    console.log(`      reason: ${row.reason}`)
  }
}

if (overMax.length > 0) {
  console.error(
    `[audit:structural] FAIL ${overMax.length} file(s) exceed ${AUDIT_STRUCTURAL_MAX_LINES} lines without justification — split or add { glob, reason } to AUDIT_STRUCTURAL_OVERSIZE_JUSTIFIED in audit-scope.config.mjs:`
  )
  for (const row of overMax) {
    console.error(`  ${row.lines}  ${row.file}`)
  }
  process.exit(1)
}

console.log('[audit:structural] OK')
