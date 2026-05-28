import type { JSX } from 'react'

import type { MediaProbeSuccess } from '../../../shared/ffprobe-contract'

import { formatMediaClock } from '../lib/format-media-clock'
import { useAppShellStore } from '../stores/app-shell-store'

function formatPreviewResolution(probe: MediaProbeSuccess | null): string {
  if (probe == null) {
    return '—'
  }
  const video = probe.video
  if (video == null) {
    return '—'
  }
  const fps =
    probe.videoFpsApprox != null && Number.isFinite(probe.videoFpsApprox)
      ? ` · ${probe.videoFpsApprox.toFixed(0)} fps`
      : ''
  return `${String(video.width)}×${String(video.height)}${fps}`
}

/** Нижняя строка shell: имя открытого медиа и параметры превью из ffprobe. */
export function NeonShellStatusbar(): JSX.Element {
  const mediaSource = useAppShellStore((s) => s.mediaSource)
  const mediaProbe = useAppShellStore((s) => s.mediaProbe)
  const previewPlayheadSec = useAppShellStore((s) => s.previewPlayheadSec)
  const exportTrim = useAppShellStore((s) => s.exportTrim)
  const openModal = useAppShellStore((s) => s.openModal)

  const projectLabel = mediaSource?.name ?? 'Медиа не открыто'
  const durationClock =
    mediaProbe?.durationSec != null && Number.isFinite(mediaProbe.durationSec)
      ? formatMediaClock(mediaProbe.durationSec)
      : '—'
  const timeLabel =
    mediaSource != null &&
    previewPlayheadSec != null &&
    Number.isFinite(previewPlayheadSec) &&
    durationClock !== '—'
      ? `${formatMediaClock(previewPlayheadSec)} / ${durationClock}`
      : durationClock
  const trimLabel =
    exportTrim != null
      ? `${formatMediaClock(exportTrim.inSec)}–${formatMediaClock(exportTrim.outSec)}`
      : null

  return (
    <footer className="neon-shell__status">
      <span className="neon-shell__status-project">{projectLabel}</span>
      <span>{timeLabel}</span>
      {trimLabel != null ? <span>Trim {trimLabel}</span> : null}
      <span>{formatPreviewResolution(mediaProbe)}</span>
      <span className="app-ui-showcase-status-pill app-ui-showcase-status-pill--ready">
        {mediaSource != null ? 'Медиа' : 'Пусто'}
      </span>
      <button
        type="button"
        className="app-btn app-btn-secondary neon-shell__about-btn"
        onClick={() => openModal('about')}
      >
        О программе
      </button>
    </footer>
  )
}
