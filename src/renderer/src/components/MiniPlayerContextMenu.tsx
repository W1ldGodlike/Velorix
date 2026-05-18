import { useEffect, type JSX, type RefObject } from 'react'
import { createPortal } from 'react-dom'

import { uiText } from '../locales/ui-text'

export type MiniPlayerContextMenuState = {
  x: number
  y: number
} | null

export function MiniPlayerContextMenu({
  menu,
  menuRef,
  alwaysOnTop,
  onDismiss,
  onToggleAlwaysOnTop,
  onRestoreMain,
  onClose
}: {
  menu: MiniPlayerContextMenuState
  menuRef: RefObject<HTMLDivElement | null>
  alwaysOnTop: boolean
  onDismiss: () => void
  onToggleAlwaysOnTop: () => void
  onRestoreMain: () => void
  onClose: () => void
}): JSX.Element | null {
  useEffect(() => {
    if (!menu) {
      return
    }
    const close = (): void => onDismiss()
    window.setTimeout(() => {
      menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
    }, 0)
    const onPointerDown = (ev: PointerEvent): void => {
      const root = menuRef.current
      if (root && ev.target instanceof Node && root.contains(ev.target)) {
        return
      }
      close()
    }
    const onKey = (ev: KeyboardEvent): void => {
      if (ev.key === 'Escape') {
        close()
      }
    }
    window.addEventListener('pointerdown', onPointerDown, true)
    window.addEventListener('keydown', onKey, true)
    return (): void => {
      window.removeEventListener('pointerdown', onPointerDown, true)
      window.removeEventListener('keydown', onKey, true)
    }
  }, [menu, menuRef, onDismiss])

  if (!menu) {
    return null
  }

  const topLabel = `${uiText('miniPlayerAlwaysOnTop')}${alwaysOnTop ? ' ✓' : ''}`

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      aria-label={uiText('miniPlayerContextMenuAria')}
      className="app-probe-context-menu app-mini-player-context-menu"
      style={{ left: menu.x, top: menu.y }}
    >
      <button
        type="button"
        role="menuitemcheckbox"
        aria-checked={alwaysOnTop}
        className="app-probe-context-menu-item"
        onClick={() => {
          onToggleAlwaysOnTop()
          onDismiss()
        }}
      >
        {topLabel}
      </button>
      <button
        type="button"
        role="menuitem"
        className="app-probe-context-menu-item"
        onClick={() => {
          onRestoreMain()
          onDismiss()
        }}
      >
        {uiText('miniPlayerRestoreMain')}
      </button>
      <button
        type="button"
        role="menuitem"
        className="app-probe-context-menu-item"
        onClick={() => {
          onClose()
          onDismiss()
        }}
      >
        {uiText('miniPlayerClose')}
      </button>
    </div>,
    document.body
  )
}
