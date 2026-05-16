import { ENGINE_IDS, type EngineId } from '../../shared/engine-contract'
import { uiText } from './locales/ui-text'

export type EngineSummary = 'checking' | 'ready' | 'missing' | 'error'

export type EnginesSnapshot = Awaited<ReturnType<typeof window.fluxalloy.engines.getStatus>>

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
  const parts = ENGINE_IDS.map((id) => {
    const e = snapshot.engines[id]
    const name = engineLabel(id)
    if (e.state === 'ready' && e.version) {
      const cut =
        e.version.length > 30
          ? `${e.version.slice(0, 28)}${uiText('commonUnicodeEllipsis')}`
          : e.version
      return `${name}: ${cut}`
    }
    if (e.state === 'missing') {
      return `${name}: ${uiText('uiPlaceholderDash')}`
    }
    if (e.state === 'error') {
      return `${name}: ${uiText('enginesVersionLineErrorMark')}`
    }
    return `${name}: ${uiText('commonUnicodeEllipsis')}`
  })
  return parts.join(' · ')
}

/**
 * Сводит подробные статусы движков к одной строке для нижнего статусбара.
 */
export function summarizeEngines(
  engines: Awaited<ReturnType<typeof window.fluxalloy.engines.getStatus>>['engines']
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
