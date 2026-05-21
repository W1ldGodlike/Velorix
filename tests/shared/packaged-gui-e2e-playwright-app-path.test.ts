import { describe, expect, it } from 'vitest'

import {
  PACKAGED_GUI_E2E_APP_ENV_VAR,
  resolvePackagedGuiE2eAppPath
} from '../../src/shared/packaged-gui-e2e-playwright-app-path'

describe('packaged-gui-e2e-playwright-app-path §21', () => {
  it('exports FLUXALLOY_E2E_APP env name', () => {
    expect(PACKAGED_GUI_E2E_APP_ENV_VAR).toBe('FLUXALLOY_E2E_APP')
  })

  it('resolvePackagedGuiE2eAppPath prefers FLUXALLOY_E2E_APP when file exists', () => {
    const prev = process.env[PACKAGED_GUI_E2E_APP_ENV_VAR]
    process.env[PACKAGED_GUI_E2E_APP_ENV_VAR] = process.execPath
    expect(resolvePackagedGuiE2eAppPath(process.cwd())).toBe(process.execPath)
    if (prev === undefined) {
      delete process.env[PACKAGED_GUI_E2E_APP_ENV_VAR]
    } else {
      process.env[PACKAGED_GUI_E2E_APP_ENV_VAR] = prev
    }
  })

  it('resolvePackagedGuiE2eAppPath returns null for empty repo without unpacked tree', () => {
    expect(resolvePackagedGuiE2eAppPath('C:\\nonexistent-fluxalloy-e2e-root')).toBeNull()
  })
})
