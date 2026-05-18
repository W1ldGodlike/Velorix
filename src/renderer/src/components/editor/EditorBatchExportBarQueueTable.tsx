import { useState, type JSX } from 'react'

import {
  IconCopy,
  IconFilm,
  IconFolderOpen,
  IconPlay,
  IconQueueChevronDown,
  IconQueueChevronUp,
  IconQueueRetry,
  IconQueueTrash
} from '../LucideMiniIcons'
import {
  ffmpegExportBatchRowErrorDescribedById,
  resolveFfmpegExportBatchRowErrorDetail,
  resolveFfmpegExportBatchRowProgressDisplay
} from '../../../../shared/ffmpeg-export-batch-row-display'
import { formatFfmpegExportBatchStatusLabel, uiText, uiTextVars } from '../../locales/ui-text'
import { BATCH_EXPORT_TABLE_HEADER_IDS } from './editor-batch-export-bar-constants'
import type { EditorBatchExportBarProps } from './editor-batch-export-bar-props'

export function EditorBatchExportBarQueueTable(props: EditorBatchExportBarProps): JSX.Element {
  const {
    batchExportBusy,
    batchSnapshot,
    batchDragRowId,
    setBatchDragRowId,
    setStatusHint,
    handleBatchOpenOutput,
    handleBatchOpenInput,
    handleBatchCopyRowPath
  } = props

  const [batchDropTargetIndex, setBatchDropTargetIndex] = useState<number | null>(null)

  const clearDragVisual = (): void => {
    setBatchDropTargetIndex(null)
    setBatchDragRowId(null)
  }

  return (
    <>
      {batchSnapshot && batchSnapshot.rows.length > 0 ? (
        <div
          className="app-batch-export-table-wrap"
          role="group"
          aria-label={uiText('batchExportTableWrapGroupAria')}
          aria-describedby="batch-export-panel-hint batch-export-drop-hint"
          aria-busy={batchExportBusy}
        >
          <table className="app-batch-export-table" aria-busy={batchExportBusy}>
            <caption className="app-visually-hidden">{uiText('batchExportTableCaption')}</caption>
            <thead>
              <tr>
                <th scope="col" id={BATCH_EXPORT_TABLE_HEADER_IDS.reorder} className="app-visually-hidden">
                  {uiText('batchExportColReorder')}
                </th>
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
              {batchSnapshot.rows.map((row, rowIndex) => {
                const progressLabel = resolveFfmpegExportBatchRowProgressDisplay(row)
                const errorDetail = resolveFfmpegExportBatchRowErrorDetail(row)
                const statusLabel = formatFfmpegExportBatchStatusLabel(row.status)
                const rowErrorDescribedById = errorDetail
                  ? ffmpegExportBatchRowErrorDescribedById(row.id)
                  : undefined
                const canDrag = !batchExportBusy && row.status !== 'running'
                const isDragging = batchDragRowId === row.id
                const isDropTarget =
                  batchDropTargetIndex === rowIndex &&
                  batchDragRowId !== null &&
                  batchDragRowId !== row.id
                const rowClassName = [
                  row.status === 'error' ? 'app-batch-export-row-error' : '',
                  isDragging ? 'app-batch-export-row-dragging' : '',
                  isDropTarget ? 'app-batch-export-row-drop-target' : ''
                ]
                  .filter(Boolean)
                  .join(' ')
                const rowAriaLabel = errorDetail
                  ? uiTextVars('batchExportRowAriaWithErrorTemplate', {
                      n: String(rowIndex + 1),
                      file: row.shortLabel,
                      status: statusLabel,
                      detail: errorDetail
                    })
                  : uiTextVars('batchExportRowAriaTemplate', {
                      n: String(rowIndex + 1),
                      file: row.shortLabel,
                      status: statusLabel
                    })
                const rowDescribedBy = [
                  'batch-export-panel-hint',
                  'batch-export-drop-hint',
                  rowErrorDescribedById
                ]
                  .filter(Boolean)
                  .join(' ')

                return (
                  <tr
                    key={row.id}
                    className={rowClassName || undefined}
                    tabIndex={row.status === 'error' ? 0 : undefined}
                    aria-label={rowAriaLabel}
                    aria-describedby={rowDescribedBy}
                    title={uiText('batchExportRowDoubleClickTitle')}
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
                    onDragOver={(e) => {
                      if (!canDrag) {
                        return
                      }
                      e.preventDefault()
                      if (batchDragRowId !== null && batchDragRowId !== row.id) {
                        setBatchDropTargetIndex(rowIndex)
                      }
                    }}
                    onDragLeave={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                        setBatchDropTargetIndex((prev) => (prev === rowIndex ? null : prev))
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      const fromId = batchDragRowId
                      clearDragVisual()
                      if (fromId === null || fromId === row.id) {
                        return
                      }
                      void window.fluxalloy.batchExport
                        .reorderRow(fromId, rowIndex)
                        .catch(console.error)
                    }}
                  >
                    <td headers={BATCH_EXPORT_TABLE_HEADER_IDS.reorder} className="app-batch-export-reorder-cell">
                      <button
                        type="button"
                        className="app-btn app-btn-icon app-batch-export-drag-handle"
                        draggable={canDrag}
                        disabled={!canDrag}
                        aria-label={uiTextVars('batchExportDragHandleAria', {
                          n: String(rowIndex + 1),
                          file: row.shortLabel
                        })}
                        aria-describedby={rowDescribedBy}
                        {...(isDragging ? { 'aria-grabbed': true as const } : {})}
                        title={uiText('batchExportDragRow')}
                        onDragStart={(e) => {
                          e.stopPropagation()
                          setBatchDragRowId(row.id)
                        }}
                        onDragEnd={() => {
                          clearDragVisual()
                        }}
                      >
                        <span className="app-batch-export-drag-handle-glyph" aria-hidden>
                          ⋮⋮
                        </span>
                      </button>
                    </td>
                    <th scope="row" headers={BATCH_EXPORT_TABLE_HEADER_IDS.file} title={row.inputPath}>
                      {row.shortLabel}
                    </th>
                    <td
                      headers={`${BATCH_EXPORT_TABLE_HEADER_IDS.file} ${BATCH_EXPORT_TABLE_HEADER_IDS.status}`}
                      title={errorDetail ?? undefined}
                      className={row.status === 'error' ? 'app-batch-export-cell-error' : undefined}
                      aria-describedby={rowErrorDescribedById}
                    >
                      {statusLabel}
                    </td>
                    <td headers={BATCH_EXPORT_TABLE_HEADER_IDS.output} title={row.outputPath ?? undefined}>
                      {row.outputPath ? row.outputPath.replace(/^.*[\\/]/, '') : '—'}
                    </td>
                    <td
                      headers={BATCH_EXPORT_TABLE_HEADER_IDS.progress}
                      className={row.status === 'error' ? 'app-batch-export-cell-error' : undefined}
                      title={
                        errorDetail ?? (row.status === 'running' ? row.progress : undefined)
                      }
                      id={rowErrorDescribedById}
                      {...(row.status === 'running'
                        ? { role: 'status' as const, 'aria-live': 'polite' as const }
                        : row.status === 'error' && errorDetail
                          ? {
                              role: 'alert' as const,
                              'aria-label': uiTextVars('batchExportRowErrorAria', {
                                detail: errorDetail
                              })
                            }
                          : {})}
                    >
                      {progressLabel}
                    </td>
                    <td headers={BATCH_EXPORT_TABLE_HEADER_IDS.actions}>
                      <div
                        role="toolbar"
                        aria-orientation="horizontal"
                        aria-label={uiTextVars('batchExportRowActionsToolbarAriaTemplate', {
                          n: String(rowIndex + 1)
                        })}
                        aria-describedby={rowDescribedBy}
                        aria-busy={batchExportBusy}
                      >
                        <button
                          type="button"
                          className="app-btn app-btn-icon"
                          aria-describedby={rowDescribedBy}
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
                          aria-describedby={rowDescribedBy}
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
                          aria-describedby={rowDescribedBy}
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
                          aria-describedby={rowDescribedBy}
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
                              aria-describedby={rowDescribedBy}
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
                              aria-describedby={rowDescribedBy}
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
                              aria-describedby={rowDescribedBy}
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
                              aria-describedby={rowDescribedBy}
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
                            aria-describedby={rowDescribedBy}
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
                          aria-describedby={rowDescribedBy}
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
                          aria-describedby={rowDescribedBy}
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
                          aria-describedby={rowDescribedBy}
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
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p
          className="app-url-hint"
          role="status"
          aria-describedby="batch-export-panel-hint batch-export-drop-hint"
        >
          {uiText('batchExportEmpty')}
        </p>
      )}
    </>
  )
}