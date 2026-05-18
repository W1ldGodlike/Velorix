import type { FfmpegExportVideoCodecId } from '../../shared/ffmpeg-export-contract'
import {
  FFMPEG_HW_ENCODER_FAMILY_HINT_UI_KEYS,
  getFfmpegHwEncoderFamily,
  type FfmpegHwEncoderFamily
} from '../../shared/ffmpeg-export-hw-codec-ui'
import {
  FFMPEG_HW_VIDEO_ENCODER_IDS,
  type FfmpegHwEncodersProbeResult,
  type FfmpegHwVideoEncoderId
} from '../../shared/ffmpeg-hw-encoder-probe'
import {
  isFfmpegHwAutoVideoCodec,
  isFfmpegHwExportVideoCodec
} from '../../shared/ffmpeg-export-video-codec'
import { formatEditorExportHwCodecHint } from './editor-export-hw-codec-hint'
import type { EditorExportCodecUiText } from './editor-export-codec-ui-text'
import { resolveEditorExportCodecDisplayName } from './editor-export-codec-display-name'

export type { EditorExportCodecUiText } from './editor-export-codec-ui-text'

const FAMILY_PROCESSING_UI_KEYS: Record<FfmpegHwEncoderFamily, string> = {
  nvenc: 'editorStatusbarProcessingNvenc',
  amf: 'editorStatusbarProcessingAmf',
  qsv: 'editorStatusbarProcessingQsv',
  vaapi: 'editorStatusbarProcessingVaapi',
  videotoolbox: 'editorStatusbarProcessingVtb'
}

/** Краткое имя кодировщика для строки статусбара (§4.C ТЗ). */
export function resolveEditorExportStatusbarEncoderSummary(
  resolvedCodec: FfmpegExportVideoCodecId,
  uiText: (key: string) => string
): string {
  if (isFfmpegHwExportVideoCodec(resolvedCodec)) {
    const family = getFfmpegHwEncoderFamily(resolvedCodec)
    return uiText(FAMILY_PROCESSING_UI_KEYS[family])
  }
  return uiText('editorStatusbarProcessingCpu')
}

/** Детальный tooltip кодека/GPU для статусбара и поля «Видеокодек». */
export function buildEditorExportCodecDetailTooltip(
  params: {
    exportVideoCodec: FfmpegExportVideoCodecId
    resolvedCodec: FfmpegExportVideoCodecId
    hwEncoderProbe: FfmpegHwEncodersProbeResult | null
    exportHwDecode: boolean
    exportHwaccelDecode: string | null
  } & EditorExportCodecUiText
): string {
  const { uiText, uiTextVars } = params
  const displayCodec = resolveEditorExportCodecDisplayName(params.resolvedCodec, uiText)
  const titleParts: string[] = []

  if (isFfmpegHwAutoVideoCodec(params.exportVideoCodec)) {
    titleParts.push(
      uiText(
        params.exportVideoCodec === 'hw_auto_hevc'
          ? 'editorExportCodecHwAutoHevcBadgeTitle'
          : 'editorExportCodecHwAutoBadgeTitle'
      )
    )
  }

  titleParts.push(uiTextVars('editorStatusbarTitleSelectedCodec', { codec: displayCodec }))

  if (isFfmpegHwExportVideoCodec(params.resolvedCodec)) {
    const family = getFfmpegHwEncoderFamily(params.resolvedCodec)
    titleParts.push(uiText(FFMPEG_HW_ENCODER_FAMILY_HINT_UI_KEYS[family]))
  } else {
    titleParts.push(uiTextVars('editorStatusbarTitleCpu', { codec: displayCodec }))
  }

  const hwChainHint = formatEditorExportHwCodecHint(
    params.exportVideoCodec,
    params.hwEncoderProbe,
    params.exportHwDecode,
    params
  )
  if (hwChainHint !== null) {
    titleParts.push(hwChainHint)
  }

  if (params.hwEncoderProbe?.ok === true) {
    const probe = params.hwEncoderProbe
    if (probe.nvidiaGpu) {
      titleParts.push(
        uiTextVars('editorStatusbarTitleGpu', {
          name: probe.nvidiaGpu.name,
          driver: probe.nvidiaGpu.driverVersion
        })
      )
    }
    const hasNvenc = FFMPEG_HW_VIDEO_ENCODER_IDS.some(
      (id) => id.endsWith('_nvenc') && probe.snapshot[id]
    )
    if (
      hasNvenc &&
      (params.resolvedCodec.endsWith('_nvenc') || isFfmpegHwAutoVideoCodec(params.exportVideoCodec))
    ) {
      titleParts.push(uiText('editorStatusbarTitleNvencSessions'))
    }
    const available = FFMPEG_HW_VIDEO_ENCODER_IDS.filter((id) => probe.snapshot[id])
    if (available.length > 0) {
      const names = available.map((id) =>
        resolveEditorExportCodecDisplayName(id as FfmpegHwVideoEncoderId, uiText)
      )
      titleParts.push(uiTextVars('editorStatusbarTitleHwEncoders', { list: names.join(', ') }))
    }
    if (probe.hwaccels.length > 0) {
      titleParts.push(
        uiTextVars('editorStatusbarTitleHwaccels', {
          list: probe.hwaccels.join(', ')
        })
      )
    }
  } else if (params.hwEncoderProbe?.ok === false) {
    titleParts.push(
      uiTextVars('editorStatusbarTitleProbeFailed', { error: params.hwEncoderProbe.error })
    )
  }

  if (params.exportHwaccelDecode) {
    titleParts.push(
      uiTextVars('editorStatusbarTitleActiveHwDecode', { method: params.exportHwaccelDecode })
    )
  }

  return titleParts.join('\n\n')
}
