import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { contrastRatio, parseHexColor } from '../../src/shared/theme-contrast-math'
import {
  THEME_CONTRAST_PAIRS,
  readThemeHexTokensFromBaseCss
} from '../../src/shared/theme-contrast-pairs'

const BASE_CSS_PATH = join(process.cwd(), 'src/renderer/src/assets/base.css')
const NEON_BRIDGE_PATH = join(
  process.cwd(),
  'src/renderer/src/assets/themes/velorix-neon/10-semantic-bridge.css'
)

describe('theme-contrast-pairs §5', () => {
  const css = `${readFileSync(BASE_CSS_PATH, 'utf8')}\n${readFileSync(NEON_BRIDGE_PATH, 'utf8')}`

  it.each(['dark', 'light'] as const)(
    '%s theme semantic token pairs meet WCAG thresholds',
    (theme) => {
      const tokens = readThemeHexTokensFromBaseCss(css, theme)
      for (const pair of THEME_CONTRAST_PAIRS) {
        const fgHex = tokens.get(pair.foreground)
        const bgHex = tokens.get(pair.background)
        expect(fgHex, `${theme} ${pair.foreground}`).toBeTruthy()
        expect(bgHex, `${theme} ${pair.background}`).toBeTruthy()
        const fg = parseHexColor(fgHex!)
        const bg = parseHexColor(bgHex!)
        expect(fg && bg, `${pair.id} parse`).toBeTruthy()
        const ratio = contrastRatio(fg!, bg!)
        expect(
          ratio,
          `${theme} ${pair.id} (${pair.foreground} on ${pair.background})`
        ).toBeGreaterThanOrEqual(pair.minRatio)
      }
    }
  )
})
