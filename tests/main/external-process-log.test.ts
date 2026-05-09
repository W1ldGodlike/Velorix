import { describe, expect, it, vi } from 'vitest'

vi.mock('electron', () => ({
  app: {
    getPath: () => '',
    getVersion: () => '0.0.0'
  }
}))

import {
  formatExternalProcessLogMessage,
  sanitizeExternalProcessLogLine
} from '../../src/main/external-process-log'

describe('external process log formatting', () => {
  it('заменяет control chars пробелами', () => {
    expect(sanitizeExternalProcessLogLine('a\nb\rc\t')).toBe('a b c ')
  })

  it('обрезает слишком длинные строки', () => {
    const out = sanitizeExternalProcessLogLine('x'.repeat(2000))
    expect(out.length).toBeLessThan(1250)
    expect(out.endsWith('…[truncated]')).toBe(true)
  })

  it('формирует строку со stream и process name', () => {
    expect(formatExternalProcessLogMessage('yt-dlp', 'stderr', 'ERROR: fail')).toBe(
      '[yt-dlp] [stderr] ERROR: fail'
    )
  })
})
