import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.17 external script-filter shell (ui.4)', () => {
  it('ExternalScriptFilterScreen module and ref17 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/ExternalScriptFilterScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref17-external-script-filter.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/external-script-ref17-parts.tsx')
    const data = join(process.cwd(), 'src/renderer/src/pages/external-script-ref17-data.ts')
    expect(readFileSync(tsx, 'utf8')).toContain('ExternalScriptFilterScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(parts, 'utf8')).toContain('esf-center__eyebrow')
    expect(readFileSync(parts, 'utf8')).toContain('esf-center__head-chip')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__tc')
    expect(readFileSync(tsx, 'utf8')).toContain('esf-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('VELORIX_NEON_REFERENCE_EXTERNAL_SCRIPT_FILTER_REL')
    expect(readFileSync(css, 'utf8')).toContain('esf-exec')
    expect(readFileSync(css, 'utf8')).toContain('esf-validation')
    expect(readFileSync(parts, 'utf8')).toContain('ВНЕШНИЙ SCRIPT-FILTER')
    expect(readFileSync(data, 'utf8')).toContain('denoise_filter.py')
    expect(readFileSync(tsx, 'utf8')).toContain('processing-util-btn--notify')
    expect(readFileSync(tsx, 'utf8')).toContain('ESF_STATUS_ROWS')
    expect(readFileSync(data, 'utf8')).toContain('ESF_STATUS_READY')
    expect(readFileSync(parts, 'utf8')).toContain('esf-center__scroll')
    expect(readFileSync(parts, 'utf8')).toContain('ic-rail__tasks-sticky')
    expect(readFileSync(parts, 'utf8')).toContain('esf-exec-sticky')
    expect(readFileSync(css, 'utf8')).toContain('--processing-rail-w')
    expect(readFileSync(css, 'utf8')).toContain('esf-log__row--selected')
  })

  it('bootstrap supports ref.17 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref17'")
    expect(bootstrap).toContain('ExternalScriptFilterScreen')
    expect(bootstrap).toContain('#external-script-filter')
  })
})
