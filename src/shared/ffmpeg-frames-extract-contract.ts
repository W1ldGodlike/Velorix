/** §7.6 — пакетное извлечение кадров из видео. */

import type { AppUiLocale } from './app-ui-locale'
import type { FfmpegSnapshotFormatId } from './ffmpeg-snapshot-contract'

export const FFMPEG_FRAMES_EXTRACT_MAX_FRAMES = 200
export const FFMPEG_FRAMES_EXTRACT_MIN_INTERVAL_SEC = 0.25

export type FfmpegFramesExtractModeId = 'interval' | 'count' | 'manual'

export type FfmpegFramesExtractRequestPayload = {
  inputPath: string
  durationSec: number
  mode: FfmpegFramesExtractModeId
  /** Режим interval: шаг в секундах. */
  intervalSec: number | null
  /** Режим count: число кадров (равномерно по длительности). */
  frameCount: number | null
  /** Режим manual: метки в секундах (отсортированы и ограничены длительностью на main). */
  manualTimesSec: number[] | null
  format: FfmpegSnapshotFormatId
  uiLocale?: AppUiLocale
}

export type FfmpegFramesExtractProgressPayload = {
  index: number
  total: number
  timeSec: number
  outputPath: string | null
}

export type FfmpegFramesExtractResult =
  | {
      ok: true
      outputDir: string
      saved: number
      failed: number
      paths: string[]
    }
  | { ok: false; cancelled: true }
  | { ok: false; error: string }
