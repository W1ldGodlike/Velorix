/** RU/EN шаблоны полей контейнера и format.* для `FfprobeSummaryStrings`. */
export type FfprobeSummaryLocalizedTemplate = { ru: string; en: string }

export const FFPROBE_SUMMARY_CONTAINER_TEMPLATE_SPECS = {
  containerBrandTemplate: {
    ru: 'Бренд контейнера: {brand}',
    en: 'Container brand: {brand}'
  },
  containerBrandWithCompatTemplate: {
    ru: 'Бренд контейнера: {brand} (совместимые: {compat})',
    en: 'Container brand: {brand} (compatible: {compat})'
  },
  containerCreationTimeTemplate: {
    ru: 'Дата создания (creation_time): {time}',
    en: 'Creation time (creation_time): {time}'
  },
  containerEncoderTemplate: {
    ru: 'Кодировщик контейнера (encoder): {encoder}',
    en: 'Container encoder (encoder): {encoder}'
  },
  containerPublisherTemplate: {
    ru: 'Издатель контейнера (publisher): {publisher}',
    en: 'Container publisher (publisher): {publisher}'
  },
  containerEncodedByTemplate: {
    ru: 'Кодировал (encoded_by): {encodedBy}',
    en: 'Encoded by (encoded_by): {encodedBy}'
  },
  containerSoftwareTemplate: {
    ru: 'ПО контейнера (software): {software}',
    en: 'Container software (software): {software}'
  },
  containerTitleTemplate: {
    ru: 'Заголовок контейнера (title): {title}',
    en: 'Container title (title): {title}'
  },
  containerCommentTemplate: {
    ru: 'Комментарий контейнера (comment): {comment}',
    en: 'Container comment (comment): {comment}'
  },
  containerSynopsisTemplate: {
    ru: 'Синопсис контейнера (synopsis): {synopsis}',
    en: 'Container synopsis (synopsis): {synopsis}'
  },
  containerDescriptionTemplate: {
    ru: 'Описание контейнера (description): {description}',
    en: 'Container description (description): {description}'
  },
  containerKeywordsTemplate: {
    ru: 'Ключевые слова контейнера (keywords): {keywords}',
    en: 'Container keywords (keywords): {keywords}'
  },
  containerLyricsTemplate: {
    ru: 'Текст песни контейнера (lyrics): {lyrics}',
    en: 'Container lyrics (lyrics): {lyrics}'
  },
  containerArtistTemplate: {
    ru: 'Исполнитель контейнера (artist): {artist}',
    en: 'Container artist (artist): {artist}'
  },
  containerPerformerTemplate: {
    ru: 'Исполнитель (performer) контейнера: {performer}',
    en: 'Container performer (performer): {performer}'
  },
  containerSortArtistTemplate: {
    ru: 'Сортировка исполнителя контейнера (sort_artist): {sortArtist}',
    en: 'Container sort artist (sort_artist): {sortArtist}'
  },
  containerAlbumTemplate: {
    ru: 'Альбом контейнера (album): {album}',
    en: 'Container album (album): {album}'
  },
  containerAlbumArtistTemplate: {
    ru: 'Исполнитель альбома контейнера (album_artist): {albumArtist}',
    en: 'Container album artist (album_artist): {albumArtist}'
  },
  containerSortAlbumTemplate: {
    ru: 'Сортировка альбома контейнера (sort_album): {sortAlbum}',
    en: 'Container sort album (sort_album): {sortAlbum}'
  },
  containerSortTitleTemplate: {
    ru: 'Сортировка заголовка контейнера (sort_title): {sortTitle}',
    en: 'Container sort title (sort_title): {sortTitle}'
  },
  containerGenreTemplate: {
    ru: 'Жанр контейнера (genre): {genre}',
    en: 'Container genre (genre): {genre}'
  },
  containerTrackTemplate: {
    ru: 'Трек контейнера (track): {track}',
    en: 'Container track (track): {track}'
  },
  containerDiscTemplate: {
    ru: 'Диск контейнера (disc): {disc}',
    en: 'Container disc (disc): {disc}'
  },
  containerCopyrightTemplate: {
    ru: 'Авторские права контейнера (copyright): {copyright}',
    en: 'Container copyright (copyright): {copyright}'
  },
  containerIsrcTemplate: {
    ru: 'ISRC контейнера (isrc): {isrc}',
    en: 'Container ISRC (isrc): {isrc}'
  },
  containerDateTemplate: {
    ru: 'Дата контейнера (date): {date}',
    en: 'Container date (date): {date}'
  },
  containerLocationTemplate: {
    ru: 'Место контейнера (location): {location}',
    en: 'Container location (location): {location}'
  },
  containerPurchaseDateTemplate: {
    ru: 'Дата покупки контейнера (purchase_date): {purchaseDate}',
    en: 'Container purchase date (purchase_date): {purchaseDate}'
  },
  probeScoreTemplate: {
    ru: 'Оценка демультиплексора (probe_score): {score}',
    en: 'Demuxer confidence (probe_score): {score}'
  },
  containerNbStreamsTemplate: {
    ru: 'Потоков в контейнере (nb_streams): {count}',
    en: 'Container streams (nb_streams): {count}'
  },
  containerNbStreamsMismatchTemplate: {
    ru: 'Потоков в контейнере (nb_streams): {nb} (разобрано дорожек: {parsed})',
    en: 'Container streams (nb_streams): {nb} (parsed tracks: {parsed})'
  },
  containerNbProgramsTemplate: {
    ru: 'Программ в контейнере (nb_programs): {count}',
    en: 'Container programs (nb_programs): {count}'
  },
  containerFormatFlagsTemplate: {
    ru: 'Флаги контейнера (flags): {flags}',
    en: 'Container flags (flags): {flags}'
  },
  containerSizeTemplate: {
    ru: 'Размер файла (format.size): {label} ({bytes} B)',
    en: 'File size (format.size): {label} ({bytes} B)'
  },
  containerStartTimeTemplate: {
    ru: 'Смещение контейнера (start_time): {time}',
    en: 'Container start offset (start_time): {time}'
  },
  containerStartTimeRealTemplate: {
    ru: 'Реальное смещение (start_time_real): {time}',
    en: 'Real start offset (start_time_real): {time}'
  },
  containerStartTimeRealMismatchTemplate: {
    ru: 'Реальное смещение (start_time_real): {real} (start_time: {nominal})',
    en: 'Real start offset (start_time_real): {real} (start_time: {nominal})'
  },
  containerFilenameTemplate: {
    ru: 'Имя входа ffprobe (filename): {filename}',
    en: 'Ffprobe input name (filename): {filename}'
  }
} as const satisfies Record<string, FfprobeSummaryLocalizedTemplate>

export type FfprobeSummaryContainerTemplateKey =
  keyof typeof FFPROBE_SUMMARY_CONTAINER_TEMPLATE_SPECS
