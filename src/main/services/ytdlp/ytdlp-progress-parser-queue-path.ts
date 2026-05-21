import { unquoteYtdlpPath } from './ytdlp-progress-parser-queue-info'

export function extractYtdlpOutputPath(line: string): string | null {
  const t = line.trim()
  /** `Destination:` встречается у download, ExtractAudio и постпроцессоров на базе ffmpeg §6.4. */
  const destination = t.match(/^\[(?:download|ExtractAudio|ffmpeg)]\s+Destination:\s+(.+)$/i)
  if (destination) {
    const cap = destination[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  const alreadyDownloaded = t.match(/^\[download]\s+(.+?)\s+has already been downloaded$/i)
  if (alreadyDownloaded) {
    const cap = alreadyDownloaded[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  const merging = t.match(/^\[Merger]\s+Merging formats into\s+(.+)$/i)
  if (merging) {
    const cap = merging[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  /** Альтернативный тег слияния (некоторые сборки пишут `[ffmpeg]` вместо `[Merger]`). */
  const ffmpegMerge = t.match(/^\[ffmpeg]\s+Merging formats into\s+(.+)$/i)
  if (ffmpegMerge) {
    const cap = ffmpegMerge[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  const moving = t.match(/^\[MoveFiles]\s+Moving file\s+.+?\s+to\s+(.+)$/i)
  if (moving) {
    const cap = moving[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  const fixup = t.match(
    /^\[(?:FixupM3u8|FixupM4a|FixupStretched|FixupTimestamp|FixupDuration|FFmpegFixupM3u8)]\s+.+?(?:in|of)\s+(.+)$/i
  )
  if (fixup) {
    const cap = fixup[1]
    if (cap === undefined) {
      return null
    }
    const quotedTail = cap.match(/"([^"]+)"\s*$/)
    if (quotedTail?.[1]) {
      return quotedTail[1]
    }
    const pathTail = cap.match(/\b(?:in|of)\s+((?:[A-Za-z]:)?[/\\].+|\.\.?[/\\].+)$/i)
    return pathTail?.[1] ?? unquoteYtdlpPath(cap)
  }
  /** Постобработка: превью и субтитры пишутся отдельными строками §6.4. */
  const thumb = t.match(/^\[download]\s+Writing thumbnail to:\s+(.+)$/i)
  if (thumb) {
    const cap = thumb[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  const subs = t.match(/^\[download]\s+Writing video subtitles to:\s+(.+)$/i)
  if (subs) {
    const cap = subs[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  const subsAlt = t.match(/^\[download]\s+Writing subtitles to:\s+(.+)$/i)
  if (subsAlt) {
    const cap = subsAlt[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  const embedSub = t.match(/^\[EmbedSubtitle]\s+Embedding subtitles in\s+(.+)$/i)
  if (embedSub) {
    const cap = embedSub[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  const metaWrite = t.match(/^\[Metadata]\s+Writing metadata to\s+(.+)$/i)
  if (metaWrite) {
    const cap = metaWrite[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  /** Запись тегов в медиа та же по смыслу, что `[Metadata]`, но префикс `[download]` в части сборок. */
  const downloadMetaWrite = t.match(/^\[download]\s+Writing metadata to:\s+(.+)$/i)
  if (downloadMetaWrite) {
    const cap = downloadMetaWrite[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  /** FFmpegVideoConvertor и др.: «…; Destination: путь» (см. FFmpeg PP в yt-dlp). */
  const semiDestination = t.match(/^\[[^\]]+\]\s+.+;\s+Destination:\s+(.+)$/i)
  if (semiDestination) {
    const cap = semiDestination[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  /** Любой PP с `Destination:` сразу после тега (не только download/ExtractAudio/ffmpeg). */
  const genericPpDestination = t.match(/^\[[^\]]+\]\s+Destination:\s+(.+)$/i)
  if (genericPpDestination) {
    const cap = genericPpDestination[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  /** EmbedThumbnailPP: `[EmbedThumbnail] ffmpeg: Adding thumbnail to "…"` и аналоги. */
  const embedThumbnail = t.match(/^\[[^\]]+\]\s+[^:]+:\s+Adding thumbnail to\s+"(.+)"$/i)
  if (embedThumbnail) {
    const cap = embedThumbnail[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  /** FFmpegMetadataPP до записи: `Adding metadata to "…"`. */
  const addingMetadata = t.match(/^\[[^\]]+\]\s+Adding metadata to\s+"(.+)"$/i)
  if (addingMetadata) {
    const cap = addingMetadata[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  /** FFmpegConcatPP: выходной файл при переименовании одного фрагмента в итоговое имя. */
  const movingTo = t.match(/^\[[^\]]+\]\s+Moving\s+"(.+?)"\s+to\s+"(.+)"$/i)
  if (movingTo) {
    const cap = movingTo[2]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  /** VideoRemuxer / FFmpegVideoRemuxer — итоговый контейнер после remux §6.4. */
  const remuxInto = t.match(/^\[(?:VideoRemuxer|FFmpegVideoRemuxer)]\s+.+?\s+into\s+(.+)$/i)
  if (remuxInto) {
    const cap = remuxInto[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  /** ConvertFormatPP и др.: «… → Destination: …» или ASCII «… -> Destination: …». */
  const arrowDestination = t.match(/^\[[^\]]+\]\s+.+?\s+(?:→|->)\s+Destination:\s+(.+)$/i)
  if (arrowDestination) {
    const cap = arrowDestination[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  /** SubtitlesConvertor: конвертация дорожки в другой формат (типично `->` между путями). */
  const subsConvertArrow = t.match(
    /^\[(?:SubsConvertor|SubtitlesConvertor)]\s+.+?\s+(?:→|->)\s+(.+)$/i
  )
  if (subsConvertArrow) {
    const cap = subsConvertArrow[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  const subsConvertInto = t.match(/^\[(?:SubsConvertor|SubtitlesConvertor)]\s+.+?\s+into\s+(.+)$/i)
  if (subsConvertInto) {
    const cap = subsConvertInto[1]
    return cap !== undefined ? unquoteYtdlpPath(cap) : null
  }
  return null
}
