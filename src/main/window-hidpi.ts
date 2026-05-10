import { screen, type Display } from 'electron'

import type { StoredWindowRect } from './settings-store'

/**
 * Экран, на котором окажется окно после restore bounds (§4.C — те же DIP, что `scaleFactor` у Electron).
 */
export function displayMatchingRestoreRect(rect: StoredWindowRect | null): Display {
  if (rect) {
    return screen.getDisplayMatching({
      x: rect.x,
      y: rect.y,
      width: Math.max(8, rect.width),
      height: Math.max(8, rect.height)
    })
  }
  return screen.getPrimaryDisplay()
}

export function logicalScaleFactor(d: Display): number {
  return d.scaleFactor > 0 ? d.scaleFactor : 1
}

export function downloadsWindowMinLogicalSize(scale: number): {
  minWidth: number
  minHeight: number
} {
  if (scale >= 1.5) {
    return { minWidth: 620, minHeight: 460 }
  }
  if (scale >= 1.25) {
    return { minWidth: 580, minHeight: 430 }
  }
  return { minWidth: 520, minHeight: 420 }
}

export function mainEditorMinLogicalSize(scale: number): { minWidth: number; minHeight: number } {
  if (scale >= 1.5) {
    return { minWidth: 520, minHeight: 392 }
  }
  if (scale >= 1.25) {
    return { minWidth: 480, minHeight: 368 }
  }
  return { minWidth: 400, minHeight: 320 }
}

export function inspectorWindowMinLogicalSize(scale: number): {
  minWidth: number
  minHeight: number
} {
  if (scale >= 1.5) {
    return { minWidth: 520, minHeight: 468 }
  }
  if (scale >= 1.25) {
    return { minWidth: 480, minHeight: 432 }
  }
  return { minWidth: 440, minHeight: 400 }
}

/** Первый запуск главного окна: ~FHD, но не шире/выше рабочей области и не меньше min*. */
export function defaultMainEditorSize(
  workW: number,
  workH: number,
  minW: number,
  minH: number
): { width: number; height: number } {
  const width = Math.min(1920, Math.max(minW + 64, Math.round(workW * 0.96)))
  const height = Math.min(1080, Math.max(minH + 64, Math.round(workH * 0.96)))
  return { width, height }
}

export function defaultInspectorWindowSize(
  workW: number,
  workH: number,
  minW: number,
  minH: number
): { width: number; height: number } {
  const width = Math.min(1024, Math.max(minW + 48, Math.round(workW * 0.58)))
  const height = Math.min(900, Math.max(minH + 48, Math.round(workH * 0.68)))
  return { width, height }
}

export function defaultDownloadsWindowLogicalSize(
  workW: number,
  workH: number
): { width: number; height: number } {
  return {
    width: Math.min(Math.max(760, Math.round(workW * 0.66)), 1220),
    height: Math.min(Math.max(520, Math.round(workH * 0.72)), 880)
  }
}
