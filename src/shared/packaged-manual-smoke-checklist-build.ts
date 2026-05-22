import type {
  FfmpegHwManualSmokeChecklistSection,
  FfmpegHwManualSmokePlatformId
} from './ffmpeg-hw-manual-smoke-checklist-types'
import {
  PACKAGED_MANUAL_SMOKE_STEPS,
  packagedManualSmokeStepLocaleKey,
  type PackagedManualSmokeLocaleKeyPrefix
} from './packaged-manual-smoke-step-ids'

export type PackagedManualSmokeLocaleShard = Record<string, string>

export type { PackagedManualSmokeLocaleKeyPrefix } from './packaged-manual-smoke-step-ids'

function t(shard: PackagedManualSmokeLocaleShard, key: string): string {
  const val = shard[key]
  if (typeof val !== 'string' || val.trim() === '') {
    throw new Error(`packaged-manual-smoke locale missing key: ${key}`)
  }
  return val
}

/** §3 — ручная проверка packaged (Win / Linux / macOS) из locales *-packaged-manual-smoke.json. */
export function buildPackagedManualSmokeChecklistFromLocaleShard(
  shard: PackagedManualSmokeLocaleShard,
  opts: {
    sectionId: FfmpegHwManualSmokePlatformId
    localeKeyPrefix: PackagedManualSmokeLocaleKeyPrefix
  }
): readonly FfmpegHwManualSmokeChecklistSection[] {
  const p = opts.localeKeyPrefix
  return [
    {
      id: opts.sectionId,
      title: t(shard, `${p}SectionTitle`),
      prerequisites: [t(shard, `${p}Prereq0`), t(shard, `${p}Prereq1`), t(shard, `${p}Prereq2`)],
      steps: PACKAGED_MANUAL_SMOKE_STEPS.map(({ id, suffix }) => ({
        id,
        text: t(shard, packagedManualSmokeStepLocaleKey(p, suffix))
      })),
      pass: [t(shard, `${p}Pass0`), t(shard, `${p}Pass1`), t(shard, `${p}Pass2`)]
    }
  ]
}
