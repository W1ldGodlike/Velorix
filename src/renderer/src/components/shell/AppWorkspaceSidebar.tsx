import type { Dispatch, JSX, SetStateAction } from 'react'

import {
  getWorkspaceRouteMeta,
  WORKSPACE_ROUTE_ORDER,
  type WorkspaceTab,
  workspacePanelId,
  workspaceTabDescId,
  workspaceTabId
} from '../../app-terminal-hint-ui'
import {
  IconBook,
  IconCircleHelp,
  IconDownload,
  IconFilm,
  IconFolderOpen,
  IconQueueChevronDown,
  IconQueueFile,
  IconQueueOutbound,
  IconSettings,
  IconWorkspaceEditor,
  IconWorkspaceTerminal
} from '../LucideMiniIcons'
import { uiText } from '../../locales/ui-text'

export type AppWorkspaceSidebarProps = {
  appChromeBusy: boolean
  workspaceTab: WorkspaceTab
  setWorkspaceTab: Dispatch<SetStateAction<WorkspaceTab>>
  engineVersionsLine: string
}

export function AppWorkspaceSidebar(props: AppWorkspaceSidebarProps): JSX.Element {
  const { appChromeBusy, workspaceTab, setWorkspaceTab, engineVersionsLine } = props

  return (
    <aside
      className="app-neon-sidebar"
      aria-label={uiText('workspaceTabsAria')}
      aria-describedby={workspaceTabDescId(workspaceTab)}
      aria-busy={appChromeBusy}
    >
      <div className="app-neon-sidebar-brand" aria-hidden>
        <span className="app-neon-sidebar-brand-mark">◇</span>
        <span className="app-neon-sidebar-brand-title">{uiText('topbarProductName')}</span>
      </div>
      <nav className="app-neon-sidebar-nav" role="tablist" aria-orientation="vertical">
        {WORKSPACE_ROUTE_ORDER.map((route) => {
          const routeMeta = getWorkspaceRouteMeta(route)
          return (
            <button
              key={route}
              type="button"
              id={workspaceTabId(route)}
              className={`app-neon-sidebar-nav-item${workspaceTab === route ? ' app-neon-sidebar-nav-item-active' : ''}`}
              role="tab"
              aria-selected={workspaceTab === route}
              aria-controls={workspacePanelId(route)}
              aria-describedby={workspaceTabDescId(route)}
              title={uiText(routeMeta.tooltipKey)}
              onClick={() => {
                setWorkspaceTab(route)
              }}
            >
              <span className="app-neon-sidebar-nav-indicator" aria-hidden />
              <span className="app-neon-sidebar-nav-glyph" aria-hidden>
                {route === 'processing' ? (
                  <IconWorkspaceEditor title="" size={18} />
                ) : route === 'downloads' ? (
                  <IconDownload title="" size={18} />
                ) : route === 'terminal' ? (
                  <IconWorkspaceTerminal title="" size={18} />
                ) : route === 'history' ? (
                  <IconQueueFile title="" size={18} />
                ) : route === 'inspector' ? (
                  <IconFilm title="" size={18} />
                ) : route === 'planner' ? (
                  <IconQueueChevronDown title="" size={18} />
                ) : route === 'scenarios' ? (
                  <IconQueueOutbound title="" size={18} />
                ) : route === 'tools' ? (
                  <IconFolderOpen title="" size={18} />
                ) : route === 'settings' ? (
                  <IconSettings title="" size={18} />
                ) : route === 'knowledge' ? (
                  <IconBook title="" size={18} />
                ) : (
                  <IconCircleHelp title="" size={18} />
                )}
              </span>
              <span className="app-neon-sidebar-nav-label">{uiText(routeMeta.labelKey)}</span>
              <span id={workspaceTabDescId(route)} className="app-visually-hidden">
                {uiText(routeMeta.ariaKey)}
              </span>
            </button>
          )
        })}
      </nav>
      <footer className="app-neon-sidebar-footer" aria-label={uiText('topbarTrailingGroupAria')}>
        <span className="app-neon-sidebar-status-dot" aria-hidden />
        <span className="app-neon-sidebar-engine-line">{engineVersionsLine}</span>
      </footer>
    </aside>
  )
}
