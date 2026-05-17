import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки вкладки «Загрузки» (часть 15). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_15: TerminalCommandHintEntry[] = [
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на страницу плейлиста',
    summary:
      'Записать ссылку на страницу плейлиста (поле playlist_webpage_url) в flux-ytdlp-plwpurl.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist_webpage_url flux-ytdlp-plwpurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· повторы запроса 20 -F',
    summary:
      'Список форматов с увеличенным числом повторов HTTP (--retries 20 -F); нестабильные сети доставки (CDN); допишите ссылку.',
    fullLine: 'yt-dlp --retries 20 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· повторы фрагментов 20 -F',
    summary:
      'Список форматов с повторами для фрагментов DASH и HLS (--fragment-retries 20 -F); допишите ссылку.',
    fullLine: 'yt-dlp --fragment-retries 20 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: метка времени',
    summary:
      'Записать (поле timestamp) (Unix-время публикации, если модуль извлечения отдаёт) в flux-ytdlp-ts.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file timestamp flux-ytdlp-ts.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ключ экстрактора',
    summary:
      'Записать (поле extractor_key) (внутренний ключ модуля извлечения) в flux-ytdlp-extkey.txt без скачивания; полезно для диагностики; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file extractor_key flux-ytdlp-extkey.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id трека',
    summary:
      'Записать (поле track_id) (идентификатор трека у модуля извлечения, если отдаёт) в flux-ytdlp-trackid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file track_id flux-ytdlp-trackid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id альбома',
    summary:
      'Записать (поле album_id) (идентификатор альбома, если модуль извлечения отдаёт) в flux-ytdlp-albumid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file album_id flux-ytdlp-albumid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: динамический диапазон',
    summary:
      'Записать динамический диапазон (поле dynamic_range: SDR, HDR, Dolby Vision — если модуль извлечения отдаёт) в flux-ytdlp-dynrange.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file dynamic_range flux-ytdlp-dynrange.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: расширение аудио',
    summary:
      'Записать расширение аудио (поле audio_ext) выбранного формата (m4a, webm, opus и т. п.) в flux-ytdlp-audext.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file audio_ext flux-ytdlp-audext.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: расширение видео',
    summary:
      'Записать расширение видео (поле video_ext) выбранного формата (mp4, webm, none и т. п.) в flux-ytdlp-vidext.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file video_ext flux-ytdlp-vidext.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на плеер',
    summary:
      'Записать (поле player_url) (ссылка на встраиваемый плеер, embed, если модуль извлечения отдаёт) в flux-ytdlp-playerurl.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file player_url flux-ytdlp-playerurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· параллельно 4 фрагмента -F',
    summary:
      'Список форматов с параллельной подкачкой фрагментов DASH и HLS (--concurrent-fragments 4 -F); допишите ссылку.',
    fullLine: 'yt-dlp --concurrent-fragments 4 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео re (Реюньон) -F',
    summary: 'Гео-обход через Реюньон (--geo-bypass-country RE -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country RE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mu (Маврикий) -F',
    summary: 'Гео-обход через Маврикий (--geo-bypass-country MU -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sc (Сейшелы) -F',
    summary: 'Гео-обход через Сейшелы (--geo-bypass-country SC -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tt (Тринидад и Тобаго) -F',
    summary: 'Гео-обход через Тринидад и Тобаго (--geo-bypass-country TT -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: каналы аудио',
    summary:
      'Записать число каналов аудио (поле audio_channels) в flux-ytdlp-achs.txt без скачивания (--print-to-file audio_channels …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file audio_channels flux-ytdlp-achs.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: глава',
    summary:
      'Записать (поле chapter) (название текущей главы) в flux-ytdlp-chapter.txt без скачивания (--print-to-file chapter …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file chapter flux-ytdlp-chapter.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id главы',
    summary:
      'Записать идентификатор главы (поле chapter_id) в flux-ytdlp-chapid.txt без скачивания (--print-to-file chapter_id …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file chapter_id flux-ytdlp-chapid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: номер главы',
    summary:
      'Записать номер главы (поле chapter_number) в flux-ytdlp-chapnum.txt без скачивания (--print-to-file chapter_number …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file chapter_number flux-ytdlp-chapnum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: время начала',
    summary:
      'Записать (поле start_time) (секунды начала фрагмента) в flux-ytdlp-stt.txt без скачивания (--print-to-file start_time …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file start_time flux-ytdlp-stt.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: время конца',
    summary:
      'Записать (поле end_time) (секунды окончания фрагмента) в flux-ytdlp-end.txt без скачивания (--print-to-file end_time …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file end_time flux-ytdlp-end.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: качество',
    summary:
      'Записать (поле quality) (оценка формата yt-dlp) в flux-ytdlp-quality.txt без скачивания (--print-to-file quality …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file quality flux-ytdlp-quality.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: таблица форматов',
    summary:
      'Записать (поле formats_table) (то, что показывает -F) в flux-ytdlp-ftbl.txt без скачивания (--print-to-file formats_table …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file formats_table flux-ytdlp-ftbl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео af (Афганистан) -F',
    summary: 'Гео-обход через Афганистан (--geo-bypass-country AF -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ao (Ангола) -F',
    summary: 'Гео-обход через Анголу (--geo-bypass-country AO -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео hk (Гонконг) -F',
    summary: 'Гео-обход через Гонконг (--geo-bypass-country HK -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country HK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео il (Израиль) -F',
    summary: 'Гео-обход через Израиль (--geo-bypass-country IL -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country IL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео kw (Кувейт) -F',
    summary: 'Гео-обход через Кувейт (--geo-bypass-country KW -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country KW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· чистый .info.json + -F',
    summary:
      'Чистить .info.json от приватных ссылок и токенов перед записью (--clean-info-json -F); допишите ссылку.',
    fullLine: 'yt-dlp --clean-info-json -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: строка формата',
    summary:
      'Записать человекочитаемую строку выбранного формата (поле format) в flux-ytdlp-fmtline.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file format flux-ytdlp-fmtline.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: предпочтение языка',
    summary:
      'Записать (поле language_preference) (предпочтение языка субтитров и аудио, если модуль извлечения отдаёт) в flux-ytdlp-langpref.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file language_preference flux-ytdlp-langpref.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: автонумерация',
    summary:
      'Записать (поле autonumber) (порядковый номер в плейлисте для шаблона -o) в flux-ytdlp-anum.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file autonumber flux-ytdlp-anum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео om (Оман) -F',
    summary: 'Гео-обход через Оман (--geo-bypass-country OM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country OM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео qa (Катар) -F',
    summary: 'Гео-обход через Катар (--geo-bypass-country QA -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country QA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bh (Бахрейн) -F',
    summary: 'Гео-обход через Бахрейн (--geo-bypass-country BH -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ae (ОАЭ) -F',
    summary: 'Гео-обход через ОАЭ (--geo-bypass-country AE -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sa (Саудовская Аравия) -F',
    summary: 'Гео-обход через Саудовскую Аравию (--geo-bypass-country SA -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: безопасное имя файла',
    summary:
      'Записать (поле filename_sanitized) (имя файла по шаблону -o после санитизации) в flux-ytdlp-fnsan.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file filename_sanitized flux-ytdlp-fnsan.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: запрошенные загрузки',
    summary:
      'Записать (поле requested_downloads) (список запланированных загрузок после слияния потоков) в flux-ytdlp-reqdl.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file requested_downloads flux-ytdlp-reqdl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· извлечение: до 5 повторов -F',
    summary:
      'Повторы модуля извлечения вместе со списком форматов (--extractor-retries 5 -F); ошибки страницы и кода 403; допишите ссылку.',
    fullLine: 'yt-dlp --extractor-retries 5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео jo (Иордания) -F',
    summary: 'Гео-обход через Иорданию (--geo-bypass-country JO -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country JO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео lb (Ливан) -F',
    summary: 'Гео-обход через Ливан (--geo-bypass-country LB -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country LB -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео uz (Узбекистан) -F',
    summary: 'Гео-обход через Узбекистан (--geo-bypass-country UZ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country UZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tm (Туркменистан) -F',
    summary: 'Гео-обход через Туркменистан (--geo-bypass-country TM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: дата изменения',
    summary:
      'Записать (поле modified_date) (YYYYMMDD правки метаданных, если модуль извлечения отдаёт) в flux-ytdlp-mdate.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file modified_date flux-ytdlp-mdate.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: заголовок эфира',
    summary:
      'Записать (поле live_title) (заголовок прямой трансляции, если есть) в flux-ytdlp-livetitle.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file live_title flux-ytdlp-livetitle.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· сетевой фрагмент 1 mib -F',
    summary:
      'Меньший HTTP-чанк 1 MiB (--http-chunk-size 1M -F); тонкая подстройка скорости и стабильности сетей доставки (CDN); допишите ссылку.',
    fullLine: 'yt-dlp --http-chunk-size 1M -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cv (Кабо-Верде) -F',
    summary: 'Гео-обход через Кабо-Верде (--geo-bypass-country CV -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gm (Гамбия) -F',
    summary: 'Гео-обход через Гамбию (--geo-bypass-country GM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео km (Коморы) -F',
    summary: 'Гео-обход через Коморы (--geo-bypass-country KM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country KM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: начало секции',
    summary:
      'Записать (поле section_start) (начало клипа по фрагменту в ссылке (#…) или параметру t=, если модуль извлечения отдаёт) в flux-ytdlp-segstart.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file section_start flux-ytdlp-segstart.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: конец секции',
    summary:
      'Записать (поле section_end) (конец клипа по фрагменту в ссылке (#…), если есть) в flux-ytdlp-segend.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file section_end flux-ytdlp-segend.txt --skip-download '
  }
]
