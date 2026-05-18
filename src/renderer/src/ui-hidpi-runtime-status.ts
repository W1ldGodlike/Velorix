import {
  UI_HIDPI_CSS_MEDIA_TIERS,
  UI_HIDPI_WINDOWS_SCALE_PERCENTS
} from '../../shared/ui-hidpi-scale-tiers'

export type UiHidpiRuntimeStatus = {
  devicePixelRatio: number
  approximateWindowsScalePercent: number
  /** Наивысший сработавший блок @media в main.css; `null` — базовый 100 %. */
  activeCssTierDpi: number | null
  /** Процент из `UI_HIDPI_CSS_MEDIA_TIERS` (125/150/175/200) или `null`. */
  activeWindowsScalePercent: number | null
}

function hidpiMediaQuery(minDevicePixelRatio: number, minResolutionDpi: number): MediaQueryList {
  return window.matchMedia(
    `(-webkit-min-device-pixel-ratio: ${minDevicePixelRatio}), (min-resolution: ${minResolutionDpi}dpi)`
  )
}

/** Текущий HiDPI-ярус renderer (§1.1 — для панели настроек и ручной сверки). */
export function readUiHidpiRuntimeStatus(): UiHidpiRuntimeStatus {
  const devicePixelRatio = window.devicePixelRatio
  let activeCssTierDpi: number | null = null
  let activeWindowsScalePercent: number | null = null

  for (const tier of UI_HIDPI_CSS_MEDIA_TIERS) {
    if (hidpiMediaQuery(tier.minDevicePixelRatio, tier.minResolutionDpi).matches) {
      activeCssTierDpi = tier.minResolutionDpi
      activeWindowsScalePercent = tier.windowsScalePercent
    }
  }

  const approxRaw = Math.round(devicePixelRatio * 100)
  const allowed = UI_HIDPI_WINDOWS_SCALE_PERCENTS as readonly number[]
  let approximateWindowsScalePercent = allowed[0] ?? 100
  let bestDelta = Math.abs(approxRaw - approximateWindowsScalePercent)
  for (const p of allowed) {
    const delta = Math.abs(approxRaw - p)
    if (delta < bestDelta) {
      bestDelta = delta
      approximateWindowsScalePercent = p
    }
  }

  return {
    devicePixelRatio,
    approximateWindowsScalePercent,
    activeCssTierDpi,
    activeWindowsScalePercent
  }
}
