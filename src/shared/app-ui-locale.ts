/**
 * §2.2 — единый whitelist локали UI (renderer, main, preload).
 * Подписи пользователя — `ui-text` / `locales/**`; здесь только тип и парсинг.
 */
export type AppUiLocale = 'ru' | 'en'

export function parseAppUiLocale(v: unknown): AppUiLocale | undefined {
  if (v === 'en' || v === 'ru') {
    return v
  }
  return undefined
}

/** Map Electron/Chromium `app.getLocale()` (or similar) to app UI locale. */
export function appUiLocaleFromSystemLocale(systemLocale: string): AppUiLocale {
  return systemLocale.toLowerCase().startsWith('en') ? 'en' : 'ru'
}

const MAIN_WINDOW_TITLE: Record<AppUiLocale, string> = {
  ru: 'FluxAlloy',
  en: 'FluxAlloy'
}

const DOWNLOADS_POPOUT_WINDOW_TITLE: Record<AppUiLocale, string> = {
  ru: 'FluxAlloy — загрузки',
  en: 'FluxAlloy — Downloads'
}

const INSPECTOR_WINDOW_TITLE: Record<AppUiLocale, string> = {
  ru: 'FluxAlloy — инспектор',
  en: 'FluxAlloy — Inspector'
}

/** Заголовок главного окна (Electron `BrowserWindow`) — синхрон с `mainWindowDocumentTitle` в renderer. */
export function getMainWindowTitle(locale: AppUiLocale): string {
  return MAIN_WINDOW_TITLE[locale]
}

/** Заголовок отдельного окна загрузок (`#downloads`) — main-safe, без renderer `ui-text`. */
export function getDownloadsPopoutWindowTitle(locale: AppUiLocale): string {
  return DOWNLOADS_POPOUT_WINDOW_TITLE[locale]
}

/** Заголовок окна инспектора — синхрон с `inspectorWindowDocumentTitle` в renderer JSON. */
export function getInspectorWindowTitle(locale: AppUiLocale): string {
  return INSPECTOR_WINDOW_TITLE[locale]
}
