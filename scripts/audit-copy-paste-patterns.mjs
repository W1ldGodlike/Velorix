/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Эвристики копипасты по scope из audit-scope.config.mjs (число файлов не хардкодится).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import {
  AUDIT_CODE_EXTENSIONS,
  AUDIT_CODE_ROOT_FILES,
  AUDIT_CODE_ROOTS,
  AUDIT_REPO_ROOT,
  AUDIT_SKIP_DIR_NAMES
} from './audit-scope.config.mjs'

const WHITELIST_IF_CHAIN = /if\s*\(\s*raw\s*===\s*'[^']+'\s*\|\|/g
const EXPORT_PARSE_FN = /export function (parse\w+)/g
const FORMAT_EXPORT_LINE = /export function format\w+ExportLine/g
const INLINE_PROBE_BASE = /const\s+probeBase:\s*MediaProbeSuccess\s*=\s*\{/
const INLINE_APP_SETTINGS_BASE =
  /const\s+base:\s*AppSettings\s*=\s*\{\s*\r?\n\s*uiLocale:\s*'ru'/

const THRESHOLDS = {
  whitelistIfChains: 4,
  exportParseFns: 12,
  formatExportLines: 8,
  standaloneIt: 20,
  itEachMin: 1
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

function rel(p) {
  return p.slice(AUDIT_REPO_ROOT.length + 1).replace(/\\/g, '/')
}

function collectScopeFiles() {
  const files = []
  for (const root of AUDIT_CODE_ROOTS) {
    const abs = join(AUDIT_REPO_ROOT, root)
    try {
      files.push(...walk(abs))
    } catch {
      // missing root
    }
  }
  for (const f of AUDIT_CODE_ROOT_FILES) {
    const abs = join(AUDIT_REPO_ROOT, f)
    try {
      statSync(abs)
      files.push(abs)
    } catch {
      // optional
    }
  }
  return files
}

const files = collectScopeFiles()
const report = []
const regressions = []

for (const file of files) {
  const text = readFileSync(file, 'utf8')
  const r = rel(file)

  if (INLINE_PROBE_BASE.test(text) && !r.includes('tests/fixtures/')) {
    regressions.push(`${r}: inline probeBase → tests/fixtures/media-probe-success-base.ts`)
  }
  if (INLINE_APP_SETTINGS_BASE.test(text)) {
    regressions.push(`${r}: inline AppSettings base → tests/fixtures/app-settings-base.ts`)
  }

  const chains = text.match(WHITELIST_IF_CHAIN)?.length ?? 0
  const parseFns = text.match(EXPORT_PARSE_FN)?.length ?? 0
  const exportLines = text.match(FORMAT_EXPORT_LINE)?.length ?? 0

  if (chains >= THRESHOLDS.whitelistIfChains) {
    report.push({ file: r, kind: 'whitelist-if-chains', count: chains })
  }
  if (
    parseFns >= THRESHOLDS.exportParseFns &&
    !r.includes('registry') &&
    !r.includes('parse-registry')
  ) {
    report.push({ file: r, kind: 'many-export-parse', count: parseFns })
  }
  if (exportLines >= THRESHOLDS.formatExportLines && !r.includes('registry')) {
    report.push({ file: r, kind: 'many-format-export-lines', count: exportLines })
  }

  if (r.startsWith('tests/')) {
    const itCount = (text.match(/\bit\s*\(/g) ?? []).length
    const itEachCount = (text.match(/\bit\.each\s*\(/g) ?? []).length
    if (itCount >= THRESHOLDS.standaloneIt && itEachCount < THRESHOLDS.itEachMin) {
      report.push({ file: r, kind: 'many-standalone-it', count: itCount })
    }
  }
}

const protectedFiles = [
  ['src/main/ffmpeg-export-service.ts', WHITELIST_IF_CHAIN],
  ['src/main/settings-store.ts', WHITELIST_IF_CHAIN],
  ['src/shared/ffprobe-container-format.ts', /export function parseFfprobeFormat/]
]

for (const [path, pattern] of protectedFiles) {
  const abs = join(AUDIT_REPO_ROOT, path)
  try {
    const text = readFileSync(abs, 'utf8')
    const m = text.match(pattern)
    if (m && m.length > 0) {
      regressions.push(`${path}: regression (${m.length} matches)`)
    }
  } catch {
    regressions.push(`${path}: missing (scope error)`)
  }
}

let exitCode = 0
if (regressions.length > 0) {
  console.error('[audit:copy-paste] REGRESSION:')
  for (const line of regressions) {
    console.error(`  ${line}`)
  }
  exitCode = 1
}

console.log(`[audit:copy-paste] scope: ${files.length} files (${AUDIT_CODE_ROOTS.join(', ')}, …)`)

if (report.length > 0) {
  console.log('[audit:copy-paste] hotspots (см. docs/PROJECT_WIDE_AUDIT_REFACTOR_PLAN.md):')
  for (const row of report.sort((a, b) => b.count - a.count)) {
    console.log(`  ${row.kind} ×${row.count}  ${row.file}`)
  }
} else {
  console.log('[audit:copy-paste] no hotspots above threshold')
}

if (exitCode === 0) {
  console.log('[audit:copy-paste] OK')
}

process.exit(exitCode)
