export { MAIN_WINDOW_UI_PANEL_DEFAULTS, type MainWindowUiPanelKey } from './stores/panels-store'

import { usePanelsStore } from './stores/panels-store'

export function useMainWindowUiPanels(): {
  panelOpen: ReturnType<typeof usePanelsStore.getState>['panelOpen']
  hydrateMainWindowUiPanels: ReturnType<typeof usePanelsStore.getState>['hydrateMainWindowUiPanels']
  persistMainWindowUiPanelToggle: ReturnType<
    typeof usePanelsStore.getState
  >['persistMainWindowUiPanelToggle']
} {
  return usePanelsStore()
}
