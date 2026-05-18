/**
 * §5 — замена rem/px-литералов font-size на --fa-font-size-*.
 */

const REM_TO_TOKEN: Readonly<Record<string, string>> = {
  '0.575rem': 'var(--fa-font-size-3xs)',
  '0.58rem': 'var(--fa-font-size-3xs)',
  '0.6rem': 'var(--fa-font-size-tight)',
  '0.62rem': 'var(--fa-font-size-2xs)',
  '0.64rem': 'var(--fa-font-size-micro)',
  '0.65rem': 'var(--fa-font-size-caption)',
  '0.66rem': 'var(--fa-font-size-caption-sm)',
  '0.664rem': 'var(--fa-font-size-caption-sm)',
  '0.68rem': 'var(--fa-font-size-xs)',
  '0.7rem': 'var(--fa-font-size-snug)',
  '0.72rem': 'var(--fa-font-size-sm)',
  '0.74rem': 'var(--fa-font-size-ui)',
  '0.75rem': 'var(--fa-font-size-body-sm)',
  '0.78rem': 'var(--fa-font-size-ui-md)',
  '0.8rem': 'var(--fa-font-size-md)',
  '0.8125rem': 'var(--fa-font-size-body)',
  '0.82rem': 'var(--fa-font-size-ui-lg)',
  '0.86rem': 'var(--fa-font-size-lead)',
  '0.88rem': 'var(--fa-font-size-subtitle)',
  '0.95rem': 'var(--fa-font-size-lg)',
  '1.15rem': 'var(--fa-font-size-xl)',
  '11px': 'var(--fa-font-size-px-11)',
  '11.5px': 'var(--fa-font-size-px-11-5)',
  '0.598rem': 'var(--fa-font-size-3xs)',
  '0.638rem': 'var(--fa-font-size-2xs)',
  '0.644rem': 'var(--fa-font-size-micro)',
  '0.648rem': 'var(--fa-font-size-micro)',
  '0.658rem': 'var(--fa-font-size-caption)',
  '0.668rem': 'var(--fa-font-size-xs)',
  '0.678rem': 'var(--fa-font-size-xs)',
  '0.684rem': 'var(--fa-font-size-xs)',
  '0.69rem': 'var(--fa-font-size-xs)',
  '0.696rem': 'var(--fa-font-size-xs)',
  '0.704rem': 'var(--fa-font-size-sm)',
  '0.706rem': 'var(--fa-font-size-sm)',
  '0.734rem': 'var(--fa-font-size-sm)',
  '0.736rem': 'var(--fa-font-size-sm)',
  '0.744rem': 'var(--fa-font-size-body-sm)',
  '0.748rem': 'var(--fa-font-size-body-sm)',
  '0.752rem': 'var(--fa-font-size-body-sm)',
  '0.756rem': 'var(--fa-font-size-body-sm)',
  '0.76rem': 'var(--fa-font-size-body-sm)',
  '0.764rem': 'var(--fa-font-size-body-sm)',
  '0.772rem': 'var(--fa-font-size-ui-md)',
  '0.774rem': 'var(--fa-font-size-ui-md)',
  '0.81rem': 'var(--fa-font-size-body)',
  '0.824rem': 'var(--fa-font-size-ui-lg)',
  '0.84rem': 'var(--fa-font-size-compact)',
  '0.848rem': 'var(--fa-font-size-subtitle)',
  '0.85rem': 'var(--fa-font-size-stack)',
  '0.87rem': 'var(--fa-font-size-lead)',
  '0.875rem': 'var(--fa-font-size-body)',
  '0.89rem': 'var(--fa-font-size-ui-xl)',
  '0.91rem': 'var(--fa-font-size-ui-xl)',
  '0.9rem': 'var(--fa-font-size-ui-xl)',
  '1rem': 'var(--fa-font-size-base-lg)',
  '1.02rem': 'var(--fa-font-size-lg-plus)',
  '1.04rem': 'var(--fa-font-size-lg-plus)',
  '1.05rem': 'var(--fa-font-size-lg-plus)',
  '1.08rem': 'var(--fa-font-size-lg-plus)',
  '1.1rem': 'var(--fa-font-size-display)',
  '1.22rem': 'var(--fa-font-size-2xl)'
}

export function tokenizeFontSizeLiterals(value: string): string {
  if (value.includes('var(--fa-font-size')) {
    return value
  }
  let out = value.replace(/\d+(?:\.\d+)?rem/g, (rem) => REM_TO_TOKEN[rem] ?? rem)
  out = out.replace(/\b11\.5px\b/g, () => REM_TO_TOKEN['11.5px'] ?? '11.5px')
  out = out.replace(/\b11px\b/g, () => REM_TO_TOKEN['11px'] ?? '11px')
  return out
}

export function tokenizeMainCssFontSizeDeclarations(css: string): string {
  return css.replace(/font-size:\s*([^;]+);/g, (full, value) => {
    const trimmed = value.trim()
    const next = tokenizeFontSizeLiterals(trimmed)
    return next === trimmed ? full : `font-size: ${next};`
  })
}
