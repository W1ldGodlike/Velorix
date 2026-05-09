import { describe, expect, it } from 'vitest'

import { isYtdlpOsPauseSupported } from '../../src/main/ytdlp-os-pause-support'

describe('isYtdlpOsPauseSupported', () => {
  it('на Windows — false, иначе true (POSIX SIGSTOP/SIGCONT)', () => {
    if (process.platform === 'win32') {
      expect(isYtdlpOsPauseSupported()).toBe(false)
    } else {
      expect(isYtdlpOsPauseSupported()).toBe(true)
    }
  })
})
