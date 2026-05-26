import type { Dispatch, JSX, SetStateAction } from 'react'

import type { WorkspaceTab } from '../../app-terminal-hint-ui'
import { IconDownload, IconWorkspaceEditor, IconWorkspaceTerminal } from '../LucideMiniIcons'
import { uiText } from '../../locales/ui-text'

export type AppWorkspaceSidebarProps = {
  appChromeBusy: boolean
  workspaceTab: WorkspaceTab
  setWorkspaceTab: Dispatch<SetStateAction<WorkspaceTab>>
  engineVersionsLine: string
}

export function AppWorkspaceSidebar(props: AppWorkspaceSidebarProps): JSX.Element {
  const { appChromeBusy, workspaceTab, setWorkspaceTab, engineVersionsLine } = props

  const workspaceTabDescId =
    workspaceTab === 'editor'
      ? 'workspace-tab-editor-desc'
      : workspaceTab === 'downloads'
        ? 'workspace-tab-downloads-desc'
        : 'workspace-tab-terminal-desc'

  return (
    <aside
      className="app-neon-sidebar"
      aria-label={uiText('workspaceTabsAria')}
      aria-describedby={workspaceTabDescId}
      aria-busy={appChromeBusy}
    >
      <div className="app-neon-sidebar-brand" aria-hidden>
        <span className="app-neon-sidebar-brand-mark">◇</span>
        <span className="app-neon-sidebar-brand-title">{uiText('topbarProductName')}</span>
      </div>
      <nav className="app-neon-sidebar-nav" role="tablist" aria-orientation="vertical">
        <button
          type="button"
          id="workspace-tab-editor"
          className={`app-neon-sidebar-nav-item${workspaceTab === 'editor' ? ' app-neon-sidebar-nav-item-active' : ''}`}
          role="tab"
          aria-selected={workspaceTab === 'editor'}
          aria-controls="workspace-panel-editor"
          aria-describedby="workspace-tab-editor-desc"
          title={uiText('workspaceTabEditorTooltip')}
          onClick={() => {
            setWorkspaceTab('editor')
          }}
        >
          <span className="app-neon-sidebar-nav-indicator" aria-hidden />
          <span className="app-neon-sidebar-nav-glyph" aria-hidden>
            <IconWorkspaceEditor title="" size={18} />
          </span>
          <span className="app-neon-sidebar-nav-label">{uiText('workspaceTabEditor')}</span>
          <span id="workspace-tab-editor-desc" className="app-visually-hidden">
            {uiText('editorWorkbenchAria')}
          </span>
        </button>
        <button
          type="button"
          id="workspace-tab-downloads"
          className={`app-neon-sidebar-nav-item${workspaceTab === 'downloads' ? ' app-neon-sidebar-nav-item-active' : ''}`}
          role="tab"
          aria-selected={workspaceTab === 'downloads'}
          aria-controls="workspace-panel-downloads"
          aria-describedby="workspace-tab-downloads-desc"
          title={uiText('workspaceTabDownloadsTooltip')}
          onClick={() => {
            setWorkspaceTab('downloads')
          }}
        >
          <span className="app-neon-sidebar-nav-indicator" aria-hidden />
          <span className="app-neon-sidebar-nav-glyph" aria-hidden>
            <IconDownload title="" size={18} />
          </span>
          <span className="app-neon-sidebar-nav-label">{uiText('workspaceTabDownloads')}</span>
          <span id="workspace-tab-downloads-desc" className="app-visually-hidden">
            {uiText('downloadsWorkbenchAria')}
          </span>
        </button>
        <button
          type="button"
          id="workspace-tab-terminal"
          className={`app-neon-sidebar-nav-item${workspaceTab === 'terminal' ? ' app-neon-sidebar-nav-item-active' : ''}`}
          role="tab"
          aria-selected={workspaceTab === 'terminal'}
          aria-controls="workspace-panel-terminal"
          aria-describedby="workspace-tab-terminal-desc"
          title={uiText('workspaceTabTerminalTooltip')}
          onClick={() => {
            setWorkspaceTab('terminal')
          }}
        >
          <span className="app-neon-sidebar-nav-indicator" aria-hidden />
          <span className="app-neon-sidebar-nav-glyph" aria-hidden>
            <IconWorkspaceTerminal title="" size={18} />
          </span>
          <span className="app-neon-sidebar-nav-label">{uiText('workspaceTabTerminal')}</span>
          <span id="workspace-tab-terminal-desc" className="app-visually-hidden">
            {uiText('terminalWorkbenchAria')}
          </span>
        </button>
      </nav>
      <footer className="app-neon-sidebar-footer" aria-label={uiText('topbarTrailingGroupAria')}>
        <span className="app-neon-sidebar-status-dot" aria-hidden />
        <span className="app-neon-sidebar-engine-line">{engineVersionsLine}</span>
      </footer>
    </aside>
  )
}
