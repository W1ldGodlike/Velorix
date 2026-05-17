import type { DownloadsWindowUiLocale } from '../../../shared/downloads-window-ui-locale'
import { parseDownloadsWindowUiLocale } from '../../../shared/downloads-window-ui-locale'

export type UiLocale = 'ru' | 'en'

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
  resolved: DownloadsWindowUiLocale
  shouldPersist: boolean
} {
  const fromFile = parseDownloadsWindowUiLocale(loaded.uiLocale)
  if (fromFile !== undefined) {
    uiLocaleOverride = fromFile
    return { resolved: fromFile, shouldPersist: false }
  }
  const resolved = resolveUiLocaleFromNavigator()
  uiLocaleOverride = resolved
  return { resolved, shouldPersist: true }
}

/** После `settings.setUiLocale` или события main `uiLocaleChanged`. */
export function setUiLocaleForSession(locale: DownloadsWindowUiLocale): void {
  uiLocaleOverride = locale
}
