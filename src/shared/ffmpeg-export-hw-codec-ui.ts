/**
 * §16 — подписи и метаданные HW-кодеков для ручного выбора (ключи ui-text + цепочка decode/upload).
 */

import type { FfmpegExportVideoCodecId } from './ffmpeg-export-contract'
import {
  ffmpegExportVideoCodecNeedsHwUploadFilter,
  resolveFfmpegHwUploadFilterChain
} from './ffmpeg-export-vaapi-vf'
import { resolveFfmpegExportHwaccelForDecode } from './ffmpeg-export-hw-decode'
import {
  FFMPEG_HW_VIDEO_ENCODER_IDS,
  type FfmpegHwVideoEncoderId
} from './ffmpeg-hw-encoder-probe'
import { isFfmpegHwExportVideoCodec } from './ffmpeg-export-video-codec'

export type FfmpegHwEncoderFamily = 'nvenc' | 'amf' | 'qsv' | 'vaapi' | 'videotoolbox'

/** Ключи `ui-text` для подписи в списке (ru/en в ui-text-strings-*-05). */
export const FFMPEG_HW_ENCODER_LABEL_UI_KEYS = {
  h264_nvenc: 'editorExportCodecHwH264Nvenc',
  hevc_nvenc: 'editorExportCodecHwHevcNvenc',
  av1_nvenc: 'editorExportCodecHwAv1Nvenc',
  h264_amf: 'editorExportCodecHwH264Amf',
  hevc_amf: 'editorExportCodecHwHevcAmf',
  av1_amf: 'editorExportCodecHwAv1Amf',
  h264_qsv: 'editorExportCodecHwH264Qsv',
  hevc_qsv: 'editorExportCodecHwHevcQsv',
  av1_qsv: 'editorExportCodecHwAv1Qsv',
  h264_videotoolbox: 'editorExportCodecHwH264Vtb',
  hevc_videotoolbox: 'editorExportCodecHwHevcVtb',
  h264_vaapi: 'editorExportCodecHwH264Vaapi',
  hevc_vaapi: 'editorExportCodecHwHevcVaapi',
  av1_vaapi: 'editorExportCodecHwAv1Vaapi'
} as const satisfies Record<FfmpegHwVideoEncoderId, string>

/** Ключи ui-text — краткая справка по семейству кодера. */
export const FFMPEG_HW_ENCODER_FAMILY_HINT_UI_KEYS = {
  nvenc: 'editorExportCodecHintNvenc',
  amf: 'editorExportCodecHintAmf',
  qsv: 'editorExportCodecHintQsv',
  vaapi: 'editorExportCodecHintVaapi',
  videotoolbox: 'editorExportCodecHintVideotoolbox'
} as const satisfies Record<FfmpegHwEncoderFamily, string>

export function getFfmpegHwEncoderFamily(id: FfmpegHwVideoEncoderId): FfmpegHwEncoderFamily {
  if (id.endsWith('_nvenc')) {
    return 'nvenc'
  }
  if (id.endsWith('_amf')) {
    return 'amf'
  }
  if (id.endsWith('_qsv')) {
    return 'qsv'
  }
  if (id.endsWith('_vaapi')) {
    return 'vaapi'
  }
  return 'videotoolbox'
}

export type FfmpegHwEncoderChainSnapshot = {
  resolvedCodec: FfmpegExportVideoCodecId
  decodeHwaccel: string | null
  uploadFilter: string | null
  family: FfmpegHwEncoderFamily | null
  familyHintKey: string | null
  labelKey: string | null
}

export function buildFfmpegHwEncoderChainSnapshot(
  resolvedCodec: FfmpegExportVideoCodecId,
  hwaccels: readonly string[],
  hwDecodeEnabled: boolean
): FfmpegHwEncoderChainSnapshot | null {
  if (!isFfmpegHwExportVideoCodec(resolvedCodec)) {
    return null
  }
  const family = getFfmpegHwEncoderFamily(resolvedCodec)
  return {
    resolvedCodec,
    decodeHwaccel: hwDecodeEnabled
      ? resolveFfmpegExportHwaccelForDecode(resolvedCodec, hwaccels)
      : null,
    uploadFilter: ffmpegExportVideoCodecNeedsHwUploadFilter(resolvedCodec)
      ? resolveFfmpegHwUploadFilterChain(resolvedCodec)
      : null,
    family,
    familyHintKey: FFMPEG_HW_ENCODER_FAMILY_HINT_UI_KEYS[family],
    labelKey: FFMPEG_HW_ENCODER_LABEL_UI_KEYS[resolvedCodec]
  }
}

/** Порядок HW-кодеков в списке (как приоритет hw_auto). */
export const FFMPEG_HW_VIDEO_ENCODER_SELECT_ORDER: readonly FfmpegHwVideoEncoderId[] =
  FFMPEG_HW_VIDEO_ENCODER_IDS
