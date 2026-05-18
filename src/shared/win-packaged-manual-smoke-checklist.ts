/**
 * §3 — ручной smoke packaged Windows (не CI UI).
 * Канон: locales/ru/win-packaged-manual-smoke.json + docs/RELEASE.md §4.
 */

import ruWinPackagedManualSmoke from '../../locales/ru/win-packaged-manual-smoke.json'
import { buildWinPackagedManualSmokeChecklistFromLocaleShard } from './win-packaged-manual-smoke-checklist-build'
import { formatPackagedManualSmokeChecklistLines } from './packaged-manual-smoke-checklist-format'

export {
  buildWinPackagedManualSmokeChecklistFromLocaleShard
} from './win-packaged-manual-smoke-checklist-build'

export { formatFfmpegHwManualSmokeChecklistPlainText as formatWinPackagedManualSmokeChecklistPlainText } from './ffmpeg-hw-manual-smoke-checklist-build'

export const WIN_PACKAGED_MANUAL_SMOKE_CHECKLIST = buildWinPackagedManualSmokeChecklistFromLocaleShard(
  ruWinPackagedManualSmoke as Record<string, string>
)

/** Строки для Support ZIP (winPackagedSmoke:) и копирования владельцу. */
export function formatWinPackagedManualSmokeChecklistLines(): string[] {
  return formatPackagedManualSmokeChecklistLines(WIN_PACKAGED_MANUAL_SMOKE_CHECKLIST, {
    ownerLine: 'ручной smoke packaged Win (dist/win-unpacked), не автоматизируется в CI UI',
    automatedLine: 'npm run verify:win-unpacked && npm run smoke:packaged-release',
    docLine: 'docs/RELEASE.md §4',
    uiLine: 'Настройки → Зависимости → Ручной smoke Windows (pack:dir)'
  })
}
