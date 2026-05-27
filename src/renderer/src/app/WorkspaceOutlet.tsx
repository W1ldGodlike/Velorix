import type { JSX } from 'react'

import { RoutePlaceholderScreen } from '../features/placeholder/RoutePlaceholderScreen'
import { ProcessingRail, ProcessingScreen } from '../features/processing/ProcessingScreen'
import { useAppShellStore } from '../stores/app-shell-store'

export function WorkspaceOutlet(): JSX.Element {
  const tab = useAppShellStore((s) => s.workspaceTab)
  switch (tab) {
    case 'processing':
      return <ProcessingScreen />
    case 'downloads':
      return <RoutePlaceholderScreen tab="downloads" refLabel="ref.2" />
    case 'history':
      return <RoutePlaceholderScreen tab="history" refLabel="ref.3" />
    case 'planner':
      return <RoutePlaceholderScreen tab="planner" refLabel="ref.4" />
    case 'knowledge':
      return <RoutePlaceholderScreen tab="knowledge" refLabel="ref.5" />
    case 'settings':
      return <RoutePlaceholderScreen tab="settings" refLabel="ref.6" />
    case 'scenarios':
      return <RoutePlaceholderScreen tab="scenarios" refLabel="ref.7" />
    case 'inspector':
      return <RoutePlaceholderScreen tab="inspector" refLabel="ref.8" />
    case 'terminal':
      return <RoutePlaceholderScreen tab="terminal" refLabel="ref.9" />
    case 'tools':
      return <RoutePlaceholderScreen tab="tools" refLabel="ref.10" />
    default:
      return <ProcessingScreen />
  }
}

export function WorkspaceRailOutlet(): JSX.Element | null {
  const tab = useAppShellStore((s) => s.workspaceTab)
  const railOpen = useAppShellStore((s) => s.railOpen)
  if (!railOpen) {
    return null
  }
  if (tab === 'processing') {
    return <ProcessingRail />
  }
  return (
    <div className="neon-route-placeholder vn-surface-glass">
      <p className="neon-route-placeholder__hint">Правый rail — по PNG для вкладки «{tab}».</p>
    </div>
  )
}
