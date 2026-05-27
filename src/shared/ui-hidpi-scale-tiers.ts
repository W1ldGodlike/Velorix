/**
 * §1.1 / §4.C — Windows display scale ↔ Electron logical scaleFactor (без legacy main.css).
 */
export const UI_HIDPI_WINDOWS_SCALE_PERCENTS = [100, 125, 150, 200] as const

export type UiHidpiWindowsScalePercent = (typeof UI_HIDPI_WINDOWS_SCALE_PERCENTS)[number]

export function windowsScalePercentToLogicalScaleFactor(
  percent: UiHidpiWindowsScalePercent
): number {
  return percent / 100
}

export function formatUiHidpiScaleDiagnosticLine(): string {
  return `UI HiDPI logical tiers (Windows %): ${UI_HIDPI_WINDOWS_SCALE_PERCENTS.join('/')}`
}
