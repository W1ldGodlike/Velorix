/**
 * IPC/main совместимые типы экспорта ffmpeg §7.1–§7.2 (без реализации spawn).
 * Используются в preload/renderer и в main-сервисе; парсеры и runner остаются в `ffmpeg-export-service`.
 */

/** Диапазон экспорта по маркерам §7.1 (секунды на шкале исходника). */
export interface MediaExportTrimPayload {
  inSec: number
  outSec: number
}

/** Первые системные пресеты libx264 §7.2 — только белый список, без произвольных аргументов. */
export type FfmpegExportEncodePresetId = 'balance' | 'smaller' | 'quality'
export type FfmpegExportContainerId = 'mp4' | 'mkv' | 'mov'
export type FfmpegExportScalePresetId = 'source' | '480p' | '720p' | '1080p'
/** §7.2 — безопасные повороты/зеркала через whitelist `-vf` (до scale/fps). */
export type FfmpegExportVideoTransformId = 'none' | 'cw90' | 'ccw90' | 'r180' | 'hflip' | 'vflip'
/** §7.2 — crop только через предустановленные выражения, без пользовательской строки `-vf`. */
export type FfmpegExportCropPresetId = 'none' | 'center-square' | 'center-16-9' | 'center-4-3'
export type FfmpegExportAudioModeId = 'aac' | 'none'

/**
 * §7.2 — сохранённый снимок параметров экспорта для пользовательского пресета.
 * Совместим с белым списком parse-хелперов main (`parseFfmpegExport*`).
 */
export interface FfmpegExportUserPresetSnapshot {
  encodePreset: FfmpegExportEncodePresetId
  container: FfmpegExportContainerId
  crf: number | null
  videoBitrate: string | null
  audioMode: FfmpegExportAudioModeId
  audioBitrate: string
  fps: number | null
  scalePreset: FfmpegExportScalePresetId
  videoTransform: FfmpegExportVideoTransformId
  cropPreset: FfmpegExportCropPresetId
  /** Двухпроходный libx264; фактический запуск только при ненулевом `videoBitrate`. */
  twoPass?: boolean
}

/** §7.2 — именованный пользовательский пресет (до нескольких штук в settings). */
export interface FfmpegExportUserPreset {
  id: string
  label: string
  snapshot: FfmpegExportUserPresetSnapshot
}

export interface MediaExportRequestPayload {
  inputPath: string
  trim?: MediaExportTrimPayload
  probeDurationSec?: number | null
  /** Если не задан — в main берётся из `settings.json`. */
  encodePreset?: FfmpegExportEncodePresetId
  /** Если не задан — в main берётся из `settings.json`. */
  container?: FfmpegExportContainerId
  /** CRF libx264 0..51; если не задан — берётся из пресета/settings. */
  crf?: number | null
  /** Video bitrate (`2500k`, `8000k`); если задан — используется вместо CRF. */
  videoBitrate?: string | null
  /** `aac` — перекодировать звук, `none` — экспорт без аудиодорожки. */
  audioMode?: FfmpegExportAudioModeId | null
  /** Битрейт AAC одним токеном (`128k`, `192k`, `320k`). */
  audioBitrate?: string | null
  /** FPS вывода; null/undefined — оставить исходную частоту. */
  fps?: number | null
  /** Масштабирование с сохранением пропорций; `source` — без `scale`. */
  scalePreset?: FfmpegExportScalePresetId | null
  /** Поворот/зеркало до масштабирования и fps; `none` — без трансформа. */
  videoTransform?: FfmpegExportVideoTransformId | null
  /** Crop после поворота/зеркала и до scale/fps; только whitelist пресетов. */
  cropPreset?: FfmpegExportCropPresetId | null
  /** Двухпроходный libx264; в main отклоняется без валидного video bitrate. */
  twoPass?: boolean
}

export type MediaExportStartResult =
  | { ok: true; path: string }
  | { ok: false; cancelled: true }
  | { ok: false; error: string }

export interface FfmpegExportProgressPayload {
  /** 0..100 или −1, если по stderr ещё не удалось оценить прогресс. */
  percent: number
  message: string
  /** Множитель относительно реального времени (`1.04x`, `N/A`), из последней строки статистики со `speed=`. */
  speed?: string
}
