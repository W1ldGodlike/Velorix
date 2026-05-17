import { join } from 'path'
import { describe, expect, it, vi } from 'vitest'

vi.stubGlobal('process', {
  ...process,
  resourcesPath: join(process.cwd(), 'resources')
})

vi.mock('electron', () => ({
  app: {
    getAppPath: () => process.cwd()
  }
}))
vi.mock('@electron-toolkit/utils', () => ({
  is: { dev: true }
}))

import { getTerminalCommandHints } from '../../src/main/terminal-service-hints'

describe('getTerminalCommandHints §8', () => {
  it('читает ffmpeg_commands.json и ytdlp_commands.json из Data/', () => {
    const hints = getTerminalCommandHints()
    expect(hints.length).toBeGreaterThan(10)
    expect(hints.some((h) => h.tool === 'ffmpeg' && h.token.length > 0)).toBe(true)
    expect(hints.some((h) => h.tool === 'yt-dlp' && h.token.length > 0)).toBe(true)
    for (let i = 1; i < hints.length; i++) {
      const prev = hints[i - 1]!
      const cur = hints[i]!
      const cmp =
        prev.tool.localeCompare(cur.tool) || prev.token.localeCompare(cur.token, 'ru')
      expect(cmp).toBeLessThanOrEqual(0)
    }
  })

  it('второй вызов возвращает тот же memoized массив', () => {
    const first = getTerminalCommandHints()
    const second = getTerminalCommandHints()
    expect(second).toBe(first)
  })
})
