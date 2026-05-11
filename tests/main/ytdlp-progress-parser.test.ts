import { describe, expect, it } from 'vitest'

import {
  classifyYtdlpQueueFailureKind,
  extractYtdlpErrorSummary,
  extractYtdlpOutputPath,
  formatTorrentStyleSpeedFromBps,
  formatYtdlpProgressCell,
  formatYtdlpQueueFailureStatus,
  parseYtdlpDownloadProgressLine,
  parseYtdlpInfoDownloadingTitlePrefix,
  parseYtdlpInfoFormatSnippet,
  parseYtdlpInfoQueueSizeHint,
  parseYtdlpQueueFormatHint,
  displayLabelFromYtdlpOutputPath,
  parseYtdlpProgressPercentNumber,
  parseYtdlpSpeedToBytesPerSec,
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
    expect(r).toEqual({
      percent: '42.1%',
      speed: '1.20MiB/s',
      eta: '00:15',
      sizeTotal: '12.34MiB'
    })
  })

  it('парсит размер с отдельным символом приблизительности "~"', () => {
    const r = parseYtdlpDownloadProgressLine(
      '[download]  10.0% of ~ 5.00MiB at 1.00MiB/s ETA 00:01'
    )
    expect(r?.sizeTotal).toBe('5.00MiB')
  })

  it('парсит финальную строку «in X at Y» без процента', () => {
    const r = parseYtdlpDownloadProgressLine('[download] 100% of 12.34MiB in 00:10 at 1.20MiB/s')
    expect(r).not.toBeNull()
    expect(r?.percent).toBe('100%')
    expect(r?.speed).toBe('1.20MiB/s')
    expect(r?.sizeTotal).toBe('12.34MiB')
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

  it('не принимает произвольные «N of M videos» как прогресс плейлиста', () => {
    expect(parseYtdlpDownloadProgressLine('[download] Skipping 3 of 10 videos')).toBeNull()
  })

  it('возвращает null если ни процента, ни скорости нет', () => {
    expect(parseYtdlpDownloadProgressLine('[download] Unable to rename file')).toBeNull()
  })

  it('парсит вариант (frag N/M) без процентов; со строкой с % отдаёт процент/скорость', () => {
    expect(parseYtdlpDownloadProgressLine('[download] (frag 12/120)')).toEqual({
      percent: null,
      speed: 'фрагмент 12/120',
      eta: null
    })
    const withPct = parseYtdlpDownloadProgressLine(
      '[download] 10.0% of ~ 5.00MiB at 1.00MiB/s ETA 00:01 (frag 12/120)'
    )
    expect(withPct?.percent).toBe('10.0%')
    expect(withPct?.speed).toBe('1.00MiB/s')
  })

  it('парсит Sleeping … seconds и Waiting for reconnect', () => {
    expect(parseYtdlpDownloadProgressLine('[download] Sleeping 6.00 seconds ...')).toEqual({
      percent: null,
      speed: 'пауза 6.00 с',
      eta: null
    })
    expect(
      parseYtdlpDownloadProgressLine('[download] Waiting for reconnect after forced IP bind...')
    ).toEqual({
      percent: null,
      speed: 'ожидание переподключения',
      eta: null
    })
  })

  it('парсит прочие «Waiting for …» без reconnect', () => {
    expect(parseYtdlpDownloadProgressLine('[download] Waiting for available formats...')).toEqual({
      percent: null,
      speed: 'ожидание',
      eta: null
    })
  })

  it('парсит Resuming download at byte …', () => {
    expect(parseYtdlpDownloadProgressLine('[download] Resuming download at byte 1048576')).toEqual({
      percent: null,
      speed: 'продолжение загрузки',
      eta: null
    })
  })

  it('парсит retry-счётчик yt-dlp', () => {
    expect(
      parseYtdlpDownloadProgressLine(
        '[download] Got server HTTP error: HTTP Error 503. Retrying (2/10)...'
      )
    ).toEqual({
      percent: null,
      speed: 'повтор 2/10',
      eta: null
    })
    expect(
      parseYtdlpDownloadProgressLine('[download] Got error: timeout. Retrying fragment 7 (3/10)...')
    ).toEqual({
      percent: null,
      speed: 'повтор фрагмента 7 · 3/10',
      eta: null
    })
    expect(
      parseYtdlpDownloadProgressLine('[download] Got error: timeout. Retrying (attempt 4 of 10)...')
    ).toEqual({
      percent: null,
      speed: 'повтор 4/10',
      eta: null
    })
    expect(
      parseYtdlpDownloadProgressLine('[download] Retrying in 5.00 seconds...')
    ).toEqual({
      percent: null,
      speed: 'повтор через 5.00 с',
      eta: null
    })
  })

  it('парсит подготовительные строки m3u8 / player API / webpage без процентов', () => {
    expect(parseYtdlpDownloadProgressLine('[download] Downloading m3u8 information')).toEqual({
      percent: null,
      speed: 'манифест HLS',
      eta: null
    })
    expect(
      parseYtdlpDownloadProgressLine('[download] Downloading android player API JSON')
    ).toEqual({
      percent: null,
      speed: 'метаданные плеера',
      eta: null
    })
    expect(parseYtdlpDownloadProgressLine('[download] Downloading webpage')).toEqual({
      percent: null,
      speed: 'страница',
      eta: null
    })
  })
})

