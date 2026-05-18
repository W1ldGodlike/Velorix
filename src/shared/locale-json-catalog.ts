/**
 * §2.2 — плоские каталоги `locales/{ru,en}/*.json` (канон ТЗ); guard и Support ZIP.
 */
import { join } from 'node:path'

export const LOCALE_JSON_LOCALES = ['ru', 'en'] as const
export type LocaleJsonLocale = (typeof LOCALE_JSON_LOCALES)[number]

/** Имена shard-файлов без `.json` (расширять при миграции из ui-text-strings). */
export const LOCALE_JSON_SHARDS = [
  'common',
  'about',
  'maintenance',
  'formatting',
  'knowledge',
  'terminal',
  'processing',
  'downloads',
  'workspace',
  'editor',
  'video',
  'mini',
  'downloads-settings',
  'shell',
  'editor-ffmpeg',
  'status',
  'batch-export',
  'settings',
  'inspector',
  'inspector-probe',
  'hw-manual-smoke',
  'win-packaged-manual-smoke',
  'linux-packaged-manual-smoke',
  'macos-packaged-manual-smoke',
  'workflow'
] as const
export type LocaleJsonShard = (typeof LOCALE_JSON_SHARDS)[number]

export function localeJsonShardPath(
  repoRoot: string,
  locale: LocaleJsonLocale,
  shard: LocaleJsonShard
): string {
  return join(repoRoot, 'locales', locale, `${shard}.json`)
}

export function parseLocaleJsonShard(raw: unknown): Record<string, string> | null {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    return null
  }
  const out: Record<string, string> = {}
  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof val !== 'string' || val.trim() === '') {
      return null
    }
    out[key] = val
  }
  return out
}

export function formatLocaleJsonCatalogDiagnosticLines(): string[] {
  return [
    'catalog: locales/ru/*.json + locales/en/*.json (flat string values)',
    `shards: ${LOCALE_JSON_SHARDS.join(', ')}`,
    'guard: npm run check:locales-json (ru/en key parity per shard)',
    'guard: npm run check:locales-ts-overlap (no duplicate keys in TS parts)',
    'renderer: buildUiTextTables + getUiTextTables; dev HMR reloadUiTextTablesFromModules',
    'docs: ARCHITECTURE.md § Локализация UI'
  ]
}
