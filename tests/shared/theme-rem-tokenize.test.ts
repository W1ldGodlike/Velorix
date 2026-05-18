import { describe, expect, it } from 'vitest'

import { tokenizeFontSizeLiterals } from '../../src/shared/theme-font-size-rem-tokenize'
import { tokenizeLineHeightLiterals } from '../../src/shared/theme-line-height-tokenize'
import { tokenizeSpacingRemLiterals } from '../../src/shared/theme-spacing-rem-tokenize'

describe('theme rem tokenize §5', () => {
  it('maps font-size rem literals to --fa-font-size-*', () => {
    expect(tokenizeFontSizeLiterals('0.72rem')).toBe('var(--fa-font-size-sm)')
    expect(tokenizeFontSizeLiterals('11px')).toBe('var(--fa-font-size-px-11)')
    expect(tokenizeFontSizeLiterals('0.704rem')).toBe('var(--fa-font-size-sm)')
  })

  it('leaves font-size values that already use tokens', () => {
    expect(tokenizeFontSizeLiterals('var(--fa-font-size-sm)')).toBe('var(--fa-font-size-sm)')
  })

  it('maps spacing rem literals to --fa-space-*', () => {
    expect(tokenizeSpacingRemLiterals('0.5rem')).toBe('var(--fa-space-2)')
    expect(tokenizeSpacingRemLiterals('0.35rem 0.55rem')).toBe(
      'var(--fa-space-compact) var(--fa-space-inline)'
    )
  })

  it('leaves spacing values that already use tokens', () => {
    expect(tokenizeSpacingRemLiterals('var(--fa-space-3)')).toBe('var(--fa-space-3)')
  })

  it('maps line-height unitless literals to --fa-line-height-*', () => {
    expect(tokenizeLineHeightLiterals('1.35')).toBe('var(--fa-line-height-body)')
    expect(tokenizeLineHeightLiterals('var(--fa-line-height-ui)')).toBe('var(--fa-line-height-ui)')
  })
})
