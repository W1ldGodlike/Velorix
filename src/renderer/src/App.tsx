import { useCallback, useEffect, useRef, useState } from 'react'
import type { JSX } from 'react'

import VideoTimeline from './components/VideoTimeline'
import Versions from './components/Versions'
import type { EngineId } from '../../shared/engine-contract'
import { ENGINE_IDS } from '../../shared/engine-contract'
import type {
  FfmpegExportAudioModeId,
  FfmpegExportContainerId,
  FfmpegExportEncodePresetId,
  FfmpegExportScalePresetId
} from '../../shared/ffmpeg-export-contract'
import type { FfmpegSnapshotFormatId } from '../../shared/ffmpeg-snapshot-contract'
import type { RestoredSourceInfo } from '../../shared/preview-dialog-contract'

type Theme = 'dark' | 'light'

type PreviewOpenedPayload = RestoredSourceInfo
type EngineSummary = 'checking' | 'ready' | 'missing' | 'error'

type EnginesSnapshot = Awaited<ReturnType<typeof window.fluxalloy.engines.getStatus>>

const EXPORT_ENCODE_PRESETS: Array<{ id: FfmpegExportEncodePresetId; label: string }> = [
  { id: 'balance', label: 'Баланс' },
  { id: 'smaller', label: 'Меньше размер' },
  { id: 'quality', label: 'Качество' }
]

const EXPORT_CONTAINERS: Array<{ id: FfmpegExportContainerId; label: string }> = [
  { id: 'mp4', label: 'MP4' },
  { id: 'mkv', label: 'MKV' },
  { id: 'mov', label: 'MOV' }
]

const EXPORT_CRF_OPTIONS = [18, 20, 23, 26, 28, 30]
const EXPORT_VIDEO_BITRATES = ['1000k', '2500k', '5000k', '8000k', '12000k', '20000k']
const EXPORT_AUDIO_MODES: Array<{ id: FfmpegExportAudioModeId; label: string }> = [
  { id: 'aac', label: 'AAC audio' },
  { id: 'none', label: 'Без аудио' }
]
const EXPORT_AUDIO_BITRATES = ['96k', '128k', '160k', '192k', '256k', '320k']
const EXPORT_FPS_OPTIONS = [24, 25, 30, 50, 60]
const EXPORT_SCALE_PRESETS: Array<{ id: FfmpegExportScalePresetId; label: string }> = [
  { id: 'source', label: 'Размер исходный' },
  { id: '480p', label: '480p' },
  { id: '720p', label: '720p' },
  { id: '1080p', label: '1080p' }
]
const SNAPSHOT_FORMATS: Array<{ id: FfmpegSnapshotFormatId; label: string }> = [
  { id: 'png', label: 'Кадр PNG' },
  { id: 'jpg', label: 'Кадр JPEG' }
]

function engineLabel(id: EngineId): string {
  switch (id) {
    case 'ffmpeg':
      return 'ffmpeg'
    case 'ffprobe':
      return 'ffprobe'
    case 'yt-dlp':
      return 'yt-dlp'
    default:
      return id
  }
}

type EnginePathsDraft = Record<EngineId, string>

function formatEngineVersionsLine(snapshot: EnginesSnapshot): string {
  const parts = ENGINE_IDS.map((id) => {
    const e = snapshot.engines[id]
    if (e.state === 'ready' && e.version) {
      const cut = e.version.length > 30 ? `${e.version.slice(0, 28)}…` : e.version
      return `${id}: ${cut}`
    }
    if (e.state === 'missing') {
      return `${id}: —`
    }
    if (e.state === 'error') {
      return `${id}: !`
    }
    return `${id}: …`
  })
  return parts.join(' · ')
}

function clipboardLooksLikeDownloadsPayload(text: string): boolean {
  const t = text.trim()
  if (t.length < 12) {
    return false
  }
  const lines = t.split(/\r?\n/)
  return lines.some((line) => {
    const x = line.trim()
    return /^https?:\/\//i.test(x) || (/^[\w.-]+\.[a-z]{2,}\//i.test(x) && x.includes('/'))
  })
}

function domTargetIsTextField(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) {
    return false
  }
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
    return true
  }
  return target.isContentEditable
}

type MediaProbeSuccess = Extract<
  Awaited<ReturnType<typeof window.fluxalloy.preview.probe>>,
  { ok: true }
>

type MediaProbeTrackRow = MediaProbeSuccess['tracks'][number]

function formatProbeDuration(sec: number | null): string {
  if (sec === null || !Number.isFinite(sec)) {
    return 'длительность ?'
  }
  if (sec < 60) {
    return `${sec.toFixed(1)} с`
  }
  const s = Math.floor(sec)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')} · ${Math.round(sec)} с`
  }
  return `${m}:${String(r).padStart(2, '0')} · ${Math.round(sec)} с`
}

function formatBitrateLine(kbps: number | null): string | null {
  if (kbps === null || !Number.isFinite(kbps)) {
    return null
  }
  if (kbps >= 10_000) {
    return `${(kbps / 1000).toFixed(2)} Mb/s`
  }
  return `${Math.round(kbps)} kb/s`
}

