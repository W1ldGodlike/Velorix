import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  UI_REDUCED_MOTION_MEDIA_QUERY,
  UI_REDUCED_MOTION_TRANSITION_SELECTORS
} from '../../src/shared/ui-reduced-motion-css'

const MAIN_CSS_PATH = join(import.meta.dirname, '../../src/renderer/src/assets/main.css')

describe('ui-reduced-motion-css §4.4', () => {
  const css = readFileSync(MAIN_CSS_PATH, 'utf8')

  it('main.css declares prefers-reduced-motion override', () => {
    expect(css).toContain(`@media ${UI_REDUCED_MOTION_MEDIA_QUERY}`)
    expect(css).toContain('transition-duration: 0.01ms !important')
    expect(css).toContain('scroll-behavior: auto !important')
  })

  it('transition hotspots remain defined in main.css', () => {
    for (const selector of UI_REDUCED_MOTION_TRANSITION_SELECTORS) {
      expect(css).toContain(selector)
    }
  })
})
