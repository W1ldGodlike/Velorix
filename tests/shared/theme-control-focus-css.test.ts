import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  THEME_FORBIDDEN_MAIN_CSS_HEX,
  THEME_PRIMARY_CONTROL_CSS_ASSERTIONS
} from '../../src/shared/theme-control-focus-css'

const MAIN_CSS_PATH = join(process.cwd(), 'src/renderer/src/assets/main.css')

function ruleBlock(css: string, selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, 's'))
  return match?.[1] ?? ''
}

describe('theme-control-focus-css §5', () => {
  const css = readFileSync(MAIN_CSS_PATH, 'utf8')

  it('primary controls use semantic hover/focus/disabled tokens', () => {
    for (const { selector, mustInclude } of THEME_PRIMARY_CONTROL_CSS_ASSERTIONS) {
      const block = ruleBlock(css, selector)
      expect(block.length, `missing rule ${selector}`).toBeGreaterThan(0)
      expect(block, selector).toContain(mustInclude)
    }
  })

  it('main.css avoids hard-coded dark gray hex literals', () => {
    for (const hex of THEME_FORBIDDEN_MAIN_CSS_HEX) {
      expect(css, hex).not.toContain(hex)
    }
  })
})
