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
    expect(formatFfmpegExportBatchInputPathsText([])).toBe('')
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

  it('подставляет ошибку из progress, если row.error пуст', () => {
    const onlyProgress: FfmpegExportBatchSnapshot = {
      rows: [
        {
          id: 1,
          inputPath: 'C:\\in\\c.mp4',
          shortLabel: 'c.mp4',
          status: 'error',
          progress: 'encoder exit 1'
        }
      ],
      running: false,
      concurrency: 1,
      completedOk: 0,
      completedError: 1,
      completedCancelled: 0
    }
    const text = formatFfmpegExportBatchReportText(onlyProgress, 'en')
    expect(text).toContain('encoder exit 1')
    const cols = text.trim().split('\n').pop()!.split('\t')
    expect(cols[cols.length - 1]).toBe('encoder exit 1')
  })

  it('пустой список строк — только заголовок и сводка без data-строк', () => {
    const empty: FfmpegExportBatchSnapshot = {
      rows: [],
      running: false,
      concurrency: 1,
      completedOk: 0,
      completedError: 0,
      completedCancelled: 0
    }
    const text = formatFfmpegExportBatchReportText(empty, 'en')
    expect(text).toContain('error_detail')
    expect(text).toContain('ok=0')
    const bodyLines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#') && !l.startsWith('running='))
    expect(bodyLines).toEqual(['status\tinput\toutput\tprogress\terror_detail'])
  })

  it('колонка error_detail — последнее поле TSV для строки с ошибкой', () => {
    const text = formatFfmpegExportBatchReportText(snap, 'en')
    expect(text).toContain('error_detail\r\n')
    const dataLine = text
      .split('\r\n')
      .find((l) => l.includes('b.mkv') && l.includes('codec failed'))
    expect(dataLine).toBeDefined()
    const cols = dataLine!.split('\t')
    expect(cols[cols.length - 1]).toBe('codec failed')
  })

  it('санитизирует табы и переносы в ячейках', () => {
    const messy: FfmpegExportBatchSnapshot = {
      rows: [
        {
          id: 1,
          inputPath: 'C:\\bad\tname.mp4',
          shortLabel: 'x',
          status: 'running',
          progress: 'a\nb'
        },
        {
          id: 2,
          inputPath: 'C:\\in\\b.mp4',
          shortLabel: 'b.mp4',
          status: 'error',
          progress: 'ignored',
          error: 'e\tf'
        }
      ],
      running: true,
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
