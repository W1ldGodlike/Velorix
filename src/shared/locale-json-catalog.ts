/**
 * Post UI PURGE v3 — UI locale shards removed; restore with NEON ui-text rebuild.
 */
import { join } from 'node:path'

export const LOCALE_JSON_LOCALES = ['ru', 'en'] as const
export type LocaleJsonLocale = (typeof LOCALE_JSON_LOCALES)[number]

/** Empty until NEON rebuild. */
export const LOCALE_JSON_SHARDS = [] as const
export type LocaleJsonShard = (typeof LOCALE_JSON_SHARDS)[number]

export function parseLocaleJsonShard(raw: unknown): Record<string, string> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null
  }
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value !== 'string' || value.length === 0) {
      return null
    }
    out[key] = value
  }
  return out
}

export function localeJsonShardPath(locale: LocaleJsonLocale, shard: LocaleJsonShard): string {
  return join('locales', locale, `${shard}.json`)
}

export function formatLocaleJsonCatalogDiagnosticLines(): string[] {
  return ['catalog: (empty — UI PURGE v3)', `shards: ${LOCALE_JSON_SHARDS.length}`]
}
