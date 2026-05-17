/**
 * UI copy for the pop-out downloads manager (`buildDownloadsHtml` in main).
 * Kept main-safe (no renderer imports).
 */
export type DownloadsWindowUiLocale = 'ru' | 'en'

export function parseDownloadsWindowUiLocale(v: unknown): DownloadsWindowUiLocale | undefined {
  if (v === 'en' || v === 'ru') {
    return v
  }
  return undefined
}

/** Map Electron/Chromium `app.getLocale()` (or similar) to downloads UI locale. */
export function downloadsWindowUiLocaleFromSystemLocale(
  systemLocale: string
): DownloadsWindowUiLocale {
  return systemLocale.toLowerCase().startsWith('en') ? 'en' : 'ru'
}

export type DownloadsTopbarClusterCopy = {
  toolbarAria: string
  inspector: string
  focusUrl: string
  mainEditor: string
  enginePaths: string
  about: string
}

/** All user-visible strings for the downloads pop-out HTML + embedded script. */
export type DownloadsWindowUiStrings = {
  htmlLang: string
  pageTitle: string
  windowTitle: string
  workspaceTabsAria: string
  editorTabDisabledTitle: string
  editorTabLabel: string
  downloadsTabLabel: string
  queueSectionAria: string
  urlsLabel: string
  urlsHint: string
  addToQueue: string
  startAllTitle: string
  startAll: string
  pauseToolbarTitleDefault: string
  pauseLabel: string
  cancelTitle: string
  cancel: string
  clearQueue: string
  clearFinished: string
  statusFilterLabel: string
  optQueueAll: string
  optQueueWaiting: string
  optQueueRunning: string
  optQueueDone: string
  optQueueError: string
  optQueueCancelled: string
  queueFilterHint: string
  queueToolbarHint: string
  queueSummaryInitial: string
  scrollToSettingsTitle: string
  scrollToSettings: string
  queueTableCaption: string
  thNum: string
  thTitle: string
  thFmt: string
  thSize: string
  thProg: string
  thSpd: string
  thEta: string
  thStatus: string
  thActions: string
  historySummary: string
  historySectionHint: string
  refreshHistory: string
  clearHistory: string
  historyOutcomeLabel: string
  histOptAll: string
  histOptSuccess: string
  histOptError: string
  histOptCancelled: string
  historyFilterHint: string
  historyTableCaption: string
  histThFinished: string
  histThName: string
  histThUrl: string
  histThOutcome: string
  histThCode: string
  histThStatus: string
  logSummary: string
  logSectionHint: string
  saveLog: string
  clearLogViewTitle: string
  clearLogView: string
  logPreAriaLabel: string
  railAria: string
  railTitle: string
  railSubtitle: string
  formatSummary: string
  formatSectionHint: string
  formatQualityLabel: string
  playlistAudioGroupAria: string
  wholePlaylistLabel: string
  wholePlaylistAria: string
  audioOnlyLabel: string
  audioOnlyAria: string
  subtitlesLabel: string
  subOptNone: string
  subOptManual: string
  subOptManualAuto: string
  subLangsLabel: string
  subLangsPlaceholder: string
  metadataSummary: string
  metadataSectionHint: string
  cookiesLabel: string
  cookiesNone: string
  cookiesChrome: string
  cookiesEdge: string
  cookiesFirefox: string
  cookiesProfileLabel: string
  cookiesProfilePlaceholder: string
  cookiesFileLabel: string
  pickEllipsis: string
  clearCookiesTitle: string
  clearCookies: string
  impersonateLabel: string
  impersonateOff: string
  openInHandlerPillLabel: string
  openInHandlerAria: string
  autoExportPillLabel: string
  autoExportAria: string
  enqueueBatchPillLabel: string
  enqueueBatchAria: string
  autoStartBatchPillLabel: string
  autoStartBatchAria: string
  savingSummary: string
  savingSectionHint: string
  outDirLabel: string
  openOutTitle: string
  openOut: string
  pickOut: string
  resetOutTitle: string
  resetOut: string
  tmplLabel: string
  applyOpts: string
  tmplReset: string
  networkSummary: string
  networkSectionHint: string
  rateLimitLabel: string
  rateLimitPlaceholder: string
  retriesLabel: string
  retriesPlaceholder: string
  fragmentRetriesLabel: string
  queueRetryLabel: string
  queueRetryOff: string
  queueRetryLight: string
  queueRetryNormal: string
  queueRetryPersistent: string
  expertSummary: string
  expertSectionHintBeforeLinks: string
  expertSectionHintAfterLinks: string
  docFormats: string
  docOutputTemplate: string
  docPostprocess: string
  extraArgsLabel: string
  extraArgsPlaceholder: string
  previewOutDirLabel: string
  previewOutDirPlaceholder: string
  argsPreviewLabel: string
  argsPreviewAria: string
  hintsPanelSummary: string
  hintCatalogIntro: string
  hintCatalogFilterLabel: string
  hintFilterPlaceholder: string
  hintFilterAria: string
  hintListAria: string
  footerNote: string
  topbarCluster: DownloadsTopbarClusterCopy
  /** Pill switch */
  pillOn: string
  pillOff: string
  hintCategoryFallback: string
  outcomeSuccess: string
  outcomeCancelled: string
  outcomeError: string
  historyEmpty: string
  historyNoMatchingFilter: string
  confirmClearHistory: string
  hintsCatalogUnavailable: string
  hintsCatalogUnavailableShort: string
  hintsNoMatches: string
  queueTotal: string
  queueWaiting: string
  queueRunning: string
  queueDone: string
  queueErrors: string
  queueCancelled: string
  queueEmpty: string
  queueNoMatchingFilter: string
  rowCancelYtdlp: string
  rowResumeYtdlp: string
  rowPauseYtdlp: string
  rowStartThisLine: string
  rowRetryDownload: string
  rowOpenInFlux: string
  rowOpenFile: string
  rowShowInFolder: string
  /** Папка назначения yt-dlp (-o), даже пока файл ещё не появился в очереди. */
  rowOpenDownloadFolder: string
  rowMoveUp: string
  rowMoveDown: string
  rowRemoveFromQueue: string
  histReenqueueUrl: string
  histOpenInFlux: string
  histOpenFile: string
  histShowInFolder: string
  pauseUnsupportedWinTitle: string
  pauseTitleSigstop: string
  resumeTitleSigcont: string
  /** Main toolbar pause button when a job is paused (SIGCONT). */
  pauseToolbarResume: string
  logEmptyAlert: string
  logLinesWord: string
}
