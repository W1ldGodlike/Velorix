import type { PreviewDialogResult } from '../../../shared/preview-dialog-contract'

type PreviewOpenedPayload = Extract<PreviewDialogResult, { ok: true }>
import type { MediaProbeSuccess } from '../../../shared/ffprobe-contract'

import { formatMediaProbeSummary } from './format-media-probe-summary'
import type { ShellMediaSource } from '../stores/shell-media-source'

/** Main menu / drag-open → ref.1 превью (§4.B `onPreviewOpened`). */
export async function applyPreviewOpenedPayload(
  payload: PreviewOpenedPayload,
  deps: {
    setMediaSource: (source: ShellMediaSource | null) => void
    setMediaProbe?: (probe: MediaProbeSuccess | null) => void
  }
): Promise<void> {
  let probeSummary: string | undefined
  const probe = window.velorix?.preview?.probe
  if (probe != null) {
    const probeResult = await probe(payload.path)
    if (probeResult.ok) {
      probeSummary = formatMediaProbeSummary(probeResult)
      deps.setMediaProbe?.(probeResult)
    } else {
      deps.setMediaProbe?.(null)
    }
  }
  deps.setMediaSource({
    path: payload.path,
    name: payload.name,
    mediaUrl: payload.mediaUrl,
    ...(probeSummary != null ? { probeSummary } : {})
  })
  const persist = window.velorix?.session?.persistLastSource
  if (persist != null) {
    await persist(payload.path)
  }
}
