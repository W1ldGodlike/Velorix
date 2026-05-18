import { existsSync, statSync } from 'fs'
import { isAbsolute, normalize } from 'path'

import type { AppSettings } from './settings-store'
import type { AppUiLocale } from '../shared/app-ui-locale'
import { getYtdlpCliValidationCopy } from '../shared/ytdlp-cli-validation-locale'
import type { YtdlpCookiesBrowserId, YtdlpImpersonateId } from '../shared/ytdlp-download-contract'
import { parseExtraYtdlpArgsLine, validateYtdlpCookiesBrowserProfile } from './ytdlp-extra-args'
import {
  parseYtdlpCookiesBrowser,
  parseYtdlpFormatPreset,
  parseYtdlpImpersonate,
  parseYtdlpSubtitlePreset
} from '../shared/ytdlp-download-stored-parse'
import { parseYtdlpQueueRetryProfile } from './ytdlp-queue-retry'
import {
  validateFilenameTemplate,
  validateYtdlpFragmentRetriesLine,
  validateYtdlpRateLimit,
  validateYtdlpRetriesLine,
  validateYtdlpSubLangs
} from './ytdlp-download-options-validate'
import {
  formatPresetToExtraArgs,
  YTDLP_DEFAULT_FILENAME_TEMPLATE,
  type YtdlpRunOptionsSnapshot
} from './ytdlp-download-options-snapshot-types'

