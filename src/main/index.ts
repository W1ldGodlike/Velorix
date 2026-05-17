import { execFile } from 'child_process'
import { createHash } from 'crypto'
import { existsSync, mkdirSync, rmSync, statSync } from 'fs'
import { basename, dirname, extname, isAbsolute, join, normalize, resolve } from 'path'
import {
  BrowserWindow,
  Menu,
  app,
  clipboard,
  dialog,
  ipcMain,
  nativeTheme,
  screen,
  shell
} from 'electron'
import type { IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { packagedWinUnpackedRoot } from '../shared/packaged-app-smoke'
import { buildSupportZipFfprobeSmokeLines } from '../shared/packaged-ffprobe-smoke'
import { resolveAppPaths } from './app-paths'
import { buildKnowledgeHelpDirCandidates, resolveKnowledgeHelpDirectory } from './knowledge-service'
import { registerKnowledgeDiagnosticsIpcHandlers } from './ipc/register-knowledge-diagnostics-ipc'
import { registerSettingsIpcHandlers } from './ipc/register-settings-ipc'
import { registerEnginesPreviewIpcHandlers } from './ipc/register-engines-preview-ipc'
import { registerMainUtilitiesIpcHandlers } from './ipc/register-main-utilities-ipc'
import { registerExportBatchIpcHandlers } from './ipc/register-export-batch-ipc'
import { createSettingsIpcPersist, type SettingsIpcPersistApi } from './settings-ipc-persist'
import { getYtdlpCliValidationCopy } from '../shared/ytdlp-cli-validation-locale'
import { installExternalNavigationGuard, openAllowedExternalUrl } from './external-url'
import {
  cancelDownloadsRunner,
  configureDownloadsQueueRunnerHooks,
  isDownloadsRunnerBusy
} from './downloads-queue-runner'
import { emitDownloadsLog } from './downloads-log-ipc'
import { getDownloadsQueueSnapshot } from './downloads-queue'
import { filterExistingVideoPathsForBatch } from './ffmpeg-export-batch-grant-paths'
import {
  broadcastDownloadsCliOptionsChanged,
  broadcastDownloadsOutputDirectorySnapshot,
  broadcastDownloadsWindowUiPanelsSnapshot,
  configureDownloadsWindowBoundsHooks,
  focusOrCreateDownloadsWindow,
  isDownloadsWindow,
  registerDownloadsWindowIpcHandlers,
  syncDownloadsPopoutHtmlToLocale
} from './downloads-window'
import {
  configureInspectorWindowHooks,
  focusOrCreateInspectorWindow,
  isInspectorWindow,
  registerInspectorWindowIpcHandlers
} from './inspector-window'
import {
  listDiagnosticsFolders,
  openDiagnosticsFolder,
  type DiagnosticsFolderEntry
} from './diagnostics-paths'
import {
  attachProcessErrorHandlers,
  getMainLogBackupFilePath,
  getMainLogFilePath,
  getSessionLogFilePath,
  logError,
  logFromRendererSafe,
  logInfo,
  logStartupBanner,
  setProcessErrorReporter
} from './logger-service'
import {
  createSupportBundleZip,
  pruneOldDiagnosticFiles,
  type SupportBundleRuntimeInfo
} from './support-bundle'
import { runFfmpegExportJob, type FfmpegExportProgressPayload } from './ffmpeg-export-service'
import { FFMPEG_EXPORT_CANCELLED_ERROR } from '../shared/ffmpeg-export-contract'
import { resolveOpenMediaDialogDefaultPath } from '../shared/preview-open-dialog-default-path'
import {
  pickUniqueAutoExportOutputPath,
  resolveFfmpegExportJobOptionsFromAppSettings
} from './ffmpeg-export-resolve-from-settings'
import { addFfmpegExportBatchPaths, getFfmpegExportBatchSnapshot } from './ffmpeg-export-batch-queue'
import {
  attachFfmpegExportBatchQueuePersist,
  hydrateFfmpegExportBatchQueueFromDisk
} from './ffmpeg-export-batch-persist'
import { isFfmpegExportBatchActive, runFfmpegExportBatchQueue } from './ffmpeg-export-batch-runner'
import { scanFolderForFfmpegExportBatchVideos } from './ffmpeg-export-batch-folder-scan'
import { appendProcessingHistoryEntry } from './processing-history'
import { resolveTerminalCliSessionLogPath } from './terminal-service'
import { setEnginePathOverridesSnapshot } from './engine-path-sync'
import { ENGINE_IDS, getEnginesStatus, resolveEngineExecutablePath } from './engine-service'
import { grantMediaPath, registerFluxMediaPrivileges, registerFluxMediaProtocol } from './media-protocol'
import { registerFluxHelpPrivileges, registerFluxHelpProtocol } from './help-assets-protocol'
import { openVideoFolderWithDialog, openVideoWithDialog } from './preview-dialog'
import type {
  AppSettings,
  AppSettingsView,
  AppTheme,
  ResolvedAppTheme,
  WindowBoundsConfig
} from './settings-store'
import { loadSettings, saveSettings } from './settings-store'
import { resolvePreloadOutFile } from './preload-resolve'
import {
  defaultMainEditorSize,
  displayMatchingRestoreRect,
  logicalScaleFactor,
  mainEditorMinLogicalSize
} from './window-hidpi'
import { boundsFromBrowserWindow, rectifyBoundsForRestore } from './window-bounds'
import {
  resolveYtdlpOutputDirectory,
  syncYtdlpDownloadDirectoryFromSettings
} from './ytdlp-download-output'
import {
  buildYtdlpCommandPreviewContext,
  buildYtdlpRunOptionsSnapshot,
  normalizeYtdlpPreviewOutputDirectory,
  parseYtdlpSubtitlePreset,
  payloadFromSnapshot,
  validateFilenameTemplate,
  validateYtdlpCookiesFilePath,
  validateYtdlpRateLimit,
  validateYtdlpFragmentRetriesLine,
  validateYtdlpRetriesLine,
  validateYtdlpSubLangs,
  type YtdlpDownloadOptionsPatch
} from './ytdlp-download-options'
import type { YtdlpGetCliOptionsParams } from '../shared/ytdlp-download-contract'
import { parseExtraYtdlpArgsLine, validateYtdlpCookiesBrowserProfile } from './ytdlp-extra-args'
import {
  getYtdlpRunOptionsSnapshot,
  refreshYtdlpRunOptionsSnapshot
} from './ytdlp-run-options-sync'
import { isFfmpegExportBatchVideoPath } from '../shared/ffmpeg-export-batch-video-ext'
import { parseYtdlpQueueRetryProfile } from './ytdlp-queue-retry'
import { mainWindowIpc as mw } from '../shared/ipc-channels'
import {
  autoExportProgressMessage,
  fluxLogAutoExportCancelled,
  fluxLogAutoExportFfmpegMissing,
  fluxLogAutoExportSkippedBusy,
  fluxLogAutoExportSkippedMainWindow,
  formatFluxLogAutoExportDone,
  formatFluxLogAutoExportFailed,
  formatFluxLogBatchEnqueueAdded,
  fluxLogBatchAutoStartFfmpegMissing,
  fluxLogBatchAutoStartLaunched,
  fluxLogBatchAutoStartSkippedBusy,
  fluxLogBatchEnqueueSkippedNotVideo
} from '../shared/downloads-flux-log-locale'
import {
  processingHistoryAutoExportCancelled,
  processingHistoryAutoExportFailed,
  processingHistoryAutoExportSuccess
} from '../shared/processing-history-status-locale'
import {
  downloadsWindowUiLocaleFromSystemLocale,
  parseDownloadsWindowUiLocale,
  type DownloadsWindowUiLocale
} from '../shared/downloads-window-ui-locale'
import {
  formatMainProcessErrorClipboardHeader,
  getMainApplicationStrings
} from '../shared/main-application-locale'

/** Кастомная схема для локального видеопревью; привилегии обязаны зарегистрироваться до `app.whenReady`. */
attachProcessErrorHandlers()
registerFluxMediaPrivileges()
registerFluxHelpPrivileges()

function mainDownloadsUiLocale(): DownloadsWindowUiLocale {
  try {
    const fromSettings = parseDownloadsWindowUiLocale(cachedSettings.uiLocale)
    if (fromSettings !== undefined) {
      return fromSettings
    }
    return downloadsWindowUiLocaleFromSystemLocale(app.getLocale())
  } catch {
    return 'ru'
  }
}

function mainAppStr(): ReturnType<typeof getMainApplicationStrings> {
  return getMainApplicationStrings(mainDownloadsUiLocale())
}

function ipcDownloadsUiLocale(raw: unknown): DownloadsWindowUiLocale {
  return raw === 'en' || raw === 'ru' ? raw : mainDownloadsUiLocale()
}

function parseDownloadsOpenRequest(raw: unknown): {
  mergeText: string | null
  uiLocale?: DownloadsWindowUiLocale
} {
  if (raw === null || raw === undefined) {
    return { mergeText: null }
  }
  if (typeof raw === 'string') {
    const t = raw.trim()
    return { mergeText: t.length > 0 ? t : null }
  }
  if (typeof raw === 'object' && raw !== null) {
    const o = raw as Record<string, unknown>
    let mergeText: string | null = null
    if (typeof o['text'] === 'string') {
      const t = o['text'].trim()
      if (t.length > 0) {
        mergeText = t
      }
    }
    const parsed = parseDownloadsWindowUiLocale(o['uiLocale'])
    const out: { mergeText: string | null; uiLocale?: DownloadsWindowUiLocale } = { mergeText }
    if (parsed !== undefined) {
      out.uiLocale = parsed
    }
    return out
  }
  return { mergeText: null }
}

/** Совпадает с лимитом буфера обмена в main: защита от огромных строк из renderer. */
const SAVE_TEXT_DIALOG_MAX_CHARS = 24 * 1024 * 1024

function parseSaveTextDialogPayload(
  raw: unknown,
  locale: DownloadsWindowUiLocale
):
  | { ok: true; title: string; defaultFileName: string; content: string }
  | { ok: false; error: string } {
  const S = getMainApplicationStrings(locale)
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: S.saveTextInvalidRequest }
  }
  const o = raw as Record<string, unknown>
  const titleRaw = typeof o['title'] === 'string' ? o['title'].trim() : ''
  const title = titleRaw.length > 0 ? titleRaw : S.saveFileDefaultTitle
  const fnRaw = typeof o['defaultFileName'] === 'string' ? o['defaultFileName'].trim() : ''
  const baseFromPayload = basename(fnRaw.replace(/\\/g, '/'))
  let safeName =
    baseFromPayload.length > 0 && baseFromPayload !== '.' && baseFromPayload !== '..'
      ? baseFromPayload
      : 'fluxalloy-export.json'
  if (!/\.[a-z0-9]+$/i.test(safeName)) {
    safeName = `${safeName}.json`
  }
  if (typeof o['content'] !== 'string') {
    return { ok: false, error: S.saveTextInvalidContent }
  }
  const content = o['content']
  if (content.length > SAVE_TEXT_DIALOG_MAX_CHARS) {
    return { ok: false, error: S.saveTextTooLarge }
  }
  return { ok: true, title, defaultFileName: safeName, content }
}

