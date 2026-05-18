import type { JSX } from 'react'

import type { TerminalHintToolFilter } from '../../../shared/terminal-hints-catalog'
import { uiText, uiTextVars } from '../locales/ui-text'
import { TerminalHintRow } from './TerminalHintRow'
import type { TerminalWorkspacePanelProps } from './terminal-workspace-panel-props'

const TERMINAL_HINT_TOOL_CHIPS: ReadonlyArray<{
  id: TerminalHintToolFilter
  labelKey:
    | 'terminalHintsToolAll'
    | 'terminalHintsToolScenarios'
    | 'terminalHintsToolFfmpeg'
    | 'terminalHintsToolFfprobe'
    | 'terminalHintsToolYtdlp'
}> = [
  { id: 'all', labelKey: 'terminalHintsToolAll' },
  { id: 'scenarios', labelKey: 'terminalHintsToolScenarios' },
  { id: 'ffmpeg', labelKey: 'terminalHintsToolFfmpeg' },
  { id: 'ffprobe', labelKey: 'terminalHintsToolFfprobe' },
  { id: 'yt-dlp', labelKey: 'terminalHintsToolYtdlp' }
]

export function TerminalWorkspacePanelHints(
  props: Pick<
    TerminalWorkspacePanelProps,
    | 'terminalBusy'
    | 'terminalHintsSearchFieldId'
    | 'terminalHintFilter'
    | 'setTerminalHintFilter'
    | 'terminalHintToolFilter'
    | 'setTerminalHintToolFilter'
    | 'terminalHintCatalogTotal'
    | 'terminalHintCatalogCapped'
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
    terminalHintToolFilter,
    setTerminalHintToolFilter,
    terminalHintCatalogTotal,
    terminalHintCatalogCapped,
    visibleTerminalHints,
    setTerminalLine,
    appendTerminalToken
  } = props

  return (
    <aside
      className="app-terminal-hints"
      aria-label={uiText('terminalHintsPanelAria')}
      aria-describedby="terminal-hints-filter-hint terminal-intro-hint terminal-main-split-hint"
      aria-busy={terminalBusy}
    >
      <div
        role="group"
        className="app-downloads-filter-chips"
        aria-label={uiText('terminalHintsToolFilterAria')}
        aria-describedby="terminal-hints-filter-hint"
        aria-busy={terminalBusy}
      >
        {TERMINAL_HINT_TOOL_CHIPS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            className={`app-filter-chip${terminalHintToolFilter === chip.id ? ' app-filter-chip-active' : ''}`}
            disabled={terminalBusy}
            title={uiTextVars('terminalHintsToolChipTitleTemplate', {
              tool: uiText(chip.labelKey)
            })}
            aria-pressed={terminalHintToolFilter === chip.id}
            onClick={() => {
              setTerminalHintToolFilter(chip.id)
            }}
          >
            {uiText(chip.labelKey)}
          </button>
        ))}
      </div>
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
      <p className="app-downloads-hint" role="status">
        {uiTextVars('terminalHintsCatalogCount', {
          shown: String(visibleTerminalHints.length),
          total: String(terminalHintCatalogTotal)
        })}
        {terminalHintCatalogCapped ? ` ${uiText('terminalHintsCatalogCappedSuffix')}` : ''}
      </p>
      <ul
        className="app-terminal-hint-list"
        aria-label={uiText('terminalHintsInsertListAria')}
        aria-describedby="terminal-hints-filter-hint terminal-intro-hint"
        aria-busy={terminalBusy}
      >
        {visibleTerminalHints.length === 0 ? (
          <li className="app-url-hint">{uiText('terminalDropdownEmpty')}</li>
        ) : (
          visibleTerminalHints.map((hint) => (
            <li key={`${hint.tool}:${hint.token}:${hint.fullLine ?? ''}`}>
              <TerminalHintRow
                hint={hint}
                disabled={terminalBusy}
                describedById="terminal-hints-filter-hint terminal-intro-hint"
                onActivate={() => {
                  if (hint.fullLine !== undefined && hint.fullLine.length > 0) {
                    setTerminalLine(hint.fullLine)
                  } else {
                    appendTerminalToken(hint.token)
                  }
                }}
              />
            </li>
          ))
        )}
      </ul>
    </aside>
  )
}
