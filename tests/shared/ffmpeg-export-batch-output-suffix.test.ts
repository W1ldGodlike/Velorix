import { describe, expect, it } from 'vitest'

import {
  buildFfmpegExportBatchOutputBasename,
  DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX,
  parseFfmpegExportBatchOutputSuffixTemplate
} from '../../src/shared/ffmpeg-export-batch-output-suffix'

describe('parseFfmpegExportBatchOutputSuffixTemplate', () => {
  it('дефолт при undefined', () => {
    expect(parseFfmpegExportBatchOutputSuffixTemplate(undefined)).toEqual({
      ok: true,
      template: DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX
    })
  })

  it('отклоняет путь в шаблоне', () => {
    expect(parseFfmpegExportBatchOutputSuffixTemplate('../{stem}')).toEqual({
      ok: false,
      error: 'suffix_path_chars'
    })
  })

  it('требует {stem} или {name}', () => {
    expect(parseFfmpegExportBatchOutputSuffixTemplate('out')).toEqual({
      ok: false,
      error: 'suffix_need_stem_or_name'
    })
  })
})

describe('buildFfmpegExportBatchOutputBasename', () => {
  it('подставляет токены', () => {
    expect(buildFfmpegExportBatchOutputBasename('C:\\v\\clip.webm', '{stem}_done.{ext}')).toBe(
      'clip_done.webm'
    )
    expect(buildFfmpegExportBatchOutputBasename('/v/clip.webm', '{name}-x')).toBe('clip.webm-x')
  })
})