/**
 * Путь настроек в userData.
 *
 * userData выбирает сам Electron под каждую ОС, поэтому настройки не зависят от папки
 * установки и переживают обновления приложения. Сейчас здесь только тема, но файл
 * задуман как точка расширения для языка, путей движков, hotkeys и session-политик.
 */
function settingsPath(): string {
  return join(app.getPath('userData'), 'settings.json')
}

/**
 * Путь к ТЗ для пункта меню «Справка».
 *
 * В dev читаем файл из корня репозитория, чтобы агент/разработчик видел актуальный документ.
 * В production читаем копию из `extraResources`, потому что исходный корень уже не существует
 * как обычная папка рядом с exe.
 */
function technicalSpecPath(): string {
  const packaged = join(process.resourcesPath, 'FLUXALLOY_TZ.md')
  if (!is.dev && existsSync(packaged)) {
    return packaged
  }
  return join(app.getAppPath(), 'FLUXALLOY_TZ.md')
}

// Main process хранит актуальные настройки в памяти, чтобы меню и IPC отвечали одинаково.
let cachedSettings: AppSettings = { theme: 'dark' }

const mainSettingsAccess = {
  get: (): AppSettings => cachedSettings,
  set: (next: AppSettings): void => {
    cachedSettings = next
  },
  save: (): void => {
    saveSettings(settingsPath(), cachedSettings)
  }
}

let settingsIpcPersist: SettingsIpcPersistApi

let activeExportAbort: AbortController | null = null
const grantedExportOutputPaths = new Set<string>()
const MAX_GRANTED_EXPORT_OUTPUT_PATHS = 20

/** Обход диалога §4.2 после явного подтверждения «Закрыть и прервать». */
let allowMainWindowClose = false

let mainWindowWebContentsId: number | null = null

/** §7.4 — push `batchExportSnapshot` после enqueue из downloads-runner (до createWindow IPC). */
let broadcastFfmpegExportBatchSnapshot: ((win?: BrowserWindow | null) => void) | null = null

type ExportOutputOpenMode = 'file' | 'folder' | 'preview'

interface RendererLogBucket {
  tokens: number
  updatedAtMs: number
}

const RENDERER_LOG_BUCKET_CAPACITY = 30
const RENDERER_LOG_REFILL_PER_SECOND = 10
const rendererLogBuckets = new Map<number, RendererLogBucket>()

function consumeRendererLogToken(senderId: number): boolean {
  const now = Date.now()
  const bucket = rendererLogBuckets.get(senderId) ?? {
    tokens: RENDERER_LOG_BUCKET_CAPACITY,
    updatedAtMs: now
  }
  const elapsedMs = Math.max(0, now - bucket.updatedAtMs)
  bucket.tokens = Math.min(
    RENDERER_LOG_BUCKET_CAPACITY,
    bucket.tokens + (elapsedMs / 1000) * RENDERER_LOG_REFILL_PER_SECOND
  )
  bucket.updatedAtMs = now
  if (bucket.tokens < 1) {
    rendererLogBuckets.set(senderId, bucket)
    return false
  }
  bucket.tokens -= 1
  rendererLogBuckets.set(senderId, bucket)
  return true
}

function isExportOutputOpenMode(raw: unknown): raw is ExportOutputOpenMode {
  return raw === 'file' || raw === 'folder' || raw === 'preview'
}

function rememberExportOutputPath(filePath: string): void {
  const abs = resolve(normalize(filePath))
  grantedExportOutputPaths.delete(abs)
  grantedExportOutputPaths.add(abs)
  while (grantedExportOutputPaths.size > MAX_GRANTED_EXPORT_OUTPUT_PATHS) {
    const oldest = grantedExportOutputPaths.values().next().value as string | undefined
    if (oldest === undefined) {
      break
    }
    grantedExportOutputPaths.delete(oldest)
  }
}

async function openExportOutputPath(
  rawPath: unknown,
  rawMode: unknown
): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const S = mainAppStr()
  if (typeof rawPath !== 'string' || rawPath.trim().length === 0) {
    return { ok: false, error: S.exportOutputPathMissing }
  }
  if (!isExportOutputOpenMode(rawMode)) {
    return { ok: false, error: S.exportOutputBadMode }
  }
  const abs = resolve(normalize(rawPath.trim()))
  if (!grantedExportOutputPaths.has(abs)) {
    return { ok: false, error: S.exportOutputNotGranted }
  }
  if (!existsSync(abs)) {
    return { ok: false, error: S.exportOutputFileNotFound }
  }
  try {
    if (!statSync(abs).isFile()) {
      return { ok: false, error: S.exportOutputNotAFile }
    }
  } catch {
    return { ok: false, error: S.exportOutputStatFailed }
  }
  if (rawMode === 'folder') {
    shell.showItemInFolder(abs)
    return { ok: true, path: abs }
  }
  if (rawMode === 'preview') {
    const opened = await openDownloadedFileInMainHandler(abs)
    return opened.ok ? { ok: true, path: abs } : opened
  }
  const result = await shell.openPath(abs)
  return result ? { ok: false, error: result } : { ok: true, path: abs }
}

function rememberedExportDefaultPath(fileName: string): string {
  const raw = cachedSettings.ffmpegExportDirectory
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return fileName
  }
  const dir = resolve(normalize(raw.trim()))
  try {
    if (existsSync(dir) && statSync(dir).isDirectory()) {
      return join(dir, fileName)
    }
  } catch {
    // Если папку удалили или доступ пропал, диалог всё равно откроется со стандартным именем.
  }
  return fileName
}

