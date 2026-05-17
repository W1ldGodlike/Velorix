/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Split terminal-contract.ts into types + hint parts (downloads 20×~53 hints, preview 15×~56).
 * Run: node scripts/split-terminal-contract.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

import { REPO_ROOT, readRepoLines } from './lib/repo-root.mjs'

const sharedDir = path.join(REPO_ROOT, 'src/shared')
const srcPath = path.join(sharedDir, 'terminal-contract.ts')
const lines = readRepoLines('src/shared/terminal-contract.ts')

const dlIdx = lines.findIndex((l) => l.includes('TERMINAL_SCENARIO_HINTS_DOWNLOADS'))
const pvIdx = lines.findIndex((l) => l.includes('TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA'))
const runIdx = lines.findIndex((l) => l.includes('export type TerminalRunRequest'))

function collectHintStarts(from, to) {
  const starts = []
  for (let i = from + 1; i < to; i++) {
    if (/^ {2}\{$/.test(lines[i])) {
      starts.push(i)
    }
  }
  return starts
}

function normalizeChunk(rawLines) {
  const chunk = [...rawLines]
  while (chunk.length > 0) {
    const t = chunk[chunk.length - 1].trim()
    if (t === '' || t === ']' || t.startsWith('/**') || t.startsWith('export const ')) {
      chunk.pop()
      continue
    }
    break
  }
  const last = chunk.length - 1
  if (last >= 0 && chunk[last].trim() === '},') {
    chunk[last] = '  }'
  } else if (last >= 0 && chunk[last].trim().endsWith(',')) {
    chunk[last] = chunk[last].replace(/,\s*$/, '')
  }
  return chunk.join('\n')
}

function writeHintParts(label, starts, endLine, count, filePrefix, constPrefix) {
  const per = Math.ceil(starts.length / count)
  const partNames = []
  for (let p = 0; p < count; p++) {
    const from = p * per
    const to = Math.min((p + 1) * per, starts.length)
    if (from >= starts.length) {
      break
    }
    const start = starts[from]
    const end = to < starts.length ? starts[to] : endLine
    const body = normalizeChunk(lines.slice(start, end))
    const suffix = String(p + 1).padStart(2, '0')
    const constName = `${constPrefix}_${suffix}`
    const file = path.join(sharedDir, `${filePrefix}-${suffix}.ts`)
    const usesPlaceholder = body.includes('TERMINAL_CURRENT_FILE_PLACEHOLDER')
    const placeholderImport = usesPlaceholder
      ? "\nimport { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'"
      : ''
    const header = `import type { TerminalCommandHintEntry } from './terminal-contract-types'${placeholderImport}

/** §8 — ${label} (часть ${suffix}). */
export const ${constName}: TerminalCommandHintEntry[] = [
`
    fs.writeFileSync(file, `${header}${body}\n]\n`)
    partNames.push({ constName, file: `./${filePrefix}-${suffix}` })
    console.log(`  ${file}: hints ${to - from}`)
  }
  return partNames
}

const typesBlock = lines.slice(0, 16).join('\n')
const runBlock = lines.slice(runIdx).join('\n')

fs.writeFileSync(
  path.join(sharedDir, 'terminal-contract-types.ts'),
  `${typesBlock}

${runBlock}
`
)

const dlStarts = collectHintStarts(dlIdx, pvIdx)
const pvStarts = collectHintStarts(pvIdx, runIdx)

const dlParts = writeHintParts(
  'подсказки вкладки «Загрузки»',
  dlStarts,
  pvIdx,
  20,
  'terminal-contract-hints-downloads',
  'TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART'
)

const pvParts = writeHintParts(
  'подсказки превью/ffprobe',
  pvStarts,
  runIdx,
  15,
  'terminal-contract-hints-preview-media',
  'TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART'
)

function writeAggregator(fileName, exportName, parts, comment) {
  const imports = parts.map((p) => `import { ${p.constName} } from '${p.file}'`).join('\n')
  const spreads = parts.map((p) => `  ...${p.constName},`).join('\n')
  const content = `${comment}
${imports}

export const ${exportName} = [
${spreads}
] as const
`
  fs.writeFileSync(path.join(sharedDir, fileName), content)
}

writeAggregator(
  'terminal-contract-hints-downloads.ts',
  'TERMINAL_SCENARIO_HINTS_DOWNLOADS',
  dlParts,
  '/** §8 — готовые строки для вкладки «Загрузки» (сборка из частей). */'
)

writeAggregator(
  'terminal-contract-hints-preview-media.ts',
  'TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA',
  pvParts,
  '/** §8 — ffprobe/ffmpeg по текущему превью (сборка из частей). */'
)

const entry = `/** Barrel: терминал §8 — типы и сценарные подсказки. */
export {
  TERMINAL_CURRENT_FILE_PLACEHOLDER,
  type TerminalCommandHintEntry,
  type TerminalRunRequest,
  type TerminalRunResult,
  type TerminalToolId
} from './terminal-contract-types'
export { TERMINAL_SCENARIO_HINTS_DOWNLOADS } from './terminal-contract-hints-downloads'
export { TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA } from './terminal-contract-hints-preview-media'
`

fs.writeFileSync(srcPath, entry)
console.log('[split-terminal-contract] types + downloads×20 + preview×15 + entry')
