/**
 * §2.2 — смена языка UI без перезапуска: IPC + валидация payload (main/preload/renderer).
 */
import { parseAppUiLocale } from './app-ui-locale'
import { mainWindowIpc } from './ipc-channels'

export type UiLocaleBroadcastPayload = ReturnType<typeof parseAppUiLocale>

/** Whitelist для `uiLocaleChanged` и `settings.setUiLocale` (как preload `onUiLocaleChanged`). */
export function coerceUiLocaleBroadcastPayload(raw: unknown): UiLocaleBroadcastPayload {
  return parseAppUiLocale(raw)
}

/** Support ZIP / диагностика: цепочка hot-reload локали. */
export function formatUiLocaleIpcDiagnosticLines(): string[] {
  return [
    `invoke: ${mainWindowIpc.settingsSetUiLocale} → persist settings.json uiLocale`,
    `event: ${mainWindowIpc.uiLocaleChanged} → all BrowserWindow webContents`,
    'renderer: onUiLocaleChanged → setUiLocaleForSession + syncDocumentUiLocale + presets refresh (без reload)',
    'main: syncBrowserWindowTitlesToLocale + renderer document.title / lang',
    'downloads / inspector pop-out: uiLocaleChanged + setTitle (React hash routes)',
    'dev: Vite HMR on locales/**/*.json → reloadUiTextTablesFromModules + uiLocaleRenderTick bump',
    'allowed locales: ru | en'
  ]
}
