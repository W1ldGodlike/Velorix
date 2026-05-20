import { describe, expect, it } from 'vitest'

import { formatElectronViteEsmShimFixDiagnosticLine } from '../../src/shared/electron-vite-build-meta'
import {
  formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine,
  formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine,
  formatPackagedGuiE2ePlaywrightScaffoldDiagnosticLine
} from '../../src/shared/packaged-gui-e2e-playwright-meta'
import {
  CHECK_RELEASE_LOCAL_NPM_SCRIPT,
  CHECK_RELEASE_NPM_SCRIPT,
  formatCheckReleaseScriptDiagnosticLines
} from '../../src/shared/check-release-scripts'
import {
  formatReleaseCodeSigningRoadmapCheckReleaseDiagnosticLine,
  formatReleaseCodeSigningRoadmapElectronBuilderConfigDiagnosticLine,
  formatReleaseCodeSigningRoadmapElectronBuilderYmlCommentsDiagnosticLine,
  formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine
} from '../../src/shared/release-code-signing-roadmap'
import { formatToolchainBaselineWipHandoffCheckReleaseDiagnosticLine } from '../../src/shared/toolchain-baseline-wip-handoff-meta'

describe('check-release-scripts', () => {
  it('formatCheckReleaseScriptDiagnosticLines', () => {
    const lines = formatCheckReleaseScriptDiagnosticLines()
    expect(lines.some((l) => l.includes(CHECK_RELEASE_NPM_SCRIPT))).toBe(true)
    expect(lines.some((l) => l.includes(CHECK_RELEASE_LOCAL_NPM_SCRIPT))).toBe(true)
    expect(lines.some((l) => l.includes('engines:prepare:win'))).toBe(true)
    expect(lines.some((l) => l.includes('FLUXALLOY_SKIP_FFPROBE_SMOKE'))).toBe(true)
    expect(lines.some((l) => l.includes('check:terminal-summaries-ru'))).toBe(true)
    expect(lines).toContain(formatElectronViteEsmShimFixDiagnosticLine())
    expect(lines).toContain(formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine())
    expect(lines).toContain(formatPackagedGuiE2ePlaywrightScaffoldDiagnosticLine())
    expect(lines).toContain(formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine())
    expect(lines).toContain(formatReleaseCodeSigningRoadmapCheckReleaseDiagnosticLine())
    expect(lines).toContain(
      formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine()
    )
    expect(lines).toContain(formatReleaseCodeSigningRoadmapElectronBuilderConfigDiagnosticLine())
    expect(lines).toContain(
      formatReleaseCodeSigningRoadmapElectronBuilderYmlCommentsDiagnosticLine()
    )
    expect(lines).toContain(formatToolchainBaselineWipHandoffCheckReleaseDiagnosticLine())
  })
})
