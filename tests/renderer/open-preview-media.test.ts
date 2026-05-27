import { afterEach, describe, expect, it, vi } from 'vitest'

import { openPreviewMediaDialog } from '../../src/renderer/src/lib/open-preview-media'

describe('openPreviewMediaDialog', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns error when velorix.preview is missing', async () => {
    vi.stubGlobal('window', {} as Window & typeof globalThis)
    await expect(openPreviewMediaDialog()).resolves.toEqual({
      ok: false,
      error: 'velorix.preview.openFileDialog unavailable'
    })
  })

  it('delegates to preload openFileDialog', async () => {
    const openFileDialog = vi.fn(async () => ({
      ok: true as const,
      path: 'C:\\clip.mp4',
      mediaUrl: 'velorixmedia://clip',
      name: 'clip.mp4'
    }))
    vi.stubGlobal('window', {
      velorix: { preview: { openFileDialog } }
    } as unknown as Window & typeof globalThis)
    await expect(openPreviewMediaDialog()).resolves.toMatchObject({
      ok: true,
      name: 'clip.mp4'
    })
    expect(openFileDialog).toHaveBeenCalledOnce()
  })
})
