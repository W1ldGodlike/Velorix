import type { AppUiLocale } from './app-ui-locale'
import { parseAppUiLocale } from './app-ui-locale'

/** Post UI PURGE v3 — UI locale IPC/HMR removed until NEON rebuild. */

export function coerceUiLocaleBroadcastPayload(raw: unknown): AppUiLocale | undefined {
  return parseAppUiLocale(raw)
}

export function formatUiLocaleIpcDiagnosticLines(): string[] {
  return ['ui-locale: (purged — restore with NEON ui-text)']
}
