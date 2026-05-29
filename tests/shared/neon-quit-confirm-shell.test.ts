import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.21 quit confirm shell (ui.4)', () => {
  it('QuitConfirmScreen module and ref21 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/QuitConfirmScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref21-quit-confirm.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/quit-confirm-ref21-parts.tsx')
    const data = join(process.cwd(), 'src/renderer/src/pages/quit-confirm-ref21-data.ts')
    expect(readFileSync(tsx, 'utf8')).toContain('QuitConfirmScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(parts, 'utf8')).toContain('qc-modal__eyebrow')
    expect(readFileSync(parts, 'utf8')).toContain('qc-modal__head-chip')
    expect(readFileSync(parts, 'utf8')).toContain('qc-modal__summary')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('tools-statusbar__tc')
    expect(readFileSync(tsx, 'utf8')).toContain('qc-scene')
    expect(readFileSync(tsx, 'utf8')).toContain('VELORIX_NEON_REFERENCE_QUIT_CONFIRM_REL')
    expect(readFileSync(css, 'utf8')).toContain('qc-modal')
    expect(readFileSync(parts, 'utf8')).toContain('ЗАКРЫТЬ VELORIX?')
    expect(readFileSync(data, 'utf8')).toContain('Конвертация видео')
    expect(readFileSync(data, 'utf8')).toContain('78.9% (1214/1538 кадров)')
    expect(readFileSync(data, 'utf8')).toContain('несохраненные изменения')
    expect(readFileSync(tsx, 'utf8')).toContain('QC_STATUS_ROWS')
    expect(readFileSync(data, 'utf8')).toContain('QC_MODAL_SUMMARY')
    expect(readFileSync(data, 'utf8')).toContain('QC_MODAL_CHIP')
    expect(readFileSync(data, 'utf8')).toContain('QC_STATUS_READY')
    expect(readFileSync(parts, 'utf8')).toContain('qc-modal__scroll')
    expect(readFileSync(parts, 'utf8')).toContain('qc-modal__actions-sticky')
    expect(readFileSync(css, 'utf8')).toContain('qc-task--selected')
    expect(readFileSync(css, 'utf8')).toContain('qc-modal__close:hover')
  })

  it('bootstrap supports ref.21 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref21'")
    expect(bootstrap).toContain('QuitConfirmScreen')
    expect(bootstrap).toContain('#quit-confirm')
  })
})
