import type { Dispatch, JSX, SetStateAction } from 'react'

import { DOWNLOADS_VISIBLE_LOG_SAVE_CANCELLED } from '../../../../shared/downloads-log-contract'
import { isFfmpegExportBatchVideoPath } from '../../../../shared/ffmpeg-export-batch-video-ext'
import type {
  YtdlpDownloadHistoryEntry,
  YtdlpDownloadHistoryWeeklySummary
} from '../../../../shared/ytdlp-history-contract'
import {
  isYtdlpQueueStatusDone,
  isYtdlpQueueStatusErrorLike
} from '../../../../shared/ytdlp-queue-status'
import type { DownloadsLogLineView } from './DownloadsLogPanel'
import { DownloadsHistoryPanel } from './DownloadsHistoryPanel'
import { DownloadsLogPanel } from './DownloadsLogPanel'
import {
  IconBan,
  IconFolderOpen,
  IconPauseUi,
  IconPlay,
  IconPopOutWindow,
  IconQueueChevronDown,
  IconQueueChevronUp,
  IconQueueFile,
  IconQueueOutbound,
  IconQueuePlus,
  IconQueueRetry,
  IconQueueTrash,
  IconSettings
} from '../LucideMiniIcons'
import {
  DOWNLOADS_QUEUE_TABLE_HEADER_IDS,
  type DownloadsQueueRowView,
  type DownloadsQueueStats,
  type DownloadsStatusFilter,
  downloadsRowMatchesStatus,
  downloadsStatusTone,
  formatDownloadsLogText,
  parseDownloadsProgressPercent
} from '../../downloads-queue-view'
import type { DownloadsHistoryOutcomeFilter } from '../../use-downloads-workspace'
import { formatDownloadsQueueRowStatus, getUiLocale, uiText, uiTextVars } from '../../locales/ui-text'

export type DownloadsWorkspaceMainProps = {
  downloadsOptionsBusy: boolean
  downloadsHistoryBusy: boolean
  downloadsUrl: string
  setDownloadsUrl: Dispatch<SetStateAction<string>>
  downloadsMainUrlFieldId: string
  onAddToQueue: () => void
  downloadsNarrowLayout: boolean
  onScrollToSettings: () => void
  downloadsStats: DownloadsQueueStats
  downloadsStatusFilter: DownloadsStatusFilter
  setDownloadsStatusFilter: (next: DownloadsStatusFilter) => void
  downloadsStatusFilterChips: Array<{ id: DownloadsStatusFilter; label: string }>
  downloadsRows: DownloadsQueueRowView[]
  visibleDownloadsRows: DownloadsQueueRowView[]
  setStatusHint: (hint: string | null) => void
  onBatchAddDownloadsDone: (rowIds: number[]) => void
  onSelectDownloadsTab: () => void
  downloadsEmbeddedHistoryOpen: boolean
  persistDownloadsEmbeddedHistoryOpen: (nextOpen: boolean) => void
  visibleDownloadsHistory: YtdlpDownloadHistoryEntry[]
  downloadsHistoryCount: number
  downloadsHistoryOutcomeFilter: DownloadsHistoryOutcomeFilter
  setDownloadsHistoryOutcomeFilter: (next: DownloadsHistoryOutcomeFilter) => void
  downloadsHistoryWeeklySummary: YtdlpDownloadHistoryWeeklySummary
  refreshDownloadsHistory: () => Promise<void>
  setDownloadsHistory: Dispatch<SetStateAction<YtdlpDownloadHistoryEntry[]>>
  exportVisibleDownloadsHistory: () => Promise<void>
  downloadsEmbeddedLogOpen: boolean
  persistDownloadsEmbeddedLogOpen: (nextOpen: boolean) => void
  downloadsLogTargetRowId: number | null
  downloadsLogLines: DownloadsLogLineView[]
  setDownloadsLogLines: Dispatch<SetStateAction<DownloadsLogLineView[]>>
  setDownloadsLogTargetRowId: Dispatch<SetStateAction<number | null>>
}

