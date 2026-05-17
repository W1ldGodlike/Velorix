import type { JSX } from 'react'

import { terminalHintInsertAccessibleDescription } from '../app-terminal-hint-ui'
import { uiText } from '../locales/ui-text'
import type { TerminalWorkspacePanelProps } from './terminal-workspace-panel-props'

export function TerminalWorkspacePanelHints(
  props: Pick<
    TerminalWorkspacePanelProps,
    | 'terminalBusy'
    | 'terminalHintsSearchFieldId'
    | 'terminalHintFilter'
    | 'setTerminalHintFilter'
    | 'visibleTerminalHints'
    | 'setTerminalLine'
    | 'appendTerminalToken'
  >
): JSX.Element {
  const {
    terminalBusy,
    terminalHintsSearchFieldId,
    terminalHintFilter,
    setTerminalHintFilter,
    visibleTerminalHints,
    setTerminalLine,
    appendTerminalToken
  } = props

  return (
    <aside
      className="app-terminal-hints"
      aria-label={uiText('terminalHintsPanelAria')}
      aria-describedby="terminal-hints-filter-hint terminal-main-split-hint"
      aria-busy={terminalBusy}
    >
      <div className="app-field">
        <label htmlFor={terminalHintsSearchFieldId}>{uiText('terminalHintsSearchLabel')}</label>
        <p id="terminal-hints-filter-hint" className="app-downloads-hint">
          {uiText('terminalHintsSearchHint')}
        </p>
        <input
          id={terminalHintsSearchFieldId}
          className="app-control"
          value={terminalHintFilter}
          spellCheck={false}
          placeholder={uiText('terminalHintsSearchPlaceholder')}
          aria-describedby="terminal-hints-filter-hint"
          disabled={terminalBusy}
          onChange={(e) => {
            setTerminalHintFilter(e.target.value)
          }}
        />
      </div>
      <ul
        className="app-terminal-hint-list"
        aria-label={uiText('terminalHintsInsertListAria')}
        aria-describedby="terminal-hints-filter-hint"
        aria-busy={terminalBusy}
      >
        {visibleTerminalHints.map((hint) => (
          <li key={`${hint.tool}:${hint.token}:${hint.fullLine ?? ''}`}>
            <button
              type="button"
              className="app-terminal-hint"
              disabled={terminalBusy}
              aria-label={terminalHintInsertAccessibleDescription(hint)}
              onClick={() => {
                if (hint.fullLine !== undefined && hint.fullLine.length > 0) {
                  setTerminalLine(hint.fullLine)
                } else {
                  appendTerminalToken(hint.token)
                }
              }}
              title={hint.summary}
            >
              <code>{hint.token}</code>
              <span>{hint.tool}</span>
              <small>{hint.summary}</small>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
