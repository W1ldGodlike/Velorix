import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { THEME_FORBIDDEN_MAIN_CSS_RADIUS_LITERAL } from '../../src/shared/theme-radius-css'

const MAIN_CSS_PATH = join(process.cwd(), 'src/renderer/src/assets/main.css')
const BASE_CSS_PATH = join(process.cwd(), 'src/renderer/src/assets/base.css')

const RADIUS_TOKENS = [
  '--fa-radius-hairline',
  '--fa-radius-2xs',
  '--fa-radius-xs',
  '--fa-radius-sm',
  '--fa-radius-md',
  '--fa-radius-control',
  '--fa-radius-panel',
  '--fa-radius-lg',
  '--fa-radius-preview',
  '--fa-radius-pill',
  '--fa-radius-circle'
] as const

describe('theme-radius-css §5', () => {
  it('base.css defines radius token ladder for dark and light', () => {
    const css = readFileSync(BASE_CSS_PATH, 'utf8')
    for (const token of RADIUS_TOKENS) {
      expect(css, token).toMatch(new RegExp(`${token.replace(/-/g, '\\-')}:`))
    }
  })

  it('main.css uses only --fa-radius-* tokens for border-radius', () => {
    const css = readFileSync(MAIN_CSS_PATH, 'utf8')
    const matches = css.match(THEME_FORBIDDEN_MAIN_CSS_RADIUS_LITERAL) ?? []
    expect(matches).toEqual([])
  })
})