export function DownloadsWorkspaceMain(props: DownloadsWorkspaceMainProps): JSX.Element {
  const {
    downloadsOptionsBusy,
    downloadsHistoryBusy,
    downloadsUrl,
    setDownloadsUrl,
    downloadsMainUrlFieldId,
    onAddToQueue,
    downloadsNarrowLayout,
    onScrollToSettings,
    downloadsStats,
    downloadsStatusFilter,
    setDownloadsStatusFilter,
    downloadsStatusFilterChips,
    downloadsRows,
    visibleDownloadsRows,
    setStatusHint,
    onBatchAddDownloadsDone,
    onSelectDownloadsTab,
    downloadsEmbeddedHistoryOpen,
    persistDownloadsEmbeddedHistoryOpen,
    visibleDownloadsHistory,
    downloadsHistoryCount,
    downloadsHistoryOutcomeFilter,
    setDownloadsHistoryOutcomeFilter,
    downloadsHistoryWeeklySummary,
    refreshDownloadsHistory,
    setDownloadsHistory,
    exportVisibleDownloadsHistory,
    downloadsEmbeddedLogOpen,
    persistDownloadsEmbeddedLogOpen,
    downloadsLogTargetRowId,
    downloadsLogLines,
    setDownloadsLogLines,
    setDownloadsLogTargetRowId
  } = props

  return (
    <section
      className="app-downloads-main"
      aria-label={uiText('downloadsMainAria')}
      aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
    >
      <div
        className="app-downloads-band"
        role="region"
        aria-label={uiText('downloadsPageIntroBandAria')}
        aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
      >
        <div
          className="app-downloads-band-copy"
          role="group"
          aria-label={uiText('downloadsBandHeadingCopyGroupAria')}
          aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
        >
          <h2 className="app-downloads-title">{uiText('downloadsPageTitle')}</h2>
          <p className="app-downloads-hint">{uiText('downloadsPageHint')}</p>
        </div>
        <div
          className="app-downloads-actions"
          role="toolbar"
          aria-orientation="horizontal"
          aria-label={uiText('downloadsBandToolbarAria')}
          aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
        >
          <button
            type="button"
            className="app-btn app-btn-icon-leading"
            onClick={() => {
              void window.fluxalloy.downloads.openWindow({
                ...(downloadsUrl.trim().length > 0 ? { text: downloadsUrl } : {}),
                uiLocale: getUiLocale()
              })
            }}
          >
            <IconPopOutWindow title="" size={17} />
            {uiText('downloadsPopOut')}
          </button>
          {downloadsNarrowLayout ? (
            <button
              type="button"
              className="app-btn app-btn-icon-leading"
              onClick={() => {
                onScrollToSettings()
              }}
            >
              <IconSettings title="" size={17} />
              {uiText('downloadsScrollToSettings')}
            </button>
          ) : null}
        </div>
      </div>
      <div
        className="app-downloads-url-row"
        role="group"
        aria-label={uiText('downloadsUrlRowGroupAria')}
        aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
      >
        <div className="app-downloads-url-field">
          <label htmlFor={downloadsMainUrlFieldId} className="app-visually-hidden">
            {uiText('downloadsUrlAria')}
          </label>
          <textarea
            id={downloadsMainUrlFieldId}
            className="app-downloads-url-input"
            value={downloadsUrl}
            placeholder={uiText('downloadsUrlPlaceholder')}
            aria-describedby="downloads-main-url-hint"
            onChange={(e) => {
              setDownloadsUrl(e.target.value)
            }}
          />
          <p id="downloads-main-url-hint" className="app-field-help">
            {uiText('downloadsUrlEnqueueHint')}
          </p>
        </div>
        <div
          className="app-downloads-url-actions"
          role="toolbar"
          aria-orientation="horizontal"
          aria-label={uiText('downloadsUrlActionsToolbarAria')}
          aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
        >
          <button
            type="button"
            className="app-btn app-btn-primary app-btn-icon-leading"
            onClick={() => {
              onAddToQueue()
            }}
          >
            <IconQueuePlus title="" size={17} />
            {uiText('downloadsAddToQueue')}
          </button>
          <button
            type="button"
            className="app-btn app-btn-warn app-btn-icon-leading"
            title={uiText('downloadsStopQueueTooltip')}
            onClick={() => {
              void window.fluxalloy.downloads.cancelQueue().then((res) => {
                if (!res.ok) {
                  setStatusHint(res.error)
                }
              })
            }}
          >
            <IconBan title="" size={17} />
            {uiText('downloadsStopQueue')}
          </button>
          <button
            type="button"
            className="app-btn app-btn-icon-leading"
            disabled={downloadsRows.length === 0}
            onClick={() => {
              void window.fluxalloy.downloads.clearFinished().then((res) => {
                if (!res.ok) {
                  setStatusHint(res.error)
                  return
                }
                setStatusHint(
                  res.removed > 0
                    ? uiTextVars('downloadsFinishedRemovedTemplate', { n: res.removed })
                    : uiText('downloadsNoFinishedRowsHint')
                )
              })
            }}
          >
            <IconQueueTrash title="" size={17} />
            {uiText('downloadsRemoveFinished')}
          </button>
          <button
            type="button"
            className="app-btn app-btn-warn app-btn-icon-leading"
            disabled={downloadsRows.length === 0}
            onClick={() => {
              void window.fluxalloy.downloads.clearQueue().then((res) => {
                if (!res.ok) {
                  setStatusHint(res.error)
                  return
                }
                setStatusHint(uiText('downloadsQueueClearedHint'))
              })
            }}
          >
            <IconQueueTrash title="" size={17} />
            {uiText('downloadsClearQueue')}
          </button>
        </div>
      </div>
      <div
        className="app-downloads-overview"
        role="region"
        aria-label={uiText('downloadsOverviewAria')}
        aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
      >
        <div
          className="app-downloads-overview-stats"
          role="list"
          aria-label={uiText('downloadsOverviewStatsGroupAria')}
          aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
        >
          <div className="app-downloads-stat" role="listitem">
            <span className="app-downloads-stat-label">{uiText('downloadsStatTotal')}</span>
            <strong>{downloadsStats.total}</strong>
          </div>
          <div className="app-downloads-stat" role="listitem">
            <span className="app-downloads-stat-label">
              {uiText('downloadsQueueFilterRunning')}
            </span>
            <strong>{downloadsStats.running}</strong>
          </div>
          <div className="app-downloads-stat" role="listitem">
            <span className="app-downloads-stat-label">{uiText('downloadsQueueFilterDone')}</span>
            <strong>{downloadsStats.done}</strong>
          </div>
          <div className="app-downloads-stat" role="listitem">
            <span className="app-downloads-stat-label">{uiText('downloadsQueueFilterError')}</span>
            <strong>{downloadsStats.error}</strong>
          </div>
          <div className="app-downloads-stat" role="listitem">
            <span className="app-downloads-stat-label">{uiText('downloadsStatPending')}</span>
            <strong>{downloadsStats.pending}</strong>
          </div>
        </div>
      </div>
      <div
        className="app-downloads-filterbar"
        role="toolbar"
        aria-orientation="horizontal"
        aria-label={uiText('downloadsFilterBarAria')}
        aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
      >
        {downloadsStatusFilterChips.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`app-filter-chip${downloadsStatusFilter === filter.id ? ' app-filter-chip-active' : ''}`}
            aria-pressed={downloadsStatusFilter === filter.id}
            onClick={() => {
              setDownloadsStatusFilter(filter.id)
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div
        className="app-downloads-table-zone"
        role="region"
        aria-label={uiText('downloadsQueueTableZoneAria')}
        aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
      >
        <div
          className="app-downloads-table-wrap"
          role="group"
          aria-label={uiText('downloadsQueueTableWrapGroupAria')}
          aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
        >
          <table
            className="app-downloads-table"
            aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
          >
            <caption className="app-visually-hidden">
              {uiText('downloadsQueueTableCaption')}
            </caption>
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
                  <td colSpan={9} className="app-downloads-empty">
                    {uiText('downloadsEmptyQueue')}
                  </td>
                </tr>
              ) : visibleDownloadsRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="app-downloads-empty">
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
                          aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
                        >
                          <button
                            type="button"
                            className="app-icon-btn"
                            aria-label={uiText('downloadsQueueAriaMoveUp')}
                            title={uiText('downloadsQueueAriaMoveUp')}
                            onClick={() => {
                              void window.fluxalloy.downloads.moveRow(row.id, -1).then((res) => {
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
                            aria-label={uiText('downloadsQueueAriaMoveDown')}
                            title={uiText('downloadsQueueAriaMoveDown')}
                            onClick={() => {
                              void window.fluxalloy.downloads.moveRow(row.id, 1).then((res) => {
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
                                ? window.fluxalloy.downloads.retryRow
                                : window.fluxalloy.downloads.startRow
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
                                aria-label={uiText('downloadsQueueAriaOpenFile')}
                                title={uiText('downloadsQueueAriaOpenFile')}
                                onClick={() => {
                                  void window.fluxalloy.downloads
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
                                aria-label={uiText('downloadsQueueAriaOpenFolder')}
                                title={uiText('downloadsQueueAriaOpenFolder')}
                                onClick={() => {
                                  void window.fluxalloy.downloads
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
                              <button
                                type="button"
                                className="app-icon-btn"
                                aria-label={uiText('downloadsQueueAriaOpenInEditor')}
                                title={uiText('downloadsQueueAriaOpenInEditor')}
                                onClick={() => {
                                  setStatusHint(uiText('downloadsHistoryOpenHandlerPreparing'))
                                  void window.fluxalloy.downloads
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
                              aria-label={uiText('downloadsQueueOpenDownloadDirTitle')}
                              title={uiText('downloadsQueueOpenDownloadDirTitle')}
                              onClick={() => {
                                void window.fluxalloy.downloads
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
                              disabled={
                                row.ytdlpPauseSupported !== true ||
                                row.ytdlpPauseChildActive !== true
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
                                  ? window.fluxalloy.downloads.resumeYtdlp
                                  : window.fluxalloy.downloads.pauseYtdlp
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
                            aria-label={uiText('downloadsQueueAriaRemoveRow')}
                            title={uiText('downloadsQueueAriaRemoveRow')}
                            onClick={() => {
                              void window.fluxalloy.downloads.removeRow(row.id).then((res) => {
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
        <div
          className="app-downloads-lower-stack"
          role="region"
          aria-label={uiText('downloadsLowerStackAria')}
          aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
        >
          <DownloadsHistoryPanel
            open={downloadsEmbeddedHistoryOpen}
            busy={downloadsHistoryBusy}
            entries={visibleDownloadsHistory}
            totalEntries={downloadsHistoryCount}
            outcomeFilter={downloadsHistoryOutcomeFilter}
            weeklySummary={downloadsHistoryWeeklySummary}
            onToggle={(next) => {
              persistDownloadsEmbeddedHistoryOpen(next)
            }}
            onOutcomeFilterChange={setDownloadsHistoryOutcomeFilter}
            onRefresh={() => {
              void refreshDownloadsHistory()
            }}
            onClear={() => {
              void window.fluxalloy.downloads.clearHistory().then((res) => {
                if (!res.ok) {
                  setStatusHint(res.error)
                  return
                }
                setDownloadsHistory([])
              })
            }}
            onExportVisible={() => {
              void exportVisibleDownloadsHistory()
            }}
            onRepeat={(url) => {
              void window.fluxalloy.downloads.addLines(url).then((res) => {
                if (!res.ok) {
                  setStatusHint(res.error)
                  return
                }
                onSelectDownloadsTab()
                setStatusHint(
                  res.added > 0
                    ? uiText('downloadsHistoryRepeatQueued')
                    : uiText('downloadsHistoryRepeatNotAdded')
                )
              })
            }}
          />
          <DownloadsLogPanel
            open={downloadsEmbeddedLogOpen}
            targetRowId={downloadsLogTargetRowId}
            lines={downloadsLogLines}
            downloadsTabBusy={downloadsOptionsBusy || downloadsHistoryBusy}
            onToggle={(next) => {
              persistDownloadsEmbeddedLogOpen(next)
            }}
            onClear={() => {
              setDownloadsLogLines([])
              setDownloadsLogTargetRowId(null)
            }}
            onSave={() => {
              const text = formatDownloadsLogText(downloadsLogLines)
              void window.fluxalloy.downloads.saveVisibleLog(text).then((res) => {
                if (!res.ok && res.error !== DOWNLOADS_VISIBLE_LOG_SAVE_CANCELLED) {
                  setStatusHint(res.error)
                }
              })
            }}
          />
        </div>
      </div>
    </section>
  )
}
