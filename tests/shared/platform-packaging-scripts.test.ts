import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import {
  BUILD_LINUX_NPM_SCRIPT,
  BUILD_MAC_NPM_SCRIPT,
  formatPlatformPackagingDiagnosticLines
} from '../../src/shared/platform-packaging-scripts'

describe('platform-packaging-scripts §19', () => {
  it('formatPlatformPackagingDiagnosticLines', () => {
    const lines = formatPlatformPackagingDiagnosticLines()
    expect(lines.some((l) => l.includes(BUILD_MAC_NPM_SCRIPT))).toBe(true)
    expect(lines.some((l) => l.includes(BUILD_LINUX_NPM_SCRIPT))).toBe(true)
    expect(lines.some((l) => l.includes('electron-builder.yml'))).toBe(true)
    expect(lines.some((l) => l.includes('FLUXALLOY_SKIP_FFPROBE_SMOKE'))).toBe(true)
  })

  it('package.json exposes build:mac and build:linux', () => {
    const scripts = JSON.parse(readFileSync('package.json', 'utf8')).scripts as Record<string, string>
    expect(scripts[BUILD_MAC_NPM_SCRIPT]).toContain('electron-builder --mac')
    expect(scripts[BUILD_LINUX_NPM_SCRIPT]).toContain('electron-builder --linux')
  })
})
