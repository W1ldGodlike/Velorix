import { describe, expect, it, vi, afterEach } from 'vitest'

import { readUiHidpiRuntimeStatus } from '../../src/renderer/src/ui-hidpi-runtime-status'

function stubWindow(devicePixelRatio: number, matchMedia: (query: string) => boolean): void {
  vi.stubGlobal('window', {
    devicePixelRatio,
    matchMedia: vi.fn((query: string) => ({
      matches: matchMedia(query),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }))
  })
}

describe('ui-hidpi-runtime-status', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('readUiHidpiRuntimeStatus — базовый ярус без HiDPI media', () => {
    stubWindow(1, () => false)
    const status = readUiHidpiRuntimeStatus()
    expect(status.devicePixelRatio).toBe(1)
    expect(status.activeCssTierDpi).toBeNull()
    expect(status.activeWindowsScalePercent).toBeNull()
    expect(status.approximateWindowsScalePercent).toBe(100)
  })

  it('readUiHidpiRuntimeStatus — наивысший сработавший @media', () => {
    stubWindow(1.5, (query) => query.includes('120dpi') || query.includes('144dpi'))
    const status = readUiHidpiRuntimeStatus()
    expect(status.activeCssTierDpi).toBe(144)
    expect(status.activeWindowsScalePercent).toBe(150)
    expect(status.approximateWindowsScalePercent).toBe(150)
  })
})
