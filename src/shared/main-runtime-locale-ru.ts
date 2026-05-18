import type { MainRuntimeLocaleBundle } from './main-runtime-locale-types'
import { mainApplicationStringsRu } from './main-application-locale-strings-ru'
import { DOWNLOADS_WINDOW_IPC_STRINGS_RU } from './downloads-window-ipc-locale'
import { YTDLP_QUEUE_PROGRESS_STRINGS_RU } from './ytdlp-queue-progress-locale'
import { YTDLP_CLI_VALIDATION_COPY_RU } from './ytdlp-cli-validation-locale'
import { FFMPEG_EXPORT_EXTRA_ARGS_COPY_RU } from './ffmpeg-export-extra-args-locale'
import { FFPROBE_SUMMARY_STRINGS_RU } from './ffprobe-summary-export-locale'
import { PROCESSING_HISTORY_STATUS_STRINGS_RU } from './processing-history-status-locale'

export const MAIN_RUNTIME_LOCALE_RU: MainRuntimeLocaleBundle = {
  mainApplication: mainApplicationStringsRu,
  downloadsIpc: DOWNLOADS_WINDOW_IPC_STRINGS_RU,
  ytdlpQueueProgress: YTDLP_QUEUE_PROGRESS_STRINGS_RU,
  ytdlpCliValidation: YTDLP_CLI_VALIDATION_COPY_RU,
  ffmpegExportExtraArgs: FFMPEG_EXPORT_EXTRA_ARGS_COPY_RU,
  ffprobeSummary: FFPROBE_SUMMARY_STRINGS_RU,
  processingHistory: PROCESSING_HISTORY_STATUS_STRINGS_RU
}
