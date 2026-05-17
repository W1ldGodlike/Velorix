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
        aria-describedby="terminal-intro-hint"
        aria-busy={terminalBusy}
      >
        <TerminalWorkspacePanelIntroBand {...props} />
        <TerminalWorkspacePanelCommandStack {...props} />
        <div
          className="app-terminal-layout"
          role="region"
          aria-label={uiText('terminalMainSplitAria')}
          aria-describedby="terminal-main-split-hint"
          aria-busy={terminalBusy}
        >
          <p id="terminal-main-split-hint" className="app-visually-hidden">
            {uiText('terminalMainSplitHint')}
          </p>
          <TerminalWorkspacePanelHistory {...props} />
          <TerminalWorkspacePanelHints {...props} />
        </div>
      </section>
    </main>
  )
}
