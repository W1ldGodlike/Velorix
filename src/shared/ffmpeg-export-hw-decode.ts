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

/** Согласованные пары `-hwaccel` / `-hwaccel_output_format` (§16, zero-copy decode→encode). */
const HWACCEL_TO_OUTPUT_FORMAT: Readonly<Record<string, string>> = {
  cuda: 'cuda',
  vaapi: 'vaapi',
  qsv: 'qsv',
  d3d11va: 'd3d11',
  dxva2: 'd3d11'
}

export function parseFfmpegExportHwDecode(raw: unknown): boolean {
  return raw === true
}

/** Подобрать метод декодирования по кодеку кодирования и списку `ffmpeg -hwaccels`. */
export function resolveFfmpegExportHwaccelForDecode(
  vcodec: FfmpegExportVideoCodecId,
  hwaccels: readonly string[]
): string | null {
  const avail = new Set(hwaccels.map((h) => h.trim().toLowerCase()).filter((h) => h.length > 0))
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

/** `-hwaccel_output_format` для известных `-hwaccel` (не для `auto`). */
export function resolveFfmpegExportHwaccelOutputFormat(hwaccel: string | null): string | null {
  if (hwaccel === null) {
    return null
  }
  const key = hwaccel.trim().toLowerCase()
  if (key.length === 0 || key === 'auto') {
    return null
  }
  return HWACCEL_TO_OUTPUT_FORMAT[key] ?? null
}

/** Вставить `-hwaccel` (+ output format) сразу перед `-i` / trim-блоком. */
export function appendFfmpegHwaccelBeforeInput(
  args: string[],
  hwaccel: string | null,
  hwaccelOutputFormat?: string | null
): void {
  if (typeof hwaccel !== 'string' || hwaccel.trim().length === 0) {
    return
  }
  const method = hwaccel.trim()
  args.push('-hwaccel', method)
  const out =
    hwaccelOutputFormat !== undefined
      ? hwaccelOutputFormat
      : resolveFfmpegExportHwaccelOutputFormat(method)
  if (typeof out === 'string' && out.trim().length > 0) {
    args.push('-hwaccel_output_format', out.trim())
  }
}
