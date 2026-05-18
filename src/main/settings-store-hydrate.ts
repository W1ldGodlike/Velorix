import type { AppSettings } from '../shared/settings-contract'
import {
  parseFfmpegExportCropPreset,
  parseFfmpegExportUserPresetsList,
  parseFfmpegExportVideoTransform
} from './ffmpeg-export-service'
import { parseYtdlpQueueRetryProfile } from './ytdlp-queue-retry'
import { parseAppUiLocale } from '../shared/app-ui-locale'
import {
  getBuiltinFfmpegExportUserPresets,
  mergeBuiltinFfmpegExportUserPresetsFromFile
} from '../shared/builtin-ffmpeg-export-user-presets'
import {
  DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX,
  parseFfmpegExportBatchOutputSuffixTemplate
} from '../shared/ffmpeg-export-batch-output-suffix'
import {
  parseExternalFilterScriptKind,
  parseExternalFilterScriptPathStored
} from '../shared/external-filter-script-parse'
import { parseStoredTheme as parseAppThemeFromRaw } from '../shared/settings-stored-parse'
import { parseYtdlpFilenameTemplateStored } from '../shared/ytdlp-download-stored-parse'
import {
  parseDownloadsWindowUiPanels,
  parseEngineExecutablePaths,
  parseFfmpegExportAudioBitrateStored,
  parseFfmpegExportAudioModeStored,
  parseFfmpegExportContainerStored,
  parseFfmpegExportCrfStored,
  parseFfmpegExportDirectoryStored,
  parseFfmpegExportEncodePresetStored,
  parseFfmpegExportFpsStored,
  parseFfmpegExportScalePresetStored,
  parseFfmpegExportVideoBitrateStored,
  parseFfmpegExportVideoCodecStored,
  parseFfmpegSnapshotDirectoryStored,
  parseFfmpegSnapshotFormatStored,
  parseMainWindowUiPanels,
  parseWindowBoundsConfig,
  parseYtdlpCookiesBrowserProfileStored,
  parseYtdlpCookiesBrowserStored,
  parseYtdlpCookiesFileStored,
  parseYtdlpDownloadDirectory,
  parseYtdlpExtraArgsLineStored,
  parseYtdlpFormatPresetStored,
  parseYtdlpImpersonateStored,
  parseYtdlpRateLimitStored,
  parseYtdlpRetriesStored,
  parseYtdlpSubLangsStored,
  parseYtdlpSubtitlePresetStored
} from './settings-store-load-parse'

export const settingsStoreDefaults: AppSettings = {
  theme: 'dark',
  ffmpegExportUserPresets: getBuiltinFfmpegExportUserPresets('ru')
}

