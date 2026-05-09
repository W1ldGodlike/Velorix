/** Результат системного диалога «Открыть видео» §4.B (IPC allowlist `fluxmedia://`). */

export type PreviewDialogResult =
  | { ok: true; path: string; mediaUrl: string; name: string }
  | { ok: false; canceled: true }
  | { ok: false; canceled?: false; error: string }

/** Восстановленный источник из settings: без `ok`, потому что null уже означает отсутствие восстановления. */
export interface RestoredSourceInfo {
  path: string
  mediaUrl: string
  name: string
}
