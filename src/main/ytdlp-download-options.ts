export type {
  YtdlpCommandHintEntry,
  YtdlpCookiesBrowserId,
  YtdlpDownloadOptionsPatch,
  YtdlpDownloadOptionsPayload,
  YtdlpFormatPresetId,
  YtdlpImpersonateId,
  YtdlpQueueRetryProfileId,
  YtdlpSubtitlePresetId
} from '../shared/ytdlp-download-contract'

export {
  parseYtdlpCookiesBrowser,
  parseYtdlpFormatPreset,
  parseYtdlpImpersonate,
  parseYtdlpSubtitlePreset
} from '../shared/ytdlp-download-stored-parse'

export { parseYtdlpFilenameTemplateStored } from '../shared/ytdlp-download-stored-parse'

export type { YtdlpCommandPreviewContext } from './ytdlp-download-options-preview'
export {
  buildYtdlpCommandPreviewContext,
  normalizeYtdlpPreviewOutputDirectory,
  sanitizeYtdlpPreviewUrl
} from './ytdlp-download-options-preview'

export {
  resolveSafeYtdlpOutputPattern,
  validateFilenameTemplate,
  validateYtdlpCookiesFilePath,
  validateYtdlpFragmentRetriesLine,
  validateYtdlpRateLimit,
  validateYtdlpRetriesLine,
  validateYtdlpSubLangs
} from './ytdlp-download-options-validate'

export {
  YTDLP_DEFAULT_FILENAME_TEMPLATE,
  buildYtdlpRunOptionsSnapshot,
  formatPresetToExtraArgs,
  payloadFromSnapshot
} from './ytdlp-download-options-snapshot'
export type { YtdlpRunOptionsSnapshot } from './ytdlp-download-options-snapshot'