function rememberFfmpegExportDirectory(outputPath: string): void {
  const dir = dirname(resolve(normalize(outputPath)))
  cachedSettings = { ...cachedSettings, ffmpegExportDirectory: dir }
  saveSettings(settingsPath(), cachedSettings)
}

function rememberedSnapshotDefaultPath(fileName: string): string {
  const raw = cachedSettings.ffmpegSnapshotDirectory
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return fileName
  }
  const dir = resolve(normalize(raw.trim()))
  try {
    if (existsSync(dir) && statSync(dir).isDirectory()) {
      return join(dir, fileName)
    }
  } catch {
    // Удалённая/недоступная папка не должна мешать сохранению нового кадра.
  }
  return fileName
}

function rememberFfmpegSnapshotDirectory(outputPath: string): void {
  const dir = dirname(resolve(normalize(outputPath)))
  cachedSettings = { ...cachedSettings, ffmpegSnapshotDirectory: dir }
  saveSettings(settingsPath(), cachedSettings)
}

function isMainWindowSender(event: IpcMainEvent): boolean {
  return mainWindowWebContentsId !== null && event.sender.id === mainWindowWebContentsId
}

function isMainWindowUiPanelSender(event: IpcMainInvokeEvent): boolean {
  if (mainWindowWebContentsId !== null && event.sender.id === mainWindowWebContentsId) {
    return true
  }
  return isInspectorWindow(BrowserWindow.fromWebContents(event.sender))
}

function resolveEffectiveTheme(pref: AppTheme): ResolvedAppTheme {
  if (pref === 'system') {
    return nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
  }
  return pref
}

function refreshEnginePathOverridesSnapshot(): void {
  setEnginePathOverridesSnapshot(cachedSettings.engineExecutablePaths)
}

function patchWindowBounds(partial: Partial<WindowBoundsConfig>): void {
  cachedSettings = {
    ...cachedSettings,
    windowBounds: {
      ...cachedSettings.windowBounds,
      ...partial
    }
  }
  saveSettings(settingsPath(), cachedSettings)
}

function attachMainWindowBoundsPersistence(win: BrowserWindow): void {
  let mainWindowBoundsTimer: ReturnType<typeof setTimeout> | null = null

  const flush = (): void => {
    if (win.isDestroyed()) {
      return
    }
    patchWindowBounds({ main: boundsFromBrowserWindow(win) })
  }

  const schedule = (): void => {
    if (mainWindowBoundsTimer !== null) {
      clearTimeout(mainWindowBoundsTimer)
    }
    mainWindowBoundsTimer = setTimeout(() => {
      mainWindowBoundsTimer = null
      flush()
    }, 480)
  }

  win.on('resize', schedule)
  win.on('move', schedule)
  win.on('close', () => {
    if (mainWindowBoundsTimer !== null) {
      clearTimeout(mainWindowBoundsTimer)
      mainWindowBoundsTimer = null
    }
    flush()
  })
}

function persistYtdlpDownloadDirectory(abs: string | null): void {
  const merged: AppSettings = { ...cachedSettings }
  if (abs === null || abs.trim() === '') {
    delete merged.ytdlpDownloadDirectory
  } else {
    const n = normalize(abs.trim())
    if (!isAbsolute(n)) {
      return
    }
    merged.ytdlpDownloadDirectory = n
  }
  cachedSettings = merged
  saveSettings(settingsPath(), cachedSettings)
  syncYtdlpDownloadDirectoryFromSettings(cachedSettings.ytdlpDownloadDirectory)
  buildApplicationMenu()
  broadcastDownloadsOutputDirectorySnapshot()
}

/** §6.2 — выбор файла Netscape cookies; взаимоисключающий с --cookies-from-browser. */
function persistYtdlpCookiesFileFromPicker(
  absPath: string
): { ok: true } | { ok: false; error: string } {
  const v = validateYtdlpCookiesFilePath(absPath, mainDownloadsUiLocale())
  if (!v.ok) {
    return v
  }
  const merged: AppSettings = { ...cachedSettings }
  merged.ytdlpCookiesFile = v.path
  delete merged.ytdlpCookiesBrowser
  cachedSettings = merged
  saveSettings(settingsPath(), cachedSettings)
  refreshYtdlpRunOptionsSnapshot(cachedSettings, mainDownloadsUiLocale())
  broadcastDownloadsCliOptionsChanged()
  return { ok: true }
}

function persistClearYtdlpCookiesFile(): void {
  const merged: AppSettings = { ...cachedSettings }
  delete merged.ytdlpCookiesFile
  cachedSettings = merged
  saveSettings(settingsPath(), cachedSettings)
  refreshYtdlpRunOptionsSnapshot(cachedSettings, mainDownloadsUiLocale())
  broadcastDownloadsCliOptionsChanged()
}

/**
 * §6.2 — слияние патча CLI yt-dlp с базовыми настройками без записи на диск;
 * используется при сохранении и для черновика превью argv §6.3.
 */
