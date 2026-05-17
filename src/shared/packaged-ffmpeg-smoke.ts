/**
 * §7/§19 — smoke bundled ffmpeg: пути (как ffprobe) и offline `-encoders`.
 */
export { listPackagedFfmpegCandidatePaths } from './packaged-engine-candidate-paths'

/** Ненулевой вывод `ffmpeg -hide_banner -encoders` (без сети). */
export function isMinimalFfmpegEncodersOutput(text: string): boolean {
  if (!/encoders:/i.test(text)) {
    return false
  }
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
  return lines.length >= 40
}
