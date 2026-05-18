import { normalize, resolve } from 'path'

import { getMainApplicationStrings } from '../shared/main-application-locale'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER, type TerminalToolId } from '../shared/terminal-contract'
import {
  TERMINAL_ALLOWED_TOOLS,
  TERMINAL_MAX_LINE_CHARS,
  TERMINAL_MAX_OUTPUT_CHARS,
  TERMINAL_MAX_TOKENS
} from './terminal-service-constants'

type MainAppCopy = ReturnType<typeof getMainApplicationStrings>

function terminalTokenHasDangerChars(token: string): boolean {
  for (let i = 0; i < token.length; i++) {
    const code = token.charCodeAt(i)
    if ((code >= 0 && code < 32) || code === 127) {
      return true
    }
  }
  return /[;|&$\u0060<>]/.test(token)
}

function validateTerminalArgTokens(
  args: string[],
  S: MainAppCopy
): { ok: true } | { ok: false; error: string } {
  for (const token of args) {
    if (token.length > 500) {
      return { ok: false, error: S.terminalArgvTokenTooLong }
    }
    if (token.startsWith('@')) {
      return { ok: false, error: S.terminalAtFileDisallowed }
    }
    if (terminalTokenHasDangerChars(token)) {
      return { ok: false, error: S.terminalDangerChars }
    }
  }
  return { ok: true }
}

export function parseTerminalCommandLine(
  raw: unknown,
  S: MainAppCopy
): { ok: true; tool: TerminalToolId; args: string[] } | { ok: false; error: string } {
  if (typeof raw !== 'string') {
    return { ok: false, error: S.terminalCommandMustBeString }
  }
  const line = raw.trim()
  if (line.length === 0) {
    return { ok: false, error: S.terminalEnterCommand }
  }
  if (line.length > TERMINAL_MAX_LINE_CHARS) {
    return {
      ok: false,
      error: S.terminalCommandTooLong.replace(/\{max\}/g, String(TERMINAL_MAX_LINE_CHARS))
    }
  }
  if (/["']/.test(line)) {
    return {
      ok: false,
      error: S.terminalQuotesDisallowed
    }
  }
  const tokens = line.split(/\s+/).filter(Boolean)
  if (tokens.length === 0) {
    return { ok: false, error: S.terminalEnterCommand }
  }
  if (tokens.length > TERMINAL_MAX_TOKENS) {
    return {
      ok: false,
      error: S.terminalTooManyArgs.replace(/\{max\}/g, String(TERMINAL_MAX_TOKENS))
    }
  }
  const toolToken = tokens[0] ?? ''
  const tool = toolToken.toLowerCase() as TerminalToolId
  if (!TERMINAL_ALLOWED_TOOLS.includes(tool)) {
    return { ok: false, error: S.terminalAllowedToolsOnly }
  }
  const args = tokens.slice(1)
  const v = validateTerminalArgTokens(args, S)
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
  strings?: MainAppCopy
}): { ok: true; args: string[] } | { ok: false; error: string } {
  const { args, currentFilePath, grantPath } = params
  const S = params.strings ?? getMainApplicationStrings('ru')
  if (!args.some((a) => a === TERMINAL_CURRENT_FILE_PLACEHOLDER)) {
    return { ok: true, args }
  }
  if (typeof currentFilePath !== 'string' || currentFilePath.trim().length === 0) {
    return {
      ok: false,
      error: S.terminalCurrentFileNeedsPreview
    }
  }
  const abs = resolve(normalize(currentFilePath.trim()))
  if (!grantPath(abs)) {
    return {
      ok: false,
      error: S.terminalCurrentFileNotGranted
    }
  }
  const next = args.map((a) => (a === TERMINAL_CURRENT_FILE_PLACEHOLDER ? abs : a))
  const v2 = validateTerminalArgTokens(next, S)
  if (!v2.ok) {
    return v2
  }
  return { ok: true, args: next }
}

export function trimTerminalOutput(text: string): string {
  return text.length <= TERMINAL_MAX_OUTPUT_CHARS
    ? text
    : `${text.slice(0, TERMINAL_MAX_OUTPUT_CHARS)}\n… truncated …`
}
