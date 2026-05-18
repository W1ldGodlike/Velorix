import { describe, expect, it, vi } from 'vitest'

import {
  fetchLatestFfmpegVersionToken,
  fetchLatestYtDlpVersionToken
} from '../../src/shared/engine-update-fetch'

describe('engine-update-fetch §3', () => {
  it('fetchLatestYtDlpVersionToken parses tag_name', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ tag_name: '2024.10.07' })
    })
    vi.stubGlobal('fetch', fetchMock)
    await expect(fetchLatestYtDlpVersionToken()).resolves.toBe('2024.10.07')
    vi.unstubAllGlobals()
  })

  it('fetchLatestFfmpegVersionToken parses version from release name', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ name: 'Latest auto build ffmpeg 7.1.1', body: '' })
    })
    vi.stubGlobal('fetch', fetchMock)
    await expect(fetchLatestFfmpegVersionToken()).resolves.toBe('7.1.1')
    vi.unstubAllGlobals()
  })
})
