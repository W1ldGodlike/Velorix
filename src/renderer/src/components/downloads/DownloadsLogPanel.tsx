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
  downloadsTabBusy,
  onToggle,
  onClear,
  onSave
}: {
  open: boolean
  targetRowId: number | null
  lines: DownloadsLogLineView[]
  downloadsTabBusy?: boolean
  onToggle: (nextOpen: boolean) => void
  onClear: () => void
  onSave: () => void
}): JSX.Element {
  const downloadsLogRegionId = useId()
  const tabBusy = downloadsTabBusy ?? false
  return (
    <details
      className="app-downloads-log-panel"
      open={open}
      aria-label={uiText('downloadsLogDetailsAria')}
      aria-describedby="downloads-page-hint"
      aria-busy={tabBusy}
      onToggle={(event) => {
        onToggle(event.currentTarget.open)
      }}
    >
      <summary aria-controls={downloadsLogRegionId} aria-describedby="downloads-page-hint">
        {uiText('downloadsLogTitle')}
        <span>{targetRowId !== null ? `#${targetRowId}` : uiText('uiPlaceholderDash')}</span>
      </summary>
      <div id={downloadsLogRegionId}>
        <div
          className="app-downloads-log-actions"
          role="toolbar"
          aria-orientation="horizontal"
          aria-label={uiText('downloadsLogActionsToolbarAria')}
          aria-describedby="downloads-page-hint"
          aria-busy={tabBusy}
        >
          <button
            type="button"
            className="app-btn app-btn-compact app-btn-icon-leading"
            aria-describedby="downloads-page-hint"
            disabled={lines.length === 0}
            onClick={onClear}
          >
            {uiText('downloadsHistoryClear')}
          </button>
          <button
            type="button"
            className="app-btn app-btn-compact app-btn-icon-leading"
            aria-describedby="downloads-page-hint"
            disabled={lines.length === 0}
            onClick={onSave}
          >
            {uiText('downloadsLogSave')}
          </button>
        </div>
        <pre
          className="app-downloads-log-pre"
          role="log"
          aria-label={uiText('downloadsLogViewportAria')}
          aria-describedby="downloads-page-hint"
          aria-live="polite"
          aria-busy={tabBusy}
        >
          {lines.length === 0
            ? uiText('downloadsLogEmpty')
            : lines.map((line) => `[${line.rowId}] ${line.stream}: ${line.text}`).join('\n')}
        </pre>
      </div>
    </details>
  )
}
