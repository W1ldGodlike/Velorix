import { execFile } from 'child_process'
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from 'fs'
import { app } from 'electron'
import { is } from '@electron-toolkit/utils'
import { dirname, join, normalize, resolve } from 'path'

import type { AppPaths } from './app-paths'
import {
  resolveEngineExecutablePath,
  type EngineId,
  type EnginePathOverrides
} from './engine-service'
import { logInfo, logWarn } from './logger-service'
import { isGrantedMediaPath } from './media-protocol'
import {
  TERMINAL_CURRENT_FILE_PLACEHOLDER,
  type TerminalCommandHintEntry,
  type TerminalRunResult,
  type TerminalToolId
} from '../shared/terminal-contract'

const TERMINAL_ALLOWED_TOOLS: readonly TerminalToolId[] = ['ffmpeg', 'ffprobe', 'yt-dlp']
const MAX_LINE_CHARS = 2000
const MAX_TOKENS = 64
const MAX_OUTPUT_CHARS = 64_000
const TERMINAL_CLI_LOG_MAX_BYTES = 512 * 1024
const TERMINAL_CLI_LOG_KEEP_BYTES = 400 * 1024
const TERMINAL_CLI_LOG_STDERR_CAP = 12_000

/** Путь к журналу прогонов вкладки «Терминал» (`logs/` внутри userData). */
export function resolveTerminalCliSessionLogPath(userData: string): string {
  return join(userData, 'logs', 'terminal-cli.log')
}

/** §8 — журнал прогонов вкладки «Терминал» для Support ZIP (stderr и блокировки). */
export function appendTerminalCliSessionLog(params: {
  userData: string
  block: string
}): void {
  const { userData, block } = params
  try {
    const dir = join(userData, 'logs')
    mkdirSync(dir, { recursive: true })
    const file = resolveTerminalCliSessionLogPath(userData)
    if (existsSync(file)) {
      const st = statSync(file)
      if (st.size > TERMINAL_CLI_LOG_MAX_BYTES) {
        const raw = readFileSync(file)
        const head = Buffer.from(
          '[FluxAlloy] truncated older terminal-cli.log entries\n\n',
          'utf8'
        )
        const tail = raw.subarray(Math.max(0, raw.length - TERMINAL_CLI_LOG_KEEP_BYTES))
        writeFileSync(file, Buffer.concat([head, tail]))
      }
    }
    appendFileSync(file, block, 'utf8')
  } catch {
    /* Support / диагностика не должны ломать CLI */
  }
}

function terminalTokenHasDangerChars(token: string): boolean {
  for (let i = 0; i < token.length; i++) {
    const code = token.charCodeAt(i)
    if ((code >= 0 && code < 32) || code === 127) {
      return true
    }
  }
  return /[;|&$\u0060<>]/.test(token)
}

function validateTerminalArgTokens(args: string[]): { ok: true } | { ok: false; error: string } {
  for (const token of args) {
    if (token.length > 500) {
      return { ok: false, error: 'Один из argv-токенов слишком длинный.' }
    }
    if (token.startsWith('@')) {
      return { ok: false, error: 'Аргументы вида @файл запрещены.' }
    }
    if (terminalTokenHasDangerChars(token)) {
      return { ok: false, error: 'Запрещены shell-символы (; | & ` $ < >) и управляющие символы.' }
    }
  }
  return { ok: true }
}

