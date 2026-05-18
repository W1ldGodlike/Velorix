import type { MiniPlayerSnapshot } from './mini-player-snapshot-contract'

function parseProgressPercent(progress: string): number | null {
  const m = progress.match(/(\d+(?:\.\d+)?)\s*%/)
  if (!m?.[1]) {
    return null
  }
  const n = Number(m[1])
  if (!Number.isFinite(n)) {
    return null
  }
  return Math.max(0, Math.min(100, n))
}

export function buildMiniPlayerSnapshot(input: {
  exportActive: boolean
  downloadActive: boolean
  downloadProgress: string | null
  downloadSpeed: string | null
  downloadStatus: string | null
}): Omit<MiniPlayerSnapshot, 'alwaysOnTop'> {
  const exportActive = input.exportActive
  const downloadActive = input.downloadActive
  const hasActiveWork = exportActive || downloadActive

  let detailLine = ''
  let progressPercent: number | null = null

  if (exportActive && downloadActive) {
    detailLine = [input.downloadStatus, input.downloadProgress].filter(Boolean).join(' · ')
    progressPercent = input.downloadProgress ? parseProgressPercent(input.downloadProgress) : null
  } else if (exportActive) {
    detailLine = 'ffmpeg export'
    progressPercent = null
  } else if (downloadActive) {
    const parts = [input.downloadStatus, input.downloadProgress, input.downloadSpeed].filter(
      (p) => typeof p === 'string' && p.trim() !== ''
    )
    detailLine = parts.join(' · ')
    progressPercent = input.downloadProgress ? parseProgressPercent(input.downloadProgress) : null
  }

  return {
    hasActiveWork,
    exportActive,
    downloadActive,
    detailLine,
    progressPercent
  }
}
