import { describe, expect, it } from 'vitest'

import type { EnginesStatusSnapshot } from '../../src/shared/engine-contract'
import { formatEngineVersionsLineFromSnapshot } from '../../src/shared/engine-statusbar-versions'

function snapshot(
  engines: Partial<
    Record<
      'ffmpeg' | 'ffprobe' | 'yt-dlp',
      { state: 'ready' | 'missing' | 'error' | 'checking'; version: string | null }
    >
  >
): EnginesStatusSnapshot {
  const base = {
    state: 'missing' as const,
    displayName: '',
    executableName: '',
    path: null,
    version: null,
    message: null
  }
  return {
    checkedAt: new Date().toISOString(),
    engines: {
      ffmpeg: { id: 'ffmpeg', ...base, ...engines.ffmpeg },
      ffprobe: { id: 'ffprobe', ...base, ...engines.ffprobe },
      'yt-dlp': { id: 'yt-dlp', ...base, ...engines['yt-dlp'] }
    }
  }
}

const labels = {
  dash: '—',
  errorMark: '!',
  checking: '…',
  ellipsis: '…',
  engineName: (id: string) => id
}

describe('engine-statusbar-versions §3/§4.C', () => {
  it('formatEngineVersionsLineFromSnapshot uses parsed version tokens', () => {
    const line = formatEngineVersionsLineFromSnapshot(
      snapshot({
        ffmpeg: { state: 'ready', version: 'ffmpeg version 7.1.1-full_build' },
        ffprobe: { state: 'ready', version: 'ffprobe version 7.1.1' },
        'yt-dlp': { state: 'ready', version: '2024.10.07' }
      }),
      labels
    )
    expect(line).toBe('ffmpeg: 7.1.1 · ffprobe: 7.1.1 · yt-dlp: 2024.10.07')
  })

  it('formatEngineVersionsLineFromSnapshot marks missing and error', () => {
    const line = formatEngineVersionsLineFromSnapshot(
      snapshot({
        ffmpeg: { state: 'missing', version: null },
        ffprobe: { state: 'error', version: null },
        'yt-dlp': { state: 'checking', version: null }
      }),
      labels
    )
    expect(line).toContain('ffmpeg: —')
    expect(line).toContain('ffprobe: !')
    expect(line).toContain('yt-dlp: …')
  })
})
