/** §17 — идентификаторы whitelist-папок для IPC «Открыть папку…». */

export type DiagnosticsFolderId =
  | 'userData'
  | 'resources'
  | 'bundledBin'
  | 'userBin'
  | 'logs'
  | 'ytdlpDownloads'
  | 'systemTemp'

export interface DiagnosticsFolderEntry {
  id: DiagnosticsFolderId
  /** Короткая подпись для пункта меню/UI (локаль main). */
  label: string
  /** Подсказка: назначение каталога (title меню / aria в renderer). */
  hint: string
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

export type DiagnosticsMaintenanceTargetId = 'previewCache' | 'ytdlpPartials' | 'ffmpegTemp'

export interface DiagnosticsMaintenanceTarget {
  id: DiagnosticsMaintenanceTargetId
  label: string
  path: string
  exists: boolean
  cleanable: boolean
  files: number
  directories: number
  bytes: number
}

export interface DiagnosticsMaintenanceSnapshot {
  targets: DiagnosticsMaintenanceTarget[]
  totalBytes: number
  cleanableBytes: number
}

export interface DiagnosticsCleanMaintenanceRequest {
  targets?: DiagnosticsMaintenanceTargetId[]
}

export type DiagnosticsCleanMaintenanceResult =
  | {
      ok: true
      removedFiles: number
      removedDirectories: number
      removedBytes: number
      targets: DiagnosticsMaintenanceTarget[]
    }
  | { ok: false; error: string }
