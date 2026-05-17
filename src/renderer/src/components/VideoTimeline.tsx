import { uiText } from '../locales/ui-text'
import { useVideoTimelineController } from './use-video-timeline-controller'
import type { VideoTimelineProps } from './video-timeline-props'
import { VideoTimelineToolbar } from './VideoTimelineToolbar'
import { VideoTimelineUnifiedPane } from './VideoTimelineUnifiedPane'

export type { VideoTimelineProps } from './video-timeline-props'

export default function VideoTimeline(props: VideoTimelineProps): React.JSX.Element {
  const ctl = useVideoTimelineController(props)

  return (
    <>
      <p id="editor-video-timeline-hint" className="app-visually-hidden">
        {uiText('videoTimelineStackHint')}
      </p>
      <div
        className="app-timeline-stack"
        role="region"
        aria-label={uiText('videoTimelineStackAria')}
        aria-describedby="editor-video-timeline-hint"
        aria-busy={ctl.pipelineBusy}
      >
      {ctl.duration > 0 ? (
        <VideoTimelineToolbar
          duration={ctl.duration}
          pipelineBusy={ctl.pipelineBusy}
          displayIn={ctl.displayIn}
          displayOut={ctl.displayOut}
          trimSpanSec={ctl.trimSpanSec}
          current={ctl.current}
          fpsProbeHint={ctl.fpsProbeHint}
          timelineZoomMul={ctl.timelineZoomMul}
          winStartEff={ctl.winStartEff}
          windowLenSec={ctl.windowLenSec}
          saveFrameDisabled={ctl.saveFrameDisabled}
          saveFrameBusy={ctl.saveFrameBusy}
          onCaptureIn={ctl.captureInFromPlayhead}
          onCaptureOut={ctl.captureOutFromPlayhead}
          onResetTrim={ctl.resetTrimToFull}
          onJumpToTrimExport={ctl.onJumpToTrimExport}
          onSaveFrame={ctl.onSaveFrame}
          onStartExport={ctl.onStartExport}
          onZoomIn={ctl.handleTimelineZoomIn}
          onZoomOut={ctl.handleTimelineZoomOut}
        />
      ) : null}
      {ctl.duration > 0 ? (
        <VideoTimelineUnifiedPane
          duration={ctl.duration}
          pipelineBusy={ctl.pipelineBusy}
          mediaKey={ctl.mediaKey}
          mediaUrl={ctl.mediaUrl}
          winStartEff={ctl.winStartEff}
          windowLenSec={ctl.windowLenSec}
          rulerTicks={ctl.rulerTicks}
          timelinePaneRef={ctl.timelinePaneRef}
          markersDisjointZoomWindow={ctl.markersDisjointZoomWindow}
          ratio={ctl.ratio}
          current={ctl.current}
          markerZoomOverlay={ctl.markerZoomOverlay}
          rulerPlayheadPct={ctl.rulerPlayheadPct}
          probe={ctl.probe}
          onPointerDownCapture={ctl.onTimelinePanePointerDownCapture}
          onPointerMove={ctl.onTimelinePanePointerMove}
          onPointerUpOrCancel={ctl.onTimelinePanePointerUpOrCancel}
          onLostPointerCapture={ctl.onTimelinePaneLostPointerCapture}
          onKeyDown={ctl.handleTimelinePaneKeyDown}
        />
      ) : null}
    </div>
    </>
  )
}
