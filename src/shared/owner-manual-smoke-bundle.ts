/**
 * §16 / §1.1 / §10 — единый пакет ручного smoke владельца (железо, не CI).
 */

import { formatFfmpegHwManualSmokeChecklistLines } from './ffmpeg-hw-manual-smoke-checklist'
import { formatOwnerManualSmokeHidpiChecklistLines } from './owner-manual-smoke-hidpi-lines'
import { formatWorkflowOsSchedulerManualSmokeChecklistLines } from './workflow-os-scheduler-manual-smoke-checklist'

export function formatOwnerManualSmokeBundlePlainText(parts: {
  hidpiLines: readonly string[]
  hwPlainText: string
  osPlainText: string | null
  uiDpiSnapshot?: readonly string[]
}): string {
  const blocks: string[] = ['=== HiDPI ===', ...parts.hidpiLines, '', '=== HW encode ===', parts.hwPlainText]
  if (parts.osPlainText && parts.osPlainText.trim().length > 0) {
    blocks.push('', '=== OS scheduler ===', parts.osPlainText)
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
  return [
    'ownerManualSmoke: NVENC/VAAPI + HiDPI + OS scheduler (owner hardware, not CI)',
    'UI: Settings → Dependencies → «Owner smoke» copy; sub-panels HW / HiDPI / planner OS smoke',
    '',
    '=== HiDPI ===',
    ...formatOwnerManualSmokeHidpiChecklistLines(),
    '',
    '=== HW encode ===',
    ...formatFfmpegHwManualSmokeChecklistLines(),
    '',
    '=== OS scheduler ===',
    ...formatWorkflowOsSchedulerManualSmokeChecklistLines(),
    ...(uiDpi.length > 0 ? ['', '=== uiDpi snapshot ===', ...uiDpi] : [])
  ]
}
