import type {
  ProcessingHistoryKind,
  ProcessingHistoryOutcome
} from '../../../shared/processing-history-contract'
import type { YtdlpDownloadHistoryOutcome } from '../../../shared/ytdlp-history-contract'
import {
  isYtdlpQueueStatusErrorLike,
  parseYtdlpQueueRetryPauseCounts,
  YTDLP_QUEUE_STATUS_CANCELLED,
  YTDLP_QUEUE_STATUS_DONE,
  YTDLP_QUEUE_STATUS_RUNNING,
  YTDLP_QUEUE_STATUS_WAITING,
  YTDLP_QUEUE_STATUS_RETRY_PAUSE_PREFIX
} from '../../../shared/ytdlp-queue-status'

import { getUiLocale } from './ui-text-session'
import { getUiTextTables, type UiTextKey, type UiTextTables } from './ui-text-strings'

function table(): UiTextTables['ru'] {
  return getUiTextTables()[getUiLocale()]
}

export type { UiTextKey }

export type MiniIconTitleKey = {
  [K in UiTextKey]: K extends `miniIcon${string}` ? K : never
}[UiTextKey]

export function miniIconTitle(key: MiniIconTitleKey): string {
  return table()[key]
}

export function uiText(key: UiTextKey): string {
  return table()[key]
}

export function uiTextVars(key: UiTextKey, vars: Record<string, string | number>): string {
  let s = uiText(key)
  for (const [k, v] of Object.entries(vars)) {
    s = s.split(`{${k}}`).join(String(v))
  }
  return s
}

export type TerminalIntroTailVars = {
  pageStep: number
  maxInline: number
}

export function formatTerminalIntroTail(vars: TerminalIntroTailVars): string {
  return table().terminalIntroTailTemplate
    .replace(/\{pageStep\}/g, String(vars.pageStep))
    .replace(/\{maxInline\}/g, String(vars.maxInline))
}

export function formatTerminalPreviewTooltip(token: string): string {
  return table().terminalPreviewFileTooltipOpen.replace(/\{token\}/g, token)
}

export function formatTerminalExitLine(code: number | null | undefined, ms: number): string {
  const codeStr =
    code === null || code === undefined ? uiText('commonNotApplicableShort') : String(code)
  return table().terminalExitCodeMsTemplate
    .replace(/\{code\}/g, codeStr)
    .replace(/\{ms\}/g, String(ms))
}

export function formatTerminalCopyLineAria(lineNumber1Based: number): string {
  return table().terminalCopyLineAriaTemplate.replace(
    /\{n\}/g,
    String(lineNumber1Based)
  )
}

export function formatMaintenanceCleanDone(files: number, bytes: string): string {
  return table().maintenanceCleanDoneTemplate
    .replace(/\{files\}/g, String(files))
    .replace(/\{bytes\}/g, bytes)
}

export function formatMaintenanceConfirmHint(label: string): string {
  return table().maintenanceConfirmHintTemplate.replace(/\{label\}/g, label)
}

export function formatMaintenanceSummary(bytes: string, details?: string): string {
  const template =
    details && details.trim().length > 0
      ? table().maintenanceSummaryWithDetailsTemplate
      : table().maintenanceSummaryTemplate
  return template.replace(/\{bytes\}/g, bytes).replace(/\{details\}/g, details ?? '')
}

/** Двоичные степени 1024 с локализованными суффиксами (см. `byteSize*` в `UI_TEXT`). */
export function formatUiBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return uiText('byteSizeZero')
  }
  const units = [
    uiText('byteSizeUnitB'),
    uiText('byteSizeUnitKiB'),
    uiText('byteSizeUnitMiB'),
    uiText('byteSizeUnitGiB')
  ]
  let value = bytes
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`
}

export function formatDownloadsHistoryTime(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) {
    return uiText('uiPlaceholderDash')
  }
  const loc = getUiLocale() === 'en' ? 'en-US' : 'ru-RU'
  return new Date(ms).toLocaleString(loc, {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatProcessingDurationLabel(ms: number): string {
  const en = getUiLocale() === 'en'
  if (!Number.isFinite(ms) || ms <= 0) {
    return en ? '0s' : '0с'
  }
  const totalSec = Math.round(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  if (min <= 0) {
    return en ? `${sec}s` : `${sec}с`
  }
  const h = Math.floor(min / 60)
  const m = min % 60
  if (en) {
    return h > 0 ? `${h}h ${m}m` : `${m}m ${sec}s`
  }
  return h > 0 ? `${h}ч ${m}м` : `${m}м ${sec}с`
}

export function formatDownloadsHistoryOutcomeLabel(outcome: YtdlpDownloadHistoryOutcome): string {
  if (outcome === 'success') {
    return uiText('processingOutcomeSuccess')
  }
  if (outcome === 'cancelled') {
    return uiText('processingOutcomeCancelled')
  }
  return uiText('processingOutcomeError')
}

export function formatProcessingHistoryOutcomeLabel(outcome: ProcessingHistoryOutcome): string {
  return formatDownloadsHistoryOutcomeLabel(outcome)
}

export function formatProcessingHistoryKindLabel(kind: ProcessingHistoryKind): string {
  if (kind === 'ffmpegSnapshot') {
    return uiText('processingHistoryKindSnapshot')
  }
  if (kind === 'autoExport') {
    return uiText('processingHistoryKindAutoExport')
  }
  if (kind === 'ffmpegBatchExport') {
    return uiText('processingHistoryKindBatchExport')
  }
  if (kind === 'workflowScenario') {
    return uiText('processingHistoryKindWorkflowScenario')
  }
  return uiText('processingHistoryKindExport')
}

/** Localized label for §7.3 batch queue row `status`. */
export function formatFfmpegExportBatchStatusLabel(status: string): string {
  if (status === 'waiting') {
    return uiText('batchExportRowStatusWaiting')
  }
  if (status === 'running') {
    return uiText('batchExportRowStatusRunning')
  }
  if (status === 'done') {
    return uiText('batchExportRowStatusDone')
  }
  if (status === 'error') {
    return uiText('batchExportRowStatusError')
  }
  if (status === 'cancelled') {
    return uiText('batchExportRowStatusCancelled')
  }
  return status
}

/** Localized label for a persisted yt-dlp queue row `status` string (§6). */
export function formatDownloadsQueueRowStatus(status: string): string {
  if (status === YTDLP_QUEUE_STATUS_WAITING) {
    return uiText('downloadsQueueRowStatusWaiting')
  }
  if (status === YTDLP_QUEUE_STATUS_RUNNING) {
    return uiText('downloadsQueueRowStatusRunning')
  }
  if (status === YTDLP_QUEUE_STATUS_DONE) {
    return uiText('downloadsQueueRowStatusDone')
  }
  if (status === YTDLP_QUEUE_STATUS_CANCELLED) {
    return uiText('downloadsQueueRowStatusCancelled')
  }
  const retry = parseYtdlpQueueRetryPauseCounts(status)
  if (retry !== null) {
    return uiTextVars('downloadsQueueRowStatusRetryTemplate', { cur: retry.cur, max: retry.max })
  }
  if (status.startsWith(YTDLP_QUEUE_STATUS_RETRY_PAUSE_PREFIX)) {
    return uiText('downloadsQueueRowStatusRetryUnknown')
  }
  if (isYtdlpQueueStatusErrorLike(status)) {
    return status
  }
  return status
}
