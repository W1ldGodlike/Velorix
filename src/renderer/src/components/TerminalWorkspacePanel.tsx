import type { Dispatch, JSX, MutableRefObject, SetStateAction } from 'react'

import {
  TERMINAL_CURRENT_FILE_PLACEHOLDER,
  type TerminalCommandHintEntry
} from '../../../shared/terminal-contract'
import {
  DEFAULT_TERMINAL_INLINE_SUGGEST_MAX,
  DEFAULT_TERMINAL_INLINE_SUGGEST_PAGE_STEP,
  stepTerminalSuggestIndex
} from '../../../shared/terminal-inline-suggest'
import { terminalHintInsertAccessibleDescription } from '../app-terminal-hint-ui'
import {
  formatTerminalCopyLineAria,
  formatTerminalExitLine,
  formatTerminalIntroTail,
  formatTerminalPreviewTooltip,
  uiText,
  uiTextVars
} from '../locales/ui-text'
import type { TerminalHistoryEntry } from '../use-terminal-workspace'

export type TerminalWorkspacePanelProps = {
  terminalBusy: boolean
  terminalLine: string
  setTerminalLine: Dispatch<SetStateAction<string>>
  terminalCommandInputId: string
  terminalInlineSuggestions: TerminalCommandHintEntry[]
  terminalSuggestFocus: boolean
  setTerminalSuggestFocus: Dispatch<SetStateAction<boolean>>
  terminalSuggestActiveIndex: number
  setTerminalSuggestIndex: Dispatch<SetStateAction<number>>
  terminalSuggestBlurTimeoutRef: MutableRefObject<number | undefined>
  currentSourcePath: string | null
  runTerminalLine: () => Promise<void>
  applyTerminalSuggest: (hint: TerminalCommandHintEntry) => void
  appendTerminalToken: (token: string) => void
  terminalHistory: TerminalHistoryEntry[]
  copyTerminalOutputLine: (line: string) => Promise<void>
  terminalHintsSearchFieldId: string
  terminalHintFilter: string
  setTerminalHintFilter: Dispatch<SetStateAction<string>>
  visibleTerminalHints: TerminalCommandHintEntry[]
  onOpenTerminalKnowledge: () => void
}

