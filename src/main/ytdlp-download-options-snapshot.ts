import { existsSync, statSync } from 'fs'
import { isAbsolute, join, normalize } from 'path'

import type { AppSettings } from './settings-store'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import { getYtdlpCliValidationCopy } from '../shared/ytdlp-cli-validation-locale'
import {
  buildYtdlpFormatPresetChoices,
  buildYtdlpQueueRetryProfileChoices
} from '../shared/ytdlp-download-payload-locale'
import type {
  YtdlpCookiesBrowserId,
  YtdlpDownloadOptionsPayload,
  YtdlpFormatPresetId,
  YtdlpImpersonateId,
  YtdlpQueueRetryProfileId,
  YtdlpSubtitlePresetId
} from '../shared/ytdlp-download-contract'
import {
  buildYtdlpSpawnArgvTokens,
  formatArgvTokensForPreview,
  parseExtraYtdlpArgsLine,
  validateYtdlpCookiesBrowserProfile
} from './ytdlp-extra-args'
import { getYtdlpCommandHints } from './ytdlp-commands-hints'
import {
  parseYtdlpCookiesBrowser,
  parseYtdlpFormatPreset,
  parseYtdlpImpersonate,
  parseYtdlpSubtitlePreset
} from '../shared/ytdlp-download-stored-parse'
import { parseYtdlpQueueRetryProfile } from './ytdlp-queue-retry'
import type { YtdlpCommandPreviewContext } from './ytdlp-download-options-preview'
import { sanitizeYtdlpPreviewUrl } from './ytdlp-download-options-preview'
import {
  resolveSafeYtdlpOutputPattern,
  validateFilenameTemplate,
  validateYtdlpFragmentRetriesLine,
  validateYtdlpRateLimit,
  validateYtdlpRetriesLine,
  validateYtdlpSubLangs
} from './ytdlp-download-options-validate'

/** Шаблон по умолчанию совпадает с тем, что раньше был захардкожен в `runYtdlpOnce`. */
/** Без суффикса `[id]` в имени файла — он выглядел как артефакт; `%(id)s` при необходимости вручную в шаблоне. */
export const YTDLP_DEFAULT_FILENAME_TEMPLATE = '%(title)s.%(ext)s'

export interface YtdlpRunOptionsSnapshot {
  filenameTemplate: string
  formatPreset: YtdlpFormatPresetId
  /** Дополнительные аргументы yt-dlp перед `-o` (уже разобранные токены, без shell). */
  formatExtraArgs: string[]
  /** Передаётся в spawn как `--yes-playlist`; иначе `--no-playlist`. */
  downloadPlaylist: boolean
  /** `-x --audio-format best`; `-f` из пресета при этом не добавляется. */
  audioOnly: boolean
  /** §6.2: только whitelist; строка языков без пробелов для `--sub-langs`. */
  subtitlePreset: YtdlpSubtitlePresetId
  /** Токен для argv при активном пресете и непустой строке. */
  subLangs: string
  /** Строка из настроек для поля UI (пусто если в JSON был мусор). */
  subLangsLine: string
  /** Исходная строка из UI/settings для редактирования §6.3. */
  extraArgsLine: string
  /** Уже проверенные токены; при ошибке чтения JSON — пусто, см. `extraArgsParseWarning`. */
  extraArgs: string[]
  /** Если строка из файла не прошла parse — показываем в UI, runner игнорирует extras. */
  extraArgsParseWarning: string | null
  /** §6.2 — путь для `--cookies`, только если файл на диске доступен. */
  cookiesArgvFile: string | null
  /** §6.2 — только если нет рабочего файла cookies. */
  cookiesArgvBrowser: YtdlpCookiesBrowserId | null
  /** §6.2 — валидированный суффикс после `BROWSER:`; только вместе с `cookiesArgvBrowser`. */
  cookiesArgvBrowserProfile: string | null
  /** Путь из settings для подписи в UI (может быть битым). */
  cookiesFilePathStored: string
  /** Выбор в UI (может сосуществовать с файлом в JSON до сохранения). */
  cookiesBrowserChoice: 'none' | YtdlpCookiesBrowserId
  /** Строка для поля «профиль/контейнер» в UI (из settings, после trim при успешной валидации). */
  cookiesBrowserProfileLine: string
  cookiesWarning: string | null
  /** §6.2 — только whitelist; null если выключено. */
  impersonateTarget: YtdlpImpersonateId | null
  impersonateChoice: 'none' | YtdlpImpersonateId
  /** §6.2 `--limit-rate`; один безопасный токен, пусто — без лимита. */
  rateLimit: string
  /** §6.2 `--retries`; null — дефолт yt-dlp. */
  retries: number | null
  retriesLine: string
  /** §6.4 `--fragment-retries`; null — дефолт yt-dlp. */
  fragmentRetries: number | null
  fragmentRetriesLine: string
  /** §6.4 — повтор запуска той же строки очереди при ошибке (не `--retries`). */
  queueRetryProfile: YtdlpQueueRetryProfileId
  /** §6.4 — после успешной загрузки открыть файл в главном окне (runner). */
  openInHandlerOnComplete: boolean
  /** §6.4 — после успешного авто-открытия запустить ffmpeg-экспорт (runner + main). */
  autoExportAfterOpenInHandler: boolean
  /** §7.4 — после успеха добавить файл в пакетный экспорт. */
  enqueueBatchOnDownloadComplete: boolean
  /** §7.4 — запустить пакет после добавления. */
  autoStartBatchAfterEnqueue: boolean
}

