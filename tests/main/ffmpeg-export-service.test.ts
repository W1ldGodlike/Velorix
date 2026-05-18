import { describe, expect, it } from 'vitest'

import {
  ensureFfmpegExportExtension,
  inferFfmpegExportContainerFromPath,
  isFfmpegExportProgressStatusLine,
  parseFfmpegExportAudioBitrate,
  parseFfmpegExportAudioMode,
  parseFfmpegExportContainer,
  parseFfmpegExportCropPreset,
  parseFfmpegExportCrf,
  parseFfmpegExportEncodePreset,
  parseFfmpegExportEconomyMode,
  parseFfmpegExportFps,
  parseFfmpegExportScalePreset,
  parseFfmpegExportTrim,
  parseFfmpegExportTwoPass,
  parseFfmpegExportVideoBitrate,
  parseFfmpegSpeedToken,
  parseFfmpegTimeSeconds,
  resolveExportEncodeParams,
  resolveExportSegmentDurationSec
} from '../../src/main/ffmpeg-export-service'

describe('ffmpeg export pure helpers', () => {
  it('разбирает time= из строки прогресса ffmpeg', () => {
    expect(parseFfmpegTimeSeconds('frame=42 fps=30 time=00:01:02.50 bitrate=1M')).toBe(62.5)
    expect(parseFfmpegTimeSeconds('no timestamp')).toBeNull()
  })

  it('разбирает speed= из строки прогресса ffmpeg', () => {
    expect(parseFfmpegSpeedToken('time=00:00:01.00 speed=1.25x')).toBe('1.25x')
    expect(parseFfmpegSpeedToken('time=00:00:01.00 speed=N/A')).toBe('N/A')
    expect(parseFfmpegSpeedToken('no speed')).toBeNull()
  })

  it('§7.1 — фильтр строк статусбара: статистика и ошибки, не баннер сборки', () => {
    expect(
      isFfmpegExportProgressStatusLine(
        'frame=  123 fps= 30 q=28.0 size=    1024kB time=00:01:02.50 bitrate= 500.0kbits/s speed=1.2x'
      )
    ).toBe(true)
    expect(isFfmpegExportProgressStatusLine('ffmpeg version 6.0')).toBe(false)
    expect(isFfmpegExportProgressStatusLine('[error] something failed')).toBe(true)
  })

  it('выбирает безопасный encode preset и параметры libx264', () => {
    expect(parseFfmpegExportEncodePreset('quality')).toBe('quality')
    expect(parseFfmpegExportEncodePreset('bad')).toBe('balance')
    expect(resolveExportEncodeParams('quality')).toEqual({ crf: '18', x264preset: 'medium' })
  })

  it('нормализует контейнер экспорта по расширению', () => {
    expect(parseFfmpegExportContainer('mkv')).toBe('mkv')
    expect(parseFfmpegExportContainer('bad')).toBe('mp4')
    expect(inferFfmpegExportContainerFromPath('out.MOV')).toBe('mov')
    expect(ensureFfmpegExportExtension('out', 'mkv')).toBe('out.mkv')
    expect(ensureFfmpegExportExtension('out.mp4', 'mkv')).toBe('out.mp4')
  })

  it('валидирует ручные CRF и audio/video bitrate', () => {
    expect(parseFfmpegExportCrf(18)).toBe(18)
    expect(parseFfmpegExportCrf('28')).toBe(28)
    expect(parseFfmpegExportCrf(52)).toBeNull()
    expect(parseFfmpegExportVideoBitrate('8000K')).toBe('8000k')
    expect(parseFfmpegExportVideoBitrate('100k')).toBeNull()
    expect(parseFfmpegExportVideoBitrate('60000k')).toBeNull()
    expect(parseFfmpegExportAudioBitrate('192K')).toBe('192k')
    expect(parseFfmpegExportAudioBitrate('16k')).toBeNull()
    expect(parseFfmpegExportAudioBitrate('1000k')).toBeNull()
    expect(parseFfmpegExportAudioMode('none')).toBe('none')
    expect(parseFfmpegExportAudioMode('libmp3lame')).toBe('libmp3lame')
    expect(parseFfmpegExportAudioMode('ac3')).toBe('ac3')
    expect(parseFfmpegExportAudioMode('copy')).toBe('copy')
    expect(parseFfmpegExportAudioMode('pcm_s16le')).toBe('pcm_s16le')
    expect(parseFfmpegExportAudioMode('libvorbis')).toBe('libvorbis')
    expect(parseFfmpegExportAudioMode('libopus')).toBe('libopus')
    expect(parseFfmpegExportAudioMode('flac')).toBe('flac')
    expect(parseFfmpegExportAudioMode('alac')).toBe('alac')
    expect(parseFfmpegExportAudioMode('bad')).toBe('aac')
    expect(parseFfmpegExportTwoPass(true)).toBe(true)
    expect(parseFfmpegExportTwoPass(false)).toBe(false)
    expect(parseFfmpegExportTwoPass(1)).toBe(false)
    expect(parseFfmpegExportEconomyMode(true)).toBe(true)
    expect(parseFfmpegExportEconomyMode(false)).toBe(false)
    expect(parseFfmpegExportEconomyMode(1)).toBe(false)
  })

  it('валидирует FPS и scale preset', () => {
    expect(parseFfmpegExportFps(30)).toBe(30)
    expect(parseFfmpegExportFps('60')).toBe(60)
    expect(parseFfmpegExportFps(29.97)).toBeNull()
    expect(parseFfmpegExportScalePreset('720p')).toBe('720p')
    expect(parseFfmpegExportScalePreset('bad')).toBe('source')
    expect(parseFfmpegExportCropPreset('center-16-9')).toBe('center-16-9')
    expect(parseFfmpegExportCropPreset('bad')).toBe('none')
  })

  it('считает длительность сегмента с учётом trim', () => {
    expect(resolveExportSegmentDurationSec({ inSec: 2, outSec: 7 }, true, 20)).toBe(5)
    expect(resolveExportSegmentDurationSec(undefined, false, 12)).toBe(12)
    expect(resolveExportSegmentDurationSec(undefined, false, null)).toBe(0)
  })

  it('валидирует trim payload из renderer IPC', () => {
    expect(parseFfmpegExportTrim({ inSec: 2, outSec: 7 })).toEqual({ inSec: 2, outSec: 7 })
    expect(parseFfmpegExportTrim({ inSec: -1, outSec: 7 })).toBeUndefined()
    expect(parseFfmpegExportTrim({ inSec: 7, outSec: 7 })).toBeUndefined()
    expect(parseFfmpegExportTrim({ inSec: 8, outSec: 7 })).toBeUndefined()
    expect(parseFfmpegExportTrim({ inSec: Number.NaN, outSec: 7 })).toBeUndefined()
    expect(parseFfmpegExportTrim({ inSec: '2', outSec: 7 })).toBeUndefined()
  })
})
