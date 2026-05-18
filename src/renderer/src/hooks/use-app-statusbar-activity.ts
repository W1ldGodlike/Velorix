import { useMemo } from 'react'

import { getUiLocale, uiText } from '../locales/ui-text'
import { buildStatusbarActivityDisplay } from '../statusbar-activity-resolve'
import { useAppShellStore } from '../stores/app-shell-store'
import { useBatchExportStore, selectBatchExportBusy } from '../stores/batch-export-store'
import { useDownloadsStore } from '../stores/downloads-store'
import { useExportSettingsStore } from '../stores/export-settings-store'
import { useTerminalStore } from '../stores/terminal-store'

/** Активность в статусбаре из Zustand (без prop drilling busy-флагов). */
export function useAppStatusbarActivity(
  downloadsRunning: number
): ReturnType<typeof buildStatusbarActivityDisplay> {
  const engineDownloadBusy = useAppShellStore((s) => s.engineDownloadBusy)
  const engineSummary = useAppShellStore((s) => s.engineSummary)
  const exportBusy = useAppShellStore((s) => s.exportBusy)
  const exportCancelBusy = useAppShellStore((s) => s.exportCancelBusy)
  const probePending = useAppShellStore((s) => s.probePending)
  const snapshotBusy = useExportSettingsStore((s) => s.snapshotBusy)
  const extractFramesBusy = useExportSettingsStore((s) => s.extractFramesBusy)
  const batchExportBusy = useBatchExportStore((s) => selectBatchExportBusy(s))
  const terminalBusy = useTerminalStore((s) => s.terminalBusy)
  const downloadsOptionsBusy = useDownloadsStore((s) => s.downloadsOptionsBusy)
  const downloadsHistoryBusy = useDownloadsStore((s) => s.downloadsHistoryBusy)

  return useMemo(
    () =>
      buildStatusbarActivityDisplay(
        {
          engineDownloadBusy,
          engineSummaryChecking: engineSummary === 'checking',
          exportBusy,
          snapshotBusy,
          extractFramesBusy,
          exportCancelBusy,
          probePending,
          batchExportBusy,
          terminalBusy,
          downloadsRunning,
          downloadsOptionsBusy,
          downloadsHistoryBusy
        },
        (key: string) => uiText(key as Parameters<typeof uiText>[0])
      ),
    [
      batchExportBusy,
      downloadsHistoryBusy,
      downloadsOptionsBusy,
      downloadsRunning,
      engineDownloadBusy,
      engineSummary,
      exportBusy,
      exportCancelBusy,
      extractFramesBusy,
      probePending,
      snapshotBusy,
      terminalBusy
    ]
  )
}

export function useAppStatusbarUiLocale(): ReturnType<typeof getUiLocale> {
  useAppShellStore((s) => s.uiLocaleRenderTick)
  return getUiLocale()
}
