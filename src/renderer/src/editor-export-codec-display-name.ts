import type { FfmpegExportVideoCodecId } from '../../shared/ffmpeg-export-contract'
import { FFMPEG_HW_ENCODER_LABEL_UI_KEYS } from '../../shared/ffmpeg-export-hw-codec-ui'
import { isFfmpegHwExportVideoCodec } from '../../shared/ffmpeg-export-video-codec'

const CPU_CODEC_LABEL_KEYS: Partial<Record<FfmpegExportVideoCodecId, string>> = {
  libx264: 'editorExportCodecH264',
  libx265: 'editorExportCodecH265',
  'libvpx-vp9': 'editorExportCodecVp9',
  libsvtav1: 'editorExportCodecSvtav1',
  'libaom-av1': 'editorExportCodecAomav1',
  librav1e: 'editorExportCodecLibrav1e',
  prores_ks: 'editorExportCodecProresKs',
  dnxhd: 'editorExportCodecDnxhd',
  ffv1: 'editorExportCodecFfv1',
  hw_auto: 'editorExportCodecHwAuto',
  hw_auto_hevc: 'editorExportCodecHwAutoHevc'
}

export function resolveEditorExportCodecDisplayName(
  codec: FfmpegExportVideoCodecId,
  uiText: (key: string) => string
): string {
  if (isFfmpegHwExportVideoCodec(codec)) {
    return uiText(FFMPEG_HW_ENCODER_LABEL_UI_KEYS[codec])
  }
  const key = CPU_CODEC_LABEL_KEYS[codec]
  if (key) {
    return uiText(key)
  }
  return codec
}
