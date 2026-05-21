import { forwardRef, useId, type JSX } from 'react'

import { KNOWLEDGE_SLUG_DOWNLOADS_SETTINGS_RAIL } from '../../../../shared/knowledge-contract'
import { uiText } from '../../locales/ui-text'
import { KnowledgeDeepLinkButton } from '../KnowledgeDeepLinkButton'
import { IconRefreshCw } from '../LucideMiniIcons'
import { DownloadsSettingsRailExpertSection } from './DownloadsSettingsRailExpertSection'
import { DownloadsSettingsRailFormatSection } from './DownloadsSettingsRailFormatSection'
import { DownloadsSettingsRailMetadataSection } from './DownloadsSettingsRailMetadataSection'
import { DownloadsSettingsRailNetworkSection } from './DownloadsSettingsRailNetworkSection'
import { DownloadsSettingsRailSavingSection } from './DownloadsSettingsRailSavingSection'
export type { DownloadsSettingsRailProps } from './downloads-settings-rail-props'
import type { DownloadsSettingsRailProps } from './downloads-settings-rail-props'

function DownloadsSettingsRailBody(props: DownloadsSettingsRailProps): JSX.Element {
  const {
    downloadsOptionsBusy,
    downloadsHistoryBusy,
    downloadsOptions,
    refreshDownloadsOptions,
    onOpenKnowledgeArticle
  } = props

  return (
    <>
      {onOpenKnowledgeArticle ? (
        <nav
          className="app-downloads-rail-knowledge"
          aria-label={uiText('knowledgeDeepLinkDownloadsRailLabel')}
          aria-describedby="downloads-page-hint"
        >
          <KnowledgeDeepLinkButton
            label={uiText('knowledgeDeepLinkDownloadsRailLabel')}
            tooltip={uiText('knowledgeDeepLinkDownloadsRailTooltip')}
            ariaDescribedBy="downloads-page-hint"
            disabled={downloadsOptionsBusy || downloadsHistoryBusy}
            onOpen={() => {
              onOpenKnowledgeArticle(KNOWLEDGE_SLUG_DOWNLOADS_SETTINGS_RAIL)
            }}
          />
        </nav>
      ) : null}
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
    </>
  )
}

export const DownloadsSettingsRail = forwardRef<HTMLElement, DownloadsSettingsRailProps>(
  function DownloadsSettingsRail(props, ref) {
    const {
      downloadsOptionsBusy,
      downloadsHistoryBusy,
      stackedLayout,
      embeddedOpen = false,
      onEmbeddedToggle
    } = props
    const settingsPanelBodyId = useId()
    const tabBusy = downloadsOptionsBusy || downloadsHistoryBusy

    if (stackedLayout) {
      return (
        <aside
          ref={ref}
          id="downloads-ytdlp-settings-rail"
          className="app-downloads-rail app-downloads-rail--stacked"
          aria-label={uiText('downloadsRailAria')}
          aria-describedby="downloads-page-hint"
          aria-busy={tabBusy}
        >
          <details
            className="app-downloads-settings-panel"
            open={embeddedOpen}
            aria-busy={tabBusy}
            aria-label={uiText('downloadsSettingsPanelDetailsAria')}
            aria-describedby="downloads-page-hint"
            onToggle={(event) => {
              event.preventDefault()
              onEmbeddedToggle?.(!embeddedOpen)
            }}
          >
            <summary
              className="app-downloads-settings-panel-summary"
              aria-controls={settingsPanelBodyId}
              aria-describedby="downloads-page-hint"
            >
              {uiText('downloadsRailTitle')}
            </summary>
            <div id={settingsPanelBodyId} className="app-downloads-settings-panel-body">
              <p className="app-settings-subtitle" title={uiText('downloadsRailIntroTooltip')}>
                {uiText('downloadsRailSubtitle')}
              </p>
              <DownloadsSettingsRailBody {...props} />
            </div>
          </details>
        </aside>
      )
    }

    return (
      <aside
        ref={ref}
        id="downloads-ytdlp-settings-rail"
        className="app-downloads-rail"
        aria-label={uiText('downloadsRailAria')}
        aria-describedby="downloads-page-hint"
        aria-busy={tabBusy}
      >
        <div className="app-settings-panel-head">
          <div>
            <h3 className="app-settings-title">{uiText('downloadsRailTitle')}</h3>
            <p className="app-settings-subtitle" title={uiText('downloadsRailIntroTooltip')}>
              {uiText('downloadsRailSubtitle')}
            </p>
          </div>
          {props.onOpenKnowledgeArticle ? (
            <nav
              className="app-downloads-rail-knowledge"
              aria-label={uiText('knowledgeDeepLinkDownloadsRailLabel')}
              aria-describedby="downloads-page-hint"
            >
              <KnowledgeDeepLinkButton
                label={uiText('knowledgeDeepLinkDownloadsRailLabel')}
                tooltip={uiText('knowledgeDeepLinkDownloadsRailTooltip')}
                ariaDescribedBy="downloads-page-hint"
                disabled={tabBusy}
                onOpen={() => {
                  props.onOpenKnowledgeArticle?.(KNOWLEDGE_SLUG_DOWNLOADS_SETTINGS_RAIL)
                }}
              />
            </nav>
          ) : null}
        </div>
        <DownloadsSettingsRailBody {...props} />
      </aside>
    )
  }
)
