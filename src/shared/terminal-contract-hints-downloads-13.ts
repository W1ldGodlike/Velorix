import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки вкладки «Загрузки» (часть 13). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_13: TerminalCommandHintEntry[] = [
  {
    tool: 'yt-dlp',
    token: '· в файл: время изменения (unix)',
    summary:
      'Записать (поле modified_timestamp) (Unix, если модуль извлечения отдаёт) в flux-ytdlp-mts.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file modified_timestamp flux-ytdlp-mts.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: время загрузки (unix)',
    summary:
      'Записать (поле upload_timestamp) (Unix загрузки на площадку) в flux-ytdlp-upts.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file upload_timestamp flux-ytdlp-upts.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: соотношение сторон',
    summary:
      'Записать (поле aspect_ratio) (строка площадки) в flux-ytdlp-aspect.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file aspect_ratio flux-ytdlp-aspect.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: сорт эпизода',
    summary:
      'Записать (поле episode_sort) (сортировка эпизода в сериалах) в flux-ytdlp-epsort.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file episode_sort flux-ytdlp-epsort.txt --skip-download '
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
      'Записать (поле channel_is_verified) (флаг верификации канала) в flux-ytdlp-chverify.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file channel_is_verified flux-ytdlp-chverify.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: приватность',
    summary:
      'Записать (поле is_private) (признак приватного или ограниченного ролика) в flux-ytdlp-private.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file is_private flux-ytdlp-private.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: композиторы',
    summary:
      'Записать (поле composers) (если модуль извлечения отдаёт) в flux-ytdlp-composers.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file composers flux-ytdlp-composers.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: создатели',
    summary:
      'Записать (поле creators) (если модуль извлечения отдаёт) в flux-ytdlp-creators.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file creators flux-ytdlp-creators.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: номер трека',
    summary:
      'Записать (поле track_number) (номер трека в каталоге) в flux-ytdlp-trknum.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file track_number flux-ytdlp-trknum.txt --skip-download '
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
      'Записать (поле genre) (жанр, если модуль извлечения отдаёт) в flux-ytdlp-genre.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file genre flux-ytdlp-genre.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: тип альбома',
    summary:
      'Записать (поле album_type) (тип релиза: альбом, сингл и т. п.) в flux-ytdlp-albumtype.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file album_type flux-ytdlp-albumtype.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: лицензия',
    summary:
      'Записать (поле license) (лицензия, Creative Commons и т. п., если есть) в flux-ytdlp-license.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file license flux-ytdlp-license.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: трек',
    summary:
      'Записать (поле track) (номер трека как строка каталога) в flux-ytdlp-track.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file track flux-ytdlp-track.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: исполнитель альбома',
    summary:
      'Записать (поле album_artist) (альбомный исполнитель) в flux-ytdlp-albumartist.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file album_artist flux-ytdlp-albumartist.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: комментарий',
    summary:
      'Записать (поле comment) (комментарий площадки или автора, uploader comment) в flux-ytdlp-comment.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file comment flux-ytdlp-comment.txt --skip-download '
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
  },
  {
    tool: 'yt-dlp',
    token: '· гео er (Эритрея) -F',
    summary: 'Гео-обход через Эритрею (--geo-bypass-country ER -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country ER -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ss (Южный Судан) -F',
    summary: 'Гео-обход через Южный Судан (--geo-bypass-country SS -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ye (Йемен) -F',
    summary: 'Гео-обход через Йемен (--geo-bypass-country YE -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country YE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mr (Мавритания) -F',
    summary: 'Гео-обход через Мавританию (--geo-bypass-country MR -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: текст песни',
    summary:
      'Записать (поле lyrics) (текст песни, если модуль извлечения отдаёт) в flux-ytdlp-lyrics.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file lyrics flux-ytdlp-lyrics.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: номер диска',
    summary:
      'Записать (поле disc_number) (номер диска в каталоге) в flux-ytdlp-discnum.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file disc_number flux-ytdlp-discnum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: издатель',
    summary:
      'Записать (поле publisher) (издатель и лейбл, если есть) в flux-ytdlp-publisher.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file publisher flux-ytdlp-publisher.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: настроение',
    summary:
      'Записать (поле mood) (настроение и тег настроения, если модуль извлечения отдаёт) в flux-ytdlp-mood.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file mood flux-ytdlp-mood.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cm (Камерун) -F',
    summary: 'Гео-обход через Камерун (--geo-bypass-country CM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ga (Габон) -F',
    summary: 'Гео-обход через Габон (--geo-bypass-country GA -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cg (Республика Конго) -F',
    summary: 'Гео-обход через Республику Конго (--geo-bypass-country CG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cd (ДР Конго) -F',
    summary: 'Гео-обход через ДР Конго (--geo-bypass-country CD -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cf (ЦАР) -F',
    summary: 'Гео-обход через ЦАР (--geo-bypass-country CF -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CF -F '
  }
]
