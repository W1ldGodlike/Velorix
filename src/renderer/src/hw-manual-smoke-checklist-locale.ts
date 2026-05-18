import type { AppUiLocale } from '../../shared/app-ui-locale'
import { buildFfmpegHwManualSmokeChecklistFromLocaleShard } from '../../shared/ffmpeg-hw-manual-smoke-checklist-build'
import type { FfmpegHwManualSmokeChecklistSection } from '../../shared/ffmpeg-hw-manual-smoke-checklist-types'
import enHwManualSmoke from '@locales/en/hw-manual-smoke.json'
import { FFMPEG_HW_MANUAL_SMOKE_CHECKLIST } from '../../shared/ffmpeg-hw-manual-smoke-checklist'

export function getFfmpegHwManualSmokeChecklistForUiLocale(
  locale: AppUiLocale
): readonly FfmpegHwManualSmokeChecklistSection[] {
  if (locale === 'en') {
    return buildFfmpegHwManualSmokeChecklistFromLocaleShard(
      enHwManualSmoke as Record<string, string>
    )
  }
  return FFMPEG_HW_MANUAL_SMOKE_CHECKLIST
}
