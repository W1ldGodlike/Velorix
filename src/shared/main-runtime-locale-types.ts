import type { MainApplicationStrings } from './main-application-locale-types'
import type { DownloadsWindowIpcStrings } from './downloads-window-ipc-locale'
import type { YtdlpQueueProgressStrings } from './ytdlp-queue-progress-locale'
import type { YtdlpCliValidationCopy } from './ytdlp-cli-validation-locale'
import type { FfmpegExportExtraArgsCopy } from './ffmpeg-export-extra-args-locale'
import type { FfprobeSummaryStrings } from './ffprobe-summary-export-locale'
import type { ProcessingHistoryStatusStrings } from './processing-history-status-locale'

export type { MainApplicationStrings } from './main-application-locale-types'
export type { DownloadsWindowIpcStrings } from './downloads-window-ipc-locale'
export type { YtdlpQueueProgressStrings } from './ytdlp-queue-progress-locale'
export type { YtdlpCliValidationCopy } from './ytdlp-cli-validation-locale'
export type { FfmpegExportExtraArgsCopy } from './ffmpeg-export-extra-args-locale'
export type { FfprobeSummaryStrings } from './ffprobe-summary-export-locale'
export type { ProcessingHistoryStatusStrings } from './processing-history-status-locale'

/** Единый пакет RU/EN строк main process (ошибки, IPC, yt-dlp, ffmpeg, ffprobe, история). */
export type MainRuntimeLocaleBundle = {
  mainApplication: MainApplicationStrings
  downloadsIpc: DownloadsWindowIpcStrings
  ytdlpQueueProgress: YtdlpQueueProgressStrings
  ytdlpCliValidation: YtdlpCliValidationCopy
  ffmpegExportExtraArgs: FfmpegExportExtraArgsCopy
  ffprobeSummary: FfprobeSummaryStrings
  processingHistory: ProcessingHistoryStatusStrings
}
