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
  formatPackagedGuiE2ePlaywrightCopyAppendixHintSuffix,
  formatPackagedGuiE2ePlaywrightOwnerHubHintSuffix,
  formatPackagedGuiE2ePlaywrightOwnerIntroHintSuffix,
  formatPackagedGuiE2ePlaywrightSettingsHintSuffix
} from '../src/shared/packaged-gui-e2e-playwright-meta.ts'
import { formatPackagedE2eHelpWorkflowCrosslinksSettingsHelpClause } from '../src/shared/packaged-e2e-help-workflow-crosslinks-meta.ts'
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
    const helpClause = formatPackagedE2eHelpWorkflowCrosslinksSettingsHelpClause(locale)
    if (!e2eHint.includes(helpClause)) {
      failed = true
      console.error(
        `[check:owner-visual-smoke-locale] locales/${locale}/settings.json appSettingsPackagedE2eRegistryGuardHint missing: ${helpClause}`
      )
    }
    const playwrightSuffix = formatPackagedGuiE2ePlaywrightSettingsHintSuffix(locale)
    if (!e2eHint.includes(playwrightSuffix)) {
      failed = true
      console.error(
        `[check:owner-visual-smoke-locale] locales/${locale}/settings.json appSettingsPackagedE2eRegistryGuardHint missing: ${playwrightSuffix}`
      )
    }
  }
  const copyAppendixHint = table.appSettingsPackagedSmokeCopyAppendixHint
  if (typeof copyAppendixHint === 'string') {
    const copyPlaywrightSuffix = formatPackagedGuiE2ePlaywrightCopyAppendixHintSuffix(locale)
    if (!copyAppendixHint.includes(copyPlaywrightSuffix)) {
      failed = true
      console.error(
        `[check:owner-visual-smoke-locale] locales/${locale}/settings.json appSettingsPackagedSmokeCopyAppendixHint missing: ${copyPlaywrightSuffix}`
      )
    }
  }
  const ownerIntro = table.appSettingsOwnerSmokeIntro
  if (typeof ownerIntro === 'string') {
    const ownerIntroPlaywrightSuffix = formatPackagedGuiE2ePlaywrightOwnerIntroHintSuffix(locale)
    if (!ownerIntro.includes(ownerIntroPlaywrightSuffix)) {
      failed = true
      console.error(
        `[check:owner-visual-smoke-locale] locales/${locale}/settings.json appSettingsOwnerSmokeIntro missing: ${ownerIntroPlaywrightSuffix}`
      )
    }
  }
  const ownerHubHint = table.appSettingsOwnerSmokePackagedE2eHint
  if (typeof ownerHubHint === 'string') {
    const ownerHubPlaywrightSuffix = formatPackagedGuiE2ePlaywrightOwnerHubHintSuffix(locale)
    if (!ownerHubHint.includes(ownerHubPlaywrightSuffix)) {
      failed = true
      console.error(
        `[check:owner-visual-smoke-locale] locales/${locale}/settings.json appSettingsOwnerSmokePackagedE2eHint missing: ${ownerHubPlaywrightSuffix}`
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
