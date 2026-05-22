/**
 * §7.5 — ручная проверка спрайта превью (не CI UI).
 * Канон: locales/ru/editor-video-sprite-manual-smoke.json
 */

import ruEditorVideoSpriteManualSmoke from '../../locales/ru/editor-video-sprite-manual-smoke.json'
import { buildEditorVideoSpriteManualSmokeChecklistFromLocaleShard } from './editor-video-sprite-manual-smoke-checklist-build'
import { formatPackagedManualSmokeChecklistLines } from './packaged-manual-smoke-checklist-format'
import { formatPackagedVideoSpriteSmokeDiagnosticLines } from './packaged-video-sprite-smoke'

export { buildEditorVideoSpriteManualSmokeChecklistFromLocaleShard } from './editor-video-sprite-manual-smoke-checklist-build'

export const EDITOR_VIDEO_SPRITE_MANUAL_SMOKE_CHECKLIST =
  buildEditorVideoSpriteManualSmokeChecklistFromLocaleShard(
    ruEditorVideoSpriteManualSmoke as Record<string, string>
  )

export function formatEditorVideoSpriteManualSmokeChecklistLines(): string[] {
  const lines = formatPackagedManualSmokeChecklistLines(
    EDITOR_VIDEO_SPRITE_MANUAL_SMOKE_CHECKLIST,
    {
      ownerLine: 'ручная проверка спрайта §7.5 (owner, не CI UI)',
      automatedLine: 'Vitest ffmpeg-video-sprite-* / packaged-video-sprite-smoke',
      docLine: 'Help/ru/owner-manual-smoke.md',
      uiLine: 'Редактор → FFmpeg rail → EditorVideoSpritePanel'
    }
  )
  return [...lines, '', ...formatPackagedVideoSpriteSmokeDiagnosticLines()]
}
