/**
 * §15/§21 — package.json + check:quiet order for Help smoke guards (crosslinks meta).
 */
import fs from 'node:fs'
import path from 'node:path'

import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_NPM_SCRIPTS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_QUIET_STEP_LABELS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_REGISTRY_NPM_SCRIPT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_REQUIRED_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_REQUIRED_SNIPPETS
} from '../src/shared/packaged-e2e-help-workflow-crosslinks-meta.ts'
import { REPO_ROOT } from './lib/repo-root.mjs'

const packageJson = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'))
const scripts = packageJson.scripts ?? {}

const allGuardScripts = [
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_REGISTRY_NPM_SCRIPT,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_NPM_SCRIPTS
]

if (
  !PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_REQUIRED_SNIPPETS.includes(
    PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_REQUIRED_SNIPPET
  )
) {
  console.error(
    `[check:help-smoke-guards-package-json] WORKFLOW_REQUIRED_SNIPPETS must include ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_REQUIRED_SNIPPET}`
  )
  process.exit(1)
}

const missing = allGuardScripts.filter((name) => typeof scripts[name] !== 'string')
if (missing.length > 0) {
  console.error(
    `[check:help-smoke-guards-package-json] package.json missing scripts: ${missing.join(', ')}`
  )
  process.exit(1)
}

const quietText = fs.readFileSync(path.join(REPO_ROOT, 'scripts/run-quiet-check.mjs'), 'utf8')
const quietPositions = PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_QUIET_STEP_LABELS.map(
  (label) => quietText.indexOf(`['${label}',`)
)
if (quietPositions.some((pos) => pos < 0)) {
  console.error(
    '[check:help-smoke-guards-package-json] run-quiet-check.mjs missing Help guard step labels'
  )
  process.exit(1)
}
for (let i = 1; i < quietPositions.length; i++) {
  if (quietPositions[i] <= quietPositions[i - 1]) {
    console.error(
      '[check:help-smoke-guards-package-json] run-quiet-check Help guard steps out of order (registry → workflow → owner → packaged)'
    )
    process.exit(1)
  }
}

console.log(
  `[check:help-smoke-guards-package-json] OK (${allGuardScripts.length} Help guards; quiet order; partition in ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} workflow)`
)
