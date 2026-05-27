import { existsSync } from 'fs'
import { basename } from 'path'

import { app, BrowserWindow, clipboard, dialog, screen, shell } from 'electron'

import { buildSupportZipFfprobeSmokeLines } from '../../../shared/packaged-ffprobe-smoke'
import { formatFfmpegHwManualSmokeChecklistLines } from '../../../shared/ffmpeg-hw-manual-smoke-checklist'
import { formatLinuxPackagedManualSmokeChecklistLines } from '../../../shared/linux-packaged-manual-smoke-checklist'
import { formatMacosPackagedManualSmokeChecklistLines } from '../../../shared/macos-packaged-manual-smoke-checklist'
import { formatWinPackagedManualSmokeChecklistLines } from '../../../shared/win-packaged-manual-smoke-checklist'
import { buildOwnerHardwareChecklistBundleLines } from '../../../shared/owner-hardware-checklist-bundle'
import { formatWorkflowOsSchedulerManualSmokeChecklistLines } from '../../../shared/workflow-os-scheduler-manual-smoke-checklist'
import { buildSupportZipPackagedReleaseLines } from '../../../shared/packaged-release-smoke'
import { formatTerminalContractHintsSupportZipLines } from '../../../shared/terminal-contract-hints-meta'
import { buildSupportZipBuildInfoLines, readAppBuildInfo } from '../../../shared/app-build-info'
import { formatLocaleJsonCatalogDiagnosticLines } from '../../../shared/locale-json-catalog'
import { formatRendererStateDiagnosticLines } from '../../../shared/renderer-state-approach'
import { formatWindowHidpiDiagnosticLines } from '../../windows/window-hidpi'
import { formatUiLocaleIpcDiagnosticLines } from '../../../shared/ui-locale-runtime'
import type { AppUiLocale } from '../../../shared/app-ui-locale'
import {
  formatMainProcessErrorClipboardHeader,
  getMainApplicationStrings
} from '../../../shared/main-application-locale'
import { mainWindowIpc as mw } from '../../../shared/ipc-channels'
import type { ProcessErrorDialogPayload } from '../../../shared/process-error-dialog-contract'
import { resolveAppPaths } from '../../core/app-paths'
import { ENGINE_IDS, getEnginesStatus } from '../engines/engine-service'
import {
  getMainLogBackupFilePath,
  getMainLogFilePath,
  getSessionLogFilePath,
  logError,
  logInfo
} from '../../core/logger-service'
import { resolveTerminalCliSessionLogPath } from '../terminal/terminal-service'
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
  mainDownloadsUiLocale: () => AppUiLocale
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

  const terminalHintsLines = formatTerminalContractHintsSupportZipLines()
  const releaseSmokeLines = buildSupportZipPackagedReleaseLines(paths.appRoot, existsSync)
  const ffprobeSmokeLines = buildSupportZipFfprobeSmokeLines(paths.appRoot, existsSync)
  const uiLocaleIpcLines = formatUiLocaleIpcDiagnosticLines()
  const localeJsonCatalogLines = formatLocaleJsonCatalogDiagnosticLines()
  const rendererStateLines = formatRendererStateDiagnosticLines()
  const uiDpiLines = formatWindowHidpiDiagnosticLines()
  const hwManualSmokeChecklistLines = formatFfmpegHwManualSmokeChecklistLines()
  const winPackagedSmokeChecklistLines = formatWinPackagedManualSmokeChecklistLines()
  const linuxPackagedSmokeChecklistLines = formatLinuxPackagedManualSmokeChecklistLines()
  const macosPackagedSmokeChecklistLines = formatMacosPackagedManualSmokeChecklistLines()
  const workflowOsSchedulerSmokeChecklistLines =
    formatWorkflowOsSchedulerManualSmokeChecklistLines()
  const ownerHardwareChecklistBundleLines = buildOwnerHardwareChecklistBundleLines({
    uiDpiLines,
    platform: process.platform
  })

  return {
    appVersion: app.getVersion(),
    buildInfoLines: buildSupportZipBuildInfoLines(readAppBuildInfo()),
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
    terminalHintsLines,
    releaseSmokeLines,
    ffprobeSmokeLines,
    uiLocaleIpcLines,
    localeJsonCatalogLines,
    rendererStateLines,
    uiDpiLines,
    hwManualSmokeChecklistLines,
    winPackagedSmokeChecklistLines,
    linuxPackagedSmokeChecklistLines,
    macosPackagedSmokeChecklistLines,
    workflowOsSchedulerSmokeChecklistLines,
    ownerHardwareChecklistBundleLines
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
    defaultPath: `VELORIX-support-${stamp}.zip`,
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
  locale: AppUiLocale
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

function buildProcessErrorDialogPayload(
  kind: 'uncaughtException' | 'unhandledRejection',
  reason: unknown,
  locale: AppUiLocale
): ProcessErrorDialogPayload {
  const S = getMainApplicationStrings(locale)
  return {
    kind,
    title: S.processErrorTitle,
    message: S.processErrorMessage,
    detail: formatProcessErrorDetails(kind, reason, locale),
    copyLabel: S.processErrorCopyDetails,
    openLogLabel: S.processErrorOpenLog,
    supportZipLabel: S.processErrorSupportZip,
    closeLabel: S.processErrorClose
  }
}

function reportProcessErrorToRenderer(
  win: BrowserWindow | undefined,
  payload: ProcessErrorDialogPayload
): boolean {
  if (
    !win ||
    win.isDestroyed() ||
    win.webContents.isDestroyed() ||
    win.webContents.isLoadingMainFrame()
  ) {
    return false
  }
  try {
    win.webContents.send(mw.processErrorReported, payload)
    return true
  } catch {
    return false
  }
}

export async function showProcessErrorDialog(
  kind: 'uncaughtException' | 'unhandledRejection',
  reason: unknown
): Promise<void> {
  if (!app.isReady()) {
    return
  }
  const win = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0]
  const loc = requireAccess().mainDownloadsUiLocale()
  const payload = buildProcessErrorDialogPayload(kind, reason, loc)
  if (reportProcessErrorToRenderer(win, payload)) {
    return
  }
  if (processErrorDialogOpen) {
    return
  }
  processErrorDialogOpen = true
  const messageBoxOptions: Electron.MessageBoxOptions = {
    type: 'error',
    title: payload.title,
    message: payload.message,
    detail: payload.detail,
    buttons: [payload.copyLabel, payload.openLogLabel, payload.supportZipLabel, payload.closeLabel],
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
    clipboard.writeText(payload.detail)
  } else if (result.response === 1) {
    await openMainLogFile()
  } else if (result.response === 2) {
    void createSupportBundleWithDialog(win)
  }
}
