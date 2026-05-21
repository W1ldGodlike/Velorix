import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки Загрузки (часть 3/14; §8 audit prune). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_03: TerminalCommandHintEntry[] = [
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
  },
  {
    tool: 'yt-dlp',
    token: '· только аудио mp3',
    summary:
      'После скачивания извлечь аудиодорожку в MP3 (--extract-audio --audio-format mp3); допишите ссылку.',
    fullLine: 'yt-dlp --extract-audio --audio-format mp3 '
  },
  {
    tool: 'yt-dlp',
    token: '· качество аудио 192k',
    summary:
      'Целевое качество аудио при извлечении (--audio-quality 192K --extract-audio); допишите ссылку.',
    fullLine: 'yt-dlp --audio-quality 192K --extract-audio '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: число записей в плейлисте (n_entries)',
    summary:
      'Число записей плейлиста без скачивания (--skip-download --print n_entries); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print n_entries '
  },
  {
    tool: 'yt-dlp',
    token: '· вшить главы',
    summary: 'Вшить главы в файл после скачивания (--embed-chapters); допишите ссылку и -f/-o.',
    fullLine: 'yt-dlp --embed-chapters '
  },
  {
    tool: 'yt-dlp',
    token: '· отметить просмотренным',
    summary:
      'Отметить как просмотренное без скачивания (--mark-watched --skip-download); допишите ссылку (YouTube и др.).',
    fullLine: 'yt-dlp --mark-watched --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· все превью',
    summary:
      'Сохранить все превью без видео (--write-all-thumbnails --skip-download); допишите ссылку.',
    fullLine: 'yt-dlp --write-all-thumbnails --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· без проверки форматов -F',
    summary:
      'Список форматов без проверки ссылки для каждого (--no-check-formats -F); быстрее, но менее надёжно; допишите ссылку.',
    fullLine: 'yt-dlp --no-check-formats -F '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист в обратном порядке -J',
    summary: 'Плейлист в обратном порядке и JSON (--playlist-reverse -J); допишите ссылку.',
    fullLine: 'yt-dlp --playlist-reverse -J '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист в случайном порядке -J',
    summary:
      'Случайный порядок элементов плейлиста и JSON (--playlist-random -J); допишите ссылку.',
    fullLine: 'yt-dlp --playlist-random -J '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок ua в стиле curl -F',
    summary:
      'Подменить заголовок User-Agent (--user-agent curl/8.5.0 -F; типичная строка curl); CDN (сеть доставки) и WAF (защита на периметре); допишите ссылку.',
    fullLine: 'yt-dlp --user-agent curl/8.5.0 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· лимит при ограничении скорости -F',
    summary:
      'Лимит скорости при намеренном снижении отдачи (throttling; ключ --throttled-rate 100K -F); допишите ссылку.',
    fullLine: 'yt-dlp --throttled-rate 100K -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вшить субтитры',
    summary:
      'Вшить субтитры в контейнер после скачивания (--embed-subs; обычно вместе с --write-subs); допишите ссылку и -f.',
    fullLine: 'yt-dlp --embed-subs '
  },
  {
    tool: 'yt-dlp',
    token: '· субтитры в srt',
    summary: 'Конвертировать субтитры в SRT постпроцессором (--convert-subs srt); допишите ссылку.',
    fullLine: 'yt-dlp --convert-subs srt '
  },
  {
    tool: 'yt-dlp',
    token: '· шаблон -o: заголовок.расширение',
    summary:
      'Шаблон имени без пробелов (-o %(title)s.%(ext)s); допишите ссылку (при необходимости смените шаблон вручную).',
    fullLine: 'yt-dlp -o %(title)s.%(ext)s '
  },
  {
    tool: 'yt-dlp',
    token: '· нарезка по главам',
    summary:
      'Разрезать выход по главам (--split-chapters; нужна утилита FFmpeg в каталогах из PATH); допишите ссылку.',
    fullLine: 'yt-dlp --split-chapters '
  },
  {
    tool: 'yt-dlp',
    token: '· вырезать главы спонсора',
    summary:
      'Вырезать главы категории sponsor из финального файла (--remove-chapters sponsor); допишите ссылку.',
    fullLine: 'yt-dlp --remove-chapters sponsor '
  },
  {
    tool: 'yt-dlp',
    token: '· метаданные плейлиста',
    summary:
      'Сохранить метаданные плейлиста рядом с файлами (--write-playlist-metafiles); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --write-playlist-metafiles '
  },
  {
    tool: 'yt-dlp',
    token: '· принудительная перезапись',
    summary:
      'Перезаписывать существующие файлы без вопросов (--force-overwrites); допишите ссылку.',
    fullLine: 'yt-dlp --force-overwrites '
  },
  {
    tool: 'yt-dlp',
    token: '· без докачки',
    summary:
      'Не продолжать частичные загрузки с .part (--no-continue; начать заново); допишите ссылку.',
    fullLine: 'yt-dlp --no-continue '
  },
  {
    tool: 'yt-dlp',
    token: '· перекод в mp4',
    summary:
      'Перекодировать итог в MP4 постпроцессором (--recode-video mp4); допишите ссылку и формат источника.',
    fullLine: 'yt-dlp --recode-video mp4 '
  },
  {
    tool: 'yt-dlp',
    token: '· скачать фрагмент по времени',
    summary:
      'Скачать только фрагмент времени (--download-sections *0:00-2:00; правый конец правьте вручную); допишите ссылку.',
    fullLine: 'yt-dlp --download-sections *0:00-2:00 '
  },
  {
    tool: 'yt-dlp',
    token: '· стоп при несовпадении фильтров',
    summary:
      'Прервать весь прогон при первом несовпадении --match-filter (--break-match-filters); допишите ссылку и фильтр.',
    fullLine: 'yt-dlp --break-match-filters '
  },
  {
    tool: 'yt-dlp',
    token: '· без перезаписи после поста',
    summary:
      'Не перезаписывать файлы, уже обработанные постпроцессором (--no-post-overwrites); допишите ссылку.',
    fullLine: 'yt-dlp --no-post-overwrites '
  },
  {
    tool: 'yt-dlp',
    token: '· добавить метаданные',
    summary:
      'Записать в файл базовые теги из метаданных площадки (--add-metadata); допишите ссылку и -f/-o.',
    fullLine: 'yt-dlp --add-metadata '
  },
  {
    tool: 'yt-dlp',
    token: '· hls: внешний загрузчик ffmpeg -F',
    summary:
      'HLS: тянуть поток через утилиту FFmpeg вместо встроенного загрузчика (--hls-prefer-ffmpeg -F); обход части сбоев на стороне CDN; допишите ссылку.',
    fullLine: 'yt-dlp --hls-prefer-ffmpeg -F '
  },
  {
    tool: 'yt-dlp',
    token: '· путь к бинарнику ffmpeg',
    summary:
      'Явный путь к утилите FFmpeg для постпроцессоров и слияния потоков (--ffmpeg-location ffmpeg); при необходимости замените на полный путь без пробелов; допишите ссылку.',
    fullLine: 'yt-dlp --ffmpeg-location ffmpeg '
  }
]
