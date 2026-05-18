/**
 * §16 / ТЗ §7.2.1 — порог загрузки CPU для «Рекомендовано» в бенчмарке (по умолчанию 80%).
 */

export const FFMPEG_EXPORT_BENCHMARK_LOAD_THRESHOLD_DEFAULT = 80
export const FFMPEG_EXPORT_BENCHMARK_LOAD_THRESHOLD_MIN = 10
export const FFMPEG_EXPORT_BENCHMARK_LOAD_THRESHOLD_MAX = 100

export function parseFfmpegExportBenchmarkLoadThreshold(raw: unknown): number {
  if (typeof raw !== 'number' || !Number.isFinite(raw)) {
    return FFMPEG_EXPORT_BENCHMARK_LOAD_THRESHOLD_DEFAULT
  }
  return Math.min(
    FFMPEG_EXPORT_BENCHMARK_LOAD_THRESHOLD_MAX,
    Math.max(FFMPEG_EXPORT_BENCHMARK_LOAD_THRESHOLD_MIN, Math.round(raw))
  )
}
