import { useMemo } from 'react'

import { useAppShellStore } from '../stores/app-shell-store'
import { useBatchExportStore, selectBatchExportBusy } from '../stores/batch-export-store'
import { useDownloadsStore } from '../stores/downloads-store'
import { useExportSettingsStore } from '../stores/export-settings-store'
import { useTerminalStore } from '../stores/terminal-store'

/** Общий busy для chrome shell (topbar, statusbar, aria-busy). */
export function useAppChromeBusy(): boolean {
  const engineDownloadBusy = useAppShellStore((s) => s.engineDownloadBusy)
  const engineSummary = useAppShellStore((s) => s.engineSummary)
  const probePending = useAppShellStore((s) => s.probePending)
  const exportBusy = useAppShellStore((s) => s.exportBusy)
  const exportCancelBusy = useAppShellStore((s) => s.exportCancelBusy)
  const snapshotBusy = useExportSettingsStore((s) => s.snapshotBusy)
  const extractFramesBusy = useExportSettingsStore((s) => s.extractFramesBusy)
  const exportPresetSaving = useExportSettingsStore((s) => s.exportPresetSaving)
  const enginePathsSaving = useAppShellStore((s) => s.enginePathsSaving)
  const downloadsOptionsBusy = useDownloadsStore((s) => s.downloadsOptionsBusy)
  const downloadsHistoryBusy = useDownloadsStore((s) => s.downloadsHistoryBusy)
  const batchExportBusy = useBatchExportStore((s) => selectBatchExportBusy(s))
  const terminalBusy = useTerminalStore((s) => s.terminalBusy)

  return useMemo(
    () =>
      engineDownloadBusy ||
      engineSummary === 'checking' ||
      probePending ||
      exportBusy ||
      snapshotBusy ||
      extractFramesBusy ||
      exportCancelBusy ||
      batchExportBusy ||
      exportPresetSaving ||
      enginePathsSaving ||
      downloadsOptionsBusy ||
      downloadsHistoryBusy ||
      terminalBusy,
    [
      batchExportBusy,
      downloadsHistoryBusy,
      downloadsOptionsBusy,
      engineDownloadBusy,
      enginePathsSaving,
      engineSummary,
      exportBusy,
      exportCancelBusy,
      exportPresetSaving,
      extractFramesBusy,
      probePending,
      snapshotBusy,
      terminalBusy
    ]
  )
}
