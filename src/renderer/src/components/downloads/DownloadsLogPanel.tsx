import { useId, type JSX } from 'react'

import { uiText } from '../../locales/ui-text'

export type DownloadsLogLineView = {
  id: number
  rowId: number
  stream: 'stdout' | 'stderr'
  text: string
}

export function DownloadsLogPanel({
  open,
  targetRowId,
  lines,
  onToggle,
  onClear,
  onSave
}: {
  open: boolean
  targetRowId: number | null
  lines: DownloadsLogLineView[]
  onToggle: (nextOpen: boolean) => void
  onClear: () => void
  onSave: () => void
}): JSX.Element {
  const downloadsLogViewportId = useId()
  return (
    <details
      className="app-downloads-log-panel"
      open={open}
      aria-label={uiText('downloadsLogDetailsAria')}
      onToggle={(event) => {
        onToggle(event.currentTarget.open)
      }}
    >
      <summary aria-controls={downloadsLogViewportId}>
        {uiText('downloadsLogTitle')}
        <span>{targetRowId !== null ? `#${targetRowId}` : uiText('uiPlaceholderDash')}</span>
      </summary>
      <div
        className="app-downloads-log-actions"
        role="toolbar"
        aria-orientation="horizontal"
        aria-label={uiText('downloadsLogActionsToolbarAria')}
      >
        <button
          type="button"
          className="app-btn app-btn-compact app-btn-icon-leading"
          disabled={lines.length === 0}
          onClick={onClear}
        >
          {uiText('downloadsHistoryClear')}
        </button>
        <button
          type="button"
          className="app-btn app-btn-compact app-btn-icon-leading"
          disabled={lines.length === 0}
          onClick={onSave}
        >
          {uiText('downloadsLogSave')}
        </button>
      </div>
      <pre
        id={downloadsLogViewportId}
        className="app-downloads-log-pre"
        role="log"
        aria-label={uiText('downloadsLogViewportAria')}
        aria-live="polite"
      >
        {lines.length === 0
          ? uiText('downloadsLogEmpty')
          : lines.map((line) => `[${line.rowId}] ${line.stream}: ${line.text}`).join('\n')}
      </pre>
    </details>
  )
}
