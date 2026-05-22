/** §17 — обслуживание медиафайлов (remux repair, проверка целостности). */

import type { AppUiLocale } from './app-ui-locale'

export type MediaUtilitiesRepairRequestPayload = {
  inputPath: string
  uiLocale?: AppUiLocale
}

export type MediaUtilitiesRepairResult =
  | { ok: true; outputPath: string }
  | { ok: false; cancelled: true }
  | { ok: false; error: string }

export type MediaUtilitiesIntegrityRequestPayload = {
  inputPath: string
  uiLocale?: AppUiLocale
}

export type MediaUtilitiesIntegrityResult =
  | { ok: true; clean: true }
  | { ok: true; clean: false; detail: string }
  | { ok: false; cancelled: true }
  | { ok: false; error: string }

export type MediaUtilitiesNoiseKind = 'white' | 'pink' | 'silence'

export type MediaUtilitiesGenerateNoiseRequestPayload = {
  kind: MediaUtilitiesNoiseKind
  durationSec: number
  uiLocale?: AppUiLocale
}

export type MediaUtilitiesGenerateNoiseResult =
  | { ok: true; outputPath: string }
  | { ok: false; cancelled: true }
  | { ok: false; error: string }

export type MediaUtilitiesFileHashRequestPayload = {
  inputPath: string
  uiLocale?: AppUiLocale
}

export type MediaUtilitiesFileHashResult =
  | { ok: true; fileName: string; md5: string; sha256: string }
  | { ok: false; error: string }

import type { FfmpegSnapshotFormatId } from './ffmpeg-snapshot-contract'

/** §7.5 — целевой формат конвертации одного изображения / спрайта. */
export type MediaUtilitiesImageFormatId = FfmpegSnapshotFormatId

export type MediaUtilitiesConvertImageRequestPayload = {
  inputPath: string
  targetFormat: MediaUtilitiesImageFormatId
  uiLocale?: AppUiLocale
}

export type MediaUtilitiesConvertImageResult =
  | { ok: true; outputPath: string }
  | { ok: false; cancelled: true }
  | { ok: false; error: string }

export type {
  MediaUtilitiesCreateImageSlideshowRequestPayload,
  MediaUtilitiesCreateImageSlideshowResult,
  MediaUtilitiesPickSlideshowImagesResult
} from './ffmpeg-image-slideshow-contract'
