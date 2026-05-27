import { Suspense, type JSX } from 'react'

import {
  AppLazyPanelFallback,
  LazyAppSettingsDialog,
  LazyDownloadsWorkspaceConnected,
  LazyEditorFfmpegSettingsRail,
  LazyKnowledgeDialog,
  LazyToolsWorkspacePanel,
  LazyWorkflowPlannerDialog,
  LazyWorkflowScenarioBuilderDialog,
  LazyTerminalWorkspacePanelConnected
} from '../../app-lazy-panels'
import { EditorBatchExportBar } from '../editor/EditorBatchExportBar'
import type { EditorBatchExportBarProps } from '../editor/EditorBatchExportBar'
import type { EditorFfmpegSettingsRailProps } from '../editor/EditorFfmpegSettingsRail'
import {
  getWorkspaceRouteMeta,
  type WorkspaceTab,
  workspacePanelId,
  workspaceTabDescId,
  workspaceTabId
} from '../../app-terminal-hint-ui'
import { EditorPreviewSection } from '../editor/EditorPreviewSection'
import type { EditorPreviewSectionProps } from '../editor/EditorPreviewSection'
import { EditorQuickYtdlpBar } from '../editor/EditorQuickYtdlpBar'
import type { EditorQuickYtdlpBarProps } from '../editor/EditorQuickYtdlpBar'
import { InspectorWorkspaceConnected } from '../InspectorWorkspaceConnected'
import { ProcessingHistoryPanelConnected } from '../ProcessingHistoryPanelConnected'
import type { AppSettingsDialogProps } from './AppSettingsDialog'
import type { ExportPresetNameDialogProps } from './ExportPresetNameDialog'
import type { WorkflowPlannerDialogProps } from './WorkflowPlannerDialog'
import type { WorkflowScenarioBuilderDialogProps } from './WorkflowScenarioBuilderDialog'
import { uiText } from '../../locales/ui-text'
import { useAppShellStore } from '../../stores/app-shell-store'
import type { MainWindowUiPanelKey } from '../../stores/panels-store'

export type AppWorkspaceMainProps = {
  workspaceTab: WorkspaceTab
  panelOpen: (key: MainWindowUiPanelKey) => boolean
  persistMainWindowUiPanelToggle: (key: MainWindowUiPanelKey, open: boolean) => void
  editorMainAriaBusy: boolean
  editorQuick: Omit<EditorQuickYtdlpBarProps, 'open' | 'onOpenChange'>
  editorBatch: Omit<EditorBatchExportBarProps, 'open' | 'onOpenChange'>
  editorPreview: Omit<
    EditorPreviewSectionProps,
    'ffmpegSettingsRailOpen' | 'onShowFfmpegSettingsRail'
  >
  appSettingsRoute: AppSettingsDialogProps
  exportPresetRoute: ExportPresetNameDialogProps
  workflowPlannerRoute: WorkflowPlannerDialogProps
  workflowScenarioBuilderRoute: WorkflowScenarioBuilderDialogProps
  editorFfmpeg: Omit<
    EditorFfmpegSettingsRailProps,
    'panelOpen' | 'persistMainWindowUiPanelToggle' | 'onCollapseRail'
  >
}

