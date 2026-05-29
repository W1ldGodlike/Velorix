import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  VELORIX_NEON_CSS_FILES,
  VELORIX_NEON_CSS_ROOT,
  VELORIX_NEON_GLOW_TOKENS,
  VELORIX_NEON_GRADIENT_TOKENS,
  VELORIX_NEON_PRIMITIVE_COLOR_TOKENS,
  VELORIX_NEON_SEMANTIC_ALIAS_TOKENS
} from '../../src/shared/velorix-neon-theme-tokens'

describe('neon css pack (ui.1)', () => {
  it('declared CSS shards exist under VELORIX_NEON_CSS_ROOT', () => {
    for (const file of VELORIX_NEON_CSS_FILES) {
      const path = join(process.cwd(), VELORIX_NEON_CSS_ROOT, file)
      expect(existsSync(path), `${VELORIX_NEON_CSS_ROOT}/${file}`).toBe(true)
    }
  })

  it('primitives CSS defines registry color tokens', () => {
    const css = readFileSync(
      join(process.cwd(), VELORIX_NEON_CSS_ROOT, '01-primitives.css'),
      'utf8'
    )
    for (const token of VELORIX_NEON_PRIMITIVE_COLOR_TOKENS) {
      expect(css, token).toContain(`${token}:`)
    }
  })

  it('semantic bridge defines --fa-neon-* aliases', () => {
    const css = readFileSync(
      join(process.cwd(), VELORIX_NEON_CSS_ROOT, '10-semantic-bridge.css'),
      'utf8'
    )
    for (const token of VELORIX_NEON_SEMANTIC_ALIAS_TOKENS) {
      expect(css, token).toContain(`${token}:`)
    }
  })

  it('gradients and glow shards define registry tokens', () => {
    const gradients = readFileSync(
      join(process.cwd(), VELORIX_NEON_CSS_ROOT, '04-gradients.css'),
      'utf8'
    )
    for (const token of VELORIX_NEON_GRADIENT_TOKENS) {
      expect(gradients, token).toContain(`${token}:`)
    }
    const glow = readFileSync(join(process.cwd(), VELORIX_NEON_CSS_ROOT, '05-glow.css'), 'utf8')
    for (const token of VELORIX_NEON_GLOW_TOKENS) {
      expect(glow, token).toContain(`${token}:`)
    }
  })
})
