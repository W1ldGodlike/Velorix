import type { JSX } from 'react'

import type { TerminalCommandHintEntry } from '../../../shared/terminal-contract'
import {
  formatTerminalHintTooltip,
  primaryTerminalHintExample
} from '../../../shared/terminal-hint-json-display'
import { terminalHintInsertAccessibleDescription } from '../app-terminal-hint-ui'
import { uiText } from '../locales/ui-text'

export function TerminalHintRow(props: {
  hint: TerminalCommandHintEntry
  disabled: boolean
  className?: string
  role?: 'option'
  ariaSelected?: boolean
  describedById?: string
  onActivate: () => void
  onMouseEnter?: () => void
}): JSX.Element {
  const {
    hint,
    disabled,
    className = 'app-terminal-hint',
    role,
    ariaSelected,
    describedById,
    onActivate,
    onMouseEnter
  } = props

  const example = primaryTerminalHintExample(hint)
  const displayToken =
    hint.fullLine !== undefined && hint.fullLine.length > 0 ? hint.fullLine.trimEnd() : hint.token

  return (
    <div
      className="app-terminal-hint-card"
      role={role === 'option' ? 'presentation' : undefined}
    >
      <button
        type="button"
        className={className}
        disabled={disabled}
        role={role}
        aria-selected={ariaSelected}
        aria-describedby={describedById}
        aria-label={terminalHintInsertAccessibleDescription(hint)}
        title={formatTerminalHintTooltip(hint)}
        onMouseEnter={onMouseEnter}
        onClick={onActivate}
      >
        <code>{displayToken}</code>
        <span>{hint.tool}</span>
        <small>{hint.summary}</small>
        {example !== undefined ? (
          <small className="app-terminal-hint-example">
            <span className="app-terminal-hint-example-label">{uiText('terminalHintExampleLabel')}</span>
            <code>{example}</code>
          </small>
        ) : null}
      </button>
      {hint.docUrl !== undefined && hint.docUrl.length > 0 ? (
        <a
          href={hint.docUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="app-terminal-hint-doc"
          title={hint.docUrl}
          aria-label={uiText('terminalHintDocLinkAria')}
        >
          {uiText('terminalHintDocLink')}
        </a>
      ) : null}
    </div>
  )
}
