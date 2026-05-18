import { describe, expect, it } from 'vitest'

import {
  compareEngineVersionTokens,
  isEngineUpdateAvailable,
  parseEngineVersionToken
} from '../../src/shared/engine-version-parse'

describe('engine-version-parse §3', () => {
  it('parseEngineVersionToken extracts yt-dlp dated version', () => {
    expect(parseEngineVersionToken('yt-dlp', '2024.08.06')).toBe('2024.08.06')
  })

  it('parseEngineVersionToken extracts ffmpeg version line', () => {
    expect(parseEngineVersionToken('ffmpeg', 'ffmpeg version 7.1.1-full_build')).toBe('7.1.1')
    expect(parseEngineVersionToken('ffprobe', 'ffprobe version 7.0.2')).toBe('7.0.2')
  })

  it('compareEngineVersionTokens orders numeric parts', () => {
    expect(compareEngineVersionTokens('7.0.2', '7.1.1')).toBe(-1)
    expect(compareEngineVersionTokens('2024.08.06', '2024.10.07')).toBe(-1)
    expect(compareEngineVersionTokens('7.1.1', '7.1.1')).toBe(0)
  })

  it('isEngineUpdateAvailable when current older or missing', () => {
    expect(isEngineUpdateAvailable('7.0.0', '7.1.0')).toBe(true)
    expect(isEngineUpdateAvailable(null, '2024.10.07')).toBe(true)
    expect(isEngineUpdateAvailable('7.1.0', '7.1.0')).toBe(false)
    expect(isEngineUpdateAvailable('8.0.0', '7.9.9')).toBe(false)
  })
})
