import type { JSX } from 'react'

import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from '../../../shared/terminal-contract'
import {
  DEFAULT_TERMINAL_INLINE_SUGGEST_MAX,
  DEFAULT_TERMINAL_INLINE_SUGGEST_PAGE_STEP
} from '../../../shared/terminal-inline-suggest'
import { formatTerminalIntroTail, uiText } from '../locales/ui-text'
import type { TerminalWorkspacePanelProps } from './terminal-workspace-panel-props'

export function TerminalWorkspacePanelIntroBand(
  props: Pick<TerminalWorkspacePanelProps, 'terminalBusy' | 'onOpenTerminalKnowledge'>
): JSX.Element {
  const { terminalBusy, onOpenTerminalKnowledge } = props

  return (
    <div
      className="app-downloads-band"
      role="region"
      aria-label={uiText('terminalIntroBandAria')}
      aria-busy={terminalBusy}
    >
      <div
        className="app-downloads-band-copy"
        role="group"
        aria-label={uiText('downloadsBandHeadingCopyGroupAria')}
        aria-busy={terminalBusy}
      >
        <h2 className="app-downloads-title">{uiText('terminalTitle')}</h2>
        <p id="terminal-intro-hint" className="app-downloads-hint">
          {uiText('terminalIntroLead')}
          <code>{TERMINAL_CURRENT_FILE_PLACEHOLDER}</code>
          {formatTerminalIntroTail({
            pageStep: DEFAULT_TERMINAL_INLINE_SUGGEST_PAGE_STEP,
            maxInline: DEFAULT_TERMINAL_INLINE_SUGGEST_MAX
          })}
        </p>
        <nav
          className="app-terminal-intro-knowledge"
          aria-label={uiText('terminalIntroKnowledgeNavAria')}
          aria-busy={terminalBusy}
        >
          <button
            type="button"
            className="app-knowledge-link"
            title={uiText('terminalKnowledgeDeepLinkTooltip')}
            onClick={() => {
              onOpenTerminalKnowledge()
            }}
          >
            {uiText('knowledgeArticleTerminalHintsLink')}
          </button>
        </nav>
      </div>
    </div>
  )
}
