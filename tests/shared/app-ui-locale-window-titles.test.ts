import { describe, expect, it } from 'vitest'

import {
  getDownloadsPopoutWindowTitle,
  getInspectorWindowTitle,
  getMainWindowTitle
} from '../../src/shared/app-ui-locale'

describe('app-ui-locale window titles', () => {
  it('getMainWindowTitle', () => {
    expect(getMainWindowTitle('ru')).toBe('VELORIX')
    expect(getMainWindowTitle('en')).toBe('VELORIX')
  })

  it('getDownloadsPopoutWindowTitle', () => {
    expect(getDownloadsPopoutWindowTitle('ru')).toBe('Velorix — загрузки')
    expect(getDownloadsPopoutWindowTitle('en')).toBe('Velorix — Downloads')
  })

  it('getInspectorWindowTitle', () => {
    expect(getInspectorWindowTitle('ru')).toBe('Velorix — инспектор')
    expect(getInspectorWindowTitle('en')).toBe('Velorix — Inspector')
  })
})
