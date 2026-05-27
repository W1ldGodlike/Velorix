import { useEffect, type JSX } from 'react'

import { useAppShellStore } from '../stores/app-shell-store'
import { WORKSPACE_TAB_LABELS, WORKSPACE_TABS, type WorkspaceTab } from './workspace-tab'
import { CommandPalette } from './CommandPalette'
import { SystemModals } from './SystemModals'
import { WorkspaceOutlet, WorkspaceRailOutlet } from './WorkspaceOutlet'

export function NeonShell(): JSX.Element {
  const workspaceTab = useAppShellStore((s) => s.workspaceTab)
  const setWorkspaceTab = useAppShellStore((s) => s.setWorkspaceTab)
  const railOpen = useAppShellStore((s) => s.railOpen)
  const setRailOpen = useAppShellStore((s) => s.setRailOpen)
  const openModal = useAppShellStore((s) => s.openModal)
  const setToolsView = useAppShellStore((s) => s.setToolsView)

  useEffect(() => {
    const onPlanner = window.velorix?.onOpenWorkflowPlanner
    const onBuilder = window.velorix?.onOpenWorkflowScenarioBuilder
    const unsubs: Array<() => void> = []
    if (onPlanner != null) {
      unsubs.push(onPlanner(() => setWorkspaceTab('planner')))
    }
    if (onBuilder != null) {
      unsubs.push(
        onBuilder(() => {
          setToolsView('scenario')
          setWorkspaceTab('tools')
        })
      )
    }
    return () => {
      for (const unsub of unsubs) {
        unsub()
      }
    }
  }, [setToolsView, setWorkspaceTab])

  const shellClass = railOpen ? 'neon-shell' : 'neon-shell neon-shell--no-rail'

  return (
    <div className="neon-app">
      <div className={shellClass}>
        <aside className="neon-shell__sidebar vn-surface-glass">
          <div className="neon-shell__brand">VELORIX</div>
          <nav className="neon-shell__nav" aria-label="Навигация">
            {WORKSPACE_TABS.map((tab) => (
              <NavButton
                key={tab}
                tab={tab}
                active={workspaceTab === tab}
                onSelect={() => setWorkspaceTab(tab)}
              />
            ))}
          </nav>
          <div className="neon-shell__sidebar-panel vn-surface-glass">
            <p className="neon-shell__panel-title">GPU</p>
            <p className="neon-shell__panel-line">NVIDIA RTX 4090 · 48%</p>
            <p className="neon-shell__panel-sub">18.7 / 24.0 GB · 56°C</p>
            <div className="neon-shell__sparkline" aria-hidden>
              <span style={{ height: '45%' }} />
              <span style={{ height: '70%' }} />
              <span style={{ height: '55%' }} />
              <span style={{ height: '90%' }} />
            </div>
            <div className="neon-shell__rings" aria-hidden>
              <span className="neon-shell__ring" data-label="CPU 68%" />
              <span className="neon-shell__ring" data-label="RAM 75%" />
              <span className="neon-shell__ring" data-label="Disk 42%" />
            </div>
            <p className="neon-shell__panel-sub">↓ 12.6 MB/s · ↑ 2.4 MB/s</p>
          </div>
        </aside>
        <main className="neon-shell__center" key={workspaceTab}>
          <WorkspaceOutlet />
        </main>
        <div className="neon-shell__rail">
          <button
            type="button"
            className="app-btn neon-shell__rail-toggle"
            onClick={() => setRailOpen(!railOpen)}
            aria-expanded={railOpen}
          >
            {railOpen ? '◀ Rail' : '▶ Rail'}
          </button>
          <WorkspaceRailOutlet />
        </div>
        <footer className="neon-shell__status">
          <span>НОВЫЙ СЕЗОН.vlrix</span>
          <span>01:36:53:08</span>
          <span>3840×2160 · 4K</span>
          <span className="app-ui-showcase-status-pill app-ui-showcase-status-pill--ready">
            Готово
          </span>
          <button
            type="button"
            className="app-btn app-btn-secondary neon-shell__about-btn"
            onClick={() => openModal('about')}
          >
            О программе
          </button>
        </footer>
      </div>
      <SystemModals />
      <CommandPalette />
    </div>
  )
}

function NavButton(props: {
  tab: WorkspaceTab
  active: boolean
  onSelect: () => void
}): JSX.Element {
  const { tab, active, onSelect } = props
  return (
    <button
      type="button"
      className={`neon-shell__nav-btn${active ? ' is-active' : ''}`}
      onClick={onSelect}
    >
      <span className="neon-shell__nav-glyph" aria-hidden />
      {WORKSPACE_TAB_LABELS[tab]}
    </button>
  )
}
