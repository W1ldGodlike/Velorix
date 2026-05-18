/**
 * §9/§18/§19 — packaged ffprobe smoke (split modules).
 */
export function isMinimalFfprobeProbeJson(parsed: unknown): boolean {
  if (parsed === null || typeof parsed !== 'object') {
    return false
  }
  const o = parsed as Record<string, unknown>
  const streams = o['streams']
  if (!Array.isArray(streams) || streams.length < 1) {
    return false
  }
  const format = o['format']
  if (format === null || typeof format !== 'object') {
    return false
  }
  return true
}
