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

/** Диапазон экспорта на весь файл (In = 0, Out = duration). */
export function trimFromProbeDuration(
  durationSec: number | null | undefined
): MediaExportTrimPayload | null {
  if (durationSec == null || !Number.isFinite(durationSec) || durationSec <= 0) {
    return null
  }
  return { inSec: 0, outSec: durationSec }
}

function trimSpansEqual(a: MediaExportTrimPayload, b: MediaExportTrimPayload): boolean {
  return Math.abs(a.inSec - b.inSec) < 0.02 && Math.abs(a.outSec - b.outSec) < 0.02
}

/** Индекс главы, если текущий trim совпадает с диапазоном главы. */
export function findChapterIndexMatchingTrim(
  trim: MediaExportTrimPayload | null,
  chapters: MediaProbeChapterRow[],
  durationSec: number | null | undefined
): number | null {
  if (trim == null || chapters.length === 0) {
    return null
  }
  for (const chapter of chapters) {
    const fromChapter = trimFromProbeChapter(chapter, chapters, durationSec)
    if (fromChapter != null && trimSpansEqual(fromChapter, trim)) {
      return chapter.index
    }
  }
  return null
}
