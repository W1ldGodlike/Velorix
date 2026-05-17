import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки вкладки «Загрузки» (часть 12). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_12: TerminalCommandHintEntry[] = [
  {
    tool: 'yt-dlp',
    token: '· в файл: номер сезона',
    summary:
      'Записать номер сезона (поле season_number) в flux-ytdlp-snum.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file season_number flux-ytdlp-snum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: номер эпизода',
    summary:
      'Записать номер эпизода (поле episode_number) в flux-ytdlp-epnum.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file episode_number flux-ytdlp-epnum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: название эпизода',
    summary:
      'Записать (поле episode) (строка площадки) в flux-ytdlp-epstr.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file episode flux-ytdlp-epstr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id эпизода',
    summary:
      'Записать идентификатор эпизода (поле episode_id) в flux-ytdlp-epid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file episode_id flux-ytdlp-epid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id сезона',
    summary:
      'Записать идентификатор сезона (поле season_id) в flux-ytdlp-sid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file season_id flux-ytdlp-sid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id канала плейлиста',
    summary:
      'Записать идентификатор канала плейлиста (поле playlist_channel_id) в flux-ytdlp-plchid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file playlist_channel_id flux-ytdlp-plchid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: частота дискретизации',
    summary:
      'Записать (поле asr) (Hz дискретизации аудио) в flux-ytdlp-asr.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file asr flux-ytdlp-asr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: защита контента (has_drm)',
    summary:
      'Записать признак DRM (поле has_drm) в flux-ytdlp-drm.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file has_drm flux-ytdlp-drm.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: встраивание в плеер',
    summary:
      'Записать ограничения встроенного плеера (поле playable_in_embed) в flux-ytdlp-embed.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file playable_in_embed flux-ytdlp-embed.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: был эфир',
    summary:
      'Записать признак «был эфир» (поле was_live) в flux-ytdlp-waslive.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file was_live flux-ytdlp-waslive.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: тип медиа',
    summary:
      'Записать тип медиа (поле media_type) в flux-ytdlp-mtype.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file media_type flux-ytdlp-mtype.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео pf (Французская Полинезия) -F',
    summary: 'Гео-обход через Французскую Полинезию (--geo-bypass-country PF -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео nc (Новая Каледония) -F',
    summary: 'Гео-обход через Новую Каледонию (--geo-bypass-country NC -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country NC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео fj (Фиджи) -F',
    summary: 'Гео-обход через Фиджи (--geo-bypass-country FJ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country FJ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео vu (Вануату) -F',
    summary: 'Гео-обход через Вануату (--geo-bypass-country VU -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country VU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sb (Соломоновы о-ва) -F',
    summary: 'Гео-обход через Соломоновы острова (--geo-bypass-country SB -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SB -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео fm (Микронезия) -F',
    summary:
      'Гео-обход через Федеративные Штаты Микронезии (--geo-bypass-country FM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country FM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mh (Маршалловы о-ва) -F',
    summary: 'Гео-обход через Маршалловы острова (--geo-bypass-country MH -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео pw (Палау) -F',
    summary: 'Гео-обход через Палау (--geo-bypass-country PW -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· не стоп при отклонении формата -F',
    summary:
      'Не останавливаться на отклонённом формате (--no-break-on-reject -F); допишите ссылку.',
    fullLine: 'yt-dlp --no-break-on-reject -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: тип записи',
    summary:
      'Записать тип объекта (поле _type: video, playlist и т. п.) в flux-ytdlp-otype.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file _type flux-ytdlp-otype.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на плейлист',
    summary:
      'Записать ссылку на плейлист (поле playlist_url) в flux-ytdlp-plurl.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist_url flux-ytdlp-plurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на манифест',
    summary:
      'Записать (поле manifest_url) (манифест HLS, DASH и др.) в flux-ytdlp-manurl.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file manifest_url flux-ytdlp-manurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: sar после растяжения кадра',
    summary:
      'Записать (поле stretched_ratio) (анаморфное растяжение кадра, если модуль извлечения отдаёт) в flux-ytdlp-sarfix.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file stretched_ratio flux-ytdlp-sarfix.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: запрошенные форматы',
    summary:
      'Записать (поле requested_formats) (JSON выбранных потоков) в flux-ytdlp-reqf.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file requested_formats flux-ytdlp-reqf.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео nr (Науру) -F',
    summary: 'Гео-обход через Науру (--geo-bypass-country NR -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country NR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tv (Тувалу) -F',
    summary: 'Гео-обход через Тувалу (--geo-bypass-country TV -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ki (Кирибати) -F',
    summary: 'Гео-обход через Кирибати (--geo-bypass-country KI -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country KI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео wf (Уоллис и Футуна) -F',
    summary: 'Гео-обход через Уоллис и Футуна (--geo-bypass-country WF -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country WF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· прогресс реже (Δ 5 с) -F',
    summary:
      'Реже обновлять строку прогресса (--progress-delta 5 -F); меньше шума в выводе при длинных списках с -F; допишите ссылку.',
    fullLine: 'yt-dlp --progress-delta 5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: список форматов',
    summary:
      'Записать список форматов (поле formats; JSON или текст от модуля извлечения) в flux-ytdlp-formats.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file formats flux-ytdlp-formats.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: прямая ссылка',
    summary:
      'Записать прямую ссылку на поток выбранного формата (поле url) в flux-ytdlp-url.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file url flux-ytdlp-url.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: миниатюры',
    summary:
      'Записать словарь миниатюр (поле thumbnails;, ссылки на обложки разных размеров) в flux-ytdlp-thumbs.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file thumbnails flux-ytdlp-thumbs.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: геометаданные',
    summary:
      'Записать (поле location) (местоположение из метаданных площадки) в flux-ytdlp-locmeta.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file location flux-ytdlp-locmeta.txt --skip-download '
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
      'Записать (поле epoch) (время публикации в UNIX, если модуль извлечения отдаёт) в flux-ytdlp-epoch.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file epoch flux-ytdlp-epoch.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: запрошенные субтитры',
    summary:
      'Записать (поле requested_subtitles) (JSON выбранных субтитров) в flux-ytdlp-reqsubs.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file requested_subtitles flux-ytdlp-reqsubs.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: канал плейлиста',
    summary:
      'Записать (поле playlist_channel) (имя канала плейлиста) в flux-ytdlp-plch.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist_channel flux-ytdlp-plch.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: число элементов',
    summary:
      'Записать (поле n_entries) (число элементов плейлиста) в flux-ytdlp-nent.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file n_entries flux-ytdlp-nent.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: дизлайки',
    summary:
      'Записать число дизлайков (поле dislike_count, часто NA) в flux-ytdlp-dislikes.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file dislike_count flux-ytdlp-dislikes.txt --skip-download '
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
      'Записать (поле release_date) (поле YYYYMMDD) в flux-ytdlp-reldate.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file release_date flux-ytdlp-reldate.txt --skip-download '
  }
]
