import { useAppRefsStore } from './app-refs-store'
import { useAppShellStore } from './app-shell-store'
import { useBatchExportStore } from './batch-export-store'
import { useDownloadsStore } from './downloads-store'
import { useExportSettingsStore } from './export-settings-store'
import { usePanelsStore } from './panels-store'
import { useProcessingHistoryStore } from './processing-history-store'
import { useTerminalStore } from './terminal-store'

export function resetAllRendererStores(): void {
  useAppShellStore.getState().reset()
  useAppRefsStore.getState().reset()
  useDownloadsStore.getState().reset()
  useExportSettingsStore.getState().reset()
  usePanelsStore.getState().reset()
  useProcessingHistoryStore.getState().reset()
  useBatchExportStore.getState().reset()
  useTerminalStore.getState().reset()
}
