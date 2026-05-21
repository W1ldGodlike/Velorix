import { describe, expect, it } from 'vitest'

import {
  formatChildProcessExitCode,
  normalizeChildProcessExitCode
} from '../../src/shared/child-process-exit-code'

describe('child-process-exit-code', () => {
  it('normalizes Windows uint32 wrap of negative ffmpeg codes', () => {
    expect(normalizeChildProcessExitCode(4294967274)).toBe(-22)
    expect(formatChildProcessExitCode(4294967274)).toBe('-22')
  })

  it('leaves ordinary exit codes unchanged', () => {
    expect(normalizeChildProcessExitCode(0)).toBe(0)
    expect(normalizeChildProcessExitCode(1)).toBe(1)
    expect(formatChildProcessExitCode(0)).toBe('0')
  })
})
