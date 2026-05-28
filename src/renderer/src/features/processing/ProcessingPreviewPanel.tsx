import { useCallback, useEffect, useRef, useState, type JSX } from 'react'

import { capturePreviewSnapshot } from '../../lib/capture-preview-snapshot'
import { applyExportTrimIn, applyExportTrimOut } from '../../lib/export-trim-markers'
import { formatMediaClock } from '../../lib/format-media-clock'
import { useAppShellStore } from '../../stores/app-shell-store'
import type { ShellMediaSource } from '../../stores/shell-media-source'

type ProcessingPreviewPanelProps = {
  mediaSource: ShellMediaSource | null
  durationSec: number | null
  onActionNote?: (note: string) => void
}

export function ProcessingPreviewPanel(props: ProcessingPreviewPanelProps): JSX.Element {
  const { mediaSource, durationSec, onActionNote } = props
  const exportTrim = useAppShellStore((s) => s.exportTrim)
  const setExportTrim = useAppShellStore((s) => s.setExportTrim)
  const previewSeekSec = useAppShellStore((s) => s.previewSeekSec)
  const ackPreviewSeek = useAppShellStore((s) => s.ackPreviewSeek)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentSec, setCurrentSec] = useState(0)
  const [duration, setDuration] = useState(durationSec ?? 0)
  const [playing, setPlaying] = useState(false)
  const [lastSnapshotPath, setLastSnapshotPath] = useState<string | null>(null)

  const seekMax = duration > 0 ? duration : 1
  const seekPercent = duration > 0 ? Math.min(100, (currentSec / duration) * 100) : 0

  useEffect(() => {
    if (exportTrim == null || mediaSource == null) {
      return
    }
    const video = videoRef.current
    if (video == null) {
      return
    }
    const target = exportTrim.inSec
    const applySeek = (): void => {
      const max =
        duration > 0
          ? duration
          : Number.isFinite(video.duration) && video.duration > 0
            ? video.duration
            : 0
      video.currentTime = max > 0 ? Math.min(target, max) : target
    }
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      applySeek()
      return
    }
    video.addEventListener('loadedmetadata', applySeek, { once: true })
    return () => video.removeEventListener('loadedmetadata', applySeek)
  }, [exportTrim, mediaSource, duration])

  const seekTo = useCallback(
    (sec: number): void => {
      const video = videoRef.current
      if (video == null) {
        return
      }
      const max = duration > 0 ? duration : video.duration || 0
      const next = Math.min(Math.max(0, sec), max > 0 ? max : 0)
      video.currentTime = next
      setCurrentSec(next)
    },
    [duration]
  )

  useEffect(() => {
    if (previewSeekSec == null || mediaSource == null) {
      return
    }
    seekTo(previewSeekSec)
    ackPreviewSeek()
  }, [previewSeekSec, mediaSource, seekTo, ackPreviewSeek])

  async function togglePlay(): Promise<void> {
    const video = videoRef.current
    if (video == null) {
      return
    }
    if (video.paused) {
      if (exportTrim != null && video.currentTime >= exportTrim.outSec) {
        video.currentTime = exportTrim.inSec
        setCurrentSec(exportTrim.inSec)
      }
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
            if (video == null) {
              return
            }
            let nextSec = video.currentTime
            if (exportTrim != null && nextSec > exportTrim.outSec) {
              video.currentTime = exportTrim.inSec
              nextSec = exportTrim.inSec
              video.pause()
              setPlaying(false)
            }
            setCurrentSec(nextSec)
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
        <div className="processing-screen__trim" role="group" aria-label="Диапазон экспорта">
          <button
            type="button"
            className="app-btn app-btn-secondary processing-screen__trim-btn"
            onClick={() => {
              const next = applyExportTrimIn(currentSec, duration, exportTrim)
              if (next != null) {
                setExportTrim(next)
              }
            }}
          >
            In
          </button>
          <button
            type="button"
            className="app-btn app-btn-secondary processing-screen__trim-btn"
            onClick={() => {
              const next = applyExportTrimOut(currentSec, exportTrim)
              if (next != null) {
                setExportTrim(next)
              }
            }}
          >
            Out
          </button>
          <button
            type="button"
            className="app-btn processing-screen__trim-btn"
            disabled={exportTrim == null}
            onClick={() => setExportTrim(null)}
          >
            Сброс
          </button>
          {exportTrim != null ? (
            <>
              <button
                type="button"
                className="app-btn app-btn-secondary processing-screen__trim-btn"
                onClick={() => seekTo(exportTrim.inSec)}
              >
                К In
              </button>
              <button
                type="button"
                className="app-btn app-btn-secondary processing-screen__trim-btn"
                onClick={() => seekTo(exportTrim.outSec)}
              >
                К Out
              </button>
              <span className="processing-screen__trim-range">
                {formatMediaClock(exportTrim.inSec)} → {formatMediaClock(exportTrim.outSec)}
              </span>
            </>
          ) : null}
          <button
            type="button"
            className="app-btn app-btn-secondary processing-screen__trim-btn"
            onClick={() => {
              void capturePreviewSnapshot({
                inputPath: mediaSource.path,
                timeSec: currentSec
              }).then((result) => {
                if (result?.ok) {
                  setLastSnapshotPath(result.path)
                  onActionNote?.(`Кадр: ${result.path}`)
                }
              })
            }}
          >
            Кадр
          </button>
          <button
            type="button"
            className="app-btn processing-screen__trim-btn"
            disabled={lastSnapshotPath == null}
            onClick={() => {
              const path = lastSnapshotPath
              const open = window.velorix?.export?.openOutput
              if (path == null || open == null) {
                return
              }
              void open(path, 'file')
            }}
          >
            Открыть кадр
          </button>
        </div>
      </div>
    </>
  )
}
