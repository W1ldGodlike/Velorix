/** События потокового лога yt-dlp §6.4 (IPC в окно загрузок). */

export type DownloadsLogPayload =
  | { kind: 'reset'; rowId: number }
  | { kind: 'line'; rowId: number; stream: 'stdout' | 'stderr'; text: string }
