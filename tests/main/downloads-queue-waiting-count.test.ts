import { describe, expect, it } from 'vitest'

import {
  clearDownloadsQueue,
  countDownloadsQueueWaitingRows,
  enqueueFirstWaitingUrlFromBlock,
  replaceDownloadsQueueState
} from '../../src/main/services/downloads/downloads-queue'
import {
  YTDLP_QUEUE_STATUS_CANCELLED,
  YTDLP_QUEUE_STATUS_DONE,
  YTDLP_QUEUE_STATUS_WAITING
} from '../../src/shared/ytdlp-queue-status'

describe('countDownloadsQueueWaitingRows §4.2.3', () => {
  it('counts only waiting rows', () => {
    clearDownloadsQueue()
    replaceDownloadsQueueState([
      {
        id: 1,
        url: 'https://example.com/a',
        shortLabel: 'a',
        progress: '—',
        status: YTDLP_QUEUE_STATUS_WAITING
      },
      {
        id: 2,
        url: 'https://example.com/b',
        shortLabel: 'b',
        progress: '—',
        status: YTDLP_QUEUE_STATUS_DONE
      },
      {
        id: 3,
        url: 'https://example.com/c',
        shortLabel: 'c',
        progress: '—',
        status: YTDLP_QUEUE_STATUS_CANCELLED
      }
    ])
    expect(countDownloadsQueueWaitingRows()).toBe(1)
    enqueueFirstWaitingUrlFromBlock('https://example.com/d')
    expect(countDownloadsQueueWaitingRows()).toBe(2)
  })
})
