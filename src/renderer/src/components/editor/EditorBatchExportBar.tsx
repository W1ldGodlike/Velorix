import { useId } from 'react'
import type { Dispatch, JSX, SetStateAction } from 'react'

import type {
  FfmpegExportBatchConcurrency,
  FfmpegExportBatchSnapshot
} from '../../../../shared/ffmpeg-export-batch-contract'
import { DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX } from '../../../../shared/ffmpeg-export-batch-output-suffix'
import {
  IconBan,
  IconCopy,
  IconDownload,
  IconFilm,
  IconFolder,
  IconFolderOpen,
  IconHome,
  IconPlay,
  IconQueueChevronDown,
  IconQueueChevronUp,
  IconQueueFile,
  IconQueueRetry,
  IconQueueTrash,
  IconQueueX,
  IconSave,
  IconScissors,
  IconSettings
} from '../LucideMiniIcons'
import { formatFfmpegExportBatchStatusLabel, uiText, uiTextVars } from '../../locales/ui-text'

const BATCH_EXPORT_TABLE_HEADER_IDS = {
  file: 'flux-batch-col-file',
  status: 'flux-batch-col-status',
  output: 'flux-batch-col-output',
  progress: 'flux-batch-col-progress',
  actions: 'flux-batch-col-actions'
} as const

export type EditorBatchExportBarProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  batchExportBusy: boolean
  batchSnapshot: FfmpegExportBatchSnapshot | null
  batchOutputSuffix: string
  setBatchOutputSuffix: Dispatch<SetStateAction<string>>
  batchOutputDirectory: string
  batchDragRowId: number | null
  setBatchDragRowId: (id: number | null) => void
  previewPath: string | undefined
  setStatusHint: (hint: string | null) => void
  handleBatchDropFiles: (files: FileList | null) => Promise<void>
  handleBatchPickOutputFolder: () => Promise<void>
  handleBatchRevealSharedOutputFolder: () => Promise<void>
  handleBatchClearOutputDirectory: () => Promise<void>
  handleBatchPickFiles: () => Promise<void>
  handleBatchPickFolder: () => Promise<void>
  handleBatchAddCurrentPreview: () => Promise<void>
  handleBatchAddDownloadsDone: () => void
  handleBatchStart: () => Promise<void>
  handleBatchCancel: () => Promise<void>
  handleBatchRetryFailed: () => Promise<void>
  handleBatchRetryFailedAndStart: () => Promise<void>
  handleBatchClearCompleted: () => Promise<void>
  handleBatchCopyInputPaths: () => Promise<void>
  handleBatchCopyOutputPaths: () => Promise<void>
  handleBatchSaveReport: () => Promise<void>
  handleBatchRemoveWaiting: () => Promise<void>
  handleBatchOpenOutput: (outputPath: string, mode: 'file' | 'folder' | 'preview') => Promise<void>
  handleBatchOpenInput: (inputPath: string, mode: 'file' | 'folder' | 'preview') => Promise<void>
  handleBatchCopyRowPath: (path: string, kind: 'in' | 'out') => Promise<void>
}