export function formatPresetToExtraArgs(id: YtdlpFormatPresetId): string[] {
  if (id === 'editor_mp4') {
    return [
      '-f',
      'bv*[ext=mp4][vcodec^=avc1]+ba[ext=m4a][acodec^=mp4a]/b[ext=mp4]/best[ext=mp4]/best',
      '--merge-output-format',
      'mp4'
    ]
  }
  if (id === 'merge_bv_ba') {
    return ['-f', 'bv*+ba/b']
  }
  if (id === 'best_single') {
    return ['-f', 'best']
  }
  return []
}

export function buildYtdlpRunOptionsSnapshot(
  settings: AppSettings,
  uiLocale: DownloadsWindowUiLocale = 'ru'
): YtdlpRunOptionsSnapshot {
  const V = getYtdlpCliValidationCopy(uiLocale)
  const preset = parseYtdlpFormatPreset(settings.ytdlpFormatPreset)
  const audioOnly = settings.ytdlpAudioOnly === true
  const subtitlePreset = parseYtdlpSubtitlePreset(settings.ytdlpSubtitlePreset)
  const subLangsStored =
    typeof settings.ytdlpSubLangs === 'string' ? settings.ytdlpSubLangs.trim() : ''
  const subLangsParsed = validateYtdlpSubLangs(subLangsStored, uiLocale)
  const subLangs =
    subtitlePreset !== 'none' && subLangsParsed.ok && subLangsParsed.value.length > 0
      ? subLangsParsed.value
      : ''
  const subLangsLine = subLangsParsed.ok ? subLangsParsed.value : ''
  const stored = settings.ytdlpFilenameTemplate
  let filenameTemplate = YTDLP_DEFAULT_FILENAME_TEMPLATE
  if (typeof stored === 'string') {
    const vt = validateFilenameTemplate(stored, uiLocale)
    if (vt.ok) {
      filenameTemplate = vt.value
    }
  }
  const extraArgsLine =
    typeof settings.ytdlpExtraArgsLine === 'string' ? settings.ytdlpExtraArgsLine.trim() : ''
  const parsedExtras = parseExtraYtdlpArgsLine(extraArgsLine, uiLocale)
  const extraArgs = parsedExtras.ok ? parsedExtras.args : []
  const extraArgsParseWarning = parsedExtras.ok ? null : parsedExtras.error

  const cookiesFileStored =
    typeof settings.ytdlpCookiesFile === 'string' ? settings.ytdlpCookiesFile.trim() : ''
  let cookiesArgvFile: string | null = null
  let cookiesWarning: string | null = null
  let cookiesFileBroken = false
  if (cookiesFileStored !== '') {
    const n = normalize(cookiesFileStored)
    if (!isAbsolute(n)) {
      cookiesFileBroken = true
      cookiesWarning = V.cookiesPathNotAbsolute
    } else if (!existsSync(n)) {
      cookiesFileBroken = true
      cookiesWarning = V.cookiesFileNotFound
    } else {
      try {
        if (!statSync(n).isFile()) {
          cookiesFileBroken = true
          cookiesWarning = V.cookiesPathNotFile
        } else {
          cookiesArgvFile = n
        }
      } catch {
        cookiesFileBroken = true
        cookiesWarning = V.cookiesStatFailed
      }
    }
  }

  const browserParsed = parseYtdlpCookiesBrowser(settings.ytdlpCookiesBrowser)
  const cookiesArgvBrowser: YtdlpCookiesBrowserId | null =
    !cookiesFileBroken && cookiesArgvFile === null && browserParsed !== undefined
      ? browserParsed
      : null
  const cookiesBrowserChoice: 'none' | YtdlpCookiesBrowserId =
    browserParsed !== undefined ? browserParsed : 'none'

  const cookiesBrowserProfileLine =
    typeof settings.ytdlpCookiesBrowserProfile === 'string'
      ? settings.ytdlpCookiesBrowserProfile
      : ''
  const cookiesProfileParsed = validateYtdlpCookiesBrowserProfile(
    cookiesBrowserProfileLine,
    uiLocale
  )
  let cookiesArgvBrowserProfile: string | null = null
  if (
    cookiesArgvBrowser !== null &&
    cookiesProfileParsed.ok &&
    cookiesProfileParsed.value.length > 0
  ) {
    cookiesArgvBrowserProfile = cookiesProfileParsed.value
  }
  if (!cookiesProfileParsed.ok && cookiesBrowserProfileLine.trim().length > 0) {
    const w = cookiesProfileParsed.error
    cookiesWarning = cookiesWarning ? `${cookiesWarning} ${w}` : w
  }

  const impersonateParsed = parseYtdlpImpersonate(settings.ytdlpImpersonate)
  const impersonateTarget: YtdlpImpersonateId | null =
    impersonateParsed !== undefined ? impersonateParsed : null
  const impersonateChoice: 'none' | YtdlpImpersonateId =
    impersonateParsed !== undefined ? impersonateParsed : 'none'

  const rateLimitStored =
    typeof settings.ytdlpRateLimit === 'string' ? settings.ytdlpRateLimit.trim() : ''
  const rateLimitParsed = validateYtdlpRateLimit(rateLimitStored, uiLocale)
  const rateLimit = rateLimitParsed.ok ? rateLimitParsed.value : ''
  const retriesParsed = validateYtdlpRetriesLine(
    typeof settings.ytdlpRetries === 'number' && Number.isInteger(settings.ytdlpRetries)
      ? String(settings.ytdlpRetries)
      : '',
    uiLocale
  )
  const retries = retriesParsed.ok ? retriesParsed.value : null
  const retriesLine = retriesParsed.ok ? retriesParsed.line : ''
  const fragmentRetriesParsed = validateYtdlpFragmentRetriesLine(
    typeof settings.ytdlpFragmentRetries === 'number' &&
      Number.isInteger(settings.ytdlpFragmentRetries)
      ? String(settings.ytdlpFragmentRetries)
      : '',
    uiLocale
  )
  const fragmentRetries = fragmentRetriesParsed.ok ? fragmentRetriesParsed.value : null
  const fragmentRetriesLine = fragmentRetriesParsed.ok ? fragmentRetriesParsed.line : ''

  const queueRetryProfile = parseYtdlpQueueRetryProfile(settings.ytdlpQueueRetryProfile)
  const openInHandlerOnComplete = settings.ytdlpOpenInHandlerOnComplete === true
  const autoExportAfterOpenInHandler = settings.ytdlpAutoExportAfterOpenInHandler === true
  const enqueueBatchOnDownloadComplete = settings.ytdlpEnqueueBatchOnDownloadComplete === true
  const autoStartBatchAfterEnqueue = settings.ytdlpAutoStartBatchAfterEnqueue === true

  return {
    filenameTemplate,
    formatPreset: preset,
    formatExtraArgs: audioOnly ? [] : formatPresetToExtraArgs(preset),
    downloadPlaylist: settings.ytdlpDownloadPlaylist === true,
    audioOnly,
    subtitlePreset,
    subLangs,
    subLangsLine,
    extraArgsLine,
    extraArgs,
    extraArgsParseWarning,
    cookiesArgvFile,
    cookiesArgvBrowser,
    cookiesArgvBrowserProfile,
    cookiesFilePathStored: cookiesFileStored,
    cookiesBrowserChoice,
    cookiesBrowserProfileLine: cookiesProfileParsed.ok
      ? cookiesProfileParsed.value
      : cookiesBrowserProfileLine.trim().slice(0, 200),
    cookiesWarning,
    impersonateTarget,
    impersonateChoice,
    rateLimit,
    retries,
    retriesLine,
    fragmentRetries,
    fragmentRetriesLine,
    queueRetryProfile,
    openInHandlerOnComplete,
    autoExportAfterOpenInHandler,
    enqueueBatchOnDownloadComplete,
    autoStartBatchAfterEnqueue
  }
}

