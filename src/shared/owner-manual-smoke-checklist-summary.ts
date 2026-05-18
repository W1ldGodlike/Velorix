import type { FfmpegHwManualSmokeChecklistSection } from './ffmpeg-hw-manual-smoke-checklist-types'

export type ManualSmokeChecklistCounts = {
  sectionCount: number
  prerequisiteCount: number
  stepCount: number
  passCount: number
}

/** Сводка по структурированным секциям smoke-чеклиста (UI / owner bundle). */
export function summarizeManualSmokeChecklistSections(
  sections: readonly FfmpegHwManualSmokeChecklistSection[]
): ManualSmokeChecklistCounts {
  let prerequisiteCount = 0
  let stepCount = 0
  let passCount = 0
  for (const section of sections) {
    prerequisiteCount += section.prerequisites.length
    stepCount += section.steps.length
    passCount += section.pass.length
  }
  return {
    sectionCount: sections.length,
    prerequisiteCount,
    stepCount,
    passCount
  }
}
