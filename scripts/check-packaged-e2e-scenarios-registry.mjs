/**
 * §21 — PACKAGED_E2E_SMOKE_SCENARIOS must cover every PACKAGED_MANUAL_SMOKE_STEPS id once.
 */
import fs from 'node:fs'
import path from 'node:path'

import { PACKAGED_E2E_SMOKE_REGISTRY } from '../src/shared/packaged-e2e-smoke-registry.ts'
import { PACKAGED_MANUAL_SMOKE_STEPS } from '../src/shared/packaged-manual-smoke-step-ids.ts'
import { PACKAGED_E2E_CI_SMOKE_SCRIPT_EXPANSIONS } from '../src/shared/packaged-e2e-smoke-registry.ts'
import { REPO_ROOT } from './lib/repo-root.mjs'

const packageScripts = JSON.parse(
  fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8')
).scripts

const expectedIds = PACKAGED_MANUAL_SMOKE_STEPS.map((s) => s.id)
const registryIds = PACKAGED_E2E_SMOKE_REGISTRY.map((s) => s.stepId)

const missing = expectedIds.filter((id) => !registryIds.includes(id))
const extra = registryIds.filter((id) => !expectedIds.includes(id))
const dupes = registryIds.filter((id, i) => registryIds.indexOf(id) !== i)

let failed = false
if (missing.length > 0) {
  failed = true
  console.error(`[check:packaged-e2e-scenarios-registry] missing step ids: ${missing.join(', ')}`)
}
if (extra.length > 0) {
  failed = true
  console.error(`[check:packaged-e2e-scenarios-registry] unknown step ids: ${extra.join(', ')}`)
}
if (dupes.length > 0) {
  failed = true
  console.error(`[check:packaged-e2e-scenarios-registry] duplicate step ids: ${dupes.join(', ')}`)
}

for (const scenario of PACKAGED_E2E_SMOKE_REGISTRY) {
  const { stepId, automation, ciSmokeScript } = scenario
  if (automation === 'ci-headless' && !ciSmokeScript) {
    failed = true
    console.error(
      `[check:packaged-e2e-scenarios-registry] ${stepId}: ci-headless requires ciSmokeScript`
    )
  }
  if (automation === 'manual-owner' && ciSmokeScript) {
    failed = true
    console.error(
      `[check:packaged-e2e-scenarios-registry] ${stepId}: manual-owner must not set ciSmokeScript`
    )
  }
  if (ciSmokeScript && !Object.hasOwn(packageScripts, ciSmokeScript)) {
    failed = true
    console.error(
      `[check:packaged-e2e-scenarios-registry] ${stepId}: unknown npm script "${ciSmokeScript}"`
    )
  }
}

for (const [parent, children] of Object.entries(PACKAGED_E2E_CI_SMOKE_SCRIPT_EXPANSIONS)) {
  if (!Object.hasOwn(packageScripts, parent)) {
    failed = true
    console.error(
      `[check:packaged-e2e-scenarios-registry] expansion parent missing npm script "${parent}"`
    )
  }
  for (const child of children) {
    if (!Object.hasOwn(packageScripts, child)) {
      failed = true
      console.error(
        `[check:packaged-e2e-scenarios-registry] expansion ${parent} → unknown child "${child}"`
      )
    }
  }
}

if (failed) {
  process.exit(1)
}

const expansionCount = Object.keys(PACKAGED_E2E_CI_SMOKE_SCRIPT_EXPANSIONS).length
console.log(
  `[check:packaged-e2e-scenarios-registry] OK (${registryIds.length} scenarios ↔ manual smoke steps; ${expansionCount} CI expansions)`
)
