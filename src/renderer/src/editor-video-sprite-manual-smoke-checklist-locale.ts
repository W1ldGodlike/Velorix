import { buildEditorVideoSpriteManualSmokeChecklistFromLocaleShard } from '../../shared/editor-video-sprite-manual-smoke-checklist-build'
import { EDITOR_VIDEO_SPRITE_MANUAL_SMOKE_CHECKLIST } from '../../shared/editor-video-sprite-manual-smoke-checklist'
import enEditorVideoSpriteManualSmoke from '@locales/en/editor-video-sprite-manual-smoke.json'
import type { AppUiLocale } from '../../shared/app-ui-locale'
import type { FfmpegHwManualSmokeChecklistSection } from '../../shared/ffmpeg-hw-manual-smoke-checklist-types'

export function getEditorVideoSpriteManualSmokeChecklistForUiLocale(
  locale: AppUiLocale
): readonly FfmpegHwManualSmokeChecklistSection[] {
  if (locale === 'ru') {
    return EDITOR_VIDEO_SPRITE_MANUAL_SMOKE_CHECKLIST
  }
  return buildEditorVideoSpriteManualSmokeChecklistFromLocaleShard(
    enEditorVideoSpriteManualSmoke as Record<string, string>
  )
}
