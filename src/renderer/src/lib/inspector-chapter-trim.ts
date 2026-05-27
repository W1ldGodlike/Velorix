import type { MediaExportTrimPayload } from '../../../shared/ffmpeg-export-contract'
import type { MediaProbeChapterRow } from '../../../shared/ffprobe-contract'

/** Диапазон экспорта по главе ffprobe (In = start, Out = end или следующая глава). */
export function trimFromProbeChapter(
  chapter: MediaProbeChapterRow,
  chapters: MediaProbeChapterRow[],
  durationSec: number | null | undefined
): MediaExportTrimPayload | null {
  const inSec = chapter.startSec
  let outSec = chapter.endSec
  if (!Number.isFinite(outSec) || outSec <= inSec) {
    const sorted = [...chapters].sort((a, b) => a.startSec - b.startSec)
    const idx = sorted.findIndex((row) => row.index === chapter.index)
    const next = idx >= 0 ? sorted[idx + 1] : undefined
    outSec = next?.startSec ?? durationSec ?? inSec + 1
  }
  if (!Number.isFinite(outSec) || outSec <= inSec) {
    return null
  }
  return { inSec, outSec }
}
