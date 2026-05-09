import { describe, expect, it } from 'vitest'

import {
  ensureFfmpegExportExtension,
  inferFfmpegExportContainerFromPath,
  parseFfmpegExportEncodePreset,
  parseFfmpegExportContainer,
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

  it('считает длительность сегмента с учётом trim', () => {
    expect(resolveExportSegmentDurationSec({ inSec: 2, outSec: 7 }, true, 20)).toBe(5)
    expect(resolveExportSegmentDurationSec(undefined, false, 12)).toBe(12)
    expect(resolveExportSegmentDurationSec(undefined, false, null)).toBe(0)
  })
})
