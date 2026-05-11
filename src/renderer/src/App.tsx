import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { JSX, SyntheticEvent } from 'react'

import { AboutDialog } from './components/AboutDialog'
import VideoTimeline from './components/VideoTimeline'
import PreviewTransport from './components/PreviewTransport'
import Versions from './components/Versions'
import {
  IconBan,
  IconChevronLeft,
  IconChevronRight,
  IconCircleHelp,
  IconCloudDownload,
  IconDownload,
  IconFilm,
  IconFolderOpen,
  IconImage,
  IconMoon,
  IconPauseUi,
  IconPlay,
  IconQueueChevronDown,
  IconQueueChevronUp,
  IconQueueFile,
  IconQueueOutbound,
  IconQueueRetry,
  IconQueueTrash,
  IconRotateCcw,
  IconRotateCw,
  IconSave,
  IconScissors,
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
  DownloadsWindowUiPanelState,
  MainWindowUiPanelState,
  ResolvedAppTheme
} from '../../shared/settings-contract'
import { buildFfmpegExportPreviewCommand } from '../../shared/ffmpeg-export-argv'
import {
  YTDLP_DOC_FORMAT_SELECTION,
  YTDLP_DOC_OUTPUT_TEMPLATE,
  YTDLP_DOC_POSTPROCESS,
  YTDLP_DOC_README
} from '../../shared/external-doc-urls'
import type { FfmpegSnapshotFormatId } from '../../shared/ffmpeg-snapshot-contract'
import type { RestoredSourceInfo } from '../../shared/preview-dialog-contract'
import type { MediaProbeSuccess } from '../../shared/ffprobe-contract'
import type {
  YtdlpCommandHintEntry,
  YtdlpCookiesBrowserId,
  YtdlpDownloadOptionsPatch,
  YtdlpDownloadOptionsPayload,
  YtdlpFormatPresetId,
  YtdlpImpersonateId,
  YtdlpQueueRetryProfileId,
  YtdlpSubtitlePresetId
} from '../../shared/ytdlp-download-contract'
import type { YtdlpDownloadHistoryEntry } from '../../shared/ytdlp-history-contract'
import type { DownloadsLogPayload } from '../../shared/downloads-log-contract'
import { PreviewProbeBody } from './components/MediaProbePanel'
type Theme = ResolvedAppTheme

type PreviewOpenedPayload = RestoredSourceInfo
type EngineSummary = 'checking' | 'ready' | 'missing' | 'error'
type WorkspaceTab = 'editor' | 'downloads'
type ExportPresetNameDialog = {
  mode: 'create' | 'rename'
  value: string
  error: string | null
} | null
type DownloadsQueueRowView = {
  id: number
  url: string
  shortLabel: string
  progress: string
  status: string
  outputPath?: string
  queueFmt?: string
  queueSize?: string
  queueSpeed?: string
  queueEta?: string
  isActiveRunner?: boolean
  ytdlpPauseSupported?: boolean
  ytdlpPaused?: boolean
}
type DownloadsStatusFilter = 'all' | 'running' | 'done' | 'error' | 'cancelled'
type DownloadsQueueStats = {
  total: number
  running: number
  done: number
  error: number
  cancelled: number
  pending: number
}
type DownloadsLogLineView = {
  id: number
  rowId: number
  stream: 'stdout' | 'stderr'
  text: string
}

type EnginesSnapshot = Awaited<ReturnType<typeof window.fluxalloy.engines.getStatus>>

type PillSwitchProps = {
  label: string
  checked: boolean
  disabled?: boolean
  describedBy?: string
  onToggle: () => void
}

function PillSwitch({
  label,
  checked,
  disabled = false,
  describedBy,
  onToggle
}: PillSwitchProps): JSX.Element {
  return (
    <button
      type="button"
      className={`app-pill-switch${checked ? ' app-pill-switch-on' : ''}`}
      role="switch"
      aria-label={label}
      aria-checked={checked}
      aria-describedby={describedBy}
      disabled={disabled}
      onClick={onToggle}
    >
      <span className="app-pill-switch-knob" aria-hidden />
      <span className="app-pill-switch-text">{checked ? 'Вкл' : 'Выкл'}</span>
    </button>
  )
}

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
const EXPORT_AUDIO_BITRATES = ['96k', '128k', '160k', '192k', '256k', '320k']
const EXPORT_FPS_OPTIONS = [24, 25, 30, 50, 60]
const DOWNLOADS_STATUS_FILTERS: Array<{ id: DownloadsStatusFilter; label: string }> = [
  { id: 'all', label: 'Все' },
  { id: 'running', label: 'В работе' },
  { id: 'done', label: 'Готово' },
  { id: 'error', label: 'Ошибки' },
  { id: 'cancelled', label: 'Отмена' }
]
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
  { id: 'none', label: 'Обрезка: нет' },
  { id: 'center-square', label: 'Обрезка 1:1' },
  { id: 'center-16-9', label: 'Обрезка 16:9' },
  { id: 'center-4-3', label: 'Обрезка 4:3' }
]
const SNAPSHOT_FORMATS: Array<{ id: FfmpegSnapshotFormatId; label: string }> = [
  { id: 'png', label: 'Кадр PNG' },
  { id: 'jpg', label: 'Кадр JPEG' }
]

