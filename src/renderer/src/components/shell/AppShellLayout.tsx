import type { JSX } from 'react'

import { uiText } from '../../locales/ui-text'
import type { AppShellLayoutChromeProps } from '../../use-app-shell-layout-props'
import type { AppWorkspaceMainProps } from './AppWorkspaceMain'
import { AppOverlayDialogs } from './AppOverlayDialogs'
import { AppStatusbar } from './AppStatusbar'
import { AppWorkspaceMain } from './AppWorkspaceMain'
import { AppWorkspaceTopbar } from './AppWorkspaceTopbar'
import { AppSettingsDialog } from './AppSettingsDialog'
import { ExternalFilterScriptDialog } from './ExternalFilterScriptDialog'
import { WorkflowPlannerDialog } from './WorkflowPlannerDialog'
import { WorkflowScenarioBuilderDialog } from './WorkflowScenarioBuilderDialog'
import { ExportPresetNameDialog } from './ExportPresetNameDialog'

export type AppShellLayoutProps = AppShellLayoutChromeProps & {
  workspaceMain: AppWorkspaceMainProps
}

export function AppShellLayout({
  appChromeBusy,
  topbar,
  workspaceMain,
  statusbar,
  overlay,
  exportPreset,
  appSettings,
  externalFilterScript,
  workflowPlanner,
  workflowScenarioBuilder
}: AppShellLayoutProps): JSX.Element {
  return (
    <div className="app-shell" aria-label={uiText('appMainShellAria')} aria-busy={appChromeBusy}>
      <AppWorkspaceTopbar {...topbar} />
      <AppWorkspaceMain {...workspaceMain} />
      <AppStatusbar {...statusbar} />
      <AppOverlayDialogs {...overlay} />
      <ExportPresetNameDialog {...exportPreset} />
      <AppSettingsDialog {...appSettings} />
      <ExternalFilterScriptDialog {...externalFilterScript} />
      <WorkflowPlannerDialog {...workflowPlanner} />
      <WorkflowScenarioBuilderDialog {...workflowScenarioBuilder} />
    </div>
  )
}
