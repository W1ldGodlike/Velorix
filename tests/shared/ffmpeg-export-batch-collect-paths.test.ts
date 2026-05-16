import { describe, expect, it } from 'vitest'

import {
  collectDownloadsQueueVideoPaths,
  collectUniqueVideoPaths
} from '../../src/shared/ffmpeg-export-batch-collect-paths'
import {
  YTDLP_QUEUE_STATUS_DONE,
  YTDLP_QUEUE_STATUS_WAITING
} from '../../src/shared/ytdlp-queue-status'

describe('ffmpeg-export-batch-collect-paths', () => {
  it('collectDownloadsQueueVideoPaths — только done с video outputPath', () => {
    const paths = collectDownloadsQueueVideoPaths([
      { id: 1, status: YTDLP_QUEUE_STATUS_DONE, outputPath: 'C:\\a.mp4' },
      { id: 2, status: YTDLP_QUEUE_STATUS_WAITING, outputPath: 'C:\\b.mp4' },
      { id: 3, status: YTDLP_QUEUE_STATUS_DONE, outputPath: 'C:\\c.txt' }
    ])
    expect(paths).toEqual(['C:\\a.mp4'])
  })

  it('collectDownloadsQueueVideoPaths — фильтр по ids', () => {
    const paths = collectDownloadsQueueVideoPaths(
      [
        { id: 1, status: YTDLP_QUEUE_STATUS_DONE, outputPath: 'a.mp4' },
        { id: 2, status: YTDLP_QUEUE_STATUS_DONE, outputPath: 'b.mkv' }
      ],
      { ids: [2] }
    )
    expect(paths).toEqual(['b.mkv'])
  })

  it('collectUniqueVideoPaths dedup', () => {
    expect(collectUniqueVideoPaths(['x.mp4', 'X.MP4', 'y.webm'])).toEqual(['x.mp4', 'y.webm'])
  })
})
