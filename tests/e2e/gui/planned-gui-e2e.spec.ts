/**
 * §21 Playwright GUI e2e — one skipped test per `planned-gui-e2e` registry row.
 * Run: `npm run test:e2e:gui` (Playwright when `@playwright/test` installed).
 */
import { test } from '@playwright/test'

import {
  PACKAGED_GUI_E2E_APP_ENV_VAR,
  resolvePackagedGuiE2eAppPath
} from '../../../src/shared/packaged-gui-e2e-playwright-app-path.ts'
import { PLANNED_GUI_E2E_SCENARIOS } from './planned-gui-e2e-steps'

const e2eApp = resolvePackagedGuiE2eAppPath(process.cwd())
const skipReason = `Set ${PACKAGED_GUI_E2E_APP_ENV_VAR} or npm run pack:dir (dist/win-unpacked/FluxAlloy.exe on Windows)`

for (const row of PLANNED_GUI_E2E_SCENARIOS) {
  test.describe(`planned-gui-e2e:${row.stepId}`, () => {
    test.skip(!e2eApp, skipReason)
    test(`[todo] ${row.note}`, async () => {
      // Step body after owner-smoke on hardware (launch via FLUXALLOY_E2E_APP).
      void e2eApp
    })
  })
}
