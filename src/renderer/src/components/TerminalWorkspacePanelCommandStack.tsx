import type { JSX } from 'react'

import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from '../../../shared/terminal-contract'
import { stepTerminalSuggestIndex } from '../../../shared/terminal-inline-suggest'
import { terminalHintInsertAccessibleDescription } from '../app-terminal-hint-ui'
import { formatTerminalPreviewTooltip, uiText } from '../locales/ui-text'
import type { TerminalWorkspacePanelProps } from './terminal-workspace-panel-props'

export function TerminalWorkspacePanelCommandStack(
  props: Pick<
    TerminalWorkspacePanelProps,
    | 'terminalBusy'
    | 'terminalLine'
    | 'setTerminalLine'
    | 'terminalCommandInputId'
    | 'terminalInlineSuggestions'
    | 'terminalSuggestFocus'
    | 'setTerminalSuggestFocus'
    | 'terminalSuggestActiveIndex'
    | 'setTerminalSuggestIndex'
    | 'terminalSuggestBlurTimeoutRef'
    | 'currentSourcePath'
    | 'runTerminalLine'
    | 'recallTerminalCommand'
    | 'applyTerminalSuggest'
    | 'appendTerminalToken'
  >
): JSX.Element {
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
    recallTerminalCommand,
    applyTerminalSuggest,
    appendTerminalToken
  } = props

  return (
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
            if (e.key === 'Enter' && list.length > 0 && terminalSuggestFocus && !e.shiftKey) {
              e.preventDefault()
              const h = list[terminalSuggestActiveIndex]
              if (h) {
                applyTerminalSuggest(h)
              }
              return
            }
            const recallKeys =
              (e.key === 'ArrowUp' || e.key === 'ArrowDown') &&
              !(list.length > 0 && terminalSuggestFocus)
            if (recallKeys) {
              e.preventDefault()
              recallTerminalCommand(e.key === 'ArrowUp' ? 'up' : 'down')
              return
            }
            if (list.length > 0) {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setTerminalSuggestIndex((i) => stepTerminalSuggestIndex(i, list.length, 'down'))
                return
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault()
                setTerminalSuggestIndex((i) => stepTerminalSuggestIndex(i, list.length, 'up'))
                return
              }
              if (e.key === 'Home') {
                e.preventDefault()
                setTerminalSuggestIndex((i) => stepTerminalSuggestIndex(i, list.length, 'home'))
                return
              }
              if (e.key === 'End') {
                e.preventDefault()
                setTerminalSuggestIndex((i) => stepTerminalSuggestIndex(i, list.length, 'end'))
                return
              }
              if (e.key === 'PageDown') {
                e.preventDefault()
                setTerminalSuggestIndex((i) => stepTerminalSuggestIndex(i, list.length, 'pageDown'))
                return
              }
              if (e.key === 'PageUp') {
                e.preventDefault()
                setTerminalSuggestIndex((i) => stepTerminalSuggestIndex(i, list.length, 'pageUp'))
                return
              }
              if (e.key === 'Tab') {
                e.preventDefault()
                if (e.shiftKey) {
                  setTerminalSuggestIndex((i) => stepTerminalSuggestIndex(i, list.length, 'up'))
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
                idx === terminalSuggestActiveIndex ? ' app-terminal-suggest-item-active' : ''
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
  )
}
