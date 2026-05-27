/**
 * §16 / §1.1 / §3 / §10 / §11 / §14 — единый чеклист владельца на железе (Support ZIP, не CI).
 */

/** Заголовок секции в `diagnostics.txt` (канон для main + guards). */
export const OWNER_HARDWARE_CHECKLIST_SUPPORT_ZIP_SECTION_HEADING =
  'ownerHardwareChecklist:' as const

import { formatFfmpegHwManualSmokeChecklistLines } from './ffmpeg-hw-manual-smoke-checklist'
import { formatOwnerHardwareChecklistHidpiChecklistLines } from './owner-hardware-checklist-hidpi-lines'
import { formatOwnerHardwareChecklistThemeChecklistLines } from './owner-hardware-checklist-theme-lines'
import { getOwnerHardwareChecklistPackagedSection } from './owner-hardware-checklist-packaged-section'
import { isNativeMainWindows } from './native-main-platform'
import { formatWindowsShellManualSmokeChecklistLines } from './windows-shell-manual-smoke-checklist'
import { formatWorkflowOsSchedulerManualSmokeChecklistLines } from './workflow-os-scheduler-manual-smoke-checklist'
import { formatEditorVideoSpriteManualSmokeChecklistLines } from './editor-video-sprite-manual-smoke-checklist'
import { formatWorkflowScenarioManualSmokeChecklistLines } from './workflow-scenario-manual-smoke-checklist'
import { appendPackagedManualSmokeE2ePlanLines } from './packaged-manual-smoke-plain-text'

export function formatOwnerHardwareChecklistBundlePlainText(parts: {
  themeLines: readonly string[]
  hidpiLines: readonly string[]
  hwPlainText: string
  osPlainText: string | null
  scenarioPlainText: string
  videoSpritePlainText: string
  shellPlainText: string | null
  packagedPlainText: string | null
  uiDpiSnapshot?: readonly string[]
}): string {
  const blocks: string[] = [
    '=== Theme ===',
    ...parts.themeLines,
    '',
    '=== HiDPI ===',
    ...parts.hidpiLines,
    '',
    '=== HW encode ===',
    parts.hwPlainText
  ]
  blocks.push('', '=== Scenario builder ===', parts.scenarioPlainText)
  blocks.push('', '=== Video sprite §7.5 ===', parts.videoSpritePlainText)
  if (parts.packagedPlainText && parts.packagedPlainText.trim().length > 0) {
    blocks.push('', parts.packagedPlainText)
  }
  if (parts.osPlainText && parts.osPlainText.trim().length > 0) {
    blocks.push('', '=== OS scheduler ===', parts.osPlainText)
  }
  if (parts.shellPlainText && parts.shellPlainText.trim().length > 0) {
    blocks.push('', '=== Windows shell ===', parts.shellPlainText)
  }
  const uiDpi = parts.uiDpiSnapshot ?? []
  if (uiDpi.length > 0) {
    blocks.push('', '=== uiDpi snapshot ===', ...uiDpi)
  }
  appendPackagedManualSmokeE2ePlanLines(blocks)
  return blocks.join('\n')
}

/** Строки для Support ZIP (`ownerHardwareChecklist:`) — канон ru + снимок uiDpi с машины. */
export function buildOwnerHardwareChecklistBundleLines(opts?: {
  uiDpiLines?: readonly string[]
  platform?: NodeJS.Platform
}): string[] {
  const uiDpi = opts?.uiDpiLines ?? []
  const shellBlock = isNativeMainWindows(opts?.platform)
    ? formatWindowsShellManualSmokeChecklistLines()
    : []
  const packaged = getOwnerHardwareChecklistPackagedSection(opts?.platform)
  const lines: string[] = [
    'ownerHardwareChecklist: Theme + HiDPI + HW + scenario + video sprite + packaged + OS scheduler + Win shell (owner, not CI)',
    'UI: docs/VELORIX_NEON_THEME.md (agent); Support ZIP ownerHardwareChecklist: (hardware)',
    '',
    '=== Theme ===',
    ...formatOwnerHardwareChecklistThemeChecklistLines(),
    '',
    '=== HiDPI ===',
    ...formatOwnerHardwareChecklistHidpiChecklistLines(),
    '',
    '=== HW encode ===',
    ...formatFfmpegHwManualSmokeChecklistLines(),
    '',
    '=== Scenario builder ===',
    ...formatWorkflowScenarioManualSmokeChecklistLines(),
    '',
    '=== Video sprite §7.5 ===',
    ...formatEditorVideoSpriteManualSmokeChecklistLines(),
    ...(packaged ? ['', packaged.heading, ...packaged.lines] : []),
    '',
    '=== OS scheduler ===',
    ...formatWorkflowOsSchedulerManualSmokeChecklistLines(),
    ...(shellBlock.length > 0 ? ['', '=== Windows shell ===', ...shellBlock] : []),
    ...(uiDpi.length > 0 ? ['', '=== uiDpi snapshot ===', ...uiDpi] : [])
  ]
  appendPackagedManualSmokeE2ePlanLines(lines)
  return lines
}
