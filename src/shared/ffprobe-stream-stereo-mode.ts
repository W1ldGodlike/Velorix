/**
 * §9 — `stream.tags.stereo_mode` (3D/стерео разметка кадра) в detail видеодорожки.
 */

export function formatFfprobeStreamStereoModeDetail(
  tags: Record<string, string | number | undefined> | undefined
): string | null {
  const raw = tags?.['stereo_mode']
  const v =
    typeof raw === 'number' && Number.isFinite(raw)
      ? String(Math.trunc(raw))
      : typeof raw === 'string'
        ? raw.trim()
        : ''
  if (v.length === 0 || /^n\/a$/i.test(v) || v === '0') {
    return null
  }
  return `stereo ${v}`
}
