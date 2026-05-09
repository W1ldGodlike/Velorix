/** Результат `ffprobe` для превью §7 / инспектора §9 (IPC в renderer). */

export interface MediaProbeTrackRow {
  index: number
  kind: 'video' | 'audio' | 'subtitle' | 'attachment' | 'data' | 'other'
  codec: string
  /** Одна строка: разрешение, fps, каналы, язык и т.д. */
  detail: string
}

/** Краткий срез JSON ffprobe для главного окна §7 (превью и таймлайн). */
export interface MediaProbeSuccess {
  ok: true
  /** Длительность в секундах; `null`, если контейнер её не даёт. */
  durationSec: number | null
  /** Первый видеопоток или `null` (только аудио и т.п.). */
  video: { width: number; height: number; codec: string } | null
  /** Кодек первой аудиодорожки или `null`. */
  audioCodec: string | null
  /** Короткое имя формата контейнера ffprobe. */
  formatName: string | null
  /** Расширенное имя контейнера (если есть). */
  formatLongName: string | null
  /** Средний битрейт файла в килобитах/с из `format.bit_rate`; `null`, если неизвестен. */
  bitrateKbps: number | null
  /** Все потоки в порядке индекса ffprobe. */
  tracks: MediaProbeTrackRow[]
  /** Сырой JSON stdout ffprobe (для §9: просмотр / копирование). */
  rawJson: string
}

export type MediaProbeResult = MediaProbeSuccess | { ok: false; error: string }
