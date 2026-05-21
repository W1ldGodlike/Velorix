/**
 * §21 — planned GUI e2e (skipped until FLUXALLOY_E2E_APP or dist/win-unpacked/FluxAlloy.exe).
 * ESM config: Playwright loads this without pulling config into `tsconfig.node` (optional dep).
 */
import { defineConfig } from '@playwright/test'

import { formatPackagedGuiE2eAppPathHint } from './src/shared/packaged-gui-e2e-playwright-app-path.ts'

console.log(`[playwright.config] ${formatPackagedGuiE2eAppPathHint(process.cwd())}`)

export default defineConfig({
  testDir: 'tests/e2e/gui',
  testMatch: '*.spec.ts',
  timeout: 120_000,
  retries: 0,
  workers: 1,
  reporter: [['list']]
})
