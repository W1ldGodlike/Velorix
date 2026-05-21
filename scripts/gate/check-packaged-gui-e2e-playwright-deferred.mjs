/**
 * §21 — Playwright GUI e2e wiring guard (`test:e2e:gui`; optional; not in check:quiet).
 */
import fs from 'node:fs'
import path from 'node:path'

import {
  PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT,
  PACKAGED_GUI_E2E_PLAYWRIGHT_CONFIG_MODULE,
  PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT,
  PACKAGED_GUI_E2E_PLAYWRIGHT_ORCHESTRATOR_MODULE,
  PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE,
  PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SPEC_MODULE,
  PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT,
  PACKAGED_GUI_E2E_PLAYWRIGHT_RUNNER_MODULE,
  PACKAGED_GUI_E2E_PLAYWRIGHT_SCAFFOLD_EXPORTS
} from '../../src/shared/packaged-gui-e2e-playwright-meta.ts'
import { PACKAGED_E2E_SMOKE_REGISTRY } from '../../src/shared/packaged-e2e-smoke-registry.ts'
import { REPO_ROOT } from '../lib/repo-root.mjs'

const LOG_PREFIX = 'check:packaged-gui-e2e-playwright-deferred'
const packageScripts =
  JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8')).scripts ?? {}

const plannedIds = PACKAGED_E2E_SMOKE_REGISTRY.filter(
  (s) => s.automation === 'planned-gui-e2e'
).map((s) => s.stepId)

if (plannedIds.length !== PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT) {
  console.error(
    `[${LOG_PREFIX}] planned-gui-e2e count ${plannedIds.length} !== ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT}`
  )
  process.exit(1)
}

const guiScript = packageScripts[PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT]
if (typeof guiScript !== 'string' || guiScript.trim().length === 0) {
  console.error(
    `[${LOG_PREFIX}] package.json must define ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT}`
  )
  process.exit(1)
}

const orchestratorBasename = path.basename(PACKAGED_GUI_E2E_PLAYWRIGHT_ORCHESTRATOR_MODULE)
if (!guiScript.includes(orchestratorBasename)) {
  console.error(
    `[${LOG_PREFIX}] ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT} must invoke ${PACKAGED_GUI_E2E_PLAYWRIGHT_ORCHESTRATOR_MODULE} (got: ${guiScript})`
  )
  process.exit(1)
}

for (const rel of [
  PACKAGED_GUI_E2E_PLAYWRIGHT_ORCHESTRATOR_MODULE,
  PACKAGED_GUI_E2E_PLAYWRIGHT_RUNNER_MODULE,
  PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SPEC_MODULE,
  PACKAGED_GUI_E2E_PLAYWRIGHT_CONFIG_MODULE
]) {
  if (!fs.existsSync(path.join(REPO_ROOT, rel))) {
    console.error(`[${LOG_PREFIX}] missing ${rel}`)
    process.exit(1)
  }
}

const specText = fs.readFileSync(
  path.join(REPO_ROOT, PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SPEC_MODULE),
  'utf8'
)
if (
  !specText.includes('PLANNED_GUI_E2E_SCENARIOS') ||
  !specText.includes('planned-gui-e2e:${row.stepId}')
) {
  console.error(
    `[${LOG_PREFIX}] ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SPEC_MODULE} must loop PLANNED_GUI_E2E_SCENARIOS with planned-gui-e2e:\${row.stepId} describes`
  )
  process.exit(1)
}
if (!specText.includes('test.skip')) {
  console.error(
    `[${LOG_PREFIX}] ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SPEC_MODULE} must use test.skip until FLUXALLOY_E2E_APP`
  )
  process.exit(1)
}

const scaffoldPath = path.join(REPO_ROOT, PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE)
if (!fs.existsSync(scaffoldPath)) {
  console.error(`[${LOG_PREFIX}] missing ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE}`)
  process.exit(1)
}

const scaffoldText = fs.readFileSync(scaffoldPath, 'utf8')
for (const exportName of PACKAGED_GUI_E2E_PLAYWRIGHT_SCAFFOLD_EXPORTS.split(',').map((s) =>
  s.trim()
)) {
  if (!scaffoldText.includes(exportName)) {
    console.error(`[${LOG_PREFIX}] scaffold missing export ${exportName}`)
    process.exit(1)
  }
}

if (typeof packageScripts[PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT] !== 'string') {
  console.error(
    `[${LOG_PREFIX}] package.json missing ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT}`
  )
  process.exit(1)
}

console.log(
  `[${LOG_PREFIX}] OK (${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} planned-gui-e2e; ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT} → ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SPEC_MODULE})`
)
