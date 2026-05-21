import { describe, expect, it } from 'vitest'

import type { FfmpegExportUserPreset } from '../../src/shared/ffmpeg-export-contract'
import {
  buildPresetsExportBundleV1,
  buildPresetsExportFileV1,
  parsePresetsExportBundleV1,
  parsePresetsExportFileV1
} from '../../src/shared/presets-export-disk-parse'
import { PRESETS_EXPORT_FILE_KIND } from '../../src/shared/presets-export-file-v1'

const samplePreset: FfmpegExportUserPreset = {
  id: 'user-1',
  label: 'Test',
  snapshot: {
    encodePreset: 'quality',
    container: 'mkv',
    crf: 20,
    videoBitrate: null,
    audioMode: 'none',
    audioBitrate: '192k',
    fps: 30,
    scalePreset: '720p',
    videoTransform: 'none',
    cropPreset: 'none'
  }
}

describe('presets-export-disk-parse', () => {
  it('round-trips single preset file v1', () => {
    const file = buildPresetsExportFileV1(samplePreset)
    expect(file.kind).toBe(PRESETS_EXPORT_FILE_KIND)
    expect(parsePresetsExportFileV1(file)?.id).toBe('user-1')
  })

  it('parses bundle and rejects unknown version', () => {
    const bundle = buildPresetsExportBundleV1([samplePreset])
    expect(parsePresetsExportBundleV1(bundle)).toHaveLength(1)
    expect(parsePresetsExportBundleV1({ ...bundle, formatVersion: 99 })).toHaveLength(0)
  })

  it('accepts bare preset object as single file', () => {
    expect(parsePresetsExportFileV1(samplePreset)?.label).toBe('Test')
  })
})