function mergeYtdlpDownloadCliPatchOntoSettings(
  base: AppSettings,
  patch: YtdlpDownloadOptionsPatch,
  uiLocale: DownloadsWindowUiLocale = 'ru'
): { ok: true; settings: AppSettings } | { ok: false; error: string } {
  const M = getYtdlpCliValidationCopy(uiLocale)
  const merged: AppSettings = { ...base }
  if (patch.filenameTemplate !== undefined) {
    if (typeof patch.filenameTemplate !== 'string') {
      return { ok: false, error: M.patchFilenameTemplateMustBeString }
    }
    const ft = patch.filenameTemplate
    if (ft.trim() === '') {
      delete merged.ytdlpFilenameTemplate
    } else {
      const v = validateFilenameTemplate(ft, uiLocale)
      if (!v.ok) {
        return v
      }
      merged.ytdlpFilenameTemplate = v.value
    }
  }
  if (patch.formatPreset !== undefined) {
    merged.ytdlpFormatPreset = patch.formatPreset
  }
  if (patch.downloadPlaylist !== undefined) {
    if (patch.downloadPlaylist) {
      merged.ytdlpDownloadPlaylist = true
    } else {
      delete merged.ytdlpDownloadPlaylist
    }
  }
  if (patch.audioOnly !== undefined) {
    if (patch.audioOnly) {
      merged.ytdlpAudioOnly = true
    } else {
      delete merged.ytdlpAudioOnly
    }
  }
  if (patch.subtitlePreset !== undefined) {
    const id = parseYtdlpSubtitlePreset(patch.subtitlePreset)
    if (id === 'none') {
      delete merged.ytdlpSubtitlePreset
    } else {
      merged.ytdlpSubtitlePreset = id
    }
  }
  if (patch.subLangs !== undefined) {
    if (typeof patch.subLangs !== 'string') {
      return { ok: false, error: M.patchSubLangsMustBeString }
    }
    const sv = validateYtdlpSubLangs(patch.subLangs, uiLocale)
    if (!sv.ok) {
      return sv
    }
    if (sv.value === '') {
      delete merged.ytdlpSubLangs
    } else {
      merged.ytdlpSubLangs = sv.value
    }
  }
  if (patch.cookiesBrowser !== undefined) {
    if (patch.cookiesBrowser === 'none') {
      delete merged.ytdlpCookiesBrowser
      delete merged.ytdlpCookiesBrowserProfile
    } else {
      merged.ytdlpCookiesBrowser = patch.cookiesBrowser
      delete merged.ytdlpCookiesFile
    }
  }
  if (patch.cookiesBrowserProfile !== undefined) {
    if (typeof patch.cookiesBrowserProfile !== 'string') {
      return { ok: false, error: M.patchCookiesBrowserProfileMustBeString }
    }
    const pv = validateYtdlpCookiesBrowserProfile(patch.cookiesBrowserProfile, uiLocale)
    if (!pv.ok) {
      return pv
    }
    if (pv.value === '') {
      delete merged.ytdlpCookiesBrowserProfile
    } else {
      merged.ytdlpCookiesBrowserProfile = pv.value
    }
  }
  if (patch.impersonate !== undefined) {
    if (patch.impersonate === 'none') {
      delete merged.ytdlpImpersonate
    } else {
      merged.ytdlpImpersonate = patch.impersonate
    }
  }
  if (patch.rateLimit !== undefined) {
    if (typeof patch.rateLimit !== 'string') {
      return { ok: false, error: M.patchRateLimitMustBeString }
    }
    const rv = validateYtdlpRateLimit(patch.rateLimit, uiLocale)
    if (!rv.ok) {
      return rv
    }
    if (rv.value === '') {
      delete merged.ytdlpRateLimit
    } else {
      merged.ytdlpRateLimit = rv.value
    }
  }
  if (patch.retriesLine !== undefined) {
    if (typeof patch.retriesLine !== 'string') {
      return { ok: false, error: M.patchRetriesLineMustBeString }
    }
    const rt = validateYtdlpRetriesLine(patch.retriesLine, uiLocale)
    if (!rt.ok) {
      return rt
    }
    if (rt.value === null) {
      delete merged.ytdlpRetries
    } else {
      merged.ytdlpRetries = rt.value
    }
  }
  if (patch.fragmentRetriesLine !== undefined) {
    if (typeof patch.fragmentRetriesLine !== 'string') {
      return { ok: false, error: M.patchFragmentRetriesLineMustBeString }
    }
    const frt = validateYtdlpFragmentRetriesLine(patch.fragmentRetriesLine, uiLocale)
    if (!frt.ok) {
      return frt
    }
    if (frt.value === null) {
      delete merged.ytdlpFragmentRetries
    } else {
      merged.ytdlpFragmentRetries = frt.value
    }
  }
  if (patch.extraArgsLine !== undefined) {
    if (typeof patch.extraArgsLine !== 'string') {
      return { ok: false, error: M.patchExtraArgsLineMustBeString }
    }
    const trimmed = patch.extraArgsLine.trim()
    if (trimmed === '') {
      delete merged.ytdlpExtraArgsLine
    } else {
      const pe = parseExtraYtdlpArgsLine(trimmed, uiLocale)
      if (!pe.ok) {
        return pe
      }
      merged.ytdlpExtraArgsLine = trimmed
    }
  }
  if (patch.queueRetryProfile !== undefined) {
    const id = parseYtdlpQueueRetryProfile(patch.queueRetryProfile)
    if (id === 'off') {
      delete merged.ytdlpQueueRetryProfile
    } else {
      merged.ytdlpQueueRetryProfile = id
    }
  }
  if (patch.openInHandlerOnComplete !== undefined) {
    if (patch.openInHandlerOnComplete) {
      merged.ytdlpOpenInHandlerOnComplete = true
    } else {
      delete merged.ytdlpOpenInHandlerOnComplete
      delete merged.ytdlpAutoExportAfterOpenInHandler
    }
  }
  if (patch.autoExportAfterOpenInHandler !== undefined) {
    if (patch.autoExportAfterOpenInHandler) {
      merged.ytdlpAutoExportAfterOpenInHandler = true
      merged.ytdlpOpenInHandlerOnComplete = true
    } else {
      delete merged.ytdlpAutoExportAfterOpenInHandler
    }
  }
  if (patch.enqueueBatchOnDownloadComplete !== undefined) {
    if (patch.enqueueBatchOnDownloadComplete) {
      merged.ytdlpEnqueueBatchOnDownloadComplete = true
    } else {
      delete merged.ytdlpEnqueueBatchOnDownloadComplete
      delete merged.ytdlpAutoStartBatchAfterEnqueue
    }
  }
  if (patch.autoStartBatchAfterEnqueue !== undefined) {
    if (patch.autoStartBatchAfterEnqueue) {
      merged.ytdlpAutoStartBatchAfterEnqueue = true
      merged.ytdlpEnqueueBatchOnDownloadComplete = true
    } else {
      delete merged.ytdlpAutoStartBatchAfterEnqueue
    }
  }
  return { ok: true, settings: merged }
}

function launchFfmpegExportBatchRunner(
  rawExportOverrides?: unknown,
  progressTargetWin?: BrowserWindow | null
): boolean {
  if (activeExportAbort !== null || isFfmpegExportBatchActive()) {
    return false
  }
  const snap = getFfmpegExportBatchSnapshot()
  if (!snap.rows.some((r) => r.status === 'waiting')) {
    return false
  }
  const paths = resolveAppPaths()
  const ffmpeg = resolveEngineExecutablePath(paths, 'ffmpeg', cachedSettings.engineExecutablePaths)
  if (!ffmpeg) {
    return false
  }
  const loc = mainDownloadsUiLocale()
  void runFfmpegExportBatchQueue({
    ffmpegPath: ffmpeg,
    settings: cachedSettings,
    lutResourcesRoot: paths.resources,
    rawExportOverrides,
    userDataRoot: paths.userData,
    rememberExportOutputPath,
    rememberFfmpegExportDirectory,
    uiLocale: loc,
    pushRowProgress: (rowId, p) => {
      if (progressTargetWin && !progressTargetWin.isDestroyed()) {
        progressTargetWin.webContents.send(mw.exportProgress, { ...p, batchRowId: rowId })
        return
      }
      for (const w of BrowserWindow.getAllWindows()) {
        if (!w.isDestroyed()) {
          w.webContents.send(mw.exportProgress, { ...p, batchRowId: rowId })
        }
      }
    }
  }).finally(() => {
    broadcastFfmpegExportBatchSnapshot?.(progressTargetWin ?? undefined)
  })
  broadcastFfmpegExportBatchSnapshot?.(progressTargetWin ?? undefined)
  return true
}

function scheduleEnqueueBatchAfterDownload(absoluteFile: string, rowId: number): void {
  void (async () => {
    const loc = mainDownloadsUiLocale()
    grantMediaPath(absoluteFile)
    if (!isFfmpegExportBatchVideoPath(absoluteFile)) {
      emitDownloadsLog({
        kind: 'line',
        rowId,
        stream: 'stderr',
        text: fluxLogBatchEnqueueSkippedNotVideo(loc)
      })
      return
    }
    const granted = filterExistingVideoPathsForBatch([absoluteFile])
    if (granted.length === 0) {
      return
    }
    const { added } = addFfmpegExportBatchPaths(granted)
    if (added > 0) {
      emitDownloadsLog({
        kind: 'line',
        rowId,
        stream: 'stderr',
        text: formatFluxLogBatchEnqueueAdded(loc, absoluteFile)
      })
      revealMainWindowBatchExportPanel()
    }
    broadcastFfmpegExportBatchSnapshot?.()
    const cli = getYtdlpRunOptionsSnapshot()
    if (!cli.autoStartBatchAfterEnqueue) {
      return
    }
    if (activeExportAbort !== null || isFfmpegExportBatchActive()) {
      emitDownloadsLog({
        kind: 'line',
        rowId,
        stream: 'stderr',
        text: fluxLogBatchAutoStartSkippedBusy(loc)
      })
      return
    }
    const paths = resolveAppPaths()
    const ffmpeg = resolveEngineExecutablePath(
      paths,
      'ffmpeg',
      cachedSettings.engineExecutablePaths
    )
    if (!ffmpeg) {
      emitDownloadsLog({
        kind: 'line',
        rowId,
        stream: 'stderr',
        text: fluxLogBatchAutoStartFfmpegMissing(loc)
      })
      return
    }
    if (launchFfmpegExportBatchRunner(undefined)) {
      emitDownloadsLog({
        kind: 'line',
        rowId,
        stream: 'stderr',
        text: fluxLogBatchAutoStartLaunched(loc)
      })
    }
  })()
}

function parseYtdlpGetCliOptionsParams(raw: unknown): YtdlpGetCliOptionsParams | undefined {
  if (raw === undefined || raw === null) {
    return undefined
  }
  if (typeof raw !== 'object') {
    return undefined
  }
  const o = raw as Record<string, unknown>
  const out: YtdlpGetCliOptionsParams = {}
  if (typeof o['previewOutputDirectory'] === 'string') {
    out.previewOutputDirectory = o['previewOutputDirectory']
  }
  const dr = o['draft']
  if (dr !== undefined && dr !== null && typeof dr === 'object') {
    out.draft = dr as YtdlpDownloadOptionsPatch
  }
  const parsedUi = parseDownloadsWindowUiLocale(o['uiLocale'])
  if (parsedUi !== undefined) {
    out.uiLocale = parsedUi
  }
  return Object.keys(out).length > 0 ? out : undefined
}