describe('parseYtdlpInfoDownloadingTitlePrefix', () => {
  it('достаёт человекочитаемый префикс до Downloading format', () => {
    expect(
      parseYtdlpInfoDownloadingTitlePrefix(
        '[info] Как сделать пирог: Downloading 1 format(s): 398+251'
      )
    ).toBe('Как сделать пирог')
  })

  it('не принимает одиночный id YouTube из 11 символов', () => {
    expect(
      parseYtdlpInfoDownloadingTitlePrefix('[info] dQw4w9WgXcQ: Downloading 1 format(s): 251')
    ).toBeNull()
  })

  it('возвращает null вне [info]', () => {
    expect(parseYtdlpInfoDownloadingTitlePrefix('[download] x')).toBeNull()
  })
})

describe('parseYtdlpInfoFormatSnippet', () => {
  it('достаёт список format id из строки [info]', () => {
    expect(parseYtdlpInfoFormatSnippet('[info] test_vid: Downloading 1 format(s): 398+251')).toBe(
      '398+251'
    )
  })

  it('принимает регистронезависимый префикс [info]', () => {
    expect(parseYtdlpInfoFormatSnippet('[INFO] x: Downloading 1 format(s): 398+251')).toBe(
      '398+251'
    )
  })

  it('ловит шаблон «Downloading video in format …»', () => {
    expect(parseYtdlpInfoFormatSnippet('[info] x: Downloading video in format 137')).toBe('137')
    expect(parseYtdlpInfoFormatSnippet('[info] x: Downloading video in format 398+251')).toBe(
      '398+251'
    )
  })

  it('возвращает null без подходящего шаблона', () => {
    expect(parseYtdlpInfoFormatSnippet('[info] Sleeping 5 seconds')).toBeNull()
    expect(parseYtdlpInfoFormatSnippet('[download] blah')).toBeNull()
  })
})

describe('parseYtdlpQueueFormatHint', () => {
  it('повторяет подсказки из [info] и добавляет слияние контейнера', () => {
    expect(parseYtdlpQueueFormatHint('[info] x: Downloading 1 format(s): 398+251')).toBe('398+251')
    expect(
      parseYtdlpQueueFormatHint('[Merger] Merging formats into "C:\\Downloads\\final.mkv"')
    ).toBe('слияние → mkv')
    expect(parseYtdlpQueueFormatHint('[ffmpeg] Merging formats into /tmp/out.webm')).toBe(
      'слияние → webm'
    )
  })

  it('добавляет формат из post-processing строк yt-dlp', () => {
    expect(parseYtdlpQueueFormatHint('[ExtractAudio] Destination: C:\\Downloads\\audio.m4a')).toBe(
      'аудио → m4a'
    )
    expect(
      parseYtdlpQueueFormatHint('[VideoRemuxer] Remuxing video from mkv into "C:\\out\\final.mp4"')
    ).toBe('remux → mp4')
    expect(
      parseYtdlpQueueFormatHint(
        '[FFmpegVideoConvertor] Convert video from webm to mp4; Destination: /tmp/clip.mp4'
      )
    ).toBe('convert → mp4')
  })

  it('возвращает null для прочих строк', () => {
    expect(parseYtdlpQueueFormatHint('[download] 50%')).toBeNull()
  })
})

