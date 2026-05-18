import { useVideoTimelineMediaSync } from './use-video-timeline-media-sync'
import { useVideoTimelineTrimControls } from './use-video-timeline-trim-controls'
import type { VideoTimelineProps } from './video-timeline-props'
import type { VideoTimelineControllerResult } from './video-timeline-controller-result'

export function useVideoTimelineController(
  props: VideoTimelineProps
): VideoTimelineControllerResult {
  const {
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
  } = props

  const sync = useVideoTimelineMediaSync({
    mediaKey,
    videoRef,
    probe,
    ...(onTrimRangeChange !== undefined ? { onTrimRangeChange } : {})
  })
  const controls = useVideoTimelineTrimControls({ videoRef, probe }, sync)

  const pipelineBusy = saveFrameBusy || previewPipelineBusy

  return {
    mediaKey,
    mediaUrl,
    probe,
    duration: sync.duration,
    pipelineBusy,
    displayIn: sync.displayIn,
    displayOut: sync.displayOut,
    trimSpanSec: sync.trimSpanSec,
    current: sync.current,
    fpsProbeHint: sync.fpsProbeHint,
    timelineZoomMul: sync.timelineZoomMul,
    winStartEff: sync.winStartEff,
    windowLenSec: sync.windowLenSec,
    saveFrameDisabled,
    saveFrameBusy,
    onJumpToTrimExport,
    onSaveFrame,
    onStartExport,
    captureInFromPlayhead: controls.captureInFromPlayhead,
    captureOutFromPlayhead: controls.captureOutFromPlayhead,
    resetTrimToFull: controls.resetTrimToFull,
    handleTimelineZoomIn: controls.handleTimelineZoomIn,
    handleTimelineZoomOut: controls.handleTimelineZoomOut,
    timelinePaneRef: sync.timelinePaneRef,
    markersDisjointZoomWindow: sync.markersDisjointZoomWindow,
    ratio: sync.ratio,
    markerZoomOverlay: sync.markerZoomOverlay,
    rulerPlayheadPct: sync.rulerPlayheadPct,
    rulerTicks: sync.rulerTicks,
    onTimelinePanePointerDownCapture: controls.onTimelinePanePointerDownCapture,
    onTimelinePanePointerMove: controls.onTimelinePanePointerMove,
    onTimelinePanePointerUpOrCancel: controls.onTimelinePanePointerUpOrCancel,
    onTimelinePaneLostPointerCapture: controls.onTimelinePaneLostPointerCapture,
    handleTimelinePaneKeyDown: controls.handleTimelinePaneKeyDown
  }
}
