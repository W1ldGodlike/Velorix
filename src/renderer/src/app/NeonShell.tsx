import { useEffect, type JSX } from 'react'

import { applyPreviewOpenedPayload } from '../lib/apply-preview-opened-payload'
import { mapMenuSettingsSection } from '../lib/map-menu-settings-section'
import { useAppShellStore } from '../stores/app-shell-store'
import { WORKSPACE_TAB_LABELS, WORKSPACE_TABS, type WorkspaceTab } from './workspace-tab'
import { CommandPalette } from './CommandPalette'
import { NeonShellSidebarGpu } from './NeonShellSidebarGpu'
import { NeonShellStatusbar } from './NeonShellStatusbar'
import { SystemModals } from './SystemModals'
import { WorkspaceOutlet, WorkspaceRailOutlet } from './WorkspaceOutlet'

export function NeonShell(): JSX.Element {
  const workspaceTab = useAppShellStore((s) => s.workspaceTab)
  const setWorkspaceTab = useAppShellStore((s) => s.setWorkspaceTab)
  const railOpen = useAppShellStore((s) => s.railOpen)
  const setRailOpen = useAppShellStore((s) => s.setRailOpen)
  const setToolsView = useAppShellStore((s) => s.setToolsView)
  const setSettingsSection = useAppShellStore((s) => s.setSettingsSection)
  const hydrateEnginePathDraft = useAppShellStore((s) => s.hydrateEnginePathDraft)
  const setMediaSource = useAppShellStore((s) => s.setMediaSource)
  const setMediaProbe = useAppShellStore((s) => s.setMediaProbe)

  useEffect(() => {
    const onPlanner = window.velorix?.onOpenWorkflowPlanner
    const onBuilder = window.velorix?.onOpenWorkflowScenarioBuilder
    const onQuit = window.velorix?.onQuitConfirmRequested
    const onProcessError = window.velorix?.onProcessErrorReported
    const onAbout = window.velorix?.onOpenAbout
    const onDownloads = window.velorix?.onOpenDownloadsRoute
    const onInspector = window.velorix?.onOpenInspectorRoute
    const onSettings = window.velorix?.onOpenSettings
    const onEnginePaths = window.velorix?.onOpenEnginePaths
    const onMaint = window.velorix?.onOpenMediaFileUtilities
    const onScript = window.velorix?.onOpenExternalFilterScript
    const onPreviewOpened = window.velorix?.onPreviewOpened
    const setQuitConfirmRequest = useAppShellStore.getState().setQuitConfirmRequest
    const setProcessErrorDialog = useAppShellStore.getState().setProcessErrorDialog
    const openModal = useAppShellStore.getState().openModal
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
    if (onQuit != null) {
      unsubs.push(
        onQuit((payload) => {
          setQuitConfirmRequest(payload)
          openModal('quit-confirm')
        })
      )
    }
    if (onProcessError != null) {
      unsubs.push(
        onProcessError((payload) => {
          setProcessErrorDialog(payload)
          openModal('critical-crash')
        })
      )
    }
    if (onAbout != null) {
      unsubs.push(onAbout(() => openModal('about')))
    }
    if (onDownloads != null) {
      unsubs.push(onDownloads(() => setWorkspaceTab('downloads')))
    }
    if (onInspector != null) {
      unsubs.push(onInspector(() => setWorkspaceTab('inspector')))
    }
    if (onSettings != null) {
      unsubs.push(
        onSettings((section) => {
          setSettingsSection(mapMenuSettingsSection(section))
          setWorkspaceTab('settings')
        })
      )
    }
    if (onEnginePaths != null) {
      unsubs.push(
        onEnginePaths(() => {
          void hydrateEnginePathDraft().then(() => openModal('engine-paths'))
        })
      )
    }
    if (onMaint != null) {
      unsubs.push(
        onMaint(() => {
          setToolsView('maint')
          setWorkspaceTab('tools')
        })
      )
    }
    if (onScript != null) {
      unsubs.push(
        onScript(() => {
          setToolsView('script')
          setWorkspaceTab('tools')
        })
      )
    }
    if (onPreviewOpened != null) {
      unsubs.push(
        onPreviewOpened((payload) => {
          void applyPreviewOpenedPayload(payload, { setMediaSource, setMediaProbe }).then(() => {
            setWorkspaceTab('processing')
          })
        })
      )
    }
    return () => {
      for (const unsub of unsubs) {
        unsub()
      }
    }
  }, [
    hydrateEnginePathDraft,
    setMediaProbe,
    setMediaSource,
    setSettingsSection,
    setToolsView,
    setWorkspaceTab
  ])

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
          <NeonShellSidebarGpu />
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
        <NeonShellStatusbar />
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
