import type { JSX } from 'react'

import type { TerminalCommandHintEntry } from '../../../shared/terminal-contract'
import {
  formatTerminalHintTooltip,
  primaryTerminalHintExample
} from '../../../shared/terminal-hint-json-display'
import {
  formatTerminalHintRowLabel,
  formatTerminalHintRowSummary
} from '../../../shared/terminal-hint-ui-copy'
import { terminalHintInsertAccessibleDescription } from '../app-terminal-hint-ui'
import { getUiLocale, uiText } from '../locales/ui-text'

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

  const locale = getUiLocale()
  const example = primaryTerminalHintExample(hint)
  const displayToken = formatTerminalHintRowLabel(hint, locale)
  const displaySummary = formatTerminalHintRowSummary(hint, locale)

  return (
    <div className="app-terminal-hint-card" role={role === 'option' ? 'presentation' : undefined}>
      <button
        type="button"
        className={className}
        disabled={disabled}
        role={role}
        aria-selected={ariaSelected}
        aria-describedby={describedById}
        aria-label={terminalHintInsertAccessibleDescription(hint)}
        title={formatTerminalHintTooltip(hint, locale)}
        onMouseEnter={onMouseEnter}
        onClick={onActivate}
      >
        <code>{displayToken}</code>
        <span>{hint.tool}</span>
        {displaySummary.length > 0 ? <small>{displaySummary}</small> : null}
        {example !== undefined ? (
          <small className="app-terminal-hint-example">
            <span className="app-terminal-hint-example-label">
              {uiText('terminalHintExampleLabel')}
            </span>
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
