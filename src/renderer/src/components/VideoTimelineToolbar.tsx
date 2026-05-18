import type { JSX } from 'react'

import { miniIconTitle, uiText, uiTextVars } from '../locales/ui-text'
import {
  formatProbePositionLine,
  formatTimelineTime,
  formatTimelineTimeWithMs,
  TIMELINE_ZOOM_MAX
} from './video-timeline-helpers'
import { IconImage, IconSave, IconScissors, IconZoomIn, IconZoomOut } from './LucideMiniIcons'

export interface VideoTimelineToolbarProps {
  duration: number
  pipelineBusy: boolean
  displayIn: number
  displayOut: number
  trimSpanSec: number
  current: number
  fpsProbeHint: number | null
  timelineZoomMul: number
  winStartEff: number
  windowLenSec: number
  saveFrameDisabled: boolean
  saveFrameBusy: boolean
  onCaptureIn: () => void
  onCaptureOut: () => void
  onResetTrim: () => void
  onJumpToTrimExport?: (() => void) | undefined
  onSaveFrame?: (() => void) | undefined
  onStartExport?: (() => void) | undefined
  onZoomIn: () => void
  onZoomOut: () => void
}

export function VideoTimelineToolbar(props: VideoTimelineToolbarProps): JSX.Element {
  const {
    duration,
    pipelineBusy,
    displayIn,
    displayOut,
    trimSpanSec,
    current,
    fpsProbeHint,
    timelineZoomMul,
    winStartEff,
    windowLenSec,
    saveFrameDisabled,
    saveFrameBusy,
    onCaptureIn,
    onCaptureOut,
    onResetTrim,
    onJumpToTrimExport,
    onSaveFrame,
    onStartExport,
    onZoomIn,
    onZoomOut
  } = props
  return (
    <div
      className="app-timeline-toolbar"
      role="toolbar"
      aria-orientation="horizontal"
      aria-label={uiText('videoTimelineToolbarAria')}
      aria-describedby="editor-video-timeline-hint"
      aria-busy={pipelineBusy}
    >
      <div
        className="app-timeline-toolbar-primary"
        role="group"
        aria-label={uiText('videoTimelineTrimGroupAria')}
        aria-describedby="editor-video-timeline-hint"
        aria-busy={pipelineBusy}
      >
        <button
          type="button"
          aria-describedby="editor-video-timeline-hint"
          className="app-btn app-btn-compact app-btn-timeline-in"
          disabled={duration <= 0}
          onClick={onCaptureIn}
          title={uiText('videoTimelineInHereTitle')}
        >
          {uiText('videoTimelineToolbarIn')}
        </button>
        <button
          type="button"
          aria-describedby="editor-video-timeline-hint"
          className="app-btn app-btn-compact app-btn-timeline-out"
          disabled={duration <= 0}
          onClick={onCaptureOut}
          title={uiText('videoTimelineOutHereTitle')}
        >
          {uiText('videoTimelineToolbarOut')}
        </button>
        <button
          type="button"
          aria-describedby="editor-video-timeline-hint"
          className="app-btn app-btn-compact app-btn-timeline-trim"
          disabled={duration <= 0}
          onClick={() => {
            onJumpToTrimExport?.()
          }}
          title={uiText('videoTimelineExportJumpTitle')}
        >
          <IconScissors title="" size={15} />
          <span>{uiText('videoTimelineToolbarTrim')}</span>
        </button>
        <button
          type="button"
          aria-describedby="editor-video-timeline-hint"
          className="app-btn app-btn-compact"
          disabled={duration <= 0}
          onClick={onResetTrim}
          title={uiText('videoTimelineResetTrimTitle')}
        >
          {uiText('videoTimelineResetTrimButton')}
        </button>
        <span
          className="app-timeline-badge app-timeline-badge--in"
          aria-label={uiTextVars('videoTimelineBadgeInAriaTemplate', {
            t: formatTimelineTimeWithMs(displayIn)
          })}
        >
          {uiTextVars('videoTimelineBadgeInTemplate', { t: formatTimelineTimeWithMs(displayIn) })}
        </span>
        <span
          className="app-timeline-badge app-timeline-badge--out"
          aria-label={uiTextVars('videoTimelineBadgeOutAriaTemplate', {
            t: formatTimelineTimeWithMs(displayOut)
          })}
        >
          {uiTextVars('videoTimelineBadgeOutTemplate', { t: formatTimelineTimeWithMs(displayOut) })}
        </span>
      </div>
      <div
        className="app-timeline-toolbar-center"
        role="group"
        aria-label={uiText('videoTimelineStatusReadoutGroupAria')}
        aria-describedby="editor-video-timeline-hint"
        aria-busy={pipelineBusy}
        title={uiTextVars('videoTimelineToolbarCenterTitle', {
          dur: formatTimelineTimeWithMs(trimSpanSec),
          pos: formatProbePositionLine(current, duration, fpsProbeHint)
        })}
      >
        <span className="app-timeline-toolbar-center-line">
          {uiTextVars('videoTimelineTrimDurationToolbar', {
            span: formatTimelineTimeWithMs(trimSpanSec)
          })}
        </span>
        <span className="app-timeline-toolbar-center-line app-timeline-toolbar-center-line--muted">
          <strong>{uiText('videoTimelinePositionLabel')}</strong>{' '}
          {formatProbePositionLine(current, duration, fpsProbeHint)}
        </span>
      </div>
      <div
        className="app-timeline-toolbar-export-cluster"
        role="group"
        aria-label={uiText('videoTimelineExportSnapshotGroupAria')}
        aria-describedby="editor-video-timeline-hint"
        aria-busy={pipelineBusy}
      >
        <button
          type="button"
          aria-describedby="editor-video-timeline-hint"
          className="app-btn app-btn-compact app-btn-timeline-snapshot"
          disabled={duration <= 0 || saveFrameDisabled}
          onClick={() => {
            onSaveFrame?.()
          }}
          title={uiText('videoTimelineSaveFrameTitle')}
        >
          <IconImage title="" size={15} />
          <span>
            {saveFrameBusy
              ? uiText('videoTimelineSaveFrameBusy')
              : uiText('videoTimelineSaveFrame')}
          </span>
        </button>
        <button
          type="button"
          aria-describedby="editor-video-timeline-hint"
          className="app-btn app-btn-compact app-btn-timeline-export"
          disabled={duration <= 0}
          onClick={() => {
            onStartExport?.()
          }}
          title={uiText('videoTimelineStartExportTitle')}
        >
          <IconSave title="" size={15} />
          <span>{uiText('videoTimelineStartExport')}</span>
        </button>
      </div>
      <div
        className="app-timeline-toolbar-zoom"
        role="group"
        aria-label={uiText('videoTimelineZoomRowAria')}
        aria-describedby="editor-video-timeline-hint"
        aria-busy={pipelineBusy}
      >
        <button
          type="button"
          className="app-icon-btn app-timeline-zoom-ico"
          aria-describedby="editor-video-timeline-hint"
          disabled={duration <= 0 || timelineZoomMul <= 1}
          onClick={onZoomOut}
          title={uiText('videoTimelineZoomOutTitle')}
        >
          <IconZoomOut />
          <span className="app-visually-hidden">{miniIconTitle('miniIconZoomOut')}</span>
        </button>
        <button
          type="button"
          className="app-icon-btn app-timeline-zoom-ico"
          aria-describedby="editor-video-timeline-hint"
          disabled={duration <= 0 || timelineZoomMul >= TIMELINE_ZOOM_MAX}
          onClick={onZoomIn}
          title={uiText('videoTimelineZoomInTitle')}
        >
          <IconZoomIn />
          <span className="app-visually-hidden">{miniIconTitle('miniIconZoomIn')}</span>
        </button>
        <span
          className="app-timeline-zoom-readout"
          title={uiText('videoTimelineZoomReadoutTitle')}
          role="status"
          aria-live="polite"
          aria-describedby="editor-video-timeline-hint"
        >
          {uiTextVars('videoTimelineZoomReadoutTemplate', {
            mul: timelineZoomMul,
            start: formatTimelineTime(winStartEff),
            end: formatTimelineTime(Math.min(duration, winStartEff + windowLenSec))
          })}
        </span>
      </div>
    </div>
  )
}
