import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { JSX, SyntheticEvent } from 'react'

import { AboutDialog } from './components/AboutDialog'
import { KnowledgeDialog } from './components/KnowledgeDialog'
import { DownloadsHistoryPanel } from './components/downloads/DownloadsHistoryPanel'
import { ProcessingHistoryPanel } from './components/ProcessingHistoryPanel'
import {
  DownloadsLogPanel,
  type DownloadsLogLineView
} from './components/downloads/DownloadsLogPanel'
import VideoTimeline from './components/VideoTimeline'
import PreviewTransport from './components/PreviewTransport'
import Versions from './components/Versions'
import {
  formatTerminalCopyLineAria,
  formatTerminalExitLine,
  formatTerminalIntroTail,
  formatTerminalPreviewTooltip,
  formatDownloadsQueueRowStatus,
  formatFfmpegExportBatchStatusLabel,
  applyPersistedUiLocale,
  setUiLocaleForSession,
  getUiLocale,
  uiText,
  uiTextVars
} from './locales/ui-text'
import {
  IconBan,
  IconBook,
  IconChevronLeft,
  IconChevronRight,
  IconCopy,
  IconCircleHelp,
  IconCloudDownload,
  IconDownload,
  IconFilm,
  IconFolder,
  IconFolderOpen,
  IconHome,
  IconMoon,
  IconPauseUi,
  IconPlay,
  IconPopOutWindow,
  IconQueueChevronDown,
  IconQueuePlus,
  IconQueueChevronUp,
  IconQueueFile,
  IconQueueOutbound,
  IconQueueRetry,
  IconQueueTrash,
  IconQueueX,
  IconRefreshCw,
  IconSave,
  IconScissors,
  IconSettings,
  IconSun,
  IconWorkspaceEditor,
  IconWorkspaceTerminal
} from './components/LucideMiniIcons'
import type { FfmpegExportBatchConcurrency, FfmpegExportBatchSnapshot } from '../../shared/ffmpeg-export-batch-contract'
import type { EngineId } from '../../shared/engine-contract'
import { ENGINE_IDS } from '../../shared/engine-contract'
import type {
  FfmpegExportAudioModeId,
  FfmpegExportAudioNormalizeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportScalePresetId,
  FfmpegExportSubtitleModeId,
  FfmpegExportUserPreset,
  FfmpegExportUserPresetSnapshot,
  FfmpegExportVideoCodecId,
  FfmpegExportVideoDebandId,
  FfmpegExportVideoDeinterlaceId,
  FfmpegExportVideoHisteqId,
  FfmpegExportVideoDenoiseId,
  FfmpegExportVideoEqPresetId,
  FfmpegExportVideoGrainId,
  FfmpegExportVideoHueId,
  FfmpegExportVideoBlurId,
  FfmpegExportVideoLut3dId,
  FfmpegExportVideoVignetteId,
  FfmpegExportVideoSharpenId,
  FfmpegExportVideoTransformId
} from '../../shared/ffmpeg-export-contract'
import {
  FFMPEG_EXPORT_USER_ADDED_PRESETS_MAX,
  FFMPEG_EXPORT_USER_PRESETS_MAX_ENTRIES
} from '../../shared/ffmpeg-export-contract'
import type { AppSettings, ResolvedAppTheme } from '../../shared/settings-contract'
import { buildFfmpegExportPreviewCommand } from '../../shared/ffmpeg-export-argv'
import { parseFfmpegExportExtraArgsLine } from '../../shared/ffmpeg-export-extra-args'
import {
  DEFAULT_EDITOR_URL_PASTE_BEHAVIOR,
  parseEditorUrlPasteBehavior,
  type EditorUrlPasteBehaviorId
} from '../../shared/editor-url-paste-behavior'
import { DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX } from '../../shared/ffmpeg-export-batch-output-suffix'
import { resolveFfmpegExportHwaccelForDecode } from '../../shared/ffmpeg-export-hw-decode'
import { formatFfmpegExportBatchReportText } from '../../shared/ffmpeg-export-batch-report'
import { isFfmpegExportBatchVideoPath } from '../../shared/ffmpeg-export-batch-video-ext'
import { isBuiltinExportUserPresetId } from '../../shared/builtin-ffmpeg-export-user-presets'
import { FFMPEG_HW_VIDEO_ENCODER_IDS } from '../../shared/ffmpeg-hw-encoder-probe'
import type { FfmpegHwEncodersProbeResult } from '../../shared/ffmpeg-hw-encoder-probe'
import {
  ffmpegExportAudioModeRequiresMkv,
  ffmpegExportAudioModeUsesBitrate,
  ffmpegExportAudioModeAllowsFilters
} from '../../shared/ffmpeg-export-audio-mode'
import {
  cpuFfmpegVideoCodecRequiresMkv,
  ffmpegExportVideoCodecRequiresMov,
  isFfmpegHwAutoVideoCodec,
  isFfmpegHwExportVideoCodec,
  parseFfmpegExportVideoCodec,
  probeSnapshotOrEmpty,
  resolveFfmpegExportVideoCodecForArgv
} from '../../shared/ffmpeg-export-video-codec'
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
import type { DownloadsWindowUiLocale } from '../../shared/downloads-window-ui-locale'
import { groupYtdlpCommandHintsByCategory } from '../../shared/ytdlp-command-hints-group'
import type {
  YtdlpDownloadHistoryEntry,
  YtdlpDownloadHistoryWeeklySummary
} from '../../shared/ytdlp-history-contract'
import type {
  ProcessingHistoryEntry,
  ProcessingHistoryFilter,
  ProcessingHistoryWeeklySummary
} from '../../shared/processing-history-contract'
import type { DownloadsLogPayload } from '../../shared/downloads-log-contract'
import { DOWNLOADS_VISIBLE_LOG_SAVE_CANCELLED } from '../../shared/downloads-log-contract'
import {
  isYtdlpQueueStatusCancelled,
  isYtdlpQueueStatusDone,
  isYtdlpQueueStatusErrorLike,
  isYtdlpQueueStatusRunningLike
} from '../../shared/ytdlp-queue-status'
import {
  TERMINAL_CURRENT_FILE_PLACEHOLDER,
  TERMINAL_SCENARIO_HINTS_DOWNLOADS,
  TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA,
  type TerminalCommandHintEntry,
  type TerminalRunResult
} from '../../shared/terminal-contract'
import {
  applyTerminalInlinePick,
  DEFAULT_TERMINAL_INLINE_SUGGEST_MAX,
  DEFAULT_TERMINAL_INLINE_SUGGEST_PAGE_STEP,
  filterTerminalInlineSuggestions,
  stepTerminalSuggestIndex
} from '../../shared/terminal-inline-suggest'
import {
  useDownloadsWindowUiPanels,
  type DownloadsRailPanelKey
} from './use-downloads-window-ui-panels'
import { useMainWindowUiPanels } from './use-main-window-ui-panels'
type Theme = ResolvedAppTheme

/** §8 — расширенный порядок подсказок терминала при открытом медиа в превью. */
const TERMINAL_HINT_VIDEO_EXTS = new Set([
  '3gp',
  'asf',
  'avi',
  'flv',
  'm2ts',
  'm4v',
  'mkv',
  'mov',
  'mp4',
  'mpeg',
  'mpg',
  'mts',
  'ogv',
  'ts',
  'webm',
  'wmv'
])
const TERMINAL_HINT_AUDIO_EXTS = new Set([
  'aac',
  'aiff',
  'alac',
  'flac',
  'm4a',
  'mp3',
  'ogg',
  'opus',
  'wav',
  'wma'
])
/** §15 — slug `Help/ffmpeg-terminal-hints.md` для deep-link из подсказок UI. */
const KNOWLEDGE_SLUG_FFMPEG_TERMINAL_HINTS = 'ffmpeg-terminal-hints'

/** §7.3 — id заголовков таблицы очереди пакета (`headers` на `<td>`). */
const BATCH_EXPORT_TABLE_HEADER_IDS = {
  file: 'flux-batch-col-file',
  status: 'flux-batch-col-status',
  output: 'flux-batch-col-output',
  progress: 'flux-batch-col-progress',
  actions: 'flux-batch-col-actions'
} as const

/** §6 — id заголовков таблицы очереди yt-dlp (`headers` на `<td>`). */
const DOWNLOADS_QUEUE_TABLE_HEADER_IDS = {
  num: 'flux-dlq-col-num',
  titleUrl: 'flux-dlq-col-title-url',
  format: 'flux-dlq-col-format',
  size: 'flux-dlq-col-size',
  progress: 'flux-dlq-col-progress',
  speed: 'flux-dlq-col-speed',
  eta: 'flux-dlq-col-eta',
  status: 'flux-dlq-col-status',
  actions: 'flux-dlq-col-actions'
} as const

type WorkspaceTab = 'editor' | 'downloads' | 'terminal'

function previewPathExtensionLower(path: string | null): string | null {
  if (typeof path !== 'string' || path.trim().length === 0) {
    return null
  }
  const base = path.replace(/\\/g, '/').split('/').pop() ?? ''
  const dot = base.lastIndexOf('.')
  if (dot <= 0 || dot >= base.length - 1) {
    return null
  }
  return base.slice(dot + 1).toLowerCase()
}

function terminalHintToolRank(
  tool: TerminalCommandHintEntry['tool'],
  workspaceTab: WorkspaceTab,
  mediaInPreview: boolean
): number {
  if (workspaceTab === 'downloads') {
    return tool === 'yt-dlp' ? 0 : tool === 'ffmpeg' ? 1 : 2
  }
  if (mediaInPreview) {
    return tool === 'ffprobe' ? 0 : tool === 'ffmpeg' ? 1 : 2
  }
  return tool === 'ffmpeg' ? 0 : tool === 'ffprobe' ? 1 : 2
}

type PreviewOpenedPayload = RestoredSourceInfo
type EngineSummary = 'checking' | 'ready' | 'missing' | 'error'
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
  ytdlpPauseChildActive?: boolean
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
type TerminalHistoryEntry = {
  id: number
  line: string
  result: TerminalRunResult
}
type EnginesSnapshot = Awaited<ReturnType<typeof window.fluxalloy.engines.getStatus>>

type PillSwitchProps = {
  label: string
  checked: boolean
  disabled?: boolean
  describedBy?: string
  /** Длинная подсказка при наведении (простым языком). */
  tooltip?: string
  onToggle: () => void
}

function PillSwitch({
  label,
  checked,
  disabled = false,
  describedBy,
  tooltip,
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
      title={tooltip}
      disabled={disabled}
      onClick={onToggle}
    >
      <span className="app-pill-switch-knob" aria-hidden />
      <span className="app-pill-switch-text">
        {checked ? uiText('editorPillSwitchOn') : uiText('editorPillSwitchOff')}
      </span>
    </button>
  )
}

const EXPORT_CRF_OPTIONS = [18, 20, 23, 26, 28, 30]
const EXPORT_VIDEO_BITRATES = ['1000k', '2500k', '5000k', '8000k', '12000k', '20000k']
const EXPORT_AUDIO_BITRATES = ['96k', '128k', '160k', '192k', '256k', '320k']
const EXPORT_FPS_OPTIONS = [24, 25, 30, 50, 60]

function previewVideoMediaErrorDetailLabel(code: number): string {
  switch (code) {
    case 1:
      return uiText('statusVideoMediaErrAborted')
    case 2:
      return uiText('statusVideoMediaErrNetwork')
    case 3:
      return uiText('statusVideoMediaErrDecode')
    case 4:
      return uiText('statusVideoMediaErrSrcNotSupported')
    default:
      return uiText('statusVideoMediaErrUnknown')
  }
}

function engineLabel(id: EngineId): string {
  switch (id) {
    case 'ffmpeg':
      return uiText('engineDisplayNameFfmpeg')
    case 'ffprobe':
      return uiText('engineDisplayNameFfprobe')
    case 'yt-dlp':
      return uiText('engineDisplayNameYtdlp')
    default:
      return id
  }
}

type EnginePathsDraft = Record<EngineId, string>

