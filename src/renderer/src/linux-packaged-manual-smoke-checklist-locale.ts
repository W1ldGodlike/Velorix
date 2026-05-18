import type { AppUiLocale } from '../../shared/app-ui-locale'
import { buildLinuxPackagedManualSmokeChecklistFromLocaleShard } from '../../shared/linux-packaged-manual-smoke-checklist-build'
import type { FfmpegHwManualSmokeChecklistSection } from '../../shared/ffmpeg-hw-manual-smoke-checklist-types'
import enLinuxPackagedManualSmoke from '@locales/en/linux-packaged-manual-smoke.json'
import { LINUX_PACKAGED_MANUAL_SMOKE_CHECKLIST } from '../../shared/linux-packaged-manual-smoke-checklist'

export function getLinuxPackagedManualSmokeChecklistForUiLocale(
  locale: AppUiLocale
): readonly FfmpegHwManualSmokeChecklistSection[] {
  if (locale === 'en') {
    return buildLinuxPackagedManualSmokeChecklistFromLocaleShard(
      enLinuxPackagedManualSmoke as Record<string, string>
    )
  }
  return LINUX_PACKAGED_MANUAL_SMOKE_CHECKLIST
}
