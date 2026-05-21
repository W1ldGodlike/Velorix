import type {
  DownloadsWindowUiPanelState,
  MainWindowUiPanelState,
  StoredWindowRect,
  WindowBoundsConfig
} from '../../../shared/settings-contract'

export function parseStoredWindowRect(raw: unknown): StoredWindowRect | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined
  }
  const o = raw as Record<string, unknown>
  const x = Number(o['x'])
  const y = Number(o['y'])
  const width = Number(o['width'])
  const height = Number(o['height'])
  if (![x, y, width, height].every(Number.isFinite)) {
    return undefined
  }
  if (width < 320 || height < 240 || width > 16384 || height > 16384) {
    return undefined
  }
  return { x, y, width, height }
}

export function parseWindowBoundsConfig(raw: unknown): WindowBoundsConfig | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined
  }
  const o = raw as Record<string, unknown>
  const main = parseStoredWindowRect(o['main'])
  const downloads = parseStoredWindowRect(o['downloads'])
  const inspector = parseStoredWindowRect(o['inspector'])
  if (!main && !downloads && !inspector) {
    return undefined
  }
  const cfg: WindowBoundsConfig = {}
  if (main) {
    cfg.main = main
  }
  if (downloads) {
    cfg.downloads = downloads
  }
  if (inspector) {
    cfg.inspector = inspector
  }
  return cfg
}

const MAIN_UI_PANEL_KEYS = [
  'ffmpegSettingsRailOpen',
  'quickYtdlp',
  'ffmpegVideo',
  'ffmpegFormat',
  'ffmpegAudio',
  'ffmpegPresets',
  'workflowScenario',
  'ffmpegOutput',
  'exportCommandPreview',
  'processingHistory',
  'probeExportSummary',
  'probeTracks',
  'probeChapters',
  'probeRawJson'
] as const satisfies ReadonlyArray<keyof MainWindowUiPanelState>

export function parseMainWindowUiPanels(raw: unknown): MainWindowUiPanelState | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined
  }
  const o = raw as Record<string, unknown>
  const out: MainWindowUiPanelState = {}
  for (const k of MAIN_UI_PANEL_KEYS) {
    if (typeof o[k] === 'boolean') {
      out[k] = o[k]
    }
  }
  return Object.keys(out).length > 0 ? out : undefined
}

const DOWNLOADS_UI_PANEL_KEYS = [
  'settings',
  'history',
  'log',
  'format',
  'metadata',
  'saving',
  'network',
  'expert',
  'hints'
] as const satisfies ReadonlyArray<Exclude<keyof DownloadsWindowUiPanelState, 'historyListMode'>>

export function parseDownloadsWindowUiPanels(
  raw: unknown
): DownloadsWindowUiPanelState | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined
  }
  const o = raw as Record<string, unknown>
  const out: DownloadsWindowUiPanelState = {}
  for (const k of DOWNLOADS_UI_PANEL_KEYS) {
    if (typeof o[k] === 'boolean') {
      out[k] = o[k]
    }
  }
  if (o['historyListMode'] === 'compact' || o['historyListMode'] === 'full') {
    out.historyListMode = o['historyListMode']
  }
  return Object.keys(out).length > 0 ? out : undefined
}
