import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type MutableRefObject,
  type RefObject,
  type SetStateAction
} from 'react'

import { buildTimelineRulerTicks, pickTimelineRulerStepSec } from '../../../shared/timeline-ruler'
import { approxVideoFpsFromProbe, clampTrimRange } from './video-timeline-helpers'
import type { TrimMarks, VideoTimelineProps } from './video-timeline-props'

export type VideoTimelineMediaSync = {
  duration: number
  current: number
  trim: TrimMarks
  setTrim: Dispatch<SetStateAction<TrimMarks>>
  timelineZoomMul: number
  setTimelineZoomMul: Dispatch<SetStateAction<number>>
  timelineWindowStartSec: number
  setTimelineWindowStartSec: Dispatch<SetStateAction<number>>
  timelinePaneRef: RefObject<HTMLDivElement | null>
  trimPointerRef: MutableRefObject<{
    pointerId: number
    mode: 'marquee' | 'inHandle' | 'outHandle'
    startClientX: number
    startSec: number
    dragging: boolean
  } | null>
  windowLenSec: number
  winStartEff: number
  markerGeometry: {
    leftPct: number
    widthPct: number
    inSec: number
    outSec: number
  } | null
  markerZoomOverlay: { leftPct: number; widthPct: number } | null
  markersDisjointZoomWindow: boolean
  ratio: number
  displayIn: number
  displayOut: number
  trimSpanSec: number
  rulerTicks: ReturnType<typeof buildTimelineRulerTicks>
  rulerPlayheadPct: number | null
  fpsProbeHint: number | null
}

export function useVideoTimelineMediaSync({
  mediaKey,
  videoRef,
  probe = null,
  onTrimRangeChange
}: Pick<VideoTimelineProps, 'mediaKey' | 'videoRef'> & {
  probe?: VideoTimelineProps['probe']
  onTrimRangeChange?: VideoTimelineProps['onTrimRangeChange']
}): VideoTimelineMediaSync {
  const [duration, setDuration] = useState(0)
  const [current, setCurrent] = useState(0)
  const [trim, setTrim] = useState<TrimMarks>({ inSec: 0, outSec: null })
  const [timelineZoomMul, setTimelineZoomMul] = useState(1)
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

  return {
    duration,
    current,
    trim,
    setTrim,
    timelineZoomMul,
    setTimelineZoomMul,
    timelineWindowStartSec,
    setTimelineWindowStartSec,
    timelinePaneRef,
    trimPointerRef,
    windowLenSec,
    winStartEff,
    markerGeometry,
    markerZoomOverlay,
    markersDisjointZoomWindow,
    ratio,
    displayIn,
    displayOut,
    trimSpanSec,
    rulerTicks,
    rulerPlayheadPct,
    fpsProbeHint
  }
}
