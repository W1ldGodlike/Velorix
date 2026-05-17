import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки вкладки «Загрузки» (часть 04). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_04: TerminalCommandHintEntry[] = [
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
  },
  {
    tool: 'yt-dlp',
    token: '· каталоги в домашней папке',
    summary:
      'Переопределить подпапку типа home для вывода (--paths home:ytdl-out); поменяйте ytdl-out под свою структуру; допишите ссылку.',
    fullLine: 'yt-dlp --paths home:ytdl-out '
  },
  {
    tool: 'yt-dlp',
    token: '· без журнала скачанных (archive.txt)',
    summary:
      'Игнорировать журнал archive.txt даже если он в конфиге (--no-download-archive); допишите ссылку.',
    fullLine: 'yt-dlp --no-download-archive '
  },
  {
    tool: 'yt-dlp',
    token: '· консоль в utf-8',
    summary:
      'Принудительно UTF-8 для вывода yt-dlp (--encoding utf-8); кириллица и символы Unicode в консоли Windows; допишите ссылку.',
    fullLine: 'yt-dlp --encoding utf-8 '
  },
  {
    tool: 'yt-dlp',
    token: '· ошибка по ссылке не рвёт плейлист -F',
    summary:
      'Плейлист: не прерывать весь прогон при ошибке одной ссылки (--break-per-input -F); допишите ссылку.',
    fullLine: 'yt-dlp --break-per-input -F '
  },
  {
    tool: 'yt-dlp',
    token: '· проверка всех форматов -F',
    summary:
      'Проверить каждый формат по ссылке на поток (--check-all-formats -F); медленно, зато без сюрпризов при скачивании; допишите ссылку.',
    fullLine: 'yt-dlp --check-all-formats -F '
  },
  {
    tool: 'yt-dlp',
    token: '· таймаут сокета 60 с',
    summary:
      'Таймаут сокета 60 с (--socket-timeout 60); медленные сети доставки (CDN) и прокси; допишите ссылку.',
    fullLine: 'yt-dlp --socket-timeout 60 '
  },
  {
    tool: 'yt-dlp',
    token: '· метаданные в расширенных атрибутах (xattr)',
    summary: 'Записать метаданные в xattr файла где поддерживается ОС (--xattrs); допишите ссылку.',
    fullLine: 'yt-dlp --xattrs '
  },
  {
    tool: 'yt-dlp',
    token: '· обновление yt-dlp (-U)',
    summary:
      'Обновить yt-dlp до последней стабильной сборки (-U); ссылка в команде не нужна; закройте процессы, если бинарь залочен.',
    fullLine: 'yt-dlp -U '
  },
  {
    tool: 'yt-dlp',
    token: '· совместимость: без заглушек yt',
    summary:
      'Совместимость: не подменять недоступные ролики YouTube заглушкой (--compat-options no-youtube-unavailable-videos -F); допишите ссылку.',
    fullLine: 'yt-dlp --compat-options no-youtube-unavailable-videos -F '
  },
  {
    tool: 'yt-dlp',
    token: '· очистка кэша модулей',
    summary:
      'Сбросить кэш модулей извлечения yt-dlp (--rm-cache-dir); ссылка в команде не нужна; помогает при «битом» кэше и неверных форматах.',
    fullLine: 'yt-dlp --rm-cache-dir'
  },
  {
    tool: 'yt-dlp',
    token: '· папка кэша -F',
    summary:
      'Альтернативный путь кэша модулей извлечения (--cache-dir cache -F); путь без пробелов; допишите ссылку.',
    fullLine: 'yt-dlp --cache-dir cache -F '
  },
  {
    tool: 'yt-dlp',
    token: '· сохранять фрагменты -F',
    summary:
      'Не удалять промежуточные фрагменты после слияния (--keep-fragments -F); диагностика потоков DASH и HLS; допишите ссылку.',
    fullLine: 'yt-dlp --keep-fragments -F '
  },
  {
    tool: 'yt-dlp',
    token: '· буфер чтения 16k -F',
    summary:
      'Размер буфера чтения для медленных CDN (--buffer-size 16K -F); подстройте при необходимости; допишите ссылку.',
    fullLine: 'yt-dlp --buffer-size 16K -F '
  },
  {
    tool: 'yt-dlp',
    token: '· стоп при недоступном фрагменте',
    summary:
      'Прервать загрузку при первом недоступном фрагменте (--abort-on-unavailable-fragments); жёсткий режим; допишите ссылку.',
    fullLine: 'yt-dlp --abort-on-unavailable-fragments '
  },
  {
    tool: 'yt-dlp',
    token: '· субтитры en и ru -F',
    summary:
      'Выбор языков субтитров без кавычек (--sub-langs en.*,ru.* -F); пары «язык и регион» регуляркой; допишите ссылку.',
    fullLine: 'yt-dlp --sub-langs en.*,ru.* -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: дата релиза (release_date)',
    summary:
      'Дата релиза YYYYMMDD без скачивания (--skip-download --print release_date); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print release_date '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: исполнитель альбома (album_artist)',
    summary:
      'Исполнитель альбома без скачивания (--skip-download --print album_artist); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print album_artist '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: номер трека (track_number)',
    summary:
      'Номер трека внутри альбома без скачивания (--skip-download --print track_number); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print track_number '
  },
  {
    tool: 'yt-dlp',
    token: '· cookie из brave',
    summary:
      'Сухой прогон с файлами cookie из Brave (--skip-download --cookies-from-browser brave); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser brave '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: сериал (series)',
    summary:
      'Название серии или шоу без скачивания (--skip-download --print series); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print series '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: сезон, строка (season)',
    summary:
      'Сезон (строка площадки) без скачивания (--skip-download --print season); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print season '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: эпизод, строка (episode)',
    summary:
      'Эпизод (строка площадки) без скачивания (--skip-download --print episode); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print episode '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: короткий id для отображения (display_id)',
    summary:
      'Короткий display_id без скачивания (--skip-download --print display_id); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print display_id '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: имя пути страницы (webpage_url_basename)',
    summary:
      'Последний сегмент пути страницы без скачивания (--skip-download --print webpage_url_basename); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print webpage_url_basename '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: полный заголовок (fulltitle)',
    summary:
      'Полный заголовок с плейлистом или серией без скачивания (--skip-download --print fulltitle); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print fulltitle '
  },
  {
    tool: 'yt-dlp',
    token: '· вырезать сегменты sponsorblock',
    summary:
      'Вырезать вставки категории sponsor (реклама в ролике, SponsorBlock) постпроцессором (--sponsorblock-remove sponsor); допишите ссылку и -f.',
    fullLine: 'yt-dlp --sponsorblock-remove sponsor '
  },
  {
    tool: 'yt-dlp',
    token: '· встроенный загрузчик -F',
    summary:
      'Встроенный загрузчик фрагментов (--downloader native -F); обход части сбоев утилиты FFmpeg; допишите ссылку.',
    fullLine: 'yt-dlp --downloader native -F '
  }
]
