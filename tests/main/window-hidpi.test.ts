import { describe, expect, it } from 'vitest'

import {
  defaultMainEditorSize,
  downloadsWindowMinLogicalSize,
  mainEditorMinLogicalSize,
  inspectorWindowMinLogicalSize
} from '../../src/main/windows/window-hidpi'

describe('window-hidpi', () => {
  it('повышает min-размеры загрузок при 125% и 150% (логический scaleFactor)', () => {
    expect(downloadsWindowMinLogicalSize(1)).toEqual({ minWidth: 520, minHeight: 420 })
    expect(downloadsWindowMinLogicalSize(1.25)).toEqual({ minWidth: 580, minHeight: 430 })
    expect(downloadsWindowMinLogicalSize(1.75)).toEqual({ minWidth: 620, minHeight: 460 })
    expect(downloadsWindowMinLogicalSize(2)).toEqual({ minWidth: 620, minHeight: 460 })
  })

  it('повышает min-размеры главного редактора при 125% и 150%', () => {
    expect(mainEditorMinLogicalSize(1)).toEqual({ minWidth: 400, minHeight: 320 })
    expect(mainEditorMinLogicalSize(1.25)).toEqual({ minWidth: 480, minHeight: 368 })
    expect(mainEditorMinLogicalSize(2)).toEqual({ minWidth: 520, minHeight: 392 })
  })

  it('повышает min-размеры инспектора при 125% и 150%', () => {
    expect(inspectorWindowMinLogicalSize(1)).toEqual({ minWidth: 440, minHeight: 400 })
    expect(inspectorWindowMinLogicalSize(1.25)).toEqual({ minWidth: 480, minHeight: 432 })
    expect(inspectorWindowMinLogicalSize(2)).toEqual({ minWidth: 520, minHeight: 468 })
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
})
