import { BrowserWindow, ipcMain, shell } from 'electron'

import { resolveAppPaths } from './app-paths'
import {
  isYtdlpDownloadDirectoryDefault,
  resolveYtdlpOutputDirectory
} from './ytdlp-download-output'
import {
  parseYtdlpCookiesBrowser,
  parseYtdlpFormatPreset,
  parseYtdlpImpersonate,
  parseYtdlpSubtitlePreset,
  type YtdlpDownloadOptionsPatch,
  type YtdlpDownloadOptionsPayload
} from './ytdlp-download-options'
import { validateYtdlpCookiesBrowserProfile } from './ytdlp-extra-args'
import { parseYtdlpQueueRetryProfile } from './ytdlp-queue-retry'
import { downloadsIpc as d } from '../shared/ipc-channels'
import {
  getDownloadsBoundsHooks,
  ipcStr,
  ipcUiLocale,
  isDownloadsOrMainSender
} from './downloads-window-runtime'

export function registerDownloadsOptionsIpcHandlers(): void {
  ipcMain.handle(
    d.getOutputDir,
    (
      event
    ): {
      path: string
      isDefault: boolean
    } => {
      if (!isDownloadsOrMainSender(event.sender)) {
        return { path: '', isDefault: true }
      }
      const paths = resolveAppPaths()
      return {
        path: resolveYtdlpOutputDirectory(paths.userData),
        isDefault: isYtdlpDownloadDirectoryDefault()
      }
    }
  )

  ipcMain.handle(
    d.openOutputDir,
    async (event): Promise<{ ok: true } | { ok: false; error: string }> => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      const paths = resolveAppPaths()
      const target = resolveYtdlpOutputDirectory(paths.userData)
      const result = await shell.openPath(target)
      return result.length === 0 ? { ok: true } : { ok: false, error: result }
    }
  )

  ipcMain.handle(
    d.getCliOptions,
    (
      event,
      raw?: unknown
    ): { ok: true; payload: YtdlpDownloadOptionsPayload } | { ok: false; error: string } => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      const fn = getDownloadsBoundsHooks().getYtdlpDownloadCliOptions
      if (!fn) {
        return { ok: false, error: P.ytdlpOptionsNotConnected }
      }
      return { ok: true, payload: fn(raw, ipcUiLocale(event.sender)) }
    }
  )

  ipcMain.handle(
    d.setCliOptions,
    (event, raw: unknown): { ok: true } | { ok: false; error: string } => {
      const P = ipcStr(event.sender)
      const loc = ipcUiLocale(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      const fn = getDownloadsBoundsHooks().applyYtdlpDownloadCliPatch
      if (!fn) {
        return { ok: false, error: P.ytdlpOptionsNotConnected }
      }
      if (!raw || typeof raw !== 'object') {
        return { ok: false, error: P.invalidData }
      }
      const o = raw as Record<string, unknown>
      const patch: YtdlpDownloadOptionsPatch = {}
      if (Object.prototype.hasOwnProperty.call(o, 'filenameTemplate')) {
        if (typeof o['filenameTemplate'] !== 'string') {
          return { ok: false, error: P.filenameTemplateMustBeString }
        }
        patch.filenameTemplate = o['filenameTemplate']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'formatPreset')) {
        patch.formatPreset = parseYtdlpFormatPreset(o['formatPreset'])
      }
      if (Object.prototype.hasOwnProperty.call(o, 'downloadPlaylist')) {
        if (typeof o['downloadPlaylist'] !== 'boolean') {
          return { ok: false, error: P.playlistMustBeBoolean }
        }
        patch.downloadPlaylist = o['downloadPlaylist']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'audioOnly')) {
        if (typeof o['audioOnly'] !== 'boolean') {
          return { ok: false, error: P.audioOnlyMustBeBoolean }
        }
        patch.audioOnly = o['audioOnly']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'subtitlePreset')) {
        patch.subtitlePreset = parseYtdlpSubtitlePreset(o['subtitlePreset'])
      }
      if (Object.prototype.hasOwnProperty.call(o, 'subLangs')) {
        if (typeof o['subLangs'] !== 'string') {
          return { ok: false, error: P.subLangsMustBeString }
        }
        patch.subLangs = o['subLangs']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'cookiesBrowser')) {
        if (typeof o['cookiesBrowser'] !== 'string') {
          return { ok: false, error: P.cookiesBrowserMustBeString }
        }
        const cv = o['cookiesBrowser']
        if (cv === 'none') {
          patch.cookiesBrowser = 'none'
        } else {
          const b = parseYtdlpCookiesBrowser(cv)
          if (!b) {
            return { ok: false, error: P.invalidCookiesBrowserValue }
          }
          patch.cookiesBrowser = b
        }
      }
      if (Object.prototype.hasOwnProperty.call(o, 'cookiesBrowserProfile')) {
        if (typeof o['cookiesBrowserProfile'] !== 'string') {
          return { ok: false, error: P.cookiesBrowserProfileMustBeString }
        }
        const pr = validateYtdlpCookiesBrowserProfile(o['cookiesBrowserProfile'], loc)
        if (!pr.ok) {
          return { ok: false, error: pr.error }
        }
        patch.cookiesBrowserProfile = pr.value
      }
      if (Object.prototype.hasOwnProperty.call(o, 'impersonate')) {
        if (typeof o['impersonate'] !== 'string') {
          return { ok: false, error: P.impersonateMustBeString }
        }
        const iv = o['impersonate']
        if (iv === 'none') {
          patch.impersonate = 'none'
        } else {
          const im = parseYtdlpImpersonate(iv)
          if (!im) {
            return { ok: false, error: P.invalidImpersonateValue }
          }
          patch.impersonate = im
        }
      }
      if (Object.prototype.hasOwnProperty.call(o, 'rateLimit')) {
        if (typeof o['rateLimit'] !== 'string') {
          return { ok: false, error: P.rateLimitMustBeString }
        }
        patch.rateLimit = o['rateLimit']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'retriesLine')) {
        if (typeof o['retriesLine'] !== 'string') {
          return { ok: false, error: P.retriesMustBeString }
        }
        patch.retriesLine = o['retriesLine']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'fragmentRetriesLine')) {
        if (typeof o['fragmentRetriesLine'] !== 'string') {
          return { ok: false, error: P.fragmentRetriesMustBeString }
        }
        patch.fragmentRetriesLine = o['fragmentRetriesLine']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'extraArgsLine')) {
        if (typeof o['extraArgsLine'] !== 'string') {
          return { ok: false, error: P.extraArgsMustBeString }
        }
        patch.extraArgsLine = o['extraArgsLine']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'queueRetryProfile')) {
        patch.queueRetryProfile = parseYtdlpQueueRetryProfile(o['queueRetryProfile'])
      }
      if (Object.prototype.hasOwnProperty.call(o, 'openInHandlerOnComplete')) {
        if (typeof o['openInHandlerOnComplete'] !== 'boolean') {
          return { ok: false, error: P.openInHandlerFlagMustBeBoolean }
        }
        patch.openInHandlerOnComplete = o['openInHandlerOnComplete']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'autoExportAfterOpenInHandler')) {
        if (typeof o['autoExportAfterOpenInHandler'] !== 'boolean') {
          return { ok: false, error: P.autoExportFlagMustBeBoolean }
        }
        patch.autoExportAfterOpenInHandler = o['autoExportAfterOpenInHandler']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'enqueueBatchOnDownloadComplete')) {
        if (typeof o['enqueueBatchOnDownloadComplete'] !== 'boolean') {
          return { ok: false, error: P.enqueueBatchFlagMustBeBoolean }
        }
        patch.enqueueBatchOnDownloadComplete = o['enqueueBatchOnDownloadComplete']
      }
      if (Object.prototype.hasOwnProperty.call(o, 'autoStartBatchAfterEnqueue')) {
        if (typeof o['autoStartBatchAfterEnqueue'] !== 'boolean') {
          return { ok: false, error: P.autoStartBatchFlagMustBeBoolean }
        }
        patch.autoStartBatchAfterEnqueue = o['autoStartBatchAfterEnqueue']
      }
      if (
        patch.filenameTemplate === undefined &&
        patch.formatPreset === undefined &&
        patch.downloadPlaylist === undefined &&
        patch.audioOnly === undefined &&
        patch.subtitlePreset === undefined &&
        patch.subLangs === undefined &&
        patch.cookiesBrowser === undefined &&
        patch.cookiesBrowserProfile === undefined &&
        patch.impersonate === undefined &&
        patch.rateLimit === undefined &&
        patch.retriesLine === undefined &&
        patch.fragmentRetriesLine === undefined &&
        patch.extraArgsLine === undefined &&
        patch.queueRetryProfile === undefined &&
        patch.openInHandlerOnComplete === undefined &&
        patch.autoExportAfterOpenInHandler === undefined &&
        patch.enqueueBatchOnDownloadComplete === undefined &&
        patch.autoStartBatchAfterEnqueue === undefined
      ) {
        return { ok: false, error: P.nothingToSave }
      }
      return fn(patch, loc)
    }
  )

  ipcMain.handle(
    d.pickOutputDir,
    async (
      event
    ): Promise<
      { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
    > => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      const fn = getDownloadsBoundsHooks().pickYtdlpOutputDirectory
      if (!fn) {
        return { ok: false, error: P.pickDirectoryNotConnected }
      }
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win || win.isDestroyed()) {
        return { ok: false, error: P.noWindow }
      }
      return fn(win)
    }
  )

  ipcMain.handle(d.clearOutputDir, (event): { ok: true } | { ok: false; error: string } => {
    const P = ipcStr(event.sender)
    if (!isDownloadsOrMainSender(event.sender)) {
      return { ok: false, error: P.invalidSender }
    }
    const fn = getDownloadsBoundsHooks().clearYtdlpOutputDirectoryOverride
    if (!fn) {
      return { ok: false, error: P.clearDirectoryNotConnected }
    }
    fn()
    return { ok: true }
  })

  ipcMain.handle(
    d.pickCookiesFile,
    async (
      event
    ): Promise<
      { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
    > => {
      const P = ipcStr(event.sender)
      if (!isDownloadsOrMainSender(event.sender)) {
        return { ok: false, error: P.invalidSender }
      }
      const fn = getDownloadsBoundsHooks().pickYtdlpCookiesFile
      if (!fn) {
        return { ok: false, error: P.pickCookiesNotConnected }
      }
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win || win.isDestroyed()) {
        return { ok: false, error: P.noWindow }
      }
      return fn(win)
    }
  )

  ipcMain.handle(d.clearCookiesFile, (event): { ok: true } | { ok: false; error: string } => {
    const P = ipcStr(event.sender)
    if (!isDownloadsOrMainSender(event.sender)) {
      return { ok: false, error: P.invalidSender }
    }
    const fn = getDownloadsBoundsHooks().clearYtdlpCookiesFile
    if (!fn) {
      return { ok: false, error: P.clearCookiesNotConnected }
    }
    fn()
    return { ok: true }
  })
}
