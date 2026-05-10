import { existsSync, statSync } from 'fs'
import { isAbsolute, join, normalize, relative, resolve, sep } from 'path'

import type { AppSettings } from './settings-store'
import {
  buildYtdlpSpawnArgvTokens,
  formatArgvTokensForPreview,
  parseExtraYtdlpArgsLine
} from './ytdlp-extra-args'
import { getYtdlpCommandHints } from './ytdlp-commands-hints'
import { parseYtdlpQueueRetryProfile } from './ytdlp-queue-retry'
import { resolveYtdlpOutputDirectory } from './ytdlp-download-output'
import type {
  YtdlpCookiesBrowserId,
  YtdlpDownloadOptionsPayload,
  YtdlpFormatPresetId,
  YtdlpImpersonateId,
  YtdlpQueueRetryProfileId,
  YtdlpSubtitlePresetId
} from '../shared/ytdlp-download-contract'

export type {
  YtdlpCommandHintEntry,
  YtdlpCookiesBrowserId,
  YtdlpDownloadOptionsPatch,
  YtdlpDownloadOptionsPayload,
  YtdlpFormatPresetId,
  YtdlpImpersonateId,
  YtdlpQueueRetryProfileId,
  YtdlpSubtitlePresetId
} from '../shared/ytdlp-download-contract'

/** §6.3 — данные для строки превью argv без фиктивного `<downloadDir>` там, где известен userData. */
export interface YtdlpCommandPreviewContext {
  /** Абсолютный каталог `-o` после `resolveYtdlpOutputDirectory(userData)`. */
  outputDirectoryAbsolute: string
  /** Первый URL из очереди загрузок; иначе в превью подставляется нейтральный пример. */
  sampleUrl?: string
}

/** Убирает управляющие символы из URL перед показом в превью (не влияет на spawn). */
export function sanitizeYtdlpPreviewUrl(raw: string): string {
  const t = raw
    .split('')
    .filter((ch) => {
      const c = ch.charCodeAt(0)
      return c >= 32 && c !== 127
    })
    .join('')
    .trim()
  return t.length > 2048 ? `${t.slice(0, 2045)}…` : t
}

/** Абсолютный каталог только для строки превью `-o` §6.3; не из persisted settings. */
export function normalizeYtdlpPreviewOutputDirectory(raw: string): string | null {
  const t = raw.trim()
  if (t.length === 0 || t.length > 4096) {
    return null
  }
  if (/[\r\n\0]/.test(t)) {
    return null
  }
  const n = normalize(t)
  return isAbsolute(n) ? n : null
}

/**
 * Собирает контекст превью для окна yt-dlp: реальный каталог загрузки и опционально пример ссылки.
 */
export function buildYtdlpCommandPreviewContext(params: {
  userDataRoot: string
  sampleUrl?: string | null
  /** §6.3 — подмена корня `-o` для превью (поле в UI), без изменения settings.json. */
  outputDirectoryOverride?: string | null
}): YtdlpCommandPreviewContext {
  let dir: string
  if (
    typeof params.outputDirectoryOverride === 'string' &&
    params.outputDirectoryOverride.trim().length > 0
  ) {
    const ov = normalizeYtdlpPreviewOutputDirectory(params.outputDirectoryOverride)
    dir = ov ?? resolveYtdlpOutputDirectory(params.userDataRoot)
  } else {
    dir = resolveYtdlpOutputDirectory(params.userDataRoot)
  }
  const u = typeof params.sampleUrl === 'string' ? params.sampleUrl.trim() : ''
  if (u.length > 0) {
    return { outputDirectoryAbsolute: dir, sampleUrl: u }
  }
  return { outputDirectoryAbsolute: dir }
}

/** Шаблон по умолчанию совпадает с тем, что раньше был захардкожен в `runYtdlpOnce`. */
export const YTDLP_DEFAULT_FILENAME_TEMPLATE = '%(title)s [%(id)s].%(ext)s'

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
  /** Путь из settings для подписи в UI (может быть битым). */
  cookiesFilePathStored: string
  /** Выбор в UI (может сосуществовать с файлом в JSON до сохранения). */
  cookiesBrowserChoice: 'none' | YtdlpCookiesBrowserId
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
}

