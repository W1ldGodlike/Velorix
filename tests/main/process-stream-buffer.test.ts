import { describe, expect, it } from 'vitest'

import {
  appendProcessStreamBuffer,
  MAX_PROCESS_STREAM_BUFFER_CHARS
} from '../../src/main/core/process-stream-buffer'

describe('process-stream-buffer §6.2', () => {
  it('appends within limit', () => {
    expect(appendProcessStreamBuffer('ab', 'cd')).toBe('abcd')
  })

  it('truncates tail when over max', () => {
    const chunk = 'x'.repeat(MAX_PROCESS_STREAM_BUFFER_CHARS + 100)
    const out = appendProcessStreamBuffer('', chunk)
    expect(out.length).toBe(MAX_PROCESS_STREAM_BUFFER_CHARS)
    expect(out.endsWith('x')).toBe(true)
  })
})
