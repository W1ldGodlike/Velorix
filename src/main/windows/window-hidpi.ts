import { screen, type Display } from 'electron'

import { formatUiHidpiScaleDiagnosticLine } from '../../shared/ui-hidpi-scale-tiers'
import type { StoredWindowRect } from '../services/settings/settings-store'

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

export function mainEditorMinLogicalSize(scale: number): { minWidth: number; minHeight: number } {
  if (scale >= 1.5) {
    return { minWidth: 520, minHeight: 392 }
  }
  if (scale >= 1.25) {
    return { minWidth: 480, minHeight: 368 }
  }
  return { minWidth: 400, minHeight: 320 }
}

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

export const WINDOW_LOGICAL_SCALE_TIERS = [1, 1.25, 1.5, 1.75, 2] as const

export function formatWindowHidpiDiagnosticLines(): string[] {
  return [
    'window min sizes: logicalScaleFactor thresholds >=1.25 and >=1.5 (main shell only)',
    `tiers tested: ${WINDOW_LOGICAL_SCALE_TIERS.join(', ')} (see tests/main/window-hidpi.test.ts)`,
    formatUiHidpiScaleDiagnosticLine()
  ]
}
