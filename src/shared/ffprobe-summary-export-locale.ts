/** Локали экспорта TXT/HTML сводки ffprobe (shared; без renderer). */
export type FfprobeSummaryLocale = 'ru' | 'en'

export type FfprobeSummaryStrings = {
  plainDocTitle: string
  plainDivider: string
  durationPrefix: string
  durationUnknown: string
  numSecSuffix: string
  videoLabel: string
  videoNone: string
  videoCodecInfix: string
  fpsApproxPrefix: string
  fpsApproxValueTemplate: string
  audioNone: string
  audioCodecPrefix: string
  formatPrefix: string
  formatUnknown: string
  formatLongPrefix: string
  containerBrandTemplate: string
  containerBrandWithCompatTemplate: string
  containerCreationTimeTemplate: string
  containerEncoderTemplate: string
  containerPublisherTemplate: string
  containerEncodedByTemplate: string
  containerSoftwareTemplate: string
  containerTitleTemplate: string
  containerCommentTemplate: string
  containerDescriptionTemplate: string
  containerArtistTemplate: string
  containerSortArtistTemplate: string
  containerAlbumTemplate: string
  containerAlbumArtistTemplate: string
  containerSortAlbumTemplate: string
  containerSortTitleTemplate: string
  containerGenreTemplate: string
  containerTrackTemplate: string
  containerDiscTemplate: string
  containerCopyrightTemplate: string
  containerIsrcTemplate: string
  containerDateTemplate: string
  containerPurchaseDateTemplate: string
  probeScoreTemplate: string
  containerNbStreamsTemplate: string
  containerNbStreamsMismatchTemplate: string
  containerNbProgramsTemplate: string
  containerFormatFlagsTemplate: string
  containerSizeTemplate: string
  containerStartTimeTemplate: string
  containerStartTimeRealTemplate: string
  containerStartTimeRealMismatchTemplate: string
  containerFilenameTemplate: string
  bitrateEstPrefix: string
  bitratePlainPrefix: string
  bitrateMbpsTemplate: string
  bitrateKbpsTemplate: string
  bitrateBitsTemplate: string
  streamsCountTemplate: string
  txtTrackTableHeader: string
  chaptersCountTemplate: string
  chapterTableHeaderTxt: string
  plainFooter: string
  trackKindVideo: string
  trackKindAudio: string
  trackKindSubtitle: string
  trackKindAttachment: string
  trackKindData: string
  trackKindOther: string
  dash: string
  htmlLang: string
  htmlTitle: string
  htmlH1: string
  htmlTracksH2Template: string
  htmlChaptersH2Template: string
  htmlTrackTheadRow: string
  htmlChapterTheadRow: string
  htmlNoTracksRow: string
  htmlFooter: string
}

