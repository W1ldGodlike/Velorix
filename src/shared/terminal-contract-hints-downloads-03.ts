import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки вкладки «Загрузки» (часть 03). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_03: TerminalCommandHintEntry[] = [
  {
    tool: 'yt-dlp',
    token: '· hls: встроенный загрузчик -F',
    summary:
      'HLS: встроенный загрузчик вместо утилиты FFmpeg, где возможно (--hls-prefer-native -F); допишите ссылку.',
    fullLine: 'yt-dlp --hls-prefer-native -F '
  },
  {
    tool: 'yt-dlp',
    token: '· стрим с начала буфера',
    summary:
      'Прямой эфир: начать с начала буфера (--live-from-start); допишите ссылку на трансляцию и прочие ключи.',
    fullLine: 'yt-dlp --live-from-start '
  },
  {
    tool: 'yt-dlp',
    token: '· пауза между запросами 1 с',
    summary:
      'Пауза 1 с между HTTP-запросами (--sleep-requests 1); снижает риск ответа 429 и блокировок; допишите ссылку.',
    fullLine: 'yt-dlp --sleep-requests 1 '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист до 10-го -J',
    summary:
      'Первые 10 элементов плейлиста в JSON (--playlist-end 10 -J); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --playlist-end 10 -J '
  },
  {
    tool: 'yt-dlp',
    token: '· гео us (США) -F',
    summary:
      'Обход гео через страну-подсказку (--geo-bypass-country US -F); при необходимости замените ISO-код; допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country US -F '
  },
  {
    tool: 'yt-dlp',
    token: '· повторы извлечения 5',
    summary:
      'Повторы на этапе модуля извлечения (extractor) против кода 403 и таймаутов страницы (--extractor-retries 5); допишите ссылку и остальные ключи.',
    fullLine: 'yt-dlp --extractor-retries 5 '
  },
  {
    tool: 'yt-dlp',
    token: '· размер сетевого фрагмента 10m',
    summary:
      'Размер HTTP-чанка 10 MiB (--http-chunk-size 10M); иногда стабилизирует медленные сети доставки (CDN); допишите ссылку.',
    fullLine: 'yt-dlp --http-chunk-size 10M '
  },
  {
    tool: 'yt-dlp',
    token: '· без перезаписи -F',
    summary: 'Не перезаписывать уже скачанные файлы (--no-overwrites -F); допишите ссылку.',
    fullLine: 'yt-dlp --no-overwrites -F '
  },
  {
    tool: 'yt-dlp',
    token: '· имена под windows -F',
    summary:
      'Имена файлов без зарезервированных символов Windows (--windows-filenames -F); допишите ссылку и -o при необходимости.',
    fullLine: 'yt-dlp --windows-filenames -F '
  },
  {
    tool: 'yt-dlp',
    token: '· перевод строки в журнале -F',
    summary:
      'Прогресс с переводом строки (--newline -F); удобнее разбирать вывод и перенаправлять его в другие программы; допишите ссылку.',
    fullLine: 'yt-dlp --newline -F '
  },
  {
    tool: 'yt-dlp',
    token: '· пропуск недоступных фрагментов',
    summary:
      'Потоки DASH и HLS: пропускать недоступные фрагменты вместо аварийной остановки (--skip-unavailable-fragments); допишите ссылку.',
    fullLine: 'yt-dlp --skip-unavailable-fragments '
  },
  {
    tool: 'yt-dlp',
    token: '· журнал скачанных (archive.txt)',
    summary:
      'Журнал скачанных идентификаторов (id) в archive.txt (--download-archive archive.txt); поменяйте имя файла под свою папку; допишите ссылку.',
    fullLine: 'yt-dlp --download-archive archive.txt '
  },
  {
    tool: 'yt-dlp',
    token: '· стоп при отказе формата -F',
    summary:
      'Остановиться при отклонённом формате (--break-on-reject -F); диагностика -f; допишите ссылку.',
    fullLine: 'yt-dlp --break-on-reject -F '
  },
  {
    tool: 'yt-dlp',
    token: '· обрезка имён 80 -F',
    summary:
      'Обрезка длины имён файлов (--trim-file-names 80 -F); длинные заголовки; допишите ссылку.',
    fullLine: 'yt-dlp --trim-file-names 80 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без времени файла',
    summary:
      'Не выставлять время файла из метаданных ролика (--no-mtime); допишите ссылку и остальные ключи.',
    fullLine: 'yt-dlp --no-mtime '
  },
  {
    tool: 'yt-dlp',
    token: '· докачка',
    summary:
      'Докачка частично скачанного (.part) при повторном запуске (--continue); допишите ссылку и -o.',
    fullLine: 'yt-dlp --continue '
  },
  {
    tool: 'yt-dlp',
    token: '· стоп при первой ошибке',
    summary:
      'Остановить весь запуск при первой неустранимой ошибке (--abort-on-error); допишите ссылку и плейлист при необходимости.',
    fullLine: 'yt-dlp --abort-on-error '
  },
  {
    tool: 'yt-dlp',
    token: '· фрагмент плейлиста -J',
    summary:
      'Фрагмент плейлиста в JSON (элементы 5–15, ключи --playlist-start и --playlist-end с -J); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --playlist-start 5 --playlist-end 15 -J '
  },
  {
    tool: 'yt-dlp',
    token: '· макс. размер -F',
    summary:
      'Показать только форматы до ~512 MiB (--max-filesize 512M -F); подстройте лимит; допишите ссылку.',
    fullLine: 'yt-dlp --max-filesize 512M -F '
  },
  {
    tool: 'yt-dlp',
    token: '· ограничить символы в именах -F',
    summary:
      'Только ASCII в именах файлов (--restrict-filenames -F); допишите ссылку и -o при необходимости.',
    fullLine: 'yt-dlp --restrict-filenames -F '
  },
  {
    tool: 'yt-dlp',
    token: '· консоль без цветного вывода -F',
    summary:
      'Без цветов ANSI в выводе (--color never -F); проще читать вывод и перенаправлять его; допишите ссылку.',
    fullLine: 'yt-dlp --color never -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вшить метаданные',
    summary:
      'Вшить метаданные в контейнер после скачивания (--embed-metadata); допишите ссылку и -f/-o.',
    fullLine: 'yt-dlp --embed-metadata '
  },
  {
    tool: 'yt-dlp',
    token: '· вшить обложку',
    summary: 'Вшить обложку в файл после скачивания (--embed-thumbnail); допишите ссылку и формат.',
    fullLine: 'yt-dlp --embed-thumbnail '
  },
  {
    tool: 'yt-dlp',
    token: '· ждать появления трансляции',
    summary:
      'Ждать появления трансляции до N минут (--wait-for-video 10); допишите ссылку на стрим.',
    fullLine: 'yt-dlp --wait-for-video 10 '
  },
  {
    tool: 'yt-dlp',
    token: '· пропуск ошибок плейлиста',
    summary:
      'Пропустить до N ошибок подряд в плейлисте (--skip-playlist-after-errors 5); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --skip-playlist-after-errors 5 '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: заголовок или н/д (title)',
    summary:
      'Печать title с заменителем для пустых полей (--output-na-placeholder NA --skip-download --print title); в консоли будет NA, если поле пустое; допишите ссылку.',
    fullLine: 'yt-dlp --output-na-placeholder NA --skip-download --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок referer для youtube -F',
    summary:
      'Заголовок Referer для HTTP: обход ограничений хотлинка и CDN (--referer https://www.youtube.com/ -F); замените домен под сайт; допишите ссылку.',
    fullLine: 'yt-dlp --referer https://www.youtube.com/ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок accept-language -F',
    summary:
      'Произвольный заголовок без пробелов в значении (--add-header Accept-Language:en-US -F); при сложных значениях соберите список аргументов (как в argv (поэлементно, без кавычек в значениях)) вручную; допишите ссылку.',
    fullLine: 'yt-dlp --add-header Accept-Language:en-US -F '
  },
  {
    tool: 'yt-dlp',
    token: '· прокси 127.0.0.1 -F',
    summary:
      'HTTP(S)-прокси (--proxy http://127.0.0.1:8080 -F); замените хост и порт; допишите ссылку.',
    fullLine: 'yt-dlp --proxy http://127.0.0.1:8080 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· tls как у chrome -F',
    summary:
      'TLS и HTTP: отпечаток как у Chrome (--impersonate chrome -F); помогает обходить антибот-защиту; допишите ссылку.',
    fullLine: 'yt-dlp --impersonate chrome -F '
  },
  {
    tool: 'yt-dlp',
    token: '· фильтр по длительности -F',
    summary:
      'Отбор по длительности без пробелов в выражении (--match-filter duration<600 -F); подстройте порог; допишите ссылку.',
    fullLine: 'yt-dlp --match-filter duration<600 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· пакет из txt со ссылками',
    summary:
      'Пакет из файла со списком ссылок (--batch-file urls.txt); создайте urls.txt рядом с текущей папкой (cwd) или укажите полный путь без пробелов.',
    fullLine: 'yt-dlp --batch-file urls.txt '
  },
  {
    tool: 'yt-dlp',
    token: '· только метаданные (.info.json)',
    summary:
      'Повторная обработка из сохранённого JSON (--load-info-json video.info.json); путь без пробелов; допишите -f/-o при необходимости.',
    fullLine: 'yt-dlp --load-info-json video.info.json '
  },
  {
    tool: 'yt-dlp',
    token: '· явно весь плейлист -J',
    summary:
      'Явно скачать или разобрать весь плейлист (--yes-playlist -J); когда по ссылке выглядит как один ролик, но это плейлист; допишите ссылку.',
    fullLine: 'yt-dlp --yes-playlist -J '
  },
  {
    tool: 'yt-dlp',
    token: '· без конфигов -F',
    summary:
      'Игнорировать пользовательские конфиги yt-dlp (--no-config -F); воспроизводимая диагностика; допишите ссылку.',
    fullLine: 'yt-dlp --no-config -F '
  },
  {
    tool: 'yt-dlp',
    token: '· cookie из файла -F',
    summary:
      'Файл cookie в классическом текстовом формате (совместим с Netscape, cookies.txt) (--cookies cookies.txt -F); путь без пробелов; допишите ссылку.',
    fullLine: 'yt-dlp --cookies cookies.txt -F '
  },
  {
    tool: 'yt-dlp',
    token: '· пауза между скачиваниями',
    summary:
      'Пауза между запросами в секундах (--sleep-interval 2); снижает нагрузку на сайт; допишите ссылку.',
    fullLine: 'yt-dlp --sleep-interval 2 '
  },
  {
    tool: 'yt-dlp',
    token: '· возрастной лимит -F',
    summary:
      'Пропуск контента старше возрастного рейтинга (--age-limit 18 -F); подстройте порог; допишите ссылку.',
    fullLine: 'yt-dlp --age-limit 18 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· ленивый плейлист -J',
    summary:
      'Плейлист без глубокого извлечения до скачивания (--lazy-playlist -J); быстрее на длинных списках; допишите ссылку.',
    fullLine: 'yt-dlp --lazy-playlist -J '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: номер сезона (season_number)',
    summary:
      'Номер сезона из метаданных без скачивания (--skip-download --print season_number); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print season_number '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: номер эпизода (episode_number)',
    summary:
      'Номер эпизода без скачивания (--skip-download --print episode_number); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print episode_number '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: название трека (track)',
    summary:
      'Название трека (аудио) без скачивания (--skip-download --print track); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print track '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: исполнители (artists)',
    summary: 'Исполнители без скачивания (--skip-download --print artists); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print artists '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: альбом (album)',
    summary: 'Альбом без скачивания (--skip-download --print album); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print album '
  },
  {
    tool: 'yt-dlp',
    token: '· ремукс в mkv',
    summary:
      'После скачивания принудительная перепаковка в MKV (--remux-video mkv); допишите ссылку и -f/-o.',
    fullLine: 'yt-dlp --remux-video mkv '
  },
  {
    tool: 'yt-dlp',
    token: '· субтитры в srt -F',
    summary:
      'Предпочесть субтитры в SRT при выборе форматов (--sub-format srt -F); допишите ссылку.',
    fullLine: 'yt-dlp --sub-format srt -F '
  },
  {
    tool: 'yt-dlp',
    token: '· превью jpg',
    summary:
      'Конвертировать обложку в JPEG при скачивании (--convert-thumbnails jpg); допишите ссылку и ключи вывода.',
    fullLine: 'yt-dlp --convert-thumbnails jpg '
  },
  {
    tool: 'yt-dlp',
    token: '· принудительно ipv6 -F',
    summary:
      'Список форматов через IPv6 (--force-ipv6 -F); обход части проблем IPv4 и NAT; допишите ссылку.',
    fullLine: 'yt-dlp --force-ipv6 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· не раньше даты -F',
    summary:
      'Только записи после YYYYMMDD (--dateafter 20240101 -F); фильтр плейлиста; допишите ссылку.',
    fullLine: 'yt-dlp --dateafter 20240101 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· лимит числа скачиваний',
    summary:
      'Лимит скачиваний за прогон (--max-downloads 5); удобно для частичных плейлистов; допишите ссылку.',
    fullLine: 'yt-dlp --max-downloads 5 '
  },
  {
    tool: 'yt-dlp',
    token: '· фильтр по заголовку -F',
    summary:
      'Фильтр элементов плейлиста по подстроке заголовка (--match-title trailer -F); регистр по yt-dlp; допишите ссылку.',
    fullLine: 'yt-dlp --match-title trailer -F '
  },
  {
    tool: 'yt-dlp',
    token: '· ярлык .url',
    summary:
      'Записать ярлык .url рядом с медиа без скачивания (--write-link --skip-download); допишите ссылку.',
    fullLine: 'yt-dlp --write-link --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· главы sponsorblock',
    summary:
      'Сохранить главы сервиса SponsorBlock для всех категорий (--sponsorblock-mark all); допишите ссылку.',
    fullLine: 'yt-dlp --sponsorblock-mark all '
  }
]
