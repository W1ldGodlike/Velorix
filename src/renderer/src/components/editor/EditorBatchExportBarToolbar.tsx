import type { JSX } from 'react'

import { DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX } from '../../../../shared/ffmpeg-export-batch-output-suffix'
import type { FfmpegExportBatchConcurrency } from '../../../../shared/ffmpeg-export-batch-contract'
import {
  IconBan,
  IconCopy,
  IconDownload,
  IconFilm,
  IconFolder,
  IconFolderOpen,
  IconHome,
  IconPlay,
  IconQueueFile,
  IconQueueRetry,
  IconQueueTrash,
  IconQueueX,
  IconSave,
  IconScissors,
  IconSettings
} from '../LucideMiniIcons'
import { uiText } from '../../locales/ui-text'
import type { EditorBatchExportBarProps } from './editor-batch-export-bar-props'

export function EditorBatchExportBarToolbar(props: EditorBatchExportBarProps): JSX.Element {
  const { batchExportBusy, batchSnapshot, batchOutputSuffix, setBatchOutputSuffix, batchOutputDirectory, previewPath, handleBatchPickOutputFolder, handleBatchRevealSharedOutputFolder, handleBatchClearOutputDirectory, handleBatchPickFiles, handleBatchPickFolder, handleBatchAddCurrentPreview, handleBatchAddDownloadsDone, handleBatchStart, handleBatchCancel, handleBatchRetryFailed, handleBatchRetryFailedAndStart, handleBatchClearCompleted, handleBatchCopyInputPaths, handleBatchCopyOutputPaths, handleBatchSaveReport, handleBatchRemoveWaiting } = props

  return (
          <div
            className="app-settings-grid app-batch-export-toolbar"
            role="group"
            aria-label={uiText('batchExportPanelFormGroupAria')}
            aria-describedby="batch-export-panel-hint"
            aria-busy={batchExportBusy}
          >
            <label className="app-field">
              <span className="app-field-label-row">
                <IconScissors size={16} aria-hidden />
                {uiText('batchExportOutputSuffixLabel')}
              </span>
              <input
                type="text"
                className="app-control"
                value={batchOutputSuffix}
                disabled={batchExportBusy}
                spellCheck={false}
                title={uiText('batchExportOutputSuffixHint')}
                aria-describedby="batch-export-panel-hint batch-export-suffix-hint"
                onChange={(e) => {
                  setBatchOutputSuffix(e.target.value)
                }}
                onBlur={() => {
                  void window.fluxalloy.settings
                    .setFfmpegExportBatchOutputSuffix(batchOutputSuffix)
                    .then((s) => {
                      setBatchOutputSuffix(
                        typeof s.ffmpegExportBatchOutputSuffix === 'string' &&
                          s.ffmpegExportBatchOutputSuffix.trim().length > 0
                          ? s.ffmpegExportBatchOutputSuffix.trim()
                          : DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX
                      )
                    })
                    .catch(console.error)
                }}
              />
              <span id="batch-export-suffix-hint" className="app-visually-hidden">
                {uiText('batchExportOutputSuffixHint')}
              </span>
            </label>
            <label className="app-field" style={{ gridColumn: '1 / -1' }}>
              <span className="app-field-label-row">
                <IconFolder size={16} aria-hidden />
                {uiText('batchExportOutputDirLabel')}
              </span>
              <div
                className="app-batch-export-dir-row"
                role="group"
                aria-label={uiText('batchExportOutputDirRowGroupAria')}
                aria-describedby="batch-export-panel-hint batch-export-outdir-hint"
                aria-busy={batchExportBusy}
              >
                <input
                  type="text"
                  className="app-control"
                  readOnly
                  value={batchOutputDirectory}
                  placeholder={uiText('batchExportOutputDirPlaceholder')}
                  title={batchOutputDirectory || uiText('batchExportOutputDirPlaceholder')}
                  disabled={batchExportBusy}
                  aria-describedby="batch-export-outdir-hint"
                />
                <button
                  type="button"
                  className="app-btn app-btn-icon-leading"
                  aria-describedby="batch-export-panel-hint batch-export-outdir-hint batch-export-drop-hint"
                  disabled={batchExportBusy}
                  onClick={() => {
                    void handleBatchPickOutputFolder()
                  }}
                >
                  <IconFolder size={16} aria-hidden />
                  {uiText('batchExportOutputDirPick')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-icon-leading"
                  aria-describedby="batch-export-panel-hint batch-export-outdir-hint batch-export-drop-hint"
                  disabled={batchExportBusy || batchOutputDirectory.length === 0}
                  onClick={() => {
                    void handleBatchRevealSharedOutputFolder()
                  }}
                >
                  <IconFolderOpen size={16} aria-hidden />
                  {uiText('batchExportOutputDirOpen')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-icon-leading"
                  aria-describedby="batch-export-panel-hint batch-export-outdir-hint batch-export-drop-hint"
                  disabled={batchExportBusy || batchOutputDirectory.length === 0}
                  onClick={() => {
                    void handleBatchClearOutputDirectory()
                  }}
                >
                  <IconHome size={16} aria-hidden />
                  {uiText('batchExportOutputDirClear')}
                </button>
              </div>
              <span id="batch-export-outdir-hint" className="app-field-hint">
                {uiText('batchExportOutputDirHint')}
              </span>
            </label>
            <label className="app-field">
              <span className="app-field-label-row">
                <IconSettings size={16} aria-hidden />
                {uiText('batchExportConcurrency')}
              </span>
              <select
                className="app-control"
                aria-describedby="batch-export-panel-hint batch-export-concurrency-hint"
                value={String(batchSnapshot?.concurrency ?? 'auto')}
                disabled={batchExportBusy}
                onChange={(e) => {
                  const raw = e.target.value
                  let v: FfmpegExportBatchConcurrency = 'auto'
                  if (raw === '1') {
                    v = 1
                  } else if (raw === '2') {
                    v = 2
                  } else if (raw === '4') {
                    v = 4
                  }
                  void window.fluxalloy.batchExport.setConcurrency(v).catch(console.error)
                }}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="auto">{uiText('batchExportConcurrencyAuto')}</option>
              </select>
              <span id="batch-export-concurrency-hint" className="app-field-help">
                {uiText('batchExportConcurrencyHint')}
              </span>
            </label>
            <div
              className="app-batch-export-actions"
              role="toolbar"
              aria-orientation="horizontal"
              aria-label={uiText('batchExportActionsToolbarAria')}
              aria-describedby="batch-export-panel-hint batch-export-drop-hint"
              aria-busy={batchExportBusy}
            >
              <button
                type="button"
                className="app-btn app-btn-icon-leading"
                aria-describedby="batch-export-panel-hint batch-export-drop-hint"
                disabled={batchExportBusy}
                onClick={() => {
                  void handleBatchPickFiles()
                }}
              >
                <IconQueueFile size={16} aria-hidden />
                {uiText('batchExportAddFiles')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-icon-leading"
                aria-describedby="batch-export-panel-hint batch-export-drop-hint"
                disabled={batchExportBusy}
                onClick={() => {
                  void handleBatchPickFolder()
                }}
              >
                <IconFolderOpen size={16} aria-hidden />
                {uiText('batchExportAddFolder')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-icon-leading"
                aria-describedby="batch-export-panel-hint batch-export-drop-hint"
                disabled={batchExportBusy || !previewPath}
                onClick={() => {
                  void handleBatchAddCurrentPreview()
                }}
              >
                <IconFilm size={16} aria-hidden />
                {uiText('batchExportAddCurrentPreview')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-icon-leading"
                aria-describedby="batch-export-panel-hint batch-export-drop-hint"
                disabled={batchExportBusy}
                onClick={() => {
                  void handleBatchAddDownloadsDone()
                }}
              >
                <IconDownload size={16} aria-hidden />
                {uiText('batchExportAddDownloadsDone')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-primary app-btn-icon-leading"
                aria-describedby="batch-export-panel-hint batch-export-drop-hint"
                disabled={batchExportBusy || (batchSnapshot?.rows.length ?? 0) === 0}
                onClick={() => {
                  void handleBatchStart()
                }}
              >
                <IconPlay size={16} aria-hidden />
                {uiText('batchExportStart')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-icon-leading"
                aria-describedby="batch-export-panel-hint batch-export-drop-hint"
                disabled={!batchExportBusy}
                onClick={() => {
                  void handleBatchCancel()
                }}
              >
                <IconBan size={16} aria-hidden />
                {uiText('batchExportCancel')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-icon-leading"
                aria-describedby="batch-export-panel-hint batch-export-drop-hint"
                disabled={batchExportBusy || (batchSnapshot?.completedError ?? 0) === 0}
                onClick={() => {
                  void handleBatchRetryFailed()
                }}
              >
                <IconQueueRetry size={16} aria-hidden />
                {uiText('batchExportRetryFailed')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-icon-leading"
                aria-describedby="batch-export-panel-hint batch-export-drop-hint"
                disabled={batchExportBusy || (batchSnapshot?.completedError ?? 0) === 0}
                onClick={() => {
                  void handleBatchRetryFailedAndStart()
                }}
              >
                <IconQueueRetry size={16} aria-hidden />
                {uiText('batchExportRetryFailedAndStart')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-icon-leading"
                aria-describedby="batch-export-panel-hint batch-export-drop-hint"
                disabled={batchExportBusy || (batchSnapshot?.completedOk ?? 0) === 0}
                onClick={() => {
                  void handleBatchClearCompleted()
                }}
              >
                <IconQueueTrash size={16} aria-hidden />
                {uiText('batchExportClearCompleted')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-icon-leading"
                aria-describedby="batch-export-panel-hint batch-export-drop-hint"
                disabled={batchExportBusy || (batchSnapshot?.rows.length ?? 0) === 0}
                onClick={() => {
                  void window.fluxalloy.batchExport.clear().catch(console.error)
                }}
              >
                <IconQueueTrash size={16} aria-hidden />
                {uiText('batchExportClear')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-icon-leading"
                aria-describedby="batch-export-panel-hint batch-export-drop-hint"
                disabled={(batchSnapshot?.rows.length ?? 0) === 0}
                onClick={() => {
                  void handleBatchCopyInputPaths()
                }}
              >
                <IconCopy size={16} aria-hidden />
                {uiText('batchExportCopyPaths')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-icon-leading"
                aria-describedby="batch-export-panel-hint batch-export-drop-hint"
                disabled={
                  !(
                    batchSnapshot?.rows.some(
                      (r) => typeof r.outputPath === 'string' && r.outputPath.trim() !== ''
                    ) ?? false
                  )
                }
                onClick={() => {
                  void handleBatchCopyOutputPaths()
                }}
              >
                <IconCopy size={16} aria-hidden />
                {uiText('batchExportCopyOutputPaths')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-icon-leading"
                aria-describedby="batch-export-panel-hint batch-export-drop-hint"
                disabled={(batchSnapshot?.rows.length ?? 0) === 0}
                onClick={() => {
                  void handleBatchSaveReport()
                }}
              >
                <IconSave size={16} aria-hidden />
                {uiText('batchExportSaveReport')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-icon-leading"
                aria-describedby="batch-export-panel-hint batch-export-drop-hint"
                disabled={batchExportBusy}
                onClick={() => {
                  void handleBatchRemoveWaiting()
                }}
              >
                <IconQueueX size={16} aria-hidden />
                {uiText('batchExportRemoveWaiting')}
              </button>
            </div>
          </div>
  )
}
