import { describe, expect, it } from 'vitest'

import {
  classifyYtdlpQueueFailureKind,
  extractYtdlpErrorSummary,
  extractYtdlpOutputPath,
  formatYtdlpProgressCell,
  formatYtdlpQueueFailureStatus,
  parseYtdlpDownloadProgressLine,
  shouldSkipQueueRetriesForFailureKind,
  shouldSkipYtdlpQueueRetriesAfterFailure
} from '../../src/main/ytdlp-progress-parser'

describe('parseYtdlpDownloadProgressLine', () => {
  it('возвращает null для строк без префикса [download]', () => {
    expect(parseYtdlpDownloadProgressLine('[info] some')).toBeNull()
    expect(parseYtdlpDownloadProgressLine('random output')).toBeNull()
    expect(parseYtdlpDownloadProgressLine('')).toBeNull()
  })

  it('игнорирует Destination: без процентов', () => {
    expect(parseYtdlpDownloadProgressLine('[download] Destination: video.mp4')).toBeNull()
  })

  it('парсит процент + скорость + ETA', () => {
    const r = parseYtdlpDownloadProgressLine(
      '[download]  42.1% of   12.34MiB at  1.20MiB/s ETA 00:15'
    )
    expect(r).toEqual({ percent: '42.1%', speed: '1.20MiB/s', eta: '00:15' })
  })

  it('парсит финальную строку «in X at Y» без процента', () => {
    const r = parseYtdlpDownloadProgressLine('[download] 100% of 12.34MiB in 00:10 at 1.20MiB/s')
    expect(r).not.toBeNull()
    expect(r?.percent).toBe('100%')
    expect(r?.speed).toBe('1.20MiB/s')
  })

  it('парсит строку только с процентом', () => {
    const r = parseYtdlpDownloadProgressLine('[download] 7%')
    expect(r).toEqual({ percent: '7%', speed: null, eta: null })
  })

  it('парсит строку fragment X of Y (DASH/HLS)', () => {
    const r = parseYtdlpDownloadProgressLine('[download] fragment 5 of 120')
    expect(r).toEqual({ percent: null, speed: 'фрагмент 5/120', eta: null })
  })

  it('парсит Total progress: N%', () => {
    const r = parseYtdlpDownloadProgressLine('[download] Total progress: 33.3%')
    expect(r).toEqual({ percent: '33.3%', speed: null, eta: null })
  })

  it('предпочитает Total progress строкам фрагментов', () => {
    const r = parseYtdlpDownloadProgressLine('[download] Total progress: 33.3% (fragment 5 of 120)')
    expect(r).toEqual({ percent: '33.3%', speed: null, eta: null })
  })

  it('парсит Downloading video/item X of Y (плейлист)', () => {
    expect(parseYtdlpDownloadProgressLine('[download] Downloading item 3 of 25')).toEqual({
      percent: null,
      speed: 'плейлист 3/25',
      eta: null
    })
    expect(parseYtdlpDownloadProgressLine('[download] Downloading video 1 of 5')).toEqual({
      percent: null,
      speed: 'плейлист 1/5',
      eta: null
    })
  })

  it('парсит вариант «N of M videos» без слова video/item', () => {
    expect(parseYtdlpDownloadProgressLine('[download] Downloading 3 of 10 videos')).toEqual({
      percent: null,
      speed: 'плейлист 3/10',
      eta: null
    })
  })

  it('возвращает null если ни процента, ни скорости нет', () => {
    expect(parseYtdlpDownloadProgressLine('[download] Resuming download at byte 0')).toBeNull()
  })
})

describe('formatYtdlpProgressCell', () => {
  it('собирает все три поля', () => {
    expect(formatYtdlpProgressCell({ percent: '42%', speed: '1MiB/s', eta: '00:10' })).toBe(
      '42% · 1MiB/s · ETA 00:10'
    )
  })

  it('пропускает Unknown ETA/speed', () => {
    expect(
      formatYtdlpProgressCell({ percent: '42%', speed: 'Unknown speed', eta: 'Unknown' })
    ).toBe('42%')
  })

  it('возвращает пустую строку, если нет полей', () => {
    expect(formatYtdlpProgressCell({ percent: null, speed: null, eta: null })).toBe('')
  })
})

