import type { ExternalFilterScriptKind } from './external-filter-script-contract'

/** Экранирование абсолютного пути для вставки в `-vf` (Windows drive colon). */
export function escapeFfmpegFilterGraphPath(absPath: string): string {
  return absPath.replace(/\\/g, '/').replace(/:/g, '\\:')
}

export function buildFfmpegExternalScriptVideoFilter(
  kind: ExternalFilterScriptKind,
  absScriptPath: string
): string | null {
  if (kind === 'off' || absScriptPath.trim().length === 0) {
    return null
  }
  const escaped = escapeFfmpegFilterGraphPath(absScriptPath.trim())
  if (kind === 'vapoursynth') {
    return `vapoursynth=filename='${escaped}'`
  }
  if (kind === 'avisynth') {
    return `avisynth=filename='${escaped}'`
  }
  return null
}
