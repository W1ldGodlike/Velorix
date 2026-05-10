import { useEffect, useMemo, useState, type RefObject } from 'react'

import { IconZoomIn, IconZoomOut } from './LucideMiniIcons'
import TimelineWaveform from './TimelineWaveform'

const MIN_TRIM_GAP_SEC = 0.05

const TIMELINE_ZOOM_MAX = 8

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
  /** `fluxmedia://…` для побочной декодирования waveform без Node API в renderer (§1.1 v0). */
  mediaUrl: string
  videoRef: RefObject<HTMLVideoElement | null>
  /** Снимок актуальных маркеров для экспорта §7.1 (родитель держит только ref на последнее значение). */
  onTrimRangeChange?: (range: { inSec: number; outSec: number }) => void
}

export default function VideoTimeline({
  mediaKey,
  mediaUrl,
  videoRef,
  onTrimRangeChange
}: VideoTimelineProps): React.JSX.Element {
  const [duration, setDuration] = useState(0)
  const [current, setCurrent] = useState(0)
  const [trim, setTrim] = useState<TrimMarks>({ inSec: 0, outSec: null })

  /** Масштаб по горизонтали §1.1/v0: 1 = весь файл, выше — крупнее участок времени под ползунком scrub. */
  const [timelineZoomMul, setTimelineZoomMul] = useState(1)
  /** Левый край окна времени при zoom>1 (секунды от начала файла). */
  const [timelineWindowStartSec, setTimelineWindowStartSec] = useState(0)

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

  const windowLenSec = duration > 0 && timelineZoomMul > 0 ? duration / timelineZoomMul : 0
  const maxWinStart = Math.max(0, duration - windowLenSec)
  const winStartEff = timelineZoomMul <= 1 ? 0 : Math.min(timelineWindowStartSec, maxWinStart)

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

  /** `mediaKey` совпадает с `key` на `<VideoTimeline>` в `App.tsx`: смена источника перемонтирует блок. */

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

  const markerZoomOverlay = useMemo(() => {
    if (markerGeometry === null || duration <= 0 || windowLenSec <= 0) {
      return null
    }
    const winEnd = winStartEff + windowLenSec
    const segStart = Math.max(markerGeometry.inSec, winStartEff)
    const segEnd = Math.min(markerGeometry.outSec, winEnd)
    if (segEnd - segStart <= 1 / 960) {
      return null
    }
    return {
      leftPct: ((segStart - winStartEff) / windowLenSec) * 100,
      widthPct: ((segEnd - segStart) / windowLenSec) * 100
    }
  }, [markerGeometry, duration, windowLenSec, winStartEff])

  const markersDisjointZoomWindow =
    markerGeometry !== null &&
    duration > 0 &&
    windowLenSec > 0 &&
    markerZoomOverlay === null &&
    (markerGeometry.outSec <= winStartEff || markerGeometry.inSec >= winStartEff + windowLenSec)

  const zoomedRatio =
    duration <= 0 || windowLenSec <= 0 ? 0 : (current - winStartEff) / windowLenSec
  const ratio = Math.min(1, Math.max(0, zoomedRatio))

  function seek(fraction: number): void {
    const v = videoRef.current
    if (!v || !Number.isFinite(duration) || duration <= 0) {
      return
    }
    const next = winStartEff + fraction * windowLenSec
    v.currentTime = Math.min(Math.max(next, 0), Math.max(0, duration - 0.02))
  }

  function handleTimelineZoomIn(): void {
    if (!Number.isFinite(duration) || duration <= 0) {
      return
    }
    const next = timelineZoomMul * 2
    if (next > TIMELINE_ZOOM_MAX || next === timelineZoomMul) {
      return
    }
    const curLen = duration / timelineZoomMul
    const wsEff =
      timelineZoomMul <= 1 ? 0 : Math.min(timelineWindowStartSec, Math.max(0, duration - curLen))
    const vc = videoRef.current
    const centerSec = ((): number => {
      const t = vc && Number.isFinite(vc.currentTime) ? vc.currentTime : NaN
      const lo = wsEff
      const hi = wsEff + curLen
      if (Number.isFinite(t) && t >= lo && t <= hi) {
        return t
      }
      return wsEff + curLen / 2
    })()
    const newLen = duration / next
    let ns = centerSec - newLen / 2
    ns = Math.max(0, Math.min(ns, duration - newLen))
    setTimelineZoomMul(next)
    setTimelineWindowStartSec(ns)
  }

  function handleTimelineZoomOut(): void {
    if (!Number.isFinite(duration) || duration <= 0) {
      return
    }
    const next = timelineZoomMul / 2
    if (next < 1 || next === timelineZoomMul) {
      return
    }
    const curLen = duration / timelineZoomMul
    const wsEff =
      timelineZoomMul <= 1 ? 0 : Math.min(timelineWindowStartSec, Math.max(0, duration - curLen))
    const centerSec = wsEff + curLen / 2
    const newLen = duration / next
    let ns = centerSec - newLen / 2
    ns = Math.max(0, Math.min(ns, duration - newLen))
    setTimelineZoomMul(next)
    setTimelineWindowStartSec(next === 1 ? 0 : ns)
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
      <div className="app-timeline-zoom-row" aria-label="Масштаб временной шкалы">
        <div className="app-timeline-zoom-cluster">
          <button
            type="button"
            className="app-icon-btn app-timeline-zoom-ico"
            disabled={duration <= 0 || timelineZoomMul <= 1}
            onClick={handleTimelineZoomOut}
            title="Отдалить шкалу (показать больший интервал времени)"
          >
            <IconZoomOut />
            <span className="app-visually-hidden">Zoom out timeline</span>
          </button>
          <button
            type="button"
            className="app-icon-btn app-timeline-zoom-ico"
            disabled={duration <= 0 || timelineZoomMul >= TIMELINE_ZOOM_MAX}
            onClick={handleTimelineZoomIn}
            title="Приблизить шкалу под точную позицию"
          >
            <IconZoomIn />
            <span className="app-visually-hidden">Zoom in timeline</span>
          </button>
        </div>
        <span
          className="app-timeline-zoom-readout"
          title="Видимый диапазон scrub и полоски маркеров"
        >
          Масштаб ×{timelineZoomMul} · {formatTime(winStartEff)} —{' '}
          {formatTime(Math.min(duration, winStartEff + windowLenSec))}
        </span>
      </div>

      <TimelineWaveform
        key={mediaKey}
        mediaKey={mediaKey}
        mediaUrl={mediaUrl}
        durationSec={duration}
        windowStartSec={winStartEff}
        windowLenSec={windowLenSec}
      />

      <div className="app-timeline" aria-label="Позиция воспроизведения">
        <span className="app-timeline-time">{formatTime(current)}</span>
        <input
          className="app-timeline-range"
          type="range"
          min={0}
          max={1}
          step={0.0001}
          value={ratio}
          aria-valuetext={`${formatTime(current)} из ${formatTime(duration)} (окно воспроизведения под масштабом ×${timelineZoomMul})`}
          onChange={(e) => {
            seek(Number(e.target.value))
          }}
        />
        <span className="app-timeline-time">{formatTime(duration)}</span>
      </div>

      {markerZoomOverlay ? (
        <div className="app-timeline-marker-strip" aria-hidden>
          <div className="app-timeline-marker-track">
            <div
              className="app-timeline-marker-selection"
              style={{
                left: `${markerZoomOverlay.leftPct}%`,
                width: `${markerZoomOverlay.widthPct}%`
              }}
            />
          </div>
        </div>
      ) : markersDisjointZoomWindow ? (
        <div
          className="app-timeline-marker-strip"
          aria-hidden
          title="In–Out вне текущего окна шкалы — уменьшите масштаб (zoom out)."
        >
          <div className="app-timeline-marker-track app-timeline-marker-track-idle" />
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
            className="app-btn app-btn-compact app-timeline-export-jump"
            disabled={duration <= 0}
            onClick={() => {
              document
                .querySelector('.app-settings-panel')
                ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            }}
            title="Прокрутить к панели экспорта FFmpeg (маркеры In/Out и превью команды)"
          >
            Обрезать → экспорт
          </button>
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
