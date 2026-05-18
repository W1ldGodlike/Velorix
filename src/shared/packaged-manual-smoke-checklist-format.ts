import type { FfmpegHwManualSmokeChecklistSection } from './ffmpeg-hw-manual-smoke-checklist-types'

export type PackagedManualSmokeChecklistMeta = {
  ownerLine: string
  automatedLine: string
  docLine: string
  uiLine: string
}

/** Строки для Support ZIP и копирования владельцу. */
export function formatPackagedManualSmokeChecklistLines(
  sections: readonly FfmpegHwManualSmokeChecklistSection[],
  meta: PackagedManualSmokeChecklistMeta
): string[] {
  const lines: string[] = [
    `owner: ${meta.ownerLine}`,
    `automated: ${meta.automatedLine}`,
    `doc: ${meta.docLine}`,
    `ui: ${meta.uiLine}`
  ]
  for (const section of sections) {
    lines.push(`section: ${section.id} — ${section.title}`)
    for (const p of section.prerequisites) {
      lines.push(`  prereq: ${p}`)
    }
    for (const step of section.steps) {
      lines.push(`  step [${step.id}]: ${step.text}`)
    }
    for (const p of section.pass) {
      lines.push(`  pass: ${p}`)
    }
  }
  return lines
}
