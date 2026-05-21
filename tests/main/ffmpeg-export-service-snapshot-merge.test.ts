import { describe, expect, it } from 'vitest'

import type { AppSettings } from '../../src/shared/settings-contract'
import { mergeFfmpegExportSnapshotIntoAppSettings } from '../../src/main/services/ffmpeg/ffmpeg-export-service'

describe('ffmpeg export pure helpers', () => {
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
      scalePreset: 'source',
      videoTransform: 'none',
      cropPreset: 'none'
    })
    expect(next.ffmpegExportCrf).toBeUndefined()
    expect(next.ffmpegExportAudioMode).toBeUndefined()
    expect(next.ffmpegExportAudioBitrate).toBe('128k')
    expect(next.ffmpegExportScalePreset).toBeUndefined()
    expect(next.ffmpegExportVideoTransform).toBeUndefined()
    expect(next.ffmpegExportCropPreset).toBeUndefined()
    const withTp = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
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
      }
    )
    expect(withTp.ffmpegExportTwoPass).toBe(true)

    const hwCodec = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
        encodePreset: 'balance',
        videoCodec: 'h264_nvenc',
        container: 'mp4',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none'
      }
    )
    expect(hwCodec.ffmpegExportVideoCodec).toBe('h264_nvenc')

    const autoCodec = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
        encodePreset: 'balance',
        videoCodec: 'hw_auto',
        container: 'mp4',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none'
      }
    )
    expect(autoCodec.ffmpegExportVideoCodec).toBe('hw_auto')

    const autoHevc = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
        encodePreset: 'balance',
        videoCodec: 'hw_auto_hevc',
        container: 'mp4',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none'
      }
    )
    expect(autoHevc.ffmpegExportVideoCodec).toBe('hw_auto_hevc')

    const pcmMode = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
        encodePreset: 'balance',
        container: 'mkv',
        crf: null,
        videoBitrate: null,
        audioMode: 'pcm_s16le',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none'
      }
    )
    expect(pcmMode.ffmpegExportAudioMode).toBe('pcm_s16le')

    const opusMode = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
        encodePreset: 'balance',
        container: 'mkv',
        crf: null,
        videoBitrate: null,
        audioMode: 'libopus',
        audioBitrate: '128k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none'
      }
    )
    expect(opusMode.ffmpegExportAudioMode).toBe('libopus')

    const deb = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
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
        videoDeband: 'strong'
      }
    )
    expect(deb.ffmpegExportVideoDeband).toBe('strong')

    const grain = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
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
        videoGrain: 'medium'
      }
    )
    expect(grain.ffmpegExportVideoGrain).toBe('medium')

    const vignette = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
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
        videoVignette: 'light'
      }
    )
    expect(vignette.ffmpegExportVideoVignette).toBe('light')

    const blur = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
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
        videoBlur: 'medium'
      }
    )
    expect(blur.ffmpegExportVideoBlur).toBe('medium')

    const histeq = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
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
        videoHisteq: 'light'
      }
    )
    expect(histeq.ffmpegExportVideoHisteq).toBe('light')

    const deint = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
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
        videoDeinterlace: 'frame'
      }
    )
    expect(deint.ffmpegExportVideoDeinterlace).toBe('frame')

    const hue = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
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
        videoHue: 'coolShift'
      }
    )
    expect(hue.ffmpegExportVideoHue).toBe('coolShift')

    const lut = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
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
        videoLut3d: 'film-warm'
      }
    )
    expect(lut.ffmpegExportVideoLut3d).toBe('film-warm')

    const lutOff = mergeFfmpegExportSnapshotIntoAppSettings(lut, {
      encodePreset: 'balance',
      container: 'mp4',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      videoTransform: 'none',
      cropPreset: 'none'
    })
    expect(lutOff.ffmpegExportVideoLut3d).toBeUndefined()

    const off = mergeFfmpegExportSnapshotIntoAppSettings(withTp, {
      encodePreset: 'balance',
      container: 'mp4',
      crf: null,
      videoBitrate: '2500k',
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      videoTransform: 'none',
      cropPreset: 'none'
    })
    expect(off.ffmpegExportTwoPass).toBeUndefined()
  })
})
