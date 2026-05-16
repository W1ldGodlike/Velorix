/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Collect compound preview `lines.some` expects into predicate cases.
 * Run: node scripts/collect-terminal-preview-predicates.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const t = readFileSync('tests/shared/terminal-contract-scenarios.test.ts', 'utf8')

const previewItRe = /\n {2}it\('preview:((?:\\'|[^'])*)', \(\) => \{/g
const markers = []
let m
while ((m = previewItRe.exec(t)) !== null) {
  markers.push({
    label: m[1].replace(/\\'/g, "'").trim(),
    headerStart: m.index,
    bodyStart: m.index + m[0].length
  })
}
markers.push({ label: null, headerStart: t.length, bodyStart: t.length })

const expectRe = /expect\(\s*lines\.some\([\s\S]*?\)\s*\)\.toBe\(true\)/g
const includeRe = /(?<!!)l\.includes\('((?:\\'|[^'])*)'\)/g
const excludeRe = /!l\.includes\('((?:\\'|[^'])*)'\)/g

const KEEP_BLOCKS = new Set(['fullLine без кавычек, плейсхолдер ровно один раз'])

const cases = []

for (let i = 0; i < markers.length - 1; i++) {
  const { label, bodyStart } = markers[i]
  if (KEEP_BLOCKS.has(label)) {
    continue
  }
  const bodyEnd = markers[i + 1].headerStart
  const body = t.slice(bodyStart, bodyEnd)
  if (!body.includes('lines.some')) {
    continue
  }
  if (body.includes('for (const h of TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA')) {
    continue
  }

  let em
  while ((em = expectRe.exec(body)) !== null) {
    const chunk = em[0]
    const includes = []
    let im
    while ((im = includeRe.exec(chunk)) !== null) {
      includes.push(im[1].replace(/\\'/g, "'"))
    }
    const excludes = []
    let xm
    while ((xm = excludeRe.exec(chunk)) !== null) {
      excludes.push(xm[1].replace(/\\'/g, "'"))
    }
    if (includes.length === 0) {
      continue
    }
    const needPlaceholder = chunk.includes('TERMINAL_CURRENT_FILE_PLACEHOLDER')
    const caseLabel =
      includes.length === 1
        ? `${label} · ${includes[0]}`
        : `${label} · ${includes.slice(0, 2).join(' + ')}`
    cases.push({
      label: caseLabel,
      includes,
      ...(excludes.length > 0 ? { excludes } : {}),
      ...(needPlaceholder ? { needPlaceholder: true } : {})
    })
  }
}

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

const lines = cases.map((c) => {
  const inc = c.includes.map((s) => `'${esc(s)}'`).join(', ')
  const ex =
    c.excludes && c.excludes.length > 0
      ? `,\n    excludes: [${c.excludes.map((s) => `'${esc(s)}'`).join(', ')}] as const`
      : ''
  const ph = c.needPlaceholder ? ',\n    needPlaceholder: true' : ''
  return `  {\n    label: '${esc(c.label)}',\n    includes: [${inc}] as const${ex}${ph}\n  }`
})

const out = `/** Составные предикаты fullLine для smoke preview/ffprobe (§8 терминал). */
export type TerminalPreviewLinePredicate = {
  label: string
  includes: readonly string[]
  excludes?: readonly string[]
  needPlaceholder?: boolean
}

export const TERMINAL_PREVIEW_LINE_PREDICATES: readonly TerminalPreviewLinePredicate[] = [
${lines.join(',\n')}
]
`

writeFileSync('tests/fixtures/terminal-preview-line-predicate-cases.ts', out, 'utf8')
console.log(
  `[collect-preview-predicates] cases=${cases.length} previewBlocks=${markers.length - 1}`
)
