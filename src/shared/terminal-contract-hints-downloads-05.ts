import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки вкладки «Загрузки» (часть 05). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_05: TerminalCommandHintEntry[] = [
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
  },
  {
    tool: 'yt-dlp',
    token: '· cookie из chromium',
    summary:
      'Сухой прогон с файлами cookie из Chromium (--skip-download --cookies-from-browser chromium); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser chromium '
  },
  {
    tool: 'yt-dlp',
    token: '· cookie из vivaldi',
    summary:
      'Сухой прогон с файлами cookie из Vivaldi (--skip-download --cookies-from-browser vivaldi); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser vivaldi '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход fr (Франция) -F',
    summary:
      'Гео-обход с кодом страны FR (--geo-bypass-country FR -F); поменяйте ISO-код при необходимости; допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country FR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· youtube: мобильный веб-клиент -F',
    summary:
      'YouTube: мобильный веб-клиент (mweb) через --extractor-args (--extractor-args youtube:player_client=mweb -F); допишите ссылку.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=mweb -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: запрошенные форматы (requested_formats)',
    summary:
      'Список запрошенных и выбранных форматов без скачивания (--skip-download --print requested_formats); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print requested_formats '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: запрошенные субтитры (requested_subtitles)',
    summary:
      'Запрошенные субтитры без скачивания (--skip-download --print requested_subtitles); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print requested_subtitles '
  },
  {
    tool: 'yt-dlp',
    token: '· cookie из safari',
    summary:
      'Сухой прогон с файлами cookie из Safari (--skip-download --cookies-from-browser safari); macOS и Windows — по наличию профиля; допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser safari '
  },
  {
    tool: 'yt-dlp',
    token: '· youtube: веб-клиент автора -F',
    summary:
      'YouTube: клиент web_creator через --extractor-args (--extractor-args youtube:player_client=web_creator -F); YouTube Studio и ограниченные кейсы; допишите ссылку.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=web_creator -F '
  },
  {
    tool: 'yt-dlp',
    token: '· youtube: встраиваемый веб-клиент -F',
    summary:
      'YouTube: клиент web_embedded через --extractor-args (--extractor-args youtube:player_client=web_embedded -F); встраиваемый плеер; допишите ссылку.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=web_embedded -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход gb (Великобритания) -F',
    summary:
      'Гео-обход с кодом страны GB (--geo-bypass-country GB -F); поменяйте ISO-код при необходимости; допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GB -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: словарь форматов (formats)',
    summary:
      'Словарь доступных форматов без скачивания (--skip-download --print formats); тяжёлый вывод — для диагностики; допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print formats '
  },
  {
    tool: 'yt-dlp',
    token: '· симуляция слияния лучших (best)',
    summary:
      'Сухой прогон выбора слияния видео и аудио (--simulate -f bestvideo+bestaudio/best, шаблон «лучшее видео плюс лучшее аудио» или best); без файлов; допишите ссылку.',
    fullLine: 'yt-dlp --simulate -f bestvideo+bestaudio/best '
  },
  {
    tool: 'yt-dlp',
    token: '· несколько потоков -F',
    summary:
      'Список форматов с учётом мультипотока (--multi-streams -F); DASH и HLS с раздельными потоками; допишите ссылку.',
    fullLine: 'yt-dlp --multi-streams -F '
  },
  {
    tool: 'yt-dlp',
    token: '· совместимость 2024 -F',
    summary:
      'Совместимость «как в 2024+» (--compat-options 2024 -F); задел под будущие изменения yt-dlp; допишите ссылку.',
    fullLine: 'yt-dlp --compat-options 2024 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· один ролик: заголовок',
    summary:
      'Только один ролик по ссылке на плейлист и заголовок без скачивания (--no-playlist --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --no-playlist --skip-download --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист: модуль извлечения',
    summary:
      'Плоский плейлист: имя модуля извлечения (extractor) у каждого элемента без глубокого извлечения (--flat-playlist --skip-download --print extractor); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --flat-playlist --skip-download --print extractor '
  },
  {
    tool: 'yt-dlp',
    token: '· без внешних плейлистов -J',
    summary:
      'JSON плейлиста без разрешения внешних ссылок на другие плейлисты (--no-remote-playlist -J); меньше сетевых обходов; допишите ссылку.',
    fullLine: 'yt-dlp --no-remote-playlist -J '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход jp (Япония) -F',
    summary:
      'Гео-обход с кодом страны JP (--geo-bypass-country JP -F); региональные ограничения; допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country JP -F '
  }
]
