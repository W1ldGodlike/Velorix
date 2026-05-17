import type { JSX } from 'react'

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
import { formatFfmpegExportBatchStatusLabel, uiText, uiTextVars } from '../../locales/ui-text'
import { BATCH_EXPORT_TABLE_HEADER_IDS } from './editor-batch-export-bar-constants'
import type { EditorBatchExportBarProps } from './editor-batch-export-bar-props'

export function EditorBatchExportBarQueueTable(props: EditorBatchExportBarProps): JSX.Element {
  const { batchExportBusy, batchSnapshot, batchDragRowId, setBatchDragRowId, setStatusHint, handleBatchOpenOutput, handleBatchOpenInput, handleBatchCopyRowPath } = props

  return (
          <div
            role="region"
            aria-label={uiText('batchExportQueueTableZoneAria')}
            aria-describedby="batch-export-panel-hint batch-export-drop-hint"
            aria-busy={batchExportBusy}
          >
            {batchSnapshot && batchSnapshot.rows.length > 0 ? (
              <div
                className="app-batch-export-table-wrap"
                role="group"
                aria-label={uiText('batchExportTableWrapGroupAria')}
                aria-describedby="batch-export-panel-hint batch-export-drop-hint"
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
                            aria-describedby="batch-export-panel-hint batch-export-drop-hint"
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
  )
}
