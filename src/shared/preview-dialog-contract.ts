/** Результат системного диалога «Открыть видео» §4.B (IPC allowlist `fluxmedia://`). */

export type PreviewDialogResult =
  | { ok: true; path: string; mediaUrl: string; name: string }
  | { ok: false; canceled: true }
  | { ok: false; canceled?: false; error: string }
