/**
 * §20 — IPC результаты импорта/экспорта пресетов (меню «Сервис»).
 */
import type { AppSettings } from './settings-contract'

export type PresetsExportDialogOk = { ok: true }

export type PresetsExportDialogCancelled = { ok: false; cancelled: true }

export type PresetsExportDialogError = { ok: false; error: string }

export type PresetsExportDialogResult =
  | PresetsExportDialogOk
  | PresetsExportDialogCancelled
  | PresetsExportDialogError

export type PresetsExportCloneBuiltinRequest = {
  builtinPresetId: string
}

export type PresetsExportCloneBuiltinResult = AppSettings | { error: string }
