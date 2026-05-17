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

/** Первый запуск главного окна: FHD на подходящем дисплее, иначе компактный fallback не ниже min*. */
export function defaultMainEditorSize(
  displayW: number,
  displayH: number,
  minW: number,
  minH: number
): { width: number; height: number } {
  const width = displayW >= 1920 ? 1920 : Math.max(minW + 64, Math.round(displayW * 0.96))
  const height = displayH >= 1080 ? 1080 : Math.max(minH + 64, Math.round(displayH * 0.96))
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

/** §4.C / §2.2 — пороги logical scaleFactor для min-размеров окон (100–200 %). */
export const WINDOW_LOGICAL_SCALE_TIERS = [1, 1.25, 1.5, 1.75, 2] as const

/** Support ZIP — связка с CSS @media в main.css и downloads pop-out. */
export function formatWindowHidpiDiagnosticLines(): string[] {
  return [
    'window min sizes: logicalScaleFactor thresholds >=1.25 and >=1.5 (main, downloads, inspector)',
    'CSS HiDPI: @media 120dpi (125%), 144dpi (150%), 168dpi (175%), 192dpi (200%) — main.css + downloads HTML',
    `tiers tested: ${WINDOW_LOGICAL_SCALE_TIERS.join(', ')} (see tests/main/window-hidpi.test.ts)`
  ]
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
