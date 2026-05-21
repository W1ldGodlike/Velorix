/**
 * §8 фаза E — guard summary в `terminal-contract-hints-*.ts`.
 */
import { readFileSync } from 'node:fs'

import { terminalDataSummaryQualityIssue } from '../lib/terminal-data-summary-quality.mjs'
import { listTerminalContractHintFiles } from '../maint/terminal-contract-hint-paths.mjs'

const summaryRe = /summary:\s*(?:\n\s*)?'((?:[^'\\]|\\.)*)'/g
const issues = []

for (const filePath of listTerminalContractHintFiles()) {
  const base = filePath.replace(/\\/g, '/').split('/').pop() ?? filePath
  const s = readFileSync(filePath, 'utf8')
  let m
  while ((m = summaryRe.exec(s))) {
    const inner = m[1].replace(/\\'/g, "'")
    const reason = terminalDataSummaryQualityIssue(inner)
    if (reason !== null) {
      issues.push({ file: base, reason, preview: inner.slice(0, 72) })
    }
  }
}

if (issues.length > 0) {
  console.error(`[check:terminal-scenario-summaries] ${issues.length} issue(s):`)
  for (const i of issues.slice(0, 24)) {
    console.error(`  ${i.file}: ${i.reason} — ${i.preview}`)
  }
  if (issues.length > 24) {
    console.error(`  … and ${issues.length - 24} more`)
  }
  process.exit(1)
}

console.log(
  `[check:terminal-scenario-summaries] OK (${listTerminalContractHintFiles().length} hint shards)`
)
