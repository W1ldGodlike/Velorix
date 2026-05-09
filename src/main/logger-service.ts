import { appendFileSync, existsSync, mkdirSync, renameSync, statSync, unlinkSync } from 'fs'
import { dirname, join } from 'path'
import { app } from 'electron'

/**
 * §18 — простой файловый логгер main без внешних зависимостей.
 *
 * Назначение: чтобы при сбоях ffmpeg/yt-dlp/IPC у нас оставался след в `userData/logs/main.log`,
 * а не только эпизодические `console.error`. Логгер сознательно минимален:
 *
 * - запись синхронная (`appendFileSync`) — потеря строк после жёсткого падения нежелательна;
 * - один файл с ровно одним rotate-бэкапом (`main.log.1`) при превышении лимита размера;
 * - не блокирует стартап, если каталог недоступен — отвечает заглушками и пишет в `console`.
 *
 * Полноценный structured-logging / electron-log можно подключить позже, когда станет ясна
 * политика поддержки (support ZIP, удалённая отправка и т.д.). До этого момента нам важно
 * иметь стабильный текстовый лог с временной меткой и scope.
 */

export type LogLevel = 'info' | 'warn' | 'error'

const LOG_FILE_NAME = 'main.log'
const LOG_BACKUP_NAME = 'main.log.1'
const LOG_ROTATION_BYTES = 1_048_576 // 1 MiB достаточно для ручной диагностики; не растёт бесконтрольно
const RENDERER_MESSAGE_MAX = 4096
const RENDERER_SCOPE_MAX = 64

let resolvedLogFilePath: string | null = null
let initFailed = false
let processErrorReporter:
  | ((kind: 'uncaughtException' | 'unhandledRejection', reason: unknown) => void)
  | null = null

