const FFPROBE_DETAIL_CREATED_VALUE_MAX = 28

function readCreationTimeTag(
  tags: Record<string, string | number | undefined> | undefined
): string | null {
  if (!tags) {
    return null
  }
  const v = tags['creation_time']
  if (typeof v === 'string' && v.trim() !== '') {
    return v.trim()
  }
  if (typeof v === 'number' && Number.isFinite(v)) {
    return String(v)
  }
  return null
}

/**
 * Компактная метка даты/времени создания из `tags.creation_time` (MOV/MP4 и др.).
 */
export function formatFfprobeCreationTimeBrief(
  tags: Record<string, string | number | undefined> | undefined
): string | null {
  const raw = readCreationTimeTag(tags)
  if (raw === null) {
    return null
  }
  const dateHead = raw.match(/^(\d{4}-\d{2}-\d{2})/)
  if (dateHead !== null) {
    return `created ${dateHead[1]}`
  }
  const collapsed = raw.replace(/\s+/g, ' ').trim()
  if (collapsed.length <= FFPROBE_DETAIL_CREATED_VALUE_MAX) {
    return `created ${collapsed}`
  }
  return `created ${collapsed.slice(0, FFPROBE_DETAIL_CREATED_VALUE_MAX - 1)}…`
}