const RU: FfprobeSummaryStrings = {
  plainDocTitle: 'FluxAlloy — сводка ffprobe',
  plainDivider: '========================',
  durationPrefix: 'Длительность',
  durationUnknown: 'неизвестна',
  numSecSuffix: ' с',
  videoLabel: 'Видео',
  videoNone: 'Видео: нет',
  videoCodecInfix: ', кодек ',
  fpsApproxPrefix: 'Частота кадров (оценка, видео): ',
  fpsApproxValueTemplate: '{value} к/с',
  audioNone: 'Аудио: нет',
  audioCodecPrefix: 'Аудио: кодек ',
  formatPrefix: 'Формат: ',
  formatUnknown: 'Формат: ?',
  formatLongPrefix: 'Описание формата: ',
  containerBrandTemplate: 'Бренд контейнера: {brand}',
  containerBrandWithCompatTemplate: 'Бренд контейнера: {brand} (совместимые: {compat})',
  containerCreationTimeTemplate: 'Дата создания (creation_time): {time}',
  containerEncoderTemplate: 'Кодировщик контейнера (encoder): {encoder}',
  containerPublisherTemplate: 'Издатель контейнера (publisher): {publisher}',
  containerEncodedByTemplate: 'Кодировал (encoded_by): {encodedBy}',
  containerSoftwareTemplate: 'ПО контейнера (software): {software}',
  containerTitleTemplate: 'Заголовок контейнера (title): {title}',
  containerCommentTemplate: 'Комментарий контейнера (comment): {comment}',
  containerDescriptionTemplate: 'Описание контейнера (description): {description}',
  containerArtistTemplate: 'Исполнитель контейнера (artist): {artist}',
  containerSortArtistTemplate: 'Сортировка исполнителя контейнера (sort_artist): {sortArtist}',
  containerAlbumTemplate: 'Альбом контейнера (album): {album}',
  containerAlbumArtistTemplate: 'Исполнитель альбома контейнера (album_artist): {albumArtist}',
  containerSortAlbumTemplate: 'Сортировка альбома контейнера (sort_album): {sortAlbum}',
  containerSortTitleTemplate: 'Сортировка заголовка контейнера (sort_title): {sortTitle}',
  containerGenreTemplate: 'Жанр контейнера (genre): {genre}',
  containerTrackTemplate: 'Трек контейнера (track): {track}',
  containerDiscTemplate: 'Диск контейнера (disc): {disc}',
  containerCopyrightTemplate: 'Авторские права контейнера (copyright): {copyright}',
  containerIsrcTemplate: 'ISRC контейнера (isrc): {isrc}',
  containerDateTemplate: 'Дата контейнера (date): {date}',
  containerPurchaseDateTemplate: 'Дата покупки контейнера (purchase_date): {purchaseDate}',
  probeScoreTemplate: 'Оценка демультиплексора (probe_score): {score}',
  containerNbStreamsTemplate: 'Потоков в контейнере (nb_streams): {count}',
  containerNbStreamsMismatchTemplate:
    'Потоков в контейнере (nb_streams): {nb} (разобрано дорожек: {parsed})',
  containerNbProgramsTemplate: 'Программ в контейнере (nb_programs): {count}',
  containerFormatFlagsTemplate: 'Флаги контейнера (flags): {flags}',
  containerSizeTemplate: 'Размер файла (format.size): {label} ({bytes} B)',
  containerStartTimeTemplate: 'Смещение контейнера (start_time): {time}',
  containerStartTimeRealTemplate: 'Реальное смещение (start_time_real): {time}',
  containerStartTimeRealMismatchTemplate:
    'Реальное смещение (start_time_real): {real} (start_time: {nominal})',
  containerFilenameTemplate: 'Имя входа ffprobe (filename): {filename}',
  bitrateEstPrefix: 'Битрейт (оценка): ',
  bitratePlainPrefix: 'Битрейт: ',
  bitrateMbpsTemplate: '{value} Мбит/с',
  bitrateKbpsTemplate: '{value} кбит/с',
  bitrateBitsTemplate: '{value} бит/с',
  streamsCountTemplate: 'Дорожек: {count}',
  txtTrackTableHeader:
    '#\tТип\tКодек\tФорм. пикс.\tSAR\tDAR\tЦв. пространство\tОсн. цвета\tПередача цвета\tДиапазон\tБитрейт\tСвойства дорожки\tЯзык\tЗаголовок\tСведения',
  chaptersCountTemplate: 'Главы: {count}',
  chapterTableHeaderTxt: 'ID\tНачало\tКонец\tДлит.\tЗаголовок',
  plainFooter: '— FluxAlloy',
  trackKindVideo: 'Видео',
  trackKindAudio: 'Аудио',
  trackKindSubtitle: 'Субтитры',
  trackKindAttachment: 'Вложение',
  trackKindData: 'Данные',
  trackKindOther: 'Прочее',
  dash: '—',
  htmlLang: 'ru',
  htmlTitle: 'FluxAlloy — сводка ffprobe',
  htmlH1: 'Сводка ffprobe',
  htmlTracksH2Template: 'Дорожки ({count})',
  htmlChaptersH2Template: 'Главы ({count})',
  htmlTrackTheadRow:
    '<thead><tr><th>#</th><th>Тип</th><th>Кодек</th><th>Форм. пикс.</th><th>SAR</th><th>DAR</th><th>Цв. пространство</th><th>Осн. цвета</th><th>Передача цвета</th><th>Диапазон</th><th>Битрейт</th><th>Свойства дорожки</th><th>Язык</th><th>Заголовок</th><th>Сведения</th></tr></thead>',
  htmlChapterTheadRow:
    '<thead><tr><th>ID</th><th>Начало</th><th>Конец</th><th>Длительность</th><th>Заголовок</th></tr></thead>',
  htmlNoTracksRow: '<tr><td colspan="15">Нет дорожек</td></tr>',
  htmlFooter: 'FluxAlloy'
}

