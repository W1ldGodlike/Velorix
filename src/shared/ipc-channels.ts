/**
 * Единый реестр строк IPC между main и preload/renderer.
 * Имена каналов не дублируем литералами — импортируем отсюда, чтобы main и preload не расходились.
 */

/** Главное окно: invoke/handle + подписки на события из main. */
export const mainWindowIpc = {
  settingsGet: 'fluxalloy:settings-get',
  settingsSetTheme: 'fluxalloy:settings-set-theme',
  settingsSetFfmpegExportEncodePreset: 'fluxalloy:settings-set-ffmpeg-export-encode-preset',
  settingsSetFfmpegExportContainer: 'fluxalloy:settings-set-ffmpeg-export-container',
  settingsSetFfmpegExportCrf: 'fluxalloy:settings-set-ffmpeg-export-crf',
  settingsSetFfmpegExportAudioBitrate: 'fluxalloy:settings-set-ffmpeg-export-audio-bitrate',
  settingsSetFfmpegExportAudioMode: 'fluxalloy:settings-set-ffmpeg-export-audio-mode',
  settingsSetFfmpegExportVideoBitrate: 'fluxalloy:settings-set-ffmpeg-export-video-bitrate',
  settingsSetFfmpegExportTwoPass: 'fluxalloy:settings-set-ffmpeg-export-two-pass',
  settingsSetFfmpegExportFps: 'fluxalloy:settings-set-ffmpeg-export-fps',
  settingsSetFfmpegExportScalePreset: 'fluxalloy:settings-set-ffmpeg-export-scale-preset',
  settingsSetFfmpegExportVideoTransform: 'fluxalloy:settings-set-ffmpeg-export-video-transform',
  settingsSetFfmpegExportCropPreset: 'fluxalloy:settings-set-ffmpeg-export-crop-preset',
  settingsSetFfmpegExportUserPresets: 'fluxalloy:settings-set-ffmpeg-export-user-presets',
  settingsApplyFfmpegExportSnapshot: 'fluxalloy:settings-apply-ffmpeg-export-snapshot',
  settingsSetFfmpegSnapshotFormat: 'fluxalloy:settings-set-ffmpeg-snapshot-format',
  settingsSetEnginePaths: 'fluxalloy:settings-set-engine-paths',
  /** §4.1 — частичное обновление раскрытых секций главного окна (persist в settings.json). */
  settingsMergeMainWindowUiPanels: 'fluxalloy:settings-merge-main-window-ui-panels',
  pickEngineExecutable: 'fluxalloy:pick-engine-executable',
  enginesStatus: 'fluxalloy:engines-status',
  enginesShouldOfferDownload: 'fluxalloy:engines-should-offer-download',
  enginesDownload: 'fluxalloy:engines-download',
  enginesClearUserBin: 'fluxalloy:engines-clear-user-bin',
  enginesProgress: 'fluxalloy:engines-progress',
  openVideoDialog: 'fluxalloy:open-video-dialog',
  previewGrantPath: 'fluxalloy:preview-grant-path',
  persistLastSource: 'fluxalloy:persist-last-source',
  restoreLastSource: 'fluxalloy:restore-last-source',
  mediaProbe: 'fluxalloy:media-probe',
  clipboardReadText: 'fluxalloy:clipboard-read-text',
  clipboardWriteText: 'fluxalloy:clipboard-write-text',
  saveTextWithDialog: 'fluxalloy:save-text-with-dialog',
  appAboutInfo: 'fluxalloy:app-about-info',
  diagnosticsListFolders: 'fluxalloy:diagnostics-list-folders',
  diagnosticsOpenFolder: 'fluxalloy:diagnostics-open-folder',
  diagnosticsOpenMainLog: 'fluxalloy:diagnostics-open-main-log',
  diagnosticsCreateSupportZip: 'fluxalloy:diagnostics-create-support-zip',
  openDownloadsWindow: 'fluxalloy:open-downloads-window',
  /** §9 — отдельное окно инспектора ffprobe (`#inspector`). */
  openInspectorWindow: 'fluxalloy:open-inspector-window',
  inspectorBootstrap: 'fluxalloy:inspector-bootstrap',
  /** Main → renderer окна инспектора: проанализировать указанный путь. */
  inspectorTargetMediaPath: 'fluxalloy:inspector-target-media-path',
  exportStart: 'fluxalloy:export-start',
  exportCancel: 'fluxalloy:export-cancel',
  exportOpenOutput: 'fluxalloy:export-open-output',
  exportProgress: 'fluxalloy:export-progress',
  snapshotFrame: 'fluxalloy:snapshot-frame',
  logRenderer: 'fluxalloy:log-renderer',
  previewOpened: 'fluxalloy:preview-opened',
  themeChanged: 'fluxalloy:theme-changed',
  openEnginePaths: 'fluxalloy:open-engine-paths',
  enginePathsChanged: 'fluxalloy:engine-paths-changed',
  openAbout: 'fluxalloy:open-about',
  /** Main → все окна с главным preload: актуальный снимок `mainWindowUiPanels` после merge §4.1. */
  mainWindowUiPanelsChanged: 'fluxalloy:main-window-ui-panels-changed'
} as const

