import { useEffect, useRef, type JSX } from 'react'

import { isFfmpegExportBatchVideoPath } from '../../../../shared/ffmpeg-export-batch-video-ext'
import {
  isYtdlpQueueStatusDone,
  isYtdlpQueueStatusErrorLike
} from '../../../../shared/ytdlp-queue-status'
import {
  DOWNLOADS_QUEUE_TABLE_HEADER_IDS,
  downloadsRowMatchesStatus,
  downloadsStatusTone,
  parseDownloadsProgressPercent
} from '../../downloads-queue-view'
import { formatDownloadsQueueRowStatus, uiText, uiTextVars } from '../../locales/ui-text'
import {
  IconFolderOpen,
  IconImage,
  IconPauseUi,
  IconPlay,
  IconQueueChevronDown,
  IconQueueChevronUp,
  IconQueueFile,
  IconQueueOutbound,
  IconQueuePlus,
  IconQueueRetry,
  IconQueueTrash
} from '../LucideMiniIcons'
import type { DownloadsWorkspaceMainProps } from './downloads-workspace-main-props'

export function DownloadsWorkspaceMainQueueTable(props: DownloadsWorkspaceMainProps): JSX.Element {
  const {
    downloadsOptionsBusy,
    downloadsHistoryBusy,
    downloadsRows,
    visibleDownloadsRows,
    downloadsStatusFilter,
    setStatusHint,
    onBatchAddDownloadsDone
  } = props

  const tableWrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    tableWrapRef.current?.scrollTo({ top: 0 })
  }, [downloadsStatusFilter, visibleDownloadsRows.length])

  return (
    <div
      ref={tableWrapRef}
      className="app-downloads-table-wrap"
      role="group"
      aria-label={uiText('downloadsQueueTableWrapGroupAria')}
      aria-describedby="downloads-page-hint"
      aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
    >
      <div className="app-downloads-table-fit">
        <table
          className="app-downloads-table"
          aria-label={uiText('downloadsQueueTableCaption')}
          aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
        >
          <thead>
            <tr>
              <th scope="col" id={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.num}>
                {uiText('downloadsTableColNum')}
              </th>
              <th scope="col" id={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.titleUrl}>
                {uiText('downloadsTableColTitleUrl')}
              </th>
              <th scope="col" id={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.format}>
                {uiText('downloadsTableColFormat')}
              </th>
              <th scope="col" id={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.size}>
                {uiText('downloadsTableColSize')}
              </th>
              <th scope="col" id={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.progress}>
                {uiText('downloadsTableColProgress')}
              </th>
              <th scope="col" id={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.speed}>
                {uiText('downloadsTableColSpeed')}
              </th>
              <th scope="col" id={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.eta}>
                {uiText('downloadsTableColEta')}
              </th>
              <th scope="col" id={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.status}>
                {uiText('downloadsTableColStatus')}
              </th>
              <th scope="col" id={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.actions}>
                {uiText('downloadsTableColActions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {downloadsRows.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="app-downloads-empty"
                  role="status"
                  aria-describedby="downloads-page-hint"
                >
                  {uiText('downloadsEmptyQueue')}
                </td>
              </tr>
            ) : visibleDownloadsRows.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="app-downloads-empty"
                  role="status"
                  aria-describedby="downloads-page-hint"
                >
                  {uiText('downloadsEmptyFilter')}
                </td>
              </tr>
            ) : (
              visibleDownloadsRows.map((row) => {
                const progressPercent = parseDownloadsProgressPercent(row.progress)
                const isDoneRow = downloadsRowMatchesStatus(row, 'done')
                const showProgressBar = isDoneRow || progressPercent !== null
                const barPercent = isDoneRow
                  ? 100
                  : progressPercent === null
                    ? 0
                    : Math.min(100, Math.max(0, progressPercent))
                const statusTone = downloadsStatusTone(row)
                return (
                  <tr key={row.id}>
                    <td
                      className="app-downloads-mono"
                      headers={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.num}
                    >
                      {row.id}
                    </td>
                    <td headers={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.titleUrl}>
                      <div className="app-downloads-row-title">{row.shortLabel}</div>
                      <div className="app-downloads-row-url">{row.url}</div>
                    </td>
                    <td
                      className="app-downloads-mono"
                      headers={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.format}
                    >
                      {row.queueFmt ?? uiText('uiPlaceholderDash')}
                    </td>
                    <td
                      className="app-downloads-mono"
                      headers={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.size}
                    >
                      {row.queueSize ?? uiText('uiPlaceholderDash')}
                    </td>
                    <td
                      className="app-downloads-mono"
                      headers={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.progress}
                    >
                      <div className="app-downloads-progress">
                        {showProgressBar ? (
                          <div className="app-downloads-progress-bar-row">
                            <span className="app-downloads-progress-track" aria-hidden>
                              <span
                                className={
                                  isDoneRow
                                    ? 'app-downloads-progress-fill app-downloads-progress-fill--complete'
                                    : 'app-downloads-progress-fill'
                                }
                                style={{ width: `${barPercent}%` }}
                              />
                            </span>
                            <span className="app-downloads-progress-pct">
                              {Math.round(barPercent)}%
                            </span>
                          </div>
                        ) : row.progress ? (
                          <span className="app-downloads-progress-fallback" title={row.progress}>
                            {row.progress}
                          </span>
                        ) : (
                          uiText('uiPlaceholderDash')
                        )}
                      </div>
                    </td>
                    <td
                      className="app-downloads-mono"
                      headers={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.speed}
                    >
                      {row.queueSpeed ?? uiText('uiPlaceholderDash')}
                    </td>
                    <td
                      className="app-downloads-mono"
                      headers={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.eta}
                    >
                      {row.queueEta ?? uiText('uiPlaceholderDash')}
                    </td>
                    <td headers={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.status}>
                      <span className={`app-downloads-status app-downloads-status-${statusTone}`}>
                        <span className="app-downloads-status-dot" aria-hidden />
                        {formatDownloadsQueueRowStatus(row.status)}
                      </span>
                    </td>
                    <td headers={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.actions}>
                      <div
                        className="app-downloads-row-actions"
                        role="toolbar"
                        aria-orientation="horizontal"
                        aria-label={uiTextVars('downloadsQueueRowActionsToolbarAriaTemplate', {
                          id: String(row.id)
                        })}
                        aria-describedby="downloads-page-hint"
                        aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
                      >
                        <button
                          type="button"
                          className="app-icon-btn"
                          aria-describedby="downloads-page-hint"
                          aria-label={uiText('downloadsQueueAriaMoveUp')}
                          title={uiText('downloadsQueueAriaMoveUp')}
                          onClick={() => {
                            void window.velorix.downloads.moveRow(row.id, -1).then((res) => {
                              if (!res.ok) {
                                setStatusHint(res.error)
                              }
                            })
                          }}
                        >
                          <IconQueueChevronUp title="" size={18} />
                        </button>
                        <button
                          type="button"
                          className="app-icon-btn"
                          aria-describedby="downloads-page-hint"
                          aria-label={uiText('downloadsQueueAriaMoveDown')}
                          title={uiText('downloadsQueueAriaMoveDown')}
                          onClick={() => {
                            void window.velorix.downloads.moveRow(row.id, 1).then((res) => {
                              if (!res.ok) {
                                setStatusHint(res.error)
                              }
                            })
                          }}
                        >
                          <IconQueueChevronDown title="" size={18} />
                        </button>
                        <button
                          type="button"
                          className="app-icon-btn app-icon-btn-primary"
                          aria-describedby="downloads-page-hint"
                          aria-label={
                            isYtdlpQueueStatusErrorLike(row.status)
                              ? uiText('downloadsQueueAriaRetryRow')
                              : uiText('downloadsQueueAriaStartRow')
                          }
                          title={
                            isYtdlpQueueStatusErrorLike(row.status)
                              ? uiText('downloadsQueueAriaRetryRow')
                              : uiText('downloadsQueueAriaStartRow')
                          }
                          onClick={() => {
                            const fn = isYtdlpQueueStatusErrorLike(row.status)
                              ? window.velorix.downloads.retryRow
                              : window.velorix.downloads.startRow
                            void fn(row.id).then((res) => {
                              if (!res.ok) {
                                setStatusHint(res.error)
                              }
                            })
                          }}
                        >
                          {isYtdlpQueueStatusErrorLike(row.status) ? (
                            <IconQueueRetry title="" size={18} />
                          ) : (
                            <IconPlay title="" size={18} />
                          )}
                        </button>
                        {row.outputPath ? (
                          <>
                            <button
                              type="button"
                              className="app-icon-btn"
                              aria-describedby="downloads-page-hint"
                              aria-label={uiText('downloadsQueueAriaOpenFile')}
                              title={uiText('downloadsQueueAriaOpenFile')}
                              onClick={() => {
                                void window.velorix.downloads
                                  .openQueueOutput(row.id, 'file')
                                  .then((res) => {
                                    if (!res.ok) {
                                      setStatusHint(res.error)
                                    }
                                  })
                              }}
                            >
                              <IconQueueFile title="" size={18} />
                            </button>
                            <button
                              type="button"
                              className="app-icon-btn"
                              aria-describedby="downloads-page-hint"
                              aria-label={uiText('downloadsQueueAriaOpenFolder')}
                              title={uiText('downloadsQueueAriaOpenFolder')}
                              onClick={() => {
                                void window.velorix.downloads
                                  .openQueueOutput(row.id, 'folder')
                                  .then((res) => {
                                    if (!res.ok) {
                                      setStatusHint(res.error)
                                    }
                                  })
                              }}
                            >
                              <IconFolderOpen title="" size={18} />
                            </button>
                            {isYtdlpQueueStatusDone(row.status) ? (
                              <button
                                type="button"
                                className="app-icon-btn"
                                aria-describedby="downloads-page-hint"
                                aria-label={uiText('downloadsQueueAriaExtractCover')}
                                title={uiText('downloadsQueueExtractCoverTitle')}
                                onClick={() => {
                                  setStatusHint(uiText('downloadsCoverExtractBusy'))
                                  void window.velorix.downloads
                                    .extractQueueCover(row.id)
                                    .then((res) => {
                                      if (res.ok) {
                                        setStatusHint(
                                          uiTextVars('downloadsCoverExtractDone', {
                                            path: res.outputPath
                                          })
                                        )
                                      } else if ('noCover' in res && res.noCover) {
                                        setStatusHint(uiText('downloadsCoverExtractNoCover'))
                                      } else if ('cancelled' in res && res.cancelled) {
                                        setStatusHint(uiText('downloadsCoverExtractCancelled'))
                                      } else if ('error' in res) {
                                        setStatusHint(res.error)
                                      }
                                    })
                                }}
                              >
                                <IconImage title="" size={18} />
                              </button>
                            ) : null}
                            <button
                              type="button"
                              className="app-icon-btn"
                              aria-describedby="downloads-page-hint"
                              aria-label={uiText('downloadsQueueAriaOpenInEditor')}
                              title={uiText('downloadsQueueAriaOpenInEditor')}
                              onClick={() => {
                                setStatusHint(uiText('downloadsHistoryOpenHandlerPreparing'))
                                void window.velorix.downloads
                                  .openQueueOutputInHandler(row.id)
                                  .then((res) => {
                                    if (!res.ok) {
                                      setStatusHint(res.error)
                                    } else {
                                      setStatusHint(uiText('downloadsHistoryOpenHandlerDone'))
                                    }
                                  })
                              }}
                            >
                              <IconQueueOutbound title="" size={18} />
                            </button>
                            {isYtdlpQueueStatusDone(row.status) &&
                            row.outputPath &&
                            isFfmpegExportBatchVideoPath(row.outputPath) ? (
                              <button
                                type="button"
                                className="app-icon-btn"
                                aria-describedby="downloads-page-hint"
                                aria-label={uiText('batchExportAddToBatch')}
                                title={uiText('batchExportAddToBatch')}
                                onClick={() => {
                                  onBatchAddDownloadsDone([row.id])
                                }}
                              >
                                <IconQueuePlus title="" size={18} />
                              </button>
                            ) : null}
                          </>
                        ) : (
                          <button
                            type="button"
                            className="app-icon-btn"
                            aria-describedby="downloads-page-hint"
                            aria-label={uiText('downloadsQueueOpenDownloadDirTitle')}
                            title={uiText('downloadsQueueOpenDownloadDirTitle')}
                            onClick={() => {
                              void window.velorix.downloads
                                .openQueueOutput(row.id, 'folder')
                                .then((res) => {
                                  if (!res.ok) {
                                    setStatusHint(res.error)
                                  }
                                })
                            }}
                          >
                            <IconFolderOpen title="" size={18} />
                          </button>
                        )}
                        {row.isActiveRunner ? (
                          <button
                            type="button"
                            className="app-icon-btn"
                            aria-describedby="downloads-page-hint"
                            disabled={
                              row.ytdlpPauseSupported !== true || row.ytdlpPauseChildActive !== true
                            }
                            aria-label={
                              row.ytdlpPaused
                                ? uiText('downloadsQueueAriaResumeYtdlp')
                                : uiText('downloadsQueueAriaPauseYtdlp')
                            }
                            title={
                              row.ytdlpPauseSupported !== true
                                ? uiText('downloadsQueuePauseUnsupportedOsTitle')
                                : row.ytdlpPauseChildActive !== true
                                  ? uiText('downloadsQueuePauseWaitingProcessTitle')
                                  : row.ytdlpPaused
                                    ? uiText('downloadsQueueAriaResumeYtdlp')
                                    : uiText('downloadsQueueAriaPauseYtdlp')
                            }
                            onClick={() => {
                              const fn = row.ytdlpPaused
                                ? window.velorix.downloads.resumeYtdlp
                                : window.velorix.downloads.pauseYtdlp
                              void fn().then((res) => {
                                if (!res.ok) {
                                  setStatusHint(res.error)
                                }
                              })
                            }}
                          >
                            {row.ytdlpPaused ? (
                              <IconPlay title="" size={18} />
                            ) : (
                              <IconPauseUi title="" size={18} />
                            )}
                          </button>
                        ) : null}
                        <button
                          type="button"
                          className="app-icon-btn app-icon-btn-warn"
                          aria-describedby="downloads-page-hint"
                          aria-label={uiText('downloadsQueueAriaRemoveRow')}
                          title={uiText('downloadsQueueAriaRemoveRow')}
                          onClick={() => {
                            void window.velorix.downloads.removeRow(row.id).then((res) => {
                              if (!res.ok) {
                                setStatusHint(res.error)
                              }
                            })
                          }}
                        >
                          <IconQueueTrash title="" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
