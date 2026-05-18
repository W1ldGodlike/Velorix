import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  THEME_FORBIDDEN_MAIN_CSS_MARGIN_PADDING_PX,
  THEME_SHELL_SPACING_ASSERTIONS
} from '../../src/shared/theme-spacing-css'

const MAIN_CSS_PATH = join(process.cwd(), 'src/renderer/src/assets/main.css')
const BASE_CSS_PATH = join(process.cwd(), 'src/renderer/src/assets/base.css')

const SPACE_TOKENS = [
  '--fa-space-0',
  '--fa-space-1',
  '--fa-space-2',
  '--fa-space-3',
  '--fa-space-4',
  '--fa-space-overlap-hairline'
] as const

function ruleBlock(css: string, selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, 's'))
  return match?.[1] ?? ''
}

describe('theme-spacing-css §5', () => {
  it('base.css defines spacing tokens for dark and light', () => {
    const css = readFileSync(BASE_CSS_PATH, 'utf8')
    for (const token of SPACE_TOKENS) {
      expect(css, token).toMatch(new RegExp(`${token.replace(/-/g, '\\-')}:`))
    }
  })

  it('shell controls use --fa-space-* in padding/gap', () => {
    const css = readFileSync(MAIN_CSS_PATH, 'utf8')
    for (const { selector, mustInclude } of THEME_SHELL_SPACING_ASSERTIONS) {
      const block = ruleBlock(css, selector)
      expect(block.length, selector).toBeGreaterThan(0)
      expect(block, selector).toContain(mustInclude)
    }
  })

  it('main.css does not use px literals in margin/padding', () => {
    const css = readFileSync(MAIN_CSS_PATH, 'utf8')
    const matches = css.match(THEME_FORBIDDEN_MAIN_CSS_MARGIN_PADDING_PX) ?? []
    expect(matches).toEqual([])
  })
})
