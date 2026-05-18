/**
 * §2.2 — зафиксированный подход к состоянию renderer (Zustand).
 */

export const RENDERER_STATE_APPROACH = 'zustand' as const

/** Точка входа shell: bootstrap IPC + controller → props для layout. */
export const RENDERER_SHELL_ENTRY = 'AppRoot'

/** Атомарные Zustand-сторы по доменам (имена хуков `use*Store`). */
export const RENDERER_ZUSTAND_STORES = [
  'useAppShellStore',
  'useAppRefsStore',
  'useDownloadsStore',
  'useExportSettingsStore',
  'usePanelsStore',
  'useProcessingHistoryStore',
  'useBatchExportStore',
  'useTerminalStore'
] as const

/** Orchestration (эффекты/IPC), не дублирует state: preview, export pipeline, batch handlers. */
export const RENDERER_ORCHESTRATION_HOOKS = [
  'useRendererAppState',
  'useAppShellLayoutController',
  'useAppWorkspaceEditorContainer',
  'useAppShellPropsInputHooks',
  'useAppMainWindowEffects'
] as const

/** События main/preload → store actions (`uiLocaleRenderTick`, dev HMR JSON). */
export const RENDERER_CROSS_CUTTING_TICKS = [
  'uiLocaleRenderTick',
  'useUiTextHotReloadBump'
] as const

export function formatRendererStateDiagnosticLines(): string[] {
  return [
    `approach: ${RENDERER_STATE_APPROACH} (atomic domain stores + orchestration hooks)`,
    `entry: ${RENDERER_SHELL_ENTRY} → AppShellLayout`,
    `stores: ${RENDERER_ZUSTAND_STORES.join(', ')}`,
    `orchestration: ${RENDERER_ORCHESTRATION_HOOKS.join(', ')}`,
    `cross-cutting: ${RENDERER_CROSS_CUTTING_TICKS.join(', ')}; module-level ui-text session for i18n`,
    'standalone surfaces: DownloadsStandaloneApp / InspectorStandaloneApp (shared stores where applicable)',
    'persist: settings IPC (uiLocale, theme, panels, export fields) — not duplicated across stores',
    'devtools: zustand/middleware devtools in DEV via create-renderer-store (Redux DevTools extension in Chromium)',
    'docs: ARCHITECTURE.md § Состояние renderer'
  ]
}