export function payloadFromSnapshot(
  snap: YtdlpRunOptionsSnapshot,
  previewCtx?: YtdlpCommandPreviewContext,
  uiLocale: DownloadsWindowUiLocale = 'ru'
): YtdlpDownloadOptionsPayload {
  let outputPattern: string
  let urlArg: string
  if (
    previewCtx &&
    typeof previewCtx.outputDirectoryAbsolute === 'string' &&
    previewCtx.outputDirectoryAbsolute.trim().length > 0
  ) {
    const root = normalize(previewCtx.outputDirectoryAbsolute.trim())
    const resolved = resolveSafeYtdlpOutputPattern(root, snap.filenameTemplate)
    outputPattern = resolved ?? join(root, snap.filenameTemplate)
    urlArg =
      previewCtx.sampleUrl && previewCtx.sampleUrl.trim().length > 0
        ? sanitizeYtdlpPreviewUrl(previewCtx.sampleUrl)
        : 'https://example.com/'
  } else {
    outputPattern = `<downloadDir>/${snap.filenameTemplate}`
    urlArg = '<url>'
  }
  const argv = buildYtdlpSpawnArgvTokens({
    downloadPlaylist: snap.downloadPlaylist,
    audioOnly: snap.audioOnly,
    subtitlePreset: snap.subtitlePreset,
    subLangs: snap.subLangs,
    cookiesFile: snap.cookiesArgvFile,
    cookiesBrowser: snap.cookiesArgvBrowser,
    cookiesBrowserProfile: snap.cookiesArgvBrowserProfile,
    impersonateTarget: snap.impersonateTarget,
    rateLimit: snap.rateLimit,
    retries: snap.retries,
    fragmentRetries: snap.fragmentRetries,
    formatExtraArgs: snap.formatExtraArgs,
    extraArgs: snap.extraArgs,
    outputPattern,
    url: urlArg
  })
  const commandPreview = `yt-dlp ${formatArgvTokensForPreview(argv)}`
  const commandHints = getYtdlpCommandHints(uiLocale)
  return {
    filenameTemplate: snap.filenameTemplate,
    defaultFilenameTemplate: YTDLP_DEFAULT_FILENAME_TEMPLATE,
    formatPreset: snap.formatPreset,
    formatPresetChoices: buildYtdlpFormatPresetChoices(uiLocale),
    downloadPlaylist: snap.downloadPlaylist,
    audioOnly: snap.audioOnly,
    subtitlePreset: snap.subtitlePreset,
    subLangsLine: snap.subLangsLine,
    extraArgsLine: snap.extraArgsLine,
    commandPreview,
    extraArgsParseWarning: snap.extraArgsParseWarning,
    commandHints,
    cookiesBrowserChoice: snap.cookiesBrowserChoice,
    cookiesBrowserProfileLine: snap.cookiesBrowserProfileLine,
    cookiesFilePathStored: snap.cookiesFilePathStored,
    cookiesWarning: snap.cookiesWarning,
    impersonateChoice: snap.impersonateChoice,
    rateLimit: snap.rateLimit,
    retriesLine: snap.retriesLine,
    fragmentRetriesLine: snap.fragmentRetriesLine,
    queueRetryProfile: snap.queueRetryProfile,
    queueRetryProfileChoices: buildYtdlpQueueRetryProfileChoices(uiLocale),
    openInHandlerOnComplete: snap.openInHandlerOnComplete,
    autoExportAfterOpenInHandler: snap.autoExportAfterOpenInHandler,
    enqueueBatchOnDownloadComplete: snap.enqueueBatchOnDownloadComplete,
    autoStartBatchAfterEnqueue: snap.autoStartBatchAfterEnqueue
  }
}
