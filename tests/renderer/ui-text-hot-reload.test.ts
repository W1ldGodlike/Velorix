import { describe, expect, it, vi } from 'vitest'

import {
  notifyUiTextShardsUpdated,
  subscribeUiTextShardsUpdated
} from '../../src/renderer/src/locales/ui-text-hot-reload'

describe('ui-text-hot-reload', () => {
  it('subscribeUiTextShardsUpdated notifies listeners', () => {
    const fn = vi.fn()
    const off = subscribeUiTextShardsUpdated(fn)
    notifyUiTextShardsUpdated()
    expect(fn).toHaveBeenCalledTimes(1)
    off()
    notifyUiTextShardsUpdated()
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
