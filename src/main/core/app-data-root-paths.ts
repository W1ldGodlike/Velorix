import { basename, dirname, join } from 'path'

/** Имя каталога runtime-данных рядом с установкой (настройки, логи, загрузки, кэш). */
export const APP_DATA_DIR_NAME = 'app-data'

/** Env с абсолютным путём app-data (main выставляет при старте; Vitest — без Electron). */
export const VELORIX_APP_DATA_ENV = 'VELORIX_APP_DATA'

/**
 * Корень установки: каталог с `Velorix.exe` (Windows/Linux) или `.app` (macOS).
 * В dev — корень репозитория (`app.getAppPath()`).
 */
export function resolveInstallRootFromProcess(opts: {
  platform: NodeJS.Platform
  execPath: string
  dev: boolean
  appPath: string
}): string {
  if (opts.dev) {
    return opts.appPath
  }
  if (opts.platform === 'darwin') {
    const execDir = dirname(opts.execPath)
    if (basename(execDir) === 'MacOS') {
      return join(execDir, '..', '..')
    }
    return dirname(opts.execPath)
  }
  return dirname(opts.execPath)
}

/** Временные каталоги ffmpeg и прочего — только внутри `app-data/temp`, не в системном %TEMP%. */
export function resolveAppTempDirectory(appDataRoot: string): string {
  return join(appDataRoot, 'temp')
}

export function resolveAppDataDirectoryFromInstallRoot(installRoot: string): string {
  return join(installRoot, APP_DATA_DIR_NAME)
}
