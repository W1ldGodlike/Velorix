import { useCallback, useState } from 'react'

import type { MainWindowUiPanelState } from '../../shared/settings-contract'

/** §2.2 — единая точка управления состоянием сворачиваемых панелей главного окна. */
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

function mergeMainWindowUiPanels(
  patch: MainWindowUiPanelState | null | undefined
): MainWindowUiPanelState {
  return { ...MAIN_WINDOW_UI_PANEL_DEFAULTS, ...(patch ?? {}) }
}

export function useMainWindowUiPanels(): {
  panelOpen: (key: MainWindowUiPanelKey) => boolean
  hydrateMainWindowUiPanels: (patch: MainWindowUiPanelState | null | undefined) => void
  persistMainWindowUiPanelToggle: (key: MainWindowUiPanelKey, nextOpen: boolean) => void
} {
  const [mainUiPanels, setMainUiPanels] = useState<MainWindowUiPanelState>(
    MAIN_WINDOW_UI_PANEL_DEFAULTS
  )

  const panelOpen = useCallback(
    (key: MainWindowUiPanelKey): boolean => {
      const value = mainUiPanels[key]
      return typeof value === 'boolean' ? value : MAIN_WINDOW_UI_PANEL_DEFAULTS[key]
    },
    [mainUiPanels]
  )

  const hydrateMainWindowUiPanels = useCallback(
    (patch: MainWindowUiPanelState | null | undefined) => {
      setMainUiPanels(mergeMainWindowUiPanels(patch))
    },
    []
  )

  const persistMainWindowUiPanelToggle = useCallback(
    (key: MainWindowUiPanelKey, nextOpen: boolean): void => {
      setMainUiPanels((prev) => ({ ...prev, [key]: nextOpen }))
      void window.fluxalloy.settings
        .mergeMainWindowUiPanels({ [key]: nextOpen })
        .catch(console.error)
    },
    []
  )

  return { panelOpen, hydrateMainWindowUiPanels, persistMainWindowUiPanelToggle }
}
