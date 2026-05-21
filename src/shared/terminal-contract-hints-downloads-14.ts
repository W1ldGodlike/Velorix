import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки Загрузки (часть 14/14; §8 audit prune). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_14: TerminalCommandHintEntry[] = [
  {
    tool: 'yt-dlp',
    token: '· в файл: ключ экстрактора',
    summary:
      'Записать (поле extractor_key) (внутренний ключ модуля извлечения yt-dlp) в flux-ytdlp-extractor-key.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file extractor_key flux-ytdlp-extractor-key.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на автора',
    summary:
      'Записать (поле uploader_url) (каноническая ссылка на канал или автора, если есть) в flux-ytdlp-uploader-url.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file uploader_url flux-ytdlp-uploader-url.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на превью',
    summary:
      'Записать миниатюру (поле thumbnail; основная ссылка на обложку) в flux-ytdlp-thumb-url.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file thumbnail flux-ytdlp-thumb-url.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ключевые слова',
    summary:
      'Записать (поле keywords) (теги и SEO-ключи, если модуль извлечения отдаёт) в flux-ytdlp-keywords.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file keywords flux-ytdlp-keywords.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на канал плейлиста',
    summary:
      'Записать (поле playlist_channel_url) (каноническая ссылка на вкладку или канал плейлиста, если есть) в flux-ytdlp-plchurl.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file playlist_channel_url flux-ytdlp-plchurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: в главных ролях',
    summary:
      'Записать (поле starring) (верхний актёрский блок, если модуль извлечения отдаёт) в flux-ytdlp-starring.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file starring flux-ytdlp-starring.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: сортировка заголовка',
    summary:
      'Записать (поле title_sort) (сортировочный заголовок каталога, если есть) в flux-ytdlp-titlesort.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file title_sort flux-ytdlp-titlesort.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: сезон (строка)',
    summary:
      'Записать (поле season) (название или метка сезона, если модуль извлечения отдаёт) в flux-ytdlp-season.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file season flux-ytdlp-season.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: номер секции',
    summary:
      'Записать (поле section_number) (номер секции или части релиза, если модуль извлечения отдаёт) в flux-ytdlp-secnum.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file section_number flux-ytdlp-secnum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: код isrc',
    summary:
      'Записать (поле isrc) (код ISRC трека или релиза, если площадка отдаёт) в flux-ytdlp-isrc.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file isrc flux-ytdlp-isrc.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: сортировка трека',
    summary:
      'Записать (поле track_sort) (сортировочный номер или имя трека, если модуль извлечения отдаёт) в flux-ytdlp-tracksort.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file track_sort flux-ytdlp-tracksort.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: альтернативное описание',
    summary:
      'Записать (поле alt_description) (краткое или альтернативное описание, если модуль извлечения отдаёт) в flux-ytdlp-altdesc.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file alt_description flux-ytdlp-altdesc.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: просмотры (доп. файл)',
    summary:
      'Записать (поле view_count) в отдельный flux-ytdlp-viewcount.txt без скачивания (дубль поля для кастомных сценариев рядом с другими txt); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file view_count flux-ytdlp-viewcount.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· обложка png без видео',
    summary:
      'Скачать только обложку и конвертировать в PNG (--write-thumbnail --convert-thumbnails png --skip-download); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --write-thumbnail --convert-thumbnails png '
  },
  {
    tool: 'yt-dlp',
    token: '· id без кэша метаданных',
    summary:
      'Идентификатор ролика без скачивания и без кэша метаданных (--no-cache-dir --skip-download --print id); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --no-cache-dir --print id '
  },
  {
    tool: 'yt-dlp',
    token: '· id без предупреждений',
    summary:
      'Идентификатор ролика без скачивания и без предупреждений в консоли (--no-warnings --skip-download --print id); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --no-warnings --print id '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок тихо (-q)',
    summary:
      'Краткий режим вывода и заголовок без скачивания (-q --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp -q --skip-download --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок с user-agent curl',
    summary:
      'Заголовок без скачивания с user-agent как у curl (--user-agent … --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --user-agent curl/8.5.0 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок с referer example.org',
    summary:
      'Заголовок без скачивания с заголовком Referer на example.org (--referer … --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --referer https://example.org/ --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок с accept-language',
    summary:
      'Заголовок без скачивания с Accept-Language en-US (--add-headers … --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --add-headers Accept-Language:en-US --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист: entries',
    summary:
      'Плоский плейлист: сырое поле entries без глубокого извлечения (--flat-playlist --skip-download --print entries); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --flat-playlist --skip-download --print entries '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист: urls (порядок argv)',
    summary:
      'Плоский плейлист: список ссылок без скачивания (другой порядок флагов: --flat-playlist --skip-download --print urls); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --flat-playlist --skip-download --print urls '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок без проверки TLS',
    summary:
      'Заголовок без скачивания с отключением проверки TLS (--no-check-certificates --skip-download --print title); только для отладки; допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --no-check-certificates --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок prefer-free',
    summary:
      'Заголовок без скачивания с приоритетом свободных кодеков в метаданных (--prefer-free-formats --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --prefer-free-formats --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок merge mkv',
    summary:
      'Заголовок без скачивания с целевым контейнером merge mkv (--merge-output-format mkv --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --merge-output-format mkv --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries=2',
    summary:
      'Заголовок без скачивания с лимитом повторов HTTP (--retries 2 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 2 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 25',
    summary:
      'Заголовок без скачивания с таймаутом сокета 25 с (--socket-timeout 25 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 25 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 500K',
    summary:
      'Заголовок без скачивания с лимитом скорости 500 KiB/s (--limit-rate 500K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 500K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries=1',
    summary:
      'Заголовок без скачивания с лимитом повторов извлечения (--extractor-retries 1 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 1 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries=2',
    summary:
      'Заголовок без скачивания с повторами фрагментов (--fragment-retries 2 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 2 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· info.json и print filename',
    summary:
      'Сухой прогон с записью info.json и выводом имени файла (--write-info-json --skip-download --print filename); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --write-info-json --print filename '
  },
  {
    tool: 'yt-dlp',
    token: '· один элемент плейлиста title',
    summary:
      'Только первый элемент плейлиста: заголовок (--playlist-items 1 --skip-download --print title); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --playlist-items 1 --skip-download --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· channel_url без разворота плейлиста',
    summary:
      'Ссылка на канал без разворота плейлиста (--no-playlist --skip-download --print channel_url); допишите ссылку на ролик.',
    fullLine: 'yt-dlp --no-playlist --skip-download --print channel_url '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 3',
    summary:
      'Заголовок без скачивания с тремя параллельными фрагментами (--concurrent-fragments 3 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 3 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 0.5',
    summary:
      'Заголовок без скачивания с паузой 0,5 с между HTTP-запросами (--sleep-requests 0.5 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 0.5 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass DE',
    summary:
      'Заголовок без скачивания с гео-обходом через регион DE (--geo-bypass-country DE --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country DE --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок impersonate chrome',
    summary:
      'Заголовок без скачивания с TLS-отпечатком Chrome (--impersonate chrome --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --impersonate chrome --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок и html страниц',
    summary:
      'Заголовок без скачивания с сохранением сырых страниц (--write-pages --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --write-pages --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок с ipv4-only',
    summary:
      'Заголовок без скачивания только по IPv4 (-4 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp -4 --skip-download --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок impersonate edge',
    summary:
      'Заголовок без скачивания с TLS-отпечатком Edge (--impersonate edge --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --impersonate edge --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок impersonate firefox',
    summary:
      'Заголовок без скачивания с TLS-отпечатком Firefox (--impersonate firefox --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --impersonate firefox --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· filename без mtime',
    summary:
      'Имя файла без скачивания и без выставления времени из метаданных (--no-mtime --skip-download --print filename); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --no-mtime --print filename '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок windows-filenames',
    summary:
      'Заголовок без скачивания с санитизацией имён под Windows (--windows-filenames --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --windows-filenames --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок xattrs',
    summary:
      'Заголовок без скачивания с записью xattr на выходе (--xattrs --skip-download --print title); на Windows часто no-op; допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --xattrs --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок stdout utf-8',
    summary:
      'Заголовок без скачивания с явной кодировкой вывода UTF-8 (--encoding utf-8 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --encoding utf-8 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 3',
    summary:
      'Заголовок без скачивания с лимитом загрузок за прогон (--max-downloads 3 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 3 --print title '
  }
]
