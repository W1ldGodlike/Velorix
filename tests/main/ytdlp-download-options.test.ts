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
  normalizeYtdlpPreviewOutputDirectory,
  payloadFromSnapshot,
  resolveSafeYtdlpOutputPattern,
  sanitizeYtdlpPreviewUrl,
  validateFilenameTemplate,
  validateYtdlpFragmentRetriesLine,
  validateYtdlpRateLimit,
  validateYtdlpRetriesLine,
  YTDLP_DEFAULT_FILENAME_TEMPLATE
} from '../../src/main/ytdlp-download-options'
import {
  YTDLP_RATE_LIMIT_CASES,
  YTDLP_RETRIES_LINE_CASES
} from '../fixtures/ytdlp-download-options-validator-cases'

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
  it.each(YTDLP_RATE_LIMIT_CASES)('$input', (row) => {
    const result = validateYtdlpRateLimit(row.input)
    if ('expected' in row) {
      expect(result).toEqual(row.expected)
    } else {
      expect(result).toMatchObject({ ok: row.expectedOk })
    }
  })
})

describe('validateYtdlpRetriesLine', () => {
  it.each(YTDLP_RETRIES_LINE_CASES)('$input', (row) => {
    const result = validateYtdlpRetriesLine(row.input)
    if ('expected' in row) {
      expect(result).toEqual(row.expected)
    } else {
      expect(result.ok, row.input).toBe(row.expectedOk)
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

describe('normalizeYtdlpPreviewOutputDirectory §6.3', () => {
  it('принимает абсолютный путь после trim', () => {
    const base = mkdtempSync(join(tmpdir(), 'flux-ytdlp-norm-'))
    try {
      expect(normalizeYtdlpPreviewOutputDirectory(`  ${base}  `)).toBeTruthy()
    } finally {
      rmSync(base, { recursive: true, force: true })
    }
  })

  it('отвергает относительные и пустые строки', () => {
    expect(normalizeYtdlpPreviewOutputDirectory('')).toBeNull()
    expect(normalizeYtdlpPreviewOutputDirectory('relative/path')).toBeNull()
    expect(normalizeYtdlpPreviewOutputDirectory('Z:x')).toBeNull()
  })
})

describe('payloadFromSnapshot §6.3 превью argv', () => {
  it('по умолчанию выбирает MP4-пресет для предпросмотра в редакторе', () => {
    const snap = buildYtdlpRunOptionsSnapshot({ theme: 'dark' })
    const p = payloadFromSnapshot(snap, undefined, 'ru')
    expect(snap.formatPreset).toBe('editor_mp4')
    expect(p.commandPreview).toContain('--merge-output-format mp4')
    expect(p.formatPresetChoices.map((choice) => choice.id)).toContain('editor_mp4')
    expect(p.formatPresetChoices.find((c) => c.id === 'editor_mp4')?.label).toContain('MP4')
  })

  it('локализует подписи пресетов и профиля повтора для en', () => {
    const snap = buildYtdlpRunOptionsSnapshot({ theme: 'dark' })
    const p = payloadFromSnapshot(snap, undefined, 'en')
    expect(p.formatPresetChoices.find((c) => c.id === 'editor_mp4')?.label).toBe(
      'MP4 for editor (H.264/AAC)'
    )
    expect(p.queueRetryProfileChoices.find((c) => c.id === 'off')?.label).toBe('Off')
  })

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

  it('outputDirectoryOverride подменяет корень превью `-o` независимо от userDataRoot', () => {
    const userBase = mkdtempSync(join(tmpdir(), 'flux-ytdlp-ud-'))
    const overrideDir = mkdtempSync(join(tmpdir(), 'flux-ytdlp-override-'))
    try {
      const snap = buildYtdlpRunOptionsSnapshot({ theme: 'dark' })
      const p = payloadFromSnapshot(
        snap,
        buildYtdlpCommandPreviewContext({
          userDataRoot: userBase,
          sampleUrl: 'https://clips.example/video',
          outputDirectoryOverride: overrideDir
        })
      )
      const unify = (s: string): string =>
        s
          .replace(/\\/g, '/')
          .replace(/\/{2,}/g, '/')
          .toLowerCase()
      expect(unify(p.commandPreview)).toContain(unify(overrideDir))
      expect(unify(p.commandPreview)).not.toContain(unify(join(userBase, 'downloads', 'ytdlp')))
    } finally {
      rmSync(userBase, { recursive: true, force: true })
      rmSync(overrideDir, { recursive: true, force: true })
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

describe('buildYtdlpRunOptionsSnapshot §6.4 autoExportAfterOpenInHandler', () => {
  it('по умолчанию выключено', () => {
    expect(buildYtdlpRunOptionsSnapshot({ theme: 'dark' }).autoExportAfterOpenInHandler).toBe(false)
  })

  it('включается только при явном true в settings.json', () => {
    expect(
      buildYtdlpRunOptionsSnapshot({
        theme: 'dark',
        ytdlpAutoExportAfterOpenInHandler: true
      }).autoExportAfterOpenInHandler
    ).toBe(true)
  })
})

describe('buildYtdlpRunOptionsSnapshot §7.4 batch enqueue', () => {
  it('по умолчанию enqueue/autoStart выключены', () => {
    const snap = buildYtdlpRunOptionsSnapshot({ theme: 'dark' })
    expect(snap.enqueueBatchOnDownloadComplete).toBe(false)
    expect(snap.autoStartBatchAfterEnqueue).toBe(false)
  })

  it('включаются при явных флагах settings', () => {
    const snap = buildYtdlpRunOptionsSnapshot({
      theme: 'dark',
      ytdlpEnqueueBatchOnDownloadComplete: true,
      ytdlpAutoStartBatchAfterEnqueue: true
    })
    expect(snap.enqueueBatchOnDownloadComplete).toBe(true)
    expect(snap.autoStartBatchAfterEnqueue).toBe(true)
  })

  it('payloadFromSnapshot прокидывает batch-флаги', () => {
    const snap = buildYtdlpRunOptionsSnapshot({
      theme: 'dark',
      ytdlpEnqueueBatchOnDownloadComplete: true
    })
    const payload = payloadFromSnapshot(snap, undefined, 'ru')
    expect(payload.enqueueBatchOnDownloadComplete).toBe(true)
    expect(payload.autoStartBatchAfterEnqueue).toBe(false)
  })
})
