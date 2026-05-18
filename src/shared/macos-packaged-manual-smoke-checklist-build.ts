import type { FfmpegHwManualSmokeChecklistSection } from './ffmpeg-hw-manual-smoke-checklist-types'
import {
  buildPackagedManualSmokeChecklistFromLocaleShard,
  type PackagedManualSmokeLocaleShard
} from './packaged-manual-smoke-checklist-build'

export type MacosPackagedManualSmokeLocaleShard = PackagedManualSmokeLocaleShard

/** §3 — ручной smoke FluxAlloy.app (dist/mac-arm64 и др.) из locales macos-packaged-manual-smoke.json. */
export function buildMacosPackagedManualSmokeChecklistFromLocaleShard(
  shard: MacosPackagedManualSmokeLocaleShard
): readonly FfmpegHwManualSmokeChecklistSection[] {
  return buildPackagedManualSmokeChecklistFromLocaleShard(shard, {
    sectionId: 'macos-packaged',
    localeKeyPrefix: 'macosPackagedSmoke'
  })
}

