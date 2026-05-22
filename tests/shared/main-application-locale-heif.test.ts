import { describe, expect, it } from 'vitest'

import { getMainApplicationStrings } from '../../src/shared/main-application-locale'

describe('main-application-locale §7.5 HEIC', () => {
  it('ru/en strings mention libheif for unsupported HEIC', () => {
    expect(getMainApplicationStrings('ru').mediaUtilitiesHeifUnsupported).toContain('libheif')
    expect(getMainApplicationStrings('en').mediaUtilitiesHeifUnsupported).toContain('libheif')
  })
})
