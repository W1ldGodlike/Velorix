import type { AppUiLocale } from '../../shared/app-ui-locale'
import { buildMacosPackagedManualSmokeChecklistFromLocaleShard } from '../../shared/macos-packaged-manual-smoke-checklist-build'
import type { FfmpegHwManualSmokeChecklistSection } from '../../shared/ffmpeg-hw-manual-smoke-checklist-types'
import enMacosPackagedManualSmoke from '@locales/en/macos-packaged-manual-smoke.json'
import { MACOS_PACKAGED_MANUAL_SMOKE_CHECKLIST } from '../../shared/macos-packaged-manual-smoke-checklist'

export function getMacosPackagedManualSmokeChecklistForUiLocale(
  locale: AppUiLocale
): readonly FfmpegHwManualSmokeChecklistSection[] {
  if (locale === 'en') {
    return buildMacosPackagedManualSmokeChecklistFromLocaleShard(
      enMacosPackagedManualSmoke as Record<string, string>
    )
  }
  return MACOS_PACKAGED_MANUAL_SMOKE_CHECKLIST
}
