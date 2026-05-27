import { useRef, useState, type JSX } from 'react'

import { formatMediaClock } from '../../lib/format-media-clock'
import type { ShellMediaSource } from '../../stores/shell-media-source'

type ProcessingPreviewPanelProps = {
  mediaSource: ShellMediaSource | null
  durationSec: number | null
}

export function ProcessingPreviewPanel(props: ProcessingPreviewPanelProps): JSX.Element {
  const { mediaSource, durationSec } = props
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentSec, setCurrentSec] = useState(0)
  const [duration, setDuration] = useState(durationSec ?? 0)
  const [playing, setPlaying] = useState(false)

  const seekMax = duration > 0 ? duration : 1
  const seekPercent = duration > 0 ? Math.min(100, (currentSec / duration) * 100) : 0

  function seekTo(sec: number): void {
    const video = videoRef.current
    if (video == null) {
      return
    }
    const next = Math.min(Math.max(0, sec), duration > 0 ? duration : video.duration || 0)
    video.currentTime = next
    setCurrentSec(next)
  }

  async function togglePlay(): Promise<void> {
    const video = videoRef.current
    if (video == null) {
      return
    }
    if (video.paused) {
      await video.play()
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  if (mediaSource == null) {
    return (
      <>
        <div className="processing-screen__preview vn-surface-glass">
          <span className="processing-screen__preview-badge">4K · 60fps</span>
          <span className="processing-screen__preview-hint">Превью · откройте медиа</span>
        </div>
        <div className="processing-screen__transport processing-screen__transport--disabled">
          <span className="app-ui-showcase-status-pill app-ui-showcase-status-pill--info">
            — / —
          </span>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="processing-screen__preview vn-surface-glass">
        <video
          ref={videoRef}
          className="processing-screen__video"
          src={mediaSource.mediaUrl}
          preload="metadata"
          onLoadedMetadata={() => {
            const video = videoRef.current
            if (video != null && Number.isFinite(video.duration) && video.duration > 0) {
              setDuration(video.duration)
            }
          }}
          onTimeUpdate={() => {
            const video = videoRef.current
            if (video != null) {
              setCurrentSec(video.currentTime)
            }
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
        {mediaSource.probeSummary != null ? (
          <span className="processing-screen__preview-badge">{mediaSource.probeSummary}</span>
        ) : null}
        <span className="processing-screen__preview-hint">{mediaSource.name}</span>
      </div>
      <div className="processing-screen__transport">
        <button
          type="button"
          className="app-ui-showcase-icon-btn"
          aria-label="В начало"
          onClick={() => seekTo(0)}
        >
          ⏮
        </button>
        <button
          type="button"
          className="app-ui-showcase-icon-btn app-ui-showcase-icon-btn--primary"
          aria-label={playing ? 'Пауза' : 'Воспроизведение'}
          onClick={() => void togglePlay()}
        >
          {playing ? '❚❚' : '▶'}
        </button>
        <button
          type="button"
          className="app-ui-showcase-icon-btn"
          aria-label="Вперёд 5 с"
          onClick={() => seekTo(currentSec + 5)}
        >
          ⏭
        </button>
        <span className="app-ui-showcase-status-pill app-ui-showcase-status-pill--info">
          {formatMediaClock(currentSec)} / {formatMediaClock(duration)}
        </span>
        <input
          type="range"
          className="app-ui-showcase-range vn-progress-neon processing-screen__seek"
          value={seekPercent}
          min={0}
          max={100}
          step={0.1}
          aria-label="Позиция"
          onChange={(e) => {
            const ratio = Number(e.target.value) / 100
            seekTo(ratio * seekMax)
          }}
        />
      </div>
    </>
  )
}