describe('formatYtdlpQueueFailureStatus', () => {
  it('показывает сигнал, если кода выхода нет', () => {
    expect(formatYtdlpQueueFailureStatus(null, 'SIGTERM', null, null)).toBe(
      'Ошибка (сигнал SIGTERM)'
    )
  })

  it('предпочитает явный ERROR: текст последней строке stderr', () => {
    expect(
      formatYtdlpQueueFailureStatus(1, null, 'Video unavailable', '[foo] last stderr line')
    ).toBe('Ошибка (код 1): Video unavailable')
  })

  it('берёт stderr как подсказку, если ERROR: не распарсился', () => {
    expect(
      formatYtdlpQueueFailureStatus(1, null, null, 'WARNING: [youtube] Sign in to confirm')
    ).toBe('Ошибка (код 1): WARNING: [youtube] Sign in to confirm')
  })

  it('обрезает итог длиннее 200 символов', () => {
    const longHint = 'x'.repeat(220)
    const s = formatYtdlpQueueFailureStatus(2, null, longHint, null)
    expect(s.length).toBe(200)
    expect(s.endsWith('…')).toBe(true)
  })

  it('добавляет короткую подпись по классификации §6.4', () => {
    expect(
      formatYtdlpQueueFailureStatus(1, null, 'Private video', null, 'likely_source_block')
    ).toContain('отказ источника')
    expect(
      formatYtdlpQueueFailureStatus(
        1,
        null,
        'Got server HTTP error: HTTP Error 503',
        null,
        'transient_network'
      )
    ).toContain('вероятно сеть')
  })

  it('unknown не добавляет подпись', () => {
    expect(formatYtdlpQueueFailureStatus(1, null, 'Odd message', null, 'unknown')).toBe(
      'Ошибка (код 1): Odd message'
    )
  })

  it('подпись для кодов выхода yt-dlp (2 / 100 / 101)', () => {
    expect(formatYtdlpQueueFailureStatus(2, null, 'bad flag', null, 'exit_bad_options')).toContain(
      'ошибка параметров'
    )
    expect(
      formatYtdlpQueueFailureStatus(100, null, 'restart', null, 'exit_needs_restart')
    ).toContain('перезапуск')
    expect(
      formatYtdlpQueueFailureStatus(101, null, 'max dl', null, 'exit_download_limit')
    ).toContain('лимит загрузок')
  })
})

describe('extractYtdlpErrorSummary', () => {
  it('возвращает null для строк без ERROR:', () => {
    expect(extractYtdlpErrorSummary('[download] 50%')).toBeNull()
    expect(extractYtdlpErrorSummary('')).toBeNull()
  })

  it('извлекает текст после ERROR:', () => {
    expect(extractYtdlpErrorSummary('ERROR: HTTP Error 403: Forbidden')).toBe(
      'HTTP Error 403: Forbidden'
    )
  })

  it('обрезает слишком длинные сообщения', () => {
    const long = `ERROR: ${'x'.repeat(500)}`
    const r = extractYtdlpErrorSummary(long)
    expect(r?.length).toBeLessThanOrEqual(200)
    expect(r?.endsWith('…')).toBe(true)
  })

  it('возвращает null для пустого хвоста', () => {
    expect(extractYtdlpErrorSummary('ERROR:    ')).toBeNull()
  })
})

describe('shouldSkipYtdlpQueueRetriesAfterFailure', () => {
  it('true для типичных отказов источника (ERROR: или stderr)', () => {
    expect(shouldSkipYtdlpQueueRetriesAfterFailure('Private video', null)).toBe(true)
    expect(shouldSkipYtdlpQueueRetriesAfterFailure(null, '[youtube] Video unavailable')).toBe(true)
    expect(shouldSkipYtdlpQueueRetriesAfterFailure('HTTP Error 403: Forbidden', null)).toBe(true)
  })

  it('false для транзиентных/неопределённых ошибок', () => {
    expect(
      shouldSkipYtdlpQueueRetriesAfterFailure('Unable to download webpage', 'Connection timed out')
    ).toBe(false)
    expect(shouldSkipYtdlpQueueRetriesAfterFailure(null, null)).toBe(false)
  })

  it('транзиент имеет приоритет: не skip даже при наличии «video unavailable» в stderr', () => {
    expect(
      shouldSkipYtdlpQueueRetriesAfterFailure(
        'ERROR: Video unavailable',
        'ERROR: Unable to download webpage: HTTP Error 503'
      )
    ).toBe(false)
  })

  it('стабильные коды yt-dlp 2/100/101 — отмена повторов очереди даже без маркеров в тексте', () => {
    expect(shouldSkipYtdlpQueueRetriesAfterFailure(null, null, 2)).toBe(true)
    expect(shouldSkipYtdlpQueueRetriesAfterFailure(null, null, 100)).toBe(true)
    expect(shouldSkipYtdlpQueueRetriesAfterFailure(null, null, 101)).toBe(true)
    expect(shouldSkipYtdlpQueueRetriesAfterFailure(null, null, 1)).toBe(false)
  })
})

describe('classifyYtdlpQueueFailureKind', () => {
  it('transient_network для типичной сетевой ошибки', () => {
    expect(classifyYtdlpQueueFailureKind('Got server HTTP error: HTTP Error 503', null)).toBe(
      'transient_network'
    )
    expect(classifyYtdlpQueueFailureKind('HTTP Error 504: Gateway Timeout', null)).toBe(
      'transient_network'
    )
    expect(classifyYtdlpQueueFailureKind(null, 'Broken pipe')).toBe('transient_network')
  })

  it('likely_source_block для приватного видео', () => {
    expect(classifyYtdlpQueueFailureKind('Private video', null)).toBe('likely_source_block')
  })

  it('unknown если нет явных маркеров', () => {
    expect(classifyYtdlpQueueFailureKind('Something went wrong', null)).toBe('unknown')
  })

  it('при неясном тексте использует код выхода yt-dlp (2, 100, 101)', () => {
    expect(classifyYtdlpQueueFailureKind(null, null, 2)).toBe('exit_bad_options')
    expect(classifyYtdlpQueueFailureKind(null, null, 100)).toBe('exit_needs_restart')
    expect(classifyYtdlpQueueFailureKind(null, null, 101)).toBe('exit_download_limit')
    expect(classifyYtdlpQueueFailureKind(null, null, 1)).toBe('unknown')
  })

  it('транзиент по тексту сильнее кода выхода', () => {
    expect(classifyYtdlpQueueFailureKind('Connection timed out', null, 2)).toBe('transient_network')
  })
})

