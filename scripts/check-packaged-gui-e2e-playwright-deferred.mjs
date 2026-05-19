/**
 * §21 — Playwright GUI e2e deferred: registry count, reserved npm name, diagnostics wiring.
 */
import fs from 'node:fs'
import path from 'node:path'

import {
  PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT,
  PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT,
  formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine
} from '../src/shared/packaged-gui-e2e-playwright-meta.ts'
import { PACKAGED_E2E_SMOKE_REGISTRY } from '../src/shared/packaged-e2e-smoke-registry.ts'
import { REPO_ROOT } from './lib/repo-root.mjs'

const packageScripts =
  JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8')).scripts ?? {}

const plannedIds = PACKAGED_E2E_SMOKE_REGISTRY.filter(
  (s) => s.automation === 'planned-gui-e2e'
).map((s) => s.stepId)

if (plannedIds.length !== PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT) {
  console.error(
    `[check:packaged-gui-e2e-playwright-deferred] planned-gui-e2e count ${plannedIds.length} !== ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT}`
  )
  process.exit(1)
}

if (typeof packageScripts[PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT] === 'string') {
  console.error(
    `[check:packaged-gui-e2e-playwright-deferred] package.json must not define ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT} until Playwright is wired`
  )
  process.exit(1)
}

const binReadmeText = fs.readFileSync(path.join(REPO_ROOT, 'bin/README.md'), 'utf8')
if (!binReadmeText.includes('check:packaged-gui-e2e-playwright-deferred')) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] bin/README.md must mention check:packaged-gui-e2e-playwright-deferred'
  )
  process.exit(1)
}

const packagingText = fs.readFileSync(
  path.join(REPO_ROOT, 'src/shared/platform-packaging-scripts.ts'),
  'utf8'
)
const diag = formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine()
const scenariosText = fs.readFileSync(
  path.join(REPO_ROOT, 'src/shared/packaged-e2e-smoke-scenarios.ts'),
  'utf8'
)
if (!scenariosText.includes('formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine()')) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] packaged-e2e-smoke-scenarios.ts must call formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine() in formatPackagedE2eSmokeDiagnosticLines (Copy/releaseSmoke appendix)'
  )
  process.exit(1)
}
for (const rel of [
  'src/shared/packaged-manual-smoke-plain-text.ts',
  'src/shared/packaged-release-smoke.ts'
]) {
  const text = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8')
  if (!text.includes('formatPackagedE2eSmokeDiagnosticLines')) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] ${rel} must use formatPackagedE2eSmokeDiagnosticLines (Playwright deferred diagnostic in appendix)`
    )
    process.exit(1)
  }
}
const checkReleaseText = fs.readFileSync(
  path.join(REPO_ROOT, 'src/shared/check-release-scripts.ts'),
  'utf8'
)
if (!checkReleaseText.includes('formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine()')) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] check-release-scripts.ts must call formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine()'
  )
  process.exit(1)
}
if (!packagingText.includes('formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine()')) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] platform-packaging-scripts.ts must call formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine()'
  )
  process.exit(1)
}

console.log(
  `[check:packaged-gui-e2e-playwright-deferred] OK (${plannedIds.length} planned-gui-e2e; ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT} deferred; ${diag})`
)