export function parseYtdlpFormatPreset(raw: unknown): YtdlpFormatPresetId {
  if (raw === 'editor_mp4' || raw === 'merge_bv_ba' || raw === 'best_single' || raw === 'default') {
    return raw
  }
  return 'editor_mp4'
}

export function parseYtdlpSubtitlePreset(raw: unknown): YtdlpSubtitlePresetId {
  if (raw === 'manual' || raw === 'manual_auto') {
    return raw
  }
  return 'none'
}

export function parseYtdlpCookiesBrowser(raw: unknown): YtdlpCookiesBrowserId | undefined {
  if (raw === 'chrome' || raw === 'edge' || raw === 'firefox') {
    return raw
  }
  return undefined
}

export function parseYtdlpImpersonate(raw: unknown): YtdlpImpersonateId | undefined {
  if (raw === 'chrome' || raw === 'edge' || raw === 'firefox') {
    return raw
  }
  return undefined
}

/** Проверка перед сохранением пути и после диалога выбора файла §6.2. */
export function validateYtdlpCookiesFilePath(
  raw: string
): { ok: true; path: string } | { ok: false; error: string } {
  const t = raw.trim()
  if (t.length === 0) {
    return { ok: false, error: 'Путь к файлу cookies пуст.' }
  }
  if (t.length > 4096) {
    return { ok: false, error: 'Путь слишком длинный.' }
  }
  const n = normalize(t)
  if (!isAbsolute(n)) {
    return { ok: false, error: 'Нужен абсолютный путь к файлу cookies.' }
  }
  if (!existsSync(n)) {
    return { ok: false, error: 'Файл cookies не найден.' }
  }
  try {
    if (!statSync(n).isFile()) {
      return { ok: false, error: 'Указанный путь не является файлом.' }
    }
  } catch {
    return { ok: false, error: 'Не удалось прочитать файл cookies.' }
  }
  return { ok: true, path: n }
}

/** Одна строка без пробелов — станет вторым токеном после `--sub-langs`. */
export function validateYtdlpSubLangs(
  raw: string
): { ok: true; value: string } | { ok: false; error: string } {
  const t = raw.trim()
  if (t.length === 0) {
    return { ok: true, value: '' }
  }
  if (t.length > 160) {
    return { ok: false, error: 'Строка --sub-langs слишком длинная (макс. 160 символов).' }
  }
  if (!/^[a-zA-Z0-9.,*+\-_]+$/.test(t)) {
    return {
      ok: false,
      error: 'Для --sub-langs допустимы только буквы, цифры и символы ,.*+-_'
    }
  }
  return { ok: true, value: t }
}

export function validateYtdlpRateLimit(
  raw: string
): { ok: true; value: string } | { ok: false; error: string } {
  const t = raw.trim()
  if (t.length === 0) {
    return { ok: true, value: '' }
  }
  if (t.length > 16) {
    return { ok: false, error: 'Ограничение скорости слишком длинное.' }
  }
  if (!/^\d+(?:\.\d+)?[KMG]?$/i.test(t)) {
    return {
      ok: false,
      error: 'Формат скорости: число и необязательный суффикс K/M/G, например 500K или 2M.'
    }
  }
  return { ok: true, value: t.toUpperCase() }
}

export function validateYtdlpRetriesLine(
  raw: string
): { ok: true; value: number | null; line: string } | { ok: false; error: string } {
  const t = raw.trim()
  if (t.length === 0) {
    return { ok: true, value: null, line: '' }
  }
  if (!/^\d+$/.test(t)) {
    return { ok: false, error: 'Количество повторов должно быть целым числом от 0 до 99.' }
  }
  const n = Number(t)
  if (!Number.isInteger(n) || n < 0 || n > 99) {
    return { ok: false, error: 'Количество повторов должно быть целым числом от 0 до 99.' }
  }
  return { ok: true, value: n, line: String(n) }
}

export function validateYtdlpFragmentRetriesLine(
  raw: string
): { ok: true; value: number | null; line: string } | { ok: false; error: string } {
  const parsed = validateYtdlpRetriesLine(raw)
  if (parsed.ok) {
    return parsed
  }
  return { ok: false, error: 'Количество повторов фрагментов должно быть целым числом от 0 до 99.' }
}