describe('shouldSkipQueueRetriesForFailureKind', () => {
  it('не skip для transient и unknown', () => {
    expect(shouldSkipQueueRetriesForFailureKind('transient_network')).toBe(false)
    expect(shouldSkipQueueRetriesForFailureKind('unknown')).toBe(false)
  })

  it('skip для источника и кодов 2/100/101', () => {
    expect(shouldSkipQueueRetriesForFailureKind('likely_source_block')).toBe(true)
    expect(shouldSkipQueueRetriesForFailureKind('exit_bad_options')).toBe(true)
    expect(shouldSkipQueueRetriesForFailureKind('exit_needs_restart')).toBe(true)
    expect(shouldSkipQueueRetriesForFailureKind('exit_download_limit')).toBe(true)
  })
})

describe('extractYtdlpOutputPath', () => {
  it('извлекает путь из Destination строк', () => {
    expect(extractYtdlpOutputPath('[download] Destination: C:\\Downloads\\video.mp4')).toBe(
      'C:\\Downloads\\video.mp4'
    )
    expect(extractYtdlpOutputPath('[ExtractAudio] Destination: /tmp/audio.m4a')).toBe(
      '/tmp/audio.m4a'
    )
  })

  it('извлекает путь из merge/already-downloaded строк', () => {
    expect(extractYtdlpOutputPath('[Merger] Merging formats into "C:\\Downloads\\final.mp4"')).toBe(
      'C:\\Downloads\\final.mp4'
    )
    expect(extractYtdlpOutputPath('[download] /tmp/final.mp4 has already been downloaded')).toBe(
      '/tmp/final.mp4'
    )
  })

  it('возвращает null для обычных строк прогресса', () => {
    expect(extractYtdlpOutputPath('[download] 50% of 1MiB at 1MiB/s')).toBeNull()
  })

  it('извлекает путь из записи превью и субтитров', () => {
    expect(extractYtdlpOutputPath('[download] Writing thumbnail to: D:\\out\\thumb.webp')).toBe(
      'D:\\out\\thumb.webp'
    )
    expect(extractYtdlpOutputPath('[download] Writing video subtitles to: /tmp/sub.en.srt')).toBe(
      '/tmp/sub.en.srt'
    )
    expect(extractYtdlpOutputPath('[download] Writing subtitles to: "/tmp/spaced sub.srt"')).toBe(
      '/tmp/spaced sub.srt'
    )
  })

  it('извлекает путь из постпроцессоров EmbedSubtitle / ffmpeg / Metadata', () => {
    expect(extractYtdlpOutputPath('[EmbedSubtitle] Embedding subtitles in "/media/out.mkv"')).toBe(
      '/media/out.mkv'
    )
    expect(extractYtdlpOutputPath('[ffmpeg] Merging formats into "C:\\merged.mp4"')).toBe(
      'C:\\merged.mp4'
    )
    expect(extractYtdlpOutputPath('[ffmpeg] Destination: /tmp/converted.webm')).toBe(
      '/tmp/converted.webm'
    )
    expect(extractYtdlpOutputPath('[Metadata] Writing metadata to /home/u/final.m4a')).toBe(
      '/home/u/final.m4a'
    )
  })

  it('извлекает путь из строк FFmpeg PP (Destination после «;», thumbnail, metadata run, concat)', () => {
    expect(
      extractYtdlpOutputPath(
        '[FFmpegVideoConvertor] Convert video from webm to mp4; Destination: C:\\out\\clip.mp4'
      )
    ).toBe('C:\\out\\clip.mp4')
    expect(extractYtdlpOutputPath('[FFmpegVideoConvertor] Destination: D:\\only.mp4')).toBe(
      'D:\\only.mp4'
    )
    expect(
      extractYtdlpOutputPath('[Concat] Concatenating 3 files; Destination: C:\\merged.mp4')
    ).toBe('C:\\merged.mp4')
    expect(extractYtdlpOutputPath('[Concat] Moving "C:\\part.ts" to "C:\\final.mp4"')).toBe(
      'C:\\final.mp4'
    )
    expect(
      extractYtdlpOutputPath('[EmbedThumbnail] ffmpeg: Adding thumbnail to "C:\\Media\\song.m4a"')
    ).toBe('C:\\Media\\song.m4a')
    expect(extractYtdlpOutputPath('[Metadata] Adding metadata to "/home/u/track.mkv"')).toBe(
      '/home/u/track.mkv'
    )
  })
})