const EN: FfprobeSummaryStrings = {
  plainDocTitle: 'FluxAlloy — ffprobe summary',
  plainDivider: '========================',
  durationPrefix: 'Duration',
  durationUnknown: 'duration unknown',
  numSecSuffix: ' s',
  videoLabel: 'Video',
  videoNone: 'Video: none',
  videoCodecInfix: ', codec ',
  fpsApproxPrefix: 'FPS (approx., video): ',
  fpsApproxValueTemplate: '{value} fps',
  audioNone: 'Audio: none',
  audioCodecPrefix: 'Audio: codec ',
  formatPrefix: 'Format: ',
  formatUnknown: 'Format: ?',
  formatLongPrefix: 'Container description: ',
  containerBrandTemplate: 'Container brand: {brand}',
  containerBrandWithCompatTemplate: 'Container brand: {brand} (compatible: {compat})',
  containerCreationTimeTemplate: 'Creation time (creation_time): {time}',
  containerEncoderTemplate: 'Container encoder (encoder): {encoder}',
  containerPublisherTemplate: 'Container publisher (publisher): {publisher}',
  containerEncodedByTemplate: 'Encoded by (encoded_by): {encodedBy}',
  containerSoftwareTemplate: 'Container software (software): {software}',
  containerTitleTemplate: 'Container title (title): {title}',
  containerCommentTemplate: 'Container comment (comment): {comment}',
  containerDescriptionTemplate: 'Container description (description): {description}',
  containerArtistTemplate: 'Container artist (artist): {artist}',
  containerSortArtistTemplate: 'Container sort artist (sort_artist): {sortArtist}',
  containerAlbumTemplate: 'Container album (album): {album}',
  containerAlbumArtistTemplate: 'Container album artist (album_artist): {albumArtist}',
  containerSortAlbumTemplate: 'Container sort album (sort_album): {sortAlbum}',
  containerSortTitleTemplate: 'Container sort title (sort_title): {sortTitle}',
  containerGenreTemplate: 'Container genre (genre): {genre}',
  containerTrackTemplate: 'Container track (track): {track}',
  containerDiscTemplate: 'Container disc (disc): {disc}',
  containerCopyrightTemplate: 'Container copyright (copyright): {copyright}',
  containerIsrcTemplate: 'Container ISRC (isrc): {isrc}',
  containerDateTemplate: 'Container date (date): {date}',
  containerPurchaseDateTemplate: 'Container purchase date (purchase_date): {purchaseDate}',
  probeScoreTemplate: 'Demuxer confidence (probe_score): {score}',
  containerNbStreamsTemplate: 'Container streams (nb_streams): {count}',
  containerNbStreamsMismatchTemplate:
    'Container streams (nb_streams): {nb} (parsed tracks: {parsed})',
  containerNbProgramsTemplate: 'Container programs (nb_programs): {count}',
  containerFormatFlagsTemplate: 'Container flags (flags): {flags}',
  containerSizeTemplate: 'File size (format.size): {label} ({bytes} B)',
  containerStartTimeTemplate: 'Container start offset (start_time): {time}',
  containerStartTimeRealTemplate: 'Real start offset (start_time_real): {time}',
  containerStartTimeRealMismatchTemplate:
    'Real start offset (start_time_real): {real} (start_time: {nominal})',
  containerFilenameTemplate: 'Ffprobe input name (filename): {filename}',
  bitrateEstPrefix: 'Bitrate (estimate): ',
  bitratePlainPrefix: 'Bitrate: ',
  bitrateMbpsTemplate: '{value} Mb/s',
  bitrateKbpsTemplate: '{value} kb/s',
  bitrateBitsTemplate: '{value} b/s',
  streamsCountTemplate: 'Streams: {count}',
  txtTrackTableHeader:
    '#\tType\tCodec\tPix_fmt\tSAR\tDAR\tColor space\tPrimaries\tTransfer\tRange\tBitrate\tDisposition\tLanguage\tTitle\tDetails',
  chaptersCountTemplate: 'Chapters: {count}',
  chapterTableHeaderTxt: 'id\tStart\tEnd\tDur.\tTitle',
  plainFooter: '— FluxAlloy',
  trackKindVideo: 'Video',
  trackKindAudio: 'Audio',
  trackKindSubtitle: 'Subtitles',
  trackKindAttachment: 'Attachment',
  trackKindData: 'Data',
  trackKindOther: 'Other',
  dash: '—',
  htmlLang: 'en',
  htmlTitle: 'FluxAlloy — ffprobe summary',
  htmlH1: 'ffprobe summary',
  htmlTracksH2Template: 'Streams ({count})',
  htmlChaptersH2Template: 'Chapters ({count})',
  htmlTrackTheadRow:
    '<thead><tr><th>#</th><th>Type</th><th>Codec</th><th>Pix_fmt</th><th>SAR</th><th>DAR</th><th>Color space</th><th>Primaries</th><th>Transfer</th><th>Range</th><th>Bitrate</th><th>Disposition</th><th>Language</th><th>Title</th><th>Details</th></tr></thead>',
  htmlChapterTheadRow:
    '<thead><tr><th>id</th><th>Start</th><th>End</th><th>Duration</th><th>Title</th></tr></thead>',
  htmlNoTracksRow: '<tr><td colspan="15">No streams</td></tr>',
  htmlFooter: 'FluxAlloy'
}

