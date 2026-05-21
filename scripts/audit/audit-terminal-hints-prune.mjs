/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §8 audit: near-duplicate + low-value prune (dry-run default).
 * Один hint на шаблон команды: все числа → `#`, индексы потоков v:/a:/s:/d:/t: → `#`
 * (не держать 1,2,3… и v:0,v:1,v:2… если меняется только цифра).
 *   node scripts/audit-terminal-hints-prune.mjs
 *   node scripts/audit-terminal-hints-prune.mjs --write
 */
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { REPO_ROOT } from '../lib/repo-root.mjs'
import { listTerminalContractHintFiles } from '../maint/terminal-contract-hint-paths.mjs'
import {
  TERMINAL_CONTRACT_HINTS_DOWNLOADS_HINT_COUNT_FLOOR,
  formatTerminalContractHintsDownloadsShardBasename,
  formatTerminalContractHintsPreviewMediaShardBasename
} from '../../src/shared/terminal-contract-hints-meta.ts'

const PLACEHOLDER = '{{MEDIA}}'
const write = process.argv.includes('--write')
const sharedDir = join(REPO_ROOT, 'src/shared')

function loadProtectedDownloadsLines() {
  const lines = []
  const files = [
    'terminal-downloads-full-line-expectations.ts',
    'terminal-downloads-line-batches-a.ts',
    'terminal-downloads-line-batches-b.ts',
    'terminal-downloads-line-batches-c.ts'
  ]
  for (const name of files) {
    const text = readFileSync(join(REPO_ROOT, 'tests/fixtures', name), 'utf8')
    for (const m of text.matchAll(/'([^']+)'/g)) {
      const s = m[1].trim()
      if (s.startsWith('yt-dlp')) lines.push(s)
    }
  }
  return new Set(lines)
}

function loadProtectedPreviewRules() {
  const subPath = join(REPO_ROOT, 'tests/fixtures/terminal-preview-line-substring-cases.ts')
  const subText = readFileSync(subPath, 'utf8')
  const substrings = []
  for (const m of subText.matchAll(/'([^']+)'/g)) {
    substrings.push(m[1])
  }
  const predFiles = [
    'terminal-preview-line-predicate-cases-json.ts',
    'terminal-preview-line-predicate-cases-stream-a.ts',
    'terminal-preview-line-predicate-cases-stream-b.ts',
    'terminal-preview-line-predicate-cases-format.ts'
  ]
  const predicates = []
  for (const name of predFiles) {
    const pt = readFileSync(join(REPO_ROOT, 'tests/fixtures', name), 'utf8')
    const blocks = pt.matchAll(
      /\{\s*label:\s*'([^']+)',\s*includes:\s*\[([\s\S]*?)\](?:,\s*excludes:\s*\[([\s\S]*?)])?/g
    )
    for (const b of blocks) {
      const inc = [...b[2].matchAll(/'([^']+)'/g)].map((x) => x[1])
      const exc = b[3] ? [...b[3].matchAll(/'([^']+)'/g)].map((x) => x[1]) : []
      predicates.push({ label: b[1], includes: inc, excludes: exc })
    }
  }
  return { substrings, predicates }
}

function canonicalMediaPath(line) {
  return line.replace(/\$\{TERMINAL_CURRENT_FILE_PLACEHOLDER\}/g, PLACEHOLDER).trim()
}

