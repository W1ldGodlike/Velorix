/**
 * §14 — ручной smoke Проводника Windows (не CI UI).
 * Канон: locales/ru/windows-shell-manual-smoke.json + Help windows-shell-integration.
 */

import ruWindowsShellManualSmoke from '../../locales/ru/windows-shell-manual-smoke.json'
import { buildWindowsShellManualSmokeChecklistFromLocaleShard } from './windows-shell-manual-smoke-checklist-build'
import { formatPackagedManualSmokeChecklistLines } from './packaged-manual-smoke-checklist-format'

export { buildWindowsShellManualSmokeChecklistFromLocaleShard } from './windows-shell-manual-smoke-checklist-build'

export const WINDOWS_SHELL_MANUAL_SMOKE_CHECKLIST =
  buildWindowsShellManualSmokeChecklistFromLocaleShard(
    ruWindowsShellManualSmoke as Record<string, string>
  )

export function formatWindowsShellManualSmokeChecklistLines(): string[] {
  return formatPackagedManualSmokeChecklistLines(WINDOWS_SHELL_MANUAL_SMOKE_CHECKLIST, {
    ownerLine: 'ручной smoke Проводника Windows (§14), не автоматизируется в CI UI',
    automatedLine:
      'Vitest windows-file-association / windows-explorer-context-menu (argv/registry only)',
    docLine: 'Help/ru/windows-shell-integration.md',
    uiLine: 'Настройки → Зависимости → Проводник Windows'
  })
}
