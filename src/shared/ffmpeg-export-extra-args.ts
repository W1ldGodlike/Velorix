/**
 * §7.2 — дополнительные argv ffmpeg-экспорта (без shell), вставка перед выходным файлом.
 */

import type { DownloadsWindowUiLocale } from './downloads-window-ui-locale'
import { getFfmpegExportExtraArgsCopy } from './ffmpeg-export-extra-args-locale'

const MAX_LINE_CHARS = 1200
const MAX_TOKENS = 32
const MAX_TOKEN_CHARS = 256

const FORBIDDEN_PREFIXES = [
  '-i',
  '-y',
  '-n',
  '-hide_banner',
  '-loglevel',
  '-stats',
  '-ss',
  '-t',
  '-to',
  '-threads',
  '-vf',
  '-filter:v',
  '-filter:a',
  '-af',
  '-map',
  '-map_metadata',
  '-map_chapters',
  '-c',
  '-codec',
  '-c:v',
  '-c:a',
  '-c:s',
  '-f',
  '-hwaccel',
  '-movflags'
] as const

function tokenHasDangerChars(token: string): boolean {
  for (let i = 0; i < token.length; i++) {
    const code = token.charCodeAt(i)
    if ((code >= 0 && code < 32) || code === 127) {
      return true
    }
  }
  return /[;|&$\u0060<>\\"']/.test(token)
}

function tokenIsOption(token: string, option: string): boolean {
  const low = token.toLowerCase()
  const opt = option.toLowerCase()
  return low === opt || low.startsWith(`${opt}=`)
}

function tokenViolationReason(
  token: string,
  V: ReturnType<typeof getFfmpegExportExtraArgsCopy>
): string | null {
  if (token.length > MAX_TOKEN_CHARS) {
    return V.tokenTooLong(MAX_TOKEN_CHARS)
  }
  if (tokenHasDangerChars(token)) {
    return V.tokenDangerChars
  }
  if (token.startsWith('@')) {
    return V.tokenAtFile
  }
  const low = token.toLowerCase()
  for (const opt of FORBIDDEN_PREFIXES) {
    if (tokenIsOption(low, opt)) {
      return V.tokenForbidden(token)
    }
  }
  if (low === '-pass' || low.startsWith('-pass')) {
    return V.tokenForbidden(token)
  }
  return null
}

export function parseFfmpegExportExtraArgsLine(
  raw: string,
  uiLocale: DownloadsWindowUiLocale = 'ru'
): { ok: true; args: string[] } | { ok: false; error: string } {
  const V = getFfmpegExportExtraArgsCopy(uiLocale)
  const line = raw.trim()
  if (line.length === 0) {
    return { ok: true, args: [] }
  }
  if (line.length > MAX_LINE_CHARS) {
    return { ok: false, error: V.lineTooLong(MAX_LINE_CHARS) }
  }
  const parts = line.split(/\s+/).filter((s) => s.length > 0)
  if (parts.length > MAX_TOKENS) {
    return { ok: false, error: V.tooManyTokens(MAX_TOKENS) }
  }
  for (const p of parts) {
    const why = tokenViolationReason(p, V)
    if (why !== null) {
      return { ok: false, error: why }
    }
  }
  return { ok: true, args: parts }
}

export function appendFfmpegExportExtraArgsToArgv(
  args: string[],
  extraArgs: readonly string[]
): void {
  for (const t of extraArgs) {
    if (t.length > 0) {
      args.push(t)
    }
  }
}
