import type { JSX, RefObject } from 'react'

import { DownloadsSettingsRail } from '../downloads/DownloadsSettingsRail'
import type { DownloadsSettingsRailProps } from '../downloads/DownloadsSettingsRail'
import { DownloadsWorkspaceMain } from '../downloads/DownloadsWorkspaceMain'
import type { DownloadsWorkspaceMainProps } from '../downloads/DownloadsWorkspaceMain'
import { EditorBatchExportBar } from '../editor/EditorBatchExportBar'
import type { EditorBatchExportBarProps } from '../editor/EditorBatchExportBar'
import { EditorFfmpegSettingsRail } from '../editor/EditorFfmpegSettingsRail'
import type { EditorFfmpegSettingsRailProps } from '../editor/EditorFfmpegSettingsRail'
import { EditorPreviewSection } from '../editor/EditorPreviewSection'
import type { EditorPreviewSectionProps } from '../editor/EditorPreviewSection'
import { EditorQuickYtdlpBar } from '../editor/EditorQuickYtdlpBar'
import type { EditorQuickYtdlpBarProps } from '../editor/EditorQuickYtdlpBar'
import { TerminalWorkspacePanel } from '../TerminalWorkspacePanel'
import type { TerminalWorkspacePanelProps } from '../TerminalWorkspacePanel'
import type { WorkspaceTab } from '../../app-terminal-hint-ui'
import type { MainWindowUiPanelKey } from '../../use-main-window-ui-panels'

export type AppWorkspaceMainProps = {
  workspaceTab: WorkspaceTab
  panelOpen: (key: MainWindowUiPanelKey) => boolean
  persistMainWindowUiPanelToggle: (key: MainWindowUiPanelKey, open: boolean) => void
  editorMainAriaBusy: boolean
  editorQuick: Omit<EditorQuickYtdlpBarProps, 'open' | 'onOpenChange'>
  editorBatch: Omit<EditorBatchExportBarProps, 'open' | 'onOpenChange'>
  editorPreview: Omit<EditorPreviewSectionProps, 'ffmpegSettingsRailOpen' | 'onShowFfmpegSettingsRail'>
  editorFfmpeg: Omit<
    EditorFfmpegSettingsRailProps,
    'panelOpen' | 'persistMainWindowUiPanelToggle' | 'onCollapseRail'
  >
  terminal: TerminalWorkspacePanelProps
  downloadsMain: Omit<DownloadsWorkspaceMainProps, 'onScrollToSettings'>
  downloadsSettings: DownloadsSettingsRailProps
  downloadsSettingsRailRef: RefObject<HTMLElement | null>
  downloadsWorkspaceAriaBusy: boolean
}

export function AppWorkspaceMain({
  workspaceTab,
  panelOpen,
  persistMainWindowUiPanelToggle,
  editorMainAriaBusy,
  editorQuick,
  editorBatch,
  editorPreview,
  editorFfmpeg,
  terminal,
  downloadsMain,
  downloadsSettings,
  downloadsSettingsRailRef,
  downloadsWorkspaceAriaBusy
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
            <EditorFfmpegSettingsRail
              panelOpen={panelOpen}
              persistMainWindowUiPanelToggle={persistMainWindowUiPanelToggle}
              onCollapseRail={() => {
                persistMainWindowUiPanelToggle('ffmpegSettingsRailOpen', false)
              }}
              {...editorFfmpeg}
            />
          ) : null}
        </main>
      ) : workspaceTab === 'terminal' ? (
        <TerminalWorkspacePanel {...terminal} />
      ) : (
        <main
          id="workspace-panel-downloads"
          role="tabpanel"
          aria-labelledby="workspace-tab-downloads"
          aria-describedby="downloads-page-hint"
          aria-busy={downloadsWorkspaceAriaBusy}
          className="app-main app-downloads-workspace"
        >
          <DownloadsWorkspaceMain
            {...downloadsMain}
            onScrollToSettings={() => {
              downloadsSettingsRailRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              })
            }}
          />
          <DownloadsSettingsRail ref={downloadsSettingsRailRef} {...downloadsSettings} />
        </main>
      )}
    </>
  )
}
