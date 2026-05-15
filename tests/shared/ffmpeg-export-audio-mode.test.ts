import { describe, expect, it } from 'vitest'

import {
  exportAudioModeMkvOnlyErrorMessage,
  ffmpegExportAudioModeAllowsFilters,
  ffmpegExportAudioModeRequiresMkv,
  ffmpegExportAudioModeUsesBitrate
} from '../../src/shared/ffmpeg-export-audio-mode'

describe('ffmpeg-export-audio-mode', () => {
  it('ffmpegExportAudioModeRequiresMkv', () => {
    expect(ffmpegExportAudioModeRequiresMkv('libopus')).toBe(true)
    expect(ffmpegExportAudioModeRequiresMkv('flac')).toBe(true)
    expect(ffmpegExportAudioModeRequiresMkv('libvorbis')).toBe(true)
    expect(ffmpegExportAudioModeRequiresMkv('aac')).toBe(false)
    expect(ffmpegExportAudioModeRequiresMkv('copy')).toBe(false)
    expect(ffmpegExportAudioModeRequiresMkv('pcm_s16le')).toBe(false)
  })

  it('ffmpegExportAudioModeUsesBitrate', () => {
    expect(ffmpegExportAudioModeUsesBitrate('aac')).toBe(true)
    expect(ffmpegExportAudioModeUsesBitrate('libmp3lame')).toBe(true)
    expect(ffmpegExportAudioModeUsesBitrate('ac3')).toBe(true)
    expect(ffmpegExportAudioModeUsesBitrate('libopus')).toBe(true)
    expect(ffmpegExportAudioModeUsesBitrate('libvorbis')).toBe(true)
    expect(ffmpegExportAudioModeUsesBitrate('flac')).toBe(false)
    expect(ffmpegExportAudioModeUsesBitrate('pcm_s16le')).toBe(false)
    expect(ffmpegExportAudioModeUsesBitrate('copy')).toBe(false)
  })

  it('ffmpegExportAudioModeAllowsFilters', () => {
    expect(ffmpegExportAudioModeAllowsFilters('aac')).toBe(true)
    expect(ffmpegExportAudioModeAllowsFilters('copy')).toBe(false)
    expect(ffmpegExportAudioModeAllowsFilters('none')).toBe(false)
  })

  it('exportAudioModeMkvOnlyErrorMessage', () => {
    expect(exportAudioModeMkvOnlyErrorMessage('libopus')).toContain('libopus')
    expect(exportAudioModeMkvOnlyErrorMessage('flac')).toContain('flac')
    expect(exportAudioModeMkvOnlyErrorMessage('libvorbis')).toContain('libvorbis')
  })
})
