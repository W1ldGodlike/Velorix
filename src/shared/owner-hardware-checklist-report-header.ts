import { formatAboutBuildIdDisplay, formatBuiltAtUtcLine } from './app-build-info'

export type OwnerHardwareChecklistReportHeader = {
  appName: string
  appVersion: string
  buildId: string
  builtAtUtc: string | null
  electronVersion?: string
}

/** Строки в начале буфера при «Скопировать весь пакет» (не в Support ZIP). */
export function formatOwnerHardwareChecklistReportHeaderLines(
  header: OwnerHardwareChecklistReportHeader
): string[] {
  const lines = [
    'report: owner-hardware-checklist (owner hardware, not CI)',
    `app: ${header.appName} ${header.appVersion}`,
    `buildId: ${formatAboutBuildIdDisplay(header.buildId)}`
  ]
  const built = formatBuiltAtUtcLine(header.builtAtUtc)
  if (built) {
    lines.push(`builtAtUtc: ${built}`)
  }
  if (header.electronVersion && header.electronVersion.trim().length > 0) {
    lines.push(`electron: ${header.electronVersion.trim()}`)
  }
  return lines
}

export function prependOwnerHardwareChecklistReportHeader(
  checklistPlainText: string,
  headerLines: readonly string[]
): string {
  if (headerLines.length === 0) {
    return checklistPlainText
  }
  return [...headerLines, '', checklistPlainText].join('\n')
}
