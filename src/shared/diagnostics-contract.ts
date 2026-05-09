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
