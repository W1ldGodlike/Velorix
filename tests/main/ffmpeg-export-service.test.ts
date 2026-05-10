import { describe, expect, it } from 'vitest'

import type { AppSettings } from '../../src/shared/settings-contract'
import {
  ensureFfmpegExportExtension,
  inferFfmpegExportContainerFromPath,
  mergeFfmpegExportSnapshotIntoAppSettings,
  parseFfmpegExportAudioBitrate,
  parseFfmpegExportAudioMode,
  parseFfmpegExportEncodePreset,
  parseFfmpegExportContainer,
  parseFfmpegExportCrf,
  parseFfmpegExportFps,
  parseFfmpegExportScalePreset,
  parseFfmpegExportUserPresetSnapshot,
  parseFfmpegExportUserPresetsList,
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
    expect(parseFfmpegExportAudioMode('bad')).toBe('aac')
  })

  it('валидирует FPS и scale preset', () => {
    expect(parseFfmpegExportFps(30)).toBe(30)
    expect(parseFfmpegExportFps('60')).toBe(60)
    expect(parseFfmpegExportFps(29.97)).toBeNull()
    expect(parseFfmpegExportScalePreset('720p')).toBe('720p')
    expect(parseFfmpegExportScalePreset('bad')).toBe('source')
  })

  it('считает длительность сегмента с учётом trim', () => {
    expect(resolveExportSegmentDurationSec({ inSec: 2, outSec: 7 }, true, 20)).toBe(5)
    expect(resolveExportSegmentDurationSec(undefined, false, 12)).toBe(12)
    expect(resolveExportSegmentDurationSec(undefined, false, null)).toBe(0)
  })

  it('parseFfmpegExportUserPresetSnapshot и список пресетов §7.2', () => {
    expect(parseFfmpegExportUserPresetSnapshot(null)).toBeNull()
    const snap = parseFfmpegExportUserPresetSnapshot({
      encodePreset: 'quality',
      container: 'mkv',
      crf: 20,
      videoBitrate: null,
      audioMode: 'none',
      audioBitrate: '192k',
      fps: 30,
      scalePreset: '720p'
    })
    expect(snap).toMatchObject({
      encodePreset: 'quality',
      container: 'mkv',
      crf: 20,
      videoBitrate: null,
      audioMode: 'none',
      audioBitrate: '192k',
      fps: 30,
      scalePreset: '720p'
    })
    const list = parseFfmpegExportUserPresetsList([
      { id: 'ab-cd_1', label: 'Тест', snapshot: snap },
      { id: 'bad id!', label: 'x', snapshot: snap }
    ])
    expect(list).toHaveLength(1)
    expect(list[0]?.id).toBe('ab-cd_1')
  })

  it('mergeFfmpegExportSnapshotIntoAppSettings повторяет правила delete для дефолтов', () => {
    const base: AppSettings = { theme: 'dark', ffmpegExportCrf: 40, ffmpegExportAudioMode: 'none' }
    const next = mergeFfmpegExportSnapshotIntoAppSettings(base, {
      encodePreset: 'balance',
      container: 'mp4',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '128k',
      fps: null,
      scalePreset: 'source'
    })
    expect(next.ffmpegExportCrf).toBeUndefined()
    expect(next.ffmpegExportAudioMode).toBeUndefined()
    expect(next.ffmpegExportAudioBitrate).toBe('128k')
    expect(next.ffmpegExportScalePreset).toBeUndefined()
  })
})
