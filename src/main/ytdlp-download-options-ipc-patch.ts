import type { DownloadsWindowIpcStrings } from '../shared/downloads-window-ipc-locale'
import type { AppUiLocale } from '../shared/app-ui-locale'
import {
  parseYtdlpCookiesBrowser,
  parseYtdlpFormatPreset,
  parseYtdlpImpersonate,
  parseYtdlpSubtitlePreset,
  type YtdlpDownloadOptionsPatch
} from './ytdlp-download-options'
import { validateYtdlpCookiesBrowserProfile } from './ytdlp-extra-args'
import { parseYtdlpQueueRetryProfile } from './ytdlp-queue-retry'

export function parseYtdlpDownloadOptionsIpcPatch(
  raw: unknown,
  P: DownloadsWindowIpcStrings,
  loc: AppUiLocale
): { ok: true; patch: YtdlpDownloadOptionsPatch } | { ok: false; error: string } {
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
  return { ok: true, patch }
}