function levelLabel(level: LogLevel): string {
  if (level === 'info') return 'INFO '
  if (level === 'warn') return 'WARN '
  return 'ERROR'
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

function pad3(n: number): string {
  if (n < 10) return `00${n}`
  if (n < 100) return `0${n}`
  return `${n}`
}

/** ISO-подобная локальная метка с миллисекундами; UTC не используем — лог читает человек. */
function timestampNow(): string {
  const d = new Date()
  return (
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}` +
    ` ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}` +
    `.${pad3(d.getMilliseconds())}`
  )
}

function formatExtra(extra: unknown[]): string {
  if (extra.length === 0) {
    return ''
  }
  const parts: string[] = []
  for (const v of extra) {
    if (v instanceof Error) {
      const stack = v.stack ? v.stack.replace(/\s+$/u, '') : `${v.name}: ${v.message}`
      parts.push(stack)
    } else if (typeof v === 'string') {
      parts.push(v)
    } else {
      try {
        parts.push(JSON.stringify(v))
      } catch {
        parts.push(String(v))
      }
    }
  }
  return ` ${parts.join(' ')}`
}

function ensureLogFilePath(): string | null {
  if (resolvedLogFilePath !== null) {
    return resolvedLogFilePath
  }
  if (initFailed) {
    return null
  }
  try {
    const dir = join(app.getPath('userData'), 'logs')
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    resolvedLogFilePath = join(dir, LOG_FILE_NAME)
    return resolvedLogFilePath
  } catch {
    initFailed = true
    return null
  }
}

export function getMainLogFilePath(): string | null {
  return ensureLogFilePath()
}

export function getMainLogBackupFilePath(): string | null {
  const file = ensureLogFilePath()
  return file ? join(dirname(file), LOG_BACKUP_NAME) : null
}

function rotateIfTooLarge(filePath: string): void {
  try {
    if (!existsSync(filePath)) {
      return
    }
    const sz = statSync(filePath).size
    if (sz < LOG_ROTATION_BYTES) {
      return
    }
    const backup = join(dirname(filePath), LOG_BACKUP_NAME)
    if (existsSync(backup)) {
      try {
        unlinkSync(backup)
      } catch {
        /* старый бэкап мог быть открыт другим процессом — оставляем */
      }
    }
    renameSync(filePath, backup)
  } catch {
    /* любая проблема ротации не должна ронять запись новых строк */
  }
}

function sanitizeRendererText(raw: string, maxChars: number): string {
  let out = ''
  for (let i = 0; i < raw.length && out.length < maxChars; i++) {
    const code = raw.charCodeAt(i)
    out += (code >= 0 && code < 32) || code === 127 ? ' ' : raw[i]
  }
  return raw.length > maxChars ? `${out}…[truncated]` : out
}

function writeLine(level: LogLevel, scope: string, message: string, extra: unknown[]): void {
  const file = ensureLogFilePath()
  const line = `[${timestampNow()}] [${levelLabel(level)}] [${scope}] ${message}${formatExtra(
    extra
  )}\n`
  if (file !== null) {
    try {
      rotateIfTooLarge(file)
      appendFileSync(file, line, 'utf-8')
    } catch {
      initFailed = true
    }
  }
  // Дублируем в console: в dev пригодится, в prod не уйдёт никуда лишнего.
  if (level === 'error') {
    console.error(line.trimEnd())
  } else if (level === 'warn') {
    console.warn(line.trimEnd())
  } else {
    console.log(line.trimEnd())
  }
}

export function logInfo(scope: string, message: string, ...extra: unknown[]): void {
  writeLine('info', scope, message, extra)
}

export function logWarn(scope: string, message: string, ...extra: unknown[]): void {
  writeLine('warn', scope, message, extra)
}

export function logError(scope: string, message: string, ...extra: unknown[]): void {
  writeLine('error', scope, message, extra)
}

/** Безопасный приём записи из renderer/preload: whitelist уровней, лимиты длины и запрет log injection. */
export function logFromRendererSafe(raw: unknown): void {
  if (!raw || typeof raw !== 'object') {
    return
  }
  const o = raw as Record<string, unknown>
  const lvl = o['level']
  const level: LogLevel = lvl === 'error' ? 'error' : lvl === 'warn' ? 'warn' : 'info'
  const scopeRaw = typeof o['scope'] === 'string' ? o['scope'].trim() : ''
  const scope =
    scopeRaw.length === 0
      ? 'renderer'
      : `renderer/${sanitizeRendererText(scopeRaw, RENDERER_SCOPE_MAX)}`
  const msgRaw = typeof o['message'] === 'string' ? o['message'] : ''
  const message = sanitizeRendererText(msgRaw, RENDERER_MESSAGE_MAX)
  if (message.length === 0) {
    return
  }
  writeLine(level, scope, message, [])
}

/**
 * Подвязать перехват необработанных ошибок процесса.
 * Регистрируем на уровне модуля main: `ensureLogFilePath` лениво создаст `userData/logs`
 * только в момент реальной записи, зато ранние падения до `app.whenReady` не пропадут.
 */
export function attachProcessErrorHandlers(): void {
  process.on('uncaughtException', (err) => {
    logError('process', 'uncaughtException', err)
    processErrorReporter?.('uncaughtException', err)
  })
  process.on('unhandledRejection', (reason) => {
    logError('process', 'unhandledRejection', reason)
    processErrorReporter?.('unhandledRejection', reason)
  })
}

export function setProcessErrorReporter(
  reporter: ((kind: 'uncaughtException' | 'unhandledRejection', reason: unknown) => void) | null
): void {
  processErrorReporter = reporter
}

/** Один раз в начале сессии: версия и платформа — чтобы лог сам по себе говорил о среде. */
export function logStartupBanner(): void {
  try {
    const v = app.getVersion()
    const e = process.versions.electron ?? '?'
    const c = process.versions.chrome ?? '?'
    const n = process.versions.node ?? '?'
    logInfo(
      'startup',
      `FluxAlloy ${v} | Electron ${e} | Chrome ${c} | Node ${n} | ${process.platform}/${process.arch}`
    )
  } catch {
    /* стартовая запись не критична */
  }
}
