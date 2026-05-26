import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  VELORIX_NEON_APP_ICON_REFERENCE_REL,
  VELORIX_NEON_LOGO_STACKED_REFERENCE_REL,
  VELORIX_NEON_LOGO_WORDMARK_REFERENCE_REL,
  VELORIX_NEON_REFERENCE_SCREEN_RELS
} from '../../src/shared/velorix-neon-theme-tokens'

describe('velorix-neon reference assets', () => {
  it('app icon reference PNG exists in docs/reference', () => {
    const path = join(process.cwd(), VELORIX_NEON_APP_ICON_REFERENCE_REL)
    expect(existsSync(path), VELORIX_NEON_APP_ICON_REFERENCE_REL).toBe(true)
  })

  it('horizontal logo wordmark reference PNG exists in docs/reference', () => {
    const path = join(process.cwd(), VELORIX_NEON_LOGO_WORDMARK_REFERENCE_REL)
    expect(existsSync(path), VELORIX_NEON_LOGO_WORDMARK_REFERENCE_REL).toBe(true)
  })

  it('stacked logo wordmark reference PNG exists in docs/reference', () => {
    const path = join(process.cwd(), VELORIX_NEON_LOGO_STACKED_REFERENCE_REL)
    expect(existsSync(path), VELORIX_NEON_LOGO_STACKED_REFERENCE_REL).toBe(true)
  })

  it.each(VELORIX_NEON_REFERENCE_SCREEN_RELS)('screen/modal reference PNG exists: %s', (rel) => {
    const path = join(process.cwd(), rel)
    expect(existsSync(path), rel).toBe(true)
  })
})
