import type { FfmpegHwManualSmokeChecklistSection } from './ffmpeg-hw-manual-smoke-checklist-types'
import {
  buildPackagedManualSmokeChecklistFromLocaleShard,
  type PackagedManualSmokeLocaleShard
} from './packaged-manual-smoke-checklist-build'

export type LinuxPackagedManualSmokeLocaleShard = PackagedManualSmokeLocaleShard

/** §3 — ручная проверка `dist/linux-unpacked/` из locales linux-packaged-manual-smoke.json. */
export function buildLinuxPackagedManualSmokeChecklistFromLocaleShard(
  shard: LinuxPackagedManualSmokeLocaleShard
): readonly FfmpegHwManualSmokeChecklistSection[] {
  return buildPackagedManualSmokeChecklistFromLocaleShard(shard, {
    sectionId: 'linux-packaged',
    localeKeyPrefix: 'linuxPackagedSmoke'
  })
}
