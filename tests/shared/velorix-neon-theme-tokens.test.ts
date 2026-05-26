import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  VELORIX_NEON_CSS_FILES,
  VELORIX_NEON_CSS_ROOT,
  VELORIX_NEON_GLOW_TOKENS,
  VELORIX_NEON_GRADIENT_TOKENS,
  VELORIX_NEON_PRIMITIVE_COLOR_TOKENS,
  VELORIX_NEON_SEMANTIC_ALIAS_TOKENS,
  VELORIX_NEON_THEME_ID
} from '../../src/shared/velorix-neon-theme-tokens'

const BASE_CSS_PATH = join(process.cwd(), 'src/renderer/src/assets/base.css')
const NEON_INDEX_PATH = join(process.cwd(), VELORIX_NEON_CSS_ROOT, 'index.css')

function readNeonBundle(): string {
  const index = readFileSync(NEON_INDEX_PATH, 'utf8')
  const chunks = VELORIX_NEON_CSS_FILES.filter((f) => f !== 'index.css').map((file) =>
    readFileSync(join(process.cwd(), VELORIX_NEON_CSS_ROOT, file), 'utf8')
  )
  return [index, ...chunks].join('\n')
}

describe('velorix-neon-theme-tokens', () => {
  it('registers theme id and neon css tree', () => {
    expect(VELORIX_NEON_THEME_ID).toBe('velorix-neon')
    for (const file of VELORIX_NEON_CSS_FILES) {
      expect(
        readFileSync(join(process.cwd(), VELORIX_NEON_CSS_ROOT, file), 'utf8').length
      ).toBeGreaterThan(0)
    }
  })

  it('base.css imports VELORIX NEON for dark theme', () => {
    const base = readFileSync(BASE_CSS_PATH, 'utf8')
    expect(base).toContain("@import './themes/velorix-neon/index.css'")
    expect(base).not.toMatch(/html\[data-theme='dark'\][\s\S]*--fa-bg:\s*#020407/)
  })

  it('neon bundle defines primitive, gradient, glow, and fa-neon alias tokens', () => {
    const css = readNeonBundle()
    for (const token of [
      ...VELORIX_NEON_PRIMITIVE_COLOR_TOKENS,
      ...VELORIX_NEON_GRADIENT_TOKENS,
      ...VELORIX_NEON_GLOW_TOKENS,
      ...VELORIX_NEON_SEMANTIC_ALIAS_TOKENS
    ]) {
      expect(css, `missing ${token}`).toMatch(new RegExp(`${token.replace(/-/g, '\\-')}:`))
    }
    expect(css).toContain('vn-glow-pulse')
    expect(css).toContain('.vn-surface-glass')
  })
})