/** §4.1 / v0 — дефолты раскрытых секций FFmpeg, если в settings ещё не сохранено. */
const MAIN_PANEL_DEFAULTS: Required<MainWindowUiPanelState> = {
  ffmpegSettingsRailOpen: true,
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

/** Короткая подпись для топбара v0 (`ffmpeg 6.x • yt-dlp 2024.x`) рядом с icon-кластером. */
function shortEngineVersionSnippet(id: EngineId, raw: string | null): string {
  if (!raw || raw.trim().length === 0) {
    return '—'
  }
  const line = raw.split(/\r?\n/)[0]?.trim() ?? raw.trim()
  if (id === 'ffmpeg') {
    const mm = /ffmpeg\s+version\s+([^\s,]+)/i.exec(line)
    if (mm?.[1]) {
      return mm[1]
    }
  }
  if (id === 'yt-dlp') {
    const mm = /\byt-dlp\s+([^\s]+)/i.exec(line)
    if (mm?.[1]) {
      return mm[1]
    }
    const headToken = line.split(/\s+/)[0]
    if (headToken && /^[\d.]+$/.test(headToken)) {
      return headToken
    }
  }
  return line.length > 20 ? `${line.slice(0, 18)}…` : line
}

function formatTopbarEngineVersionsLine(snapshot: EnginesSnapshot): string {
  const ffmpeg = snapshot.engines.ffmpeg
  const ytdlp = snapshot.engines['yt-dlp']
  const fv =
    ffmpeg.state === 'ready' && ffmpeg.version
      ? shortEngineVersionSnippet('ffmpeg', ffmpeg.version)
      : '—'
  const yv =
    ytdlp.state === 'ready' && ytdlp.version
      ? shortEngineVersionSnippet('yt-dlp', ytdlp.version)
      : '—'
  return `ffmpeg ${fv} • yt-dlp ${yv}`
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

function basenameForAriaLabel(absPath: string): string {
  const n = absPath.replace(/\\/g, '/')
  const i = n.lastIndexOf('/')
  return i >= 0 ? n.slice(i + 1) : n
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

function sanitizeDownloadsRows(raw: unknown[]): DownloadsQueueRowView[] {
  return raw.flatMap((item): DownloadsQueueRowView[] => {
    if (!item || typeof item !== 'object') {
      return []
    }
    const o = item as Record<string, unknown>
    if (typeof o['id'] !== 'number' || typeof o['url'] !== 'string') {
      return []
    }
    return [
      {
        id: o['id'],
        url: o['url'],
        shortLabel: typeof o['shortLabel'] === 'string' ? o['shortLabel'] : o['url'],
        progress: typeof o['progress'] === 'string' ? o['progress'] : '—',
        status: typeof o['status'] === 'string' ? o['status'] : '—',
        ...(typeof o['outputPath'] === 'string' ? { outputPath: o['outputPath'] } : {}),
        ...(typeof o['queueFmt'] === 'string' ? { queueFmt: o['queueFmt'] } : {}),
        ...(typeof o['queueSize'] === 'string' ? { queueSize: o['queueSize'] } : {}),
        ...(typeof o['queueSpeed'] === 'string' ? { queueSpeed: o['queueSpeed'] } : {}),
        ...(typeof o['queueEta'] === 'string' ? { queueEta: o['queueEta'] } : {}),
        ...(typeof o['isActiveRunner'] === 'boolean'
          ? { isActiveRunner: o['isActiveRunner'] }
          : {}),
        ...(typeof o['ytdlpPauseSupported'] === 'boolean'
          ? { ytdlpPauseSupported: o['ytdlpPauseSupported'] }
          : {}),
        ...(typeof o['ytdlpPaused'] === 'boolean' ? { ytdlpPaused: o['ytdlpPaused'] } : {})
      }
    ]
  })
}

function downloadsRowMatchesStatus(
  row: DownloadsQueueRowView,
  filter: DownloadsStatusFilter
): boolean {
  if (filter === 'all') {
    return true
  }
  if (filter === 'running') {
    return row.status === 'Загрузка…' || row.status.startsWith('Пауза перед повтором')
  }
  if (filter === 'done') {
    return row.status === 'Готово'
  }
  if (filter === 'error') {
    return row.status.startsWith('Ошибка')
  }
  return row.status === 'Отменено'
}

function summarizeDownloadsRows(rows: DownloadsQueueRowView[]): DownloadsQueueStats {
  return rows.reduce<DownloadsQueueStats>(
    (acc, row) => {
      acc.total += 1
      if (downloadsRowMatchesStatus(row, 'running')) {
        acc.running += 1
      } else if (downloadsRowMatchesStatus(row, 'done')) {
        acc.done += 1
      } else if (downloadsRowMatchesStatus(row, 'error')) {
        acc.error += 1
      } else if (downloadsRowMatchesStatus(row, 'cancelled')) {
        acc.cancelled += 1
      } else {
        acc.pending += 1
      }
      return acc
    },
    { total: 0, running: 0, done: 0, error: 0, cancelled: 0, pending: 0 }
  )
}

function parseDownloadsProgressPercent(raw: string): number | null {
  const match = raw.match(/(\d+(?:[.,]\d+)?)\s*%/)
  if (!match?.[1]) {
    return null
  }
  const n = Number(match[1].replace(',', '.'))
  if (!Number.isFinite(n)) {
    return null
  }
  return Math.max(0, Math.min(100, n))
}

function downloadsStatusTone(row: DownloadsQueueRowView): string {
  if (downloadsRowMatchesStatus(row, 'running')) {
    return 'running'
  }
  if (downloadsRowMatchesStatus(row, 'done')) {
    return 'done'
  }
  if (downloadsRowMatchesStatus(row, 'error')) {
    return 'error'
  }
  if (downloadsRowMatchesStatus(row, 'cancelled')) {
    return 'cancelled'
  }
  return 'pending'
}

function formatDownloadsHistoryTime(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) {
    return '—'
  }
  return new Date(ms).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function downloadsHistoryOutcomeLabel(outcome: YtdlpDownloadHistoryEntry['outcome']): string {
  if (outcome === 'success') {
    return 'Готово'
  }
  if (outcome === 'cancelled') {
    return 'Отмена'
  }
  return 'Ошибка'
}

function formatDownloadsLogText(lines: DownloadsLogLineView[]): string {
  return lines.map((line) => `[${line.rowId}] ${line.stream}: ${line.text}`).join('\n')
}

/**
 * §4.A/§6: в `downloadsWindowUiPanels` пишется только явный boolean; без ключа —
 * как «раскрыто» (совпадает с default pop-out через `openAttr`).
 */
function downloadsPanelOpenFromSettings(saved: boolean | undefined): boolean {
  return saved !== false
}

/** Как `openAttr` в `downloads-window.ts`: без ключа в settings — `defaultOpen`. */
function downloadsRailSectionOpen(
  saved: DownloadsWindowUiPanelState | undefined,
  key: keyof DownloadsWindowUiPanelState,
  defaultOpen: boolean
): boolean {
  const v = saved?.[key]
  return typeof v === 'boolean' ? v : defaultOpen
}

type DownloadsRailPanelKey = 'format' | 'metadata' | 'saving' | 'network' | 'expert'

type DownloadsRailPanelsState = Record<DownloadsRailPanelKey, boolean>

const DOWNLOADS_RAIL_PANEL_DEFAULTS: DownloadsRailPanelsState = {
  format: true,
  metadata: true,
  saving: true,
  network: false,
  expert: false
}

function App(): JSX.Element {
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('editor')
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
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null)
  const [probeInfo, setProbeInfo] = useState<MediaProbeSuccess | null>(null)
  const [probeError, setProbeError] = useState<string | null>(null)
  const [downloadsUrl, setDownloadsUrl] = useState('')
  const [downloadsRows, setDownloadsRows] = useState<DownloadsQueueRowView[]>([])
  const [downloadsStatusFilter, setDownloadsStatusFilter] = useState<DownloadsStatusFilter>('all')
  const [downloadsOptions, setDownloadsOptions] = useState<YtdlpDownloadOptionsPayload | null>(null)
  const [downloadsOptionsBusy, setDownloadsOptionsBusy] = useState(false)
  const [downloadsExpertHintPickerSeq, setDownloadsExpertHintPickerSeq] = useState(0)
  const [downloadsHistory, setDownloadsHistory] = useState<YtdlpDownloadHistoryEntry[]>([])
  const [downloadsHistoryBusy, setDownloadsHistoryBusy] = useState(false)
  const [downloadsLogLines, setDownloadsLogLines] = useState<DownloadsLogLineView[]>([])
  const [downloadsLogTargetRowId, setDownloadsLogTargetRowId] = useState<number | null>(null)
  const [downloadsOutputDirectory, setDownloadsOutputDirectory] = useState<{
    path: string
    isDefault: boolean
  } | null>(null)
  const [downloadsEmbeddedHistoryOpen, setDownloadsEmbeddedHistoryOpen] = useState(true)
  const [downloadsEmbeddedLogOpen, setDownloadsEmbeddedLogOpen] = useState(true)
  const [downloadsRailPanels, setDownloadsRailPanels] = useState<DownloadsRailPanelsState>(
    DOWNLOADS_RAIL_PANEL_DEFAULTS
  )
  const [engineVersionsLine, setEngineVersionsLine] = useState('')
  const [topbarEngineVersionsLine, setTopbarEngineVersionsLine] = useState('')
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
  /** §7.2 / v0 — двухпроходный libx264 только вместе с выбранным видеобитрейтом. */
  const [exportTwoPass, setExportTwoPass] = useState(false)
  /** §7.2 — сохранённые пользователем наборы параметров тулбара (preview/spawn используют те же поля). */
  const [exportUserPresets, setExportUserPresets] = useState<FfmpegExportUserPreset[]>([])
  /** Выбранный в `<select>` пользовательский пресет; ручные правки тулбара сбрасывают выбор. */
  const [selectedUserPresetId, setSelectedUserPresetId] = useState<string | null>(null)
  const [exportPresetNameDialog, setExportPresetNameDialog] = useState<ExportPresetNameDialog>(null)
  const [lastExportPath, setLastExportPath] = useState<string | null>(null)
  const [lastSnapshotPath, setLastSnapshotPath] = useState<string | null>(null)
  const [snapshotFormat, setSnapshotFormat] = useState<FfmpegSnapshotFormatId>('png')
  const [snapshotBusy, setSnapshotBusy] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  /** Стек видео+транспорт+таймлайн: цель fullscreen по референсу v0. */
  const previewStackRef = useRef<HTMLDivElement>(null)
  const downloadsLogNextIdRef = useRef(1)
  /** Последний диапазон In/Out с таймлайна для IPC экспорта, привязанный к текущему файлу. */
  const trimSnapshotRef = useRef<{
    path: string | null
    range: { inSec: number; outSec: number }
  } | null>(null)
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
  const previewPlaybackUrl = previewBlobUrl ?? preview?.mediaUrl ?? null
  const trimRange = trimState.path === currentSourcePath ? trimState.range : null
  const downloadsStats = useMemo(() => summarizeDownloadsRows(downloadsRows), [downloadsRows])
  const visibleDownloadsRows = useMemo(
    () => downloadsRows.filter((row) => downloadsRowMatchesStatus(row, downloadsStatusFilter)),
    [downloadsRows, downloadsStatusFilter]
  )

  const refreshDownloadsOptions = useCallback(async (): Promise<void> => {
    const res = await window.fluxalloy.downloads.getCliOptions()
    if (res.ok) {
      setDownloadsOptions(res.payload)
      return
    }
    setStatusHint(res.error)
  }, [])

  const applyDownloadsOptionsPatch = useCallback(
    async (patch: YtdlpDownloadOptionsPatch): Promise<void> => {
      setDownloadsOptionsBusy(true)
      try {
        const res = await window.fluxalloy.downloads.setCliOptions(patch)
        if (!res.ok) {
          setStatusHint(res.error)
          return
        }
        await refreshDownloadsOptions()
      } finally {
        setDownloadsOptionsBusy(false)
      }
    },
    [refreshDownloadsOptions]
  )

  const ytdlpCommandHintsByCategory = useMemo(() => {
    const hints = downloadsOptions?.commandHints
    if (!hints?.length) return [] as Array<[string, YtdlpCommandHintEntry[]]>
    const m = new Map<string, YtdlpCommandHintEntry[]>()
    for (const h of hints) {
      const list = m.get(h.category) ?? []
      list.push(h)
      m.set(h.category, list)
    }
    return [...m.entries()].sort(([a], [b]) => a.localeCompare(b, 'ru'))
  }, [downloadsOptions?.commandHints])

  const refreshDownloadsHistory = useCallback(async (): Promise<void> => {
    setDownloadsHistoryBusy(true)
    try {
      const rows = await window.fluxalloy.downloads.getHistory()
      setDownloadsHistory(rows)
    } finally {
      setDownloadsHistoryBusy(false)
    }
  }, [])

  const persistDownloadsWindowUiPanels = useCallback(
    (patch: Partial<DownloadsWindowUiPanelState>): void => {
      void window.fluxalloy.downloads.mergeUiPanels(patch).then((res) => {
        if (!res.ok) {
          console.error(res.error)
        }
      })
    },
    []
  )

  const handleDownloadsRailSectionToggle = useCallback(
    (key: DownloadsRailPanelKey) => {
      return (e: SyntheticEvent<HTMLDetailsElement>): void => {
        const open = e.currentTarget.open
        setDownloadsRailPanels((prev) => ({ ...prev, [key]: open }))
        persistDownloadsWindowUiPanels({ [key]: open })
      }
    },
    [persistDownloadsWindowUiPanels]
  )

  const hydrateDownloadsWindowUiPanelsFromSnapshot = useCallback(
    (dwp: DownloadsWindowUiPanelState | undefined): void => {
      setDownloadsEmbeddedHistoryOpen(downloadsPanelOpenFromSettings(dwp?.history))
      setDownloadsEmbeddedLogOpen(downloadsPanelOpenFromSettings(dwp?.log))
      setDownloadsRailPanels({
        format: downloadsRailSectionOpen(dwp, 'format', DOWNLOADS_RAIL_PANEL_DEFAULTS.format),
        metadata: downloadsRailSectionOpen(dwp, 'metadata', DOWNLOADS_RAIL_PANEL_DEFAULTS.metadata),
        saving: downloadsRailSectionOpen(dwp, 'saving', DOWNLOADS_RAIL_PANEL_DEFAULTS.saving),
        network: downloadsRailSectionOpen(dwp, 'network', DOWNLOADS_RAIL_PANEL_DEFAULTS.network),
        expert: downloadsRailSectionOpen(dwp, 'expert', DOWNLOADS_RAIL_PANEL_DEFAULTS.expert)
      })
    },
    []
  )

  const handleDownloadsLogPayload = useCallback((payload: DownloadsLogPayload): void => {
    if (payload.kind === 'reset') {
      setDownloadsLogTargetRowId(payload.rowId)
      setDownloadsLogLines([])
      return
    }
    setDownloadsLogTargetRowId(payload.rowId)
    setDownloadsLogLines((prev) => {
      const nextId = downloadsLogNextIdRef.current++
      const next = [
        ...prev,
        { id: nextId, rowId: payload.rowId, stream: payload.stream, text: payload.text }
      ]
      return next.length > 420 ? next.slice(next.length - 420) : next
    })
  }, [])

  const refreshDownloadsOutputDirectory = useCallback(async (): Promise<void> => {
    const dir = await window.fluxalloy.downloads.getOutputDirectory()
    setDownloadsOutputDirectory(dir)
  }, [])

  const applyPreview = useCallback((payload: PreviewOpenedPayload): void => {
    setProbeInfo(null)
    setProbeError(null)
    setPreview(payload)
    setWorkspaceTab('editor')
  }, [])

  const handlePreviewVideoError = useCallback(
    (video: HTMLVideoElement): void => {
      if (!preview) {
        return
      }
      const mediaError = video.error
      const code = mediaError?.code ?? 0
      const detail =
        code === 1
          ? 'загрузка отменена'
          : code === 2
            ? 'сетевая ошибка'
            : code === 3
              ? 'ошибка декодирования'
              : code === 4
                ? 'формат не поддерживается'
                : 'неизвестная ошибка'
      window.fluxalloy.log.send({
        level: 'error',
        scope: 'preview/video',
        message: `video element error code=${code} detail=${detail} path=${preview.path} mediaUrl=${preview.mediaUrl} playbackUrl=${previewBlobUrl ?? preview.mediaUrl}`
      })
      if (previewBlobUrl) {
        setStatusHint(`Видео не удалось воспроизвести: ${detail}`)
        return
      }

      setStatusHint('Видео не открылось напрямую, пробую безопасный blob-fallback…')
      void fetch(preview.mediaUrl)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }
          const blob = await response.blob()
          const blobUrl = URL.createObjectURL(blob)
          setPreviewBlobUrl((current) => {
            if (current) {
              URL.revokeObjectURL(current)
            }
            return blobUrl
          })
          setStatusHint('Видео переключено на blob-fallback для предпросмотра.')
          window.fluxalloy.log.send({
            level: 'info',
            scope: 'preview/video',
            message: `blob fallback ready size=${blob.size} type=${blob.type || 'unknown'} path=${preview.path}`
          })
        })
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : String(error)
          setStatusHint(`Видео не удалось воспроизвести: ${detail}; fallback тоже не сработал.`)
          window.fluxalloy.log.send({
            level: 'error',
            scope: 'preview/video',
            message: `blob fallback failed error=${message} path=${preview.path} mediaUrl=${preview.mediaUrl}`
          })
        })
    },
    [preview, previewBlobUrl]
  )

  const handlePreviewVideoLoaded = useCallback(
    (video: HTMLVideoElement): void => {
      if (!preview) {
        return
      }
      window.fluxalloy.log.send({
        level: 'info',
        scope: 'preview/video',
        message: `video metadata loaded duration=${video.duration || 0} size=${video.videoWidth}x${video.videoHeight} path=${preview.path} playbackUrl=${previewBlobUrl ?? preview.mediaUrl}`
      })
    },
    [preview, previewBlobUrl]
  )

  const handleAddDownloadsFromMain = useCallback(
    async (startImmediately: boolean): Promise<void> => {
      const text = downloadsUrl.trim()
      if (text.length === 0) {
        setWorkspaceTab('downloads')
        return
      }
      const addRes = await window.fluxalloy.downloads.addLines(text)
      setWorkspaceTab('downloads')
      if (!addRes.ok) {
        setStatusHint(addRes.error)
        return
      }
      const added = addRes.added
      setStatusHint(added > 0 ? `Добавлено URL: ${added}` : 'Не нашёл URL для очереди.')
      if (added > 0) {
        setDownloadsUrl('')
      }
      if (startImmediately && added > 0) {
        const res = await window.fluxalloy.downloads.startQueue()
        if (!res.ok) {
          setStatusHint(res.error)
        }
      }
    },
    [downloadsUrl]
  )

  const onTrimRangeSnapshot = useCallback(
    (range: { inSec: number; outSec: number }) => {
      trimSnapshotRef.current = { path: currentSourcePath, range }
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
    let mounted = true
    void window.fluxalloy.downloads.getSnapshot().then((rows) => {
      if (mounted) {
        setDownloadsRows(sanitizeDownloadsRows(rows))
      }
    })
    const unsubscribe = window.fluxalloy.downloads.onSnapshot((rows) => {
      setDownloadsRows(sanitizeDownloadsRows(rows))
    })
    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    let mounted = true
    void window.fluxalloy.downloads.getCliOptions().then((res) => {
      if (!mounted) {
        return
      }
      if (res.ok) {
        setDownloadsOptions(res.payload)
        return
      }
      setStatusHint(res.error)
    })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true
    void window.fluxalloy.downloads.getHistory().then((rows) => {
      if (mounted) {
        setDownloadsHistory(rows)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    return window.fluxalloy.downloads.onLog(handleDownloadsLogPayload)
  }, [handleDownloadsLogPayload])

  useEffect(() => {
    void window.fluxalloy.downloads.getOutputDirectory().then((dir) => {
      setDownloadsOutputDirectory(dir)
    })
  }, [])

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
    const bitrateOk =
      typeof loaded.ffmpegExportVideoBitrate === 'string' &&
      EXPORT_VIDEO_BITRATES.includes(loaded.ffmpegExportVideoBitrate)
    setExportTwoPass(loaded.ffmpegExportTwoPass === true && bitrateOk)
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

  const cycleVideoTransformTopbar = useCallback(
    (dir: -1 | 1): void => {
      if (exportBusy || snapshotBusy) {
        return
      }
      bumpManualExportEdit()
      const order: FfmpegExportVideoTransformId[] = ['none', 'ccw90', 'r180', 'cw90']
      const i = order.indexOf(exportVideoTransform)
      const base = i >= 0 ? i : 0
      const next = (base + dir + order.length * 16) % order.length
      const v = order[next] ?? 'none'
      setExportVideoTransform(v)
      void window.fluxalloy.settings.setFfmpegExportVideoTransform(v).catch(console.error)
    },
    [bumpManualExportEdit, exportBusy, exportVideoTransform, snapshotBusy]
  )

  const cycleCropPresetTopbar = useCallback((): void => {
    if (exportBusy || snapshotBusy) {
      return
    }
    bumpManualExportEdit()
    const order: FfmpegExportCropPresetId[] = ['none', 'center-square', 'center-16-9', 'center-4-3']
    const i = order.indexOf(exportCropPreset)
    const base = i >= 0 ? i : 0
    const next = order[(base + 1) % order.length] ?? 'none'
    setExportCropPreset(next)
    void window.fluxalloy.settings.setFfmpegExportCropPreset(next).catch(console.error)
  }, [bumpManualExportEdit, exportBusy, exportCropPreset, snapshotBusy])

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
      cropPreset: exportCropPreset,
      ...(exportTwoPass ? { twoPass: true as const } : {})
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
    exportCropPreset,
    exportTwoPass
  ])

  const handleSaveExportUserPreset = useCallback(() => {
    if (exportUserPresets.length >= 8) {
      setStatusHint('Не более 8 пользовательских пресетов.')
      return
    }
    setExportPresetNameDialog({ mode: 'create', value: 'Мой пресет', error: null })
  }, [exportUserPresets.length])

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
    setExportPresetNameDialog({ mode: 'rename', value: current.label, error: null })
  }, [exportUserPresets, selectedUserPresetId])

  const handleSubmitExportPresetName = useCallback(() => {
    if (!exportPresetNameDialog) {
      return
    }
    const label = exportPresetNameDialog.value.trim()
    if (label.length === 0) {
      setExportPresetNameDialog((prev) =>
        prev === null ? null : { ...prev, error: 'Введите имя пресета.' }
      )
      return
    }
    const safeLabel = label.slice(0, 64)
    if (exportPresetNameDialog.mode === 'create') {
      if (exportUserPresets.length >= 8) {
        setExportPresetNameDialog((prev) =>
          prev === null ? null : { ...prev, error: 'Не более 8 пользовательских пресетов.' }
        )
        return
      }
      const id = crypto.randomUUID()
      const next = [
        ...exportUserPresets,
        { id, label: safeLabel, snapshot: buildCurrentExportSnapshot() }
      ]
      void window.fluxalloy.settings
        .setFfmpegExportUserPresets(next)
        .then((s) => {
          setExportUserPresets(s.ffmpegExportUserPresets ?? [])
          setSelectedUserPresetId(id)
          setExportPresetNameDialog(null)
        })
        .catch(console.error)
      return
    }

    if (!selectedUserPresetId) {
      setExportPresetNameDialog(null)
      return
    }
    const next = exportUserPresets.map((p) =>
      p.id === selectedUserPresetId ? { ...p, label: safeLabel } : p
    )
    void window.fluxalloy.settings
      .setFfmpegExportUserPresets(next)
      .then((s) => {
        setExportUserPresets(s.ffmpegExportUserPresets ?? [])
        setExportPresetNameDialog(null)
      })
      .catch(console.error)
  }, [buildCurrentExportSnapshot, exportPresetNameDialog, exportUserPresets, selectedUserPresetId])

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
      setTopbarEngineVersionsLine(formatTopbarEngineVersionsLine(snapshot))
      const need = await window.fluxalloy.engines.shouldOfferDownload()
      setEnginesOfferDownload(need)
    } catch {
      setEngineSummary('error')
      setEngineVersionsLine('')
      setTopbarEngineVersionsLine('')
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
      hydrateDownloadsWindowUiPanelsFromSnapshot(loaded.downloadsWindowUiPanels)
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
  }, [applyTheme, hydrateDownloadsWindowUiPanelsFromSnapshot, hydrateExportFieldsFromSettings])

  useEffect(() => {
    const off = window.fluxalloy.downloads.onDownloadsWindowUiPanelsChanged((panels) => {
      hydrateDownloadsWindowUiPanelsFromSnapshot(panels)
    })
    return off
  }, [hydrateDownloadsWindowUiPanelsFromSnapshot])

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
    queueMicrotask(() => {
      setPreviewBlobUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current)
        }
        return null
      })
    })
  }, [preview?.mediaUrl])

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

  async function handleClearDownloadedEngines(): Promise<void> {
    setStatusHint('Удаляю скачанные движки из userData/bin…')
    try {
      const res = await window.fluxalloy.engines.clearUserBin()
      if (!res.ok) {
        setStatusHint(`Ошибка: ${res.error}`)
        return
      }
      await refreshEngineUi()
      setStatusHint(
        res.removed > 0
          ? `Удалено скачанных движков: ${res.removed}`
          : 'Скачанных движков в userData/bin не было'
      )
    } catch (error) {
      setStatusHint(error instanceof Error ? error.message : 'Не удалось удалить скачанные движки')
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
      const trimSnap =
        trimSnapshotRef.current?.path === preview.path ? trimSnapshotRef.current.range : null
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
        cropPreset: exportCropPreset,
        twoPass: exportTwoPass
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
      twoPass: exportTwoPass && exportVideoBitrate !== null,
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
    exportTwoPass,
    trimRange,
    probeInfo?.durationSec
  ])

  const exportPreviewCommand = exportPreview.command

  function exportPreviewHint(): string {
    if (!preview) {
      return 'Источник не выбран — в превью используются плейсхолдеры <input>/<output>.'
    }
    if (exportPreview.pass1Command) {
      return 'Двухпроход: исходящий файл формирует только вторая команда; для passlog см. временный каталог в main.'
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
    const text = exportPreview.pass1Command
      ? `${exportPreview.pass1Command}\n\n${exportPreviewCommand}`
      : exportPreviewCommand
    const r = await window.fluxalloy.clipboard.writeText(text)
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
          <button
            type="button"
            className={`app-workspace-tab${workspaceTab === 'editor' ? ' app-workspace-tab-active' : ''}`}
            aria-current={workspaceTab === 'editor' ? 'page' : undefined}
            onClick={() => {
              setWorkspaceTab('editor')
            }}
          >
            Редактор
          </button>
          <button
            type="button"
            className={`app-workspace-tab${workspaceTab === 'downloads' ? ' app-workspace-tab-active' : ''}`}
            aria-current={workspaceTab === 'downloads' ? 'page' : undefined}
            onClick={() => {
              setWorkspaceTab('downloads')
            }}
            title="Перейти во вкладку загрузок yt-dlp"
          >
            <span aria-hidden className="app-workspace-tab-glyph">
              <IconDownload title="" size={16} />
            </span>
            Загрузки
          </button>
        </nav>
        <div className="app-topbar-trailing">
          {topbarEngineVersionsLine.length > 0 ? (
            <p className="app-topbar-engine-short" title={engineVersionsLine}>
              {topbarEngineVersionsLine}
            </p>
          ) : null}
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
              disabled={exportBusy || snapshotBusy}
              onClick={() => {
                cycleVideoTransformTopbar(-1)
              }}
              title="Поворот против часовой: none → 90° CCW → 180° → 90° CW (экспорт §7.2)"
            >
              <IconRotateCcw />
              <span className="app-visually-hidden">Поворот CCW</span>
            </button>
            <button
              type="button"
              className="app-icon-btn"
              disabled={exportBusy || snapshotBusy}
              onClick={() => {
                cycleVideoTransformTopbar(1)
              }}
              title="Поворот по часовой: none → 90° CW → 180° → 90° CCW (экспорт §7.2)"
            >
              <IconRotateCw />
              <span className="app-visually-hidden">Поворот CW</span>
            </button>
            <button
              type="button"
              className="app-icon-btn"
              disabled={exportBusy || snapshotBusy}
              onClick={() => {
                cycleCropPresetTopbar()
              }}
              title="Обрезка: нет → 1:1 → 16:9 → 4:3 (экспорт §7.2)"
            >
              <IconScissors />
              <span className="app-visually-hidden">Обрезка</span>
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
        </div>
      </header>

      {workspaceTab === 'editor' ? (
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
            <div className="app-url-field">
              <input
                className="app-url-input"
                type="url"
                inputMode="url"
                placeholder="URL или список URL — передать в менеджер загрузок"
                aria-describedby="quickYtdlpUrlHint"
                value={downloadsUrl}
                onChange={(e) => {
                  setDownloadsUrl(e.target.value)
                }}
              />
              <p id="quickYtdlpUrlHint" className="app-url-hint">
                Ссылка добавляется во вкладку «Загрузки»; несколько URL — по строкам.
              </p>
              <p className="app-doc-inline-links app-url-bar-doc-links">
                <a href={YTDLP_DOC_README} target="_blank" rel="noreferrer">
                  yt-dlp README
                </a>
                {' · '}
                <a href={YTDLP_DOC_FORMAT_SELECTION} target="_blank" rel="noreferrer">
                  Форматы
                </a>
                {' · '}
                <a href={YTDLP_DOC_OUTPUT_TEMPLATE} target="_blank" rel="noreferrer">
                  Шаблон -o
                </a>
              </p>
            </div>
            <button
              type="button"
              className="app-btn"
              aria-describedby="quickYtdlpUrlHint"
              onClick={() => {
                void handleAddDownloadsFromMain(false)
              }}
            >
              Во вкладку
            </button>
            <button
              type="button"
              className="app-btn"
              aria-describedby="quickYtdlpUrlHint"
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
      ) : null}

      {workspaceTab === 'editor' ? (
        <main
          className={`app-main app-workbench${panelOpen('ffmpegSettingsRailOpen') ? '' : ' app-workbench-ffmpeg-collapsed'}`}
        >
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
                <div className="app-preview-stack" ref={previewStackRef}>
                  <video
                    key={previewPlaybackUrl ?? preview.mediaUrl}
                    ref={videoRef}
                    className="app-preview-video"
                    controls
                    src={previewPlaybackUrl ?? preview.mediaUrl}
                    aria-label={`Предпросмотр: ${basenameForAriaLabel(preview.path)}`}
                    onLoadedMetadata={(event) => {
                      handlePreviewVideoLoaded(event.currentTarget)
                    }}
                    onError={(event) => {
                      handlePreviewVideoError(event.currentTarget)
                    }}
                  />
                  <PreviewTransport
                    key={previewPlaybackUrl ?? preview.mediaUrl}
                    mediaKey={previewPlaybackUrl ?? preview.mediaUrl}
                    videoRef={videoRef}
                    fullscreenRootRef={previewStackRef}
                    disabled={exportBusy || snapshotBusy}
                  />
                  <VideoTimeline
                    key={previewPlaybackUrl ?? preview.mediaUrl}
                    mediaKey={previewPlaybackUrl ?? preview.mediaUrl}
                    mediaUrl={previewPlaybackUrl ?? preview.mediaUrl}
                    probe={probeInfo}
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
                  Локальный файл стримится через защищённую схему fluxmedia — только после выбора
                  или DnD по пути из Electron.
                </p>
              </div>
            )}
            {!panelOpen('ffmpegSettingsRailOpen') ? (
              <button
                type="button"
                className="app-ffmpeg-rail-restore app-icon-btn"
                onClick={() => {
                  persistPanelToggle('ffmpegSettingsRailOpen', true)
                }}
                title="Показать настройки FFmpeg"
              >
                <IconChevronLeft title="" size={18} />
                <span className="app-ffmpeg-rail-restore-text">FFmpeg</span>
                <span className="app-visually-hidden">Развернуть панель настроек FFmpeg</span>
              </button>
            ) : null}
          </section>
          {panelOpen('ffmpegSettingsRailOpen') ? (
            <aside className="app-settings-panel" aria-label="Настройки FFmpeg">
              <div className="app-settings-panel-head">
                <div>
                  <h2 className="app-settings-title">Настройки FFmpeg</h2>
                  <p className="app-settings-subtitle">
                    Секции можно сворачивать, как в референсе v0.
                  </p>
                </div>
                <div className="app-settings-panel-head-trailing">
                  <button
                    type="button"
                    className="app-icon-btn app-settings-rail-collapse-btn"
                    onClick={() => {
                      persistPanelToggle('ffmpegSettingsRailOpen', false)
                    }}
                    title="Свернуть панель (больше места для превью и таймлайна)"
                  >
                    <IconChevronRight title="" size={18} />
                    <span className="app-visually-hidden">Свернуть панель настроек FFmpeg</span>
                  </button>
                  <span className="app-settings-badge">{exportContainer.toUpperCase()}</span>
                </div>
              </div>

              <details
                className="app-settings-section"
                open={panelOpen('ffmpegVideo')}
                onToggle={(e) => {
                  persistPanelToggle('ffmpegVideo', e.currentTarget.open)
                }}
              >
                <summary className="app-settings-summary">Видео</summary>
                <p id="ffmpegVideoSectionHint" className="app-settings-section-hint">
                  Кодек, контейнер, CRF и видеобитрейт итогового файла экспорта §7.
                </p>
                <div className="app-settings-grid" aria-describedby="ffmpegVideoSectionHint">
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
                        void window.fluxalloy.settings
                          .setFfmpegExportContainer(v)
                          .catch(console.error)
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
                        if (next === null && exportTwoPass) {
                          setExportTwoPass(false)
                          void window.fluxalloy.settings
                            .setFfmpegExportTwoPass(false)
                            .catch(console.error)
                        }
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
                <p id="ffmpegFormatSectionHint" className="app-settings-section-hint">
                  Масштаб, FPS, поворот/зеркало и кадрирование относительно исходного кадра.
                </p>
                <div className="app-settings-grid" aria-describedby="ffmpegFormatSectionHint">
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
                  <div className="app-field app-field-switch">
                    <span>2-pass libx264</span>
                    <PillSwitch
                      label="Двухпроходное кодирование libx264"
                      checked={exportTwoPass && exportVideoBitrate !== null}
                      describedBy="ffmpegFormatSectionHint ffmpegTwoPassUiHint"
                      disabled={exportBusy || snapshotBusy || exportVideoBitrate === null}
                      onToggle={() => {
                        if (exportVideoBitrate === null) {
                          return
                        }
                        bumpManualExportEdit()
                        const v = !exportTwoPass
                        setExportTwoPass(v)
                        void window.fluxalloy.settings
                          .setFfmpegExportTwoPass(v)
                          .catch(console.error)
                      }}
                    />
                    <span id="ffmpegTwoPassUiHint" className="app-field-help">
                      Требуется выбранный видеобитрейт («Видео» выше): CRF не поддерживает этот
                      режим.
                    </span>
                  </div>
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
                    <span>Обрезка</span>
                    <select
                      className="app-control"
                      aria-label="Обрезка экспорта"
                      value={exportCropPreset}
                      disabled={exportBusy || snapshotBusy}
                      onChange={(e) => {
                        bumpManualExportEdit()
                        const v = e.target.value as FfmpegExportCropPresetId
                        setExportCropPreset(v)
                        void window.fluxalloy.settings
                          .setFfmpegExportCropPreset(v)
                          .catch(console.error)
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
                <p id="ffmpegAudioSectionHint" className="app-settings-section-hint">
                  Аудиодорожка экспорта и параметры сохранения снимка кадра §7.
                </p>
                <div className="app-settings-grid" aria-describedby="ffmpegAudioSectionHint">
                  <div className="app-field app-field-switch">
                    <span>Без аудио</span>
                    <PillSwitch
                      label="Без аудио"
                      checked={exportAudioMode === 'none'}
                      describedBy="ffmpegAudioSectionHint ffmpegAudioModeHint"
                      disabled={exportBusy || snapshotBusy}
                      onToggle={() => {
                        bumpManualExportEdit()
                        const v: FfmpegExportAudioModeId =
                          exportAudioMode === 'none' ? 'aac' : 'none'
                        setExportAudioMode(v)
                        void window.fluxalloy.settings
                          .setFfmpegExportAudioMode(v)
                          .catch(console.error)
                      }}
                    />
                    <span id="ffmpegAudioModeHint" className="app-field-help">
                      Включите, если нужен немой файл или звук будет добавлен позже.
                    </span>
                  </div>
                  <label className="app-field">
                    <span>Битрейт AAC</span>
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
                        void window.fluxalloy.settings
                          .setFfmpegSnapshotFormat(v)
                          .catch(console.error)
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
                      aria-describedby="ffmpegAudioSectionHint"
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
                      aria-describedby="ffmpegAudioSectionHint"
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
                      aria-describedby="ffmpegAudioSectionHint"
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
                <p id="ffmpegPresetsSectionHint" className="app-settings-section-hint">
                  Сохранённые снимки настроек экспорта; кнопки меняют список пресетов в настройках.
                </p>
                <div className="app-settings-stack" aria-describedby="ffmpegPresetsSectionHint">
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
                      aria-describedby="ffmpegPresetsSectionHint"
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
                      aria-describedby="ffmpegPresetsSectionHint"
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
                      aria-describedby="ffmpegPresetsSectionHint"
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
                      aria-describedby="ffmpegPresetsSectionHint"
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
                <p id="ffmpegOutputSectionHint" className="app-settings-section-hint">
                  Превью argv, экспорт через диалог «Сохранить» и быстрые действия над последним
                  файлом.
                </p>
                <div className="app-settings-stack" aria-describedby="ffmpegOutputSectionHint">
                  <details
                    className="app-export-preview app-export-preview-nested"
                    open={panelOpen('exportCommandPreview')}
                    onToggle={(e) => {
                      persistPanelToggle('exportCommandPreview', e.currentTarget.open)
                    }}
                  >
                    <summary className="app-export-preview-summary">Превью команды ffmpeg</summary>
                    <div className="app-export-preview-body">
                      <pre
                        className="app-export-preview-pre"
                        aria-label="Команда ffmpeg"
                        aria-describedby="exportCommandPreviewHint"
                      >
                        {exportPreview.pass1Command
                          ? `# Проход 1\n${exportPreview.pass1Command}\n\n# Проход 2\n${exportPreviewCommand}`
                          : exportPreviewCommand}
                      </pre>
                      <div className="app-export-preview-actions">
                        <button
                          type="button"
                          className="app-btn app-btn-compact"
                          onClick={() => {
                            void handleCopyExportPreview()
                          }}
                          title="Скопировать строку команды ffmpeg в буфер"
                          aria-describedby="exportCommandPreviewHint"
                        >
                          Копировать
                        </button>
                        <span id="exportCommandPreviewHint" className="app-export-preview-hint">
                          {exportPreviewHint()}
                        </span>
                      </div>
                    </div>
                  </details>
                  {lastExportPath ? (
                    <div className="app-settings-actions">
                      <button
                        type="button"
                        className="app-btn app-btn-compact"
                        disabled={exportBusy || snapshotBusy}
                        aria-describedby="ffmpegOutputSectionHint"
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
                        aria-describedby="ffmpegOutputSectionHint"
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
                        aria-describedby="ffmpegOutputSectionHint"
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
                        aria-describedby="ffmpegOutputSectionHint"
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
          ) : null}
        </main>
      ) : (
        <main className="app-main app-downloads-workspace" aria-label="Вкладка загрузок">
          <section className="app-downloads-main">
            <div className="app-downloads-band">
              <div className="app-downloads-band-copy">
                <h2 className="app-downloads-title">Загрузки</h2>
                <p className="app-downloads-hint">
                  Эта вкладка — основной рабочий стол yt-dlp (очередь по центру, журнал и история
                  под таблицей, настройки справа как в v0; при ширине окна примерно до 1100px панель
                  настроек переносится под журнал с прокруткой, поля не теряются). Pop-out —
                  дублирующее окно с тем же IPC и длинным справочником токенов в одном списке.
                </p>
              </div>
              <div className="app-downloads-actions">
                <button
                  type="button"
                  className="app-btn"
                  onClick={() => {
                    void window.fluxalloy.clipboard.readText().then((t) => {
                      setDownloadsUrl(t.trim())
                    })
                  }}
                >
                  Из буфера
                </button>
                <button
                  type="button"
                  className="app-btn"
                  onClick={() => {
                    void window.fluxalloy.downloads.openWindow(downloadsUrl || null)
                  }}
                >
                  Pop-out
                </button>
              </div>
            </div>
            <div className="app-downloads-url-row">
              <textarea
                className="app-downloads-url-input"
                value={downloadsUrl}
                placeholder="URL или несколько URL по строкам"
                aria-label="URL для добавления в очередь загрузок"
                onChange={(e) => {
                  setDownloadsUrl(e.target.value)
                }}
              />
              <div className="app-downloads-url-actions">
                <button
                  type="button"
                  className="app-btn app-btn-primary"
                  onClick={() => {
                    void handleAddDownloadsFromMain(false)
                  }}
                >
                  Добавить в очередь
                </button>
                <button
                  type="button"
                  className="app-btn"
                  onClick={() => {
                    void handleAddDownloadsFromMain(true)
                  }}
                >
                  Добавить и начать
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-primary"
                  onClick={() => {
                    void window.fluxalloy.downloads.startQueue().then((res) => {
                      if (!res.ok) {
                        setStatusHint(res.error)
                      }
                    })
                  }}
                >
                  Начать загрузку
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-warn"
                  onClick={() => {
                    void window.fluxalloy.downloads.cancelQueue().then((res) => {
                      if (!res.ok) {
                        setStatusHint(res.error)
                      }
                    })
                  }}
                >
                  Остановить
                </button>
                <button
                  type="button"
                  className="app-btn"
                  disabled={downloadsRows.length === 0}
                  onClick={() => {
                    void window.fluxalloy.downloads.clearFinished().then((res) => {
                      if (!res.ok) {
                        setStatusHint(res.error)
                        return
                      }
                      setStatusHint(
                        res.removed > 0
                          ? `Убрано завершённых строк: ${res.removed}`
                          : 'Завершённых строк нет.'
                      )
                    })
                  }}
                >
                  Убрать готовые
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-warn"
                  disabled={downloadsRows.length === 0}
                  onClick={() => {
                    void window.fluxalloy.downloads.clearQueue().then((res) => {
                      if (!res.ok) {
                        setStatusHint(res.error)
                        return
                      }
                      setStatusHint('Очередь очищена.')
                    })
                  }}
                >
                  Очистить очередь
                </button>
              </div>
            </div>
            <div className="app-downloads-overview" aria-label="Сводка очереди загрузок">
              <div className="app-downloads-stat">
                <span className="app-downloads-stat-label">Всего</span>
                <strong>{downloadsStats.total}</strong>
              </div>
              <div className="app-downloads-stat">
                <span className="app-downloads-stat-label">В работе</span>
                <strong>{downloadsStats.running}</strong>
              </div>
              <div className="app-downloads-stat">
                <span className="app-downloads-stat-label">Готово</span>
                <strong>{downloadsStats.done}</strong>
              </div>
              <div className="app-downloads-stat">
                <span className="app-downloads-stat-label">Ошибки</span>
                <strong>{downloadsStats.error}</strong>
              </div>
              <div className="app-downloads-stat">
                <span className="app-downloads-stat-label">Ожидает</span>
                <strong>{downloadsStats.pending}</strong>
              </div>
            </div>
            <div className="app-downloads-filterbar" aria-label="Фильтр очереди по статусу">
              {DOWNLOADS_STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={`app-filter-chip${downloadsStatusFilter === filter.id ? ' app-filter-chip-active' : ''}`}
                  aria-pressed={downloadsStatusFilter === filter.id}
                  onClick={() => {
                    setDownloadsStatusFilter(filter.id)
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="app-downloads-table-zone">
              <div className="app-downloads-table-wrap">
                <table className="app-downloads-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Название / URL</th>
                      <th>Формат</th>
                      <th>Размер</th>
                      <th>Прогресс</th>
                      <th>Скорость</th>
                      <th>Осталось</th>
                      <th>Статус</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {downloadsRows.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="app-downloads-empty">
                          Очередь пуста. Добавьте URL сверху или из быстрых действий редактора.
                        </td>
                      </tr>
                    ) : visibleDownloadsRows.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="app-downloads-empty">
                          В этом фильтре строк нет. Переключите статус выше или добавьте новые URL.
                        </td>
                      </tr>
                    ) : (
                      visibleDownloadsRows.map((row) => {
                        const progressPercent = parseDownloadsProgressPercent(row.progress)
                        const isDoneRow = downloadsRowMatchesStatus(row, 'done')
                        const showProgressBar = isDoneRow || progressPercent !== null
                        const barPercent = isDoneRow
                          ? 100
                          : progressPercent === null
                            ? 0
                            : Math.min(100, Math.max(0, progressPercent))
                        const statusTone = downloadsStatusTone(row)
                        return (
                          <tr key={row.id}>
                            <td className="app-downloads-mono">{row.id}</td>
                            <td>
                              <div className="app-downloads-row-title">{row.shortLabel}</div>
                              <div className="app-downloads-row-url">{row.url}</div>
                            </td>
                            <td className="app-downloads-mono">{row.queueFmt ?? '—'}</td>
                            <td className="app-downloads-mono">{row.queueSize ?? '—'}</td>
                            <td className="app-downloads-mono">
                              <div className="app-downloads-progress">
                                {showProgressBar ? (
                                  <div className="app-downloads-progress-bar-row">
                                    <span className="app-downloads-progress-track" aria-hidden>
                                      <span
                                        className={
                                          isDoneRow
                                            ? 'app-downloads-progress-fill app-downloads-progress-fill--complete'
                                            : 'app-downloads-progress-fill'
                                        }
                                        style={{ width: `${barPercent}%` }}
                                      />
                                    </span>
                                    <span className="app-downloads-progress-pct">
                                      {Math.round(barPercent)}%
                                    </span>
                                  </div>
                                ) : row.progress ? (
                                  <span className="app-downloads-progress-fallback" title={row.progress}>
                                    {row.progress}
                                  </span>
                                ) : (
                                  '—'
                                )}
                              </div>
                            </td>
                            <td className="app-downloads-mono">{row.queueSpeed ?? '—'}</td>
                            <td className="app-downloads-mono">{row.queueEta ?? '—'}</td>
                            <td>
                              <span
                                className={`app-downloads-status app-downloads-status-${statusTone}`}
                              >
                                <span className="app-downloads-status-dot" aria-hidden />
                                {row.status}
                              </span>
                            </td>
                            <td>
                              <div className="app-downloads-row-actions">
                                <button
                                  type="button"
                                  className="app-icon-btn"
                                  aria-label={`Поднять строку ${row.id} выше`}
                                  onClick={() => {
                                    void window.fluxalloy.downloads
                                      .moveRow(row.id, -1)
                                      .then((res) => {
                                        if (!res.ok) {
                                          setStatusHint(res.error)
                                        }
                                      })
                                  }}
                                >
                                  <IconQueueChevronUp title="" size={18} />
                                </button>
                                <button
                                  type="button"
                                  className="app-icon-btn"
                                  aria-label={`Опустить строку ${row.id} ниже`}
                                  onClick={() => {
                                    void window.fluxalloy.downloads
                                      .moveRow(row.id, 1)
                                      .then((res) => {
                                        if (!res.ok) {
                                          setStatusHint(res.error)
                                        }
                                      })
                                  }}
                                >
                                  <IconQueueChevronDown title="" size={18} />
                                </button>
                                <button
                                  type="button"
                                  className="app-icon-btn app-icon-btn-primary"
                                  aria-label={
                                    row.status.startsWith('Ошибка')
                                      ? `Повторить загрузку строки ${row.id}`
                                      : `Старт строки ${row.id}`
                                  }
                                  onClick={() => {
                                    const fn = row.status.startsWith('Ошибка')
                                      ? window.fluxalloy.downloads.retryRow
                                      : window.fluxalloy.downloads.startRow
                                    void fn(row.id).then((res) => {
                                      if (!res.ok) {
                                        setStatusHint(res.error)
                                      }
                                    })
                                  }}
                                >
                                  {row.status.startsWith('Ошибка') ? (
                                    <IconQueueRetry title="" size={18} />
                                  ) : (
                                    <IconPlay title="" size={18} />
                                  )}
                                </button>
                                {row.outputPath ? (
                                  <>
                                    <button
                                      type="button"
                                      className="app-icon-btn"
                                      aria-label={`Открыть файл строки ${row.id}`}
                                      onClick={() => {
                                        void window.fluxalloy.downloads
                                          .openQueueOutput(row.id, 'file')
                                          .then((res) => {
                                            if (!res.ok) {
                                              setStatusHint(res.error)
                                            }
                                          })
                                      }}
                                    >
                                      <IconQueueFile title="" size={18} />
                                    </button>
                                    <button
                                      type="button"
                                      className="app-icon-btn"
                                      aria-label={`Открыть папку строки ${row.id}`}
                                      onClick={() => {
                                        void window.fluxalloy.downloads
                                          .openQueueOutput(row.id, 'folder')
                                          .then((res) => {
                                            if (!res.ok) {
                                              setStatusHint(res.error)
                                            }
                                          })
                                      }}
                                    >
                                      <IconFolderOpen title="" size={18} />
                                    </button>
                                    <button
                                      type="button"
                                      className="app-icon-btn"
                                      aria-label={`Открыть в редакторе вывод строки ${row.id}`}
                                      onClick={() => {
                                        setStatusHint(
                                          'Готовлю файл для редактора… при необходимости будет создан WebM preview.'
                                        )
                                        void window.fluxalloy.downloads
                                          .openQueueOutputInHandler(row.id)
                                          .then((res) => {
                                            if (!res.ok) {
                                              setStatusHint(res.error)
                                            } else {
                                              setStatusHint('Файл открыт в редакторе')
                                            }
                                          })
                                      }}
                                    >
                                      <IconQueueOutbound title="" size={18} />
                                    </button>
                                  </>
                                ) : null}
                                {row.isActiveRunner && row.ytdlpPauseSupported ? (
                                  <button
                                    type="button"
                                    className="app-icon-btn"
                                    aria-label={
                                      row.ytdlpPaused
                                        ? `Продолжить yt-dlp для строки ${row.id}`
                                        : `Пауза yt-dlp для строки ${row.id}`
                                    }
                                    onClick={() => {
                                      const fn = row.ytdlpPaused
                                        ? window.fluxalloy.downloads.resumeYtdlp
                                        : window.fluxalloy.downloads.pauseYtdlp
                                      void fn().then((res) => {
                                        if (!res.ok) {
                                          setStatusHint(res.error)
                                        }
                                      })
                                    }}
                                  >
                                    {row.ytdlpPaused ? (
                                      <IconPlay title="" size={18} />
                                    ) : (
                                      <IconPauseUi title="" size={18} />
                                    )}
                                  </button>
                                ) : null}
                                <button
                                  type="button"
                                  className="app-icon-btn app-icon-btn-warn"
                                  aria-label={`Удалить строку ${row.id} из очереди`}
                                  onClick={() => {
                                    void window.fluxalloy.downloads
                                      .removeRow(row.id)
                                      .then((res) => {
                                        if (!res.ok) {
                                          setStatusHint(res.error)
                                        }
                                      })
                                  }}
                                >
                                  <IconQueueTrash title="" size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div className="app-downloads-lower-stack">
                <details
                  className="app-downloads-history-panel"
                  open={downloadsEmbeddedHistoryOpen}
                  onToggle={(event) => {
                    const next = event.currentTarget.open
                    setDownloadsEmbeddedHistoryOpen(next)
                    persistDownloadsWindowUiPanels({ history: next })
                  }}
                >
                  <summary>
                    История
                    <span>{downloadsHistory.length}</span>
                  </summary>
                  <div className="app-downloads-history-actions">
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      disabled={downloadsHistoryBusy}
                      onClick={() => {
                        void refreshDownloadsHistory()
                      }}
                    >
                      Обновить
                    </button>
                    <button
                      type="button"
                      className="app-btn app-btn-compact app-btn-warn"
                      disabled={downloadsHistoryBusy || downloadsHistory.length === 0}
                      onClick={() => {
                        void window.fluxalloy.downloads.clearHistory().then((res) => {
                          if (!res.ok) {
                            setStatusHint(res.error)
                            return
                          }
                          setDownloadsHistory([])
                        })
                      }}
                    >
                      Очистить
                    </button>
                  </div>
                  <div className="app-downloads-history-list">
                    {downloadsHistory.length === 0 ? (
                      <p className="app-downloads-history-empty">
                        История пока пуста. После завершения строк здесь появятся последние
                        результаты.
                      </p>
                    ) : (
                      downloadsHistory.slice(0, 8).map((entry) => (
                        <article key={entry.id} className="app-downloads-history-card">
                          <div className="app-downloads-history-head">
                            <strong>{entry.shortLabel}</strong>
                            <span
                              className={`app-downloads-history-outcome app-downloads-history-${entry.outcome}`}
                            >
                              {downloadsHistoryOutcomeLabel(entry.outcome)}
                            </span>
                          </div>
                          <p title={entry.url}>{entry.url}</p>
                          <div className="app-downloads-history-meta">
                            <span>{formatDownloadsHistoryTime(entry.finishedAt)}</span>
                            <span>{entry.status}</span>
                          </div>
                          {entry.errorHint ? (
                            <p className="app-downloads-warning">{entry.errorHint}</p>
                          ) : null}
                          {entry.outputPath ? (
                            <div className="app-downloads-history-actions">
                              <button
                                type="button"
                                className="app-btn app-btn-compact"
                                onClick={() => {
                                  void window.fluxalloy.downloads
                                    .openHistoryOutput(entry.id, 'file')
                                    .then((res) => {
                                      if (!res.ok) {
                                        setStatusHint(res.error)
                                      }
                                    })
                                }}
                              >
                                Файл
                              </button>
                              <button
                                type="button"
                                className="app-btn app-btn-compact"
                                onClick={() => {
                                  void window.fluxalloy.downloads
                                    .openHistoryOutput(entry.id, 'folder')
                                    .then((res) => {
                                      if (!res.ok) {
                                        setStatusHint(res.error)
                                      }
                                    })
                                }}
                              >
                                Папка
                              </button>
                              <button
                                type="button"
                                className="app-btn app-btn-compact"
                                onClick={() => {
                                  setStatusHint(
                                    'Готовлю файл для редактора… при необходимости будет создан WebM preview.'
                                  )
                                  void window.fluxalloy.downloads
                                    .openHistoryOutputInHandler(entry.id)
                                    .then((res) => {
                                      if (!res.ok) {
                                        setStatusHint(res.error)
                                      } else {
                                        setStatusHint('Файл открыт в редакторе')
                                      }
                                    })
                                }}
                              >
                                В редактор
                              </button>
                            </div>
                          ) : null}
                        </article>
                      ))
                    )}
                  </div>
                </details>
                <details
                  className="app-downloads-log-panel"
                  open={downloadsEmbeddedLogOpen}
                  onToggle={(event) => {
                    const next = event.currentTarget.open
                    setDownloadsEmbeddedLogOpen(next)
                    persistDownloadsWindowUiPanels({ log: next })
                  }}
                >
                  <summary>
                    Живой лог
                    <span>
                      {downloadsLogTargetRowId !== null ? `#${downloadsLogTargetRowId}` : '—'}
                    </span>
                  </summary>
                  <div className="app-downloads-log-actions">
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      disabled={downloadsLogLines.length === 0}
                      onClick={() => {
                        setDownloadsLogLines([])
                        setDownloadsLogTargetRowId(null)
                      }}
                    >
                      Очистить
                    </button>
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      disabled={downloadsLogLines.length === 0}
                      onClick={() => {
                        const text = formatDownloadsLogText(downloadsLogLines)
                        void window.fluxalloy.downloads.saveVisibleLog(text).then((res) => {
                          if (!res.ok && res.error !== 'Сохранение отменено') {
                            setStatusHint(res.error)
                          }
                        })
                      }}
                    >
                      Сохранить
                    </button>
                  </div>
                  <pre className="app-downloads-log-pre" aria-live="polite">
                    {downloadsLogLines.length === 0
                      ? 'Лог появится после запуска строки yt-dlp.'
                      : downloadsLogLines
                          .map((line) => `[${line.rowId}] ${line.stream}: ${line.text}`)
                          .join('\n')}
                  </pre>
                </details>
              </div>
            </div>
          </section>
          <aside className="app-downloads-rail" aria-label="Настройки загрузок">
            <h3 className="app-settings-title">Настройки yt-dlp</h3>
            <p className="app-settings-subtitle">
              Секции и раскрытие совпадают с pop-out: те же ключи в `downloadsWindowUiPanels`. Доп.
              argv и превью команды — здесь; полный optgroup‑справочник как в pop-out — в отдельном
              окне менеджера загрузок.
            </p>
            {downloadsOptions ? (
              <div className="app-downloads-settings-stack">
                <details
                  className="app-downloads-rail-section"
                  open={downloadsRailPanels.format}
                  onToggle={handleDownloadsRailSectionToggle('format')}
                >
                  <summary className="app-downloads-rail-summary">Формат</summary>
                  <div className="app-downloads-rail-section-body">
                    <label className="app-field">
                      <span>Формат / качество</span>
                      <select
                        className="app-control"
                        value={downloadsOptions.formatPreset}
                        disabled={downloadsOptionsBusy || downloadsOptions.audioOnly}
                        aria-describedby="downloadsFormatHint"
                        onChange={(e) => {
                          void applyDownloadsOptionsPatch({
                            formatPreset: e.target.value as YtdlpFormatPresetId
                          })
                        }}
                      >
                        {downloadsOptions.formatPresetChoices.map((choice) => (
                          <option key={choice.id} value={choice.id}>
                            {choice.label}
                          </option>
                        ))}
                      </select>
                      <span id="downloadsFormatHint" className="app-field-help">
                        Пресет `-f`; при «Только аудио» формат видео не применяется.
                      </span>
                    </label>
                    <div className="app-downloads-switch-grid">
                      <div className="app-field app-field-switch">
                        <span>Весь плейлист</span>
                        <PillSwitch
                          label="Весь плейлист"
                          checked={downloadsOptions.downloadPlaylist}
                          describedBy="downloadsPlaylistHint"
                          disabled={downloadsOptionsBusy}
                          onToggle={() => {
                            void applyDownloadsOptionsPatch({
                              downloadPlaylist: !downloadsOptions.downloadPlaylist
                            })
                          }}
                        />
                        <span id="downloadsPlaylistHint" className="app-field-help">
                          `--yes-playlist` вместо одного видео.
                        </span>
                      </div>
                      <div className="app-field app-field-switch">
                        <span>Только аудио</span>
                        <PillSwitch
                          label="Только аудио"
                          checked={downloadsOptions.audioOnly}
                          describedBy="downloadsAudioOnlyHint"
                          disabled={downloadsOptionsBusy}
                          onToggle={() => {
                            void applyDownloadsOptionsPatch({
                              audioOnly: !downloadsOptions.audioOnly
                            })
                          }}
                        />
                        <span id="downloadsAudioOnlyHint" className="app-field-help">
                          `-x`, если нужен звук без видеодорожки.
                        </span>
                      </div>
                    </div>
                    <label className="app-field">
                      <span>Субтитры</span>
                      <select
                        className="app-control"
                        value={downloadsOptions.subtitlePreset}
                        disabled={downloadsOptionsBusy}
                        onChange={(e) => {
                          void applyDownloadsOptionsPatch({
                            subtitlePreset: e.target.value as YtdlpSubtitlePresetId
                          })
                        }}
                      >
                        <option value="none">Не скачивать</option>
                        <option value="manual">Ручные дорожки</option>
                        <option value="manual_auto">Ручные + авто</option>
                      </select>
                      <span className="app-field-help">
                        Один токен `--sub-langs` без пробелов (например ru,en или all).
                      </span>
                    </label>
                    <label className="app-field">
                      <span>Языки субтитров</span>
                      <input
                        className="app-control app-downloads-template-input"
                        value={downloadsOptions.subLangsLine}
                        disabled={
                          downloadsOptionsBusy || downloadsOptions.subtitlePreset === 'none'
                        }
                        spellCheck={false}
                        placeholder="ru,en или all"
                        onChange={(e) => {
                          setDownloadsOptions({
                            ...downloadsOptions,
                            subLangsLine: e.target.value
                          })
                        }}
                        onBlur={(e) => {
                          void applyDownloadsOptionsPatch({ subLangs: e.target.value })
                        }}
                      />
                    </label>
                  </div>
                </details>
                <details
                  className="app-downloads-rail-section"
                  open={downloadsRailPanels.metadata}
                  onToggle={handleDownloadsRailSectionToggle('metadata')}
                >
                  <summary className="app-downloads-rail-summary">Метаданные</summary>
                  <div className="app-downloads-rail-section-body">
                    <div className="app-field app-field-switch">
                      <span>Открыть после успеха</span>
                      <PillSwitch
                        label="Открыть после успеха"
                        checked={downloadsOptions.openInHandlerOnComplete}
                        describedBy="downloadsOpenAfterSuccessHint"
                        disabled={downloadsOptionsBusy}
                        onToggle={() => {
                          void applyDownloadsOptionsPatch({
                            openInHandlerOnComplete: !downloadsOptions.openInHandlerOnComplete
                          })
                        }}
                      />
                      <span id="downloadsOpenAfterSuccessHint" className="app-field-help">
                        Готовый файл сразу попадёт в редактор.
                      </span>
                    </div>
                    <div className="app-downloads-select-grid">
                      <label className="app-field">
                        <span>Cookies браузера</span>
                        <select
                          className="app-control"
                          value={downloadsOptions.cookiesBrowserChoice}
                          disabled={downloadsOptionsBusy}
                          onChange={(e) => {
                            void applyDownloadsOptionsPatch({
                              cookiesBrowser: e.target.value as 'none' | YtdlpCookiesBrowserId
                            })
                          }}
                        >
                          <option value="none">Не использовать</option>
                          <option value="chrome">Chrome</option>
                          <option value="edge">Edge</option>
                          <option value="firefox">Firefox</option>
                        </select>
                      </label>
                      <label className="app-field">
                        <span>Подмена клиента</span>
                        <select
                          className="app-control"
                          value={downloadsOptions.impersonateChoice}
                          disabled={downloadsOptionsBusy}
                          onChange={(e) => {
                            void applyDownloadsOptionsPatch({
                              impersonate: e.target.value as 'none' | YtdlpImpersonateId
                            })
                          }}
                        >
                          <option value="none">Выключено</option>
                          <option value="chrome">chrome</option>
                          <option value="edge">edge</option>
                          <option value="firefox">firefox</option>
                        </select>
                      </label>
                    </div>
                    <div
                      className="app-downloads-output-dir"
                      role="group"
                      aria-label="Файл cookies yt-dlp"
                    >
                      <span className="app-field-help">Файл cookies Netscape</span>
                      <strong title={downloadsOptions.cookiesFilePathStored}>
                        {downloadsOptions.cookiesFilePathStored || 'Файл не выбран'}
                      </strong>
                      <span className="app-field-help">
                        Файл имеет приоритет над cookies из браузера; используйте только доверенный
                        экспорт cookies.
                      </span>
                      <div className="app-downloads-history-actions">
                        <button
                          type="button"
                          className="app-btn app-btn-compact"
                          disabled={downloadsOptionsBusy}
                          onClick={() => {
                            void window.fluxalloy.downloads.pickCookiesFile().then((res) => {
                              if (res.ok) {
                                void refreshDownloadsOptions()
                                return
                              }
                              if ('error' in res) {
                                setStatusHint(res.error)
                              }
                            })
                          }}
                        >
                          Выбрать
                        </button>
                        <button
                          type="button"
                          className="app-btn app-btn-compact"
                          disabled={
                            downloadsOptionsBusy ||
                            downloadsOptions.cookiesFilePathStored.length === 0
                          }
                          onClick={() => {
                            void window.fluxalloy.downloads.clearCookiesFile().then((res) => {
                              if (!res.ok) {
                                setStatusHint(res.error)
                                return
                              }
                              void refreshDownloadsOptions()
                            })
                          }}
                        >
                          Очистить
                        </button>
                      </div>
                    </div>
                  </div>
                </details>
                <details
                  className="app-downloads-rail-section"
                  open={downloadsRailPanels.saving}
                  onToggle={handleDownloadsRailSectionToggle('saving')}
                >
                  <summary className="app-downloads-rail-summary">Сохранение</summary>
                  <div className="app-downloads-rail-section-body">
                    <div
                      className="app-downloads-output-dir"
                      role="group"
                      aria-label="Каталог загрузок yt-dlp"
                    >
                      <span className="app-field-help">Каталог загрузок</span>
                      <strong title={downloadsOutputDirectory?.path ?? ''}>
                        {downloadsOutputDirectory?.path ?? 'Загружаю путь…'}
                      </strong>
                      <span className="app-field-help">
                        {downloadsOutputDirectory?.isDefault
                          ? 'Используется каталог по умолчанию в userData.'
                          : 'Используется выбранный пользователем каталог.'}
                      </span>
                      <div className="app-downloads-history-actions">
                        <button
                          type="button"
                          className="app-btn app-btn-compact"
                          onClick={() => {
                            void window.fluxalloy.downloads.openOutputDirectory().then((res) => {
                              if (!res.ok) {
                                setStatusHint(res.error)
                              }
                            })
                          }}
                        >
                          Открыть
                        </button>
                        <button
                          type="button"
                          className="app-btn app-btn-compact"
                          onClick={() => {
                            void window.fluxalloy.downloads.pickOutputDirectory().then((res) => {
                              if (res.ok) {
                                setDownloadsOutputDirectory({ path: res.path, isDefault: false })
                                return
                              }
                              if ('error' in res) {
                                setStatusHint(res.error)
                              }
                            })
                          }}
                        >
                          Выбрать
                        </button>
                        <button
                          type="button"
                          className="app-btn app-btn-compact"
                          onClick={() => {
                            void window.fluxalloy.downloads.clearOutputDirectory().then((res) => {
                              if (!res.ok) {
                                setStatusHint(res.error)
                                return
                              }
                              void refreshDownloadsOutputDirectory()
                            })
                          }}
                        >
                          По умолчанию
                        </button>
                      </div>
                    </div>
                    <label className="app-field">
                      <span>Шаблон имени</span>
                      <input
                        className="app-control app-downloads-template-input"
                        value={downloadsOptions.filenameTemplate}
                        disabled={downloadsOptionsBusy}
                        spellCheck={false}
                        onChange={(e) => {
                          setDownloadsOptions({
                            ...downloadsOptions,
                            filenameTemplate: e.target.value
                          })
                        }}
                        onBlur={(e) => {
                          void applyDownloadsOptionsPatch({ filenameTemplate: e.target.value })
                        }}
                      />
                      <span className="app-field-help">
                        Нужен `%(ext)s`; путь наружу через `..` запрещён.
                      </span>
                    </label>
                  </div>
                </details>
                <details
                  className="app-downloads-rail-section"
                  open={downloadsRailPanels.network}
                  onToggle={handleDownloadsRailSectionToggle('network')}
                >
                  <summary className="app-downloads-rail-summary">Сеть</summary>
                  <div className="app-downloads-rail-section-body">
                    <label className="app-field">
                      <span>Повтор строки очереди</span>
                      <select
                        className="app-control"
                        value={downloadsOptions.queueRetryProfile}
                        disabled={downloadsOptionsBusy}
                        onChange={(e) => {
                          void applyDownloadsOptionsPatch({
                            queueRetryProfile: e.target.value as YtdlpQueueRetryProfileId
                          })
                        }}
                      >
                        {downloadsOptions.queueRetryProfileChoices.map((choice) => (
                          <option key={choice.id} value={choice.id}>
                            {choice.label}
                          </option>
                        ))}
                      </select>
                      <span className="app-field-help">
                        Повторяет всю строку очереди при ненулевом exit code.
                      </span>
                    </label>
                    <div className="app-downloads-select-grid">
                      <label className="app-field">
                        <span>Лимит скорости</span>
                        <input
                          className="app-control"
                          value={downloadsOptions.rateLimit}
                          disabled={downloadsOptionsBusy}
                          placeholder="500K или 2M"
                          spellCheck={false}
                          onChange={(e) => {
                            setDownloadsOptions({ ...downloadsOptions, rateLimit: e.target.value })
                          }}
                          onBlur={(e) => {
                            void applyDownloadsOptionsPatch({ rateLimit: e.target.value })
                          }}
                        />
                        <span className="app-field-help">
                          Ограничение скорости одним безопасным токеном.
                        </span>
                      </label>
                      <label className="app-field">
                        <span>Повторы yt-dlp</span>
                        <input
                          className="app-control"
                          value={downloadsOptions.retriesLine}
                          disabled={downloadsOptionsBusy}
                          inputMode="numeric"
                          placeholder="0–99"
                          spellCheck={false}
                          onChange={(e) => {
                            setDownloadsOptions({
                              ...downloadsOptions,
                              retriesLine: e.target.value
                            })
                          }}
                          onBlur={(e) => {
                            void applyDownloadsOptionsPatch({ retriesLine: e.target.value })
                          }}
                        />
                        <span className="app-field-help">Повторы самого yt-dlp (`--retries`).</span>
                      </label>
                      <label className="app-field">
                        <span>Повторы фрагментов</span>
                        <input
                          className="app-control"
                          value={downloadsOptions.fragmentRetriesLine}
                          disabled={downloadsOptionsBusy}
                          inputMode="numeric"
                          placeholder="0–99"
                          spellCheck={false}
                          onChange={(e) => {
                            setDownloadsOptions({
                              ...downloadsOptions,
                              fragmentRetriesLine: e.target.value
                            })
                          }}
                          onBlur={(e) => {
                            void applyDownloadsOptionsPatch({
                              fragmentRetriesLine: e.target.value
                            })
                          }}
                        />
                        <span className="app-field-help">Повторы фрагментов HLS/DASH.</span>
                      </label>
                    </div>
                  </div>
                </details>
                <details
                  className="app-downloads-rail-section"
                  open={downloadsRailPanels.expert}
                  onToggle={handleDownloadsRailSectionToggle('expert')}
                >
                  <summary className="app-downloads-rail-summary">Эксперт и превью</summary>
                  <div className="app-downloads-rail-section-body">
                    <label className="app-field">
                      <span>Дополнительные argv</span>
                      <textarea
                        className="app-control app-downloads-extra-args"
                        rows={3}
                        spellCheck={false}
                        autoComplete="off"
                        value={downloadsOptions.extraArgsLine}
                        disabled={downloadsOptionsBusy}
                        onChange={(e) => {
                          setDownloadsOptions({
                            ...downloadsOptions,
                            extraArgsLine: e.target.value
                          })
                        }}
                        onBlur={(e) => {
                          void applyDownloadsOptionsPatch({ extraArgsLine: e.target.value })
                        }}
                      />
                      <span className="app-field-help">
                        Без shell: токены как в справочнике; небезопасное отсекает парсер main.
                      </span>
                    </label>
                    {downloadsOptions.extraArgsParseWarning ? (
                      <p className="app-downloads-warning" role="alert">
                        {downloadsOptions.extraArgsParseWarning}
                      </p>
                    ) : null}
                    <label className="app-field">
                      <span>Вставить токен из справочника</span>
                      <select
                        key={downloadsExpertHintPickerSeq}
                        className="app-control app-downloads-expert-hint-select"
                        aria-label="Добавить токен в дополнительные argv"
                        disabled={downloadsOptionsBusy}
                        defaultValue=""
                        onChange={(e) => {
                          const token = e.target.value
                          if (!token) return
                          const cur = downloadsOptions.extraArgsLine.trim()
                          const next = cur ? `${cur} ${token}` : token
                          setDownloadsOptions({ ...downloadsOptions, extraArgsLine: next })
                          setDownloadsExpertHintPickerSeq((s) => s + 1)
                          void applyDownloadsOptionsPatch({ extraArgsLine: next })
                        }}
                      >
                        <option value="">Выберите…</option>
                        {ytdlpCommandHintsByCategory.map(([cat, rows]) => (
                          <optgroup key={cat} label={cat}>
                            {rows.map((h) => (
                              <option key={h.token} value={h.token} title={h.summary}>
                                {h.token}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <span className="app-field-help">
                        Полный список с описаниями — в pop-out «Менеджер загрузок».
                      </span>
                    </label>
                    <p className="app-doc-inline-links app-downloads-doc-links">
                      <a href={YTDLP_DOC_README} target="_blank" rel="noreferrer">
                        README
                      </a>
                      {' · '}
                      <a href={YTDLP_DOC_FORMAT_SELECTION} target="_blank" rel="noreferrer">
                        Форматы
                      </a>
                      {' · '}
                      <a href={YTDLP_DOC_OUTPUT_TEMPLATE} target="_blank" rel="noreferrer">
                        Шаблон вывода
                      </a>
                      {' · '}
                      <a href={YTDLP_DOC_POSTPROCESS} target="_blank" rel="noreferrer">
                        Постобработка
                      </a>
                    </p>
                    <span className="app-field-help">Превью команды (чтение)</span>
                    <div className="app-downloads-command-preview app-downloads-command-preview--flat">
                      <pre>{downloadsOptions.commandPreview}</pre>
                    </div>
                  </div>
                </details>
                {downloadsOptions.cookiesWarning ? (
                  <p className="app-downloads-warning">{downloadsOptions.cookiesWarning}</p>
                ) : null}
              </div>
            ) : (
              <p className="app-settings-subtitle">Загружаю настройки yt-dlp…</p>
            )}
            <div className="app-downloads-rail-footer">
              <button
                type="button"
                className="app-btn"
                disabled={downloadsOptionsBusy}
                onClick={() => {
                  void refreshDownloadsOptions()
                }}
              >
                Обновить настройки
              </button>
              <button
                type="button"
                className="app-btn"
                onClick={() => {
                  void window.fluxalloy.downloads.cancelQueue().then((res) => {
                    if (!res.ok) {
                      setStatusHint(res.error)
                    }
                  })
                }}
              >
                Остановить текущую
              </button>
            </div>
          </aside>
        </main>
      )}

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

      <AboutDialog
        open={aboutOpen}
        aboutInfo={aboutInfo}
        onClose={() => {
          setAboutOpen(false)
        }}
        onDiagnosticStatus={(message) => {
          setStatusHint(message)
        }}
      />

      {exportPresetNameDialog ? (
        <div
          className="app-modal-backdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setExportPresetNameDialog(null)
            }
          }}
        >
          <form
            className="app-modal app-modal-narrow"
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-preset-name-title"
            aria-describedby="export-preset-name-hint"
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmitExportPresetName()
            }}
          >
            <h2 id="export-preset-name-title" className="app-modal-title">
              {exportPresetNameDialog.mode === 'create' ? 'Новый пресет экспорта' : 'Имя пресета'}
            </h2>
            <p id="export-preset-name-hint" className="app-modal-hint">
              Имя хранится только в настройках FluxAlloy и помогает быстро возвращаться к набору
              FFmpeg-параметров.
            </p>
            <label className="app-engine-path-row">
              <span className="app-engine-path-label">Имя</span>
              <input
                className="app-engine-path-input"
                type="text"
                maxLength={64}
                autoFocus
                value={exportPresetNameDialog.value}
                aria-invalid={exportPresetNameDialog.error !== null}
                aria-describedby={
                  exportPresetNameDialog.error ? 'export-preset-name-error' : undefined
                }
                onChange={(e) => {
                  setExportPresetNameDialog((prev) =>
                    prev === null ? null : { ...prev, value: e.target.value, error: null }
                  )
                }}
              />
            </label>
            {exportPresetNameDialog.error ? (
              <p id="export-preset-name-error" className="app-modal-hint app-modal-error">
                {exportPresetNameDialog.error}
              </p>
            ) : null}
            <div className="app-modal-footer">
              <button
                type="button"
                className="app-btn"
                onClick={() => {
                  setExportPresetNameDialog(null)
                }}
              >
                Отмена
              </button>
              <button type="submit" className="app-btn app-btn-primary">
                Сохранить
              </button>
            </div>
          </form>
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
                className="app-btn app-btn-danger"
                disabled={engineDownloadBusy}
                title="Удалить только скачанные копии из userData/bin. Встроенные resources/bin и ручные пути не трогаются."
                onClick={() => {
                  void handleClearDownloadedEngines()
                }}
              >
                Удалить скачанные
              </button>
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
