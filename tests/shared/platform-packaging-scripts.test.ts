import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_NPM_SCRIPTS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_EN_SNIPPET,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_REQUIRED_SNIPPET,
  formatPackagedE2eHelpWorkflowCrosslinksDiagnosticLine,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedHelpDiagnosticLine
} from '../../src/shared/packaged-e2e-smoke-scenarios'
import {
  TERMINAL_CONTRACT_HINTS_HELP_DOCS_GUARD_NPM_SCRIPT,
  formatTerminalContractHintsDiagnosticLine
} from '../../src/shared/terminal-contract-hints-meta'
import { formatElectronViteEsmShimFixDiagnosticLine } from '../../src/shared/electron-vite-build-meta'
import { formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeArchiveSupportClause } from '../../src/shared/packaged-e2e-help-workflow-crosslinks-meta'
import {
  formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine,
  formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine,
  formatPackagedGuiE2ePlaywrightScaffoldDiagnosticLine,
  PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT
} from '../../src/shared/packaged-gui-e2e-playwright-meta'
import {
  formatLinuxReleaseCodeSigningRoadmapHelpClause,
  formatMacosReleaseCodeSigningRoadmapHelpClause,
  formatReleaseCodeSigningRoadmapAgentsBullet,
  formatReleaseCodeSigningRoadmapAgentsSigningIndexedBullet,
  formatReleaseCodeSigningRoadmapAgentsElectronBuilderBullet,
  formatReleaseCodeSigningRoadmapArchitectureClause,
  formatReleaseCodeSigningRoadmapArchitectureSigningIndexedClause,
  formatReleaseCodeSigningRoadmapReleaseSigningIndexedParagraph,
  formatReleaseCodeSigningRoadmapBinReadmeLine,
  formatReleaseCodeSigningRoadmapBinReadmeSigningIndexedLine,
  formatReleaseCodeSigningRoadmapBinReadmeElectronBuilderLine,
  formatReleaseCodeSigningRoadmapOperationalNotesRow,
  formatReleaseCodeSigningRoadmapOperationalNotesSigningIndexedRow,
  formatReleaseCodeSigningRoadmapOperationalNotesElectronBuilderRow,
  formatReleaseCodeSigningRoadmapReadmeLine,
  formatReleaseCodeSigningRoadmapReadmeSigningIndexedLine,
  formatReleaseCodeSigningRoadmapReadmeElectronBuilderLine,
  formatReleaseCodeSigningRoadmapSdkAutomationReadmeSigningIndexedLine,
  formatReleaseCodeSigningRoadmapReleaseCanonParagraph,
  formatReleaseCodeSigningRoadmapReleaseLinuxHelpPointer,
  formatReleaseCodeSigningRoadmapCheckReleaseDiagnosticLine,
  formatReleaseCodeSigningRoadmapElectronBuilderConfigDiagnosticLine,
  formatReleaseCodeSigningRoadmapElectronBuilderYmlCommentsDiagnosticLine,
  formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine,
  formatReleaseCodeSigningRoadmapFfmpegTerminalHintsHelpClause,
  formatReleaseCodeSigningRoadmapGettingStartedHelpClause,
  formatReleaseCodeSigningRoadmapKnowledgeHubHelpClause,
  formatReleaseCodeSigningRoadmapLoggingDiagnosticsHelpClause,
  formatReleaseCodeSigningRoadmapPlannerScenariosHelpClause,
  formatReleaseCodeSigningRoadmapOwnerManualSmokeArchiveClause,
  formatReleaseCodeSigningRoadmapReleaseMacosHelpPointer,
  formatWindowsReleaseCodeSigningRoadmapHelpClause
} from '../../src/shared/release-code-signing-roadmap'
import {
  formatToolchainBaselineWipHandoffArchitectureClause,
  formatToolchainBaselineWipHandoffBinReadmeLine,
  formatToolchainBaselineWipHandoffCheckReleaseDiagnosticLine
} from '../../src/shared/toolchain-baseline-wip-handoff-meta'
import {
  BUILD_LINUX_NPM_SCRIPT,
  BUILD_MAC_NPM_SCRIPT,
  ENGINES_CI_LINUX_RUNNER,
  ENGINES_PREPARE_WIN_NPM_SCRIPT,
  PACK_LINUX_DIR_NPM_SCRIPT,
  PACK_MAC_DIR_NPM_SCRIPT,
  PLATFORM_PACKAGING_NPM_SCRIPTS,
  VERIFY_LINUX_RELEASE_NPM_SCRIPT,
  VERIFY_LINUX_UNPACKED_NPM_SCRIPT,
  VERIFY_MAC_UNPACKED_NPM_SCRIPT,
  formatPlatformPackagingDiagnosticLines
} from '../../src/shared/platform-packaging-scripts'

