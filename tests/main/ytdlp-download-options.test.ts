import { join } from 'path'
import { describe, expect, it, vi } from 'vitest'

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
  resolveSafeYtdlpOutputPattern,
  validateFilenameTemplate,
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
