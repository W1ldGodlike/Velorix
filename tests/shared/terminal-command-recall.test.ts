import { describe, expect, it } from 'vitest'

import {
  applyTerminalRecallStep,
  listTerminalRecallLines,
  type TerminalRecallState
} from '../../src/shared/terminal-command-recall'

describe('terminal-command-recall §8', () => {
  it('listTerminalRecallLines dedupes newest-first', () => {
    expect(listTerminalRecallLines(['ffmpeg -i a', 'ffmpeg -i a', 'yt-dlp -V'])).toEqual([
      'ffmpeg -i a',
      'yt-dlp -V'
    ])
  })

  it('applyTerminalRecallStep walks up then restores draft on down', () => {
    const lines = ['cmd-b', 'cmd-a']
    let state: TerminalRecallState = { index: null, draft: null }
    const up1 = applyTerminalRecallStep(state, 'draft', lines, 'up')
    expect(up1.line).toBe('cmd-b')
    state = up1.next
    const up2 = applyTerminalRecallStep(state, up1.line, lines, 'up')
    expect(up2.line).toBe('cmd-a')
    const down = applyTerminalRecallStep(up2.next, up2.line, lines, 'down')
    expect(down.line).toBe('cmd-b')
    const restore = applyTerminalRecallStep(down.next, down.line, lines, 'down')
    expect(restore.line).toBe('draft')
    expect(restore.next.index).toBeNull()
  })
})