export function TerminalWorkspacePanel(props: TerminalWorkspacePanelProps): JSX.Element {
  const {
    terminalBusy,
    terminalLine,
    setTerminalLine,
    terminalCommandInputId,
    terminalInlineSuggestions,
    terminalSuggestFocus,
    setTerminalSuggestFocus,
    terminalSuggestActiveIndex,
    setTerminalSuggestIndex,
    terminalSuggestBlurTimeoutRef,
    currentSourcePath,
    runTerminalLine,
    applyTerminalSuggest,
    appendTerminalToken,
    terminalHistory,
    copyTerminalOutputLine,
    terminalHintsSearchFieldId,
    terminalHintFilter,
    setTerminalHintFilter,
    visibleTerminalHints,
    onOpenTerminalKnowledge
  } = props

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
                <p className="app-downloads-hint">
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
            <div
              className="app-terminal-command-stack"
              role="region"
              aria-label={uiText('terminalCommandStackAria')}
              aria-busy={terminalBusy}
            >
              <div
                className="app-terminal-command-row"
                role="toolbar"
                aria-orientation="horizontal"
                aria-label={uiText('terminalCommandToolbarAria')}
                aria-busy={terminalBusy}
              >
                <label htmlFor={terminalCommandInputId} className="app-visually-hidden">
                  {uiText('terminalCommandInputAriaLabel')}
                </label>
                <input
                  id={terminalCommandInputId}
                  className="app-control app-terminal-input"
                  value={terminalLine}
                  spellCheck={false}
                  autoComplete="off"
                  placeholder={uiText('terminalCommandPlaceholder')}
                  aria-expanded={terminalInlineSuggestions.length > 0 && terminalSuggestFocus}
                  aria-controls="terminal-inline-suggest-list"
                  aria-autocomplete="list"
                  disabled={terminalBusy}
                  onChange={(e) => {
                    setTerminalLine(e.target.value)
                  }}
                  onFocus={() => {
                    window.clearTimeout(terminalSuggestBlurTimeoutRef.current)
                    setTerminalSuggestFocus(true)
                  }}
                  onBlur={() => {
                    terminalSuggestBlurTimeoutRef.current = window.setTimeout(() => {
                      setTerminalSuggestFocus(false)
                    }, 160)
                  }}
                  onKeyDown={(e) => {
                    const list = terminalInlineSuggestions
                    if (
                      e.key === 'Enter' &&
                      list.length > 0 &&
                      terminalSuggestFocus &&
                      !e.shiftKey
                    ) {
                      e.preventDefault()
                      const h = list[terminalSuggestActiveIndex]
                      if (h) {
                        applyTerminalSuggest(h)
                      }
                      return
                    }
                    if (list.length > 0) {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault()
                        setTerminalSuggestIndex((i) =>
                          stepTerminalSuggestIndex(i, list.length, 'down')
                        )
                        return
                      }
                      if (e.key === 'ArrowUp') {
                        e.preventDefault()
                        setTerminalSuggestIndex((i) =>
                          stepTerminalSuggestIndex(i, list.length, 'up')
                        )
                        return
                      }
                      if (e.key === 'Home') {
                        e.preventDefault()
                        setTerminalSuggestIndex((i) =>
                          stepTerminalSuggestIndex(i, list.length, 'home')
                        )
                        return
                      }
                      if (e.key === 'End') {
                        e.preventDefault()
                        setTerminalSuggestIndex((i) =>
                          stepTerminalSuggestIndex(i, list.length, 'end')
                        )
                        return
                      }
                      if (e.key === 'PageDown') {
                        e.preventDefault()
                        setTerminalSuggestIndex((i) =>
                          stepTerminalSuggestIndex(i, list.length, 'pageDown')
                        )
                        return
                      }
                      if (e.key === 'PageUp') {
                        e.preventDefault()
                        setTerminalSuggestIndex((i) =>
                          stepTerminalSuggestIndex(i, list.length, 'pageUp')
                        )
                        return
                      }
                      if (e.key === 'Tab') {
                        e.preventDefault()
                        if (e.shiftKey) {
                          setTerminalSuggestIndex((i) =>
                            stepTerminalSuggestIndex(i, list.length, 'up')
                          )
                        } else {
                          const h = list[terminalSuggestActiveIndex]
                          if (h) {
                            applyTerminalSuggest(h)
                          }
                        }
                        return
                      }
                      if (e.key === 'Escape') {
                        e.preventDefault()
                        window.clearTimeout(terminalSuggestBlurTimeoutRef.current)
                        setTerminalSuggestFocus(false)
                        return
                      }
                    }
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      void runTerminalLine()
                    }
                  }}
                />
                <button
                  type="button"
                  className="app-btn"
                  disabled={terminalBusy || !currentSourcePath}
                  title={
                    currentSourcePath
                      ? formatTerminalPreviewTooltip(TERMINAL_CURRENT_FILE_PLACEHOLDER)
                      : uiText('terminalPreviewFileTooltipNeedFile')
                  }
                  onClick={() => appendTerminalToken(TERMINAL_CURRENT_FILE_PLACEHOLDER)}
                >
                  {uiText('terminalPreviewFileButton')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-primary"
                  disabled={terminalBusy || terminalLine.trim().length === 0}
                  onClick={() => {
                    void runTerminalLine()
                  }}
                >
                  {terminalBusy ? uiText('terminalRunningButton') : uiText('terminalRunButton')}
                </button>
              </div>
              {terminalInlineSuggestions.length > 0 && terminalSuggestFocus ? (
                <div
                  id="terminal-inline-suggest-list"
                  className="app-terminal-suggest"
                  role="listbox"
                  aria-label={uiText('terminalInlineSuggestAria')}
                  aria-busy={terminalBusy}
                  onMouseDown={(ev) => {
                    ev.preventDefault()
                  }}
                >
                  {terminalInlineSuggestions.map((hint, idx) => (
                    <button
                      key={`inline:${hint.tool}:${hint.token}:${hint.fullLine ?? ''}:${idx}`}
                      type="button"
                      role="option"
                      aria-selected={idx === terminalSuggestActiveIndex}
                      aria-label={terminalHintInsertAccessibleDescription(hint)}
                      className={`app-terminal-suggest-item${
                        idx === terminalSuggestActiveIndex
                          ? ' app-terminal-suggest-item-active'
                          : ''
                      }`}
                      onMouseEnter={() => {
                        setTerminalSuggestIndex(idx)
                      }}
                      onClick={() => {
                        applyTerminalSuggest(hint)
                      }}
                    >
                      <code>
                        {hint.fullLine !== undefined && hint.fullLine.length > 0
                          ? hint.fullLine.trimEnd()
                          : hint.token}
                      </code>
                      <span>{hint.tool}</span>
                      <small>{hint.summary}</small>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div
              className="app-terminal-layout"
              role="region"
              aria-label={uiText('terminalMainSplitAria')}
              aria-busy={terminalBusy}
            >
              <section
                className="app-terminal-history"
                aria-label={uiText('terminalHistoryAria')}
                aria-busy={terminalBusy}
              >
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
                      const blob = [entry.result.stdout, entry.result.stderr]
                        .filter(Boolean)
                        .join('\n')
                      return blob.length > 0 ? blob.split(/\r?\n/) : ['']
                    })()
                    const entryBrief =
                      entry.line.length > 96 ? `${entry.line.slice(0, 96)}…` : entry.line
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
                              <div
                                key={`${entry.id}:${lineIdx}`}
                                className="app-terminal-output-line"
                              >
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
              <aside
                className="app-terminal-hints"
                aria-label={uiText('terminalHintsPanelAria')}
                aria-busy={terminalBusy}
              >
                <div className="app-field">
                  <label htmlFor={terminalHintsSearchFieldId}>
                    {uiText('terminalHintsSearchLabel')}
                  </label>
                  <input
                    id={terminalHintsSearchFieldId}
                    className="app-control"
                    value={terminalHintFilter}
                    spellCheck={false}
                    placeholder={uiText('terminalHintsSearchPlaceholder')}
                    disabled={terminalBusy}
                    onChange={(e) => {
                      setTerminalHintFilter(e.target.value)
                    }}
                  />
                </div>
                <ul
                  className="app-terminal-hint-list"
                  aria-label={uiText('terminalHintsInsertListAria')}
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
            </div>
          </section>
        </main>
  )
}
