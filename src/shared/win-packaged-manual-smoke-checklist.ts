/**
 * §3 — ручной smoke packaged Windows (не CI UI).
 * Канон: locales/ru/win-packaged-manual-smoke.json + docs/RELEASE.md §4.
 */

import ruWinPackagedManualSmoke from '../../locales/ru/win-packaged-manual-smoke.json'
import { buildWinPackagedManualSmokeChecklistFromLocaleShard } from './win-packaged-manual-smoke-checklist-build'
export {
  buildWinPackagedManualSmokeChecklistFromLocaleShard
} from './win-packaged-manual-smoke-checklist-build'

export { formatFfmpegHwManualSmokeChecklistPlainText as formatWinPackagedManualSmokeChecklistPlainText } from './ffmpeg-hw-manual-smoke-checklist-build'

export const WIN_PACKAGED_MANUAL_SMOKE_CHECKLIST = buildWinPackagedManualSmokeChecklistFromLocaleShard(
  ruWinPackagedManualSmoke as Record<string, string>
)

/** Строки для Support ZIP (winPackagedSmoke:) и копирования владельцу. */
export function formatWinPackagedManualSmokeChecklistLines(): string[] {
  const lines: string[] = [
    'owner: ручной smoke packaged Win (dist/win-unpacked), не автоматизируется в CI UI',
    'automated: npm run verify:win-unpacked && npm run smoke:packaged-release',
    'doc: docs/RELEASE.md §4',
    'ui: Настройки → Зависимости → Ручной smoke Windows (pack:dir)'
  ]
  for (const section of WIN_PACKAGED_MANUAL_SMOKE_CHECKLIST) {
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
