import { describe, expect, it } from 'vitest'

import {
  buildWindowsExplorerContextMenuCommand,
  VELORIX_INSTALL_REGISTER_EXPLORER_MENU,
  VELORIX_SHELL_OPEN_ARG,
  VELORIX_SHELL_QUICK_MP4_ARG,
  isWindowsExplorerContextMenuVideoPath,
  isWindowsExplorerShellHeadlessArgv,
  parseWindowsExplorerShellArgv,
  windowsExplorerContextMenuAssociationBase
} from '../../src/shared/windows-explorer-context-menu'

describe('windows-explorer-context-menu §14', () => {
  it('detects video extensions', () => {
    expect(isWindowsExplorerContextMenuVideoPath('C:\\media\\clip.MKV')).toBe(true)
    expect(isWindowsExplorerContextMenuVideoPath('C:\\doc.txt')).toBe(false)
  })

  it('parses shell argv', () => {
    expect(
      parseWindowsExplorerShellArgv(['electron.exe', VELORIX_SHELL_OPEN_ARG, 'C:\\in\\a.mp4'])
    ).toEqual({ mode: 'open', filePath: 'C:\\in\\a.mp4' })
    expect(
      parseWindowsExplorerShellArgv(['electron.exe', VELORIX_SHELL_QUICK_MP4_ARG, 'D:/b.webm'])
    ).toEqual({ mode: 'quick-mp4', filePath: 'D:/b.webm' })
  })

  it('detects installer headless argv', () => {
    expect(
      isWindowsExplorerShellHeadlessArgv(['app.exe', VELORIX_INSTALL_REGISTER_EXPLORER_MENU])
    ).toBe('register')
  })

  it('builds reg command and association path', () => {
    const cmd = buildWindowsExplorerContextMenuCommand('C:\\Apps\\Flux.exe', 'open')
    expect(cmd).toContain('--velorix-shell-open')
    expect(cmd).toContain('"%1"')
    expect(windowsExplorerContextMenuAssociationBase('.mp4')).toBe(
      'Software\\Classes\\SystemFileAssociations\\.mp4\\shell'
    )
  })
})
