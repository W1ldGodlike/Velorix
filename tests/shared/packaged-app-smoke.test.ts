import { describe, expect, it } from 'vitest'

import {
  isMinimalPackagedAppElectronVersionOutput,
  listPackagedAppExeCandidatePaths,
  packagedAppAsarPath,
  packagedWinUnpackedRoot
} from '../../src/shared/packaged-app-smoke'

describe('packaged-app-smoke', () => {
  it('paths under dist/win-unpacked', () => {
    const prev = process.env['FLUXALLOY_APP_EXE_PATH']
    process.env['FLUXALLOY_APP_EXE_PATH'] = 'C:\\custom\\FluxAlloy.exe'
    try {
      expect(packagedWinUnpackedRoot('C:\\repo')).toBe('C:\\repo\\dist\\win-unpacked')
      expect(listPackagedAppExeCandidatePaths('C:\\repo')[0]).toBe('C:\\custom\\FluxAlloy.exe')
      expect(listPackagedAppExeCandidatePaths('C:\\repo')[1]).toMatch(/FluxAlloy\.exe$/i)
      expect(packagedAppAsarPath('C:\\repo')).toContain('resources\\app.asar')
    } finally {
      if (prev === undefined) {
        delete process.env['FLUXALLOY_APP_EXE_PATH']
      } else {
        process.env['FLUXALLOY_APP_EXE_PATH'] = prev
      }
    }
  })

  it('isMinimalPackagedAppElectronVersionOutput', () => {
    expect(isMinimalPackagedAppElectronVersionOutput('34.2.0')).toBe(true)
    expect(isMinimalPackagedAppElectronVersionOutput('')).toBe(false)
    expect(isMinimalPackagedAppElectronVersionOutput('node')).toBe(false)
  })
})
