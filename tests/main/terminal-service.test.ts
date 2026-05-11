import { readFileSync, mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { describe, expect, it, vi } from 'vitest'

vi.mock('electron', () => ({
  app: {
    getAppPath: () => '/tmp/fluxalloy-test',
    getPath: () => '/tmp'
  }
}))

vi.mock('@electron-toolkit/utils', () => ({
  is: { dev: true }
}))

import {
  appendTerminalCliSessionLog,
  resolveTerminalCliSessionLogPath,
  resolveTerminalCurrentFileArgs
} from '../../src/main/terminal-service'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from '../../src/shared/terminal-contract'

describe('appendTerminalCliSessionLog', () => {
  it('создаёт logs/terminal-cli.log под userData', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fluxalloy-term-cli-'))
    try {
      appendTerminalCliSessionLog({ userData: dir, block: 'probe-run\n' })
      const p = resolveTerminalCliSessionLogPath(dir)
      expect(readFileSync(p, 'utf8')).toContain('probe-run')
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})

describe('resolveTerminalCurrentFileArgs', () => {
  it('без плейсхолдера не меняет argv', () => {
    expect(
      resolveTerminalCurrentFileArgs({
        args: ['-hide_banner', '-i', 'x.mp4'],
        currentFilePath: null,
        grantPath: () => false
      })
    ).toEqual({ ok: true, args: ['-hide_banner', '-i', 'x.mp4'] })
  })

  it('подставляет абсолютный путь при успешном grant', () => {
    const r = resolveTerminalCurrentFileArgs({
      args: ['-hide_banner', '-i', TERMINAL_CURRENT_FILE_PLACEHOLDER],
      currentFilePath: 'C:\\Media\\clip.mkv',
      grantPath: (abs) => abs.includes('clip.mkv')
    })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.args[0]).toBe('-hide_banner')
      expect(r.args[2]).toMatch(/clip\.mkv$/)
      expect(r.args[2]).not.toContain(TERMINAL_CURRENT_FILE_PLACEHOLDER)
    }
  })

  it('ошибка без пути к превью', () => {
    const r = resolveTerminalCurrentFileArgs({
      args: [TERMINAL_CURRENT_FILE_PLACEHOLDER],
      currentFilePath: '  ',
      grantPath: () => true
    })
    expect(r.ok).toBe(false)
  })

  it('ошибка если путь не в grant-list', () => {
    const r = resolveTerminalCurrentFileArgs({
      args: [TERMINAL_CURRENT_FILE_PLACEHOLDER],
      currentFilePath: 'C:\\secret\\a.mp4',
      grantPath: () => false
    })
    expect(r.ok).toBe(false)
  })
})
