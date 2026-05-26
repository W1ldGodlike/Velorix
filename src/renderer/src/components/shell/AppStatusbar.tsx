import type { JSX } from 'react'

import Versions from '../Versions'
import type { EngineSummary } from '../../app-engines-ui'
import { engineSummaryText } from '../../app-engines-ui'
import { type WorkspaceTab, workspaceTabDescId } from '../../app-terminal-hint-ui'
import { uiText } from '../../locales/ui-text'
import type { AppUiLocale } from '../../../../shared/app-ui-locale'
import { formatStatusbarLocaleShort } from '../../statusbar-locale-display'

export type AppStatusbarProps = {
  appChromeBusy: boolean
  workspaceTab: WorkspaceTab
  engineDownloadBusy: boolean
  engineSummary: EngineSummary
  engineVersionsLine: string
  exportCodecStatusbarLabel: string
  exportCodecStatusbarTitle: string
  exportCodecStatusbarAria: string
  exportBusy: boolean
  snapshotBusy: boolean
  exportCancelBusy: boolean
  probePending: boolean
  batchExportBusy: boolean
  statusHint: string | null
  uiLocale: AppUiLocale
  statusbarActivityLabel: string
  statusbarActivityTitle: string
  statusbarActivityActive: boolean
}

export function AppStatusbar(props: AppStatusbarProps): JSX.Element {
  const {
    appChromeBusy,
    workspaceTab,
    engineDownloadBusy,
    engineSummary,
    engineVersionsLine,
    exportCodecStatusbarLabel,
    exportCodecStatusbarTitle,
    exportCodecStatusbarAria,
    exportBusy,
    snapshotBusy,
    exportCancelBusy,
    probePending,
    batchExportBusy,
    statusHint,
    uiLocale,
    statusbarActivityLabel,
    statusbarActivityTitle,
    statusbarActivityActive
  } = props

  const currentWorkspaceTabDescId = workspaceTabDescId(workspaceTab)

  const localeShort = formatStatusbarLocaleShort(uiLocale)
  const localeTitle =
    uiLocale === 'en' ? uiText('statusbarLocaleTitleEn') : uiText('statusbarLocaleTitleRu')

  return (
    <footer
      className="app-statusbar"
      aria-label={uiText('appStatusbarAria')}
      aria-describedby={currentWorkspaceTabDescId}
      aria-busy={appChromeBusy}
    >
      <div
        role="group"
        aria-label={uiText('statusbarActivityClusterAria')}
        className="app-statusbar-cluster app-statusbar-activity"
        aria-describedby={currentWorkspaceTabDescId}
      >
        <span
          className={
            statusbarActivityActive
              ? 'app-statusbar-activity-dot app-statusbar-activity-dot--active'
              : 'app-statusbar-activity-dot'
          }
          aria-hidden
        />
        <span className="app-statusbar-activity-label" title={statusbarActivityTitle}>
          {statusbarActivityLabel}
        </span>
      </div>
      <span className="app-statusbar-sep" aria-hidden />
      <div
        role="group"
        aria-label={uiText('statusbarLocaleClusterAria')}
        className="app-statusbar-cluster"
        aria-describedby={currentWorkspaceTabDescId}
      >
        <span className="app-statusbar-locale" title={localeTitle} lang={uiLocale}>
          {localeShort}
        </span>
      </div>
      <span className="app-statusbar-sep" aria-hidden />
      <div
        role="group"
        aria-label={uiText('statusbarEnginesClusterAria')}
        className="app-statusbar-cluster"
        aria-describedby={currentWorkspaceTabDescId}
        aria-busy={engineDownloadBusy || engineSummary === 'checking'}
      >
        <span>{engineSummaryText(engineSummary)}</span>
        {engineVersionsLine ? (
          <>
            <span className="app-statusbar-sep" aria-hidden />
            <span className="app-statusbar-engines" title={engineVersionsLine}>
              {engineVersionsLine}
            </span>
          </>
        ) : null}
      </div>
      {workspaceTab === 'processing' ? (
        <div
          role="group"
          aria-label={uiText('statusbarExportCodecClusterAria')}
          className="app-statusbar-cluster"
          aria-describedby={workspaceTabDescId('processing')}
          aria-busy={
            exportBusy || snapshotBusy || exportCancelBusy || probePending || batchExportBusy
          }
        >
          <span className="app-statusbar-sep" aria-hidden />
          <span
            className="app-statusbar-codec"
            title={exportCodecStatusbarTitle}
            aria-label={exportCodecStatusbarAria}
          >
            {exportCodecStatusbarLabel}
          </span>
        </div>
      ) : null}
      {statusHint ? (
        <>
          <span className="app-statusbar-sep" aria-hidden />
          <span
            className="app-statusbar-extra"
            role="status"
            aria-live="polite"
            aria-describedby={currentWorkspaceTabDescId}
          >
            {statusHint}
          </span>
        </>
      ) : null}
      <span className="app-statusbar-sep" aria-hidden />
      <Versions
        statusBusy={engineDownloadBusy || engineSummary === 'checking'}
        ariaDescribedBy={currentWorkspaceTabDescId}
      />
    </footer>
  )
}