/** §6.2 — шаблон `-o` и белый список `-f`; синхронно обновляет снимок для downloads-queue-runner. */
function persistYtdlpDownloadCliOptionsPatch(
  patch: YtdlpDownloadOptionsPatch,
  uiLocale?: DownloadsWindowUiLocale
): { ok: true } | { ok: false; error: string } {
  const loc = uiLocale ?? mainDownloadsUiLocale()
  const merged = mergeYtdlpDownloadCliPatchOntoSettings(cachedSettings, patch, loc)
  if (!merged.ok) {
    return merged
  }
  cachedSettings = merged.settings
  saveSettings(settingsPath(), cachedSettings)
  refreshYtdlpRunOptionsSnapshot(cachedSettings, mainDownloadsUiLocale())
  broadcastDownloadsCliOptionsChanged()
  return { ok: true }
}

function persistLastOpenedSource(absolutePath: string | null): void {
  if (absolutePath === null || absolutePath.trim().length === 0) {
    const rest = { ...cachedSettings }
    delete rest.lastOpenedSourcePath
    cachedSettings = rest
  } else {
    cachedSettings = { ...cachedSettings, lastOpenedSourcePath: absolutePath.trim() }
  }
  saveSettings(settingsPath(), cachedSettings)
}

function previewOpenDialogOptsFromSettings(): { defaultPath: string } | undefined {
  const d = resolveOpenMediaDialogDefaultPath(cachedSettings.lastOpenedSourcePath)
  return d !== undefined ? { defaultPath: d } : undefined
}

function batchExportOutputFolderPickOptsFromSettings(): { defaultPath: string } | undefined {
  const raw = cachedSettings.ffmpegExportBatchOutputDirectory
  if (typeof raw === 'string' && raw.trim().length > 0) {
    const p = normalize(raw.trim())
    if (existsSync(p)) {
      try {
        if (statSync(p).isDirectory()) {
          return { defaultPath: p }
        }
      } catch {
        /* fall back to last preview path */
      }
    }
  }
  return previewOpenDialogOptsFromSettings()
}

/** §4.1 — persist раскрытия collapsible FFmpeg / быстрый yt-dlp в главном renderer. */
function revealMainWindowBatchExportPanel(): void {
  if (cachedSettings.mainWindowUiPanels?.batchExport === true) {
    return
  }
  settingsIpcPersist.persistMainWindowUiPanelsMerge({ batchExport: true })
}

function setTheme(pref: AppTheme): AppSettingsView {
  return settingsIpcPersist.persistThemePreference(pref)
}

function buildDiagnosticsFolderSubmenu(): Electron.MenuItemConstructorOptions[] {
  const entries = listDiagnosticsFolders(mainDownloadsUiLocale())
  return entries.map((entry: DiagnosticsFolderEntry) => ({
    label: entry.label,
    enabled: entry.exists,
    click: (): void => {
      void openDiagnosticsFolder(entry.id)
    }
  }))
}

function getCrashDumpsPathSafe(): string | null {
  try {
    return app.getPath('crashDumps')
  } catch {
    return null
  }
}

async function buildSupportBundleRuntimeInfo(): Promise<SupportBundleRuntimeInfo> {
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

  const unpackedRoot = packagedWinUnpackedRoot(paths.appRoot)
  const unpackedExe = join(
    unpackedRoot,
    process.platform === 'win32' ? 'FluxAlloy.exe' : 'FluxAlloy'
  )
  const releaseSmokeLines: string[] = [
    'command: npm run smoke:packaged-release (after npm run pack:dir)',
    existsSync(unpackedExe)
      ? `win-unpacked: ${unpackedExe}`
      : `win-unpacked: not built (${unpackedRoot})`
  ]
  const ffprobeSmokeLines = buildSupportZipFfprobeSmokeLines(paths.appRoot, existsSync)

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
    ffprobeSmokeLines
  }
}

