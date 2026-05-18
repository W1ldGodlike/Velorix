/** Поиск потока обложки в ffprobe `streams[]` (§17). */

function dispositionFlagOn(disposition: unknown, key: string): boolean {
  if (!disposition || typeof disposition !== 'object') {
    return false
  }
  const v = (disposition as Record<string, unknown>)[key]
  if (typeof v === 'boolean') {
    return v
  }
  if (typeof v === 'number') {
    return v !== 0 && Number.isFinite(v)
  }
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number.parseInt(v.trim(), 10)
    return n !== 0 && Number.isFinite(n)
  }
  return false
}

function parseStreamIndex(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0) {
    return Math.trunc(raw)
  }
  if (typeof raw === 'string' && raw.trim() !== '') {
    const n = Number.parseInt(raw.trim(), 10)
    return Number.isFinite(n) && n >= 0 ? n : null
  }
  return null
}

function isEmbeddedImageCodec(codecName: unknown): boolean {
  if (typeof codecName !== 'string') {
    return false
  }
  const c = codecName.trim().toLowerCase()
  return c === 'mjpeg' || c === 'png' || c === 'apng' || c === 'bmp' || c === 'gif'
}

type StreamLike = {
  index?: unknown
  codec_type?: unknown
  codec_name?: unknown
  disposition?: unknown
}

/** Индекс потока для `-map 0:N` или `null`, если обложки нет. */
export function resolveFfprobeCoverStreamIndex(streams: unknown): number | null {
  if (!Array.isArray(streams)) {
    return null
  }
  const list = streams.filter((s): s is StreamLike => s !== null && typeof s === 'object')

  for (const s of list) {
    if (
      dispositionFlagOn(s.disposition, 'attached_pic') ||
      dispositionFlagOn(s.disposition, 'still_image')
    ) {
      const idx = parseStreamIndex(s.index)
      if (idx !== null) {
        return idx
      }
    }
  }

  const hasNonImageVideo = list.some(
    (s) => s.codec_type === 'video' && !isEmbeddedImageCodec(s.codec_name)
  )
  const imageVideos = list.filter(
    (s) => s.codec_type === 'video' && isEmbeddedImageCodec(s.codec_name)
  )
  if (!hasNonImageVideo && imageVideos.length === 1) {
    return parseStreamIndex(imageVideos[0]?.index)
  }

  return null
}
