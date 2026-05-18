import type { AppUiLocale } from '../../shared/app-ui-locale'
import type { FfmpegHwManualSmokeChecklistSection } from '../../shared/ffmpeg-hw-manual-smoke-checklist-types'
import { buildWindowsShellManualSmokeChecklistFromLocaleShard } from '../../shared/windows-shell-manual-smoke-checklist-build'
import { WINDOWS_SHELL_MANUAL_SMOKE_CHECKLIST } from '../../shared/windows-shell-manual-smoke-checklist'
import enWindowsShellManualSmoke from '@locales/en/windows-shell-manual-smoke.json'

export function getWindowsShellManualSmokeChecklistForUiLocale(
  locale: AppUiLocale
): readonly FfmpegHwManualSmokeChecklistSection[] {
  if (locale === 'en') {
    return buildWindowsShellManualSmokeChecklistFromLocaleShard(
      enWindowsShellManualSmoke as Record<string, string>
    )
  }
  return WINDOWS_SHELL_MANUAL_SMOKE_CHECKLIST
}
