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
  PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS,
  formatPackagedGuiE2ePlaywrightSettingsOwnerHubHintBody,
  formatPackagedGuiE2ePlaywrightUiHintSuffix
} from '../src/shared/packaged-gui-e2e-playwright-meta.ts'
import {
  formatPackagedE2eHelpWorkflowCrosslinksSettingsCopyAppendixHintBody,
  formatPackagedE2eHelpWorkflowCrosslinksSettingsOwnerIntroHintBody,
  formatPackagedE2eHelpWorkflowCrosslinksSettingsRegistryGuardHintBody
} from './lib/help-workflow-crosslinks-meta.mjs'
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
  'appSettingsOwnerSmokeLocaleGuardHint',
  ...PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS
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
    const registryBody =
      formatPackagedE2eHelpWorkflowCrosslinksSettingsRegistryGuardHintBody(locale)
    if (e2eHint !== registryBody) {
      failed = true
      console.error(
        `[check:owner-visual-smoke-locale] locales/${locale}/settings.json appSettingsPackagedE2eRegistryGuardHint must equal formatPackagedE2eHelpWorkflowCrosslinksSettingsRegistryGuardHintBody(${locale})`
      )
    }
  }
  const copyAppendixHint = table.appSettingsPackagedSmokeCopyAppendixHint
  if (typeof copyAppendixHint === 'string') {
    const copyBody = formatPackagedE2eHelpWorkflowCrosslinksSettingsCopyAppendixHintBody(locale)
    if (copyAppendixHint !== copyBody) {
      failed = true
      console.error(
        `[check:owner-visual-smoke-locale] locales/${locale}/settings.json appSettingsPackagedSmokeCopyAppendixHint must equal formatPackagedE2eHelpWorkflowCrosslinksSettingsCopyAppendixHintBody(${locale})`
      )
    }
  }
  const ownerIntro = table.appSettingsOwnerSmokeIntro
  if (typeof ownerIntro === 'string') {
    const introBody = formatPackagedE2eHelpWorkflowCrosslinksSettingsOwnerIntroHintBody(locale)
    if (ownerIntro !== introBody) {
      failed = true
      console.error(
        `[check:owner-visual-smoke-locale] locales/${locale}/settings.json appSettingsOwnerSmokeIntro must equal formatPackagedE2eHelpWorkflowCrosslinksSettingsOwnerIntroHintBody(${locale})`
      )
    }
  }
  const ownerHubHint = table.appSettingsOwnerSmokePackagedE2eHint
  if (typeof ownerHubHint === 'string') {
    const ownerHubBody = formatPackagedGuiE2ePlaywrightSettingsOwnerHubHintBody(locale)
    if (ownerHubHint !== ownerHubBody) {
      failed = true
      console.error(
        `[check:owner-visual-smoke-locale] locales/${locale}/settings.json appSettingsOwnerSmokePackagedE2eHint must equal formatPackagedGuiE2ePlaywrightSettingsOwnerHubHintBody(${locale})`
      )
    }
  }
  const strictPlaywrightSettingsKeys = new Set([
    'appSettingsPackagedE2eRegistryGuardHint',
    'appSettingsPackagedSmokeCopyAppendixHint',
    'appSettingsOwnerSmokeIntro',
    'appSettingsOwnerSmokePackagedE2eHint'
  ])
  for (const key of PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS) {
    if (strictPlaywrightSettingsKeys.has(key)) {
      continue
    }
    const hint = table[key]
    if (typeof hint !== 'string') {
      continue
    }
    const playwrightSuffix = formatPackagedGuiE2ePlaywrightUiHintSuffix(key, locale)
    if (!hint.includes(playwrightSuffix)) {
      failed = true
      console.error(
        `[check:owner-visual-smoke-locale] locales/${locale}/settings.json ${key} missing: ${playwrightSuffix}`
      )
    }
  }
}

if (failed) {
  process.exit(1)
}
console.log(
  `[check:owner-visual-smoke-locale] OK (${REQUIRED_KEYS.length} keys × ${LOCALE_JSON_LOCALES.length} locales; ${PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS.length} Playwright UI hints)`
)
