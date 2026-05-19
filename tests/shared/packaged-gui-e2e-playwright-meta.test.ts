import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { PACKAGED_E2E_PLANNED_GUI_STEP_IDS } from '../../src/shared/packaged-e2e-smoke-scenarios'
import {
  PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY,
  PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT,
  PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT,
  PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT,
  PACKAGED_GUI_E2E_PLAYWRIGHT_QUIET_ORDER_ANCHORS,
  PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS,
  formatPackagedGuiE2ePlaywrightArchitectureUiHintsClause,
  formatPackagedGuiE2ePlaywrightAgentsMdUiHintsTail,
  formatPackagedGuiE2ePlaywrightBinReadmeUiHintsLine,
  formatPackagedGuiE2ePlaywrightAboutSupportLogsHelpUiHintSuffix,
  PACKAGED_GUI_E2E_PLAYWRIGHT_LOGGING_TERMINAL_UI_HINT_KEY,
  formatPackagedGuiE2ePlaywrightLoggingDiagnosticsHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightPlannerScenariosHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightPackagedSmokeHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightHelpCrosslinksUiHintSuffix,
  formatPackagedGuiE2ePlaywrightOwnerHelpUiHintsClause,
  formatPackagedGuiE2ePlaywrightReleaseCopyAppendixUiTail,
  formatPackagedGuiE2ePlaywrightReleaseDeferredBullet,
  formatPackagedGuiE2ePlaywrightReleaseOwnerVisualSmokeLocaleLine,
  formatPackagedGuiE2ePlaywrightUiHintSuffix,
  formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine,
  formatPackagedGuiE2ePlaywrightCopyAppendixHintSuffix,
  formatPackagedGuiE2ePlaywrightAboutSupportZipSectionsHintSuffix,
  formatPackagedGuiE2ePlaywrightOwnerIntroHintSuffix,
  formatPackagedGuiE2ePlaywrightOwnerHubHintSuffix,
  formatPackagedGuiE2ePlaywrightRootReadmeLine,
  formatPackagedGuiE2ePlaywrightSettingsHintSuffix
} from '../../src/shared/packaged-gui-e2e-playwright-meta'
import { formatPackagedManualSmokeE2eAppendixLines } from '../../src/shared/packaged-manual-smoke-plain-text'
import { formatPlatformPackagingDiagnosticLines } from '../../src/shared/platform-packaging-scripts'

