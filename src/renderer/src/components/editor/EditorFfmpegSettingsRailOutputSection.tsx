import { uiText, uiTextVars } from '../../locales/ui-text'
import type { EditorFfmpegSettingsRailProps } from './editor-ffmpeg-settings-rail-props'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- JSX section
export function EditorFfmpegSettingsRailOutputSection(props: EditorFfmpegSettingsRailProps) {
  const {
    panelOpen,
    persistMainWindowUiPanelToggle,
    editorFfmpegDetailBusy,
    exportBusy,
    snapshotBusy,
    probePending,
    bumpManualExportEdit,
    exportExtraArgsLine,
    setExportExtraArgsLine,
    exportExtraArgsParsed,
    exportPreview,
    exportPreviewCommand,
    exportPreviewHint,
    handleCopyExportPreview,
    lastExportPath,
    handleOpenLastExport,
    handleCopyLastExportPath
  } = props
  return (
    <details
      id="editor-ffmpeg-export-output"
      className="app-settings-section"
      aria-label={uiText('editorFfmpegSectionOutput')}
      aria-busy={editorFfmpegDetailBusy}
      open={panelOpen('ffmpegOutput')}
      onToggle={(e) => {
        persistMainWindowUiPanelToggle('ffmpegOutput', e.currentTarget.open)
      }}
    >
      <summary className="app-settings-summary" title={uiText('editorTooltipSectionOutput')}>
        {uiText('editorFfmpegSectionOutput')}
      </summary>
      <p id="ffmpegOutputSectionHint" className="app-settings-section-hint">
        {uiText('editorFfmpegSectionOutputHint')}
      </p>
      <div className="app-settings-stack" aria-describedby="ffmpegOutputSectionHint">
        <label className="app-field app-field-block" title={uiText('editorExportExtraArgsHint')}>
          <span>{uiText('editorExportExtraArgsLabel')}</span>
          <textarea
            className="app-downloads-url-input app-control"
            value={exportExtraArgsLine}
            placeholder={uiText('editorExportExtraArgsPlaceholder')}
            rows={2}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const v = e.target.value
              setExportExtraArgsLine(v)
              void window.fluxalloy.settings.setFfmpegExportExtraArgsLine(v).catch(console.error)
            }}
          />
          <span className="app-settings-section-hint">{uiText('editorExportExtraArgsHint')}</span>
          {!exportExtraArgsParsed.ok ? (
            <span className="app-field-error" role="alert">
              {uiTextVars('editorExportExtraArgsParseError', {
                detail: exportExtraArgsParsed.error
              })}
            </span>
          ) : null}
        </label>
        <details
          className="app-export-preview app-export-preview-nested"
          aria-label={uiText('editorExportPreviewDetailsAria')}
          aria-busy={editorFfmpegDetailBusy}
          open={panelOpen('exportCommandPreview')}
          onToggle={(e) => {
            persistMainWindowUiPanelToggle('exportCommandPreview', e.currentTarget.open)
          }}
        >
          <summary
            className="app-export-preview-summary"
            title={uiText('editorTooltipExportCommandPreview')}
          >
            {uiText('editorExportCommandPreviewSummary')}
          </summary>
          <div
            className="app-export-preview-body"
            role="region"
            aria-label={uiText('editorExportPreviewBodyRegionAria')}
            aria-busy={exportBusy || snapshotBusy || probePending}
          >
            <pre
              className="app-export-preview-pre"
              aria-label={uiText('editorAriaExportFfmpegCommand')}
              aria-describedby="exportCommandPreviewHint"
            >
              {exportPreview.pass1Command
                ? `${uiText('editorExportPreviewPass1')}\n${exportPreview.pass1Command}\n\n${uiText('editorExportPreviewPass2')}\n${exportPreviewCommand}`
                : exportPreviewCommand}
            </pre>
            <div
              className="app-export-preview-actions"
              role="toolbar"
              aria-orientation="horizontal"
              aria-label={uiText('editorExportPreviewActionsToolbarAria')}
              aria-busy={exportBusy || snapshotBusy || probePending}
            >
              <button
                type="button"
                className="app-btn app-btn-compact"
                onClick={() => {
                  void handleCopyExportPreview()
                }}
                title={uiText('editorCopyFfmpegCommandTitle')}
                aria-describedby="exportCommandPreviewHint"
              >
                {uiText('editorCopy')}
              </button>
              <span id="exportCommandPreviewHint" className="app-export-preview-hint">
                {exportPreviewHint()}
              </span>
            </div>
          </div>
        </details>
        {lastExportPath ? (
          <div
            className="app-settings-actions"
            role="toolbar"
            aria-orientation="horizontal"
            aria-label={uiText('editorExportLastOutputActionsToolbarAria')}
            aria-busy={exportBusy || snapshotBusy || probePending}
          >
            <button
              type="button"
              className="app-btn app-btn-compact"
              disabled={exportBusy || snapshotBusy}
              aria-describedby="ffmpegOutputSectionHint"
              title={uiText('editorTooltipExportLastFile')}
              onClick={() => {
                void handleOpenLastExport('file')
              }}
            >
              {uiText('editorExportLastFile')}
            </button>
            <button
              type="button"
              className="app-btn app-btn-compact"
              disabled={exportBusy || snapshotBusy}
              aria-describedby="ffmpegOutputSectionHint"
              title={uiText('editorTooltipExportLastFolder')}
              onClick={() => {
                void handleOpenLastExport('folder')
              }}
            >
              {uiText('editorExportLastFolder')}
            </button>
            <button
              type="button"
              className="app-btn app-btn-compact"
              disabled={exportBusy || snapshotBusy}
              aria-describedby="ffmpegOutputSectionHint"
              title={uiText('editorTooltipExportOpenPreview')}
              onClick={() => {
                void handleOpenLastExport('preview')
              }}
            >
              {uiText('processingHistoryOpenPreview')}
            </button>
            <button
              type="button"
              className="app-btn app-btn-compact"
              disabled={exportBusy || snapshotBusy}
              aria-describedby="ffmpegOutputSectionHint"
              title={uiText('editorTooltipCopyExportPath')}
              onClick={() => {
                void handleCopyLastExportPath()
              }}
            >
              {uiText('editorCopyExportPath')}
            </button>
          </div>
        ) : null}
      </div>
    </details>
  )
}
