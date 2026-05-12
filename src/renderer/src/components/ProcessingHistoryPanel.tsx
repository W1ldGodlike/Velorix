import type { JSX } from 'react'

import type {
  ProcessingHistoryEntry,
  ProcessingHistoryFilter,
  ProcessingHistoryKind,
  ProcessingHistoryOutcome,
  ProcessingHistoryWeeklySummary
} from '../../../shared/processing-history-contract'

const kindOptions: Array<{ value: '' | ProcessingHistoryKind; label: string }> = [
  { value: '', label: 'Все типы' },
  { value: 'ffmpegExport', label: 'Экспорт' },
  { value: 'ffmpegSnapshot', label: 'Кадры' },
  { value: 'autoExport', label: 'Авто-экспорт' }
]

const outcomeOptions: Array<{ value: '' | ProcessingHistoryOutcome; label: string }> = [
  { value: '', label: 'Все исходы' },
  { value: 'success', label: 'Готово' },
  { value: 'error', label: 'Ошибка' },
  { value: 'cancelled', label: 'Отмена' }
]

function mergeFilter(
  current: ProcessingHistoryFilter,
  patch: {
    kind?: ProcessingHistoryKind | ''
    outcome?: ProcessingHistoryOutcome | ''
    query?: string
  }
): ProcessingHistoryFilter {
  return {
    ...(patch.kind !== undefined
      ? patch.kind
        ? { kind: patch.kind }
        : {}
      : current.kind
        ? { kind: current.kind }
        : {}),
    ...(patch.outcome !== undefined
      ? patch.outcome
        ? { outcome: patch.outcome }
        : {}
      : current.outcome
        ? { outcome: current.outcome }
        : {}),
    ...(patch.query !== undefined
      ? patch.query.trim()
        ? { query: patch.query.trim() }
        : {}
      : current.query
        ? { query: current.query }
        : {})
  }
}

export function ProcessingHistoryPanel({
  open,
  busy,
  entries,
  filter,
  weeklySummary,
  onToggle,
  onFilterChange,
  onRefresh,
  onClear,
  onExportVisible,
  onOpenOutput,
  formatTimeLabel,
  formatDurationLabel,
  kindLabel,
  outcomeLabel
}: {
  open: boolean
  busy: boolean
  entries: ProcessingHistoryEntry[]
  filter: ProcessingHistoryFilter
  weeklySummary: ProcessingHistoryWeeklySummary | null
  onToggle: (nextOpen: boolean) => void
  onFilterChange: (next: ProcessingHistoryFilter) => void
  onRefresh: () => void
  onClear: () => void
  onExportVisible: () => void
  onOpenOutput: (id: string, mode: 'file' | 'folder' | 'preview') => void
  formatTimeLabel: (ms: number) => string
  formatDurationLabel: (ms: number) => string
  kindLabel: (kind: ProcessingHistoryEntry['kind']) => string
  outcomeLabel: (outcome: ProcessingHistoryEntry['outcome']) => string
}): JSX.Element {
  return (
    <details
      className="app-settings-section app-processing-history-panel"
      open={open}
      onToggle={(event) => {
        onToggle(event.currentTarget.open)
      }}
    >
      <summary className="app-settings-summary">
        История обработок <span className="app-processing-history-count">{entries.length}</span>
      </summary>
      <p id="processingHistorySectionHint" className="app-settings-section-hint">
        Последние ffmpeg export, снимки кадров и авто-экспорт после загрузки.
      </p>
      {weeklySummary ? (
        <div className="app-processing-history-summary" aria-label="Недельная сводка обработок">
          <span>7 дней: {weeklySummary.total}</span>
          <span>OK {weeklySummary.success}</span>
          <span>Ошибки {weeklySummary.error}</span>
          <span>Отмена {weeklySummary.cancelled}</span>
          <span>Время {formatDurationLabel(weeklySummary.totalDurationMs)}</span>
        </div>
      ) : null}
      <div className="app-processing-history-controls" aria-describedby="processingHistorySectionHint">
        <select
          className="app-control"
          aria-label="Тип обработки"
          value={filter.kind ?? ''}
          disabled={busy}
          onChange={(event) => {
            const value = event.currentTarget.value as '' | ProcessingHistoryKind
            onFilterChange(mergeFilter(filter, { kind: value }))
          }}
        >
          {kindOptions.map((option) => (
            <option key={option.value || 'all'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          className="app-control"
          aria-label="Исход обработки"
          value={filter.outcome ?? ''}
          disabled={busy}
          onChange={(event) => {
            const value = event.currentTarget.value as '' | ProcessingHistoryOutcome
            onFilterChange(mergeFilter(filter, { outcome: value }))
          }}
        >
          {outcomeOptions.map((option) => (
            <option key={option.value || 'all'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          className="app-control"
          value={filter.query ?? ''}
          disabled={busy}
          placeholder="Файл, статус, ошибка"
          aria-label="Поиск по истории обработок"
          onChange={(event) => {
            onFilterChange(mergeFilter(filter, { query: event.currentTarget.value }))
          }}
        />
      </div>
      <div className="app-processing-history-actions">
        <button type="button" className="app-btn app-btn-compact" disabled={busy} onClick={onRefresh}>
          Обновить
        </button>
        <button
          type="button"
          className="app-btn app-btn-compact app-btn-warn"
          disabled={busy || entries.length === 0}
          onClick={onClear}
        >
          Очистить
        </button>
        <button
          type="button"
          className="app-btn app-btn-compact"
          disabled={busy || entries.length === 0}
          onClick={onExportVisible}
        >
          Экспорт JSON
        </button>
      </div>
      <div className="app-processing-history-list">
        {entries.length === 0 ? (
          <p className="app-downloads-history-empty">
            История пока пуста. Завершите экспорт или сохраните кадр, и запись появится здесь.
          </p>
        ) : (
          entries.slice(0, 10).map((entry) => (
            <article key={entry.id} className="app-downloads-history-card">
              <div className="app-downloads-history-head">
                <strong title={entry.outputPath ?? entry.inputPath}>{entry.outputPath ?? entry.inputPath}</strong>
                <span
                  className={`app-downloads-history-outcome app-downloads-history-${entry.outcome}`}
                >
                  {outcomeLabel(entry.outcome)}
                </span>
              </div>
              <p title={entry.inputPath}>{entry.inputPath}</p>
              <div className="app-downloads-history-meta">
                <span>{formatTimeLabel(entry.finishedAt)}</span>
                <span>{kindLabel(entry.kind)}</span>
              </div>
              <div className="app-downloads-history-meta">
                <span>{entry.status}</span>
              </div>
              {entry.errorHint ? <p className="app-downloads-warning">{entry.errorHint}</p> : null}
              {entry.outputPath ? (
                <div className="app-downloads-history-actions">
                  <button
                    type="button"
                    className="app-btn app-btn-compact"
                    onClick={() => onOpenOutput(entry.id, 'file')}
                  >
                    Файл
                  </button>
                  <button
                    type="button"
                    className="app-btn app-btn-compact"
                    onClick={() => onOpenOutput(entry.id, 'folder')}
                  >
                    Папка
                  </button>
                  <button
                    type="button"
                    className="app-btn app-btn-compact"
                    onClick={() => onOpenOutput(entry.id, 'preview')}
                  >
                    В превью
                  </button>
                </div>
              ) : null}
            </article>
          ))
        )}
      </div>
    </details>
  )
}
