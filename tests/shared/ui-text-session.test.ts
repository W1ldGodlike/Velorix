import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  applyPersistedUiLocale,
  getUiLocale,
  setUiLocaleForSession
} from '../../src/renderer/src/locales/ui-text-session'

describe('ui-text-session §2.2', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', { language: 'en-US' })
    setUiLocaleForSession('ru')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('applyPersistedUiLocale uses stored uiLocale', () => {
    const r = applyPersistedUiLocale({ uiLocale: 'en' })
    expect(r).toEqual({ resolved: 'en', shouldPersist: false })
    expect(getUiLocale()).toBe('en')
  })

  it('applyPersistedUiLocale defaults from navigator and may persist', () => {
    const r = applyPersistedUiLocale({})
    expect(r.resolved).toBe('en')
    expect(r.shouldPersist).toBe(true)
    expect(getUiLocale()).toBe('en')
  })

  it('setUiLocaleForSession switches without reload', () => {
    applyPersistedUiLocale({ uiLocale: 'ru' })
    setUiLocaleForSession('en')
    expect(getUiLocale()).toBe('en')
  })
})