export function EditorBatchExportBar(props: EditorBatchExportBarProps): JSX.Element {
  const {
    open,
    onOpenChange,
    batchExportBusy,
    batchSnapshot,
    batchOutputSuffix,
    setBatchOutputSuffix,
    batchOutputDirectory,
    batchDragRowId,
    setBatchDragRowId,
    previewPath,
    setStatusHint,
    handleBatchDropFiles,
    handleBatchPickOutputFolder,
    handleBatchRevealSharedOutputFolder,
    handleBatchClearOutputDirectory,
    handleBatchPickFiles,
    handleBatchPickFolder,
    handleBatchAddCurrentPreview,
    handleBatchAddDownloadsDone,
    handleBatchStart,
    handleBatchCancel,
    handleBatchRetryFailed,
    handleBatchRetryFailedAndStart,
    handleBatchClearCompleted,
    handleBatchCopyInputPaths,
    handleBatchCopyOutputPaths,
    handleBatchSaveReport,
    handleBatchRemoveWaiting,
    handleBatchOpenOutput,
    handleBatchOpenInput,
    handleBatchCopyRowPath
  } = props
  const batchExportBarRegionBodyId = useId()
  return (
    <details
      className="app-url-bar app-batch-export-bar"
      aria-label={uiText('batchExportAria')}
      aria-busy={batchExportBusy}
      open={open}
      onToggle={(e) => {
        onOpenChange(e.currentTarget.open)
      }}
    >
      <summary className="app-url-summary" aria-controls={batchExportBarRegionBodyId}>
        {uiText('batchExportSummary')}
      </summary>
      <div
        id={batchExportBarRegionBodyId}
        className="app-url-body"
        role="region"
        aria-labelledby="batch-export-region-title"
        aria-busy={batchExportBusy}
      >
        <h3 id="batch-export-region-title" className="app-visually-hidden">
          {uiText('batchExportAria')}
        </h3>
        <p id="batch-export-panel-hint" className="app-url-hint">
          {uiText('batchExportHint')}
        </p>
        <p id="batch-export-drop-hint" className="app-url-hint">
          {uiText('batchExportDragHint')}
        </p>
        <div
          className="app-batch-export-dropzone"
          aria-label={uiText('batchExportDropzoneAria')}
          aria-busy={batchExportBusy}
          aria-describedby="batch-export-panel-hint batch-export-drop-hint"
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onDrop={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void handleBatchDropFiles(e.dataTransfer.files)
          }}
        >
          <div
            className="app-settings-grid app-batch-export-toolbar"
            role="group"
            aria-label={uiText('batchExportPanelFormGroupAria')}
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
                aria-describedby="batch-export-suffix-hint"
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
                aria-describedby="batch-export-concurrency-hint"
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
              aria-busy={batchExportBusy}
            >
              <button
                type="button"
                className="app-btn app-btn-icon-leading"
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
          <div
            role="region"
            aria-label={uiText('batchExportQueueTableZoneAria')}
            aria-busy={batchExportBusy}
          >
            {batchSnapshot && batchSnapshot.rows.length > 0 ? (
              <div
                className="app-batch-export-table-wrap"
                role="group"
                aria-label={uiText('batchExportTableWrapGroupAria')}
                aria-busy={batchExportBusy}
              >
                <table className="app-batch-export-table" aria-busy={batchExportBusy}>
                  <caption className="app-visually-hidden">
                    {uiText('batchExportTableCaption')}
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col" id={BATCH_EXPORT_TABLE_HEADER_IDS.file}>
                        {uiText('batchExportColFile')}
                      </th>
                      <th scope="col" id={BATCH_EXPORT_TABLE_HEADER_IDS.status}>
                        {uiText('batchExportColStatus')}
                      </th>
                      <th scope="col" id={BATCH_EXPORT_TABLE_HEADER_IDS.output}>
                        {uiText('batchExportColOutput')}
                      </th>
                      <th scope="col" id={BATCH_EXPORT_TABLE_HEADER_IDS.progress}>
                        {uiText('batchExportColProgress')}
                      </th>
                      <th scope="col" id={BATCH_EXPORT_TABLE_HEADER_IDS.actions}>
                        {uiText('batchExportColActions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchSnapshot.rows.map((row, rowIndex) => (
                      <tr
                        key={row.id}
                        draggable={!batchExportBusy && row.status !== 'running'}
                        onDoubleClick={(e) => {
                          if ((e.target as HTMLElement).closest('button')) {
                            return
                          }
                          const td = (e.target as HTMLElement).closest('td')
                          const idx = td?.cellIndex ?? -1
                          const out =
                            typeof row.outputPath === 'string' ? row.outputPath.trim() : ''
                          if (idx === 2 && out.length > 0) {
                            void handleBatchOpenOutput(out, 'preview')
                            return
                          }
                          void handleBatchOpenInput(row.inputPath, 'preview')
                        }}
                        onDragStart={() => {
                          setBatchDragRowId(row.id)
                        }}
                        onDragEnd={() => {
                          setBatchDragRowId(null)
                        }}
                        onDragOver={(e) => {
                          if (!batchExportBusy && row.status !== 'running') {
                            e.preventDefault()
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          const fromId = batchDragRowId
                          setBatchDragRowId(null)
                          if (fromId === null || fromId === row.id) {
                            return
                          }
                          void window.fluxalloy.batchExport
                            .reorderRow(fromId, rowIndex)
                            .catch(console.error)
                        }}
                      >
                        <td headers={BATCH_EXPORT_TABLE_HEADER_IDS.file} title={row.inputPath}>
                          {row.shortLabel}
                        </td>
                        <td headers={BATCH_EXPORT_TABLE_HEADER_IDS.status}>
                          {formatFfmpegExportBatchStatusLabel(row.status)}
                        </td>
                        <td
                          headers={BATCH_EXPORT_TABLE_HEADER_IDS.output}
                          title={row.outputPath ?? undefined}
                        >
                          {row.outputPath ? row.outputPath.replace(/^.*[\\/]/, '') : '—'}
                        </td>
                        <td
                          headers={BATCH_EXPORT_TABLE_HEADER_IDS.progress}
                          title={row.status === 'error' ? row.progress : undefined}
                        >
                          {row.progress}
                        </td>
                        <td headers={BATCH_EXPORT_TABLE_HEADER_IDS.actions}>
                          <div
                            role="toolbar"
                            aria-orientation="horizontal"
                            aria-label={uiTextVars('batchExportRowActionsToolbarAriaTemplate', {
                              n: String(rowIndex + 1)
                            })}
                            aria-busy={batchExportBusy}
                          >
                            <button
                              type="button"
                              className="app-btn app-btn-icon"
                              title={uiText('batchExportOpenInputInEditor')}
                              aria-label={uiText('batchExportOpenInputInEditor')}
                              onClick={() => {
                                void handleBatchOpenInput(row.inputPath, 'preview')
                              }}
                            >
                              <IconFilm aria-hidden />
                            </button>
                            <button
                              type="button"
                              className="app-btn app-btn-icon"
                              title={uiText('batchExportOpenInputFile')}
                              aria-label={uiText('batchExportOpenInputFile')}
                              onClick={() => {
                                void handleBatchOpenInput(row.inputPath, 'file')
                              }}
                            >
                              <IconPlay aria-hidden />
                            </button>
                            <button
                              type="button"
                              className="app-btn app-btn-icon"
                              title={uiText('batchExportOpenInputFolder')}
                              aria-label={uiText('batchExportOpenInputFolder')}
                              onClick={() => {
                                void handleBatchOpenInput(row.inputPath, 'folder')
                              }}
                            >
                              <IconFolderOpen aria-hidden />
                            </button>
                            <button
                              type="button"
                              className="app-btn app-btn-icon"
                              title={uiText('batchExportCopyRowInputPath')}
                              aria-label={uiText('batchExportCopyRowInputPath')}
                              onClick={() => {
                                void handleBatchCopyRowPath(row.inputPath, 'in')
                              }}
                            >
                              <IconCopy aria-hidden />
                            </button>
                            {row.outputPath ? (
                              <>
                                <button
                                  type="button"
                                  className="app-btn app-btn-icon"
                                  title={uiText('batchExportOpenOutputInEditor')}
                                  aria-label={uiText('batchExportOpenOutputInEditor')}
                                  onClick={() => {
                                    void handleBatchOpenOutput(row.outputPath as string, 'preview')
                                  }}
                                >
                                  <IconFilm aria-hidden />
                                </button>
                                <button
                                  type="button"
                                  className="app-btn app-btn-icon"
                                  title={uiText('processingHistoryOpenFile')}
                                  aria-label={uiText('processingHistoryOpenFile')}
                                  onClick={() => {
                                    void handleBatchOpenOutput(row.outputPath as string, 'file')
                                  }}
                                >
                                  <IconPlay aria-hidden />
                                </button>
                                <button
                                  type="button"
                                  className="app-btn app-btn-icon"
                                  title={uiText('processingHistoryOpenFolder')}
                                  aria-label={uiText('processingHistoryOpenFolder')}
                                  onClick={() => {
                                    void handleBatchOpenOutput(row.outputPath as string, 'folder')
                                  }}
                                >
                                  <IconFolderOpen aria-hidden />
                                </button>
                                <button
                                  type="button"
                                  className="app-btn app-btn-icon"
                                  title={uiText('batchExportCopyRowOutputPath')}
                                  aria-label={uiText('batchExportCopyRowOutputPath')}
                                  onClick={() => {
                                    void handleBatchCopyRowPath(row.outputPath as string, 'out')
                                  }}
                                >
                                  <IconCopy aria-hidden />
                                </button>
                              </>
                            ) : null}
                            {row.status === 'error' || row.status === 'cancelled' ? (
                              <button
                                type="button"
                                className="app-btn app-btn-icon"
                                title={uiText('batchExportRetryRow')}
                                aria-label={uiText('batchExportRetryRow')}
                                disabled={batchExportBusy}
                                onClick={() => {
                                  void window.fluxalloy.batchExport
                                    .retryRows([row.id])
                                    .then((res) => {
                                      if (!res.ok) {
                                        setStatusHint(res.error)
                                        return
                                      }
                                      if (res.reset > 0) {
                                        setStatusHint(
                                          uiTextVars('batchExportRetriedFailed', {
                                            count: String(res.reset)
                                          })
                                        )
                                      }
                                    })
                                }}
                              >
                                <IconQueueRetry aria-hidden />
                              </button>
                            ) : null}
                            <button
                              type="button"
                              className="app-btn app-btn-icon"
                              title={uiText('batchExportMoveUp')}
                              aria-label={uiText('batchExportMoveUp')}
                              disabled={batchExportBusy || row.status === 'running'}
                              onClick={() => {
                                void window.fluxalloy.batchExport
                                  .moveRow(row.id, 'up')
                                  .catch(console.error)
                              }}
                            >
                              <IconQueueChevronUp aria-hidden />
                            </button>
                            <button
                              type="button"
                              className="app-btn app-btn-icon"
                              title={uiText('batchExportMoveDown')}
                              aria-label={uiText('batchExportMoveDown')}
                              disabled={batchExportBusy || row.status === 'running'}
                              onClick={() => {
                                void window.fluxalloy.batchExport
                                  .moveRow(row.id, 'down')
                                  .catch(console.error)
                              }}
                            >
                              <IconQueueChevronDown aria-hidden />
                            </button>
                            <button
                              type="button"
                              className="app-btn app-btn-icon"
                              title={uiText('batchExportRemoveRow')}
                              aria-label={uiText('batchExportRemoveRow')}
                              disabled={batchExportBusy || row.status === 'running'}
                              onClick={() => {
                                void window.fluxalloy.batchExport
                                  .removeRows([row.id])
                                  .catch(console.error)
                              }}
                            >
                              <IconQueueTrash aria-hidden />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="app-url-hint">{uiText('batchExportEmpty')}</p>
            )}
          </div>
          {batchSnapshot && !batchSnapshot.running && batchSnapshot.completedError > 0 ? (
            <p className="app-batch-export-summary app-url-hint" role="status">
              {uiTextVars('batchExportErrorSummary', {
                failed: String(batchSnapshot.completedError),
                total: String(
                  batchSnapshot.completedOk +
                    batchSnapshot.completedError +
                    batchSnapshot.completedCancelled
                )
              })}
            </p>
          ) : null}
        </div>
      </div>
    </details>
  )
}
