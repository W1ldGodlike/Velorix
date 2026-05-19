import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import {
  ELECTRON_VITE_ESM_SHIM_FIX_PLUGIN_NAME,
  ELECTRON_VITE_ESM_SHIM_FIX_TRIGGER_REL_PATH,
  formatElectronViteEsmShimFixDiagnosticLine
} from '../../src/shared/electron-vite-build-meta'
import { formatPlatformPackagingDiagnosticLines } from '../../src/shared/platform-packaging-scripts'

describe('electron-vite-build-meta §19', () => {
  it('exports fix:esm-shim plugin name and diagnostic line', () => {
    expect(ELECTRON_VITE_ESM_SHIM_FIX_PLUGIN_NAME).toBe('fix:esm-shim')
    expect(ELECTRON_VITE_ESM_SHIM_FIX_TRIGGER_REL_PATH).toBe('renderer-state-approach.ts')
    const diag = formatElectronViteEsmShimFixDiagnosticLine()
    expect(diag).toContain(ELECTRON_VITE_ESM_SHIM_FIX_PLUGIN_NAME)
    expect(formatPlatformPackagingDiagnosticLines()).toContain(diag)
  })

  it('electron.vite.config.ts registers fix:esm-shim plugin via build meta', () => {
    const text = readFileSync('electron.vite.config.ts', 'utf8')
    expect(text).toContain('electron-vite-build-meta')
    expect(text).toContain('ELECTRON_VITE_ESM_SHIM_FIX_PLUGIN_NAME')
    expect(text).toContain("p.name === 'vite:esm-shim'")
  })
})
