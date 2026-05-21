/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §21 — `npm run test:e2e:gui`: Playwright spec when `@playwright/test` is installed, else scaffold runner.
 */
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import { PACKAGED_GUI_E2E_PLAYWRIGHT_RUNNER_MODULE } from '../../src/shared/packaged-gui-e2e-playwright-meta.ts'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const require = createRequire(import.meta.url)
const LOG_PREFIX = 'test:e2e:gui'

function hasPlaywrightTest() {
  try {
    require.resolve('@playwright/test/package.json', { paths: [rootDir] })
    return true
  } catch {
    return false
  }
}

function runScaffold() {
  const scaffold = join(rootDir, PACKAGED_GUI_E2E_PLAYWRIGHT_RUNNER_MODULE)
  const result = spawnSync(process.execPath, [scaffold], {
    cwd: rootDir,
    stdio: 'inherit',
    env: process.env
  })
  process.exit(result.status ?? 1)
}

function runPlaywright() {
  const configPath = join(rootDir, 'playwright.config.mjs')
  const pwCli = join(rootDir, 'node_modules', '@playwright', 'test', 'cli.js')
  const result = spawnSync(process.execPath, [pwCli, 'test', '--config', configPath], {
    cwd: rootDir,
    stdio: 'inherit',
    env: process.env
  })
  if (result.error) {
    console.error(`[${LOG_PREFIX}] playwright spawn failed:`, result.error.message)
    console.error(
      `[${LOG_PREFIX}] fallback: npm install && npx playwright install chromium (optional)`
    )
    runScaffold()
  }
  process.exit(result.status ?? 1)
}

if (!hasPlaywrightTest()) {
  console.log(
    `[${LOG_PREFIX}] @playwright/test not installed — ${PACKAGED_GUI_E2E_PLAYWRIGHT_RUNNER_MODULE}`
  )
  runScaffold()
}

runPlaywright()
