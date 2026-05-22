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

/** §18/§19 Support ZIP — подсказки smoke:packaged-ffmpeg без запуска exe. */
export function formatPackagedFfmpegSmokeDiagnosticLines(): string[] {
  return [
    'command: npm run smoke:packaged-ffmpeg (part of smoke:packaged-engines)',
    'check: ffmpeg -hide_banner -encoders offline (isMinimalFfmpegEncodersOutput)',
    'check: §7.5 video sprite -vf guard (packaged-video-sprite-smoke)',
    'env: VELORIX_FFMPEG_PATH, VELORIX_SKIP_FFMPEG_SMOKE',
    'dev quiet: npm run check:quiet includes check:terminal-summaries-ru (§8 terminal RU summaries 0/0)'
  ]
}
