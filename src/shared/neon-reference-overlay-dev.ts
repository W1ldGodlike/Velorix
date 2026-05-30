/** Dev overlay vs `docs/reference/*.png` (sign-off tooling; not product UI). */

import {
  VELORIX_NEON_REFERENCE_PROCESSING_REL,
  VELORIX_REFERENCE_ASSETS_DIR
} from './velorix-neon-theme-tokens'

/** Portal target: shell body без `NeonWindowChrome` (NEON-чеклист § UI PURGE v3). */
export const NEON_REF_OVERLAY_SHELL_BODY_SELECTOR = '.neon-chrome-shell__body' as const

export const NEON_REF_OVERLAY_STORAGE_KEY = 'velorix.neon.refOverlay.opacity' as const
export const NEON_REF_OVERLAY_VISIBLE_KEY = 'velorix.neon.refOverlay.visible' as const
export const NEON_REF_OVERLAY_FIT_KEY = 'velorix.neon.refOverlay.fit' as const

export type RefOverlayFit = 'cover' | 'contain' | 'fill'

const DEFAULT_OPACITY = 0.45

/** PNG из `docs/reference/` для UI и dev overlay (`velorixref:///`). */
export function velorixRefPngUrl(rel: string): string {
  return refOverlayUrlForRel(rel)
}

export function refOverlayUrlForRel(rel: string): string {
  const prefix = `${VELORIX_REFERENCE_ASSETS_DIR}/`
  const name = rel.startsWith(prefix) ? rel.slice(prefix.length) : rel.split('/').pop()
  if (!name || name.includes('..')) {
    return ''
  }
  // Трёхслэшный path (как velorixhelp:///) — иначе имя уходит в host и protocol отдаёт 403.
  return `velorixref:///${name}`
}

export function readRefOverlayOpacity(): number {
  try {
    const raw = localStorage.getItem(NEON_REF_OVERLAY_STORAGE_KEY)
    if (raw == null) {
      return DEFAULT_OPACITY
    }
    const n = Number(raw)
    return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : DEFAULT_OPACITY
  } catch {
    return DEFAULT_OPACITY
  }
}

export function writeRefOverlayOpacity(value: number): void {
  try {
    localStorage.setItem(NEON_REF_OVERLAY_STORAGE_KEY, String(Math.min(1, Math.max(0, value))))
  } catch {
    /* ignore quota */
  }
}

export function readRefOverlayVisible(): boolean {
  try {
    const raw = localStorage.getItem(NEON_REF_OVERLAY_VISIBLE_KEY)
    if (raw == null) {
      return false
    }
    return raw === '1'
  } catch {
    return false
  }
}

export function writeRefOverlayVisible(visible: boolean): void {
  try {
    localStorage.setItem(NEON_REF_OVERLAY_VISIBLE_KEY, visible ? '1' : '0')
  } catch {
    /* ignore quota */
  }
}

export function readRefOverlayFitFromLocation(): RefOverlayFit {
  if (typeof window === 'undefined') {
    return 'cover'
  }
  const v = new URLSearchParams(window.location.search).get('refOverlayFit')
  if (v === 'contain' || v === 'fill' || v === 'cover') {
    return v
  }
  try {
    const stored = localStorage.getItem(NEON_REF_OVERLAY_FIT_KEY)
    if (stored === 'contain' || stored === 'fill' || stored === 'cover') {
      return stored
    }
  } catch {
    /* ignore */
  }
  return 'cover'
}

export function writeRefOverlayFit(fit: RefOverlayFit): void {
  try {
    localStorage.setItem(NEON_REF_OVERLAY_FIT_KEY, fit)
  } catch {
    /* ignore quota */
  }
}

export function refOverlayPortalHost(): HTMLElement | null {
  if (typeof document === 'undefined') {
    return null
  }
  return (
    document.querySelector(NEON_REF_OVERLAY_SHELL_BODY_SELECTOR) ?? document.getElementById('root')
  )
}

/**
 * Подсказка HUD: ref.1 PNG без ─/✕; footer sidebar (settings/power) не в каноне.
 * @see docs/IMPLEMENTATION_NEON_CHECKLIST.md § «Исключения / cross-cutting chrome»
 */
export function refOverlayCompareNoteForRel(rel: string): string {
  if (rel === VELORIX_NEON_REFERENCE_PROCESSING_REL) {
    return 'зона shell body · ─✕ вне PNG · footer sidebar не верстаем'
  }
  return 'зона shell body · ─✕ вне PNG'
}
