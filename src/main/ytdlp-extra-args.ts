/**
 * §6.3 — дополнительные аргументы yt-dlp: только токены для spawn (без shell),
 * жёсткая фильтрация опасных символов и конфликтующих ключей с основным конвейером.
 */

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
  const low = token.toLowerCase()
  if (low === '-o' || low === '--output' || low.startsWith('-o=') || low.startsWith('--output=')) {
    return 'Шаблон вывода задаётся полем выше; не дублируйте -o/--output.'
  }
  if (low === '-a' || low === '--batch-file' || low.startsWith('--batch-file=')) {
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

/** Белый список режимов субтитров §6.2 (без произвольных флагов в UI). */
export type YtdlpSubtitlePresetId = 'none' | 'manual' | 'manual_auto'

/** §6.2 — только распространённые движки для `--cookies-from-browser` (без произвольной строки профиля). */
export type YtdlpCookiesBrowserId = 'chrome' | 'edge' | 'firefox'

/** §6.2 — whitelist целей `--impersonate` без версионирования и произвольных строк клиента. */
export type YtdlpImpersonateId = 'chrome' | 'edge' | 'firefox'

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
  /** `--cookies-from-browser`, если файла нет. */
  cookiesBrowser: YtdlpCookiesBrowserId | null
  /** §6.2 `--impersonate` только для whitelist-клиентов; поддержка зависит от сборки yt-dlp. */
  impersonateTarget: YtdlpImpersonateId | null
  formatExtraArgs: string[]
  extraArgs: string[]
  outputPattern: string
  url: string
}): string[] {
  const args: string[] = ['--newline', '--no-color']
  args.push(params.downloadPlaylist ? '--yes-playlist' : '--no-playlist')
  const cf = params.cookiesFile?.trim()
  if (cf) {
    args.push('--cookies', cf)
  } else if (params.cookiesBrowser) {
    args.push('--cookies-from-browser', params.cookiesBrowser)
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
  args.push(...params.extraArgs)
  args.push('-o', params.outputPattern, params.url)
  return args
}
