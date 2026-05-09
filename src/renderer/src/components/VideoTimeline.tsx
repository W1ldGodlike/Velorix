import { useEffect, useMemo, useState, type RefObject } from 'react'

const MIN_TRIM_GAP_SEC = 0.05

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) {
    return '0:00'
  }
  const s = Math.floor(sec % 60)
  const m = Math.floor((sec / 60) % 60)
  const h = Math.floor(sec / 3600)
  const pad = (n: number): string => n.toString().padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

function minEffectiveGap(duration: number): number {
  return Math.min(MIN_TRIM_GAP_SEC, Math.max(duration * 0.002, 1 / 60))
}

function clampTrimRange(
  inSec: number,
  outSec: number,
  duration: number
): { inSec: number; outSec: number } {
  if (!Number.isFinite(duration) || duration <= 0) {
    return { inSec: 0, outSec: 0 }
  }
  let a = Math.min(Math.max(0, inSec), duration)
  let b = Math.min(Math.max(0, outSec), duration)
  if (b < a) {
    ;[a, b] = [b, a]
  }
  const minGap = minEffectiveGap(duration)
  if (b - a < minGap) {
    b = Math.min(duration, a + minGap)
    if (b > duration - 1e-6) {
      a = Math.max(0, b - minGap)
    }
  }
  return { inSec: a, outSec: b }
}

interface TrimMarks {
  inSec: number
  /** `null` до известной длительности — трактуем как конец файла после загрузки метаданных. */
  outSec: number | null
}

interface VideoTimelineProps {
  /** Совпадает с `key` у `<video>`, чтобы переподписаться при смене источника. */
  mediaKey: string
  videoRef: RefObject<HTMLVideoElement | null>
  /** Снимок актуальных маркеров для экспорта §7.1 (родитель держит только ref на последнее значение). */
  onTrimRangeChange?: (range: { inSec: number; outSec: number }) => void
}