export function ffprobeSummaryStrings(locale: FfprobeSummaryLocale): FfprobeSummaryStrings {
  return locale === 'en' ? EN : RU
}

export function ffprobeSummaryFill(
  template: string,
  vars: Record<string, string | number>
): string {
  let s = template
  for (const [k, v] of Object.entries(vars)) {
    s = s.split(`{${k}}`).join(String(v))
  }
  return s
}

/** kbps из `stream.bit_rate` / контейнера — те же единицы, что в экспорте сводки и превью. */
export function formatFfprobeBitrateLabelFromKbps(
  kbps: number | null,
  locale: FfprobeSummaryLocale
): string | null {
  if (kbps === null || !Number.isFinite(kbps)) {
    return null
  }
  const b = ffprobeSummaryStrings(locale)
  if (kbps >= 10_000) {
    return ffprobeSummaryFill(b.bitrateMbpsTemplate, { value: (kbps / 1000).toFixed(2) })
  }
  return ffprobeSummaryFill(b.bitrateKbpsTemplate, { value: Math.round(kbps) })
}

/** bps из side_data CPB (сырая числовая строка в бит/с). */
export function formatFfprobeBitrateLabelFromBps(
  bps: number,
  locale: FfprobeSummaryLocale
): string {
  const b = ffprobeSummaryStrings(locale)
  if (!Number.isFinite(bps) || bps <= 0) {
    return ffprobeSummaryFill(b.bitrateBitsTemplate, { value: '0' })
  }
  if (bps >= 1_000_000) {
    const mb = bps / 1_000_000
    const value = mb >= 10 ? mb.toFixed(0) : mb.toFixed(1)
    return ffprobeSummaryFill(b.bitrateMbpsTemplate, { value })
  }
  if (bps >= 1000) {
    const kb = bps / 1000
    const value = kb >= 10 ? kb.toFixed(0) : kb.toFixed(1)
    return ffprobeSummaryFill(b.bitrateKbpsTemplate, { value })
  }
  return ffprobeSummaryFill(b.bitrateBitsTemplate, { value: String(Math.trunc(bps)) })
}
