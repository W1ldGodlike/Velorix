import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки Загрузки (часть 1/14; §8 audit prune). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_01: TerminalCommandHintEntry[] = [
  {
    tool: 'yt-dlp',
    token: '· -F',
    summary:
      'Список форматов перед загрузкой; после щелчка по подсказке допишите ссылку из поля очереди.',
    fullLine: 'yt-dlp -F '
  },
  {
    tool: 'yt-dlp',
    token: '· прямая ссылка (-g), шаблон best',
    summary: 'Прямая ссылка на поток без скачивания (-g -f best); допишите ссылку.',
    fullLine: 'yt-dlp -g -f best '
  },
  {
    tool: 'yt-dlp',
    token: '· cookie из chrome',
    summary: 'Сухой прогон с файлами cookie из Chrome (--cookies-from-browser); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser chrome '
  },
  {
    tool: 'yt-dlp',
    token: '· -J',
    summary:
      'Полный JSON метаданных (-J) без скачивания; допишите ссылку (диагностика, архив ZIP для обращения в поддержку).',
    fullLine: 'yt-dlp -J '
  },
  {
    tool: 'yt-dlp',
    token: '· один json на ссылку (один ролик)',
    summary:
      'Один JSON на ролик без скачивания (--dump-single-json, эквивалент -J для одной ссылки); допишите ссылку.',
    fullLine: 'yt-dlp --dump-single-json '
  },
  {
    tool: 'yt-dlp',
    token: '· подробный лог + сухой прогон',
    summary:
      'Подробный журнал вывода без скачивания (-v --skip-download); допишите ссылку (ошибки модуля извлечения, геоблокировки по региону (geo), защита контента (DRM)).',
    fullLine: 'yt-dlp -v --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· сухой прогон (имитация)',
    summary:
      'Сухой прогон без файлов (--simulate); допишите ссылку (проверка доступности и форматов).',
    fullLine: 'yt-dlp --simulate '
  },
  {
    tool: 'yt-dlp',
    token: '· список субтитров',
    summary: 'Список субтитров на странице без скачивания (--list-subs); допишите ссылку.',
    fullLine: 'yt-dlp --list-subs '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист и полный json (-J)',
    summary:
      'Плейлист «плоско» и JSON (-J) без глубокого извлечения каждого ролика; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --flat-playlist -J '
  },
  {
    tool: 'yt-dlp',
    token: '· один ролик из плейлиста -F',
    summary:
      'Только один ролик по ссылке на плейлист (--no-playlist -F); список форматов без разворачивания всего плейлиста.',
    fullLine: 'yt-dlp --no-playlist -F '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист + форматы -F',
    summary:
      'Плоский список элементов плейлиста и форматы по каждому (--flat-playlist -F); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --flat-playlist -F '
  },
  {
    tool: 'yt-dlp',
    token: '· список миниатюр (превью)',
    summary:
      'Доступные ссылки на миниатюры (thumbnail) без скачивания (--list-thumbnails); допишите ссылку.',
    fullLine: 'yt-dlp --list-thumbnails '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: заголовок (title)',
    summary:
      'Только заголовок ролика без скачивания (--skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: длительность строкой (duration_string)',
    summary:
      'Только длительность HH:MM:SS без скачивания (--skip-download --print duration_string); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print duration_string '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: автор (uploader)',
    summary:
      'Имя автора (uploader) без скачивания (--skip-download --print uploader); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print uploader '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: идентификатор ролика (id)',
    summary:
      'Идентификатор ролика на площадке без скачивания (--skip-download --print id); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print id '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: ссылка страницы (webpage_url)',
    summary:
      'Каноническая ссылка на страницу без скачивания (--skip-download --print webpage_url); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print webpage_url '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: канал (channel)',
    summary:
      'Имя канала или площадки без скачивания (--skip-download --print channel); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print channel '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: идентификатор канала (channel_id)',
    summary:
      'Идентификатор канала без скачивания (--skip-download --print channel_id); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print channel_id '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: миниатюра (thumbnail)',
    summary:
      'Ссылка на миниатюру (thumbnail) без скачивания (--skip-download --print thumbnail); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print thumbnail '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: число просмотров (view_count)',
    summary:
      'Счётчик просмотров без скачивания (--skip-download --print view_count); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print view_count '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: дата публикации (upload_date)',
    summary:
      'Дата публикации YYYYMMDD без скачивания (--skip-download --print upload_date); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print upload_date '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: название плейлиста (playlist_title)',
    summary:
      'Заголовок плейлиста без скачивания (--skip-download --print playlist_title); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --skip-download --print playlist_title '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: число элементов плейлиста (playlist_count)',
    summary:
      'Число элементов в плейлисте без скачивания (--skip-download --print playlist_count); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print playlist_count '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: имя файла (filename)',
    summary:
      'Имя выходного файла по текущим -o без скачивания (--skip-download --print filename); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print filename '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: описание (description)',
    summary:
      'Текст описания ролика без скачивания (--skip-download --print description); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print description '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: категории (categories)',
    summary:
      'Категории и тематики без скачивания (--skip-download --print categories); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print categories '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: язык (language)',
    summary:
      'Язык по умолчанию без скачивания (--skip-download --print language); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print language '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: модуль извлечения (extractor)',
    summary:
      'Имя модуля извлечения (extractor) без скачивания (--skip-download --print extractor); допишите ссылку (диагностика маршрута yt-dlp).',
    fullLine: 'yt-dlp --skip-download --print extractor '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: идентификатор плейлиста (playlist_id)',
    summary:
      'Идентификатор плейлиста без скачивания (--skip-download --print playlist_id); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --skip-download --print playlist_id '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход + список форматов -F',
    summary:
      'Обход гео-блока и список форматов (--geo-bypass -F); допишите ссылку (региональные ограничения).',
    fullLine: 'yt-dlp --geo-bypass -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: идентификатор формата (format_id)',
    summary:
      'Идентификатор выбранного формата без скачивания (--skip-download --print format_id); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print format_id '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: расширение (ext)',
    summary:
      'Расширение контейнера выбранного формата без скачивания (--skip-download --print ext); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print ext '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: разрешение (resolution)',
    summary:
      'Строка разрешения выбранного формата без скачивания (--skip-download --print resolution); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print resolution '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: видеокодек (vcodec)',
    summary:
      'Видеокодек выбранного формата без скачивания (--skip-download --print vcodec); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print vcodec '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: аудиокодек (acodec)',
    summary:
      'Аудиокодек выбранного формата без скачивания (--skip-download --print acodec); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print acodec '
  },
  {
    tool: 'yt-dlp',
    token: '· список экстракторов',
    summary:
      'Список имён модулей извлечения сайтов в выводе; ссылка в команде не нужна (диагностика сборки yt-dlp и поддерживаемых площадок).',
    fullLine: 'yt-dlp --list-extractors'
  },
  {
    tool: 'yt-dlp',
    token: '· версия yt-dlp',
    summary:
      'Версия yt-dlp и зависимостей в выводе; ссылка в команде не нужна (сверка с встроенной поставкой и обновлениями).',
    fullLine: 'yt-dlp --version'
  },
  {
    tool: 'yt-dlp',
    token: '· -4 -F',
    summary:
      'Список форматов через IPv4 (-4 -F); обходит часть проблем IPv6 и маршрутизации; допишите ссылку.',
    fullLine: 'yt-dlp -4 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без кэша + -F',
    summary:
      'Список форматов без кэша модулей извлечения (--no-cache-dir -F); при подозрении на битый кэш; допишите ссылку.',
    fullLine: 'yt-dlp --no-cache-dir -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: теги (tags)',
    summary:
      'Сводка тегов и метаданных без скачивания (--skip-download --print tags); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print tags '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: размер приблизительно (filesize_approx)',
    summary:
      'Оценка размера выбранного формата без скачивания (--skip-download --print filesize_approx); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print filesize_approx '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист: игнор ошибок + -J',
    summary:
      'Плоский плейлист и JSON с пропуском битых элементов (--ignore-errors --flat-playlist -J); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --ignore-errors --flat-playlist -J '
  },
  {
    tool: 'yt-dlp',
    token: '· запись .info.json',
    summary:
      'Записать .info.json рядом с выходом без видео (--write-info-json --skip-download); допишите ссылку (трассировка для обращения в поддержку в виде архива ZIP).',
    fullLine: 'yt-dlp --write-info-json --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· без предупреждений + -F',
    summary:
      'Список форматов без предупреждений в stderr (--no-warnings -F); допишите ссылку (чище вывод).',
    fullLine: 'yt-dlp --no-warnings -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: частота кадров (fps)',
    summary:
      'Кадры в секунду выбранного формата без скачивания (--skip-download --print fps); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print fps '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: признак эфира (is_live)',
    summary:
      'Признак прямого эфира без скачивания (--skip-download --print is_live); в выводе булевы литералы true и false (да/нет в JSON); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print is_live '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: статус эфира (live_status)',
    summary:
      'Статус эфира без скачивания (--skip-download --print live_status): is_live (идёт прямой эфир), was_live (после прямого эфира), not_live (не прямой эфир), is_upcoming или upcoming (ожидается старт эфира); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print live_status '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: доступность (availability)',
    summary:
      'Видимость ролика без скачивания (--skip-download --print availability): строковые значения поля — public (для всех), unlisted (только по ссылке), premium (платный или ограниченный доступ), needs_auth (нужна авторизация); допишите ссылку (диагностика 403 и входа по логину).',
    fullLine: 'yt-dlp --skip-download --print availability '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: возрастной лимит (age_limit)',
    summary:
      'Возрастной лимит ролика без скачивания (--skip-download --print age_limit); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print age_limit '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: число лайков (like_count)',
    summary: 'Счётчик лайков без скачивания (--skip-download --print like_count); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print like_count '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: число комментариев (comment_count)',
    summary:
      'Число комментариев без скачивания (--skip-download --print comment_count); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print comment_count '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: соотношение сторон (aspect_ratio)',
    summary:
      'Соотношение сторон выбранного формата без скачивания (--skip-download --print aspect_ratio); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print aspect_ratio '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист: только 1-й + -F',
    summary:
      'Только первый элемент плейлиста и список форматов (--playlist-items 1 -F); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --playlist-items 1 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· youtube: клиент веб-сайта -F',
    summary:
      'YouTube: принудительно веб-клиент через --extractor-args (обход части ограничений), затем ключ -F для списка форматов; допишите ссылку.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=web -F '
  },
  {
    tool: 'yt-dlp',
    token: '· cookie из edge',
    summary:
      'Сухой прогон с файлами cookie из Edge (--cookies-from-browser); допишите ссылку (альтернатива Chrome).',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser edge '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: длительность в секундах (duration)',
    summary:
      'Длительность в секундах (число) без скачивания (--skip-download --print duration); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print duration '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: ширина (width)',
    summary:
      'Ширина выбранного формата в пикселях без скачивания (--skip-download --print width); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print width '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: высота (height)',
    summary:
      'Высота выбранного формата в пикселях без скачивания (--skip-download --print height); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print height '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: сводный битрейт (tbr)',
    summary:
      'Сводный битрейт выбранного формата (kbps) без скачивания (--skip-download --print tbr); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print tbr '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: аудиобитрейт (abr)',
    summary:
      'Аудио-битрейт выбранного формата (kbps) без скачивания (--skip-download --print abr); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print abr '
  }
]
