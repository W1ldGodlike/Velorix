import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки вкладки «Загрузки» (часть 08). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_08: TerminalCommandHintEntry[] = [
  {
    tool: 'yt-dlp',
    token: '· аудио m4a',
    summary:
      'Извлечь аудио в M4A или AAC (--extract-audio --audio-format m4a); допишите ссылку и ключи вывода.',
    fullLine: 'yt-dlp --extract-audio --audio-format m4a '
  },
  {
    tool: 'yt-dlp',
    token: '· без «просмотрено» -F',
    summary:
      'Не отмечать видео просмотренным на платформе (--no-mark-watched -F); допишите ссылку.',
    fullLine: 'yt-dlp --no-mark-watched -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без комментариев в json -F',
    summary: 'Не сохранять JSON комментариев (--no-write-comments -F); допишите ссылку.',
    fullLine: 'yt-dlp --no-write-comments -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без .description -F',
    summary:
      'Не сохранять .description рядом с файлом (--no-write-description -F); допишите ссылку.',
    fullLine: 'yt-dlp --no-write-description -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео my (Малайзия) -F',
    summary: 'Гео-обход с кодом страны MY (--geo-bypass-country MY -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sg (Сингапур) -F',
    summary: 'Гео-обход с кодом страны SG (--geo-bypass-country SG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео th (Таиланд) -F',
    summary: 'Гео-обход с кодом страны TH (--geo-bypass-country TH -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео vn (Вьетнам) -F',
    summary: 'Гео-обход с кодом страны VN (--geo-bypass-country VN -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country VN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ar (Аргентина) -F',
    summary: 'Гео-обход с кодом страны AR (--geo-bypass-country AR -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ua (Украина) -F',
    summary: 'Гео-обход с кодом страны UA (--geo-bypass-country UA -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country UA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ph (Филиппины) -F',
    summary: 'Гео-обход с кодом страны PH (--geo-bypass-country PH -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео id (Индонезия) -F',
    summary: 'Гео-обход с кодом страны ID (--geo-bypass-country ID -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country ID -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео pk (Пакистан) -F',
    summary: 'Гео-обход с кодом страны PK (--geo-bypass-country PK -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bd (Бангладеш) -F',
    summary: 'Гео-обход с кодом страны BD (--geo-bypass-country BD -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео eg (Египет) -F',
    summary: 'Гео-обход с кодом страны EG (--geo-bypass-country EG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country EG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cl (Чили) -F',
    summary: 'Гео-обход с кодом страны CL (--geo-bypass-country CL -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео pe (Перу) -F',
    summary: 'Гео-обход с кодом страны PE (--geo-bypass-country PE -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ke (Кения) -F',
    summary: 'Гео-обход с кодом страны KE (--geo-bypass-country KE -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country KE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео co (Колумбия) -F',
    summary: 'Гео-обход с кодом страны CO (--geo-bypass-country CO -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ng (Нигерия) -F',
    summary: 'Гео-обход с кодом страны NG (--geo-bypass-country NG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country NG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· экстрактор generic: не плейлист -F',
    summary:
      'Общий модуль (generic): не разворачивать плейлист (--extractor-args generic:noplaylist -F); допишите ссылку.',
    fullLine: 'yt-dlp --extractor-args generic:noplaylist -F '
  },
  {
    tool: 'yt-dlp',
    token: '· до 10 ош. плейлиста -F',
    summary:
      'Пропустить до 10 ошибок подряд в плейлисте (--skip-playlist-after-errors 10 -F); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --skip-playlist-after-errors 10 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· повторы запроса 15 -F',
    summary:
      'Больше повторов HTTP (--retries 15 -F); нестабильные сети доставки (CDN); допишите ссылку.',
    fullLine: 'yt-dlp --retries 15 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· повторы фрагментов 15 -F',
    summary:
      'Повторы для обрывов фрагментов HLS и DASH (--fragment-retries 15 -F); допишите ссылку.',
    fullLine: 'yt-dlp --fragment-retries 15 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· обход двунаправл. текста -F',
    summary:
      'Обход багов RTL и двунаправленного текста (BiDi) в именах файлов и метаданных (--bidi-workaround -F); допишите ссылку.',
    fullLine: 'yt-dlp --bidi-workaround -F '
  },
  {
    tool: 'yt-dlp',
    token: '· даты: широкий диапазон -F',
    summary:
      'Ограничить по дате загрузки и релиза (--daterange 20000101-20991231 -F); подстройте диапазон; допишите ссылку.',
    fullLine: 'yt-dlp --daterange 20000101-20991231 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист с 2-го -F',
    summary:
      'Плейлист начиная со 2-го элемента (--playlist-start 2 -F); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --playlist-start 2 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sk (Словакия) -F',
    summary: 'Гео-обход с кодом страны SK (--geo-bypass-country SK -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео si (Словения) -F',
    summary: 'Гео-обход с кодом страны SI (--geo-bypass-country SI -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео lu (Люксембург) -F',
    summary: 'Гео-обход с кодом страны LU (--geo-bypass-country LU -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country LU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mt (Мальта) -F',
    summary: 'Гео-обход с кодом страны MT (--geo-bypass-country MT -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cy (Кипр) -F',
    summary: 'Гео-обход с кодом страны CY (--geo-bypass-country CY -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ba (Босния и Герцеговина) -F',
    summary: 'Гео-обход с кодом страны BA (--geo-bypass-country BA -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео rs (Сербия) -F',
    summary: 'Гео-обход с кодом страны RS (--geo-bypass-country RS -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country RS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mn (Монголия) -F',
    summary: 'Гео-обход с кодом страны MN (--geo-bypass-country MN -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео kz (Казахстан) -F',
    summary: 'Гео-обход с кодом страны KZ (--geo-bypass-country KZ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country KZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ge (Грузия) -F',
    summary: 'Гео-обход с кодом страны GE (--geo-bypass-country GE -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео am (Армения) -F',
    summary: 'Гео-обход с кодом страны AM (--geo-bypass-country AM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео az (Азербайджан) -F',
    summary: 'Гео-обход с кодом страны AZ (--geo-bypass-country AZ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео iq (Ирак) -F',
    summary: 'Гео-обход с кодом страны IQ (--geo-bypass-country IQ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country IQ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео lk (Шри-Ланка) -F',
    summary: 'Гео-обход с кодом страны LK (--geo-bypass-country LK -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country LK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tn (Тунис) -F',
    summary: 'Гео-обход с кодом страны TN (--geo-bypass-country TN -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ma (Марокко) -F',
    summary: 'Гео-обход с кодом страны MA (--geo-bypass-country MA -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео dz (Алжир) -F',
    summary: 'Гео-обход с кодом страны DZ (--geo-bypass-country DZ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country DZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gh (Гана) -F',
    summary: 'Гео-обход с кодом страны GH (--geo-bypass-country GH -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео et (Эфиопия) -F',
    summary: 'Гео-обход с кодом страны ET (--geo-bypass-country ET -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country ET -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео uy (Уругвай) -F',
    summary: 'Гео-обход с кодом страны UY (--geo-bypass-country UY -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country UY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bo (Боливия) -F',
    summary: 'Гео-обход с кодом страны BO (--geo-bypass-country BO -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cr (Коста-Рика) -F',
    summary: 'Гео-обход с кодом страны CR (--geo-bypass-country CR -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео pa (Панама) -F',
    summary: 'Гео-обход с кодом страны PA (--geo-bypass-country PA -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· загрузчик ffmpeg -F',
    summary:
      'Явно качать через встроенный загрузчик на базе FFmpeg (--downloader ffmpeg -F); потоки HLS и DASH; допишите ссылку.',
    fullLine: 'yt-dlp --downloader ffmpeg -F '
  },
  {
    tool: 'yt-dlp',
    token: '· загрузчик aria2 -F',
    summary:
      'Внешний aria2c как загрузчик (--downloader aria2c -F; aria2c должен быть в каталогах из PATH); допишите ссылку.',
    fullLine: 'yt-dlp --downloader aria2c -F '
  },
  {
    tool: 'yt-dlp',
    token: '· не ждать эфир -F',
    summary:
      'Не ждать появления трансляции (--no-wait-for-video -F); быстрый -F для стримов; допишите ссылку.',
    fullLine: 'yt-dlp --no-wait-for-video -F '
  }
]
