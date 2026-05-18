import type { EngineId } from './engine-contract'

/** Первая строка `--version` / `-version` → сравнимый токен версии. */
export function parseEngineVersionToken(id: EngineId, versionLine: string | null): string | null {
  if (versionLine == null || versionLine.trim() === '') {
    return null
  }
  const line = versionLine.trim()
  if (id === 'yt-dlp') {
    const dated = line.match(/(\d{4}\.\d{2}\.\d{2})/)
    if (dated?.[1]) {
      return dated[1]
    }
    const semver = line.match(/(\d+\.\d+(?:\.\d+)?)/)
    return semver?.[1] ?? line
  }
  const ff = line.match(/(?:ffmpeg|ffprobe)\s+version\s+(\d+\.\d+(?:\.\d+)?)/i)
  return ff?.[1] ?? null
}

function versionNumberParts(token: string): number[] {
  return token
    .split(/[^\d]+/)
    .filter((part) => part.length > 0)
    .map((part) => Number.parseInt(part, 10))
    .filter((n) => Number.isFinite(n))
}

/**
 * Сравнение версий движков: отрицательное — `left` старее, 0 — равны, положительное — `left` новее.
 * `null`, если сравнить нельзя.
 */
export function compareEngineVersionTokens(left: string | null, right: string | null): number | null {
  if (left == null || right == null) {
    return null
  }
  const a = versionNumberParts(left)
  const b = versionNumberParts(right)
  if (a.length === 0 || b.length === 0) {
    return null
  }
  const len = Math.max(a.length, b.length)
  for (let i = 0; i < len; i++) {
    const av = a[i] ?? 0
    const bv = b[i] ?? 0
    if (av !== bv) {
      return av < bv ? -1 : 1
    }
  }
  return 0
}

export function isEngineUpdateAvailable(
  current: string | null,
  latest: string | null
): boolean {
  if (latest == null || latest.trim() === '') {
    return false
  }
  if (current == null || current.trim() === '') {
    return true
  }
  const cmp = compareEngineVersionTokens(current, latest)
  return cmp === null ? false : cmp < 0
}