/** Окно yt-dlp: invoke/handle + push (`queueSnapshot`, `log`). */
export const downloadsIpc = {
  queueSnapshot: 'fluxalloy-downloads-state',
  log: 'fluxalloy-downloads-log',
  getSnapshot: 'fluxalloy-downloads-get-snapshot',
  addLines: 'fluxalloy-downloads-add-lines',
  getOutputDir: 'fluxalloy-downloads-get-output-dir',
  openOutputDir: 'fluxalloy-downloads-open-output-dir',
  getCliOptions: 'fluxalloy-downloads-get-cli-options',
  setCliOptions: 'fluxalloy-downloads-set-cli-options',
  pickOutputDir: 'fluxalloy-downloads-pick-output-dir',
  clearOutputDir: 'fluxalloy-downloads-clear-output-dir',
  pickCookiesFile: 'fluxalloy-downloads-pick-cookies-file',
  clearCookiesFile: 'fluxalloy-downloads-clear-cookies-file',
  clear: 'fluxalloy-downloads-clear',
  clearFinished: 'fluxalloy-downloads-clear-finished',
  getHistory: 'fluxalloy-downloads-get-history',
  clearHistory: 'fluxalloy-downloads-clear-history',
  saveVisibleLog: 'fluxalloy-downloads-save-visible-log',
  openQueueOutput: 'fluxalloy-downloads-open-queue-output',
  openHistoryOutput: 'fluxalloy-downloads-open-history-output',
  openQueueOutputInHandler: 'fluxalloy-downloads-open-queue-output-in-handler',
  openHistoryOutputInHandler: 'fluxalloy-downloads-open-history-output-in-handler',
  remove: 'fluxalloy-downloads-remove',
  move: 'fluxalloy-downloads-move',
  startQueue: 'fluxalloy-downloads-start-queue',
  startRow: 'fluxalloy-downloads-start-row',
  retryRow: 'fluxalloy-downloads-retry-row',
  cancelRun: 'fluxalloy-downloads-cancel-run',
  getYtdlpPauseState: 'fluxalloy-downloads-ytdlp-pause-state',
  pauseYtdlp: 'fluxalloy-downloads-pause-ytdlp',
  resumeYtdlp: 'fluxalloy-downloads-resume-ytdlp',
  /** §4.1 — частичное сохранение раскрытых секций окна загрузок. */
  mergeUiPanels: 'fluxalloy-downloads-merge-ui-panels',
  /** Мост во главное окно / инспектор без доступа preload загрузок к каналам renderer. */
  bridgeOpenInspector: 'fluxalloy-downloads-bridge-open-inspector',
  bridgeFocusMainEditor: 'fluxalloy-downloads-bridge-focus-main',
  bridgeOpenEnginePaths: 'fluxalloy-downloads-bridge-open-engine-paths',
  bridgeOpenAbout: 'fluxalloy-downloads-bridge-open-about'
} as const

export type MainWindowIpcChannel = (typeof mainWindowIpc)[keyof typeof mainWindowIpc]
export type DownloadsIpcChannel = (typeof downloadsIpc)[keyof typeof downloadsIpc]