function formatEngineVersionsLine(snapshot: EnginesSnapshot): string {
  const parts = ENGINE_IDS.map((id) => {
    const e = snapshot.engines[id]
    const name = engineLabel(id)
    if (e.state === 'ready' && e.version) {
      const cut =
        e.version.length > 30
          ? `${e.version.slice(0, 28)}${uiText('commonUnicodeEllipsis')}`
          : e.version
      return `${name}: ${cut}`
    }
    if (e.state === 'missing') {
      return `${name}: ${uiText('uiPlaceholderDash')}`
    }
    if (e.state === 'error') {
      return `${name}: ${uiText('enginesVersionLineErrorMark')}`
    }
    return `${name}: ${uiText('commonUnicodeEllipsis')}`
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
      return uiText('enginesSummaryReady')
    case 'missing':
      return uiText('enginesSummaryMissing')
    case 'error':
      return uiText('enginesSummaryError')
    case 'checking':
      return uiText('enginesSummaryChecking')
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
        progress: typeof o['progress'] === 'string' ? o['progress'] : uiText('uiPlaceholderDash'),
        status: typeof o['status'] === 'string' ? o['status'] : uiText('uiPlaceholderDash'),
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
        ...(typeof o['ytdlpPauseChildActive'] === 'boolean'
          ? { ytdlpPauseChildActive: o['ytdlpPauseChildActive'] }
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
    return isYtdlpQueueStatusRunningLike(row.status)
  }
  if (filter === 'done') {
    return isYtdlpQueueStatusDone(row.status)
  }
  if (filter === 'error') {
    return isYtdlpQueueStatusErrorLike(row.status)
  }
  return isYtdlpQueueStatusCancelled(row.status)
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

type DownloadsHistoryOutcomeFilter = 'all' | YtdlpDownloadHistoryEntry['outcome']

function formatDownloadsLogText(lines: DownloadsLogLineView[]): string {
  return lines.map((line) => `[${line.rowId}] ${line.stream}: ${line.text}`).join('\n')
}

function terminalHintInsertAccessibleDescription(hint: TerminalCommandHintEntry): string {
  const summaryRaw = hint.summary?.trim() ?? ''
  const summary =
    summaryRaw.length > 180
      ? `${summaryRaw.slice(0, 178)}${uiText('commonUnicodeEllipsis')}`
      : summaryRaw
  if (summary.length > 0) {
    return uiTextVars('terminalHintInsertButtonAriaTemplate', {
      token: hint.token,
      tool: hint.tool,
      summary
    })
  }
  return uiTextVars('terminalHintInsertButtonAriaNoSummaryTemplate', {
    token: hint.token,
    tool: hint.tool
  })
}

function downloadsCatalogHintTokenAccessibleDescription(
  category: string,
  hint: YtdlpCommandHintEntry
): string {
  const summaryRaw = hint.summary?.trim() ?? ''
  const summary =
    summaryRaw.length > 180
      ? `${summaryRaw.slice(0, 178)}${uiText('commonUnicodeEllipsis')}`
      : summaryRaw
  if (summary.length > 0) {
    return uiTextVars('downloadsHintTokenButtonAriaTemplate', {
      category,
      token: hint.token,
      summary
    })
  }
  return uiTextVars('downloadsHintTokenButtonAriaNoSummaryTemplate', {
    category,
    token: hint.token
  })
}

function App(): JSX.Element {
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('editor')
  const [theme, setTheme] = useState<Theme>('dark')
  const [engineSummary, setEngineSummary] = useState<EngineSummary>('checking')
  const [enginesOfferDownload, setEnginesOfferDownload] = useState(false)
  const [engineDownloadBusy, setEngineDownloadBusy] = useState(false)
  const [enginePathsOpen, setEnginePathsOpen] = useState(false)
  /** Сброс дерева после `applyPersistedUiLocale` — строки из `ui-text` читают `getUiLocale()` из модуля. */
  const [uiLocaleRenderTick, setUiLocaleRenderTick] = useState(0)
  const [knowledgeOpen, setKnowledgeOpen] = useState(false)
  const [knowledgeInitialSlug, setKnowledgeInitialSlug] = useState<string | null>(null)
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
  const [downloadsUrl, setDownloadsUrl] = useState('')
  const [downloadsRows, setDownloadsRows] = useState<DownloadsQueueRowView[]>([])
  const [downloadsStatusFilter, setDownloadsStatusFilter] = useState<DownloadsStatusFilter>('all')
  const [downloadsOptions, setDownloadsOptions] = useState<YtdlpDownloadOptionsPayload | null>(null)
  const [downloadsOptionsBusy, setDownloadsOptionsBusy] = useState(false)
  const [downloadsExpertHintFilter, setDownloadsExpertHintFilter] = useState('')
  const [downloadsHistory, setDownloadsHistory] = useState<YtdlpDownloadHistoryEntry[]>([])
  const [downloadsHistoryBusy, setDownloadsHistoryBusy] = useState(false)
  const [downloadsHistoryOutcomeFilter, setDownloadsHistoryOutcomeFilter] =
    useState<DownloadsHistoryOutcomeFilter>('all')
  const [downloadsHistoryWeeklySummary, setDownloadsHistoryWeeklySummary] =
    useState<YtdlpDownloadHistoryWeeklySummary | null>(null)
  const [processingHistory, setProcessingHistory] = useState<ProcessingHistoryEntry[]>([])
  const [processingHistoryBusy, setProcessingHistoryBusy] = useState(false)
  const [processingHistoryFilter, setProcessingHistoryFilter] = useState<ProcessingHistoryFilter>(
    {}
  )
  const [processingHistoryWeeklySummary, setProcessingHistoryWeeklySummary] =
    useState<ProcessingHistoryWeeklySummary | null>(null)
  const [downloadsLogLines, setDownloadsLogLines] = useState<DownloadsLogLineView[]>([])
  const [downloadsLogTargetRowId, setDownloadsLogTargetRowId] = useState<number | null>(null)
  const [downloadsOutputDirectory, setDownloadsOutputDirectory] = useState<{
    path: string
    isDefault: boolean
  } | null>(null)
  const {
    downloadsEmbeddedHistoryOpen,
    downloadsEmbeddedLogOpen,
    downloadsRailPanels,
    hydrateDownloadsWindowUiPanels,
    persistDownloadsEmbeddedHistoryOpen,
    persistDownloadsEmbeddedLogOpen,
    persistDownloadsRailPanelToggle
  } = useDownloadsWindowUiPanels()
  /** Совпадает с `max-width: 1100px` в `main.css` для вкладки «Загрузки». */
  const [downloadsNarrowLayout, setDownloadsNarrowLayout] = useState(false)
  const [terminalLine, setTerminalLine] = useState('ffmpeg -version')
  const [terminalBusy, setTerminalBusy] = useState(false)
  const [terminalHints, setTerminalHints] = useState<TerminalCommandHintEntry[]>([])
  const [terminalHintFilter, setTerminalHintFilter] = useState('')
  const terminalHintsSearchFieldId = useId()
  const downloadsMainUrlFieldId = useId()
  const terminalCommandInputId = useId()
  const [terminalHistory, setTerminalHistory] = useState<TerminalHistoryEntry[]>([])
  const [terminalSuggestFocus, setTerminalSuggestFocus] = useState(false)
  const [terminalSuggestIndex, setTerminalSuggestIndex] = useState(0)
  const terminalSuggestBlurTimeoutRef = useRef<number | undefined>(undefined)
  const [engineVersionsLine, setEngineVersionsLine] = useState('')
  const [exportBusy, setExportBusy] = useState(false)
  const [batchSnapshot, setBatchSnapshot] = useState<FfmpegExportBatchSnapshot | null>(null)
  const [batchDragRowId, setBatchDragRowId] = useState<number | null>(null)
  const batchExportBusy = batchSnapshot?.running === true
  const mediaPipelineBusy = exportBusy || batchExportBusy
  const [exportCancelBusy, setExportCancelBusy] = useState(false)
  const [exportEncodePreset, setExportEncodePreset] =
    useState<FfmpegExportEncodePresetId>('balance')
  const [exportVideoCodec, setExportVideoCodec] = useState<FfmpegExportVideoCodecId>('libx264')
  const [hwEncoderProbe, setHwEncoderProbe] = useState<FfmpegHwEncodersProbeResult | null>(null)
  const [exportContainer, setExportContainer] = useState<FfmpegExportContainerId>('mp4')
  const [exportCrf, setExportCrf] = useState<number | null>(null)
  const [exportVideoBitrate, setExportVideoBitrate] = useState<string | null>(null)
  const [exportAudioMode, setExportAudioMode] = useState<FfmpegExportAudioModeId>('aac')
  const [exportAudioBitrate, setExportAudioBitrate] = useState('192k')
  const [exportFps, setExportFps] = useState<number | null>(null)
  const [exportVideoTransform, setExportVideoTransform] =
    useState<FfmpegExportVideoTransformId>('none')
  const [exportCropPreset, setExportCropPreset] = useState<FfmpegExportCropPresetId>('none')
  const { panelOpen, hydrateMainWindowUiPanels, persistMainWindowUiPanelToggle } =
    useMainWindowUiPanels()
  const [exportScalePreset, setExportScalePreset] = useState<FfmpegExportScalePresetId>('source')
  /** §7.2 / v0 — двухпроходный libx264 только вместе с выбранным видеобитрейтом. */
  const [exportTwoPass, setExportTwoPass] = useState(false)
  const [exportEconomyMode, setExportEconomyMode] = useState(false)
  const [exportHwDecode, setExportHwDecode] = useState(false)
  const [exportExtraArgsLine, setExportExtraArgsLine] = useState('')
  const [editorUrlPasteBehavior, setEditorUrlPasteBehavior] = useState<EditorUrlPasteBehaviorId>(
    DEFAULT_EDITOR_URL_PASTE_BEHAVIOR
  )
  const [batchOutputSuffix, setBatchOutputSuffix] = useState(
    DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX
  )
  const [batchOutputDirectory, setBatchOutputDirectory] = useState('')
  /** §7.2 — сдвиг громкости в дБ (`-filter:a volume`); `0` означает «без фильтра». */
  const [exportAudioGainDb, setExportAudioGainDb] = useState<number>(0)
  /** §7.2 — добавить `-map_metadata -1` (очистить контейнерные tag-ы). */
  const [exportStripMetadata, setExportStripMetadata] = useState(false)
  /** §7.2 — добавить `-map_chapters -1` (очистить главы). */
  const [exportStripChapters, setExportStripChapters] = useState(false)
  /** §7.2 — режим субтитров: `drop` (по умолчанию) или `copy` (`-c:s copy`/`mov_text`). */
  const [exportSubtitleMode, setExportSubtitleMode] = useState<FfmpegExportSubtitleModeId>('drop')
  /** §7.2 — `yadif` после crop и до hqdn3d. */
  const [exportVideoDeinterlace, setExportVideoDeinterlace] =
    useState<FfmpegExportVideoDeinterlaceId>('off')
  /** §7.2 — пресет `hqdn3d` denoise. */
  const [exportVideoDenoise, setExportVideoDenoise] = useState<FfmpegExportVideoDenoiseId>('off')
  /** §7.2 — пресет `deband` (полосы/ступени). */
  const [exportVideoDeband, setExportVideoDeband] = useState<FfmpegExportVideoDebandId>('off')
  /** §7.2 — `histeq` после deband и до lut3d. */
  const [exportVideoHisteq, setExportVideoHisteq] = useState<FfmpegExportVideoHisteqId>('off')
  /** §7.2 — bundled `lut3d` (между deband и unsharp). */
  const [exportVideoLut3d, setExportVideoLut3d] = useState<FfmpegExportVideoLut3dId>('off')
  /** Абсолютный путь к `.cube` для превью argv (main `resolveFfmpegExportLutCubeAbsPath`). */
  const [lutCubePathForPreview, setLutCubePathForPreview] = useState<string | null>(null)
  /** §7.2 — пресет `unsharp` контурной резкости. */
  const [exportVideoSharpen, setExportVideoSharpen] = useState<FfmpegExportVideoSharpenId>('off')
  /** §7.2 — пресет `eq=` цветокоррекции. */
  const [exportVideoEqPreset, setExportVideoEqPreset] = useState<FfmpegExportVideoEqPresetId>('off')
  /** §7.2 — пресет `hue` сразу после `eq`, до зерна. */
  const [exportVideoHue, setExportVideoHue] = useState<FfmpegExportVideoHueId>('off')
  /** §7.2 — пресет `noise` (зернистость после eq, до scale). */
  const [exportVideoGrain, setExportVideoGrain] = useState<FfmpegExportVideoGrainId>('off')
  const [exportVideoVignette, setExportVideoVignette] = useState<FfmpegExportVideoVignetteId>('off')
  const [exportVideoBlur, setExportVideoBlur] = useState<FfmpegExportVideoBlurId>('off')
  /** §7.2 — нормализация громкости через whitelist фильтров. */
  const [exportAudioNormalize, setExportAudioNormalize] =
    useState<FfmpegExportAudioNormalizeId>('off')
  /** §7.2 — сохранённые пользователем наборы параметров тулбара (preview/spawn используют те же поля). */
  const [exportUserPresets, setExportUserPresets] = useState<FfmpegExportUserPreset[]>([])
  /** Выбранный в `<select>` пользовательский пресет; ручные правки тулбара сбрасывают выбор. */
  const [selectedUserPresetId, setSelectedUserPresetId] = useState<string | null>(null)
  const selectedExportUserPreset = useMemo(
    () =>
      selectedUserPresetId
        ? exportUserPresets.find((p) => p.id === selectedUserPresetId)
        : undefined,
    [exportUserPresets, selectedUserPresetId]
  )
  const [exportPresetNameDialog, setExportPresetNameDialog] = useState<ExportPresetNameDialog>(null)
  const [lastExportPath, setLastExportPath] = useState<string | null>(null)
  const [lastSnapshotPath, setLastSnapshotPath] = useState<string | null>(null)
  const [snapshotFormat, setSnapshotFormat] = useState<FfmpegSnapshotFormatId>('png')
  const [snapshotBusy, setSnapshotBusy] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  /** Стек видео+транспорт+таймлайн: цель fullscreen по референсу v0. */
  const previewStackRef = useRef<HTMLDivElement>(null)
  /** §6 / узкая ширина: `scrollIntoView` к панели настроек yt-dlp под очередью. */
  const downloadsSettingsRailRef = useRef<HTMLElement | null>(null)
  const downloadsLogNextIdRef = useRef(1)
  const terminalHistoryNextIdRef = useRef(1)
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
  const visibleDownloadsHistory = useMemo(
    () =>
      downloadsHistoryOutcomeFilter === 'all'
        ? downloadsHistory
        : downloadsHistory.filter((entry) => entry.outcome === downloadsHistoryOutcomeFilter),
    [downloadsHistory, downloadsHistoryOutcomeFilter]
  )
  const downloadsStatusFilterChips = useMemo(
    (): Array<{ id: DownloadsStatusFilter; label: string }> => [
      { id: 'all', label: uiText('downloadsQueueFilterAll') },
      { id: 'running', label: uiText('downloadsQueueFilterRunning') },
      { id: 'done', label: uiText('downloadsQueueFilterDone') },
      { id: 'error', label: uiText('downloadsQueueFilterError') },
      { id: 'cancelled', label: uiText('downloadsQueueFilterCancelled') }
    ],
    []
  )
  const ffmpegExportSelectOptions = useMemo(
    () => ({
      encodePresets: [
        { id: 'balance', label: uiText('editorExportEncodeBalance') },
        { id: 'smaller', label: uiText('editorExportEncodeSmaller') },
        { id: 'quality', label: uiText('editorExportEncodeQuality') }
      ] as Array<{ id: FfmpegExportEncodePresetId; label: string }>,
      videoCodecs: (() => {
        const v: Array<{ id: FfmpegExportVideoCodecId; label: string }> = [
          { id: 'libx264', label: uiText('editorExportCodecH264') },
          { id: 'libx265', label: uiText('editorExportCodecH265') },
          { id: 'libvpx-vp9', label: uiText('editorExportCodecVp9') },
          { id: 'libsvtav1', label: uiText('editorExportCodecSvtav1') },
          { id: 'libaom-av1', label: uiText('editorExportCodecAomav1') },
          { id: 'librav1e', label: uiText('editorExportCodecLibrav1e') },
          { id: 'prores_ks', label: uiText('editorExportCodecProresKs') },
          { id: 'dnxhd', label: uiText('editorExportCodecDnxhd') },
          { id: 'ffv1', label: uiText('editorExportCodecFfv1') },
          { id: 'hw_auto', label: uiText('editorExportCodecHwAuto') },
          { id: 'hw_auto_hevc', label: uiText('editorExportCodecHwAutoHevc') }
        ]
        if (hwEncoderProbe?.ok === true) {
          for (const id of FFMPEG_HW_VIDEO_ENCODER_IDS) {
            if (hwEncoderProbe.snapshot[id]) {
              v.push({ id, label: id })
            }
          }
        } else if (isFfmpegHwExportVideoCodec(exportVideoCodec)) {
          v.push({ id: exportVideoCodec, label: `${exportVideoCodec} (?)` })
        }
        return v
      })(),
      containers: [
        { id: 'mp4', label: uiText('editorExportContainerMp4') },
        { id: 'mkv', label: uiText('editorExportContainerMkv') },
        { id: 'mov', label: uiText('editorExportContainerMov') }
      ] as Array<{ id: FfmpegExportContainerId; label: string }>,
      scalePresets: [
        { id: 'source', label: uiText('editorExportScaleSource') },
        { id: '480p', label: uiText('editorExportScale480p') },
        { id: '720p', label: uiText('editorExportScale720p') },
        { id: '1080p', label: uiText('editorExportScale1080p') }
      ] as Array<{ id: FfmpegExportScalePresetId; label: string }>,
      videoTransforms: [
        { id: 'none', label: uiText('editorExportTransformNone') },
        { id: 'cw90', label: uiText('editorExportTransformCw90') },
        { id: 'ccw90', label: uiText('editorExportTransformCcw90') },
        { id: 'r180', label: uiText('editorExportTransformR180') },
        { id: 'hflip', label: uiText('editorExportTransformHflip') },
        { id: 'vflip', label: uiText('editorExportTransformVflip') }
      ] as Array<{ id: FfmpegExportVideoTransformId; label: string }>,
      cropPresets: [
        { id: 'none', label: uiText('editorExportCropNone') },
        { id: 'center-square', label: uiText('editorExportCropCenterSquare') },
        { id: 'center-16-9', label: uiText('editorExportCropCenter169') },
        { id: 'center-4-3', label: uiText('editorExportCropCenter43') }
      ] as Array<{ id: FfmpegExportCropPresetId; label: string }>,
      audioGainOptions: [
        { value: -12, label: uiText('editorExportAudioGainM12') },
        { value: -9, label: uiText('editorExportAudioGainM9') },
        { value: -6, label: uiText('editorExportAudioGainM6') },
        { value: -3, label: uiText('editorExportAudioGainM3') },
        { value: 0, label: uiText('editorExportAudioGain0') },
        { value: 3, label: uiText('editorExportAudioGainP3') },
        { value: 6, label: uiText('editorExportAudioGainP6') },
        { value: 9, label: uiText('editorExportAudioGainP9') },
        { value: 12, label: uiText('editorExportAudioGainP12') }
      ],
      subtitleModes: [
        { id: 'drop', label: uiText('editorExportSubtitleDrop') },
        { id: 'copy', label: uiText('editorExportSubtitleCopy') }
      ] as Array<{ id: FfmpegExportSubtitleModeId; label: string }>,
      videoDeinterlace: [
        { id: 'off', label: uiText('editorExportDeinterlaceOff') },
        { id: 'frame', label: uiText('editorExportDeinterlaceFrame') },
        { id: 'field', label: uiText('editorExportDeinterlaceField') }
      ] as Array<{ id: FfmpegExportVideoDeinterlaceId; label: string }>,
      videoDenoise: [
        { id: 'off', label: uiText('editorExportDenoiseOff') },
        { id: 'light', label: uiText('editorExportDenoiseLight') },
        { id: 'medium', label: uiText('editorExportDenoiseMedium') },
        { id: 'strong', label: uiText('editorExportDenoiseStrong') }
      ] as Array<{ id: FfmpegExportVideoDenoiseId; label: string }>,
      videoSharpen: [
        { id: 'off', label: uiText('editorExportSharpenOff') },
        { id: 'light', label: uiText('editorExportSharpenLight') },
        { id: 'medium', label: uiText('editorExportSharpenMedium') },
        { id: 'strong', label: uiText('editorExportSharpenStrong') }
      ] as Array<{ id: FfmpegExportVideoSharpenId; label: string }>,
      videoDeband: [
        { id: 'off', label: uiText('editorExportDebandOff') },
        { id: 'light', label: uiText('editorExportDebandLight') },
        { id: 'medium', label: uiText('editorExportDebandMedium') },
        { id: 'strong', label: uiText('editorExportDebandStrong') }
      ] as Array<{ id: FfmpegExportVideoDebandId; label: string }>,
      videoHisteq: [
        { id: 'off', label: uiText('editorExportHisteqOff') },
        { id: 'light', label: uiText('editorExportHisteqLight') },
        { id: 'medium', label: uiText('editorExportHisteqMedium') },
        { id: 'strong', label: uiText('editorExportHisteqStrong') }
      ] as Array<{ id: FfmpegExportVideoHisteqId; label: string }>,
      videoLut3d: [
        { id: 'off', label: uiText('editorExportLut3dOff') },
        { id: 'film-warm', label: uiText('editorExportLut3dFilmWarm') },
        { id: 'film-cool', label: uiText('editorExportLut3dFilmCool') },
        { id: 'punch', label: uiText('editorExportLut3dPunch') }
      ] as Array<{ id: FfmpegExportVideoLut3dId; label: string }>,
      videoEq: [
        { id: 'off', label: uiText('editorExportEqOff') },
        { id: 'warm', label: uiText('editorExportEqWarm') },
        { id: 'cool', label: uiText('editorExportEqCool') },
        { id: 'vivid', label: uiText('editorExportEqVivid') },
        { id: 'flat', label: uiText('editorExportEqFlat') }
      ] as Array<{ id: FfmpegExportVideoEqPresetId; label: string }>,
      videoHue: [
        { id: 'off', label: uiText('editorExportHueOff') },
        { id: 'warmShift', label: uiText('editorExportHueWarmShift') },
        { id: 'coolShift', label: uiText('editorExportHueCoolShift') },
        { id: 'satBoost', label: uiText('editorExportHueSatBoost') }
      ] as Array<{ id: FfmpegExportVideoHueId; label: string }>,
      videoGrain: [
        { id: 'off', label: uiText('editorExportGrainOff') },
        { id: 'light', label: uiText('editorExportGrainLight') },
        { id: 'medium', label: uiText('editorExportGrainMedium') },
        { id: 'strong', label: uiText('editorExportGrainStrong') }
      ] as Array<{ id: FfmpegExportVideoGrainId; label: string }>,
      videoVignette: [
        { id: 'off', label: uiText('editorExportVignetteOff') },
        { id: 'light', label: uiText('editorExportVignetteLight') },
        { id: 'medium', label: uiText('editorExportVignetteMedium') },
        { id: 'strong', label: uiText('editorExportVignetteStrong') }
      ] as Array<{ id: FfmpegExportVideoVignetteId; label: string }>,
      videoBlur: [
        { id: 'off', label: uiText('editorExportBlurOff') },
        { id: 'light', label: uiText('editorExportBlurLight') },
        { id: 'medium', label: uiText('editorExportBlurMedium') },
        { id: 'strong', label: uiText('editorExportBlurStrong') }
      ] as Array<{ id: FfmpegExportVideoBlurId; label: string }>,
      audioNormalize: [
        { id: 'off', label: uiText('editorExportAudioNormOff') },
        { id: 'loudnorm', label: uiText('editorExportAudioNormLoudnorm') },
        { id: 'dynaudnorm', label: uiText('editorExportAudioNormDynaudnorm') }
      ] as Array<{ id: FfmpegExportAudioNormalizeId; label: string }>,
      audioModes: [
        { id: 'aac', label: uiText('editorExportAudioModeAac') },
        { id: 'libmp3lame', label: uiText('editorExportAudioModeLibmp3lame') },
        { id: 'ac3', label: uiText('editorExportAudioModeAc3') },
        { id: 'copy', label: uiText('editorExportAudioModeCopy') },
        { id: 'pcm_s16le', label: uiText('editorExportAudioModePcmS16le') },
        { id: 'libvorbis', label: uiText('editorExportAudioModeLibvorbis') },
        { id: 'libopus', label: uiText('editorExportAudioModeLibopus') },
        { id: 'flac', label: uiText('editorExportAudioModeFlac') },
        { id: 'alac', label: uiText('editorExportAudioModeAlac') },
        { id: 'none', label: uiText('editorExportAudioModeNone') }
      ] as Array<{ id: FfmpegExportAudioModeId; label: string }>,
      snapshotFormats: [
        { id: 'png', label: uiText('editorExportSnapshotPng') },
        { id: 'jpg', label: uiText('editorExportSnapshotJpg') }
      ] as Array<{ id: FfmpegSnapshotFormatId; label: string }>
    }),
    [hwEncoderProbe, exportVideoCodec]
  )
  const exportVideoCodecResolvedForPreview = useMemo(
    () =>
      resolveFfmpegExportVideoCodecForArgv(exportVideoCodec, probeSnapshotOrEmpty(hwEncoderProbe)),
    [exportVideoCodec, hwEncoderProbe]
  )
  const exportExtraArgsParsed = useMemo(
    () => parseFfmpegExportExtraArgsLine(exportExtraArgsLine, getUiLocale()),
    [exportExtraArgsLine]
  )
  const exportHwaccelDecodeForPreview = useMemo(() => {
    if (!exportHwDecode) {
      return null
    }
    const hwaccels = hwEncoderProbe?.ok === true ? hwEncoderProbe.hwaccels : []
    return resolveFfmpegExportHwaccelForDecode(exportVideoCodecResolvedForPreview, hwaccels)
  }, [exportHwDecode, hwEncoderProbe, exportVideoCodecResolvedForPreview])
  const exportCodecStatusbarLabel = useMemo(() => {
    let label = uiTextVars('editorStatusbarCodec', { codec: exportVideoCodecResolvedForPreview })
    if (exportHwaccelDecodeForPreview) {
      label += uiTextVars('editorStatusbarHwDecode', { method: exportHwaccelDecodeForPreview })
    }
    return label
  }, [exportVideoCodecResolvedForPreview, exportHwaccelDecodeForPreview])
  const refreshDownloadsOptions = useCallback(async (): Promise<void> => {
    const res = await window.fluxalloy.downloads.getCliOptions({
      uiLocale: getUiLocale() as DownloadsWindowUiLocale
    })
    if (res.ok) {
      setDownloadsOptions(res.payload)
      return
    }
    setStatusHint(res.error)
  }, [getUiLocale])

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

  const downloadsHintUiLocale = getUiLocale() as DownloadsWindowUiLocale

  const ytdlpCommandHintsFilteredByCategory = useMemo(
    () =>
      groupYtdlpCommandHintsByCategory(
        downloadsOptions?.commandHints,
        downloadsExpertHintFilter,
        downloadsHintUiLocale
      ),
    [downloadsOptions?.commandHints, downloadsExpertHintFilter, downloadsHintUiLocale]
  )

  const terminalMergedSortedHints = useMemo(() => {
    const ext = previewPathExtensionLower(currentSourcePath)
    const mediaInPreview = Boolean(
      ext && (TERMINAL_HINT_VIDEO_EXTS.has(ext) || TERMINAL_HINT_AUDIO_EXTS.has(ext))
    )
    const scenarioPrefix: TerminalCommandHintEntry[] = [
      ...(workspaceTab === 'downloads' ? TERMINAL_SCENARIO_HINTS_DOWNLOADS : []),
      ...(workspaceTab === 'editor' || workspaceTab === 'terminal'
        ? mediaInPreview
          ? TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA
          : []
        : [])
    ]
    const merged = [...scenarioPrefix, ...terminalHints]
    return [...merged].sort((a, b) => {
      const ra = terminalHintToolRank(a.tool, workspaceTab, mediaInPreview)
      const rb = terminalHintToolRank(b.tool, workspaceTab, mediaInPreview)
      if (ra !== rb) {
        return ra - rb
      }
      return a.tool.localeCompare(b.tool) || a.token.localeCompare(b.token, 'ru')
    })
  }, [terminalHints, currentSourcePath, workspaceTab])

  const visibleTerminalHints = useMemo(() => {
    const q = terminalHintFilter.trim().toLowerCase()
    const filtered = terminalMergedSortedHints.filter((hint) => {
      if (q === '') return true
      return (
        hint.tool.toLowerCase().includes(q) ||
        hint.token.toLowerCase().includes(q) ||
        hint.summary.toLowerCase().includes(q) ||
        (hint.fullLine !== undefined && hint.fullLine.toLowerCase().includes(q))
      )
    })
    return filtered.slice(0, 36)
  }, [terminalHintFilter, terminalMergedSortedHints])

  const terminalInlineSuggestions = useMemo(
    () =>
      filterTerminalInlineSuggestions({
        line: terminalLine,
        hints: terminalMergedSortedHints,
        max: DEFAULT_TERMINAL_INLINE_SUGGEST_MAX
      }),
    [terminalLine, terminalMergedSortedHints]
  )

  const terminalSuggestActiveIndex = useMemo(() => {
    const len = terminalInlineSuggestions.length
    if (len === 0) {
      return 0
    }
    return Math.min(terminalSuggestIndex, len - 1)
  }, [terminalInlineSuggestions, terminalSuggestIndex])

  const appendTerminalToken = useCallback((token: string) => {
    setTerminalLine((line) => {
      const trimmed = line.trimEnd()
      return trimmed ? `${trimmed} ${token}` : token
    })
  }, [])

  const applyTerminalSuggest = useCallback((hint: TerminalCommandHintEntry) => {
    setTerminalLine((prev) => applyTerminalInlinePick({ line: prev, hint }))
  }, [])

  const runTerminalLine = useCallback(async (): Promise<void> => {
    const line = terminalLine.trim()
    if (!line || terminalBusy) {
      return
    }
    setTerminalBusy(true)
    try {
      const result = await window.fluxalloy.terminal.run({
        line,
        currentFilePath: currentSourcePath,
        uiLocale: getUiLocale() as DownloadsWindowUiLocale
      })
      setTerminalHistory((rows) =>
        [{ id: terminalHistoryNextIdRef.current++, line, result }, ...rows].slice(0, 20)
      )
      setStatusHint(
        result.ok
          ? uiTextVars('statusTerminalCliExitOk', {
              code: String(result.code ?? uiText('commonNotApplicableShort'))
            })
          : uiTextVars('statusTerminalCliFailed', { error: result.error })
      )
    } finally {
      setTerminalBusy(false)
    }
  }, [terminalBusy, terminalLine, currentSourcePath])

  const copyTerminalOutputLine = useCallback(async (line: string): Promise<void> => {
    const r = await window.fluxalloy.clipboard.writeText(line)
    setStatusHint(
      r.ok ? uiText('statusTerminalOutputLineCopied') : uiText('statusTerminalOutputLineCopyFailed')
    )
  }, [])

  const appendDownloadsExtraArgsToken = useCallback(
    (token: string) => {
      if (!downloadsOptions) return
      const cur = downloadsOptions.extraArgsLine.trim()
      const next = cur ? `${cur} ${token}` : token
      setDownloadsOptions({ ...downloadsOptions, extraArgsLine: next })
      void applyDownloadsOptionsPatch({ extraArgsLine: next })
    },
    [downloadsOptions, applyDownloadsOptionsPatch]
  )

  const refreshDownloadsHistory = useCallback(async (): Promise<void> => {
    setDownloadsHistoryBusy(true)
    try {
      const [rows, summary] = await Promise.all([
        window.fluxalloy.downloads.getHistory(),
        window.fluxalloy.downloads.getHistoryWeeklySummary()
      ])
      setDownloadsHistory(rows)
      setDownloadsHistoryWeeklySummary(summary)
    } finally {
      setDownloadsHistoryBusy(false)
    }
  }, [])

  const refreshProcessingHistory = useCallback(
    async (filter: ProcessingHistoryFilter = processingHistoryFilter): Promise<void> => {
      setProcessingHistoryBusy(true)
      try {
        const [rows, summary] = await Promise.all([
          window.fluxalloy.processingHistory.get({ ...filter, limit: 100 }),
          window.fluxalloy.processingHistory.weeklySummary()
        ])
        setProcessingHistory(rows)
        setProcessingHistoryWeeklySummary(summary)
      } finally {
        setProcessingHistoryBusy(false)
      }
    },
    [processingHistoryFilter]
  )

  const applyProcessingHistoryFilter = useCallback(
    (next: ProcessingHistoryFilter): void => {
      setProcessingHistoryFilter(next)
      void refreshProcessingHistory(next)
    },
    [refreshProcessingHistory]
  )

  const exportVisibleProcessingHistory = useCallback(async (): Promise<void> => {
    const payload = {
      schema: 1,
      exportedAt: Date.now(),
      filter: processingHistoryFilter,
      weeklySummary: processingHistoryWeeklySummary,
      entries: processingHistory
    }
    const res = await window.fluxalloy.saveTextWithDialog({
      title: uiText('processingHistoryExportDialogTitle'),
      defaultFileName: 'fluxalloy-processing-history.json',
      content: JSON.stringify(payload, null, 2)
    })
    if (res.ok) {
      setStatusHint(uiText('processingHistoryExportSaved'))
    } else if ('error' in res) {
      setStatusHint(res.error)
    }
  }, [processingHistory, processingHistoryFilter, processingHistoryWeeklySummary])

  const exportVisibleDownloadsHistory = useCallback(async (): Promise<void> => {
    const payload = {
      schema: 1,
      exportedAt: Date.now(),
      outcomeFilter: downloadsHistoryOutcomeFilter,
      entries: visibleDownloadsHistory
    }
    const res = await window.fluxalloy.saveTextWithDialog({
      title: uiText('downloadsHistoryExportDialogTitle'),
      defaultFileName: 'fluxalloy-downloads-history.json',
      content: JSON.stringify(payload, null, 2)
    })
    if (res.ok) {
      setStatusHint(uiText('downloadsHistoryExportSaved'))
    } else if ('error' in res) {
      setStatusHint(res.error)
    }
  }, [downloadsHistoryOutcomeFilter, visibleDownloadsHistory])

  const handleDownloadsRailSectionToggle = useCallback(
    (key: DownloadsRailPanelKey) => {
      return (e: SyntheticEvent<HTMLDetailsElement>): void => {
        const open = e.currentTarget.open
        persistDownloadsRailPanelToggle(key, open)
      }
    },
    [persistDownloadsRailPanelToggle]
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
    setStatusHint(null)
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
      const detail = previewVideoMediaErrorDetailLabel(code)
      window.fluxalloy.log.send({
        level: 'error',
        scope: 'preview/video',
        message: `video element error code=${code} detail=${detail} path=${preview.path} mediaUrl=${preview.mediaUrl} playbackUrl=${previewBlobUrl ?? preview.mediaUrl}`
      })
      if (previewBlobUrl) {
        setStatusHint(uiTextVars('statusVideoPlayFailed', { detail }))
        return
      }

      setStatusHint(uiText('statusVideoDirectOpenFailedBlobTrying'))
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
          setStatusHint(uiText('statusVideoBlobFallbackActive'))
          window.fluxalloy.log.send({
            level: 'info',
            scope: 'preview/video',
            message: `blob fallback ready size=${blob.size} type=${blob.type || 'unknown'} path=${preview.path}`
          })
        })
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : String(error)
          setStatusHint(uiTextVars('statusVideoPlayFailedAfterFallback', { detail }))
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

  const handleAddDownloadsFromMain = useCallback(async (): Promise<void> => {
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
    setStatusHint(
      added > 0
        ? uiTextVars('statusDownloadsUrlsAdded', { n: String(added) })
        : uiText('statusDownloadsQueueNoUrlsParsed')
    )
    if (added > 0) {
      setDownloadsUrl('')
    }
  }, [downloadsUrl])

  const handleQuickYtdlpEnqueueLines = useCallback(async (): Promise<void> => {
    const text = downloadsUrl.trim()
    if (text.length === 0) {
      setStatusHint(uiText('statusDownloadsQueueNoUrlsParsed'))
      return
    }
    const addRes = await window.fluxalloy.downloads.addLines(text)
    if (!addRes.ok) {
      setStatusHint(addRes.error)
      return
    }
    const added = addRes.added
    setStatusHint(
      added > 0
        ? uiTextVars('statusDownloadsUrlsAdded', { n: String(added) })
        : uiText('statusDownloadsQueueNoUrlsParsed')
    )
    if (added > 0) {
      setDownloadsUrl('')
    }
  }, [downloadsUrl])

  const handleDownloadFirstUrlOpenInEditor = useCallback(async (): Promise<void> => {
    const text = downloadsUrl.trim()
    if (text.length === 0) {
      setStatusHint(uiText('statusDownloadOpenEditorNeedUrl'))
      return
    }
    setStatusHint(uiText('statusDownloadOpenEditorWorking'))
    const res = await window.fluxalloy.downloads.downloadFirstUrlOpenInMainEditor(text)
    if (!res.ok) {
      setStatusHint(res.error)
      return
    }
    setWorkspaceTab('editor')
    setStatusHint(uiText('statusDownloadOpenEditorSuccess'))
    setDownloadsUrl('')
  }, [downloadsUrl])

  const setBatchAddStatusHint = useCallback(
    (counts: { added: number; skipped: number }, emptyMsg?: string): void => {
      if (counts.added === 0 && counts.skipped === 0) {
        setStatusHint(emptyMsg ?? uiText('batchExportNoVideoPaths'))
        return
      }
      if (counts.added === 0 && counts.skipped > 0) {
        setStatusHint(
          uiTextVars('batchExportSkippedDuplicates', { count: String(counts.skipped) })
        )
        return
      }
      if (counts.skipped > 0) {
        setStatusHint(
          uiTextVars('batchExportAddedFilesWithSkipped', {
            added: String(counts.added),
            skipped: String(counts.skipped)
          })
        )
        return
      }
      setStatusHint(uiTextVars('batchExportAddedFiles', { count: String(counts.added) }))
    },
    []
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

  const jumpToTrimExport = useCallback((): void => {
    persistMainWindowUiPanelToggle('ffmpegSettingsRailOpen', true)
    persistMainWindowUiPanelToggle('ffmpegOutput', true)
    persistMainWindowUiPanelToggle('exportCommandPreview', true)
    const scroll = (): void => {
      document.getElementById('editor-ffmpeg-export-output')?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scroll()
        window.setTimeout(scroll, 160)
      })
    })
  }, [persistMainWindowUiPanelToggle])

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
    void window.fluxalloy.downloads
      .getCliOptions({ uiLocale: getUiLocale() as DownloadsWindowUiLocale })
      .then((res) => {
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
  }, [getUiLocale])

  useEffect(() => {
    let mounted = true
    void Promise.all([
      window.fluxalloy.downloads.getHistory(),
      window.fluxalloy.downloads.getHistoryWeeklySummary()
    ]).then(([rows, summary]) => {
      if (mounted) {
        setDownloadsHistory(rows)
        setDownloadsHistoryWeeklySummary(summary)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true
    void Promise.all([
      window.fluxalloy.processingHistory.get({ limit: 100 }),
      window.fluxalloy.processingHistory.weeklySummary()
    ]).then(([rows, summary]) => {
      if (mounted) {
        setProcessingHistory(rows)
        setProcessingHistoryWeeklySummary(summary)
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

  const refetchHwEncoders = useCallback((): Promise<void> => {
    return window.fluxalloy.engines.probeHwEncoders().then((r) => {
      setHwEncoderProbe(r)
      setExportVideoCodec((codec) => {
        if (codec === 'hw_auto' || codec === 'hw_auto_hevc') {
          return codec
        }
        if (!isFfmpegHwExportVideoCodec(codec)) {
          return codec
        }
        if (r.ok === true && r.snapshot[codec]) {
          return codec
        }
        void window.fluxalloy.settings.setFfmpegExportVideoCodec('libx264').catch(console.error)
        return 'libx264'
      })
    })
  }, [])

  useEffect(() => {
    let mounted = true
    void window.fluxalloy.terminal.getHints().then((hints) => {
      if (mounted) {
        setTerminalHints(hints)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    void refetchHwEncoders()
  }, [refetchHwEncoders])

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
    const vcodec = parseFfmpegExportVideoCodec(loaded.ffmpegExportVideoCodec)
    setExportVideoCodec(vcodec)
    let nextContainer: FfmpegExportContainerId =
      ec === 'mp4' || ec === 'mkv' || ec === 'mov' ? ec : 'mp4'
    if (cpuFfmpegVideoCodecRequiresMkv(vcodec) && nextContainer !== 'mkv') {
      nextContainer = 'mkv'
      void window.fluxalloy.settings.setFfmpegExportContainer('mkv').catch(console.error)
    }
    if (ffmpegExportVideoCodecRequiresMov(vcodec) && nextContainer !== 'mov') {
      nextContainer = 'mov'
      void window.fluxalloy.settings.setFfmpegExportContainer('mov').catch(console.error)
    }
    let nextAudioMode: FfmpegExportAudioModeId = 'aac'
    if (loaded.ffmpegExportAudioMode === 'none') {
      nextAudioMode = 'none'
    } else if (loaded.ffmpegExportAudioMode === 'libmp3lame') {
      nextAudioMode = 'libmp3lame'
    } else if (loaded.ffmpegExportAudioMode === 'ac3') {
      nextAudioMode = 'ac3'
    } else if (loaded.ffmpegExportAudioMode === 'copy') {
      nextAudioMode = 'copy'
    } else if (loaded.ffmpegExportAudioMode === 'pcm_s16le') {
      nextAudioMode = 'pcm_s16le'
    } else if (loaded.ffmpegExportAudioMode === 'libvorbis') {
      nextAudioMode = 'libvorbis'
    } else if (loaded.ffmpegExportAudioMode === 'libopus') {
      nextAudioMode = 'libopus'
    } else if (loaded.ffmpegExportAudioMode === 'flac') {
      nextAudioMode = 'flac'
    } else if (loaded.ffmpegExportAudioMode === 'alac') {
      nextAudioMode = 'alac'
    }
    if (ffmpegExportAudioModeRequiresMkv(nextAudioMode) && nextContainer !== 'mkv') {
      nextContainer = 'mkv'
      void window.fluxalloy.settings.setFfmpegExportContainer('mkv').catch(console.error)
    }
    setExportContainer(nextContainer)
    setExportAudioMode(nextAudioMode)
    setExportTwoPass(loaded.ffmpegExportTwoPass === true && bitrateOk && vcodec === 'libx264')
    setExportEconomyMode(loaded.ffmpegExportEconomyMode === true)
    setExportHwDecode(loaded.ffmpegExportHwDecode === true)
    setExportExtraArgsLine(
      typeof loaded.ffmpegExportExtraArgsLine === 'string'
        ? loaded.ffmpegExportExtraArgsLine
        : ''
    )
    setEditorUrlPasteBehavior(parseEditorUrlPasteBehavior(loaded.editorUrlPasteBehavior))
    setBatchOutputSuffix(
      typeof loaded.ffmpegExportBatchOutputSuffix === 'string' &&
        loaded.ffmpegExportBatchOutputSuffix.trim().length > 0
        ? loaded.ffmpegExportBatchOutputSuffix.trim()
        : DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX
    )
    setBatchOutputDirectory(
      typeof loaded.ffmpegExportBatchOutputDirectory === 'string'
        ? loaded.ffmpegExportBatchOutputDirectory.trim()
        : ''
    )
    if (
      typeof loaded.ffmpegExportAudioBitrate === 'string' &&
      EXPORT_AUDIO_BITRATES.includes(loaded.ffmpegExportAudioBitrate)
    ) {
      setExportAudioBitrate(loaded.ffmpegExportAudioBitrate)
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
    if (
      typeof loaded.ffmpegExportAudioGainDb === 'number' &&
      Number.isInteger(loaded.ffmpegExportAudioGainDb) &&
      loaded.ffmpegExportAudioGainDb >= -24 &&
      loaded.ffmpegExportAudioGainDb <= 24 &&
      loaded.ffmpegExportAudioGainDb !== 0
    ) {
      setExportAudioGainDb(loaded.ffmpegExportAudioGainDb)
    } else {
      setExportAudioGainDb(0)
    }
    setExportStripMetadata(loaded.ffmpegExportStripMetadata === true)
    setExportStripChapters(loaded.ffmpegExportStripChapters === true)
    setExportSubtitleMode(loaded.ffmpegExportSubtitleMode === 'copy' ? 'copy' : 'drop')
    const deint = loaded.ffmpegExportVideoDeinterlace
    setExportVideoDeinterlace(deint === 'frame' || deint === 'field' ? deint : 'off')
    const dn = loaded.ffmpegExportVideoDenoise
    setExportVideoDenoise(dn === 'light' || dn === 'medium' || dn === 'strong' ? dn : 'off')
    const db = loaded.ffmpegExportVideoDeband
    setExportVideoDeband(db === 'light' || db === 'medium' || db === 'strong' ? db : 'off')
    const hi = loaded.ffmpegExportVideoHisteq
    setExportVideoHisteq(hi === 'light' || hi === 'medium' || hi === 'strong' ? hi : 'off')
    const sh = loaded.ffmpegExportVideoSharpen
    setExportVideoSharpen(sh === 'light' || sh === 'medium' || sh === 'strong' ? sh : 'off')
    const eq = loaded.ffmpegExportVideoEqPreset
    setExportVideoEqPreset(
      eq === 'warm' || eq === 'cool' || eq === 'vivid' || eq === 'flat' ? eq : 'off'
    )
    const hu = loaded.ffmpegExportVideoHue
    setExportVideoHue(hu === 'warmShift' || hu === 'coolShift' || hu === 'satBoost' ? hu : 'off')
    const gr = loaded.ffmpegExportVideoGrain
    setExportVideoGrain(gr === 'light' || gr === 'medium' || gr === 'strong' ? gr : 'off')
    const vg = loaded.ffmpegExportVideoVignette
    setExportVideoVignette(vg === 'light' || vg === 'medium' || vg === 'strong' ? vg : 'off')
    const bl = loaded.ffmpegExportVideoBlur
    setExportVideoBlur(bl === 'light' || bl === 'medium' || bl === 'strong' ? bl : 'off')
    const an = loaded.ffmpegExportAudioNormalize
    setExportAudioNormalize(an === 'loudnorm' || an === 'dynaudnorm' ? an : 'off')
    const lut = loaded.ffmpegExportVideoLut3d
    setExportVideoLut3d(lut === 'film-warm' || lut === 'film-cool' || lut === 'punch' ? lut : 'off')
  }, [])

  useEffect(() => {
    let cancelled = false
    void window.fluxalloy.export.resolveBundledLutCubePath(exportVideoLut3d).then((p) => {
      if (!cancelled) {
        setLutCubePathForPreview(p)
      }
    })
    return () => {
      cancelled = true
    }
  }, [exportVideoLut3d])

  const bumpManualExportEdit = useCallback(() => {
    setSelectedUserPresetId(null)
  }, [])

  const buildCurrentExportSnapshot = useCallback((): FfmpegExportUserPresetSnapshot => {
    return {
      encodePreset: exportEncodePreset,
      ...(exportVideoCodec !== 'libx264' ? { videoCodec: exportVideoCodec } : {}),
      container: exportContainer,
      crf: exportCrf,
      videoBitrate: exportVideoBitrate,
      audioMode: exportAudioMode,
      audioBitrate: exportAudioBitrate,
      fps: exportFps,
      scalePreset: exportScalePreset,
      videoTransform: exportVideoTransform,
      cropPreset: exportCropPreset,
      ...(exportTwoPass && exportVideoCodec === 'libx264' ? { twoPass: true as const } : {}),
      ...(exportEconomyMode ? { economyMode: true as const } : {}),
      ...(exportHwDecode ? { hwDecode: true as const } : {}),
      ...(exportExtraArgsLine.trim().length > 0 ? { extraArgsLine: exportExtraArgsLine.trim() } : {}),
      ...(exportAudioGainDb !== 0 ? { audioGainDb: exportAudioGainDb } : {}),
      ...(exportStripMetadata ? { stripMetadata: true } : {}),
      ...(exportStripChapters ? { stripChapters: true } : {}),
      ...(exportSubtitleMode === 'copy' ? { subtitleMode: 'copy' as const } : {}),
      ...(exportVideoDeinterlace !== 'off' ? { videoDeinterlace: exportVideoDeinterlace } : {}),
      ...(exportVideoDenoise !== 'off' ? { videoDenoise: exportVideoDenoise } : {}),
      ...(exportVideoDeband !== 'off' ? { videoDeband: exportVideoDeband } : {}),
      ...(exportVideoHisteq !== 'off' ? { videoHisteq: exportVideoHisteq } : {}),
      ...(exportVideoLut3d !== 'off' ? { videoLut3d: exportVideoLut3d } : {}),
      ...(exportVideoSharpen !== 'off' ? { videoSharpen: exportVideoSharpen } : {}),
      ...(exportVideoEqPreset !== 'off' ? { videoEqPreset: exportVideoEqPreset } : {}),
      ...(exportVideoHue !== 'off' ? { videoHue: exportVideoHue } : {}),
      ...(exportVideoGrain !== 'off' ? { videoGrain: exportVideoGrain } : {}),
      ...(exportVideoVignette !== 'off' ? { videoVignette: exportVideoVignette } : {}),
      ...(exportVideoBlur !== 'off' ? { videoBlur: exportVideoBlur } : {}),
      ...(exportAudioNormalize !== 'off' ? { audioNormalize: exportAudioNormalize } : {})
    }
  }, [
    exportEncodePreset,
    exportVideoCodec,
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
    exportEconomyMode,
    exportHwDecode,
    exportExtraArgsLine,
    exportAudioGainDb,
    exportStripMetadata,
    exportStripChapters,
    exportSubtitleMode,
    exportVideoDeinterlace,
    exportVideoDenoise,
    exportVideoDeband,
    exportVideoHisteq,
    exportVideoLut3d,
    exportVideoSharpen,
    exportVideoEqPreset,
    exportVideoHue,
    exportVideoGrain,
    exportVideoVignette,
    exportVideoBlur,
    exportAudioNormalize
  ])

  const handleSaveExportUserPreset = useCallback(() => {
    if (exportUserPresets.length >= FFMPEG_EXPORT_USER_PRESETS_MAX_ENTRIES) {
      setStatusHint(uiText('editorExportUserPresetsMaxTotalStatus'))
      return
    }
    const userAdded = exportUserPresets.filter((p) => !isBuiltinExportUserPresetId(p.id)).length
    if (userAdded >= FFMPEG_EXPORT_USER_ADDED_PRESETS_MAX) {
      setStatusHint(uiText('editorExportUserPresetsMaxStatus'))
      return
    }
    setExportPresetNameDialog({
      mode: 'create',
      value: uiText('editorExportPresetDefaultName'),
      error: null
    })
  }, [exportUserPresets])

  const handleDeleteExportUserPreset = useCallback(() => {
    if (!selectedUserPresetId) {
      return
    }
    if (isBuiltinExportUserPresetId(selectedUserPresetId)) {
      setStatusHint(uiText('editorBuiltinPresetLockedHint'))
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
    if (isBuiltinExportUserPresetId(selectedUserPresetId)) {
      setStatusHint(uiText('editorBuiltinPresetLockedHint'))
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
        prev === null ? null : { ...prev, error: uiText('editorExportPresetErrorEmpty') }
      )
      return
    }
    const safeLabel = label.slice(0, 64)
    if (exportPresetNameDialog.mode === 'create') {
      if (exportUserPresets.length >= FFMPEG_EXPORT_USER_PRESETS_MAX_ENTRIES) {
        setExportPresetNameDialog((prev) =>
          prev === null ? null : { ...prev, error: uiText('editorExportPresetErrorMaxTotal') }
        )
        return
      }
      const userAdded = exportUserPresets.filter((p) => !isBuiltinExportUserPresetId(p.id)).length
      if (userAdded >= FFMPEG_EXPORT_USER_ADDED_PRESETS_MAX) {
        setExportPresetNameDialog((prev) =>
          prev === null ? null : { ...prev, error: uiText('editorExportPresetErrorMax') }
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
    if (isBuiltinExportUserPresetId(selectedUserPresetId)) {
      setStatusHint(uiText('editorBuiltinPresetLockedHint'))
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
      const loc = getUiLocale() as DownloadsWindowUiLocale
      const snapshot = await window.fluxalloy.engines.getStatus(loc)
      setEngineSummary(summarizeEngines(snapshot.engines))
      setEngineVersionsLine(formatEngineVersionsLine(snapshot))
      const need = await window.fluxalloy.engines.shouldOfferDownload()
      setEnginesOfferDownload(need)
      await refetchHwEncoders()
    } catch {
      setEngineSummary('error')
      setEngineVersionsLine('')
    }
  }, [refetchHwEncoders])

  useEffect(() => {
    let cleanupTheme: (() => void) | undefined
    let cleanupUiPanels: (() => void) | undefined
    void (async () => {
      const loaded = await window.fluxalloy.settings.get()
      const { resolved, shouldPersist } = applyPersistedUiLocale(loaded)
      setUiLocaleRenderTick((n) => n + 1)
      if (shouldPersist) {
        void window.fluxalloy.settings.setUiLocale(resolved)
      }
      applyTheme(loaded.effectiveTheme)
      hydrateExportFieldsFromSettings(loaded)
      hydrateMainWindowUiPanels(loaded.mainWindowUiPanels)
      hydrateDownloadsWindowUiPanels(loaded.downloadsWindowUiPanels)
      setExportUserPresets(loaded.ffmpegExportUserPresets ?? [])
      if (loaded.ffmpegSnapshotFormat === 'jpg') {
        setSnapshotFormat('jpg')
      }
      cleanupTheme = window.fluxalloy.onThemeChanged((next) => {
        applyTheme(next)
      })
      cleanupUiPanels = window.fluxalloy.onMainWindowUiPanelsChanged((panels) => {
        hydrateMainWindowUiPanels(panels)
      })
    })().catch(console.error)

    return (): void => {
      cleanupTheme?.()
      cleanupUiPanels?.()
    }
  }, [
    applyTheme,
    hydrateDownloadsWindowUiPanels,
    hydrateExportFieldsFromSettings,
    hydrateMainWindowUiPanels
  ])

  useEffect(() => {
    const off = window.fluxalloy.onUiLocaleChanged((loc) => {
      setUiLocaleForSession(loc)
      setUiLocaleRenderTick((n) => n + 1)
    })
    return off
  }, [])

  useEffect(() => {
    const off = window.fluxalloy.downloads.onDownloadsWindowUiPanelsChanged((panels) => {
      hydrateDownloadsWindowUiPanels(panels)
    })
    return off
  }, [hydrateDownloadsWindowUiPanels])

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
      } else {
        setProbeInfo(null)
        setStatusHint(uiTextVars('statusPreviewProbeFailedTemplate', { error: r.error }))
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
        const trimmed = raw.trim()
        if (editorUrlPasteBehavior === 'download_open_editor') {
          setWorkspaceTab('editor')
          setDownloadsUrl(trimmed)
          setStatusHint(uiText('statusDownloadOpenEditorWorking'))
          void window.fluxalloy.downloads.downloadFirstUrlOpenInMainEditor(trimmed).then((res) => {
            if (!res.ok) {
              setStatusHint(res.error)
              return
            }
            setDownloadsUrl('')
            setStatusHint(uiText('statusDownloadOpenEditorSuccess'))
          })
          return
        }
        void window.fluxalloy.downloads.openWindow({ text: trimmed, uiLocale: getUiLocale() })
      })
    }

    document.addEventListener('keydown', onKeyDown)
    return (): void => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [editorUrlPasteBehavior])

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return
    }
    const mql = window.matchMedia('(max-width: 1100px)')
    const sync = (): void => {
      setDownloadsNarrowLayout(mql.matches)
    }
    sync()
    mql.addEventListener('change', sync)
    return (): void => {
      mql.removeEventListener('change', sync)
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
      const vc =
        typeof p.videoCodecUsed === 'string' && p.videoCodecUsed.trim() !== ''
          ? `${p.videoCodecUsed.trim()} · `
          : ''
      const batch =
        typeof p.batchRowId === 'number'
          ? uiTextVars('statusExportBatchRow', { id: String(p.batchRowId) }) + ' · '
          : ''
      setStatusHint(
        uiTextVars('statusExportProgress', { tail: `${batch}${pct}${spd}${vc}${p.message}` })
      )
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

  useEffect(() => {
    void window.fluxalloy.batchExport.getSnapshot().then(setBatchSnapshot).catch(console.error)
    return window.fluxalloy.batchExport.onSnapshot((snap) => {
      setBatchSnapshot((prev) => {
        if (prev?.running === true && snap.running === false) {
          void refreshProcessingHistory()
        }
        return snap
      })
    })
  }, [refreshProcessingHistory])

  const buildCurrentFfmpegExportOverrides = useCallback(
    () => ({
      encodePreset: exportEncodePreset,
      videoCodec: exportVideoCodec,
      container: exportContainer,
      crf: exportCrf,
      videoBitrate: exportVideoBitrate,
      audioMode: exportAudioMode,
      audioBitrate: exportAudioBitrate,
      fps: exportFps,
      scalePreset: exportScalePreset,
      videoTransform: exportVideoTransform,
      cropPreset: exportCropPreset,
      twoPass: exportTwoPass && exportVideoBitrate !== null && exportVideoCodec === 'libx264',
      economyMode: exportEconomyMode,
      hwDecode: exportHwDecode,
      extraArgsLine: exportExtraArgsLine,
      audioGainDb: exportAudioGainDb === 0 ? null : exportAudioGainDb,
      stripMetadata: exportStripMetadata,
      stripChapters: exportStripChapters,
      subtitleMode: exportSubtitleMode,
      videoDeinterlace: exportVideoDeinterlace,
      videoDenoise: exportVideoDenoise,
      videoDeband: exportVideoDeband,
      videoHisteq: exportVideoHisteq,
      videoLut3d: exportVideoLut3d,
      videoSharpen: exportVideoSharpen,
      videoEqPreset: exportVideoEqPreset,
      videoHue: exportVideoHue,
      videoGrain: exportVideoGrain,
      videoVignette: exportVideoVignette,
      videoBlur: exportVideoBlur,
      audioNormalize: exportAudioNormalize
    }),
    [
      exportEncodePreset,
      exportVideoCodec,
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
      exportEconomyMode,
      exportHwDecode,
      exportExtraArgsLine,
      exportAudioGainDb,
      exportStripMetadata,
      exportStripChapters,
      exportSubtitleMode,
      exportVideoDeinterlace,
      exportVideoDenoise,
      exportVideoDeband,
      exportVideoHisteq,
      exportVideoLut3d,
      exportVideoSharpen,
      exportVideoEqPreset,
      exportVideoHue,
      exportVideoGrain,
      exportVideoVignette,
      exportVideoBlur,
      exportAudioNormalize
    ]
  )

  async function handleBatchOpenOutput(
    outputPath: string,
    mode: 'file' | 'folder' | 'preview'
  ): Promise<void> {
    const res = await window.fluxalloy.export.openOutput(outputPath, mode)
    if (!res.ok) {
      setStatusHint(uiTextVars('statusExportFailedWithDetail', { detail: res.error }))
      return
    }
    if (mode === 'preview') {
      setWorkspaceTab('editor')
    }
  }

  async function handleBatchOpenInput(
    inputPath: string,
    mode: 'file' | 'folder' | 'preview'
  ): Promise<void> {
    const res = await window.fluxalloy.batchExport.openInput(inputPath, mode)
    if (!res.ok) {
      setStatusHint(uiTextVars('statusExportFailedWithDetail', { detail: res.error }))
      return
    }
    if (mode === 'preview') {
      setWorkspaceTab('editor')
      setStatusHint(uiText('processingHistoryOpenInputDone'))
    }
  }

  async function handleBatchPickFiles(): Promise<void> {
    const res = await window.fluxalloy.batchExport.pickFiles()
    if (res.ok) {
      setBatchAddStatusHint(res)
      return
    }
    if ('cancelled' in res && res.cancelled) {
      return
    }
    if ('error' in res) {
      setStatusHint(res.error)
    }
  }

  async function handleBatchPickFolder(): Promise<void> {
    const res = await window.fluxalloy.batchExport.pickFolder()
    if (res.ok) {
      setBatchAddStatusHint(res)
      return
    }
    if ('cancelled' in res && res.cancelled) {
      return
    }
    if ('error' in res) {
      setStatusHint(res.error)
    }
  }

  async function handleBatchPickOutputFolder(): Promise<void> {
    const picked = await window.fluxalloy.batchExport.pickOutputFolder()
    if (!picked.ok) {
      return
    }
    const s = await window.fluxalloy.settings.setFfmpegExportBatchOutputDirectory(picked.path)
    setBatchOutputDirectory(
      typeof s.ffmpegExportBatchOutputDirectory === 'string'
        ? s.ffmpegExportBatchOutputDirectory
        : ''
    )
  }

  async function handleBatchClearOutputDirectory(): Promise<void> {
    const s = await window.fluxalloy.settings.setFfmpegExportBatchOutputDirectory(null)
    setBatchOutputDirectory(
      typeof s.ffmpegExportBatchOutputDirectory === 'string'
        ? s.ffmpegExportBatchOutputDirectory
        : ''
    )
  }

  async function handleBatchRevealSharedOutputFolder(): Promise<void> {
    const res = await window.fluxalloy.batchExport.revealSharedOutputFolder()
    if (!res.ok) {
      setStatusHint(res.error)
    }
  }

  async function handleBatchDropFiles(files: FileList | null): Promise<void> {
    if (!files || files.length === 0 || batchExportBusy) {
      return
    }
    const paths: string[] = []
    for (let i = 0; i < files.length; i += 1) {
      const file = files.item(i)
      if (!file) {
        continue
      }
      const absolutePath = window.fluxalloy.preview.getPathForFile(file)
      if (absolutePath) {
        paths.push(absolutePath)
      }
    }
    if (paths.length === 0) {
      return
    }
    const res = await window.fluxalloy.batchExport.addPaths(paths)
    if (res.ok) {
      setBatchAddStatusHint(res)
    } else if ('error' in res) {
      setStatusHint(res.error)
    }
  }

  async function handleBatchStart(): Promise<void> {
    if (mediaPipelineBusy) {
      return
    }
    const res = await window.fluxalloy.batchExport.start(buildCurrentFfmpegExportOverrides())
    if (!res.ok) {
      setStatusHint(res.error)
      return
    }
    setStatusHint(uiText('batchExportStarted'))
  }

  async function handleBatchCancel(): Promise<void> {
    await window.fluxalloy.batchExport.cancel()
    setStatusHint(uiText('batchExportCancelled'))
  }

  async function handleBatchRetryFailed(): Promise<void> {
    const res = await window.fluxalloy.batchExport.retryFailed()
    if (!res.ok) {
      setStatusHint(res.error)
      return
    }
    if (res.reset === 0) {
      setStatusHint(uiText('batchExportNothingToRetry'))
      return
    }
    setStatusHint(uiTextVars('batchExportRetriedFailed', { count: String(res.reset) }))
  }

  async function handleBatchClearCompleted(): Promise<void> {
    const res = await window.fluxalloy.batchExport.clearCompleted()
    if (!res.ok) {
      setStatusHint(res.error)
      return
    }
    if (res.removed > 0) {
      setStatusHint(uiTextVars('batchExportClearedCompleted', { count: String(res.removed) }))
    }
  }

  async function handleBatchAddCurrentPreview(): Promise<void> {
    const path = preview?.path
    if (!path || !isFfmpegExportBatchVideoPath(path)) {
      setStatusHint(uiText('batchExportNoVideoPaths'))
      return
    }
    const res = await window.fluxalloy.batchExport.addPaths([path])
    if (res.ok) {
      setBatchAddStatusHint(res)
    } else if ('error' in res) {
      setStatusHint(res.error)
    }
  }

  async function handleBatchAddDownloadsDone(ids?: number[]): Promise<void> {
    const res = await window.fluxalloy.batchExport.addFromDownloadsDone(ids)
    if (!res.ok) {
      setStatusHint(res.error)
      return
    }
    setBatchAddStatusHint(res)
  }

  async function handleBatchRetryFailedAndStart(): Promise<void> {
    if (mediaPipelineBusy) {
      return
    }
    const res = await window.fluxalloy.batchExport.retryFailedAndStart(
      buildCurrentFfmpegExportOverrides()
    )
    if (!res.ok) {
      setStatusHint(res.error)
      return
    }
    setStatusHint(uiText('batchExportStarted'))
  }

  async function handleBatchCopyInputPaths(): Promise<void> {
    const listed = await window.fluxalloy.batchExport.listInputPaths()
    if (listed.paths.length === 0) {
      setStatusHint(uiText('batchExportEmpty'))
      return
    }
    const text = listed.paths.join('\r\n')
    const written = await window.fluxalloy.clipboard.writeText(text)
    if (!written.ok) {
      setStatusHint(uiText('batchExportCopyPathsFailed'))
      return
    }
    setStatusHint(uiTextVars('batchExportCopiedPaths', { count: String(listed.paths.length) }))
  }

  async function handleBatchCopyOutputPaths(): Promise<void> {
    const listed = await window.fluxalloy.batchExport.listOutputPaths()
    if (listed.paths.length === 0) {
      setStatusHint(uiText('batchExportNoOutputPaths'))
      return
    }
    const text = listed.paths.join('\r\n')
    const written = await window.fluxalloy.clipboard.writeText(text)
    if (!written.ok) {
      setStatusHint(uiText('batchExportCopyPathsFailed'))
      return
    }
    setStatusHint(uiTextVars('batchExportCopiedOutputPaths', { count: String(listed.paths.length) }))
  }

  async function handleBatchCopyRowPath(path: string, kind: 'in' | 'out'): Promise<void> {
    const written = await window.fluxalloy.clipboard.writeText(path)
    if (!written.ok) {
      setStatusHint(uiText('batchExportCopyPathsFailed'))
      return
    }
    setStatusHint(
      kind === 'in' ? uiText('batchExportCopiedRowInputPath') : uiText('batchExportCopiedRowOutputPath')
    )
  }

  async function handleBatchSaveReport(): Promise<void> {
    const snap = batchSnapshot ?? (await window.fluxalloy.batchExport.getSnapshot())
    if (snap.rows.length === 0) {
      setStatusHint(uiText('batchExportEmpty'))
      return
    }
    const loc = getUiLocale() === 'en' ? 'en' : 'ru'
    const res = await window.fluxalloy.saveTextWithDialog({
      title: uiText('batchExportSaveReportTitle'),
      defaultFileName: uiText('batchExportSaveReportDefaultName'),
      content: formatFfmpegExportBatchReportText(snap, loc)
    })
    if (res.ok) {
      setStatusHint(uiTextVars('batchExportReportSaved', { path: res.path }))
    } else if ('error' in res) {
      setStatusHint(res.error)
    }
  }

  async function handleBatchRemoveWaiting(): Promise<void> {
    const res = await window.fluxalloy.batchExport.removeWaiting()
    if (!res.ok) {
      setStatusHint(res.error)
      return
    }
    if (res.removed > 0) {
      setStatusHint(uiTextVars('batchExportRemovedWaiting', { count: String(res.removed) }))
    }
  }

  async function toggleTheme(): Promise<void> {
    const s = await window.fluxalloy.settings.get()
    if (s.theme === 'system') {
      void window.fluxalloy.settings.setTheme(s.effectiveTheme === 'dark' ? 'light' : 'dark')
    } else {
      void window.fluxalloy.settings.setTheme(s.theme === 'dark' ? 'light' : 'dark')
    }
  }

  const handleUiLocaleToggle = useCallback((): void => {
    const next: DownloadsWindowUiLocale = getUiLocale() === 'ru' ? 'en' : 'ru'
    void window.fluxalloy.settings
      .setUiLocale(next)
      .then(() => {
        setUiLocaleForSession(next)
        setUiLocaleRenderTick((n) => n + 1)
      })
      .catch(console.error)
  }, [])

  async function handleOpenToolbar(): Promise<void> {
    const result = await window.fluxalloy.preview.openFileDialog(
      getUiLocale() as DownloadsWindowUiLocale
    )
    if (result.ok) {
      applyPreview(result)
    }
  }

  async function handleOpenVideoFolderToolbar(): Promise<void> {
    const result = await window.fluxalloy.preview.openVideoFolderDialog(
      getUiLocale() as DownloadsWindowUiLocale
    )
    if (result.ok) {
      applyPreview(result)
    } else if ('error' in result && typeof result.error === 'string' && result.error.length > 0) {
      setStatusHint(result.error)
    }
  }

  async function handleEnginesDownload(): Promise<void> {
    setEngineDownloadBusy(true)
    setStatusHint(uiText('statusEnginesDownloadPreparing'))
    try {
      const res = await window.fluxalloy.engines.download(getUiLocale() as DownloadsWindowUiLocale)
      if (!res.ok) {
        setStatusHint(uiTextVars('statusErrorWithDetail', { detail: res.error }))
        return
      }

      await refreshEngineUi()
      setStatusHint(uiText('statusEnginesDownloadedOk'))
    } catch (error) {
      setStatusHint(
        error instanceof Error ? error.message : uiText('statusEnginesDownloadFailedGeneric')
      )
    } finally {
      setEngineDownloadBusy(false)
    }
  }

  async function handleClearDownloadedEngines(): Promise<void> {
    setStatusHint(uiText('statusEnginesClearingUserBin'))
    try {
      const res = await window.fluxalloy.engines.clearUserBin()
      if (!res.ok) {
        setStatusHint(uiTextVars('statusErrorWithDetail', { detail: res.error }))
        return
      }
      await refreshEngineUi()
      setStatusHint(
        res.removed > 0
          ? uiTextVars('statusEnginesUserBinRemovedCount', { n: String(res.removed) })
          : uiText('statusEnginesUserBinNothingRemoved')
      )
    } catch (error) {
      setStatusHint(
        error instanceof Error ? error.message : uiText('statusEnginesClearUserBinFailedGeneric')
      )
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
    setStatusHint(uiText('statusEnginePathsSaved'))
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
    setStatusHint(uiText('statusSnapshotInProgress'))
    try {
      const res = await window.fluxalloy.preview.snapshotFrame({
        inputPath: preview.path,
        timeSec,
        uiLocale: getUiLocale()
      })
      void refreshProcessingHistory()
      if (res.ok) {
        const savedName = res.path.split(/[\\/]/).pop() || res.path
        setLastSnapshotPath(res.path)
        setStatusHint(uiTextVars('statusSnapshotSaved', { name: savedName }))
      } else if ('cancelled' in res && res.cancelled) {
        setStatusHint(null)
      } else if ('error' in res) {
        setStatusHint(uiTextVars('statusSnapshotFailedWithDetail', { detail: res.error }))
      } else {
        setStatusHint(uiText('statusSnapshotFailedGeneric'))
      }
    } catch (e) {
      setStatusHint(e instanceof Error ? e.message : uiText('statusSnapshotExceptionGeneric'))
    } finally {
      setSnapshotBusy(false)
    }
  }

  async function handleExport(): Promise<void> {
    if (!preview || mediaPipelineBusy || snapshotBusy) {
      return
    }
    setExportBusy(true)
    setLastExportPath(null)
    setStatusHint(uiText('statusExportPreparing'))
    try {
      const trimSnap =
        trimSnapshotRef.current?.path === preview.path ? trimSnapshotRef.current.range : null
      const res = await window.fluxalloy.export.start({
        inputPath: preview.path,
        uiLocale: getUiLocale(),
        ...(trimSnap != null ? { trim: trimSnap } : {}),
        probeDurationSec: probeInfo?.durationSec ?? null,
        encodePreset: exportEncodePreset,
        videoCodec: exportVideoCodec,
        container: exportContainer,
        crf: exportCrf,
        videoBitrate: exportVideoBitrate,
        audioMode: exportAudioMode,
        audioBitrate: exportAudioBitrate,
        fps: exportFps,
        scalePreset: exportScalePreset,
        videoTransform: exportVideoTransform,
        cropPreset: exportCropPreset,
        twoPass: exportTwoPass && exportVideoBitrate !== null && exportVideoCodec === 'libx264',
        economyMode: exportEconomyMode,
        hwDecode: exportHwDecode,
        extraArgsLine: exportExtraArgsLine,
        audioGainDb: exportAudioGainDb === 0 ? null : exportAudioGainDb,
        stripMetadata: exportStripMetadata,
        stripChapters: exportStripChapters,
        subtitleMode: exportSubtitleMode,
        videoDeinterlace: exportVideoDeinterlace,
        videoDenoise: exportVideoDenoise,
        videoDeband: exportVideoDeband,
        videoHisteq: exportVideoHisteq,
        videoLut3d: exportVideoLut3d,
        videoSharpen: exportVideoSharpen,
        videoEqPreset: exportVideoEqPreset,
        videoHue: exportVideoHue,
        videoGrain: exportVideoGrain,
        videoVignette: exportVideoVignette,
        videoBlur: exportVideoBlur,
        audioNormalize: exportAudioNormalize
      })
      void refreshProcessingHistory()
      if (res.ok) {
        const savedName = res.path.split(/[\\/]/).pop() || res.path
        setLastExportPath(res.path)
        setStatusHint(uiTextVars('statusExportSaved', { name: savedName }))
      } else if ('cancelled' in res && res.cancelled) {
        setStatusHint(uiText('statusExportCancelled'))
      } else if ('error' in res) {
        setStatusHint(uiTextVars('statusExportFailedWithDetail', { detail: res.error }))
      } else {
        setStatusHint(uiText('statusExportFailedGeneric'))
      }
    } catch (e) {
      setStatusHint(e instanceof Error ? e.message : uiText('statusExportExceptionGeneric'))
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
    setStatusHint(uiText('statusExportCancelling'))
    const res = await window.fluxalloy.export.cancel()
    if (!res.ok) {
      setExportCancelBusy(false)
      setStatusHint(uiTextVars('statusExportFailedWithDetail', { detail: res.error }))
    }
  }

  async function handleOpenLastExport(mode: 'file' | 'folder' | 'preview'): Promise<void> {
    if (!lastExportPath || exportBusy || snapshotBusy) {
      return
    }
    const res = await window.fluxalloy.export.openOutput(lastExportPath, mode)
    if (!res.ok) {
      setStatusHint(uiTextVars('statusExportFailedWithDetail', { detail: res.error }))
    } else if (mode === 'preview') {
      setStatusHint(uiText('statusExportOpenedInPreview'))
    }
  }

  async function handleCopyLastExportPath(): Promise<void> {
    if (!lastExportPath) {
      return
    }
    const res = await window.fluxalloy.clipboard.writeText(lastExportPath)
    setStatusHint(res.ok ? uiText('statusExportPathCopied') : uiText('statusExportPathCopyFailed'))
  }

  async function handleOpenLastSnapshot(mode: 'file' | 'folder'): Promise<void> {
    if (!lastSnapshotPath || exportBusy || snapshotBusy) {
      return
    }
    const res = await window.fluxalloy.export.openOutput(lastSnapshotPath, mode)
    if (!res.ok) {
      setStatusHint(uiTextVars('statusSnapshotFailedWithDetail', { detail: res.error }))
    }
  }

  async function handleCopyLastSnapshotPath(): Promise<void> {
    if (!lastSnapshotPath) {
      return
    }
    const res = await window.fluxalloy.clipboard.writeText(lastSnapshotPath)
    setStatusHint(
      res.ok ? uiText('statusSnapshotPathCopied') : uiText('statusSnapshotPathCopyFailed')
    )
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
      videoCodec: exportVideoCodecResolvedForPreview,
      container: exportContainer,
      crf: exportCrf,
      videoBitrate: exportVideoBitrate,
      audioMode: exportAudioMode,
      audioBitrate: exportAudioBitrate,
      fps: exportFps,
      scalePreset: exportScalePreset,
      videoTransform: exportVideoTransform,
      cropPreset: exportCropPreset,
      twoPass:
        exportTwoPass &&
        exportVideoBitrate !== null &&
        exportVideoCodecResolvedForPreview === 'libx264',
      economyMode: exportEconomyMode,
      ...(exportHwaccelDecodeForPreview !== null
        ? { hwaccelDecode: exportHwaccelDecodeForPreview }
        : {}),
      ...(exportExtraArgsParsed.ok && exportExtraArgsParsed.args.length > 0
        ? { extraArgs: exportExtraArgsParsed.args }
        : {}),
      audioGainDb: exportAudioGainDb === 0 ? null : exportAudioGainDb,
      stripMetadata: exportStripMetadata,
      stripChapters: exportStripChapters,
      subtitleMode: exportSubtitleMode,
      videoDeinterlace: exportVideoDeinterlace,
      videoDenoise: exportVideoDenoise,
      videoDeband: exportVideoDeband,
      videoHisteq: exportVideoHisteq,
      ...(lutCubePathForPreview !== null && lutCubePathForPreview.trim() !== ''
        ? { videoLut3dCubeAbsPath: lutCubePathForPreview.trim() }
        : {}),
      videoSharpen: exportVideoSharpen,
      videoEqPreset: exportVideoEqPreset,
      videoHue: exportVideoHue,
      videoGrain: exportVideoGrain,
      videoVignette: exportVideoVignette,
      videoBlur: exportVideoBlur,
      audioNormalize: exportAudioNormalize,
      inputPath: sourcePath,
      outputPath,
      trim: trimRange,
      probeDurationSec: probeInfo?.durationSec ?? null
    })
  }, [
    preview?.path,
    exportEncodePreset,
    exportVideoCodecResolvedForPreview,
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
    exportEconomyMode,
    exportHwaccelDecodeForPreview,
    exportExtraArgsParsed,
    exportAudioGainDb,
    exportStripMetadata,
    exportStripChapters,
    exportSubtitleMode,
    exportVideoDeinterlace,
    exportVideoDenoise,
    exportVideoDeband,
    exportVideoHisteq,
    lutCubePathForPreview,
    exportVideoSharpen,
    exportVideoEqPreset,
    exportVideoHue,
    exportVideoGrain,
    exportVideoVignette,
    exportVideoBlur,
    exportAudioNormalize,
    trimRange,
    probeInfo?.durationSec
  ])

  const exportPreviewCommand = exportPreview.command

  function exportPreviewHint(): string {
    if (!exportExtraArgsParsed.ok) {
      return uiTextVars('editorExportExtraArgsParseError', { detail: exportExtraArgsParsed.error })
    }
    if (!preview) {
      return uiText('editorExportPreviewHintNoSource')
    }
    if (exportPreview.pass1Command) {
      return uiText('editorExportPreviewHintTwoPass')
    }
    if (exportPreview.appliedTrim && trimRange !== null) {
      const span = Math.max(0, trimRange.outSec - trimRange.inSec)
      return uiTextVars('editorExportPreviewHintTrimAppliedTemplate', {
        in: trimRange.inSec.toFixed(2),
        t: span.toFixed(2)
      })
    }
    if (trimRange !== null && probeInfo?.durationSec) {
      return uiText('editorExportPreviewHintTrimFull')
    }
    return uiText('editorExportPreviewHintTrimWaiting')
  }

  async function handleCopyExportPreview(): Promise<void> {
    const text = exportPreview.pass1Command
      ? `${exportPreview.pass1Command}\n\n${exportPreviewCommand}`
      : exportPreviewCommand
    const r = await window.fluxalloy.clipboard.writeText(text)
    setStatusHint(
      r.ok ? uiText('statusFfmpegCommandCopied') : uiText('statusFfmpegCommandCopyFailed')
    )
  }

  async function handlePreviewDrop(
    files: FileList | null,
    dataTransfer?: DataTransfer | null
  ): Promise<void> {
    const file = files?.[0]
    if (!file) {
      const urlText = dataTransfer?.getData('text/plain')?.trim() ?? ''
      if (clipboardLooksLikeDownloadsPayload(urlText)) {
        if (editorUrlPasteBehavior === 'download_open_editor') {
          setDownloadsUrl(urlText)
          setStatusHint(uiText('statusDownloadOpenEditorWorking'))
          const res = await window.fluxalloy.downloads.downloadFirstUrlOpenInMainEditor(urlText)
          if (!res.ok) {
            setStatusHint(res.error)
            return
          }
          setDownloadsUrl('')
          setStatusHint(uiText('statusDownloadOpenEditorSuccess'))
        } else {
          void window.fluxalloy.downloads.openWindow({ text: urlText, uiLocale: getUiLocale() })
        }
      }
      return
    }
    const absolutePath = window.fluxalloy.preview.getPathForFile(file)
    const granted = await window.fluxalloy.preview.grantPath(absolutePath)
    if (!granted.ok) {
      setStatusHint(uiTextVars('statusDndGrantFailed', { error: granted.error }))
      return
    }
    applyPreview(granted)
  }

  return (
    <div className="app-shell" aria-label={uiText('appMainShellAria')}>
      <header className="app-topbar" aria-label={uiText('topbarHeaderAria')}>
        <div className="app-topbar-brand" aria-label={uiText('topbarProductName')}>
          <span className="app-topbar-mark" aria-hidden>
            ◇
          </span>
          <span className="app-topbar-title">{uiText('topbarProductName')}</span>
        </div>
        <nav
          className="app-workspace-tabs"
          aria-label={uiText('workspaceTabsAria')}
          role="tablist"
          aria-orientation="horizontal"
        >
          <button
            type="button"
            id="workspace-tab-editor"
            className={`app-workspace-tab${workspaceTab === 'editor' ? ' app-workspace-tab-active' : ''}`}
            role="tab"
            aria-selected={workspaceTab === 'editor'}
            aria-controls="workspace-panel-editor"
            aria-describedby="workspace-tab-editor-desc"
            title={uiText('workspaceTabEditorTooltip')}
            onClick={() => {
              setWorkspaceTab('editor')
            }}
          >
            <span aria-hidden className="app-workspace-tab-glyph">
              <IconWorkspaceEditor title="" size={16} />
            </span>
            {uiText('workspaceTabEditor')}
            <span id="workspace-tab-editor-desc" className="app-visually-hidden">
              {uiText('editorWorkbenchAria')}
            </span>
          </button>
          <button
            type="button"
            id="workspace-tab-downloads"
            className={`app-workspace-tab${workspaceTab === 'downloads' ? ' app-workspace-tab-active' : ''}`}
            role="tab"
            aria-selected={workspaceTab === 'downloads'}
            aria-controls="workspace-panel-downloads"
            aria-describedby="workspace-tab-downloads-desc"
            onClick={() => {
              setWorkspaceTab('downloads')
            }}
            title={uiText('workspaceTabDownloadsTooltip')}
          >
            <span aria-hidden className="app-workspace-tab-glyph">
              <IconDownload title="" size={16} />
            </span>
            {uiText('workspaceTabDownloads')}
            <span id="workspace-tab-downloads-desc" className="app-visually-hidden">
              {uiText('downloadsWorkbenchAria')}
            </span>
          </button>
          <button
            type="button"
            id="workspace-tab-terminal"
            className={`app-workspace-tab${workspaceTab === 'terminal' ? ' app-workspace-tab-active' : ''}`}
            role="tab"
            aria-selected={workspaceTab === 'terminal'}
            aria-controls="workspace-panel-terminal"
            aria-describedby="workspace-tab-terminal-desc"
            onClick={() => {
              setWorkspaceTab('terminal')
            }}
            title={uiText('workspaceTabTerminalTooltip')}
          >
            <span aria-hidden className="app-workspace-tab-glyph">
              <IconWorkspaceTerminal title="" size={16} />
            </span>
            {uiText('workspaceTabTerminal')}
            <span id="workspace-tab-terminal-desc" className="app-visually-hidden">
              {uiText('terminalWorkbenchAria')}
            </span>
          </button>
        </nav>
        <div
          className="app-topbar-trailing"
          role="group"
          aria-label={uiText('topbarTrailingGroupAria')}
        >
          <div
            className="app-topbar-actions"
            role="toolbar"
            aria-orientation="horizontal"
            aria-label={uiText('topbarActionsToolbarAria')}
          >
            <button
              type="button"
              className="app-icon-btn"
              onClick={() => {
                void handleOpenVideoFolderToolbar()
              }}
              title={uiText('topbarOpenVideoFolderTitle')}
            >
              <IconFolder />
              <span className="app-visually-hidden">{uiText('topbarOpenVideoFolderLabel')}</span>
            </button>
            <button
              type="button"
              className="app-icon-btn"
              onClick={() => {
                void handleOpenToolbar()
              }}
              title={uiText('topbarOpenFileTitle')}
            >
              <IconFolderOpen />
              <span className="app-visually-hidden">{uiText('topbarOpenFileLabel')}</span>
            </button>
            <button
              type="button"
              className="app-icon-btn"
              onClick={() => {
                void window.fluxalloy.inspector.openWindow(preview?.path ?? null)
              }}
              title={uiText('topbarInspectorTitle')}
            >
              <IconFilm />
              <span className="app-visually-hidden">{uiText('topbarInspectorLabel')}</span>
            </button>
            {exportBusy ? (
              <button
                type="button"
                className="app-icon-btn app-icon-btn-warn"
                disabled={exportCancelBusy}
                aria-label={
                  exportCancelBusy
                    ? uiText('topbarExportCancelBusy')
                    : uiText('topbarExportCancelReady')
                }
                onClick={() => {
                  void handleCancelExport()
                }}
                title={uiText('topbarExportCancelTitle')}
              >
                <IconBan
                  title={
                    exportCancelBusy
                      ? uiText('topbarExportCancelBusy')
                      : uiText('topbarExportCancelReady')
                  }
                />
              </button>
            ) : null}
            {enginesOfferDownload ? (
              <button
                type="button"
                className="app-icon-btn app-icon-btn-warn"
                disabled={engineDownloadBusy}
                aria-label={
                  engineDownloadBusy
                    ? uiText('topbarEnginesDownloadBusy')
                    : uiText('topbarEnginesDownloadReady')
                }
                onClick={() => {
                  void handleEnginesDownload()
                }}
                title={uiText('topbarEnginesDownloadTitle')}
              >
                <IconCloudDownload
                  title={
                    engineDownloadBusy
                      ? uiText('topbarEnginesDownloadBusy')
                      : uiText('topbarEnginesDownloadReady')
                  }
                />
              </button>
            ) : null}
            <button
              type="button"
              className="app-icon-btn"
              onClick={() => {
                setEnginePathsOpen(true)
              }}
              title={uiText('topbarEnginePathsTitle')}
            >
              <IconSettings />
              <span className="app-visually-hidden">{uiText('topbarEnginePathsLabel')}</span>
            </button>
            <button
              type="button"
              className="app-icon-btn"
              onClick={() => {
                setKnowledgeInitialSlug(null)
                setKnowledgeOpen(true)
              }}
              title={uiText('knowledgeTopbarTooltip')}
            >
              <IconBook />
              <span className="app-visually-hidden">{uiText('topbarKnowledgeLabel')}</span>
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
              title={uiText('topbarAboutTitle')}
            >
              <IconCircleHelp />
              <span className="app-visually-hidden">{uiText('topbarAboutLabel')}</span>
            </button>
            <button
              type="button"
              className="app-icon-btn app-locale-badge"
              onClick={handleUiLocaleToggle}
              title={
                getUiLocale() === 'ru'
                  ? uiText('topbarUiLocaleSwitchToEnglishTitle')
                  : uiText('topbarUiLocaleSwitchToRussianTitle')
              }
            >
              <span aria-hidden>{getUiLocale() === 'ru' ? 'RU' : 'EN'}</span>
              <span className="app-visually-hidden">
                {getUiLocale() === 'ru'
                  ? uiText('topbarUiLocaleVisuallyHiddenRu')
                  : uiText('topbarUiLocaleVisuallyHiddenEn')}
              </span>
            </button>
            <button
              type="button"
              className="app-icon-btn"
              onClick={toggleTheme}
              title={uiText('topbarThemeToggleTitle')}
            >
              {theme === 'dark' ? <IconSun /> : <IconMoon />}
              <span className="app-visually-hidden">
                {theme === 'dark' ? uiText('topbarThemeUseLight') : uiText('topbarThemeUseDark')}
              </span>
            </button>
          </div>
        </div>
      </header>

      {workspaceTab === 'editor' ? (
        <details
          className="app-url-bar"
          aria-label={uiText('quickYtdlpAria')}
          open={panelOpen('quickYtdlp')}
          onToggle={(e) => {
            persistMainWindowUiPanelToggle('quickYtdlp', e.currentTarget.open)
          }}
        >
          <summary className="app-url-summary">{uiText('quickYtdlpSummary')}</summary>
          <div
            className="app-url-body"
            role="region"
            aria-labelledby="quick-ytdlp-region-title"
          >
            <h3 id="quick-ytdlp-region-title" className="app-visually-hidden">
              {uiText('quickYtdlpAria')}
            </h3>
            <div
              className="app-url-field"
              role="group"
              aria-label={uiText('quickYtdlpUrlFieldGroupAria')}
            >
              <textarea
                className="app-downloads-url-input app-url-input"
                placeholder={uiText('quickYtdlpPlaceholder')}
                aria-labelledby="quick-ytdlp-region-title"
                aria-describedby="quickYtdlpUrlHint"
                value={downloadsUrl}
                rows={3}
                onChange={(e) => {
                  setDownloadsUrl(e.target.value)
                }}
              />
              <p id="quickYtdlpUrlHint" className="app-url-hint">
                {uiText('quickYtdlpHint')}
              </p>
              <label className="app-field app-field-inline">
                <span>{uiText('editorUrlPasteBehaviorLabel')}</span>
                <select
                  className="app-control"
                  value={editorUrlPasteBehavior}
                  aria-describedby="quickYtdlpUrlHint"
                  onChange={(e) => {
                    const v = parseEditorUrlPasteBehavior(e.target.value)
                    setEditorUrlPasteBehavior(v)
                    void window.fluxalloy.settings.setEditorUrlPasteBehavior(v).catch(console.error)
                  }}
                >
                  <option value="downloads_window">
                    {uiText('editorUrlPasteBehaviorDownloads')}
                  </option>
                  <option value="download_open_editor">
                    {uiText('editorUrlPasteBehaviorOpenEditor')}
                  </option>
                </select>
              </label>
              <nav
                className="app-doc-inline-links app-url-bar-doc-links"
                aria-label={uiText('quickYtdlpDocNavAria')}
              >
                <a href={YTDLP_DOC_README} target="_blank" rel="noreferrer">
                  {uiText('docLinkYtDlpReadme')}
                </a>
                {' · '}
                <a href={YTDLP_DOC_FORMAT_SELECTION} target="_blank" rel="noreferrer">
                  {uiText('quickYtdlpDocFormats')}
                </a>
                {' · '}
                <a href={YTDLP_DOC_OUTPUT_TEMPLATE} target="_blank" rel="noreferrer">
                  {uiText('quickYtdlpDocOutputTemplate')}
                </a>
              </nav>
            </div>
            <div
              className="app-downloads-url-actions"
              role="toolbar"
              aria-orientation="horizontal"
              aria-label={uiText('quickYtdlpAria')}
            >
              <button
                type="button"
                className="app-btn app-btn-primary app-btn-icon-leading"
                aria-describedby="quickYtdlpUrlHint"
                onClick={() => {
                  void handleQuickYtdlpEnqueueLines()
                }}
              >
                <IconQueuePlus title="" size={17} />
                {uiText('quickYtdlpEnqueueLines')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-icon-leading"
                aria-describedby="quickYtdlpUrlHint"
                onClick={() => {
                  void handleDownloadFirstUrlOpenInEditor()
                }}
              >
                <IconDownload title="" size={17} />
                {uiText('quickYtdlpDownloadOpenEditor')}
              </button>
            </div>
          </div>
        </details>
      ) : null}

      {workspaceTab === 'editor' ? (
        <details
          className="app-url-bar app-batch-export-bar"
          aria-label={uiText('batchExportAria')}
          open={panelOpen('batchExport')}
          onToggle={(e) => {
            persistMainWindowUiPanelToggle('batchExport', e.currentTarget.open)
          }}
        >
          <summary className="app-url-summary">{uiText('batchExportSummary')}</summary>
          <div
            className="app-url-body"
            role="region"
            aria-labelledby="batch-export-region-title"
          >
            <h3 id="batch-export-region-title" className="app-visually-hidden">
              {uiText('batchExportAria')}
            </h3>
            <p id="batch-export-panel-hint" className="app-url-hint">
              {uiText('batchExportHint')}
            </p>
            <p id="batch-export-drop-hint" className="app-url-hint">
              {uiText('batchExportDragHint')}
            </p>
            <div
              className="app-batch-export-dropzone"
              aria-label={uiText('batchExportDropzoneAria')}
              aria-busy={batchExportBusy}
              aria-describedby="batch-export-panel-hint batch-export-drop-hint"
              onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                void handleBatchDropFiles(e.dataTransfer.files)
              }}
            >
              <div
                className="app-settings-grid app-batch-export-toolbar"
                role="group"
                aria-label={uiText('batchExportPanelFormGroupAria')}
              >
                <label className="app-field">
                  <span className="app-field-label-row">
                    <IconScissors size={16} aria-hidden />
                    {uiText('batchExportOutputSuffixLabel')}
                  </span>
                  <input
                    type="text"
                    className="app-control"
                    value={batchOutputSuffix}
                    disabled={batchExportBusy}
                    spellCheck={false}
                    title={uiText('batchExportOutputSuffixHint')}
                    aria-describedby="batch-export-suffix-hint"
                    onChange={(e) => {
                      setBatchOutputSuffix(e.target.value)
                    }}
                    onBlur={() => {
                      void window.fluxalloy.settings
                        .setFfmpegExportBatchOutputSuffix(batchOutputSuffix)
                        .then((s) => {
                          setBatchOutputSuffix(
                            typeof s.ffmpegExportBatchOutputSuffix === 'string' &&
                              s.ffmpegExportBatchOutputSuffix.trim().length > 0
                              ? s.ffmpegExportBatchOutputSuffix.trim()
                              : DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX
                          )
                        })
                        .catch(console.error)
                    }}
                  />
                  <span id="batch-export-suffix-hint" className="app-visually-hidden">
                    {uiText('batchExportOutputSuffixHint')}
                  </span>
                </label>
                <label className="app-field" style={{ gridColumn: '1 / -1' }}>
                  <span className="app-field-label-row">
                    <IconFolder size={16} aria-hidden />
                    {uiText('batchExportOutputDirLabel')}
                  </span>
                  <div className="app-batch-export-dir-row" role="group" aria-label={uiText('batchExportOutputDirRowGroupAria')}>
                    <input
                      type="text"
                      className="app-control"
                      readOnly
                      value={batchOutputDirectory}
                      placeholder={uiText('batchExportOutputDirPlaceholder')}
                      title={batchOutputDirectory || uiText('batchExportOutputDirPlaceholder')}
                      disabled={batchExportBusy}
                      aria-describedby="batch-export-outdir-hint"
                    />
                    <button
                      type="button"
                      className="app-btn app-btn-icon-leading"
                      disabled={batchExportBusy}
                      onClick={() => {
                        void handleBatchPickOutputFolder()
                      }}
                    >
                      <IconFolder size={16} aria-hidden />
                      {uiText('batchExportOutputDirPick')}
                    </button>
                    <button
                      type="button"
                      className="app-btn app-btn-icon-leading"
                      disabled={batchExportBusy || batchOutputDirectory.length === 0}
                      onClick={() => {
                        void handleBatchRevealSharedOutputFolder()
                      }}
                    >
                      <IconFolderOpen size={16} aria-hidden />
                      {uiText('batchExportOutputDirOpen')}
                    </button>
                    <button
                      type="button"
                      className="app-btn app-btn-icon-leading"
                      disabled={batchExportBusy || batchOutputDirectory.length === 0}
                      onClick={() => {
                        void handleBatchClearOutputDirectory()
                      }}
                    >
                      <IconHome size={16} aria-hidden />
                      {uiText('batchExportOutputDirClear')}
                    </button>
                  </div>
                  <span id="batch-export-outdir-hint" className="app-field-hint">
                    {uiText('batchExportOutputDirHint')}
                  </span>
                </label>
                <label className="app-field">
                  <span className="app-field-label-row">
                    <IconSettings size={16} aria-hidden />
                    {uiText('batchExportConcurrency')}
                  </span>
                  <select
                    className="app-control"
                    aria-describedby="batch-export-concurrency-hint"
                    value={String(batchSnapshot?.concurrency ?? 'auto')}
                    disabled={batchExportBusy}
                    onChange={(e) => {
                      const raw = e.target.value
                      let v: FfmpegExportBatchConcurrency = 'auto'
                      if (raw === '1') {
                        v = 1
                      } else if (raw === '2') {
                        v = 2
                      } else if (raw === '4') {
                        v = 4
                      }
                      void window.fluxalloy.batchExport.setConcurrency(v).catch(console.error)
                    }}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="auto">{uiText('batchExportConcurrencyAuto')}</option>
                  </select>
                  <span id="batch-export-concurrency-hint" className="app-field-help">
                    {uiText('batchExportConcurrencyHint')}
                  </span>
                </label>
              <div
                className="app-batch-export-actions"
                role="toolbar"
                aria-orientation="horizontal"
                aria-label={uiText('batchExportActionsToolbarAria')}
              >
                <button
                  type="button"
                  className="app-btn app-btn-icon-leading"
                  disabled={batchExportBusy}
                  onClick={() => {
                    void handleBatchPickFiles()
                  }}
                >
                  <IconQueueFile size={16} aria-hidden />
                  {uiText('batchExportAddFiles')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-icon-leading"
                  disabled={batchExportBusy}
                  onClick={() => {
                    void handleBatchPickFolder()
                  }}
                >
                  <IconFolderOpen size={16} aria-hidden />
                  {uiText('batchExportAddFolder')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-icon-leading"
                  disabled={batchExportBusy || !preview?.path}
                  onClick={() => {
                    void handleBatchAddCurrentPreview()
                  }}
                >
                  <IconFilm size={16} aria-hidden />
                  {uiText('batchExportAddCurrentPreview')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-icon-leading"
                  disabled={batchExportBusy}
                  onClick={() => {
                    void handleBatchAddDownloadsDone()
                  }}
                >
                  <IconDownload size={16} aria-hidden />
                  {uiText('batchExportAddDownloadsDone')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-primary app-btn-icon-leading"
                  disabled={batchExportBusy || (batchSnapshot?.rows.length ?? 0) === 0}
                  onClick={() => {
                    void handleBatchStart()
                  }}
                >
                  <IconPlay size={16} aria-hidden />
                  {uiText('batchExportStart')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-icon-leading"
                  disabled={!batchExportBusy}
                  onClick={() => {
                    void handleBatchCancel()
                  }}
                >
                  <IconBan size={16} aria-hidden />
                  {uiText('batchExportCancel')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-icon-leading"
                  disabled={batchExportBusy || (batchSnapshot?.completedError ?? 0) === 0}
                  onClick={() => {
                    void handleBatchRetryFailed()
                  }}
                >
                  <IconQueueRetry size={16} aria-hidden />
                  {uiText('batchExportRetryFailed')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-icon-leading"
                  disabled={batchExportBusy || (batchSnapshot?.completedError ?? 0) === 0}
                  onClick={() => {
                    void handleBatchRetryFailedAndStart()
                  }}
                >
                  <IconQueueRetry size={16} aria-hidden />
                  {uiText('batchExportRetryFailedAndStart')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-icon-leading"
                  disabled={batchExportBusy || (batchSnapshot?.completedOk ?? 0) === 0}
                  onClick={() => {
                    void handleBatchClearCompleted()
                  }}
                >
                  <IconQueueTrash size={16} aria-hidden />
                  {uiText('batchExportClearCompleted')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-icon-leading"
                  disabled={batchExportBusy || (batchSnapshot?.rows.length ?? 0) === 0}
                  onClick={() => {
                    void window.fluxalloy.batchExport.clear().catch(console.error)
                  }}
                >
                  <IconQueueTrash size={16} aria-hidden />
                  {uiText('batchExportClear')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-icon-leading"
                  disabled={(batchSnapshot?.rows.length ?? 0) === 0}
                  onClick={() => {
                    void handleBatchCopyInputPaths()
                  }}
                >
                  <IconCopy size={16} aria-hidden />
                  {uiText('batchExportCopyPaths')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-icon-leading"
                  disabled={
                    !(
                      batchSnapshot?.rows.some(
                        (r) => typeof r.outputPath === 'string' && r.outputPath.trim() !== ''
                      ) ?? false
                    )
                  }
                  onClick={() => {
                    void handleBatchCopyOutputPaths()
                  }}
                >
                  <IconCopy size={16} aria-hidden />
                  {uiText('batchExportCopyOutputPaths')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-icon-leading"
                  disabled={(batchSnapshot?.rows.length ?? 0) === 0}
                  onClick={() => {
                    void handleBatchSaveReport()
                  }}
                >
                  <IconSave size={16} aria-hidden />
                  {uiText('batchExportSaveReport')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-icon-leading"
                  disabled={batchExportBusy}
                  onClick={() => {
                    void handleBatchRemoveWaiting()
                  }}
                >
                  <IconQueueX size={16} aria-hidden />
                  {uiText('batchExportRemoveWaiting')}
                </button>
              </div>
              </div>
            <div
              role="region"
              aria-label={uiText('batchExportQueueTableZoneAria')}
              aria-busy={batchExportBusy}
            >
            {batchSnapshot && batchSnapshot.rows.length > 0 ? (
              <div
                className="app-batch-export-table-wrap"
                role="group"
                aria-label={uiText('batchExportTableWrapGroupAria')}
              >
              <table className="app-batch-export-table" aria-busy={batchExportBusy}>
                <caption className="app-visually-hidden">{uiText('batchExportTableCaption')}</caption>
                <thead>
                  <tr>
                    <th scope="col" id={BATCH_EXPORT_TABLE_HEADER_IDS.file}>
                      {uiText('batchExportColFile')}
                    </th>
                    <th scope="col" id={BATCH_EXPORT_TABLE_HEADER_IDS.status}>
                      {uiText('batchExportColStatus')}
                    </th>
                    <th scope="col" id={BATCH_EXPORT_TABLE_HEADER_IDS.output}>
                      {uiText('batchExportColOutput')}
                    </th>
                    <th scope="col" id={BATCH_EXPORT_TABLE_HEADER_IDS.progress}>
                      {uiText('batchExportColProgress')}
                    </th>
                    <th scope="col" id={BATCH_EXPORT_TABLE_HEADER_IDS.actions}>
                      {uiText('batchExportColActions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {batchSnapshot.rows.map((row, rowIndex) => (
                    <tr
                      key={row.id}
                      draggable={!batchExportBusy && row.status !== 'running'}
                      onDoubleClick={(e) => {
                        if ((e.target as HTMLElement).closest('button')) {
                          return
                        }
                        const td = (e.target as HTMLElement).closest('td')
                        const idx = td?.cellIndex ?? -1
                        const out =
                          typeof row.outputPath === 'string' ? row.outputPath.trim() : ''
                        if (idx === 2 && out.length > 0) {
                          void handleBatchOpenOutput(out, 'preview')
                          return
                        }
                        void handleBatchOpenInput(row.inputPath, 'preview')
                      }}
                      onDragStart={() => {
                        setBatchDragRowId(row.id)
                      }}
                      onDragEnd={() => {
                        setBatchDragRowId(null)
                      }}
                      onDragOver={(e) => {
                        if (!batchExportBusy && row.status !== 'running') {
                          e.preventDefault()
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        const fromId = batchDragRowId
                        setBatchDragRowId(null)
                        if (fromId === null || fromId === row.id) {
                          return
                        }
                        void window.fluxalloy.batchExport
                          .reorderRow(fromId, rowIndex)
                          .catch(console.error)
                      }}
                    >
                      <td headers={BATCH_EXPORT_TABLE_HEADER_IDS.file} title={row.inputPath}>
                        {row.shortLabel}
                      </td>
                      <td headers={BATCH_EXPORT_TABLE_HEADER_IDS.status}>
                        {formatFfmpegExportBatchStatusLabel(row.status)}
                      </td>
                      <td
                        headers={BATCH_EXPORT_TABLE_HEADER_IDS.output}
                        title={row.outputPath ?? undefined}
                      >
                        {row.outputPath
                          ? row.outputPath.replace(/^.*[\\/]/, '')
                          : '—'}
                      </td>
                      <td
                        headers={BATCH_EXPORT_TABLE_HEADER_IDS.progress}
                        title={row.status === 'error' ? row.progress : undefined}
                      >
                        {row.progress}
                      </td>
                      <td headers={BATCH_EXPORT_TABLE_HEADER_IDS.actions}>
                        <div
                          role="toolbar"
                          aria-orientation="horizontal"
                          aria-label={uiTextVars('batchExportRowActionsToolbarAriaTemplate', {
                            n: String(rowIndex + 1)
                          })}
                        >
                        <button
                          type="button"
                          className="app-btn app-btn-icon"
                          title={uiText('batchExportOpenInputInEditor')}
                          aria-label={uiText('batchExportOpenInputInEditor')}
                          onClick={() => {
                            void handleBatchOpenInput(row.inputPath, 'preview')
                          }}
                        >
                          <IconFilm aria-hidden />
                        </button>
                        <button
                          type="button"
                          className="app-btn app-btn-icon"
                          title={uiText('batchExportOpenInputFile')}
                          aria-label={uiText('batchExportOpenInputFile')}
                          onClick={() => {
                            void handleBatchOpenInput(row.inputPath, 'file')
                          }}
                        >
                          <IconPlay aria-hidden />
                        </button>
                        <button
                          type="button"
                          className="app-btn app-btn-icon"
                          title={uiText('batchExportOpenInputFolder')}
                          aria-label={uiText('batchExportOpenInputFolder')}
                          onClick={() => {
                            void handleBatchOpenInput(row.inputPath, 'folder')
                          }}
                        >
                          <IconFolderOpen aria-hidden />
                        </button>
                        <button
                          type="button"
                          className="app-btn app-btn-icon"
                          title={uiText('batchExportCopyRowInputPath')}
                          aria-label={uiText('batchExportCopyRowInputPath')}
                          onClick={() => {
                            void handleBatchCopyRowPath(row.inputPath, 'in')
                          }}
                        >
                          <IconCopy aria-hidden />
                        </button>
                        {row.outputPath ? (
                          <>
                            <button
                              type="button"
                              className="app-btn app-btn-icon"
                              title={uiText('batchExportOpenOutputInEditor')}
                              aria-label={uiText('batchExportOpenOutputInEditor')}
                              onClick={() => {
                                void handleBatchOpenOutput(row.outputPath as string, 'preview')
                              }}
                            >
                              <IconFilm aria-hidden />
                            </button>
                            <button
                              type="button"
                              className="app-btn app-btn-icon"
                              title={uiText('processingHistoryOpenFile')}
                              aria-label={uiText('processingHistoryOpenFile')}
                              onClick={() => {
                                void handleBatchOpenOutput(row.outputPath as string, 'file')
                              }}
                            >
                              <IconPlay aria-hidden />
                            </button>
                            <button
                              type="button"
                              className="app-btn app-btn-icon"
                              title={uiText('processingHistoryOpenFolder')}
                              aria-label={uiText('processingHistoryOpenFolder')}
                              onClick={() => {
                                void handleBatchOpenOutput(row.outputPath as string, 'folder')
                              }}
                            >
                              <IconFolderOpen aria-hidden />
                            </button>
                            <button
                              type="button"
                              className="app-btn app-btn-icon"
                              title={uiText('batchExportCopyRowOutputPath')}
                              aria-label={uiText('batchExportCopyRowOutputPath')}
                              onClick={() => {
                                void handleBatchCopyRowPath(row.outputPath as string, 'out')
                              }}
                            >
                              <IconCopy aria-hidden />
                            </button>
                          </>
                        ) : null}
                        {row.status === 'error' || row.status === 'cancelled' ? (
                          <button
                            type="button"
                            className="app-btn app-btn-icon"
                            title={uiText('batchExportRetryRow')}
                            aria-label={uiText('batchExportRetryRow')}
                            disabled={batchExportBusy}
                            onClick={() => {
                              void window.fluxalloy.batchExport.retryRows([row.id]).then((res) => {
                                if (!res.ok) {
                                  setStatusHint(res.error)
                                  return
                                }
                                if (res.reset > 0) {
                                  setStatusHint(
                                    uiTextVars('batchExportRetriedFailed', {
                                      count: String(res.reset)
                                    })
                                  )
                                }
                              })
                            }}
                          >
                            <IconQueueRetry aria-hidden />
                          </button>
                        ) : null}
                        <button
                          type="button"
                          className="app-btn app-btn-icon"
                          title={uiText('batchExportMoveUp')}
                          aria-label={uiText('batchExportMoveUp')}
                          disabled={batchExportBusy || row.status === 'running'}
                          onClick={() => {
                            void window.fluxalloy.batchExport.moveRow(row.id, 'up').catch(console.error)
                          }}
                        >
                          <IconQueueChevronUp aria-hidden />
                        </button>
                        <button
                          type="button"
                          className="app-btn app-btn-icon"
                          title={uiText('batchExportMoveDown')}
                          aria-label={uiText('batchExportMoveDown')}
                          disabled={batchExportBusy || row.status === 'running'}
                          onClick={() => {
                            void window.fluxalloy.batchExport.moveRow(row.id, 'down').catch(console.error)
                          }}
                        >
                          <IconQueueChevronDown aria-hidden />
                        </button>
                        <button
                          type="button"
                          className="app-btn app-btn-icon"
                          title={uiText('batchExportRemoveRow')}
                          aria-label={uiText('batchExportRemoveRow')}
                          disabled={batchExportBusy || row.status === 'running'}
                          onClick={() => {
                            void window.fluxalloy.batchExport.removeRows([row.id]).catch(console.error)
                          }}
                        >
                          <IconQueueTrash aria-hidden />
                        </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            ) : (
              <p className="app-url-hint">{uiText('batchExportEmpty')}</p>
            )}
            </div>
            {batchSnapshot &&
            !batchSnapshot.running &&
            batchSnapshot.completedError > 0 ? (
              <p className="app-batch-export-summary app-url-hint" role="status">
                {uiTextVars('batchExportErrorSummary', {
                  failed: String(batchSnapshot.completedError),
                  total: String(
                    batchSnapshot.completedOk +
                      batchSnapshot.completedError +
                      batchSnapshot.completedCancelled
                  )
                })}
              </p>
            ) : null}
            </div>
          </div>
        </details>
      ) : null}

      {workspaceTab === 'editor' ? (
        <main
          id="workspace-panel-editor"
          role="tabpanel"
          aria-labelledby="workspace-tab-editor"
          className={`app-main app-workbench${panelOpen('ffmpegSettingsRailOpen') ? '' : ' app-workbench-ffmpeg-collapsed'}`}
        >
          <section
            className="app-preview"
            aria-label={uiText('editorPreviewDropzoneAria')}
            onDragOver={(event) => {
              event.preventDefault()
              event.stopPropagation()
            }}
            onDrop={(event) => {
              event.preventDefault()
              event.stopPropagation()
              void handlePreviewDrop(event.dataTransfer.files, event.dataTransfer)
            }}
          >
            {preview ? (
              <>
                <div
                  className="app-preview-stack"
                  ref={previewStackRef}
                  role="region"
                  aria-label={uiText('editorPreviewStackAria')}
                >
                  <div
                    className="app-preview-media-card"
                    role="group"
                    aria-label={uiText('editorPreviewMediaCardGroupAria')}
                  >
                    <video
                      key={`${preview.path}|${previewPlaybackUrl ?? preview.mediaUrl}`}
                      ref={videoRef}
                      className="app-preview-video"
                      playsInline
                      src={previewPlaybackUrl ?? preview.mediaUrl}
                      aria-label={uiTextVars('editorPreviewVideoAriaTemplate', {
                        name: basenameForAriaLabel(preview.path)
                      })}
                      onLoadedMetadata={(event) => {
                        handlePreviewVideoLoaded(event.currentTarget)
                      }}
                      onError={(event) => {
                        handlePreviewVideoError(event.currentTarget)
                      }}
                    />
                    <PreviewTransport
                      key={`${preview.path}|${previewPlaybackUrl ?? preview.mediaUrl}`}
                      mediaKey={`${preview.path}|${previewPlaybackUrl ?? preview.mediaUrl}`}
                      videoRef={videoRef}
                      fullscreenRootRef={previewStackRef}
                      disabled={exportBusy || snapshotBusy}
                    />
                  </div>
                  <VideoTimeline
                    key={`${preview.path}|${previewPlaybackUrl ?? preview.mediaUrl}`}
                    mediaKey={`${preview.path}|${previewPlaybackUrl ?? preview.mediaUrl}`}
                    mediaUrl={previewPlaybackUrl ?? preview.mediaUrl}
                    probe={probeInfo}
                    videoRef={videoRef}
                    onTrimRangeChange={onTrimRangeSnapshot}
                    onJumpToTrimExport={jumpToTrimExport}
                    onStartExport={() => {
                      void handleExport()
                    }}
                    onSaveFrame={() => {
                      void handleSnapshot()
                    }}
                    saveFrameDisabled={exportBusy || snapshotBusy}
                    saveFrameBusy={snapshotBusy}
                  />
                  <footer
                    className="app-preview-caption"
                    title={preview.path}
                    aria-label={uiText('editorPreviewCaptionAria')}
                  >
                    {preview.name}
                  </footer>
                </div>
              </>
            ) : (
              <div
                className="app-preview-placeholder"
                role="region"
                aria-label={uiText('editorPreviewPlaceholderAria')}
              >
                {uiText('editorPreviewEmptyLead')}
                <p className="app-preview-hint">{uiText('editorPreviewEmptyHint')}</p>
              </div>
            )}
            {!panelOpen('ffmpegSettingsRailOpen') ? (
              <button
                type="button"
                className="app-ffmpeg-rail-restore app-icon-btn"
                onClick={() => {
                  persistMainWindowUiPanelToggle('ffmpegSettingsRailOpen', true)
                }}
                title={uiText('editorFfmpegRailShowTitle')}
              >
                <IconChevronLeft title="" size={18} />
                <span className="app-ffmpeg-rail-restore-text">
                  {uiText('editorFfmpegRailRestoreLabel')}
                </span>
                <span className="app-visually-hidden">{uiText('editorFfmpegRailShowHidden')}</span>
              </button>
            ) : null}
          </section>
          {panelOpen('ffmpegSettingsRailOpen') ? (
            <aside className="app-settings-panel" aria-label={uiText('editorFfmpegSettingsAria')}>
              <div
                className="app-settings-panel-head"
                role="group"
                aria-label={uiText('editorFfmpegPanelHeadGroupAria')}
              >
                <div>
                  <h2 className="app-settings-title">{uiText('editorFfmpegSettingsTitle')}</h2>
                  <p
                    className="app-settings-subtitle"
                    title={uiText('editorTooltipFfmpegPanelIntro')}
                  >
                    {uiText('editorFfmpegSettingsSubtitle')}
                  </p>
                </div>
                <div
                  className="app-settings-panel-head-trailing"
                  role="toolbar"
                  aria-orientation="horizontal"
                  aria-label={uiText('editorFfmpegRailHeaderToolbarAria')}
                >
                  <button
                    type="button"
                    className="app-icon-btn app-settings-rail-collapse-btn"
                    onClick={() => {
                      persistMainWindowUiPanelToggle('ffmpegSettingsRailOpen', false)
                    }}
                    title={uiText('editorFfmpegRailCollapseTitle')}
                  >
                    <IconChevronRight title="" size={18} />
                    <span className="app-visually-hidden">
                      {uiText('editorFfmpegRailCollapseHidden')}
                    </span>
                  </button>
                </div>
              </div>

              <div role="region" aria-label={uiText('editorFfmpegRailSectionsRegionAria')}>
              <details
                className="app-settings-section"
                aria-label={uiText('editorFfmpegSectionVideo')}
                open={panelOpen('ffmpegVideo')}
                onToggle={(e) => {
                  persistMainWindowUiPanelToggle('ffmpegVideo', e.currentTarget.open)
                }}
              >
                <summary
                  className="app-settings-summary"
                  title={uiText('editorTooltipSectionVideo')}
                >
                  {uiText('editorFfmpegSectionVideo')}
                </summary>
                <p id="ffmpegVideoSectionHint" className="app-settings-section-hint">
                  {uiText('editorFfmpegSectionVideoHint')}
                </p>
                <div className="app-settings-grid" aria-describedby="ffmpegVideoSectionHint">
                  <label
                    className="app-field"
                    title={
                      uiText('editorTooltipVideoCodec') +
                      (hwEncoderProbe?.ok === true && hwEncoderProbe.hwaccels.length > 0
                        ? `\n${uiText('editorExportHwaccelsTitle')}: ${hwEncoderProbe.hwaccels.join(', ')}`
                        : '')
                    }
                  >
                    <span className="app-field-label-inline">
                      {uiText('editorFieldVideoCodec')}
                      {isFfmpegHwAutoVideoCodec(exportVideoCodec) ? (
                        <span
                          className="app-hw-auto-badge"
                          title={
                            exportVideoCodec === 'hw_auto_hevc'
                              ? uiText('editorExportCodecHwAutoHevcBadgeTitle')
                              : uiText('editorExportCodecHwAutoBadgeTitle')
                          }
                        >
                          {exportVideoCodec === 'hw_auto_hevc'
                            ? uiText('editorExportCodecHwAutoHevcBadge')
                            : uiText('editorExportCodecHwAutoBadge')}
                        </span>
                      ) : null}
                    </span>
                    <select
                      className="app-control"
                      value={exportVideoCodec}
                      disabled={exportBusy || snapshotBusy}
                      onChange={(e) => {
                        bumpManualExportEdit()
                        const v = e.target.value as FfmpegExportVideoCodecId
                        setExportVideoCodec(v)
                        if (cpuFfmpegVideoCodecRequiresMkv(v) && exportContainer !== 'mkv') {
                          setExportContainer('mkv')
                          void window.fluxalloy.settings
                            .setFfmpegExportContainer('mkv')
                            .catch(console.error)
                          setStatusHint(uiText('editorExportAutoContainerMkv'))
                        }
                        if (ffmpegExportVideoCodecRequiresMov(v) && exportContainer !== 'mov') {
                          setExportContainer('mov')
                          void window.fluxalloy.settings
                            .setFfmpegExportContainer('mov')
                            .catch(console.error)
                          setStatusHint(uiText('editorExportAutoContainerMov'))
                        }
                        if (v !== 'libx264' && exportTwoPass) {
                          setExportTwoPass(false)
                          void window.fluxalloy.settings
                            .setFfmpegExportTwoPass(false)
                            .catch(console.error)
                        }
                        void window.fluxalloy.settings
                          .setFfmpegExportVideoCodec(v)
                          .catch(console.error)
                      }}
                    >
                      {ffmpegExportSelectOptions.videoCodecs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="app-field" title={uiText('editorTooltipEncodePreset')}>
                    <span>{uiText('editorFieldEncodePreset')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorTooltipEncodePreset')}
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
                      {ffmpegExportSelectOptions.encodePresets.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="app-field" title={uiText('editorTooltipContainer')}>
                    <span>{uiText('editorFieldContainer')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorTooltipContainer')}
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
                      {ffmpegExportSelectOptions.containers.map((p) => (
                        <option
                          key={p.id}
                          value={p.id}
                          disabled={
                            (cpuFfmpegVideoCodecRequiresMkv(exportVideoCodec) && p.id !== 'mkv') ||
                            (ffmpegExportVideoCodecRequiresMov(exportVideoCodec) && p.id !== 'mov') ||
                            (ffmpegExportAudioModeRequiresMkv(exportAudioMode) && p.id !== 'mkv')
                          }
                        >
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="app-field" title={uiText('editorTooltipCrf')}>
                    <span>{uiText('editorFieldCrf')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorTooltipCrf')}
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
                      <option value="preset">{uiText('editorCrfOptionPreset')}</option>
                      {EXPORT_CRF_OPTIONS.map((v) => (
                        <option key={v} value={v}>
                          CRF {v}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="app-field" title={uiText('editorTooltipVideoBitrate')}>
                    <span>{uiText('editorFieldVideoBitrate')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorTooltipVideoBitrate')}
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
                      <option value="crf">{uiText('editorVideoBitrateOptionCrf')}</option>
                      {EXPORT_VIDEO_BITRATES.map((v) => (
                        <option key={v} value={v}>
                          Video {v}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="app-field" title={uiText('editorHintDeinterlace')}>
                    <span>{uiText('editorFieldDeinterlace')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorHintDeinterlace')}
                      value={exportVideoDeinterlace}
                      disabled={exportBusy || snapshotBusy}
                      onChange={(e) => {
                        bumpManualExportEdit()
                        const v = e.target.value as FfmpegExportVideoDeinterlaceId
                        setExportVideoDeinterlace(v)
                        void window.fluxalloy.settings
                          .setFfmpegExportVideoDeinterlace(v)
                          .catch(console.error)
                      }}
                    >
                      {ffmpegExportSelectOptions.videoDeinterlace.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="app-field" title={uiText('editorHintDenoise')}>
                    <span>{uiText('editorFieldDenoise')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorHintDenoise')}
                      value={exportVideoDenoise}
                      disabled={exportBusy || snapshotBusy}
                      onChange={(e) => {
                        bumpManualExportEdit()
                        const v = e.target.value as FfmpegExportVideoDenoiseId
                        setExportVideoDenoise(v)
                        void window.fluxalloy.settings
                          .setFfmpegExportVideoDenoise(v)
                          .catch(console.error)
                      }}
                    >
                      {ffmpegExportSelectOptions.videoDenoise.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="app-field" title={uiText('editorHintDeband')}>
                    <span>{uiText('editorFieldDeband')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorHintDeband')}
                      value={exportVideoDeband}
                      disabled={exportBusy || snapshotBusy}
                      onChange={(e) => {
                        bumpManualExportEdit()
                        const v = e.target.value as FfmpegExportVideoDebandId
                        setExportVideoDeband(v)
                        void window.fluxalloy.settings
                          .setFfmpegExportVideoDeband(v)
                          .catch(console.error)
                      }}
                    >
                      {ffmpegExportSelectOptions.videoDeband.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="app-field" title={uiText('editorHintHisteq')}>
                    <span>{uiText('editorFieldHisteq')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorHintHisteq')}
                      value={exportVideoHisteq}
                      disabled={exportBusy || snapshotBusy}
                      onChange={(e) => {
                        bumpManualExportEdit()
                        const v = e.target.value as FfmpegExportVideoHisteqId
                        setExportVideoHisteq(v)
                        void window.fluxalloy.settings
                          .setFfmpegExportVideoHisteq(v)
                          .catch(console.error)
                      }}
                    >
                      {ffmpegExportSelectOptions.videoHisteq.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="app-field" title={uiText('editorHintLut3d')}>
                    <span>{uiText('editorFieldLut3d')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorHintLut3d')}
                      value={exportVideoLut3d}
                      disabled={exportBusy || snapshotBusy}
                      onChange={(e) => {
                        bumpManualExportEdit()
                        const v = e.target.value as FfmpegExportVideoLut3dId
                        setExportVideoLut3d(v)
                        void window.fluxalloy.settings
                          .setFfmpegExportVideoLut3d(v)
                          .catch(console.error)
                      }}
                    >
                      {ffmpegExportSelectOptions.videoLut3d.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="app-field" title={uiText('editorHintSharpen')}>
                    <span>{uiText('editorFieldSharpen')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorHintSharpen')}
                      value={exportVideoSharpen}
                      disabled={exportBusy || snapshotBusy}
                      onChange={(e) => {
                        bumpManualExportEdit()
                        const v = e.target.value as FfmpegExportVideoSharpenId
                        setExportVideoSharpen(v)
                        void window.fluxalloy.settings
                          .setFfmpegExportVideoSharpen(v)
                          .catch(console.error)
                      }}
                    >
                      {ffmpegExportSelectOptions.videoSharpen.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="app-field" title={uiText('editorHintEq')}>
                    <span>{uiText('editorFieldEq')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorHintEq')}
                      value={exportVideoEqPreset}
                      disabled={exportBusy || snapshotBusy}
                      onChange={(e) => {
                        bumpManualExportEdit()
                        const v = e.target.value as FfmpegExportVideoEqPresetId
                        setExportVideoEqPreset(v)
                        void window.fluxalloy.settings
                          .setFfmpegExportVideoEqPreset(v)
                          .catch(console.error)
                      }}
                    >
                      {ffmpegExportSelectOptions.videoEq.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="app-field" title={uiText('editorHintHue')}>
                    <span>{uiText('editorFieldHue')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorHintHue')}
                      value={exportVideoHue}
                      disabled={exportBusy || snapshotBusy}
                      onChange={(e) => {
                        bumpManualExportEdit()
                        const v = e.target.value as FfmpegExportVideoHueId
                        setExportVideoHue(v)
                        void window.fluxalloy.settings
                          .setFfmpegExportVideoHue(v)
                          .catch(console.error)
                      }}
                    >
                      {ffmpegExportSelectOptions.videoHue.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="app-field" title={uiText('editorHintGrain')}>
                    <span>{uiText('editorFieldGrain')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorHintGrain')}
                      value={exportVideoGrain}
                      disabled={exportBusy || snapshotBusy}
                      onChange={(e) => {
                        bumpManualExportEdit()
                        const v = e.target.value as FfmpegExportVideoGrainId
                        setExportVideoGrain(v)
                        void window.fluxalloy.settings
                          .setFfmpegExportVideoGrain(v)
                          .catch(console.error)
                      }}
                    >
                      {ffmpegExportSelectOptions.videoGrain.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="app-field" title={uiText('editorHintVignette')}>
                    <span>{uiText('editorFieldVignette')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorHintVignette')}
                      value={exportVideoVignette}
                      disabled={exportBusy || snapshotBusy}
                      onChange={(e) => {
                        bumpManualExportEdit()
                        const v = e.target.value as FfmpegExportVideoVignetteId
                        setExportVideoVignette(v)
                        void window.fluxalloy.settings
                          .setFfmpegExportVideoVignette(v)
                          .catch(console.error)
                      }}
                    >
                      {ffmpegExportSelectOptions.videoVignette.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="app-field" title={uiText('editorHintBlur')}>
                    <span>{uiText('editorFieldBlur')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorHintBlur')}
                      value={exportVideoBlur}
                      disabled={exportBusy || snapshotBusy}
                      onChange={(e) => {
                        bumpManualExportEdit()
                        const v = e.target.value as FfmpegExportVideoBlurId
                        setExportVideoBlur(v)
                        void window.fluxalloy.settings
                          .setFfmpegExportVideoBlur(v)
                          .catch(console.error)
                      }}
                    >
                      {ffmpegExportSelectOptions.videoBlur.map((p) => (
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
                aria-label={uiText('editorFfmpegSectionFrameLayout')}
                open={panelOpen('ffmpegFormat')}
                onToggle={(e) => {
                  persistMainWindowUiPanelToggle('ffmpegFormat', e.currentTarget.open)
                }}
              >
                <summary
                  className="app-settings-summary"
                  title={uiText('editorTooltipSectionFormat')}
                >
                  {uiText('editorFfmpegSectionFrameLayout')}
                </summary>
                <p id="ffmpegFormatSectionHint" className="app-settings-section-hint">
                  {uiText('editorFfmpegSectionFrameLayoutHint')}
                </p>
                <div className="app-settings-grid" aria-describedby="ffmpegFormatSectionHint">
                  <label className="app-field" title={uiText('editorTooltipResolution')}>
                    <span>{uiText('editorFieldResolution')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorTooltipResolution')}
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
                      {ffmpegExportSelectOptions.scalePresets.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="app-field" title={uiText('editorTooltipFps')}>
                    <span>{uiText('editorFieldFps')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorTooltipFps')}
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
                      <option value="source">{uiText('editorFpsOptionSource')}</option>
                      {EXPORT_FPS_OPTIONS.map((v) => (
                        <option key={v} value={v}>
                          {uiTextVars('editorExportFpsOptionTemplate', { value: String(v) })}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="app-field app-field-switch">
                    <span>{uiText('editorTwoPassSpan')}</span>
                    <PillSwitch
                      label={uiText('editorTwoPassPillLabel')}
                      tooltip={uiText('editorTooltipTwoPass')}
                      checked={exportTwoPass && exportVideoBitrate !== null}
                      describedBy="ffmpegFormatSectionHint ffmpegTwoPassUiHint"
                      disabled={
                        exportBusy ||
                        snapshotBusy ||
                        exportVideoBitrate === null ||
                        exportVideoCodec !== 'libx264'
                      }
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
                    <span id="ffmpegTwoPassUiHint" className="app-visually-hidden">
                      {uiText('editorTwoPassHint')}
                    </span>
                  </div>
                  <div className="app-field app-field-switch">
                    <span>{uiText('editorEconomyModeSpan')}</span>
                    <PillSwitch
                      label={uiText('editorEconomyModePillLabel')}
                      tooltip={uiText('editorTooltipEconomyMode')}
                      checked={exportEconomyMode}
                      describedBy="ffmpegFormatSectionHint ffmpegEconomyModeUiHint"
                      disabled={exportBusy || snapshotBusy}
                      onToggle={() => {
                        bumpManualExportEdit()
                        const v = !exportEconomyMode
                        setExportEconomyMode(v)
                        void window.fluxalloy.settings
                          .setFfmpegExportEconomyMode(v)
                          .catch(console.error)
                      }}
                    />
                    <span id="ffmpegEconomyModeUiHint" className="app-visually-hidden">
                      {uiText('editorEconomyModeHint')}
                    </span>
                  </div>
                  <div className="app-field app-field-switch">
                    <span>{uiText('editorHwDecodeSpan')}</span>
                    <PillSwitch
                      label={uiText('editorHwDecodePillLabel')}
                      tooltip={uiText('editorTooltipHwDecode')}
                      checked={exportHwDecode}
                      describedBy="ffmpegFormatSectionHint ffmpegHwDecodeUiHint"
                      disabled={exportBusy || snapshotBusy}
                      onToggle={() => {
                        bumpManualExportEdit()
                        const v = !exportHwDecode
                        setExportHwDecode(v)
                        void window.fluxalloy.settings.setFfmpegExportHwDecode(v).catch(console.error)
                      }}
                    />
                    <span id="ffmpegHwDecodeUiHint" className="app-visually-hidden">
                      {uiText('editorHwDecodeHint')}
                    </span>
                  </div>
                  <label className="app-field" title={uiText('editorTooltipRotation')}>
                    <span>{uiText('editorFieldRotation')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorTooltipRotation')}
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
                      {ffmpegExportSelectOptions.videoTransforms.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="app-field" title={uiText('editorTooltipCrop')}>
                    <span>{uiText('editorFieldCrop')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorTooltipCrop')}
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
                      {ffmpegExportSelectOptions.cropPresets.map((p) => (
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
                aria-label={uiText('editorFfmpegSectionAudio')}
                open={panelOpen('ffmpegAudio')}
                onToggle={(e) => {
                  persistMainWindowUiPanelToggle('ffmpegAudio', e.currentTarget.open)
                }}
              >
                <summary
                  className="app-settings-summary"
                  title={uiText('editorTooltipSectionAudio')}
                >
                  {uiText('editorFfmpegSectionAudio')}
                </summary>
                <p id="ffmpegAudioSectionHint" className="app-settings-section-hint">
                  {uiText('editorFfmpegSectionAudioHint')}
                </p>
                <div className="app-settings-grid" aria-describedby="ffmpegAudioSectionHint">
                  <label
                    className="app-field"
                    title={uiText('editorTooltipAudioMode')}
                    aria-describedby="ffmpegAudioSectionHint ffmpegAudioModeSelectHint"
                  >
                    <span>{uiText('editorFieldAudioMode')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorTooltipAudioMode')}
                      value={exportAudioMode}
                      disabled={exportBusy || snapshotBusy}
                      onChange={(e) => {
                        bumpManualExportEdit()
                        const v = e.target.value as FfmpegExportAudioModeId
                        setExportAudioMode(v)
                        if (ffmpegExportAudioModeRequiresMkv(v) && exportContainer !== 'mkv') {
                          setExportContainer('mkv')
                          void window.fluxalloy.settings
                            .setFfmpegExportContainer('mkv')
                            .catch(console.error)
                          setStatusHint(uiText('editorExportAutoContainerMkv'))
                        }
                        void window.fluxalloy.settings.setFfmpegExportAudioMode(v).catch(console.error)
                      }}
                    >
                      {ffmpegExportSelectOptions.audioModes.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <span id="ffmpegAudioModeSelectHint" className="app-visually-hidden">
                      {uiText('editorExportAudioModeSelectHint')}
                    </span>
                  </label>
                  <label className="app-field" title={uiText('editorTooltipAacBitrate')}>
                    <span>{uiText('editorFieldAacBitrate')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorTooltipAacBitrate')}
                      value={exportAudioBitrate}
                      disabled={
                        exportBusy || snapshotBusy || !ffmpegExportAudioModeUsesBitrate(exportAudioMode)
                      }
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
                  <label className="app-field" title={uiText('editorHintAudioGain')}>
                    <span>{uiText('editorFieldAudioGain')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorHintAudioGain')}
                      value={String(exportAudioGainDb)}
                      disabled={exportBusy || snapshotBusy || !ffmpegExportAudioModeAllowsFilters(exportAudioMode)}
                      onChange={(e) => {
                        bumpManualExportEdit()
                        const parsed = Number(e.target.value)
                        const v = Number.isFinite(parsed) ? Math.trunc(parsed) : 0
                        setExportAudioGainDb(v)
                        void window.fluxalloy.settings
                          .setFfmpegExportAudioGainDb(v === 0 ? null : v)
                          .catch(console.error)
                      }}
                    >
                      {ffmpegExportSelectOptions.audioGainOptions.map((p) => (
                        <option key={p.value} value={String(p.value)}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="app-field" title={uiText('editorHintAudioNormalize')}>
                    <span>{uiText('editorFieldAudioNormalize')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorHintAudioNormalize')}
                      value={exportAudioNormalize}
                      disabled={exportBusy || snapshotBusy || !ffmpegExportAudioModeAllowsFilters(exportAudioMode)}
                      onChange={(e) => {
                        bumpManualExportEdit()
                        const v = e.target.value as FfmpegExportAudioNormalizeId
                        setExportAudioNormalize(v)
                        void window.fluxalloy.settings
                          .setFfmpegExportAudioNormalize(v)
                          .catch(console.error)
                      }}
                    >
                      {ffmpegExportSelectOptions.audioNormalize.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="app-field" title={uiText('editorTooltipSnapshotFormat')}>
                    <span>{uiText('editorFieldSnapshotFormat')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorTooltipSnapshotFormat')}
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
                      {ffmpegExportSelectOptions.snapshotFormats.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="app-field app-field-switch">
                    <span>{uiText('editorStripMetadataSpan')}</span>
                    <PillSwitch
                      label={uiText('editorStripMetadataPillLabel')}
                      tooltip={uiText('editorTooltipStripMetadata')}
                      checked={exportStripMetadata}
                      describedBy="ffmpegAudioSectionHint ffmpegStripMetadataHint"
                      disabled={exportBusy || snapshotBusy}
                      onToggle={() => {
                        bumpManualExportEdit()
                        const next = !exportStripMetadata
                        setExportStripMetadata(next)
                        void window.fluxalloy.settings
                          .setFfmpegExportStripMetadata(next)
                          .catch(console.error)
                      }}
                    />
                    <span id="ffmpegStripMetadataHint" className="app-visually-hidden">
                      {uiText('editorStripMetadataHint')}
                    </span>
                  </div>
                  <div className="app-field app-field-switch">
                    <span>{uiText('editorStripChaptersSpan')}</span>
                    <PillSwitch
                      label={uiText('editorStripChaptersPillLabel')}
                      tooltip={uiText('editorTooltipStripChapters')}
                      checked={exportStripChapters}
                      describedBy="ffmpegAudioSectionHint ffmpegStripChaptersHint"
                      disabled={exportBusy || snapshotBusy}
                      onToggle={() => {
                        bumpManualExportEdit()
                        const next = !exportStripChapters
                        setExportStripChapters(next)
                        void window.fluxalloy.settings
                          .setFfmpegExportStripChapters(next)
                          .catch(console.error)
                      }}
                    />
                    <span id="ffmpegStripChaptersHint" className="app-visually-hidden">
                      {uiText('editorStripChaptersHint')}
                    </span>
                  </div>
                  <label className="app-field" title={uiText('editorHintExportSubtitles')}>
                    <span>{uiText('editorFieldExportSubtitles')}</span>
                    <select
                      className="app-control"
                      title={uiText('editorHintExportSubtitles')}
                      value={exportSubtitleMode}
                      disabled={exportBusy || snapshotBusy}
                      onChange={(e) => {
                        bumpManualExportEdit()
                        const v: FfmpegExportSubtitleModeId =
                          e.target.value === 'copy' ? 'copy' : 'drop'
                        setExportSubtitleMode(v)
                        void window.fluxalloy.settings
                          .setFfmpegExportSubtitleMode(v)
                          .catch(console.error)
                      }}
                    >
                      {ffmpegExportSelectOptions.subtitleModes.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                {lastSnapshotPath ? (
                  <div
                    className="app-settings-actions"
                    role="toolbar"
                    aria-orientation="horizontal"
                    aria-label={uiText('editorSnapshotLastActionsToolbarAria')}
                  >
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      disabled={exportBusy || snapshotBusy}
                      aria-describedby="ffmpegAudioSectionHint"
                      title={uiText('editorTooltipSnapshotLastFile')}
                      onClick={() => {
                        void handleOpenLastSnapshot('file')
                      }}
                    >
                      {uiText('editorSnapshotLastFile')}
                    </button>
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      disabled={exportBusy || snapshotBusy}
                      aria-describedby="ffmpegAudioSectionHint"
                      title={uiText('editorTooltipSnapshotLastFolder')}
                      onClick={() => {
                        void handleOpenLastSnapshot('folder')
                      }}
                    >
                      {uiText('editorSnapshotLastFolder')}
                    </button>
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      disabled={exportBusy || snapshotBusy}
                      aria-describedby="ffmpegAudioSectionHint"
                      title={uiText('editorTooltipSnapshotCopyPath')}
                      onClick={() => {
                        void handleCopyLastSnapshotPath()
                      }}
                    >
                      {uiText('editorCopy')}
                    </button>
                  </div>
                ) : null}
              </details>

              <details
                className="app-settings-section"
                aria-label={uiText('editorFfmpegSectionPresets')}
                open={panelOpen('ffmpegPresets')}
                onToggle={(e) => {
                  persistMainWindowUiPanelToggle('ffmpegPresets', e.currentTarget.open)
                }}
              >
                <summary
                  className="app-settings-summary"
                  title={uiText('editorTooltipSectionPresets')}
                >
                  {uiText('editorFfmpegSectionPresets')}
                </summary>
                <p id="ffmpegPresetsSectionHint" className="app-settings-section-hint">
                  {uiText('editorFfmpegSectionPresetsHint')}
                </p>
                <div className="app-settings-stack" aria-describedby="ffmpegPresetsSectionHint">
                  <label
                    className="app-field"
                    title={
                      selectedExportUserPreset?.hint?.trim() ||
                      uiText('editorTooltipUserPresetSelectFallback')
                    }
                  >
                    <span>{uiText('editorFieldUserPreset')}</span>
                    <select
                      className="app-control"
                      title={
                        selectedExportUserPreset?.hint?.trim() ||
                        uiText('editorTooltipUserPresetSelectFallback')
                      }
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
                      <option value="">{uiText('editorUserPresetPlaceholder')}</option>
                      {exportUserPresets.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div
                    className="app-settings-actions"
                    role="toolbar"
                    aria-orientation="horizontal"
                    aria-label={uiText('editorExportPresetsActionsToolbarAria')}
                  >
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      disabled={exportBusy || snapshotBusy}
                      aria-describedby="ffmpegPresetsSectionHint"
                      title={uiText('editorTooltipPresetAdd')}
                      onClick={() => {
                        handleSaveExportUserPreset()
                      }}
                    >
                      {uiText('editorPresetAdd')}
                    </button>
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      disabled={
                        exportBusy ||
                        snapshotBusy ||
                        !selectedUserPresetId ||
                        (selectedUserPresetId != null &&
                          isBuiltinExportUserPresetId(selectedUserPresetId))
                      }
                      aria-describedby="ffmpegPresetsSectionHint"
                      title={uiText('editorTooltipPresetRename')}
                      onClick={() => {
                        handleRenameExportUserPreset()
                      }}
                    >
                      {uiText('editorPresetRename')}
                    </button>
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      disabled={
                        exportBusy ||
                        snapshotBusy ||
                        !selectedUserPresetId ||
                        (selectedUserPresetId != null &&
                          isBuiltinExportUserPresetId(selectedUserPresetId))
                      }
                      aria-describedby="ffmpegPresetsSectionHint"
                      title={uiText('editorTooltipPresetOverwrite')}
                      onClick={() => {
                        handleOverwriteExportUserPreset()
                      }}
                    >
                      {uiText('editorPresetOverwrite')}
                    </button>
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      disabled={
                        exportBusy ||
                        snapshotBusy ||
                        !selectedUserPresetId ||
                        (selectedUserPresetId != null &&
                          isBuiltinExportUserPresetId(selectedUserPresetId))
                      }
                      aria-describedby="ffmpegPresetsSectionHint"
                      title={uiText('editorTooltipPresetDelete')}
                      onClick={() => {
                        handleDeleteExportUserPreset()
                      }}
                    >
                      {uiText('editorPresetDelete')}
                    </button>
                  </div>
                </div>
              </details>

              <details
                id="editor-ffmpeg-export-output"
                className="app-settings-section"
                aria-label={uiText('editorFfmpegSectionOutput')}
                open={panelOpen('ffmpegOutput')}
                onToggle={(e) => {
                  persistMainWindowUiPanelToggle('ffmpegOutput', e.currentTarget.open)
                }}
              >
                <summary
                  className="app-settings-summary"
                  title={uiText('editorTooltipSectionOutput')}
                >
                  {uiText('editorFfmpegSectionOutput')}
                </summary>
                <p id="ffmpegOutputSectionHint" className="app-settings-section-hint">
                  {uiText('editorFfmpegSectionOutputHint')}
                </p>
                <div className="app-settings-stack" aria-describedby="ffmpegOutputSectionHint">
                  <label className="app-field app-field-block" title={uiText('editorExportExtraArgsHint')}>
                    <span>{uiText('editorExportExtraArgsLabel')}</span>
                    <textarea
                      className="app-downloads-url-input app-control"
                      value={exportExtraArgsLine}
                      placeholder={uiText('editorExportExtraArgsPlaceholder')}
                      rows={2}
                      disabled={exportBusy || snapshotBusy}
                      onChange={(e) => {
                        bumpManualExportEdit()
                        const v = e.target.value
                        setExportExtraArgsLine(v)
                        void window.fluxalloy.settings.setFfmpegExportExtraArgsLine(v).catch(console.error)
                      }}
                    />
                    <span className="app-settings-section-hint">{uiText('editorExportExtraArgsHint')}</span>
                    {!exportExtraArgsParsed.ok ? (
                      <span className="app-field-error" role="alert">
                        {uiTextVars('editorExportExtraArgsParseError', {
                          detail: exportExtraArgsParsed.error
                        })}
                      </span>
                    ) : null}
                  </label>
                  <details
                    className="app-export-preview app-export-preview-nested"
                    aria-label={uiText('editorExportPreviewDetailsAria')}
                    open={panelOpen('exportCommandPreview')}
                    onToggle={(e) => {
                      persistMainWindowUiPanelToggle('exportCommandPreview', e.currentTarget.open)
                    }}
                  >
                    <summary
                      className="app-export-preview-summary"
                      title={uiText('editorTooltipExportCommandPreview')}
                    >
                      {uiText('editorExportCommandPreviewSummary')}
                    </summary>
                    <div
                      className="app-export-preview-body"
                      role="region"
                      aria-label={uiText('editorExportPreviewBodyRegionAria')}
                    >
                      <pre
                        className="app-export-preview-pre"
                        aria-label={uiText('editorAriaExportFfmpegCommand')}
                        aria-describedby="exportCommandPreviewHint"
                      >
                        {exportPreview.pass1Command
                          ? `${uiText('editorExportPreviewPass1')}\n${exportPreview.pass1Command}\n\n${uiText('editorExportPreviewPass2')}\n${exportPreviewCommand}`
                          : exportPreviewCommand}
                      </pre>
                      <div
                        className="app-export-preview-actions"
                        role="toolbar"
                        aria-orientation="horizontal"
                        aria-label={uiText('editorExportPreviewActionsToolbarAria')}
                      >
                        <button
                          type="button"
                          className="app-btn app-btn-compact"
                          onClick={() => {
                            void handleCopyExportPreview()
                          }}
                          title={uiText('editorCopyFfmpegCommandTitle')}
                          aria-describedby="exportCommandPreviewHint"
                        >
                          {uiText('editorCopy')}
                        </button>
                        <span id="exportCommandPreviewHint" className="app-export-preview-hint">
                          {exportPreviewHint()}
                        </span>
                      </div>
                    </div>
                  </details>
                  {lastExportPath ? (
                    <div
                      className="app-settings-actions"
                      role="toolbar"
                      aria-orientation="horizontal"
                      aria-label={uiText('editorExportLastOutputActionsToolbarAria')}
                    >
                      <button
                        type="button"
                        className="app-btn app-btn-compact"
                        disabled={exportBusy || snapshotBusy}
                        aria-describedby="ffmpegOutputSectionHint"
                        title={uiText('editorTooltipExportLastFile')}
                        onClick={() => {
                          void handleOpenLastExport('file')
                        }}
                      >
                        {uiText('editorExportLastFile')}
                      </button>
                      <button
                        type="button"
                        className="app-btn app-btn-compact"
                        disabled={exportBusy || snapshotBusy}
                        aria-describedby="ffmpegOutputSectionHint"
                        title={uiText('editorTooltipExportLastFolder')}
                        onClick={() => {
                          void handleOpenLastExport('folder')
                        }}
                      >
                        {uiText('editorExportLastFolder')}
                      </button>
                      <button
                        type="button"
                        className="app-btn app-btn-compact"
                        disabled={exportBusy || snapshotBusy}
                        aria-describedby="ffmpegOutputSectionHint"
                        title={uiText('editorTooltipExportOpenPreview')}
                        onClick={() => {
                          void handleOpenLastExport('preview')
                        }}
                      >
                        {uiText('processingHistoryOpenPreview')}
                      </button>
                      <button
                        type="button"
                        className="app-btn app-btn-compact"
                        disabled={exportBusy || snapshotBusy}
                        aria-describedby="ffmpegOutputSectionHint"
                        title={uiText('editorTooltipCopyExportPath')}
                        onClick={() => {
                          void handleCopyLastExportPath()
                        }}
                      >
                        {uiText('editorCopyExportPath')}
                      </button>
                    </div>
                  ) : null}
                </div>
              </details>
              </div>
              <ProcessingHistoryPanel
                open={panelOpen('processingHistory')}
                busy={processingHistoryBusy}
                entries={processingHistory}
                filter={processingHistoryFilter}
                weeklySummary={processingHistoryWeeklySummary}
                onToggle={(nextOpen) => {
                  persistMainWindowUiPanelToggle('processingHistory', nextOpen)
                }}
                onFilterChange={applyProcessingHistoryFilter}
                onRefresh={() => {
                  void refreshProcessingHistory()
                }}
                onClear={() => {
                  void window.fluxalloy.processingHistory.clear().then((res) => {
                    if (!res.ok) {
                      setStatusHint(res.error)
                      return
                    }
                    setProcessingHistory([])
                    void window.fluxalloy.processingHistory
                      .weeklySummary()
                      .then(setProcessingHistoryWeeklySummary)
                  })
                }}
                onExportVisible={() => {
                  void exportVisibleProcessingHistory()
                }}
                onOpenOutput={(id, mode) => {
                  void window.fluxalloy.processingHistory.openOutput(id, mode).then((res) => {
                    if (!res.ok) {
                      setStatusHint(res.error)
                    } else if (mode === 'preview') {
                      setStatusHint(uiText('processingHistoryOpenOutputPreviewDone'))
                    }
                  })
                }}
                onOpenInputInHandler={(id) => {
                  setStatusHint(uiText('processingHistoryOpenInputBusy'))
                  void window.fluxalloy.processingHistory.openInputInHandler(id).then((res) => {
                    setStatusHint(res.ok ? uiText('processingHistoryOpenInputDone') : res.error)
                  })
                }}
                onAddInputToBatch={(id) => {
                  void window.fluxalloy.batchExport.addFromHistoryInputs([id]).then((res) => {
                    if (!res.ok) {
                      setStatusHint(res.error)
                      return
                    }
                    setBatchAddStatusHint(res)
                  })
                }}
              />
            </aside>
          ) : null}
        </main>
      ) : workspaceTab === 'terminal' ? (
        <main
          id="workspace-panel-terminal"
          role="tabpanel"
          aria-labelledby="workspace-tab-terminal"
          className="app-main app-terminal-workspace"
        >
          <section className="app-terminal-panel" aria-label={uiText('terminalPanelSectionAria')}>
            <div
              className="app-downloads-band"
              role="region"
              aria-label={uiText('terminalIntroBandAria')}
            >
              <div
                className="app-downloads-band-copy"
                role="group"
                aria-label={uiText('downloadsBandHeadingCopyGroupAria')}
              >
                <h2 className="app-downloads-title">{uiText('terminalTitle')}</h2>
                <p className="app-downloads-hint">
                  {uiText('terminalIntroLead')}
                  <code>{TERMINAL_CURRENT_FILE_PLACEHOLDER}</code>
                  {formatTerminalIntroTail({
                    pageStep: DEFAULT_TERMINAL_INLINE_SUGGEST_PAGE_STEP,
                    maxInline: DEFAULT_TERMINAL_INLINE_SUGGEST_MAX
                  })}
                </p>
                <nav
                  className="app-terminal-intro-knowledge"
                  aria-label={uiText('terminalIntroKnowledgeNavAria')}
                >
                  <button
                    type="button"
                    className="app-knowledge-link"
                    title={uiText('terminalKnowledgeDeepLinkTooltip')}
                    onClick={() => {
                      setKnowledgeInitialSlug(KNOWLEDGE_SLUG_FFMPEG_TERMINAL_HINTS)
                      setKnowledgeOpen(true)
                    }}
                  >
                    {uiText('knowledgeArticleTerminalHintsLink')}
                  </button>
                </nav>
              </div>
            </div>
            <div
              className="app-terminal-command-stack"
              role="region"
              aria-label={uiText('terminalCommandStackAria')}
            >
              <div
                className="app-terminal-command-row"
                role="toolbar"
                aria-orientation="horizontal"
                aria-label={uiText('terminalCommandToolbarAria')}
              >
                <label htmlFor={terminalCommandInputId} className="app-visually-hidden">
                  {uiText('terminalCommandInputAriaLabel')}
                </label>
                <input
                  id={terminalCommandInputId}
                  className="app-control app-terminal-input"
                  value={terminalLine}
                  spellCheck={false}
                  autoComplete="off"
                  placeholder={uiText('terminalCommandPlaceholder')}
                  aria-expanded={terminalInlineSuggestions.length > 0 && terminalSuggestFocus}
                  aria-controls="terminal-inline-suggest-list"
                  aria-autocomplete="list"
                  disabled={terminalBusy}
                  onChange={(e) => {
                    setTerminalLine(e.target.value)
                  }}
                  onFocus={() => {
                    window.clearTimeout(terminalSuggestBlurTimeoutRef.current)
                    setTerminalSuggestFocus(true)
                  }}
                  onBlur={() => {
                    terminalSuggestBlurTimeoutRef.current = window.setTimeout(() => {
                      setTerminalSuggestFocus(false)
                    }, 160)
                  }}
                  onKeyDown={(e) => {
                    const list = terminalInlineSuggestions
                    if (
                      e.key === 'Enter' &&
                      list.length > 0 &&
                      terminalSuggestFocus &&
                      !e.shiftKey
                    ) {
                      e.preventDefault()
                      const h = list[terminalSuggestActiveIndex]
                      if (h) {
                        applyTerminalSuggest(h)
                      }
                      return
                    }
                    if (list.length > 0) {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault()
                        setTerminalSuggestIndex((i) =>
                          stepTerminalSuggestIndex(i, list.length, 'down')
                        )
                        return
                      }
                      if (e.key === 'ArrowUp') {
                        e.preventDefault()
                        setTerminalSuggestIndex((i) =>
                          stepTerminalSuggestIndex(i, list.length, 'up')
                        )
                        return
                      }
                      if (e.key === 'Home') {
                        e.preventDefault()
                        setTerminalSuggestIndex((i) =>
                          stepTerminalSuggestIndex(i, list.length, 'home')
                        )
                        return
                      }
                      if (e.key === 'End') {
                        e.preventDefault()
                        setTerminalSuggestIndex((i) =>
                          stepTerminalSuggestIndex(i, list.length, 'end')
                        )
                        return
                      }
                      if (e.key === 'PageDown') {
                        e.preventDefault()
                        setTerminalSuggestIndex((i) =>
                          stepTerminalSuggestIndex(i, list.length, 'pageDown')
                        )
                        return
                      }
                      if (e.key === 'PageUp') {
                        e.preventDefault()
                        setTerminalSuggestIndex((i) =>
                          stepTerminalSuggestIndex(i, list.length, 'pageUp')
                        )
                        return
                      }
                      if (e.key === 'Tab') {
                        e.preventDefault()
                        if (e.shiftKey) {
                          setTerminalSuggestIndex((i) =>
                            stepTerminalSuggestIndex(i, list.length, 'up')
                          )
                        } else {
                          const h = list[terminalSuggestActiveIndex]
                          if (h) {
                            applyTerminalSuggest(h)
                          }
                        }
                        return
                      }
                      if (e.key === 'Escape') {
                        e.preventDefault()
                        window.clearTimeout(terminalSuggestBlurTimeoutRef.current)
                        setTerminalSuggestFocus(false)
                        return
                      }
                    }
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      void runTerminalLine()
                    }
                  }}
                />
                <button
                  type="button"
                  className="app-btn"
                  disabled={terminalBusy || !currentSourcePath}
                  title={
                    currentSourcePath
                      ? formatTerminalPreviewTooltip(TERMINAL_CURRENT_FILE_PLACEHOLDER)
                      : uiText('terminalPreviewFileTooltipNeedFile')
                  }
                  onClick={() => appendTerminalToken(TERMINAL_CURRENT_FILE_PLACEHOLDER)}
                >
                  {uiText('terminalPreviewFileButton')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-primary"
                  disabled={terminalBusy || terminalLine.trim().length === 0}
                  onClick={() => {
                    void runTerminalLine()
                  }}
                >
                  {terminalBusy ? uiText('terminalRunningButton') : uiText('terminalRunButton')}
                </button>
              </div>
              {terminalInlineSuggestions.length > 0 && terminalSuggestFocus ? (
                <div
                  id="terminal-inline-suggest-list"
                  className="app-terminal-suggest"
                  role="listbox"
                  aria-label={uiText('terminalInlineSuggestAria')}
                  onMouseDown={(ev) => {
                    ev.preventDefault()
                  }}
                >
                  {terminalInlineSuggestions.map((hint, idx) => (
                    <button
                      key={`inline:${hint.tool}:${hint.token}:${hint.fullLine ?? ''}:${idx}`}
                      type="button"
                      role="option"
                      aria-selected={idx === terminalSuggestActiveIndex}
                      aria-label={terminalHintInsertAccessibleDescription(hint)}
                      className={`app-terminal-suggest-item${
                        idx === terminalSuggestActiveIndex
                          ? ' app-terminal-suggest-item-active'
                          : ''
                      }`}
                      onMouseEnter={() => {
                        setTerminalSuggestIndex(idx)
                      }}
                      onClick={() => {
                        applyTerminalSuggest(hint)
                      }}
                    >
                      <code>
                        {hint.fullLine !== undefined && hint.fullLine.length > 0
                          ? hint.fullLine.trimEnd()
                          : hint.token}
                      </code>
                      <span>{hint.tool}</span>
                      <small>{hint.summary}</small>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div
              className="app-terminal-layout"
              role="region"
              aria-label={uiText('terminalMainSplitAria')}
            >
              <section className="app-terminal-history" aria-label={uiText('terminalHistoryAria')}>
                {terminalHistory.length === 0 ? (
                  <p className="app-downloads-empty" role="status" aria-live="polite">
                    {uiText('terminalHistoryEmpty')}
                  </p>
                ) : (
                  terminalHistory.map((entry, entryIdx) => {
                    const lines = (() => {
                      if (!entry.result.ok) {
                        return [] as string[]
                      }
                      const blob = [entry.result.stdout, entry.result.stderr]
                        .filter(Boolean)
                        .join('\n')
                      return blob.length > 0 ? blob.split(/\r?\n/) : ['']
                    })()
                    const entryBrief =
                      entry.line.length > 96 ? `${entry.line.slice(0, 96)}…` : entry.line
                    return (
                      <article
                        key={entry.id}
                        className="app-terminal-entry"
                        aria-label={uiTextVars('terminalEntryArticleAriaTemplate', {
                          index: entryIdx + 1,
                          line: entryBrief
                        })}
                      >
                        <div
                          className="app-terminal-entry-head"
                          role="group"
                          aria-label={uiText('terminalEntryHeadGroupAria')}
                        >
                          <code>{entry.line}</code>
                          <span>
                            {entry.result.ok
                              ? formatTerminalExitLine(entry.result.code, entry.result.elapsedMs)
                              : uiText('terminalBlocked')}
                          </span>
                        </div>
                        {entry.result.ok ? (
                          <div
                            className="app-terminal-output"
                            role="log"
                            aria-label={uiTextVars('terminalEntryOutputLogAriaTemplate', {
                              index: entryIdx + 1
                            })}
                          >
                            {lines.map((line, lineIdx) => (
                              <div
                                key={`${entry.id}:${lineIdx}`}
                                className="app-terminal-output-line"
                              >
                                <span className="app-terminal-output-line-text">
                                  {line.length > 0 ? line : '\u00a0'}
                                </span>
                                <button
                                  type="button"
                                  className="app-terminal-output-line-copy"
                                  title={uiText('terminalCopyLineTitle')}
                                  aria-label={formatTerminalCopyLineAria(lineIdx + 1)}
                                  onClick={() => {
                                    void copyTerminalOutputLine(line)
                                  }}
                                >
                                  {uiText('terminalCopyLineButton')}
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="app-downloads-warning">{entry.result.error}</p>
                        )}
                      </article>
                    )
                  })
                )}
              </section>
              <aside className="app-terminal-hints" aria-label={uiText('terminalHintsPanelAria')}>
                <div className="app-field">
                  <label htmlFor={terminalHintsSearchFieldId}>
                    {uiText('terminalHintsSearchLabel')}
                  </label>
                  <input
                    id={terminalHintsSearchFieldId}
                    className="app-control"
                    value={terminalHintFilter}
                    spellCheck={false}
                    placeholder={uiText('terminalHintsSearchPlaceholder')}
                    onChange={(e) => {
                      setTerminalHintFilter(e.target.value)
                    }}
                  />
                </div>
                <ul className="app-terminal-hint-list" aria-label={uiText('terminalHintsInsertListAria')}>
                  {visibleTerminalHints.map((hint) => (
                    <li key={`${hint.tool}:${hint.token}:${hint.fullLine ?? ''}`}>
                      <button
                        type="button"
                        className="app-terminal-hint"
                        aria-label={terminalHintInsertAccessibleDescription(hint)}
                        onClick={() => {
                          if (hint.fullLine !== undefined && hint.fullLine.length > 0) {
                            setTerminalLine(hint.fullLine)
                          } else {
                            appendTerminalToken(hint.token)
                          }
                        }}
                        title={hint.summary}
                      >
                        <code>{hint.token}</code>
                        <span>{hint.tool}</span>
                        <small>{hint.summary}</small>
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </section>
        </main>
      ) : (
        <main
          id="workspace-panel-downloads"
          role="tabpanel"
          aria-labelledby="workspace-tab-downloads"
          className="app-main app-downloads-workspace"
        >
          <section className="app-downloads-main" aria-label={uiText('downloadsMainAria')}>
            <div
              className="app-downloads-band"
              role="region"
              aria-label={uiText('downloadsPageIntroBandAria')}
            >
              <div
                className="app-downloads-band-copy"
                role="group"
                aria-label={uiText('downloadsBandHeadingCopyGroupAria')}
              >
                <h2 className="app-downloads-title">{uiText('downloadsPageTitle')}</h2>
                <p className="app-downloads-hint">{uiText('downloadsPageHint')}</p>
              </div>
              <div
                className="app-downloads-actions"
                role="toolbar"
                aria-orientation="horizontal"
                aria-label={uiText('downloadsBandToolbarAria')}
              >
                <button
                  type="button"
                  className="app-btn app-btn-icon-leading"
                  onClick={() => {
                    void window.fluxalloy.downloads.openWindow({
                      ...(downloadsUrl.trim().length > 0 ? { text: downloadsUrl } : {}),
                      uiLocale: getUiLocale()
                    })
                  }}
                >
                  <IconPopOutWindow title="" size={17} />
                  {uiText('downloadsPopOut')}
                </button>
                {downloadsNarrowLayout ? (
                  <button
                    type="button"
                    className="app-btn app-btn-icon-leading"
                    onClick={() => {
                      downloadsSettingsRailRef.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      })
                    }}
                  >
                    <IconSettings title="" size={17} />
                    {uiText('downloadsScrollToSettings')}
                  </button>
                ) : null}
              </div>
            </div>
            <div
              className="app-downloads-url-row"
              role="group"
              aria-label={uiText('downloadsUrlRowGroupAria')}
            >
              <div className="app-downloads-url-field">
                <label htmlFor={downloadsMainUrlFieldId} className="app-visually-hidden">
                  {uiText('downloadsUrlAria')}
                </label>
                <textarea
                  id={downloadsMainUrlFieldId}
                  className="app-downloads-url-input"
                  value={downloadsUrl}
                  placeholder={uiText('downloadsUrlPlaceholder')}
                  aria-describedby="downloads-main-url-hint"
                  onChange={(e) => {
                    setDownloadsUrl(e.target.value)
                  }}
                />
                <p id="downloads-main-url-hint" className="app-field-help">
                  {uiText('downloadsUrlEnqueueHint')}
                </p>
              </div>
              <div
                className="app-downloads-url-actions"
                role="toolbar"
                aria-orientation="horizontal"
                aria-label={uiText('downloadsUrlActionsToolbarAria')}
              >
                <button
                  type="button"
                  className="app-btn app-btn-primary app-btn-icon-leading"
                  onClick={() => {
                    void handleAddDownloadsFromMain()
                  }}
                >
                  <IconQueuePlus title="" size={17} />
                  {uiText('downloadsAddToQueue')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-warn app-btn-icon-leading"
                  title={uiText('downloadsStopQueueTooltip')}
                  onClick={() => {
                    void window.fluxalloy.downloads.cancelQueue().then((res) => {
                      if (!res.ok) {
                        setStatusHint(res.error)
                      }
                    })
                  }}
                >
                  <IconBan title="" size={17} />
                  {uiText('downloadsStopQueue')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-icon-leading"
                  disabled={downloadsRows.length === 0}
                  onClick={() => {
                    void window.fluxalloy.downloads.clearFinished().then((res) => {
                      if (!res.ok) {
                        setStatusHint(res.error)
                        return
                      }
                      setStatusHint(
                        res.removed > 0
                          ? uiTextVars('downloadsFinishedRemovedTemplate', { n: res.removed })
                          : uiText('downloadsNoFinishedRowsHint')
                      )
                    })
                  }}
                >
                  <IconQueueTrash title="" size={17} />
                  {uiText('downloadsRemoveFinished')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-warn app-btn-icon-leading"
                  disabled={downloadsRows.length === 0}
                  onClick={() => {
                    void window.fluxalloy.downloads.clearQueue().then((res) => {
                      if (!res.ok) {
                        setStatusHint(res.error)
                        return
                      }
                      setStatusHint(uiText('downloadsQueueClearedHint'))
                    })
                  }}
                >
                  <IconQueueTrash title="" size={17} />
                  {uiText('downloadsClearQueue')}
                </button>
              </div>
            </div>
            <div
              className="app-downloads-overview"
              role="region"
              aria-label={uiText('downloadsOverviewAria')}
            >
              <div
                className="app-downloads-overview-stats"
                role="list"
                aria-label={uiText('downloadsOverviewStatsGroupAria')}
              >
                <div className="app-downloads-stat" role="listitem">
                  <span className="app-downloads-stat-label">{uiText('downloadsStatTotal')}</span>
                  <strong>{downloadsStats.total}</strong>
                </div>
                <div className="app-downloads-stat" role="listitem">
                  <span className="app-downloads-stat-label">
                    {uiText('downloadsQueueFilterRunning')}
                  </span>
                  <strong>{downloadsStats.running}</strong>
                </div>
                <div className="app-downloads-stat" role="listitem">
                  <span className="app-downloads-stat-label">
                    {uiText('downloadsQueueFilterDone')}
                  </span>
                  <strong>{downloadsStats.done}</strong>
                </div>
                <div className="app-downloads-stat" role="listitem">
                  <span className="app-downloads-stat-label">
                    {uiText('downloadsQueueFilterError')}
                  </span>
                  <strong>{downloadsStats.error}</strong>
                </div>
                <div className="app-downloads-stat" role="listitem">
                  <span className="app-downloads-stat-label">{uiText('downloadsStatPending')}</span>
                  <strong>{downloadsStats.pending}</strong>
                </div>
              </div>
            </div>
            <div
              className="app-downloads-filterbar"
              role="toolbar"
              aria-orientation="horizontal"
              aria-label={uiText('downloadsFilterBarAria')}
            >
              {downloadsStatusFilterChips.map((filter) => (
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
            <div
              className="app-downloads-table-zone"
              role="region"
              aria-label={uiText('downloadsQueueTableZoneAria')}
            >
              <div
                className="app-downloads-table-wrap"
                role="group"
                aria-label={uiText('downloadsQueueTableWrapGroupAria')}
              >
                <table className="app-downloads-table">
                  <caption className="app-visually-hidden">
                    {uiText('downloadsQueueTableCaption')}
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col" id={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.num}>
                        {uiText('downloadsTableColNum')}
                      </th>
                      <th scope="col" id={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.titleUrl}>
                        {uiText('downloadsTableColTitleUrl')}
                      </th>
                      <th scope="col" id={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.format}>
                        {uiText('downloadsTableColFormat')}
                      </th>
                      <th scope="col" id={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.size}>
                        {uiText('downloadsTableColSize')}
                      </th>
                      <th scope="col" id={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.progress}>
                        {uiText('downloadsTableColProgress')}
                      </th>
                      <th scope="col" id={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.speed}>
                        {uiText('downloadsTableColSpeed')}
                      </th>
                      <th scope="col" id={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.eta}>
                        {uiText('downloadsTableColEta')}
                      </th>
                      <th scope="col" id={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.status}>
                        {uiText('downloadsTableColStatus')}
                      </th>
                      <th scope="col" id={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.actions}>
                        {uiText('downloadsTableColActions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {downloadsRows.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="app-downloads-empty">
                          {uiText('downloadsEmptyQueue')}
                        </td>
                      </tr>
                    ) : visibleDownloadsRows.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="app-downloads-empty">
                          {uiText('downloadsEmptyFilter')}
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
                            <td className="app-downloads-mono" headers={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.num}>
                              {row.id}
                            </td>
                            <td headers={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.titleUrl}>
                              <div className="app-downloads-row-title">{row.shortLabel}</div>
                              <div className="app-downloads-row-url">{row.url}</div>
                            </td>
                            <td
                              className="app-downloads-mono"
                              headers={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.format}
                            >
                              {row.queueFmt ?? uiText('uiPlaceholderDash')}
                            </td>
                            <td
                              className="app-downloads-mono"
                              headers={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.size}
                            >
                              {row.queueSize ?? uiText('uiPlaceholderDash')}
                            </td>
                            <td
                              className="app-downloads-mono"
                              headers={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.progress}
                            >
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
                                  <span
                                    className="app-downloads-progress-fallback"
                                    title={row.progress}
                                  >
                                    {row.progress}
                                  </span>
                                ) : (
                                  uiText('uiPlaceholderDash')
                                )}
                              </div>
                            </td>
                            <td
                              className="app-downloads-mono"
                              headers={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.speed}
                            >
                              {row.queueSpeed ?? uiText('uiPlaceholderDash')}
                            </td>
                            <td
                              className="app-downloads-mono"
                              headers={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.eta}
                            >
                              {row.queueEta ?? uiText('uiPlaceholderDash')}
                            </td>
                            <td headers={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.status}>
                              <span
                                className={`app-downloads-status app-downloads-status-${statusTone}`}
                              >
                                <span className="app-downloads-status-dot" aria-hidden />
                                {formatDownloadsQueueRowStatus(row.status)}
                              </span>
                            </td>
                            <td headers={DOWNLOADS_QUEUE_TABLE_HEADER_IDS.actions}>
                              <div
                                className="app-downloads-row-actions"
                                role="toolbar"
                                aria-orientation="horizontal"
                                aria-label={uiTextVars('downloadsQueueRowActionsToolbarAriaTemplate', {
                                  id: String(row.id)
                                })}
                              >
                                <button
                                  type="button"
                                  className="app-icon-btn"
                                  aria-label={uiText('downloadsQueueAriaMoveUp')}
                                  title={uiText('downloadsQueueAriaMoveUp')}
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
                                  aria-label={uiText('downloadsQueueAriaMoveDown')}
                                  title={uiText('downloadsQueueAriaMoveDown')}
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
                                    isYtdlpQueueStatusErrorLike(row.status)
                                      ? uiText('downloadsQueueAriaRetryRow')
                                      : uiText('downloadsQueueAriaStartRow')
                                  }
                                  title={
                                    isYtdlpQueueStatusErrorLike(row.status)
                                      ? uiText('downloadsQueueAriaRetryRow')
                                      : uiText('downloadsQueueAriaStartRow')
                                  }
                                  onClick={() => {
                                    const fn = isYtdlpQueueStatusErrorLike(row.status)
                                      ? window.fluxalloy.downloads.retryRow
                                      : window.fluxalloy.downloads.startRow
                                    void fn(row.id).then((res) => {
                                      if (!res.ok) {
                                        setStatusHint(res.error)
                                      }
                                    })
                                  }}
                                >
                                  {isYtdlpQueueStatusErrorLike(row.status) ? (
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
                                      aria-label={uiText('downloadsQueueAriaOpenFile')}
                                      title={uiText('downloadsQueueAriaOpenFile')}
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
                                      aria-label={uiText('downloadsQueueAriaOpenFolder')}
                                      title={uiText('downloadsQueueAriaOpenFolder')}
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
                                      aria-label={uiText('downloadsQueueAriaOpenInEditor')}
                                      title={uiText('downloadsQueueAriaOpenInEditor')}
                                      onClick={() => {
                                        setStatusHint(
                                          uiText('downloadsHistoryOpenHandlerPreparing')
                                        )
                                        void window.fluxalloy.downloads
                                          .openQueueOutputInHandler(row.id)
                                          .then((res) => {
                                            if (!res.ok) {
                                              setStatusHint(res.error)
                                            } else {
                                              setStatusHint(
                                                uiText('downloadsHistoryOpenHandlerDone')
                                              )
                                            }
                                          })
                                      }}
                                    >
                                      <IconQueueOutbound title="" size={18} />
                                    </button>
                                    {isYtdlpQueueStatusDone(row.status) &&
                                    row.outputPath &&
                                    isFfmpegExportBatchVideoPath(row.outputPath) ? (
                                      <button
                                        type="button"
                                        className="app-icon-btn"
                                        aria-label={uiText('batchExportAddToBatch')}
                                        title={uiText('batchExportAddToBatch')}
                                        onClick={() => {
                                          void handleBatchAddDownloadsDone([row.id])
                                        }}
                                      >
                                        <IconQueuePlus title="" size={18} />
                                      </button>
                                    ) : null}
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    className="app-icon-btn"
                                    aria-label={uiText('downloadsQueueOpenDownloadDirTitle')}
                                    title={uiText('downloadsQueueOpenDownloadDirTitle')}
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
                                )}
                                {row.isActiveRunner ? (
                                  <button
                                    type="button"
                                    className="app-icon-btn"
                                    disabled={
                                      row.ytdlpPauseSupported !== true ||
                                      row.ytdlpPauseChildActive !== true
                                    }
                                    aria-label={
                                      row.ytdlpPaused
                                        ? uiText('downloadsQueueAriaResumeYtdlp')
                                        : uiText('downloadsQueueAriaPauseYtdlp')
                                    }
                                    title={
                                      row.ytdlpPauseSupported !== true
                                        ? uiText('downloadsQueuePauseUnsupportedOsTitle')
                                        : row.ytdlpPauseChildActive !== true
                                          ? uiText('downloadsQueuePauseWaitingProcessTitle')
                                          : row.ytdlpPaused
                                            ? uiText('downloadsQueueAriaResumeYtdlp')
                                            : uiText('downloadsQueueAriaPauseYtdlp')
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
                                  aria-label={uiText('downloadsQueueAriaRemoveRow')}
                                  title={uiText('downloadsQueueAriaRemoveRow')}
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
              <div
                className="app-downloads-lower-stack"
                role="region"
                aria-label={uiText('downloadsLowerStackAria')}
              >
                <DownloadsHistoryPanel
                  open={downloadsEmbeddedHistoryOpen}
                  busy={downloadsHistoryBusy}
                  entries={visibleDownloadsHistory}
                  totalEntries={downloadsHistory.length}
                  outcomeFilter={downloadsHistoryOutcomeFilter}
                  weeklySummary={
                    downloadsHistoryWeeklySummary ?? {
                      since: 0,
                      until: 0,
                      total: 0,
                      success: 0,
                      error: 0,
                      cancelled: 0
                    }
                  }
                  onToggle={(next) => {
                    persistDownloadsEmbeddedHistoryOpen(next)
                  }}
                  onOutcomeFilterChange={setDownloadsHistoryOutcomeFilter}
                  onRefresh={() => {
                    void refreshDownloadsHistory()
                  }}
                  onClear={() => {
                    void window.fluxalloy.downloads.clearHistory().then((res) => {
                      if (!res.ok) {
                        setStatusHint(res.error)
                        return
                      }
                      setDownloadsHistory([])
                    })
                  }}
                  onExportVisible={() => {
                    void exportVisibleDownloadsHistory()
                  }}
                  onRepeat={(url) => {
                    void window.fluxalloy.downloads.addLines(url).then((res) => {
                      if (!res.ok) {
                        setStatusHint(res.error)
                        return
                      }
                      setWorkspaceTab('downloads')
                      setStatusHint(
                        res.added > 0
                          ? uiText('downloadsHistoryRepeatQueued')
                          : uiText('downloadsHistoryRepeatNotAdded')
                      )
                    })
                  }}
                />
                <DownloadsLogPanel
                  open={downloadsEmbeddedLogOpen}
                  targetRowId={downloadsLogTargetRowId}
                  lines={downloadsLogLines}
                  onToggle={(next) => {
                    persistDownloadsEmbeddedLogOpen(next)
                  }}
                  onClear={() => {
                    setDownloadsLogLines([])
                    setDownloadsLogTargetRowId(null)
                  }}
                  onSave={() => {
                    const text = formatDownloadsLogText(downloadsLogLines)
                    void window.fluxalloy.downloads.saveVisibleLog(text).then((res) => {
                      if (!res.ok && res.error !== DOWNLOADS_VISIBLE_LOG_SAVE_CANCELLED) {
                        setStatusHint(res.error)
                      }
                    })
                  }}
                />
              </div>
            </div>
          </section>
          <aside
            ref={downloadsSettingsRailRef}
            id="downloads-ytdlp-settings-rail"
            className="app-downloads-rail"
            aria-label={uiText('downloadsRailAria')}
          >
            <h3 className="app-settings-title">{uiText('downloadsRailTitle')}</h3>
            <p className="app-settings-subtitle" title={uiText('downloadsRailIntroTooltip')}>
              {uiText('downloadsRailSubtitle')}
            </p>
            {downloadsOptions ? (
              <div
                className="app-downloads-settings-stack"
                role="region"
                aria-busy={downloadsOptionsBusy}
                aria-label={uiText('downloadsSettingsSectionsStackAria')}
              >
                <details
                  className="app-downloads-rail-section"
                  aria-label={uiText('downloadsRailFormatSummary')}
                  open={downloadsRailPanels.format}
                  onToggle={handleDownloadsRailSectionToggle('format')}
                >
                  <summary
                    className="app-downloads-rail-summary"
                    title={uiText('downloadsTooltipSectionFormat')}
                  >
                    {uiText('downloadsRailFormatSummary')}
                  </summary>
                  <div className="app-downloads-rail-section-body">
                    <label
                      className="app-field"
                      title={uiText('downloadsTooltipFormatPresetSelect')}
                    >
                      <span>{uiText('downloadsRailFormatQualityLabel')}</span>
                      <select
                        className="app-control"
                        title={uiText('downloadsTooltipFormatPresetSelect')}
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
                        {uiText('downloadsFormatHint')}
                      </span>
                    </label>
                    <div className="app-downloads-switch-grid">
                      <div className="app-field app-field-switch">
                        <span>{uiText('downloadsPlaylistSpan')}</span>
                        <PillSwitch
                          label={uiText('downloadsPlaylistPillLabel')}
                          tooltip={uiText('downloadsTooltipPlaylistSwitch')}
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
                          {uiText('downloadsPlaylistHint')}
                        </span>
                      </div>
                      <div className="app-field app-field-switch">
                        <span>{uiText('downloadsAudioOnlySpan')}</span>
                        <PillSwitch
                          label={uiText('downloadsAudioOnlyPillLabel')}
                          tooltip={uiText('downloadsTooltipAudioOnlySwitch')}
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
                          {uiText('downloadsAudioOnlyHint')}
                        </span>
                      </div>
                    </div>
                    <label className="app-field" title={uiText('downloadsTooltipSubtitlesSelect')}>
                      <span>{uiText('downloadsSubtitlesLabel')}</span>
                      <select
                        className="app-control"
                        title={uiText('downloadsTooltipSubtitlesSelect')}
                        value={downloadsOptions.subtitlePreset}
                        disabled={downloadsOptionsBusy}
                        onChange={(e) => {
                          void applyDownloadsOptionsPatch({
                            subtitlePreset: e.target.value as YtdlpSubtitlePresetId
                          })
                        }}
                      >
                        <option value="none">{uiText('downloadsSubPresetNone')}</option>
                        <option value="manual">{uiText('downloadsSubPresetManual')}</option>
                        <option value="manual_auto">
                          {uiText('downloadsSubPresetManualAuto')}
                        </option>
                      </select>
                      <span className="app-field-help">{uiText('downloadsSubLangsHelp')}</span>
                    </label>
                    <label className="app-field" title={uiText('downloadsTooltipSubLangsInput')}>
                      <span>{uiText('downloadsSubLangsLabel')}</span>
                      <input
                        className="app-control app-downloads-template-input"
                        title={uiText('downloadsTooltipSubLangsInput')}
                        value={downloadsOptions.subLangsLine}
                        disabled={
                          downloadsOptionsBusy || downloadsOptions.subtitlePreset === 'none'
                        }
                        spellCheck={false}
                        placeholder={uiText('downloadsSubLangsPlaceholder')}
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
                  aria-label={uiText('downloadsRailMetadataSummary')}
                  open={downloadsRailPanels.metadata}
                  onToggle={handleDownloadsRailSectionToggle('metadata')}
                >
                  <summary
                    className="app-downloads-rail-summary"
                    title={uiText('downloadsTooltipSectionMetadata')}
                  >
                    {uiText('downloadsRailMetadataSummary')}
                  </summary>
                  <div className="app-downloads-rail-section-body">
                    <div className="app-field app-field-switch">
                      <span>{uiText('downloadsOpenAfterSuccessSpan')}</span>
                      <PillSwitch
                        label={uiText('downloadsOpenAfterSuccessPillLabel')}
                        tooltip={uiText('downloadsTooltipOpenAfterSuccess')}
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
                        {uiText('downloadsOpenAfterSuccessHint')}
                      </span>
                    </div>
                    <div className="app-field app-field-switch">
                      <span>{uiText('downloadsAutoExportSpan')}</span>
                      <PillSwitch
                        label={uiText('downloadsAutoExportPillLabel')}
                        tooltip={uiText('downloadsTooltipAutoExport')}
                        checked={downloadsOptions.autoExportAfterOpenInHandler}
                        describedBy="downloadsAutoExportAfterOpenHint"
                        disabled={downloadsOptionsBusy || !downloadsOptions.openInHandlerOnComplete}
                        onToggle={() => {
                          void applyDownloadsOptionsPatch({
                            autoExportAfterOpenInHandler:
                              !downloadsOptions.autoExportAfterOpenInHandler
                          })
                        }}
                      />
                      <span id="downloadsAutoExportAfterOpenHint" className="app-field-help">
                        {uiText('downloadsAutoExportHint')}
                      </span>
                    </div>
                    <div className="app-field app-field-switch">
                      <span>{uiText('downloadsEnqueueBatchSpan')}</span>
                      <PillSwitch
                        label={uiText('downloadsEnqueueBatchPillLabel')}
                        tooltip={uiText('downloadsTooltipEnqueueBatch')}
                        checked={downloadsOptions.enqueueBatchOnDownloadComplete}
                        describedBy="downloadsEnqueueBatchHint"
                        disabled={downloadsOptionsBusy}
                        onToggle={() => {
                          void applyDownloadsOptionsPatch({
                            enqueueBatchOnDownloadComplete:
                              !downloadsOptions.enqueueBatchOnDownloadComplete
                          })
                        }}
                      />
                      <span id="downloadsEnqueueBatchHint" className="app-field-help">
                        {uiText('downloadsEnqueueBatchHint')}
                      </span>
                    </div>
                    <div className="app-field app-field-switch">
                      <span>{uiText('downloadsAutoStartBatchSpan')}</span>
                      <PillSwitch
                        label={uiText('downloadsAutoStartBatchPillLabel')}
                        tooltip={uiText('downloadsTooltipAutoStartBatch')}
                        checked={downloadsOptions.autoStartBatchAfterEnqueue}
                        describedBy="downloadsAutoStartBatchHint"
                        disabled={
                          downloadsOptionsBusy || !downloadsOptions.enqueueBatchOnDownloadComplete
                        }
                        onToggle={() => {
                          void applyDownloadsOptionsPatch({
                            autoStartBatchAfterEnqueue: !downloadsOptions.autoStartBatchAfterEnqueue
                          })
                        }}
                      />
                      <span id="downloadsAutoStartBatchHint" className="app-field-help">
                        {uiText('downloadsAutoStartBatchHint')}
                      </span>
                    </div>
                    <div className="app-downloads-select-grid">
                      <label className="app-field" title={uiText('downloadsTooltipCookiesBrowser')}>
                        <span>{uiText('downloadsCookiesBrowserLabel')}</span>
                        <select
                          className="app-control"
                          title={uiText('downloadsTooltipCookiesBrowser')}
                          value={downloadsOptions.cookiesBrowserChoice}
                          disabled={downloadsOptionsBusy}
                          onChange={(e) => {
                            void applyDownloadsOptionsPatch({
                              cookiesBrowser: e.target.value as 'none' | YtdlpCookiesBrowserId
                            })
                          }}
                        >
                          <option value="none">{uiText('downloadsCookiesBrowserNone')}</option>
                          <option value="chrome">
                            {uiText('downloadsYtdlpBrowserPrettyChrome')}
                          </option>
                          <option value="edge">{uiText('downloadsYtdlpBrowserPrettyEdge')}</option>
                          <option value="firefox">
                            {uiText('downloadsYtdlpBrowserPrettyFirefox')}
                          </option>
                        </select>
                      </label>
                      <label className="app-field" title={uiText('downloadsTooltipImpersonate')}>
                        <span>{uiText('downloadsImpersonateLabel')}</span>
                        <select
                          className="app-control"
                          title={uiText('downloadsTooltipImpersonate')}
                          value={downloadsOptions.impersonateChoice}
                          disabled={downloadsOptionsBusy}
                          onChange={(e) => {
                            void applyDownloadsOptionsPatch({
                              impersonate: e.target.value as 'none' | YtdlpImpersonateId
                            })
                          }}
                        >
                          <option value="none">{uiText('downloadsImpersonateOff')}</option>
                          <option value="chrome">
                            {uiText('downloadsYtdlpBrowserTokenChrome')}
                          </option>
                          <option value="edge">{uiText('downloadsYtdlpBrowserTokenEdge')}</option>
                          <option value="firefox">
                            {uiText('downloadsYtdlpBrowserTokenFirefox')}
                          </option>
                        </select>
                      </label>
                    </div>
                    <label className="app-field" title={uiText('downloadsTooltipCookiesProfile')}>
                      <span>{uiText('downloadsCookiesProfileLabel')}</span>
                      <input
                        className="app-control app-downloads-template-input"
                        title={uiText('downloadsTooltipCookiesProfile')}
                        value={downloadsOptions.cookiesBrowserProfileLine}
                        disabled={downloadsOptionsBusy}
                        spellCheck={false}
                        autoComplete="off"
                        placeholder={uiText('downloadsCookiesProfilePlaceholder')}
                        aria-describedby="downloadsCookiesProfileHint"
                        onChange={(e) => {
                          setDownloadsOptions({
                            ...downloadsOptions,
                            cookiesBrowserProfileLine: e.target.value
                          })
                        }}
                        onBlur={(e) => {
                          void applyDownloadsOptionsPatch({
                            cookiesBrowserProfile: e.target.value
                          })
                        }}
                      />
                      <span id="downloadsCookiesProfileHint" className="app-field-help">
                        {uiText('downloadsCookiesProfileHint')}
                      </span>
                    </label>
                    <div
                      className="app-downloads-output-dir"
                      role="group"
                      aria-label={uiText('downloadsCookiesFileGroupAria')}
                    >
                      <span className="app-field-help">
                        {uiText('downloadsCookiesNetscapeHelp')}
                      </span>
                      <strong title={downloadsOptions.cookiesFilePathStored}>
                        {downloadsOptions.cookiesFilePathStored ||
                          uiText('downloadsCookiesFileNotSelected')}
                      </strong>
                      <span className="app-field-help">
                        {uiText('downloadsCookiesFilePriorityHelp')}
                      </span>
                      <div
                        className="app-downloads-history-actions"
                        role="toolbar"
                        aria-orientation="horizontal"
                        aria-label={uiText('downloadsCookiesFileActionsToolbarAria')}
                      >
                        <button
                          type="button"
                          className="app-btn app-btn-compact app-btn-icon-leading"
                          disabled={downloadsOptionsBusy}
                          title={uiText('downloadsTooltipCookiesPick')}
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
                          <IconQueueFile title="" size={14} />
                          {uiText('downloadsRailPick')}
                        </button>
                        <button
                          type="button"
                          className="app-btn app-btn-compact app-btn-icon-leading"
                          disabled={
                            downloadsOptionsBusy ||
                            downloadsOptions.cookiesFilePathStored.length === 0
                          }
                          title={uiText('downloadsTooltipCookiesClear')}
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
                          <IconQueueX title="" size={14} />
                          {uiText('downloadsHistoryClear')}
                        </button>
                      </div>
                    </div>
                  </div>
                </details>
                <details
                  className="app-downloads-rail-section"
                  aria-label={uiText('downloadsRailSavingSummary')}
                  open={downloadsRailPanels.saving}
                  onToggle={handleDownloadsRailSectionToggle('saving')}
                >
                  <summary
                    className="app-downloads-rail-summary"
                    title={uiText('downloadsTooltipSectionSaving')}
                  >
                    {uiText('downloadsRailSavingSummary')}
                  </summary>
                  <div className="app-downloads-rail-section-body">
                    <div
                      className="app-downloads-output-dir"
                      role="group"
                      aria-label={uiText('downloadsOutputDirAria')}
                    >
                      <span className="app-field-help">{uiText('downloadsOutputDirLabel')}</span>
                      <strong title={downloadsOutputDirectory?.path ?? ''}>
                        {downloadsOutputDirectory?.path ?? uiText('downloadsOutputPathLoading')}
                      </strong>
                      <span className="app-field-help">
                        {downloadsOutputDirectory?.isDefault
                          ? uiText('downloadsOutputUseDefaultUserdata')
                          : uiText('downloadsOutputUseCustom')}
                      </span>
                      <div
                        className="app-downloads-history-actions"
                        role="toolbar"
                        aria-orientation="horizontal"
                        aria-label={uiText('downloadsOutputDirActionsToolbarAria')}
                      >
                        <button
                          type="button"
                          className="app-btn app-btn-compact app-btn-icon-leading"
                          title={uiText('downloadsTooltipOutputOpenFolder')}
                          onClick={() => {
                            void window.fluxalloy.downloads.openOutputDirectory().then((res) => {
                              if (!res.ok) {
                                setStatusHint(res.error)
                              }
                            })
                          }}
                        >
                          <IconFolderOpen title="" size={14} />
                          {uiText('downloadsRailOpenFolder')}
                        </button>
                        <button
                          type="button"
                          className="app-btn app-btn-compact app-btn-icon-leading"
                          title={uiText('downloadsTooltipOutputPick')}
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
                          <IconQueuePlus title="" size={14} />
                          {uiText('downloadsRailPick')}
                        </button>
                        <button
                          type="button"
                          className="app-btn app-btn-compact app-btn-icon-leading"
                          title={uiText('downloadsTooltipOutputDefault')}
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
                          <IconHome title="" size={14} />
                          {uiText('downloadsOutputDefaultButton')}
                        </button>
                      </div>
                    </div>
                    <label className="app-field" title={uiText('downloadsTooltipFilenameTemplate')}>
                      <span>{uiText('downloadsFilenameTemplateLabel')}</span>
                      <input
                        className="app-control app-downloads-template-input"
                        title={uiText('downloadsTooltipFilenameTemplate')}
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
                        {uiText('downloadsFilenameTemplateHelp')}
                      </span>
                    </label>
                  </div>
                </details>
                <details
                  className="app-downloads-rail-section"
                  aria-label={uiText('downloadsRailNetworkSummary')}
                  open={downloadsRailPanels.network}
                  onToggle={handleDownloadsRailSectionToggle('network')}
                >
                  <summary
                    className="app-downloads-rail-summary"
                    title={uiText('downloadsTooltipSectionNetwork')}
                  >
                    {uiText('downloadsRailNetworkSummary')}
                  </summary>
                  <div className="app-downloads-rail-section-body">
                    <label className="app-field" title={uiText('downloadsTooltipQueueRetrySelect')}>
                      <span>{uiText('downloadsQueueRetryLabel')}</span>
                      <select
                        className="app-control"
                        title={uiText('downloadsTooltipQueueRetrySelect')}
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
                      <span className="app-field-help">{uiText('downloadsQueueRetryHelp')}</span>
                    </label>
                    <div className="app-downloads-select-grid">
                      <label className="app-field" title={uiText('downloadsTooltipRateLimitInput')}>
                        <span>{uiText('downloadsRateLimitLabel')}</span>
                        <input
                          className="app-control"
                          title={uiText('downloadsTooltipRateLimitInput')}
                          value={downloadsOptions.rateLimit}
                          disabled={downloadsOptionsBusy}
                          placeholder={uiText('downloadsRateLimitPlaceholder')}
                          spellCheck={false}
                          onChange={(e) => {
                            setDownloadsOptions({ ...downloadsOptions, rateLimit: e.target.value })
                          }}
                          onBlur={(e) => {
                            void applyDownloadsOptionsPatch({ rateLimit: e.target.value })
                          }}
                        />
                        <span className="app-field-help">{uiText('downloadsRateLimitHelp')}</span>
                      </label>
                      <label className="app-field" title={uiText('downloadsTooltipRetriesInput')}>
                        <span>{uiText('downloadsYtdlpRetriesLabel')}</span>
                        <input
                          className="app-control"
                          title={uiText('downloadsTooltipRetriesInput')}
                          value={downloadsOptions.retriesLine}
                          disabled={downloadsOptionsBusy}
                          inputMode="numeric"
                          placeholder={uiText('downloadsYtdlpRetriesPlaceholder')}
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
                        <span className="app-field-help">
                          {uiText('downloadsYtdlpRetriesHelp')}
                        </span>
                      </label>
                      <label
                        className="app-field"
                        title={uiText('downloadsTooltipFragmentRetriesInput')}
                      >
                        <span>{uiText('downloadsFragmentRetriesLabel')}</span>
                        <input
                          className="app-control"
                          title={uiText('downloadsTooltipFragmentRetriesInput')}
                          value={downloadsOptions.fragmentRetriesLine}
                          disabled={downloadsOptionsBusy}
                          inputMode="numeric"
                          placeholder={uiText('downloadsFragmentRetriesPlaceholder')}
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
                        <span className="app-field-help">
                          {uiText('downloadsFragmentRetriesHelp')}
                        </span>
                      </label>
                    </div>
                  </div>
                </details>
                <details
                  className="app-downloads-rail-section"
                  aria-label={uiText('downloadsRailExpertSummary')}
                  open={downloadsRailPanels.expert}
                  onToggle={handleDownloadsRailSectionToggle('expert')}
                >
                  <summary
                    className="app-downloads-rail-summary"
                    title={uiText('downloadsTooltipSectionExpert')}
                  >
                    {uiText('downloadsRailExpertSummary')}
                  </summary>
                  <div className="app-downloads-rail-section-body">
                    <label
                      className="app-field"
                      title={uiText('downloadsTooltipExtraArgsTextarea')}
                    >
                      <span>{uiText('downloadsExtraArgsLabel')}</span>
                      <textarea
                        className="app-control app-downloads-extra-args"
                        title={uiText('downloadsTooltipExtraArgsTextarea')}
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
                      <span className="app-field-help">{uiText('downloadsExtraArgsHelp')}</span>
                    </label>
                    {downloadsOptions.extraArgsParseWarning ? (
                      <p className="app-downloads-warning" role="alert">
                        {downloadsOptions.extraArgsParseWarning}
                      </p>
                    ) : null}
                    <p id="downloadsHintCatalogIntro" className="app-field-help">
                      {uiText('downloadsHintCatalogIntro')}
                    </p>
                    <label className="app-field" title={uiText('downloadsTooltipHintSearchInput')}>
                      <span>{uiText('downloadsHintCatalogFilterLabel')}</span>
                      <input
                        type="text"
                        className="app-control app-downloads-hint-filter"
                        title={uiText('downloadsTooltipHintSearchInput')}
                        spellCheck={false}
                        autoComplete="off"
                        placeholder={uiText('downloadsHintSearchPlaceholder')}
                        aria-describedby="downloadsHintCatalogIntro"
                        disabled={downloadsOptionsBusy}
                        value={downloadsExpertHintFilter}
                        onChange={(e) => setDownloadsExpertHintFilter(e.target.value)}
                      />
                    </label>
                    <div
                      className="app-downloads-hint-list"
                      role="list"
                      aria-label={uiText('downloadsHintListAria')}
                    >
                      {!downloadsOptions.commandHints?.length ? (
                        <div className="app-downloads-hint-item app-downloads-hint-item--muted">
                          {uiText('downloadsHintsUnavailable')}
                        </div>
                      ) : ytdlpCommandHintsFilteredByCategory.length === 0 ? (
                        <div className="app-downloads-hint-item app-downloads-hint-item--muted">
                          {uiText('downloadsHintsNoMatches')}
                        </div>
                      ) : (
                        ytdlpCommandHintsFilteredByCategory.map(([cat, rows]) => (
                          <div key={cat}>
                            <div className="app-downloads-hint-cat" role="presentation">
                              {cat}
                            </div>
                            {rows.map((h) => (
                              <div
                                key={`${cat}:${h.token}`}
                                className="app-downloads-hint-item"
                                role="listitem"
                              >
                                <button
                                  type="button"
                                  className="app-downloads-hint-token"
                                  title={h.summary || h.token}
                                  aria-label={downloadsCatalogHintTokenAccessibleDescription(cat, h)}
                                  disabled={downloadsOptionsBusy}
                                  onClick={() => appendDownloadsExtraArgsToken(h.token)}
                                >
                                  {h.token}
                                </button>
                                {h.summary ? (
                                  <div className="app-downloads-hint-desc" title={h.summary}>
                                    {h.summary}
                                  </div>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ))
                      )}
                    </div>
                    <span className="app-field-help">
                      {uiText('downloadsHintsSameAsPopoutHelp')}
                    </span>
                    <nav
                      className="app-doc-inline-links app-downloads-doc-links"
                      aria-label={uiText('downloadsRailExpertDocNavAria')}
                    >
                      <a href={YTDLP_DOC_README} target="_blank" rel="noreferrer">
                        {uiText('docLinkYtDlpReadme')}
                      </a>
                      {' · '}
                      <a href={YTDLP_DOC_FORMAT_SELECTION} target="_blank" rel="noreferrer">
                        {uiText('quickYtdlpDocFormats')}
                      </a>
                      {' · '}
                      <a href={YTDLP_DOC_OUTPUT_TEMPLATE} target="_blank" rel="noreferrer">
                        {uiText('downloadsRailDocOutput')}
                      </a>
                      {' · '}
                      <a href={YTDLP_DOC_POSTPROCESS} target="_blank" rel="noreferrer">
                        {uiText('downloadsRailDocPostprocess')}
                      </a>
                    </nav>
                    <span id="downloads-command-preview-help" className="app-field-help">
                      {uiText('downloadsCommandPreviewHelp')}
                    </span>
                    <div className="app-downloads-command-preview app-downloads-command-preview--flat">
                      <pre
                        className="app-downloads-command-preview-pre"
                        role="status"
                        aria-live="polite"
                        aria-relevant="text"
                        aria-labelledby="downloads-command-preview-help"
                      >
                        {downloadsOptions.commandPreview}
                      </pre>
                    </div>
                  </div>
                </details>
                {downloadsOptions.cookiesWarning ? (
                  <p className="app-downloads-warning">{downloadsOptions.cookiesWarning}</p>
                ) : null}
              </div>
            ) : (
              <p className="app-settings-subtitle">{uiText('downloadsOptionsLoading')}</p>
            )}
            <div
              className="app-downloads-rail-footer"
              role="toolbar"
              aria-orientation="horizontal"
              aria-label={uiText('downloadsRailFooterToolbarAria')}
            >
              <button
                type="button"
                className="app-btn app-btn-icon-leading"
                disabled={downloadsOptionsBusy}
                title={uiText('downloadsTooltipRefreshFooter')}
                onClick={() => {
                  void refreshDownloadsOptions()
                }}
              >
                <IconRefreshCw title="" size={16} />
                {uiText('downloadsRailRefreshOptions')}
              </button>
            </div>
          </aside>
        </main>
      )}

      <footer className="app-statusbar" aria-label={uiText('appStatusbarAria')}>
        <div
          role="group"
          aria-label={uiText('statusbarEnginesClusterAria')}
          className="app-statusbar-cluster"
        >
          <span>{engineSummaryText(engineSummary)}</span>
          {engineVersionsLine ? (
            <>
              <span className="app-statusbar-sep" aria-hidden />
              <span className="app-statusbar-engines" title={engineVersionsLine}>
                {engineVersionsLine}
              </span>
            </>
          ) : null}
        </div>
        {workspaceTab === 'editor' ? (
          <div
            role="group"
            aria-label={uiText('statusbarExportCodecClusterAria')}
            className="app-statusbar-cluster"
          >
            <span className="app-statusbar-sep" aria-hidden />
            <span className="app-statusbar-codec" title={exportCodecStatusbarLabel}>
              {exportCodecStatusbarLabel}
            </span>
          </div>
        ) : null}
        {statusHint ? (
          <>
            <span className="app-statusbar-sep" aria-hidden />
            <span className="app-statusbar-extra" role="status" aria-live="polite">
              {statusHint}
            </span>
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
        onOpenKnowledgeArticle={(slug) => {
          setAboutOpen(false)
          setKnowledgeInitialSlug(slug)
          setKnowledgeOpen(true)
        }}
      />

      <KnowledgeDialog
        open={knowledgeOpen}
        initialSlug={knowledgeInitialSlug}
        localeVersion={uiLocaleRenderTick}
        onClose={() => {
          setKnowledgeOpen(false)
          setKnowledgeInitialSlug(null)
        }}
        onStatus={(message) => {
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
              {exportPresetNameDialog.mode === 'create'
                ? uiText('editorExportPresetDialogTitleCreate')
                : uiText('editorExportPresetDialogTitleRename')}
            </h2>
            <p id="export-preset-name-hint" className="app-modal-hint">
              {uiText('editorExportPresetDialogHint')}
            </p>
            <div role="group" aria-label={uiText('exportPresetNameFieldGroupAria')}>
              <label className="app-engine-path-row">
                <span className="app-engine-path-label">{uiText('editorExportPresetNameLabel')}</span>
                <input
                  className="app-engine-path-input"
                  type="text"
                  maxLength={64}
                  autoFocus
                  value={exportPresetNameDialog.value}
                  aria-invalid={exportPresetNameDialog.error !== null}
                  aria-describedby={
                    exportPresetNameDialog.error
                      ? 'export-preset-name-hint export-preset-name-error'
                      : 'export-preset-name-hint'
                  }
                  onChange={(e) => {
                    setExportPresetNameDialog((prev) =>
                      prev === null ? null : { ...prev, value: e.target.value, error: null }
                    )
                  }}
                />
              </label>
            </div>
            {exportPresetNameDialog.error ? (
              <p id="export-preset-name-error" className="app-modal-hint app-modal-error" role="alert">
                {exportPresetNameDialog.error}
              </p>
            ) : null}
            <div
              className="app-modal-footer"
              role="toolbar"
              aria-orientation="horizontal"
              aria-label={uiText('exportPresetDialogFooterToolbarAria')}
            >
              <button
                type="button"
                className="app-btn"
                onClick={() => {
                  setExportPresetNameDialog(null)
                }}
              >
                {uiText('appDialogCancel')}
              </button>
              <button type="submit" className="app-btn app-btn-primary">
                {uiText('appDialogSave')}
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
            aria-describedby="engine-paths-hint"
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
          >
            <h2 id="engine-paths-title" className="app-modal-title">
              {uiText('editorEnginePathsDialogTitle')}
            </h2>
            <p id="engine-paths-hint" className="app-modal-hint">
              {uiText('editorEnginePathsDialogHint')}
            </p>
            <div
              className="app-engine-path-rows"
              role="group"
              aria-label={uiText('enginePathsDialogRowsGroupAria')}
            >
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
                    placeholder={uiText('editorEnginePathPlaceholderAuto')}
                    value={enginePathsDraft[id]}
                    onChange={(e) => {
                      setEnginePathsDraft((prev) => ({ ...prev, [id]: e.target.value }))
                    }}
                  />
                  <div
                    className="app-engine-path-actions"
                    role="toolbar"
                    aria-orientation="horizontal"
                    aria-label={uiTextVars('editorEnginePathRowToolbarAriaTemplate', {
                      engine: engineLabel(id)
                    })}
                  >
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      onClick={() => {
                        void handlePickEngine(id)
                      }}
                    >
                      {uiText('editorEnginePathBrowse')}
                    </button>
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      onClick={() => {
                        setEnginePathsDraft((prev) => ({ ...prev, [id]: '' }))
                      }}
                    >
                      {uiText('editorEnginePathClear')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="app-modal-footer"
              role="toolbar"
              aria-orientation="horizontal"
              aria-label={uiText('enginePathsDialogFooterToolbarAria')}
            >
              <button
                type="button"
                className="app-btn app-btn-danger"
                disabled={engineDownloadBusy}
                title={uiText('editorEnginePathsRemoveDownloadedTooltip')}
                onClick={() => {
                  void handleClearDownloadedEngines()
                }}
              >
                {uiText('editorEnginePathsRemoveDownloaded')}
              </button>
              <button
                type="button"
                className="app-btn"
                onClick={() => {
                  setEnginePathsOpen(false)
                }}
              >
                {uiText('appDialogCancel')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-primary"
                onClick={() => {
                  void handleSaveEnginePaths()
                }}
              >
                {uiText('appDialogSave')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
