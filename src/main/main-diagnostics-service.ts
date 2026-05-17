import { existsSync } from 'fs'
import { basename } from 'path'

import { app, BrowserWindow, clipboard, dialog, screen, shell } from 'electron'

import { buildSupportZipFfprobeSmokeLines } from '../shared/packaged-ffprobe-smoke'
import { buildSupportZipPackagedReleaseLines } from '../shared/packaged-release-smoke'
import { formatLocaleJsonCatalogDiagnosticLines } from '../shared/locale-json-catalog'
import { formatUiLocaleIpcDiagnosticLines } from '../shared/ui-locale-runtime'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import {
  formatMainProcessErrorClipboardHeader,
  getMainApplicationStrings
} from '../shared/main-application-locale'
import { resolveAppPaths } from './app-paths'
import { ENGINE_IDS, getEnginesStatus } from './engine-service'
import {
  getMainLogBackupFilePath,
  getMainLogFilePath,
  getSessionLogFilePath,
  logError,
  logInfo
} from './logger-service'
import { resolveTerminalCliSessionLogPath } from './terminal-service'
import {
  createSupportBundleZip,
  pruneOldDiagnosticFiles,
  type SupportBundleRuntimeInfo
} from './support-bundle'

export type SupportBundleDialogOutcome =
  | { outcome: 'saved'; path: string }
  | { outcome: 'cancelled' }
  | { outcome: 'failed'; message: string }

export type MainDiagnosticsServiceAccess = {
  mainDownloadsUiLocale: () => DownloadsWindowUiLocale
  mainAppStr: () => {
    mainLogPathUnavailable: string
    mainLogNotCreatedYet: string
    supportZipSaveTitle: string
    supportZipFailTitle: string
    supportZipFailMessage: string
    processErrorTitle: string
    processErrorMessage: string
    processErrorCopyDetails: string
    processErrorOpenLog: string
    processErrorSupportZip: string
    processErrorClose: string
  }
}

let access: MainDiagnosticsServiceAccess | null = null
let processErrorDialogOpen = false

function requireAccess(): MainDiagnosticsServiceAccess {
  if (!access) {
    throw new Error('main-diagnostics-service: configureMainDiagnosticsService not called')
  }
  return access
}

export function configureMainDiagnosticsService(next: MainDiagnosticsServiceAccess): void {
  access = next
}

function getCrashDumpsPathSafe(): string | null {
  try {
    return app.getPath('crashDumps')
  } catch {
    return null
  }
}

export async function buildSupportBundleRuntimeInfo(): Promise<SupportBundleRuntimeInfo> {
  const paths = resolveAppPaths()
  const engines = await getEnginesStatus(paths)
  const engineDiagnosticLines = ENGINE_IDS.map((id) => {
    const e = engines.engines[id]
    const pathPart = e.path ?? '-'
    const detail = e.version ?? (e.message && e.message.length > 0 ? e.message : e.state)
    return `  ${id}: ${e.state} | ${pathPart} | ${detail}`
  })
  let appLocale = '?'
  let systemLocale = '?'
  try {
    appLocale = app.getLocale()
  } catch {
    /* ignore */
  }
  try {
    systemLocale =
      typeof app.getSystemLocale === 'function' ? app.getSystemLocale() : app.getLocale()
  } catch {
    systemLocale = appLocale
  }

  let primaryDisplayLine = '-'
  try {
    const d = screen.getPrimaryDisplay()
    const { width: bw, height: bh } = d.bounds
    const { width: ww, height: wh } = d.workAreaSize
    primaryDisplayLine = `${bw}×${bh}@${d.scaleFactor.toFixed(2)} work ${ww}×${wh}`
  } catch {
    /* headless / not ready */
  }

  const releaseSmokeLines = buildSupportZipPackagedReleaseLines(paths.appRoot, existsSync)
  const ffprobeSmokeLines = buildSupportZipFfprobeSmokeLines(paths.appRoot, existsSync)
  const uiLocaleIpcLines = formatUiLocaleIpcDiagnosticLines()
  const localeJsonCatalogLines = formatLocaleJsonCatalogDiagnosticLines()

  return {
    appVersion: app.getVersion(),
    electronVersion: process.versions.electron ?? '?',
    chromeVersion: process.versions.chrome ?? '?',
    nodeVersion: process.versions.node ?? '?',
    platform: process.platform,
    arch: process.arch,
    appLocale,
    systemLocale,
    processId: process.pid,
    currentWorkingDirectory: process.cwd(),
    execBasename: basename(process.execPath),
    packaged: app.isPackaged,
    primaryDisplayLine,
    userData: paths.userData,
    resources: paths.resources,
    logFile: getMainLogFilePath(),
    logBackupFile: getMainLogBackupFilePath(),
    sessionLogFile: getSessionLogFilePath(),
    terminalCliLogFile: resolveTerminalCliSessionLogPath(paths.userData),
    crashDumps: getCrashDumpsPathSafe(),
    engineDiagnosticLines,
    releaseSmokeLines,
    ffprobeSmokeLines,
    uiLocaleIpcLines,
    localeJsonCatalogLines
  }
}

