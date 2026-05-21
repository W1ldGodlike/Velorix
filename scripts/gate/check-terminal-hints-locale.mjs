/**
 * §8 — appSettingsTerminalHintsGuardHint in locales settings.json (meta clause).
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fs from 'node:fs'
import path from 'node:path'

import { LOCALE_JSON_LOCALES } from '../../src/shared/locale-json-catalog.ts'
import {
  TERMINAL_CONTRACT_HINTS_SETTINGS_LOCALE_KEY,
  TERMINAL_CONTRACT_HINTS_SHARDS_GUARD_NPM_SCRIPT,
  TERMINAL_CONTRACT_HINTS_SUPPORT_BUNDLE_GUARD_NPM_SCRIPT,
  formatTerminalContractHintsSettingsHelpClause
} from '../../src/shared/terminal-contract-hints-meta.ts'
import { REPO_ROOT } from '../lib/repo-root.mjs'

function loadShard(locale) {
  const file = path.join(REPO_ROOT, 'locales', locale, 'settings.json')
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

let failed = false
for (const locale of LOCALE_JSON_LOCALES) {
  const table = loadShard(locale)
  const hint = table[TERMINAL_CONTRACT_HINTS_SETTINGS_LOCALE_KEY]
  if (typeof hint !== 'string') {
    failed = true
    console.error(
      `[check:terminal-hints-locale] locales/${locale}/settings.json missing: ${TERMINAL_CONTRACT_HINTS_SETTINGS_LOCALE_KEY}`
    )
    continue
  }
  const helpClause = formatTerminalContractHintsSettingsHelpClause(locale)
  if (!hint.includes(helpClause)) {
    failed = true
    console.error(
      `[check:terminal-hints-locale] locales/${locale}/settings.json ${TERMINAL_CONTRACT_HINTS_SETTINGS_LOCALE_KEY} missing: ${helpClause}`
    )
  }
  if (!hint.includes(TERMINAL_CONTRACT_HINTS_SHARDS_GUARD_NPM_SCRIPT)) {
    failed = true
    console.error(
      `[check:terminal-hints-locale] locales/${locale}/settings.json ${TERMINAL_CONTRACT_HINTS_SETTINGS_LOCALE_KEY} missing shards guard`
    )
  }
  if (!hint.includes(TERMINAL_CONTRACT_HINTS_SUPPORT_BUNDLE_GUARD_NPM_SCRIPT)) {
    failed = true
    console.error(
      `[check:terminal-hints-locale] locales/${locale}/settings.json ${TERMINAL_CONTRACT_HINTS_SETTINGS_LOCALE_KEY} missing support-bundle guard`
    )
  }
}

if (failed) {
  process.exit(1)
}

console.log(
  `[check:terminal-hints-locale] OK (${TERMINAL_CONTRACT_HINTS_SETTINGS_LOCALE_KEY} × ${LOCALE_JSON_LOCALES.length} locales)`
)