function parseTerminalCommandLine(
  raw: unknown
): { ok: true; tool: TerminalToolId; args: string[] } | { ok: false; error: string } {
  if (typeof raw !== 'string') {
    return { ok: false, error: 'Команда должна быть строкой.' }
  }
  const line = raw.trim()
  if (line.length === 0) {
    return { ok: false, error: 'Введите команду.' }
  }
  if (line.length > MAX_LINE_CHARS) {
    return { ok: false, error: `Команда длиннее ${MAX_LINE_CHARS} символов.` }
  }
  if (/["']/.test(line)) {
    return {
      ok: false,
      error: 'Кавычки и shell-строки не поддерживаются: вводите argv-токены через пробел.'
    }
  }
  const tokens = line.split(/\s+/).filter(Boolean)
  if (tokens.length === 0) {
    return { ok: false, error: 'Введите команду.' }
  }
  if (tokens.length > MAX_TOKENS) {
    return { ok: false, error: `Слишком много аргументов (макс. ${MAX_TOKENS}).` }
  }
  const tool = tokens[0] as TerminalToolId
  if (!TERMINAL_ALLOWED_TOOLS.includes(tool)) {
    return { ok: false, error: 'Разрешены только префиксы ffmpeg, ffprobe и yt-dlp.' }
  }
  const args = tokens.slice(1)
  const v = validateTerminalArgTokens(args)
  if (!v.ok) {
    return v
  }
  return { ok: true, tool, args }
}

/**
 * Подстановка `TERMINAL_CURRENT_FILE_PLACEHOLDER` в argv; `grantPath` в проде — `isGrantedMediaPath`.
 * Экспорт для Vitest.
 */
export function resolveTerminalCurrentFileArgs(params: {
  args: string[]
  currentFilePath: string | null | undefined
  grantPath: (abs: string) => boolean
}): { ok: true; args: string[] } | { ok: false; error: string } {
  const { args, currentFilePath, grantPath } = params
  if (!args.some((a) => a === TERMINAL_CURRENT_FILE_PLACEHOLDER)) {
    return { ok: true, args }
  }
  if (typeof currentFilePath !== 'string' || currentFilePath.trim().length === 0) {
    return {
      ok: false,
      error: 'Токен __CURRENT_FILE__ требует открытый файл в превью редактора.'
    }
  }
  const abs = resolve(normalize(currentFilePath.trim()))
  if (!grantPath(abs)) {
    return {
      ok: false,
      error: 'Текущий файл превью не разрешён для подстановки в CLI (откройте его через диалог или DnD).'
    }
  }
  const next = args.map((a) => (a === TERMINAL_CURRENT_FILE_PLACEHOLDER ? abs : a))
  const v2 = validateTerminalArgTokens(next)
  if (!v2.ok) {
    return v2
  }
  return { ok: true, args: next }
}

function trimOutput(text: string): string {
  return text.length <= MAX_OUTPUT_CHARS ? text : `${text.slice(0, MAX_OUTPUT_CHARS)}\n… truncated …`
}

function terminalCliLogIsoStamp(): string {
  return new Date().toISOString()
}

export function runTerminalCommand(params: {
  paths: AppPaths
  overrides?: EnginePathOverrides | undefined
  line: unknown
  currentFilePath?: string | null
}): Promise<TerminalRunResult> {
  const ud = params.paths.userData
  const parsed = parseTerminalCommandLine(params.line)
  if (!parsed.ok) {
    if (typeof params.line === 'string' && params.line.trim().length > 0) {
      const brief = params.line.trim().slice(0, 400)
      logWarn('terminal', `blocked: ${parsed.error}`, brief)
      appendTerminalCliSessionLog({
        userData: ud,
        block: `\n=== ${terminalCliLogIsoStamp()} BLOCKED ===\n${brief}\n${parsed.error}\n`
      })
    }
    return Promise.resolve(parsed)
  }
  const sub = resolveTerminalCurrentFileArgs({
    args: parsed.args,
    currentFilePath: params.currentFilePath,
    grantPath: isGrantedMediaPath
  })
  if (!sub.ok) {
    if (typeof params.line === 'string' && params.line.trim().length > 0) {
      const brief = params.line.trim().slice(0, 400)
      logWarn('terminal', `blocked: ${sub.error}`, brief)
      appendTerminalCliSessionLog({
        userData: ud,
        block: `\n=== ${terminalCliLogIsoStamp()} BLOCKED ===\n${brief}\n${sub.error}\n`
      })
    }
    return Promise.resolve(sub)
  }
  const argv = sub.args
  const executablePath = resolveEngineExecutablePath(params.paths, parsed.tool, params.overrides)
  if (!executablePath) {
    logWarn('terminal', `blocked: движок ${parsed.tool} не найден`)
    appendTerminalCliSessionLog({
      userData: ud,
      block: `\n=== ${terminalCliLogIsoStamp()} BLOCKED ===\n${parsed.tool} …\nДвижок ${parsed.tool} не найден в настройках/bin.\n`
    })
    return Promise.resolve({
      ok: false,
      error: `Движок ${parsed.tool} не найден в настройках/bin.`
    })
  }
  const started = Date.now()
  return new Promise((resolve) => {
    execFile(
      executablePath,
      argv,
      {
        windowsHide: true,
        timeout: 120_000,
        maxBuffer: MAX_OUTPUT_CHARS * 4,
        env: {
          ...process.env,
          PATH: `${dirname(executablePath)}${process.platform === 'win32' ? ';' : ':'}${process.env['PATH'] ?? ''}`
        }
      },
      (error, stdout, stderr) => {
        const code =
          error && 'code' in error && typeof (error as { code?: unknown }).code === 'number'
            ? (error as { code: number }).code
            : error
              ? 1
              : 0
        const elapsedMs = Date.now() - started
        const argvBrief = JSON.stringify([parsed.tool, ...argv]).slice(0, 520)
        if (code === 0) {
          logInfo('terminal', `run ok tool=${parsed.tool} code=0 ${elapsedMs}ms`, argvBrief)
        } else {
          logWarn(
            'terminal',
            `run tool=${parsed.tool} code=${code ?? 'n/a'} ${elapsedMs}ms`,
            argvBrief,
            trimOutput(stderr).slice(0, 600)
          )
        }
        const errTail = trimOutput(stderr)
        const errForLog =
          errTail.length > TERMINAL_CLI_LOG_STDERR_CAP
            ? `${errTail.slice(0, TERMINAL_CLI_LOG_STDERR_CAP)}\n… stderr truncated …\n`
            : errTail
        appendTerminalCliSessionLog({
          userData: ud,
          block: `\n=== ${terminalCliLogIsoStamp()} code=${code ?? 'n/a'} tool=${parsed.tool} ${elapsedMs}ms ===\nargv: ${argvBrief}\nstderr:\n${errForLog.trim() ? errForLog : '(empty)'}\n`
        })
        resolve({
          ok: true,
          tool: parsed.tool,
          args: argv,
          code,
          stdout: trimOutput(stdout),
          stderr: trimOutput(stderr),
          elapsedMs
        })
      }
    )
  })
}

let hintsMemo: TerminalCommandHintEntry[] | undefined

function commandsJsonPath(fileName: string): string | null {
  const packaged = join(process.resourcesPath, 'Data', fileName)
  if (!is.dev && existsSync(packaged)) {
    return packaged
  }
  const dev = join(app.getAppPath(), 'Data', fileName)
  if (existsSync(dev)) {
    return dev
  }
  return existsSync(packaged) ? packaged : null
}

function readHints(fileName: string, fallbackTool: EngineId): TerminalCommandHintEntry[] {
  const path = commandsJsonPath(fileName)
  if (!path) {
    return []
  }
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf-8')) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }
    const out: TerminalCommandHintEntry[] = []
    for (const row of parsed) {
      if (!row || typeof row !== 'object') {
        continue
      }
      const src = row as { token?: unknown; summary?: unknown; tool?: unknown }
      const tool = TERMINAL_ALLOWED_TOOLS.includes(src.tool as TerminalToolId)
        ? (src.tool as TerminalToolId)
        : fallbackTool
      if (typeof src.token === 'string' && src.token.trim().length > 0) {
        out.push({
          token: src.token.trim().slice(0, 160),
          summary: typeof src.summary === 'string' ? src.summary.trim().slice(0, 600) : '',
          tool
        })
      }
    }
    return out
  } catch {
    return []
  }
}

export function getTerminalCommandHints(): TerminalCommandHintEntry[] {
  if (hintsMemo !== undefined) {
    return hintsMemo
  }
  hintsMemo = [
    ...readHints('ffmpeg_commands.json', 'ffmpeg'),
    ...readHints('ytdlp_commands.json', 'yt-dlp')
  ].sort((a, b) => a.tool.localeCompare(b.tool) || a.token.localeCompare(b.token, 'ru'))
  return hintsMemo
}

