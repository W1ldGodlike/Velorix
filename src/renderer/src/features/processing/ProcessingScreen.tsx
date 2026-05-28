import { useEffect, useMemo, useState, type JSX } from 'react'

import { VELORIX_NEON_CANONICAL_REFERENCE_REL } from '../../../../shared/velorix-neon-theme-tokens'

import { applyOpenMediaPick } from '../../lib/apply-open-media-pick'
import { formatMediaClock } from '../../lib/format-media-clock'
import { restoreLastMediaSession } from '../../lib/restore-last-media-session'
import { reportFfmpegError } from '../../lib/report-ffmpeg-error'
import { useAppShellStore } from '../../stores/app-shell-store'
import { ProcessingPreviewPanel } from './ProcessingPreviewPanel'
import {
  ProcessingBatchPeek,
  ProcessingDownloadsPeek,
  ProcessingHistoryPeek,
  ProcessingTerminalPeek
} from './ProcessingScreenPeeks'
import {
  buildPlayheadStyle,
  buildTimelineRulerMarks,
  buildTimelineZoomTrackMinWidthPercent,
  buildTrimSpanStyle,
  clampTimelineZoom,
  PROCESSING_TIMELINE_LANES,
  TIMELINE_ZOOM_MAX,
  TIMELINE_ZOOM_MIN,
  timelineKeyboardSeekSec,
  timelineKeyboardZoomLevel,
  timelineWheelZoomLevel,
  timelineRulerTickCountForZoom,
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

export function ProcessingScreen(): JSX.Element {
  const setWorkspaceTab = useAppShellStore((s) => s.setWorkspaceTab)
  const exportTrim = useAppShellStore((s) => s.exportTrim)
  const setMediaSource = useAppShellStore((s) => s.setMediaSource)
  const setMediaProbe = useAppShellStore((s) => s.setMediaProbe)
  const mediaSource = useAppShellStore((s) => s.mediaSource)
  const mediaProbe = useAppShellStore((s) => s.mediaProbe)
  const requestPreviewSeek = useAppShellStore((s) => s.requestPreviewSeek)
  const previewPlayheadSec = useAppShellStore((s) => s.previewPlayheadSec)
  const timelineZoom = useAppShellStore((s) => s.timelineZoom)
  const setTimelineZoom = useAppShellStore((s) => s.setTimelineZoom)
  const [centerTab, setCenterTab] = useState<ProcessingCenterTab>('editor')
  const [ytdlpUrl, setYtdlpUrl] = useState('')
  const [headStatus, setHeadStatus] = useState<string | null>(null)

  const timelineLanes = useMemo(
    () =>
      PROCESSING_TIMELINE_LANES.map((lane) =>
        lane.id === 'V1' && mediaSource != null ? { ...lane, clip: mediaSource.name } : lane
      ),
    [mediaSource]
  )
  const timelineRulerMarks = useMemo(
    () =>
      buildTimelineRulerMarks(mediaProbe?.durationSec, timelineRulerTickCountForZoom(timelineZoom)),
    [mediaProbe?.durationSec, timelineZoom]
  )
  const timelineZoomTrackWidth = buildTimelineZoomTrackMinWidthPercent(timelineZoom)

  useEffect(() => {
    let cancelled = false
    async function load(): Promise<void> {
      await restoreLastMediaSession({
        hasMedia: useAppShellStore.getState().mediaSource != null,
        setMediaSource,
        setMediaProbe
      })
      if (cancelled) {
        return
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [setMediaSource, setMediaProbe])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (centerTab !== 'editor' || mediaSource == null) {
        return
      }
      const target = event.target
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return
      }
      const nextZoom = timelineKeyboardZoomLevel(event.key, timelineZoom)
      if (nextZoom != null) {
        event.preventDefault()
        setTimelineZoom(nextZoom)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [centerTab, mediaSource, setTimelineZoom, timelineZoom])

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
              {mediaSource != null ? (
                <li>
                  <button
                    type="button"
                    className="processing-screen__file processing-screen__file--active"
                    title={mediaSource.path}
                    onClick={() => void handleOpenMedia()}
                  >
                    {mediaSource.name}
                  </button>
                </li>
              ) : (
                <li className="processing-screen__library-empty">Медиафайл не открыт</li>
              )}
            </ul>
            <button
              type="button"
              className="app-btn app-btn-secondary processing-screen__library-open"
              onClick={() => void handleOpenMedia()}
            >
              {mediaSource != null ? 'Сменить файл…' : 'Открыть файл…'}
            </button>
            <p className="processing-screen__storage" aria-hidden>
              Хранилище: 1.2 TB / 2.0 TB
            </p>
          </aside>

          <div className="processing-screen__main">
            <ProcessingPreviewPanel
              key={mediaSource?.mediaUrl ?? 'preview-empty'}
              mediaSource={mediaSource}
              durationSec={mediaProbe?.durationSec ?? null}
              onActionNote={setHeadStatus}
            />
            <div className="processing-screen__timeline vn-surface-glass" aria-label="Таймлайн">
              <div
                className="processing-screen__timeline-scroll"
                title="Ctrl+колесо или двойной клик: масштаб таймлайна"
                onWheel={(e) => {
                  if (mediaSource == null || (!e.ctrlKey && !e.metaKey)) {
                    return
                  }
                  e.preventDefault()
                  setTimelineZoom(timelineWheelZoomLevel(e.deltaY, timelineZoom))
                }}
                onDoubleClick={() => {
                  if (mediaSource == null) {
                    return
                  }
                  setTimelineZoom(TIMELINE_ZOOM_MIN)
                }}
              >
                <div
                  className="processing-screen__timeline-scale"
                  style={{ minWidth: timelineZoomTrackWidth }}
                >
                  {mediaSource != null && timelineRulerMarks.length > 0 ? (
                    <div className="processing-screen__ruler" aria-hidden>
                      <span className="processing-screen__lane-label" />
                      <div className="processing-screen__ruler-track">
                        {timelineRulerMarks.map((mark) => (
                          <span
                            key={mark.left}
                            className="processing-screen__ruler-tick"
                            style={{ left: mark.left }}
                          >
                            <span className="processing-screen__ruler-label">
                              {formatMediaClock(mark.sec)}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {timelineLanes.map((lane) => {
                    const trimStyle =
                      lane.id === 'V1'
                        ? buildTrimSpanStyle(exportTrim, mediaProbe?.durationSec)
                        : null
                    const playheadStyle =
                      lane.id === 'V1'
                        ? buildPlayheadStyle(previewPlayheadSec, mediaProbe?.durationSec)
                        : null
                    return (
                      <div key={lane.id} className="processing-screen__lane">
                        <span className="processing-screen__lane-label">{lane.id}</span>
                        <div
                          className={`processing-screen__lane-track${lane.clip != null ? ' processing-screen__lane-track--clip' : ''}${lane.id === 'V1' && mediaSource != null ? ' processing-screen__lane-track--seekable' : ''}`}
                          role={lane.id === 'V1' && mediaSource != null ? 'slider' : undefined}
                          aria-label={
                            lane.id === 'V1' && mediaSource != null
                              ? 'Позиция на таймлайне'
                              : undefined
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
                          onKeyDown={
                            lane.id === 'V1' && mediaSource != null
                              ? (e) => {
                                  const duration = mediaProbe?.durationSec
                                  if (duration == null) {
                                    return
                                  }
                                  const current = previewPlayheadSec ?? 0
                                  const sec = timelineKeyboardSeekSec(
                                    e.key,
                                    e.shiftKey,
                                    current,
                                    duration
                                  )
                                  if (sec != null) {
                                    e.preventDefault()
                                    requestPreviewSeek(sec)
                                    return
                                  }
                                  const nextZoom = timelineKeyboardZoomLevel(e.key, timelineZoom)
                                  if (nextZoom != null) {
                                    e.preventDefault()
                                    setTimelineZoom(nextZoom)
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
                          {playheadStyle != null ? (
                            <span className="processing-screen__playhead" style={playheadStyle}>
                              {previewPlayheadSec != null && Number.isFinite(previewPlayheadSec) ? (
                                <span className="processing-screen__playhead-bubble">
                                  {formatMediaClock(previewPlayheadSec)}
                                </span>
                              ) : null}
                            </span>
                          ) : null}
                          {lane.clip != null ? (
                            <span className="processing-screen__clip">{lane.clip}</span>
                          ) : null}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div
                className="processing-screen__timeline-zoom"
                role="group"
                aria-label="Масштаб таймлайна"
              >
                <span className="processing-screen__timeline-zoom-label">Zoom</span>
                <button
                  type="button"
                  className="app-btn app-btn-secondary processing-screen__timeline-zoom-btn"
                  onClick={() => setTimelineZoom(timelineZoom - 1)}
                  disabled={mediaSource == null || timelineZoom <= TIMELINE_ZOOM_MIN}
                  aria-label="Уменьшить масштаб таймлайна"
                >
                  −
                </button>
                <input
                  type="range"
                  className="app-ui-showcase-range vn-progress-neon processing-screen__timeline-zoom-range"
                  min={TIMELINE_ZOOM_MIN}
                  max={TIMELINE_ZOOM_MAX}
                  step={1}
                  value={timelineZoom}
                  aria-valuetext={`${String(timelineZoom)}×`}
                  disabled={mediaSource == null}
                  onChange={(e) => setTimelineZoom(clampTimelineZoom(Number(e.target.value)))}
                />
                <button
                  type="button"
                  className="app-btn app-btn-secondary processing-screen__timeline-zoom-btn"
                  onClick={() => setTimelineZoom(TIMELINE_ZOOM_MIN)}
                  disabled={mediaSource == null || timelineZoom === TIMELINE_ZOOM_MIN}
                  aria-label="Сбросить масштаб таймлайна (1x)"
                  title="Сбросить масштаб к 1x"
                >
                  1x
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-secondary processing-screen__timeline-zoom-btn"
                  onClick={() => setTimelineZoom(timelineZoom + 1)}
                  disabled={mediaSource == null || timelineZoom >= TIMELINE_ZOOM_MAX}
                  aria-label="Увеличить масштаб таймлайна"
                >
                  +
                </button>
                <span className="processing-screen__timeline-zoom-value">{timelineZoom}×</span>
                <span className="processing-screen__timeline-zoom-hint" aria-hidden>
                  Hotkeys: - / + / 0 / PgUp / PgDn · Ctrl+Wheel · Double-click reset
                </span>
              </div>
            </div>
            <ProcessingBatchPeek />
            <ProcessingHistoryPeek />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export { ProcessingRail } from './ProcessingRail'
