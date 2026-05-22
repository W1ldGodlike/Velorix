import { describe, expect, it } from 'vitest'

import {
  buildWindowsFileAssociationOpenCommand,
  VELORIX_INSTALL_REGISTER_OPEN_WITH,
  isWindowsFileAssociationHeadlessArgv,
  WINDOWS_FILE_ASSOCIATION_PROG_ID,
  windowsFileAssociationOpenWithProgidsKey,
  windowsFileAssociationProgIdKey
} from '../../src/shared/windows-file-association'

describe('windows-file-association §14', () => {
  it('detects installer headless argv', () => {
    expect(
      isWindowsFileAssociationHeadlessArgv(['app.exe', VELORIX_INSTALL_REGISTER_OPEN_WITH])
    ).toBe('register')
  })

  it('builds open command and registry paths', () => {
    const cmd = buildWindowsFileAssociationOpenCommand('C:\\Apps\\Flux.exe')
    expect(cmd).toContain('--velorix-shell-open')
    expect(windowsFileAssociationProgIdKey()).toBe(
      `Software\\Classes\\${WINDOWS_FILE_ASSOCIATION_PROG_ID}`
    )
    expect(windowsFileAssociationOpenWithProgidsKey('.mkv')).toBe(
      'Software\\Classes\\.mkv\\OpenWithProgids'
    )
  })
})
