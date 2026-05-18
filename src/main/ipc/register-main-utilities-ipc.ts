import { writeFileSync } from 'fs'

import { BrowserWindow, clipboard, dialog, ipcMain } from 'electron'

import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import type { SaveTextDialogResult } from '../../shared/save-text-dialog-contract'
import type { TerminalCommandHintEntry, TerminalRunResult } from '../../shared/terminal-contract'
import type { AppUiLocale } from '../../shared/app-ui-locale'
import { parseAppUiLocale } from '../../shared/app-ui-locale'
import { resolveAppPaths } from '../app-paths'
import type { EnginePathOverrides } from '../engine-service'
import { getAppAboutInfo } from '../about-info'
import { logError } from '../logger-service'
import {
  clearProcessingHistory,
  findProcessingHistoryEntryById,
  getProcessingHistoryWeeklySummary,
  readProcessingHistoryNewestFirst
} from '../processing-history'
import type { ProcessingHistoryFilter } from '../../shared/processing-history-contract'
import { getTerminalCommandHints, runTerminalCommand } from '../terminal-service'

let ipcRegistered = false

type ExportOutputOpenMode = 'file' | 'folder' | 'preview'

export type MainUtilitiesIpcDeps = {
  mainAppStr: () => {
    saveDialogFilterJson: string
    saveDialogFilterHtml: string
    saveDialogFilterText: string
    saveDialogFilterAll: string
    saveDialogWriteFailed: string
    processingHistoryBadRequest: string
    processingHistoryIdMissing: string
    processingHistoryBadAction: string
    processingHistoryNoOutput: string
    processingHistoryEntryNotFound: string
  }
  mainDownloadsUiLocale: () => AppUiLocale
  getEnginePathOverrides: () => EnginePathOverrides
  parseSaveTextDialogPayload: (
    raw: unknown,
    locale: AppUiLocale
  ) =>
    | { ok: true; title: string; defaultFileName: string; content: string }
    | { ok: false; error: string }
  isExportOutputOpenMode: (raw: unknown) => raw is ExportOutputOpenMode
  rememberExportOutputPath: (filePath: string) => void
  openExportOutputPath: (
    rawPath: unknown,
    rawMode: unknown
  ) => Promise<{ ok: true; path: string } | { ok: false; error: string }>
  openDownloadedFileInMainHandler: (
    absoluteFile: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>
}

export function registerMainUtilitiesIpcHandlers(deps: MainUtilitiesIpcDeps): void {
  if (ipcRegistered) {
    return
  }
  ipcRegistered = true

  ipcMain.handle(mw.terminalHints, (): TerminalCommandHintEntry[] => getTerminalCommandHints())

  ipcMain.handle(mw.terminalRun, async (_, raw: unknown): Promise<TerminalRunResult> => {
    const loc =
      raw && typeof raw === 'object'
        ? (parseAppUiLocale((raw as { uiLocale?: unknown }).uiLocale) ??
          deps.mainDownloadsUiLocale())
        : deps.mainDownloadsUiLocale()
    const line =
      raw && typeof raw === 'object' && typeof (raw as { line?: unknown }).line === 'string'
        ? (raw as { line: string }).line
        : ''
    const currentRaw =
      raw && typeof raw === 'object' && 'currentFilePath' in raw
        ? (raw as { currentFilePath?: unknown }).currentFilePath
        : undefined
    const currentFilePath =
      typeof currentRaw === 'string' ? currentRaw : currentRaw === null ? null : undefined
    return runTerminalCommand({
      paths: resolveAppPaths(),
      overrides: deps.getEnginePathOverrides(),
      line,
      locale: loc,
      ...(currentFilePath !== undefined ? { currentFilePath } : {})
    })
  })

  ipcMain.handle(mw.clipboardReadText, () => clipboard.readText())

  ipcMain.handle(mw.clipboardWriteText, (_, raw: unknown): { ok: true } | { ok: false } => {
    if (typeof raw !== 'string') {
      return { ok: false }
    }
    const max = 24 * 1024 * 1024
    if (raw.length > max) {
      return { ok: false }
    }
    clipboard.writeText(raw)
    return { ok: true }
  })

  ipcMain.handle(
    mw.saveTextWithDialog,
    async (event, raw: unknown): Promise<SaveTextDialogResult> => {
      const parsed = deps.parseSaveTextDialogPayload(raw, deps.mainDownloadsUiLocale())
      if (!parsed.ok) {
        return { ok: false, error: parsed.error }
      }
      const win = BrowserWindow.fromWebContents(event.sender)
      const parent = win && !win.isDestroyed() ? win : undefined
      const Sv = deps.mainAppStr()
      const saveOpts = {
        title: parsed.title,
        defaultPath: parsed.defaultFileName,
        filters: [
          { name: Sv.saveDialogFilterJson, extensions: ['json'] },
          { name: Sv.saveDialogFilterHtml, extensions: ['html', 'htm'] },
          { name: Sv.saveDialogFilterText, extensions: ['txt', 'log'] },
          { name: Sv.saveDialogFilterAll, extensions: ['*'] }
        ]
      }
      const res = parent
        ? await dialog.showSaveDialog(parent, saveOpts)
        : await dialog.showSaveDialog(saveOpts)
      if (res.canceled || typeof res.filePath !== 'string' || res.filePath.trim().length === 0) {
        return { ok: false, cancelled: true }
      }
      try {
        writeFileSync(res.filePath, parsed.content, 'utf8')
        return { ok: true, path: res.filePath }
      } catch (error: unknown) {
        logError('saveTextWithDialog', 'write failed', error)
        return { ok: false, error: Sv.saveDialogWriteFailed }
      }
    }
  )

  ipcMain.handle(mw.appAboutInfo, () => getAppAboutInfo())

  ipcMain.handle(mw.processingHistoryGet, (_event, raw: unknown) => {
    const filter: ProcessingHistoryFilter = {}
    const limit =
      raw && typeof raw === 'object' && typeof (raw as { limit?: unknown }).limit === 'number'
        ? (raw as { limit: number }).limit
        : 100
    if (raw && typeof raw === 'object') {
      const src = raw as { kind?: unknown; outcome?: unknown; query?: unknown }
      if (
        src.kind === 'ffmpegExport' ||
        src.kind === 'ffmpegSnapshot' ||
        src.kind === 'autoExport'
      ) {
        filter.kind = src.kind
      }
      if (src.outcome === 'success' || src.outcome === 'error' || src.outcome === 'cancelled') {
        filter.outcome = src.outcome
      }
      if (typeof src.query === 'string') {
        filter.query = src.query
      }
    }
    return readProcessingHistoryNewestFirst(resolveAppPaths().userData, filter, limit)
  })

  ipcMain.handle(mw.processingHistoryWeeklySummary, () => {
    return getProcessingHistoryWeeklySummary(resolveAppPaths().userData)
  })

  ipcMain.handle(mw.processingHistoryClear, (): { ok: true } | { ok: false; error: string } => {
    try {
      clearProcessingHistory(resolveAppPaths().userData)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  ipcMain.handle(
    mw.processingHistoryOpenOutput,
    async (
      _event,
      raw: unknown
    ): Promise<{ ok: true; path: string } | { ok: false; error: string }> => {
      const H = deps.mainAppStr()
      if (!raw || typeof raw !== 'object') {
        return { ok: false, error: H.processingHistoryBadRequest }
      }
      const payload = raw as { id?: unknown; mode?: unknown }
      if (typeof payload.id !== 'string') {
        return { ok: false, error: H.processingHistoryIdMissing }
      }
      if (!deps.isExportOutputOpenMode(payload.mode)) {
        return { ok: false, error: H.processingHistoryBadAction }
      }
      const entry = findProcessingHistoryEntryById(resolveAppPaths().userData, payload.id)
      if (!entry?.outputPath) {
        return { ok: false, error: H.processingHistoryNoOutput }
      }
      deps.rememberExportOutputPath(entry.outputPath)
      return deps.openExportOutputPath(entry.outputPath, payload.mode)
    }
  )

  ipcMain.handle(
    mw.processingHistoryOpenInputInHandler,
    async (_event, raw: unknown): Promise<{ ok: true } | { ok: false; error: string }> => {
      const H = deps.mainAppStr()
      if (typeof raw !== 'string') {
        return { ok: false, error: H.processingHistoryIdMissing }
      }
      const entry = findProcessingHistoryEntryById(resolveAppPaths().userData, raw)
      if (!entry) {
        return { ok: false, error: H.processingHistoryEntryNotFound }
      }
      return deps.openDownloadedFileInMainHandler(entry.inputPath)
    }
  )
}
