import { app, BrowserWindow, ipcMain } from 'electron'

import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import type {
  DiagnosticsOpenMainLogResult,
  DiagnosticsSupportZipResult
} from '../../shared/diagnostics-contract'
import type { DownloadsWindowUiLocale } from '../../shared/downloads-window-ui-locale'
import { resolveAppPaths } from '../app-paths'
import {
  cleanDiagnosticsMaintenance,
  getDiagnosticsMaintenanceSnapshot
} from '../diagnostics-maintenance'
import {
  isDiagnosticsFolderId,
  listDiagnosticsFolders,
  openDiagnosticsFolder
} from '../diagnostics-paths'
import {
  buildKnowledgeHelpDirCandidates,
  listKnowledgeArticles,
  readKnowledgeArticle
} from '../knowledge-service'

let ipcRegistered = false

export type KnowledgeDiagnosticsIpcDeps = {
  mainDownloadsUiLocale: () => DownloadsWindowUiLocale
  mainAppStr: () => { diagnosticsUnknownFolder: string }
  openMainLogForUser: () => Promise<DiagnosticsOpenMainLogResult>
  createSupportBundleWithDialog: (
    parent?: BrowserWindow
  ) => Promise<
    | { outcome: 'saved'; path: string }
    | { outcome: 'cancelled' }
    | { outcome: 'failed'; message: string }
  >
}

function knowledgeHelpDirCandidates(): string[] {
  return buildKnowledgeHelpDirCandidates({
    cwd: process.cwd(),
    appPath: app.getAppPath(),
    resourcesPath: process.resourcesPath,
    isPackaged: app.isPackaged
  })
}

export function registerKnowledgeDiagnosticsIpcHandlers(deps: KnowledgeDiagnosticsIpcDeps): void {
  if (ipcRegistered) {
    return
  }
  ipcRegistered = true

  ipcMain.handle(mw.knowledgeListArticles, (_event, raw: unknown) => {
    let listLocale = deps.mainDownloadsUiLocale()
    if (raw !== null && typeof raw === 'object') {
      const loc = (raw as Record<string, unknown>)['preferredUiLocale']
      if (loc === 'en' || loc === 'ru') {
        listLocale = loc
      }
    }
    return listKnowledgeArticles(knowledgeHelpDirCandidates(), listLocale)
  })

  ipcMain.handle(mw.knowledgeReadArticle, (_event, raw: unknown) => {
    return readKnowledgeArticle(knowledgeHelpDirCandidates(), raw, deps.mainDownloadsUiLocale())
  })

  ipcMain.handle(mw.diagnosticsListFolders, () => {
    return listDiagnosticsFolders(deps.mainDownloadsUiLocale())
  })

  ipcMain.handle(
    mw.diagnosticsOpenFolder,
    async (
      _event,
      raw: unknown
    ): Promise<{ ok: true; path: string } | { ok: false; error: string }> => {
      if (!isDiagnosticsFolderId(raw)) {
        return { ok: false, error: deps.mainAppStr().diagnosticsUnknownFolder }
      }
      return openDiagnosticsFolder(raw)
    }
  )

  ipcMain.handle(mw.diagnosticsOpenMainLog, async (): Promise<DiagnosticsOpenMainLogResult> => {
    return deps.openMainLogForUser()
  })

  ipcMain.handle(
    mw.diagnosticsCreateSupportZip,
    async (event): Promise<DiagnosticsSupportZipResult> => {
      const win = BrowserWindow.fromWebContents(event.sender)
      const parent = win && !win.isDestroyed() ? win : undefined
      const out = await deps.createSupportBundleWithDialog(parent)
      if (out.outcome === 'saved') {
        return { ok: true, path: out.path }
      }
      if (out.outcome === 'cancelled') {
        return { ok: false, cancelled: true }
      }
      return { ok: false, error: out.message }
    }
  )

  ipcMain.handle(mw.diagnosticsMaintenanceSnapshot, () => {
    return getDiagnosticsMaintenanceSnapshot(resolveAppPaths())
  })

  ipcMain.handle(mw.diagnosticsCleanMaintenance, (_event, raw: unknown) => {
    const request =
      raw && typeof raw === 'object' ? (raw as { targets?: unknown }).targets : undefined
    const targets = Array.isArray(request)
      ? request.filter((id): id is 'previewCache' | 'ytdlpPartials' | 'ffmpegTemp' => {
          return id === 'previewCache' || id === 'ytdlpPartials' || id === 'ffmpegTemp'
        })
      : undefined
    return cleanDiagnosticsMaintenance(
      resolveAppPaths(),
      targets ? { targets } : undefined,
      deps.mainDownloadsUiLocale()
    )
  })
}