export function AppWorkspaceMain({
  workspaceTab,
  panelOpen,
  persistMainWindowUiPanelToggle,
  editorMainAriaBusy,
  editorQuick,
  editorBatch,
  editorPreview,
  appSettingsRoute,
  exportPresetRoute,
  workflowPlannerRoute,
  workflowScenarioBuilderRoute,
  editorFfmpeg
}: AppWorkspaceMainProps): JSX.Element {
  const setWorkspaceTab = useAppShellStore((s) => s.setWorkspaceTab)
  const setKnowledgeOpen = useAppShellStore((s) => s.setKnowledgeOpen)
  const setKnowledgeInitialSlug = useAppShellStore((s) => s.setKnowledgeInitialSlug)
  const uiLocaleRenderTick = useAppShellStore((s) => s.uiLocaleRenderTick)
  const setStatusHint = useAppShellStore((s) => s.setStatusHint)
  const knowledgeInitialSlug = useAppShellStore((s) => s.knowledgeInitialSlug)
  const setWorkflowPlannerOpen = useAppShellStore((s) => s.setWorkflowPlannerOpen)
  const setWorkflowScenarioBuilderOpen = useAppShellStore((s) => s.setWorkflowScenarioBuilderOpen)

  const renderBridgeWorkspace = (): JSX.Element => {
    const routeMeta = getWorkspaceRouteMeta(workspaceTab)
    const openCurrentImplementation =
      workspaceTab === 'planner'
        ? (): void => {
            setWorkflowPlannerOpen(true)
          }
        : workspaceTab === 'scenarios'
          ? (): void => {
              setWorkflowScenarioBuilderOpen(true)
            }
          : null

    return (
      <main
        id={workspacePanelId(workspaceTab)}
        role="tabpanel"
        aria-labelledby={workspaceTabId(workspaceTab)}
        aria-describedby={workspaceTabDescId(workspaceTab)}
        className="app-main app-workspace-route-stage"
      >
        <section className="app-workspace-route-bridge-card">
          <p className="app-workspace-route-bridge-kicker">{uiText('workspaceRouteBridgeBadge')}</p>
          <h2 className="app-workspace-route-bridge-title">{uiText(routeMeta.labelKey)}</h2>
          <p className="app-workspace-route-bridge-copy">{uiText(routeMeta.tooltipKey)}</p>
          <p className="app-workspace-route-bridge-copy">{uiText('workspaceRouteBridgeBody')}</p>
          {openCurrentImplementation ? (
            <button
              type="button"
              className="app-btn"
              onClick={() => {
                openCurrentImplementation()
              }}
            >
              {uiText('workspaceRouteBridgeOpenAction')}
            </button>
          ) : (
            <p className="app-workspace-route-bridge-note">
              {uiText('workspaceRouteBridgePending')}
            </p>
          )}
        </section>
      </main>
    )
  }

  return (
    <>
      {workspaceTab === 'processing' ? (
        <EditorQuickYtdlpBar
          open={panelOpen('quickYtdlp')}
          onOpenChange={(open) => {
            persistMainWindowUiPanelToggle('quickYtdlp', open)
          }}
          {...editorQuick}
        />
      ) : null}

      {workspaceTab === 'processing' ? (
        <EditorBatchExportBar
          open={panelOpen('batchExport')}
          onOpenChange={(open) => {
            persistMainWindowUiPanelToggle('batchExport', open)
          }}
          {...editorBatch}
        />
      ) : null}

      {workspaceTab === 'processing' ? (
        <main
          id={workspacePanelId('processing')}
          role="tabpanel"
          aria-labelledby={workspaceTabId('processing')}
          aria-describedby={workspaceTabDescId('processing')}
          aria-busy={editorMainAriaBusy}
          className={`app-main app-main-surface app-workbench${panelOpen('ffmpegSettingsRailOpen') ? '' : ' app-workbench-ffmpeg-collapsed'}`}
        >
          <EditorPreviewSection
            {...editorPreview}
            ffmpegSettingsRailOpen={panelOpen('ffmpegSettingsRailOpen')}
            onShowFfmpegSettingsRail={() => {
              persistMainWindowUiPanelToggle('ffmpegSettingsRailOpen', true)
            }}
          />
          {panelOpen('ffmpegSettingsRailOpen') ? (
            <Suspense fallback={<AppLazyPanelFallback />}>
              <LazyEditorFfmpegSettingsRail
                panelOpen={panelOpen}
                persistMainWindowUiPanelToggle={persistMainWindowUiPanelToggle}
                onCollapseRail={() => {
                  persistMainWindowUiPanelToggle('ffmpegSettingsRailOpen', false)
                }}
                {...editorFfmpeg}
              />
            </Suspense>
          ) : null}
        </main>
      ) : workspaceTab === 'settings' ? (
        <main
          id={workspacePanelId('settings')}
          role="tabpanel"
          aria-labelledby={workspaceTabId('settings')}
          aria-describedby={workspaceTabDescId('settings')}
          className="app-main app-main-surface"
        >
          <Suspense fallback={<AppLazyPanelFallback />}>
            <LazyAppSettingsDialog
              {...appSettingsRoute}
              editorFfmpegBenchmark={editorFfmpeg}
              open
              presentation="embedded"
              onExitEmbedded={() => {
                appSettingsRoute.onClose()
                setWorkspaceTab('processing')
              }}
            />
          </Suspense>
        </main>
      ) : workspaceTab === 'knowledge' ? (
        <main
          id={workspacePanelId('knowledge')}
          role="tabpanel"
          aria-labelledby={workspaceTabId('knowledge')}
          aria-describedby={workspaceTabDescId('knowledge')}
          className="app-main app-main-surface"
        >
          <Suspense fallback={<AppLazyPanelFallback />}>
            <LazyKnowledgeDialog
              open
              presentation="embedded"
              initialSlug={knowledgeInitialSlug}
              localeVersion={uiLocaleRenderTick}
              onStatus={setStatusHint}
              onClose={() => {
                setKnowledgeOpen(false)
                setKnowledgeInitialSlug(null)
                setWorkspaceTab('processing')
              }}
            />
          </Suspense>
        </main>
      ) : workspaceTab === 'tools' ? (
        <main
          id={workspacePanelId('tools')}
          role="tabpanel"
          aria-labelledby={workspaceTabId('tools')}
          aria-describedby={workspaceTabDescId('tools')}
          className="app-main"
        >
          <Suspense fallback={<AppLazyPanelFallback />}>
            <LazyToolsWorkspacePanel
              appSettingsRoute={appSettingsRoute}
              exportPresetRoute={exportPresetRoute}
              editorFfmpeg={editorFfmpeg}
            />
          </Suspense>
        </main>
      ) : workspaceTab === 'planner' ? (
        <main
          id={workspacePanelId('planner')}
          role="tabpanel"
          aria-labelledby={workspaceTabId('planner')}
          aria-describedby={workspaceTabDescId('planner')}
          className="app-main app-main-surface"
        >
          <Suspense fallback={<AppLazyPanelFallback />}>
            <LazyWorkflowPlannerDialog
              {...workflowPlannerRoute}
              open
              presentation="embedded"
              onClose={() => {
                workflowPlannerRoute.onClose()
                setWorkspaceTab('processing')
              }}
            />
          </Suspense>
        </main>
      ) : workspaceTab === 'scenarios' ? (
        <main
          id={workspacePanelId('scenarios')}
          role="tabpanel"
          aria-labelledby={workspaceTabId('scenarios')}
          aria-describedby={workspaceTabDescId('scenarios')}
          className="app-main app-main-surface"
        >
          <Suspense fallback={<AppLazyPanelFallback />}>
            <LazyWorkflowScenarioBuilderDialog
              {...workflowScenarioBuilderRoute}
              open
              presentation="embedded"
              onClose={() => {
                workflowScenarioBuilderRoute.onClose()
                setWorkspaceTab('processing')
              }}
            />
          </Suspense>
        </main>
      ) : workspaceTab === 'history' ? (
        <main
          id={workspacePanelId('history')}
          role="tabpanel"
          aria-labelledby={workspaceTabId('history')}
          aria-describedby={workspaceTabDescId('history')}
          className="app-main app-main-surface"
        >
          <ProcessingHistoryPanelConnected
            open
            onOpenKnowledgeArticle={(slug) => {
              setKnowledgeInitialSlug(slug)
              setKnowledgeOpen(false)
              setWorkspaceTab('knowledge')
            }}
            onToggle={() => {
              void 0
            }}
          />
        </main>
      ) : workspaceTab === 'inspector' ? (
        <main
          id={workspacePanelId('inspector')}
          role="tabpanel"
          aria-labelledby={workspaceTabId('inspector')}
          aria-describedby={workspaceTabDescId('inspector')}
          className="app-main app-main-surface"
        >
          <InspectorWorkspaceConnected
            onOpenKnowledgeArticle={(slug) => {
              setKnowledgeInitialSlug(slug)
              setKnowledgeOpen(false)
              setWorkspaceTab('knowledge')
            }}
          />
        </main>
      ) : workspaceTab === 'terminal' ? (
        <Suspense fallback={<AppLazyPanelFallback />}>
          <LazyTerminalWorkspacePanelConnected />
        </Suspense>
      ) : workspaceTab === 'downloads' ? (
        <Suspense fallback={<AppLazyPanelFallback />}>
          <LazyDownloadsWorkspaceConnected />
        </Suspense>
      ) : (
        renderBridgeWorkspace()
      )}
    </>
  )
}
