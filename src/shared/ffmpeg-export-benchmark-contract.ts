/**
 * §7.2.1 / §16 — бенчмарк кодеров на коротком семпле исходника.
 */

import type { AppUiLocale } from './app-ui-locale'
import type { FfmpegExportVideoCodecId } from './ffmpeg-export-contract'
import type { MediaExportRequestPayload } from './ffmpeg-export-contract'

/** Длина семпла для прогона (сек); ТЗ — до 30 с, в продукте 15 с для разумного времени ожидания. */
export const FFMPEG_EXPORT_BENCHMARK_SAMPLE_SEC = 15

/** Максимум кодеров за один прогон (CPU + HW по семействам). */
export const FFMPEG_EXPORT_BENCHMARK_MAX_CANDIDATES = 8

export type FfmpegExportBenchmarkRequestPayload = Omit<
  MediaExportRequestPayload,
  'trim' | 'probeDurationSec'
> & {
  probeDurationSec?: number | null
}

export type FfmpegExportBenchmarkRow = {
  videoCodec: FfmpegExportVideoCodecId
  ok: boolean
  elapsedMs: number | null
  avgFps: number | null
  estimatedFullSec: number | null
  outputBytes: number | null
  cpuLoadPeakPercent: number | null
  cpuLoadAvgPercent: number | null
  /** Пиковая загрузка GPU (%) через nvidia-smi, если доступен. */
  gpuLoadPeakPercent: number | null
  gpuLoadAvgPercent: number | null
  error: string | null
}

export type FfmpegExportBenchmarkResult =
  | {
      ok: true
      sampleSec: number
      fullDurationSec: number
      loadThresholdPercent: number
      recommendedCodec: FfmpegExportVideoCodecId
      onlyAvailable: boolean
      /** true, если рекомендация взята без учёта порога (все варианты выше порога). */
      recommendedIgnoredLoadThreshold: boolean
      rows: FfmpegExportBenchmarkRow[]
    }
  | { ok: false; error: string }
  | { ok: false; cancelled: true }

export type FfmpegExportBenchmarkProgressPayload = {
  index: number
  total: number
  videoCodec: FfmpegExportVideoCodecId
  message: string
}

export function parseFfmpegExportBenchmarkRequest(
  raw: unknown,
  uiLocale: AppUiLocale
): { ok: true; payload: FfmpegExportBenchmarkRequestPayload } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: uiLocale === 'ru' ? 'Некорректный запрос' : 'Invalid request' }
  }
  const inputRaw = (raw as { inputPath?: unknown }).inputPath
  if (typeof inputRaw !== 'string' || inputRaw.trim().length === 0) {
    return {
      ok: false,
      error: uiLocale === 'ru' ? 'Не указан входной файл' : 'Input file is missing'
    }
  }
  const pd = (raw as { probeDurationSec?: unknown }).probeDurationSec
  const probeDurationSec =
    typeof pd === 'number' && Number.isFinite(pd) && pd > 0 ? pd : null
  const ulocRaw = (raw as { uiLocale?: unknown }).uiLocale
  const uiLocaleParsed =
    ulocRaw === 'en' || ulocRaw === 'ru' ? ulocRaw : uiLocale
  return {
    ok: true,
    payload: {
      ...(raw as FfmpegExportBenchmarkRequestPayload),
      inputPath: inputRaw.trim(),
      uiLocale: uiLocaleParsed,
      probeDurationSec
    }
  }
}
