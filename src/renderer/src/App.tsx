import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { JSX } from 'react'

import VideoTimeline from './components/VideoTimeline'
import Versions from './components/Versions'
import {
  IconBan,
  IconCircleHelp,
  IconCloudDownload,
  IconDownload,
  IconFilm,
  IconFolderOpen,
  IconImage,
  IconMoon,
  IconSave,
  IconSettings,
  IconSun
} from './components/LucideMiniIcons'
import type { EngineId } from '../../shared/engine-contract'
import { ENGINE_IDS } from '../../shared/engine-contract'
import type {
  FfmpegExportAudioModeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportScalePresetId,
  FfmpegExportUserPreset,
  FfmpegExportUserPresetSnapshot,
  FfmpegExportVideoTransformId
} from '../../shared/ffmpeg-export-contract'
import type {
  AppSettings,
  MainWindowUiPanelState,
  ResolvedAppTheme
} from '../../shared/settings-contract'
import { buildFfmpegExportPreviewCommand } from '../../shared/ffmpeg-export-argv'
import type { FfmpegSnapshotFormatId } from '../../shared/ffmpeg-snapshot-contract'
import type { RestoredSourceInfo } from '../../shared/preview-dialog-contract'
import type { MediaProbeSuccess } from '../../shared/ffprobe-contract'
import { PreviewProbeBody } from './components/MediaProbePanel'
type Theme = ResolvedAppTheme

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
const EXPORT_VIDEO_TRANSFORMS: Array<{ id: FfmpegExportVideoTransformId; label: string }> = [
  { id: 'none', label: 'Поворот: нет' },
  { id: 'cw90', label: '↻ 90°' },
  { id: 'ccw90', label: '↺ 90°' },
  { id: 'r180', label: '180°' },
  { id: 'hflip', label: 'Зеркало H' },
  { id: 'vflip', label: 'Зеркало V' }
]
const EXPORT_CROP_PRESETS: Array<{ id: FfmpegExportCropPresetId; label: string }> = [
  { id: 'none', label: 'Crop: нет' },
  { id: 'center-square', label: 'Crop 1:1' },
  { id: 'center-16-9', label: 'Crop 16:9' },
  { id: 'center-4-3', label: 'Crop 4:3' }
]
const SNAPSHOT_FORMATS: Array<{ id: FfmpegSnapshotFormatId; label: string }> = [
  { id: 'png', label: 'Кадр PNG' },
  { id: 'jpg', label: 'Кадр JPEG' }
]

