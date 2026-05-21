import { describe, expect, it } from 'vitest'

import {
  FFMPEG_EXPORT_BATCH_STATUS_DONE,
  FFMPEG_EXPORT_BATCH_STATUS_WAITING
} from '../../src/shared/ffmpeg-export-batch-contract'
import {
  FFMPEG_EXPORT_BATCH_QUEUE_PERSIST_SCHEMA,
  parsePersistedFfmpegExportBatchRow,
  sanitizePersistedFfmpegExportBatchPayload
} from '../../src/main/services/ffmpeg/ffmpeg-export-batch-persist-parse'

describe('ffmpeg-export-batch-persist-parse', () => {
  it('parsePersistedFfmpegExportBatchRow', () => {
    const row = parsePersistedFfmpegExportBatchRow({
      id: 2,
      inputPath: 'D:\\a.mp4',
      shortLabel: 'a.mp4',
      status: 'running',
      progress: '10%'
    })
    expect(row?.status).toBe(FFMPEG_EXPORT_BATCH_STATUS_WAITING)
  })

  it('sanitizePersistedFfmpegExportBatchPayload', () => {
    const payload = sanitizePersistedFfmpegExportBatchPayload({
      schema: FFMPEG_EXPORT_BATCH_QUEUE_PERSIST_SCHEMA,
      concurrency: 2,
      nextId: 5,
      rows: [
        {
          id: 1,
          inputPath: '/v/in.mkv',
          shortLabel: 'in.mkv',
          status: FFMPEG_EXPORT_BATCH_STATUS_DONE,
          progress: '100%'
        }
      ]
    })
    expect(payload?.concurrency).toBe(2)
    expect(payload?.rows).toHaveLength(1)
    expect(payload?.nextId).toBeGreaterThanOrEqual(2)
  })
})
