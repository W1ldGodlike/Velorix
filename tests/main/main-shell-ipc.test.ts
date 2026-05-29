import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('main shell IPC', () => {
  it('shell close sets allowMainWindowClose before win.close', () => {
    const ipc = readFileSync(join(process.cwd(), 'src/main/ipc/register-main-shell-ipc.ts'), 'utf8')
    const state = readFileSync(
      join(process.cwd(), 'src/main/windows/main-window-runtime-state.ts'),
      'utf8'
    )
    expect(ipc).toContain('closeMainWindowFromShellChrome')
    expect(state).toContain('allowMainWindowClose = true')
    expect(state).toContain('export function closeMainWindowFromShellChrome')
  })
})
