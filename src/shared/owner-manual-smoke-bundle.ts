/**
 * §16 / §1.1 / §3 / §10 / §11 / §14 — единый пакет ручного smoke владельца (железо, не CI).
 */

import { formatFfmpegHwManualSmokeChecklistLines } from './ffmpeg-hw-manual-smoke-checklist'
import { formatOwnerManualSmokeHidpiChecklistLines } from './owner-manual-smoke-hidpi-lines'
import { getOwnerManualSmokePackagedSection } from './owner-manual-smoke-packaged-section'
import { isNativeMainWindows } from './native-main-platform'
import { formatWindowsShellManualSmokeChecklistLines } from './windows-shell-manual-smoke-checklist'
import { formatWorkflowOsSchedulerManualSmokeChecklistLines } from './workflow-os-scheduler-manual-smoke-checklist'
import { formatWorkflowScenarioManualSmokeChecklistLines } from './workflow-scenario-manual-smoke-checklist'

export function formatOwnerManualSmokeBundlePlainText(parts: {
  hidpiLines: readonly string[]
  hwPlainText: string
  osPlainText: string | null
  scenarioPlainText: string
  shellPlainText: string | null
  packagedPlainText: string | null
  uiDpiSnapshot?: readonly string[]
}): string {
  const blocks: string[] = ['=== HiDPI ===', ...parts.hidpiLines, '', '=== HW encode ===', parts.hwPlainText]
  blocks.push('', '=== Scenario builder ===', parts.scenarioPlainText)
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
  return blocks.join('\n')
}

/** Строки для Support ZIP (`ownerManualSmoke:`) — канон ru + снимок uiDpi с машины. */
export function buildOwnerManualSmokeBundleLines(opts?: {
  uiDpiLines?: readonly string[]
  platform?: NodeJS.Platform
}): string[] {
  const uiDpi = opts?.uiDpiLines ?? []
  const shellBlock = isNativeMainWindows(opts?.platform) ? formatWindowsShellManualSmokeChecklistLines() : []
  const packaged = getOwnerManualSmokePackagedSection(opts?.platform)
  return [
    'ownerManualSmoke: HiDPI + HW + scenario + packaged + OS scheduler + Win shell (owner, not CI)',
    'UI: Settings → Dependencies → «Owner smoke» copy; sub-panels HW / HiDPI / packaged / planner / Explorer',
    '',
    '=== HiDPI ===',
    ...formatOwnerManualSmokeHidpiChecklistLines(),
    '',
    '=== HW encode ===',
    ...formatFfmpegHwManualSmokeChecklistLines(),
    '',
    '=== Scenario builder ===',
    ...formatWorkflowScenarioManualSmokeChecklistLines(),
    ...(packaged ? ['', packaged.heading, ...packaged.lines] : []),
    '',
    '=== OS scheduler ===',
    ...formatWorkflowOsSchedulerManualSmokeChecklistLines(),
    ...(shellBlock.length > 0 ? ['', '=== Windows shell ===', ...shellBlock] : []),
    ...(uiDpi.length > 0 ? ['', '=== uiDpi snapshot ===', ...uiDpi] : [])
  ]
}
