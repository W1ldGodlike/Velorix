/**
 * §2.2 — канон строк в locales JSON-шардах; запрет legacy ui-text-strings-{ru|en}-NN.ts и дублей TS+JSON.
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fs from 'node:fs'
import path from 'node:path'

import { LOCALE_JSON_LOCALES } from '../src/shared/locale-json-catalog.ts'
import { REPO_ROOT } from './lib/repo-root.mjs'
import { parseUiTextTsPart } from './lib/parse-ui-text-ts-part.mjs'

const localesDir = path.join(REPO_ROOT, 'src/renderer/src/locales')
const LEGACY_PART_RE = /^ui-text-strings-(ru|en)-\d+\.ts$/

function loadJsonKeys(locale) {
  const keys = new Set()
  const dir = path.join(REPO_ROOT, 'locales', locale)
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.json')) {
      continue
    }
    const table = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
    for (const key of Object.keys(table)) {
      keys.add(key)
    }
  }
  return keys
}

let failed = false
for (const file of fs.readdirSync(localesDir)) {
  if (LEGACY_PART_RE.test(file)) {
    failed = true
    console.error(
      `[check:locales-ts-overlap] legacy part file banned: src/renderer/src/locales/${file} (use locales/**/*.json only)`
    )
  }
}

for (const locale of LOCALE_JSON_LOCALES) {
  const jsonKeys = loadJsonKeys(locale)
  const suffix = locale === 'ru' ? '-ru-' : '-en-'
  for (const file of fs.readdirSync(localesDir)) {
    if (!file.includes(suffix) || !file.endsWith('.ts')) {
      continue
    }
    const content = fs.readFileSync(path.join(localesDir, file), 'utf8')
    const overlap = [...parseUiTextTsPart(content).keys()].filter((k) => jsonKeys.has(k))
    if (overlap.length > 0) {
      failed = true
      console.error(
        `[check:locales-ts-overlap] ${file}: ${overlap.length} key(s) also in locales/${locale}/*.json`
      )
      console.error(`  e.g. ${overlap.slice(0, 8).join(', ')}`)
    }
  }
}

if (failed) {
  process.exit(1)
}
console.log('[check:locales-ts-overlap] OK (no TS/json duplicate keys)')
