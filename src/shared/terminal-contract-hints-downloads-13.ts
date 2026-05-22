import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки Загрузки (часть 13/14; §8 audit prune). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_13: TerminalCommandHintEntry[] = [
  {
    tool: 'yt-dlp',
    token: '· в файл: схема ссылки страницы',
    summary:
      'Записать (поле webpage_url_scheme) (http и https страницы) в velorix-ytdlp-wuscheme.txt без скачивания; допишите ссылку.',
    fullLine:
      'yt-dlp --print-to-file webpage_url_scheme velorix-ytdlp-wuscheme.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: плейлист',
    summary:
      'Записать (поле playlist) (имя элемента плейлиста, если модуль извлечения отдаёт) в velorix-ytdlp-playlist.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist velorix-ytdlp-playlist.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: аннотации',
    summary:
      'Записать (поле annotations) (если модуль извлечения отдаёт) в velorix-ytdlp-annotations.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file annotations velorix-ytdlp-annotations.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: раскадровки',
    summary:
      'Записать (поле storyboards) (доски превью, если модуль извлечения отдаёт) в velorix-ytdlp-storyboards.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file storyboards velorix-ytdlp-storyboards.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на страницу плейлиста',
    summary:
      'Записать ссылку на страницу плейлиста (поле playlist_webpage_url) в velorix-ytdlp-plwpurl.txt без скачивания; допишите ссылку на плейлист.',
    fullLine:
      'yt-dlp --print-to-file playlist_webpage_url velorix-ytdlp-plwpurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: метка времени',
    summary:
      'Записать (поле timestamp) (Unix-время публикации, если модуль извлечения отдаёт) в velorix-ytdlp-ts.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file timestamp velorix-ytdlp-ts.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ключ экстрактора',
    summary:
      'Записать (поле extractor_key) (внутренний ключ модуля извлечения) в velorix-ytdlp-extkey.txt без скачивания; полезно для диагностики; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file extractor_key velorix-ytdlp-extkey.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id трека',
    summary:
      'Записать (поле track_id) (идентификатор трека у модуля извлечения, если отдаёт) в velorix-ytdlp-trackid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file track_id velorix-ytdlp-trackid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id альбома',
    summary:
      'Записать (поле album_id) (идентификатор альбома, если модуль извлечения отдаёт) в velorix-ytdlp-albumid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file album_id velorix-ytdlp-albumid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: динамический диапазон',
    summary:
      'Записать динамический диапазон (поле dynamic_range: SDR, HDR, Dolby Vision — если модуль извлечения отдаёт) в velorix-ytdlp-dynrange.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file dynamic_range velorix-ytdlp-dynrange.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: расширение аудио',
    summary:
      'Записать расширение аудио (поле audio_ext) выбранного формата (m4a, webm, opus и т. п.) в velorix-ytdlp-audext.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file audio_ext velorix-ytdlp-audext.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: расширение видео',
    summary:
      'Записать расширение видео (поле video_ext) выбранного формата (mp4, webm, none и т. п.) в velorix-ytdlp-vidext.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file video_ext velorix-ytdlp-vidext.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на плеер',
    summary:
      'Записать (поле player_url) (ссылка на встраиваемый плеер, embed, если модуль извлечения отдаёт) в velorix-ytdlp-playerurl.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file player_url velorix-ytdlp-playerurl.txt --skip-download '
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
      'Записать число каналов аудио (поле audio_channels) в velorix-ytdlp-achs.txt без скачивания (--print-to-file audio_channels …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file audio_channels velorix-ytdlp-achs.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: глава',
    summary:
      'Записать (поле chapter) (название текущей главы) в velorix-ytdlp-chapter.txt без скачивания (--print-to-file chapter …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file chapter velorix-ytdlp-chapter.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id главы',
    summary:
      'Записать идентификатор главы (поле chapter_id) в velorix-ytdlp-chapid.txt без скачивания (--print-to-file chapter_id …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file chapter_id velorix-ytdlp-chapid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: номер главы',
    summary:
      'Записать номер главы (поле chapter_number) в velorix-ytdlp-chapnum.txt без скачивания (--print-to-file chapter_number …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file chapter_number velorix-ytdlp-chapnum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: время начала',
    summary:
      'Записать (поле start_time) (секунды начала фрагмента) в velorix-ytdlp-stt.txt без скачивания (--print-to-file start_time …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file start_time velorix-ytdlp-stt.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: время конца',
    summary:
      'Записать (поле end_time) (секунды окончания фрагмента) в velorix-ytdlp-end.txt без скачивания (--print-to-file end_time …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file end_time velorix-ytdlp-end.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: качество',
    summary:
      'Записать (поле quality) (оценка формата yt-dlp) в velorix-ytdlp-quality.txt без скачивания (--print-to-file quality …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file quality velorix-ytdlp-quality.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: таблица форматов',
    summary:
      'Записать (поле formats_table) (то, что показывает -F) в velorix-ytdlp-ftbl.txt без скачивания (--print-to-file formats_table …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file formats_table velorix-ytdlp-ftbl.txt --skip-download '
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
      'Записать человекочитаемую строку выбранного формата (поле format) в velorix-ytdlp-fmtline.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file format velorix-ytdlp-fmtline.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: предпочтение языка',
    summary:
      'Записать (поле language_preference) (предпочтение языка субтитров и аудио, если модуль извлечения отдаёт) в velorix-ytdlp-langpref.txt без скачивания; допишите ссылку.',
    fullLine:
      'yt-dlp --print-to-file language_preference velorix-ytdlp-langpref.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: автонумерация',
    summary:
      'Записать (поле autonumber) (порядковый номер в плейлисте для шаблона -o) в velorix-ytdlp-anum.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file autonumber velorix-ytdlp-anum.txt --skip-download '
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
      'Записать (поле filename_sanitized) (имя файла по шаблону -o после санитизации) в velorix-ytdlp-fnsan.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file filename_sanitized velorix-ytdlp-fnsan.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: запрошенные загрузки',
    summary:
      'Записать (поле requested_downloads) (список запланированных загрузок после слияния потоков) в velorix-ytdlp-reqdl.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file requested_downloads velorix-ytdlp-reqdl.txt --skip-download '
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
      'Записать (поле modified_date) (YYYYMMDD правки метаданных, если модуль извлечения отдаёт) в velorix-ytdlp-mdate.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file modified_date velorix-ytdlp-mdate.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: заголовок эфира',
    summary:
      'Записать (поле live_title) (заголовок прямой трансляции, если есть) в velorix-ytdlp-livetitle.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file live_title velorix-ytdlp-livetitle.txt --skip-download '
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
      'Записать (поле section_start) (начало клипа по фрагменту в ссылке (#…) или параметру t=, если модуль извлечения отдаёт) в velorix-ytdlp-segstart.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file section_start velorix-ytdlp-segstart.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: конец секции',
    summary:
      'Записать (поле section_end) (конец клипа по фрагменту в ссылке (#…), если есть) в velorix-ytdlp-segend.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file section_end velorix-ytdlp-segend.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: число просмотров',
    summary:
      'Записать (поле played_count) (оценка числа воспроизведений, если сайт отдаёт) в velorix-ytdlp-playcnt.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file played_count velorix-ytdlp-playcnt.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: заголовок referer',
    summary:
      'Записать (поле referrer) (HTTP Referer страницы, если есть) в velorix-ytdlp-refurl.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file referrer velorix-ytdlp-refurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист наоборот -F',
    summary:
      'Плейлист в обратном порядке вместе со списком форматов (--playlist-reverse -F); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --playlist-reverse -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео yt (Майотта) -F',
    summary: 'Гео-обход через Майотту (--geo-bypass-country YT -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country YT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mg (Мадагаскар) -F',
    summary: 'Гео-обход через Мадагаскар (--geo-bypass-country MG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео pg (Папуа — Новая Гвинея) -F',
    summary: 'Гео-обход через Папуа — Новую Гвинею (--geo-bypass-country PG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PG -F '
  }
]
