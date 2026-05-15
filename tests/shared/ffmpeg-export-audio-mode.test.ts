import { describe, expect, it } from 'vitest'

import {
  exportAudioModeMkvOnlyErrorMessage,
  ffmpegExportAudioModeRequiresMkv,
  ffmpegExportAudioModeUsesBitrate
} from '../../src/shared/ffmpeg-export-audio-mode'

describe('ffmpeg-export-audio-mode', () => {
  it('ffmpegExportAudioModeRequiresMkv', () => {
    expect(ffmpegExportAudioModeRequiresMkv('libopus')).toBe(true)
    expect(ffmpegExportAudioModeRequiresMkv('flac')).toBe(true)
    expect(ffmpegExportAudioModeRequiresMkv('aac')).toBe(false)
    expect(ffmpegExportAudioModeRequiresMkv('pcm_s16le')).toBe(false)
  })

  it('ffmpegExportAudioModeUsesBitrate', () => {
    expect(ffmpegExportAudioModeUsesBitrate('aac')).toBe(true)
    expect(ffmpegExportAudioModeUsesBitrate('libopus')).toBe(true)
    expect(ffmpegExportAudioModeUsesBitrate('flac')).toBe(false)
    expect(ffmpegExportAudioModeUsesBitrate('pcm_s16le')).toBe(false)
  })

  it('exportAudioModeMkvOnlyErrorMessage', () => {
    expect(exportAudioModeMkvOnlyErrorMessage('libopus')).toContain('libopus')
    expect(exportAudioModeMkvOnlyErrorMessage('flac')).toContain('flac')
  })
})
