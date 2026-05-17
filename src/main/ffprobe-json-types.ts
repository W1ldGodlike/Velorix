export interface FfprobeJson {
  chapters?: unknown[]
  format?: {
    duration?: string
    format_name?: string
    format_long_name?: string
    bit_rate?: string
    probe_score?: string | number
    nb_streams?: string | number
    nb_programs?: string | number
    flags?: string | number
    size?: string | number
    start_time?: string | number
    start_time_real?: string | number
    duration_ts?: string | number
    time_base?: string
    probe_size?: string | number
    filename?: string
    tags?: Record<string, string | number | undefined>
  }
  streams?: Array<{
    index?: number
    codec_type?: string
    codec_name?: string
    codec_long_name?: string
    width?: number
    height?: number
    channels?: number
    sample_rate?: string
    channel_layout?: string
    avg_frame_rate?: string
    r_frame_rate?: string
    nb_frames?: string
    pix_fmt?: string
    sample_aspect_ratio?: string
    display_aspect_ratio?: string
    color_space?: string
    color_primaries?: string
    /** Основное имя в актуальных сборках ffprobe; иначе смотрим `color_trc`. */
    color_transfer?: string
    color_trc?: string
    color_range?: string
    /** H.264/HEVC и др.: baseline/main/high … */
    profile?: string
    /** Уровень кодека (часто целое вроде `41` у H.264). */
    level?: string | number
    /** progressive / tt / tb / tff / bff … */
    field_order?: string
    chroma_location?: string
    bits_per_raw_sample?: string | number
    /** Глубина закодированного сэмпла (PCM/AAC и др.); отдельно от `bits_per_raw_sample` у видео. */
    bits_per_coded_sample?: string | number
    /** Размер кодируемого кадра; иногда отличается от `width`/`height` (crop/padding). */
    coded_width?: number
    coded_height?: number
    /** H.264/HEVC: число опорных кадров. */
    refs?: number
    /** Число буферизуемых B-кадров (ffprobe legacy). */
    has_b_frames?: number
    /** FourCC / тег кодека в контейнере (`avc1`, `hvc1` …). */
    codec_tag_string?: string
    /** Числовой тег кодека (`0x31637661`); полезен, если `codec_tag_string` пуст/невалиден. */
    codec_tag?: string | number
    /** Размер extradata потока (ffprobe), байты. */
    extradata_size?: string | number
    /** Priming/padding samples reported by ffprobe; useful for audio sync diagnostics. */
    initial_padding?: string | number
    /** Ненулевое значение — встроенные CEA-608/708 в видеопотоке (трансляции и т.п.). */
    closed_captions?: string | number
    /** H.264: `1` — length-prefixed AVC, `0` — Annex B (NAL с start codes). */
    is_avc?: string | number
    /** Тиков на кадр таймбазы потока; >1 — нетривиально для fps/seek. */
    ticks_per_frame?: string | number
    /** Секунды от начала контейнера (строка float ffprobe). */
    start_time?: string
    /** Таймбаза потока; вместе с `start_pts` помогает диагностировать сдвиги timestamp. */
    time_base?: string
    /** База времени кодека; может отличаться от `time_base` дорожки в контейнере. */
    codec_time_base?: string
    /** Начальный PTS в единицах `time_base`; показываем только нетривиальные значения. */
    start_pts?: string | number
    /** Длительность дорожки (секунды строкой); может отличаться от `format.duration`. */
    duration?: string
    /** Длительность в тиках `time_base` дорожки. */
    duration_ts?: string | number
    bit_rate?: string
    /** Пиковый/макс. битрейт потока (ffprobe), если отличается от `bit_rate`. */
    max_bit_rate?: string
    /** Для аудио: float planar, s16 и т.п. */
    sample_fmt?: string
    /** PCM/WAV: бит на сэмпл. */
    bits_per_sample?: number
    disposition?: Record<string, unknown>
    tags?: Record<string, string | number | undefined>
    side_data_list?: unknown
  }>
}
