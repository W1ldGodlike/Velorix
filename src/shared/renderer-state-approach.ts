/**
 * §2.2 — зафиксированный подход к состоянию renderer (без Zustand/Jotai/Redux).
 */

export const RENDERER_STATE_APPROACH = 'hooks-composition' as const

/** Корневой orchestrator главного окна — единая точка сборки props для shell. */
export const RENDERER_COMPOSITION_ROOT_HOOK = 'useAppComposition'

/** Слои: локальный UI-state → domain hooks → IPC integrations → shell props. */
export const RENDERER_STATE_LAYER_HOOKS = [
  'useAppCompositionLocalState',
  'useAppCompositionIntegrations',
  'useAppCompositionState',
  'useAppShellPropsInput',
  'useAppShellProps'
] as const

/** Доменные хуки (пример; не исчерпывающий список файлов). */
export const RENDERER_DOMAIN_STATE_HOOKS = [
  'useEditorExportSettings',
  'useEditorExportPipeline',
  'useFfmpegExportBatch',
  'useDownloadsWorkspace',
  'useTerminalWorkspace',
  'useMainWindowUiPanels',
  'useDownloadsWindowUiPanels',
  'useAppPreviewWorkspace'
] as const

/** События main/preload → `useState` tick (локаль, тема, панели, dev HMR JSON). */
export const RENDERER_CROSS_CUTTING_TICKS = [
  'uiLocaleRenderTick',
  'useUiTextHotReloadBump'
] as const

export function formatRendererStateDiagnosticLines(): string[] {
  return [
    `approach: ${RENDERER_STATE_APPROACH} (React hooks + composition root, no global store library)`,
    `root: ${RENDERER_COMPOSITION_ROOT_HOOK} → AppShellLayout props`,
    `layers: ${RENDERER_STATE_LAYER_HOOKS.join(' → ')}`,
    `domain hooks: ${RENDERER_DOMAIN_STATE_HOOKS.join(', ')}`,
    `cross-cutting: ${RENDERER_CROSS_CUTTING_TICKS.join(', ')}; module-level ui-text session for i18n`,
    'standalone surfaces: useDownloadsStandaloneApp / useInspectorStandaloneApp (own local state)',
    'persist: settings IPC (uiLocale, theme, panels, export fields) — not renderer global store',
    'docs: ARCHITECTURE.md § Состояние renderer'
  ]
}
