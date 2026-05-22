import { type EngineId } from '../../shared/engine-contract'
import type { EngineUpdateCheckItem } from '../../shared/engine-update-check-contract'
import { formatEngineVersionsLineFromSnapshot } from '../../shared/engine-statusbar-versions'
import { uiText, uiTextVars } from './locales/ui-text'

export type EngineSummary = 'checking' | 'ready' | 'missing' | 'error'

export type EnginesSnapshot = Awaited<ReturnType<typeof window.velorix.engines.getStatus>>

export type EnginePathsDraft = Record<EngineId, string>

export function engineLabel(id: EngineId): string {
  switch (id) {
    case 'ffmpeg':
      return uiText('engineDisplayNameFfmpeg')
    case 'ffprobe':
      return uiText('engineDisplayNameFfprobe')
    case 'yt-dlp':
      return uiText('engineDisplayNameYtdlp')
    default:
      return id
  }
}

export function formatEngineVersionsLine(snapshot: EnginesSnapshot): string {
  return formatEngineVersionsLineFromSnapshot(snapshot, {
    dash: uiText('uiPlaceholderDash'),
    errorMark: uiText('enginesVersionLineErrorMark'),
    checking: uiText('commonUnicodeEllipsis'),
    ellipsis: uiText('commonUnicodeEllipsis'),
    engineName: engineLabel
  })
}

/**
 * Сводит подробные статусы движков к одной строке для нижнего статусбара.
 */
export function summarizeEngines(
  engines: Awaited<ReturnType<typeof window.velorix.engines.getStatus>>['engines']
): EngineSummary {
  const states = Object.values(engines).map((engine) => engine.state)

  if (states.includes('error')) {
    return 'error'
  }
  if (states.includes('missing')) {
    return 'missing'
  }
  return 'ready'
}

/** Сравнение с GitHub без авто-загрузки (macOS/Linux). */
export function formatEngineUpdateCompareOnlyHint(items: EngineUpdateCheckItem[]): string {
  const parts = items
    .filter((item) => item.updateAvailable)
    .map((item) => {
      const name = engineLabel(item.id)
      const from = item.currentVersion ?? uiText('uiPlaceholderDash')
      const to = item.latestVersion ?? uiText('uiPlaceholderDash')
      return `${name} ${from}→${to}`
    })
  if (parts.length === 0) {
    return uiText('statusEnginesUpdateUpToDate')
  }
  return uiTextVars('statusEnginesUpdateCompareOnlyTemplate', { detail: parts.join('; ') })
}

export function formatEngineUpdateStatusHint(
  items: EngineUpdateCheckItem[],
  downloaded: boolean
): string {
  if (!downloaded) {
    return uiText('statusEnginesUpdateUpToDate')
  }
  const parts = items
    .filter((item) => item.updateAvailable)
    .map((item) => {
      const name = engineLabel(item.id)
      const from = item.currentVersion ?? uiText('uiPlaceholderDash')
      const to = item.latestVersion ?? uiText('uiPlaceholderDash')
      return `${name} ${from}→${to}`
    })
  if (parts.length === 0) {
    return uiText('statusEnginesDownloadedOk')
  }
  return uiTextVars('statusEnginesUpdateDownloadedTemplate', { detail: parts.join('; ') })
}

export function engineSummaryText(summary: EngineSummary): string {
  switch (summary) {
    case 'ready':
      return uiText('enginesSummaryReady')
    case 'missing':
      return uiText('enginesSummaryMissing')
    case 'error':
      return uiText('enginesSummaryError')
    case 'checking':
      return uiText('enginesSummaryChecking')
  }
}
