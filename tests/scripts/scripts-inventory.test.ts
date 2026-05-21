import { existsSync, readdirSync, readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import {
  SCRIPTS_WIRING_EXEMPT_REL_PATHS,
  SCRIPTS_INVENTORY_BUCKETS,
  SCRIPTS_ROOT_CONFIG_FILE,
  TESTS_E2E_PLAYWRIGHT_DIR,
  TESTS_LAYOUT_BUCKETS,
  TESTS_VITEST_INCLUDE_GLOB,
  listScriptPathsFromPackageScripts
} from '../../src/shared/scripts-inventory-meta'
import {
  PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT,
  PACKAGED_GUI_E2E_PLAYWRIGHT_ORCHESTRATOR_MODULE,
  PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT,
  PACKAGED_GUI_E2E_PLAYWRIGHT_RUNNER_MODULE
} from '../../src/shared/packaged-gui-e2e-playwright-meta'
import { PLANNED_GUI_E2E_STEP_IDS } from '../e2e/gui/planned-gui-e2e-steps'

describe('scripts-inventory-meta', () => {
  it('lists script buckets and sole root config', () => {
    expect(SCRIPTS_INVENTORY_BUCKETS).toContain('gate')
    expect(SCRIPTS_INVENTORY_BUCKETS).toContain('e2e')
    expect(existsSync(SCRIPTS_ROOT_CONFIG_FILE)).toBe(true)
  })

  it('wiring-exempt script paths exist on disk', () => {
    for (const rel of SCRIPTS_WIRING_EXEMPT_REL_PATHS) {
      expect(existsSync(rel), rel).toBe(true)
    }
  })

  it('package.json script paths resolve to files', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
      scripts: Record<string, string>
    }
    for (const rel of listScriptPathsFromPackageScripts(pkg.scripts)) {
      expect(existsSync(rel), rel).toBe(true)
    }
  })

  it('tests layout dirs exist (Vitest vs Playwright)', () => {
    for (const { dir } of TESTS_LAYOUT_BUCKETS) {
      expect(existsSync(dir), dir).toBe(true)
    }
    expect(TESTS_VITEST_INCLUDE_GLOB).toBe('tests/**/*.test.ts')
    expect(readdirSync(TESTS_E2E_PLAYWRIGHT_DIR).some((f) => f.endsWith('.spec.ts'))).toBe(true)
    expect(readdirSync(TESTS_E2E_PLAYWRIGHT_DIR).some((f) => f.endsWith('.test.ts'))).toBe(true)
  })

  it('§21 test:e2e:gui uses Playwright orchestrator, not scaffold', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
      scripts: Record<string, string>
    }
    const script = pkg.scripts[PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT]
    expect(script).toContain(PACKAGED_GUI_E2E_PLAYWRIGHT_ORCHESTRATOR_MODULE)
    expect(script).not.toContain(PACKAGED_GUI_E2E_PLAYWRIGHT_RUNNER_MODULE)
    expect(existsSync(PACKAGED_GUI_E2E_PLAYWRIGHT_ORCHESTRATOR_MODULE)).toBe(true)
    expect(existsSync(PACKAGED_GUI_E2E_PLAYWRIGHT_RUNNER_MODULE)).toBe(true)
  })

  it('planned-gui-e2e step count locked', () => {
    expect(PLANNED_GUI_E2E_STEP_IDS.length).toBe(PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT)
  })
})
