import { mkdtempSync, rmSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { describe, expect, it, vi } from 'vitest'

/** Vitest без Electron: нужен для `getYtdlpCommandHints` → `payloadFromSnapshot`. */
const proc = process as NodeJS.Process & { resourcesPath?: string }
if (proc.resourcesPath === undefined) {
  proc.resourcesPath = join(process.cwd(), 'resources')
}

vi.mock('electron', () => ({
  app: {
    getAppPath: () => process.cwd()
  }
}))

vi.mock('@electron-toolkit/utils', () => ({
  is: {
    dev: true
  }
}))

import {
  buildYtdlpCommandPreviewContext,
  buildYtdlpRunOptionsSnapshot,
  payloadFromSnapshot,
  resolveSafeYtdlpOutputPattern,
  sanitizeYtdlpPreviewUrl,
  validateFilenameTemplate,
  validateYtdlpFragmentRetriesLine,
  validateYtdlpRateLimit,
  validateYtdlpRetriesLine,
  YTDLP_DEFAULT_FILENAME_TEMPLATE
} from '../../src/main/ytdlp-download-options'

describe('validateFilenameTemplate', () => {
  it('принимает дефолтный шаблон yt-dlp', () => {
    expect(validateFilenameTemplate(YTDLP_DEFAULT_FILENAME_TEMPLATE)).toEqual({
      ok: true,
      value: YTDLP_DEFAULT_FILENAME_TEMPLATE
    })
  })

  it('требует %(ext)s, чтобы yt-dlp мог подставить расширение', () => {
    expect(validateFilenameTemplate('%(title)s').ok).toBe(false)
  })

  it('запрещает абсолютные пути и выход из каталога', () => {
    for (const template of [
      '../%(title)s.%(ext)s',
      'nested/../%(title)s.%(ext)s',
      '/tmp/%(title)s.%(ext)s',
      '\\tmp\\%(title)s.%(ext)s',
      'C:\\tmp\\%(title)s.%(ext)s'
    ]) {
      expect(validateFilenameTemplate(template).ok, template).toBe(false)
    }
  })
})

describe('resolveSafeYtdlpOutputPattern', () => {
  it('строит итоговый output pattern внутри каталога загрузок', () => {
    const root = join('C:\\', 'FluxAlloyDownloads')
    const resolved = resolveSafeYtdlpOutputPattern(root, 'nested/%(title)s.%(ext)s')

    expect(resolved).toBe(join(root, 'nested', '%(title)s.%(ext)s'))
  })

  it('возвращает null для шаблона с traversal', () => {
    const root = join('C:\\', 'FluxAlloyDownloads')

    expect(resolveSafeYtdlpOutputPattern(root, '../%(title)s.%(ext)s')).toBeNull()
  })
})

describe('validateYtdlpRateLimit', () => {
  it('нормализует суффикс скорости в верхний регистр', () => {
    expect(validateYtdlpRateLimit(' 500k ')).toEqual({ ok: true, value: '500K' })
    expect(validateYtdlpRateLimit('2m')).toEqual({ ok: true, value: '2M' })
  })

  it('отвергает shell-подобные и многословные значения', () => {
    expect(validateYtdlpRateLimit('1M --exec')).toMatchObject({ ok: false })
    expect(validateYtdlpRateLimit('fast')).toMatchObject({ ok: false })
  })
})

describe('validateYtdlpRetriesLine', () => {
  it('разбирает пустое значение как дефолт yt-dlp', () => {
    expect(validateYtdlpRetriesLine('')).toEqual({ ok: true, value: null, line: '' })
  })

  it('принимает целые значения 0-99', () => {
    expect(validateYtdlpRetriesLine('0')).toEqual({ ok: true, value: 0, line: '0' })
    expect(validateYtdlpRetriesLine('99')).toEqual({ ok: true, value: 99, line: '99' })
  })

  it('отвергает дробные, отрицательные и слишком большие значения', () => {
    for (const value of ['1.5', '-1', '100']) {
      expect(validateYtdlpRetriesLine(value).ok, value).toBe(false)
    }
  })
})

describe('validateYtdlpFragmentRetriesLine', () => {
  it('использует те же границы 0-99 и пустой дефолт yt-dlp', () => {
    expect(validateYtdlpFragmentRetriesLine('')).toEqual({ ok: true, value: null, line: '' })
    expect(validateYtdlpFragmentRetriesLine('4')).toEqual({ ok: true, value: 4, line: '4' })
    expect(validateYtdlpFragmentRetriesLine('100').ok).toBe(false)
  })
})

describe('sanitizeYtdlpPreviewUrl §6.3', () => {
  it('убирает управляющие символы', () => {
    expect(sanitizeYtdlpPreviewUrl(' https://x.test/y\u0000z ')).toBe('https://x.test/yz')
  })
})

describe('payloadFromSnapshot §6.3 превью argv', () => {
  it('без контекста сохраняет плейсхолдеры', () => {
    const snap = buildYtdlpRunOptionsSnapshot({ theme: 'dark' })
    const p = payloadFromSnapshot(snap)
    expect(p.commandPreview).toContain('<downloadDir>')
    expect(p.commandPreview).toContain('<url>')
  })

  it('с контекстом подставляет абсолютный каталог загрузок и пример URL', () => {
    const base = mkdtempSync(join(tmpdir(), 'flux-ytdlp-preview-'))
    try {
      const snap = buildYtdlpRunOptionsSnapshot({ theme: 'dark' })
      const p = payloadFromSnapshot(
        snap,
        buildYtdlpCommandPreviewContext({
          userDataRoot: base,
          sampleUrl: 'https://clips.example/video?id=1'
        })
      )
      const wantDir = join(base, 'downloads', 'ytdlp')
      const unify = (s: string): string =>
        s
          .replace(/\\/g, '/')
          .replace(/\/{2,}/g, '/')
          .toLowerCase()
      expect(unify(p.commandPreview)).toContain(unify(wantDir))
      expect(p.commandPreview).toContain('clips.example')
      expect(p.commandPreview).not.toContain('<downloadDir>')
      expect(p.commandPreview).not.toContain('<url>')
    } finally {
      rmSync(base, { recursive: true, force: true })
    }
  })

  it('при отсутствии sampleUrl использует нейтральный пример', () => {
    const base = mkdtempSync(join(tmpdir(), 'flux-ytdlp-preview2-'))
    try {
      const snap = buildYtdlpRunOptionsSnapshot({ theme: 'dark' })
      const p = payloadFromSnapshot(
        snap,
        buildYtdlpCommandPreviewContext({
          userDataRoot: base,
          sampleUrl: null
        })
      )
      expect(p.commandPreview).toContain('example.com')
    } finally {
      rmSync(base, { recursive: true, force: true })
    }
  })
})

describe('buildYtdlpRunOptionsSnapshot §6.4 openInHandlerOnComplete', () => {
  it('по умолчанию выключено', () => {
    expect(buildYtdlpRunOptionsSnapshot({ theme: 'dark' }).openInHandlerOnComplete).toBe(false)
  })

  it('включается только при явном true в settings.json', () => {
    expect(
      buildYtdlpRunOptionsSnapshot({
        theme: 'dark',
        ytdlpOpenInHandlerOnComplete: true
      }).openInHandlerOnComplete
    ).toBe(true)
  })
})