function pruneDiagnosticsOnStartup(): void {
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
async function openMainLogForUser(): Promise<{ ok: true } | { ok: false; error: string }> {
  const S = mainAppStr()
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

async function openMainLogFile(): Promise<void> {
  await openMainLogForUser()
}

async function openSessionLogFile(): Promise<void> {
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

/** Исход диалога сохранения Support ZIP: отмена отделена от ошибки записи (для IPC из renderer). */
type SupportBundleDialogOutcome =
  | { outcome: 'saved'; path: string }
  | { outcome: 'cancelled' }
  | { outcome: 'failed'; message: string }

async function createSupportBundleWithDialog(
  parent?: BrowserWindow
): Promise<SupportBundleDialogOutcome> {
  const S = mainAppStr()
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

let processErrorDialogOpen = false
let mainWindowRef: BrowserWindow | null = null

async function showProcessErrorDialog(
  kind: 'uncaughtException' | 'unhandledRejection',
  reason: unknown
): Promise<void> {
  if (processErrorDialogOpen || !app.isReady()) {
    return
  }
  processErrorDialogOpen = true
  const win = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0]
  const loc = mainDownloadsUiLocale()
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

function buildApplicationMenu(): void {
  const win = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0] ?? undefined
  const isMac = process.platform === 'darwin'
  const themePref = cachedSettings.theme
  const uiLoc = mainDownloadsUiLocale()
  const isSystem = themePref === 'system'
  const isDarkPref = themePref === 'dark'
  const isLightPref = themePref === 'light'
  const downloadsFocused = isDownloadsWindow(win)
  const inspectorFocused = isInspectorWindow(win)
  const auxiliaryFocused = downloadsFocused || inspectorFocused
  const mainUiWindow =
    mainWindowRef && !mainWindowRef.isDestroyed()
      ? mainWindowRef
      : BrowserWindow.getAllWindows().find((w) => !isDownloadsWindow(w) && !isInspectorWindow(w))

  const getMainUiWindow = (): BrowserWindow | undefined =>
    mainUiWindow && !mainUiWindow.isDestroyed() ? mainUiWindow : undefined

  const m = mainAppStr()

  // Меню пересобирается после смены темы, чтобы radio-состояния оставались честными.
  const template: Electron.MenuItemConstructorOptions[] = []

  if (isMac) {
    template.push({
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })
  }

  template.push(
    {
      label: m.menuFile,
      submenu: [
        {
          label: m.menuOpen,
          accelerator: 'CmdOrCtrl+O',
          click: async (): Promise<void> => {
            const target = getMainUiWindow()
            if (!target || target.isDestroyed()) {
              return
            }
            target.focus()
            const def = previewOpenDialogOptsFromSettings()
            const result = await openVideoWithDialog(target, mainDownloadsUiLocale(), def)
            if (!result.ok) {
              return
            }
            persistLastOpenedSource(result.path)
            target.webContents.send(mw.previewOpened, result)
          }
        },
        {
          label: m.menuOpenVideoFolder,
          accelerator: 'CmdOrCtrl+Shift+O',
          click: async (): Promise<void> => {
            const target = getMainUiWindow()
            if (!target || target.isDestroyed()) {
              return
            }
            target.focus()
            const def = previewOpenDialogOptsFromSettings()
            const result = await openVideoFolderWithDialog(target, mainDownloadsUiLocale(), def)
            if (!result.ok) {
              if (
                'error' in result &&
                typeof result.error === 'string' &&
                result.error.length > 0
              ) {
                void dialog.showMessageBox(target, {
                  type: 'warning',
                  title: m.openVideoFolderDialogTitle,
                  message: result.error
                })
              }
              return
            }
            persistLastOpenedSource(result.path)
            target.webContents.send(mw.previewOpened, result)
          }
        },
        {
          label: m.menuDownloadsManager,
          accelerator: 'CmdOrCtrl+Shift+Y',
          enabled: !auxiliaryFocused,
          click: (): void => {
            focusOrCreateDownloadsWindow(undefined)
          }
        },
        {
          label: m.menuPasteUrlDownloads,
          accelerator: 'CmdOrCtrl+Shift+V',
          enabled: !auxiliaryFocused,
          click: (): void => {
            const t = clipboard.readText().trim()
            focusOrCreateDownloadsWindow(t.length > 0 ? t : undefined)
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    {
      label: m.menuSettings,
      submenu: [
        {
          label: m.menuEnginePaths,
          click: (): void => {
            const target = getMainUiWindow()
            if (!target || target.isDestroyed()) {
              return
            }
            target.focus()
            target.webContents.send(mw.openEnginePaths)
          }
        }
      ]
    },
    {
      label: m.menuTools,
      submenu: [
        {
          label: m.menuInspector,
          enabled: !auxiliaryFocused,
          click: (): void => {
            focusOrCreateInspectorWindow(undefined)
          }
        },
        { type: 'separator' },
        {
          label: m.menuOpenFolder,
          submenu: buildDiagnosticsFolderSubmenu()
        },
        {
          label: m.menuOpenMainLog,
          click: (): void => {
            void openMainLogFile()
          }
        },
        {
          label: m.menuOpenSessionLog,
          click: (): void => {
            void openSessionLogFile()
          }
        },
        {
          label: m.menuSupportZip,
          click: (): void => {
            const target = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0]
            void createSupportBundleWithDialog(target && !target.isDestroyed() ? target : undefined)
          }
        }
      ]
    },
    {
      label: m.menuView,
      submenu: [
        {
          label: m.menuTheme,
          submenu: [
            {
              label: m.menuThemeSystem,
              type: 'radio',
              checked: isSystem,
              click: (): void => {
                void setTheme('system')
              }
            },
            {
              label: m.menuThemeDark,
              type: 'radio',
              checked: isDarkPref,
              click: (): void => {
                void setTheme('dark')
              }
            },
            {
              label: m.menuThemeLight,
              type: 'radio',
              checked: isLightPref,
              click: (): void => {
                void setTheme('light')
              }
            }
          ]
        },
        {
          label: m.menuInterfaceLanguage,
          submenu: [
            {
              label: m.menuUiLangRussian,
              type: 'radio',
              checked: uiLoc === 'ru',
              click: (): void => {
                void settingsIpcPersist.persistUiLocale('ru')
              }
            },
            {
              label: m.menuUiLangEnglish,
              type: 'radio',
              checked: uiLoc === 'en',
              click: (): void => {
                void settingsIpcPersist.persistUiLocale('en')
              }
            }
          ]
        }
      ]
    },
    {
      label: m.menuHelp,
      submenu: [
        {
          label: m.menuAbout,
          click: (): void => {
            const target = getMainUiWindow()
            if (!target || target.isDestroyed()) {
              return
            }
            target.focus()
            target.webContents.send(mw.openAbout)
          }
        },
        {
          label: m.menuDocumentation,
          click: (): void => {
            const tzPath = technicalSpecPath()
            if (existsSync(tzPath)) {
              void shell.openPath(tzPath)
            }
          }
        }
      ]
    }
  )

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  if (win && !win.isDestroyed()) {
    win.setMenuBarVisibility(true)
  }
}

function createWindow(): void {
  const savedMain = cachedSettings.windowBounds?.main
  const rect = savedMain ? rectifyBoundsForRestore(savedMain) : null
  const mainDisp = displayMatchingRestoreRect(rect)
  const mainScale = logicalScaleFactor(mainDisp)
  const mainMin = mainEditorMinLogicalSize(mainScale)
  const mainDefault = defaultMainEditorSize(
    mainDisp.size.width,
    mainDisp.size.height,
    mainMin.minWidth,
    mainMin.minHeight
  )

  const mainWindow = new BrowserWindow({
    width: rect?.width ?? mainDefault.width,
    height: rect?.height ?? mainDefault.height,
    minWidth: mainMin.minWidth,
    minHeight: mainMin.minHeight,
    ...(rect ? { x: rect.x, y: rect.y } : {}),
    show: false,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: resolvePreloadOutFile('index', __dirname),
      sandbox: false,
      // Renderer не получает Node API напрямую; вся работа с FS/процессами пойдёт через whitelist IPC.
      contextIsolation: true,
      nodeIntegration: false
    }
  })
  mainWindowRef = mainWindow

  mainWindow.on('closed', () => {
    if (mainWindowRef?.id === mainWindow.id) {
      mainWindowRef = null
    }
  })

  allowMainWindowClose = false
  const mainWebContentsId = mainWindow.webContents.id
  mainWindowWebContentsId = mainWebContentsId
  mainWindow.on('closed', () => {
    if (mainWindowWebContentsId === mainWebContentsId) {
      mainWindowWebContentsId = null
    }
    rendererLogBuckets.delete(mainWebContentsId)
  })
  mainWindow.on('close', (e) => {
    if (allowMainWindowClose) {
      return
    }
    const exportBusy = activeExportAbort !== null
    const downloadsBusy = isDownloadsRunnerBusy()
    if (!exportBusy && !downloadsBusy) {
      return
    }
    e.preventDefault()
    const q = mainAppStr()
    const msg =
      exportBusy && downloadsBusy
        ? q.quitConfirmBoth
        : exportBusy
          ? q.quitConfirmExport
          : q.quitConfirmDownloads

    void dialog
      .showMessageBox(mainWindow, {
        type: 'warning',
        buttons: [q.quitStay, q.quitAbort],
        defaultId: 0,
        cancelId: 0,
        title: q.quitDialogTitle,
        message: msg,
        noLink: true
      })
      .then(({ response }) => {
        if (response !== 1) {
          return
        }
        activeExportAbort?.abort()
        cancelDownloadsRunner()
        allowMainWindowClose = true
        mainWindow.close()
      })
  })

  attachMainWindowBoundsPersistence(mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    buildApplicationMenu()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    // Внешние ссылки не открываем внутри Electron-окна: так renderer не получает незапланированную навигацию.
    openAllowedExternalUrl(details.url)
    return { action: 'deny' }
  })
  installExternalNavigationGuard(mainWindow.webContents)

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function isLikelyBrowserPlayableMedia(filePath: string): boolean {
  const ext = extname(filePath).toLowerCase()
  return ['.mp4', '.m4v', '.webm', '.ogg', '.ogv', '.mp3', '.wav', '.flac'].includes(ext)
}

const previewProxyJobs = new Map<string, Promise<string>>()

function runFfmpegPreviewProxy(ffmpeg: string, input: string, output: string): Promise<void> {
  const args = [
    '-y',
    '-i',
    input,
    '-map',
    '0:v:0',
    '-map',
    '0:a?',
    '-c:v',
    'libvpx',
    '-deadline',
    'realtime',
    '-cpu-used',
    '5',
    '-b:v',
    '2500k',
    '-vf',
    "scale=w='min(1280,iw)':h=-2",
    '-c:a',
    'libopus',
    '-b:a',
    '128k',
    output
  ]

  return new Promise((resolvePromise, reject) => {
    execFile(
      ffmpeg,
      args,
      { timeout: 20 * 60_000, windowsHide: true },
      (error, _stdout, stderr) => {
        if (error) {
          reject(new Error(stderr.trim() || error.message))
          return
        }
        resolvePromise()
      }
    )
  })
}

function isUsablePreviewCache(filePath: string): boolean {
  if (!existsSync(filePath)) {
    return false
  }
  try {
    const st = statSync(filePath)
    return st.isFile() && st.size > 0
  } catch {
    return false
  }
}

async function createWebmPreviewProxy(
  ffmpeg: string,
  absoluteFile: string,
  output: string
): Promise<string> {
  rmSync(output, { force: true })
  logInfo('preview', `creating webm preview proxy for ${absoluteFile}`)
  await runFfmpegPreviewProxy(ffmpeg, absoluteFile, output)
  if (!isUsablePreviewCache(output)) {
    throw new Error(getMainApplicationStrings(mainDownloadsUiLocale()).previewWebmNotCreated)
  }
  logInfo('preview', `webm preview proxy ready: ${output}`)
  return output
}

function resolveUserPathToPreviewSourceFile(rawPath: string):
  | { ok: true; path: string }
  | {
      ok: false
      error: string
    } {
  const P = mainAppStr()
  const normalized = normalize(rawPath.trim())
  if (!existsSync(normalized)) {
    return { ok: false, error: P.previewGrantOpenFailed }
  }
  try {
    const st = statSync(normalized)
    if (st.isDirectory()) {
      const scanned = scanFolderForFfmpegExportBatchVideos(normalized)
      if (scanned.length === 0) {
        return { ok: false, error: P.batchExportFolderEmpty }
      }
      return { ok: true, path: scanned[0]! }
    }
    if (!st.isFile()) {
      return { ok: false, error: P.previewGrantOpenFailed }
    }
    return { ok: true, path: normalized }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

async function ensurePreviewPlayableMedia(absoluteFile: string): Promise<string> {
  if (isLikelyBrowserPlayableMedia(absoluteFile)) {
    return absoluteFile
  }

  const paths = resolveAppPaths()
  const ffmpeg = resolveEngineExecutablePath(paths, 'ffmpeg', cachedSettings.engineExecutablePaths)
  if (!ffmpeg) {
    throw new Error(getMainApplicationStrings(mainDownloadsUiLocale()).previewFfmpegMissingForWebm)
  }

  const st = statSync(absoluteFile)
  const key = createHash('sha256')
    .update(absoluteFile)
    .update(String(st.mtimeMs))
    .update(String(st.size))
    .digest('hex')
    .slice(0, 24)
  const cacheDir = join(paths.userData, 'preview-cache')
  mkdirSync(cacheDir, { recursive: true })
  const output = join(cacheDir, `${key}.webm`)
  if (isUsablePreviewCache(output)) {
    return output
  }
  rmSync(output, { force: true })

  const existingJob = previewProxyJobs.get(output)
  if (existingJob) {
    return existingJob
  }
  const job = createWebmPreviewProxy(ffmpeg, absoluteFile, output).finally(() => {
    previewProxyJobs.delete(output)
  })
  previewProxyJobs.set(output, job)
  return job
}

async function openDownloadedFileInMainHandler(
  absoluteFile: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const H = mainAppStr()
  let previewFile: string
  try {
    previewFile = await ensurePreviewPlayableMedia(absoluteFile)
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
  const mediaUrl = grantMediaPath(previewFile)
  if (!mediaUrl) {
    return { ok: false, error: H.previewCannotOpenInPreview }
  }
  if (!grantMediaPath(absoluteFile)) {
    return { ok: false, error: H.previewCannotOpenSourceInEditor }
  }
  const target =
    mainWindowWebContentsId === null
      ? null
      : BrowserWindow.getAllWindows().find((w) => w.webContents.id === mainWindowWebContentsId)
  if (!target || target.isDestroyed()) {
    return { ok: false, error: H.previewMainWindowMissing }
  }
  persistLastOpenedSource(absoluteFile)
  target.show()
  target.focus()
  target.webContents.send(mw.previewOpened, {
    ok: true,
    path: absoluteFile,
    mediaUrl,
    name:
      previewFile === absoluteFile
        ? basename(absoluteFile)
        : `${basename(absoluteFile)} · preview WebM`
  })
  return { ok: true }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.fluxalloy')
  setProcessErrorReporter((kind, reason) => {
    void showProcessErrorDialog(kind, reason)
  })
  logStartupBanner()
  pruneDiagnosticsOnStartup()
  cachedSettings = loadSettings(settingsPath())
  settingsIpcPersist = createSettingsIpcPersist(mainSettingsAccess, {
    resolveEffectiveTheme,
    buildApplicationMenu,
    syncDownloadsPopoutHtmlToLocale,
    refreshEnginePathOverridesSnapshot
  })
  refreshEnginePathOverridesSnapshot()
  syncYtdlpDownloadDirectoryFromSettings(cachedSettings.ytdlpDownloadDirectory)
  refreshYtdlpRunOptionsSnapshot(cachedSettings, mainDownloadsUiLocale())
  attachFfmpegExportBatchQueuePersist(app)
  hydrateFfmpegExportBatchQueueFromDisk(resolveAppPaths().userData)
  nativeTheme.on('updated', () => {
    if (cachedSettings.theme !== 'system') {
      return
    }
    const eff = resolveEffectiveTheme('system')
    for (const w of BrowserWindow.getAllWindows()) {
      if (!w.isDestroyed()) {
        w.webContents.send(mw.themeChanged, eff)
      }
    }
    buildApplicationMenu()
  })
  configureDownloadsWindowBoundsHooks({
    isMainWindowSender: (sender) => sender.id === mainWindowWebContentsId,
    getSavedDownloadsBounds: () => cachedSettings.windowBounds?.downloads,
    persistDownloadsBounds: (r) => {
      patchWindowBounds({ downloads: r })
    },
    pickYtdlpOutputDirectory: async (win: BrowserWindow) => {
      const Y = getYtdlpCliValidationCopy(mainDownloadsUiLocale())
      const result = await dialog.showOpenDialog(win, {
        properties: ['openDirectory', 'createDirectory'],
        title: Y.dialogYtdlpOutputDirTitle
      })
      if (result.canceled || result.filePaths.length === 0 || !result.filePaths[0]) {
        return { ok: false, cancelled: true }
      }
      const picked = normalize(result.filePaths[0])
      if (!isAbsolute(picked)) {
        return { ok: false, error: Y.pickerOutputDirNeedAbsolute }
      }
      persistYtdlpDownloadDirectory(picked)
      return {
        ok: true,
        path: resolveYtdlpOutputDirectory(resolveAppPaths().userData)
      }
    },
    clearYtdlpOutputDirectoryOverride: (): void => {
      persistYtdlpDownloadDirectory(null)
    },
    pickYtdlpCookiesFile: async (win: BrowserWindow) => {
      const Y = getYtdlpCliValidationCopy(mainDownloadsUiLocale())
      const result = await dialog.showOpenDialog(win, {
        properties: ['openFile'],
        title: Y.dialogYtdlpCookiesFileTitle,
        filters: [
          { name: Y.dialogFilterTextFiles, extensions: ['txt'] },
          { name: Y.dialogFilterAllFiles, extensions: ['*'] }
        ]
      })
      if (result.canceled || result.filePaths.length === 0 || !result.filePaths[0]) {
        return { ok: false, cancelled: true }
      }
      const picked = normalize(result.filePaths[0])
      if (!isAbsolute(picked)) {
        return { ok: false, error: Y.pickerCookiesNeedAbsoluteFile }
      }
      const saved = persistYtdlpCookiesFileFromPicker(picked)
      if (!saved.ok) {
        return saved
      }
      return { ok: true, path: picked }
    },
    clearYtdlpCookiesFile: (): void => {
      persistClearYtdlpCookiesFile()
    },
    getYtdlpDownloadCliOptions: (raw?: unknown, ipcUiLocale?: DownloadsWindowUiLocale) => {
      const req = parseYtdlpGetCliOptionsParams(raw)
      const loc = req?.uiLocale ?? ipcUiLocale ?? mainDownloadsUiLocale()
      const paths = resolveAppPaths()
      const rows = getDownloadsQueueSnapshot()
      const hit = rows.find((r) => r.url.trim().length > 0)
      const previewParams: {
        userDataRoot: string
        sampleUrl?: string
        outputDirectoryOverride?: string | null
      } = {
        userDataRoot: paths.userData
      }
      if (hit !== undefined) {
        previewParams.sampleUrl = hit.url
      }
      if (
        req?.previewOutputDirectory !== undefined &&
        req.previewOutputDirectory.trim().length > 0
      ) {
        const n = normalizeYtdlpPreviewOutputDirectory(req.previewOutputDirectory)
        if (n !== null) {
          previewParams.outputDirectoryOverride = n
        }
      }
      let settings = cachedSettings
      if (req?.draft) {
        const merged = mergeYtdlpDownloadCliPatchOntoSettings(cachedSettings, req.draft, loc)
        if (merged.ok) {
          settings = merged.settings
        }
      }
      return payloadFromSnapshot(
        buildYtdlpRunOptionsSnapshot(settings, loc),
        buildYtdlpCommandPreviewContext(previewParams),
        loc
      )
    },
    applyYtdlpDownloadCliPatch: (patch, uiLocale?: DownloadsWindowUiLocale) =>
      persistYtdlpDownloadCliOptionsPatch(patch, uiLocale),
    openDownloadedFileInHandler: (absoluteFile) => openDownloadedFileInMainHandler(absoluteFile),
    getDownloadsWindowUiPanelsSnapshot: () => cachedSettings.downloadsWindowUiPanels,
    mergeDownloadsWindowUiPanelsPatch: (patch) => {
      const prev = cachedSettings.downloadsWindowUiPanels ?? {}
      cachedSettings = {
        ...cachedSettings,
        downloadsWindowUiPanels: { ...prev, ...patch }
      }
      saveSettings(settingsPath(), cachedSettings)
      broadcastDownloadsWindowUiPanelsSnapshot(cachedSettings.downloadsWindowUiPanels ?? {})
    },
    getAppTheme: (): ResolvedAppTheme => resolveEffectiveTheme(cachedSettings.theme),
    getDownloadsUiLocale: (): DownloadsWindowUiLocale => mainDownloadsUiLocale()
  })
  function scheduleAutoExportAfterSuccessfulYtdlpOpen(absoluteInput: string, rowId: number): void {
    void (async () => {
      const loc = mainDownloadsUiLocale()
      if (cachedSettings.ytdlpAutoExportAfterOpenInHandler !== true) {
        return
      }
      if (activeExportAbort !== null) {
        emitDownloadsLog({
          kind: 'line',
          rowId,
          stream: 'stderr',
          text: fluxLogAutoExportSkippedBusy(loc)
        })
        return
      }
      const paths = resolveAppPaths()
      const ffmpeg = resolveEngineExecutablePath(
        paths,
        'ffmpeg',
        cachedSettings.engineExecutablePaths
      )
      if (!ffmpeg) {
        emitDownloadsLog({
          kind: 'line',
          rowId,
          stream: 'stderr',
          text: fluxLogAutoExportFfmpegMissing(loc)
        })
        return
      }
      const exportOpts = resolveFfmpegExportJobOptionsFromAppSettings(cachedSettings, undefined)
      const outPath = pickUniqueAutoExportOutputPath(absoluteInput, exportOpts.container)
      const targetWin =
        mainWindowWebContentsId === null
          ? null
          : BrowserWindow.getAllWindows().find((w) => w.webContents.id === mainWindowWebContentsId)
      if (!targetWin || targetWin.isDestroyed()) {
        emitDownloadsLog({
          kind: 'line',
          rowId,
          stream: 'stderr',
          text: fluxLogAutoExportSkippedMainWindow(loc)
        })
        return
      }
      const ac = new AbortController()
      activeExportAbort = ac
      const startedAt = Date.now()
      const pushProgress = (p: FfmpegExportProgressPayload): void => {
        if (!targetWin.isDestroyed()) {
          targetWin.webContents.send(mw.exportProgress, p)
        }
      }
      try {
        pushProgress({ percent: -1, message: autoExportProgressMessage(loc) })
        const result = await runFfmpegExportJob({
          ffmpegPath: ffmpeg,
          inputPath: absoluteInput,
          outputPath: outPath,
          probeDurationSec: null,
          ...exportOpts,
          lutResourcesRoot: paths.resources,
          signal: ac.signal,
          onProgress: pushProgress,
          uiLocale: loc
        })
        if (result.ok) {
          rememberExportOutputPath(outPath)
          rememberFfmpegExportDirectory(outPath)
          appendProcessingHistoryEntry(paths.userData, {
            kind: 'autoExport',
            startedAt,
            finishedAt: Date.now(),
            inputPath: absoluteInput,
            outputPath: outPath,
            outcome: 'success',
            status: processingHistoryAutoExportSuccess(loc),
            errorHint: null,
            exportVideoCodecUsed: result.videoCodecUsed
          })
          emitDownloadsLog({
            kind: 'line',
            rowId,
            stream: 'stderr',
            text: formatFluxLogAutoExportDone(loc, outPath)
          })
          return
        }
        if (result.error === FFMPEG_EXPORT_CANCELLED_ERROR) {
          appendProcessingHistoryEntry(paths.userData, {
            kind: 'autoExport',
            startedAt,
            finishedAt: Date.now(),
            inputPath: absoluteInput,
            outputPath: outPath,
            outcome: 'cancelled',
            status: processingHistoryAutoExportCancelled(loc),
            errorHint: null,
            exportVideoCodecUsed: result.videoCodecUsed
          })
          emitDownloadsLog({
            kind: 'line',
            rowId,
            stream: 'stderr',
            text: fluxLogAutoExportCancelled(loc)
          })
          return
        }
        appendProcessingHistoryEntry(paths.userData, {
          kind: 'autoExport',
          startedAt,
          finishedAt: Date.now(),
          inputPath: absoluteInput,
          outputPath: outPath,
          outcome: 'error',
          status: processingHistoryAutoExportFailed(loc),
          errorHint: result.error,
          exportVideoCodecUsed: result.videoCodecUsed
        })
        emitDownloadsLog({
          kind: 'line',
          rowId,
          stream: 'stderr',
          text: formatFluxLogAutoExportFailed(loc, result.error)
        })
      } finally {
        activeExportAbort = null
      }
    })()
  }
  configureDownloadsQueueRunnerHooks({
    openDownloadedFileInHandler: (absoluteFile) => openDownloadedFileInMainHandler(absoluteFile),
    afterDownloadOpenedInMainHandler: scheduleAutoExportAfterSuccessfulYtdlpOpen,
    afterDownloadEnqueueBatch: scheduleEnqueueBatchAfterDownload
  })
  configureInspectorWindowHooks({
    getSavedInspectorBounds: () => cachedSettings.windowBounds?.inspector,
    persistInspectorBounds: (r) => patchWindowBounds({ inspector: r }),
    getDefaultInspectorMediaPath: (): string | undefined => {
      const saved = cachedSettings.lastOpenedSourcePath
      if (typeof saved !== 'string' || saved.trim().length === 0) {
        return undefined
      }
      const abs = resolve(normalize(saved.trim()))
      return existsSync(abs) ? abs : undefined
    }
  })
  registerFluxMediaProtocol()
  registerFluxHelpProtocol(() =>
    resolveKnowledgeHelpDirectory(
      buildKnowledgeHelpDirCandidates({
        cwd: process.cwd(),
        appPath: app.getAppPath(),
        resourcesPath: process.resourcesPath,
        isPackaged: app.isPackaged
      })
    )
  )
  registerDownloadsWindowIpcHandlers()
  registerInspectorWindowIpcHandlers()
  registerKnowledgeDiagnosticsIpcHandlers({
    mainDownloadsUiLocale,
    mainAppStr,
    openMainLogForUser,
    createSupportBundleWithDialog
  })
  registerSettingsIpcHandlers({
    getSettingsView: () => ({
      ...cachedSettings,
      effectiveTheme: resolveEffectiveTheme(cachedSettings.theme)
    }),
    copyCachedSettings: () => ({ ...cachedSettings }),
    isMainWindowUiPanelSender,
    ...settingsIpcPersist
  })
  registerEnginesPreviewIpcHandlers({
    mainAppStr,
    mainDownloadsUiLocale,
    ipcDownloadsUiLocale,
    getEnginePathOverrides: () => cachedSettings.engineExecutablePaths ?? {},
    getLastOpenedSourcePath: () => cachedSettings.lastOpenedSourcePath,
    buildApplicationMenu,
    previewOpenDialogOptsFromSettings,
    persistLastOpenedSource,
    resolveUserPathToPreviewSourceFile,
    ensurePreviewPlayableMedia
  })
  registerMainUtilitiesIpcHandlers({
    mainAppStr,
    mainDownloadsUiLocale,
    getEnginePathOverrides: () => cachedSettings.engineExecutablePaths ?? {},
    parseSaveTextDialogPayload,
    isExportOutputOpenMode,
    rememberExportOutputPath,
    openExportOutputPath,
    openDownloadedFileInMainHandler
  })

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('browser-window-focus', () => {
    buildApplicationMenu()
  })

  registerExportBatchIpcHandlers({
    getActiveExportAbort: () => activeExportAbort,
    setActiveExportAbort: (ac) => {
      activeExportAbort = ac
    },
    getSettings: () => cachedSettings,
    bindBatchSnapshotBroadcast: (fn) => {
      broadcastFfmpegExportBatchSnapshot = fn
    },
    launchFfmpegExportBatchRunner,
    mainAppStr,
    mainDownloadsUiLocale,
    previewOpenDialogOptsFromSettings,
    batchExportOutputFolderPickOptsFromSettings,
    rememberedExportDefaultPath,
    rememberExportOutputPath,
    rememberFfmpegExportDirectory,
    rememberedSnapshotDefaultPath,
    rememberFfmpegSnapshotDirectory,
    openExportOutputPath,
    openDownloadedFileInMainHandler,
    parseDownloadsOpenRequest
  })

  ipcMain.on(mw.logRenderer, (event, raw: unknown) => {
    if (!isMainWindowSender(event) || !consumeRendererLogToken(event.sender.id)) {
      return
    }
    logFromRendererSafe(raw)
  })

  buildApplicationMenu()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
