import type { FfmpegExportEncodePresetId } from './ffmpeg-export-contract'
import type { FfmpegHwVideoEncoderId } from './ffmpeg-hw-encoder-probe'

export function resolveFfmpegExportEncodeParams(preset: FfmpegExportEncodePresetId): {
  crf: string
  x264preset: string
} {
  switch (preset) {
    case 'smaller':
      return { crf: '28', x264preset: 'fast' }
    case 'quality':
      return { crf: '18', x264preset: 'medium' }
    default:
      return { crf: '23', x264preset: 'fast' }
  }
}

/** §16 — rate control для whitelist HW-кодеков (без произвольных `-c:v`). */
export function appendFfmpegHwEncoderRateArgs(
  args: string[],
  vcodec: FfmpegHwVideoEncoderId,
  encodePreset: FfmpegExportEncodePresetId,
  crf: string,
  videoBitrate: string | null
): void {
  const cq = (() => {
    const n = parseInt(crf, 10)
    return Number.isFinite(n) ? Math.min(51, Math.max(0, n)) : 23
  })()
  const nvLikePreset =
    encodePreset === 'smaller' ? 'fast' : encodePreset === 'quality' ? 'slow' : 'medium'

  if (vcodec.endsWith('_nvenc')) {
    args.push('-preset', nvLikePreset, '-rc:v', 'vbr')
    if (videoBitrate === null) {
      args.push('-cq:v', String(cq))
    } else {
      args.push('-b:v', videoBitrate)
    }
    return
  }
  if (vcodec.endsWith('_amf')) {
    const q =
      encodePreset === 'smaller' ? 'speed' : encodePreset === 'quality' ? 'quality' : 'balanced'
    args.push('-quality', q)
    if (videoBitrate === null) {
      args.push('-rc', 'cqp', '-qp_i', String(cq), '-qp_p', String(cq), '-qp_b', String(cq))
    } else {
      args.push('-rc', 'vbr_peak', '-b:v', videoBitrate)
    }
    return
  }
  if (vcodec.endsWith('_qsv')) {
    const p =
      encodePreset === 'smaller' ? 'veryfast' : encodePreset === 'quality' ? 'slow' : 'faster'
    args.push('-preset', p)
    if (videoBitrate === null) {
      args.push('-global_quality', String(cq))
    } else {
      args.push('-b:v', videoBitrate)
    }
    return
  }
  if (vcodec.endsWith('_videotoolbox')) {
    const qv = Math.min(100, Math.max(8, Math.round(72 - cq * 0.85)))
    if (videoBitrate === null) {
      args.push('-q:v', String(qv))
    } else {
      args.push('-b:v', videoBitrate)
    }
    return
  }
  if (vcodec.endsWith('_vaapi')) {
    if (videoBitrate === null) {
      args.push('-qp', String(cq))
    } else {
      args.push('-b:v', videoBitrate)
    }
  }
}