describe('platform-packaging-scripts §19', () => {
  it('formatPlatformPackagingDiagnosticLines', () => {
    const lines = formatPlatformPackagingDiagnosticLines()
    expect(lines.some((l) => l.includes(BUILD_MAC_NPM_SCRIPT))).toBe(true)
    expect(lines.some((l) => l.includes(BUILD_LINUX_NPM_SCRIPT))).toBe(true)
    expect(lines.some((l) => l.includes('electron-builder.yml'))).toBe(true)
    expect(lines).toContain(formatElectronViteEsmShimFixDiagnosticLine())
    expect(lines).toContain(formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine())
    expect(lines).toContain(formatPackagedGuiE2ePlaywrightScaffoldDiagnosticLine())
    expect(lines).toContain(formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine())
    expect(lines.some((l) => l.includes('check:packaged-gui-e2e-playwright-deferred'))).toBe(true)
    expect(lines.some((l) => l.includes('check:packaged-manual-smoke-parity'))).toBe(true)
    expect(lines.some((l) => l.includes('check:owner-visual-smoke-locale'))).toBe(true)
    expect(lines.some((l) => l.includes('check:platform-packaging-scripts'))).toBe(true)
    expect(
      lines.some((l) => l.includes(formatPackagedE2eHelpWorkflowCrosslinksDiagnosticLine()))
    ).toBe(true)
    expect(
      lines.some((l) =>
        l.includes(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_EN_SNIPPET)
      )
    ).toBe(true)
    expect(
      lines.some((l) =>
        l.includes(
          `help workflow partition guard: ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_REQUIRED_SNIPPET} in all ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT}`
        )
      )
    ).toBe(true)
    expect(
      lines.some((l) =>
        l.includes(formatPackagedE2eHelpWorkflowCrosslinksPackagedHelpDiagnosticLine())
      )
    ).toBe(true)
    expect(
      lines.some((l) =>
        l.includes(
          `help smoke guards: ${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_NPM_SCRIPTS.join(', ')}`
        )
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('check:packaged-e2e-scenarios-registry'))).toBe(true)
    expect(lines.some((l) => l.includes('per-step e2e'))).toBe(true)
    expect(
      lines.some((l) =>
        l.includes(`${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT} planned-gui-e2e`)
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('smoke:packaged-release'))).toBe(true)
    expect(lines.some((l) => l.includes('releaseSmoke: win/linux/macos'))).toBe(true)
    expect(lines.some((l) => l.includes('FLUXALLOY_SKIP_FFPROBE_SMOKE'))).toBe(true)
    expect(lines.some((l) => l.includes('check:terminal-summaries-ru'))).toBe(true)
    expect(lines.some((l) => l.includes(TERMINAL_CONTRACT_HINTS_HELP_DOCS_GUARD_NPM_SCRIPT))).toBe(
      true
    )
    expect(lines.some((l) => l.includes(formatTerminalContractHintsDiagnosticLine()))).toBe(true)
    expect(
      lines.some((l) => l.includes(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH))
    ).toBe(true)
    expect(lines.some((l) => l.includes(ENGINES_PREPARE_WIN_NPM_SCRIPT))).toBe(true)
    expect(lines.some((l) => l.includes(ENGINES_CI_LINUX_RUNNER))).toBe(true)
    expect(lines.some((l) => l.includes(PACK_LINUX_DIR_NPM_SCRIPT))).toBe(true)
    expect(lines.some((l) => l.includes(PACK_MAC_DIR_NPM_SCRIPT))).toBe(true)
    expect(lines.some((l) => l.includes(VERIFY_LINUX_UNPACKED_NPM_SCRIPT))).toBe(true)
    expect(lines.some((l) => l.includes(VERIFY_LINUX_RELEASE_NPM_SCRIPT))).toBe(true)
    expect(lines.some((l) => l.includes(VERIFY_MAC_UNPACKED_NPM_SCRIPT))).toBe(true)
    expect(lines.some((l) => l.includes(ENGINES_PREPARE_WIN_NPM_SCRIPT))).toBe(true)
    expect(lines.some((l) => l.includes('windows-latest'))).toBe(true)
    expect(lines.some((l) => l.includes('notarytool') && l.includes('stapler staple'))).toBe(true)
    expect(
      lines.some((l) => l.includes('Authenticode') && l.includes('CSC_IDENTITY_AUTO_DISCOVERY'))
    ).toBe(true)
    expect(lines.some((l) => l.includes('GPG deb/AppImage'))).toBe(true)
    expect(lines).toContain(formatReleaseCodeSigningRoadmapCheckReleaseDiagnosticLine())
    expect(lines).toContain(
      formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine()
    )
    expect(lines).toContain(formatReleaseCodeSigningRoadmapElectronBuilderConfigDiagnosticLine())
    expect(lines).toContain(
      formatReleaseCodeSigningRoadmapElectronBuilderYmlCommentsDiagnosticLine()
    )
    expect(lines.some((l) => l.includes('9 §19 yaml comments'))).toBe(true)
    expect(lines.some((l) => l.includes('portable/zip'))).toBe(false)
    expect(lines).toContain(formatToolchainBaselineWipHandoffCheckReleaseDiagnosticLine())
  })

  it('toolchain-baseline-wip-handoff Architecture clause matches ARCHITECTURE.md § npm', () => {
    expect(readFileSync('docs/ARCHITECTURE.md', 'utf8')).toContain(
      formatToolchainBaselineWipHandoffArchitectureClause()
    )
  })

  it('release-code-signing-roadmap Help clauses match packaged win/linux/macos Help', () => {
    expect(readFileSync('docs/ARCHITECTURE.md', 'utf8')).toContain(
      formatReleaseCodeSigningRoadmapArchitectureClause()
    )
    expect(readFileSync('docs/ARCHITECTURE.md', 'utf8')).toContain(
      formatReleaseCodeSigningRoadmapArchitectureSigningIndexedClause()
    )
    expect(readFileSync('docs/AGENT_OPERATIONAL_NOTES.md', 'utf8')).toContain(
      formatReleaseCodeSigningRoadmapOperationalNotesRow()
    )
    expect(readFileSync('docs/AGENT_OPERATIONAL_NOTES.md', 'utf8')).toContain(
      formatReleaseCodeSigningRoadmapOperationalNotesSigningIndexedRow()
    )
    expect(readFileSync('docs/AGENT_OPERATIONAL_NOTES.md', 'utf8')).toContain(
      formatReleaseCodeSigningRoadmapOperationalNotesElectronBuilderRow()
    )
    expect(readFileSync('bin/README.md', 'utf8')).toContain(
      formatReleaseCodeSigningRoadmapBinReadmeLine()
    )
    expect(readFileSync('bin/README.md', 'utf8')).toContain(
      formatReleaseCodeSigningRoadmapBinReadmeSigningIndexedLine()
    )
    expect(readFileSync('bin/README.md', 'utf8')).toContain(
      formatReleaseCodeSigningRoadmapBinReadmeElectronBuilderLine()
    )
    expect(readFileSync('bin/README.md', 'utf8')).toContain(
      formatToolchainBaselineWipHandoffBinReadmeLine()
    )
    expect(readFileSync('AGENTS.md', 'utf8')).toContain(
      formatReleaseCodeSigningRoadmapAgentsBullet()
    )
    expect(readFileSync('AGENTS.md', 'utf8')).toContain(
      formatReleaseCodeSigningRoadmapAgentsSigningIndexedBullet()
    )
    expect(readFileSync('AGENTS.md', 'utf8')).toContain(
      formatReleaseCodeSigningRoadmapAgentsElectronBuilderBullet()
    )
    expect(readFileSync('README.md', 'utf8')).toContain(formatReleaseCodeSigningRoadmapReadmeLine())
    expect(readFileSync('README.md', 'utf8')).toContain(
      formatReleaseCodeSigningRoadmapReadmeSigningIndexedLine()
    )
    expect(readFileSync('README.md', 'utf8')).toContain(
      formatReleaseCodeSigningRoadmapReadmeElectronBuilderLine()
    )
    expect(readFileSync('scripts/cursor-automation/README.md', 'utf8')).toContain(
      formatReleaseCodeSigningRoadmapSdkAutomationReadmeSigningIndexedLine()
    )
    const release = readFileSync('docs/RELEASE.md', 'utf8')
    expect(release).toContain(formatReleaseCodeSigningRoadmapReleaseCanonParagraph())
    expect(release).toContain(formatReleaseCodeSigningRoadmapReleaseSigningIndexedParagraph())
    expect(release).toContain(formatReleaseCodeSigningRoadmapReleaseLinuxHelpPointer())
    expect(release).toContain(formatReleaseCodeSigningRoadmapReleaseMacosHelpPointer())
    for (const [rel, locale] of [
      ['Help/getting-started.md', 'ru'],
      ['Help/en/getting-started.md', 'en']
    ] as const) {
      expect(readFileSync(rel, 'utf8')).toContain(
        formatReleaseCodeSigningRoadmapGettingStartedHelpClause(locale)
      )
    }
    for (const [rel, locale] of [
      ['Help/owner-manual-smoke.md', 'ru'],
      ['Help/en/owner-manual-smoke.md', 'en']
    ] as const) {
      expect(readFileSync(rel, 'utf8')).toContain(
        formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeArchiveSupportClause(locale)
      )
      expect(readFileSync(rel, 'utf8')).toContain(
        formatReleaseCodeSigningRoadmapOwnerManualSmokeArchiveClause(locale)
      )
    }
    for (const [rel, locale] of [
      ['Help/logging-and-diagnostics.md', 'ru'],
      ['Help/en/logging-and-diagnostics.md', 'en']
    ] as const) {
      expect(readFileSync(rel, 'utf8')).toContain(
        formatReleaseCodeSigningRoadmapLoggingDiagnosticsHelpClause(locale)
      )
    }
    for (const [rel, locale] of [
      ['Help/knowledge-base-howto.md', 'ru'],
      ['Help/en/knowledge-base-howto.md', 'en']
    ] as const) {
      expect(readFileSync(rel, 'utf8')).toContain(
        formatReleaseCodeSigningRoadmapKnowledgeHubHelpClause(locale)
      )
    }
    for (const [rel, locale] of [
      ['Help/workflows-planner-scenarios.md', 'ru'],
      ['Help/en/workflows-planner-scenarios.md', 'en']
    ] as const) {
      expect(readFileSync(rel, 'utf8')).toContain(
        formatReleaseCodeSigningRoadmapPlannerScenariosHelpClause(locale)
      )
    }
    for (const [rel, locale] of [
      ['Help/ffmpeg-terminal-hints.md', 'ru'],
      ['Help/en/ffmpeg-terminal-hints.md', 'en']
    ] as const) {
      expect(readFileSync(rel, 'utf8')).toContain(
        formatReleaseCodeSigningRoadmapFfmpegTerminalHintsHelpClause(locale)
      )
    }
    for (const [rel, locale, formatClause] of [
      ['Help/packaged-macos-smoke.md', 'ru', formatMacosReleaseCodeSigningRoadmapHelpClause],
      ['Help/en/packaged-macos-smoke.md', 'en', formatMacosReleaseCodeSigningRoadmapHelpClause],
      ['Help/packaged-windows-smoke.md', 'ru', formatWindowsReleaseCodeSigningRoadmapHelpClause],
      ['Help/en/packaged-windows-smoke.md', 'en', formatWindowsReleaseCodeSigningRoadmapHelpClause],
      ['Help/packaged-linux-smoke.md', 'ru', formatLinuxReleaseCodeSigningRoadmapHelpClause],
      ['Help/en/packaged-linux-smoke.md', 'en', formatLinuxReleaseCodeSigningRoadmapHelpClause]
    ] as const) {
      const text = readFileSync(rel, 'utf8')
      expect(text).toContain(formatClause(locale))
    }
  })

  it('PLATFORM_PACKAGING_NPM_SCRIPTS lists §19 script names', () => {
    expect(PLATFORM_PACKAGING_NPM_SCRIPTS).toContain(BUILD_MAC_NPM_SCRIPT)
    expect(PLATFORM_PACKAGING_NPM_SCRIPTS).toContain(PACK_LINUX_DIR_NPM_SCRIPT)
    expect(PLATFORM_PACKAGING_NPM_SCRIPTS.length).toBeGreaterThanOrEqual(9)
  })

  it('package.json exposes build:mac and build:linux', () => {
    const scripts = JSON.parse(readFileSync('package.json', 'utf8')).scripts as Record<
      string,
      string
    >
    expect(scripts[BUILD_MAC_NPM_SCRIPT]).toContain('electron-builder --mac')
    expect(scripts[BUILD_LINUX_NPM_SCRIPT]).toContain('electron-builder --linux')
    expect(scripts[PACK_MAC_DIR_NPM_SCRIPT]).toContain('electron-builder --mac --dir')
    expect(scripts[VERIFY_LINUX_RELEASE_NPM_SCRIPT]).toContain('verify-linux-release-artifacts')
  })
})
