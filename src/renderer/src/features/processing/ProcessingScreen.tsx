import { useState, type JSX } from 'react'

import { VELORIX_NEON_CANONICAL_REFERENCE_REL } from '../../../../shared/velorix-neon-theme-tokens'

import { applyOpenMediaPick } from '../../lib/apply-open-media-pick'
import { useAppShellStore } from '../../stores/app-shell-store'

type ProcessingCenterTab = 'editor' | 'downloads' | 'terminal'

const CENTER_TABS: Array<{ id: ProcessingCenterTab; label: string }> = [
  { id: 'editor', label: 'Редактор' },
  { id: 'downloads', label: 'Загрузки' },
  { id: 'terminal', label: 'Консоль' }
]

const MEDIA_GROUPS = [
  { label: 'Видео', count: 96 },
  { label: 'Аудио', count: 32 },
  { label: 'Изображения', count: 18 }
] as const

const MEDIA_FILES = [
  'city_night_4k.mp4',
  'drive_sequence.mov',
  'neon_building.mp4',
  'music_background.mp3',
  'ambience_city.wav'
] as const

const LANES: Array<{ id: string; clip?: string }> = [
  { id: 'V1', clip: 'city_night_4k.mp4' },
  { id: 'V2', clip: 'drive_sequence.mov' },
  { id: 'V3', clip: 'neon_building.mp4' },
  { id: 'A1', clip: 'music_background.mp3' },
  { id: 'A2', clip: 'ambience_city.wav' }
]

