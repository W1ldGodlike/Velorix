import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки Загрузки (часть 4/14; §8 audit prune). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_04: TerminalCommandHintEntry[] = [
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
  },
  {
    tool: 'yt-dlp',
    token: '· tls: старое повторное согласование -F',
    summary:
      'Небезопасное повторное согласование TLS по старой схеме (legacy renegotiation, --legacy-server-connect -F) для старых узлов CDN; допишите ссылку.',
    fullLine: 'yt-dlp --legacy-server-connect -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без проверки обновлений -F',
    summary:
      'Не запрашивать в сети проверку обновлений yt-dlp (--no-call-home -F); допишите ссылку.',
    fullLine: 'yt-dlp --no-call-home -F '
  },
  {
    tool: 'yt-dlp',
    token: '· не новее даты -F',
    summary:
      'Только ролики не новее даты (--datebefore 20991231 -F; поменяйте дату YYYYMMDD); допишите ссылку.',
    fullLine: 'yt-dlp --datebefore 20991231 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вшить .info.json',
    summary:
      'Встроить .info.json в контейнер после скачивания (--embed-info-json); допишите ссылку и -f/-o.',
    fullLine: 'yt-dlp --embed-info-json '
  },
  {
    tool: 'yt-dlp',
    token: '· логин из netrc -F',
    summary: 'Учётные данные из ~/.netrc (--netrc -F); для сайтов с логином; допишите ссылку.',
    fullLine: 'yt-dlp --netrc -F '
  },
  {
    tool: 'yt-dlp',
    token: '· принудительно общий экстрактор -F',
    summary:
      'Принудительно общий модуль извлечения generic (--force-generic-extractor -F) при сбое распознавания; допишите ссылку.',
    fullLine: 'yt-dlp --force-generic-extractor -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: число подписчиков (channel_follower_count)',
    summary:
      'Число подписчиков канала без скачивания (--skip-download --print channel_follower_count); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print channel_follower_count '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: средний рейтинг (average_rating)',
    summary:
      'Средний рейтинг и оценка без скачивания (--skip-download --print average_rating); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print average_rating '
  },
  {
    tool: 'yt-dlp',
    token: '· все ссылки в журнал',
    summary:
      'Список всех извлечённых ссылок в журнал (--write-all-urls --skip-download); допишите ссылку.',
    fullLine: 'yt-dlp --write-all-urls --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· дамп страниц в html',
    summary:
      'Сырой дамп HTML-страниц модуля извлечения (extractor) в файлы (--dump-pages --skip-download); диагностика разметки и ответов API; допишите ссылку.',
    fullLine: 'yt-dlp --dump-pages --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· без прогресс-бара -F',
    summary:
      'Без прогресс-бара в консоли (--no-progress -F); чище вывод в длинных списках; допишите ссылку.',
    fullLine: 'yt-dlp --no-progress -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: признак приватности (is_private)',
    summary:
      'Признак приватного или ограниченного ролика без скачивания (--skip-download --print is_private); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print is_private '
  },
  {
    tool: 'yt-dlp',
    token: '· один ролик -J',
    summary:
      'JSON метаданных только для одного ролика по ссылке на плейлист (--no-playlist -J); допишите ссылку.',
    fullLine: 'yt-dlp --no-playlist -J '
  },
  {
    tool: 'yt-dlp',
    token: '· hls в контейнере ts -F',
    summary:
      'HLS: сохранять как MPEG-TS сегменты (--hls-use-mpegts -F) при проблемах с фрагментами; допишите ссылку.',
    fullLine: 'yt-dlp --hls-use-mpegts -F '
  },
  {
    tool: 'yt-dlp',
    token: '· субтитры без видео',
    summary: 'Скачать ручные субтитры без видео (--write-subs --skip-download); допишите ссылку.',
    fullLine: 'yt-dlp --write-subs --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· макс. пауза запроса -F',
    summary:
      'Верхняя граница пауз между HTTP-запросами (--max-sleep-interval 10 -F); подстройте секунды; допишите ссылку.',
    fullLine: 'yt-dlp --max-sleep-interval 10 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· пауза перед повтором -F',
    summary: 'Пауза между повторными попытками загрузки (--retry-sleep 5 -F); допишите ссылку.',
    fullLine: 'yt-dlp --retry-sleep 5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· мин. размер файла -F',
    summary:
      'Пропускать форматы меньше порога (--min-filesize 100K -F); поменяйте размер при необходимости; допишите ссылку.',
    fullLine: 'yt-dlp --min-filesize 100K -F '
  },
  {
    tool: 'yt-dlp',
    token: '· повторы доступа к диску -F',
    summary:
      'Повторы при ошибках чтения и записи на диске (--file-access-retries 5 -F); допишите ссылку.',
    fullLine: 'yt-dlp --file-access-retries 5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: название как у плейлиста (playlist)',
    summary:
      'Название плейлиста без скачивания (--skip-download --print playlist); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print playlist '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: автонумерация в -o (поле playlist_autonumber)',
    summary:
      'Автонумерация в шаблоне -o без скачивания (--skip-download --print playlist_autonumber); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print playlist_autonumber '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: правка метаданных, unix (modified_timestamp)',
    summary:
      'Unix-время последнего изменения метаданных без скачивания (--skip-download --print modified_timestamp); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print modified_timestamp '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: релиз, unix (release_timestamp)',
    summary:
      'Unix-время релиза и премьеры без скачивания (--skip-download --print release_timestamp); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print release_timestamp '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: загрузка на площадку, unix (upload_timestamp)',
    summary:
      'Unix-время загрузки на площадку без скачивания (--skip-download --print upload_timestamp); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print upload_timestamp '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: соотношение после растяжения (stretched_ratio)',
    summary:
      'Соотношение сторон после растяжения кадра (поле stretched_ratio в метаданных yt-dlp, если задаётся площадкой) без скачивания (--skip-download --print stretched_ratio); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print stretched_ratio '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: местоположение (location)',
    summary:
      'Данные о местоположении из метаданных без скачивания (--skip-download --print location); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print location '
  },
  {
    tool: 'yt-dlp',
    token: '· youtube: android-клиент -F',
    summary:
      'YouTube: клиент Android через --extractor-args (--extractor-args youtube:player_client=android -F); обход части веб-ограничений; допишите ссылку.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=android -F '
  },
  {
    tool: 'yt-dlp',
    token: '· youtube: встроенный клиент tv -F',
    summary:
      'YouTube: встроенный TV-клиент (--extractor-args youtube:player_client=tv_embedded -F); допишите ссылку.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=tv_embedded -F '
  },
  {
    tool: 'yt-dlp',
    token: '· youtube: ios-клиент -F',
    summary:
      'YouTube: iOS-клиент через --extractor-args (--extractor-args youtube:player_client=ios -F); допишите ссылку.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=ios -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: альтернативный заголовок (alternate_title)',
    summary:
      'Альтернативный заголовок без скачивания (--skip-download --print alternate_title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print alternate_title '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: внутренний ключ экстрактора (extractor_key)',
    summary:
      'Внутренний ключ модуля извлечения (поле extractor_key — служебный идентификатор экстрактора) без скачивания (--skip-download --print extractor_key); сверка с `--print extractor`; допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print extractor_key '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист: ссылка страницы',
    summary:
      'Плоский плейлист: ссылка на страницу каждого элемента без глубокого извлечения (--flat-playlist --skip-download --print webpage_url); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --flat-playlist --skip-download --print webpage_url '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход de (Германия) -F',
    summary:
      'Гео-обход с кодом страны DE (--geo-bypass-country DE -F); поменяйте ISO-код при необходимости; допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country DE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: канал с галочкой (channel_is_verified)',
    summary:
      'Флаг верифицированного канала без скачивания (--skip-download --print channel_is_verified); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print channel_is_verified '
  },
  {
    tool: 'yt-dlp',
    token: '· cookie из opera',
    summary:
      'Сухой прогон с файлами cookie из Opera (--skip-download --cookies-from-browser opera); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser opera '
  }
]