/** Ключ дедупа: отличаются только числа и индекс дорожки (v:3 → v:#). */
function normalizeFullLine(line) {
  return canonicalMediaPath(line)
    .replace(/([vasdt]):(\d+)/gi, '$1:#')
    .replace(/\d+(\.\d+)?/g, '#')
    .replace(/%\+#\d+/g, '%+#')
    .replace(/\s+/g, ' ')
}

function streamIndexMax(line) {
  let max = -1
  for (const m of line.matchAll(/([vasdt]):(\d+)/gi)) {
    max = Math.max(max, Number(m[2]))
  }
  return max
}

function numericMagnitudeScore(line) {
  const nums = [...line.matchAll(/\d+(\.\d+)?/g)].map((m) => Number(m[0]))
  if (nums.length === 0) return 0
  return Math.max(...nums)
}

/** Лучший кандидат в группе с одним norm-ключом. */
function pickBestHint(candidates, opts) {
  const ranked = [...candidates].sort((a, b) => {
    const fa = canonicalMediaPath(a.fullLine)
    const fb = canonicalMediaPath(b.fullLine)
    const pa = opts.isProtected(fa) ? 0 : 1
    const pb = opts.isProtected(fb) ? 0 : 1
    if (pa !== pb) return pa - pb
    const sa = streamIndexMax(fa)
    const sb = streamIndexMax(fb)
    if (sa !== sb) return sa - sb
    const na = numericMagnitudeScore(fa)
    const nb = numericMagnitudeScore(fb)
    if (na !== nb) return na - nb
    return fa.length - fb.length
  })
  return ranked[0]
}

function isProtectedPreviewLine(line, rules) {
  for (const sub of rules.substrings) {
    if (line.includes(sub)) return true
  }
  for (const p of rules.predicates) {
    let ok = p.includes.every((s) => line.includes(s))
    if (p.excludes?.length) {
      ok = ok && p.excludes.every((s) => !line.includes(s))
    }
    if (ok && line.includes(PLACEHOLDER)) return true
  }
  return false
}

function parseHintBlocks(filePath) {
  const text = readFileSync(filePath, 'utf8')
  const entries = []
  const blockRe =
    /\{\s*tool:\s*'([^']+)',\s*token:\s*'((?:\\'|[^'])*)',\s*summary:\s*(?:\n\s*)?'((?:\\'|[^'])*)',\s*fullLine:\s*(?:'((?:\\'|[^'])*)'|`([^`]+)`)\s*\}/g
  let m
  while ((m = blockRe.exec(text)) !== null) {
    const summary = m[3].replace(/\\'/g, "'")
    const quoted = m[4]
    const templ = m[5]
    const fullLine = quoted ?? templ ?? ''
    entries.push({
      tool: m[1],
      token: m[2].replace(/\\'/g, "'"),
      summary,
      fullLine,
      usesTemplate: templ !== undefined
    })
  }
  return entries
}

function formatHintEntry(h, indent = '  ') {
  const summary = h.summary.replace(/'/g, "\\'")
  const token = h.token.replace(/'/g, "\\'")
  const summaryBlock = `${indent}  summary:\n${indent}    '${summary}',`
  if (h.usesTemplate) {
    const body = h.fullLine.replace(
      /\$\{TERMINAL_CURRENT_FILE_PLACEHOLDER\}/g,
      '${TERMINAL_CURRENT_FILE_PLACEHOLDER}'
    )
    return `${indent}{
${indent}  tool: '${h.tool}',
${indent}  token: '${token}',
${summaryBlock}
${indent}  fullLine: \`${body}\`
${indent}}`
  }
  const fullLine = h.fullLine.replace(/'/g, "\\'")
  return `${indent}{
${indent}  tool: '${h.tool}',
${indent}  token: '${token}',
${summaryBlock}
${indent}  fullLine: '${fullLine}'
${indent}}`
}

function emitShardFile(kind, partIndex, entries, totalParts) {
  const isDownloads = kind === 'downloads'
  const exportName = isDownloads
    ? `TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_${String(partIndex).padStart(2, '0')}`
    : `TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_${String(partIndex).padStart(2, '0')}`
  const note =
    totalParts > 1 ? ` (часть ${partIndex}/${totalParts}; §8 audit prune).` : ' (§8 audit prune).'
  const tab = isDownloads ? 'Загрузки' : 'превью/ffprobe'
  const imports = isDownloads
    ? "import type { TerminalCommandHintEntry } from './terminal-contract-types'\n"
    : "import type { TerminalCommandHintEntry } from './terminal-contract-types'\nimport { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'\n"
  const body = entries.map((h) => formatHintEntry(h)).join(',\n')
  return `${imports}
/** §8 — подсказки ${tab}${note} */
export const ${exportName}: TerminalCommandHintEntry[] = [
${body}
]
`
}

function splitIntoParts(entries, maxLinesPerFile = 498) {
  const parts = []
  let current = []
  let lineBudget = 8
  for (const h of entries) {
    const body = formatHintEntry(h, '  ')
    const approx = body.split('\n').length + 1
    if (current.length > 0 && lineBudget + approx > maxLinesPerFile) {
      parts.push(current)
      current = []
      lineBudget = 8
    }
    current.push(h)
    lineBudget += approx
  }
  if (current.length > 0) parts.push(current)
  return parts
}

function previewPredicateMatches(line, predicate) {
  let ok = predicate.includes.every((s) => line.includes(s))
  if (predicate.excludes?.length) {
    ok = ok && predicate.excludes.every((s) => !line.includes(s))
  }
  return ok && line.includes(PLACEHOLDER)
}

function pruneList(entries, opts) {
  const groups = new Map()
  const stats = { exact: 0, norm: 0, restored: 0 }

  for (const h of entries) {
    const fl = canonicalMediaPath(h.fullLine ?? '')
    if (!fl) continue
    const norm = normalizeFullLine(fl)
    if (!groups.has(norm)) groups.set(norm, [])
    groups.get(norm).push(h)
  }

  const kept = []
  const dropped = []
  for (const [, candidates] of groups) {
    const exactSeen = new Set()
    const uniq = []
    for (const h of candidates) {
      const fl = canonicalMediaPath(h.fullLine)
      if (exactSeen.has(fl)) {
        stats.exact++
        continue
      }
      exactSeen.add(fl)
      uniq.push(h)
    }
    if (uniq.length === 0) continue
    if (uniq.length > 1) stats.norm += uniq.length - 1
    const winner = pickBestHint(uniq, opts)
    kept.push(winner)
    for (const h of uniq) {
      if (h !== winner) dropped.push(h)
    }
  }

  if (opts.restoreDownloadsCoverage) {
    for (const line of opts.restoreDownloadsCoverage) {
      const norm = normalizeFullLine(line)
      if (
        kept.some((h) => canonicalMediaPath(h.fullLine) === line) ||
        kept.some((h) => normalizeFullLine(h.fullLine) === norm)
      ) {
        continue
      }
      const fix = dropped.find(
        (h) => canonicalMediaPath(h.fullLine) === line || normalizeFullLine(h.fullLine) === norm
      )
      if (!fix) continue
      kept.push(fix)
      stats.restored++
    }
  }

  if (opts.restorePreviewCoverage) {
    const lines = () => kept.map((h) => canonicalMediaPath(h.fullLine))
    for (const sub of opts.restorePreviewCoverage.substrings) {
      if (lines().some((l) => l.includes(sub))) continue
      const fix = dropped.find((h) => canonicalMediaPath(h.fullLine).includes(sub))
      if (!fix) continue
      kept.push(fix)
      stats.restored++
    }
    for (const pred of opts.restorePreviewCoverage.predicates) {
      if (lines().some((l) => previewPredicateMatches(l, pred))) continue
      const fix = dropped.find((h) => previewPredicateMatches(canonicalMediaPath(h.fullLine), pred))
      if (!fix) continue
      kept.push(fix)
      stats.restored++
    }
  }

  return { kept, stats }
}

function trimFixtureDownloadsToKept(keptDownloads) {
  const keptLines = new Set(keptDownloads.map((h) => canonicalMediaPath(h.fullLine)))
  const keptNorms = new Set(keptDownloads.map((h) => normalizeFullLine(h.fullLine)))
  const fixtureNames = [
    'terminal-downloads-full-line-expectations.ts',
    'terminal-downloads-line-batches-a.ts',
    'terminal-downloads-line-batches-b.ts',
    'terminal-downloads-line-batches-c.ts'
  ]
  let removed = 0
  for (const name of fixtureNames) {
    const path = join(REPO_ROOT, 'tests/fixtures', name)
    const text = readFileSync(path, 'utf8')
    const next = text.replace(/'([^']+)'/g, (full, inner) => {
      const s = inner.trim()
      if (!s.startsWith('yt-dlp')) return full
      if (keptLines.has(s)) return full
      if (keptNorms.has(normalizeFullLine(s))) {
        removed++
        return ''
      }
      return full
    })
    const cleaned = next
      .replace(/,\s*,/g, ',')
      .replace(/\[\s*,/g, '[')
      .replace(/,\s*]/g, ']')
      .replace(/,\s*,/g, ',')
    writeFileSync(path, cleaned, 'utf8')
  }
  return removed
}

const protectedDownloads = loadProtectedDownloadsLines()
const previewRules = loadProtectedPreviewRules()
const listed = listTerminalContractHintFiles()
let allDownloads = []
let allPreview = []

for (const fp of listed) {
  const base = fp.replace(/\\/g, '/').split('/').pop() ?? ''
  const entries = parseHintBlocks(fp)
  if (base.includes('downloads-')) allDownloads.push(...entries)
  else if (base.includes('preview-media-')) allPreview.push(...entries)
}

console.log('[audit] parsed:', allDownloads.length, 'downloads,', allPreview.length, 'preview')

const dl = pruneList(allDownloads, {
  isProtected: (fl) => protectedDownloads.has(fl),
  restoreDownloadsCoverage: protectedDownloads
})
const pv = pruneList(allPreview, {
  isProtected: (fl) => isProtectedPreviewLine(fl, previewRules),
  restorePreviewCoverage: previewRules
})

console.log('[audit] downloads drop exact/norm:', dl.stats, '→', dl.kept.length)
console.log('[audit] preview drop exact/norm/restored:', pv.stats, '→', pv.kept.length)

if (dl.kept.length < TERMINAL_CONTRACT_HINTS_DOWNLOADS_HINT_COUNT_FLOOR) {
  console.error(
    `[audit] downloads below floor ${TERMINAL_CONTRACT_HINTS_DOWNLOADS_HINT_COUNT_FLOOR}`
  )
  process.exit(1)
}

const keptDlNorms = new Set(dl.kept.map((h) => normalizeFullLine(h.fullLine)))
const catalogDlNorms = new Set(allDownloads.map((h) => normalizeFullLine(h.fullLine)))
for (const line of protectedDownloads) {
  const exact = dl.kept.some((h) => canonicalMediaPath(h.fullLine) === line)
  const normHit = keptDlNorms.has(normalizeFullLine(line))
  const inCatalog = catalogDlNorms.has(normalizeFullLine(line))
  if (!exact && !normHit && inCatalog) {
    console.error('[audit] missing protected downloads pattern:', line)
    process.exit(1)
  }
}

for (const sub of previewRules.substrings) {
  if (!pv.kept.some((h) => canonicalMediaPath(h.fullLine).includes(sub))) {
    console.error('[audit] missing preview substring:', sub)
    process.exit(1)
  }
}

for (const p of previewRules.predicates) {
  const hit = pv.kept.some((h) => {
    const line = canonicalMediaPath(h.fullLine)
    let ok = p.includes.every((s) => line.includes(s))
    if (p.excludes?.length) ok = ok && p.excludes.every((s) => !line.includes(s))
    return ok && line.includes(PLACEHOLDER)
  })
  if (!hit) {
    console.error('[audit] missing preview predicate:', p.label)
    process.exit(1)
  }
}

if (!write) {
  const dlParts = splitIntoParts(dl.kept)
  const pvParts = splitIntoParts(pv.kept)
  console.log('[audit] shard plan:', dlParts.length, 'downloads,', pvParts.length, 'preview parts')
  console.log('[audit] dry-run OK; --write to apply')
  process.exit(0)
}

const fixtureRemoved = trimFixtureDownloadsToKept(dl.kept)
console.log('[audit] fixture lines removed (norm-dup):', fixtureRemoved)

const dlParts = splitIntoParts(dl.kept)
const pvParts = splitIntoParts(pv.kept)

for (const fp of listed) {
  unlinkSync(fp)
}

for (let i = 1; i <= dlParts.length; i++) {
  writeFileSync(
    join(sharedDir, formatTerminalContractHintsDownloadsShardBasename(i)),
    emitShardFile('downloads', i, dlParts[i - 1], dlParts.length),
    'utf8'
  )
}
for (let i = 1; i <= pvParts.length; i++) {
  writeFileSync(
    join(sharedDir, formatTerminalContractHintsPreviewMediaShardBasename(i)),
    emitShardFile('preview', i, pvParts[i - 1], pvParts.length),
    'utf8'
  )
}

function writeBarrel(kind, partCount) {
  const isDownloads = kind === 'downloads'
  const barrelName = isDownloads
    ? 'terminal-contract-hints-downloads.ts'
    : 'terminal-contract-hints-preview-media.ts'
  const prefix = isDownloads
    ? 'TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_'
    : 'TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_'
  const fileStem = isDownloads
    ? 'terminal-contract-hints-downloads'
    : 'terminal-contract-hints-preview-media'
  const imports = []
  const spreads = []
  for (let i = 1; i <= partCount; i++) {
    const suffix = String(i).padStart(2, '0')
    imports.push(`import { ${prefix}${suffix} } from './${fileStem}-${suffix}'`)
    spreads.push(`  ...${prefix}${suffix}`)
  }
  const head = isDownloads
    ? '/** §8 — готовые строки для вкладки «Загрузки» (сборка из частей). */\n'
    : '/** §8 — ffprobe/ffmpeg по текущему превью (сборка из частей). */\n'
  const body = `${head}${imports.join('\n')}\n\nexport const ${
    isDownloads ? 'TERMINAL_SCENARIO_HINTS_DOWNLOADS' : 'TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA'
  } = [\n${spreads.join(',\n')}\n] as const\n`
  writeFileSync(join(sharedDir, barrelName), body, 'utf8')
}

function patchMeta(dlCount, pvCount, dlParts, pvParts) {
  const metaPath = join(sharedDir, 'terminal-contract-hints-meta.ts')
  let meta = readFileSync(metaPath, 'utf8')
  meta = meta.replace(
    /export const TERMINAL_CONTRACT_HINTS_DOWNLOADS_PART_COUNT = \d+/,
    `export const TERMINAL_CONTRACT_HINTS_DOWNLOADS_PART_COUNT = ${dlParts}`
  )
  meta = meta.replace(
    /export const TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_PART_COUNT = \d+/,
    `export const TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_PART_COUNT = ${pvParts}`
  )
  meta = meta.replace(
    /export const TERMINAL_CONTRACT_HINTS_DOWNLOADS_HINT_COUNT = \d+/,
    `export const TERMINAL_CONTRACT_HINTS_DOWNLOADS_HINT_COUNT = ${dlCount}`
  )
  meta = meta.replace(
    /export const TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_HINT_COUNT = \d+/,
    `export const TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_HINT_COUNT = ${pvCount}`
  )
  writeFileSync(metaPath, meta, 'utf8')
}

writeBarrel('downloads', dlParts.length)
writeBarrel('preview', pvParts.length)
patchMeta(dl.kept.length, pv.kept.length, dlParts.length, pvParts.length)

console.log('[audit] wrote parts', dlParts.length, '+', pvParts.length)
console.log('[audit] meta counts:', dl.kept.length, pv.kept.length)
