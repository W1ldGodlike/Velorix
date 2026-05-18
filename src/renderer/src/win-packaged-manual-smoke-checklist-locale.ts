import type { AppUiLocale } from '../../shared/app-ui-locale'
import { buildWinPackagedManualSmokeChecklistFromLocaleShard } from '../../shared/win-packaged-manual-smoke-checklist-build'
import type { FfmpegHwManualSmokeChecklistSection } from '../../shared/ffmpeg-hw-manual-smoke-checklist-types'
import enWinPackagedManualSmoke from '@locales/en/win-packaged-manual-smoke.json'
import { WIN_PACKAGED_MANUAL_SMOKE_CHECKLIST } from '../../shared/win-packaged-manual-smoke-checklist'

export function getWinPackagedManualSmokeChecklistForUiLocale(
  locale: AppUiLocale
): readonly FfmpegHwManualSmokeChecklistSection[] {
  if (locale === 'en') {
    return buildWinPackagedManualSmokeChecklistFromLocaleShard(
      enWinPackagedManualSmoke as Record<string, string>
    )
  }
  return WIN_PACKAGED_MANUAL_SMOKE_CHECKLIST
}
