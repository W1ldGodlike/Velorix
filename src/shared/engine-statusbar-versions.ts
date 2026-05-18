import { ENGINE_IDS, type EngineId, type EnginesStatusSnapshot } from './engine-contract'
import { parseEngineVersionToken } from './engine-version-parse'

export type EngineVersionSegmentLabels = {
  dash: string
  errorMark: string
  checking: string
  ellipsis: string
  engineName: (id: EngineId) => string
}

/** Строка статусбара: `ffmpeg: 7.1.1 · ffprobe: … · yt-dlp: …` (§4.C). */
export function formatEngineVersionsLineFromSnapshot(
  snapshot: EnginesStatusSnapshot,
  labels: EngineVersionSegmentLabels
): string {
  const parts = ENGINE_IDS.map((id) => {
    const e = snapshot.engines[id]
    const name = labels.engineName(id)
    if (e.state === 'ready' && e.version) {
      const token = parseEngineVersionToken(id, e.version)
      const display =
        token ?? (e.version.length > 24 ? `${e.version.slice(0, 22)}${labels.ellipsis}` : e.version)
      return `${name}: ${display}`
    }
    if (e.state === 'missing') {
      return `${name}: ${labels.dash}`
    }
    if (e.state === 'error') {
      return `${name}: ${labels.errorMark}`
    }
    return `${name}: ${labels.checking}`
  })
  return parts.join(' · ')
}
