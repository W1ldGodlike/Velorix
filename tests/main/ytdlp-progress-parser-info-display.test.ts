import { describe, expect, it } from 'vitest'

import {
  YTDLP_PROGRESS_PERCENT_NUMBER_CASES,
  YTDLP_SPEED_TO_BPS_CASES
} from '../fixtures/ytdlp-progress-parse-cases'
import {
  displayLabelFromYtdlpOutputPath,
  formatTorrentStyleSpeedFromBps,
  formatYtdlpProgressCell,
  parseYtdlpInfoDownloadingTitlePrefix,
  parseYtdlpInfoFormatSnippet,
  parseYtdlpInfoQueueSizeHint,
  parseYtdlpProgressPercentNumber,
  parseYtdlpQueueFormatHint,
  parseYtdlpSpeedToBytesPerSec
} from '../../src/main/services/ytdlp/ytdlp-progress-parser'

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
    ).toBe('перепаковка (remux) → mp4')
    expect(
      parseYtdlpQueueFormatHint(
        '[FFmpegVideoConvertor] Convert video from webm to mp4; Destination: /tmp/clip.mp4'
      )
    ).toBe('перекодирование (convert) → mp4')
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
  it.each(YTDLP_PROGRESS_PERCENT_NUMBER_CASES)(
    'parseYtdlpProgressPercentNumber(%j)',
    ({ input, expected }) => {
      const r = parseYtdlpProgressPercentNumber(input)
      if (expected === null) {
        expect(r).toBeNull()
      } else {
        expect(r).toBeCloseTo(expected, 5)
      }
    }
  )
})

describe('parseYtdlpSpeedToBytesPerSec', () => {
  it.each(YTDLP_SPEED_TO_BPS_CASES)('parseYtdlpSpeedToBytesPerSec(%j)', ({ input, expected }) => {
    const r = parseYtdlpSpeedToBytesPerSec(input)
    if (expected === null) {
      expect(r).toBeNull()
    } else {
      expect(r).toBeCloseTo(expected, 1)
    }
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
    expect(displayLabelFromYtdlpOutputPath('C:\\dl\\My Video [L_DypYRwPJs].mp4')).toBe('My Video')
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
