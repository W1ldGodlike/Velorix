/**
 * §8 фаза E — guard русских summary в Data/*_commands.json.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { REPO_ROOT } from '../lib/repo-root.mjs'
import {
  TERMINAL_DATA_COMMAND_FILES,
  terminalDataRowQualityIssue
} from '../lib/terminal-data-summary-quality.mjs'

const issues = []

for (const fileName of TERMINAL_DATA_COMMAND_FILES) {
  const path = join(REPO_ROOT, 'Data', fileName)
  const parsed = JSON.parse(readFileSync(path, 'utf8'))
  if (!Array.isArray(parsed)) {
    console.error(`[check:terminal-data-summaries] ${fileName}: expected array`)
    process.exit(1)
  }
  for (const row of parsed) {
    const issue = terminalDataRowQualityIssue(fileName, row)
    if (issue) {
      issues.push(issue)
    }
  }
}

if (issues.length > 0) {
  console.error(`[check:terminal-data-summaries] ${issues.length} issue(s):`)
  for (const i of issues) {
    console.error(`  ${i.file} token=${i.token}: ${i.reason}`)
  }
  process.exit(1)
}

console.log(
  `[check:terminal-data-summaries] OK (${TERMINAL_DATA_COMMAND_FILES.length} files, phase E copy guard)`
)
