/**
 * UI copy for the pop-out downloads manager (`buildDownloadsHtml` in main).
 * Kept main-safe (no renderer imports).
 */
export type {
  DownloadsTopbarClusterCopy,
  DownloadsWindowUiLocale,
  DownloadsWindowUiStrings
} from './downloads-window-ui-locale-types'
export {
  downloadsWindowUiLocaleFromSystemLocale,
  parseDownloadsWindowUiLocale
} from './downloads-window-ui-locale-types'

import type {
  DownloadsWindowUiLocale,
  DownloadsWindowUiStrings
} from './downloads-window-ui-locale-types'
import { downloadsWindowUiStringsEn } from './downloads-window-ui-strings-en'
import { downloadsWindowUiStringsRu } from './downloads-window-ui-strings-ru'

export function getDownloadsWindowUiStrings(
  locale: DownloadsWindowUiLocale
): DownloadsWindowUiStrings {
  return locale === 'en' ? downloadsWindowUiStringsEn : downloadsWindowUiStringsRu
}

/** JSON-serialized into the pop-out document as `DL_I18N` for the embedded script. */
export function buildDownloadsWindowScriptI18nJson(locale: DownloadsWindowUiLocale): string {
  const s = getDownloadsWindowUiStrings(locale)
  return JSON.stringify({
    pillOn: s.pillOn,
    pillOff: s.pillOff,
    hintCategoryFallback: s.hintCategoryFallback,
    outcomeSuccess: s.outcomeSuccess,
    outcomeCancelled: s.outcomeCancelled,
    outcomeError: s.outcomeError,
    historyEmpty: s.historyEmpty,
    historyNoMatchingFilter: s.historyNoMatchingFilter,
    confirmClearHistory: s.confirmClearHistory,
    hintsCatalogUnavailable: s.hintsCatalogUnavailable,
    hintsCatalogUnavailableShort: s.hintsCatalogUnavailableShort,
    hintsNoMatches: s.hintsNoMatches,
    queueTotal: s.queueTotal,
    queueWaiting: s.queueWaiting,
    queueRunning: s.queueRunning,
    queueDone: s.queueDone,
    queueErrors: s.queueErrors,
    queueCancelled: s.queueCancelled,
    queueEmpty: s.queueEmpty,
    queueNoMatchingFilter: s.queueNoMatchingFilter,
    rowCancelYtdlp: s.rowCancelYtdlp,
    rowResumeYtdlp: s.rowResumeYtdlp,
    rowPauseYtdlp: s.rowPauseYtdlp,
    rowStartThisLine: s.rowStartThisLine,
    rowRetryDownload: s.rowRetryDownload,
    rowOpenInFlux: s.rowOpenInFlux,
    rowOpenFile: s.rowOpenFile,
    rowShowInFolder: s.rowShowInFolder,
    rowOpenDownloadFolder: s.rowOpenDownloadFolder,
    rowMoveUp: s.rowMoveUp,
    rowMoveDown: s.rowMoveDown,
    rowRemoveFromQueue: s.rowRemoveFromQueue,
    histReenqueueUrl: s.histReenqueueUrl,
    histOpenInFlux: s.histOpenInFlux,
    histOpenFile: s.histOpenFile,
    histShowInFolder: s.histShowInFolder,
    pauseUnsupportedWinTitle: s.pauseUnsupportedWinTitle,
    pauseTitleSigstop: s.pauseTitleSigstop,
    resumeTitleSigcont: s.resumeTitleSigcont,
    pauseToolbarResume: s.pauseToolbarResume,
    toolbarPause: s.pauseLabel,
    logEmptyAlert: s.logEmptyAlert,
    logLinesWord: s.logLinesWord
  })
}
