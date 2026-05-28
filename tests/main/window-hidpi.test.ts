import { describe, expect, it } from 'vitest'

import {
  defaultMainEditorSize,
  mainEditorMinLogicalSize,
  mainEditorWorkAreaBounds
} from '../../src/main/windows/window-hidpi'

describe('window-hidpi', () => {
  it('повышает min-размеры главного окна при 125% и 150%', () => {
    expect(mainEditorMinLogicalSize(1)).toEqual({ minWidth: 400, minHeight: 320 })
    expect(mainEditorMinLogicalSize(1.25)).toEqual({ minWidth: 480, minHeight: 368 })
    expect(mainEditorMinLogicalSize(2)).toEqual({ minWidth: 520, minHeight: 392 })
  })

  it('defaultMainEditorSize укладывается в типичную рабочую область и не ниже min', () => {
    const minW = 520
    const minH = 392
    const d = defaultMainEditorSize(1280, 720, minW, minH)
    expect(d.width).toBeLessThanOrEqual(1920)
    expect(d.height).toBeLessThanOrEqual(1080)
    expect(d.width).toBeGreaterThanOrEqual(minW + 64)
    expect(d.height).toBeGreaterThanOrEqual(minH + 64)
  })

  it('defaultMainEditorSize сохраняет требование стартового FHD на подходящем дисплее', () => {
    expect(defaultMainEditorSize(1920, 1080, 520, 392)).toEqual({
      width: 1920,
      height: 1080
    })
  })

  it('mainEditorWorkAreaBounds берёт workArea дисплея', () => {
    const display = {
      workArea: { x: 8, y: 8, width: 2560, height: 1400 }
    } as import('electron').Display
    expect(mainEditorWorkAreaBounds(display)).toEqual({
      x: 8,
      y: 8,
      width: 2560,
      height: 1400
    })
  })
})
