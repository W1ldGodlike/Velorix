import type { MediaProbeSuccess } from '../../../shared/ffprobe-contract'

import { formatMediaProbeSummary } from './format-media-probe-summary'
import type { ShellMediaSource } from '../stores/shell-media-source'

type RestoreLastMediaSessionDeps = {
  hasMedia: boolean
  setMediaSource: (source: ShellMediaSource | null) => void
  setMediaProbe?: (probe: MediaProbeSuccess | null) => void
}

/** §4.1 — мягкое восстановление `lastOpenedSourcePath` при старте ref.1. */
export async function restoreLastMediaSession(deps: RestoreLastMediaSessionDeps): Promise<void> {
  if (deps.hasMedia) {
    return
  }
  const restore = window.velorix?.session?.restoreLastSource
  if (restore == null) {
    return
  }
  const info = await restore()
  if (info == null) {
    return
  }
  let probeSummary: string | undefined
  const probe = window.velorix?.preview?.probe
  if (probe != null) {
    const probeResult = await probe(info.path)
    if (probeResult.ok) {
      probeSummary = formatMediaProbeSummary(probeResult)
      deps.setMediaProbe?.(probeResult)
    } else {
      deps.setMediaProbe?.(null)
    }
  }
  deps.setMediaSource({
    path: info.path,
    name: info.name,
    mediaUrl: info.mediaUrl,
    ...(probeSummary != null ? { probeSummary } : {})
  })
}
