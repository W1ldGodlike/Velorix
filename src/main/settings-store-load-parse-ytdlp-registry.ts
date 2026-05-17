import { isAbsolute, normalize } from 'path'

import { ENGINE_IDS, type EnginePathOverrides } from '../shared/engine-contract'
import { parseStoredWhitelistEnum } from '../shared/settings-stored-parse'
import { validateYtdlpCookiesBrowserProfile } from './ytdlp-extra-args'

export function parseEngineExecutablePaths(raw: unknown): EnginePathOverrides | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined
  }
  const src = raw as Record<string, unknown>
  const out: EnginePathOverrides = {}
  for (const id of ENGINE_IDS) {
    const v = src[id]
    if (typeof v === 'string' && v.trim() !== '') {
      out[id] = v.trim()
    }
  }
  return Object.keys(out).length > 0 ? out : undefined
}

export function parseYtdlpDownloadDirectory(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return undefined
  }
  const n = normalize(raw.trim())
  return isAbsolute(n) ? n : undefined
}

export function parseYtdlpFormatPresetStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return undefined
  }
  return raw.trim().slice(0, 64)
}

export function parseYtdlpExtraArgsLineStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const t = raw.trim()
  if (t.length === 0) {
    return undefined
  }
  return t.length <= 2000 ? t : t.slice(0, 2000)
}

export function parseYtdlpSubtitlePresetStored(raw: unknown): 'manual' | 'manual_auto' | undefined {
  return parseStoredWhitelistEnum(raw, ['manual', 'manual_auto'])
}

/** Только безопасный алфавит для одного argv-токена `--sub-langs` (без пробелов/shell). */
export function parseYtdlpSubLangsStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const t = raw.trim()
  if (t.length === 0 || t.length > 160) {
    return undefined
  }
  if (!/^[a-zA-Z0-9.,*+\-_]+$/.test(t)) {
    return undefined
  }
  return t
}

export function parseYtdlpCookiesFileStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return undefined
  }
  const n = normalize(raw.trim())
  if (!isAbsolute(n) || n.length > 4096) {
    return undefined
  }
  return n
}

export function parseYtdlpCookiesBrowserStored(
  raw: unknown
): 'chrome' | 'edge' | 'firefox' | undefined {
  return parseStoredWhitelistEnum(raw, ['chrome', 'edge', 'firefox'])
}

export function parseYtdlpCookiesBrowserProfileStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const v = validateYtdlpCookiesBrowserProfile(raw)
  if (!v.ok || v.value.length === 0) {
    return undefined
  }
  return v.value
}

export function parseYtdlpImpersonateStored(
  raw: unknown
): 'chrome' | 'edge' | 'firefox' | undefined {
  return parseStoredWhitelistEnum(raw, ['chrome', 'edge', 'firefox'])
}

export function parseYtdlpRateLimitStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const t = raw.trim()
  if (t.length === 0 || t.length > 16 || !/^\d+(?:\.\d+)?[KMG]?$/i.test(t)) {
    return undefined
  }
  return t.toUpperCase()
}

export function parseYtdlpRetriesStored(raw: unknown): number | undefined {
  if (typeof raw !== 'number' || !Number.isInteger(raw) || raw < 0 || raw > 99) {
    return undefined
  }
  return raw
}
