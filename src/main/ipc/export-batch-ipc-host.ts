import type { BrowserWindow } from 'electron'

import type { AppUiLocale } from '../../shared/app-ui-locale'
import { getMainApplicationStrings } from '../../shared/main-application-locale'
import type { AppSettings } from '../settings-store'

export type ExportBatchIpcHost = {
  getActiveExportAbort: () => AbortController | null
  setActiveExportAbort: (ac: AbortController | null) => void
  getSettings: () => AppSettings
  bindBatchSnapshotBroadcast: (fn: (win?: BrowserWindow | null) => void) => void
  launchFfmpegExportBatchRunner: (raw: unknown, win?: BrowserWindow | null) => boolean
  mainAppStr: () => ReturnType<typeof getMainApplicationStrings>
  mainDownloadsUiLocale: () => AppUiLocale
  previewOpenDialogOptsFromSettings: () => { defaultPath: string } | undefined
  batchExportOutputFolderPickOptsFromSettings: () => { defaultPath: string } | undefined
  rememberedExportDefaultPath: (fileName: string) => string
  rememberExportOutputPath: (filePath: string) => void
  rememberFfmpegExportDirectory: (outputPath: string) => void
  rememberedSnapshotDefaultPath: (fileName: string) => string
  rememberFfmpegSnapshotDirectory: (outputPath: string) => void
  openExportOutputPath: (
    rawPath: unknown,
    rawMode: unknown
  ) => Promise<{ ok: true; path: string } | { ok: false; error: string }>
  openDownloadedFileInMainHandler: (
    absoluteFile: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>
  parseDownloadsOpenRequest: (raw: unknown) => {
    mergeText: string | null
    uiLocale?: AppUiLocale
  }
}
