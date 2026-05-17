/**
 * §9 — `stream.codec_time_base` в detail, если отличается от `time_base` дорожки.
 */
import { parseFfprobeNontrivialTimeBase } from './ffprobe-stream-time-base'

export function formatFfprobeStreamCodecTimeBaseDetail(
  codecTimeBase: string | undefined,
  streamTimeBase: string | undefined
): string | null {
  const ctb = parseFfprobeNontrivialTimeBase(codecTimeBase)
  if (ctb === null) {
    return null
  }
  const stb = parseFfprobeNontrivialTimeBase(streamTimeBase)
  if (stb !== null && stb === ctb) {
    return null
  }
  return `ctb ${ctb}`
}
