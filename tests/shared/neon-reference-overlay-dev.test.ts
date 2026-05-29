import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { VELORIX_NEON_REFERENCE_PROCESSING_REL } from '../../src/shared/velorix-neon-theme-tokens'
import {
  refOverlayUrlForRel,
  NEON_REF_OVERLAY_FIT_KEY,
  NEON_REF_OVERLAY_STORAGE_KEY,
  NEON_REF_OVERLAY_VISIBLE_KEY,
  writeRefOverlayFit
} from '../../src/shared/neon-reference-overlay-dev'

describe('neon reference overlay dev (ui.2 ref.1)', () => {
  it('refOverlayUrlForRel maps processing PNG to velorixref scheme', () => {
    expect(refOverlayUrlForRel(VELORIX_NEON_REFERENCE_PROCESSING_REL)).toBe(
      'velorixref://velorix-neon-reference-processing.png'
    )
  })

  it('ProcessingScreen wires NeonReferenceOverlay in dev', () => {
    const tsx = readFileSync(
      join(process.cwd(), 'src/renderer/src/pages/ProcessingScreen.tsx'),
      'utf8'
    )
    expect(tsx).toContain('NeonReferenceOverlay')
    expect(tsx).toContain('import.meta.env.DEV')
  })

  it('reference protocol and overlay module exist', () => {
    const protocol = readFileSync(
      join(process.cwd(), 'src/main/core/reference-assets-protocol.ts'),
      'utf8'
    )
    const overlay = readFileSync(
      join(process.cwd(), 'src/renderer/src/components/NeonReferenceOverlay.tsx'),
      'utf8'
    )
    expect(protocol).toContain("scheme: 'velorixref'")
    expect(overlay).toContain('refOverlayUrlForRel')
    expect(overlay).toContain('neon-ref-overlay__hud')
    expect(overlay).toContain("event.key !== 'o'")
    expect(
      readFileSync(
        join(process.cwd(), 'src/renderer/src/assets/neon-reference-overlay.css'),
        'utf8'
      )
    ).toContain('object-position: top center')
    expect(readFileSync(join(process.cwd(), 'src/renderer/index.html'), 'utf8')).toContain(
      'velorixref:'
    )
  })

  it('exports localStorage keys for overlay HUD', () => {
    expect(NEON_REF_OVERLAY_STORAGE_KEY).toContain('refOverlay.opacity')
    expect(NEON_REF_OVERLAY_VISIBLE_KEY).toContain('refOverlay.visible')
    expect(NEON_REF_OVERLAY_FIT_KEY).toContain('refOverlay.fit')
  })

  it('exports writeRefOverlayFit helper', () => {
    expect(typeof writeRefOverlayFit).toBe('function')
  })
})
