/**
 * §21 Playwright GUI e2e — planned-gui-e2e registry rows (needs dist/win-unpacked or FLUXALLOY_E2E_APP).
 */
import { test } from '@playwright/test'
import type { ElectronApplication, Page } from 'playwright'

import {
  PACKAGED_GUI_E2E_APP_ENV_VAR,
  resolvePackagedGuiE2eAppPath
} from '../../../src/shared/packaged-gui-e2e-playwright-app-path'
import { PLANNED_GUI_E2E_SCENARIOS, plannedGuiE2eStepNeedsSampleMp4 } from './planned-gui-e2e-steps'
import {
  createPlannedGuiE2eSampleMp4,
  launchPackagedFluxAlloy,
  waitForMainShell
} from './planned-gui-e2e-launch'
import { runPlannedGuiE2eStep } from './planned-gui-e2e-step-runners'

const e2eApp = resolvePackagedGuiE2eAppPath(process.cwd())
const skipReason = `Set ${PACKAGED_GUI_E2E_APP_ENV_VAR} or npm run pack:dir (dist/win-unpacked/FluxAlloy.exe on Windows)`

test.describe.configure({ mode: 'serial' })

let electronApp: ElectronApplication | null = null
let sampleMp4: string | null = null

test.beforeAll(async () => {
  if (!e2eApp) {
    return
  }
  electronApp = await launchPackagedFluxAlloy(e2eApp)
  try {
    sampleMp4 = createPlannedGuiE2eSampleMp4(e2eApp)
  } catch {
    sampleMp4 = null
  }
})

test.afterAll(async () => {
  await electronApp?.close()
  electronApp = null
})

async function mainPage(): Promise<Page> {
  if (!electronApp) {
    throw new Error('electron app not launched')
  }
  const page = await electronApp.firstWindow()
  await waitForMainShell(page)
  return page
}

for (const row of PLANNED_GUI_E2E_SCENARIOS) {
  test.describe(`planned-gui-e2e:${row.stepId}`, () => {
    test.skip(!e2eApp, skipReason)

    test(row.note, async () => {
      if (plannedGuiE2eStepNeedsSampleMp4(row.stepId) && !sampleMp4) {
        test.skip(true, 'Packaged ffmpeg missing — cannot build sample MP4')
      }
      const page = await mainPage()
      await runPlannedGuiE2eStep(page, row, sampleMp4)
    })
  })
}
