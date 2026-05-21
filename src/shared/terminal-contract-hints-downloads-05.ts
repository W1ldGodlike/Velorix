import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки Загрузки (часть 5/14; §8 audit prune). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_05: TerminalCommandHintEntry[] = [
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
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход ca (Канада) -F',
    summary: 'Гео-обход с кодом страны CA (--geo-bypass-country CA -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: словарь миниатюр (thumbnails)',
    summary:
      'Словарь ссылок на миниатюры (thumbnails) без скачивания (--skip-download --print thumbnails); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print thumbnails '
  },
  {
    tool: 'yt-dlp',
    token: '· youtube: веб-клиент safari -F',
    summary:
      'YouTube: клиент web_safari через --extractor-args (--extractor-args youtube:player_client=web_safari -F); Safari-подобный веб-клиент; допишите ссылку.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=web_safari -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: канал плейлиста (playlist_channel)',
    summary:
      'Имя канала плейлиста без скачивания (--skip-download --print playlist_channel); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --skip-download --print playlist_channel '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: id канала плейлиста (playlist_channel_id)',
    summary:
      'Идентификатор канала плейлиста без скачивания (--skip-download --print playlist_channel_id); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --skip-download --print playlist_channel_id '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: автор плейлиста (playlist_uploader)',
    summary:
      'Автор плейлиста (uploader) без скачивания (--skip-download --print playlist_uploader); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --skip-download --print playlist_uploader '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: id автора плейлиста (playlist_uploader_id)',
    summary:
      'ID автора плейлиста без скачивания (--skip-download --print playlist_uploader_id); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --skip-download --print playlist_uploader_id '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист: тип записи',
    summary:
      'Плоский плейлист: тип записи (video, playlist и т. д., поле _type) (--flat-playlist --skip-download --print _type); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --flat-playlist --skip-download --print _type '
  },
  {
    tool: 'yt-dlp',
    token: '· слияние в mp4',
    summary:
      'Слияние потоков в MP4 при мультиплексировании (--merge-output-format mp4); допишите ссылку и -f …',
    fullLine: 'yt-dlp --merge-output-format mp4 '
  },
  {
    tool: 'yt-dlp',
    token: '· без сохранения видео',
    summary:
      'После извлечения аудио не оставлять исходное видео (--no-keep-video); допишите ссылку и --extract-audio при необходимости.',
    fullLine: 'yt-dlp --no-keep-video '
  },
  {
    tool: 'yt-dlp',
    token: '· загрузчик ffmpeg',
    summary:
      'Тянуть фрагменты через внешнюю утилиту FFmpeg (--external-downloader ffmpeg); обход части встроенных загрузчиков; допишите ссылку.',
    fullLine: 'yt-dlp --external-downloader ffmpeg '
  },
  {
    tool: 'yt-dlp',
    token: '· разбор метаданных: заголовок (title)',
    summary:
      'Постобработка метаданных: перезапись title из шаблона (--parse-metadata title:%(title)s); допишите ссылку.',
    fullLine: 'yt-dlp --parse-metadata title:%(title)s '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход au (Австралия) -F',
    summary: 'Гео-обход с кодом страны AU (--geo-bypass-country AU -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход br (Бразилия) -F',
    summary: 'Гео-обход с кодом страны BR (--geo-bypass-country BR -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход it (Италия) -F',
    summary: 'Гео-обход с кодом страны IT (--geo-bypass-country IT -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country IT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: ссылка страницы плейлиста (playlist_webpage_url)',
    summary:
      'Ссылка на страницу плейлиста без скачивания (--skip-download --print playlist_webpage_url); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print playlist_webpage_url '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: схема (http/https) (webpage_url_scheme)',
    summary:
      'Схема ссылки страницы (http и https) без скачивания (--skip-download --print webpage_url_scheme); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print webpage_url_scheme '
  },
  {
    tool: 'yt-dlp',
    token: '· несколько видеопотоков -F',
    summary:
      'Список форматов с учётом нескольких видеопотоков (--video-multistreams -F); редкие дорожки с несколькими ракурсами; допишите ссылку.',
    fullLine: 'yt-dlp --video-multistreams -F '
  },
  {
    tool: 'yt-dlp',
    token: '· несколько аудиопотоков -F',
    summary:
      'Список форматов с учётом нескольких аудиопотоков (--audio-multistreams -F); мультиязык; допишите ссылку.',
    fullLine: 'yt-dlp --audio-multistreams -F '
  },
  {
    tool: 'yt-dlp',
    token: '· тихий режим -F',
    summary: 'Минимум служебного вывода при списке форматов (--quiet -F); допишите ссылку.',
    fullLine: 'yt-dlp --quiet -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без cookie -F',
    summary:
      'Игнорировать файлы cookie из браузера или с диска (--no-cookies -F); изолированный прогон; допишите ссылку.',
    fullLine: 'yt-dlp --no-cookies -F '
  },
  {
    tool: 'yt-dlp',
    token: '· стоп если файл есть -F',
    summary:
      'Остановиться, если целевой файл уже существует (--break-on-existing -F); допишите ссылку и шаблон -o при необходимости.',
    fullLine: 'yt-dlp --break-on-existing -F '
  },
  {
    tool: 'yt-dlp',
    token: '· время файла с сервера',
    summary:
      'Выставлять время файла по Last-Modified с сервера (--mtime); противоположность --no-mtime; допишите ссылку.',
    fullLine: 'yt-dlp --mtime '
  },
  {
    tool: 'yt-dlp',
    token: '· порог проверки форматов -F',
    summary:
      'Порог для --check-formats (доля битрейта, здесь 1.5) и список форматов; допишите ссылку.',
    fullLine: 'yt-dlp --check-formats-threshold 1.5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без разметки sponsorblock -F',
    summary:
      'Не обращаться к веб-API сервиса SponsorBlock (--no-sponsorblock -F); чистый список форматов; допишите ссылку.',
    fullLine: 'yt-dlp --no-sponsorblock -F '
  },
  {
    tool: 'yt-dlp',
    token: '· динамический mpd -F',
    summary:
      'Разрешить динамический манифест DASH (MPD) с обновлением (--allow-dynamic-mpd -F); допишите ссылку.',
    fullLine: 'yt-dlp --allow-dynamic-mpd -F '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок окна консоли -F',
    summary: 'Заголовок окна консоли с прогрессом (--console-title -F); допишите ссылку.',
    fullLine: 'yt-dlp --console-title -F '
  },
  {
    tool: 'yt-dlp',
    token: '· только встроенный загрузчик -F',
    summary:
      'Только встроенный загрузчик, без внешних обёрток (--no-external-downloader -F); допишите ссылку.',
    fullLine: 'yt-dlp --no-external-downloader -F '
  },
  {
    tool: 'yt-dlp',
    token: '· чистить .info.json',
    summary:
      'Удалить временный .info.json после успешной загрузки (--clean-infojson); обычно вместе с --write-info-json; допишите ссылку и ключи вывода.',
    fullLine: 'yt-dlp --clean-infojson '
  },
  {
    tool: 'yt-dlp',
    token: '· не писать .info.json -F',
    summary: 'Не записывать .info.json рядом с выходом (--no-write-info-json -F); допишите ссылку.',
    fullLine: 'yt-dlp --no-write-info-json -F '
  },
  {
    tool: 'yt-dlp',
    token: '· аргументы внешнего загрузчика -F',
    summary:
      'Доп. аргументы внешней программе загрузки (загрузчик) без кавычек (--external-downloader-args ffmpeg_i:-nostdin -F); префикс ffmpeg_i и флаг -nostdin отключают stdin у утилиты FFmpeg; допишите ссылку при использовании внешнего загрузчика.',
    fullLine: 'yt-dlp --external-downloader-args ffmpeg_i:-nostdin -F '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист: все ссылки',
    summary:
      'Плоский плейлист: все ссылки элементов без скачивания (--flat-playlist --print urls --skip-download); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --flat-playlist --print urls --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· свой шаблон прогресса -F',
    summary:
      'Свой шаблон строки прогресса (--progress-template predownload:Preparing %(info.title)s -F); допишите ссылку.',
    fullLine: 'yt-dlp --progress-template predownload:Preparing %(info.title)s -F '
  },
  {
    tool: 'yt-dlp',
    token: '· пауза перед субтитрами -F',
    summary: 'Пауза перед скачиванием субтитров (--sleep-subtitles 5 -F); допишите ссылку.',
    fullLine: 'yt-dlp --sleep-subtitles 5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· лучший формат субтитров -F',
    summary:
      'Предпочесть лучший доступный формат субтитров (--sub-format best -F); допишите ссылку.',
    fullLine: 'yt-dlp --sub-format best -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход nl (Нидерланды) -F',
    summary: 'Гео-обход с кодом страны NL (--geo-bypass-country NL -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country NL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· ключевые кадры на резах',
    summary:
      'Принудительные ключевые кадры на границах нарезки и склейки (--force-keyframes-at-cuts); для постпроцессора утилиты FFmpeg; допишите ссылку и -f …',
    fullLine: 'yt-dlp --force-keyframes-at-cuts '
  },
  {
    tool: 'yt-dlp',
    token: '· без ts в hls -F',
    summary:
      'Отключить MPEG-TS для HLS (--no-hls-use-mpegts -F); противоположность --hls-use-mpegts; допишите ссылку.',
    fullLine: 'yt-dlp --no-hls-use-mpegts -F '
  },
  {
    tool: 'yt-dlp',
    token: '· совместимость: без прямого слияния -F',
    summary:
      'Не сливать потоки напрямую в mkv и webm (--compat-options no-direct-merge -F); диагностика слияния потоков и вызовов FFmpeg; допишите ссылку.',
    fullLine: 'yt-dlp --compat-options no-direct-merge -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход es (Испания) -F',
    summary: 'Гео-обход с кодом страны ES (--geo-bypass-country ES -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country ES -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход pl (Польша) -F',
    summary: 'Гео-обход с кодом страны PL (--geo-bypass-country PL -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход se (Швеция) -F',
    summary: 'Гео-обход с кодом страны SE (--geo-bypass-country SE -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· не вшивать метаданные',
    summary:
      'Не встраивать метаданные в выходной файл (--no-embed-metadata); противоположность --embed-metadata; допишите ссылку.',
    fullLine: 'yt-dlp --no-embed-metadata '
  }
]