describe('parseYtdlpInfoQueueSizeHint', () => {
  it('достаёт размер из типичных полей Filesize в [info]', () => {
    expect(parseYtdlpInfoQueueSizeHint('[info] x: Filesize approx 12.34MiB')).toBe('12.34MiB')
    expect(parseYtdlpInfoQueueSizeHint('[info] x: Approximate filesize: 1,234.5KiB')).toBe(
      '1234.5KiB'
    )
    expect(parseYtdlpInfoQueueSizeHint('[info] x: Estimated filesize: 10MiB')).toBe('10MiB')
    expect(parseYtdlpInfoQueueSizeHint('[info] x: Filesize is 2.5MiB')).toBe('2.5MiB')
  })

  it('не срабатывает вне [info] и для неразмерных токенов', () => {
    expect(parseYtdlpInfoQueueSizeHint('[download] Filesize: 10MiB')).toBeNull()
    expect(parseYtdlpInfoQueueSizeHint('[info] x: Filesize: unknown')).toBeNull()
  })
})

describe('parseYtdlpProgressPercentNumber', () => {
  it('достаёт число только из чистого «NN%»', () => {
    expect(parseYtdlpProgressPercentNumber('42.1%')).toBeCloseTo(42.1, 5)
    expect(parseYtdlpProgressPercentNumber('100%')).toBe(100)
    expect(parseYtdlpProgressPercentNumber(null)).toBeNull()
    expect(parseYtdlpProgressPercentNumber('3 of 10')).toBeNull()
  })
})

describe('parseYtdlpSpeedToBytesPerSec', () => {
  it('парсит KiB/s и MiB/s', () => {
    expect(parseYtdlpSpeedToBytesPerSec('999.36KiB/s')).toBeCloseTo(999.36 * 1024, 1)
    expect(parseYtdlpSpeedToBytesPerSec('1.20MiB/s')).toBeCloseTo(1.2 * 1024 ** 2, 1)
  })

  it('возвращает null для статуса и Unknown', () => {
    expect(parseYtdlpSpeedToBytesPerSec('')).toBeNull()
    expect(parseYtdlpSpeedToBytesPerSec('Unknown')).toBeNull()
    expect(parseYtdlpSpeedToBytesPerSec('fragment 3 of 10')).toBeNull()
  })
})

describe('formatTorrentStyleSpeedFromBps', () => {
  it('форматирует в MB/s и KB/s (×1000)', () => {
    expect(formatTorrentStyleSpeedFromBps(2 * 1_000_000)).toBe('2.0 MB/s')
    expect(formatTorrentStyleSpeedFromBps(850_000)).toBe('850 KB/s')
  })
})

describe('displayLabelFromYtdlpOutputPath', () => {
  it('убирает суффикс [id] из basename', () => {
    expect(
      displayLabelFromYtdlpOutputPath('C:\\dl\\My Video [L_DypYRwPJs].mp4')
    ).toBe('My Video')
  })

  it('возвращает null для пустого или короткого', () => {
    expect(displayLabelFromYtdlpOutputPath('')).toBeNull()
    expect(displayLabelFromYtdlpOutputPath('C:\\x')).toBeNull()
  })
})

