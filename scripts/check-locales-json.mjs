/**
 * §2.2 — ru/en parity для `locales/{locale}/*.json`.
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { readFileSync } from 'node:fs'
import {
  LOCALE_JSON_LOCALES,
  LOCALE_JSON_SHARDS,
  localeJsonShardPath,
  parseLocaleJsonShard
} from '../src/shared/locale-json-catalog.ts'

const repoRoot = process.cwd()

function loadShard(locale, shard) {
  const path = localeJsonShardPath(repoRoot, locale, shard)
  let parsed
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8'))
  } catch (e) {
    throw new Error(`[check:locales-json] cannot read ${path}: ${e.message}`)
  }
  const table = parseLocaleJsonShard(parsed)
  if (table === null) {
    throw new Error(`[check:locales-json] invalid shard ${locale}/${shard}.json (non-empty strings only)`)
  }
  return table
}

function sortedKeys(obj) {
  return Object.keys(obj).sort()
}

let failed = false
for (const shard of LOCALE_JSON_SHARDS) {
  const tables = {}
  for (const locale of LOCALE_JSON_LOCALES) {
    tables[locale] = loadShard(locale, shard)
  }
  const ruKeys = sortedKeys(tables.ru)
  const enKeys = sortedKeys(tables.en)
  if (ruKeys.join('\0') !== enKeys.join('\0')) {
    console.error(`[check:locales-json] key mismatch in ${shard}.json`)
    console.error(`  ru: ${ruKeys.join(', ')}`)
    console.error(`  en: ${enKeys.join(', ')}`)
    failed = true
    continue
  }
  if (ruKeys.length === 0) {
    console.error(`[check:locales-json] empty shard ${shard}.json`)
    failed = true
  }
}

if (failed) {
  process.exit(1)
}
console.log(
  `[check:locales-json] OK (${LOCALE_JSON_SHARDS.length} shard(s), ${LOCALE_JSON_LOCALES.length} locales)`
)
