import {
  ffmpegExportAudioModeAllowsFilters,
  ffmpegExportAudioModeRequiresMkv,
  ffmpegExportAudioModeUsesBitrate
} from '../../../../shared/ffmpeg-export-audio-mode'
import type {
  FfmpegExportAudioModeId,
  FfmpegExportAudioNormalizeId,
  FfmpegExportSubtitleModeId
} from '../../../../shared/ffmpeg-export-contract'
import { PillSwitch } from '../PillSwitch'
import { uiText } from '../../locales/ui-text'
import { EXPORT_AUDIO_BITRATES } from '../../editor-ffmpeg-settings-rail-constants'
import type { EditorFfmpegSettingsRailProps } from './editor-ffmpeg-settings-rail-props'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- JSX section
export function EditorFfmpegSettingsRailAudioSection(props: EditorFfmpegSettingsRailProps) {
  const {
    panelOpen,
    persistMainWindowUiPanelToggle,
    editorFfmpegDetailBusy,
    exportBusy,
    snapshotBusy,
    probePending,
    bumpManualExportEdit,
    exportAudioMode,
    setExportAudioMode,
    exportContainer,
    setExportContainer,
    setStatusHint,
    exportAudioBitrate,
    setExportAudioBitrate,
    exportAudioGainDb,
    setExportAudioGainDb,
    exportAudioNormalize,
    setExportAudioNormalize,
    snapshotFormat,
    setSnapshotFormat,
    exportStripMetadata,
    setExportStripMetadata,
    exportStripChapters,
    setExportStripChapters,
    exportSubtitleMode,
    setExportSubtitleMode,
    lastSnapshotPath,
    handleOpenLastSnapshot,
    handleCopyLastSnapshotPath,
    ffmpegExportSelectOptions
  } = props
  return (
    <details
      className="app-settings-section"
      aria-label={uiText('editorFfmpegSectionAudio')}
      aria-describedby="editor-ffmpeg-settings-hint"
      aria-busy={editorFfmpegDetailBusy}
      open={panelOpen('ffmpegAudio')}
      onToggle={(e) => {
        persistMainWindowUiPanelToggle('ffmpegAudio', e.currentTarget.open)
      }}
    >
      <summary className="app-settings-summary" title={uiText('editorTooltipSectionAudio')}>
        {uiText('editorFfmpegSectionAudio')}
      </summary>
      <p id="ffmpegAudioSectionHint" className="app-settings-section-hint">
        {uiText('editorFfmpegSectionAudioHint')}
      </p>
      <div
        className="app-settings-grid"
        aria-describedby="ffmpegAudioSectionHint editor-ffmpeg-settings-hint"
      >
        <label
          className="app-field"
          title={uiText('editorTooltipAudioMode')}
          aria-describedby="ffmpegAudioSectionHint ffmpegAudioModeSelectHint editor-ffmpeg-settings-hint"
        >
          <span>{uiText('editorFieldAudioMode')}</span>
          <select
            className="app-control"
            title={uiText('editorTooltipAudioMode')}
            value={exportAudioMode}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const v = e.target.value as FfmpegExportAudioModeId
              setExportAudioMode(v)
              if (ffmpegExportAudioModeRequiresMkv(v) && exportContainer !== 'mkv') {
                setExportContainer('mkv')
                void window.fluxalloy.settings.setFfmpegExportContainer('mkv').catch(console.error)
                setStatusHint(uiText('editorExportAutoContainerMkv'))
              }
              void window.fluxalloy.settings.setFfmpegExportAudioMode(v).catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.audioModes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <span id="ffmpegAudioModeSelectHint" className="app-visually-hidden">
            {uiText('editorExportAudioModeSelectHint')}
          </span>
        </label>
        <label className="app-field" title={uiText('editorTooltipAacBitrate')}>
          <span>{uiText('editorFieldAacBitrate')}</span>
          <select
            className="app-control"
            title={uiText('editorTooltipAacBitrate')}
            value={exportAudioBitrate}
            disabled={
              exportBusy || snapshotBusy || !ffmpegExportAudioModeUsesBitrate(exportAudioMode)
            }
            onChange={(e) => {
              bumpManualExportEdit()
              const v = e.target.value
              setExportAudioBitrate(v)
              void window.fluxalloy.settings.setFfmpegExportAudioBitrate(v).catch(console.error)
            }}
          >
            {EXPORT_AUDIO_BITRATES.map((v) => (
              <option key={v} value={v}>
                AAC {v}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field" title={uiText('editorHintAudioGain')}>
          <span>{uiText('editorFieldAudioGain')}</span>
          <select
            className="app-control"
            title={uiText('editorHintAudioGain')}
            value={String(exportAudioGainDb)}
            disabled={
              exportBusy || snapshotBusy || !ffmpegExportAudioModeAllowsFilters(exportAudioMode)
            }
            onChange={(e) => {
              bumpManualExportEdit()
              const parsed = Number(e.target.value)
              const v = Number.isFinite(parsed) ? Math.trunc(parsed) : 0
              setExportAudioGainDb(v)
              void window.fluxalloy.settings
                .setFfmpegExportAudioGainDb(v === 0 ? null : v)
                .catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.audioGainOptions.map((p) => (
              <option key={p.value} value={String(p.value)}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field" title={uiText('editorHintAudioNormalize')}>
          <span>{uiText('editorFieldAudioNormalize')}</span>
          <select
            className="app-control"
            title={uiText('editorHintAudioNormalize')}
            value={exportAudioNormalize}
            disabled={
              exportBusy || snapshotBusy || !ffmpegExportAudioModeAllowsFilters(exportAudioMode)
            }
            onChange={(e) => {
              bumpManualExportEdit()
              const v = e.target.value as FfmpegExportAudioNormalizeId
              setExportAudioNormalize(v)
              void window.fluxalloy.settings.setFfmpegExportAudioNormalize(v).catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.audioNormalize.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field" title={uiText('editorTooltipSnapshotFormat')}>
          <span>{uiText('editorFieldSnapshotFormat')}</span>
          <select
            className="app-control"
            title={uiText('editorTooltipSnapshotFormat')}
            value={snapshotFormat}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              const v = e.target.value === 'jpg' ? 'jpg' : 'png'
              setSnapshotFormat(v)
              void window.fluxalloy.settings.setFfmpegSnapshotFormat(v).catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.snapshotFormats.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <div className="app-field app-field-switch">
          <span>{uiText('editorStripMetadataSpan')}</span>
          <PillSwitch
            label={uiText('editorStripMetadataPillLabel')}
            tooltip={uiText('editorTooltipStripMetadata')}
            checked={exportStripMetadata}
            describedBy="ffmpegAudioSectionHint ffmpegStripMetadataHint"
            disabled={exportBusy || snapshotBusy}
            onToggle={() => {
              bumpManualExportEdit()
              const next = !exportStripMetadata
              setExportStripMetadata(next)
              void window.fluxalloy.settings.setFfmpegExportStripMetadata(next).catch(console.error)
            }}
          />
          <span id="ffmpegStripMetadataHint" className="app-visually-hidden">
            {uiText('editorStripMetadataHint')}
          </span>
        </div>
        <div className="app-field app-field-switch">
          <span>{uiText('editorStripChaptersSpan')}</span>
          <PillSwitch
            label={uiText('editorStripChaptersPillLabel')}
            tooltip={uiText('editorTooltipStripChapters')}
            checked={exportStripChapters}
            describedBy="ffmpegAudioSectionHint ffmpegStripChaptersHint"
            disabled={exportBusy || snapshotBusy}
            onToggle={() => {
              bumpManualExportEdit()
              const next = !exportStripChapters
              setExportStripChapters(next)
              void window.fluxalloy.settings.setFfmpegExportStripChapters(next).catch(console.error)
            }}
          />
          <span id="ffmpegStripChaptersHint" className="app-visually-hidden">
            {uiText('editorStripChaptersHint')}
          </span>
        </div>
        <label className="app-field" title={uiText('editorHintExportSubtitles')}>
          <span>{uiText('editorFieldExportSubtitles')}</span>
          <select
            className="app-control"
            title={uiText('editorHintExportSubtitles')}
            value={exportSubtitleMode}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const v: FfmpegExportSubtitleModeId = e.target.value === 'copy' ? 'copy' : 'drop'
              setExportSubtitleMode(v)
              void window.fluxalloy.settings.setFfmpegExportSubtitleMode(v).catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.subtitleModes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {lastSnapshotPath ? (
        <div
          className="app-settings-actions"
          role="toolbar"
          aria-orientation="horizontal"
          aria-label={uiText('editorSnapshotLastActionsToolbarAria')}
          aria-describedby="ffmpegAudioSectionHint editor-ffmpeg-settings-hint"
          aria-busy={exportBusy || snapshotBusy || probePending}
        >
          <button
            type="button"
            className="app-btn app-btn-compact"
            disabled={exportBusy || snapshotBusy}
            aria-describedby="ffmpegAudioSectionHint editor-ffmpeg-settings-hint"
            title={uiText('editorTooltipSnapshotLastFile')}
            onClick={() => {
              void handleOpenLastSnapshot('file')
            }}
          >
            {uiText('editorSnapshotLastFile')}
          </button>
          <button
            type="button"
            className="app-btn app-btn-compact"
            disabled={exportBusy || snapshotBusy}
            aria-describedby="ffmpegAudioSectionHint editor-ffmpeg-settings-hint"
            title={uiText('editorTooltipSnapshotLastFolder')}
            onClick={() => {
              void handleOpenLastSnapshot('folder')
            }}
          >
            {uiText('editorSnapshotLastFolder')}
          </button>
          <button
            type="button"
            className="app-btn app-btn-compact"
            disabled={exportBusy || snapshotBusy}
            aria-describedby="ffmpegAudioSectionHint editor-ffmpeg-settings-hint"
            title={uiText('editorTooltipSnapshotCopyPath')}
            onClick={() => {
              void handleCopyLastSnapshotPath()
            }}
          >
            {uiText('editorCopy')}
          </button>
        </div>
      ) : null}
    </details>
  )
}