export default function VideoTimeline({
  mediaKey,
  videoRef,
  onTrimRangeChange
}: VideoTimelineProps): React.JSX.Element {
  const [duration, setDuration] = useState(0)
  const [current, setCurrent] = useState(0)
  const [trim, setTrim] = useState<TrimMarks>({ inSec: 0, outSec: null })

  useEffect(() => {
    const el = videoRef.current
    if (!el) {
      return
    }
    const videoEl: HTMLVideoElement = el
    function syncDuration(): void {
      const d = videoEl.duration
      setDuration(Number.isFinite(d) ? d : 0)
    }
    function syncTime(): void {
      setCurrent(videoEl.currentTime)
    }
    syncDuration()
    syncTime()
    videoEl.addEventListener('loadedmetadata', syncDuration)
    videoEl.addEventListener('durationchange', syncDuration)
    videoEl.addEventListener('timeupdate', syncTime)
    videoEl.addEventListener('seeked', syncTime)
    return (): void => {
      videoEl.removeEventListener('loadedmetadata', syncDuration)
      videoEl.removeEventListener('durationchange', syncDuration)
      videoEl.removeEventListener('timeupdate', syncTime)
      videoEl.removeEventListener('seeked', syncTime)
    }
  }, [mediaKey, videoRef])

  useEffect(() => {
    if (!Number.isFinite(duration) || duration <= 0) {
      return
    }
    let cancelled = false
    const handle = window.setTimeout(() => {
      if (cancelled) {
        return
      }
      setTrim((prev) => {
        const rawOut = prev.outSec === null || prev.outSec > duration ? duration : prev.outSec
        const { inSec, outSec } = clampTrimRange(prev.inSec, rawOut, duration)
        return { inSec, outSec }
      })
    }, 0)
    return (): void => {
      cancelled = true
      window.clearTimeout(handle)
    }
  }, [duration])

  const effectiveOut = trim.outSec ?? duration

  const markerGeometry = useMemo(() => {
    if (!Number.isFinite(duration) || duration <= 0) {
      return null
    }
    const { inSec, outSec } = clampTrimRange(trim.inSec, effectiveOut, duration)
    const left = (inSec / duration) * 100
    const width = Math.max(0, ((outSec - inSec) / duration) * 100)
    return { leftPct: left, widthPct: width, inSec, outSec }
  }, [trim.inSec, effectiveOut, duration])

  useEffect(() => {
    if (markerGeometry && onTrimRangeChange) {
      onTrimRangeChange({ inSec: markerGeometry.inSec, outSec: markerGeometry.outSec })
    }
  }, [markerGeometry, onTrimRangeChange])

  const ratio = duration > 0 ? Math.min(1, Math.max(0, current / duration)) : 0

  function seek(fraction: number): void {
    const v = videoRef.current
    if (!v || !Number.isFinite(duration) || duration <= 0) {
      return
    }
    const next = Math.min(duration * fraction, Math.max(0, duration - 0.02))
    v.currentTime = next
  }

  function captureInFromPlayhead(): void {
    const v = videoRef.current
    if (!v || !Number.isFinite(duration) || duration <= 0 || markerGeometry === null) {
      return
    }
    const t = Math.min(Math.max(0, v.currentTime), duration)
    const maxIn = Math.max(0, markerGeometry.outSec - minEffectiveGap(duration))
    const nextIn = Math.min(t, maxIn)
    setTrim((prev) => {
      const out = prev.outSec ?? duration
      const { inSec, outSec } = clampTrimRange(nextIn, out, duration)
      return { inSec, outSec }
    })
  }

  function captureOutFromPlayhead(): void {
    const v = videoRef.current
    if (!v || !Number.isFinite(duration) || duration <= 0 || markerGeometry === null) {
      return
    }
    const t = Math.min(Math.max(0, v.currentTime), duration)
    const gap = minEffectiveGap(duration)
    const minOut = Math.min(duration, markerGeometry.inSec + gap)
    const nextOut = Math.max(t, minOut)
    setTrim((prev) => {
      const { inSec, outSec } = clampTrimRange(prev.inSec, nextOut, duration)
      return { inSec, outSec }
    })
  }

  function resetTrimToFull(): void {
    if (!Number.isFinite(duration) || duration <= 0) {
      setTrim({ inSec: 0, outSec: null })
      return
    }
    setTrim({ inSec: 0, outSec: duration })
  }

  const displayIn = markerGeometry?.inSec ?? trim.inSec
  const displayOut = markerGeometry?.outSec ?? effectiveOut

  return (
    <div className="app-timeline-stack">
      <div className="app-timeline" aria-label="Позиция воспроизведения">
        <span className="app-timeline-time">{formatTime(current)}</span>
        <input
          className="app-timeline-range"
          type="range"
          min={0}
          max={1}
          step={0.0001}
          value={ratio}
          aria-valuetext={`${formatTime(current)} из ${formatTime(duration)}`}
          onChange={(e) => {
            seek(Number(e.target.value))
          }}
        />
        <span className="app-timeline-time">{formatTime(duration)}</span>
      </div>

      {markerGeometry ? (
        <div className="app-timeline-marker-strip" aria-hidden>
          <div className="app-timeline-marker-track">
            <div
              className="app-timeline-marker-selection"
              style={{
                left: `${markerGeometry.leftPct}%`,
                width: `${markerGeometry.widthPct}%`
              }}
            />
          </div>
        </div>
      ) : null}

      <div className="app-timeline-io" aria-label="Маркеры In / Out">
        <span
          className="app-timeline-io-readout"
          title="Диапазон для экспорта (§7.1): передаётся в ffmpeg как -ss/-t"
        >
          In <strong>{formatTime(displayIn)}</strong> — Out{' '}
          <strong>{formatTime(displayOut)}</strong>
        </span>
        <div className="app-timeline-io-actions">
          <button
            type="button"
            className="app-btn app-btn-compact"
            disabled={duration <= 0}
            onClick={captureInFromPlayhead}
            title="Записать In в текущую позицию воспроизведения"
          >
            In здесь
          </button>
          <button
            type="button"
            className="app-btn app-btn-compact"
            disabled={duration <= 0}
            onClick={captureOutFromPlayhead}
            title="Записать Out в текущую позицию воспроизведения"
          >
            Out здесь
          </button>
          <button
            type="button"
            className="app-btn app-btn-compact"
            disabled={duration <= 0}
            onClick={resetTrimToFull}
            title="Сбросить диапазон на весь файл"
          >
            Весь клип
          </button>
        </div>
      </div>
    </div>
  )
}
