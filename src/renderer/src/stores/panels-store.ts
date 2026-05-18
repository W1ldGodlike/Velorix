import { createRendererStore } from './create-renderer-store'

import type {
  DownloadsHistoryListMode,
  DownloadsWindowUiPanelState,
  MainWindowUiPanelState
} from '../../../shared/settings-contract'
export const MAIN_WINDOW_UI_PANEL_DEFAULTS: Required<MainWindowUiPanelState> = {
  ffmpegSettingsRailOpen: true,
  quickYtdlp: false,
  batchExport: false,
  ffmpegVideo: true,
  ffmpegFormat: true,
  ffmpegAudio: false,
  ffmpegPresets: false,
  workflowScenario: false,
  ffmpegOutput: true,
  exportCommandPreview: true,
  processingHistory: false,
  probeExportSummary: false,
  probeTracks: false,
  probeChapters: false,
  probeRawJson: false
}

export type MainWindowUiPanelKey = keyof typeof MAIN_WINDOW_UI_PANEL_DEFAULTS

export type DownloadsRailPanelKey = 'format' | 'metadata' | 'saving' | 'network' | 'expert'
export type DownloadsRailPanelsState = Record<DownloadsRailPanelKey, boolean>

const DOWNLOADS_RAIL_PANEL_DEFAULTS: DownloadsRailPanelsState = {
  format: true,
  metadata: true,
  saving: true,
  network: false,
  expert: false
}

const DEFAULT_HISTORY_LIST_MODE: DownloadsHistoryListMode = 'compact'

function mergeMainWindowUiPanels(
  patch: MainWindowUiPanelState | null | undefined
): MainWindowUiPanelState {
  return { ...MAIN_WINDOW_UI_PANEL_DEFAULTS, ...(patch ?? {}) }
}

type PanelsStoreState = {
  mainUiPanels: MainWindowUiPanelState
  downloadsEmbeddedHistoryOpen: boolean
  downloadsEmbeddedLogOpen: boolean
  downloadsHistoryListMode: DownloadsHistoryListMode
  downloadsRailPanels: DownloadsRailPanelsState
}

type PanelsStoreActions = {
  panelOpen: (key: MainWindowUiPanelKey) => boolean
  hydrateMainWindowUiPanels: (patch: MainWindowUiPanelState | null | undefined) => void
  persistMainWindowUiPanelToggle: (key: MainWindowUiPanelKey, nextOpen: boolean) => void
  hydrateDownloadsWindowUiPanels: (patch: DownloadsWindowUiPanelState | null | undefined) => void
  persistDownloadsEmbeddedHistoryOpen: (nextOpen: boolean) => void
  persistDownloadsEmbeddedLogOpen: (nextOpen: boolean) => void
  persistDownloadsHistoryListMode: (nextMode: DownloadsHistoryListMode) => void
  persistDownloadsRailPanelToggle: (key: DownloadsRailPanelKey, nextOpen: boolean) => void
  reset: () => void
}

const initialPanelsState: PanelsStoreState = {
  mainUiPanels: MAIN_WINDOW_UI_PANEL_DEFAULTS,
  downloadsEmbeddedHistoryOpen: true,
  downloadsEmbeddedLogOpen: true,
  downloadsHistoryListMode: DEFAULT_HISTORY_LIST_MODE,
  downloadsRailPanels: DOWNLOADS_RAIL_PANEL_DEFAULTS
}

export const usePanelsStore = createRendererStore<PanelsStoreState & PanelsStoreActions>(
  'Panels',
  (set, get) => ({
    ...initialPanelsState,
    panelOpen: (key) => {
      const value = get().mainUiPanels[key]
      return typeof value === 'boolean' ? value : MAIN_WINDOW_UI_PANEL_DEFAULTS[key]
    },
    hydrateMainWindowUiPanels: (patch) => {
      set({ mainUiPanels: mergeMainWindowUiPanels(patch) })
    },
    persistMainWindowUiPanelToggle: (key, nextOpen) => {
      set((s) => ({ mainUiPanels: { ...s.mainUiPanels, [key]: nextOpen } }))
      void window.fluxalloy.settings
        .mergeMainWindowUiPanels({ [key]: nextOpen })
        .catch(console.error)
    },
    hydrateDownloadsWindowUiPanels: (patch) => {
      set({
        downloadsEmbeddedHistoryOpen: patch?.history !== false,
        downloadsEmbeddedLogOpen: patch?.log !== false,
        downloadsHistoryListMode:
          patch?.historyListMode === 'full' || patch?.historyListMode === 'compact'
            ? patch.historyListMode
            : DEFAULT_HISTORY_LIST_MODE,
        downloadsRailPanels: {
          format:
            typeof patch?.format === 'boolean'
              ? patch.format
              : DOWNLOADS_RAIL_PANEL_DEFAULTS.format,
          metadata:
            typeof patch?.metadata === 'boolean'
              ? patch.metadata
              : DOWNLOADS_RAIL_PANEL_DEFAULTS.metadata,
          saving:
            typeof patch?.saving === 'boolean'
              ? patch.saving
              : DOWNLOADS_RAIL_PANEL_DEFAULTS.saving,
          network:
            typeof patch?.network === 'boolean'
              ? patch.network
              : DOWNLOADS_RAIL_PANEL_DEFAULTS.network,
          expert:
            typeof patch?.expert === 'boolean' ? patch.expert : DOWNLOADS_RAIL_PANEL_DEFAULTS.expert
        }
      })
    },
    persistDownloadsEmbeddedHistoryOpen: (nextOpen) => {
      set({ downloadsEmbeddedHistoryOpen: nextOpen })
      void window.fluxalloy.downloads.mergeUiPanels({ history: nextOpen }).then((res) => {
        if (!res.ok) {
          console.error(res.error)
        }
      })
    },
    persistDownloadsEmbeddedLogOpen: (nextOpen) => {
      set({ downloadsEmbeddedLogOpen: nextOpen })
      void window.fluxalloy.downloads.mergeUiPanels({ log: nextOpen }).then((res) => {
        if (!res.ok) {
          console.error(res.error)
        }
      })
    },
    persistDownloadsHistoryListMode: (nextMode) => {
      set({ downloadsHistoryListMode: nextMode })
      void window.fluxalloy.downloads.mergeUiPanels({ historyListMode: nextMode }).then((res) => {
        if (!res.ok) {
          console.error(res.error)
        }
      })
    },
    persistDownloadsRailPanelToggle: (key, nextOpen) => {
      set((s) => ({ downloadsRailPanels: { ...s.downloadsRailPanels, [key]: nextOpen } }))
      void window.fluxalloy.downloads.mergeUiPanels({ [key]: nextOpen }).then((res) => {
        if (!res.ok) {
          console.error(res.error)
        }
      })
    },
    reset: () => {
      set(initialPanelsState)
    }
  })
)
