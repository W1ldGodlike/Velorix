import { useCallback, type KeyboardEvent, type PointerEvent } from 'react'

import { snapSeekTimeSec } from '../../../shared/video-frame-snap'
import {
  approxVideoFpsFromProbe,
  clampTrimRange,
  minEffectiveTrimGap,
  TIMELINE_ZOOM_MAX,
  TRIM_DRAG_THRESHOLD_PX,
  TRIM_HANDLE_HIT_PX
} from './video-timeline-helpers'
import type { VideoTimelineProps } from './video-timeline-props'
import type { VideoTimelineMediaSync } from './use-video-timeline-media-sync'

export function useVideoTimelineTrimControls(
  props: Pick<VideoTimelineProps, 'videoRef' | 'probe'>,
  sync: VideoTimelineMediaSync
): {
  seek: (fraction: number) => void
  handleTimelinePaneKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void
  handleTimelineZoomIn: () => void
  handleTimelineZoomOut: () => void
  captureInFromPlayhead: () => void
  captureOutFromPlayhead: () => void
  resetTrimToFull: () => void
  onTimelinePanePointerDownCapture: (ev: PointerEvent<HTMLDivElement>) => void
  onTimelinePanePointerMove: (ev: PointerEvent<HTMLDivElement>) => void
  onTimelinePanePointerUpOrCancel: (ev: PointerEvent<HTMLDivElement>) => void
  onTimelinePaneLostPointerCapture: (ev: PointerEvent<HTMLDivElement>) => void
} {
  const { videoRef, probe = null } = props
  const {
    duration,
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
    markerZoomOverlay
  } = sync

  const seek = useCallback(
    (fraction: number): void => {
      const v = videoRef.current
      if (!v || !Number.isFinite(duration) || duration <= 0) {
        return
      }
      const next = winStartEff + fraction * windowLenSec
      const fps = approxVideoFpsFromProbe(probe)
      v.currentTime = snapSeekTimeSec(next, duration, fps)
    },
    [videoRef, duration, winStartEff, windowLenSec, probe]
  )

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
    [duration, windowLenSec, winStartEff, timelinePaneRef]
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
    [duration, windowLenSec, winStartEff, seek, trimPointerRef]
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
    [markerZoomOverlay, timelinePaneRef]
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
    [duration, resolveTrimPointerMode, timelineSecFromPaneClientX, trimPointerRef]
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
    [duration, probe, timelineSecFromPaneClientX, setTrim, trimPointerRef]
  )

  const onTimelinePanePointerUpOrCancel = useCallback(
    (ev: PointerEvent<HTMLDivElement>): void => {
      const st = trimPointerRef.current
      if (!st || st.pointerId !== ev.pointerId) {
        return
      }
      endTrimPointerGesture(ev.currentTarget, ev.pointerId, true)
    },
    [endTrimPointerGesture, trimPointerRef]
  )

  const onTimelinePaneLostPointerCapture = useCallback(
    (ev: PointerEvent<HTMLDivElement>): void => {
      const st = trimPointerRef.current
      if (!st || st.pointerId !== ev.pointerId) {
        return
      }
      endTrimPointerGesture(ev.currentTarget, ev.pointerId, false)
    },
    [endTrimPointerGesture, trimPointerRef]
  )

  return {
    seek,
    handleTimelinePaneKeyDown,
    handleTimelineZoomIn,
    handleTimelineZoomOut,
    captureInFromPlayhead,
    captureOutFromPlayhead,
    resetTrimToFull,
    onTimelinePanePointerDownCapture,
    onTimelinePanePointerMove,
    onTimelinePanePointerUpOrCancel,
    onTimelinePaneLostPointerCapture
  }
}
