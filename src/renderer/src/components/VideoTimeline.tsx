import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type RefObject
} from 'react'

import type { MediaProbeSuccess } from '../../../shared/ffprobe-contract'
import { buildTimelineRulerTicks, pickTimelineRulerStepSec } from '../../../shared/timeline-ruler'
import { snapSeekTimeSec } from '../../../shared/video-frame-snap'
import { uiText } from '../locales/ui-text'
import {
  approxVideoFpsFromProbe,
  clampTrimRange,
  minEffectiveTrimGap,
  TIMELINE_ZOOM_MAX,
  TRIM_DRAG_THRESHOLD_PX,
  TRIM_HANDLE_HIT_PX
} from './video-timeline-helpers'
import { VideoTimelineToolbar } from './VideoTimelineToolbar'
import { VideoTimelineUnifiedPane } from './VideoTimelineUnifiedPane'

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
  /** Секция «Вывод» + превью команды в правом rail (кнопка «Обрезать»). */
  onJumpToTrimExport?: () => void
  /** Запуск экспорта (та же логика, что кнопка «Начать экспорт» на таймлайне). */
  onStartExport?: () => void
  /** Сохранить кадр в позиции воспроизведения (отдельный файл). */
  onSaveFrame?: () => void
  saveFrameDisabled?: boolean
  saveFrameBusy?: boolean
  /** Экспорт/снимок/ffprobe превью — синхронизация `aria-busy` с родителем (`App.tsx`). */
  previewPipelineBusy?: boolean
}

