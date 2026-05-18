import type { KeyboardEvent, PointerEvent } from 'react'

import type { VideoTimelineProps } from './video-timeline-props'
import type { VideoTimelineMediaSync } from './use-video-timeline-media-sync'

export type VideoTimelineControllerResult = {
  mediaKey: VideoTimelineProps['mediaKey']
  mediaUrl: VideoTimelineProps['mediaUrl']
  probe: VideoTimelineProps['probe']
} & {
  duration: VideoTimelineMediaSync['duration']
  pipelineBusy: boolean
  displayIn: VideoTimelineMediaSync['displayIn']
  displayOut: VideoTimelineMediaSync['displayOut']
  trimSpanSec: VideoTimelineMediaSync['trimSpanSec']
  current: VideoTimelineMediaSync['current']
  fpsProbeHint: VideoTimelineMediaSync['fpsProbeHint']
  timelineZoomMul: VideoTimelineMediaSync['timelineZoomMul']
  winStartEff: VideoTimelineMediaSync['winStartEff']
  windowLenSec: VideoTimelineMediaSync['windowLenSec']
  saveFrameDisabled: boolean
  saveFrameBusy: boolean
  onJumpToTrimExport: VideoTimelineProps['onJumpToTrimExport']
  onSaveFrame: VideoTimelineProps['onSaveFrame']
  onStartExport: VideoTimelineProps['onStartExport']
  captureInFromPlayhead: () => void
  captureOutFromPlayhead: () => void
  resetTrimToFull: () => void
  handleTimelineZoomIn: () => void
  handleTimelineZoomOut: () => void
  timelinePaneRef: VideoTimelineMediaSync['timelinePaneRef']
  markersDisjointZoomWindow: VideoTimelineMediaSync['markersDisjointZoomWindow']
  ratio: VideoTimelineMediaSync['ratio']
  markerZoomOverlay: VideoTimelineMediaSync['markerZoomOverlay']
  rulerPlayheadPct: VideoTimelineMediaSync['rulerPlayheadPct']
  rulerTicks: VideoTimelineMediaSync['rulerTicks']
  onTimelinePanePointerDownCapture: (ev: PointerEvent<HTMLDivElement>) => void
  onTimelinePanePointerMove: (ev: PointerEvent<HTMLDivElement>) => void
  onTimelinePanePointerUpOrCancel: (ev: PointerEvent<HTMLDivElement>) => void
  onTimelinePaneLostPointerCapture: (ev: PointerEvent<HTMLDivElement>) => void
  handleTimelinePaneKeyDown: (ev: KeyboardEvent<HTMLDivElement>) => void
}
