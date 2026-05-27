import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_INSPECTOR_REL } from '../../../../shared/velorix-neon-theme-tokens'

import { applyOpenMediaPick } from '../../lib/apply-open-media-pick'
import { formatMediaProbeSummary } from '../../lib/format-media-probe-summary'
import { useAppShellStore } from '../../stores/app-shell-store'

export function InspectorScreen(): JSX.Element {
  const mediaSource = useAppShellStore((s) => s.mediaSource)
  const mediaProbe = useAppShellStore((s) => s.mediaProbe)
  const setMediaSource = useAppShellStore((s) => s.setMediaSource)
  const setMediaProbe = useAppShellStore((s) => s.setMediaProbe)
  const openModal = useAppShellStore((s) => s.openModal)

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
        <button
          type="button"
          className="app-btn app-btn-primary"
          onClick={() => {
            void applyOpenMediaPick({ setMediaSource, setMediaProbe, openModal })
          }}
        >
          Открыть файл
        </button>
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
  const chapters = mediaProbe?.chapters ?? []
  return (
    <aside className="portal-rail vn-surface-glass inspector-rail">
      <h2 className="portal-rail__title">Главы</h2>
      <ul className="inspector-rail__chapters">
        {chapters.length === 0 ? (
          <li className="portal-rail__hint">Главы не найдены</li>
        ) : (
          chapters.map((chapter, index) => (
            <li key={`${chapter.index}-${chapter.startSec}`}>
              <button
                type="button"
                className={`inspector-rail__chapter${index === 0 ? ' inspector-rail__chapter--active' : ''}`}
              >
                {chapter.title ?? `Глава ${chapter.index}`}
              </button>
            </li>
          ))
        )}
      </ul>
    </aside>
  )
}
