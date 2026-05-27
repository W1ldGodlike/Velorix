import { describe, expect, it } from 'vitest'

import { getInspectorWindowTitle, getMainWindowTitle } from '../../src/shared/app-ui-locale'

describe('app-ui-locale window titles', () => {
  it('getMainWindowTitle', () => {
    expect(getMainWindowTitle('ru')).toBe('VELORIX')
    expect(getMainWindowTitle('en')).toBe('VELORIX')
  })

  it('getInspectorWindowTitle', () => {
    expect(getInspectorWindowTitle('ru')).toBe('Velorix — инспектор')
    expect(getInspectorWindowTitle('en')).toBe('Velorix — Inspector')
  })
})
