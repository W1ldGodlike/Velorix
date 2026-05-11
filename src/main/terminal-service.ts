import { execFile } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { app } from 'electron'
import { is } from '@electron-toolkit/utils'
import { dirname, join } from 'path'

import type { AppPaths } from './app-paths'
import {
  resolveEngineExecutablePath,
  type EngineId,
  type EnginePathOverrides
} from './engine-service'
import type {
  TerminalCommandHintEntry,
  TerminalRunResult,
  TerminalToolId
} from '../shared/terminal-contract'

const TERMINAL_ALLOWED_TOOLS: readonly TerminalToolId[] = ['ffmpeg', 'ffprobe', 'yt-dlp']
const MAX_LINE_CHARS = 2000
const MAX_TOKENS = 64
const MAX_OUTPUT_CHARS = 64_000

function terminalTokenHasDangerChars(token: string): boolean {
  for (let i = 0; i < token.length; i++) {
    const code = token.charCodeAt(i)
    if ((code >= 0 && code < 32) || code === 127) {
      return true
    }
  }
  return /[;|&$\u0060<>]/.test(token)
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
  return { ok: true, tool, args }
}

function trimOutput(text: string): string {
  return text.length <= MAX_OUTPUT_CHARS ? text : `${text.slice(0, MAX_OUTPUT_CHARS)}\n… truncated …`
}

export function runTerminalCommand(params: {
  paths: AppPaths
  overrides?: EnginePathOverrides | undefined
  line: unknown
}): Promise<TerminalRunResult> {
  const parsed = parseTerminalCommandLine(params.line)
  if (!parsed.ok) {
    return Promise.resolve(parsed)
  }
  const executablePath = resolveEngineExecutablePath(params.paths, parsed.tool, params.overrides)
  if (!executablePath) {
    return Promise.resolve({
      ok: false,
      error: `Движок ${parsed.tool} не найден в настройках/bin.`
    })
  }
  const started = Date.now()
  return new Promise((resolve) => {
    execFile(
      executablePath,
      parsed.args,
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
        resolve({
          ok: true,
          tool: parsed.tool,
          args: parsed.args,
          code,
          stdout: trimOutput(stdout),
          stderr: trimOutput(stderr),
          elapsedMs: Date.now() - started
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

