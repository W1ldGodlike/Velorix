import type { KeyboardEvent, PointerEvent, RefObject } from 'react'
import type { MediaProbeSuccess } from '../../../shared/ffprobe-contract'
import { uiText, uiTextVars } from '../locales/ui-text'
import {
  formatProbeAudioFact,
  formatProbeVideoFact,
  formatTimelineTime
} from './video-timeline-helpers'
import TimelineWaveform from './TimelineWaveform'

export interface VideoTimelineUnifiedPaneProps {
  duration: number
  pipelineBusy: boolean
  mediaKey: string
  mediaUrl: string
  winStartEff: number
  windowLenSec: number
  rulerTicks: readonly number[]
  timelinePaneRef: RefObject<HTMLDivElement | null>
  markersDisjointZoomWindow: boolean
  ratio: number
  current: number
  markerZoomOverlay: { leftPct: number; widthPct: number } | null
  rulerPlayheadPct: number | null
  probe: MediaProbeSuccess | null
  onPointerDownCapture: (ev: PointerEvent<HTMLDivElement>) => void
  onPointerMove: (ev: PointerEvent<HTMLDivElement>) => void
  onPointerUpOrCancel: (ev: PointerEvent<HTMLDivElement>) => void
  onLostPointerCapture: (ev: PointerEvent<HTMLDivElement>) => void
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- pane JSX
export function VideoTimelineUnifiedPane({
  duration,
  pipelineBusy,
  mediaKey,
  mediaUrl,
  winStartEff,
  windowLenSec,
  rulerTicks,
  timelinePaneRef,
  markersDisjointZoomWindow,
  ratio,
  current,
  markerZoomOverlay,
  rulerPlayheadPct,
  probe,
  onPointerDownCapture,
  onPointerMove,
  onPointerUpOrCancel,
  onLostPointerCapture,
  onKeyDown
}: VideoTimelineUnifiedPaneProps) {
  return (
    <>
      <div
        className="app-timeline-unified"
        role="region"
        aria-label={uiText('videoTimelineUnifiedRegionAria')}
        aria-busy={pipelineBusy}
      >
        <div
          className="app-timeline-pane"
          role="group"
          aria-label={uiText('videoTimelinePaneGroupAria')}
          aria-busy={pipelineBusy}
        >
          <div
            className="app-timeline-pane-visuals"
            role="group"
            aria-label={uiText('videoTimelinePaneVisualsGroupAria')}
            aria-busy={pipelineBusy}
          >
            <div className="app-timeline-ruler" aria-hidden="true">
              <div className="app-timeline-ruler-track">
                {rulerTicks.map((t) => (
                  <span
                    key={`ruler-tick-${String(t)}`}
                    className="app-timeline-ruler-tick"
                    style={{ left: `${((t - winStartEff) / windowLenSec) * 100}%` }}
                  >
                    <span className="app-timeline-ruler-label">{formatTimelineTime(t)}</span>
                  </span>
                ))}
              </div>
            </div>
            <div
              className="app-timeline-waveform-passive"
              role="group"
              aria-label={uiText('videoTimelineWaveformClusterAria')}
              aria-busy={pipelineBusy}
            >
              <TimelineWaveform
                key={mediaKey}
                mediaKey={mediaKey}
                mediaUrl={mediaUrl}
                durationSec={duration}
                windowStartSec={winStartEff}
                windowLenSec={windowLenSec}
              />
            </div>
          </div>
          <div
            ref={timelinePaneRef}
            className={`app-timeline-interaction-glass${markersDisjointZoomWindow ? ' app-timeline-interaction-glass-idle' : ''}`}
            tabIndex={0}
            role="slider"
            aria-label={uiText('videoTimelineUnifiedPaneAria')}
            aria-busy={pipelineBusy}
            aria-valuemin={0}
            aria-valuemax={1000}
            aria-valuenow={Math.round(Math.min(1, Math.max(0, ratio)) * 1000)}
            aria-valuetext={uiTextVars('videoTimelineRulerValuetextTemplate', {
              current: formatTimelineTime(current),
              winStart: formatTimelineTime(winStartEff),
              winEnd: formatTimelineTime(Math.min(duration, winStartEff + windowLenSec))
            })}
            title={
              markersDisjointZoomWindow
                ? uiText('videoTimelineMarkersOutsideWindowTitle')
                : uiText('videoTimelineUnifiedPaneHintTitle')
            }
            onPointerDownCapture={onPointerDownCapture}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUpOrCancel}
            onPointerCancel={onPointerUpOrCancel}
            onLostPointerCapture={onLostPointerCapture}
            onKeyDown={onKeyDown}
          >
            {rulerPlayheadPct !== null && rulerPlayheadPct >= -1 && rulerPlayheadPct <= 101 ? (
              <span
                className="app-timeline-pane-playhead"
                style={{ left: `${Math.min(100, Math.max(0, rulerPlayheadPct))}%` }}
                aria-hidden
              />
            ) : null}
            {markerZoomOverlay ? (
              <>
                <div
                  className="app-timeline-marker-selection"
                  style={{
                    left: `${markerZoomOverlay.leftPct}%`,
                    width: `${markerZoomOverlay.widthPct}%`
                  }}
                />
                <div
                  className="app-timeline-handle app-timeline-handle--in"
                  style={{ left: `${markerZoomOverlay.leftPct}%` }}
                  title={uiText('videoTimelineInHandleDragTitle')}
                />
                <div
                  className="app-timeline-handle app-timeline-handle--out"
                  style={{ left: `${markerZoomOverlay.leftPct + markerZoomOverlay.widthPct}%` }}
                  title={uiText('videoTimelineOutHandleDragTitle')}
                />
              </>
            ) : null}
          </div>
        </div>
      </div>
      <div
        className="app-timeline-footer"
        aria-label={uiText('videoTimelineFooterAria')}
        aria-busy={pipelineBusy}
      >
        <div
          className="app-timeline-footer-spec"
          role="group"
          aria-label={uiText('videoTimelineFooterSpecGroupAria')}
          aria-busy={pipelineBusy}
        >
          <span title={uiText('videoTimelineVideoStreamTitle')}>
            <strong>{uiText('videoTimelineVideoLabel')}</strong> {formatProbeVideoFact(probe)}
          </span>
          <span title={uiText('videoTimelineAudioStreamTitle')}>
            <strong>{uiText('videoTimelineAudioLabel')}</strong> {formatProbeAudioFact(probe)}
          </span>
        </div>
      </div>
    </>
  )
}
