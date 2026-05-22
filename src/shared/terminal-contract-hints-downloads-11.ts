import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки Загрузки (часть 11/14; §8 audit prune). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_11: TerminalCommandHintEntry[] = [
  {
    tool: 'yt-dlp',
    token: '· в файл: миниатюры',
    summary:
      'Записать словарь миниатюр (поле thumbnails;, ссылки на обложки разных размеров) в velorix-ytdlp-thumbs.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file thumbnails velorix-ytdlp-thumbs.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: геометаданные',
    summary:
      'Записать (поле location) (местоположение из метаданных площадки) в velorix-ytdlp-locmeta.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file location velorix-ytdlp-locmeta.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ax (Аландские о-ва) -F',
    summary: 'Гео-обход через Аландские острова (--geo-bypass-country AX -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AX -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sj (Шпицберген и Ян-Майен) -F',
    summary: 'Гео-обход через Шпицберген и Ян-Майен (--geo-bypass-country SJ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SJ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sh (о. Вознесения) -F',
    summary: 'Гео-обход через остров Святой Елены (--geo-bypass-country SH -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· метаданные размера в расширенных атрибутах (xattr) -F',
    summary:
      'Писать ожидаемый размер файла в xattr где поддерживается ОС (--xattr-set-filesize -F); допишите ссылку.',
    fullLine: 'yt-dlp --xattr-set-filesize -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: эпоха публикации',
    summary:
      'Записать (поле epoch) (время публикации в UNIX, если модуль извлечения отдаёт) в velorix-ytdlp-epoch.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file epoch velorix-ytdlp-epoch.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: запрошенные субтитры',
    summary:
      'Записать (поле requested_subtitles) (JSON выбранных субтитров) в velorix-ytdlp-reqsubs.txt без скачивания; допишите ссылку.',
    fullLine:
      'yt-dlp --print-to-file requested_subtitles velorix-ytdlp-reqsubs.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: канал плейлиста',
    summary:
      'Записать (поле playlist_channel) (имя канала плейлиста) в velorix-ytdlp-plch.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist_channel velorix-ytdlp-plch.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: число элементов',
    summary:
      'Записать (поле n_entries) (число элементов плейлиста) в velorix-ytdlp-nent.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file n_entries velorix-ytdlp-nent.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: дизлайки',
    summary:
      'Записать число дизлайков (поле dislike_count, часто NA) в velorix-ytdlp-dislikes.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file dislike_count velorix-ytdlp-dislikes.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· без метафайлов плейлиста -F',
    summary:
      'Не писать .info.json и .description рядом с плейлистом (--no-playlist-metafiles -F); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --no-playlist-metafiles -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bv (о. Буве) -F',
    summary: 'Гео-обход через остров Буве (--geo-bypass-country BV -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tf (Французские Южные территории) -F',
    summary:
      'Гео-обход через Французские Южные и Антарктические территории (--geo-bypass-country TF -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео hm (Херд и Макдональд) -F',
    summary:
      'Гео-обход через остров Херд и острова Макдональд (--geo-bypass-country HM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country HM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео io (Британская территория в Индийском океане) -F',
    summary:
      'Гео-обход через Британскую территорию в Индийском океане (--geo-bypass-country IO -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country IO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео pn (Питкэрн) -F',
    summary: 'Гео-обход через Питкэрн (--geo-bypass-country PN -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео aq (Антарктида) -F',
    summary: 'Гео-обход через Антарктиду (--geo-bypass-country AQ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AQ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gs (Южная Георгия) -F',
    summary:
      'Гео-обход через Южную Георгию и Южные Сандвичевы острова (--geo-bypass-country GS -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео pm (Сен-Пьер и Микелон) -F',
    summary: 'Гео-обход через Сен-Пьер и Микелон (--geo-bypass-country PM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: дата релиза',
    summary:
      'Записать (поле release_date) (поле YYYYMMDD) в velorix-ytdlp-reldate.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file release_date velorix-ytdlp-reldate.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: время изменения (unix)',
    summary:
      'Записать (поле modified_timestamp) (Unix, если модуль извлечения отдаёт) в velorix-ytdlp-mts.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file modified_timestamp velorix-ytdlp-mts.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: время загрузки (unix)',
    summary:
      'Записать (поле upload_timestamp) (Unix загрузки на площадку) в velorix-ytdlp-upts.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file upload_timestamp velorix-ytdlp-upts.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: соотношение сторон',
    summary:
      'Записать (поле aspect_ratio) (строка площадки) в velorix-ytdlp-aspect.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file aspect_ratio velorix-ytdlp-aspect.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: сорт эпизода',
    summary:
      'Записать (поле episode_sort) (сортировка эпизода в сериалах) в velorix-ytdlp-epsort.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file episode_sort velorix-ytdlp-epsort.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео fk (Фолкленды) -F',
    summary: 'Гео-обход через Фолклендские острова (--geo-bypass-country FK -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country FK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео eh (Западная Сахара) -F',
    summary: 'Гео-обход через Западную Сахару (--geo-bypass-country EH -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country EH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео dj (Джибути) -F',
    summary: 'Гео-обход через Джибути (--geo-bypass-country DJ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country DJ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео kg (Кыргызстан) -F',
    summary: 'Гео-обход через Киргизию (--geo-bypass-country KG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country KG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tj (Таджикистан) -F',
    summary: 'Гео-обход через Таджикистан (--geo-bypass-country TJ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TJ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео np (Непал) -F',
    summary: 'Гео-обход через Непал (--geo-bypass-country NP -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country NP -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео la (Лаос) -F',
    summary: 'Гео-обход через Лаос (--geo-bypass-country LA -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country LA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео kh (Камбоджа) -F',
    summary: 'Гео-обход через Камбоджу (--geo-bypass-country KH -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country KH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bn (Бруней) -F',
    summary: 'Гео-обход через Бруней (--geo-bypass-country BN -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: верификация канала',
    summary:
      'Записать (поле channel_is_verified) (флаг верификации канала) в velorix-ytdlp-chverify.txt без скачивания; допишите ссылку.',
    fullLine:
      'yt-dlp --print-to-file channel_is_verified velorix-ytdlp-chverify.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: приватность',
    summary:
      'Записать (поле is_private) (признак приватного или ограниченного ролика) в velorix-ytdlp-private.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file is_private velorix-ytdlp-private.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: композиторы',
    summary:
      'Записать (поле composers) (если модуль извлечения отдаёт) в velorix-ytdlp-composers.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file composers velorix-ytdlp-composers.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: создатели',
    summary:
      'Записать (поле creators) (если модуль извлечения отдаёт) в velorix-ytdlp-creators.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file creators velorix-ytdlp-creators.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: номер трека',
    summary:
      'Записать (поле track_number) (номер трека в каталоге) в velorix-ytdlp-trknum.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file track_number velorix-ytdlp-trknum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mm (Мьянма) -F',
    summary: 'Гео-обход через Мьянму (--geo-bypass-country MM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bt (Бутан) -F',
    summary: 'Гео-обход через Бутан (--geo-bypass-country BT -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mv (Мальдивы) -F',
    summary: 'Гео-обход через Мальдивы (--geo-bypass-country MV -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mz (Мозамбик) -F',
    summary: 'Гео-обход через Мозамбик (--geo-bypass-country MZ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео zw (Зимбабве) -F',
    summary: 'Гео-обход через Зимбабве (--geo-bypass-country ZW -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country ZW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bw (Ботсвана) -F',
    summary: 'Гео-обход через Ботсвану (--geo-bypass-country BW -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео na (Намибия) -F',
    summary: 'Гео-обход через Намибию (--geo-bypass-country NA -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country NA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ls (Лесото) -F',
    summary: 'Гео-обход через Лесото (--geo-bypass-country LS -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country LS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mw (Малави) -F',
    summary: 'Гео-обход через Малави (--geo-bypass-country MW -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sz (Эсватини) -F',
    summary: 'Гео-обход через Эсватини (--geo-bypass-country SZ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: жанр',
    summary:
      'Записать (поле genre) (жанр, если модуль извлечения отдаёт) в velorix-ytdlp-genre.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file genre velorix-ytdlp-genre.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: тип альбома',
    summary:
      'Записать (поле album_type) (тип релиза: альбом, сингл и т. п.) в velorix-ytdlp-albumtype.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file album_type velorix-ytdlp-albumtype.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: лицензия',
    summary:
      'Записать (поле license) (лицензия, Creative Commons и т. п., если есть) в velorix-ytdlp-license.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file license velorix-ytdlp-license.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: трек',
    summary:
      'Записать (поле track) (номер трека как строка каталога) в velorix-ytdlp-track.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file track velorix-ytdlp-track.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: исполнитель альбома',
    summary:
      'Записать (поле album_artist) (альбомный исполнитель) в velorix-ytdlp-albumartist.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file album_artist velorix-ytdlp-albumartist.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: комментарий',
    summary:
      'Записать (поле comment) (комментарий площадки или автора, uploader comment) в velorix-ytdlp-comment.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file comment velorix-ytdlp-comment.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео td (Чад) -F',
    summary: 'Гео-обход через Чад (--geo-bypass-country TD -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ne (Нигер) -F',
    summary: 'Гео-обход через Нигер (--geo-bypass-country NE -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country NE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ml (Мали) -F',
    summary: 'Гео-обход через Мали (--geo-bypass-country ML -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country ML -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sn (Сенегал) -F',
    summary: 'Гео-обход через Сенегал (--geo-bypass-country SN -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ly (Ливия) -F',
    summary: 'Гео-обход через Ливию (--geo-bypass-country LY -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country LY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео so (Сомали) -F',
    summary: 'Гео-обход через Сомали (--geo-bypass-country SO -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SO -F '
  }
]
