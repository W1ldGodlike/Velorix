import { describe, expect, it } from 'vitest'

import {
  formatPackagedAppSmokeDiagnosticLines,
  isMinimalPackagedAppElectronVersionOutput,
  listPackagedAppExeCandidatePaths,
  packagedAppAsarPath,
  packagedWinUnpackedRoot
} from '../../src/shared/packaged-app-smoke'

describe('packaged-app-smoke', () => {
  it('paths under dist/win-unpacked', () => {
    const prev = process.env['VELORIX_APP_EXE_PATH']
    process.env['VELORIX_APP_EXE_PATH'] = 'C:\\custom\\Velorix.exe'
    try {
      expect(packagedWinUnpackedRoot('C:\\repo')).toBe('C:\\repo\\dist\\win-unpacked')
      expect(listPackagedAppExeCandidatePaths('C:\\repo')[0]).toBe('C:\\custom\\Velorix.exe')
      expect(listPackagedAppExeCandidatePaths('C:\\repo')[1]).toMatch(/VELORIX\.exe$/i)
      expect(packagedAppAsarPath('C:\\repo')).toContain('resources\\app.asar')
    } finally {
      if (prev === undefined) {
        delete process.env['VELORIX_APP_EXE_PATH']
      } else {
        process.env['VELORIX_APP_EXE_PATH'] = prev
      }
    }
  })

  it('isMinimalPackagedAppElectronVersionOutput', () => {
    expect(isMinimalPackagedAppElectronVersionOutput('34.2.0')).toBe(true)
    expect(isMinimalPackagedAppElectronVersionOutput('')).toBe(false)
    expect(isMinimalPackagedAppElectronVersionOutput('node')).toBe(false)
  })

  it('formatPackagedAppSmokeDiagnosticLines', () => {
    const lines = formatPackagedAppSmokeDiagnosticLines()
    expect(lines[0]).toContain('smoke:packaged-app')
    expect(lines.some((l) => l.includes('VELORIX_APP_EXE_PATH'))).toBe(true)
    expect(lines.some((l) => l.includes('check:terminal-summaries-ru'))).toBe(true)
  })
})
