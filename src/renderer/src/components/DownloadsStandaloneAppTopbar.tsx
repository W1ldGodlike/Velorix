import type { JSX } from 'react'

import { IconBook, IconDownload, IconMoon, IconSun } from './LucideMiniIcons'
import { formatStatusbarLocaleShort } from '../statusbar-locale-display'
import { getUiLocale, miniIconTitle, uiText } from '../locales/ui-text'
import type { DownloadsStandaloneAppModel } from '../use-downloads-standalone-app'

export function DownloadsStandaloneAppTopbar(props: DownloadsStandaloneAppModel): JSX.Element {
  const { theme, downloadsWorkspaceAriaBusy, handleUiLocaleToggle, toggleTheme, onOpenKnowledge } =
    props

  return (
    <header
      className="app-topbar downloads-standalone-topbar"
      aria-label={uiText('downloadsStandaloneTopbarAria')}
      aria-describedby="downloads-page-hint"
      aria-busy={downloadsWorkspaceAriaBusy}
    >
      <div
        className="app-topbar-brand downloads-standalone-brand"
        aria-label={uiText('downloadsStandaloneBrandAria')}
        aria-describedby="downloads-page-hint"
      >
        <span className="app-topbar-mark downloads-standalone-mark-icon" aria-hidden>
          <IconDownload title="" size={13} />
        </span>
        <span className="app-topbar-title">{uiText('downloadsStandaloneHeaderTitle')}</span>
      </div>
      <div
        className="app-topbar-actions"
        role="toolbar"
        aria-orientation="horizontal"
        aria-label={uiText('downloadsBandToolbarAria')}
        aria-describedby="downloads-page-hint"
        aria-busy={downloadsWorkspaceAriaBusy}
      >
        <button
          type="button"
          className="app-icon-btn app-locale-badge"
          aria-describedby="downloads-page-hint"
          onClick={handleUiLocaleToggle}
          title={
            getUiLocale() === 'ru'
              ? uiText('topbarUiLocaleSwitchToEnglishTitle')
              : uiText('topbarUiLocaleSwitchToRussianTitle')
          }
        >
          <span aria-hidden>{formatStatusbarLocaleShort(getUiLocale())}</span>
          <span className="app-visually-hidden">
            {getUiLocale() === 'ru'
              ? uiText('topbarUiLocaleVisuallyHiddenRu')
              : uiText('topbarUiLocaleVisuallyHiddenEn')}
          </span>
        </button>
        <button
          type="button"
          className="app-icon-btn"
          aria-describedby="downloads-page-hint"
          onClick={() => {
            onOpenKnowledge()
          }}
          title={uiText('knowledgeTopbarTooltip')}
        >
          <IconBook title="" size={18} />
          <span className="app-visually-hidden">{uiText('topbarKnowledgeLabel')}</span>
        </button>
        <button
          type="button"
          className="app-icon-btn"
          aria-describedby="downloads-page-hint"
          onClick={() => {
            void toggleTheme()
          }}
          title={uiText('downloadsStandaloneThemeToggleTitle')}
        >
          {theme === 'dark' ? <IconSun /> : <IconMoon />}
          <span className="app-visually-hidden">
            {theme === 'dark' ? miniIconTitle('miniIconSun') : miniIconTitle('miniIconMoon')}
          </span>
        </button>
      </div>
    </header>
  )
}
