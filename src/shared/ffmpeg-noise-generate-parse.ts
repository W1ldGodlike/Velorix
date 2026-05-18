/** Парсинг запроса генератора шума/тишины §17. */

import type { MediaUtilitiesNoiseKind } from './media-utilities-contract'

const NOISE_KINDS: readonly MediaUtilitiesNoiseKind[] = ['white', 'pink', 'silence']

export const MEDIA_UTILITIES_NOISE_DURATION_SEC_MIN = 0.1
export const MEDIA_UTILITIES_NOISE_DURATION_SEC_MAX = 3600

export function parseMediaUtilitiesNoiseKind(raw: unknown): MediaUtilitiesNoiseKind | null {
  if (typeof raw !== 'string') {
    return null
  }
  const v = raw.trim() as MediaUtilitiesNoiseKind
  return NOISE_KINDS.includes(v) ? v : null
}

export function parseMediaUtilitiesNoiseDurationSec(raw: unknown): number | null {
  const n =
    typeof raw === 'number'
      ? raw
      : typeof raw === 'string'
        ? Number.parseFloat(raw.trim())
        : Number.NaN
  if (
    !Number.isFinite(n) ||
    n < MEDIA_UTILITIES_NOISE_DURATION_SEC_MIN ||
    n > MEDIA_UTILITIES_NOISE_DURATION_SEC_MAX
  ) {
    return null
  }
  return Math.round(n * 1000) / 1000
}
