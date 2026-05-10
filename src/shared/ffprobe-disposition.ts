/**
 * §9 — краткая строка по `streams[].disposition` из ffprobe: только активные флаги.
 * Полный набор ключей версионируется FFmpeg; неизвестные truthy ключи добавляются в конец как `key`.
 */

const DISPOSITION_LABELS: Record<string, string> = {
  default: 'по умолчанию',
  forced: 'принудительно',
  dub: 'дубляж',
  original: 'оригинал',
  comment: 'комментарий',
  lyrics: 'текст',
  karaoke: 'караоке',
  hearing_impaired: 'субтитры СН',
  visual_impaired: 'аудиоописание',
  captions: 'captions',
  descriptions: 'описания',
  timed_thumbnails: 'превью по времени',
  attached_pic: 'обложка',
  clean_effects: 'чистые эффекты',
  dependent: 'зависимая дорожка',
  still_image: 'статичное изображение',
  non_diegetic: 'недиегетика',
  multilayer: 'многослойная',
  metadata: 'метаданные'
}

/** Стабильный порядок известных флагов для UI и экспорта. */
const KNOWN_DISPOSITION_KEY_ORDER = Object.freeze(Object.keys(DISPOSITION_LABELS))

function dispositionValueIsOn(v: unknown): boolean {
  if (typeof v === 'boolean') {
    return v
  }
  if (typeof v === 'number') {
    return v !== 0 && Number.isFinite(v)
  }
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number.parseInt(v.trim(), 10)
    return n !== 0 && Number.isFinite(n)
  }
  return false
}

/** Одна строка через « · » для UI и экспорта; пустая строка, если нет активных флагов. */
export function formatFfprobeDispositionSummary(disposition: unknown): string {
  if (!disposition || typeof disposition !== 'object') {
    return ''
  }
  const o = disposition as Record<string, unknown>
  const labels: string[] = []
  const extras: string[] = []
  for (const key of KNOWN_DISPOSITION_KEY_ORDER) {
    if (!dispositionValueIsOn(o[key])) {
      continue
    }
    const mapped = DISPOSITION_LABELS[key]
    if (mapped) {
      labels.push(mapped)
    }
  }
  for (const key of Object.keys(o)) {
    if (KNOWN_DISPOSITION_KEY_ORDER.includes(key)) {
      continue
    }
    if (!dispositionValueIsOn(o[key])) {
      continue
    }
    extras.push(key)
  }
  extras.sort((a, b) => a.localeCompare(b))
  return [...labels, ...extras].join(' · ')
}
