/**
 * §5 — замена rem-литералов в значениях padding/margin на ближайший --fa-space-*.
 */

const REM_TO_TOKEN: Readonly<Record<string, string>> = {
  '0.05rem': 'var(--fa-space-pad-micro)',
  '0.06rem': 'var(--fa-space-pad-micro)',
  '0.08rem': 'var(--fa-space-gap-4xs)',
  '0.1rem': 'var(--fa-space-pad-xs)',
  '0.12rem': 'var(--fa-space-gap-3xs)',
  '0.15rem': 'var(--fa-space-tight)',
  '0.18rem': 'var(--fa-space-gap-2xs)',
  '0.2rem': 'var(--fa-space-gap-2)',
  '0.22rem': 'var(--fa-space-gap-xs)',
  '0.24rem': 'var(--fa-space-gap-tight)',
  '0.25rem': 'var(--fa-space-1)',
  '0.28rem': 'var(--fa-space-gap-tight)',
  '0.3rem': 'var(--fa-space-gap-trim)',
  '0.32rem': 'var(--fa-space-gap-toolbar)',
  '0.34rem': 'var(--fa-space-compact)',
  '0.35rem': 'var(--fa-space-compact)',
  '0.36rem': 'var(--fa-space-compact)',
  '0.38rem': 'var(--fa-space-compact)',
  '0.4rem': 'var(--fa-space-gap-sm)',
  '0.42rem': 'var(--fa-space-gap-leading)',
  '0.44rem': 'var(--fa-space-gap-leading)',
  '0.45rem': 'var(--fa-space-snug)',
  '0.46rem': 'var(--fa-space-row)',
  '0.48rem': 'var(--fa-space-gap-leading)',
  '0.5rem': 'var(--fa-space-2)',
  '0.52rem': 'var(--fa-space-2h)',
  '0.54rem': 'var(--fa-space-2h)',
  '0.55rem': 'var(--fa-space-inline)',
  '0.56rem': 'var(--fa-space-inline)',
  '0.58rem': 'var(--fa-space-inline)',
  '0.6rem': 'var(--fa-space-gap-md)',
  '0.62rem': 'var(--fa-space-2h)',
  '0.65rem': 'var(--fa-space-row)',
  '0.66rem': 'var(--fa-space-row)',
  '0.68rem': 'var(--fa-space-pad-band-y)',
  '0.7rem': 'var(--fa-space-pad-panel)',
  '0.72rem': 'var(--fa-space-pad-band-y)',
  '0.75rem': 'var(--fa-space-3)',
  '0.78rem': 'var(--fa-space-gap-footer-x)',
  '0.8rem': 'var(--fa-space-gutter)',
  '0.82rem': 'var(--fa-space-3h)',
  '0.85rem': 'var(--fa-space-stack)',
  '0.88rem': 'var(--fa-space-stack)',
  '0.9rem': 'var(--fa-space-pad-band-x)',
  '1rem': 'var(--fa-space-4)',
  '1.05rem': 'var(--fa-space-5)',
  '1.15rem': 'var(--fa-space-5)',
  '1.25rem': 'var(--fa-space-5)',
  '2rem': 'var(--fa-space-6)',
  '-0.15rem': 'var(--fa-space-overlap-tight)'
}

export function tokenizeSpacingRemLiterals(value: string): string {
  if (value.includes('var(--fa-space')) {
    return value
  }
  return value.replace(/-?\d+(?:\.\d+)?rem/g, (rem) => REM_TO_TOKEN[rem] ?? rem)
}

export function tokenizeMainCssSpacingDeclarations(css: string): string {
  return css.replace(
    /(padding|margin)(?:-(?:top|right|bottom|left))?\s*:\s*([^;]+);/g,
    (full, prop, value) => {
      const next = tokenizeSpacingRemLiterals(value.trim())
      return next === value.trim() ? full : `${prop}: ${next};`
    }
  )
}
