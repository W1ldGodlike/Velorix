import type { FfmpegExportVideoCodecId } from '../../shared/ffmpeg-export-contract'
import type { FfmpegHwEncodersProbeResult } from '../../shared/ffmpeg-hw-encoder-probe'
import { isFfmpegHwAutoVideoCodec } from '../../shared/ffmpeg-export-video-codec'
import {
  buildEditorExportCodecDetailTooltip,
  resolveEditorExportStatusbarEncoderSummary
} from './editor-export-codec-tooltip'
import type { EditorExportCodecUiText } from './editor-export-codec-ui-text'
import { resolveEditorExportCodecDisplayName } from './editor-export-codec-display-name'

export function buildEditorExportStatusbarCodecDisplay(
  params: {
    exportVideoCodec: FfmpegExportVideoCodecId
    resolvedCodec: FfmpegExportVideoCodecId
    hwEncoderProbe: FfmpegHwEncodersProbeResult | null
    exportHwDecode: boolean
    exportHwaccelDecode: string | null
  } & EditorExportCodecUiText
): { label: string; title: string; ariaLabel: string } {
  const { uiText, uiTextVars } = params
  const encoderSummary = resolveEditorExportStatusbarEncoderSummary(params.resolvedCodec, uiText)
  let label = uiTextVars('editorStatusbarProcessing', { encoder: encoderSummary })
  if (isFfmpegHwAutoVideoCodec(params.exportVideoCodec)) {
    label += ` ${uiText('editorExportCodecHwAutoBadge')}`
  }
  if (params.exportHwaccelDecode) {
    label += uiTextVars('editorStatusbarHwDecode', { method: params.exportHwaccelDecode })
  }

  const title = buildEditorExportCodecDetailTooltip(params)
  const ariaLabel = uiTextVars('editorStatusbarCodecAria', {
    processing: encoderSummary,
    codec: resolveEditorExportCodecDisplayName(params.resolvedCodec, uiText)
  })

  return { label, title, ariaLabel }
}
