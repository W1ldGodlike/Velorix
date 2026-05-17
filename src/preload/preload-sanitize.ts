import type { DownloadsLogPayload } from '../shared/downloads-log-contract'
import type {
  DownloadsWindowUiPanelState,
  MainWindowUiPanelState
} from '../shared/settings-contract'

export const MAIN_UI_PANEL_KEYS = [
  'ffmpegSettingsRailOpen',
  'quickYtdlp',
  'ffmpegVideo',
  'ffmpegFormat',
  'ffmpegAudio',
  'ffmpegPresets',
  'ffmpegOutput',
  'exportCommandPreview',
  'processingHistory',
  'probeExportSummary',
  'probeTracks',
  'probeChapters',
  'probeRawJson'
] as const satisfies ReadonlyArray<keyof MainWindowUiPanelState>

export function sanitizeMainWindowUiPanelState(raw: unknown): MainWindowUiPanelState | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined
  }
  const src = raw as Record<string, unknown>
  const out: MainWindowUiPanelState = {}
  for (const key of MAIN_UI_PANEL_KEYS) {
    if (typeof src[key] === 'boolean') {
      out[key] = src[key]
    }
  }
  return Object.keys(out).length > 0 ? out : undefined
}

export const DOWNLOADS_WINDOW_UI_PANEL_KEYS: (keyof DownloadsWindowUiPanelState)[] = [
  'history',
  'log',
  'format',
  'metadata',
  'saving',
  'network',
  'expert',
  'hints'
]

export function sanitizeDownloadsWindowUiPanelState(raw: unknown): DownloadsWindowUiPanelState {
  if (!raw || typeof raw !== 'object') {
    return {}
  }
  const src = raw as Record<string, unknown>
  const out: DownloadsWindowUiPanelState = {}
  for (const key of DOWNLOADS_WINDOW_UI_PANEL_KEYS) {
    if (typeof src[key] === 'boolean') {
      out[key] = src[key]
    }
  }
  return out
}

export function isDownloadsLogPayload(raw: unknown): raw is DownloadsLogPayload {
  if (!raw || typeof raw !== 'object') {
    return false
  }
  const o = raw as { kind?: unknown; rowId?: unknown; stream?: unknown; text?: unknown }
  if (o.kind === 'reset') {
    return typeof o.rowId === 'number' && Number.isFinite(o.rowId)
  }
  return (
    o.kind === 'line' &&
    typeof o.rowId === 'number' &&
    Number.isFinite(o.rowId) &&
    (o.stream === 'stdout' || o.stream === 'stderr') &&
    typeof o.text === 'string'
  )
}
