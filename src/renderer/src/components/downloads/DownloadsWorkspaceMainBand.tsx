import type { JSX } from 'react'

import { IconBan, IconQueuePlus, IconQueueTrash } from '../LucideMiniIcons'
import { uiText, uiTextVars } from '../../locales/ui-text'
import type { DownloadsWorkspaceMainProps } from './downloads-workspace-main-props'

export function DownloadsWorkspaceMainBand(props: DownloadsWorkspaceMainProps): JSX.Element {
  const {
    downloadsOptionsBusy,
    downloadsHistoryBusy,
    downloadsUrl,
    setDownloadsUrl,
    downloadsMainUrlFieldId,
    onAddToQueue,
    downloadsRows,
    setStatusHint
  } = props

  return (
    <>
      <div
        className="app-downloads-band"
        role="region"
        aria-label={uiText('downloadsPageIntroBandAria')}
        aria-describedby="downloads-page-hint"
        aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
      >
        <div
          className="app-downloads-band-copy"
          role="group"
          aria-label={uiText('downloadsBandHeadingCopyGroupAria')}
          aria-describedby="downloads-page-hint"
          aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
        >
          <h2 className="app-downloads-title">{uiText('downloadsPageTitle')}</h2>
          <p id="downloads-page-hint" className="app-downloads-hint">
            {uiText('downloadsPageHint')}
          </p>
        </div>
      </div>
      <div
        className="app-downloads-url-row"
        role="group"
        aria-label={uiText('downloadsUrlRowGroupAria')}
        aria-describedby="downloads-page-hint downloads-main-url-hint"
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
          aria-describedby="downloads-page-hint downloads-main-url-hint"
          aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
        >
          <button
            type="button"
            className="app-btn app-btn-primary app-btn-icon-leading"
            aria-describedby="downloads-page-hint downloads-main-url-hint"
            title={uiText('downloadsAddToQueue')}
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
            aria-describedby="downloads-page-hint downloads-main-url-hint"
            title={uiText('downloadsStopQueueTooltip')}
            onClick={() => {
              void window.velorix.downloads.cancelQueue().then((res) => {
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
            aria-describedby="downloads-page-hint downloads-main-url-hint"
            title={uiText('downloadsRemoveFinished')}
            disabled={downloadsRows.length === 0}
            onClick={() => {
              void window.velorix.downloads.clearFinished().then((res) => {
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
            aria-describedby="downloads-page-hint downloads-main-url-hint"
            title={uiText('downloadsClearQueue')}
            disabled={downloadsRows.length === 0}
            onClick={() => {
              void window.velorix.downloads.clearQueue().then((res) => {
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
    </>
  )
}
