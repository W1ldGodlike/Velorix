/**
 * §8 — package.json + check:quiet order for terminal hint guards (meta).
 */
import fs from 'node:fs'
import path from 'node:path'

import {
  TERMINAL_CONTRACT_HINTS_GUARD_NPM_SCRIPTS,
  TERMINAL_CONTRACT_HINTS_GUARD_QUIET_STEP_LABELS,
  TERMINAL_CONTRACT_HINTS_GUARD_REGISTRY_NPM_SCRIPT
} from '../src/shared/terminal-contract-hints-meta.ts'
import { REPO_ROOT } from './lib/repo-root.mjs'

const packageJson = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'))
const scripts = packageJson.scripts ?? {}

const allGuardScripts = [
  TERMINAL_CONTRACT_HINTS_GUARD_REGISTRY_NPM_SCRIPT,
  ...TERMINAL_CONTRACT_HINTS_GUARD_NPM_SCRIPTS
]

const missing = allGuardScripts.filter((name) => typeof scripts[name] !== 'string')
if (missing.length > 0) {
  console.error(
    `[check:terminal-hints-guards-package-json] package.json missing scripts: ${missing.join(', ')}`
  )
  process.exit(1)
}

const quietText = fs.readFileSync(path.join(REPO_ROOT, 'scripts/run-quiet-check.mjs'), 'utf8')
const quietPositions = TERMINAL_CONTRACT_HINTS_GUARD_QUIET_STEP_LABELS.map((label) =>
  quietText.indexOf(`['${label}',`)
)
if (quietPositions.some((pos) => pos < 0)) {
  console.error(
    '[check:terminal-hints-guards-package-json] run-quiet-check.mjs missing terminal guard step labels'
  )
  process.exit(1)
}
for (let i = 1; i < quietPositions.length; i++) {
  if (quietPositions[i] <= quietPositions[i - 1]) {
    console.error(
      '[check:terminal-hints-guards-package-json] run-quiet-check terminal guard steps out of order (registry → summaries → shards)'
    )
    process.exit(1)
  }
}

console.log(
  `[check:terminal-hints-guards-package-json] OK (${allGuardScripts.length} terminal guards; quiet order)`
)
