import { describe, expect, it, vi } from 'vitest'

import {
  focusMainBrowserWindow,
  setMainWindowFocusAccessor
} from '../../src/main/main-window-focus'

describe('focusMainBrowserWindow', () => {
  it('shows, restores, and focuses a hidden minimized main window', () => {
    const show = vi.fn()
    const restore = vi.fn()
    const focus = vi.fn()
    const win = {
      isDestroyed: () => false,
      isVisible: () => false,
      isMinimized: () => true,
      show,
      restore,
      focus
    }
    setMainWindowFocusAccessor(() => win as never)
    focusMainBrowserWindow()
    expect(show).toHaveBeenCalledOnce()
    expect(restore).toHaveBeenCalledOnce()
    expect(focus).toHaveBeenCalledOnce()
  })

  it('no-ops when main window is missing', () => {
    setMainWindowFocusAccessor(() => null)
    expect(() => focusMainBrowserWindow()).not.toThrow()
  })
})
