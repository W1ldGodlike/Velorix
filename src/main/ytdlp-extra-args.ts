/**
 * §6.3 — дополнительные аргументы yt-dlp: только токены для spawn (без shell),
 * жёсткая фильтрация опасных символов и конфликтующих ключей с основным конвейером.
 */

import type {
  YtdlpCookiesBrowserId,
  YtdlpImpersonateId,
  YtdlpSubtitlePresetId
} from '../shared/ytdlp-download-contract'

export type {
  YtdlpCookiesBrowserId,
  YtdlpImpersonateId,
  YtdlpSubtitlePresetId
} from '../shared/ytdlp-download-contract'

const YTDLP_COOKIES_BROWSER_PROFILE_MAX_LEN = 200

function cookiesBrowserProfileHasControlChars(s: string): boolean {
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i)
    if ((code >= 0 && code < 32) || code === 127) {
      return true
    }
  }
  return false
}

/** §6.2 — суффикс `BROWSER:…` для `--cookies-from-browser` (один argv-токен после сборки). */
export function validateYtdlpCookiesBrowserProfile(
  raw: string
): { ok: true; value: string } | { ok: false; error: string } {
  const t = raw.trim()
  if (t.length === 0) {
    return { ok: true, value: '' }
  }
  if (t.length > YTDLP_COOKIES_BROWSER_PROFILE_MAX_LEN) {
    return {
      ok: false,
      error: `Профиль браузера для cookies слишком длинный (макс. ${YTDLP_COOKIES_BROWSER_PROFILE_MAX_LEN} символов).`
    }
  }
  if (cookiesBrowserProfileHasControlChars(t)) {
    return {
      ok: false,
      error: 'Профиль браузера для cookies не должен содержать управляющие символы.'
    }
  }
  return { ok: true, value: t }
}

