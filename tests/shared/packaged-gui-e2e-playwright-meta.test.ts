import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import {
  formatPackagedE2eHelpWorkflowCrosslinksAgentsMdFullHelpLine,
  formatPackagedE2eHelpWorkflowCrosslinksBinReadmePlaywrightDeferredLine,
  formatPackagedE2eHelpWorkflowCrosslinksAboutSupportReleaseSmokeDevParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksPlannerDiagnosticsParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksKnowledgeHubPackagedSmokeParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksFfmpegTerminalPackagedSmokeParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksLoggingDevParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokePlannedGuiParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeScaffoldClause,
  formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_SCAFFOLD_EXPORTS,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedCopyPlannedGuiTail,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedMacLinuxCopyDevClause,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedWinCopyDevClause,
  formatPackagedE2eHelpWorkflowCrosslinksReleaseHelpWorkflowCrosslinksLine,
  formatPackagedE2eHelpWorkflowCrosslinksSettingsCopyAppendixHintBody,
  formatPackagedE2eHelpWorkflowCrosslinksSettingsOwnerIntroHintBody,
  formatPackagedE2eHelpWorkflowCrosslinksSettingsRegistryGuardHintBody
} from '../../src/shared/packaged-e2e-help-workflow-crosslinks-meta'
import { PACKAGED_E2E_PLANNED_GUI_STEP_IDS } from '../../src/shared/packaged-e2e-smoke-scenarios'
import {
  PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY,
  PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT,
  PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT,
  PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT,
  PACKAGED_GUI_E2E_PLAYWRIGHT_QUIET_ORDER_ANCHORS,
  PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS,
  formatPackagedGuiE2ePlaywrightArchitectureUiHintsClause,
  formatPackagedGuiE2ePlaywrightArchitectureScaffoldClause,
  formatPackagedGuiE2ePlaywrightArchitectureStepByIdClause,
  formatPackagedGuiE2ePlaywrightArchitectureWiringHandoffClause,
  formatPackagedGuiE2ePlaywrightAboutSupportZipSectionsHintBody,
  formatPackagedGuiE2ePlaywrightAgentsMdHelpPlaywrightSection,
  formatPackagedGuiE2ePlaywrightBinReadmeUiHintsLine,
  formatPackagedGuiE2ePlaywrightBinReadmeScaffoldLine,
  formatPackagedGuiE2ePlaywrightBinReadmeStepByIdLine,
  PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE,
  PACKAGED_GUI_E2E_PLAYWRIGHT_SCAFFOLD_EXPORTS,
  formatPackagedGuiE2ePlaywrightAboutSupportLogsHelpUiHintSuffix,
  PACKAGED_GUI_E2E_PLAYWRIGHT_LOGGING_TERMINAL_UI_HINT_KEY,
  formatPackagedGuiE2ePlaywrightLoggingDiagnosticsHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightLoggingPlannedGuiScopeClause,
  formatPackagedGuiE2ePlaywrightPlannerScenariosHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightPackagedSmokeHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightFfmpegTerminalHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightKnowledgeHubHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightHelpCrosslinksUiHintSuffix,
  formatPackagedGuiE2ePlaywrightOwnerHelpUiHintsClause,
  formatPackagedGuiE2ePlaywrightReleaseCopyAppendixUiTail,
  formatPackagedGuiE2ePlaywrightReleaseDeferredBullet,
  formatPackagedGuiE2ePlaywrightReleaseOwnerVisualSmokeLocaleLine,
  formatPackagedGuiE2ePlaywrightReleaseScenariosRegistryAutomationSummary,
  formatPackagedGuiE2ePlaywrightOperationalNotesRow,
  formatPackagedGuiE2ePlaywrightReleaseScenariosRegistryLine,
  formatPackagedGuiE2ePlaywrightUiHintSuffix,
  formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine,
  formatPackagedGuiE2ePlaywrightScaffoldDiagnosticLine,
  formatPackagedGuiE2ePlaywrightReleaseScaffoldBullet,
  formatPackagedGuiE2ePlaywrightReleaseStepByIdBullet,
  formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet,
  formatPackagedGuiE2ePlaywrightAboutSupportZipSectionsHintSuffix,
  formatPackagedGuiE2ePlaywrightSettingsOwnerHubHintBody,
  formatPackagedGuiE2ePlaywrightRootReadmeLine,
  formatPackagedGuiE2ePlaywrightRootReadmePlaywrightSection,
  formatPackagedGuiE2ePlaywrightRootReadmeWiringHandoffLine,
  formatPackagedGuiE2ePlaywrightSourcesOfTruthHelpUiHintsNote,
  formatPackagedGuiE2ePlaywrightSourcesOfTruthScaffoldNote,
  formatPackagedGuiE2ePlaywrightSourcesOfTruthStepByIdNote,
  formatPackagedGuiE2ePlaywrightSourcesOfTruthWiringHandoffNote,
  formatPackagedGuiE2ePlaywrightBinReadmeWiringHandoffLine,
  formatPackagedGuiE2ePlaywrightAgentsMdScaffoldClause,
  formatPackagedGuiE2ePlaywrightAgentsMdStepByIdClause,
  formatPackagedGuiE2ePlaywrightAgentsMdWiringClause
} from '../../src/shared/packaged-gui-e2e-playwright-meta'
import { formatPackagedManualSmokeE2eAppendixLines } from '../../src/shared/packaged-manual-smoke-plain-text'
import { formatPlatformPackagingDiagnosticLines } from '../../src/shared/platform-packaging-scripts'
import { formatTerminalContractHintsAboutSupportZipSectionsHint } from '../../src/shared/terminal-contract-hints-meta'

