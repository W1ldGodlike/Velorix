import type { JSX } from 'react'

import {
  formatTerminalCopyLineAria,
  formatTerminalExitLine,
  uiText,
  uiTextVars
} from '../locales/ui-text'
import type { TerminalWorkspacePanelProps } from './terminal-workspace-panel-props'

export function TerminalWorkspacePanelHistory(
  props: Pick<
    TerminalWorkspacePanelProps,
    'terminalBusy' | 'terminalHistory' | 'copyTerminalOutputLine'
  >
): JSX.Element {
  const { terminalBusy, terminalHistory, copyTerminalOutputLine } = props

  return (
    <section
      className="app-terminal-history"
      aria-label={uiText('terminalHistoryAria')}
      aria-describedby="terminal-history-hint"
      aria-busy={terminalBusy}
    >
      <p id="terminal-history-hint" className="app-visually-hidden">
        {uiText('terminalHistoryHint')}
      </p>
      {terminalHistory.length === 0 ? (
        <p className="app-downloads-empty" role="status" aria-live="polite">
          {uiText('terminalHistoryEmpty')}
        </p>
      ) : (
        terminalHistory.map((entry, entryIdx) => {
          const lines = (() => {
            if (!entry.result.ok) {
              return [] as string[]
            }
            const blob = [entry.result.stdout, entry.result.stderr].filter(Boolean).join('\n')
            return blob.length > 0 ? blob.split(/\r?\n/) : ['']
          })()
          const entryBrief = entry.line.length > 96 ? `${entry.line.slice(0, 96)}…` : entry.line
          return (
            <article
              key={entry.id}
              className="app-terminal-entry"
              aria-label={uiTextVars('terminalEntryArticleAriaTemplate', {
                index: entryIdx + 1,
                line: entryBrief
              })}
            >
              <div
                className="app-terminal-entry-head"
                role="group"
                aria-label={uiText('terminalEntryHeadGroupAria')}
              >
                <code>{entry.line}</code>
                <span>
                  {entry.result.ok
                    ? formatTerminalExitLine(entry.result.code, entry.result.elapsedMs)
                    : uiText('terminalBlocked')}
                </span>
              </div>
              {entry.result.ok ? (
                <div
                  className="app-terminal-output"
                  role="log"
                  aria-label={uiTextVars('terminalEntryOutputLogAriaTemplate', {
                    index: entryIdx + 1
                  })}
                >
                  {lines.map((line, lineIdx) => (
                    <div key={`${entry.id}:${lineIdx}`} className="app-terminal-output-line">
                      <span className="app-terminal-output-line-text">
                        {line.length > 0 ? line : '\u00a0'}
                      </span>
                      <button
                        type="button"
                        className="app-terminal-output-line-copy"
                        title={uiText('terminalCopyLineTitle')}
                        aria-label={formatTerminalCopyLineAria(lineIdx + 1)}
                        onClick={() => {
                          void copyTerminalOutputLine(line)
                        }}
                      >
                        {uiText('terminalCopyLineButton')}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="app-downloads-warning">{entry.result.error}</p>
              )}
            </article>
          )
        })
      )}
    </section>
  )
}
