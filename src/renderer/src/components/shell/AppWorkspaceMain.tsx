import { Suspense, type JSX } from 'react'

import {
  AppLazyPanelFallback,
  LazyAppSettingsDialog,
  LazyDownloadsWorkspaceConnected,
  LazyEditorFfmpegSettingsRail,
  LazyKnowledgeDialog,
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
import type { AppSettingsDialogProps } from './AppSettingsDialog'
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
  const setMediaFileUtilitiesOpen = useAppShellStore((s) => s.setMediaFileUtilitiesOpen)
  const previewPath = useAppShellStore((s) => s.preview?.path ?? null)

  const renderBridgeWorkspace = (): JSX.Element => {
    const routeMeta = getWorkspaceRouteMeta(workspaceTab)
    const openCurrentImplementation =
      workspaceTab === 'history'
        ? (): void => {
            persistMainWindowUiPanelToggle('ffmpegSettingsRailOpen', true)
            setWorkspaceTab('processing')
          }
        : workspaceTab === 'inspector'
          ? (): void => {
              void window.velorix.inspector.openWindow(previewPath)
            }
          : workspaceTab === 'planner'
            ? (): void => {
                setWorkflowPlannerOpen(true)
              }
            : workspaceTab === 'scenarios'
              ? (): void => {
                  setWorkflowScenarioBuilderOpen(true)
                }
              : workspaceTab === 'tools'
                ? (): void => {
                    setMediaFileUtilitiesOpen(true)
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
          className={`app-main app-workbench${panelOpen('ffmpegSettingsRailOpen') ? '' : ' app-workbench-ffmpeg-collapsed'}`}
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
          className="app-main"
        >
          <Suspense fallback={<AppLazyPanelFallback />}>
            <LazyAppSettingsDialog
              {...appSettingsRoute}
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
          className="app-main"
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
