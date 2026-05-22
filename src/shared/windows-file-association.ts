/** §14 — «Открыть с помощью» для видео в Windows (HKCU OpenWithProgids, не default app). */

import {
  buildWindowsExplorerContextMenuCommand,
  WINDOWS_EXPLORER_VIDEO_EXTENSIONS
} from './windows-explorer-context-menu'

export const VELORIX_INSTALL_REGISTER_OPEN_WITH = '--velorix-install-register-open-with'
export const VELORIX_INSTALL_UNREGISTER_OPEN_WITH = '--velorix-install-unregister-open-with'

export const WINDOWS_FILE_ASSOCIATION_PROG_ID = 'Velorix.VideoFile'

export function isWindowsFileAssociationHeadlessArgv(
  argv: readonly string[] = process.argv
): 'register' | 'unregister' | null {
  if (argv.includes(VELORIX_INSTALL_UNREGISTER_OPEN_WITH)) {
    return 'unregister'
  }
  if (argv.includes(VELORIX_INSTALL_REGISTER_OPEN_WITH)) {
    return 'register'
  }
  return null
}

export function windowsFileAssociationProgIdKey(): string {
  return `Software\\Classes\\${WINDOWS_FILE_ASSOCIATION_PROG_ID}`
}

export function windowsFileAssociationOpenWithProgidsKey(extWithDot: string): string {
  const ext = extWithDot.startsWith('.') ? extWithDot : `.${extWithDot}`
  return `Software\\Classes\\${ext}\\OpenWithProgids`
}

export function windowsFileAssociationApplicationKey(exeFileName: string): string {
  return `Software\\Classes\\Applications\\${exeFileName}`
}

export function buildWindowsFileAssociationOpenCommand(exePath: string): string {
  return buildWindowsExplorerContextMenuCommand(exePath, 'open')
}

export { WINDOWS_EXPLORER_VIDEO_EXTENSIONS as WINDOWS_FILE_ASSOCIATION_VIDEO_EXTENSIONS }
