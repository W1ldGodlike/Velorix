import type { JSX } from 'react'

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
  return (
    <details
      className="app-downloads-log-panel"
      open={open}
      onToggle={(event) => {
        onToggle(event.currentTarget.open)
      }}
    >
      <summary>
        Живой лог
        <span>{targetRowId !== null ? `#${targetRowId}` : '—'}</span>
      </summary>
      <div className="app-downloads-log-actions">
        <button
          type="button"
          className="app-btn app-btn-compact app-btn-icon-leading"
          disabled={lines.length === 0}
          onClick={onClear}
        >
          Очистить
        </button>
        <button
          type="button"
          className="app-btn app-btn-compact app-btn-icon-leading"
          disabled={lines.length === 0}
          onClick={onSave}
        >
          Сохранить
        </button>
      </div>
      <pre className="app-downloads-log-pre" aria-live="polite">
        {lines.length === 0
          ? 'Лог появится после запуска строки yt-dlp.'
          : lines.map((line) => `[${line.rowId}] ${line.stream}: ${line.text}`).join('\n')}
      </pre>
    </details>
  )
}

