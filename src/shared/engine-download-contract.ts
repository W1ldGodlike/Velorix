/** Прогресс UI при скачивании движков §3 (IPC в главное окно). */

export type EngineDownloadPhase = 'idle' | 'yt-dlp' | 'ffmpeg-zip' | 'extract' | 'done'

export interface EngineDownloadProgress {
  phase: EngineDownloadPhase
  message: string
  /** -1 означает «неизвестно» (распаковка без процентов). */
  percent: number
}
