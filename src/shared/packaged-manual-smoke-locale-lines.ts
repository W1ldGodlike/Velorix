import type { FfmpegHwManualSmokeChecklistSection } from './ffmpeg-hw-manual-smoke-checklist-types'
import type { PackagedManualSmokeLocaleShard } from './packaged-manual-smoke-checklist-build'
import { formatPackagedManualSmokeChecklistLines } from './packaged-manual-smoke-checklist-format'
import { buildPackagedManualSmokeMetaFromShard } from './packaged-manual-smoke-meta'
import type { PackagedManualSmokeLocaleKeyPrefix } from './packaged-manual-smoke-step-ids'

/** Строки packaged smoke для Support ZIP / owner bundle из locale shard. */
export function formatPackagedManualSmokeChecklistLinesFromLocaleShard(
  shard: PackagedManualSmokeLocaleShard,
  prefix: PackagedManualSmokeLocaleKeyPrefix,
  sections: readonly FfmpegHwManualSmokeChecklistSection[]
): string[] {
  return formatPackagedManualSmokeChecklistLines(
    sections,
    buildPackagedManualSmokeMetaFromShard(shard, prefix)
  )
}
