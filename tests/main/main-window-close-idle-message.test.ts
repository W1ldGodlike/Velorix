import { describe, expect, it } from 'vitest'

import { getMainApplicationStrings } from '../../src/shared/main-runtime-locale'

describe('§4.2 close confirmation idle messages', () => {
  it('formats queue waiting count in ru/en', () => {
    const ru = getMainApplicationStrings('ru')
    const en = getMainApplicationStrings('en')
    expect(ru.quitConfirmIdle).toContain('FluxAlloy')
    expect(ru.quitConfirmIdleWithQueue.replace('{n}', '3')).toContain('3')
    expect(en.quitConfirmIdleWithQueue.replace('{n}', '2')).toContain('2')
    expect(ru.quitYes.length).toBeGreaterThan(0)
    expect(en.quitNo.length).toBeGreaterThan(0)
  })
})