/** ASCII control + классический shell-/Injection-мусор (без `\x..` в RegExp — см. eslint no-control-regex). */
function tokenHasDangerChars(token: string): boolean {
  for (let i = 0; i < token.length; i++) {
    const code = token.charCodeAt(i)
    if ((code >= 0 && code < 32) || code === 127) {
      return true
    }
  }
  return /[;|&$\u0060<>\\"']/.test(token)
}

/** Лимиты защиты от «простыней» и раздува командной строки. */
const MAX_LINE_CHARS = 1800
const MAX_TOKENS = 48
const MAX_TOKEN_CHARS = 400

const FORBIDDEN_RUNTIME_OPTIONS = [
  '--exec',
  '--exec-before-download',
  '--use-postprocessor',
  '--postprocessor-args',
  '--ppa',
  '--external-downloader',
  '--downloader',
  '--external-downloader-args',
  '--config-location',
  '--config-locations',
  '--plugin-dirs',
  '--ffmpeg-location',
  '--paths',
  '--enable-file-urls'
] as const

function tokenIsOption(token: string, option: string): boolean {
  return token === option || token.startsWith(`${option}=`)
}

function tokenIsShortOptionWithAttachedValue(token: string, option: string): boolean {
  return token.length > option.length && token.startsWith(option)
}

function tokenViolationReason(token: string): string | null {
  if (token.length > MAX_TOKEN_CHARS) {
    return `Токен длиннее ${MAX_TOKEN_CHARS} символов.`
  }
  if (tokenHasDangerChars(token)) {
    return 'Запрещены символы для shell (; | & ` кавычки и т.п.).'
  }
  if (token.startsWith('@')) {
    return 'Аргументы вида @файл запрещены.'
  }
  // `-P` — case-sensitive short option в yt-dlp. Python argparse принимает и glued-форму
  // `-Ptemp:/path`, поэтому ловим её до toLowerCase вместе с обычными `-P` / `-P=`.
  if (
    token === '-P' ||
    token.startsWith('-P=') ||
    tokenIsShortOptionWithAttachedValue(token, '-P')
  ) {
    return 'Каталоги вывода задаются настройками FluxAlloy; -P/--paths запрещены.'
  }
  const low = token.toLowerCase()
  if (
    low === '-o' ||
    low === '--output' ||
    low.startsWith('-o=') ||
    low.startsWith('--output=') ||
    tokenIsShortOptionWithAttachedValue(low, '-o')
  ) {
    return 'Шаблон вывода задаётся полем выше; не дублируйте -o/--output.'
  }
  if (
    low === '-a' ||
    low === '--batch-file' ||
    low.startsWith('--batch-file=') ||
    tokenIsShortOptionWithAttachedValue(low, '-a')
  ) {
    return 'Пакетные файлы (-a/--batch-file) здесь запрещены.'
  }
  if (low === '--cookies' || low.startsWith('--cookies=')) {
    return 'Cookies задаются в блоке §6.2; не дублируйте --cookies.'
  }
  if (low === '--cookies-from-browser' || low.startsWith('--cookies-from-browser=')) {
    return 'Источник cookies задаётся в §6.2; не дублируйте --cookies-from-browser.'
  }
  if (low === '--impersonate' || low.startsWith('--impersonate=')) {
    return 'Импersonate задаётся в блоке §6.2; не дублируйте --impersonate.'
  }
  if (low === '--limit-rate' || low.startsWith('--limit-rate=')) {
    return 'Ограничение скорости задаётся отдельным полем §6.2; не дублируйте --limit-rate.'
  }
  if (low === '-r' || tokenIsShortOptionWithAttachedValue(low, '-r')) {
    return 'Ограничение скорости задаётся отдельным полем §6.2; не дублируйте -r.'
  }
  if (low === '--retries' || low.startsWith('--retries=')) {
    return 'Количество повторов задаётся отдельным полем §6.2; не дублируйте --retries.'
  }
  if (low === '--fragment-retries' || low.startsWith('--fragment-retries=')) {
    return 'Повторы фрагментов задаются отдельным полем §6.4; не дублируйте --fragment-retries.'
  }
  const forbidden = FORBIDDEN_RUNTIME_OPTIONS.find((opt) => tokenIsOption(low, opt))
  if (forbidden) {
    return `Флаг ${forbidden} запрещён в доп. аргументах: он может запускать внешние команды, менять runtime-пути или подгружать конфигурацию.`
  }
  return null
}

/**
 * Разбор одной строки «экспертных» аргументов (пробелы между токенами).
 * Не поддерживаем кавычки с пробелами — сознательно, чтобы не имитировать shell.
 */
export function parseExtraYtdlpArgsLine(
  raw: string
): { ok: true; args: string[] } | { ok: false; error: string } {
  const line = raw.trim()
  if (line.length === 0) {
    return { ok: true, args: [] }
  }
  if (line.length > MAX_LINE_CHARS) {
    return { ok: false, error: `Строка длиннее ${MAX_LINE_CHARS} символов.` }
  }
  const parts = line.split(/\s+/).filter((s) => s.length > 0)
  if (parts.length > MAX_TOKENS) {
    return { ok: false, error: `Слишком много аргументов (макс. ${MAX_TOKENS}).` }
  }
  for (const p of parts) {
    const why = tokenViolationReason(p)
    if (why !== null) {
      return { ok: false, error: why }
    }
  }
  return { ok: true, args: parts }
}

/** Человекочитаемая строка для превью (не для shell). */
export function formatArgvTokensForPreview(tokens: string[]): string {
  return tokens
    .map((t) => {
      if (/[\s"]/.test(t)) {
        return `"${t.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
      }
      return t
    })
    .join(' ')
}

/** Полный argv yt-dlp без пути к exe §6 / §6.3. */
export function buildYtdlpSpawnArgvTokens(params: {
  downloadPlaylist: boolean
  audioOnly: boolean
  /** §6.2: только фиксированные комбинации; произвольный текст — через доп. argv. */
  subtitlePreset: YtdlpSubtitlePresetId
  /** Уже проверенная строка для одного токена `--sub-langs`; пусто — ключ не добавляем. */
  subLangs: string
  /** Файл Netscape cookies; приоритетнее `cookiesBrowser`. */
  cookiesFile: string | null
  /** `--cookies-from-browser`, если файла нет; без суффикса профиля. */
  cookiesBrowser: YtdlpCookiesBrowserId | null
  /** §6.2 — суффикс после `BROWSER:` (профиль/контейнер); только если `cookiesBrowser` задан. */
  cookiesBrowserProfile: string | null
  /** §6.2 `--impersonate` только для whitelist-клиентов; поддержка зависит от сборки yt-dlp. */
  impersonateTarget: YtdlpImpersonateId | null
  /** §6.2 `--limit-rate`: уже проверенный один argv-токен вроде `500K`, `2M`; пусто — без лимита. */
  rateLimit: string
  /** §6.2 `--retries`: число повторов, `null` — значение yt-dlp по умолчанию. */
  retries: number | null
  /** §6.4 `--fragment-retries`: число повторов фрагментов, `null` — значение yt-dlp по умолчанию. */
  fragmentRetries: number | null
  formatExtraArgs: string[]
  extraArgs: string[]
  outputPattern: string
  url: string
}): string[] {
  const args: string[] = ['--newline', '--no-color', '--encoding', 'utf-8']
  args.push(params.downloadPlaylist ? '--yes-playlist' : '--no-playlist')
  const cf = params.cookiesFile?.trim()
  if (cf) {
    args.push('--cookies', cf)
  } else if (params.cookiesBrowser) {
    const prof = (params.cookiesBrowserProfile ?? '').trim()
    const spec =
      prof.length > 0 ? `${params.cookiesBrowser}:${prof}` : params.cookiesBrowser
    args.push('--cookies-from-browser', spec)
  }
  if (params.impersonateTarget) {
    args.push('--impersonate', params.impersonateTarget)
  }
  args.push(...params.formatExtraArgs)
  const sub = params.subtitlePreset ?? 'none'
  if (sub === 'manual') {
    args.push('--write-subs')
  } else if (sub === 'manual_auto') {
    args.push('--write-subs', '--write-auto-subs')
  }
  const langs = (params.subLangs ?? '').trim()
  if (sub !== 'none' && langs.length > 0) {
    args.push('--sub-langs', langs)
  }
  if (params.audioOnly) {
    args.push('-x', '--audio-format', 'best')
  }
  const rate = params.rateLimit.trim()
  if (rate.length > 0) {
    args.push('--limit-rate', rate)
  }
  if (params.retries !== null) {
    args.push('--retries', String(params.retries))
  }
  if (params.fragmentRetries !== null) {
    args.push('--fragment-retries', String(params.fragmentRetries))
  }
  args.push(...params.extraArgs)
  args.push('-o', params.outputPattern, params.url)
  return args
}
