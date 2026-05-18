import type { JSX } from 'react'

import { DownloadsSettingsRail } from './components/downloads/DownloadsSettingsRail'
import { DownloadsWorkspaceMain } from './components/downloads/DownloadsWorkspaceMain'
import { DownloadsStandaloneAppTopbar } from './components/DownloadsStandaloneAppTopbar'
import Versions from './components/Versions'
import { uiText } from './locales/ui-text'
import { useDownloadsStandaloneApp } from './use-downloads-standalone-app'

/**
 * §6 — отдельное окно менеджера загрузок yt-dlp.
 * Загружается через `index.html#downloads` тем же бандлом и preload, что и главное окно.
 */
export function DownloadsStandaloneApp(): JSX.Element {
  const model = useDownloadsStandaloneApp()
  const {
    downloadsMainProps,
    downloadsSettingsProps,
    downloadsSettingsRailRef,
    downloadsWorkspaceAriaBusy,
    statusHint
  } = model

  return (
    <div
      className="app-shell downloads-standalone-shell"
      aria-label={uiText('downloadsStandaloneShellAria')}
      aria-busy={downloadsWorkspaceAriaBusy}
    >
      <DownloadsStandaloneAppTopbar {...model} />
      <main
        className="app-main app-downloads-workspace downloads-standalone-main"
        aria-label={uiText('downloadsWorkbenchAria')}
        aria-describedby="downloads-page-hint"
        aria-busy={downloadsWorkspaceAriaBusy}
      >
        <p id="downloads-standalone-surface-hint" className="app-visually-hidden">
          {uiText('downloadsStandalonePageHint')}
        </p>
        <DownloadsWorkspaceMain
          {...downloadsMainProps}
          onScrollToSettings={downloadsMainProps.onScrollToSettings}
        />
        <DownloadsSettingsRail ref={downloadsSettingsRailRef} {...downloadsSettingsProps} />
      </main>
      <footer
        className="app-statusbar"
        aria-label={uiText('appStatusbarAria')}
        aria-busy={downloadsWorkspaceAriaBusy}
      >
        {statusHint ? (
          <span
            className="app-statusbar-extra"
            role="status"
            aria-live="polite"
            aria-describedby="downloads-page-hint"
          >
            {statusHint}
          </span>
        ) : null}
        {statusHint ? <span className="app-statusbar-sep" aria-hidden /> : null}
        <Versions
          statusBusy={downloadsWorkspaceAriaBusy}
          ariaDescribedBy="downloads-page-hint"
        />
      </footer>
    </div>
  )
}
