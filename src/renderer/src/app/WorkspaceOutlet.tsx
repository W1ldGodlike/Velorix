import type { JSX } from 'react'

import { DownloadsRail, DownloadsScreen } from '../features/downloads/DownloadsScreen'
import { HistoryRail, HistoryScreen } from '../features/history/HistoryScreen'
import { KnowledgeRail, KnowledgeScreen } from '../features/knowledge/KnowledgeScreen'
import { PlannerRail, PlannerScreen } from '../features/planner/PlannerScreen'
import { ScenariosRail, ScenariosScreen } from '../features/scenarios/ScenariosScreen'
import { InspectorRail, InspectorScreen } from '../features/inspector/InspectorScreen'
import { SettingsRail, SettingsScreen } from '../features/settings/SettingsScreen'
import { TerminalRail, TerminalScreen } from '../features/terminal/TerminalScreen'
import { HelpRail, HelpScreen } from '../features/help/HelpScreen'
import { ToolsRailOutlet, ToolsWorkspace } from '../features/tools/ToolsWorkspace'
import { ProcessingScreen } from '../features/processing/ProcessingScreen'
import { ProcessingRail } from '../features/processing/ProcessingRail'
import { useAppShellStore } from '../stores/app-shell-store'

export function WorkspaceOutlet(): JSX.Element {
  const tab = useAppShellStore((s) => s.workspaceTab)
  switch (tab) {
    case 'processing':
      return <ProcessingScreen />
    case 'downloads':
      return <DownloadsScreen />
    case 'history':
      return <HistoryScreen />
    case 'planner':
      return <PlannerScreen />
    case 'knowledge':
      return <KnowledgeScreen />
    case 'settings':
      return <SettingsScreen />
    case 'scenarios':
      return <ScenariosScreen />
    case 'inspector':
      return <InspectorScreen />
    case 'terminal':
      return <TerminalScreen />
    case 'tools':
      return <ToolsWorkspace />
    case 'help':
      return <HelpScreen />
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
  if (tab === 'downloads') {
    return <DownloadsRail />
  }
  if (tab === 'history') {
    return <HistoryRail />
  }
  if (tab === 'planner') {
    return <PlannerRail />
  }
  if (tab === 'knowledge') {
    return <KnowledgeRail />
  }
  if (tab === 'settings') {
    return <SettingsRail />
  }
  if (tab === 'scenarios') {
    return <ScenariosRail />
  }
  if (tab === 'inspector') {
    return <InspectorRail />
  }
  if (tab === 'terminal') {
    return <TerminalRail />
  }
  if (tab === 'tools') {
    return <ToolsRailOutlet />
  }
  if (tab === 'help') {
    return <HelpRail />
  }
  return null
}
