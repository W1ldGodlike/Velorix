import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  THEME_FORBIDDEN_MAIN_CSS_FONT_SIZE_PX,
  THEME_FORBIDDEN_MAIN_CSS_FONT_SIZE_REM,
  THEME_SHELL_TYPOGRAPHY_ASSERTIONS
} from '../../src/shared/theme-typography-css'

const MAIN_CSS_PATH = join(process.cwd(), 'src/renderer/src/assets/main.css')
const BASE_CSS_PATH = join(process.cwd(), 'src/renderer/src/assets/base.css')

const FONT_SIZE_TOKENS = [
  '--fa-font-size-3xs',
  '--fa-font-size-2xs',
  '--fa-font-size-xs',
  '--fa-font-size-sm',
  '--fa-font-size-md',
  '--fa-font-size-body',
  '--fa-font-size-lg',
  '--fa-font-size-xl',
  '--fa-font-size-base-lg',
  '--fa-font-size-px-11'
] as const

function ruleBlock(css: string, selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, 's'))
  return match?.[1] ?? ''
}

describe('theme-typography-css §5', () => {
  it('base.css defines font-size tokens for dark and light', () => {
    const css = readFileSync(BASE_CSS_PATH, 'utf8')
    for (const token of FONT_SIZE_TOKENS) {
      expect(css, token).toMatch(new RegExp(`${token.replace(/-/g, '\\-')}:`))
    }
  })

  it('shell controls use --fa-font-size-* in font-size', () => {
    const css = readFileSync(MAIN_CSS_PATH, 'utf8')
    for (const { selector, mustInclude } of THEME_SHELL_TYPOGRAPHY_ASSERTIONS) {
      const block = ruleBlock(css, selector)
      expect(block.length, selector).toBeGreaterThan(0)
      expect(block, selector).toContain(mustInclude)
    }
  })

  it('main.css has no raw rem or px in font-size', () => {
    const css = readFileSync(MAIN_CSS_PATH, 'utf8')
    expect(css.match(THEME_FORBIDDEN_MAIN_CSS_FONT_SIZE_REM) ?? []).toEqual([])
    expect(css.match(THEME_FORBIDDEN_MAIN_CSS_FONT_SIZE_PX) ?? []).toEqual([])
  })
})
