/**
 * §16 — ручная проверка аппаратного кодирования на железе владельца (не CI).
 * Канон шагов: `locales/ru/hw-manual-smoke.json` + owner hardware checklist (Support ZIP).
 */

import ruHwManualSmoke from '../../locales/ru/hw-manual-smoke.json'
import { buildFfmpegHwManualSmokeChecklistFromLocaleShard } from './ffmpeg-hw-manual-smoke-checklist-build'

export type {
  FfmpegHwManualSmokeChecklistSection,
  FfmpegHwManualSmokeChecklistStep,
  FfmpegHwManualSmokePlatformId
} from './ffmpeg-hw-manual-smoke-checklist-types'

export {
  buildFfmpegHwManualSmokeChecklistFromLocaleShard,
  formatFfmpegHwManualSmokeChecklistPlainText,
  orderHwManualSmokeSectionsForDisplay,
  resolvePrimaryHwManualSmokeSectionId
} from './ffmpeg-hw-manual-smoke-checklist-build'

export const FFMPEG_HW_MANUAL_SMOKE_CHECKLIST = buildFfmpegHwManualSmokeChecklistFromLocaleShard(
  ruHwManualSmoke as Record<string, string>
)

/** Строки для Support ZIP (`hwManualSmoke:`) и копирования владельцу. */
export function formatFfmpegHwManualSmokeChecklistLines(): string[] {
  const lines: string[] = [
    'owner: ручной прогон на железе (не автоматизируется в CI)',
    'automated argv smoke: tests/shared/ffmpeg-export-*-argv-table.test.ts',
    'checklist: owner hardware checklist (Support ZIP)'
  ]
  for (const section of FFMPEG_HW_MANUAL_SMOKE_CHECKLIST) {
    lines.push(`section: ${section.id} — ${section.title}`)
    for (const p of section.prerequisites) {
      lines.push(`  prereq: ${p}`)
    }
    for (const step of section.steps) {
      lines.push(`  step [${step.id}]: ${step.text}`)
    }
    for (const rule of section.pass) {
      lines.push(`  pass: ${rule}`)
    }
  }
  return lines
}
