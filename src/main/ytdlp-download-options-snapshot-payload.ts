import { join, normalize } from 'path'

import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import {
  buildYtdlpFormatPresetChoices,
  buildYtdlpQueueRetryProfileChoices
} from '../shared/ytdlp-download-payload-locale'
import type { YtdlpDownloadOptionsPayload } from '../shared/ytdlp-download-contract'
import { buildYtdlpSpawnArgvTokens, formatArgvTokensForPreview } from './ytdlp-extra-args'
import { getYtdlpCommandHints } from './ytdlp-commands-hints'
import type { YtdlpCommandPreviewContext } from './ytdlp-download-options-preview'
import { sanitizeYtdlpPreviewUrl } from './ytdlp-download-options-preview'
import { resolveSafeYtdlpOutputPattern } from './ytdlp-download-options-validate'
import {
  YTDLP_DEFAULT_FILENAME_TEMPLATE,
  type YtdlpRunOptionsSnapshot
} from './ytdlp-download-options-snapshot-types'

export function payloadFromSnapshot(
  snap: YtdlpRunOptionsSnapshot,
  previewCtx?: YtdlpCommandPreviewContext,
  uiLocale: DownloadsWindowUiLocale = 'ru'
): YtdlpDownloadOptionsPayload {
  let outputPattern: string
  let urlArg: string
  if (
    previewCtx &&
    typeof previewCtx.outputDirectoryAbsolute === 'string' &&
    previewCtx.outputDirectoryAbsolute.trim().length > 0
  ) {
    const root = normalize(previewCtx.outputDirectoryAbsolute.trim())
    const resolved = resolveSafeYtdlpOutputPattern(root, snap.filenameTemplate)
    outputPattern = resolved ?? join(root, snap.filenameTemplate)
    urlArg =
      previewCtx.sampleUrl && previewCtx.sampleUrl.trim().length > 0
        ? sanitizeYtdlpPreviewUrl(previewCtx.sampleUrl)
        : 'https://example.com/'
  } else {
    outputPattern = `<downloadDir>/${snap.filenameTemplate}`
    urlArg = '<url>'
  }
  const argv = buildYtdlpSpawnArgvTokens({
    downloadPlaylist: snap.downloadPlaylist,
    audioOnly: snap.audioOnly,
    subtitlePreset: snap.subtitlePreset,
    subLangs: snap.subLangs,
    cookiesFile: snap.cookiesArgvFile,
    cookiesBrowser: snap.cookiesArgvBrowser,
    cookiesBrowserProfile: snap.cookiesArgvBrowserProfile,
    impersonateTarget: snap.impersonateTarget,
    rateLimit: snap.rateLimit,
    retries: snap.retries,
    fragmentRetries: snap.fragmentRetries,
    formatExtraArgs: snap.formatExtraArgs,
    extraArgs: snap.extraArgs,
    outputPattern,
    url: urlArg
  })
  const commandPreview = `yt-dlp ${formatArgvTokensForPreview(argv)}`
  const commandHints = getYtdlpCommandHints(uiLocale)
  return {
    filenameTemplate: snap.filenameTemplate,
    defaultFilenameTemplate: YTDLP_DEFAULT_FILENAME_TEMPLATE,
    formatPreset: snap.formatPreset,
    formatPresetChoices: buildYtdlpFormatPresetChoices(uiLocale),
    downloadPlaylist: snap.downloadPlaylist,
    audioOnly: snap.audioOnly,
    subtitlePreset: snap.subtitlePreset,
    subLangsLine: snap.subLangsLine,
    extraArgsLine: snap.extraArgsLine,
    commandPreview,
    extraArgsParseWarning: snap.extraArgsParseWarning,
    commandHints,
    cookiesBrowserChoice: snap.cookiesBrowserChoice,
    cookiesBrowserProfileLine: snap.cookiesBrowserProfileLine,
    cookiesFilePathStored: snap.cookiesFilePathStored,
    cookiesWarning: snap.cookiesWarning,
    impersonateChoice: snap.impersonateChoice,
    rateLimit: snap.rateLimit,
    retriesLine: snap.retriesLine,
    fragmentRetriesLine: snap.fragmentRetriesLine,
    queueRetryProfile: snap.queueRetryProfile,
    queueRetryProfileChoices: buildYtdlpQueueRetryProfileChoices(uiLocale),
    openInHandlerOnComplete: snap.openInHandlerOnComplete,
    autoExportAfterOpenInHandler: snap.autoExportAfterOpenInHandler,
    enqueueBatchOnDownloadComplete: snap.enqueueBatchOnDownloadComplete,
    autoStartBatchAfterEnqueue: snap.autoStartBatchAfterEnqueue
  }
}
