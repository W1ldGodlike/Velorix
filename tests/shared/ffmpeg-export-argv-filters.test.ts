import { describe, expect, it } from 'vitest'

import {
  FFMPEG_EXPORT_CROP_FILTER_CASES,
  FFMPEG_EXPORT_SCALE_FILTER_CASES,
  FFMPEG_EXPORT_VIDEO_TRANSFORM_CASES
} from '../fixtures/ffmpeg-export-argv-cases'
import {
  buildFfmpegExportArgv,
  resolveFfmpegExportCropFilter,
  resolveFfmpegExportScaleFilter,
  resolveFfmpegExportVideoTransformFilters
} from '../../src/shared/ffmpeg-export-argv'

describe('shared ffmpeg export argv — scale, transform, crop filters', () => {
  it.each(FFMPEG_EXPORT_SCALE_FILTER_CASES)(
    'resolveFfmpegExportScaleFilter($preset)',
    ({ preset, filter }) => {
      expect(resolveFfmpegExportScaleFilter(preset)).toBe(filter)
    }
  )

  it.each(FFMPEG_EXPORT_VIDEO_TRANSFORM_CASES)(
    'resolveFfmpegExportVideoTransformFilters($id)',
    ({ id, filters }) => {
      expect(resolveFfmpegExportVideoTransformFilters(id)).toEqual(filters)
    }
  )

  it.each(FFMPEG_EXPORT_CROP_FILTER_CASES)(
    'resolveFfmpegExportCropFilter($preset)',
    ({ preset, filter }) => {
      expect(resolveFfmpegExportCropFilter(preset)).toBe(filter)
    }
  )

  it('трансформ и crop идут в -vf перед scale и fps §7.2', () => {
    const argv = buildFfmpegExportArgv({
      inputPath: 'in.mp4',
      outputPath: 'out.mp4',
      applyTrim: false,
      encodePreset: 'balance',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: 30,
      scalePreset: '720p',
      videoTransform: 'cw90',
      cropPreset: 'center-square'
    })
    expect(argv[argv.indexOf('-vf') + 1]).toBe(
      'transpose=1,crop=min(iw\\,ih):min(iw\\,ih),scale=-2:720,fps=30'
    )
  })

})
