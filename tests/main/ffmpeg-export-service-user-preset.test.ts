import { describe, expect, it } from 'vitest'

import {
  parseFfmpegExportUserPresetSnapshot,
  parseFfmpegExportUserPresetsList,
  parseFfmpegExportVideoBlur,
  parseFfmpegExportVideoDeinterlace,
  parseFfmpegExportVideoGrain,
  parseFfmpegExportVideoHisteq,
  parseFfmpegExportVideoVignette
} from '../../src/main/ffmpeg-export-service'

describe('ffmpeg export pure helpers', () => {
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
      scalePreset: '720p',
      videoTransform: 'hflip',
      cropPreset: 'center-square'
    })
    expect(snap).toMatchObject({
      encodePreset: 'quality',
      container: 'mkv',
      crf: 20,
      videoBitrate: null,
      audioMode: 'none',
      audioBitrate: '192k',
      fps: 30,
      scalePreset: '720p',
      videoTransform: 'hflip',
      cropPreset: 'center-square'
    })
    const list = parseFfmpegExportUserPresetsList([
      { id: 'ab-cd_1', label: 'Тест', snapshot: snap },
      { id: 'bad id!', label: 'x', snapshot: snap }
    ])
    expect(list).toHaveLength(1)
    expect(list[0]?.id).toBe('ab-cd_1')
    expect(
      parseFfmpegExportUserPresetSnapshot({
        encodePreset: 'balance',
        container: 'mp4',
        crf: null,
        videoBitrate: '2500k',
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none',
        twoPass: true
      })
    ).toMatchObject({ twoPass: true })
    const hevcTwo = parseFfmpegExportUserPresetSnapshot({
      encodePreset: 'balance',
      videoCodec: 'libx265',
      container: 'mp4',
      crf: null,
      videoBitrate: '2500k',
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      videoTransform: 'none',
      cropPreset: 'none',
      twoPass: true
    })
    expect(hevcTwo).toMatchObject({ videoCodec: 'libx265' })
    expect(hevcTwo?.twoPass).toBeUndefined()
    expect(
      parseFfmpegExportUserPresetSnapshot({
        encodePreset: 'balance',
        container: 'mp4',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none',
        videoDeband: 'medium'
      })
    ).toMatchObject({ videoDeband: 'medium' })
    expect(
      parseFfmpegExportUserPresetSnapshot({
        encodePreset: 'balance',
        container: 'mp4',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none',
        videoLut3d: 'punch'
      })
    ).toMatchObject({ videoLut3d: 'punch' })
    expect(
      parseFfmpegExportUserPresetSnapshot({
        encodePreset: 'balance',
        container: 'mp4',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none',
        videoGrain: 'light'
      })
    ).toMatchObject({ videoGrain: 'light' })
    expect(
      parseFfmpegExportUserPresetSnapshot({
        encodePreset: 'balance',
        container: 'mp4',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none',
        videoDeinterlace: 'field'
      })
    ).toMatchObject({ videoDeinterlace: 'field' })
    expect(
      parseFfmpegExportUserPresetSnapshot({
        encodePreset: 'balance',
        container: 'mp4',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none',
        videoHisteq: 'strong'
      })
    ).toMatchObject({ videoHisteq: 'strong' })
  })

  it('parseFfmpegExportVideoGrain — whitelist', () => {
    expect(parseFfmpegExportVideoGrain('light')).toBe('light')
    expect(parseFfmpegExportVideoGrain('bogus')).toBe('off')
  })

  it('parseFfmpegExportVideoVignette — whitelist', () => {
    expect(parseFfmpegExportVideoVignette('medium')).toBe('medium')
    expect(parseFfmpegExportVideoVignette('bogus')).toBe('off')
  })

  it('parseFfmpegExportVideoBlur — whitelist', () => {
    expect(parseFfmpegExportVideoBlur('strong')).toBe('strong')
    expect(parseFfmpegExportVideoBlur('bogus')).toBe('off')
  })

  it('parseFfmpegExportVideoHisteq — whitelist', () => {
    expect(parseFfmpegExportVideoHisteq('light')).toBe('light')
    expect(parseFfmpegExportVideoHisteq('bogus')).toBe('off')
  })

  it('parseFfmpegExportVideoDeinterlace — whitelist', () => {
    expect(parseFfmpegExportVideoDeinterlace('frame')).toBe('frame')
    expect(parseFfmpegExportVideoDeinterlace('field')).toBe('field')
    expect(parseFfmpegExportVideoDeinterlace('bogus')).toBe('off')
  })
})