/** Белый список полей `settings.json` → `AppSettings`. */
export function hydrateAppSettingsFromPartial(parsed: Partial<AppSettings>): AppSettings {
  const theme = parseAppThemeFromRaw(parsed.theme)
  const last =
    typeof parsed.lastOpenedSourcePath === 'string' && parsed.lastOpenedSourcePath.trim() !== ''
      ? parsed.lastOpenedSourcePath.trim()
      : undefined
  const engineExecutablePaths = parseEngineExecutablePaths(parsed.engineExecutablePaths)
  const windowBounds = parseWindowBoundsConfig(parsed.windowBounds)
  const ytdlpDownloadDirectory = parseYtdlpDownloadDirectory(parsed.ytdlpDownloadDirectory)
  const ytdlpFilenameTemplate = parseYtdlpFilenameTemplateStored(parsed.ytdlpFilenameTemplate)
  const ytdlpFormatPreset = parseYtdlpFormatPresetStored(parsed.ytdlpFormatPreset)
  const ffmpegExportEncodePreset = parseFfmpegExportEncodePresetStored(parsed.ffmpegExportEncodePreset)
  const ffmpegExportVideoCodec = parseFfmpegExportVideoCodecStored(parsed.ffmpegExportVideoCodec)
  const ffmpegExportContainer = parseFfmpegExportContainerStored(parsed.ffmpegExportContainer)
  const ffmpegExportCrf = parseFfmpegExportCrfStored(parsed.ffmpegExportCrf)
  const ffmpegExportVideoBitrate = parseFfmpegExportVideoBitrateStored(parsed.ffmpegExportVideoBitrate)
  const ffmpegExportAudioBitrate = parseFfmpegExportAudioBitrateStored(parsed.ffmpegExportAudioBitrate)
  const ffmpegExportAudioMode = parseFfmpegExportAudioModeStored(parsed.ffmpegExportAudioMode)
  const ffmpegExportFps = parseFfmpegExportFpsStored(parsed.ffmpegExportFps)
  const ffmpegExportScalePreset = parseFfmpegExportScalePresetStored(parsed.ffmpegExportScalePreset)
  const ffmpegExportVideoTransform = parseFfmpegExportVideoTransform(parsed.ffmpegExportVideoTransform)
  const ffmpegExportCropPreset = parseFfmpegExportCropPreset(parsed.ffmpegExportCropPreset)
  const ffmpegExportDirectory = parseFfmpegExportDirectoryStored(parsed.ffmpegExportDirectory)
  const ffmpegSnapshotDirectory = parseFfmpegSnapshotDirectoryStored(parsed.ffmpegSnapshotDirectory)
  const ffmpegSnapshotFormat = parseFfmpegSnapshotFormatStored(parsed.ffmpegSnapshotFormat)
  const ytdlpExtraArgsLine = parseYtdlpExtraArgsLineStored(parsed.ytdlpExtraArgsLine)
  const ytdlpSubtitlePreset = parseYtdlpSubtitlePresetStored(parsed.ytdlpSubtitlePreset)
  const ytdlpSubLangs = parseYtdlpSubLangsStored(parsed.ytdlpSubLangs)
  const ytdlpCookiesFile = parseYtdlpCookiesFileStored(parsed.ytdlpCookiesFile)
  const ytdlpCookiesBrowser = parseYtdlpCookiesBrowserStored(parsed.ytdlpCookiesBrowser)
  const ytdlpCookiesBrowserProfile = parseYtdlpCookiesBrowserProfileStored(
    parsed.ytdlpCookiesBrowserProfile
  )
  const ytdlpImpersonate = parseYtdlpImpersonateStored(parsed.ytdlpImpersonate)
  const ytdlpRateLimit = parseYtdlpRateLimitStored(parsed.ytdlpRateLimit)
  const ytdlpRetries = parseYtdlpRetriesStored(parsed.ytdlpRetries)
  const ytdlpFragmentRetries = parseYtdlpRetriesStored(parsed.ytdlpFragmentRetries)

  const base: AppSettings = { theme }
  if (last !== undefined) {
    base.lastOpenedSourcePath = last
  }
  if (engineExecutablePaths !== undefined) {
    base.engineExecutablePaths = engineExecutablePaths
  }
  if (windowBounds !== undefined) {
    base.windowBounds = windowBounds
  }
  if (ytdlpDownloadDirectory !== undefined) {
    base.ytdlpDownloadDirectory = ytdlpDownloadDirectory
  }
  if (ytdlpFilenameTemplate !== undefined) {
    base.ytdlpFilenameTemplate = ytdlpFilenameTemplate
  }
  if (ytdlpFormatPreset !== undefined) {
    base.ytdlpFormatPreset = ytdlpFormatPreset
  }
  if (ffmpegExportEncodePreset !== undefined) {
    base.ffmpegExportEncodePreset = ffmpegExportEncodePreset
  }
  if (ffmpegExportVideoCodec !== undefined) {
    base.ffmpegExportVideoCodec = ffmpegExportVideoCodec
  }
  if (ffmpegExportContainer !== undefined) {
    base.ffmpegExportContainer = ffmpegExportContainer
  }
  if (ffmpegExportCrf !== undefined) {
    base.ffmpegExportCrf = ffmpegExportCrf
  }
  if (ffmpegExportVideoBitrate !== undefined) {
    base.ffmpegExportVideoBitrate = ffmpegExportVideoBitrate
  }
  if (parsed.ffmpegExportTwoPass === true) {
    base.ffmpegExportTwoPass = true
  }
  if (parsed.ffmpegExportEconomyMode === true) {
    base.ffmpegExportEconomyMode = true
  }
  if (parsed.ffmpegExportHwDecode === true) {
    base.ffmpegExportHwDecode = true
  }
  if (
    typeof parsed.ffmpegExportBatchOutputSuffix === 'string' &&
    parsed.ffmpegExportBatchOutputSuffix.trim().length > 0
  ) {
    const suffixParsed = parseFfmpegExportBatchOutputSuffixTemplate(parsed.ffmpegExportBatchOutputSuffix)
    if (suffixParsed.ok && suffixParsed.template !== DEFAULT_FFMPEG_EXPORT_BATCH_OUTPUT_SUFFIX) {
      base.ffmpegExportBatchOutputSuffix = suffixParsed.template
    }
  }
  const batchDirStored = parseFfmpegExportDirectoryStored(parsed.ffmpegExportBatchOutputDirectory)
  if (batchDirStored) {
    base.ffmpegExportBatchOutputDirectory = batchDirStored
  }
  if (parsed.editorUrlPasteBehavior === 'download_open_editor') {
    base.editorUrlPasteBehavior = 'download_open_editor'
  }
  if (
    typeof parsed.ffmpegExportExtraArgsLine === 'string' &&
    parsed.ffmpegExportExtraArgsLine.trim().length > 0
  ) {
    base.ffmpegExportExtraArgsLine = parsed.ffmpegExportExtraArgsLine.trim().slice(0, 1200)
  }
  if (ffmpegExportAudioBitrate !== undefined) {
    base.ffmpegExportAudioBitrate = ffmpegExportAudioBitrate
  }
  if (ffmpegExportAudioMode !== undefined && ffmpegExportAudioMode !== 'aac') {
    base.ffmpegExportAudioMode = ffmpegExportAudioMode
  }
  if (ffmpegExportFps !== undefined) {
    base.ffmpegExportFps = ffmpegExportFps
  }
  if (ffmpegExportScalePreset !== undefined && ffmpegExportScalePreset !== 'source') {
    base.ffmpegExportScalePreset = ffmpegExportScalePreset
  }
  if (ffmpegExportVideoTransform !== 'none') {
    base.ffmpegExportVideoTransform = ffmpegExportVideoTransform
  }
  if (ffmpegExportCropPreset !== 'none') {
    base.ffmpegExportCropPreset = ffmpegExportCropPreset
  }
  if (ffmpegExportDirectory !== undefined) {
    base.ffmpegExportDirectory = ffmpegExportDirectory
  }
  if (ffmpegSnapshotDirectory !== undefined) {
    base.ffmpegSnapshotDirectory = ffmpegSnapshotDirectory
  }
  if (ffmpegSnapshotFormat !== undefined && ffmpegSnapshotFormat !== 'png') {
    base.ffmpegSnapshotFormat = ffmpegSnapshotFormat
  }
  if (parsed.ytdlpDownloadPlaylist === true) {
    base.ytdlpDownloadPlaylist = true
  }
  if (parsed.ytdlpAudioOnly === true) {
    base.ytdlpAudioOnly = true
  }
  if (parsed.ytdlpOpenInHandlerOnComplete === true) {
    base.ytdlpOpenInHandlerOnComplete = true
  }
  if (parsed.ytdlpAutoExportAfterOpenInHandler === true) {
    base.ytdlpAutoExportAfterOpenInHandler = true
  }
  if (parsed.ytdlpEnqueueBatchOnDownloadComplete === true) {
    base.ytdlpEnqueueBatchOnDownloadComplete = true
  }
  if (parsed.ytdlpAutoStartBatchAfterEnqueue === true) {
    base.ytdlpAutoStartBatchAfterEnqueue = true
  }
  if (ytdlpSubtitlePreset !== undefined) {
    base.ytdlpSubtitlePreset = ytdlpSubtitlePreset
  }
  if (ytdlpSubLangs !== undefined) {
    base.ytdlpSubLangs = ytdlpSubLangs
  }
  if (ytdlpCookiesFile !== undefined) {
    base.ytdlpCookiesFile = ytdlpCookiesFile
  }
  if (ytdlpCookiesBrowser !== undefined) {
    base.ytdlpCookiesBrowser = ytdlpCookiesBrowser
  }
  if (ytdlpCookiesBrowserProfile !== undefined) {
    base.ytdlpCookiesBrowserProfile = ytdlpCookiesBrowserProfile
  }
  if (ytdlpImpersonate !== undefined) {
    base.ytdlpImpersonate = ytdlpImpersonate
  }
  if (ytdlpRateLimit !== undefined) {
    base.ytdlpRateLimit = ytdlpRateLimit
  }
  if (ytdlpRetries !== undefined) {
    base.ytdlpRetries = ytdlpRetries
  }
  if (ytdlpFragmentRetries !== undefined) {
    base.ytdlpFragmentRetries = ytdlpFragmentRetries
  }
  if (ytdlpExtraArgsLine !== undefined) {
    base.ytdlpExtraArgsLine = ytdlpExtraArgsLine
  }
  const qrp = parseYtdlpQueueRetryProfile(parsed.ytdlpQueueRetryProfile)
  if (qrp !== 'off') {
    base.ytdlpQueueRetryProfile = qrp
  }
  const uiLocaleParsed = parseAppUiLocale(parsed.uiLocale)
  const presetUiLocale: 'ru' | 'en' = uiLocaleParsed === 'en' ? 'en' : 'ru'
  const fromFile = parseFfmpegExportUserPresetsList(parsed.ffmpegExportUserPresets)
  base.ffmpegExportUserPresets = mergeBuiltinFfmpegExportUserPresetsFromFile(fromFile, presetUiLocale)
  const mainWindowUiPanels = parseMainWindowUiPanels(parsed.mainWindowUiPanels)
  if (mainWindowUiPanels !== undefined) {
    base.mainWindowUiPanels = mainWindowUiPanels
  }
  const downloadsWindowUiPanels = parseDownloadsWindowUiPanels(parsed.downloadsWindowUiPanels)
  if (downloadsWindowUiPanels !== undefined) {
    base.downloadsWindowUiPanels = downloadsWindowUiPanels
  }
  if (uiLocaleParsed !== undefined) {
    base.uiLocale = uiLocaleParsed
  }
  const externalKind = parseExternalFilterScriptKind(parsed.ffmpegExportExternalFilterKind)
  const externalPath = parseExternalFilterScriptPathStored(parsed.ffmpegExportExternalFilterScriptPath)
  if (externalKind !== 'off' && externalPath !== null) {
    base.ffmpegExportExternalFilterKind = externalKind
    base.ffmpegExportExternalFilterScriptPath = externalPath
  }
  return base
}
