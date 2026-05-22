import type { JSX, RefObject } from 'react'

import type { MediaProbeSuccess } from '../../../../shared/ffprobe-contract'
import type { RestoredSourceInfo } from '../../../../shared/preview-dialog-contract'
import PreviewTransport from '../PreviewTransport'
import VideoTimeline from '../VideoTimeline'
import { IconChevronLeft } from '../LucideMiniIcons'
import { basenameForAriaLabel } from '../../app-shell-ui-helpers'
import { uiText, uiTextVars } from '../../locales/ui-text'

export type EditorPreviewSectionProps = {
  editorPreviewRegionBusy: boolean
  preview: RestoredSourceInfo | null
  previewPlaybackUrl: string | null
  previewStackRef: RefObject<HTMLDivElement | null>
  videoRef: RefObject<HTMLVideoElement | null>
  probeInfo: MediaProbeSuccess | null
  probePending: boolean
  exportBusy: boolean
  snapshotBusy: boolean
  ffmpegSettingsRailOpen: boolean
  onShowFfmpegSettingsRail: () => void
  handlePreviewDrop: (files: FileList | null, dataTransfer?: DataTransfer | null) => Promise<void>
  handlePreviewVideoLoaded: (el: HTMLVideoElement) => void
  handlePreviewVideoError: (el: HTMLVideoElement) => void
  onTrimRangeSnapshot: (range: { inSec: number; outSec: number }) => void
  jumpToTrimExport: () => void
  handleExport: () => Promise<void>
  handleSnapshot: () => Promise<void>
}

export function EditorPreviewSection(props: EditorPreviewSectionProps): JSX.Element {
  const {
    editorPreviewRegionBusy,
    preview,
    previewPlaybackUrl,
    previewStackRef,
    videoRef,
    probeInfo,
    probePending,
    exportBusy,
    snapshotBusy,
    ffmpegSettingsRailOpen,
    onShowFfmpegSettingsRail,
    handlePreviewDrop,
    handlePreviewVideoLoaded,
    handlePreviewVideoError,
    onTrimRangeSnapshot,
    jumpToTrimExport,
    handleExport,
    handleSnapshot
  } = props
  const previewMediaKey = preview ? `${preview.path}|${previewPlaybackUrl ?? preview.mediaUrl}` : ''
  return (
    <section
      className="app-preview"
      aria-label={uiText('editorPreviewDropzoneAria')}
      aria-describedby={preview ? undefined : 'editor-preview-empty-hint'}
      aria-busy={editorPreviewRegionBusy}
      onDragOver={(event) => {
        event.preventDefault()
        event.stopPropagation()
      }}
      onDrop={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void handlePreviewDrop(event.dataTransfer.files, event.dataTransfer)
      }}
    >
      {preview ? (
        <>
          <div
            className="app-preview-stack"
            ref={previewStackRef}
            role="region"
            aria-label={uiText('editorPreviewStackAria')}
            aria-describedby="editor-preview-transport-hint editor-video-timeline-hint"
            aria-busy={editorPreviewRegionBusy}
          >
            <div
              className="app-preview-media-card"
              role="group"
              aria-label={uiText('editorPreviewMediaCardGroupAria')}
              aria-describedby="editor-preview-transport-hint editor-video-timeline-hint"
              aria-busy={editorPreviewRegionBusy}
            >
              <video
                key={previewMediaKey}
                ref={videoRef}
                className="app-preview-video"
                playsInline
                src={previewPlaybackUrl ?? preview.mediaUrl}
                aria-busy={editorPreviewRegionBusy}
                aria-label={uiTextVars('editorPreviewVideoAriaTemplate', {
                  name: basenameForAriaLabel(preview.path)
                })}
                onLoadedMetadata={(event) => {
                  handlePreviewVideoLoaded(event.currentTarget)
                }}
                onError={(event) => {
                  handlePreviewVideoError(event.currentTarget)
                }}
              />
              <PreviewTransport
                mediaKey={previewMediaKey}
                videoRef={videoRef}
                fullscreenRootRef={previewStackRef}
                disabled={exportBusy || snapshotBusy}
              />
            </div>
            <VideoTimeline
              key={previewMediaKey}
              mediaKey={previewMediaKey}
              mediaUrl={previewPlaybackUrl ?? preview.mediaUrl}
              probe={probeInfo}
              videoRef={videoRef}
              onTrimRangeChange={onTrimRangeSnapshot}
              onJumpToTrimExport={jumpToTrimExport}
              onStartExport={() => {
                void handleExport()
              }}
              onSaveFrame={() => {
                void handleSnapshot()
              }}
              saveFrameDisabled={exportBusy || snapshotBusy}
              saveFrameBusy={snapshotBusy}
              previewPipelineBusy={exportBusy || snapshotBusy || probePending}
            />
            <footer
              className="app-preview-caption"
              title={preview.path}
              aria-label={uiText('editorPreviewCaptionAria')}
              aria-describedby="editor-preview-transport-hint editor-video-timeline-hint"
              aria-busy={editorPreviewRegionBusy}
            >
              {preview.name}
            </footer>
          </div>
        </>
      ) : (
        <div
          className="app-preview-placeholder"
          role="region"
          aria-label={uiText('editorPreviewPlaceholderAria')}
          aria-describedby="editor-preview-empty-hint"
          aria-busy={probePending}
        >
          {uiText('editorPreviewEmptyLead')}
          <p id="editor-preview-empty-hint" className="app-preview-hint">
            {uiText('editorPreviewEmptyHint')}
          </p>
        </div>
      )}
      {!ffmpegSettingsRailOpen ? (
        <button
          type="button"
          className="app-ffmpeg-rail-restore app-icon-btn"
          onClick={() => {
            onShowFfmpegSettingsRail()
          }}
          title={uiText('editorFfmpegRailShowTitle')}
          aria-describedby="editor-ffmpeg-settings-hint"
        >
          <IconChevronLeft title="" size={18} />
          <span className="app-ffmpeg-rail-restore-text">
            {uiText('editorFfmpegRailRestoreLabel')}
          </span>
          <span className="app-visually-hidden">{uiText('editorFfmpegRailShowHidden')}</span>
        </button>
      ) : null}
    </section>
  )
}
