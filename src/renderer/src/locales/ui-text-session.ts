import type { AppUiLocale } from '../../../shared/app-ui-locale'
import { parseAppUiLocale } from '../../../shared/app-ui-locale'

export type UiLocale = AppUiLocale

/** Set from `settings.json` after preload `settings.get()`; until then — `navigator`. */
let uiLocaleOverride: UiLocale | undefined

function resolveUiLocaleFromNavigator(): UiLocale {
  if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('en')) {
    return 'en'
  }
  return 'ru'
}

export function getUiLocale(): UiLocale {
  return uiLocaleOverride ?? resolveUiLocaleFromNavigator()
}

/**
 * Sync renderer UI strings with persisted `uiLocale` (or persist navigator default once).
 * Caller should bump React state after this so components re-read `getUiLocale()` / `uiText()`.
 */
export function applyPersistedUiLocale(loaded: { uiLocale?: unknown }): {
  resolved: AppUiLocale
  shouldPersist: boolean
} {
  const fromFile = parseAppUiLocale(loaded.uiLocale)
  if (fromFile !== undefined) {
    uiLocaleOverride = fromFile
    return { resolved: fromFile, shouldPersist: false }
  }
  const resolved = resolveUiLocaleFromNavigator()
  uiLocaleOverride = resolved
  return { resolved, shouldPersist: true }
}

/** После `settings.setUiLocale` или события main `uiLocaleChanged`. */
export function setUiLocaleForSession(locale: AppUiLocale): void {
  uiLocaleOverride = locale
}

/** Синхронизировать `<html lang>` без перезагрузки окна (§2.2). */
export function syncDocumentUiLocale(locale: AppUiLocale): void {
  if (typeof document === 'undefined') {
    return
  }
  document.documentElement.lang = locale
}
