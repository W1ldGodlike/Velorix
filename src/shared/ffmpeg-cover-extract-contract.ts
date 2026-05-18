/** §17 — извлечение встроенной обложки (attached_pic / embedded art). */

import type { AppUiLocale } from './app-ui-locale'

export type FfmpegCoverExtractQueueRowRequestPayload = {
  queueRowId: number
  uiLocale?: AppUiLocale
}

export type FfmpegCoverExtractResult =
  | { ok: true; outputPath: string }
  | { ok: false; cancelled: true }
  | { ok: false; noCover: true }
  | { ok: false; error: string }
