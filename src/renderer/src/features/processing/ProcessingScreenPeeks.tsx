import { useEffect, useState, type JSX } from 'react'

import type { FfmpegExportProgressPayload } from '../../../../shared/ffmpeg-export-contract'
import type { ProcessingHistoryEntry } from '../../../../shared/processing-history-contract'

import { parseDownloadsProgressPercent } from '../../lib/parse-downloads-queue-row'
import { useDownloadsQueue } from '../downloads/use-downloads-queue'

export function ProcessingDownloadsPeek(props: { onOpenFull: () => void }): JSX.Element {
  const rows = useDownloadsQueue().slice(0, 5)
  return (
    <section className="processing-screen__peek vn-surface-glass">
      <h2 className="processing-screen__peek-title">Очередь загрузок</h2>
      <ul className="processing-screen__peek-list">
        {rows.length === 0 ? (
          <li>Очередь пуста</li>
        ) : (
          rows.map((row) => {
            const pct = parseDownloadsProgressPercent(row.progress)
            const suffix = pct > 0 ? ` · ${String(pct)}%` : ''
            return (
              <li key={row.id}>
                {row.shortLabel}
                {suffix} · {row.status}
              </li>
            )
          })
        )}
      </ul>
      <button type="button" className="app-btn app-btn-primary" onClick={props.onOpenFull}>
        Открыть загрузки
      </button>
    </section>
  )
}

export function ProcessingHistoryPeek(): JSX.Element {
  const [entries, setEntries] = useState<ProcessingHistoryEntry[]>([])

  useEffect(() => {
    let cancelled = false
    async function load(): Promise<void> {
      const get = window.velorix?.processingHistory?.get
      if (get == null) {
        return
      }
      const rows = await get({ limit: 6 })
      if (!cancelled) {
        setEntries(rows)
      }
    }
    void load()
    const onChanged = window.velorix?.onProcessingHistoryChanged
    const unsub = onChanged?.(() => {
      void load()
    })
    return () => {
      cancelled = true
      unsub?.()
    }
  }, [])

  return (
    <section className="processing-screen__peek vn-surface-glass">
      <h2 className="processing-screen__peek-title">Журнал обработки</h2>
      <ul className="processing-screen__peek-list">
        {entries.length === 0 ? (
          <li>Записей экспорта пока нет</li>
        ) : (
          entries.map((entry) => (
            <li key={entry.id} className="processing-screen__peek-history-row">
              <span>
                {entry.status}
                {entry.outcome === 'error' && entry.errorHint != null
                  ? ` · ${entry.errorHint}`
                  : ''}
              </span>
              {entry.outcome === 'success' && entry.outputPath != null ? (
                <button
                  type="button"
                  className="app-btn app-btn-secondary"
                  onClick={() => {
                    void window.velorix?.processingHistory?.openOutput(entry.id, 'file')
                  }}
                >
                  Открыть
                </button>
              ) : null}
            </li>
          ))
        )}
      </ul>
    </section>
  )
}

export function ProcessingTerminalPeek(props: { onOpenFull: () => void }): JSX.Element {
  const [lines, setLines] = useState<string[]>(['Ожидание FFmpeg…'])

  useEffect(() => {
    const subscribe = window.velorix?.export?.onProgress
    if (subscribe == null) {
      return
    }
    return subscribe((payload: FfmpegExportProgressPayload) => {
      const line =
        payload.percent >= 0 ? `${String(payload.percent)}% · ${payload.message}` : payload.message
      setLines((prev) => [...prev, line].slice(-6))
    })
  }, [])

  return (
    <section className="processing-screen__peek vn-surface-glass processing-screen__peek--terminal">
      <h2 className="processing-screen__peek-title">FFmpeg log</h2>
      <pre className="processing-screen__peek-log">
        {lines.map((line, index) => (
          <code key={`${index}-${line.slice(0, 16)}`}>{line}</code>
        ))}
      </pre>
      <button type="button" className="app-btn app-btn-primary" onClick={props.onOpenFull}>
        Открыть терминал
      </button>
    </section>
  )
}
