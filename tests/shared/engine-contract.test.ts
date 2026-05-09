import { describe, expect, it } from 'vitest'

import { ENGINE_IDS } from '../../src/shared/engine-contract'

describe('engine-contract', () => {
  it('ENGINE_IDS — три уникальных ключа в фиксированном порядке', () => {
    expect(ENGINE_IDS).toEqual(['ffmpeg', 'ffprobe', 'yt-dlp'])
    expect(new Set(ENGINE_IDS).size).toBe(3)
  })
})
