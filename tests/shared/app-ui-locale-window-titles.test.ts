import { describe, expect, it } from 'vitest'

import {
  getDownloadsPopoutWindowTitle,
  getInspectorWindowTitle,
  getMainWindowTitle
} from '../../src/shared/app-ui-locale'

describe('app-ui-locale window titles', () => {
  it('getMainWindowTitle', () => {
    expect(getMainWindowTitle('ru')).toBe('FluxAlloy')
    expect(getMainWindowTitle('en')).toBe('FluxAlloy')
  })

  it('getDownloadsPopoutWindowTitle', () => {
    expect(getDownloadsPopoutWindowTitle('ru')).toBe('FluxAlloy — загрузки')
    expect(getDownloadsPopoutWindowTitle('en')).toBe('FluxAlloy — Downloads')
  })

  it('getInspectorWindowTitle', () => {
    expect(getInspectorWindowTitle('ru')).toBe('FluxAlloy — инспектор')
    expect(getInspectorWindowTitle('en')).toBe('FluxAlloy — Inspector')
  })
})
