export type { DownloadsRailPanelKey, DownloadsRailPanelsState } from './stores/panels-store'

import { usePanelsStore } from './stores/panels-store'

export function useDownloadsWindowUiPanels(): Pick<
  ReturnType<typeof usePanelsStore.getState>,
  | 'downloadsEmbeddedHistoryOpen'
  | 'downloadsEmbeddedLogOpen'
  | 'downloadsHistoryListMode'
  | 'downloadsRailPanels'
  | 'hydrateDownloadsWindowUiPanels'
  | 'persistDownloadsEmbeddedHistoryOpen'
  | 'persistDownloadsEmbeddedLogOpen'
  | 'persistDownloadsHistoryListMode'
  | 'persistDownloadsRailPanelToggle'
> {
  return usePanelsStore()
}
