import { screen, type BrowserWindow } from 'electron'

import type { StoredWindowRect } from './settings-store'

const MIN_W = 400
const MIN_H = 320
const MAX_WH = 8192

/**
 * Восстановление окна §4.1: если рамка почти не попадает ни в один монитор — центрируем на основном.
 */
export function rectifyBoundsForRestore(r: StoredWindowRect): StoredWindowRect {
  const width = Math.max(MIN_W, Math.min(r.width, MAX_WH))
  const height = Math.max(MIN_H, Math.min(r.height, MAX_WH))
  const x = r.x
  const y = r.y

  function hasVisibleSlice(ax: number, ay: number): boolean {
    return screen.getAllDisplays().some((d) => {
      const w = d.workArea
      const left = Math.max(ax, w.x)
      const top = Math.max(ay, w.y)
      const right = Math.min(ax + width, w.x + w.width)
      const bottom = Math.min(ay + height, w.y + w.height)
      return right - left >= 120 && bottom - top >= 80
    })
  }

  if (!hasVisibleSlice(x, y)) {
    const { workArea } = screen.getPrimaryDisplay()
    const nx = Math.round(workArea.x + Math.max(0, (workArea.width - width) / 2))
    const ny = Math.round(workArea.y + Math.max(0, (workArea.height - height) / 2))
    return { x: nx, y: ny, width, height }
  }

  return { x, y, width, height }
}

export function boundsFromBrowserWindow(win: BrowserWindow): StoredWindowRect {
  const [x, y] = win.getPosition()
  const [width, height] = win.getSize()
  return { x, y, width, height }
}
