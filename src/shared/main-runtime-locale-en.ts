import type { MainRuntimeLocaleBundle } from './main-runtime-locale-types'
import { mainApplicationStringsEn } from './main-application-locale-strings-en'
import { DOWNLOADS_WINDOW_IPC_STRINGS_EN } from './downloads-window-ipc-locale'
import { YTDLP_QUEUE_PROGRESS_STRINGS_EN } from './ytdlp-queue-progress-locale'
import { YTDLP_CLI_VALIDATION_COPY_EN } from './ytdlp-cli-validation-locale'
import { FFMPEG_EXPORT_EXTRA_ARGS_COPY_EN } from './ffmpeg-export-extra-args-locale'
import { FFPROBE_SUMMARY_STRINGS_EN } from './ffprobe-summary-export-locale'
import { PROCESSING_HISTORY_STATUS_STRINGS_EN } from './processing-history-status-locale'

export const MAIN_RUNTIME_LOCALE_EN: MainRuntimeLocaleBundle = {
  mainApplication: mainApplicationStringsEn,
  downloadsIpc: DOWNLOADS_WINDOW_IPC_STRINGS_EN,
  ytdlpQueueProgress: YTDLP_QUEUE_PROGRESS_STRINGS_EN,
  ytdlpCliValidation: YTDLP_CLI_VALIDATION_COPY_EN,
  ffmpegExportExtraArgs: FFMPEG_EXPORT_EXTRA_ARGS_COPY_EN,
  ffprobeSummary: FFPROBE_SUMMARY_STRINGS_EN,
  processingHistory: PROCESSING_HISTORY_STATUS_STRINGS_EN
}
