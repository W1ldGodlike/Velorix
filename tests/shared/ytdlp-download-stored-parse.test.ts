import { describe, expect, it } from 'vitest'

import {
  parseYtdlpCookiesBrowser,
  parseYtdlpFilenameTemplateStored,
  parseYtdlpFormatPreset,
  parseYtdlpImpersonate,
  parseYtdlpQueueRetryProfile,
  parseYtdlpSubtitlePreset
} from '../../src/shared/ytdlp-download-stored-parse'

describe('ytdlp-download-stored-parse', () => {
  it('parseYtdlpFormatPreset — whitelist и fallback editor_mp4', () => {
    expect(parseYtdlpFormatPreset('merge_bv_ba')).toBe('merge_bv_ba')
    expect(parseYtdlpFormatPreset('bogus')).toBe('editor_mp4')
  })

  it('parseYtdlpSubtitlePreset — manual* или none', () => {
    expect(parseYtdlpSubtitlePreset('manual_auto')).toBe('manual_auto')
    expect(parseYtdlpSubtitlePreset('none')).toBe('none')
    expect(parseYtdlpSubtitlePreset(42)).toBe('none')
  })

  it('parseYtdlpCookiesBrowser / parseYtdlpImpersonate — только chrome|edge|firefox', () => {
    expect(parseYtdlpCookiesBrowser('firefox')).toBe('firefox')
    expect(parseYtdlpCookiesBrowser('safari')).toBeUndefined()
    expect(parseYtdlpImpersonate('edge')).toBe('edge')
    expect(parseYtdlpImpersonate(null)).toBeUndefined()
  })

  it('parseYtdlpQueueRetryProfile — persistent или off', () => {
    expect(parseYtdlpQueueRetryProfile('persistent')).toBe('persistent')
    expect(parseYtdlpQueueRetryProfile('')).toBe('off')
  })

  it.each([
    { raw: '  %(title)s.%(ext)s  ', expected: '%(title)s.%(ext)s' },
    { raw: '', expected: undefined },
    { raw: 42, expected: undefined },
    { raw: 'x'.repeat(500), expected: 'x'.repeat(480) }
  ])('parseYtdlpFilenameTemplateStored $#', ({ raw, expected }) => {
    expect(parseYtdlpFilenameTemplateStored(raw)).toBe(expected)
  })
})
