import type { MainWindowUiPanelState } from '../../shared/settings-contract'

export type ProbeInspectorUiState = {
  probeExportSummary: boolean
  probeTracks: boolean
  probeChapters: boolean
  probeRawJson: boolean
}

export const PROBE_UI_DEFAULTS: ProbeInspectorUiState = {
  probeExportSummary: false,
  probeTracks: false,
  probeChapters: false,
  probeRawJson: false
}

export function probePanelsFromSettings(m?: MainWindowUiPanelState): ProbeInspectorUiState {
  return {
    probeExportSummary: m?.probeExportSummary === true,
    probeTracks: m?.probeTracks === true,
    probeChapters: m?.probeChapters === true,
    probeRawJson: m?.probeRawJson === true
  }
}
