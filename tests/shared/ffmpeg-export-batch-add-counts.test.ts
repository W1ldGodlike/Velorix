import { describe, expect, it } from 'vitest'

import {
  emptyFfmpegExportBatchAddCounts,
  sumFfmpegExportBatchAddCounts
} from '../../src/shared/ffmpeg-export-batch-add-counts'

describe('ffmpeg-export-batch-add-counts', () => {
  it('sumFfmpegExportBatchAddCounts', () => {
    expect(
      sumFfmpegExportBatchAddCounts(
        { added: 2, skipped: 1 },
        { added: 0, skipped: 3 },
        emptyFfmpegExportBatchAddCounts()
      )
    ).toEqual({ added: 2, skipped: 4 })
  })
})
