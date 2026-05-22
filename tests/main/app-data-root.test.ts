import { join, normalize } from 'path'
import { describe, expect, it } from 'vitest'

import {
  APP_DATA_DIR_NAME,
  resolveAppDataDirectoryFromInstallRoot,
  resolveAppTempDirectory,
  resolveInstallRootFromProcess
} from '../../src/main/core/app-data-root-paths'

describe('app-data-root-paths', () => {
  it('dev install root is app path', () => {
    expect(
      resolveInstallRootFromProcess({
        platform: 'win32',
        execPath: 'C:\\Apps\\Velorix\\Velorix.exe',
        dev: true,
        appPath: 'C:\\repo\\Velorix'
      })
    ).toBe('C:\\repo\\Velorix')
  })

  it('win packaged install root is exe directory', () => {
    expect(
      resolveInstallRootFromProcess({
        platform: 'win32',
        execPath: 'D:\\Tools\\Velorix\\Velorix.exe',
        dev: false,
        appPath: 'ignored'
      })
    ).toBe('D:\\Tools\\Velorix')
  })

  it('mac install root is .app bundle when exec in MacOS', () => {
    expect(
      resolveInstallRootFromProcess({
        platform: 'darwin',
        execPath: '/Applications/Velorix.app/Contents/MacOS/Velorix',
        dev: false,
        appPath: 'ignored'
      })
    ).toBe(normalize('/Applications/Velorix.app'))
  })

  it('data and temp paths are under install root', () => {
    const installRoot = resolveInstallRootFromProcess({
      platform: 'win32',
      execPath: 'D:\\Tools\\Velorix\\Velorix.exe',
      dev: false,
      appPath: 'ignored'
    })
    const dataRoot = resolveAppDataDirectoryFromInstallRoot(installRoot)
    expect(dataRoot).toBe(join(installRoot, APP_DATA_DIR_NAME))
    expect(resolveAppTempDirectory(dataRoot)).toBe(join(dataRoot, 'temp'))
  })
})
