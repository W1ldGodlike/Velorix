import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.12 file maintenance shell (ui.4)', () => {
  it('FileMaintenanceScreen module and ref12 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/FileMaintenanceScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref12-file-maintenance.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/file-maintenance-ref12-parts.tsx')
    const data = join(process.cwd(), 'src/renderer/src/pages/file-maintenance-ref12-data.ts')
    expect(readFileSync(tsx, 'utf8')).toContain('FileMaintenanceScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(tsx, 'utf8')).toContain('fm-scene')
    expect(readFileSync(tsx, 'utf8')).toContain('VELORIX_NEON_REFERENCE_FILE_MAINTENANCE_REL')
    expect(readFileSync(css, 'utf8')).toContain('fm-modal')
    expect(readFileSync(css, 'utf8')).toContain('fm-op-card')
    expect(readFileSync(parts, 'utf8')).toContain('FileMaintenanceModalPanel')
    expect(readFileSync(data, 'utf8')).toContain('REMUX REPAIR')
    expect(readFileSync(parts, 'utf8')).toContain('fm-modal__eyebrow')
    expect(readFileSync(parts, 'utf8')).toContain('fm-modal__head-chip')
    expect(readFileSync(parts, 'utf8')).toContain('fm-modal__summary')
    expect(readFileSync(data, 'utf8')).toContain('FM_MODAL_SUMMARY')
    expect(readFileSync(data, 'utf8')).toContain('FM_MODAL_CHIP')
    expect(readFileSync(parts, 'utf8')).toContain('fm-modal__scroll')
    expect(readFileSync(parts, 'utf8')).toContain('fm-modal__foot-sticky')
    expect(readFileSync(css, 'utf8')).toContain('.fm-op-card:hover')
    expect(readFileSync(css, 'utf8')).toContain('.fm-modal__close:hover')
  })

  it('bootstrap supports ref.12 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref12'")
    expect(bootstrap).toContain('FileMaintenanceScreen')
    expect(bootstrap).toContain('#file-maintenance')
  })
})
