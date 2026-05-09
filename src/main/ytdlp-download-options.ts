import { existsSync, statSync } from 'fs'
import { isAbsolute, join, normalize, relative, resolve, sep } from 'path'

import type { AppSettings } from './settings-store'
import {
  buildYtdlpSpawnArgvTokens,
  formatArgvTokensForPreview,
  parseExtraYtdlpArgsLine,
  type YtdlpCookiesBrowserId,
  type YtdlpSubtitlePresetId
} from './ytdlp-extra-args'
import { getYtdlpCommandHints, type YtdlpCommandHintEntry } from './ytdlp-commands-hints'

/** Шаблон по умолчанию совпадает с тем, что раньше был захардкожен в `runYtdlpOnce`. */
export const YTDLP_DEFAULT_FILENAME_TEMPLATE = '%(title)s [%(id)s].%(ext)s'

/**
 * Упрощённый выбор «качества» без произвольного `-f` от пользователя (иначе легко сломать
 * кавычками и порядком аргументов); только белый список параметров §6.2.
 */
export type YtdlpFormatPresetId = 'default' | 'merge_bv_ba' | 'best_single'

export type { YtdlpSubtitlePresetId, YtdlpCookiesBrowserId }

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
}

/** То, что видит окно загрузок: текущие значения и метки для `<select>`. */
export interface YtdlpDownloadOptionsPayload {
  filenameTemplate: string
  defaultFilenameTemplate: string
  formatPreset: YtdlpFormatPresetId
  formatPresetChoices: Array<{ id: YtdlpFormatPresetId; label: string }>
  downloadPlaylist: boolean
  audioOnly: boolean
  subtitlePreset: YtdlpSubtitlePresetId
  /** Редактируемое значение `--sub-langs` в окне загрузок. */
  subLangsLine: string
  extraArgsLine: string
  /** Превью полной командной строки (`yt-dlp …`), без реального пути и URL. */
  commandPreview: string
  extraArgsParseWarning: string | null
  /** Подсказки для поля доп. аргументов §6.3 (из `Data/ytdlp_commands.json`). */
  commandHints: YtdlpCommandHintEntry[]
  cookiesBrowserChoice: 'none' | YtdlpCookiesBrowserId
  cookiesFilePathStored: string
  cookiesWarning: string | null
}

export interface YtdlpDownloadOptionsPatch {
  filenameTemplate?: string
  formatPreset?: YtdlpFormatPresetId
  downloadPlaylist?: boolean
  audioOnly?: boolean
  subtitlePreset?: YtdlpSubtitlePresetId
  subLangs?: string
  /** §6.2 `none` или whitelist браузера; при сохранении отличного от «нет» сбрасывает файл cookies. */
  cookiesBrowser?: 'none' | YtdlpCookiesBrowserId
  extraArgsLine?: string
}

export function parseYtdlpFormatPreset(raw: unknown): YtdlpFormatPresetId {
  if (raw === 'merge_bv_ba' || raw === 'best_single' || raw === 'default') {
    return raw
  }
  return 'default'
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
    cookiesWarning
  }
}

export function payloadFromSnapshot(snap: YtdlpRunOptionsSnapshot): YtdlpDownloadOptionsPayload {
  const outPh = `<downloadDir>/${snap.filenameTemplate}`
  const argv = buildYtdlpSpawnArgvTokens({
    downloadPlaylist: snap.downloadPlaylist,
    audioOnly: snap.audioOnly,
    subtitlePreset: snap.subtitlePreset,
    subLangs: snap.subLangs,
    cookiesFile: snap.cookiesArgvFile,
    cookiesBrowser: snap.cookiesArgvBrowser,
    formatExtraArgs: snap.formatExtraArgs,
    extraArgs: snap.extraArgs,
    outputPattern: outPh,
    url: '<url>'
  })
  const commandPreview = `yt-dlp ${formatArgvTokensForPreview(argv)}`
  const commandHints = getYtdlpCommandHints()
  return {
    filenameTemplate: snap.filenameTemplate,
    defaultFilenameTemplate: YTDLP_DEFAULT_FILENAME_TEMPLATE,
    formatPreset: snap.formatPreset,
    formatPresetChoices: [
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
    cookiesWarning: snap.cookiesWarning
  }
}
