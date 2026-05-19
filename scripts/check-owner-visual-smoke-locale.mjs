/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Locales guard: theme/HiDPI owner-smoke keys in locales settings.json (ru/en).
 */
import fs from 'node:fs'
import path from 'node:path'

import { APP_SETTINGS_HIDPI_CHECKLIST_KEYS } from '../src/shared/app-settings-hidpi-checklist-keys.ts'
import { APP_SETTINGS_THEME_CHECKLIST_KEYS } from '../src/shared/app-settings-theme-checklist-keys.ts'
import { LOCALE_JSON_LOCALES } from '../src/shared/locale-json-catalog.ts'
import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT
} from '../src/shared/packaged-e2e-help-workflow-crosslinks-meta.ts'
import { REPO_ROOT } from './lib/repo-root.mjs'

const META_KEYS = [
  'ownerManualSmokeThemeHeader',
  'ownerManualSmokeThemeUiLine',
  'ownerManualSmokeHidpiHeader',
  'ownerManualSmokeHidpiUiLine',
  'appSettingsThemeManualHint',
  'appSettingsThemeChecklistIntro',
  'appSettingsHidpiManualHint',
  'appSettingsHidpiChecklistIntro',
  'appSettingsPackagedSmokeParityGuardHint',
  'appSettingsPackagedSmokeCopyAppendixHint',
  'appSettingsPackagedE2eRegistryGuardHint',
  'appSettingsOwnerSmokeLocaleGuardHint',
  'appSettingsOwnerSmokePackagedE2eHint'
]

const REQUIRED_KEYS = [
  ...META_KEYS,
  ...APP_SETTINGS_THEME_CHECKLIST_KEYS,
  ...APP_SETTINGS_HIDPI_CHECKLIST_KEYS
]

function loadShard(locale) {
  const file = path.join(REPO_ROOT, 'locales', locale, 'settings.json')
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

let failed = false
for (const locale of LOCALE_JSON_LOCALES) {
  const table = loadShard(locale)
  const missing = REQUIRED_KEYS.filter((key) => typeof table[key] !== 'string')
  if (missing.length > 0) {
    failed = true
    console.error(
      `[check:owner-visual-smoke-locale] locales/${locale}/settings.json missing: ${missing.join(', ')}`
    )
  }
  const e2eHint = table.appSettingsPackagedE2eRegistryGuardHint
  if (typeof e2eHint === 'string') {
    if (!e2eHint.includes(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT)) {
      failed = true
      console.error(
        `[check:owner-visual-smoke-locale] locales/${locale}/settings.json appSettingsPackagedE2eRegistryGuardHint missing: ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT}`
      )
    }
    const countSnippet =
      locale === 'ru'
        ? PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_RU_SNIPPET
        : PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_COUNT_EN_SNIPPET
    if (!e2eHint.includes(countSnippet)) {
      failed = true
      console.error(
        `[check:owner-visual-smoke-locale] locales/${locale}/settings.json appSettingsPackagedE2eRegistryGuardHint missing: ${countSnippet}`
      )
    }
  }
}

if (failed) {
  process.exit(1)
}
console.log(
  `[check:owner-visual-smoke-locale] OK (${REQUIRED_KEYS.length} keys × ${LOCALE_JSON_LOCALES.length} locales)`
)