describe('formatYtdlpProgressCell', () => {
  it('собирает все три поля', () => {
    expect(formatYtdlpProgressCell({ percent: '42%', speed: '1MiB/s', eta: '00:10' })).toBe(
      '42% · 1MiB/s · Осталось 00:10'
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
    expect(shouldSkipYtdlpQueueRetriesAfterFailure('Premature close', 'HTTP Error 408')).toBe(false)
    expect(shouldSkipYtdlpQueueRetriesAfterFailure(null, null)).toBe(false)
  })

  it('true для завершённого стрима / премьеры без транзиентного маркера', () => {
    expect(shouldSkipYtdlpQueueRetriesAfterFailure('Live stream has ended', null)).toBe(true)
    expect(shouldSkipYtdlpQueueRetriesAfterFailure(null, 'Premiere will begin in 10 minutes')).toBe(
      true
    )
  })

  it('true для DRM как устойчивого отказа источника', () => {
    expect(shouldSkipYtdlpQueueRetriesAfterFailure('Video is DRM protected', null)).toBe(true)
  })

  it('true для нехватки места и отсутствия ffmpeg (повтор той же команды бессмысленен)', () => {
    expect(shouldSkipYtdlpQueueRetriesAfterFailure(null, 'OSError: [Errno 28] No space left on device')).toBe(
      true
    )
    expect(shouldSkipYtdlpQueueRetriesAfterFailure('ffmpeg: not found', null)).toBe(true)
  })

  it('true если yt-dlp не нашёл форматов или URL не поддерживается', () => {
    expect(shouldSkipYtdlpQueueRetriesAfterFailure('No video formats found', null)).toBe(true)
    expect(
      shouldSkipYtdlpQueueRetriesAfterFailure(null, 'ERROR: requested format is not available')
    ).toBe(true)
    expect(shouldSkipYtdlpQueueRetriesAfterFailure(null, 'Unsupported URL: foo')).toBe(true)
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
    expect(classifyYtdlpQueueFailureKind(null, '502 Bad Gateway')).toBe('transient_network')
    expect(classifyYtdlpQueueFailureKind('HTTP Error 408: Request Timeout', null)).toBe(
      'transient_network'
    )
    expect(classifyYtdlpQueueFailureKind(null, 'Connection prematurely closed')).toBe(
      'transient_network'
    )
    expect(classifyYtdlpQueueFailureKind('Signature extraction failed', null)).toBe(
      'transient_network'
    )
    expect(classifyYtdlpQueueFailureKind(null, 'Rate limit exceeded')).toBe('transient_network')
    expect(classifyYtdlpQueueFailureKind('HTTP Error 521: Web Server Is Down', null)).toBe(
      'transient_network'
    )
    expect(classifyYtdlpQueueFailureKind(null, 'EOF occurred in violation of protocol')).toBe(
      'transient_network'
    )
  })

  it('likely_source_block для приватного видео', () => {
    expect(classifyYtdlpQueueFailureKind('Private video', null)).toBe('likely_source_block')
    expect(classifyYtdlpQueueFailureKind('Not available in your country', null)).toBe(
      'likely_source_block'
    )
    expect(classifyYtdlpQueueFailureKind('Not available from your location', null)).toBe(
      'likely_source_block'
    )
    expect(classifyYtdlpQueueFailureKind("Sign in to confirm you're not a bot", null)).toBe(
      'likely_source_block'
    )
    expect(classifyYtdlpQueueFailureKind('This video may be inappropriate for some users', null)).toBe(
      'likely_source_block'
    )
    expect(classifyYtdlpQueueFailureKind('DRM protected video', null)).toBe('likely_source_block')
    expect(classifyYtdlpQueueFailureKind('No video formats found', null)).toBe(
      'likely_source_block'
    )
    expect(classifyYtdlpQueueFailureKind(null, 'ERROR: No space left on device')).toBe(
      'likely_source_block'
    )
    expect(classifyYtdlpQueueFailureKind('The downloaded file is empty', null)).toBe(
      'likely_source_block'
    )
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
    expect(extractYtdlpOutputPath('[download] Writing metadata to: D:\\Media\\clip.mp4')).toBe(
      'D:\\Media\\clip.mp4'
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

  it('извлекает путь из VideoRemuxer (into …) и стрелочного Destination', () => {
    expect(
      extractYtdlpOutputPath('[VideoRemuxer] Remuxing video from mkv into "C:\\out\\final.mp4"')
    ).toBe('C:\\out\\final.mp4')
    expect(
      extractYtdlpOutputPath('[FFmpegVideoRemuxer] Remux format → Destination: /tmp/final.mkv')
    ).toBe('/tmp/final.mkv')
    expect(
      extractYtdlpOutputPath('[FFmpegVideoRemuxer] Remux format -> Destination: /tmp/ascii.mkv')
    ).toBe('/tmp/ascii.mkv')
  })

  it('извлекает путь из fixup-постпроцессоров yt-dlp', () => {
    expect(
      extractYtdlpOutputPath('[FixupM3u8] Fixing MPEG-TS in MP4 container of "C:\\out\\hls.mp4"')
    ).toBe('C:\\out\\hls.mp4')
    expect(
      extractYtdlpOutputPath('[FixupTimestamp] Fixing frame timestamp in /tmp/final.mkv')
    ).toBe('/tmp/final.mkv')
  })

  it('извлекает путь из SubtitlesConvertor (стрелка или into)', () => {
    expect(
      extractYtdlpOutputPath('[SubsConvertor] Converting subtitles ./vid.en.vtt -> ./vid.ru.srt')
    ).toBe('./vid.ru.srt')
    expect(
      extractYtdlpOutputPath(
        '[SubtitlesConvertor] Converting subtitles /tmp/a.en.vtt → /tmp/a.ru.srt'
      )
    ).toBe('/tmp/a.ru.srt')
    expect(
      extractYtdlpOutputPath('[SubsConvertor] Converting subtitles into "/home/u/out.srt"')
    ).toBe('/home/u/out.srt')
  })
})
