import type { MediaProbeSuccess } from '../../../shared/ffprobe-contract'
import { formatMediaProbeSummary } from './format-media-probe-summary'
import { openPreviewMediaDialog } from './open-preview-media'
import type { SystemModalId } from '../app/system-modal'
import type { ShellMediaSource } from '../stores/shell-media-source'

type ApplyOpenMediaPickDeps = {
  setMediaSource: (source: ShellMediaSource | null) => void
  setMediaProbe?: (probe: MediaProbeSuccess | null) => void
  openModal: (id: SystemModalId) => void
}

/** Диалог видео + ffprobe summary для ref.1 превью. */
export async function applyOpenMediaPick(deps: ApplyOpenMediaPickDeps): Promise<boolean> {
  const result = await openPreviewMediaDialog()
  if (!result.ok) {
    if (!('canceled' in result && result.canceled)) {
      deps.openModal('ffmpeg-error')
    }
    return false
  }
  let probeSummary: string | undefined
  const probe = window.velorix?.preview?.probe
  if (probe != null) {
    const probeResult = await probe(result.path)
    if (probeResult.ok) {
      probeSummary = formatMediaProbeSummary(probeResult)
      deps.setMediaProbe?.(probeResult)
    } else {
      deps.setMediaProbe?.(null)
    }
  }
  deps.setMediaSource({
    path: result.path,
    name: result.name,
    mediaUrl: result.mediaUrl,
    ...(probeSummary != null ? { probeSummary } : {})
  })
  return true
}
