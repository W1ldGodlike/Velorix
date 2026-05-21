import type { FfmpegExportVideoCodecId } from '../../shared/ffmpeg-export-contract'
import {
  buildFfmpegHwEncoderChainSnapshot,
  type FfmpegHwEncoderChainSnapshot
} from '../../shared/ffmpeg-export-hw-codec-ui'
import {
  isFfmpegHwAutoVideoCodec,
  isFfmpegHwExportVideoCodec,
  probeRunnableHwSnapshot,
  resolveFfmpegExportVideoCodecForArgv
} from '../../shared/ffmpeg-export-video-codec'
import type { FfmpegHwEncodersProbeResult } from '../../shared/ffmpeg-hw-encoder-probe'
import type { EditorExportCodecUiText } from './editor-export-codec-ui-text'

function formatChainLines(
  snap: FfmpegHwEncoderChainSnapshot,
  hwDecodeEnabled: boolean,
  ui: EditorExportCodecUiText
): string[] {
  const { uiText, uiTextVars } = ui
  const lines: string[] = []
  if (hwDecodeEnabled) {
    if (snap.decodeHwaccel) {
      lines.push(uiTextVars('editorExportHwChainDecodeOn', { method: snap.decodeHwaccel }))
    } else {
      lines.push(uiText('editorExportHwChainDecodeUnavailable'))
    }
  } else {
    lines.push(uiText('editorExportHwChainDecodeOff'))
  }
  if (snap.uploadFilter) {
    lines.push(uiTextVars('editorExportHwChainUpload', { filter: snap.uploadFilter }))
  } else if (snap.family === 'nvenc') {
    lines.push(uiText('editorExportHwChainUploadNvencNote'))
  }
  return lines
}

/** Подсказка под полем «Видеокодек» для HW / hw_auto (null — CPU-only выбор). */
export function formatEditorExportHwCodecHint(
  exportVideoCodec: FfmpegExportVideoCodecId,
  hwEncoderProbe: FfmpegHwEncodersProbeResult | null,
  exportHwDecode: boolean,
  ui: EditorExportCodecUiText
): string | null {
  const { uiText, uiTextVars } = ui
  const hwaccels = hwEncoderProbe?.ok === true ? hwEncoderProbe.hwaccels : []
  const snapProbe = probeRunnableHwSnapshot(hwEncoderProbe)
  const resolved = resolveFfmpegExportVideoCodecForArgv(exportVideoCodec, snapProbe)

  if (
    !isFfmpegHwAutoVideoCodec(exportVideoCodec) &&
    !isFfmpegHwExportVideoCodec(exportVideoCodec)
  ) {
    return null
  }

  const chain = buildFfmpegHwEncoderChainSnapshot(resolved, hwaccels, exportHwDecode)
  if (chain === null) {
    return null
  }

  const parts: string[] = []
  if (isFfmpegHwAutoVideoCodec(exportVideoCodec)) {
    parts.push(uiTextVars('editorExportHwChainResolved', { codec: resolved }))
  }
  if (chain.familyHintKey) {
    parts.push(uiText(chain.familyHintKey))
  }
  parts.push(...formatChainLines(chain, exportHwDecode, ui))
  return parts.join('\n')
}
