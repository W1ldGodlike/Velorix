import { Suspense, type JSX } from 'react'

import {
  AppLazyPanelFallback,
  LazyAppSettingsDialog,
  LazyExternalFilterScriptDialog,
  LazyMediaFileUtilitiesDialog,
  LazyWorkflowPlannerDialog,
  LazyWorkflowScenarioBuilderDialog
} from '../../app-lazy-panels'
import { uiText } from '../../locales/ui-text'
import type { AppShellLayoutChromeProps } from '../../use-app-shell-layout-props'
import type { AppWorkspaceMainProps } from './AppWorkspaceMain'
import { AppOverlayDialogs } from './AppOverlayDialogs'
import { AppStatusbar } from './AppStatusbar'
import { AppWorkspaceMain } from './AppWorkspaceMain'
import { AppWorkspaceSidebar } from './AppWorkspaceSidebar'
import { AppWorkspaceTopbar } from './AppWorkspaceTopbar'
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
  workflowScenarioBuilder,
  mediaFileUtilities
}: AppShellLayoutProps): JSX.Element {
  return (
    <div
      className={`app-shell${appChromeBusy ? ' app-shell-busy' : ''}`}
      aria-label={uiText('appMainShellAria')}
      aria-busy={appChromeBusy}
    >
      {topbar.workspaceTab !== 'processing' ? <AppWorkspaceTopbar {...topbar} /> : null}
      <div className="app-shell-row">
        <AppWorkspaceSidebar
          appChromeBusy={topbar.appChromeBusy}
          workspaceTab={topbar.workspaceTab}
          setWorkspaceTab={topbar.setWorkspaceTab}
          engineVersionsLine={statusbar.engineVersionsLine}
        />
        <div className="app-shell-stage">
          <AppWorkspaceMain {...workspaceMain} />
          <AppStatusbar {...statusbar} />
        </div>
      </div>
      <AppOverlayDialogs {...overlay} workspaceTab={topbar.workspaceTab} />
      {topbar.workspaceTab !== 'tools' ? <ExportPresetNameDialog {...exportPreset} /> : null}
      {appSettings.open && topbar.workspaceTab !== 'settings' ? (
        <Suspense fallback={<AppLazyPanelFallback />}>
          <LazyAppSettingsDialog
            {...appSettings}
            editorFfmpegBenchmark={workspaceMain.editorFfmpeg}
          />
        </Suspense>
      ) : null}
      {externalFilterScript.open &&
      topbar.workspaceTab !== 'tools' &&
      topbar.workspaceTab !== 'settings' ? (
        <Suspense fallback={<AppLazyPanelFallback />}>
          <LazyExternalFilterScriptDialog {...externalFilterScript} />
        </Suspense>
      ) : null}
      {mediaFileUtilities.open && topbar.workspaceTab !== 'tools' ? (
        <Suspense fallback={<AppLazyPanelFallback />}>
          <LazyMediaFileUtilitiesDialog {...mediaFileUtilities} />
        </Suspense>
      ) : null}
      {workflowPlanner.open && topbar.workspaceTab !== 'planner' ? (
        <Suspense fallback={<AppLazyPanelFallback />}>
          <LazyWorkflowPlannerDialog {...workflowPlanner} />
        </Suspense>
      ) : null}
      {workflowScenarioBuilder.open && topbar.workspaceTab !== 'scenarios' ? (
        <Suspense fallback={<AppLazyPanelFallback />}>
          <LazyWorkflowScenarioBuilderDialog {...workflowScenarioBuilder} />
        </Suspense>
      ) : null}
    </div>
  )
}
