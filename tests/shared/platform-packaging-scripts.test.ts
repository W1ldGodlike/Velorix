import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import {
  BUILD_LINUX_NPM_SCRIPT,
  BUILD_MAC_NPM_SCRIPT,
  ENGINES_PREPARE_LINUX_NPM_SCRIPT,
  ENGINES_PREPARE_MAC_NPM_SCRIPT,
  ENGINES_PREPARE_WIN_NPM_SCRIPT,
  LINUX_RELEASE_LOCAL_ONLY_POLICY,
  MAC_PACK_LOCAL_ONLY_POLICY,
  PACK_LINUX_DIR_NPM_SCRIPT,
  PACK_MAC_DIR_NPM_SCRIPT,
  PLATFORM_PACKAGING_NPM_SCRIPTS,
  VERIFY_LINUX_RELEASE_NPM_SCRIPT,
  VERIFY_LINUX_UNPACKED_NPM_SCRIPT,
  VERIFY_MAC_UNPACKED_NPM_SCRIPT,
  formatPlatformPackagingDiagnosticLines
} from '../../src/shared/platform-packaging-scripts'

describe('platform-packaging-scripts §19', () => {
  it('formatPlatformPackagingDiagnosticLines includes core release scripts', () => {
    const lines = formatPlatformPackagingDiagnosticLines()
    expect(lines.some((l) => l.includes(ENGINES_PREPARE_WIN_NPM_SCRIPT))).toBe(true)
    expect(lines.some((l) => l.includes(BUILD_MAC_NPM_SCRIPT))).toBe(true)
    expect(lines.some((l) => l.includes(MAC_PACK_LOCAL_ONLY_POLICY))).toBe(true)
    expect(lines.some((l) => l.includes(LINUX_RELEASE_LOCAL_ONLY_POLICY))).toBe(true)
    expect(lines.some((l) => l.includes(BUILD_LINUX_NPM_SCRIPT))).toBe(true)
    expect(lines.some((l) => l.includes('check:platform-packaging-scripts'))).toBe(true)
    expect(lines.some((l) => l.includes('smoke:packaged-release'))).toBe(true)
  })

  it('PLATFORM_PACKAGING_NPM_SCRIPTS lists §19 script names', () => {
    expect(PLATFORM_PACKAGING_NPM_SCRIPTS).toContain(BUILD_MAC_NPM_SCRIPT)
    expect(PLATFORM_PACKAGING_NPM_SCRIPTS).toContain(PACK_LINUX_DIR_NPM_SCRIPT)
    expect(PLATFORM_PACKAGING_NPM_SCRIPTS).toContain(ENGINES_PREPARE_MAC_NPM_SCRIPT)
    expect(PLATFORM_PACKAGING_NPM_SCRIPTS).toContain(ENGINES_PREPARE_LINUX_NPM_SCRIPT)
    expect(PLATFORM_PACKAGING_NPM_SCRIPTS.length).toBeGreaterThanOrEqual(11)
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
    expect(scripts[VERIFY_LINUX_UNPACKED_NPM_SCRIPT]).toContain('verify-linux-unpacked-layout')
    expect(scripts[VERIFY_MAC_UNPACKED_NPM_SCRIPT]).toContain('verify-macos-unpacked-layout')
  })
})
