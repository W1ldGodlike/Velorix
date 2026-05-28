import { useState, type JSX } from 'react'

import { VELORIX_NEON_REFERENCE_INSPECTOR_REL } from '../../../../shared/velorix-neon-theme-tokens'

import { applyOpenMediaPick } from '../../lib/apply-open-media-pick'
import { formatMediaProbeSummary } from '../../lib/format-media-probe-summary'
import { trimFromProbeChapter, trimFromProbeDuration } from '../../lib/inspector-chapter-trim'
import { useAppShellStore } from '../../stores/app-shell-store'

export function InspectorScreen(): JSX.Element {
  const mediaSource = useAppShellStore((s) => s.mediaSource)
  const mediaProbe = useAppShellStore((s) => s.mediaProbe)
  const setMediaSource = useAppShellStore((s) => s.setMediaSource)
  const setMediaProbe = useAppShellStore((s) => s.setMediaProbe)
  const setExportTrim = useAppShellStore((s) => s.setExportTrim)
  const setWorkspaceTab = useAppShellStore((s) => s.setWorkspaceTab)

  const title = mediaSource?.name ?? 'Файл не выбран'
  const summary =
    mediaProbe != null
      ? formatMediaProbeSummary(mediaProbe)
      : 'Откройте медиафайл для анализа ffprobe.'

  return (
    <div className="portal-screen inspector-screen">
      <header className="portal-screen__head">
        <div>
          <h1 className="portal-screen__title">Инспектор медиа</h1>
          <p className="portal-screen__subtitle">Эталон: {VELORIX_NEON_REFERENCE_INSPECTOR_REL}</p>
        </div>
        <div className="portal-screen__head-actions">
          <button
            type="button"
            className="app-btn app-btn-secondary"
            disabled={mediaProbe == null}
            onClick={() => {
              const trim = trimFromProbeDuration(mediaProbe?.durationSec)
              if (trim == null) {
                return
              }
              setExportTrim(trim)
              setWorkspaceTab('processing')
            }}
          >
            Экспорт всего файла
          </button>
          <button
            type="button"
            className="app-btn app-btn-secondary"
            disabled={mediaSource == null}
            onClick={() => setWorkspaceTab('processing')}
          >
            Обработка
          </button>
          <button
            type="button"
            className="app-btn app-btn-primary"
            onClick={() => {
              void applyOpenMediaPick({ setMediaSource, setMediaProbe })
            }}
          >
            Открыть файл
          </button>
        </div>
      </header>
      <div className="inspector-screen__layout">
        <section className="inspector-screen__overview vn-surface-glass">
          <h2>{title}</h2>
          <p className="inspector-screen__summary">{summary}</p>
          <dl className="inspector-screen__meta">
            <div>
              <dt>Длительность</dt>
              <dd>{formatDuration(mediaProbe?.durationSec)}</dd>
            </div>
            <div>
              <dt>Размер</dt>
              <dd>{formatSize(mediaProbe?.containerSizeBytes)}</dd>
            </div>
            <div>
              <dt>Контейнер</dt>
              <dd>{mediaProbe?.formatName ?? '—'}</dd>
            </div>
          </dl>
        </section>
        <section className="inspector-screen__tracks vn-surface-glass">
          <h2>Дорожки</h2>
          <table className="app-ui-showcase-table inspector-screen__table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Тип</th>
                <th scope="col">Кодек</th>
                <th scope="col">Параметры</th>
              </tr>
            </thead>
            <tbody>
              {(mediaProbe?.tracks ?? []).map((track) => (
                <tr key={track.index}>
                  <td>{track.index}</td>
                  <td>{track.kind}</td>
                  <td>{track.codec}</td>
                  <td>{track.detail}</td>
                </tr>
              ))}
              {mediaProbe == null || mediaProbe.tracks.length === 0 ? (
                <tr>
                  <td colSpan={4}>Нет данных</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}

function formatDuration(sec: number | null | undefined): string {
  if (sec == null || !Number.isFinite(sec)) {
    return '—'
  }
  const total = Math.max(0, Math.floor(sec))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatSize(bytes: number | null | undefined): string {
  if (bytes == null || !Number.isFinite(bytes)) {
    return '—'
  }
  if (bytes >= 1_000_000_000) {
    return `${(bytes / 1_000_000_000).toFixed(2)} GB`
  }
  return `${(bytes / 1_000_000).toFixed(1)} MB`
}

export function InspectorRail(): JSX.Element {
  const mediaProbe = useAppShellStore((s) => s.mediaProbe)
  const setExportTrim = useAppShellStore((s) => s.setExportTrim)
  const setWorkspaceTab = useAppShellStore((s) => s.setWorkspaceTab)
  const chapters = mediaProbe?.chapters ?? []
  const [activeChapterIndex, setActiveChapterIndex] = useState<number | null>(null)

  return (
    <aside className="portal-rail vn-surface-glass inspector-rail">
      <h2 className="portal-rail__title">Главы</h2>
      <ul className="inspector-rail__chapters">
        {chapters.length === 0 ? (
          <li className="portal-rail__hint">Главы не найдены</li>
        ) : (
          chapters.map((chapter) => {
            const isActive =
              activeChapterIndex === chapter.index &&
              chapters.some((row) => row.index === activeChapterIndex)
            return (
              <li key={`${chapter.index}-${chapter.startSec}`}>
                <button
                  type="button"
                  className={`inspector-rail__chapter${isActive ? ' inspector-rail__chapter--active' : ''}`}
                  onClick={() => {
                    const trim = trimFromProbeChapter(chapter, chapters, mediaProbe?.durationSec)
                    if (trim == null) {
                      return
                    }
                    setActiveChapterIndex(chapter.index)
                    setExportTrim(trim)
                    setWorkspaceTab('processing')
                  }}
                >
                  {chapter.title ?? `Глава ${chapter.index}`}
                </button>
              </li>
            )
          })
        )}
      </ul>
    </aside>
  )
}
