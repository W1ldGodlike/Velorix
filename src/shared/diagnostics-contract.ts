/** §17 — идентификаторы whitelist-папок для IPC «Открыть папку…». */

export type DiagnosticsFolderId =
  | 'userData'
  | 'resources'
  | 'bundledBin'
  | 'userBin'
  | 'logs'
  | 'ytdlpDownloads'

export interface DiagnosticsFolderEntry {
  id: DiagnosticsFolderId
  /** Короткая русская подпись для пункта меню/UI. */
  label: string
  /** Абсолютный путь, который будет передан в `shell.openPath`. */
  path: string
  /** Существует ли каталог в момент перечисления (для disabled-состояния пункта меню). */
  exists: boolean
}

/** §4.5/§18 — открытие `main.log` из renderer через main (без произвольных путей). */
export type DiagnosticsOpenMainLogResult = { ok: true } | { ok: false; error: string }

/**
 * §4.5/§18 — сохранение Support ZIP из диалога в main.
 * Отмена диалога отделена от ошибки записи архива.
 */
export type DiagnosticsSupportZipResult =
  | { ok: true; path: string }
  | { ok: false; cancelled: true }
  | { ok: false; error: string }
