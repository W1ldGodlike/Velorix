import { buildMiniPlayerManualSmokeChecklistFromLocaleShard } from '../../shared/mini-player-manual-smoke-checklist-build'
import { MINI_PLAYER_MANUAL_SMOKE_CHECKLIST } from '../../shared/mini-player-manual-smoke-checklist'
import enMiniPlayerManualSmoke from '@locales/en/mini-player-manual-smoke.json'
import type { AppUiLocale } from '../../shared/app-ui-locale'
import type { FfmpegHwManualSmokeChecklistSection } from '../../shared/ffmpeg-hw-manual-smoke-checklist-types'

export function getMiniPlayerManualSmokeChecklistForUiLocale(
  locale: AppUiLocale
): readonly FfmpegHwManualSmokeChecklistSection[] {
  if (locale === 'ru') {
    return MINI_PLAYER_MANUAL_SMOKE_CHECKLIST
  }
  return buildMiniPlayerManualSmokeChecklistFromLocaleShard(
    enMiniPlayerManualSmoke as Record<string, string>
  )
}
