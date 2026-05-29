/**
 * §2.2 — renderer UI: post UI PURGE v3 (stub only until NEON rebuild).
 */

export const RENDERER_STATE_APPROACH = 'none' as const

export const RENDERER_SHELL_ENTRY = 'main.tsx → #root[data-velorix-ui=neon-kit] (#ref26 states)'

export const RENDERER_ZUSTAND_STORES = [] as const

export const RENDERER_ORCHESTRATION_HOOKS = [] as const

export const RENDERER_DERIVED_STATE_HOOKS = [] as const

export const RENDERER_CROSS_CUTTING_TICKS = [] as const

export function formatRendererStateDiagnosticLines(): string[] {
  return [
    'approach: none (backend state; ui.1 neon-kit dev routes)',
    `entry: ${RENDERER_SHELL_ENTRY}`,
    'stores: (none)',
    'docs: docs/VELORIX_NEON_THEME.md',
    'refs: docs/reference/*.png'
  ]
}
