import type { JSX } from 'react'

import Versions from '../Versions'
import type { EngineSummary } from '../../app-engines-ui'
import { engineSummaryText } from '../../app-engines-ui'
import type { WorkspaceTab } from '../../app-terminal-hint-ui'
import { uiText } from '../../locales/ui-text'

export type AppStatusbarProps = {
  appChromeBusy: boolean
  workspaceTab: WorkspaceTab
  engineDownloadBusy: boolean
  engineSummary: EngineSummary
  engineVersionsLine: string
  exportCodecStatusbarLabel: string
  exportBusy: boolean
  snapshotBusy: boolean
  exportCancelBusy: boolean
  probePending: boolean
  batchExportBusy: boolean
  statusHint: string | null
}

export function AppStatusbar(props: AppStatusbarProps): JSX.Element {
  const {
    appChromeBusy,
    workspaceTab,
    engineDownloadBusy,
    engineSummary,
    engineVersionsLine,
    exportCodecStatusbarLabel,
    exportBusy,
    snapshotBusy,
    exportCancelBusy,
    probePending,
    batchExportBusy,
    statusHint
  } = props

  const workspaceTabDescId =
    workspaceTab === 'editor'
      ? 'workspace-tab-editor-desc'
      : workspaceTab === 'downloads'
        ? 'workspace-tab-downloads-desc'
        : 'workspace-tab-terminal-desc'

  return (
    <footer
      className="app-statusbar"
      aria-label={uiText('appStatusbarAria')}
      aria-describedby={workspaceTabDescId}
      aria-busy={appChromeBusy}
    >
      <div
        role="group"
        aria-label={uiText('statusbarEnginesClusterAria')}
        className="app-statusbar-cluster"
        aria-describedby={workspaceTabDescId}
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
      {workspaceTab === 'editor' ? (
        <div
          role="group"
          aria-label={uiText('statusbarExportCodecClusterAria')}
          className="app-statusbar-cluster"
          aria-describedby="workspace-tab-editor-desc"
          aria-busy={
            exportBusy || snapshotBusy || exportCancelBusy || probePending || batchExportBusy
          }
        >
          <span className="app-statusbar-sep" aria-hidden />
          <span className="app-statusbar-codec" title={exportCodecStatusbarLabel}>
            {exportCodecStatusbarLabel}
          </span>
        </div>
      ) : null}
      {statusHint ? (
        <>
          <span className="app-statusbar-sep" aria-hidden />
          <span className="app-statusbar-extra" role="status" aria-live="polite">
            {statusHint}
          </span>
        </>
      ) : null}
      <span className="app-statusbar-sep" aria-hidden />
      <Versions
        statusBusy={engineDownloadBusy || engineSummary === 'checking'}
        ariaDescribedBy={workspaceTabDescId}
      />
    </footer>
  )
}
