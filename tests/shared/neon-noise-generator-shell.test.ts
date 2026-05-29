import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.14 noise generator shell (ui.4)', () => {
  it('NoiseGeneratorScreen module and ref14 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/NoiseGeneratorScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref14-noise-generator.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/noise-generator-ref14-parts.tsx')
    const data = join(process.cwd(), 'src/renderer/src/pages/noise-generator-ref14-data.ts')
    expect(readFileSync(tsx, 'utf8')).toContain('NoiseGeneratorScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(parts, 'utf8')).toContain('ng-center__eyebrow')
    expect(readFileSync(parts, 'utf8')).toContain('ng-center__head-chip')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__tc')
    expect(readFileSync(tsx, 'utf8')).toContain('ng-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('VELORIX_NEON_REFERENCE_NOISE_GENERATOR_REL')
    expect(readFileSync(css, 'utf8')).toContain('ng-wave')
    expect(readFileSync(css, 'utf8')).toContain('ng-spectrum')
    expect(readFileSync(parts, 'utf8')).toContain('ГЕНЕРАТОР ШУМА')
    expect(readFileSync(data, 'utf8')).toContain('WHITE NOISE')
    expect(readFileSync(tsx, 'utf8')).toContain('processing-util-btn--notify')
    expect(readFileSync(parts, 'utf8')).toContain('ng-center__scroll')
    expect(readFileSync(parts, 'utf8')).toContain('ic-rail__tasks-sticky')
    expect(readFileSync(tsx, 'utf8')).toContain('NG_STATUS_ROWS')
    expect(readFileSync(data, 'utf8')).toContain('NG_STATUS_READY')
    expect(readFileSync(css, 'utf8')).toContain('--processing-rail-w')
    expect(readFileSync(css, 'utf8')).toContain('.ng-type-card:hover')
    expect(readFileSync(css, 'utf8')).toContain('ng-export-sticky')
  })

  it('bootstrap supports ref.14 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref14'")
    expect(bootstrap).toContain('NoiseGeneratorScreen')
    expect(bootstrap).toContain('#noise-generator')
  })
})
