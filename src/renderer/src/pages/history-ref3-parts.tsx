import type { JSX } from 'react'

import type { HistoryRowMock } from './history-ref3-data'

export function HistoryStatusTag(props: {
  status: HistoryRowMock['status']
  label: string
}): JSX.Element {
  const { status, label } = props
  return (
    <span className={`history-tag history-tag--${status}`}>
      <span
        className={`history-status-glyph history-status-glyph--${status} processing-glyph`}
        aria-hidden
      />
      {label}
    </span>
  )
}

export function HistoryTypeTag(props: {
  label: string
  slug: HistoryRowMock['typeSlug']
}): JSX.Element {
  const { label, slug } = props
  return <span className={`history-tag history-tag--type history-tag--type-${slug}`}>{label}</span>
}

export function HistoryTableRow(props: { row: HistoryRowMock }): JSX.Element {
  const { row } = props
  return (
    <tr className="history-table__row">
      <td className="history-table__cell history-table__cell--event">
        <span
          className={`history-event-glyph history-event-glyph--${row.kind} processing-glyph`}
          aria-hidden
        />
        {row.event}
      </td>
      <td className="history-table__cell history-table__cell--file">
        <span className="history-table__file">{row.file}</span>
        {row.fileMeta ? <span className="history-table__file-meta">{row.fileMeta}</span> : null}
      </td>
      <td className="history-table__cell">
        <HistoryTypeTag label={row.typeLabel} slug={row.typeSlug} />
      </td>
      <td className="history-table__cell">
        <HistoryStatusTag status={row.status} label={row.statusLabel} />
      </td>
      <td className="history-table__cell history-table__cell--mono">{row.datetime}</td>
      <td className="history-table__cell history-table__cell--mono">{row.duration}</td>
      <td className="history-table__cell history-table__cell--mono">{row.size}</td>
      <td className="history-table__cell history-table__cell--actions" aria-hidden>
        <button type="button" className="history-table__action" disabled title="Play">
          <span className="history-action-glyph history-action-glyph--play processing-glyph" />
        </button>
        <button type="button" className="history-table__action" disabled title="Ещё">
          <span className="history-action-glyph history-action-glyph--menu processing-glyph" />
        </button>
      </td>
    </tr>
  )
}
