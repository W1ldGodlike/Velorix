import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  UI_HIDPI_CSS_MEDIA_TIERS,
  UI_HIDPI_CSS_SURFACE_SELECTORS,
  UI_HIDPI_WINDOWS_SCALE_PERCENTS,
  formatUiHidpiScaleDiagnosticLine,
  windowsScalePercentToLogicalScaleFactor
} from '../../src/shared/ui-hidpi-scale-tiers'

const REPO_ROOT = join(import.meta.dirname, '../..')
const MAIN_CSS_PATH = join(REPO_ROOT, 'src/renderer/src/assets/main.css')

function extractMainCssMediaBlock(css: string, minResolutionDpi: number): string {
  const marker = `(min-resolution: ${minResolutionDpi}dpi)`
  const start = css.indexOf(marker)
  if (start < 0) {
    return ''
  }
  const brace = css.indexOf('{', start)
  if (brace < 0) {
    return ''
  }
  let depth = 0
  for (let i = brace; i < css.length; i++) {
    if (css[i] === '{') {
      depth++
    } else if (css[i] === '}') {
      depth--
      if (depth === 0) {
        return css.slice(brace + 1, i)
      }
    }
  }
  return ''
}

describe('ui-hidpi-scale-tiers', () => {
  it('Windows 100/125/150/200 % ↔ logical scaleFactor', () => {
    expect(UI_HIDPI_WINDOWS_SCALE_PERCENTS).toEqual([100, 125, 150, 200])
    expect(windowsScalePercentToLogicalScaleFactor(125)).toBe(1.25)
    expect(windowsScalePercentToLogicalScaleFactor(200)).toBe(2)
  })

  it('formatUiHidpiScaleDiagnosticLine перечисляет dpi-ярусы', () => {
    const line = formatUiHidpiScaleDiagnosticLine()
    expect(line).toContain('125%→120dpi')
    expect(line).toContain('app-settings-dialog')
  })

  it('main.css содержит @media для 120/144/168/192 dpi и селекторы поверхностей в 125 % блоке', () => {
    const css = readFileSync(MAIN_CSS_PATH, 'utf8')
    for (const tier of UI_HIDPI_CSS_MEDIA_TIERS) {
      expect(css).toContain(`(min-resolution: ${tier.minResolutionDpi}dpi)`)
      expect(css).toContain(`(-webkit-min-device-pixel-ratio: ${tier.minDevicePixelRatio})`)
    }
    const block125 = extractMainCssMediaBlock(css, 120)
    expect(block125.length).toBeGreaterThan(200)
    for (const selector of UI_HIDPI_CSS_SURFACE_SELECTORS) {
      expect(block125).toContain(`.${selector}`)
    }
  })
})
