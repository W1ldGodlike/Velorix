import type { JSX } from 'react'

import {
  IconCircleHelp,
  IconFilm,
  IconFolder,
  IconFolderOpen,
  IconMoon,
  IconRefreshCw,
  IconSun
} from './LucideMiniIcons'
import { formatStatusbarLocaleShort } from '../statusbar-locale-display'
import { getUiLocale, miniIconTitle, uiText } from '../locales/ui-text'
import type { InspectorStandaloneAppModel } from '../use-inspector-standalone-app'

export function InspectorStandaloneAppTopbar(props: InspectorStandaloneAppModel): JSX.Element {
  const {
    theme,
    mediaPath,
    probePending,
    handleOpenFolderDialog,
    handleOpenDialog,
    setProbeRefreshNonce,
    openAboutDialog,
    handleUiLocaleToggle,
    toggleTheme
  } = props

  return (
    <header
      className="app-topbar"
      aria-label={uiText('inspectorStandaloneTopbarAria')}
      aria-describedby="inspector-standalone-empty-hint"
      aria-busy={probePending}
    >
      <div
        className="app-topbar-brand inspector-toolbar-brand"
        aria-label={uiText('inspectorStandaloneBrandAria')}
        aria-describedby="inspector-standalone-empty-hint"
        aria-busy={probePending}
      >
        <span className="app-topbar-mark inspector-topbar-mark-icon" aria-hidden>
          <IconFilm title="" size={13} />
        </span>
        <span className="app-topbar-title">{uiText('inspectorStandaloneHeaderTitle')}</span>
        <span className="app-topbar-version">{uiText('inspectorStandaloneTopbarEngineLabel')}</span>
      </div>
      <div
        className="inspector-topbar-trailing"
        role="group"
        aria-label={uiText('inspectorTopbarTrailingGroupAria')}
        aria-describedby="inspector-standalone-empty-hint"
        aria-busy={probePending && mediaPath !== null}
      >
        <div className="inspector-topbar-spacer" aria-hidden />
        <div
          className="app-topbar-actions"
          role="toolbar"
          aria-orientation="horizontal"
          aria-label={uiText('inspectorTopbarActionsToolbarAria')}
          aria-describedby="inspector-standalone-empty-hint"
          aria-busy={probePending && mediaPath !== null}
        >
          <button
            type="button"
            className="app-icon-btn"
            aria-describedby="inspector-standalone-empty-hint"
            onClick={() => {
              void handleOpenFolderDialog()
            }}
            title={uiText('topbarOpenVideoFolderTitle')}
          >
            <IconFolder />
            <span className="app-visually-hidden">{uiText('topbarOpenVideoFolderLabel')}</span>
          </button>
          <button
            type="button"
            className="app-icon-btn app-icon-btn-primary"
            aria-describedby="inspector-standalone-empty-hint"
            onClick={() => {
              void handleOpenDialog()
            }}
            title={uiText('inspectorStandaloneOpenPickTitle')}
          >
            <IconFolderOpen title={miniIconTitle('miniIconFolderOpenEllipsis')} />
            <span className="app-visually-hidden">
              {uiText('inspectorStandaloneOpenVisuallyHidden')}
            </span>
          </button>
          <button
            type="button"
            className="app-icon-btn"
            aria-describedby="inspector-standalone-empty-hint"
            disabled={!mediaPath}
            onClick={() => {
              setProbeRefreshNonce((n) => n + 1)
            }}
            title={
              !mediaPath
                ? uiText('inspectorStandaloneFfprobeRefreshDisabledTitle')
                : uiText('inspectorStandaloneFfprobeRefreshTitle')
            }
          >
            <IconRefreshCw
              title={
                !mediaPath
                  ? uiText('inspectorStandaloneFfprobeRefreshDisabledTitle')
                  : uiText('inspectorStandaloneFfprobeRefreshTitle')
              }
            />
            <span className="app-visually-hidden">
              {uiText('inspectorStandaloneFfprobeRefreshVisuallyHidden')}
            </span>
          </button>
          <button
            type="button"
            className="app-icon-btn"
            aria-describedby="inspector-standalone-empty-hint"
            onClick={openAboutDialog}
            title={uiText('inspectorStandaloneAboutDiagnosticsTitle')}
          >
            <IconCircleHelp />
            <span className="app-visually-hidden">{uiText('aboutTitle')}</span>
          </button>
          <button
            type="button"
            className="app-icon-btn app-locale-badge"
            aria-describedby="inspector-standalone-empty-hint"
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
            aria-describedby="inspector-standalone-empty-hint"
            onClick={() => {
              void toggleTheme()
            }}
            title={uiText('inspectorStandaloneThemeToggleTitle')}
          >
            {theme === 'dark' ? <IconSun /> : <IconMoon />}
            <span className="app-visually-hidden">
              {theme === 'dark' ? miniIconTitle('miniIconSun') : miniIconTitle('miniIconMoon')}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
