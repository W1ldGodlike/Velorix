import { describe, expect, it } from 'vitest'

import {
  sanitizeDownloadsOutputDirectorySnapshot,
  type DownloadsOutputDirectorySnapshot
} from '../../src/shared/downloads-output-directory-snapshot'
import { mainWindowIpc } from '../../src/shared/ipc-channels'

describe('downloads output directory snapshot', () => {
  it('sanitizes path and isDefault', () => {
    const snap: DownloadsOutputDirectorySnapshot = {
      path: 'C:\\downloads\\ytdlp',
      isDefault: false
    }
    expect(sanitizeDownloadsOutputDirectorySnapshot(snap)).toEqual(snap)
    expect(sanitizeDownloadsOutputDirectorySnapshot({ path: 1, isDefault: 'yes' })).toEqual({
      path: '',
      isDefault: false
    })
    expect(sanitizeDownloadsOutputDirectorySnapshot(null)).toEqual({
      path: '',
      isDefault: true
    })
  })

  it('downloadsOutputDirectoryChanged channel is stable', () => {
    expect(mainWindowIpc.downloadsOutputDirectoryChanged).toBe(
      'fluxalloy:downloads-output-directory-changed'
    )
  })

  it('downloadsCliOptionsChanged channel is stable', () => {
    expect(mainWindowIpc.downloadsCliOptionsChanged).toBe('fluxalloy:downloads-cli-options-changed')
  })
})
