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
        execPath: 'C:\\Apps\\FluxAlloy\\FluxAlloy.exe',
        dev: true,
        appPath: 'C:\\repo\\FluxAlloy'
      })
    ).toBe('C:\\repo\\FluxAlloy')
  })

  it('win packaged install root is exe directory', () => {
    expect(
      resolveInstallRootFromProcess({
        platform: 'win32',
        execPath: 'D:\\Tools\\FluxAlloy\\FluxAlloy.exe',
        dev: false,
        appPath: 'ignored'
      })
    ).toBe('D:\\Tools\\FluxAlloy')
  })

  it('mac install root is .app bundle when exec in MacOS', () => {
    expect(
      resolveInstallRootFromProcess({
        platform: 'darwin',
        execPath: '/Applications/FluxAlloy.app/Contents/MacOS/FluxAlloy',
        dev: false,
        appPath: 'ignored'
      })
    ).toBe(normalize('/Applications/FluxAlloy.app'))
  })

  it('data and temp paths are under install root', () => {
    const installRoot = resolveInstallRootFromProcess({
      platform: 'win32',
      execPath: 'D:\\Tools\\FluxAlloy\\FluxAlloy.exe',
      dev: false,
      appPath: 'ignored'
    })
    const dataRoot = resolveAppDataDirectoryFromInstallRoot(installRoot)
    expect(dataRoot).toBe(join(installRoot, APP_DATA_DIR_NAME))
    expect(resolveAppTempDirectory(dataRoot)).toBe(join(dataRoot, 'temp'))
  })
})