function trackKindRu(kind: MediaProbeTrackRow['kind']): string {
  switch (kind) {
    case 'video':
      return 'Видео'
    case 'audio':
      return 'Аудио'
    case 'subtitle':
      return 'Субтитры'
    case 'attachment':
      return 'Вложение'
    case 'data':
      return 'Данные'
    default:
      return 'Прочее'
  }
}

function formatProbeJsonForDisplay(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw) as unknown, null, 2)
  } catch {
    return raw
  }
}

function PreviewProbeBody({ probeInfo }: { probeInfo: MediaProbeSuccess }): JSX.Element {
  const [copyTip, setCopyTip] = useState<string | null>(null)
  const bitrateLabel = formatBitrateLine(probeInfo.bitrateKbps)
  const formatTooltip =
    probeInfo.formatLongName && probeInfo.formatName !== probeInfo.formatLongName
      ? probeInfo.formatLongName
      : undefined

  async function handleCopyProbeJson(): Promise<void> {
    const text = formatProbeJsonForDisplay(probeInfo.rawJson)
    const r = await window.fluxalloy.clipboard.writeText(text)
    setCopyTip(r.ok ? 'Скопировано в буфер' : 'Не удалось скопировать')
    window.setTimeout(() => {
      setCopyTip(null)
    }, 2200)
  }

  return (
    <div className="app-preview-probe-stack">
      <div className="app-preview-probe-summary-line">
        <span title={formatTooltip}>
          {formatProbeDuration(probeInfo.durationSec)}
          {probeInfo.video
            ? ` · ${probeInfo.video.width}×${probeInfo.video.height} · ${probeInfo.video.codec}`
            : ''}
          {probeInfo.audioCodec ? ` · аудио ${probeInfo.audioCodec}` : ''}
          {probeInfo.formatName ? ` · ${probeInfo.formatName}` : ''}
          {bitrateLabel ? ` · ${bitrateLabel}` : ''}
        </span>
      </div>
      {probeInfo.tracks.length > 0 ? (
        <details className="app-probe-details">
          <summary className="app-probe-summary">Дорожки ({probeInfo.tracks.length})</summary>
          <div className="app-probe-table-wrap">
            <table className="app-probe-table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Тип</th>
                  <th scope="col">Кодек</th>
                  <th scope="col">Сведения</th>
                </tr>
              </thead>
              <tbody>
                {probeInfo.tracks.map((row) => (
                  <tr key={`track-${row.index}`}>
                    <td>{row.index}</td>
                    <td>{trackKindRu(row.kind)}</td>
                    <td className="app-probe-table-mono">{row.codec}</td>
                    <td>{row.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ) : null}
      {probeInfo.rawJson.length > 0 ? (
        <details className="app-probe-details">
          <summary className="app-probe-summary">JSON ffprobe</summary>
          <div className="app-probe-json-toolbar">
            <button
              type="button"
              className="app-btn app-btn-compact"
              onClick={() => {
                void handleCopyProbeJson()
              }}
            >
              Копировать JSON
            </button>
            {copyTip ? <span className="app-probe-copy-tip">{copyTip}</span> : null}
          </div>
          <pre className="app-probe-json-pre">{formatProbeJsonForDisplay(probeInfo.rawJson)}</pre>
        </details>
      ) : null}
    </div>
  )
}

/**
 * Сводит подробные статусы движков к одной строке для нижнего статусбара.
 *
 * Подробности (пути, версии, ошибки по каждому бинарнику) позже уйдут в окно настроек
 * зависимостей. Статусбар должен оставаться компактным и показывать только состояние,
 * требующее внимания пользователя.
 */
function summarizeEngines(
  engines: Awaited<ReturnType<typeof window.fluxalloy.engines.getStatus>>['engines']
): EngineSummary {
  const states = Object.values(engines).map((engine) => engine.state)

  if (states.includes('error')) {
    return 'error'
  }
  if (states.includes('missing')) {
    return 'missing'
  }
  return 'ready'
}

function engineSummaryText(summary: EngineSummary): string {
  switch (summary) {
    case 'ready':
      return 'Движки: готовы'
    case 'missing':
      return 'Движки: не найдены'
    case 'error':
      return 'Движки: ошибка проверки'
    case 'checking':
      return 'Движки: проверка…'
  }
}

function App(): JSX.Element {
  const [theme, setTheme] = useState<Theme>('dark')
  const [engineSummary, setEngineSummary] = useState<EngineSummary>('checking')
  const [enginesOfferDownload, setEnginesOfferDownload] = useState(false)
  const [engineDownloadBusy, setEngineDownloadBusy] = useState(false)
  const [enginePathsOpen, setEnginePathsOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [aboutInfo, setAboutInfo] = useState<Awaited<
    ReturnType<typeof window.fluxalloy.about.getInfo>
  > | null>(null)
  const [enginePathsDraft, setEnginePathsDraft] = useState<EnginePathsDraft>({
    ffmpeg: '',
    ffprobe: '',
    'yt-dlp': ''
  })
  /** Подстрочное сообщение статусбара: прогресс загрузки движков, ошибки DnD и т.п. */
  const [statusHint, setStatusHint] = useState<string | null>(null)
  const [preview, setPreview] = useState<PreviewOpenedPayload | null>(null)
  const [probeInfo, setProbeInfo] = useState<MediaProbeSuccess | null>(null)
  const [probeError, setProbeError] = useState<string | null>(null)
  const [downloadsUrl, setDownloadsUrl] = useState('')
  const [engineVersionsLine, setEngineVersionsLine] = useState('')
  const [exportBusy, setExportBusy] = useState(false)
  const [exportCancelBusy, setExportCancelBusy] = useState(false)
  const [exportEncodePreset, setExportEncodePreset] =
    useState<FfmpegExportEncodePresetId>('balance')
  const [exportContainer, setExportContainer] = useState<FfmpegExportContainerId>('mp4')
  const [exportCrf, setExportCrf] = useState<number | null>(null)
  const [exportVideoBitrate, setExportVideoBitrate] = useState<string | null>(null)
  const [exportAudioMode, setExportAudioMode] = useState<FfmpegExportAudioModeId>('aac')
  const [exportAudioBitrate, setExportAudioBitrate] = useState('192k')
  const [exportFps, setExportFps] = useState<number | null>(null)
  const [exportScalePreset, setExportScalePreset] = useState<FfmpegExportScalePresetId>('source')
  const [lastExportPath, setLastExportPath] = useState<string | null>(null)
  const [lastSnapshotPath, setLastSnapshotPath] = useState<string | null>(null)
  const [snapshotFormat, setSnapshotFormat] = useState<FfmpegSnapshotFormatId>('png')
  const [snapshotBusy, setSnapshotBusy] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  /** Последний диапазон In/Out с таймлайна для IPC экспорта. */
  const trimSnapshotRef = useRef<{ inSec: number; outSec: number } | null>(null)

  const applyPreview = useCallback((payload: PreviewOpenedPayload): void => {
    setProbeInfo(null)
    setProbeError(null)
    setPreview(payload)
  }, [])

  const onTrimRangeSnapshot = useCallback((range: { inSec: number; outSec: number }) => {
    trimSnapshotRef.current = range
  }, [])

  useEffect(() => {
    trimSnapshotRef.current = null
  }, [preview?.path])

  const applyTheme = useCallback((value: Theme) => {
    document.documentElement.dataset['theme'] = value
    setTheme(value)
  }, [])

  const refreshEngineUi = useCallback(async (): Promise<void> => {
    try {
      const snapshot = await window.fluxalloy.engines.getStatus()
      setEngineSummary(summarizeEngines(snapshot.engines))
      setEngineVersionsLine(formatEngineVersionsLine(snapshot))
      const need = await window.fluxalloy.engines.shouldOfferDownload()
      setEnginesOfferDownload(need)
    } catch {
      setEngineSummary('error')
      setEngineVersionsLine('')
    }
  }, [])

  useEffect(() => {
    let cleanupTheme: (() => void) | undefined
    void (async () => {
      const loaded = await window.fluxalloy.settings.get()
      applyTheme(loaded.theme === 'light' ? 'light' : 'dark')
      const ep = loaded.ffmpegExportEncodePreset
      if (ep === 'balance' || ep === 'smaller' || ep === 'quality') {
        setExportEncodePreset(ep)
      }
      const ec = loaded.ffmpegExportContainer
      if (ec === 'mp4' || ec === 'mkv' || ec === 'mov') {
        setExportContainer(ec)
      }
      if (
        typeof loaded.ffmpegExportCrf === 'number' &&
        Number.isInteger(loaded.ffmpegExportCrf) &&
        loaded.ffmpegExportCrf >= 0 &&
        loaded.ffmpegExportCrf <= 51
      ) {
        setExportCrf(loaded.ffmpegExportCrf)
      }
      if (
        typeof loaded.ffmpegExportVideoBitrate === 'string' &&
        EXPORT_VIDEO_BITRATES.includes(loaded.ffmpegExportVideoBitrate)
      ) {
        setExportVideoBitrate(loaded.ffmpegExportVideoBitrate)
      }
      if (
        typeof loaded.ffmpegExportAudioBitrate === 'string' &&
        EXPORT_AUDIO_BITRATES.includes(loaded.ffmpegExportAudioBitrate)
      ) {
        setExportAudioBitrate(loaded.ffmpegExportAudioBitrate)
      }
      if (loaded.ffmpegExportAudioMode === 'none') {
        setExportAudioMode('none')
      }
      if (
        typeof loaded.ffmpegExportFps === 'number' &&
        EXPORT_FPS_OPTIONS.includes(loaded.ffmpegExportFps)
      ) {
        setExportFps(loaded.ffmpegExportFps)
      }
      const scale = loaded.ffmpegExportScalePreset
      if (scale === '480p' || scale === '720p' || scale === '1080p') {
        setExportScalePreset(scale)
      }
      if (loaded.ffmpegSnapshotFormat === 'jpg') {
        setSnapshotFormat('jpg')
      }
      cleanupTheme = window.fluxalloy.onThemeChanged((next) => {
        applyTheme(next)
      })
    })().catch(console.error)

    return (): void => {
      cleanupTheme?.()
    }
  }, [applyTheme])

  useEffect(() => {
    let cancelled = false
    void window.fluxalloy.session.restoreLastSource().then((restored) => {
      if (cancelled || !restored) {
        return
      }
      applyPreview(restored)
    })
    return (): void => {
      cancelled = true
    }
  }, [applyPreview])

  useEffect(() => {
    const path = preview?.path
    if (!path) {
      return
    }
    let cancelled = false
    void window.fluxalloy.preview.probe(path).then((r) => {
      if (cancelled) {
        return
      }
      if (r.ok) {
        setProbeInfo(r)
        setProbeError(null)
      } else {
        setProbeInfo(null)
        setProbeError(r.error)
      }
    })
    return (): void => {
      cancelled = true
    }
  }, [preview?.path])

  useEffect(() => {
    let cancelled = false
    const handle = window.setTimeout(() => {
      if (!cancelled) {
        void refreshEngineUi()
      }
    }, 0)
    return (): void => {
      cancelled = true
      window.clearTimeout(handle)
    }
  }, [refreshEngineUi])

  useEffect(() => {
    if (!enginePathsOpen) {
      return
    }
    void window.fluxalloy.settings.get().then((s) => {
      setEnginePathsDraft({
        ffmpeg: s.engineExecutablePaths?.ffmpeg ?? '',
        ffprobe: s.engineExecutablePaths?.ffprobe ?? '',
        'yt-dlp': s.engineExecutablePaths?.['yt-dlp'] ?? ''
      })
    })
  }, [enginePathsOpen])

  useEffect(() => {
    const offMenu = window.fluxalloy.onOpenEnginePaths(() => {
      setEnginePathsOpen(true)
    })
    const offSynced = window.fluxalloy.onEnginePathsChanged(() => {
      void refreshEngineUi()
    })
    const offAbout = window.fluxalloy.onOpenAbout(() => {
      void window.fluxalloy.about.getInfo().then((info) => {
        setAboutInfo(info)
        setAboutOpen(true)
      })
    })
    return (): void => {
      offMenu()
      offSynced()
      offAbout()
    }
  }, [refreshEngineUi])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent): void {
      if (!e.ctrlKey && !e.metaKey) {
        return
      }
      if (e.key !== 'v' && e.key !== 'V') {
        return
      }
      if (domTargetIsTextField(e.target)) {
        return
      }
      e.preventDefault()
      void window.fluxalloy.clipboard.readText().then((raw) => {
        if (!clipboardLooksLikeDownloadsPayload(raw)) {
          return
        }
        void window.fluxalloy.downloads.openWindow(raw.trim())
      })
    }

    document.addEventListener('keydown', onKeyDown)
    return (): void => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    void window.fluxalloy.engines
      .shouldOfferDownload()
      .then(setEnginesOfferDownload)
      .catch(() => setEnginesOfferDownload(false))
  }, [engineSummary])

  useEffect(() => {
    const offProgress = window.fluxalloy.engines.onDownloadProgress((p) => {
      const pct = typeof p.percent === 'number' && p.percent >= 0 ? `${p.percent}% · ` : ''
      setStatusHint(`${pct}${p.message}`)
    })

    const offExport = window.fluxalloy.export.onProgress((p) => {
      const pct =
        typeof p.percent === 'number' && p.percent >= 0 ? `${Math.round(p.percent)}% · ` : ''
      const spd = typeof p.speed === 'string' && p.speed.trim() !== '' ? `${p.speed.trim()} · ` : ''
      setStatusHint(`Экспорт · ${pct}${spd}${p.message}`)
    })

    const offMenuPreview = window.fluxalloy.onPreviewOpened((payload) => {
      applyPreview(payload)
    })

    return (): void => {
      offProgress()
      offExport()
      offMenuPreview()
    }
  }, [applyPreview])

  function toggleTheme(): void {
    const next = theme === 'dark' ? 'light' : 'dark'
    void window.fluxalloy.settings.setTheme(next)
  }

  async function handleOpenToolbar(): Promise<void> {
    const result = await window.fluxalloy.preview.openFileDialog()
    if (result.ok) {
      applyPreview(result)
    }
  }

  async function handleEnginesDownload(): Promise<void> {
    setEngineDownloadBusy(true)
    setStatusHint('Подготовка загрузки…')
    try {
      const res = await window.fluxalloy.engines.download()
      if (!res.ok) {
        setStatusHint(`Ошибка: ${res.error}`)
        return
      }

      await refreshEngineUi()
      setStatusHint('Движки загружены')
    } catch (error) {
      setStatusHint(error instanceof Error ? error.message : 'Ошибка загрузки')
    } finally {
      setEngineDownloadBusy(false)
    }
  }

  async function handleSaveEnginePaths(): Promise<void> {
    await window.fluxalloy.settings.setEngineExecutablePaths({
      ffmpeg: enginePathsDraft.ffmpeg.trim() || null,
      ffprobe: enginePathsDraft.ffprobe.trim() || null,
      'yt-dlp': enginePathsDraft['yt-dlp'].trim() || null
    })
    await refreshEngineUi()
    setEnginePathsOpen(false)
    setStatusHint('Пути к движкам сохранены')
  }

  async function handlePickEngine(id: EngineId): Promise<void> {
    const picked = await window.fluxalloy.settings.pickEngineExecutable(id)
    if (!picked) {
      return
    }
    setEnginePathsDraft((prev) => ({ ...prev, [id]: picked }))
  }

  async function handleSnapshot(): Promise<void> {
    if (!preview || exportBusy || snapshotBusy) {
      return
    }
    const el = videoRef.current
    const timeSec = el && Number.isFinite(el.currentTime) ? Math.max(0, el.currentTime) : 0
    setLastSnapshotPath(null)
    setSnapshotBusy(true)
    setStatusHint('Снимок кадра…')
    try {
      const res = await window.fluxalloy.preview.snapshotFrame({
        inputPath: preview.path,
        timeSec
      })
      if (res.ok) {
        const savedName = res.path.split(/[\\/]/).pop() || res.path
        setLastSnapshotPath(res.path)
        setStatusHint(`Кадр сохранён: ${savedName}`)
      } else if ('cancelled' in res && res.cancelled) {
        setStatusHint(null)
      } else if ('error' in res) {
        setStatusHint(`Кадр: ${res.error}`)
      } else {
        setStatusHint('Кадр: ошибка')
      }
    } catch (e) {
      setStatusHint(e instanceof Error ? e.message : 'Ошибка снимка')
    } finally {
      setSnapshotBusy(false)
    }
  }

  async function handleExport(): Promise<void> {
    if (!preview || exportBusy || snapshotBusy) {
      return
    }
    setExportBusy(true)
    setLastExportPath(null)
    setStatusHint('Подготовка экспорта…')
    try {
      const trimSnap = trimSnapshotRef.current
      const res = await window.fluxalloy.export.start({
        inputPath: preview.path,
        ...(trimSnap != null ? { trim: trimSnap } : {}),
        probeDurationSec: probeInfo?.durationSec ?? null,
        encodePreset: exportEncodePreset,
        container: exportContainer,
        crf: exportCrf,
        videoBitrate: exportVideoBitrate,
        audioMode: exportAudioMode,
        audioBitrate: exportAudioBitrate,
        fps: exportFps,
        scalePreset: exportScalePreset
      })
      if (res.ok) {
        const savedName = res.path.split(/[\\/]/).pop() || res.path
        setLastExportPath(res.path)
        setStatusHint(`Экспорт завершён: ${savedName}`)
      } else if ('cancelled' in res && res.cancelled) {
        setStatusHint('Экспорт отменён')
      } else if ('error' in res) {
        setStatusHint(`Экспорт: ${res.error}`)
      } else {
        setStatusHint('Экспорт: ошибка')
      }
    } catch (e) {
      setStatusHint(e instanceof Error ? e.message : 'Ошибка экспорта')
    } finally {
      setExportBusy(false)
      setExportCancelBusy(false)
    }
  }

  async function handleCancelExport(): Promise<void> {
    if (!exportBusy || exportCancelBusy) {
      return
    }
    setExportCancelBusy(true)
    setStatusHint('Отмена экспорта…')
    const res = await window.fluxalloy.export.cancel()
    if (!res.ok) {
      setExportCancelBusy(false)
      setStatusHint(`Экспорт: ${res.error}`)
    }
  }

  async function handleOpenLastExport(mode: 'file' | 'folder' | 'preview'): Promise<void> {
    if (!lastExportPath || exportBusy || snapshotBusy) {
      return
    }
    const res = await window.fluxalloy.export.openOutput(lastExportPath, mode)
    if (!res.ok) {
      setStatusHint(`Экспорт: ${res.error}`)
    } else if (mode === 'preview') {
      setStatusHint('Экспорт открыт в превью')
    }
  }

  async function handleCopyLastExportPath(): Promise<void> {
    if (!lastExportPath) {
      return
    }
    const res = await window.fluxalloy.clipboard.writeText(lastExportPath)
    setStatusHint(res.ok ? 'Путь экспорта скопирован' : 'Не удалось скопировать путь экспорта')
  }

  async function handleOpenLastSnapshot(mode: 'file' | 'folder'): Promise<void> {
    if (!lastSnapshotPath || exportBusy || snapshotBusy) {
      return
    }
    const res = await window.fluxalloy.export.openOutput(lastSnapshotPath, mode)
    if (!res.ok) {
      setStatusHint(`Кадр: ${res.error}`)
    }
  }

  async function handleCopyLastSnapshotPath(): Promise<void> {
    if (!lastSnapshotPath) {
      return
    }
    const res = await window.fluxalloy.clipboard.writeText(lastSnapshotPath)
    setStatusHint(res.ok ? 'Путь кадра скопирован' : 'Не удалось скопировать путь кадра')
  }

  async function handlePreviewDrop(files: FileList | null): Promise<void> {
    const file = files?.[0]
    if (!file) {
      return
    }
    const absolutePath = window.fluxalloy.preview.getPathForFile(file)
    const granted = await window.fluxalloy.preview.grantPath(absolutePath)
    if (!granted.ok) {
      setStatusHint(`DnD: ${granted.error}`)
      return
    }
    applyPreview(granted)
  }

  return (
    <div className="app-shell">
      <header className="app-toolbar">
        <div className="app-toolbar-brand">FluxAlloy</div>
        <button
          type="button"
          className="app-btn"
          onClick={() => {
            void window.fluxalloy.downloads.openWindow(downloadsUrl || null)
          }}
          title="Отдельное окно заглушки менеджера загрузок (§4.A)"
        >
          Загрузки yt-dlp
        </button>
        <button
          type="button"
          className="app-btn"
          onClick={() => {
            void handleOpenToolbar()
          }}
          title="Открыть локальный видеофайл"
        >
          Открыть
        </button>
        <button
          type="button"
          className="app-btn"
          disabled={!preview || exportBusy || snapshotBusy}
          onClick={() => {
            void handleSnapshot()
          }}
          title="Сохранить текущий кадр превью в PNG или JPEG (ffmpeg)"
        >
          {snapshotBusy ? 'Кадр…' : 'Кадр'}
        </button>
        <select
          className="app-toolbar-select"
          aria-label="Формат снимка кадра"
          title="Формат для сохранения текущего кадра"
          value={snapshotFormat}
          disabled={exportBusy || snapshotBusy}
          onChange={(e) => {
            const v = e.target.value === 'jpg' ? 'jpg' : 'png'
            setSnapshotFormat(v)
            void window.fluxalloy.settings.setFfmpegSnapshotFormat(v).catch(console.error)
          }}
        >
          {SNAPSHOT_FORMATS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
        {lastSnapshotPath ? (
          <>
            <button
              type="button"
              className="app-btn"
              disabled={exportBusy || snapshotBusy}
              onClick={() => {
                void handleOpenLastSnapshot('file')
              }}
              title="Открыть последний сохранённый кадр"
            >
              Файл кадра
            </button>
            <button
              type="button"
              className="app-btn"
              disabled={exportBusy || snapshotBusy}
              onClick={() => {
                void handleOpenLastSnapshot('folder')
              }}
              title="Показать последний кадр в папке"
            >
              Папка кадра
            </button>
            <button
              type="button"
              className="app-btn"
              disabled={exportBusy || snapshotBusy}
              onClick={() => {
                void handleCopyLastSnapshotPath()
              }}
              title="Скопировать путь последнего сохранённого кадра"
            >
              Копировать кадр
            </button>
          </>
        ) : null}
        <select
          className="app-toolbar-select"
          aria-label="Пресет кодирования экспорта MP4"
          title="Пресет libx264 (CRF и -preset) §7.2"
          value={exportEncodePreset}
          disabled={exportBusy || snapshotBusy}
          onChange={(e) => {
            const v = e.target.value as FfmpegExportEncodePresetId
            setExportEncodePreset(v)
            void window.fluxalloy.settings.setFfmpegExportEncodePreset(v).catch(console.error)
          }}
        >
          {EXPORT_ENCODE_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
        <select
          className="app-toolbar-select"
          aria-label="Video bitrate экспорта"
          title="Если выбран bitrate, он заменяет CRF mode"
          value={exportVideoBitrate === null ? 'crf' : exportVideoBitrate}
          disabled={exportBusy || snapshotBusy}
          onChange={(e) => {
            const raw = e.target.value
            const next = raw === 'crf' ? null : raw
            setExportVideoBitrate(next)
            void window.fluxalloy.settings.setFfmpegExportVideoBitrate(next).catch(console.error)
          }}
        >
          <option value="crf">Видео CRF</option>
          {EXPORT_VIDEO_BITRATES.map((v) => (
            <option key={v} value={v}>
              Video {v}
            </option>
          ))}
        </select>
        <select
          className="app-toolbar-select"
          aria-label="Контейнер экспорта"
          title="Контейнер/расширение экспорта §7.2"
          value={exportContainer}
          disabled={exportBusy || snapshotBusy}
          onChange={(e) => {
            const v = e.target.value as FfmpegExportContainerId
            setExportContainer(v)
            void window.fluxalloy.settings.setFfmpegExportContainer(v).catch(console.error)
          }}
        >
          {EXPORT_CONTAINERS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
        <select
          className="app-toolbar-select"
          aria-label="CRF экспорта"
          title="CRF libx264: меньше = выше качество и больше размер"
          value={exportCrf === null ? 'preset' : String(exportCrf)}
          disabled={exportBusy || snapshotBusy}
          onChange={(e) => {
            const raw = e.target.value
            const next = raw === 'preset' ? null : Number(raw)
            setExportCrf(next)
            void window.fluxalloy.settings.setFfmpegExportCrf(next).catch(console.error)
          }}
        >
          <option value="preset">CRF пресета</option>
          {EXPORT_CRF_OPTIONS.map((v) => (
            <option key={v} value={v}>
              CRF {v}
            </option>
          ))}
        </select>
        <select
          className="app-toolbar-select"
          aria-label="Режим аудио экспорта"
          title="AAC audio или экспорт без аудиодорожки"
          value={exportAudioMode}
          disabled={exportBusy || snapshotBusy}
          onChange={(e) => {
            const v = e.target.value === 'none' ? 'none' : 'aac'
            setExportAudioMode(v)
            void window.fluxalloy.settings.setFfmpegExportAudioMode(v).catch(console.error)
          }}
        >
          {EXPORT_AUDIO_MODES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
        <select
          className="app-toolbar-select"
          aria-label="Аудио bitrate экспорта"
          title="Битрейт AAC audio"
          value={exportAudioBitrate}
          disabled={exportBusy || snapshotBusy || exportAudioMode === 'none'}
          onChange={(e) => {
            const v = e.target.value
            setExportAudioBitrate(v)
            void window.fluxalloy.settings.setFfmpegExportAudioBitrate(v).catch(console.error)
          }}
        >
          {EXPORT_AUDIO_BITRATES.map((v) => (
            <option key={v} value={v}>
              AAC {v}
            </option>
          ))}
        </select>
        <select
          className="app-toolbar-select"
          aria-label="FPS экспорта"
          title="Частота кадров вывода"
          value={exportFps === null ? 'source' : String(exportFps)}
          disabled={exportBusy || snapshotBusy}
          onChange={(e) => {
            const raw = e.target.value
            const next = raw === 'source' ? null : Number(raw)
            setExportFps(next)
            void window.fluxalloy.settings.setFfmpegExportFps(next).catch(console.error)
          }}
        >
          <option value="source">FPS исходный</option>
          {EXPORT_FPS_OPTIONS.map((v) => (
            <option key={v} value={v}>
              {v} fps
            </option>
          ))}
        </select>
        <select
          className="app-toolbar-select"
          aria-label="Размер экспорта"
          title="Масштабирование с сохранением пропорций"
          value={exportScalePreset}
          disabled={exportBusy || snapshotBusy}
          onChange={(e) => {
            const v = e.target.value as FfmpegExportScalePresetId
            setExportScalePreset(v)
            void window.fluxalloy.settings.setFfmpegExportScalePreset(v).catch(console.error)
          }}
        >
          {EXPORT_SCALE_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="app-btn app-btn-primary"
          disabled={!preview || exportBusy || snapshotBusy}
          onClick={() => {
            void handleExport()
          }}
          title="Сохранить фрагмент In–Out или весь файл (libx264/aac), нужен ffmpeg"
        >
          {exportBusy ? 'Экспорт…' : 'Экспорт'}
        </button>
        {exportBusy ? (
          <button
            type="button"
            className="app-btn app-btn-warn"
            disabled={exportCancelBusy}
            onClick={() => {
              void handleCancelExport()
            }}
            title="Остановить текущий ffmpeg export"
          >
            {exportCancelBusy ? 'Отмена…' : 'Отменить'}
          </button>
        ) : null}
        {lastExportPath ? (
          <>
            <button
              type="button"
              className="app-btn"
              disabled={exportBusy || snapshotBusy}
              onClick={() => {
                void handleOpenLastExport('file')
              }}
              title="Открыть последний экспортированный файл"
            >
              Файл экспорта
            </button>
            <button
              type="button"
              className="app-btn"
              disabled={exportBusy || snapshotBusy}
              onClick={() => {
                void handleOpenLastExport('folder')
              }}
              title="Показать последний экспорт в папке"
            >
              Папка экспорта
            </button>
            <button
              type="button"
              className="app-btn"
              disabled={exportBusy || snapshotBusy}
              onClick={() => {
                void handleOpenLastExport('preview')
              }}
              title="Открыть последний экспорт в preview FluxAlloy"
            >
              В превью
            </button>
            <button
              type="button"
              className="app-btn"
              disabled={exportBusy || snapshotBusy}
              onClick={() => {
                void handleCopyLastExportPath()
              }}
              title="Скопировать путь последнего результата экспорта"
            >
              Копировать путь
            </button>
          </>
        ) : null}
        {enginesOfferDownload ? (
          <button
            type="button"
            className="app-btn app-btn-warn"
            disabled={engineDownloadBusy}
            onClick={() => {
              void handleEnginesDownload()
            }}
            title="Скачать yt-dlp и FFmpeg в папку приложения пользователя"
          >
            {engineDownloadBusy ? 'Загрузка…' : 'Скачать движки'}
          </button>
        ) : null}
        <div className="app-toolbar-spacer" aria-hidden />
        <button
          type="button"
          className="app-btn"
          onClick={() => {
            setEnginePathsOpen(true)
          }}
          title="Задать исполняемые файлы ffmpeg, ffprobe и yt-dlp вручную"
        >
          Пути движков
        </button>
        <button
          type="button"
          className="app-btn"
          onClick={toggleTheme}
          title="Переключить тёмную/светлую тему"
        >
          Тема: {theme === 'dark' ? 'тёмная' : 'светлая'}
        </button>
      </header>

      <div className="app-url-bar" aria-label="Ссылка для будущего yt-dlp">
        <input
          className="app-url-input"
          type="url"
          inputMode="url"
          placeholder="URL для будущих загрузок (пока только передаётся в окно-заглушку)"
          value={downloadsUrl}
          onChange={(e) => {
            setDownloadsUrl(e.target.value)
          }}
        />
        <button
          type="button"
          className="app-btn"
          onClick={() => {
            void window.fluxalloy.downloads.openWindow(downloadsUrl || null)
          }}
        >
          Открыть окно
        </button>
        <button
          type="button"
          className="app-btn"
          onClick={() => {
            void window.fluxalloy.clipboard.readText().then((t) => {
              setDownloadsUrl(t.trim())
            })
          }}
          title="Вставить текст из буфера обмена в поле URL"
        >
          Из буфера
        </button>
      </div>

      <main className="app-main">
        <section
          className="app-preview"
          aria-label="Область предпросмотра"
          onDragOver={(event) => {
            event.preventDefault()
            event.stopPropagation()
          }}
          onDrop={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void handlePreviewDrop(event.dataTransfer.files)
          }}
        >
          {preview ? (
            <>
              <div className="app-preview-stack">
                <video
                  key={preview.mediaUrl}
                  ref={videoRef}
                  className="app-preview-video"
                  controls
                  src={preview.mediaUrl}
                />
                <VideoTimeline
                  key={preview.mediaUrl}
                  mediaKey={preview.mediaUrl}
                  videoRef={videoRef}
                  onTrimRangeChange={onTrimRangeSnapshot}
                />
                {(probeInfo || probeError) && (
                  <div className="app-preview-probe" aria-live="polite">
                    {probeError ? (
                      <span className="app-preview-probe-error">{probeError}</span>
                    ) : probeInfo ? (
                      <PreviewProbeBody probeInfo={probeInfo} />
                    ) : null}
                  </div>
                )}
                <footer className="app-preview-caption" title={preview.path}>
                  {preview.name}
                </footer>
              </div>
            </>
          ) : (
            <div className="app-preview-placeholder">
              Нет источника — перетащите видеофайл сюда или «Открыть…» в меню «Файл» / кнопка
              сверху.
              <p className="app-preview-hint">
                Локальный файл стримится через защищённую схему fluxmedia — только после выбора или
                DnD по пути из Electron.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="app-statusbar">
        <span>{engineSummaryText(engineSummary)}</span>
        {engineVersionsLine ? (
          <>
            <span className="app-statusbar-sep" aria-hidden />
            <span className="app-statusbar-engines" title={engineVersionsLine}>
              {engineVersionsLine}
            </span>
          </>
        ) : null}
        {statusHint ? (
          <>
            <span className="app-statusbar-sep" aria-hidden />
            <span className="app-statusbar-extra">{statusHint}</span>
          </>
        ) : null}
        <span className="app-statusbar-sep" aria-hidden />
        <Versions />
      </footer>

      {aboutOpen ? (
        <div
          className="app-modal-backdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setAboutOpen(false)
            }
          }}
        >
          <div
            className="app-modal app-modal-narrow"
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-title"
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
          >
            <h2 id="about-title" className="app-modal-title">
              О программе
            </h2>
            {aboutInfo ? (
              <dl className="app-about-dl">
                <div className="app-about-row">
                  <dt>Приложение</dt>
                  <dd>{aboutInfo.appName}</dd>
                </div>
                <div className="app-about-row">
                  <dt>Версия</dt>
                  <dd className="app-about-mono">{aboutInfo.appVersion}</dd>
                </div>
                <div className="app-about-row">
                  <dt>Electron</dt>
                  <dd className="app-about-mono">{aboutInfo.electronVersion}</dd>
                </div>
                <div className="app-about-row">
                  <dt>Chromium</dt>
                  <dd className="app-about-mono">{aboutInfo.chromeVersion}</dd>
                </div>
                <div className="app-about-row">
                  <dt>Node</dt>
                  <dd className="app-about-mono">{aboutInfo.nodeVersion}</dd>
                </div>
              </dl>
            ) : (
              <p className="app-modal-hint">Загрузка…</p>
            )}
            <div className="app-modal-footer">
              <button
                type="button"
                className="app-btn app-btn-primary"
                onClick={() => {
                  setAboutOpen(false)
                }}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {enginePathsOpen ? (
        <div
          className="app-modal-backdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setEnginePathsOpen(false)
            }
          }}
        >
          <div
            className="app-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="engine-paths-title"
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
          >
            <h2 id="engine-paths-title" className="app-modal-title">
              Пути к движкам
            </h2>
            <p className="app-modal-hint">
              Полный путь к каждому исполняемому файлу имеет приоритет над встроенным каталогом и
              загрузкой в userData/bin. Оставьте поле пустым и сохраните — сброс на авто-поиск.
            </p>
            <div className="app-engine-path-rows">
              {ENGINE_IDS.map((id) => (
                <div key={id} className="app-engine-path-row">
                  <label className="app-engine-path-label" htmlFor={`engine-path-${id}`}>
                    {engineLabel(id)}
                  </label>
                  <input
                    id={`engine-path-${id}`}
                    className="app-engine-path-input"
                    type="text"
                    spellCheck={false}
                    placeholder="Авто"
                    value={enginePathsDraft[id]}
                    onChange={(e) => {
                      setEnginePathsDraft((prev) => ({ ...prev, [id]: e.target.value }))
                    }}
                  />
                  <div className="app-engine-path-actions">
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      onClick={() => {
                        void handlePickEngine(id)
                      }}
                    >
                      Выбрать…
                    </button>
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      onClick={() => {
                        setEnginePathsDraft((prev) => ({ ...prev, [id]: '' }))
                      }}
                    >
                      Сбросить
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="app-modal-footer">
              <button
                type="button"
                className="app-btn"
                onClick={() => {
                  setEnginePathsOpen(false)
                }}
              >
                Отмена
              </button>
              <button
                type="button"
                className="app-btn app-btn-primary"
                onClick={() => {
                  void handleSaveEnginePaths()
                }}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
