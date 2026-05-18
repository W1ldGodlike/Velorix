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

function formatExportDetail(input: {
  exportPercent: number | null
  exportMessage: string | null
  exportSpeed: string | null
}): { detailLine: string; progressPercent: number | null } {
  const pct = input.exportPercent !== null && input.exportPercent >= 0 ? input.exportPercent : null
  const parts: string[] = []
  if (pct !== null) {
    const rounded = Math.round(pct * 10) / 10
    parts.push(Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(1)}%`)
  }
  const speed = input.exportSpeed?.trim()
  if (speed) {
    parts.push(speed)
  }
  if (parts.length === 0) {
    const msg = input.exportMessage?.trim()
    if (msg) {
      parts.push(msg.length > 96 ? `${msg.slice(0, 94)}…` : msg)
    }
  }
  return {
    detailLine: parts.join(' · '),
    progressPercent: pct
  }
}

export function buildMiniPlayerSnapshot(input: {
  exportActive: boolean
  downloadActive: boolean
  downloadProgress: string | null
  downloadSpeed: string | null
  downloadStatus: string | null
  exportPercent: number | null
  exportMessage: string | null
  exportSpeed: string | null
}): Omit<MiniPlayerSnapshot, 'alwaysOnTop'> {
  const exportActive = input.exportActive
  const downloadActive = input.downloadActive
  const hasActiveWork = exportActive || downloadActive

  let detailLine = ''
  let progressPercent: number | null = null

  const exportDetail = exportActive
    ? formatExportDetail({
        exportPercent: input.exportPercent,
        exportMessage: input.exportMessage,
        exportSpeed: input.exportSpeed
      })
    : null

  if (exportActive && downloadActive) {
    const downloadParts = [
      input.downloadStatus,
      input.downloadProgress,
      input.downloadSpeed
    ].filter((p) => typeof p === 'string' && p.trim() !== '')
    const downloadLine = downloadParts.join(' · ')
    detailLine = [exportDetail?.detailLine, downloadLine]
      .filter((p) => p && p.length > 0)
      .join(' · ')
    const downloadPct = input.downloadProgress ? parseProgressPercent(input.downloadProgress) : null
    progressPercent = downloadPct ?? exportDetail?.progressPercent ?? null
  } else if (exportActive && exportDetail) {
    detailLine = exportDetail.detailLine
    progressPercent = exportDetail.progressPercent
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
