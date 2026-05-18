/**
 * §21 — PACKAGED_E2E_SMOKE_SCENARIOS must cover every PACKAGED_MANUAL_SMOKE_STEPS id once.
 */
import { PACKAGED_E2E_SMOKE_REGISTRY } from '../src/shared/packaged-e2e-smoke-registry.ts'
import { PACKAGED_MANUAL_SMOKE_STEPS } from '../src/shared/packaged-manual-smoke-step-ids.ts'

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

if (failed) {
  process.exit(1)
}

console.log(
  `[check:packaged-e2e-scenarios-registry] OK (${registryIds.length} scenarios ↔ manual smoke steps)`
)
