import type { AppUiLocale } from './app-ui-locale'
import type { MainRuntimeLocaleBundle } from './main-runtime-locale-types'
import type { FfprobeSummaryLocale } from './ffprobe-summary-export-locale'
import { MAIN_RUNTIME_LOCALE_RU } from './main-runtime-locale-ru'
import { MAIN_RUNTIME_LOCALE_EN } from './main-runtime-locale-en'

export type {
  MainRuntimeLocaleBundle,
  MainApplicationStrings,
  DownloadsWindowIpcStrings,
  YtdlpQueueProgressStrings,
  YtdlpCliValidationCopy,
  FfmpegExportExtraArgsCopy,
  FfprobeSummaryStrings,
  ProcessingHistoryStatusStrings
} from './main-runtime-locale-types'

/** Единый пакет RU/EN для main process (ошибки, IPC, yt-dlp, ffmpeg, ffprobe, история). */
export function getMainRuntimeLocaleBundle(locale: AppUiLocale): MainRuntimeLocaleBundle {
  return locale === 'en' ? MAIN_RUNTIME_LOCALE_EN : MAIN_RUNTIME_LOCALE_RU
}

export function appUiLocaleToFfprobeSummaryLocale(locale: AppUiLocale): FfprobeSummaryLocale {
  return locale === 'en' ? 'en' : 'ru'
}

export function getMainApplicationStrings(
  locale: AppUiLocale
): MainRuntimeLocaleBundle['mainApplication'] {
  return getMainRuntimeLocaleBundle(locale).mainApplication
}

export function getDownloadsWindowIpcStrings(
  locale: AppUiLocale
): MainRuntimeLocaleBundle['downloadsIpc'] {
  return getMainRuntimeLocaleBundle(locale).downloadsIpc
}

export function getYtdlpQueueProgressStrings(
  locale: AppUiLocale
): MainRuntimeLocaleBundle['ytdlpQueueProgress'] {
  return getMainRuntimeLocaleBundle(locale).ytdlpQueueProgress
}

export function getYtdlpCliValidationCopy(
  locale: AppUiLocale
): MainRuntimeLocaleBundle['ytdlpCliValidation'] {
  return getMainRuntimeLocaleBundle(locale).ytdlpCliValidation
}

export function getFfmpegExportExtraArgsCopy(
  locale: AppUiLocale = 'ru'
): MainRuntimeLocaleBundle['ffmpegExportExtraArgs'] {
  return getMainRuntimeLocaleBundle(locale).ffmpegExportExtraArgs
}

export function getFfprobeSummaryStrings(
  locale: AppUiLocale
): MainRuntimeLocaleBundle['ffprobeSummary'] {
  return getMainRuntimeLocaleBundle(locale).ffprobeSummary
}

export function getProcessingHistoryStatusStrings(
  locale: AppUiLocale
): MainRuntimeLocaleBundle['processingHistory'] {
  return getMainRuntimeLocaleBundle(locale).processingHistory
}
