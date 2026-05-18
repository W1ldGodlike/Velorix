import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  THEME_FORBIDDEN_MAIN_CSS_LINE_HEIGHT_LITERAL,
  THEME_SHELL_LINE_HEIGHT_ASSERTIONS
} from '../../src/shared/theme-line-height-css'
import { tokenizeLineHeightLiterals } from '../../src/shared/theme-line-height-tokenize'

const MAIN_CSS_PATH = join(process.cwd(), 'src/renderer/src/assets/main.css')
const BASE_CSS_PATH = join(process.cwd(), 'src/renderer/src/assets/base.css')

const LINE_HEIGHT_TOKENS = [
  '--fa-line-height-body',
  '--fa-line-height-ui',
  '--fa-line-height-tight',
  '--fa-line-height-none'
] as const

function ruleBlock(css: string, selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, 's'))
  return match?.[1] ?? ''
}

describe('theme-line-height-css §5', () => {
  it('base.css defines line-height tokens for dark and light', () => {
    const css = readFileSync(BASE_CSS_PATH, 'utf8')
    for (const token of LINE_HEIGHT_TOKENS) {
      expect(css, token).toMatch(new RegExp(`${token.replace(/-/g, '\\-')}:`))
    }
  })

  it('tokenizeLineHeightLiterals maps unitless values', () => {
    expect(tokenizeLineHeightLiterals('1.35')).toBe('var(--fa-line-height-body)')
    expect(tokenizeLineHeightLiterals('var(--fa-line-height-body)')).toBe(
      'var(--fa-line-height-body)'
    )
  })

  it('shell controls use --fa-line-height-*', () => {
    const css = readFileSync(MAIN_CSS_PATH, 'utf8')
    for (const { selector, mustInclude } of THEME_SHELL_LINE_HEIGHT_ASSERTIONS) {
      const block = ruleBlock(css, selector)
      expect(block.length, selector).toBeGreaterThan(0)
      expect(block, selector).toContain(mustInclude)
    }
  })

  it('main.css has no unitless line-height literals', () => {
    const css = readFileSync(MAIN_CSS_PATH, 'utf8')
    expect(css.match(THEME_FORBIDDEN_MAIN_CSS_LINE_HEIGHT_LITERAL) ?? []).toEqual([])
  })
})