export function buildYtdlpRunOptionsSnapshot(
  settings: AppSettings,
  uiLocale: AppUiLocale = 'ru'
): YtdlpRunOptionsSnapshot {
  const V = getYtdlpCliValidationCopy(uiLocale)
  const preset = parseYtdlpFormatPreset(settings.ytdlpFormatPreset)
  const audioOnly = settings.ytdlpAudioOnly === true
  const subtitlePreset = parseYtdlpSubtitlePreset(settings.ytdlpSubtitlePreset)
  const subLangsStored =
    typeof settings.ytdlpSubLangs === 'string' ? settings.ytdlpSubLangs.trim() : ''
  const subLangsParsed = validateYtdlpSubLangs(subLangsStored, uiLocale)
  const subLangs =
    subtitlePreset !== 'none' && subLangsParsed.ok && subLangsParsed.value.length > 0
      ? subLangsParsed.value
      : ''
  const subLangsLine = subLangsParsed.ok ? subLangsParsed.value : ''
  const stored = settings.ytdlpFilenameTemplate
  let filenameTemplate = YTDLP_DEFAULT_FILENAME_TEMPLATE
  if (typeof stored === 'string') {
    const vt = validateFilenameTemplate(stored, uiLocale)
    if (vt.ok) {
      filenameTemplate = vt.value
    }
  }
  const extraArgsLine =
    typeof settings.ytdlpExtraArgsLine === 'string' ? settings.ytdlpExtraArgsLine.trim() : ''
  const parsedExtras = parseExtraYtdlpArgsLine(extraArgsLine, uiLocale)
  const extraArgs = parsedExtras.ok ? parsedExtras.args : []
  const extraArgsParseWarning = parsedExtras.ok ? null : parsedExtras.error

  const cookiesFileStored =
    typeof settings.ytdlpCookiesFile === 'string' ? settings.ytdlpCookiesFile.trim() : ''
  let cookiesArgvFile: string | null = null
  let cookiesWarning: string | null = null
  let cookiesFileBroken = false
  if (cookiesFileStored !== '') {
    const n = normalize(cookiesFileStored)
    if (!isAbsolute(n)) {
      cookiesFileBroken = true
      cookiesWarning = V.cookiesPathNotAbsolute
    } else if (!existsSync(n)) {
      cookiesFileBroken = true
      cookiesWarning = V.cookiesFileNotFound
    } else {
      try {
        if (!statSync(n).isFile()) {
          cookiesFileBroken = true
          cookiesWarning = V.cookiesPathNotFile
        } else {
          cookiesArgvFile = n
        }
      } catch {
        cookiesFileBroken = true
        cookiesWarning = V.cookiesStatFailed
      }
    }
  }

  const browserParsed = parseYtdlpCookiesBrowser(settings.ytdlpCookiesBrowser)
  const cookiesArgvBrowser: YtdlpCookiesBrowserId | null =
    !cookiesFileBroken && cookiesArgvFile === null && browserParsed !== undefined
      ? browserParsed
      : null
  const cookiesBrowserChoice: 'none' | YtdlpCookiesBrowserId =
    browserParsed !== undefined ? browserParsed : 'none'

  const cookiesBrowserProfileLine =
    typeof settings.ytdlpCookiesBrowserProfile === 'string'
      ? settings.ytdlpCookiesBrowserProfile
      : ''
  const cookiesProfileParsed = validateYtdlpCookiesBrowserProfile(
    cookiesBrowserProfileLine,
    uiLocale
  )
  let cookiesArgvBrowserProfile: string | null = null
  if (
    cookiesArgvBrowser !== null &&
    cookiesProfileParsed.ok &&
    cookiesProfileParsed.value.length > 0
  ) {
    cookiesArgvBrowserProfile = cookiesProfileParsed.value
  }
  if (!cookiesProfileParsed.ok && cookiesBrowserProfileLine.trim().length > 0) {
    const w = cookiesProfileParsed.error
    cookiesWarning = cookiesWarning ? `${cookiesWarning} ${w}` : w
  }

  const impersonateParsed = parseYtdlpImpersonate(settings.ytdlpImpersonate)
  const impersonateTarget: YtdlpImpersonateId | null =
    impersonateParsed !== undefined ? impersonateParsed : null
  const impersonateChoice: 'none' | YtdlpImpersonateId =
    impersonateParsed !== undefined ? impersonateParsed : 'none'

  const rateLimitStored =
    typeof settings.ytdlpRateLimit === 'string' ? settings.ytdlpRateLimit.trim() : ''
  const rateLimitParsed = validateYtdlpRateLimit(rateLimitStored, uiLocale)
  const rateLimit = rateLimitParsed.ok ? rateLimitParsed.value : ''
  const retriesParsed = validateYtdlpRetriesLine(
    typeof settings.ytdlpRetries === 'number' && Number.isInteger(settings.ytdlpRetries)
      ? String(settings.ytdlpRetries)
      : '',
    uiLocale
  )
  const retries = retriesParsed.ok ? retriesParsed.value : null
  const retriesLine = retriesParsed.ok ? retriesParsed.line : ''
  const fragmentRetriesParsed = validateYtdlpFragmentRetriesLine(
    typeof settings.ytdlpFragmentRetries === 'number' &&
      Number.isInteger(settings.ytdlpFragmentRetries)
      ? String(settings.ytdlpFragmentRetries)
      : '',
    uiLocale
  )
  const fragmentRetries = fragmentRetriesParsed.ok ? fragmentRetriesParsed.value : null
  const fragmentRetriesLine = fragmentRetriesParsed.ok ? fragmentRetriesParsed.line : ''

  const queueRetryProfile = parseYtdlpQueueRetryProfile(settings.ytdlpQueueRetryProfile)
  const openInHandlerOnComplete = settings.ytdlpOpenInHandlerOnComplete === true
  const autoExportAfterOpenInHandler = settings.ytdlpAutoExportAfterOpenInHandler === true
  const enqueueBatchOnDownloadComplete = settings.ytdlpEnqueueBatchOnDownloadComplete === true
  const autoStartBatchAfterEnqueue = settings.ytdlpAutoStartBatchAfterEnqueue === true

  return {
    filenameTemplate,
    formatPreset: preset,
    formatExtraArgs: audioOnly ? [] : formatPresetToExtraArgs(preset),
    downloadPlaylist: settings.ytdlpDownloadPlaylist === true,
    audioOnly,
    subtitlePreset,
    subLangs,
    subLangsLine,
    extraArgsLine,
    extraArgs,
    extraArgsParseWarning,
    cookiesArgvFile,
    cookiesArgvBrowser,
    cookiesArgvBrowserProfile,
    cookiesFilePathStored: cookiesFileStored,
    cookiesBrowserChoice,
    cookiesBrowserProfileLine: cookiesProfileParsed.ok
      ? cookiesProfileParsed.value
      : cookiesBrowserProfileLine.trim().slice(0, 200),
    cookiesWarning,
    impersonateTarget,
    impersonateChoice,
    rateLimit,
    retries,
    retriesLine,
    fragmentRetries,
    fragmentRetriesLine,
    queueRetryProfile,
    openInHandlerOnComplete,
    autoExportAfterOpenInHandler,
    enqueueBatchOnDownloadComplete,
    autoStartBatchAfterEnqueue
  }
}
