import { useEffect, useState, type JSX } from 'react'

import { VELORIX_NEON_CANONICAL_REFERENCE_REL } from '../../../../shared/velorix-neon-theme-tokens'

import { applyOpenMediaPick } from '../../lib/apply-open-media-pick'
import { restoreLastMediaSession } from '../../lib/restore-last-media-session'
import { reportFfmpegError } from '../../lib/report-ffmpeg-error'
import { useAppShellStore } from '../../stores/app-shell-store'
import { ProcessingPreviewPanel } from './ProcessingPreviewPanel'
import {
  ProcessingDownloadsPeek,
  ProcessingHistoryPeek,
  ProcessingTerminalPeek
} from './ProcessingScreenPeeks'
import {
  buildTrimSpanStyle,
  PROCESSING_TIMELINE_LANES,
  timelineSecFromPointer
} from './processing-timeline-model'

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

export function ProcessingScreen(): JSX.Element {
  const setWorkspaceTab = useAppShellStore((s) => s.setWorkspaceTab)
  const exportTrim = useAppShellStore((s) => s.exportTrim)
  const setMediaSource = useAppShellStore((s) => s.setMediaSource)
  const setMediaProbe = useAppShellStore((s) => s.setMediaProbe)
  const mediaSource = useAppShellStore((s) => s.mediaSource)
  const mediaProbe = useAppShellStore((s) => s.mediaProbe)
  const requestPreviewSeek = useAppShellStore((s) => s.requestPreviewSeek)
  const [centerTab, setCenterTab] = useState<ProcessingCenterTab>('editor')
  const [ytdlpUrl, setYtdlpUrl] = useState('')
  const [headStatus, setHeadStatus] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      await restoreLastMediaSession({
        hasMedia: useAppShellStore.getState().mediaSource != null,
        setMediaSource,
        setMediaProbe
      })
    })()
  }, [setMediaSource, setMediaProbe])

  async function handleOpenMedia(): Promise<void> {
    await applyOpenMediaPick({ setMediaSource, setMediaProbe })
  }

  async function handleBatchPick(): Promise<void> {
    const pick = window.velorix?.batchExport?.pickFiles
    if (pick == null) {
      reportFfmpegError('batchExport.pickFiles недоступен')
      return
    }
    const result = await pick()
    if (result.ok) {
      setHeadStatus(
        `В пакетную очередь: ${String(result.added)} (пропущено ${String(result.skipped)})`
      )
    } else if (!('cancelled' in result && result.cancelled) && 'error' in result) {
      reportFfmpegError(result.error)
    }
  }

  async function handleQuickYtdlp(): Promise<void> {
    const add = window.velorix?.downloads?.addLines
    const text = ytdlpUrl.trim()
    if (add == null || text.length === 0) {
      return
    }
    const result = await add(text)
    if (result.ok) {
      setYtdlpUrl('')
      setHeadStatus(`Добавлено в очередь: ${String(result.added)}`)
      setCenterTab('downloads')
    } else {
      setHeadStatus(result.error)
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
          {headStatus != null ? <p className="processing-screen__status">{headStatus}</p> : null}
        </div>
        <div className="processing-screen__head-actions">
          <input
            type="url"
            className="app-input processing-screen__ytdlp-input"
            placeholder="URL для yt-dlp"
            value={ytdlpUrl}
            onChange={(e) => setYtdlpUrl(e.target.value)}
          />
          <button
            type="button"
            className="app-btn app-btn-secondary"
            onClick={() => void handleQuickYtdlp()}
          >
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
          <button
            type="button"
            className="app-btn app-btn-secondary"
            disabled={mediaSource == null}
            onClick={() => setWorkspaceTab('inspector')}
          >
            Инспектор
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
        <div key="downloads" className="processing-screen__center-pane">
          <ProcessingDownloadsPeek onOpenFull={() => setWorkspaceTab('downloads')} />
        </div>
      ) : null}
      {centerTab === 'terminal' ? (
        <div key="terminal" className="processing-screen__center-pane">
          <ProcessingTerminalPeek onOpenFull={() => setWorkspaceTab('terminal')} />
        </div>
      ) : null}
      {centerTab === 'editor' ? (
        <div key="editor" className="processing-screen__workspace processing-screen__center-pane">
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
                    className={`processing-screen__file${mediaSource?.name === file || (mediaSource == null && index === 0) ? ' processing-screen__file--active' : ''}`}
                  >
                    {file}
                  </button>
                </li>
              ))}
            </ul>
            <p className="processing-screen__storage">Хранилище: 1.2 TB / 2.0 TB</p>
          </aside>

          <div className="processing-screen__main">
            <ProcessingPreviewPanel
              key={mediaSource?.mediaUrl ?? 'preview-empty'}
              mediaSource={mediaSource}
              durationSec={mediaProbe?.durationSec ?? null}
              onActionNote={setHeadStatus}
            />
            <div className="processing-screen__timeline vn-surface-glass" aria-label="Таймлайн">
              {PROCESSING_TIMELINE_LANES.map((lane) => {
                const trimStyle =
                  lane.id === 'V1' ? buildTrimSpanStyle(exportTrim, mediaProbe?.durationSec) : null
                return (
                  <div key={lane.id} className="processing-screen__lane">
                    <span className="processing-screen__lane-label">{lane.id}</span>
                    <div
                      className={`processing-screen__lane-track${lane.clip != null ? ' processing-screen__lane-track--clip' : ''}${lane.id === 'V1' && mediaSource != null ? ' processing-screen__lane-track--seekable' : ''}`}
                      role={lane.id === 'V1' && mediaSource != null ? 'slider' : undefined}
                      aria-label={
                        lane.id === 'V1' && mediaSource != null ? 'Позиция на таймлайне' : undefined
                      }
                      aria-valuemin={lane.id === 'V1' ? 0 : undefined}
                      aria-valuemax={
                        lane.id === 'V1' && mediaProbe?.durationSec != null
                          ? mediaProbe.durationSec
                          : undefined
                      }
                      tabIndex={lane.id === 'V1' && mediaSource != null ? 0 : undefined}
                      onClick={
                        lane.id === 'V1' && mediaSource != null
                          ? (e) => {
                              const duration = mediaProbe?.durationSec
                              if (duration == null) {
                                return
                              }
                              const sec = timelineSecFromPointer(
                                e.clientX,
                                e.currentTarget.getBoundingClientRect(),
                                duration
                              )
                              if (sec != null) {
                                requestPreviewSeek(sec)
                              }
                            }
                          : undefined
                      }
                    >
                      {trimStyle != null ? (
                        <span
                          className="processing-screen__trim-span"
                          style={trimStyle}
                          aria-hidden
                        />
                      ) : null}
                      {lane.clip != null ? (
                        <span className="processing-screen__clip">{lane.clip}</span>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
            <ProcessingHistoryPeek />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export { ProcessingRail } from './ProcessingRail'
