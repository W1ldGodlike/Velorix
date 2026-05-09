import { existsSync, statSync } from 'fs'
import { basename, dirname, isAbsolute, join, normalize, resolve } from 'path'
import { BrowserWindow, Menu, app, clipboard, dialog, ipcMain, shell } from 'electron'
import type { IpcMainEvent } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { resolveAppPaths } from './app-paths'
import { downloadEnginesWindows, isAnyEngineMissing } from './engine-download'
import {
  cancelDownloadsRunner,
  configureDownloadsQueueRunnerHooks,
  isDownloadsRunnerBusy
} from './downloads-queue-runner'
import {
  configureDownloadsWindowBoundsHooks,
  focusOrCreateDownloadsWindow,
  registerDownloadsWindowIpcHandlers
} from './downloads-window'
import {
  isDiagnosticsFolderId,
  listDiagnosticsFolders,
  openDiagnosticsFolder,
  type DiagnosticsFolderEntry
} from './diagnostics-paths'
import {
  attachProcessErrorHandlers,
  getMainLogBackupFilePath,
  getMainLogFilePath,
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
import {
  ensureFfmpegSnapshotExtension,
  parseFfmpegSnapshotFormat,
  runFfmpegSnapshotFrame
} from './ffmpeg-frame-snapshot-service'
import {
  parseFfmpegExportContainer,
  parseFfmpegExportAudioBitrate,
  parseFfmpegExportAudioMode,
  parseFfmpegExportCrf,
  parseFfmpegExportEncodePreset,
  parseFfmpegExportFps,
  parseFfmpegExportScalePreset,
  parseFfmpegExportVideoBitrate,
  ensureFfmpegExportExtension,
  runFfmpegExportJob,
  type MediaExportTrimPayload,
  type MediaExportStartResult,
  type FfmpegExportProgressPayload
} from './ffmpeg-export-service'
import { probeMediaFile } from './ffprobe-service'
import type { EngineDownloadProgress } from './engine-download'
import { setEnginePathOverridesSnapshot } from './engine-path-sync'
import {
  ENGINE_IDS,
  getEnginesStatus,
  resolveEngineExecutablePath,
  type EnginePathOverrides,
  type EnginePathOverridesPatch,
  type EnginesStatusSnapshot
} from './engine-service'
import {
  grantMediaPath,
  isGrantedMediaPath,
  registerFluxMediaPrivileges,
  registerFluxMediaProtocol
} from './media-protocol'
import { openVideoWithDialog } from './preview-dialog'
import type { AppSettings, AppTheme, WindowBoundsConfig } from './settings-store'
import { loadSettings, saveSettings } from './settings-store'
import { loadTrustedHashes, resolveTrustedHashesPath } from './trusted-hashes-store'
import { resolvePreloadOutFile } from './preload-resolve'
import { boundsFromBrowserWindow, rectifyBoundsForRestore } from './window-bounds'
import { getAppAboutInfo } from './about-info'
import {
  resolveYtdlpOutputDirectory,
  syncYtdlpDownloadDirectoryFromSettings
} from './ytdlp-download-output'
import {
  buildYtdlpRunOptionsSnapshot,
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
import { parseExtraYtdlpArgsLine } from './ytdlp-extra-args'
import { refreshYtdlpRunOptionsSnapshot } from './ytdlp-run-options-sync'
import { parseYtdlpQueueRetryProfile } from './ytdlp-queue-retry'
import { mainWindowIpc as mw } from '../shared/ipc-channels'

/** Кастомная схема для локального видеопревью; привилегии обязаны зарегистрироваться до `app.whenReady`. */
attachProcessErrorHandlers()
registerFluxMediaPrivileges()

function parseDownloadsOpenPayload(raw: unknown): string | null {
  if (raw === null || raw === undefined) {
    return null
  }
  if (typeof raw === 'string') {
    const t = raw.trim()
    return t.length > 0 ? t : null
  }
  if (typeof raw === 'object' && raw !== null && 'text' in raw) {
    const v = (raw as { text?: unknown }).text
    if (typeof v === 'string') {
      const t = v.trim()
      return t.length > 0 ? t : null
    }
  }
  return null
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

let activeExportAbort: AbortController | null = null
const grantedExportOutputPaths = new Set<string>()
const MAX_GRANTED_EXPORT_OUTPUT_PATHS = 20

/** Обход диалога §4.2 после явного подтверждения «Закрыть и прервать». */
let allowMainWindowClose = false

let mainWindowWebContentsId: number | null = null

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
  if (typeof rawPath !== 'string' || rawPath.trim().length === 0) {
    return { ok: false, error: 'Не указан файл экспорта' }
  }
  if (!isExportOutputOpenMode(rawMode)) {
    return { ok: false, error: 'Некорректное действие' }
  }
  const abs = resolve(normalize(rawPath.trim()))
  if (!grantedExportOutputPaths.has(abs)) {
    return { ok: false, error: 'Нет доступа к этому результату экспорта' }
  }
  if (!existsSync(abs)) {
    return { ok: false, error: 'Файл экспорта не найден' }
  }
  try {
    if (!statSync(abs).isFile()) {
      return { ok: false, error: 'Путь экспорта не является файлом' }
    }
  } catch {
    return { ok: false, error: 'Не удалось проверить файл экспорта' }
  }
  if (rawMode === 'folder') {
    shell.showItemInFolder(abs)
    return { ok: true, path: abs }
  }
  if (rawMode === 'preview') {
    const opened = openDownloadedFileInMainHandler(abs)
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

function parseExportTrim(raw: unknown): MediaExportTrimPayload | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined
  }
  const o = raw as Record<string, unknown>
  if (typeof o['inSec'] !== 'number' || typeof o['outSec'] !== 'number') {
    return undefined
  }
  if (!Number.isFinite(o['inSec']) || !Number.isFinite(o['outSec'])) {
    return undefined
  }
  return { inSec: o['inSec'], outSec: o['outSec'] }
}

function applyTheme(theme: AppTheme): void {
  cachedSettings = { ...cachedSettings, theme }
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

function validateEngineOverridePath(raw: string): string | null {
  const normalized = normalize(raw.trim())
  if (!isAbsolute(normalized) || normalized.length > 4096 || !existsSync(normalized)) {
    return null
  }
  try {
    return statSync(normalized).isFile() ? normalized : null
  } catch {
    return null
  }
}

function persistEnginePathOverridesPatch(patch: EnginePathOverridesPatch): AppSettings {
  const nextPaths: EnginePathOverrides = { ...(cachedSettings.engineExecutablePaths ?? {}) }
  for (const id of ENGINE_IDS) {
    if (!(id in patch)) {
      continue
    }
    const v = patch[id]
    if (v === null || v === '') {
      delete nextPaths[id]
    } else if (typeof v === 'string' && v.trim() !== '') {
      const validPath = validateEngineOverridePath(v)
      if (validPath !== null) {
        nextPaths[id] = validPath
      }
    }
  }
  const merged: AppSettings = { ...cachedSettings }
  if (Object.keys(nextPaths).length === 0) {
    delete merged.engineExecutablePaths
  } else {
    merged.engineExecutablePaths = nextPaths
  }
  cachedSettings = merged
  saveSettings(settingsPath(), cachedSettings)
  refreshEnginePathOverridesSnapshot()
  buildApplicationMenu()
  BrowserWindow.getAllWindows().forEach((w) => {
    w.webContents.send(mw.enginePathsChanged)
  })
  return { ...cachedSettings }
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
}

/** §6.2 — выбор файла Netscape cookies; взаимоисключающий с --cookies-from-browser. */
function persistYtdlpCookiesFileFromPicker(
  absPath: string
): { ok: true } | { ok: false; error: string } {
  const v = validateYtdlpCookiesFilePath(absPath)
  if (!v.ok) {
    return v
  }
  const merged: AppSettings = { ...cachedSettings }
  merged.ytdlpCookiesFile = v.path
  delete merged.ytdlpCookiesBrowser
  cachedSettings = merged
  saveSettings(settingsPath(), cachedSettings)
  refreshYtdlpRunOptionsSnapshot(cachedSettings)
  return { ok: true }
}

function persistClearYtdlpCookiesFile(): void {
  const merged: AppSettings = { ...cachedSettings }
  delete merged.ytdlpCookiesFile
  cachedSettings = merged
  saveSettings(settingsPath(), cachedSettings)
  refreshYtdlpRunOptionsSnapshot(cachedSettings)
}

/** §6.2 — шаблон `-o` и белый список `-f`; синхронно обновляет снимок для downloads-queue-runner. */
function persistYtdlpDownloadCliOptionsPatch(
  patch: YtdlpDownloadOptionsPatch
): { ok: true } | { ok: false; error: string } {
  const merged: AppSettings = { ...cachedSettings }
  if (patch.filenameTemplate !== undefined) {
    const ft = patch.filenameTemplate
    if (ft.trim() === '') {
      delete merged.ytdlpFilenameTemplate
    } else {
      const v = validateFilenameTemplate(ft)
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
      return { ok: false, error: 'Языки субтитров должны быть строкой.' }
    }
    const sv = validateYtdlpSubLangs(patch.subLangs)
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
    } else {
      merged.ytdlpCookiesBrowser = patch.cookiesBrowser
      delete merged.ytdlpCookiesFile
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
    const rv = validateYtdlpRateLimit(patch.rateLimit)
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
    const rt = validateYtdlpRetriesLine(patch.retriesLine)
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
    const frt = validateYtdlpFragmentRetriesLine(patch.fragmentRetriesLine)
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
      return { ok: false, error: 'Дополнительные аргументы должны быть строкой.' }
    }
    const trimmed = patch.extraArgsLine.trim()
    if (trimmed === '') {
      delete merged.ytdlpExtraArgsLine
    } else {
      const pe = parseExtraYtdlpArgsLine(trimmed)
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
    }
  }
  cachedSettings = merged
  saveSettings(settingsPath(), cachedSettings)
  refreshYtdlpRunOptionsSnapshot(cachedSettings)
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

/** §7.2 — пресет libx264 для экспорта; только белый список через parse. */
function persistFfmpegExportEncodePreset(raw: unknown): AppSettings {
  const id = parseFfmpegExportEncodePreset(raw)
  cachedSettings = { ...cachedSettings, ffmpegExportEncodePreset: id }
  saveSettings(settingsPath(), cachedSettings)
  return { ...cachedSettings }
}

/** §7.2 — контейнер экспорта по умолчанию; влияет на defaultPath и расширение save dialog. */
function persistFfmpegExportContainer(raw: unknown): AppSettings {
  const id = parseFfmpegExportContainer(raw)
  cachedSettings = { ...cachedSettings, ffmpegExportContainer: id }
  saveSettings(settingsPath(), cachedSettings)
  return { ...cachedSettings }
}

function persistFfmpegExportCrf(raw: unknown): AppSettings {
  const value = parseFfmpegExportCrf(raw)
  const next = { ...cachedSettings }
  if (value === null) {
    delete next.ffmpegExportCrf
  } else {
    next.ffmpegExportCrf = value
  }
  cachedSettings = next
  saveSettings(settingsPath(), cachedSettings)
  return { ...cachedSettings }
}

function persistFfmpegExportAudioBitrate(raw: unknown): AppSettings {
  const value = parseFfmpegExportAudioBitrate(raw)
  const next = { ...cachedSettings }
  if (value === null) {
    delete next.ffmpegExportAudioBitrate
  } else {
    next.ffmpegExportAudioBitrate = value
  }
  cachedSettings = next
  saveSettings(settingsPath(), cachedSettings)
  return { ...cachedSettings }
}

function persistFfmpegExportAudioMode(raw: unknown): AppSettings {
  const value = parseFfmpegExportAudioMode(raw)
  const next = { ...cachedSettings }
  if (value === 'aac') {
    delete next.ffmpegExportAudioMode
  } else {
    next.ffmpegExportAudioMode = value
  }
  cachedSettings = next
  saveSettings(settingsPath(), cachedSettings)
  return { ...cachedSettings }
}

function persistFfmpegExportVideoBitrate(raw: unknown): AppSettings {
  const value = parseFfmpegExportVideoBitrate(raw)
  const next = { ...cachedSettings }
  if (value === null) {
    delete next.ffmpegExportVideoBitrate
  } else {
    next.ffmpegExportVideoBitrate = value
  }
  cachedSettings = next
  saveSettings(settingsPath(), cachedSettings)
  return { ...cachedSettings }
}

function persistFfmpegExportFps(raw: unknown): AppSettings {
  const value = parseFfmpegExportFps(raw)
  const next = { ...cachedSettings }
  if (value === null) {
    delete next.ffmpegExportFps
  } else {
    next.ffmpegExportFps = value
  }
  cachedSettings = next
  saveSettings(settingsPath(), cachedSettings)
  return { ...cachedSettings }
}

function persistFfmpegExportScalePreset(raw: unknown): AppSettings {
  const value = parseFfmpegExportScalePreset(raw)
  const next = { ...cachedSettings }
  if (value === 'source') {
    delete next.ffmpegExportScalePreset
  } else {
    next.ffmpegExportScalePreset = value
  }
  cachedSettings = next
  saveSettings(settingsPath(), cachedSettings)
  return { ...cachedSettings }
}

function persistFfmpegSnapshotFormat(raw: unknown): AppSettings {
  const value = parseFfmpegSnapshotFormat(raw)
  const next = { ...cachedSettings }
  if (value === 'png') {
    delete next.ffmpegSnapshotFormat
  } else {
    next.ffmpegSnapshotFormat = value
  }
  cachedSettings = next
  saveSettings(settingsPath(), cachedSettings)
  return { ...cachedSettings }
}

function persistAndBroadcast(theme: AppTheme): AppSettings {
  applyTheme(theme)
  saveSettings(settingsPath(), cachedSettings)
  // Renderer подписан на событие, поэтому смена темы из меню сразу отражается во всех окнах.
  BrowserWindow.getAllWindows().forEach((w) => {
    w.webContents.send(mw.themeChanged, theme)
  })
  buildApplicationMenu()
  return cachedSettings
}

function setTheme(theme: AppTheme): AppTheme {
  persistAndBroadcast(theme)
  return theme
}

/**
 * §17/§18 — пункты «Инструменты → Открыть папку…».
 *
 * Подменю строится из whitelist `listDiagnosticsFolders`, чтобы пользователь не мог
 * через меню заставить приложение открыть произвольный путь. Если каталог уже отсутствует
 * (например, `bin` не подложен в dev), пункт остаётся видимым, но disabled. Меню пересобирается
 * при фокусе окна и после операций с путями, поэтому `enabled` не застывает на весь запуск.
 */
function buildDiagnosticsFolderSubmenu(): Electron.MenuItemConstructorOptions[] {
  const entries = listDiagnosticsFolders()
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

function supportBundleRuntimeInfo(): SupportBundleRuntimeInfo {
  const paths = resolveAppPaths()
  return {
    appVersion: app.getVersion(),
    electronVersion: process.versions.electron ?? '?',
    chromeVersion: process.versions.chrome ?? '?',
    nodeVersion: process.versions.node ?? '?',
    platform: process.platform,
    arch: process.arch,
    userData: paths.userData,
    resources: paths.resources,
    logFile: getMainLogFilePath(),
    logBackupFile: getMainLogBackupFilePath(),
    crashDumps: getCrashDumpsPathSafe()
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

async function openMainLogFile(): Promise<void> {
  const file = getMainLogFilePath()
  if (!file) {
    return
  }
  if (!existsSync(file)) {
    logInfo('diagnostics', 'main.log does not exist yet')
    return
  }
  const result = await shell.openPath(file)
  if (result.length > 0) {
    logError('diagnostics', 'open main.log failed', result)
  }
}

async function createSupportBundleWithDialog(parent?: BrowserWindow): Promise<string | null> {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const saveOptions = {
    title: 'Собрать Support ZIP',
    defaultPath: `fluxalloy-support-${stamp}.zip`,
    filters: [{ name: 'ZIP', extensions: ['zip'] }]
  }
  const result = parent
    ? await dialog.showSaveDialog(parent, saveOptions)
    : await dialog.showSaveDialog(saveOptions)
  if (result.canceled || !result.filePath) {
    return null
  }
  try {
    createSupportBundleZip(result.filePath, supportBundleRuntimeInfo())
    logInfo('diagnostics', 'support zip created', result.filePath)
    return result.filePath
  } catch (err) {
    logError('diagnostics', 'support zip failed', err)
    const messageOptions = {
      type: 'error',
      title: 'Не удалось собрать Support ZIP',
      message: 'Не удалось собрать диагностический архив.',
      detail: err instanceof Error ? err.message : String(err)
    } as const
    void (parent
      ? dialog.showMessageBox(parent, messageOptions)
      : dialog.showMessageBox(messageOptions))
    return null
  }
}

function formatProcessErrorDetails(
  kind: 'uncaughtException' | 'unhandledRejection',
  reason: unknown
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
  return [
    `Тип: ${kind}`,
    `Время: ${new Date().toISOString()}`,
    `Версия: ${app.getVersion()}`,
    `Платформа: ${process.platform}/${process.arch}`,
    '',
    body ?? String(reason)
  ].join('\n')
}

let processErrorDialogOpen = false

async function showProcessErrorDialog(
  kind: 'uncaughtException' | 'unhandledRejection',
  reason: unknown
): Promise<void> {
  if (processErrorDialogOpen || !app.isReady()) {
    return
  }
  processErrorDialogOpen = true
  const win = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0]
  const detail = formatProcessErrorDetails(kind, reason)
  const messageBoxOptions: Electron.MessageBoxOptions = {
    type: 'error',
    title: 'Ошибка FluxAlloy',
    message: 'В приложении произошла ошибка.',
    detail,
    buttons: ['Копировать детали', 'Открыть лог', 'Собрать Support ZIP', 'Закрыть'],
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
    await createSupportBundleWithDialog(win)
  }
}

function buildApplicationMenu(): void {
  const win = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0] ?? undefined
  const isMac = process.platform === 'darwin'
  const isDark = cachedSettings.theme === 'dark'

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
      label: 'Файл',
      submenu: [
        {
          label: 'Открыть…',
          accelerator: 'CmdOrCtrl+O',
          click: async (): Promise<void> => {
            const target = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0]
            if (!target || target.isDestroyed()) {
              return
            }
            const result = await openVideoWithDialog(target)
            if (!result.ok) {
              return
            }
            persistLastOpenedSource(result.path)
            target.webContents.send(mw.previewOpened, result)
          }
        },
        {
          label: 'Менеджер загрузок (yt-dlp)…',
          accelerator: 'CmdOrCtrl+Shift+Y',
          click: (): void => {
            focusOrCreateDownloadsWindow(undefined)
          }
        },
        {
          label: 'Вставить URL из буфера в менеджер…',
          accelerator: 'CmdOrCtrl+Shift+V',
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
      label: 'Настройки',
      submenu: [
        {
          label: 'Пути к движкам…',
          click: (): void => {
            const target = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0]
            if (!target || target.isDestroyed()) {
              return
            }
            target.webContents.send(mw.openEnginePaths)
          }
        }
      ]
    },
    {
      label: 'Инструменты',
      submenu: [
        {
          label: 'Открыть папку…',
          submenu: buildDiagnosticsFolderSubmenu()
        },
        {
          label: 'Открыть main.log',
          click: (): void => {
            void openMainLogFile()
          }
        },
        {
          label: 'Собрать Support ZIP…',
          click: (): void => {
            const target = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0]
            void createSupportBundleWithDialog(target && !target.isDestroyed() ? target : undefined)
          }
        }
      ]
    },
    {
      label: 'Вид',
      submenu: [
        {
          label: 'Тема',
          submenu: [
            {
              label: 'Тёмная',
              type: 'radio',
              checked: isDark,
              click: (): void => {
                void setTheme('dark')
              }
            },
            {
              label: 'Светлая',
              type: 'radio',
              checked: !isDark,
              click: (): void => {
                void setTheme('light')
              }
            }
          ]
        }
      ]
    },
    {
      label: 'Справка',
      submenu: [
        {
          label: 'О программе FluxAlloy…',
          click: (): void => {
            const target = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0]
            if (!target || target.isDestroyed()) {
              return
            }
            target.webContents.send(mw.openAbout)
          }
        },
        {
          label: 'Документация FluxAlloy (ТЗ)',
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

  const mainWindow = new BrowserWindow({
    width: rect?.width ?? 1200,
    height: rect?.height ?? 800,
    minWidth: 400,
    minHeight: 320,
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
    const msg =
      exportBusy && downloadsBusy
        ? 'Идёт экспорт видео и активная загрузка yt-dlp. Закрыть приложение и прервать задачи?'
        : exportBusy
          ? 'Идёт экспорт видео. Закрыть приложение и прервать экспорт?'
          : 'Идёт активная загрузка yt-dlp. Закрыть приложение и прервать загрузку?'

    void dialog
      .showMessageBox(mainWindow, {
        type: 'warning',
        buttons: ['Остаться', 'Закрыть и прервать'],
        defaultId: 0,
        cancelId: 0,
        title: 'FluxAlloy',
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
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function openDownloadedFileInMainHandler(
  absoluteFile: string
): { ok: true } | { ok: false; error: string } {
  const mediaUrl = grantMediaPath(absoluteFile)
  if (!mediaUrl) {
    return { ok: false, error: 'Нельзя открыть этот файл в предпросмотре.' }
  }
  const target =
    mainWindowWebContentsId === null
      ? null
      : BrowserWindow.getAllWindows().find((w) => w.webContents.id === mainWindowWebContentsId)
  if (!target || target.isDestroyed()) {
    return { ok: false, error: 'Главное окно FluxAlloy не найдено.' }
  }
  persistLastOpenedSource(absoluteFile)
  target.show()
  target.focus()
  target.webContents.send(mw.previewOpened, {
    ok: true,
    path: absoluteFile,
    mediaUrl,
    name: basename(absoluteFile)
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
  refreshEnginePathOverridesSnapshot()
  syncYtdlpDownloadDirectoryFromSettings(cachedSettings.ytdlpDownloadDirectory)
  refreshYtdlpRunOptionsSnapshot(cachedSettings)
  configureDownloadsWindowBoundsHooks({
    getSavedDownloadsBounds: () => cachedSettings.windowBounds?.downloads,
    persistDownloadsBounds: (r) => {
      patchWindowBounds({ downloads: r })
    },
    pickYtdlpOutputDirectory: async (win: BrowserWindow) => {
      const result = await dialog.showOpenDialog(win, {
        properties: ['openDirectory', 'createDirectory'],
        title: 'Каталог загрузок yt-dlp'
      })
      if (result.canceled || result.filePaths.length === 0 || !result.filePaths[0]) {
        return { ok: false, cancelled: true }
      }
      const picked = normalize(result.filePaths[0])
      if (!isAbsolute(picked)) {
        return { ok: false, error: 'Нужен абсолютный путь к каталогу' }
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
      const result = await dialog.showOpenDialog(win, {
        properties: ['openFile'],
        title: 'Файл cookies для yt-dlp (формат Netscape)',
        filters: [
          { name: 'Текстовые файлы', extensions: ['txt'] },
          { name: 'Все файлы', extensions: ['*'] }
        ]
      })
      if (result.canceled || result.filePaths.length === 0 || !result.filePaths[0]) {
        return { ok: false, cancelled: true }
      }
      const picked = normalize(result.filePaths[0])
      if (!isAbsolute(picked)) {
        return { ok: false, error: 'Нужен абсолютный путь к файлу' }
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
    getYtdlpDownloadCliOptions: () =>
      payloadFromSnapshot(buildYtdlpRunOptionsSnapshot(cachedSettings)),
    applyYtdlpDownloadCliPatch: (patch) => persistYtdlpDownloadCliOptionsPatch(patch),
    openDownloadedFileInHandler: (absoluteFile) => openDownloadedFileInMainHandler(absoluteFile)
  })
  configureDownloadsQueueRunnerHooks({
    openDownloadedFileInHandler: (absoluteFile) => openDownloadedFileInMainHandler(absoluteFile)
  })
  registerFluxMediaProtocol()
  registerDownloadsWindowIpcHandlers()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('browser-window-focus', () => {
    buildApplicationMenu()
  })

  // IPC-каналы держим узкими: renderer просит только конкретные операции, без произвольного доступа к Node.
  ipcMain.handle(mw.settingsGet, (): AppSettings => {
    return { ...cachedSettings }
  })

  ipcMain.handle(mw.settingsSetTheme, (_, theme: unknown): AppSettings => {
    const next = theme === 'light' ? 'light' : 'dark'
    return persistAndBroadcast(next)
  })

  ipcMain.handle(
    mw.settingsSetFfmpegExportEncodePreset,
    (_, raw: unknown): AppSettings => persistFfmpegExportEncodePreset(raw)
  )

  ipcMain.handle(
    mw.settingsSetFfmpegExportContainer,
    (_, raw: unknown): AppSettings => persistFfmpegExportContainer(raw)
  )

  ipcMain.handle(
    mw.settingsSetFfmpegExportCrf,
    (_, raw: unknown): AppSettings => persistFfmpegExportCrf(raw)
  )

  ipcMain.handle(
    mw.settingsSetFfmpegExportAudioBitrate,
    (_, raw: unknown): AppSettings => persistFfmpegExportAudioBitrate(raw)
  )

  ipcMain.handle(
    mw.settingsSetFfmpegExportAudioMode,
    (_, raw: unknown): AppSettings => persistFfmpegExportAudioMode(raw)
  )

  ipcMain.handle(
    mw.settingsSetFfmpegExportVideoBitrate,
    (_, raw: unknown): AppSettings => persistFfmpegExportVideoBitrate(raw)
  )

  ipcMain.handle(
    mw.settingsSetFfmpegExportFps,
    (_, raw: unknown): AppSettings => persistFfmpegExportFps(raw)
  )

  ipcMain.handle(
    mw.settingsSetFfmpegExportScalePreset,
    (_, raw: unknown): AppSettings => persistFfmpegExportScalePreset(raw)
  )

  ipcMain.handle(
    mw.settingsSetFfmpegSnapshotFormat,
    (_, raw: unknown): AppSettings => persistFfmpegSnapshotFormat(raw)
  )

  ipcMain.handle(mw.settingsSetEnginePaths, (_, patch: unknown): AppSettings => {
    if (!patch || typeof patch !== 'object') {
      return { ...cachedSettings }
    }
    return persistEnginePathOverridesPatch(patch as EnginePathOverridesPatch)
  })

  ipcMain.handle(
    mw.pickEngineExecutable,
    async (event, engineId: unknown): Promise<string | null> => {
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) {
        return null
      }
      const id =
        engineId === 'ffmpeg' || engineId === 'ffprobe' || engineId === 'yt-dlp' ? engineId : null
      if (!id) {
        return null
      }
      const result = await dialog.showOpenDialog(win, {
        title: `Выберите исполняемый файл: ${id}`,
        properties: ['openFile'],
        filters:
          process.platform === 'win32'
            ? [
                { name: 'Исполняемые файлы', extensions: ['exe'] },
                { name: 'Все файлы', extensions: ['*'] }
              ]
            : [{ name: 'Все файлы', extensions: ['*'] }]
      })
      if (result.canceled || result.filePaths.length === 0) {
        return null
      }
      return result.filePaths[0] ?? null
    }
  )

  ipcMain.handle(mw.enginesStatus, async (): Promise<EnginesStatusSnapshot> => {
    return getEnginesStatus(resolveAppPaths(), cachedSettings.engineExecutablePaths)
  })

  ipcMain.handle(mw.enginesShouldOfferDownload, (): boolean => {
    return isAnyEngineMissing(resolveAppPaths(), cachedSettings.engineExecutablePaths)
  })

  ipcMain.handle(
    mw.enginesDownload,
    async (event): Promise<{ ok: true } | { ok: false; error: string }> => {
      const win = BrowserWindow.fromWebContents(event.sender)
      const paths = resolveAppPaths()
      const trusted = loadTrustedHashes(resolveTrustedHashesPath())
      try {
        await downloadEnginesWindows(paths, trusted, (p: EngineDownloadProgress) => {
          win?.webContents.send(mw.enginesProgress, p)
        })
        buildApplicationMenu()
        return { ok: true }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error)
        return { ok: false, error: msg }
      }
    }
  )

  ipcMain.handle(mw.openVideoDialog, async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) {
      return { ok: false, error: 'Нет активного окна' }
    }
    const result = await openVideoWithDialog(win)
    if (result.ok) {
      persistLastOpenedSource(result.path)
    }
    return result
  })

  ipcMain.handle(mw.previewGrantPath, (_, rawPath: unknown) => {
    if (typeof rawPath !== 'string' || rawPath.length === 0) {
      return { ok: false, error: 'Пустой путь' }
    }
    const mediaUrl = grantMediaPath(rawPath)
    if (!mediaUrl) {
      return { ok: false, error: 'Не удалось открыть файл' }
    }
    persistLastOpenedSource(rawPath)
    return {
      ok: true,
      path: rawPath,
      mediaUrl,
      name: basename(rawPath)
    }
  })

  ipcMain.handle(mw.persistLastSource, (_, raw: unknown) => {
    if (raw === null || raw === undefined || raw === '') {
      persistLastOpenedSource(null)
      return
    }
    if (typeof raw === 'string') {
      persistLastOpenedSource(raw)
    }
  })

  ipcMain.handle(mw.restoreLastSource, () => {
    const saved = cachedSettings.lastOpenedSourcePath
    if (typeof saved !== 'string' || saved.trim().length === 0 || !existsSync(saved)) {
      return null
    }
    const mediaUrl = grantMediaPath(saved.trim())
    if (!mediaUrl) {
      persistLastOpenedSource(null)
      return null
    }
    return {
      path: saved.trim(),
      mediaUrl,
      name: basename(saved.trim())
    }
  })

  ipcMain.handle(mw.mediaProbe, async (_, rawPath: unknown) => {
    if (typeof rawPath !== 'string' || rawPath.trim().length === 0) {
      return { ok: false as const, error: 'Не указан путь к медиафайлу' }
    }
    const abs = resolve(normalize(rawPath.trim()))
    if (!isGrantedMediaPath(abs)) {
      return {
        ok: false as const,
        error: 'Нет доступа к этому пути для анализа (сначала откройте файл в превью).'
      }
    }
    return probeMediaFile(resolveAppPaths(), abs, cachedSettings.engineExecutablePaths)
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

  ipcMain.handle(mw.appAboutInfo, () => getAppAboutInfo())

  ipcMain.handle(mw.diagnosticsListFolders, (): DiagnosticsFolderEntry[] => {
    return listDiagnosticsFolders()
  })

  ipcMain.handle(
    mw.diagnosticsOpenFolder,
    async (
      _event,
      raw: unknown
    ): Promise<{ ok: true; path: string } | { ok: false; error: string }> => {
      if (!isDiagnosticsFolderId(raw)) {
        return { ok: false, error: 'Неизвестный каталог' }
      }
      return openDiagnosticsFolder(raw)
    }
  )

  ipcMain.handle(mw.openDownloadsWindow, (_, raw: unknown) => {
    const payload = parseDownloadsOpenPayload(raw)
    focusOrCreateDownloadsWindow(payload ?? undefined)
  })

  ipcMain.handle(mw.exportStart, async (event, raw: unknown): Promise<MediaExportStartResult> => {
    if (activeExportAbort !== null) {
      return { ok: false, error: 'Уже выполняется экспорт' }
    }
    if (!raw || typeof raw !== 'object') {
      return { ok: false, error: 'Некорректный запрос' }
    }
    const inputRaw = (raw as { inputPath?: unknown }).inputPath
    if (typeof inputRaw !== 'string' || inputRaw.trim().length === 0) {
      return { ok: false, error: 'Не указан входной файл' }
    }
    const abs = resolve(normalize(inputRaw.trim()))
    if (!existsSync(abs)) {
      return { ok: false, error: 'Файл не найден' }
    }
    if (!isGrantedMediaPath(abs)) {
      return {
        ok: false,
        error: 'Нет доступа к этому файлу — откройте его через превью.'
      }
    }

    const pd = (raw as { probeDurationSec?: unknown }).probeDurationSec
    const probeDurationSec = typeof pd === 'number' && Number.isFinite(pd) && pd > 0 ? pd : null

    const trim = parseExportTrim((raw as { trim?: unknown }).trim)

    const encodePresetRaw = (raw as { encodePreset?: unknown }).encodePreset
    const encodePreset =
      encodePresetRaw !== undefined && encodePresetRaw !== null
        ? parseFfmpegExportEncodePreset(encodePresetRaw)
        : parseFfmpegExportEncodePreset(cachedSettings.ffmpegExportEncodePreset)
    const containerRaw = (raw as { container?: unknown }).container
    const exportContainer =
      containerRaw !== undefined && containerRaw !== null
        ? parseFfmpegExportContainer(containerRaw)
        : parseFfmpegExportContainer(cachedSettings.ffmpegExportContainer)
    const crfRaw = (raw as { crf?: unknown }).crf
    const exportCrf =
      crfRaw !== undefined && crfRaw !== null
        ? parseFfmpegExportCrf(crfRaw)
        : parseFfmpegExportCrf(cachedSettings.ffmpegExportCrf)
    const videoBitrateRaw = (raw as { videoBitrate?: unknown }).videoBitrate
    const exportVideoBitrate =
      videoBitrateRaw !== undefined && videoBitrateRaw !== null
        ? parseFfmpegExportVideoBitrate(videoBitrateRaw)
        : parseFfmpegExportVideoBitrate(cachedSettings.ffmpegExportVideoBitrate)
    const audioModeRaw = (raw as { audioMode?: unknown }).audioMode
    const exportAudioMode =
      audioModeRaw !== undefined && audioModeRaw !== null
        ? parseFfmpegExportAudioMode(audioModeRaw)
        : parseFfmpegExportAudioMode(cachedSettings.ffmpegExportAudioMode)
    const audioBitrateRaw = (raw as { audioBitrate?: unknown }).audioBitrate
    const exportAudioBitrate =
      audioBitrateRaw !== undefined && audioBitrateRaw !== null
        ? parseFfmpegExportAudioBitrate(audioBitrateRaw)
        : parseFfmpegExportAudioBitrate(cachedSettings.ffmpegExportAudioBitrate)
    const fpsRaw = (raw as { fps?: unknown }).fps
    const exportFps =
      fpsRaw !== undefined && fpsRaw !== null
        ? parseFfmpegExportFps(fpsRaw)
        : parseFfmpegExportFps(cachedSettings.ffmpegExportFps)
    const scalePresetRaw = (raw as { scalePreset?: unknown }).scalePreset
    const exportScalePreset =
      scalePresetRaw !== undefined && scalePresetRaw !== null
        ? parseFfmpegExportScalePreset(scalePresetRaw)
        : parseFfmpegExportScalePreset(cachedSettings.ffmpegExportScalePreset)

    const paths = resolveAppPaths()
    const ffmpeg = resolveEngineExecutablePath(
      paths,
      'ffmpeg',
      cachedSettings.engineExecutablePaths
    )
    if (!ffmpeg) {
      return { ok: false, error: 'ffmpeg не найден — установите движки.' }
    }

    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) {
      return { ok: false, error: 'Нет активного окна' }
    }

    const stem = basename(abs).replace(/\.[^.]+$/, '')
    const defaultExportName = `${stem}-export.${exportContainer}`
    const pick = await dialog.showSaveDialog(win, {
      title: 'Экспорт видео',
      defaultPath: rememberedExportDefaultPath(defaultExportName),
      filters: [
        { name: 'MP4', extensions: ['mp4'] },
        { name: 'Matroska', extensions: ['mkv'] },
        { name: 'QuickTime', extensions: ['mov'] },
        { name: 'Все файлы', extensions: ['*'] }
      ]
    })

    if (pick.canceled || !pick.filePath || pick.filePath.trim().length === 0) {
      return { ok: false, cancelled: true }
    }

    const outPath = ensureFfmpegExportExtension(pick.filePath, exportContainer)
    const ac = new AbortController()
    activeExportAbort = ac

    const pushProgress = (p: FfmpegExportProgressPayload): void => {
      win.webContents.send(mw.exportProgress, p)
    }

    try {
      pushProgress({ percent: -1, message: 'Запуск ffmpeg…' })
      const result = await runFfmpegExportJob({
        ffmpegPath: ffmpeg,
        inputPath: abs,
        outputPath: outPath,
        ...(trim !== undefined ? { trim } : {}),
        probeDurationSec,
        encodePreset,
        crf: exportCrf,
        videoBitrate: exportVideoBitrate,
        audioMode: exportAudioMode,
        audioBitrate: exportAudioBitrate,
        fps: exportFps,
        scalePreset: exportScalePreset,
        signal: ac.signal,
        onProgress: pushProgress
      })
      if (result.ok) {
        rememberExportOutputPath(outPath)
        rememberFfmpegExportDirectory(outPath)
        return { ok: true, path: outPath }
      }
      if (result.error === 'Экспорт отменён') {
        return { ok: false, cancelled: true }
      }
      return { ok: false, error: result.error }
    } finally {
      activeExportAbort = null
    }
  })

  ipcMain.handle(mw.exportCancel, (): { ok: true } | { ok: false; error: string } => {
    if (activeExportAbort === null) {
      return { ok: false, error: 'Нет активного экспорта' }
    }
    activeExportAbort.abort()
    return { ok: true }
  })

  ipcMain.handle(
    mw.exportOpenOutput,
    async (
      _event,
      raw: unknown
    ): Promise<{ ok: true; path: string } | { ok: false; error: string }> => {
      if (!raw || typeof raw !== 'object') {
        return { ok: false, error: 'Некорректный запрос' }
      }
      const payload = raw as { path?: unknown; mode?: unknown }
      return openExportOutputPath(payload.path, payload.mode)
    }
  )

  ipcMain.handle(
    mw.snapshotFrame,
    async (
      event,
      raw: unknown
    ): Promise<
      { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
    > => {
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) {
        return { ok: false, error: 'Нет активного окна' }
      }
      if (!raw || typeof raw !== 'object') {
        return { ok: false, error: 'Некорректный запрос' }
      }
      const inputRaw = (raw as { inputPath?: unknown }).inputPath
      const timeRaw = (raw as { timeSec?: unknown }).timeSec
      if (typeof inputRaw !== 'string' || inputRaw.trim().length === 0) {
        return { ok: false, error: 'Не указан входной файл' }
      }
      const abs = resolve(normalize(inputRaw.trim()))
      if (!existsSync(abs)) {
        return { ok: false, error: 'Файл не найден' }
      }
      if (!isGrantedMediaPath(abs)) {
        return { ok: false, error: 'Нет доступа к файлу — откройте его через превью.' }
      }
      const timeSec =
        typeof timeRaw === 'number' && Number.isFinite(timeRaw) ? Math.max(0, timeRaw) : 0

      const paths = resolveAppPaths()
      const ffmpeg = resolveEngineExecutablePath(
        paths,
        'ffmpeg',
        cachedSettings.engineExecutablePaths
      )
      if (!ffmpeg) {
        return { ok: false, error: 'ffmpeg не найден — установите движки.' }
      }

      const stem = basename(abs).replace(/\.[^.]+$/, '')
      const snapshotFormat = parseFfmpegSnapshotFormat(cachedSettings.ffmpegSnapshotFormat)
      const pick = await dialog.showSaveDialog(win, {
        title: 'Сохранить кадр',
        defaultPath: rememberedSnapshotDefaultPath(`${stem}-frame.${snapshotFormat}`),
        filters: [
          { name: 'PNG', extensions: ['png'] },
          { name: 'JPEG', extensions: ['jpg', 'jpeg'] }
        ]
      })

      if (pick.canceled || !pick.filePath || pick.filePath.trim().length === 0) {
        return { ok: false, cancelled: true }
      }

      const outPath = ensureFfmpegSnapshotExtension(pick.filePath, snapshotFormat)
      const result = await runFfmpegSnapshotFrame({
        ffmpegPath: ffmpeg,
        inputPath: abs,
        outputPath: outPath,
        timeSec
      })
      if (result.ok) {
        rememberExportOutputPath(outPath)
        rememberFfmpegSnapshotDirectory(outPath)
        return { ok: true, path: outPath }
      }
      return result
    }
  )

  ipcMain.on('ping', () => logInfo('ipc', 'ping'))

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
