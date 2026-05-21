/**
 * §2.1 — различия ОС для main и smoke-скриптов (без Electron).
 * Прямой `process.platform` в `src/main/` — только allowlist (см. `check:native-main-platform`).
 */

export type NativeMainPlatformFamily = 'windows' | 'macos' | 'linux' | 'other'

/** Текущая ОС main/preload (единственная точка чтения `process.platform` для IPC в about). */
export function nativeMainCurrentPlatform(): NodeJS.Platform {
  return process.platform
}

export function nativeMainPlatformFamily(
  platform: NodeJS.Platform = process.platform
): NativeMainPlatformFamily {
  if (platform === 'win32') {
    return 'windows'
  }
  if (platform === 'darwin') {
    return 'macos'
  }
  if (platform === 'linux') {
    return 'linux'
  }
  return 'other'
}

export function isNativeMainWindows(platform: NodeJS.Platform = process.platform): boolean {
  return platform === 'win32'
}

export function isNativeMainMacos(platform: NodeJS.Platform = process.platform): boolean {
  return platform === 'darwin'
}

export function isNativeMainLinux(platform: NodeJS.Platform = process.platform): boolean {
  return platform === 'linux'
}

/** Суффикс bundled/userData движков (`.exe` на Windows). */
export function nativeMainEngineExecutableSuffix(
  platform: NodeJS.Platform = process.platform
): string {
  return isNativeMainWindows(platform) ? '.exe' : ''
}

export function nativeMainEngineBinaryName(
  base: 'ffmpeg' | 'ffprobe' | 'yt-dlp',
  platform: NodeJS.Platform = process.platform
): string {
  return `${base}${nativeMainEngineExecutableSuffix(platform)}`
}

export function nativeMainPathEnvSeparator(
  platform: NodeJS.Platform = process.platform
): ';' | ':' {
  return isNativeMainWindows(platform) ? ';' : ':'
}

export function nativeMainDevNullPath(
  platform: NodeJS.Platform = process.platform
): 'NUL' | '/dev/null' {
  return isNativeMainWindows(platform) ? 'NUL' : '/dev/null'
}

export function nativeMainPathSeparator(platform: NodeJS.Platform = process.platform): '\\' | '/' {
  return isNativeMainWindows(platform) ? '\\' : '/'
}

/** §6.4 — SIGSTOP/SIGCONT для yt-dlp (не Windows). */
export function isNativeMainYtdlpOsPauseSupported(
  platform: NodeJS.Platform = process.platform
): boolean {
  return !isNativeMainWindows(platform)
}

/** §3 — авто-загрузка движков в userData/bin (только Windows x64). */
export function isNativeMainEngineAutoDownloadSupported(
  platform: NodeJS.Platform = process.platform
): boolean {
  return isNativeMainWindows(platform)
}

/** Electron: не выходить при закрытии всех окон на macOS. */
export function isNativeMainQuitOnLastWindowClosed(
  platform: NodeJS.Platform = process.platform
): boolean {
  return !isNativeMainMacos(platform)
}

/** Linux window icon (BrowserWindow). */
export function isNativeMainBrowserWindowNeedsIcon(
  platform: NodeJS.Platform = process.platform
): boolean {
  return isNativeMainLinux(platform)
}

/** Диалог выбора exe: фильтр `.exe` только на Windows. */
export function nativeMainEngineOpenDialogFilters(
  labels: { executables: string; all: string },
  platform: NodeJS.Platform = process.platform
): { name: string; extensions: string[] }[] {
  if (isNativeMainWindows(platform)) {
    return [
      { name: labels.executables, extensions: ['exe'] },
      { name: labels.all, extensions: ['*'] }
    ]
  }
  return [{ name: labels.all, extensions: ['*'] }]
}

/** §3 — убить дерево дочерних процессов yt-dlp (Windows only). */
export function isNativeMainYtdlpKillProcessTreeSupported(
  platform: NodeJS.Platform = process.platform
): boolean {
  return isNativeMainWindows(platform)
}
