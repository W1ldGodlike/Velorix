import { describe, expect, it } from 'vitest'
import { getMainRuntimeLocaleBundle } from '../../src/shared/main-runtime-locale'
import { MAIN_RUNTIME_LOCALE_RU } from '../../src/shared/main-runtime-locale-ru'
import { MAIN_RUNTIME_LOCALE_EN } from '../../src/shared/main-runtime-locale-en'
import { getDownloadsWindowIpcStrings } from '../../src/shared/downloads-window-ipc-locale'

describe('main-runtime-locale', () => {
  it('returns frozen RU/EN bundles with expected sections', () => {
    expect(getMainRuntimeLocaleBundle('ru')).toBe(MAIN_RUNTIME_LOCALE_RU)
    expect(getMainRuntimeLocaleBundle('en')).toBe(MAIN_RUNTIME_LOCALE_EN)
    expect(getMainRuntimeLocaleBundle('ru').mainApplication.menuFile).toBe('Файл')
    expect(getMainRuntimeLocaleBundle('en').mainApplication.menuFile).toBe('File')
  })

  it('ipc getter matches bundle downloadsIpc', () => {
    expect(getDownloadsWindowIpcStrings('ru').invalidData).toBe(
      getMainRuntimeLocaleBundle('ru').downloadsIpc.invalidData
    )
    expect(getDownloadsWindowIpcStrings('en').invalidData).toBe('Invalid data')
  })
})
