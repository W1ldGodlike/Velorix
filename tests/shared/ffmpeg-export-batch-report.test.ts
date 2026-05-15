import { describe, expect, it } from 'vitest'

import type { FfmpegExportBatchSnapshot } from '../../src/shared/ffmpeg-export-batch-contract'
import {
  formatFfmpegExportBatchInputPathsText,
  formatFfmpegExportBatchReportText
} from '../../src/shared/ffmpeg-export-batch-report'

const snap: FfmpegExportBatchSnapshot = {
  rows: [
    {
      id: 1,
      inputPath: 'C:\\in\\a.mp4',
      shortLabel: 'a.mp4',
      status: 'done',
      progress: '100%',
      outputPath: 'C:\\out\\a-export.mp4'
    },
    {
      id: 2,
      inputPath: 'C:\\in\\b.mkv',
      shortLabel: 'b.mkv',
      status: 'error',
      progress: 'codec failed',
      error: 'codec failed'
    }
  ],
  running: false,
  concurrency: 2,
  completedOk: 1,
  completedError: 1,
  completedCancelled: 0
}

describe('ffmpeg-export-batch-report', () => {
  it('formatFfmpegExportBatchInputPathsText', () => {
    expect(formatFfmpegExportBatchInputPathsText(['a.mp4', 'b.mkv'])).toBe('a.mp4\r\nb.mkv')
  })

  it('formatFfmpegExportBatchReportText ru', () => {
    const text = formatFfmpegExportBatchReportText(snap, 'ru')
    expect(text).toContain('ok=1')
    expect(text).toContain('C:\\in\\a.mp4')
    expect(text).toContain('Готово')
    expect(text).toContain('Ошибка')
    expect(text).toContain('ошибка')
    expect(text).toContain('codec failed')
  })

  it('formatFfmpegExportBatchReportText en', () => {
    const text = formatFfmpegExportBatchReportText(snap, 'en')
    expect(text).toContain('Done')
    expect(text).toContain('Error')
  })

  it('санитизирует табы и переносы в ячейках', () => {
    const messy: FfmpegExportBatchSnapshot = {
      rows: [
        {
          id: 1,
          inputPath: 'C:\\bad\tname.mp4',
          shortLabel: 'x',
          status: 'error',
          progress: 'a\nb',
          error: 'e\tf'
        }
      ],
      running: false,
      concurrency: 1,
      completedOk: 0,
      completedError: 1,
      completedCancelled: 0
    }
    const text = formatFfmpegExportBatchReportText(messy, 'ru')
    expect(text).toContain('bad name.mp4')
    expect(text).toContain('a b')
    expect(text).toContain('e f')
    expect(text).not.toContain('\tname.mp4')
  })
})
