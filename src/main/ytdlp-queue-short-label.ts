import { existsSync, statSync } from 'fs'
import { resolve } from 'path'

import { shortUrlLabel } from './downloads-queue'
import { displayLabelFromYtdlpOutputPath } from './ytdlp-progress-parser-download'

const YTDLP_PARTIAL_FILE_SUFFIXES = ['.part', '.ytdl', '.temp', '.tmp'] as const

/** Похоже на технический id из `[info]` / экстрактора, а не на название ролика. */
export function looksLikeYtdlpTechnicalShortLabel(label: string): boolean {
  const t = label.trim()
  if (t.length < 2) {
    return true
  }
  if (/^-?\d+_\d+$/.test(t)) {
    return true
  }
  if (/^[A-Za-z0-9_-]{11}$/.test(t)) {
    return true
  }
  if (/^\d{5,}$/.test(t)) {
    return true
  }
  if (
    !/\s/.test(t) &&
    /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(t) &&
    t.length <= 48 &&
    !/[а-яА-ЯёЁ]/.test(t)
  ) {
    return true
  }
  return false
}

/** Заменять ли текущую подпись очереди на label, полученный из пути вывода yt-dlp. */
export function shouldPreferYtdlpOutputPathShortLabel(
  curShort: string,
  nice: string,
  url: string
): boolean {
  const cur = curShort.trim()
  const next = nice.trim()
  if (next.length < 2 || cur === next) {
    return false
  }
  if (cur === shortUrlLabel(url)) {
    return true
  }
  if (looksLikeYtdlpTechnicalShortLabel(cur)) {
    return true
  }
  if (!/\s/.test(cur) && /\s/.test(next) && next.length >= cur.length) {
    return true
  }
  return next.length >= cur.length + 4 && cur.length < 20
}

function labelFromExistingFile(absPath: string): string | null {
  try {
    if (!existsSync(absPath) || !statSync(absPath).isFile()) {
      return null
    }
  } catch {
    return null
  }
  return displayLabelFromYtdlpOutputPath(absPath)
}

/**
 * Подпись для строки очереди: сначала существующий `.part`/финал на диске,
 * иначе — из объявленного пути Destination (ещё без файла).
 */
export function pickYtdlpQueueShortLabelForOutputPath(outputPath: string): string | null {
  const declared = outputPath.trim()
  if (declared.length === 0) {
    return null
  }
  const absDeclared = resolve(declared)
  for (const suffix of YTDLP_PARTIAL_FILE_SUFFIXES) {
    const fromPartial = labelFromExistingFile(`${absDeclared}${suffix}`)
    if (fromPartial) {
      return fromPartial
    }
  }
  const fromFinal = labelFromExistingFile(absDeclared)
  if (fromFinal) {
    return fromFinal
  }
  return displayLabelFromYtdlpOutputPath(absDeclared)
}

/** Можно ли подставить title из ранней строки `[info] …: Downloading N format(s)`. */
export function shouldApplyYtdlpInfoTitleShortLabel(
  title: string,
  url: string,
  curShort: string
): boolean {
  if (curShort !== shortUrlLabel(url)) {
    return false
  }
  return !looksLikeYtdlpTechnicalShortLabel(title)
}
