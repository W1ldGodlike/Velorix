import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки вкладки «Загрузки» (часть 10). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_10: TerminalCommandHintEntry[] = [
  {
    tool: 'yt-dlp',
    token: '· в файл: просмотры',
    summary:
      'Записать число просмотров (поле view_count) в flux-ytdlp-views.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file view_count flux-ytdlp-views.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: имя канала',
    summary:
      'Записать имя канала (поле channel) в flux-ytdlp-channel.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file channel flux-ytdlp-channel.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: имя экстрактора',
    summary:
      'Записать имя модуля извлечения (поле extractor) в flux-ytdlp-extractor.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file extractor flux-ytdlp-extractor.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: название плейлиста',
    summary:
      'Записать заголовок плейлиста (поле playlist_title) в flux-ytdlp-pltitle.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist_title flux-ytdlp-pltitle.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: дата загрузки',
    summary:
      'Записать дату публикации YYYYMMDD (поле upload_date) в flux-ytdlp-update.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file upload_date flux-ytdlp-update.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео me',
    summary: 'Гео-обход с кодом страны ME (--geo-bypass-country ME -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country ME -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ps',
    summary: 'Гео-обход с кодом страны PS (--geo-bypass-country PS -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tl',
    summary: 'Гео-обход с кодом страны TL (--geo-bypass-country TL -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· аудио wma',
    summary:
      'Извлечь аудио в WMA (--extract-audio --audio-format wma); допишите ссылку и шаблон -o при необходимости.',
    fullLine: 'yt-dlp --extract-audio --audio-format wma '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист: не стоп при ошибке -F',
    summary:
      'Плейлист: продолжать после ошибки отдельной ссылки (--no-abort-on-error -F); допишите ссылку.',
    fullLine: 'yt-dlp --no-abort-on-error -F '
  },
  {
    tool: 'yt-dlp',
    token: '· имена: не только латиница (ascii) -F',
    summary:
      'Не ограничивать имена файлов ASCII (--no-restrict-filenames -F); кириллица в -o; допишите ссылку.',
    fullLine: 'yt-dlp --no-restrict-filenames -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео pr',
    summary: 'Гео-обход с кодом страны PR (--geo-bypass-country PR -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gu',
    summary: 'Гео-обход с кодом страны GU (--geo-bypass-country GU -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео vi',
    summary: 'Гео-обход с кодом страны VI (--geo-bypass-country VI -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country VI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео as',
    summary: 'Гео-обход с кодом страны AS (--geo-bypass-country AS -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mp',
    summary: 'Гео-обход с кодом страны MP (--geo-bypass-country MP -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MP -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео um',
    summary: 'Гео-обход с кодом страны UM (--geo-bypass-country UM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country UM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: описание',
    summary: 'Записать (поле description) в flux-ytdlp-desc.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file description flux-ytdlp-desc.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: имя файла',
    summary:
      'Записать шаблон filename (поле метаданных) в flux-ytdlp-fn.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file filename flux-ytdlp-fn.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· без приоритета «свободных» кодеков -F',
    summary:
      'Список форматов без приоритета «свободных» кодеков (--no-prefer-free-formats -F); контраст к --prefer-free-formats; допишите ссылку.',
    fullLine: 'yt-dlp --no-prefer-free-formats -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: категории',
    summary:
      'Записать (поле categories) в flux-ytdlp-categories.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file categories flux-ytdlp-categories.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: теги',
    summary: 'Записать (поле tags) в flux-ytdlp-tags.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file tags flux-ytdlp-tags.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: язык',
    summary: 'Записать (поле language) в flux-ytdlp-language.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file language flux-ytdlp-language.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: авто-субтитры',
    summary:
      'Записать авто-субтитры и ASR (поле automatic_captions) в flux-ytdlp-autocap.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file automatic_captions flux-ytdlp-autocap.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: главы',
    summary: 'Записать (поле chapters) в flux-ytdlp-chapters.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file chapters flux-ytdlp-chapters.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: аудиокодек',
    summary:
      'Записать выбранный или лучший аудиокодек (поле acodec) в flux-ytdlp-acodec.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file acodec flux-ytdlp-acodec.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: видеокодек',
    summary:
      'Записать выбранный или лучший видеокодек (поле vcodec) в flux-ytdlp-vcodec.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file vcodec flux-ytdlp-vcodec.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: лайки',
    summary:
      'Записать число лайков (поле like_count) в flux-ytdlp-likes.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file like_count flux-ytdlp-likes.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: длительность, сек',
    summary:
      'Записать (поле duration) (секунды, число) в flux-ytdlp-duration.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file duration flux-ytdlp-duration.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: субтитры',
    summary:
      'Записать (поле subtitles) (словари дорожек) в flux-ytdlp-subs.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file subtitles flux-ytdlp-subs.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id канала',
    summary:
      'Записать идентификатор канала (поле channel_id) в flux-ytdlp-chid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file channel_id flux-ytdlp-chid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id плейлиста',
    summary:
      'Записать идентификатор плейлиста (поле playlist_id) в flux-ytdlp-plid.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist_id flux-ytdlp-plid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: теплокарта',
    summary:
      'Записать тепловую карту просмотров (поле heatmap; если модуль извлечения отдаёт, напр. YouTube) в flux-ytdlp-heatmap.txt; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file heatmap flux-ytdlp-heatmap.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· ленивый плейлист -F',
    summary:
      'Ленивый плейлист вместе с листингом форматов (--lazy-playlist -F); не разворачивает все элементы заранее; допишите ссылку.',
    fullLine: 'yt-dlp --lazy-playlist -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без дозагрузки .part -F',
    summary:
      'Листинг форматов без дозагрузки частичных .part (--no-continue -F); при скачивании начать заново; допишите ссылку.',
    fullLine: 'yt-dlp --no-continue -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без обратного порядка плейлиста -F',
    summary:
      'Не переворачивать порядок элементов плейлиста (--no-playlist-reverse -F); совместимость с плейлистами; допишите ссылку.',
    fullLine: 'yt-dlp --no-playlist-reverse -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: число комментариев',
    summary:
      'Записать число комментариев (поле comment_count) в flux-ytdlp-ccount.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file comment_count flux-ytdlp-ccount.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: последний сегмент пути страницы',
    summary:
      'Записать базовое имя пути страницы (поле webpage_url_basename) в flux-ytdlp-wubase.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file webpage_url_basename flux-ytdlp-wubase.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: короткий id',
    summary:
      'Записать короткий идентификатор для отображения (поле display_id) в flux-ytdlp-dispid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file display_id flux-ytdlp-dispid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на превью',
    summary:
      'Записать ссылку на обложку (поле thumbnail) в flux-ytdlp-thumburl.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file thumbnail flux-ytdlp-thumburl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: время релиза (unix)',
    summary:
      'Записать (поле release_timestamp) (UNIX, если модуль извлечения отдаёт) в flux-ytdlp-reltsepoch.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file release_timestamp flux-ytdlp-reltsepoch.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: путь вывода (-o)',
    summary:
      'Записать (поле filepath) (после -o) в flux-ytdlp-fpath.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file filepath flux-ytdlp-fpath.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: разрешение',
    summary:
      'Записать (поле resolution) (строка разрешения) в flux-ytdlp-res.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file resolution flux-ytdlp-res.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id формата',
    summary:
      'Записать идентификатор выбранного формата (поле format_id) в flux-ytdlp-fmtid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file format_id flux-ytdlp-fmtid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: расширение',
    summary:
      'Записать (поле ext) (расширение выбранного формата) в flux-ytdlp-ext.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file ext flux-ytdlp-ext.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bm (Бермуды) -F',
    summary: 'Гео-обход через Бермуды (--geo-bypass-country BM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ky (Каймановы о-ва) -F',
    summary: 'Гео-обход через Каймановы острова (--geo-bypass-country KY -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country KY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео jm (Ямайка) -F',
    summary: 'Гео-обход через Ямайку (--geo-bypass-country JM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country JM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bb (Барбадос) -F',
    summary: 'Гео-обход через Барбадос (--geo-bypass-country BB -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BB -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bs (Багамы) -F',
    summary: 'Гео-обход через Багамы (--geo-bypass-country BS -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ширина',
    summary:
      'Записать ширину выбранного формата (поле width) в flux-ytdlp-width.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file width flux-ytdlp-width.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: высота',
    summary:
      'Записать высоту выбранного формата (поле height) в flux-ytdlp-height.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file height flux-ytdlp-height.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: частота кадров (fps)',
    summary:
      'Записать частоту кадров (поле fps) выбранного формата в flux-ytdlp-fps.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file fps flux-ytdlp-fps.txt --skip-download '
  }
]
