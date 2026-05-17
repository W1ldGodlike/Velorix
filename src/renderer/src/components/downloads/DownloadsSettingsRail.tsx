import { forwardRef } from 'react'

import { uiText } from '../../locales/ui-text'
import { IconRefreshCw } from '../LucideMiniIcons'
import { DownloadsSettingsRailExpertSection } from './DownloadsSettingsRailExpertSection'
import { DownloadsSettingsRailFormatSection } from './DownloadsSettingsRailFormatSection'
import { DownloadsSettingsRailMetadataSection } from './DownloadsSettingsRailMetadataSection'
import { DownloadsSettingsRailNetworkSection } from './DownloadsSettingsRailNetworkSection'
import { DownloadsSettingsRailSavingSection } from './DownloadsSettingsRailSavingSection'
export type { DownloadsSettingsRailProps } from './downloads-settings-rail-props'
import type { DownloadsSettingsRailProps } from './downloads-settings-rail-props'

export const DownloadsSettingsRail = forwardRef<HTMLElement, DownloadsSettingsRailProps>(
  function DownloadsSettingsRail(props, ref) {
    const {
      downloadsOptionsBusy,
      downloadsHistoryBusy,
      downloadsOptions,
      refreshDownloadsOptions
    } = props

    return (
      <aside
        ref={ref}
        id="downloads-ytdlp-settings-rail"
        className="app-downloads-rail"
        aria-label={uiText('downloadsRailAria')}
        aria-describedby="downloads-page-hint"
        aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
      >
        <h3 className="app-settings-title">{uiText('downloadsRailTitle')}</h3>
        <p className="app-settings-subtitle" title={uiText('downloadsRailIntroTooltip')}>
          {uiText('downloadsRailSubtitle')}
        </p>
        {downloadsOptions ? (
          <div
            className="app-downloads-settings-stack"
            role="region"
            aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
            aria-label={uiText('downloadsSettingsSectionsStackAria')}
            aria-describedby="downloads-page-hint"
          >
            <DownloadsSettingsRailFormatSection {...props} />
            <DownloadsSettingsRailMetadataSection {...props} />
            <DownloadsSettingsRailSavingSection {...props} />
            <DownloadsSettingsRailNetworkSection {...props} />
            <DownloadsSettingsRailExpertSection {...props} />
            {downloadsOptions.cookiesWarning ? (
              <p
                className="app-downloads-warning"
                role="alert"
                aria-describedby="downloads-page-hint"
              >
                {downloadsOptions.cookiesWarning}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="app-settings-subtitle">{uiText('downloadsOptionsLoading')}</p>
        )}
        <div
          className="app-downloads-rail-footer"
          role="toolbar"
          aria-orientation="horizontal"
          aria-label={uiText('downloadsRailFooterToolbarAria')}
          aria-describedby="downloads-page-hint"
          aria-busy={downloadsOptionsBusy || downloadsHistoryBusy}
        >
          <button
            type="button"
            className="app-btn app-btn-icon-leading"
            aria-describedby="downloads-page-hint"
            disabled={downloadsOptionsBusy}
            title={uiText('downloadsTooltipRefreshFooter')}
            onClick={() => {
              void refreshDownloadsOptions()
            }}
          >
            <IconRefreshCw title="" size={16} />
            {uiText('downloadsRailRefreshOptions')}
          </button>
        </div>
      </aside>
    )
  }
)
