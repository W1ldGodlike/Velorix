/**
 * §16 / §1.1 / §10 / §11 / §14 — единый пакет ручного smoke владельца (железо, не CI).
 */

import { formatFfmpegHwManualSmokeChecklistLines } from './ffmpeg-hw-manual-smoke-checklist'
import { formatOwnerManualSmokeHidpiChecklistLines } from './owner-manual-smoke-hidpi-lines'
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
  uiDpiSnapshot?: readonly string[]
}): string {
  const blocks: string[] = ['=== HiDPI ===', ...parts.hidpiLines, '', '=== HW encode ===', parts.hwPlainText]
  blocks.push('', '=== Scenario builder ===', parts.scenarioPlainText)
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
}): string[] {
  const uiDpi = opts?.uiDpiLines ?? []
  const shellBlock = isNativeMainWindows() ? formatWindowsShellManualSmokeChecklistLines() : []
  return [
    'ownerManualSmoke: HiDPI + HW + scenario + OS scheduler + Win shell (owner hardware, not CI)',
    'UI: Settings → Dependencies → «Owner smoke» copy; sub-panels HW / HiDPI / planner / Explorer',
    '',
    '=== HiDPI ===',
    ...formatOwnerManualSmokeHidpiChecklistLines(),
    '',
    '=== HW encode ===',
    ...formatFfmpegHwManualSmokeChecklistLines(),
    '',
    '=== Scenario builder ===',
    ...formatWorkflowScenarioManualSmokeChecklistLines(),
    '',
    '=== OS scheduler ===',
    ...formatWorkflowOsSchedulerManualSmokeChecklistLines(),
    ...(shellBlock.length > 0 ? ['', '=== Windows shell ===', ...shellBlock] : []),
    ...(uiDpi.length > 0 ? ['', '=== uiDpi snapshot ===', ...uiDpi] : [])
  ]
}