describe('packaged-gui-e2e-playwright-meta §21', () => {
  it('locks scaffold export names for deferred Playwright module', () => {
    expect(PACKAGED_GUI_E2E_PLAYWRIGHT_SCAFFOLD_EXPORTS).toBe(
      'PLANNED_GUI_E2E_STEP_IDS, PLANNED_GUI_E2E_SCENARIOS, PLANNED_GUI_E2E_STEP_BY_ID'
    )
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_SCAFFOLD_EXPORTS).toBe(
      PACKAGED_GUI_E2E_PLAYWRIGHT_SCAFFOLD_EXPORTS
    )
  })

  it('reserves test:e2e:gui for 8 planned-gui-e2e steps', () => {
    expect(PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT).toBe('test:e2e:gui')
    expect(PACKAGED_E2E_PLANNED_GUI_STEP_IDS).toHaveLength(
      PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT
    )
    expect(PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT).toBe(8)
    const diag = formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine()
    expect(diag).toContain(PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT)
    expect(formatPlatformPackagingDiagnosticLines()).toContain(diag)
    expect(formatPlatformPackagingDiagnosticLines()).toContain(
      formatPackagedGuiE2ePlaywrightScaffoldDiagnosticLine()
    )
  })

  it('defers test:e2e:gui script in package.json until Playwright wiring', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
      scripts?: Record<string, string>
    }
    expect(pkg.scripts?.[PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT]).toBeUndefined()
    expect(
      pkg.scripts?.[PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT]?.length
    ).toBeGreaterThan(0)
  })

  it('formatPackagedManualSmokeE2eAppendixLines includes Playwright deferred diagnostic', () => {
    const joined = formatPackagedManualSmokeE2eAppendixLines().join('\n')
    expect(joined).toContain(formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine())
  })

  it('Playwright UiHintSuffix formatters match locales settings and about', () => {
    for (const locale of ['en', 'ru'] as const) {
      const settings = JSON.parse(
        readFileSync(`locales/${locale}/settings.json`, 'utf8')
      ) as Record<string, string>
      expect(settings['appSettingsPackagedSmokeCopyAppendixHint']).toBe(
        formatPackagedE2eHelpWorkflowCrosslinksSettingsCopyAppendixHintBody(locale)
      )
      expect(settings['appSettingsPackagedE2eRegistryGuardHint']).toBe(
        formatPackagedE2eHelpWorkflowCrosslinksSettingsRegistryGuardHintBody(locale)
      )
      expect(settings['appSettingsOwnerSmokeIntro']).toBe(
        formatPackagedE2eHelpWorkflowCrosslinksSettingsOwnerIntroHintBody(locale)
      )
      expect(settings['appSettingsOwnerSmokePackagedE2eHint']).toBe(
        formatPackagedGuiE2ePlaywrightSettingsOwnerHubHintBody(locale)
      )
      expect(readFileSync(`locales/${locale}/about.json`, 'utf8')).toContain(
        formatPackagedGuiE2ePlaywrightAboutSupportZipSectionsHintSuffix(locale)
      )
    }
  })

  it('formatPackagedGuiE2ePlaywrightRootReadmePlaywrightSection matches README and SOURCES', () => {
    const section = formatPackagedGuiE2ePlaywrightRootReadmePlaywrightSection()
    expect(section).toContain(formatPackagedGuiE2ePlaywrightRootReadmeLine())
    expect(section).toContain(formatPackagedGuiE2ePlaywrightBinReadmeScaffoldLine())
    expect(section).toContain(formatPackagedGuiE2ePlaywrightBinReadmeStepByIdLine())
    expect(section).toContain(formatPackagedGuiE2ePlaywrightRootReadmeWiringHandoffLine())
    expect(section).toContain('check:help-packaged-smoke-docs')
    expect(readFileSync('README.md', 'utf8')).toContain(section)
    const sources = readFileSync('docs/SOURCES_OF_TRUTH.md', 'utf8')
    expect(sources).toContain(formatPackagedGuiE2ePlaywrightSourcesOfTruthHelpUiHintsNote())
    expect(sources).toContain(formatPackagedGuiE2ePlaywrightSourcesOfTruthScaffoldNote())
    expect(sources).toContain(formatPackagedGuiE2ePlaywrightSourcesOfTruthStepByIdNote())
    expect(sources).toContain(formatPackagedGuiE2ePlaywrightSourcesOfTruthWiringHandoffNote())
  })

  it('formatPackagedGuiE2ePlaywrightArchitectureUiHintsClause matches ARCHITECTURE', () => {
    const architecture = readFileSync('docs/ARCHITECTURE.md', 'utf8')
    expect(architecture).toContain(formatPackagedGuiE2ePlaywrightArchitectureUiHintsClause())
    expect(architecture).toContain(formatPackagedGuiE2ePlaywrightArchitectureScaffoldClause())
    expect(architecture).toContain(formatPackagedGuiE2ePlaywrightArchitectureStepByIdClause())
    expect(architecture).toContain(formatPackagedGuiE2ePlaywrightArchitectureWiringHandoffClause())
  })

  it('RELEASE bullets match formatPackagedGuiE2ePlaywrightRelease* lines', () => {
    const release = readFileSync('docs/RELEASE.md', 'utf8')
    const scenariosLine = formatPackagedGuiE2ePlaywrightReleaseScenariosRegistryLine()
    expect(scenariosLine).toContain(
      formatPackagedGuiE2ePlaywrightReleaseScenariosRegistryAutomationSummary()
    )
    expect(release).toContain(scenariosLine)
    expect(release).toContain(formatPackagedGuiE2ePlaywrightReleaseOwnerVisualSmokeLocaleLine())
    expect(release).toContain(formatPackagedGuiE2ePlaywrightReleaseDeferredBullet())
    expect(release).toContain(formatPackagedGuiE2ePlaywrightReleaseScaffoldBullet())
    expect(release).toContain(formatPackagedGuiE2ePlaywrightReleaseStepByIdBullet())
    expect(release).toContain(formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet())
    expect(release).toContain(formatPackagedGuiE2ePlaywrightReleaseCopyAppendixUiTail())
    expect(release).toContain(
      formatPackagedE2eHelpWorkflowCrosslinksReleaseHelpWorkflowCrosslinksLine()
    )
  })

  it('formatPackagedGuiE2ePlaywrightAgentsMd clauses match AGENTS.md and about.json', () => {
    const agents = readFileSync('AGENTS.md', 'utf8')
    const playwrightSection = formatPackagedGuiE2ePlaywrightAgentsMdHelpPlaywrightSection()
    expect(agents).toContain(
      formatPackagedE2eHelpWorkflowCrosslinksAgentsMdFullHelpLine(playwrightSection)
    )
    expect(playwrightSection).toContain(
      `${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} planned-gui-e2e`
    )
    expect(playwrightSection).toContain(formatPackagedGuiE2ePlaywrightAgentsMdScaffoldClause())
    expect(playwrightSection).toContain(formatPackagedGuiE2ePlaywrightAgentsMdStepByIdClause())
    expect(playwrightSection).toContain(formatPackagedGuiE2ePlaywrightAgentsMdWiringClause())
    for (const locale of ['en', 'ru'] as const) {
      const about = JSON.parse(readFileSync(`locales/${locale}/about.json`, 'utf8')) as Record<
        string,
        string
      >
      expect(about[PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY]).toBe(
        formatPackagedGuiE2ePlaywrightAboutSupportZipSectionsHintBody(
          locale,
          formatTerminalContractHintsAboutSupportZipSectionsHint(locale)
        )
      )
    }
  })

  it('formatPackagedGuiE2ePlaywrightOwnerHelpUiHintsClause matches owner Help', () => {
    for (const locale of ['en', 'ru'] as const) {
      const rel = locale === 'en' ? 'Help/en/owner-manual-smoke.md' : 'Help/owner-manual-smoke.md'
      const uiHints = formatPackagedGuiE2ePlaywrightOwnerHelpUiHintsClause(locale)
      const text = readFileSync(rel, 'utf8')
      expect(text).toContain(uiHints)
      expect(text).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokePlannedGuiParagraph(locale, uiHints)
      )
      expect(text).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeScaffoldClause(locale)
      )
      expect(text).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(locale)
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
      const aboutRel =
        locale === 'en' ? 'Help/en/about-support-logs.md' : 'Help/about-support-logs.md'
      const aboutSuffix = formatPackagedGuiE2ePlaywrightAboutSupportLogsHelpUiHintSuffix(locale)
      expect(aboutSuffix).toContain(PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY)
      const aboutText = readFileSync(aboutRel, 'utf8')
      expect(aboutText).toContain(aboutSuffix)
      expect(aboutText).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksAboutSupportReleaseSmokeDevParagraph(
          locale,
          aboutSuffix
        )
      )
      expect(aboutText).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(locale)
      )

      const loggingRel =
        locale === 'en' ? 'Help/en/logging-and-diagnostics.md' : 'Help/logging-and-diagnostics.md'
      const loggingText = readFileSync(loggingRel, 'utf8')
      const loggingScope = formatPackagedGuiE2ePlaywrightLoggingPlannedGuiScopeClause(locale)
      expect(loggingScope).toContain(`${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT}`)
      const loggingSuffix = formatPackagedGuiE2ePlaywrightLoggingDiagnosticsHelpUiHintSuffix(locale)
      expect(loggingSuffix).toContain(PACKAGED_GUI_E2E_PLAYWRIGHT_LOGGING_TERMINAL_UI_HINT_KEY)
      expect(loggingSuffix).toContain('check:terminal-hints-locale')
      expect(loggingText).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksLoggingDevParagraph(
          locale,
          loggingScope,
          loggingSuffix
        )
      )
      expect(loggingText).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(locale)
      )

      const plannerRel =
        locale === 'en'
          ? 'Help/en/workflows-planner-scenarios.md'
          : 'Help/workflows-planner-scenarios.md'
      const crosslinksSuffix = formatPackagedGuiE2ePlaywrightHelpCrosslinksUiHintSuffix(locale)
      expect(formatPackagedGuiE2ePlaywrightPlannerScenariosHelpUiHintSuffix(locale)).toBe(
        crosslinksSuffix
      )
      const plannerText = readFileSync(plannerRel, 'utf8')
      expect(plannerText).toContain(crosslinksSuffix)
      expect(plannerText).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksPlannerDiagnosticsParagraph(locale, crosslinksSuffix)
      )
      expect(plannerText).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(locale)
      )

      const ffmpegRel =
        locale === 'en' ? 'Help/en/ffmpeg-terminal-hints.md' : 'Help/ffmpeg-terminal-hints.md'
      const ffmpegSuffix = formatPackagedGuiE2ePlaywrightFfmpegTerminalHelpUiHintSuffix(locale)
      expect(ffmpegSuffix).toBe(
        formatPackagedGuiE2ePlaywrightLoggingDiagnosticsHelpUiHintSuffix(locale)
      )
      const ffmpegText = readFileSync(ffmpegRel, 'utf8')
      expect(ffmpegText).toContain(ffmpegSuffix)
      expect(ffmpegText).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksFfmpegTerminalPackagedSmokeParagraph(
          locale,
          ffmpegSuffix
        )
      )

      const knowledgeRel =
        locale === 'en' ? 'Help/en/knowledge-base-howto.md' : 'Help/knowledge-base-howto.md'
      const knowledgeSuffix = formatPackagedGuiE2ePlaywrightKnowledgeHubHelpUiHintSuffix(locale)
      expect(knowledgeSuffix).toBe(crosslinksSuffix)
      const knowledgeText = readFileSync(knowledgeRel, 'utf8')
      expect(knowledgeText).toContain(knowledgeSuffix)
      expect(knowledgeText).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksKnowledgeHubPackagedSmokeParagraph(
          locale,
          knowledgeSuffix
        )
      )
    }
    for (const rel of packagedPaths) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      const suffix = formatPackagedGuiE2ePlaywrightPackagedSmokeHelpUiHintSuffix(locale)
      expect(suffix).toBe(formatPackagedGuiE2ePlaywrightHelpCrosslinksUiHintSuffix(locale))
      const text = readFileSync(rel, 'utf8')
      expect(text).toContain(suffix)
      const isWin = rel.includes('windows')
      const devClause = isWin
        ? formatPackagedE2eHelpWorkflowCrosslinksPackagedWinCopyDevClause(locale)
        : formatPackagedE2eHelpWorkflowCrosslinksPackagedMacLinuxCopyDevClause(locale)
      expect(text).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksPackagedCopyPlannedGuiTail(locale, devClause, suffix)
      )
    }
  })

  it('formatPackagedGuiE2ePlaywrightBinReadmeUiHintsLine matches bin/README', () => {
    const binReadme = readFileSync('bin/README.md', 'utf8')
    expect(binReadme).toContain(formatPackagedGuiE2ePlaywrightBinReadmeUiHintsLine())
    expect(binReadme).toContain(
      formatPackagedE2eHelpWorkflowCrosslinksBinReadmePlaywrightDeferredLine()
    )
    expect(binReadme).toContain(formatPackagedGuiE2ePlaywrightBinReadmeScaffoldLine())
    expect(binReadme).toContain(formatPackagedGuiE2ePlaywrightBinReadmeStepByIdLine())
    expect(binReadme).toContain(formatPackagedGuiE2ePlaywrightBinReadmeWiringHandoffLine())
    expect(PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE).toBe(
      'tests/e2e/gui/planned-gui-e2e-steps.ts'
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

  it('formatPackagedGuiE2ePlaywrightOperationalNotesRow matches AGENT_OPERATIONAL_NOTES', () => {
    const notes = readFileSync('docs/AGENT_OPERATIONAL_NOTES.md', 'utf8')
    expect(notes).toContain(formatPackagedGuiE2ePlaywrightOperationalNotesRow())
  })

  it('check:quiet runs §21 deferred guard in PACKAGED_GUI_E2E_PLAYWRIGHT_QUIET_ORDER_ANCHORS order', () => {
    const guard = readFileSync('scripts/check-help-smoke-guards-package-json.mjs', 'utf8')
    expect(guard).toContain('PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT')
    expect(guard).toContain('PACKAGED_GUI_E2E_PLAYWRIGHT_QUIET_ORDER_ANCHORS')
    const quiet = readFileSync('scripts/run-quiet-check.mjs', 'utf8')
    for (const anchor of PACKAGED_GUI_E2E_PLAYWRIGHT_QUIET_ORDER_ANCHORS) {
      expect(quiet).toContain(anchor)
    }
    const indices = PACKAGED_GUI_E2E_PLAYWRIGHT_QUIET_ORDER_ANCHORS.map((anchor) =>
      quiet.indexOf(anchor)
    )
    expect(indices.every((index) => index >= 0)).toBe(true)
    for (let i = 1; i < indices.length; i += 1) {
      expect(indices[i]).toBeGreaterThan(indices[i - 1]!)
    }
  })
})
