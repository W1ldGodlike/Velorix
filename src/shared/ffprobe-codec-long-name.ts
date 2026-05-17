/**
 * §9 — `stream.codec_long_name` в компактной строке detail (без дубля `codec_name`).
 */

export function formatFfprobeCodecLongNameDetail(
  codecName: string | undefined,
  codecLongName: string | undefined
): string | null {
  const long = typeof codecLongName === 'string' ? codecLongName.trim() : ''
  if (long.length === 0) {
    return null
  }
  const short = typeof codecName === 'string' ? codecName.trim() : ''
  if (short.length === 0) {
    return long
  }
  const longNorm = long.toLowerCase()
  const shortNorm = short.toLowerCase()
  if (longNorm === shortNorm) {
    return null
  }
  if (longNorm.includes(shortNorm) && long.length <= short.length + 2) {
    return null
  }
  return long
}
