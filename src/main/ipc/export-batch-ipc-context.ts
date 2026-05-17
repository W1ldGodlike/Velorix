import type { BrowserWindow } from 'electron'

import type { ExportBatchIpcHost } from './export-batch-ipc-host'

export type ExportBatchIpcContext = {
  host: ExportBatchIpcHost
  pushBatchExportSnapshot: (win?: BrowserWindow | null) => void
}

export function createExportBatchIpcContext(
  host: ExportBatchIpcHost,
  pushBatchExportSnapshot: (win?: BrowserWindow | null) => void
): ExportBatchIpcContext {
  return { host, pushBatchExportSnapshot }
}