export function pruneDiagnosticsOnStartup(): void {
  const removed = pruneOldDiagnosticFiles({
    directory: getCrashDumpsPathSafe(),
    maxAgeMs: 30 * 24 * 60 * 60 * 1000,
    keepNewest: 20,
    fileNamePattern: /\.(dmp|dump|txt|log)$/i
  })
  if (removed > 0) {
    logInfo('diagnostics', `pruned old crash dump files: ${removed}`)
  }
}

/** §17/§18 — открыть main.log; результат для IPC «О программе» и для меню без дублирования логики. */
export async function openMainLogForUser(): Promise<{ ok: true } | { ok: false; error: string }> {
  const S = requireAccess().mainAppStr()
  const file = getMainLogFilePath()
  if (!file) {
    return { ok: false, error: S.mainLogPathUnavailable }
  }
  if (!existsSync(file)) {
    logInfo('diagnostics', 'main.log does not exist yet')
    return { ok: false, error: S.mainLogNotCreatedYet }
  }
  const result = await shell.openPath(file)
  if (result.length > 0) {
    logError('diagnostics', 'open main.log failed', result)
    return { ok: false, error: result }
  }
  return { ok: true }
}

export async function openMainLogFile(): Promise<void> {
  await openMainLogForUser()
}

export async function openSessionLogFile(): Promise<void> {
  const file = getSessionLogFilePath()
  if (!file) {
    return
  }
  if (!existsSync(file)) {
    logInfo('diagnostics', 'session.log does not exist yet')
    return
  }
  const result = await shell.openPath(file)
  if (result.length > 0) {
    logError('diagnostics', 'open session.log failed', result)
  }
}

export async function createSupportBundleWithDialog(
  parent?: BrowserWindow
): Promise<SupportBundleDialogOutcome> {
  const S = requireAccess().mainAppStr()
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const saveOptions = {
    title: S.supportZipSaveTitle,
    defaultPath: `fluxalloy-support-${stamp}.zip`,
    filters: [{ name: 'ZIP', extensions: ['zip'] }]
  }
  const result = parent
    ? await dialog.showSaveDialog(parent, saveOptions)
    : await dialog.showSaveDialog(saveOptions)
  if (result.canceled || !result.filePath) {
    return { outcome: 'cancelled' }
  }
  try {
    createSupportBundleZip(result.filePath, await buildSupportBundleRuntimeInfo())
    logInfo('diagnostics', 'support zip created', result.filePath)
    return { outcome: 'saved', path: result.filePath }
  } catch (err) {
    logError('diagnostics', 'support zip failed', err)
    const detail = err instanceof Error ? err.message : String(err)
    const messageOptions = {
      type: 'error',
      title: S.supportZipFailTitle,
      message: S.supportZipFailMessage,
      detail
    } as const
    void (parent
      ? dialog.showMessageBox(parent, messageOptions)
      : dialog.showMessageBox(messageOptions))
    return { outcome: 'failed', message: detail }
  }
}

function formatProcessErrorDetails(
  kind: 'uncaughtException' | 'unhandledRejection',
  reason: unknown,
  locale: DownloadsWindowUiLocale
): string {
  let serialized: string | null = null
  try {
    serialized = JSON.stringify(reason, null, 2)
  } catch {
    serialized = null
  }
  const body =
    reason instanceof Error
      ? (reason.stack ?? `${reason.name}: ${reason.message}`)
      : typeof reason === 'string'
        ? reason
        : (serialized ?? String(reason))
  const meta = formatMainProcessErrorClipboardHeader(
    locale,
    kind,
    app.getVersion(),
    process.platform,
    process.arch
  )
  return [
    meta.typeLine,
    meta.timeLine,
    meta.versionLine,
    meta.platformLine,
    '',
    body ?? String(reason)
  ].join('\n')
}

export async function showProcessErrorDialog(
  kind: 'uncaughtException' | 'unhandledRejection',
  reason: unknown
): Promise<void> {
  if (processErrorDialogOpen || !app.isReady()) {
    return
  }
  processErrorDialogOpen = true
  const win = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0]
  const loc = requireAccess().mainDownloadsUiLocale()
  const S = getMainApplicationStrings(loc)
  const detail = formatProcessErrorDetails(kind, reason, loc)
  const messageBoxOptions: Electron.MessageBoxOptions = {
    type: 'error',
    title: S.processErrorTitle,
    message: S.processErrorMessage,
    detail,
    buttons: [
      S.processErrorCopyDetails,
      S.processErrorOpenLog,
      S.processErrorSupportZip,
      S.processErrorClose
    ],
    defaultId: 3,
    cancelId: 3,
    noLink: true
  }
  const result =
    win !== undefined
      ? await dialog.showMessageBox(win, messageBoxOptions)
      : await dialog.showMessageBox(messageBoxOptions)
  processErrorDialogOpen = false
  if (result.response === 0) {
    clipboard.writeText(detail)
  } else if (result.response === 1) {
    await openMainLogFile()
  } else if (result.response === 2) {
    void createSupportBundleWithDialog(win)
  }
}
