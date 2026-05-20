/**
 * §15/§21 — package.json + check:quiet order for Help smoke guards (crosslinks meta).
 */
import fs from 'node:fs'
import path from 'node:path'

import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_NPM_SCRIPTS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_QUIET_STEP_LABELS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_REGISTRY_NPM_SCRIPT
} from './lib/help-workflow-crosslinks-meta.mjs'
import { PACKAGED_GUI_E2E_PLAYWRIGHT_QUIET_ORDER_ANCHORS } from '../src/shared/packaged-gui-e2e-playwright-meta.ts'
import { REPO_ROOT } from './lib/repo-root.mjs'

const packageJson = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'))
const scripts = packageJson.scripts ?? {}

const allGuardScripts = [
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_REGISTRY_NPM_SCRIPT,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_NPM_SCRIPTS
]

const missing = allGuardScripts.filter((name) => typeof scripts[name] !== 'string')
if (missing.length > 0) {
  console.error(
    `[check:help-smoke-guards-package-json] package.json missing scripts: ${missing.join(', ')}`
  )
  process.exit(1)
}

const quietText = fs.readFileSync(path.join(REPO_ROOT, 'scripts/run-quiet-check.mjs'), 'utf8')
const section21QuietPositions = PACKAGED_GUI_E2E_PLAYWRIGHT_QUIET_ORDER_ANCHORS.map((label) =>
  quietText.indexOf(`['${label}',`)
)
if (section21QuietPositions.some((pos) => pos < 0)) {
  console.error(
    '[check:help-smoke-guards-package-json] run-quiet-check.mjs missing §21 Playwright quiet order anchors'
  )
  process.exit(1)
}
for (let i = 1; i < section21QuietPositions.length; i++) {
  if (section21QuietPositions[i] <= section21QuietPositions[i - 1]) {
    console.error(
      '[check:help-smoke-guards-package-json] run-quiet-check §21 order: help-packaged → e2e-registry → terminal-hints-guards'
    )
    process.exit(1)
  }
}

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
  `[check:help-smoke-guards-package-json] OK (${allGuardScripts.length} Help guards; quiet order; ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} workflow articles)`
)
