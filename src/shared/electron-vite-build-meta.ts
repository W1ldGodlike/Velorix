/**
 * §19 — канон workaround `fix:esm-shim` в `electron.vite.config.ts` (Linux/CI build).
 * Leaf-модуль без импортов (Node ESM из scripts/*.mjs).
 */

/** Vite plugin name replacing broken `vite:esm-shim` false-positive. */
export const ELECTRON_VITE_ESM_SHIM_FIX_PLUGIN_NAME = 'fix:esm-shim' as const

/** File whose string literal triggered false-positive static import match. */
export const ELECTRON_VITE_ESM_SHIM_FIX_TRIGGER_REL_PATH = 'renderer-state-approach.ts' as const

/** Platform-packaging / RELEASE diagnostic line. */
export function formatElectronViteEsmShimFixDiagnosticLine(): string {
  return `electron-vite build: plugin ${ELECTRON_VITE_ESM_SHIM_FIX_PLUGIN_NAME} (${ELECTRON_VITE_ESM_SHIM_FIX_TRIGGER_REL_PATH} false-positive on Linux/CI)`
}
