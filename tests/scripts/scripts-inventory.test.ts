import { existsSync, readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import {
  SCRIPTS_WIRING_EXEMPT_REL_PATHS,
  SCRIPTS_INVENTORY_BUCKETS,
  SCRIPTS_ROOT_CONFIG_FILE,
  TESTS_LAYOUT_BUCKETS,
  TESTS_VITEST_INCLUDE_GLOB,
  listScriptPathsFromPackageScripts
} from '../../src/shared/scripts-inventory-meta'
import { PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT } from '../../src/shared/packaged-gui-e2e-playwright-meta'

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

  it('tests layout dirs exist (Vitest only; Playwright GUI removed for UI ZERO)', () => {
    for (const { dir } of TESTS_LAYOUT_BUCKETS) {
      expect(existsSync(dir), dir).toBe(true)
    }
    expect(TESTS_VITEST_INCLUDE_GLOB).toBe('tests/**/*.test.ts')
    expect(PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT).toBe(0)
  })
})
