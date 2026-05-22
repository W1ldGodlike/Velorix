import type { FfmpegHwManualSmokeChecklistSection } from './ffmpeg-hw-manual-smoke-checklist-types'
import {
  buildPackagedManualSmokeChecklistFromLocaleShard,
  type PackagedManualSmokeLocaleShard
} from './packaged-manual-smoke-checklist-build'

export type WinPackagedManualSmokeLocaleShard = PackagedManualSmokeLocaleShard

/** §3 — ручная проверка `dist/win-unpacked/` из locales win-packaged-manual-smoke.json. */
export function buildWinPackagedManualSmokeChecklistFromLocaleShard(
  shard: WinPackagedManualSmokeLocaleShard
): readonly FfmpegHwManualSmokeChecklistSection[] {
  return buildPackagedManualSmokeChecklistFromLocaleShard(shard, {
    sectionId: 'win-packaged',
    localeKeyPrefix: 'winPackagedSmoke'
  })
}
