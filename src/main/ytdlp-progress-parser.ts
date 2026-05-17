/**
 * §6.4 — чистые парсеры строкового вывода yt-dlp.
 *
 * Этот модуль сознательно изолирован от Electron/IPC/FS, чтобы покрываться юнит-тестами
 * прямо в Node без `electron`-runtime. Все «грязные» сервисы (`ytdlp-download-service`,
 * `downloads-queue-runner`) импортируют функции отсюда.
 */

export type {
  YtdlpDownloadProgressParts,
  YtdlpQueueFailureKind
} from './ytdlp-progress-parser-download'
export {
  parseYtdlpProgressPercentNumber,
  parseYtdlpDownloadProgressLine,
  parseYtdlpSpeedToBytesPerSec,
  formatTorrentStyleSpeedFromBps,
  displayLabelFromYtdlpOutputPath,
  formatYtdlpProgressCell
} from './ytdlp-progress-parser-download'
export {
  parseYtdlpInfoDownloadingTitlePrefix,
  parseYtdlpInfoFormatSnippet,
  parseYtdlpQueueFormatHint,
  parseYtdlpInfoQueueSizeHint,
  formatYtdlpQueueFailureStatus,
  classifyYtdlpQueueFailureKind,
  shouldSkipQueueRetriesForFailureKind,
  shouldSkipYtdlpQueueRetriesAfterFailure,
  extractYtdlpErrorSummary,
  extractYtdlpOutputPath
} from './ytdlp-progress-parser-queue'
