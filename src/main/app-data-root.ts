import { join } from 'path'
import { app } from 'electron'
import { is } from '@electron-toolkit/utils'

import {
  FLUXALLOY_APP_DATA_ENV,
  resolveAppDataDirectoryFromInstallRoot,
  resolveInstallRootFromProcess
} from './app-data-root-paths'

export {
  APP_DATA_DIR_NAME,
  FLUXALLOY_APP_DATA_ENV,
  resolveAppTempDirectory,
  resolveInstallRootFromProcess
} from './app-data-root-paths'

export function resolveInstallRoot(): string {
  return resolveInstallRootFromProcess({
    platform: process.platform,
    execPath: process.execPath,
    dev: is.dev,
    appPath: app.getAppPath()
  })
}

/** Абсолютный путь к `<installRoot>/app-data`. */
export function resolveAppDataDirectory(): string {
  return resolveAppDataDirectoryFromInstallRoot(resolveInstallRoot())
}

/**
 * Перенаправляет Electron `userData` / `cache` / `crashDumps` в `<installRoot>/app-data`.
 * Вызывать до `app.whenReady()` и до любого `app.getPath('userData')`.
 */
export function configurePortableAppDataPaths(): void {
  const appDataRoot = resolveAppDataDirectory()
  process.env[FLUXALLOY_APP_DATA_ENV] = appDataRoot
  app.setPath('userData', appDataRoot)
  app.setPath('cache', join(appDataRoot, 'cache'))
  app.setPath('crashDumps', join(appDataRoot, 'crash-dumps'))
}
