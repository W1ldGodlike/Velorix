import { useEffect, useMemo, useState, type KeyboardEvent, type RefObject } from 'react'

import type { MediaProbeSuccess } from '../../../shared/ffprobe-contract'
import { buildTimelineRulerTicks, pickTimelineRulerStepSec } from '../../../shared/timeline-ruler'
import { snapSeekTimeSec } from '../../../shared/video-frame-snap'
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

function approxVideoFpsFromProbe(probe: MediaProbeSuccess | null): number | null {
  if (!probe) {
    return null
  }
  const fromProbe = probe.videoFpsApprox
  if (fromProbe !== null && Number.isFinite(fromProbe) && fromProbe > 0 && fromProbe < 1000) {
    return fromProbe
  }
  const row = probe.tracks.find((t) => t.kind === 'video')
  if (!row) {
    return null
  }
  const mm = /(\d+(?:\.\d+)?)\s*fps\b/i.exec(row.detail)
  if (!mm?.[1]) {
    return null
  }
  const v = Number(mm[1])
  if (!Number.isFinite(v) || v <= 0 || v >= 1000) {
    return null
  }
  return v
}

function formatProbeVideoFact(probe: MediaProbeSuccess | null): string {
  if (!probe?.video) {
    return '—'
  }
  return `${probe.video.width}×${probe.video.height} ${probe.video.codec}`
}

function formatProbeAudioFact(probe: MediaProbeSuccess | null): string {
  if (!probe) {
    return '—'
  }
  if (probe.audioCodec && probe.audioCodec.trim().length > 0) {
    return probe.audioCodec
  }
  const row = probe.tracks.find((t) => t.kind === 'audio')
  return row?.codec ?? '—'
}

function formatProbePositionLine(
  currentSec: number,
  durationSec: number,
  fps: number | null
): string {
  const base = `${formatTime(currentSec)} / ${formatTime(durationSec)}`
  if (fps !== null && durationSec > 0 && Number.isFinite(currentSec)) {
    const snapped = snapSeekTimeSec(currentSec, durationSec, fps)
    const f = Math.round(snapped * fps)
    const fMax = Math.max(0, Math.round(snapSeekTimeSec(durationSec, durationSec, fps) * fps))
    return `${base} · кадр ~${Math.min(Math.max(f, 0), fMax)}`
  }
  return base
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
  /** Сводка ffprobe для строки «Видео / Аудио / Позиция» (`docs/UX_REFERENCE_V0.md`). */
  probe?: MediaProbeSuccess | null
  /** Снимок актуальных маркеров для экспорта §7.1 (родитель держит только ref на последнее значение). */
  onTrimRangeChange?: (range: { inSec: number; outSec: number }) => void
}

export default function VideoTimeline({
  mediaKey,
  mediaUrl,
  videoRef,
  probe = null,
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
    const fps = approxVideoFpsFromProbe(probe)
    v.currentTime = snapSeekTimeSec(next, duration, fps)
  }

  function seekFromRulerPointer(clientX: number, trackEl: Element): void {
    if (!Number.isFinite(duration) || duration <= 0 || windowLenSec <= 0) {
      return
    }
    const rect = trackEl.getBoundingClientRect()
    const w = rect.width
    if (!(w > 0)) {
      return
    }
    const frac = (clientX - rect.left) / w
    seek(Math.min(1, Math.max(0, frac)))
  }

  function handleRulerKeyDown(e: KeyboardEvent<HTMLDivElement>): void {
    if (!(duration > 0) || !(windowLenSec > 0)) {
      return
    }
    const fps = approxVideoFpsFromProbe(probe)
    const stepSec = fps !== null && fps > 0 ? 1 / fps : Math.max(windowLenSec / 80, 1 / 60)
    const v = videoRef.current
    if (e.key === 'Home') {
      e.preventDefault()
      seek(0)
      return
    }
    if (e.key === 'End') {
      e.preventDefault()
      seek(1)
      return
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      if (!v) {
        return
      }
      e.preventDefault()
      const dir = e.key === 'ArrowLeft' ? -1 : 1
      const raw = v.currentTime + dir * stepSec
      v.currentTime = snapSeekTimeSec(raw, duration, fps)
    }
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
    const fps = approxVideoFpsFromProbe(probe)
    const t = snapSeekTimeSec(v.currentTime, duration, fps)
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
    const fps = approxVideoFpsFromProbe(probe)
    const t = snapSeekTimeSec(v.currentTime, duration, fps)
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

  const rulerTicks = useMemo(() => {
    if (!(duration > 0) || !(windowLenSec > 0)) {
      return []
    }
    const winEnd = Math.min(duration, winStartEff + windowLenSec)
    const step = pickTimelineRulerStepSec(windowLenSec)
    return [...buildTimelineRulerTicks(winStartEff, winEnd, step)]
  }, [duration, windowLenSec, winStartEff])

  const fpsProbeHint = approxVideoFpsFromProbe(probe)

  const rulerPlayheadPct = useMemo((): number | null => {
    if (!(duration > 0) || !(windowLenSec > 0)) {
      return null
    }
    const pct = ((current - winStartEff) / windowLenSec) * 100
    return Number.isFinite(pct) ? pct : null
  }, [current, duration, windowLenSec, winStartEff])

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

      {duration > 0 ? (
        <div
          className="app-timeline-ruler"
          aria-label="Линейка времени окна воспроизведения: клик или стрелки для перехода"
        >
          <div
            className="app-timeline-ruler-track"
            tabIndex={0}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={1000}
            aria-valuenow={Math.round(Math.min(1, Math.max(0, ratio)) * 1000)}
            aria-valuetext={`${formatTime(current)} в окне ${formatTime(winStartEff)} — ${formatTime(Math.min(duration, winStartEff + windowLenSec))}`}
            onPointerDown={(ev) => {
              if (ev.button !== 0) {
                return
              }
              ev.preventDefault()
              ev.currentTarget.focus()
              seekFromRulerPointer(ev.clientX, ev.currentTarget)
            }}
            onKeyDown={handleRulerKeyDown}
          >
            {rulerTicks.map((t) => (
              <span
                key={`ruler-tick-${String(t)}`}
                className="app-timeline-ruler-tick"
                style={{ left: `${((t - winStartEff) / windowLenSec) * 100}%` }}
              >
                <span className="app-timeline-ruler-label">{formatTime(t)}</span>
              </span>
            ))}
            {rulerPlayheadPct !== null && rulerPlayheadPct >= -1 && rulerPlayheadPct <= 101 ? (
              <span
                className="app-timeline-ruler-playhead"
                style={{ left: `${Math.min(100, Math.max(0, rulerPlayheadPct))}%` }}
              />
            ) : null}
          </div>
        </div>
      ) : null}

      {duration > 0 ? (
        <div className="app-timeline-media-facts" aria-label="Сводка медиа по ffprobe и позиция">
          <span title="Первый видеопоток ffprobe">
            <strong>Видео:</strong> {formatProbeVideoFact(probe)}
          </span>
          <span title="Первая аудиодорожка ffprobe">
            <strong>Аудио:</strong> {formatProbeAudioFact(probe)}
          </span>
          <span title="Текущее время; номер кадра — оценка по fps из строки дорожки">
            <strong>Позиция:</strong> {formatProbePositionLine(current, duration, fpsProbeHint)}
          </span>
        </div>
      ) : null}

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