export default function VideoTimeline({
  mediaKey,
  mediaUrl,
  videoRef,
  probe = null,
  onTrimRangeChange,
  onJumpToTrimExport,
  onStartExport,
  onSaveFrame,
  saveFrameDisabled = false,
  saveFrameBusy = false,
  previewPipelineBusy = false
}: VideoTimelineProps): React.JSX.Element {
  const [duration, setDuration] = useState(0)
  const [current, setCurrent] = useState(0)
  const [trim, setTrim] = useState<TrimMarks>({ inSec: 0, outSec: null })

  /** Масштаб по горизонтали §1.1/v0: 1 = весь файл, выше — крупнее участок времени под ползунком scrub. */
  const [timelineZoomMul, setTimelineZoomMul] = useState(1)
  /** Левый край окна времени при zoom>1 (секунды от начала файла). */
  const [timelineWindowStartSec, setTimelineWindowStartSec] = useState(0)

  const timelinePaneRef = useRef<HTMLDivElement | null>(null)
  const trimPointerRef = useRef<{
    pointerId: number
    mode: 'marquee' | 'inHandle' | 'outHandle'
    startClientX: number
    startSec: number
    dragging: boolean
  } | null>(null)

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

  function handleTimelinePaneKeyDown(e: KeyboardEvent<HTMLDivElement>): void {
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
    const maxIn = Math.max(0, markerGeometry.outSec - minEffectiveTrimGap(duration))
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
    const gap = minEffectiveTrimGap(duration)
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

  const timelineSecFromPaneClientX = useCallback(
    (clientX: number): number | null => {
      const el = timelinePaneRef.current
      if (!el || !(duration > 0) || !(windowLenSec > 0)) {
        return null
      }
      const rect = el.getBoundingClientRect()
      const w = rect.width
      if (!(w > 0)) {
        return null
      }
      const frac = (clientX - rect.left) / w
      return winStartEff + Math.min(1, Math.max(0, frac)) * windowLenSec
    },
    [duration, windowLenSec, winStartEff]
  )

  const endTrimPointerGesture = useCallback(
    (target: HTMLDivElement, pointerId: number, seekOnClick: boolean): void => {
      const st = trimPointerRef.current
      if (!st || st.pointerId !== pointerId) {
        return
      }
      trimPointerRef.current = null
      try {
        target.releasePointerCapture(pointerId)
      } catch {
        /* уже снят */
      }
      if (
        st.mode === 'marquee' &&
        seekOnClick &&
        !st.dragging &&
        duration > 0 &&
        windowLenSec > 0
      ) {
        const frac = (st.startSec - winStartEff) / windowLenSec
        seek(Math.min(1, Math.max(0, frac)))
      }
    },
    [duration, windowLenSec, winStartEff, seek]
  )

  const resolveTrimPointerMode = useCallback(
    (clientX: number): 'marquee' | 'inHandle' | 'outHandle' => {
      const pane = timelinePaneRef.current
      if (!pane || markerZoomOverlay === null) {
        return 'marquee'
      }
      const rect = pane.getBoundingClientRect()
      const w = rect.width
      if (!(w > 0)) {
        return 'marquee'
      }
      const leftPx = rect.left + (markerZoomOverlay.leftPct / 100) * w
      const rightPx =
        rect.left + ((markerZoomOverlay.leftPct + markerZoomOverlay.widthPct) / 100) * w
      if (Math.abs(clientX - leftPx) <= TRIM_HANDLE_HIT_PX) {
        return 'inHandle'
      }
      if (Math.abs(clientX - rightPx) <= TRIM_HANDLE_HIT_PX) {
        return 'outHandle'
      }
      return 'marquee'
    },
    [markerZoomOverlay]
  )

  const onTimelinePanePointerDownCapture = useCallback(
    (ev: PointerEvent<HTMLDivElement>): void => {
      if (ev.button !== 0 || duration <= 0) {
        return
      }
      const t0 = timelineSecFromPaneClientX(ev.clientX)
      if (t0 === null) {
        return
      }
      const mode = resolveTrimPointerMode(ev.clientX)
      trimPointerRef.current = {
        pointerId: ev.pointerId,
        mode,
        startClientX: ev.clientX,
        startSec: t0,
        dragging: false
      }
      ev.currentTarget.setPointerCapture(ev.pointerId)
      if (mode !== 'marquee') {
        ev.preventDefault()
      }
    },
    [duration, resolveTrimPointerMode, timelineSecFromPaneClientX]
  )

  const onTimelinePanePointerMove = useCallback(
    (ev: PointerEvent<HTMLDivElement>): void => {
      const st = trimPointerRef.current
      if (!st || st.pointerId !== ev.pointerId) {
        return
      }
      const t1 = timelineSecFromPaneClientX(ev.clientX)
      if (t1 === null) {
        return
      }
      const fps = approxVideoFpsFromProbe(probe)
      if (st.mode === 'inHandle') {
        const snapped = snapSeekTimeSec(t1, duration, fps)
        setTrim((prev) => {
          const o = prev.outSec ?? duration
          const { inSec, outSec } = clampTrimRange(snapped, o, duration)
          return { inSec, outSec }
        })
        return
      }
      if (st.mode === 'outHandle') {
        const snapped = snapSeekTimeSec(t1, duration, fps)
        setTrim((prev) => {
          const { inSec, outSec } = clampTrimRange(prev.inSec, snapped, duration)
          return { inSec, outSec }
        })
        return
      }
      if (!st.dragging) {
        if (Math.abs(ev.clientX - st.startClientX) < TRIM_DRAG_THRESHOLD_PX) {
          return
        }
        st.dragging = true
      }
      const a = snapSeekTimeSec(Math.min(st.startSec, t1), duration, fps)
      const b = snapSeekTimeSec(Math.max(st.startSec, t1), duration, fps)
      const { inSec, outSec } = clampTrimRange(a, b, duration)
      setTrim({ inSec, outSec })
    },
    [duration, probe, timelineSecFromPaneClientX]
  )

  const onTimelinePanePointerUpOrCancel = useCallback(
    (ev: PointerEvent<HTMLDivElement>): void => {
      const st = trimPointerRef.current
      if (!st || st.pointerId !== ev.pointerId) {
        return
      }
      endTrimPointerGesture(ev.currentTarget, ev.pointerId, true)
    },
    [endTrimPointerGesture]
  )

  const onTimelinePaneLostPointerCapture = useCallback(
    (ev: PointerEvent<HTMLDivElement>): void => {
      const st = trimPointerRef.current
      if (!st || st.pointerId !== ev.pointerId) {
        return
      }
      endTrimPointerGesture(ev.currentTarget, ev.pointerId, false)
    },
    [endTrimPointerGesture]
  )

  const displayIn = markerGeometry?.inSec ?? trim.inSec
  const displayOut = markerGeometry?.outSec ?? effectiveOut
  const trimSpanSec = Math.max(0, displayOut - displayIn)

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

  const pipelineBusy = saveFrameBusy || previewPipelineBusy

  return (
    <div
      className="app-timeline-stack"
      role="region"
      aria-label={uiText('videoTimelineStackAria')}
      aria-busy={pipelineBusy}
    >
      {duration > 0 ? (
        <VideoTimelineToolbar
          duration={duration}
          pipelineBusy={pipelineBusy}
          displayIn={displayIn}
          displayOut={displayOut}
          trimSpanSec={trimSpanSec}
          current={current}
          fpsProbeHint={fpsProbeHint}
          timelineZoomMul={timelineZoomMul}
          winStartEff={winStartEff}
          windowLenSec={windowLenSec}
          saveFrameDisabled={saveFrameDisabled}
          saveFrameBusy={saveFrameBusy}
          onCaptureIn={captureInFromPlayhead}
          onCaptureOut={captureOutFromPlayhead}
          onResetTrim={resetTrimToFull}
          onJumpToTrimExport={onJumpToTrimExport}
          onSaveFrame={onSaveFrame}
          onStartExport={onStartExport}
          onZoomIn={handleTimelineZoomIn}
          onZoomOut={handleTimelineZoomOut}
        />
      ) : null}
      {duration > 0 ? (
        <VideoTimelineUnifiedPane
          duration={duration}
          pipelineBusy={pipelineBusy}
          mediaKey={mediaKey}
          mediaUrl={mediaUrl}
          winStartEff={winStartEff}
          windowLenSec={windowLenSec}
          rulerTicks={rulerTicks}
          timelinePaneRef={timelinePaneRef}
          markersDisjointZoomWindow={markersDisjointZoomWindow}
          ratio={ratio}
          current={current}
          markerZoomOverlay={markerZoomOverlay}
          rulerPlayheadPct={rulerPlayheadPct}
          probe={probe}
          onPointerDownCapture={onTimelinePanePointerDownCapture}
          onPointerMove={onTimelinePanePointerMove}
          onPointerUpOrCancel={onTimelinePanePointerUpOrCancel}
          onLostPointerCapture={onTimelinePaneLostPointerCapture}
          onKeyDown={handleTimelinePaneKeyDown}
        />
      ) : null}
    </div>
  )
}
