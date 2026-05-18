import type {
  FfmpegFramesExtractModeId,
  FfmpegFramesExtractProgressPayload,
  FfmpegFramesExtractRequestPayload,
  FfmpegFramesExtractResult
} from '../../shared/ffmpeg-frames-extract-contract'
import { parseFfmpegManualTimesText } from '../../shared/ffmpeg-frames-extract-manual-parse'
import type { FfmpegSnapshotFormatId } from '../../shared/ffmpeg-snapshot-contract'
import { getUiLocale, uiText, uiTextVars } from './locales/ui-text'

export type EditorExtractFramesUiState = {
  mode: FfmpegFramesExtractModeId
  intervalSec: string
  frameCount: string
  manualTimesText: string
}

export const DEFAULT_EDITOR_EXTRACT_FRAMES_UI: EditorExtractFramesUiState = {
  mode: 'interval',
  intervalSec: '2',
  frameCount: '12',
  manualTimesText: '0'
}

export function buildEditorExtractFramesPayload(params: {
  inputPath: string
  durationSec: number
  format: FfmpegSnapshotFormatId
  ui: EditorExtractFramesUiState
}): FfmpegFramesExtractRequestPayload | null {
  const interval =
    params.ui.mode === 'interval'
      ? Number.parseFloat(params.ui.intervalSec.replace(',', '.'))
      : null
  const count =
    params.ui.mode === 'count' ? Number.parseInt(params.ui.frameCount, 10) : null
  let manualTimesSec: number[] | null = null
  if (params.ui.mode === 'manual') {
    const times = parseFfmpegManualTimesText(params.ui.manualTimesText)
    if (times.length === 0) {
      return null
    }
    manualTimesSec = times
  }
  return {
    inputPath: params.inputPath,
    durationSec: params.durationSec,
    mode: params.ui.mode,
    intervalSec: Number.isFinite(interval) ? interval : null,
    frameCount: Number.isFinite(count) ? count : null,
    manualTimesSec,
    format: params.format,
    uiLocale: getUiLocale()
  }
}

export async function runEditorExtractFrames(params: {
  payload: FfmpegFramesExtractRequestPayload
  onProgress: (p: FfmpegFramesExtractProgressPayload) => void
  setStatusHint: (hint: string | null) => void
}): Promise<{ ok: true } | { ok: false; cancelled?: boolean }> {
  const off = window.fluxalloy.export.onExtractFramesProgress(params.onProgress)
  try {
    const res: FfmpegFramesExtractResult = await window.fluxalloy.export.extractFrames(
      params.payload
    )
    if (res.ok) {
      params.setStatusHint(
        uiTextVars('editorExtractFramesDone', {
          saved: String(res.saved),
          failed: String(res.failed),
          dir: res.outputDir
        })
      )
      return { ok: true }
    }
    if ('cancelled' in res && res.cancelled) {
      params.setStatusHint(null)
      return { ok: false, cancelled: true }
    }
    if ('error' in res) {
      params.setStatusHint(res.error)
    }
    return { ok: false }
  } finally {
    off()
  }
}

export function editorExtractFramesInvalidManualHint(): string {
  return uiText('editorExtractFramesInvalidManual')
}