/** §4.1 / v0 — дефолты раскрытых секций FFmpeg, если в settings ещё не сохранено. */
const MAIN_PANEL_DEFAULTS: Required<MainWindowUiPanelState> = {
  quickYtdlp: false,
  ffmpegVideo: true,
  ffmpegFormat: true,
  ffmpegAudio: false,
  ffmpegPresets: false,
  ffmpegOutput: true,
  exportCommandPreview: true,
  probeExportSummary: false,
  probeTracks: false,
  probeChapters: false,
  probeRawJson: false
}

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
  const [exportVideoTransform, setExportVideoTransform] =
    useState<FfmpegExportVideoTransformId>('none')
  const [exportCropPreset, setExportCropPreset] = useState<FfmpegExportCropPresetId>('none')
  const [mainUiPanels, setMainUiPanels] = useState<MainWindowUiPanelState>(MAIN_PANEL_DEFAULTS)
  const [exportScalePreset, setExportScalePreset] = useState<FfmpegExportScalePresetId>('source')
  /** §7.2 — сохранённые пользователем наборы параметров тулбара (preview/spawn используют те же поля). */
  const [exportUserPresets, setExportUserPresets] = useState<FfmpegExportUserPreset[]>([])
  /** Выбранный в `<select>` пользовательский пресет; ручные правки тулбара сбрасывают выбор. */
  const [selectedUserPresetId, setSelectedUserPresetId] = useState<string | null>(null)
  const [lastExportPath, setLastExportPath] = useState<string | null>(null)
  const [lastSnapshotPath, setLastSnapshotPath] = useState<string | null>(null)
  const [snapshotFormat, setSnapshotFormat] = useState<FfmpegSnapshotFormatId>('png')
  const [snapshotBusy, setSnapshotBusy] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  /** Последний диапазон In/Out с таймлайна для IPC экспорта. */
  const trimSnapshotRef = useRef<{ inSec: number; outSec: number } | null>(null)
  /**
   * Состояние таймлайна для preview команды ffmpeg.
   * `path` хранится рядом, чтобы при смене источника `trimRange` ниже выводился как `null`
   * без synchronous `setState` в `useEffect` — таймлайн сам пришлёт новый диапазон, когда
   * у нового файла появится длительность (см. `VideoTimeline.markerGeometry`).
   */
  const [trimState, setTrimState] = useState<{
    path: string | null
    range: { inSec: number; outSec: number } | null
  }>({ path: null, range: null })
  const currentSourcePath = preview?.path ?? null
  const trimRange = trimState.path === currentSourcePath ? trimState.range : null

  const applyPreview = useCallback((payload: PreviewOpenedPayload): void => {
    setProbeInfo(null)
    setProbeError(null)
    setPreview(payload)
  }, [])

  const onTrimRangeSnapshot = useCallback(
    (range: { inSec: number; outSec: number }) => {
      trimSnapshotRef.current = range
      setTrimState((prev) => {
        if (
          prev.path === currentSourcePath &&
          prev.range !== null &&
          Math.abs(prev.range.inSec - range.inSec) < 1e-3 &&
          Math.abs(prev.range.outSec - range.outSec) < 1e-3
        ) {
          return prev
        }
        return { path: currentSourcePath, range: { inSec: range.inSec, outSec: range.outSec } }
      })
    },
    [currentSourcePath]
  )

  useEffect(() => {
    trimSnapshotRef.current = null
  }, [currentSourcePath])

  const applyTheme = useCallback((value: Theme) => {
    document.documentElement.dataset['theme'] = value
    setTheme(value)
  }, [])

  const hydrateExportFieldsFromSettings = useCallback((loaded: AppSettings) => {
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
    } else {
      setExportCrf(null)
    }
    if (
      typeof loaded.ffmpegExportVideoBitrate === 'string' &&
      EXPORT_VIDEO_BITRATES.includes(loaded.ffmpegExportVideoBitrate)
    ) {
      setExportVideoBitrate(loaded.ffmpegExportVideoBitrate)
    } else {
      setExportVideoBitrate(null)
    }
    if (
      typeof loaded.ffmpegExportAudioBitrate === 'string' &&
      EXPORT_AUDIO_BITRATES.includes(loaded.ffmpegExportAudioBitrate)
    ) {
      setExportAudioBitrate(loaded.ffmpegExportAudioBitrate)
    }
    if (loaded.ffmpegExportAudioMode === 'none') {
      setExportAudioMode('none')
    } else {
      setExportAudioMode('aac')
    }
    if (
      typeof loaded.ffmpegExportFps === 'number' &&
      EXPORT_FPS_OPTIONS.includes(loaded.ffmpegExportFps)
    ) {
      setExportFps(loaded.ffmpegExportFps)
    } else {
      setExportFps(null)
    }
    const vt = loaded.ffmpegExportVideoTransform
    if (vt === 'cw90' || vt === 'ccw90' || vt === 'r180' || vt === 'hflip' || vt === 'vflip') {
      setExportVideoTransform(vt)
    } else {
      setExportVideoTransform('none')
    }
    const crop = loaded.ffmpegExportCropPreset
    if (crop === 'center-square' || crop === 'center-16-9' || crop === 'center-4-3') {
      setExportCropPreset(crop)
    } else {
      setExportCropPreset('none')
    }
    const scale = loaded.ffmpegExportScalePreset
    if (scale === '480p' || scale === '720p' || scale === '1080p') {
      setExportScalePreset(scale)
    } else {
      setExportScalePreset('source')
    }
  }, [])

  const bumpManualExportEdit = useCallback(() => {
    setSelectedUserPresetId(null)
  }, [])

  type MainPanelKey = keyof typeof MAIN_PANEL_DEFAULTS

  const panelOpen = useCallback(
    (key: MainPanelKey): boolean => {
      const v = mainUiPanels[key]
      return typeof v === 'boolean' ? v : MAIN_PANEL_DEFAULTS[key]
    },
    [mainUiPanels]
  )

  const persistPanelToggle = useCallback((key: MainPanelKey, nextOpen: boolean): void => {
    setMainUiPanels((p) => ({ ...p, [key]: nextOpen }))
    void window.fluxalloy.settings.mergeMainWindowUiPanels({ [key]: nextOpen }).catch(console.error)
  }, [])

  const buildCurrentExportSnapshot = useCallback((): FfmpegExportUserPresetSnapshot => {
    return {
      encodePreset: exportEncodePreset,
      container: exportContainer,
      crf: exportCrf,
      videoBitrate: exportVideoBitrate,
      audioMode: exportAudioMode,
      audioBitrate: exportAudioBitrate,
      fps: exportFps,
      scalePreset: exportScalePreset,
      videoTransform: exportVideoTransform,
      cropPreset: exportCropPreset
    }
  }, [
    exportEncodePreset,
    exportContainer,
    exportCrf,
    exportVideoBitrate,
    exportAudioMode,
    exportAudioBitrate,
    exportFps,
    exportScalePreset,
    exportVideoTransform,
    exportCropPreset
  ])

  const handleSaveExportUserPreset = useCallback(() => {
    const label = window.prompt('Имя пользовательского пресета', 'Мой пресет')
    if (label === null) {
      return
    }
    const t = label.trim()
    if (t.length === 0) {
      return
    }
    const snap = buildCurrentExportSnapshot()
    const id = crypto.randomUUID()
    const next = [...exportUserPresets, { id, label: t.slice(0, 64), snapshot: snap }]
    if (next.length > 8) {
      window.alert('Не более 8 пользовательских пресетов.')
      return
    }
    void window.fluxalloy.settings
      .setFfmpegExportUserPresets(next)
      .then((s) => {
        setExportUserPresets(s.ffmpegExportUserPresets ?? [])
        setSelectedUserPresetId(id)
      })
      .catch(console.error)
  }, [buildCurrentExportSnapshot, exportUserPresets])

  const handleDeleteExportUserPreset = useCallback(() => {
    if (!selectedUserPresetId) {
      return
    }
    const next = exportUserPresets.filter((p) => p.id !== selectedUserPresetId)
    void window.fluxalloy.settings
      .setFfmpegExportUserPresets(next)
      .then((s) => {
        setExportUserPresets(s.ffmpegExportUserPresets ?? [])
        setSelectedUserPresetId(null)
      })
      .catch(console.error)
  }, [exportUserPresets, selectedUserPresetId])

  const handleRenameExportUserPreset = useCallback(() => {
    if (!selectedUserPresetId) {
      return
    }
    const current = exportUserPresets.find((p) => p.id === selectedUserPresetId)
    if (!current) {
      return
    }
    const label = window.prompt('Новое имя пресета', current.label)
    if (label === null) {
      return
    }
    const t = label.trim()
    if (t.length === 0) {
      return
    }
    const next = exportUserPresets.map((p) =>
      p.id === selectedUserPresetId ? { ...p, label: t.slice(0, 64) } : p
    )
    void window.fluxalloy.settings
      .setFfmpegExportUserPresets(next)
      .then((s) => {
        setExportUserPresets(s.ffmpegExportUserPresets ?? [])
      })
      .catch(console.error)
  }, [exportUserPresets, selectedUserPresetId])

  const handleOverwriteExportUserPreset = useCallback(() => {
    if (!selectedUserPresetId) {
      return
    }
    const snap = buildCurrentExportSnapshot()
    const next = exportUserPresets.map((p) =>
      p.id === selectedUserPresetId ? { ...p, snapshot: snap } : p
    )
    void window.fluxalloy.settings
      .setFfmpegExportUserPresets(next)
      .then((s) => {
        setExportUserPresets(s.ffmpegExportUserPresets ?? [])
      })
      .catch(console.error)
  }, [buildCurrentExportSnapshot, exportUserPresets, selectedUserPresetId])

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
    let cleanupUiPanels: (() => void) | undefined
    void (async () => {
      const loaded = await window.fluxalloy.settings.get()
      applyTheme(loaded.effectiveTheme)
      hydrateExportFieldsFromSettings(loaded)
      setMainUiPanels({ ...MAIN_PANEL_DEFAULTS, ...(loaded.mainWindowUiPanels ?? {}) })
      setExportUserPresets(loaded.ffmpegExportUserPresets ?? [])
      if (loaded.ffmpegSnapshotFormat === 'jpg') {
        setSnapshotFormat('jpg')
      }
      cleanupTheme = window.fluxalloy.onThemeChanged((next) => {
        applyTheme(next)
      })
      cleanupUiPanels = window.fluxalloy.onMainWindowUiPanelsChanged((panels) => {
        setMainUiPanels({ ...MAIN_PANEL_DEFAULTS, ...(panels ?? {}) })
      })
    })().catch(console.error)

    return (): void => {
      cleanupTheme?.()
      cleanupUiPanels?.()
    }
  }, [applyTheme, hydrateExportFieldsFromSettings])

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

  async function toggleTheme(): Promise<void> {
    const s = await window.fluxalloy.settings.get()
    if (s.theme === 'system') {
      void window.fluxalloy.settings.setTheme(s.effectiveTheme === 'dark' ? 'light' : 'dark')
    } else {
      void window.fluxalloy.settings.setTheme(s.theme === 'dark' ? 'light' : 'dark')
    }
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
        scalePreset: exportScalePreset,
        videoTransform: exportVideoTransform,
        cropPreset: exportCropPreset
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

  /**
   * §7.2 — live preview команды ffmpeg для текущих параметров toolbar и таймлайна.
   * Сборка argv и решение про `-ss/-t` лежат в `src/shared/ffmpeg-export-argv.ts`
   * (`buildFfmpegExportPreviewCommand` + `shouldApplyFfmpegExportTrim`),
   * чтобы превью совпадало с тем, что пошло бы в реальный spawn `runFfmpegExportJob`.
   */
  const exportPreview = useMemo(() => {
    const sourcePath = preview?.path ?? null
    let outputPath: string | null = null
    if (sourcePath !== null) {
      const stem = sourcePath.replace(/\.[^.]+$/, '')
      outputPath = `${stem}-export.${exportContainer}`
    }
    return buildFfmpegExportPreviewCommand({
      encodePreset: exportEncodePreset,
      container: exportContainer,
      crf: exportCrf,
      videoBitrate: exportVideoBitrate,
      audioMode: exportAudioMode,
      audioBitrate: exportAudioBitrate,
      fps: exportFps,
      scalePreset: exportScalePreset,
      videoTransform: exportVideoTransform,
      cropPreset: exportCropPreset,
      inputPath: sourcePath,
      outputPath,
      trim: trimRange,
      probeDurationSec: probeInfo?.durationSec ?? null
    })
  }, [
    preview?.path,
    exportEncodePreset,
    exportContainer,
    exportCrf,
    exportVideoBitrate,
    exportAudioMode,
    exportAudioBitrate,
    exportFps,
    exportScalePreset,
    exportVideoTransform,
    exportCropPreset,
    trimRange,
    probeInfo?.durationSec
  ])

  const exportPreviewCommand = exportPreview.command

  function exportPreviewHint(): string {
    if (!preview) {
      return 'Источник не выбран — в превью используются плейсхолдеры <input>/<output>.'
    }
    if (exportPreview.appliedTrim && trimRange !== null) {
      const span = Math.max(0, trimRange.outSec - trimRange.inSec)
      return `Маркеры In/Out подставлены: -ss ${trimRange.inSec.toFixed(2)} -t ${span.toFixed(2)}.`
    }
    if (trimRange !== null && probeInfo?.durationSec) {
      return 'Маркеры покрывают почти весь файл — ffmpeg запустится без -ss/-t.'
    }
    return 'Маркеры In/Out появятся, как только таймлайн сообщит диапазон.'
  }

  async function handleCopyExportPreview(): Promise<void> {
    const r = await window.fluxalloy.clipboard.writeText(exportPreviewCommand)
    setStatusHint(r.ok ? 'Команда ffmpeg скопирована' : 'Не удалось скопировать команду ffmpeg')
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
      <header className="app-topbar">
        <div className="app-topbar-brand" aria-label="FluxAlloy">
          <span className="app-topbar-mark" aria-hidden>
            ◇
          </span>
          <span className="app-topbar-title">FluxAlloy</span>
          <span className="app-topbar-version">desktop</span>
        </div>
        <nav className="app-workspace-tabs" aria-label="Рабочие вкладки">
          <button type="button" className="app-workspace-tab app-workspace-tab-active">
            Редактор
          </button>
          <button
            type="button"
            className="app-workspace-tab"
            onClick={() => {
              void window.fluxalloy.downloads.openWindow(downloadsUrl || null)
            }}
            title="Открыть менеджер загрузок yt-dlp"
          >
            <span aria-hidden className="app-workspace-tab-glyph">
              <IconDownload title="" size={16} />
            </span>
            Загрузки
          </button>
        </nav>
        <div className="app-topbar-actions">
          <button
            type="button"
            className="app-icon-btn"
            onClick={() => {
              void handleOpenToolbar()
            }}
            title="Открыть локальный видеофайл"
          >
            <IconFolderOpen />
            <span className="app-visually-hidden">Открыть</span>
          </button>
          <button
            type="button"
            className="app-icon-btn"
            onClick={() => {
              void window.fluxalloy.inspector.openWindow(preview?.path ?? null)
            }}
            title="Отдельное окно инспектора ffprobe (§9). Если файл открыт в превью — сразу подставится его путь."
          >
            <IconFilm />
            <span className="app-visually-hidden">Инспектор</span>
          </button>
          <button
            type="button"
            className="app-icon-btn"
            disabled={!preview || exportBusy || snapshotBusy}
            onClick={() => {
              void handleSnapshot()
            }}
            title="Сохранить текущий кадр превью в PNG или JPEG (ffmpeg)"
          >
            <IconImage />
            <span className="app-visually-hidden">{snapshotBusy ? 'Кадр…' : 'Кадр'}</span>
          </button>
          <button
            type="button"
            className="app-icon-btn app-icon-btn-primary"
            disabled={!preview || exportBusy || snapshotBusy}
            onClick={() => {
              void handleExport()
            }}
            title="Сохранить фрагмент In–Out или весь файл (libx264/aac), нужен ffmpeg"
          >
            <IconSave />
            <span className="app-visually-hidden">{exportBusy ? 'Экспорт…' : 'Экспорт'}</span>
          </button>
          {exportBusy ? (
            <button
              type="button"
              className="app-icon-btn app-icon-btn-warn"
              disabled={exportCancelBusy}
              onClick={() => {
                void handleCancelExport()
              }}
              title="Остановить текущий ffmpeg export"
            >
              <IconBan title={exportCancelBusy ? 'Отмена…' : 'Отменить экспорт'} />
            </button>
          ) : null}
          {enginesOfferDownload ? (
            <button
              type="button"
              className="app-icon-btn app-icon-btn-warn"
              disabled={engineDownloadBusy}
              onClick={() => {
                void handleEnginesDownload()
              }}
              title="Скачать yt-dlp и FFmpeg в папку приложения пользователя"
            >
              <IconCloudDownload title={engineDownloadBusy ? 'Загрузка…' : 'Скачать движки'} />
            </button>
          ) : null}
          <button
            type="button"
            className="app-icon-btn"
            onClick={() => {
              setEnginePathsOpen(true)
            }}
            title="Задать исполняемые файлы ffmpeg, ffprobe и yt-dlp вручную"
          >
            <IconSettings />
            <span className="app-visually-hidden">Пути к движкам</span>
          </button>
          <button
            type="button"
            className="app-icon-btn"
            onClick={() => {
              void window.fluxalloy.about.getInfo().then((info) => {
                setAboutInfo(info)
                setAboutOpen(true)
              })
            }}
            title="О программе и диагностика"
          >
            <IconCircleHelp />
            <span className="app-visually-hidden">О программе</span>
          </button>
          <button
            type="button"
            className="app-icon-btn"
            onClick={toggleTheme}
            title="Переключить тёмную/светлую тему"
          >
            {theme === 'dark' ? <IconSun /> : <IconMoon />}
            <span className="app-visually-hidden">
              {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
            </span>
          </button>
        </div>
      </header>

      <details
        className="app-url-bar"
        aria-label="Быстрая загрузка yt-dlp"
        open={panelOpen('quickYtdlp')}
        onToggle={(e) => {
          persistPanelToggle('quickYtdlp', e.currentTarget.open)
        }}
      >
        <summary className="app-url-summary">Быстрая загрузка yt-dlp</summary>
        <div className="app-url-body">
          <input
            className="app-url-input"
            type="url"
            inputMode="url"
            placeholder="URL или список URL — передать в менеджер загрузок"
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
      </details>

      <main className="app-main app-workbench">
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
                      <PreviewProbeBody
                        probeInfo={probeInfo}
                        mediaPathForDefaultSave={preview.path}
                        probeSectionOpen={{
                          exportSummary: panelOpen('probeExportSummary'),
                          tracks: panelOpen('probeTracks'),
                          chapters: panelOpen('probeChapters'),
                          rawJson: panelOpen('probeRawJson')
                        }}
                        onProbeSectionToggle={(key, nextOpen) => {
                          const m = {
                            exportSummary: 'probeExportSummary',
                            tracks: 'probeTracks',
                            chapters: 'probeChapters',
                            rawJson: 'probeRawJson'
                          } as const
                          persistPanelToggle(m[key], nextOpen)
                        }}
                      />
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
        <aside className="app-settings-panel" aria-label="Настройки FFmpeg">
          <div className="app-settings-panel-head">
            <div>
              <h2 className="app-settings-title">Настройки FFmpeg</h2>
              <p className="app-settings-subtitle">Секции можно сворачивать, как в референсе v0.</p>
            </div>
            <span className="app-settings-badge">{exportContainer.toUpperCase()}</span>
          </div>

          <details
            className="app-settings-section"
            open={panelOpen('ffmpegVideo')}
            onToggle={(e) => {
              persistPanelToggle('ffmpegVideo', e.currentTarget.open)
            }}
          >
            <summary className="app-settings-summary">Видео</summary>
            <div className="app-settings-grid">
              <label className="app-field">
                <span>Кодек / пресет</span>
                <select
                  className="app-control"
                  aria-label="Пресет кодирования экспорта MP4"
                  value={exportEncodePreset}
                  disabled={exportBusy || snapshotBusy}
                  onChange={(e) => {
                    bumpManualExportEdit()
                    const v = e.target.value as FfmpegExportEncodePresetId
                    setExportEncodePreset(v)
                    void window.fluxalloy.settings
                      .setFfmpegExportEncodePreset(v)
                      .catch(console.error)
                  }}
                >
                  {EXPORT_ENCODE_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="app-field">
                <span>Контейнер</span>
                <select
                  className="app-control"
                  aria-label="Контейнер экспорта"
                  value={exportContainer}
                  disabled={exportBusy || snapshotBusy}
                  onChange={(e) => {
                    bumpManualExportEdit()
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
              </label>
              <label className="app-field">
                <span>CRF</span>
                <select
                  className="app-control"
                  aria-label="CRF экспорта"
                  value={exportCrf === null ? 'preset' : String(exportCrf)}
                  disabled={exportBusy || snapshotBusy}
                  onChange={(e) => {
                    bumpManualExportEdit()
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
              </label>
              <label className="app-field">
                <span>Bitrate</span>
                <select
                  className="app-control"
                  aria-label="Video bitrate экспорта"
                  value={exportVideoBitrate === null ? 'crf' : exportVideoBitrate}
                  disabled={exportBusy || snapshotBusy}
                  onChange={(e) => {
                    bumpManualExportEdit()
                    const raw = e.target.value
                    const next = raw === 'crf' ? null : raw
                    setExportVideoBitrate(next)
                    void window.fluxalloy.settings
                      .setFfmpegExportVideoBitrate(next)
                      .catch(console.error)
                  }}
                >
                  <option value="crf">Видео CRF</option>
                  {EXPORT_VIDEO_BITRATES.map((v) => (
                    <option key={v} value={v}>
                      Video {v}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </details>

          <details
            className="app-settings-section"
            open={panelOpen('ffmpegFormat')}
            onToggle={(e) => {
              persistPanelToggle('ffmpegFormat', e.currentTarget.open)
            }}
          >
            <summary className="app-settings-summary">Формат</summary>
            <div className="app-settings-grid">
              <label className="app-field">
                <span>Разрешение</span>
                <select
                  className="app-control"
                  aria-label="Размер экспорта"
                  value={exportScalePreset}
                  disabled={exportBusy || snapshotBusy}
                  onChange={(e) => {
                    bumpManualExportEdit()
                    const v = e.target.value as FfmpegExportScalePresetId
                    setExportScalePreset(v)
                    void window.fluxalloy.settings
                      .setFfmpegExportScalePreset(v)
                      .catch(console.error)
                  }}
                >
                  {EXPORT_SCALE_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="app-field">
                <span>FPS</span>
                <select
                  className="app-control"
                  aria-label="FPS экспорта"
                  value={exportFps === null ? 'source' : String(exportFps)}
                  disabled={exportBusy || snapshotBusy}
                  onChange={(e) => {
                    bumpManualExportEdit()
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
              </label>
              <label className="app-field">
                <span>Поворот</span>
                <select
                  className="app-control"
                  aria-label="Поворот или зеркало экспорта"
                  value={exportVideoTransform}
                  disabled={exportBusy || snapshotBusy}
                  onChange={(e) => {
                    bumpManualExportEdit()
                    const v = e.target.value as FfmpegExportVideoTransformId
                    setExportVideoTransform(v)
                    void window.fluxalloy.settings
                      .setFfmpegExportVideoTransform(v)
                      .catch(console.error)
                  }}
                >
                  {EXPORT_VIDEO_TRANSFORMS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="app-field">
                <span>Crop</span>
                <select
                  className="app-control"
                  aria-label="Crop экспорта"
                  value={exportCropPreset}
                  disabled={exportBusy || snapshotBusy}
                  onChange={(e) => {
                    bumpManualExportEdit()
                    const v = e.target.value as FfmpegExportCropPresetId
                    setExportCropPreset(v)
                    void window.fluxalloy.settings.setFfmpegExportCropPreset(v).catch(console.error)
                  }}
                >
                  {EXPORT_CROP_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </details>

          <details
            className="app-settings-section"
            open={panelOpen('ffmpegAudio')}
            onToggle={(e) => {
              persistPanelToggle('ffmpegAudio', e.currentTarget.open)
            }}
          >
            <summary className="app-settings-summary">Аудио и кадр</summary>
            <div className="app-settings-grid">
              <label className="app-field">
                <span>Аудио</span>
                <select
                  className="app-control"
                  aria-label="Режим аудио экспорта"
                  value={exportAudioMode}
                  disabled={exportBusy || snapshotBusy}
                  onChange={(e) => {
                    bumpManualExportEdit()
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
              </label>
              <label className="app-field">
                <span>AAC bitrate</span>
                <select
                  className="app-control"
                  aria-label="Аудио bitrate экспорта"
                  value={exportAudioBitrate}
                  disabled={exportBusy || snapshotBusy || exportAudioMode === 'none'}
                  onChange={(e) => {
                    bumpManualExportEdit()
                    const v = e.target.value
                    setExportAudioBitrate(v)
                    void window.fluxalloy.settings
                      .setFfmpegExportAudioBitrate(v)
                      .catch(console.error)
                  }}
                >
                  {EXPORT_AUDIO_BITRATES.map((v) => (
                    <option key={v} value={v}>
                      AAC {v}
                    </option>
                  ))}
                </select>
              </label>
              <label className="app-field">
                <span>Формат кадра</span>
                <select
                  className="app-control"
                  aria-label="Формат снимка кадра"
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
              </label>
            </div>
            {lastSnapshotPath ? (
              <div className="app-settings-actions">
                <button
                  type="button"
                  className="app-btn app-btn-compact"
                  disabled={exportBusy || snapshotBusy}
                  onClick={() => {
                    void handleOpenLastSnapshot('file')
                  }}
                >
                  Файл кадра
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-compact"
                  disabled={exportBusy || snapshotBusy}
                  onClick={() => {
                    void handleOpenLastSnapshot('folder')
                  }}
                >
                  Папка
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-compact"
                  disabled={exportBusy || snapshotBusy}
                  onClick={() => {
                    void handleCopyLastSnapshotPath()
                  }}
                >
                  Копировать
                </button>
              </div>
            ) : null}
          </details>

          <details
            className="app-settings-section"
            open={panelOpen('ffmpegPresets')}
            onToggle={(e) => {
              persistPanelToggle('ffmpegPresets', e.currentTarget.open)
            }}
          >
            <summary className="app-settings-summary">Пресеты</summary>
            <div className="app-settings-stack">
              <label className="app-field">
                <span>Пользовательский пресет</span>
                <select
                  className="app-control"
                  aria-label="Пользовательский пресет экспорта"
                  value={selectedUserPresetId ?? ''}
                  disabled={exportBusy || snapshotBusy}
                  onChange={(e) => {
                    const v = e.target.value
                    if (v === '') {
                      setSelectedUserPresetId(null)
                      return
                    }
                    const preset = exportUserPresets.find((p) => p.id === v)
                    if (!preset) {
                      return
                    }
                    void window.fluxalloy.settings
                      .applyFfmpegExportSnapshot(preset.snapshot)
                      .then((s) => {
                        hydrateExportFieldsFromSettings(s)
                        setSelectedUserPresetId(v)
                      })
                      .catch(console.error)
                  }}
                >
                  <option value="">Пресет: —</option>
                  {exportUserPresets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="app-settings-actions">
                <button
                  type="button"
                  className="app-btn app-btn-compact"
                  disabled={exportBusy || snapshotBusy}
                  onClick={() => {
                    handleSaveExportUserPreset()
                  }}
                >
                  + Пресет
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-compact"
                  disabled={exportBusy || snapshotBusy || !selectedUserPresetId}
                  onClick={() => {
                    handleRenameExportUserPreset()
                  }}
                >
                  Имя
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-compact"
                  disabled={exportBusy || snapshotBusy || !selectedUserPresetId}
                  onClick={() => {
                    handleOverwriteExportUserPreset()
                  }}
                >
                  Обновить
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-compact"
                  disabled={exportBusy || snapshotBusy || !selectedUserPresetId}
                  onClick={() => {
                    handleDeleteExportUserPreset()
                  }}
                >
                  Удалить
                </button>
              </div>
            </div>
          </details>

          <details
            className="app-settings-section"
            open={panelOpen('ffmpegOutput')}
            onToggle={(e) => {
              persistPanelToggle('ffmpegOutput', e.currentTarget.open)
            }}
          >
            <summary className="app-settings-summary">Вывод</summary>
            <div className="app-settings-stack">
              <details
                className="app-export-preview app-export-preview-nested"
                open={panelOpen('exportCommandPreview')}
                onToggle={(e) => {
                  persistPanelToggle('exportCommandPreview', e.currentTarget.open)
                }}
              >
                <summary className="app-export-preview-summary">Превью команды ffmpeg</summary>
                <div className="app-export-preview-body">
                  <pre className="app-export-preview-pre" aria-label="Команда ffmpeg">
                    {exportPreviewCommand}
                  </pre>
                  <div className="app-export-preview-actions">
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      onClick={() => {
                        void handleCopyExportPreview()
                      }}
                      title="Скопировать строку команды ffmpeg в буфер"
                    >
                      Копировать
                    </button>
                    <span className="app-export-preview-hint">{exportPreviewHint()}</span>
                  </div>
                </div>
              </details>
              {lastExportPath ? (
                <div className="app-settings-actions">
                  <button
                    type="button"
                    className="app-btn app-btn-compact"
                    disabled={exportBusy || snapshotBusy}
                    onClick={() => {
                      void handleOpenLastExport('file')
                    }}
                  >
                    Файл
                  </button>
                  <button
                    type="button"
                    className="app-btn app-btn-compact"
                    disabled={exportBusy || snapshotBusy}
                    onClick={() => {
                      void handleOpenLastExport('folder')
                    }}
                  >
                    Папка
                  </button>
                  <button
                    type="button"
                    className="app-btn app-btn-compact"
                    disabled={exportBusy || snapshotBusy}
                    onClick={() => {
                      void handleOpenLastExport('preview')
                    }}
                  >
                    В превью
                  </button>
                  <button
                    type="button"
                    className="app-btn app-btn-compact"
                    disabled={exportBusy || snapshotBusy}
                    onClick={() => {
                      void handleCopyLastExportPath()
                    }}
                  >
                    Копировать путь
                  </button>
                </div>
              ) : null}
            </div>
          </details>
        </aside>
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
            <div className="app-modal-footer app-modal-footer-split">
              <div className="app-about-diagnostics">
                <button
                  type="button"
                  className="app-btn app-btn-compact"
                  onClick={() => {
                    void window.fluxalloy.diagnostics.openFolder('logs').then((r) => {
                      if (!r.ok) {
                        setStatusHint(`Папка логов: ${r.error}`)
                      }
                    })
                  }}
                >
                  Папка логов
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-compact"
                  onClick={() => {
                    void window.fluxalloy.diagnostics.openMainLog().then((r) => {
                      if (!r.ok) {
                        setStatusHint(`main.log: ${r.error}`)
                      }
                    })
                  }}
                >
                  main.log
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-compact"
                  onClick={() => {
                    void window.fluxalloy.diagnostics.createSupportZip().then((r) => {
                      if (r.ok) {
                        setStatusHint('Support ZIP сохранён')
                      } else if ('error' in r) {
                        setStatusHint(`Support ZIP: ${r.error}`)
                      }
                    })
                  }}
                >
                  Support ZIP…
                </button>
              </div>
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
