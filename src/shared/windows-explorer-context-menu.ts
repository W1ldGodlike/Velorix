/** §14 — контекстное меню Проводника Windows (только Win; см. VELORIX_TZ §14). */

export const VELORIX_SHELL_OPEN_ARG = '--velorix-shell-open'
export const VELORIX_SHELL_QUICK_MP4_ARG = '--velorix-shell-quick-mp4'
/** NSIS post-install / portable: зарегистрировать меню и выйти (headless). */
export const VELORIX_INSTALL_REGISTER_EXPLORER_MENU = '--velorix-install-register-explorer-menu'
export const VELORIX_INSTALL_UNREGISTER_EXPLORER_MENU = '--velorix-install-unregister-explorer-menu'

export function isWindowsExplorerShellHeadlessArgv(
  argv: readonly string[] = process.argv
): 'register' | 'unregister' | null {
  if (argv.includes(VELORIX_INSTALL_UNREGISTER_EXPLORER_MENU)) {
    return 'unregister'
  }
  if (argv.includes(VELORIX_INSTALL_REGISTER_EXPLORER_MENU)) {
    return 'register'
  }
  return null
}

export const WINDOWS_EXPLORER_CONTEXT_MENU_SHELL_OPEN = 'Velorix.Open'
export const WINDOWS_EXPLORER_CONTEXT_MENU_SHELL_QUICK_MP4 = 'Velorix.QuickMp4'

/** Расширения видео для `SystemFileAssociations` (нижний регистр, с точкой). */
export const WINDOWS_EXPLORER_VIDEO_EXTENSIONS = [
  '.mp4',
  '.mkv',
  '.avi',
  '.mov',
  '.webm',
  '.wmv',
  '.m4v',
  '.flv',
  '.mpeg',
  '.mpg',
  '.ts',
  '.m2ts',
  '.3gp',
  '.ogv'
] as const

export type WindowsExplorerShellLaunchMode = 'open' | 'quick-mp4'

export type WindowsExplorerShellArgvIntent = {
  mode: WindowsExplorerShellLaunchMode
  filePath: string
}

export function isWindowsExplorerContextMenuVideoPath(filePath: string): boolean {
  const lower = filePath.trim().toLowerCase()
  const dot = lower.lastIndexOf('.')
  if (dot < 0) {
    return false
  }
  const ext = lower.slice(dot)
  return (WINDOWS_EXPLORER_VIDEO_EXTENSIONS as readonly string[]).includes(ext)
}

export function parseWindowsExplorerShellArgv(
  argv: readonly string[] = process.argv
): WindowsExplorerShellArgvIntent | null {
  const openIdx = argv.indexOf(VELORIX_SHELL_OPEN_ARG)
  const quickIdx = argv.indexOf(VELORIX_SHELL_QUICK_MP4_ARG)
  const flagIdx = openIdx >= 0 ? openIdx : quickIdx
  if (flagIdx < 0) {
    return null
  }
  const filePath = argv[flagIdx + 1]
  if (typeof filePath !== 'string' || filePath.trim().length === 0) {
    return null
  }
  const normalized = filePath.trim().replace(/^"(.*)"$/, '$1')
  if (!isWindowsExplorerContextMenuVideoPath(normalized)) {
    return null
  }
  return {
    mode: openIdx >= 0 ? 'open' : 'quick-mp4',
    filePath: normalized
  }
}

export function buildWindowsExplorerContextMenuCommand(
  exePath: string,
  mode: WindowsExplorerShellLaunchMode
): string {
  const flag = mode === 'open' ? VELORIX_SHELL_OPEN_ARG : VELORIX_SHELL_QUICK_MP4_ARG
  const quotedExe = `"${exePath.replace(/"/g, '\\"')}"`
  return `${quotedExe} ${flag} "%1"`
}

export function windowsExplorerContextMenuAssociationBase(extWithDot: string): string {
  const ext = extWithDot.startsWith('.') ? extWithDot : `.${extWithDot}`
  return `Software\\Classes\\SystemFileAssociations\\${ext}\\shell`
}
