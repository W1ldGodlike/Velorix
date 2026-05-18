import type { JSX } from 'react'

import { KNOWLEDGE_SLUG_FFMPEG_TERMINAL_HINTS } from '../../../shared/knowledge-contract'
import { useTerminalWorkspace } from '../use-terminal-workspace'
import { useAppShellStore } from '../stores/app-shell-store'
import { TerminalWorkspacePanel } from './TerminalWorkspacePanel'

/** Терминал: Zustand `useTerminalStore` + shell preview tab. */
export function TerminalWorkspacePanelConnected(): JSX.Element {
  const workspaceTab = useAppShellStore((s) => s.workspaceTab)
  const currentSourcePath = useAppShellStore((s) => s.preview?.path ?? null)
  const setStatusHint = useAppShellStore((s) => s.setStatusHint)
  const setKnowledgeInitialSlug = useAppShellStore((s) => s.setKnowledgeInitialSlug)
  const setKnowledgeOpen = useAppShellStore((s) => s.setKnowledgeOpen)

  const terminal = useTerminalWorkspace({
    workspaceTab,
    currentSourcePath,
    setStatusHint
  })

  return (
    <TerminalWorkspacePanel
      {...terminal}
      currentSourcePath={currentSourcePath}
      onOpenTerminalKnowledge={() => {
        setKnowledgeInitialSlug(KNOWLEDGE_SLUG_FFMPEG_TERMINAL_HINTS)
        setKnowledgeOpen(true)
      }}
    />
  )
}
