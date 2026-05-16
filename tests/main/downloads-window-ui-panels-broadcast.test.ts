import { describe, expect, it } from 'vitest'

import { mainWindowIpc } from '../../src/shared/ipc-channels'

/** §6.1 — канал синхронизации панелей embedded ↔ pop-out (контракт IPC). */
describe('downloads-window ui panels broadcast contract', () => {
  it('downloadsWindowUiPanelsChanged channel is stable', () => {
    expect(mainWindowIpc.downloadsWindowUiPanelsChanged).toBe(
      'fluxalloy:downloads-window-ui-panels-changed'
    )
  })
})
