import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import {
  ENGINES_PREPARE_LINUX_NPM_SCRIPT,
  ENGINES_PREPARE_MAC_NPM_SCRIPT
} from '../../src/shared/platform-packaging-npm-scripts'

describe('prepare-engines-bundled-first §2.1', () => {
  const scripts = JSON.parse(readFileSync('package.json', 'utf8')).scripts as Record<string, string>

  it('package.json wires mac/linux prepare help scripts', () => {
    expect(scripts[ENGINES_PREPARE_MAC_NPM_SCRIPT]).toContain(
      'prepare-engines-bundled-first.mjs mac'
    )
    expect(scripts[ENGINES_PREPARE_LINUX_NPM_SCRIPT]).toContain(
      'prepare-engines-bundled-first.mjs linux'
    )
  })

  it('engines:prepare:mac prints bundled-first steps and exits 0', () => {
    const out = execFileSync(
      process.execPath,
      ['scripts/release/prepare-engines-bundled-first.mjs', 'mac'],
      { cwd: process.cwd(), encoding: 'utf8' }
    )
    expect(out).toContain('engines:doctor')
    expect(out).toContain('pack:mac:dir')
    expect(out).toMatch(/отсутствуют:|все три бинарника|unix engines ready/)
  })

  it('predev uses predev-engines.mjs', () => {
    expect(scripts['predev']).toContain('predev-engines.mjs')
  })
})
