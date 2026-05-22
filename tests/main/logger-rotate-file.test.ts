import { existsSync, mkdtempSync, readFileSync, statSync, writeFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

import { describe, expect, it } from 'vitest'

import { rotateLogFileIfTooLarge } from '../../src/main/core/logger-rotate-file'

describe('rotateLogFileIfTooLarge §18.5', () => {
  it('renames main log to backup when over limit', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fluxalloy-log-'))
    const main = join(dir, 'main.log')
    writeFileSync(main, 'x'.repeat(2048), 'utf-8')
    rotateLogFileIfTooLarge(main, 'main.log.1', 1024)
    expect(existsSync(main)).toBe(false)
    const backup = join(dir, 'main.log.1')
    expect(existsSync(backup)).toBe(true)
    expect(statSync(backup).size).toBe(2048)
  })

  it('keeps small files untouched', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fluxalloy-log-'))
    const main = join(dir, 'main.log')
    writeFileSync(main, 'ok\n', 'utf-8')
    rotateLogFileIfTooLarge(main, 'main.log.1', 1024)
    expect(readFileSync(main, 'utf-8')).toBe('ok\n')
    expect(existsSync(join(dir, 'main.log.1'))).toBe(false)
  })
})
