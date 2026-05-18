/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §3/§19 — win/linux/macos packaged-manual-smoke.json must expose the same Step_* keys (ru/en).
 */
import fs from 'node:fs'
import path from 'node:path'

import {
  PACKAGED_MANUAL_SMOKE_LOCALE_PREFIXES,
  PACKAGED_MANUAL_SMOKE_STEP_SUFFIXES,
  packagedManualSmokeStepLocaleKey
} from '../src/shared/packaged-manual-smoke-step-ids.ts'
import { LOCALE_JSON_LOCALES } from '../src/shared/locale-json-catalog.ts'
import { REPO_ROOT } from './lib/repo-root.mjs'

const SHARD_BY_PREFIX = {
  winPackagedSmoke: 'win-packaged-manual-smoke',
  linuxPackagedSmoke: 'linux-packaged-manual-smoke',
  macosPackagedSmoke: 'macos-packaged-manual-smoke'
}

function loadShard(locale, fileStem) {
  const file = path.join(REPO_ROOT, 'locales', locale, `${fileStem}.json`)
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

const requiredKeys = PACKAGED_MANUAL_SMOKE_LOCALE_PREFIXES.flatMap((prefix) =>
  PACKAGED_MANUAL_SMOKE_STEP_SUFFIXES.map((suffix) =>
    packagedManualSmokeStepLocaleKey(prefix, suffix)
  )
)

let failed = false
for (const locale of LOCALE_JSON_LOCALES) {
  for (const prefix of PACKAGED_MANUAL_SMOKE_LOCALE_PREFIXES) {
    const stem = SHARD_BY_PREFIX[prefix]
    const table = loadShard(locale, stem)
    const missing = requiredKeys
      .filter((key) => key.startsWith(`${prefix}Step_`))
      .filter((key) => typeof table[key] !== 'string' || table[key].trim() === '')
    if (missing.length > 0) {
      failed = true
      console.error(
        `[check:packaged-manual-smoke-parity] locales/${locale}/${stem}.json missing: ${missing.join(', ')}`
      )
    }
  }
}

if (failed) {
  process.exit(1)
}
console.log(
  `[check:packaged-manual-smoke-parity] OK (${PACKAGED_MANUAL_SMOKE_LOCALE_PREFIXES.length} platforms × ${PACKAGED_MANUAL_SMOKE_STEP_SUFFIXES.length} steps × ${LOCALE_JSON_LOCALES.length} locales)`
)
