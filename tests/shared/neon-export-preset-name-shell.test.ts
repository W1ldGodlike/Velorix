import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.18 export preset name shell (ui.4)', () => {
  it('ExportPresetNameScreen module and ref18 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/ExportPresetNameScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref18-export-preset-name.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/export-preset-ref18-parts.tsx')
    const data = join(process.cwd(), 'src/renderer/src/pages/export-preset-ref18-data.ts')
    expect(readFileSync(tsx, 'utf8')).toContain('ExportPresetNameScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(parts, 'utf8')).toContain('epn-modal__eyebrow')
    expect(readFileSync(parts, 'utf8')).toContain('epn-modal__head-chip')
    expect(readFileSync(parts, 'utf8')).toContain('epn-modal__summary')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__tc')
    expect(readFileSync(tsx, 'utf8')).toContain('epn-scene')
    expect(readFileSync(tsx, 'utf8')).toContain('VELORIX_NEON_REFERENCE_EXPORT_PRESET_NAME_REL')
    expect(readFileSync(css, 'utf8')).toContain('epn-modal')
    expect(readFileSync(parts, 'utf8')).toContain('ИМЯ ПРЕСЕТА ЭКСПОРТА')
    expect(readFileSync(data, 'utf8')).toContain('Мой пресет экспорта 4K')
    expect(readFileSync(tsx, 'utf8')).toContain('EPN_STATUS_ROWS')
    expect(readFileSync(data, 'utf8')).toContain('EPN_MODAL_SUMMARY')
    expect(readFileSync(data, 'utf8')).toContain('EPN_MODAL_CHIP')
    expect(readFileSync(data, 'utf8')).toContain('EPN_STATUS_READY')
    expect(readFileSync(parts, 'utf8')).toContain('epn-modal__scroll')
    expect(readFileSync(parts, 'utf8')).toContain('epn-modal__actions-sticky')
    expect(readFileSync(css, 'utf8')).toContain('epn-modal__close:hover')
    expect(readFileSync(css, 'utf8')).toContain('epn-backdrop__tile--active')
    expect(readFileSync(css, 'utf8')).toContain('epn-info__row--selected')
  })

  it('bootstrap supports ref.18 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref18'")
    expect(bootstrap).toContain('ExportPresetNameScreen')
    expect(bootstrap).toContain('#export-preset-name')
  })
})
