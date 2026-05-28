import { useEffect, useMemo, useState, type JSX } from 'react'

import { VELORIX_NEON_REFERENCE_DOWNLOADS_REL } from '../../../../shared/velorix-neon-theme-tokens'

import {
  isDownloadsRowComplete,
  parseDownloadsProgressPercent
} from '../../lib/parse-downloads-queue-row'
import { useAppShellStore } from '../../stores/app-shell-store'
import { useDownloadsQueue } from './use-downloads-queue'

const FILTER_TABS = [
  { id: 'all', label: 'Все' },
  { id: 'active', label: 'Активные' },
  { id: 'done', label: 'Завершённые' },
  { id: 'error', label: 'Ошибки' }
] as const

export function DownloadsScreen(): JSX.Element {
  const setWorkspaceTab = useAppShellStore((s) => s.setWorkspaceTab)
  const queueRows = useDownloadsQueue()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [filterId, setFilterId] = useState<(typeof FILTER_TABS)[number]['id']>('all')
  const [search, setSearch] = useState('')
  const [addUrl, setAddUrl] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return queueRows.filter((row) => {
      if (q.length > 0) {
        const hay = `${row.shortLabel} ${row.url} ${row.status}`.toLowerCase()
        if (!hay.includes(q)) {
          return false
        }
      }
      if (filterId === 'all') {
        return true
      }
      const status = row.status.toLowerCase()
      if (filterId === 'active') {
        return (
          status.includes('загруз') || status.includes('download') || status.includes('running')
        )
      }
      if (filterId === 'done') {
        return status.includes('готов') || status.includes('done') || status.includes('complete')
      }
      if (filterId === 'error') {
        return status.includes('ошиб') || status.includes('error') || status.includes('fail')
      }
      return true
    })
  }, [filterId, queueRows, search])

  const selected =
    filtered.find((row) => row.id === selectedId) ?? filtered[0] ?? queueRows[0] ?? null

  async function handleAddUrls(): Promise<void> {
    const add = window.velorix?.downloads?.addLines
    const text = addUrl.trim()
    if (add == null || text.length === 0) {
      return
    }
    await add(text)
    setAddUrl('')
  }

  return (
    <div className="downloads-screen">
      <header className="downloads-screen__head">
        <div>
          <h1 className="downloads-screen__title">Менеджер загрузок</h1>
          <p className="downloads-screen__subtitle">
            Эталон: {VELORIX_NEON_REFERENCE_DOWNLOADS_REL}
          </p>
        </div>
        <div className="downloads-screen__head-actions">
          <button
            type="button"
            className="app-btn app-btn-primary"
            onClick={() => void handleAddUrls()}
          >
            Добавить
          </button>
          <button
            type="button"
            className="app-btn app-btn-secondary"
            onClick={() => void window.velorix?.downloads?.startQueue()}
          >
            Запустить все
          </button>
          <button
            type="button"
            className="app-btn"
            onClick={() => void window.velorix?.downloads?.pauseYtdlp()}
          >
            Пауза все
          </button>
        </div>
      </header>

      <div className="downloads-screen__toolbar vn-surface-glass">
        <input
          type="search"
          className="app-input downloads-screen__search"
          placeholder="Поиск загрузок…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label className="downloads-screen__add-url app-ui-showcase-field">
          <span className="app-ui-showcase-field-label">URL</span>
          <input
            type="text"
            className="app-input"
            placeholder="https://…"
            value={addUrl}
            onChange={(e) => setAddUrl(e.target.value)}
          />
        </label>
        <div className="downloads-screen__filters" role="tablist">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filterId === tab.id}
              className={`downloads-screen__filter${filterId === tab.id ? ' downloads-screen__filter--active' : ''}`}
              onClick={() => setFilterId(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="downloads-screen__list">
        {filtered.length === 0 ? (
          <p className="downloads-screen__empty vn-surface-glass">
            Очередь пуста — введите URL выше.
          </p>
        ) : (
          filtered.map((row, index) => {
            const pct = parseDownloadsProgressPercent(row.progress)
            const rowComplete = isDownloadsRowComplete(row.status)
            return (
              <article
                key={row.id}
                className={`downloads-card vn-surface-glass${selected?.id === row.id || (selected == null && index === 0) ? ' downloads-card--selected' : ''}`}
                onClick={() => setSelectedId(row.id)}
              >
                <div className="downloads-card__thumb" aria-hidden />
                <div className="downloads-card__body">
                  <div className="downloads-card__title-row">
                    <strong>{row.shortLabel}</strong>
                    {row.queueFmt != null ? (
                      <span className="app-ui-showcase-badge app-ui-showcase-badge--accent">
                        {row.queueFmt}
                      </span>
                    ) : null}
                  </div>
                  <span className="downloads-card__source">{row.status}</span>
                  <div className="downloads-card__progress-row">
                    <div className="app-ui-showcase-progress-track">
                      <span
                        className="app-ui-showcase-progress-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span>{row.progress}</span>
                  </div>
                  <div className="downloads-card__meta">
                    {row.queueSize != null ? <span>{row.queueSize}</span> : null}
                    {row.queueSpeed != null ? <span>{row.queueSpeed}</span> : null}
                    {row.queueEta != null ? <span>~{row.queueEta}</span> : null}
                  </div>
                </div>
                <div className="downloads-card__actions">
                  {rowComplete ? (
                    <>
                      <button
                        type="button"
                        className="app-ui-showcase-icon-btn"
                        aria-label="Открыть файл"
                        title="Открыть файл"
                        onClick={(e) => {
                          e.stopPropagation()
                          void window.velorix?.downloads?.openQueueOutput(row.id, 'file')
                        }}
                      >
                        ⧉
                      </button>
                      <button
                        type="button"
                        className="app-ui-showcase-icon-btn"
                        aria-label="Показать в папке"
                        title="Показать в папке"
                        onClick={(e) => {
                          e.stopPropagation()
                          void window.velorix?.downloads?.openQueueOutput(row.id, 'folder')
                        }}
                      >
                        📁
                      </button>
                      <button
                        type="button"
                        className="app-ui-showcase-icon-btn"
                        aria-label="В пакетный экспорт"
                        title="В пакетный экспорт"
                        onClick={(e) => {
                          e.stopPropagation()
                          void window.velorix?.batchExport
                            ?.addFromDownloadsDone([row.id])
                            .then((result) => {
                              if (result.ok) {
                                setWorkspaceTab('processing')
                              }
                            })
                        }}
                      >
                        ⊕
                      </button>
                    </>
                  ) : null}
                  <button
                    type="button"
                    className="app-ui-showcase-icon-btn"
                    aria-label="Повтор"
                    onClick={(e) => {
                      e.stopPropagation()
                      void window.velorix?.downloads?.retryRow(row.id)
                    }}
                  >
                    ↻
                  </button>
                  <button
                    type="button"
                    className="app-ui-showcase-icon-btn"
                    aria-label="Удалить"
                    onClick={(e) => {
                      e.stopPropagation()
                      void window.velorix?.downloads?.removeRow(row.id)
                    }}
                  >
                    ×
                  </button>
                </div>
              </article>
            )
          })
        )}
      </div>

      <section className="downloads-screen__queue vn-surface-glass">
        <h2 className="downloads-screen__queue-title">Очередь ({queueRows.length})</h2>
        <ul className="downloads-screen__queue-list">
          {queueRows.slice(0, 8).map((row) => (
            <li key={row.id}>{row.shortLabel}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export function DownloadsRail(): JSX.Element {
  const setWorkspaceTab = useAppShellStore((s) => s.setWorkspaceTab)
  const [outputPath, setOutputPath] = useState('—')

  async function refreshOutputPath(): Promise<void> {
    const getDir = window.velorix?.downloads?.getOutputDirectory
    if (getDir == null) {
      return
    }
    const dir = await getDir()
    setOutputPath(dir.path)
  }

  useEffect(() => {
    void (async () => {
      await refreshOutputPath()
    })()
  }, [])

  return (
    <aside className="downloads-rail">
      <section className="downloads-rail__section vn-surface-glass">
        <h2 className="downloads-rail__title">Папка вывода</h2>
        <p className="downloads-rail__path">{outputPath}</p>
        <div className="downloads-rail__actions">
          <button
            type="button"
            className="app-btn app-btn-secondary"
            onClick={() => {
              void window.velorix?.downloads?.pickOutputDirectory().then(() => refreshOutputPath())
            }}
          >
            Обзор…
          </button>
          <button
            type="button"
            className="app-btn"
            onClick={() => void window.velorix?.downloads?.openOutputDirectory()}
          >
            Открыть папку
          </button>
        </div>
      </section>
      <section className="downloads-rail__section vn-surface-glass">
        <h2 className="downloads-rail__title">Быстрые действия</h2>
        <div className="downloads-rail__actions">
          <button
            type="button"
            className="app-btn app-btn-secondary"
            onClick={() => void window.velorix?.downloads?.clearFinished()}
          >
            Очистить завершённые
          </button>
          <button
            type="button"
            className="app-btn"
            onClick={() => {
              void navigator.clipboard.readText().then((text) => {
                if (text.trim().length > 0) {
                  void window.velorix?.downloads?.addLines(text)
                }
              })
            }}
          >
            Из буфера
          </button>
          <button
            type="button"
            className="app-btn app-btn-primary"
            onClick={() => {
              void window.velorix?.batchExport?.addFromDownloadsDone().then((result) => {
                if (result.ok) {
                  setWorkspaceTab('processing')
                }
              })
            }}
          >
            В пакетный экспорт
          </button>
        </div>
      </section>
    </aside>
  )
}
