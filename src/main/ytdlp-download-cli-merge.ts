import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import { getYtdlpCliValidationCopy } from '../shared/ytdlp-cli-validation-locale'
import { parseExtraYtdlpArgsLine, validateYtdlpCookiesBrowserProfile } from './ytdlp-extra-args'
import {
  parseYtdlpSubtitlePreset,
  validateFilenameTemplate,
  validateYtdlpRateLimit,
  validateYtdlpFragmentRetriesLine,
  validateYtdlpRetriesLine,
  validateYtdlpSubLangs,
  type YtdlpDownloadOptionsPatch
} from './ytdlp-download-options'
import { parseYtdlpQueueRetryProfile } from './ytdlp-queue-retry'
import type { AppSettings } from './settings-store'

/**
 * §6.2 — слияние патча CLI yt-dlp с базовыми настройками без записи на диск;
 * используется при сохранении и для черновика превью argv §6.3.
 */
export function mergeYtdlpDownloadCliPatchOntoSettings(
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