describe('packaged-gui-e2e-playwright-meta §21', () => {
  it('reserves test:e2e:gui for 8 planned-gui-e2e steps', () => {
    expect(PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT).toBe('test:e2e:gui')
    expect(PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT).toBe(8)
    expect(PACKAGED_E2E_PLANNED_GUI_STEP_IDS).toHaveLength(8)
    const diag = formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine()
    expect(diag).toContain(PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT)
    expect(formatPlatformPackagingDiagnosticLines()).toContain(diag)
  })

  it('formatPackagedManualSmokeE2eAppendixLines includes Playwright deferred diagnostic', () => {
    const joined = formatPackagedManualSmokeE2eAppendixLines().join('\n')
    expect(joined).toContain(formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine())
  })

  it('formatPackagedGuiE2ePlaywrightCopyAppendixHintSuffix matches locales settings', () => {
    for (const locale of ['en', 'ru'] as const) {
      const suffix = formatPackagedGuiE2ePlaywrightCopyAppendixHintSuffix(locale)
      expect(readFileSync(`locales/${locale}/settings.json`, 'utf8')).toContain(suffix)
    }
  })

  it('formatPackagedGuiE2ePlaywrightSettingsHintSuffix matches locales settings', () => {
    for (const locale of ['en', 'ru'] as const) {
      const suffix = formatPackagedGuiE2ePlaywrightSettingsHintSuffix(locale)
      expect(suffix).toContain('check:packaged-gui-e2e-playwright-deferred')
      expect(readFileSync(`locales/${locale}/settings.json`, 'utf8')).toContain(suffix)
    }
  })

  it('formatPackagedGuiE2ePlaywrightAboutSupportZipSectionsHintSuffix matches about.json', () => {
    for (const locale of ['en', 'ru'] as const) {
      const suffix = formatPackagedGuiE2ePlaywrightAboutSupportZipSectionsHintSuffix(locale)
      expect(readFileSync(`locales/${locale}/about.json`, 'utf8')).toContain(suffix)
    }
  })

  it('formatPackagedGuiE2ePlaywrightOwnerIntroHintSuffix matches locales settings', () => {
    for (const locale of ['en', 'ru'] as const) {
      const suffix = formatPackagedGuiE2ePlaywrightOwnerIntroHintSuffix(locale)
      expect(readFileSync(`locales/${locale}/settings.json`, 'utf8')).toContain(suffix)
    }
  })

  it('formatPackagedGuiE2ePlaywrightOwnerHubHintSuffix matches locales settings', () => {
    for (const locale of ['en', 'ru'] as const) {
      const suffix = formatPackagedGuiE2ePlaywrightOwnerHubHintSuffix(locale)
      expect(suffix).toContain('planned-gui-e2e')
      expect(readFileSync(`locales/${locale}/settings.json`, 'utf8')).toContain(suffix)
    }
  })

  it('formatPackagedGuiE2ePlaywrightRootReadmeLine matches README', () => {
    const line = formatPackagedGuiE2ePlaywrightRootReadmeLine()
    expect(line).toContain('check:packaged-gui-e2e-playwright-deferred')
    expect(line).toContain('test:e2e:gui')
    expect(readFileSync('README.md', 'utf8')).toContain(line)
  })

  it('formatPackagedGuiE2ePlaywrightArchitectureUiHintsClause matches ARCHITECTURE', () => {
    expect(readFileSync('docs/ARCHITECTURE.md', 'utf8')).toContain(
      formatPackagedGuiE2ePlaywrightArchitectureUiHintsClause()
    )
  })

  it('RELEASE bullets match formatPackagedGuiE2ePlaywrightRelease* lines', () => {
    const release = readFileSync('docs/RELEASE.md', 'utf8')
    expect(release).toContain(formatPackagedGuiE2ePlaywrightReleaseOwnerVisualSmokeLocaleLine())
    expect(release).toContain(formatPackagedGuiE2ePlaywrightReleaseDeferredBullet())
    expect(release).toContain(formatPackagedGuiE2ePlaywrightReleaseCopyAppendixUiTail())
  })

  it('formatPackagedGuiE2ePlaywrightAgentsMdUiHintsTail matches AGENTS.md', () => {
    expect(readFileSync('AGENTS.md', 'utf8')).toContain(
      formatPackagedGuiE2ePlaywrightAgentsMdUiHintsTail()
    )
  })

  it('formatPackagedGuiE2ePlaywrightOwnerHelpUiHintsClause matches owner Help', () => {
    for (const locale of ['en', 'ru'] as const) {
      const rel = locale === 'en' ? 'Help/en/owner-manual-smoke.md' : 'Help/owner-manual-smoke.md'
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedGuiE2ePlaywrightOwnerHelpUiHintsClause(locale)
      )
    }
  })

  it('Help UiHintSuffix formatters match §15/§19 articles', () => {
    const packagedPaths = [
      'Help/packaged-windows-smoke.md',
      'Help/en/packaged-windows-smoke.md',
      'Help/packaged-linux-smoke.md',
      'Help/en/packaged-linux-smoke.md',
      'Help/packaged-macos-smoke.md',
      'Help/en/packaged-macos-smoke.md'
    ]
    for (const locale of ['en', 'ru'] as const) {
      const aboutRel = locale === 'en' ? 'Help/en/about-support-logs.md' : 'Help/about-support-logs.md'
      const aboutSuffix = formatPackagedGuiE2ePlaywrightAboutSupportLogsHelpUiHintSuffix(locale)
      expect(aboutSuffix).toContain(PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY)
      expect(readFileSync(aboutRel, 'utf8')).toContain(aboutSuffix)

      const loggingRel =
        locale === 'en' ? 'Help/en/logging-and-diagnostics.md' : 'Help/logging-and-diagnostics.md'
      const loggingSuffix = formatPackagedGuiE2ePlaywrightLoggingDiagnosticsHelpUiHintSuffix(locale)
      expect(loggingSuffix).toContain(PACKAGED_GUI_E2E_PLAYWRIGHT_LOGGING_TERMINAL_UI_HINT_KEY)
      expect(loggingSuffix).toContain('check:terminal-hints-locale')
      expect(readFileSync(loggingRel, 'utf8')).toContain(loggingSuffix)

      const plannerRel =
        locale === 'en'
          ? 'Help/en/workflows-planner-scenarios.md'
          : 'Help/workflows-planner-scenarios.md'
      const crosslinksSuffix = formatPackagedGuiE2ePlaywrightHelpCrosslinksUiHintSuffix(locale)
      expect(formatPackagedGuiE2ePlaywrightPlannerScenariosHelpUiHintSuffix(locale)).toBe(
        crosslinksSuffix
      )
      expect(readFileSync(plannerRel, 'utf8')).toContain(crosslinksSuffix)
    }
    for (const rel of packagedPaths) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      const suffix = formatPackagedGuiE2ePlaywrightPackagedSmokeHelpUiHintSuffix(locale)
      expect(suffix).toBe(formatPackagedGuiE2ePlaywrightHelpCrosslinksUiHintSuffix(locale))
      expect(readFileSync(rel, 'utf8')).toContain(suffix)
    }
  })

  it('formatPackagedGuiE2ePlaywrightBinReadmeUiHintsLine matches bin/README', () => {
    expect(readFileSync('bin/README.md', 'utf8')).toContain(
      formatPackagedGuiE2ePlaywrightBinReadmeUiHintsLine()
    )
  })

  it('PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS lists 4 settings hints', () => {
    expect(PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS).toEqual([
      'appSettingsPackagedE2eRegistryGuardHint',
      'appSettingsPackagedSmokeCopyAppendixHint',
      'appSettingsOwnerSmokeIntro',
      'appSettingsOwnerSmokePackagedE2eHint'
    ])
    expect(PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY).toBe(
      'aboutSupportZipDiagnosticsSectionsHint'
    )
  })

  it('formatPackagedGuiE2ePlaywrightUiHintSuffix dispatches per locale key', () => {
    for (const locale of ['en', 'ru'] as const) {
      for (const key of PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS) {
        expect(formatPackagedGuiE2ePlaywrightUiHintSuffix(key, locale)).toContain(
          'check:packaged-gui-e2e-playwright-deferred'
        )
      }
      expect(
        formatPackagedGuiE2ePlaywrightUiHintSuffix(
          PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY,
          locale
        )
      ).toContain('check:packaged-gui-e2e-playwright-deferred')
    }
  })

  it('exports §21 quiet order anchors for help-smoke-guards registry', () => {
    expect(PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT).toBe(
      'check:packaged-gui-e2e-playwright-deferred'
    )
    expect(PACKAGED_GUI_E2E_PLAYWRIGHT_QUIET_ORDER_ANCHORS).toEqual([
      'help-packaged-smoke-docs',
      'packaged-e2e-scenarios-registry',
      'packaged-gui-e2e-playwright-deferred',
      'terminal-hints-guards-package-json'
    ])
  })
})
