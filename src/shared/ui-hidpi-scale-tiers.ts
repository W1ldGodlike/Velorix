/**
 * §1.1 / §4.C — связка Windows display scale ↔ Electron logical scaleFactor ↔ CSS @media в main.css.
 * Ручная сверка на мониторе: 100 / 125 / 150 / 200 % в «Параметры → Экран → Масштаб».
 */
export const UI_HIDPI_WINDOWS_SCALE_PERCENTS = [100, 125, 150, 200] as const

export type UiHidpiWindowsScalePercent = (typeof UI_HIDPI_WINDOWS_SCALE_PERCENTS)[number]

/** Пороги @media в `src/renderer/src/assets/main.css` (min-resolution dpi). */
export const UI_HIDPI_CSS_MEDIA_TIERS = [
  {
    windowsScalePercent: 125 as const,
    minDevicePixelRatio: 1.25,
    minResolutionDpi: 120
  },
  {
    windowsScalePercent: 150 as const,
    minDevicePixelRatio: 1.5,
    minResolutionDpi: 144
  },
  {
    windowsScalePercent: 175 as const,
    minDevicePixelRatio: 1.75,
    minResolutionDpi: 168
  },
  {
    windowsScalePercent: 200 as const,
    minDevicePixelRatio: 2,
    minResolutionDpi: 192
  }
] as const

/** Ключевые поверхности, которые обязаны иметь правила в блоке 120dpi (125 % Windows). */
export const UI_HIDPI_CSS_SURFACE_SELECTORS = [
  'app-settings-dialog',
  'app-settings-dialog-nav-btn',
  'app-settings-hotkeys-table',
  'app-statusbar-activity-dot',
  'app-statusbar-activity-label',
  'app-modal-footer'
] as const

export function windowsScalePercentToLogicalScaleFactor(
  percent: UiHidpiWindowsScalePercent
): number {
  return percent / 100
}

export function formatUiHidpiScaleDiagnosticLine(): string {
  const tiers = UI_HIDPI_CSS_MEDIA_TIERS.map(
    (t) => `${t.windowsScalePercent}%→${t.minResolutionDpi}dpi`
  ).join(', ')
  return `UI HiDPI CSS tiers (Windows): ${tiers}; surfaces: ${UI_HIDPI_CSS_SURFACE_SELECTORS.join(', ')}`
}
