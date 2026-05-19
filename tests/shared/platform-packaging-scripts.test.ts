import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_BIN_README_PATH,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_NPM_SCRIPTS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_WORKFLOW_PARTITION_EN_SNIPPET,
  formatPackagedE2eHelpWorkflowCrosslinksDiagnosticLine,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedHelpDiagnosticLine
} from '../../src/shared/packaged-e2e-smoke-scenarios'
import {
  TERMINAL_CONTRACT_HINTS_HELP_DOCS_GUARD_NPM_SCRIPT,
  formatTerminalContractHintsDiagnosticLine
} from '../../src/shared/terminal-contract-hints-meta'
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
    expect(lines.some((l) => l.includes('8 planned-gui-e2e'))).toBe(true)
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
