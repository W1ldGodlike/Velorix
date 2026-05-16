/** Результат `ffprobe` для превью §7 / инспектора §9 (IPC в renderer). */

export interface MediaProbeTrackRow {
  index: number
  kind: 'video' | 'audio' | 'subtitle' | 'attachment' | 'data' | 'other'
  codec: string
  /** Одна строка: разрешение, fps, каналы, язык и т.д. */
  detail: string
  /** `tags.language`, если ffprobe отдал тег. */
  language: string | null
  /** `tags.title` дорожки (не путать с главами контейнера). */
  titleTag: string | null
  /** Средний битрейт дорожки из `stream.bit_rate`, кбит/с; `null`, если ffprobe не дал. */
  streamBitrateKbps: number | null
  /** Активные флаги `stream.disposition`; пустая строка, если только нули / нет блока. */
  dispositionSummary: string
  /** Для видео: `pix_fmt`; иначе `null`. */
  pixelFormat: string | null
  /** Для видео: `sample_aspect_ratio`; иначе `null`. */
  sampleAspectRatio: string | null
  /** Для видео: `display_aspect_ratio`; иначе `null`. */
  displayAspectRatio: string | null
  /** Для видео: `color_space` (например bt709/bt2020nc); иначе `null`. */
  colorSpace: string | null
  /** Для видео: `color_primaries`; иначе `null`. */
  colorPrimaries: string | null
  /** Для видео: характеристика передачи (поле ffprobe color_transfer или color_trc); иначе `null`. */
  colorTransfer: string | null
  /** Для видео: `color_range` (tv/pc и т.п.); иначе `null`. */
  colorRange: string | null
}

/** Глава контейнера §9 (ffprobe `-show_chapters`). */
export interface MediaProbeChapterRow {
  /** Идентификатор из ffprobe (`id`). */
  index: number
  startSec: number
  endSec: number
  /** `tags.title`, если есть. */
  title: string | null
}

/** Краткий срез JSON ffprobe для главного окна §7 (превью и таймлайн). */
export interface MediaProbeSuccess {
  ok: true
  /** Длительность в секундах; `null`, если контейнер её не даёт. */
  durationSec: number | null
  /** Первый видеопоток или `null` (только аудио и т.п.). */
  video: { width: number; height: number; codec: string } | null
  /**
   * Оценка FPS первого видеопотока: `avg_frame_rate`→`r_frame_rate` или `nb_frames`/длительность.
   * Для §1.1 снап кадра на таймлайне; без видео или данных — `null`.
   */
  videoFpsApprox: number | null
  /** Кодек первой аудиодорожки или `null`. */
  audioCodec: string | null
  /** Короткое имя формата контейнера ffprobe. */
  formatName: string | null
  /** Расширенное имя контейнера (если есть). */
  formatLongName: string | null
  /** Средний битрейт файла в килобитах/с из `format.bit_rate`; `null`, если неизвестен. */
  bitrateKbps: number | null
  /** `format.tags.major_brand` (MP4/MOV), если ffprobe отдал. */
  containerMajorBrand: string | null
  /** `format.tags.creation_time`, если ffprobe отдал. */
  containerCreationTime: string | null
  /** `format.tags.encoder`, если ffprobe отдал. */
  containerEncoder: string | null
  /** `format.tags.title`, если ffprobe отдал. */
  containerTitleTag: string | null
  /** `format.tags.comment`, если ffprobe отдал. */
  containerCommentTag: string | null
  /** `format.tags.description`, если ffprobe отдал. */
  containerDescriptionTag: string | null
  /** `format.tags.compatible_brands`, если ffprobe отдал. */
  containerCompatibleBrands: string | null
  /** `format.probe_score` 0–100, если ffprobe отдал. */
  probeScore: number | null
  /** `format.nb_streams`, если ffprobe отдал. */
  containerNbStreams: number | null
  /** `format.nb_programs`, если ffprobe отдал. */
  containerNbPrograms: number | null
  /** `format.flags` (hex-строка для UI/экспорта), если ffprobe отдал. */
  containerFormatFlags: string | null
  /** `format.size` в байтах, если ffprobe отдал. */
  containerSizeBytes: number | null
  /** `format.start_time` (секунды), если ffprobe отдал ненулевое смещение. */
  containerStartTimeSec: number | null
  /** `format.start_time_real` (секунды), если ffprobe отдал ненулевое значение. */
  containerStartTimeRealSec: number | null
  /** `format.filename` (путь/имя входа ffprobe), если отдал. */
  containerFilename: string | null
  /** Все потоки в порядке индекса ffprobe. */
  tracks: MediaProbeTrackRow[]
  /** Главы из `-show_chapters`; пусто, если в файле нет метаданных глав. */
  chapters: MediaProbeChapterRow[]
  /** Сырой JSON stdout ffprobe (для §9: просмотр / копирование). */
  rawJson: string
}

export type MediaProbeResult = MediaProbeSuccess | { ok: false; error: string }
