import { describe, expect, it } from 'vitest'

import {
  parseStoredTheme,
  parseStoredTrimmedWhitelistEnum,
  parseStoredWhitelistEnum
} from '../../src/shared/settings-stored-parse'

describe('settings-stored-parse', () => {
  it('parseStoredWhitelistEnum', () => {
    expect(parseStoredWhitelistEnum('mkv', ['mp4', 'mkv', 'mov'])).toBe('mkv')
    expect(parseStoredWhitelistEnum('webm', ['mp4', 'mkv'])).toBeUndefined()
  })

  it('parseStoredTrimmedWhitelistEnum', () => {
    expect(parseStoredTrimmedWhitelistEnum('  quality  ', ['balance', 'quality'])).toBe('quality')
    expect(parseStoredTrimmedWhitelistEnum('bad', ['balance', 'quality'])).toBeUndefined()
  })

  it('parseStoredTheme', () => {
    expect(parseStoredTheme('light')).toBe('light')
    expect(parseStoredTheme('nope')).toBe('dark')
  })
})
