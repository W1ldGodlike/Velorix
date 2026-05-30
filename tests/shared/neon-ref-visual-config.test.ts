import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

const CONFIG = join(process.cwd(), 'scripts/e2e/neon-ref-visual-config.mjs')
const RUNNER = join(process.cwd(), 'scripts/e2e/neon-ref-visual.mjs')

describe('neon-ref-visual tooling', () => {
  it('config maps ref1 to processing PNG and shell selectors', () => {
    const text = readFileSync(CONFIG, 'utf8')
    expect(text).toContain("refId: 'ref1'")
    expect(text).toContain('velorix-neon-reference-processing.png')
    expect(text).toContain("captureSelector: '.neon-chrome-shell'")
    expect(text).toContain('workArea')
    expect(text).toContain("shellSelector: '#ref1'")
  })

  it('runner wires playwright capture + pixelmatch diff + IDE display', () => {
    const text = readFileSync(RUNNER, 'utf8')
    expect(text).toContain("from 'playwright'")
    expect(text).toContain('pixelmatch')
    expect(text).toContain('resolveCaptureWorkArea')
    expect(text).toContain('captureSelector')
    expect(text).toContain('VELORIX_REF_VISUAL')
    expect(text).toContain('SIGKILL')
  })

  it('package.json exposes neon:ref:visual scripts', () => {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8')) as {
      scripts: Record<string, string>
    }
    expect(pkg.scripts['neon:ref:visual']).toContain('neon-ref-visual.mjs run')
    expect(pkg.scripts['neon:ref:visual:capture']).toContain('capture')
    expect(pkg.scripts['neon:ref:visual:diff']).toContain('diff')
  })
})
