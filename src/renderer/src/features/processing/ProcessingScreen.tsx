import { useEffect, useState, type JSX } from 'react'

import type {
  FfmpegExportEncodePresetId,
  FfmpegExportProgressPayload
} from '../../../../shared/ffmpeg-export-contract'
import { VELORIX_NEON_CANONICAL_REFERENCE_REL } from '../../../../shared/velorix-neon-theme-tokens'

import { applyOpenMediaPick } from '../../lib/apply-open-media-pick'
import { parseDownloadsProgressPercent } from '../../lib/parse-downloads-queue-row'
import { restoreLastMediaSession } from '../../lib/restore-last-media-session'
import { startPreviewMediaExport } from '../../lib/start-preview-media-export'
import { useAppShellStore } from '../../stores/app-shell-store'
import { useDownloadsQueue } from '../downloads/use-downloads-queue'
import { ProcessingPreviewPanel } from './ProcessingPreviewPanel'
import { useExportProgressNote } from './use-export-progress-note'
import { useFfmpegExportSettings } from './use-ffmpeg-export-settings'

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
  const mediaProbe = useAppShellStore((s) => s.mediaProbe)
  const openModal = useAppShellStore((s) => s.openModal)
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
    await applyOpenMediaPick({ setMediaSource, setMediaProbe, openModal })
  }

  async function handleBatchPick(): Promise<void> {
    const pick = window.velorix?.batchExport?.pickFiles
    if (pick == null) {
      openModal('ffmpeg-error')
      return
    }
    const result = await pick()
    if (result.ok) {
      setHeadStatus(
        `В пакетную очередь: ${String(result.added)} (пропущено ${String(result.skipped)})`
      )
    } else if (!('cancelled' in result && result.cancelled)) {
      openModal('ffmpeg-error')
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
            />
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

function ProcessingTerminalPeek(props: { onOpenFull: () => void }): JSX.Element {
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

export function ProcessingRail(): JSX.Element {
  const openModal = useAppShellStore((s) => s.openModal)
  const mediaSource = useAppShellStore((s) => s.mediaSource)
  const mediaProbe = useAppShellStore((s) => s.mediaProbe)
  const [exportBusy, setExportBusy] = useState(false)
  const [exportNote, setExportNote] = useState<string | null>(null)
  const exportProgressNote = useExportProgressNote(exportBusy)
  const { view, setCrf, setVideoCodec, setContainer, setEncodePreset, setAudioMode } =
    useFfmpegExportSettings()

  const displayExportNote = exportBusy ? (exportProgressNote ?? 'Экспорт…') : exportNote

  const codec = view?.ffmpegExportVideoCodec ?? 'libx264'
  const container = view?.ffmpegExportContainer ?? 'mp4'
  const crf = view?.ffmpegExportCrf ?? 18
  const encodePreset: FfmpegExportEncodePresetId =
    view?.ffmpegExportEncodePreset === 'smaller' || view?.ffmpegExportEncodePreset === 'quality'
      ? view.ffmpegExportEncodePreset
      : 'balance'
  const audioMode = view?.ffmpegExportAudioMode ?? 'aac'

  return (
    <aside className="processing-rail vn-surface-glass">
      <h2 className="processing-rail__title">Настройки FFmpeg</h2>
      <details className="processing-rail__section" open>
        <summary>Видео</summary>
        <div className="processing-rail__section-body">
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">Кодек</span>
            <select
              className="app-settings-select"
              value={codec}
              onChange={(e) => void setVideoCodec(e.target.value as typeof codec)}
            >
              <option value="libx264">H.264 (libx264)</option>
              <option value="libx265">H.265 (libx265)</option>
              <option value="hw_auto">HW auto</option>
              <option value="hw_auto_hevc">HW HEVC</option>
            </select>
          </label>
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">CRF</span>
            <input
              type="number"
              className="app-input"
              value={crf}
              min={0}
              max={51}
              onChange={(e) => {
                const next = Number(e.target.value)
                if (!Number.isNaN(next)) {
                  void setCrf(next)
                }
              }}
            />
          </label>
        </div>
      </details>
      <details className="processing-rail__section">
        <summary>Аудио</summary>
        <div className="processing-rail__section-body">
          <select
            className="app-settings-select"
            value={audioMode}
            onChange={(e) => void setAudioMode(e.target.value as typeof audioMode)}
          >
            <option value="aac">AAC</option>
            <option value="libopus">Opus</option>
            <option value="copy">Copy</option>
            <option value="none">Без аудио</option>
          </select>
        </div>
      </details>
      <details className="processing-rail__section">
        <summary>Формат</summary>
        <div className="processing-rail__section-body">
          <select
            className="app-settings-select"
            value={container}
            onChange={(e) => void setContainer(e.target.value as typeof container)}
          >
            <option value="mp4">MP4</option>
            <option value="mkv">MKV</option>
            <option value="mov">MOV</option>
          </select>
        </div>
      </details>
      <details className="processing-rail__section">
        <summary>Пресеты</summary>
        <div className="processing-rail__section-body">
          <select
            className="app-settings-select"
            value={encodePreset}
            onChange={(e) => {
              const next = e.target.value
              if (next === 'balance' || next === 'smaller' || next === 'quality') {
                void setEncodePreset(next)
              }
            }}
          >
            <option value="balance">Баланс</option>
            <option value="smaller">Меньший размер</option>
            <option value="quality">Качество</option>
          </select>
        </div>
      </details>
      <button
        type="button"
        className="app-btn app-btn-primary processing-rail__export"
        disabled={exportBusy || mediaSource == null}
        onClick={() => {
          if (mediaSource == null) {
            setExportNote('Сначала откройте медиа в превью')
            return
          }
          setExportBusy(true)
          setExportNote(null)
          void startPreviewMediaExport({
            inputPath: mediaSource.path,
            mediaProbe,
            settings: view,
            openModal
          }).then((result) => {
            if (result?.ok) {
              setExportNote(`Готово: ${result.path}`)
            } else if (result != null && !result.ok && 'error' in result) {
              setExportNote(result.error)
            }
            setExportBusy(false)
          })
        }}
      >
        {exportBusy ? 'Экспорт…' : 'Начать экспорт'}
      </button>
      <button
        type="button"
        className="app-btn app-btn-secondary"
        disabled={!exportBusy}
        onClick={() => {
          void window.velorix?.export?.cancel?.().then(() => {
            setExportBusy(false)
            setExportNote('Экспорт отменён')
          })
        }}
      >
        Отменить экспорт
      </button>
      <button
        type="button"
        className="app-btn app-btn-secondary"
        onClick={() => openModal('export-preset-name')}
      >
        Имя пресета
      </button>
      {displayExportNote != null ? (
        <p className="processing-rail__export-note">{displayExportNote}</p>
      ) : null}
      <p className="processing-rail__footer">
        {view == null ? 'Загрузка настроек…' : `Кодек: ${codec} · ${container.toUpperCase()}`}
      </p>
    </aside>
  )
}
