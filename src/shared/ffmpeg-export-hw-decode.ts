/**
 * §7.2 — выбор `-hwaccel` для декодирования исходника при экспорте.
 */

import type { FfmpegExportVideoCodecId } from './ffmpeg-export-contract'
import { isFfmpegHwExportVideoCodec } from './ffmpeg-export-video-codec'

const ENCODER_HWACCEL: ReadonlyArray<readonly [suffix: string, method: string]> = [
  ['_nvenc', 'cuda'],
  ['_qsv', 'qsv'],
  ['_vaapi', 'vaapi'],
  ['_amf', 'd3d11va'],
  ['_videotoolbox', 'videotoolbox']
]

const FALLBACK_HWACCEL = ['cuda', 'd3d11va', 'dxva2', 'qsv', 'vaapi', 'videotoolbox'] as const

export function parseFfmpegExportHwDecode(raw: unknown): boolean {
  return raw === true
}

/** Подобрать метод декодирования по кодеку кодирования и списку `ffmpeg -hwaccels`. */
export function resolveFfmpegExportHwaccelForDecode(
  vcodec: FfmpegExportVideoCodecId,
  hwaccels: readonly string[]
): string | null {
  const avail = new Set(
    hwaccels.map((h) => h.trim().toLowerCase()).filter((h) => h.length > 0)
  )
  if (avail.size === 0) {
    return null
  }
  if (isFfmpegHwExportVideoCodec(vcodec)) {
    for (const [suffix, method] of ENCODER_HWACCEL) {
      if (vcodec.endsWith(suffix) && avail.has(method)) {
        return method
      }
    }
  }
  if (avail.has('auto')) {
    return 'auto'
  }
  for (const m of FALLBACK_HWACCEL) {
    if (avail.has(m)) {
      return m
    }
  }
  return null
}

/** Вставить `-hwaccel` сразу перед `-i` / trim-блоком. */
export function appendFfmpegHwaccelBeforeInput(args: string[], hwaccel: string | null): void {
  if (typeof hwaccel === 'string' && hwaccel.trim().length > 0) {
    args.push('-hwaccel', hwaccel.trim())
  }
}