export function ProcessingScreen(): JSX.Element {
  const setWorkspaceTab = useAppShellStore((s) => s.setWorkspaceTab)
  const setMediaSource = useAppShellStore((s) => s.setMediaSource)
  const setMediaProbe = useAppShellStore((s) => s.setMediaProbe)
  const mediaSource = useAppShellStore((s) => s.mediaSource)
  const openModal = useAppShellStore((s) => s.openModal)
  const [centerTab, setCenterTab] = useState<ProcessingCenterTab>('editor')

  async function handleOpenMedia(): Promise<void> {
    await applyOpenMediaPick({ setMediaSource, setMediaProbe, openModal })
  }

  async function handleBatchPick(): Promise<void> {
    const pick = window.velorix?.batchExport?.pickFiles
    if (pick == null) {
      openModal('ffmpeg-error')
      return
    }
    const result = await pick()
    if (!result.ok && !('cancelled' in result && result.cancelled)) {
      openModal('ffmpeg-error')
    }
  }

  return (
    <div className="processing-screen">
      <header className="processing-screen__head">
        <div>
          <h1 className="processing-screen__title">Обработка</h1>
          <p className="processing-screen__subtitle">
            Эталон: {VELORIX_NEON_CANONICAL_REFERENCE_REL}
          </p>
        </div>
        <div className="processing-screen__head-actions">
          <button type="button" className="app-btn app-btn-secondary">
            Быстрая загрузка yt-dlp
          </button>
          <button type="button" className="app-btn" onClick={() => void handleBatchPick()}>
            Пакетный экспорт
          </button>
          <button
            type="button"
            className="app-btn app-btn-primary"
            onClick={() => void handleOpenMedia()}
          >
            Открыть медиа
          </button>
        </div>
      </header>

      <div className="processing-screen__tabs" role="tablist" aria-label="Режим центра">
        {CENTER_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={centerTab === tab.id}
            className={`processing-screen__tab${centerTab === tab.id ? ' processing-screen__tab--active' : ''}`}
            onClick={() => setCenterTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {centerTab === 'downloads' ? (
        <ProcessingDownloadsPeek onOpenFull={() => setWorkspaceTab('downloads')} />
      ) : null}
      {centerTab === 'terminal' ? (
        <ProcessingTerminalPeek onOpenFull={() => setWorkspaceTab('terminal')} />
      ) : null}
      {centerTab === 'editor' ? (
        <div className="processing-screen__workspace">
          <aside className="processing-screen__library vn-surface-glass">
            <h2 className="processing-screen__library-title">Медиатека</h2>
            <ul className="processing-screen__library-groups">
              {MEDIA_GROUPS.map((group) => (
                <li key={group.label}>
                  {group.label} <span>({group.count})</span>
                </li>
              ))}
            </ul>
            <ul className="processing-screen__library-files">
              {MEDIA_FILES.map((file, index) => (
                <li key={file}>
                  <button
                    type="button"
                    className={`processing-screen__file${index === 0 ? ' processing-screen__file--active' : ''}`}
                  >
                    {file}
                  </button>
                </li>
              ))}
            </ul>
            <p className="processing-screen__storage">Хранилище: 1.2 TB / 2.0 TB</p>
          </aside>

          <div className="processing-screen__main">
            <div className="processing-screen__preview vn-surface-glass">
              {mediaSource != null ? (
                <>
                  <video
                    className="processing-screen__video"
                    src={mediaSource.mediaUrl}
                    controls
                    preload="metadata"
                  />
                  {mediaSource.probeSummary != null ? (
                    <span className="processing-screen__preview-badge">
                      {mediaSource.probeSummary}
                    </span>
                  ) : null}
                  <span className="processing-screen__preview-hint">{mediaSource.name}</span>
                </>
              ) : (
                <>
                  <span className="processing-screen__preview-badge">4K · 60fps</span>
                  <span className="processing-screen__preview-hint">Превью · НОВЫЙ СЕЗОН</span>
                </>
              )}
            </div>
            <div className="processing-screen__transport">
              <button type="button" className="app-ui-showcase-icon-btn" aria-label="В начало">
                ⏮
              </button>
              <button
                type="button"
                className="app-ui-showcase-icon-btn app-ui-showcase-icon-btn--primary"
                aria-label="Пауза"
              >
                ❚❚
              </button>
              <button type="button" className="app-ui-showcase-icon-btn" aria-label="В конец">
                ⏭
              </button>
              <span className="app-ui-showcase-status-pill app-ui-showcase-status-pill--info">
                01:12:34 / 01:36:53
              </span>
              <input
                type="range"
                className="app-ui-showcase-range vn-progress-neon processing-screen__seek"
                defaultValue={42}
                min={0}
                max={100}
                aria-label="Позиция"
              />
            </div>
            <div className="processing-screen__timeline vn-surface-glass" aria-label="Таймлайн">
              {LANES.map((lane) => (
                <div key={lane.id} className="processing-screen__lane">
                  <span className="processing-screen__lane-label">{lane.id}</span>
                  <div
                    className={`processing-screen__lane-track${lane.clip != null ? ' processing-screen__lane-track--clip' : ''}`}
                  >
                    {lane.clip != null ? (
                      <span className="processing-screen__clip">{lane.clip}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function ProcessingDownloadsPeek(props: { onOpenFull: () => void }): JSX.Element {
  return (
    <section className="processing-screen__peek vn-surface-glass">
      <h2 className="processing-screen__peek-title">Очередь загрузок</h2>
      <ul className="processing-screen__peek-list">
        <li>city_night_4k.mp4 · 68%</li>
        <li>drive_sequence.mov · в очереди</li>
      </ul>
      <button type="button" className="app-btn app-btn-primary" onClick={props.onOpenFull}>
        Открыть загрузки
      </button>
    </section>
  )
}

function ProcessingTerminalPeek(props: { onOpenFull: () => void }): JSX.Element {
  return (
    <section className="processing-screen__peek vn-surface-glass processing-screen__peek--terminal">
      <h2 className="processing-screen__peek-title">FFmpeg log</h2>
      <pre className="processing-screen__peek-log">
        <code>frame= 1842 fps=118 q=23.0 size= 512MiB time=00:01:12:34</code>
      </pre>
      <button type="button" className="app-btn app-btn-primary" onClick={props.onOpenFull}>
        Открыть терминал
      </button>
    </section>
  )
}

export function ProcessingRail(): JSX.Element {
  const openModal = useAppShellStore((s) => s.openModal)
  return (
    <aside className="processing-rail vn-surface-glass">
      <h2 className="processing-rail__title">Настройки FFmpeg</h2>
      <details className="processing-rail__section" open>
        <summary>Видео</summary>
        <div className="processing-rail__section-body">
          <p className="processing-rail__kv">Кодек: H.264 (libx264)</p>
          <p className="processing-rail__kv">Профиль High · Level 4.1 · Preset Slow</p>
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">CRF</span>
            <input type="number" className="app-input" defaultValue={18} min={0} max={51} />
          </label>
          <p className="processing-rail__kv">3840×2160 · 60 fps · NVENC</p>
        </div>
      </details>
      <details className="processing-rail__section">
        <summary>Аудио</summary>
        <div className="processing-rail__section-body">
          <select className="app-settings-select" defaultValue="aac">
            <option value="aac">AAC 192k</option>
            <option value="opus">Opus</option>
          </select>
        </div>
      </details>
      <details className="processing-rail__section">
        <summary>Формат</summary>
        <div className="processing-rail__section-body">
          <select className="app-settings-select" defaultValue="mp4">
            <option value="mp4">MP4</option>
            <option value="mkv">MKV</option>
          </select>
        </div>
      </details>
      <details className="processing-rail__section">
        <summary>Пресеты</summary>
        <div className="processing-rail__section-body">
          <select className="app-settings-select" defaultValue="quality">
            <option value="quality">Качество 4K</option>
            <option value="fast">Быстрый</option>
          </select>
        </div>
      </details>
      <button
        type="button"
        className="app-btn app-btn-primary processing-rail__export"
        onClick={() => openModal('export-preset-name')}
      >
        Начать экспорт
      </button>
      <p className="processing-rail__footer">FFmpeg 6.1.1 · GPU NVENC</p>
    </aside>
  )
}
