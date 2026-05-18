/**
 * §16 / §1.1 / §3 / §10 / §11 / §14 — единый пакет ручного smoke владельца (железо, не CI).
 */

import { formatFfmpegHwManualSmokeChecklistLines } from './ffmpeg-hw-manual-smoke-checklist'
import { formatOwnerManualSmokeHidpiChecklistLines } from './owner-manual-smoke-hidpi-lines'
import { formatOwnerManualSmokeThemeChecklistLines } from './owner-manual-smoke-theme-lines'
import { getOwnerManualSmokePackagedSection } from './owner-manual-smoke-packaged-section'
import { isNativeMainWindows } from './native-main-platform'
import { formatWindowsShellManualSmokeChecklistLines } from './windows-shell-manual-smoke-checklist'
import { formatWorkflowOsSchedulerManualSmokeChecklistLines } from './workflow-os-scheduler-manual-smoke-checklist'
import { formatEditorVideoSpriteManualSmokeChecklistLines } from './editor-video-sprite-manual-smoke-checklist'
import { formatMiniPlayerManualSmokeChecklistLines } from './mini-player-manual-smoke-checklist'
import { formatWorkflowScenarioManualSmokeChecklistLines } from './workflow-scenario-manual-smoke-checklist'
import { formatPackagedE2eSmokeDiagnosticLines } from './packaged-e2e-smoke-scenarios'

function appendOwnerManualSmokeE2ePlanLines(blocks: string[]): void {
  blocks.push(
    '',
    '=== §21 packaged e2e (CI vs owner) ===',
    ...formatPackagedE2eSmokeDiagnosticLines()
  )
}

export function formatOwnerManualSmokeBundlePlainText(parts: {
  themeLines: readonly string[]
  hidpiLines: readonly string[]
  hwPlainText: string
  osPlainText: string | null
  scenarioPlainText: string
  videoSpritePlainText: string
  miniPlayerPlainText: string
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
  blocks.push('', '=== Mini Player §4.3 ===', parts.miniPlayerPlainText)
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
  appendOwnerManualSmokeE2ePlanLines(blocks)
  return blocks.join('\n')
}

/** Строки для Support ZIP (`ownerManualSmoke:`) — канон ru + снимок uiDpi с машины. */
export function buildOwnerManualSmokeBundleLines(opts?: {
  uiDpiLines?: readonly string[]
  platform?: NodeJS.Platform
}): string[] {
  const uiDpi = opts?.uiDpiLines ?? []
  const shellBlock = isNativeMainWindows(opts?.platform)
    ? formatWindowsShellManualSmokeChecklistLines()
    : []
  const packaged = getOwnerManualSmokePackagedSection(opts?.platform)
  const lines: string[] = [
    'ownerManualSmoke: Theme + HiDPI + HW + scenario + video sprite + mini player + packaged + OS scheduler + Win shell (owner, not CI)',
    'UI: Settings → Dependencies → «Owner smoke» copy; Theme / HW / HiDPI / sprite / mini player / packaged / planner / Explorer',
    '',
    '=== Theme ===',
    ...formatOwnerManualSmokeThemeChecklistLines(),
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
    '=== Video sprite §7.5 ===',
    ...formatEditorVideoSpriteManualSmokeChecklistLines(),
    '',
    '=== Mini Player §4.3 ===',
    ...formatMiniPlayerManualSmokeChecklistLines(),
    ...(packaged ? ['', packaged.heading, ...packaged.lines] : []),
    '',
    '=== OS scheduler ===',
    ...formatWorkflowOsSchedulerManualSmokeChecklistLines(),
    ...(shellBlock.length > 0 ? ['', '=== Windows shell ===', ...shellBlock] : []),
    ...(uiDpi.length > 0 ? ['', '=== uiDpi snapshot ===', ...uiDpi] : [])
  ]
  appendOwnerManualSmokeE2ePlanLines(lines)
  return lines
}
