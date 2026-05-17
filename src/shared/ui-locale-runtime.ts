/**
 * §2.2 — смена языка UI без перезапуска: IPC + валидация payload (main/preload/renderer).
 */
import { parseDownloadsWindowUiLocale } from './downloads-window-ui-locale'
import { mainWindowIpc } from './ipc-channels'

export type UiLocaleBroadcastPayload = ReturnType<typeof parseDownloadsWindowUiLocale>

/** Whitelist для `uiLocaleChanged` и `settings.setUiLocale` (как preload `onUiLocaleChanged`). */
export function coerceUiLocaleBroadcastPayload(raw: unknown): UiLocaleBroadcastPayload {
  return parseDownloadsWindowUiLocale(raw)
}

/** Support ZIP / диагностика: цепочка hot-reload локали. */
export function formatUiLocaleIpcDiagnosticLines(): string[] {
  return [
    `invoke: ${mainWindowIpc.settingsSetUiLocale} → persist settings.json uiLocale`,
    `event: ${mainWindowIpc.uiLocaleChanged} → all BrowserWindow webContents`,
    'renderer: onUiLocaleChanged → setUiLocaleForSession + uiLocaleRenderTick (без reload)',
    'downloads pop-out: syncDownloadsPopoutHtmlToLocale после persist',
    'allowed locales: ru | en'
  ]
}
