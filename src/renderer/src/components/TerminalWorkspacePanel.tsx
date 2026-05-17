import type { JSX } from 'react'

import { uiText } from '../locales/ui-text'
import { TerminalWorkspacePanelCommandStack } from './TerminalWorkspacePanelCommandStack'
import { TerminalWorkspacePanelHints } from './TerminalWorkspacePanelHints'
import { TerminalWorkspacePanelHistory } from './TerminalWorkspacePanelHistory'
import { TerminalWorkspacePanelIntroBand } from './TerminalWorkspacePanelIntroBand'
export type { TerminalWorkspacePanelProps } from './terminal-workspace-panel-props'
import type { TerminalWorkspacePanelProps } from './terminal-workspace-panel-props'

export function TerminalWorkspacePanel(props: TerminalWorkspacePanelProps): JSX.Element {
  const { terminalBusy } = props

  return (
    <main
      id="workspace-panel-terminal"
      role="tabpanel"
      aria-labelledby="workspace-tab-terminal"
      aria-busy={terminalBusy}
      className="app-main app-terminal-workspace"
    >
      <section
        className="app-terminal-panel"
        aria-label={uiText('terminalPanelSectionAria')}
        aria-busy={terminalBusy}
      >
        <TerminalWorkspacePanelIntroBand {...props} />
        <TerminalWorkspacePanelCommandStack {...props} />
        <div
          className="app-terminal-layout"
          role="region"
          aria-label={uiText('terminalMainSplitAria')}
          aria-busy={terminalBusy}
        >
          <TerminalWorkspacePanelHistory {...props} />
          <TerminalWorkspacePanelHints {...props} />
        </div>
      </section>
    </main>
  )
}