/** Строковые поля из JSON без семантической проверки шаблона — см. validateFilenameTemplate. */
export function parseYtdlpFilenameTemplateStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const t = raw.trim()
  if (t.length === 0) {
    return undefined
  }
  return t.length <= 480 ? t : t.slice(0, 480)
}

function hasParentDirSegment(template: string): boolean {
  return template.split(/[/\\]/).some((seg) => seg === '..')
}

function forbiddenTrajectory(template: string): boolean {
  if (hasParentDirSegment(template)) {
    return true
  }
  if (/[\r\n\0]/.test(template)) {
    return true
  }
  if (/^[a-zA-Z]:[\\/]/.test(template)) {
    return true
  }
  if (template.startsWith('/') || template.startsWith('\\')) {
    return true
  }
  return false
}

/** `-o` только под каталог вывода: путь не должен «выходить» из outputDir после resolve. */
export function resolveSafeYtdlpOutputPattern(outputDir: string, template: string): string | null {
  const t = template.trim()
  if (t.length === 0 || t.length > 480) {
    return null
  }
  if (forbiddenTrajectory(t)) {
    return null
  }
  if (!t.includes('%(ext)s')) {
    return null
  }
  const root = resolve(outputDir)
  const segments = t.split(/[/\\]/).filter((s) => s.length > 0)
  const joined = segments.length === 0 ? root : resolve(normalize(join(outputDir, ...segments)))
  const rel = relative(root, joined)
  if (rel.startsWith('..') || rel.includes(`..${sep}`)) {
    return null
  }
  return joined
}

