import { Suspense, type JSX } from 'react'

import {
  AppLazyPanelFallback,
  LazyDownloadsWorkspaceConnected,
  LazyEditorFfmpegSettingsRail,
  LazyTerminalWorkspacePanelConnected
} from '../../app-lazy-panels'
import { EditorBatchExportBar } from '../editor/EditorBatchExportBar'
import type { EditorBatchExportBarProps } from '../editor/EditorBatchExportBar'
import type { EditorFfmpegSettingsRailProps } from '../editor/EditorFfmpegSettingsRail'
import { EditorPreviewSection } from '../editor/EditorPreviewSection'
import type { EditorPreviewSectionProps } from '../editor/EditorPreviewSection'
import { EditorQuickYtdlpBar } from '../editor/EditorQuickYtdlpBar'
import type { EditorQuickYtdlpBarProps } from '../editor/EditorQuickYtdlpBar'
import type { WorkspaceTab } from '../../app-terminal-hint-ui'
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
  editorFfmpeg
}: AppWorkspaceMainProps): JSX.Element {
  return (
    <>
      {workspaceTab === 'editor' ? (
        <EditorQuickYtdlpBar
          open={panelOpen('quickYtdlp')}
          onOpenChange={(open) => {
            persistMainWindowUiPanelToggle('quickYtdlp', open)
          }}
          {...editorQuick}
        />
      ) : null}

      {workspaceTab === 'editor' ? (
        <EditorBatchExportBar
          open={panelOpen('batchExport')}
          onOpenChange={(open) => {
            persistMainWindowUiPanelToggle('batchExport', open)
          }}
          {...editorBatch}
        />
      ) : null}

      {workspaceTab === 'editor' ? (
        <main
          id="workspace-panel-editor"
          role="tabpanel"
          aria-labelledby="workspace-tab-editor"
          aria-describedby="workspace-tab-editor-desc"
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
      ) : workspaceTab === 'terminal' ? (
        <Suspense fallback={<AppLazyPanelFallback />}>
          <LazyTerminalWorkspacePanelConnected />
        </Suspense>
      ) : (
        <Suspense fallback={<AppLazyPanelFallback />}>
          <LazyDownloadsWorkspaceConnected />
        </Suspense>
      )}
    </>
  )
}
