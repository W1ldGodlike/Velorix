import type { YtdlpCookiesBrowserId, YtdlpImpersonateId } from '../../../../shared/ytdlp-download-contract'
import { uiText } from '../../locales/ui-text'
import { PillSwitch } from '../PillSwitch'
import { IconQueueFile, IconQueueX } from '../LucideMiniIcons'
import type { DownloadsSettingsRailProps } from './downloads-settings-rail-props'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- JSX section
export function DownloadsSettingsRailMetadataSection(props: DownloadsSettingsRailProps) {
  const {
    downloadsOptionsBusy,
    downloadsHistoryBusy,
    downloadsOptions,
    setDownloadsOptions,
    downloadsRailPanels,
    onRailSectionToggle,
    applyDownloadsOptionsPatch,
    setStatusHint,
    refreshDownloadsOptions
  } = props
  const handleDownloadsRailSectionToggle = onRailSectionToggle
  if (!downloadsOptions) {
    return null
  }
  return (
    <details
      className="app-downloads-rail-section"
      aria-label={uiText('downloadsRailMetadataSummary')}
      aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
      open={downloadsRailPanels.metadata}
      onToggle={handleDownloadsRailSectionToggle('metadata')}
    >
      <summary
        className="app-downloads-rail-summary"
        title={uiText('downloadsTooltipSectionMetadata')}
      >
        {uiText('downloadsRailMetadataSummary')}
      </summary>
      <div className="app-downloads-rail-section-body">
        <div className="app-field app-field-switch">
          <span>{uiText('downloadsOpenAfterSuccessSpan')}</span>
          <PillSwitch
            label={uiText('downloadsOpenAfterSuccessPillLabel')}
            tooltip={uiText('downloadsTooltipOpenAfterSuccess')}
            checked={downloadsOptions.openInHandlerOnComplete}
            describedBy="downloadsOpenAfterSuccessHint"
            disabled={downloadsOptionsBusy}
            onToggle={() => {
              void applyDownloadsOptionsPatch({
                openInHandlerOnComplete: !downloadsOptions.openInHandlerOnComplete
              })
            }}
          />
          <span id="downloadsOpenAfterSuccessHint" className="app-field-help">
            {uiText('downloadsOpenAfterSuccessHint')}
          </span>
        </div>
        <div className="app-field app-field-switch">
          <span>{uiText('downloadsAutoExportSpan')}</span>
          <PillSwitch
            label={uiText('downloadsAutoExportPillLabel')}
            tooltip={uiText('downloadsTooltipAutoExport')}
            checked={downloadsOptions.autoExportAfterOpenInHandler}
            describedBy="downloadsAutoExportAfterOpenHint"
            disabled={downloadsOptionsBusy || !downloadsOptions.openInHandlerOnComplete}
            onToggle={() => {
              void applyDownloadsOptionsPatch({
                autoExportAfterOpenInHandler: !downloadsOptions.autoExportAfterOpenInHandler
              })
            }}
          />
          <span id="downloadsAutoExportAfterOpenHint" className="app-field-help">
            {uiText('downloadsAutoExportHint')}
          </span>
        </div>
        <div className="app-field app-field-switch">
          <span>{uiText('downloadsEnqueueBatchSpan')}</span>
          <PillSwitch
            label={uiText('downloadsEnqueueBatchPillLabel')}
            tooltip={uiText('downloadsTooltipEnqueueBatch')}
            checked={downloadsOptions.enqueueBatchOnDownloadComplete}
            describedBy="downloadsEnqueueBatchHint"
            disabled={downloadsOptionsBusy}
            onToggle={() => {
              void applyDownloadsOptionsPatch({
                enqueueBatchOnDownloadComplete: !downloadsOptions.enqueueBatchOnDownloadComplete
              })
            }}
          />
          <span id="downloadsEnqueueBatchHint" className="app-field-help">
            {uiText('downloadsEnqueueBatchHint')}
          </span>
        </div>
        <div className="app-field app-field-switch">
          <span>{uiText('downloadsAutoStartBatchSpan')}</span>
          <PillSwitch
            label={uiText('downloadsAutoStartBatchPillLabel')}
            tooltip={uiText('downloadsTooltipAutoStartBatch')}
            checked={downloadsOptions.autoStartBatchAfterEnqueue}
            describedBy="downloadsAutoStartBatchHint"
            disabled={downloadsOptionsBusy || !downloadsOptions.enqueueBatchOnDownloadComplete}
            onToggle={() => {
              void applyDownloadsOptionsPatch({
                autoStartBatchAfterEnqueue: !downloadsOptions.autoStartBatchAfterEnqueue
              })
            }}
          />
          <span id="downloadsAutoStartBatchHint" className="app-field-help">
            {uiText('downloadsAutoStartBatchHint')}
          </span>
        </div>
        <div className="app-downloads-select-grid">
          <label className="app-field" title={uiText('downloadsTooltipCookiesBrowser')}>
            <span>{uiText('downloadsCookiesBrowserLabel')}</span>
            <select
              className="app-control"
              title={uiText('downloadsTooltipCookiesBrowser')}
              value={downloadsOptions.cookiesBrowserChoice}
              disabled={downloadsOptionsBusy}
              onChange={(e) => {
                void applyDownloadsOptionsPatch({
                  cookiesBrowser: e.target.value as 'none' | YtdlpCookiesBrowserId
                })
              }}
            >
              <option value="none">{uiText('downloadsCookiesBrowserNone')}</option>
              <option value="chrome">{uiText('downloadsYtdlpBrowserPrettyChrome')}</option>
              <option value="edge">{uiText('downloadsYtdlpBrowserPrettyEdge')}</option>
              <option value="firefox">{uiText('downloadsYtdlpBrowserPrettyFirefox')}</option>
            </select>
          </label>
          <label className="app-field" title={uiText('downloadsTooltipImpersonate')}>
            <span>{uiText('downloadsImpersonateLabel')}</span>
            <select
              className="app-control"
              title={uiText('downloadsTooltipImpersonate')}
              value={downloadsOptions.impersonateChoice}
              disabled={downloadsOptionsBusy}
              onChange={(e) => {
                void applyDownloadsOptionsPatch({
                  impersonate: e.target.value as 'none' | YtdlpImpersonateId
                })
              }}
            >
              <option value="none">{uiText('downloadsImpersonateOff')}</option>
              <option value="chrome">{uiText('downloadsYtdlpBrowserTokenChrome')}</option>
              <option value="edge">{uiText('downloadsYtdlpBrowserTokenEdge')}</option>
              <option value="firefox">{uiText('downloadsYtdlpBrowserTokenFirefox')}</option>
            </select>
          </label>
        </div>
        <label className="app-field" title={uiText('downloadsTooltipCookiesProfile')}>
          <span>{uiText('downloadsCookiesProfileLabel')}</span>
          <input
            className="app-control app-downloads-template-input"
            title={uiText('downloadsTooltipCookiesProfile')}
            value={downloadsOptions.cookiesBrowserProfileLine}
            disabled={downloadsOptionsBusy}
            spellCheck={false}
            autoComplete="off"
            placeholder={uiText('downloadsCookiesProfilePlaceholder')}
            aria-describedby="downloadsCookiesProfileHint"
            onChange={(e) => {
              setDownloadsOptions({
                ...downloadsOptions,
                cookiesBrowserProfileLine: e.target.value
              })
            }}
            onBlur={(e) => {
              void applyDownloadsOptionsPatch({
                cookiesBrowserProfile: e.target.value
              })
            }}
          />
          <span id="downloadsCookiesProfileHint" className="app-field-help">
            {uiText('downloadsCookiesProfileHint')}
          </span>
        </label>
        <div
          className="app-downloads-output-dir"
          role="group"
          aria-label={uiText('downloadsCookiesFileGroupAria')}
          aria-describedby="downloads-page-hint downloadsCookiesProfileHint"
          aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
        >
          <span className="app-field-help">{uiText('downloadsCookiesNetscapeHelp')}</span>
          <strong title={downloadsOptions.cookiesFilePathStored}>
            {downloadsOptions.cookiesFilePathStored || uiText('downloadsCookiesFileNotSelected')}
          </strong>
          <span className="app-field-help">{uiText('downloadsCookiesFilePriorityHelp')}</span>
          <div
            className="app-downloads-history-actions"
            role="toolbar"
            aria-orientation="horizontal"
            aria-label={uiText('downloadsCookiesFileActionsToolbarAria')}
            aria-describedby="downloads-page-hint downloadsCookiesProfileHint"
            aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
          >
            <button
              type="button"
              className="app-btn app-btn-compact app-btn-icon-leading"
              disabled={downloadsOptionsBusy}
              title={uiText('downloadsTooltipCookiesPick')}
              onClick={() => {
                void window.fluxalloy.downloads.pickCookiesFile().then((res) => {
                  if (res.ok) {
                    void refreshDownloadsOptions()
                    return
                  }
                  if ('error' in res) {
                    setStatusHint(res.error)
                  }
                })
              }}
            >
              <IconQueueFile title="" size={14} />
              {uiText('downloadsRailPick')}
            </button>
            <button
              type="button"
              className="app-btn app-btn-compact app-btn-icon-leading"
              disabled={downloadsOptionsBusy || downloadsOptions.cookiesFilePathStored.length === 0}
              title={uiText('downloadsTooltipCookiesClear')}
              onClick={() => {
                void window.fluxalloy.downloads.clearCookiesFile().then((res) => {
                  if (!res.ok) {
                    setStatusHint(res.error)
                    return
                  }
                  void refreshDownloadsOptions()
                })
              }}
            >
              <IconQueueX title="" size={14} />
              {uiText('downloadsHistoryClear')}
            </button>
          </div>
        </div>
      </div>
    </details>
  )
}