export function validateFilenameTemplate(
  template: string
): { ok: true; value: string } | { ok: false; error: string } {
  const t = template.trim()
  if (t.length === 0) {
    return { ok: false, error: 'Шаблон имени не может быть пустым.' }
  }
  if (t.length > 480) {
    return { ok: false, error: 'Шаблон слишком длинный (макс. 480 символов).' }
  }
  if (forbiddenTrajectory(t)) {
    return {
      ok: false,
      error: 'Недопустимые символы или попытка выхода из каталога (.., абсолютный путь).'
    }
  }
  if (!t.includes('%(ext)s')) {
    return {
      ok: false,
      error: 'Шаблон должен содержать %(ext)s — иначе yt-dlp не сможет подставить расширение.'
    }
  }
  return { ok: true, value: t }
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

export function buildYtdlpRunOptionsSnapshot(settings: AppSettings): YtdlpRunOptionsSnapshot {
  const preset = parseYtdlpFormatPreset(settings.ytdlpFormatPreset)
  const audioOnly = settings.ytdlpAudioOnly === true
  const subtitlePreset = parseYtdlpSubtitlePreset(settings.ytdlpSubtitlePreset)
  const subLangsStored =
    typeof settings.ytdlpSubLangs === 'string' ? settings.ytdlpSubLangs.trim() : ''
  const subLangsParsed = validateYtdlpSubLangs(subLangsStored)
  const subLangs =
    subtitlePreset !== 'none' && subLangsParsed.ok && subLangsParsed.value.length > 0
      ? subLangsParsed.value
      : ''
  const subLangsLine = subLangsParsed.ok ? subLangsParsed.value : ''
  const stored = settings.ytdlpFilenameTemplate
  let filenameTemplate = YTDLP_DEFAULT_FILENAME_TEMPLATE
  if (typeof stored === 'string') {
    const vt = validateFilenameTemplate(stored)
    if (vt.ok) {
      filenameTemplate = vt.value
    }
  }
  const extraArgsLine =
    typeof settings.ytdlpExtraArgsLine === 'string' ? settings.ytdlpExtraArgsLine.trim() : ''
  const parsedExtras = parseExtraYtdlpArgsLine(extraArgsLine)
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
      cookiesWarning =
        'Путь к cookies не абсолютный — выберите файл через «Выбрать…» или очистите поле.'
    } else if (!existsSync(n)) {
      cookiesFileBroken = true
      cookiesWarning =
        'Файл cookies не найден — исправьте путь или очистите; браузерный источник до исправления не используется.'
    } else {
      try {
        if (!statSync(n).isFile()) {
          cookiesFileBroken = true
          cookiesWarning =
            'Путь cookies не указывает на обычный файл; браузерный источник до исправления не используется.'
        } else {
          cookiesArgvFile = n
        }
      } catch {
        cookiesFileBroken = true
        cookiesWarning =
          'Не удалось проверить файл cookies; браузерный источник до исправления не используется.'
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

  const impersonateParsed = parseYtdlpImpersonate(settings.ytdlpImpersonate)
  const impersonateTarget: YtdlpImpersonateId | null =
    impersonateParsed !== undefined ? impersonateParsed : null
  const impersonateChoice: 'none' | YtdlpImpersonateId =
    impersonateParsed !== undefined ? impersonateParsed : 'none'

  const rateLimitStored =
    typeof settings.ytdlpRateLimit === 'string' ? settings.ytdlpRateLimit.trim() : ''
  const rateLimitParsed = validateYtdlpRateLimit(rateLimitStored)
  const rateLimit = rateLimitParsed.ok ? rateLimitParsed.value : ''
  const retriesParsed = validateYtdlpRetriesLine(
    typeof settings.ytdlpRetries === 'number' && Number.isInteger(settings.ytdlpRetries)
      ? String(settings.ytdlpRetries)
      : ''
  )
  const retries = retriesParsed.ok ? retriesParsed.value : null
  const retriesLine = retriesParsed.ok ? retriesParsed.line : ''
  const fragmentRetriesParsed = validateYtdlpFragmentRetriesLine(
    typeof settings.ytdlpFragmentRetries === 'number' &&
      Number.isInteger(settings.ytdlpFragmentRetries)
      ? String(settings.ytdlpFragmentRetries)
      : ''
  )
  const fragmentRetries = fragmentRetriesParsed.ok ? fragmentRetriesParsed.value : null
  const fragmentRetriesLine = fragmentRetriesParsed.ok ? fragmentRetriesParsed.line : ''

  const queueRetryProfile = parseYtdlpQueueRetryProfile(settings.ytdlpQueueRetryProfile)
  const openInHandlerOnComplete = settings.ytdlpOpenInHandlerOnComplete === true

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
    cookiesFilePathStored: cookiesFileStored,
    cookiesBrowserChoice,
    cookiesWarning,
    impersonateTarget,
    impersonateChoice,
    rateLimit,
    retries,
    retriesLine,
    fragmentRetries,
    fragmentRetriesLine,
    queueRetryProfile,
    openInHandlerOnComplete
  }
}

export function payloadFromSnapshot(
  snap: YtdlpRunOptionsSnapshot,
  previewCtx?: YtdlpCommandPreviewContext
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
  const commandHints = getYtdlpCommandHints()
  return {
    filenameTemplate: snap.filenameTemplate,
    defaultFilenameTemplate: YTDLP_DEFAULT_FILENAME_TEMPLATE,
    formatPreset: snap.formatPreset,
    formatPresetChoices: [
      { id: 'editor_mp4', label: 'MP4 для редактора (H.264/AAC)' },
      { id: 'default', label: 'По умолчанию (yt-dlp)' },
      { id: 'merge_bv_ba', label: 'Лучшее видео + аудио (слить)' },
      { id: 'best_single', label: 'Лучший один файл (-f best)' }
    ],
    downloadPlaylist: snap.downloadPlaylist,
    audioOnly: snap.audioOnly,
    subtitlePreset: snap.subtitlePreset,
    subLangsLine: snap.subLangsLine,
    extraArgsLine: snap.extraArgsLine,
    commandPreview,
    extraArgsParseWarning: snap.extraArgsParseWarning,
    commandHints,
    cookiesBrowserChoice: snap.cookiesBrowserChoice,
    cookiesFilePathStored: snap.cookiesFilePathStored,
    cookiesWarning: snap.cookiesWarning,
    impersonateChoice: snap.impersonateChoice,
    rateLimit: snap.rateLimit,
    retriesLine: snap.retriesLine,
    fragmentRetriesLine: snap.fragmentRetriesLine,
    queueRetryProfile: snap.queueRetryProfile,
    queueRetryProfileChoices: [
      { id: 'off', label: 'Выключено' },
      { id: 'light', label: 'Лёгкий (1 повтор, 2.5 с)' },
      { id: 'normal', label: 'Обычный (2 повтора: 3 с + 8 с)' },
      { id: 'persistent', label: 'Устойчивый (3 повтора: 5 с + 15 с + 45 с)' }
    ],
    openInHandlerOnComplete: snap.openInHandlerOnComplete
  }
}
