import type { JSX } from 'react'

import type { YtdlpQueueRetryProfileId } from '../../../../shared/ytdlp-download-contract'
import { uiText } from '../../locales/ui-text'
import type { DownloadsSettingsRailProps } from './downloads-settings-rail-props'

export function DownloadsSettingsRailNetworkSection(
  props: DownloadsSettingsRailProps
): JSX.Element | null {
  const {
    downloadsOptionsBusy,
    downloadsHistoryBusy,
    downloadsOptions,
    setDownloadsOptions,
    downloadsRailPanels,
    onRailSectionToggle,
    applyDownloadsOptionsPatch
  } = props
  const handleDownloadsRailSectionToggle = onRailSectionToggle
  if (!downloadsOptions) {
    return null
  }
  return (
    <details
      className="app-downloads-rail-section"
      aria-label={uiText('downloadsRailNetworkSummary')}
      aria-describedby="downloads-page-hint"
      aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
      open={downloadsRailPanels.network}
      onToggle={handleDownloadsRailSectionToggle('network')}
    >
      <summary
        className="app-downloads-rail-summary"
        title={uiText('downloadsTooltipSectionNetwork')}
        aria-describedby="downloads-page-hint"
      >
        {uiText('downloadsRailNetworkSummary')}
      </summary>
      <div className="app-downloads-rail-section-body">
        <label className="app-field" title={uiText('downloadsTooltipQueueRetrySelect')}>
          <span>{uiText('downloadsQueueRetryLabel')}</span>
          <select
            className="app-control"
            aria-describedby="downloads-page-hint"
            title={uiText('downloadsTooltipQueueRetrySelect')}
            value={downloadsOptions.queueRetryProfile}
            disabled={downloadsOptionsBusy}
            onChange={(e) => {
              void applyDownloadsOptionsPatch({
                queueRetryProfile: e.target.value as YtdlpQueueRetryProfileId
              })
            }}
          >
            {downloadsOptions.queueRetryProfileChoices.map((choice) => (
              <option key={choice.id} value={choice.id}>
                {choice.label}
              </option>
            ))}
          </select>
          <span className="app-field-help">{uiText('downloadsQueueRetryHelp')}</span>
        </label>
        <div className="app-downloads-select-grid">
          <label className="app-field" title={uiText('downloadsTooltipRateLimitInput')}>
            <span>{uiText('downloadsRateLimitLabel')}</span>
            <input
              className="app-control"
              aria-describedby="downloads-page-hint"
              title={uiText('downloadsTooltipRateLimitInput')}
              value={downloadsOptions.rateLimit}
              disabled={downloadsOptionsBusy}
              placeholder={uiText('downloadsRateLimitPlaceholder')}
              spellCheck={false}
              onChange={(e) => {
                setDownloadsOptions({ ...downloadsOptions, rateLimit: e.target.value })
              }}
              onBlur={(e) => {
                void applyDownloadsOptionsPatch({ rateLimit: e.target.value })
              }}
            />
            <span className="app-field-help">{uiText('downloadsRateLimitHelp')}</span>
          </label>
          <label className="app-field" title={uiText('downloadsTooltipRetriesInput')}>
            <span>{uiText('downloadsYtdlpRetriesLabel')}</span>
            <input
              className="app-control"
              aria-describedby="downloads-page-hint"
              title={uiText('downloadsTooltipRetriesInput')}
              value={downloadsOptions.retriesLine}
              disabled={downloadsOptionsBusy}
              inputMode="numeric"
              placeholder={uiText('downloadsYtdlpRetriesPlaceholder')}
              spellCheck={false}
              onChange={(e) => {
                setDownloadsOptions({
                  ...downloadsOptions,
                  retriesLine: e.target.value
                })
              }}
              onBlur={(e) => {
                void applyDownloadsOptionsPatch({ retriesLine: e.target.value })
              }}
            />
            <span className="app-field-help">{uiText('downloadsYtdlpRetriesHelp')}</span>
          </label>
          <label className="app-field" title={uiText('downloadsTooltipFragmentRetriesInput')}>
            <span>{uiText('downloadsFragmentRetriesLabel')}</span>
            <input
              className="app-control"
              aria-describedby="downloads-page-hint"
              title={uiText('downloadsTooltipFragmentRetriesInput')}
              value={downloadsOptions.fragmentRetriesLine}
              disabled={downloadsOptionsBusy}
              inputMode="numeric"
              placeholder={uiText('downloadsFragmentRetriesPlaceholder')}
              spellCheck={false}
              onChange={(e) => {
                setDownloadsOptions({
                  ...downloadsOptions,
                  fragmentRetriesLine: e.target.value
                })
              }}
              onBlur={(e) => {
                void applyDownloadsOptionsPatch({
                  fragmentRetriesLine: e.target.value
                })
              }}
            />
            <span className="app-field-help">{uiText('downloadsFragmentRetriesHelp')}</span>
          </label>
        </div>
      </div>
    </details>
  )
}
