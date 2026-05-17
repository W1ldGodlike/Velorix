import type { EngineId } from './engine-contract'
import type { DownloadsWindowUiLocale } from './downloads-window-ui-locale'

/** argv-токен: main подставляет абсолютный путь текущего превью (`isGrantedMediaPath`). */
export const TERMINAL_CURRENT_FILE_PLACEHOLDER = '__CURRENT_FILE__'

export type TerminalToolId = EngineId

export type TerminalCommandHintEntry = {
  token: string
  summary: string
  tool: TerminalToolId
  /** Если задано, щелчок по подсказке подставляет целую argv-строку вместо одного токена. */
  fullLine?: string
}

/** §8 — готовые строки для вкладки «Загрузки» (терминал рядом по workflow). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS: TerminalCommandHintEntry[] = [
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
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: видеобитрейт (vbr)',
    summary:
      'Видео-битрейт выбранного формата (kbps) без скачивания (--skip-download --print vbr); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print vbr '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: частота дискретизации (asr)',
    summary:
      'Частота дискретизации аудио (Hz) без скачивания (--skip-download --print asr); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print asr '
  },
  {
    tool: 'yt-dlp',
    token: '· только миниатюра',
    summary:
      'Только миниатюра без видео (--write-thumbnail --skip-download); файл .jpg или .webp рядом; допишите ссылку.',
    fullLine: 'yt-dlp --write-thumbnail --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· только авто-субтитры',
    summary:
      'Только авто-субтитры без видео (--write-auto-sub --skip-download); поможет проверить транскрипт; допишите ссылку.',
    fullLine: 'yt-dlp --write-auto-sub --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· описание в файле .description',
    summary:
      'Описание ролика в отдельный файл .description без видео (--write-description --skip-download); допишите ссылку.',
    fullLine: 'yt-dlp --write-description --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· ярлык (.url) на страницу',
    summary:
      'Файл-ярлык на страницу без видео (--write-url-link --skip-download); допишите ссылку.',
    fullLine: 'yt-dlp --write-url-link --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· проверка форматов',
    summary:
      'Проверка доступности выбранных форматов без полного скачивания (--check-formats); допишите ссылку.',
    fullLine: 'yt-dlp --check-formats '
  },
  {
    tool: 'yt-dlp',
    token: '· cookie из firefox',
    summary:
      'Сухой прогон с файлами cookie из Firefox (--cookies-from-browser); допишите ссылку (альтернатива Chrome и Edge).',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser firefox '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: защита контента (has_drm)',
    summary:
      'Флаг DRM и шифрования без скачивания (--skip-download --print has_drm); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print has_drm '
  },
  {
    tool: 'yt-dlp',
    token: '· допуск встраивания',
    summary:
      'Ограничения воспроизведения во встроенном плеере без скачивания (--skip-download --print playable_in_embed); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print playable_in_embed '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: ссылка канала (channel_url)',
    summary:
      'Ссылка на канал или плейлист без скачивания (--skip-download --print channel_url); допишите ссылку на ролик.',
    fullLine: 'yt-dlp --skip-download --print channel_url '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: идентификатор автора (uploader_id)',
    summary:
      'Идентификатор автора на площадке без скачивания (--skip-download --print uploader_id); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print uploader_id '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: был эфир (was_live)',
    summary:
      'Был ли эфир прямой трансляцией или записью стрима без скачивания (--skip-download --print was_live); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print was_live '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: тип медиа (media_type)',
    summary:
      'Тип медиа (видео или аудио и т. п.) без скачивания (--skip-download --print media_type); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print media_type '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: год релиза (release_year)',
    summary:
      'Год публикации (если есть) без скачивания (--skip-download --print release_year); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print release_year '
  },
  {
    tool: 'yt-dlp',
    token: '· tls без проверки сертификата -F',
    summary:
      'Список форматов при сбоях проверки TLS-сертификатов (--no-check-certificates -F); только для диагностики, снижает безопасность.',
    fullLine: 'yt-dlp --no-check-certificates -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: размер файла (filesize)',
    summary:
      'Размер файла выбранного формата (байты, если известен) без скачивания (--skip-download --print filesize); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print filesize '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: примечание к формату (format_note)',
    summary:
      'Поле примечания к формату (format_note) без скачивания (--skip-download --print format_note); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print format_note '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: субтитры (subtitles)',
    summary:
      'Словарь субтитров из метаданных без скачивания (--skip-download --print subtitles); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print subtitles '
  },
  {
    tool: 'yt-dlp',
    token: '· автосубтитры',
    summary:
      'Авто-субтитры и автоматическое распознавание речи (ASR) из метаданных без скачивания (--skip-download --print automatic_captions); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print automatic_captions '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: главы (chapters)',
    summary:
      'Главы из метаданных без скачивания (--skip-download --print chapters); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print chapters '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист: заголовок',
    summary:
      'Плоский плейлист: заголовок каждого элемента без глубокого извлечения (--flat-playlist --skip-download --print title); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --flat-playlist --skip-download --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: исходная ссылка (original_url)',
    summary:
      'Исходная ссылка запроса без скачивания (--skip-download --print original_url); сверка редиректов; допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print original_url '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: домен страницы (webpage_url_domain)',
    summary:
      'Домен страницы без скачивания (--skip-download --print webpage_url_domain); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print webpage_url_domain '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист: вывод идентификатора',
    summary:
      'Плоский плейлист: идентификатор (id) каждого элемента без глубокого извлечения (--flat-playlist --skip-download --print id); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --flat-playlist --skip-download --print id '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: индекс в плейлисте (playlist_index)',
    summary:
      'Индекс ролика в плейлисте (поле playlist_index) без скачивания (--skip-download --print playlist_index); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print playlist_index '
  },
  {
    tool: 'yt-dlp',
    token: '· запись субтитров',
    summary: 'Субтитры в файлы без видео (--write-sub --skip-download); допишите ссылку.',
    fullLine: 'yt-dlp --write-sub --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· запись комментариев',
    summary:
      'Комментарии в JSON без видео (--write-comments --skip-download); допишите ссылку (если поддерживается площадкой).',
    fullLine: 'yt-dlp --write-comments --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· прямая (-g), только лучшее аудио',
    summary:
      'Прямая ссылка только на лучший аудиоформат (-g -f bestaudio/best, то есть bestaudio либо best); без видео; допишите ссылку.',
    fullLine: 'yt-dlp -g -f bestaudio/best '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист: симуляция',
    summary:
      'Быстрая симуляция плейлиста без глубокого извлечения (--flat-playlist --simulate); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --flat-playlist --simulate '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: путь по шаблону -o (поле filepath)',
    summary:
      'Шаблон выходного пути по текущим -o без скачивания (--skip-download --print filepath); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print filepath '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: публикация по unix-эпохе (epoch)',
    summary:
      'Время публикации в секундах с эпохи Unix (epoch), если есть, без скачивания (--skip-download --print epoch); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print epoch '
  },
  {
    tool: 'yt-dlp',
    token: '· -6 -F',
    summary: 'Список форматов через IPv6 (-6 -F); если IPv4 глушится провайдером; допишите ссылку.',
    fullLine: 'yt-dlp -6 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист: вывод ссылок',
    summary:
      'Плоский плейлист: ссылка каждого элемента без глубокого извлечения (--flat-playlist --print url); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --flat-playlist --print url '
  },
  {
    tool: 'yt-dlp',
    token: '· запись страниц в html',
    summary:
      'Сохранить сырые HTML-страницы модуля извлечения (extractor) в .dump (--write-pages --skip-download); диагностика разметки и ответов 403; допишите ссылку.',
    fullLine: 'yt-dlp --write-pages --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: теплокарта просмотров (heatmap)',
    summary:
      'Данные тепловой карты просмотров (heatmap; если отдаёт площадка, напр. YouTube) без скачивания (--skip-download --print heatmap); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print heatmap '
  },
  {
    tool: 'yt-dlp',
    token: '· лимит скорости 1m',
    summary:
      'Ограничить скорость загрузки (~1 MiB/s) для диагностики сетей доставки (CDN) и таймаутов; при необходимости измените суффикс; допишите ссылку.',
    fullLine: 'yt-dlp --limit-rate 1M '
  },
  {
    tool: 'yt-dlp',
    token: '· повторы 10',
    summary:
      'Повторы HTTP и фрагментов для нестабильной сети (--retries 10 --fragment-retries 10); допишите ссылку и остальные ключи.',
    fullLine: 'yt-dlp --retries 10 --fragment-retries 10 '
  },
  {
    tool: 'yt-dlp',
    token: '· таймаут сокета 30 с',
    summary: 'Таймаут сокета 30 с против зависаний (--socket-timeout 30); допишите ссылку.',
    fullLine: 'yt-dlp --socket-timeout 30 '
  },
  {
    tool: 'yt-dlp',
    token: '· принудительно ipv4 -F',
    summary:
      'Список форматов только через IPv4 (--force-ipv4 -F); если -6 не подходит; допишите ссылку.',
    fullLine: 'yt-dlp --force-ipv4 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без черновика .part -F',
    summary:
      'Без временных .part (--no-part -F); локальный диск и сетевое хранилище (NAS); допишите ссылку.',
    fullLine: 'yt-dlp --no-part -F '
  },
  {
    tool: 'yt-dlp',
    token: '· параллельно фрагментов 4',
    summary:
      'Параллельная подкачка фрагментов потоков DASH и HLS (--concurrent-fragments 4); допишите ссылку и остальные ключи.',
    fullLine: 'yt-dlp --concurrent-fragments 4 '
  },
  {
    tool: 'yt-dlp',
    token: '· слияние в mkv',
    summary:
      'Слияние потоков в контейнер MKV при мультиплексировании (--merge-output-format mkv); допишите ссылку и -f …',
    fullLine: 'yt-dlp --merge-output-format mkv '
  },
  {
    tool: 'yt-dlp',
    token: '· предпочесть бесплатные -F',
    summary:
      'Список форматов с приоритетом свободных кодеков (--prefer-free-formats -F); допишите ссылку.',
    fullLine: 'yt-dlp --prefer-free-formats -F '
  },
  {
    tool: 'yt-dlp',
    token: '· сортировка форматов 720p -F',
    summary:
      'Сортировка форматов: сначала около 720p (--format-sort +res:720 -F); при необходимости поменяйте res; допишите ссылку.',
    fullLine: 'yt-dlp --format-sort +res:720 -F '
  },
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
    token: '· совместимость 2025 -F',
    summary: 'Совместимость с поведением yt-dlp 2025 (--compat-options 2025 -F); допишите ссылку.',
    fullLine: 'yt-dlp --compat-options 2025 -F '
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
  },
  {
    tool: 'yt-dlp',
    token: '· элементы плейлиста 1–10 -F',
    summary:
      'Только элементы плейлиста 1…10 (--playlist-items 1:10 -F); без полного разбора хвоста; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --playlist-items 1:10 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· слияние в webm',
    summary:
      'Слияние потоков в WebM при мультиплексировании (--merge-output-format webm); допишите ссылку и -f …',
    fullLine: 'yt-dlp --merge-output-format webm '
  },
  {
    tool: 'yt-dlp',
    token: '· нет форматов — не ошибка -F',
    summary:
      'Не падать, если форматов нет (--ignore-no-formats-error -F); диагностика геоблокировок, DRM и возрастных ограничений; допишите ссылку.',
    fullLine: 'yt-dlp --ignore-no-formats-error -F '
  },
  {
    tool: 'yt-dlp',
    token: '· не сохранять превью -F',
    summary:
      'Не сохранять миниатюру (thumbnail), даже если шаблон подразумевает (--no-write-thumbnail -F); допишите ссылку.',
    fullLine: 'yt-dlp --no-write-thumbnail -F '
  },
  {
    tool: 'yt-dlp',
    token: '· только аудио aac',
    summary: 'Извлечь аудио в AAC (--extract-audio --audio-format aac); допишите ссылку.',
    fullLine: 'yt-dlp --extract-audio --audio-format aac '
  },
  {
    tool: 'yt-dlp',
    token: '· не вшивать обложку',
    summary:
      'Не встраивать обложку в контейнер (--no-embed-thumbnail); противоположность --embed-thumbnail; допишите ссылку.',
    fullLine: 'yt-dlp --no-embed-thumbnail '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: заголовок',
    summary:
      'Записать (поле title) в рядом лежащий текстовый файл без скачивания (--print-to-file title flux-ytdlp-title.txt --skip-download); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file title flux-ytdlp-title.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· разрешить локальные file:-ссылки -F',
    summary:
      'Разрешить ссылки file:// в аргументах (--enable-file-urls -F); только для доверенных путей; допишите ссылку.',
    fullLine: 'yt-dlp --enable-file-urls -F '
  },
  {
    tool: 'yt-dlp',
    token: '· исходящий ip (привязка адреса) -F',
    summary:
      'Исходящий IP через bind (--source-address 198.51.100.2 -F, TEST-NET-2); допишите ссылку.',
    fullLine: 'yt-dlp --source-address 198.51.100.2 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: аннотации (annotations)',
    summary:
      'Сырые аннотации метаданных без скачивания (--skip-download --print annotations); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print annotations '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: раскадровки (storyboards)',
    summary:
      'Доски storyboard (если отдаёт площадка) без скачивания (--skip-download --print storyboards); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print storyboards '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовки глав sponsorblock',
    summary:
      'Сервис SponsorBlock: главы и шаблон заголовка сегмента (--sponsorblock-mark all --sponsorblock-chapter-title %(category)s); допишите ссылку.',
    fullLine: 'yt-dlp --sponsorblock-mark all --sponsorblock-chapter-title %(category)s '
  },
  {
    tool: 'yt-dlp',
    token: '· склейка плейлиста: никогда -F',
    summary:
      'Политика склейки плейлиста в один поток (--concat-playlist never -F); допишите ссылку.',
    fullLine: 'yt-dlp --concat-playlist never -F '
  },
  {
    tool: 'yt-dlp',
    token: '· постправка контейнера: только предупреждения -F',
    summary: 'Политика постправок контейнера после скачивания (--fixup warn -F); допишите ссылку.',
    fullLine: 'yt-dlp --fixup warn -F '
  },
  {
    tool: 'yt-dlp',
    token: '· только модуль youtube -F',
    summary: 'Ограничить набор модулей извлечения (--use-extractors youtube -F); допишите ссылку.',
    fullLine: 'yt-dlp --use-extractors youtube -F '
  },
  {
    tool: 'yt-dlp',
    token: '· поиск по умолчанию -F',
    summary:
      'Поиск по умолчанию, если ввод не похож на ссылку (--default-search auto: -F); допишите запрос.',
    fullLine: 'yt-dlp --default-search auto: -F '
  },
  {
    tool: 'yt-dlp',
    token: '· игнор динамики mpd -F',
    summary:
      'Игнорировать динамическое обновление манифеста DASH (MPD) (--ignore-dynamic-mpd -F); стабильнее на коротком окне; допишите ссылку.',
    fullLine: 'yt-dlp --ignore-dynamic-mpd -F '
  },
  {
    tool: 'yt-dlp',
    token: '· запасной api sponsorblock -F',
    summary:
      'Альтернативный адрес веб-API сервиса SponsorBlock (--sponsorblock-api https://sponsor.ajay.app -F) при сбоях сервера по умолчанию; допишите ссылку.',
    fullLine: 'yt-dlp --sponsorblock-api https://sponsor.ajay.app -F '
  },
  {
    tool: 'yt-dlp',
    token: '· пути к конфигам -F',
    summary:
      'Доп. файл конфигурации рядом с задачей (--config-locations yt-dlp.conf -F); создайте yt-dlp.conf при необходимости; допишите ссылку.',
    fullLine: 'yt-dlp --config-locations yt-dlp.conf -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mx (Мексика) -F',
    summary: 'Гео-обход с кодом страны MX (--geo-bypass-country MX -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MX -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео kr (Корея) -F',
    summary: 'Гео-обход с кодом страны KR (--geo-bypass-country KR -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country KR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео in (Индия) -F',
    summary: 'Гео-обход с кодом страны IN (--geo-bypass-country IN -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country IN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tr (Турция) -F',
    summary: 'Гео-обход с кодом страны TR (--geo-bypass-country TR -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео no (Норвегия) -F',
    summary: 'Гео-обход с кодом страны NO (--geo-bypass-country NO -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country NO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ch (Швейцария) -F',
    summary: 'Гео-обход с кодом страны CH (--geo-bypass-country CH -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовки клиента за прокси -F',
    summary:
      'Добавить заголовки X-Forwarded-For и X-Forwarded-Proto к HTTP (--xfwd -F); для обратного прокси и отладки запросов; допишите ссылку.',
    fullLine: 'yt-dlp --xfwd -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без cookie из браузера -F',
    summary:
      'Явно отключить подстановку cookie из браузера (--no-cookies-from-browser -F); если мешают профили браузера и переменные среды; допишите ссылку.',
    fullLine: 'yt-dlp --no-cookies-from-browser -F '
  },
  {
    tool: 'yt-dlp',
    token: '· аргументы ffmpeg для загрузчика -F',
    summary:
      'Доп. аргументы встроенному загрузчику на базе FFmpeg (--downloader-args ffmpeg:-nostdin -F); -nostdin отключает stdin у утилиты FFmpeg; допишите ссылку.',
    fullLine: 'yt-dlp --downloader-args ffmpeg:-nostdin -F '
  },
  {
    tool: 'yt-dlp',
    token: '· с рекламой -F',
    summary: 'Не вырезать рекламные вставки в плейлистах (--include-ads -F); допишите ссылку.',
    fullLine: 'yt-dlp --include-ads -F '
  },
  {
    tool: 'yt-dlp',
    token: '· двухфакторный код',
    summary:
      'TV Everywhere (ТВ по подписке провайдера) и двухфакторная проверка (2FA): одноразовый код (--twofactor 123456); замените на актуальный код TOTP (одноразовый по времени); допишите ссылку.',
    fullLine: 'yt-dlp --twofactor 123456 '
  },
  {
    tool: 'yt-dlp',
    token: '· пароль к видео',
    summary:
      'Пароль возрастного или закрытого видео (--video-password PASSWORD); замените PASSWORD на реальный; допишите ссылку.',
    fullLine: 'yt-dlp --video-password PASSWORD '
  },
  {
    tool: 'yt-dlp',
    token: '· tv everywhere — rogers -F',
    summary:
      'Идентификатор MSO в Adobe Pass для TV Everywhere (--ap-mso Rogers -F); подставьте своего провайдера; допишите ссылку.',
    fullLine: 'yt-dlp --ap-mso Rogers -F '
  },
  {
    tool: 'yt-dlp',
    token: '· tv everywhere — логин -F',
    summary:
      'Логин TV Everywhere (--ap-username user@example.com -F); замените на свой аккаунт; допишите ссылку.',
    fullLine: 'yt-dlp --ap-username user@example.com -F '
  },
  {
    tool: 'yt-dlp',
    token: '· параллельно загрузок 2 -F',
    summary:
      'Параллельные загрузки фрагментов и потоков (--concurrent-downloads 2 -F); подстройте число; допишите ссылку.',
    fullLine: 'yt-dlp --concurrent-downloads 2 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео nz (Новая Зеландия) -F',
    summary: 'Гео-обход с кодом страны NZ (--geo-bypass-country NZ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country NZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео za (ЮАР) -F',
    summary: 'Гео-обход с кодом страны ZA (--geo-bypass-country ZA -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country ZA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· tv everywhere — пароль',
    summary:
      'Пароль TV Everywhere и Adobe Pass (--ap-password PASSWORD); замените PASSWORD на реальный; допишите ссылку.',
    fullLine: 'yt-dlp --ap-password PASSWORD '
  },
  {
    tool: 'yt-dlp',
    token: '· клиентский сертификат (pem)',
    summary:
      'Клиентский TLS-сертификат (--client-certificate client.pem); положите PEM рядом с рабочим каталогом или укажите абсолютный путь без кавычек; допишите ссылку.',
    fullLine: 'yt-dlp --client-certificate client.pem '
  },
  {
    tool: 'yt-dlp',
    token: '· гео: прокси проверки -F',
    summary:
      'Прокси только для гео-проверки (--geo-verification-proxy … -F); замените хост и порт при необходимости; допишите ссылку.',
    fullLine: 'yt-dlp --geo-verification-proxy http://127.0.0.1:8888 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео at (Австрия) -F',
    summary: 'Гео-обход с кодом страны AT (--geo-bypass-country AT -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео dk (Дания) -F',
    summary: 'Гео-обход с кодом страны DK (--geo-bypass-country DK -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country DK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео fi (Финляндия) -F',
    summary: 'Гео-обход с кодом страны FI (--geo-bypass-country FI -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country FI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gr (Греция) -F',
    summary: 'Гео-обход с кодом страны GR (--geo-bypass-country GR -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео pt (Португалия) -F',
    summary: 'Гео-обход с кодом страны PT (--geo-bypass-country PT -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео be (Бельгия) -F',
    summary: 'Гео-обход с кодом страны BE (--geo-bypass-country BE -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ie (Ирландия) -F',
    summary: 'Гео-обход с кодом страны IE (--geo-bypass-country IE -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country IE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· ключ к сертификату (pem)',
    summary:
      'Приватный ключ к клиентскому TLS-сертификату (--client-certificate-key key.pem); положите PEM рядом с рабочим каталогом или укажите путь без кавычек; допишите ссылку.',
    fullLine: 'yt-dlp --client-certificate-key key.pem '
  },
  {
    tool: 'yt-dlp',
    token: '· tls как у firefox -F',
    summary:
      'TLS и HTTP: отпечаток как у Firefox (--impersonate firefox -F); помогает обходить антибот-защиту; допишите ссылку.',
    fullLine: 'yt-dlp --impersonate firefox -F '
  },
  {
    tool: 'yt-dlp',
    token: '· tls как у edge -F',
    summary:
      'TLS и HTTP: отпечаток как у Edge (--impersonate edge -F); помогает обходить антибот-защиту; допишите ссылку.',
    fullLine: 'yt-dlp --impersonate edge -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cz (Чехия) -F',
    summary: 'Гео-обход с кодом страны CZ (--geo-bypass-country CZ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео hu (Венгрия) -F',
    summary: 'Гео-обход с кодом страны HU (--geo-bypass-country HU -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country HU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ro (Румыния) -F',
    summary: 'Гео-обход с кодом страны RO (--geo-bypass-country RO -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country RO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bg (Болгария) -F',
    summary: 'Гео-обход с кодом страны BG (--geo-bypass-country BG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео hr (Хорватия) -F',
    summary: 'Гео-обход с кодом страны HR (--geo-bypass-country HR -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country HR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео lv (Латвия) -F',
    summary: 'Гео-обход с кодом страны LV (--geo-bypass-country LV -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country LV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео lt (Литва) -F',
    summary: 'Гео-обход с кодом страны LT (--geo-bypass-country LT -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country LT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ee (Эстония) -F',
    summary: 'Гео-обход с кодом страны EE (--geo-bypass-country EE -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country EE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео is (Исландия) -F',
    summary: 'Гео-обход с кодом страны IS (--geo-bypass-country IS -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country IS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· превью png',
    summary:
      'Конвертировать обложку в PNG при скачивании (--convert-thumbnails png); допишите ссылку и ключи вывода.',
    fullLine: 'yt-dlp --convert-thumbnails png '
  },
  {
    tool: 'yt-dlp',
    token: '· аудио opus',
    summary:
      'Извлечь аудио в Opus (--extract-audio --audio-format opus); допишите ссылку и ключи вывода.',
    fullLine: 'yt-dlp --extract-audio --audio-format opus '
  },
  {
    tool: 'yt-dlp',
    token: '· аудио flac',
    summary:
      'Извлечь аудио в FLAC без потерь (--extract-audio --audio-format flac); допишите ссылку и ключи вывода.',
    fullLine: 'yt-dlp --extract-audio --audio-format flac '
  },
  {
    tool: 'yt-dlp',
    token: '· аудио wav',
    summary:
      'Извлечь аудио в WAV (--extract-audio --audio-format wav); допишите ссылку и ключи вывода.',
    fullLine: 'yt-dlp --extract-audio --audio-format wav '
  },
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
  },
  {
    tool: 'yt-dlp',
    token: '· подробный вывод -F',
    summary:
      'Подробный журнал yt-dlp при списке форматов (--verbose -F); диагностика модуля извлечения (extractor); допишите ссылку.',
    fullLine: 'yt-dlp --verbose -F '
  },
  {
    tool: 'yt-dlp',
    token: '· обрезка длинных имён -F',
    summary:
      'Обрезать слишком длинные имена файлов (--trim-filenames 180 -F); сетевые хранилища (NAS) и ограничение длины полного пути в Windows (около 260 символов, MAX_PATH); допишите ссылку.',
    fullLine: 'yt-dlp --trim-filenames 180 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· hls по разрывам -F',
    summary:
      'HLS: резать плейлист по границам разрыва (метка разрыва discontinuity в плейлисте, --hls-split-discontinuity -F); стабильнее MPEG-TS-сегменты; допишите ссылку.',
    fullLine: 'yt-dlp --hls-split-discontinuity -F '
  },
  {
    tool: 'yt-dlp',
    token: '· буфер динам. mpd -F',
    summary:
      'DASH: буфер динамического манифеста MPD в секундах (--dynamic-mpd-buffer-size 100 -F); «живые» манифесты; допишите ссылку.',
    fullLine: 'yt-dlp --dynamic-mpd-buffer-size 100 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без сырой разметки html -F',
    summary:
      'Не сохранять сырые HTML-страницы модуля извлечения (extractor) (--no-write-pages -F); чище диск при -F; допишите ссылку.',
    fullLine: 'yt-dlp --no-write-pages -F '
  },
  {
    tool: 'yt-dlp',
    token: '· таймаут сокета 120 с -F',
    summary:
      'Таймаут сокета 120 с (--socket-timeout 120 -F); очень медленные сети доставки (CDN) и прокси; допишите ссылку.',
    fullLine: 'yt-dlp --socket-timeout 120 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· сорт -S: ~1080p av1 -F',
    summary:
      'Сортировка форматов: приоритет ~1080p и AV1 (-S +res:1080,+codec:av01 -F); подстройте res и codec; допишите ссылку.',
    fullLine: 'yt-dlp -S +res:1080,+codec:av01 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· сорт -S: ~5 Мбит/с 720p -F',
    summary:
      'Сортировка: битрейт ~5 Mbit/s и около 720p (-S +br:5000000,+res:720 -F); диагностика выбора -f; допишите ссылку.',
    fullLine: 'yt-dlp -S +br:5000000,+res:720 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без прогресс-бара -F',
    summary:
      'Список форматов без прогресс-бара (--hide-progress -F); чище вывод в терминале; допишите ссылку.',
    fullLine: 'yt-dlp --hide-progress -F '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист: последний -F',
    summary:
      'Только последний элемент плейлиста и список форматов (--playlist-items -1 -F); хвост плейлиста без полного разбора; допишите ссылку.',
    fullLine: 'yt-dlp --playlist-items -1 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: жанры (genres)',
    summary:
      'Жанры и теги без скачивания (--skip-download --print genres); музыка и каталоги; допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print genres '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: актёрский состав (cast)',
    summary:
      'Актёрский состав (cast) без скачивания (--skip-download --print cast); если отдаёт площадка; допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print cast '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист: эл. 2–4 -F',
    summary:
      'Фрагмент плейлиста: только элементы 2…4 (--playlist-items 2:4 -F); середина без начала и конца; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --playlist-items 2:4 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· постпроц.: ffmpeg, 1 поток -F',
    summary:
      'Дополнительные аргументы постпроцессору FFmpeg через --ppa (FFmpeg:-threads:1 -F); в списке аргументов без кавычек (как в argv); допишите ссылку.',
    fullLine: 'yt-dlp --ppa FFmpeg:-threads:1 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· явно плейлист -F',
    summary:
      'Явно развернуть плейлист и показать форматы (--yes-playlist -F); когда по ссылке выглядит как один ролик, но это плейлист; допишите ссылку.',
    fullLine: 'yt-dlp --yes-playlist -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ad (Андорра) -F',
    summary: 'Гео-обход через Андорру (--geo-bypass-country AD -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mc (Монако) -F',
    summary: 'Гео-обход через Монако (--geo-bypass-country MC -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео li (Лихтенштейн) -F',
    summary: 'Гео-обход через Лихтенштейн (--geo-bypass-country LI -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country LI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sm (Сан-Марино) -F',
    summary: 'Гео-обход через Сан-Марино (--geo-bypass-country SM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео va (Ватикан) -F',
    summary: 'Гео-обход через Ватикан (--geo-bypass-country VA -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country VA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gi (Гибралтар) -F',
    summary: 'Гео-обход через Гибралтар (--geo-bypass-country GI -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео je (Джерси) -F',
    summary: 'Гео-обход через Джерси (--geo-bypass-country JE -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country JE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gg (Гернси) -F',
    summary: 'Гео-обход через Гернси (--geo-bypass-country GG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео im (Остров Мэн) -F',
    summary: 'Гео-обход через Остров Мэн (--geo-bypass-country IM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country IM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео fo (Фареры) -F',
    summary: 'Гео-обход через Фарерские острова (--geo-bypass-country FO -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country FO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gl (Гренландия) -F',
    summary: 'Гео-обход через Гренландию (--geo-bypass-country GL -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· проверка всех ссылок -F',
    summary:
      'Проверить все HTTP-ссылки фрагментов перед загрузкой (--check-all-urls -F); диагностика кодов 403 и 410 на потоках HLS и DASH; допишите ссылку.',
    fullLine: 'yt-dlp --check-all-urls -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без лимита имён win -F',
    summary:
      'Отключить санитизацию имён под Windows (--no-windows-filenames -F); как в POSIX-шаблонах -o; допишите ссылку.',
    fullLine: 'yt-dlp --no-windows-filenames -F '
  },
  {
    tool: 'yt-dlp',
    token: '· подмена в title (_→-) -F',
    summary:
      'Замена в метаданных до имени файла (--replace-in-metadata title,_,- — подчёркивание → дефис); допишите ссылку.',
    fullLine: 'yt-dlp --replace-in-metadata title,_,- -F '
  },
  {
    tool: 'yt-dlp',
    token: '· один ролик: симуляция',
    summary:
      'Сухой прогон одного ролика по ссылке на плейлист (--no-playlist --simulate); без файлов; допишите ссылку.',
    fullLine: 'yt-dlp --no-playlist --simulate '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: число дизлайков (dislike_count)',
    summary:
      'Счётчик дизлайков без скачивания (--skip-download --print dislike_count; часто NA); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --print dislike_count '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист: длительность',
    summary:
      'Плоский плейлист: длительность каждого элемента без глубокого извлечения (--flat-playlist --skip-download --print duration); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --flat-playlist --skip-download --print duration '
  },
  {
    tool: 'yt-dlp',
    token: '· список модулей с описанием',
    summary:
      'Имена и краткие описания модулей извлечения (extractors) в выводе; ссылка в команде не нужна (--list-extractor-descriptions); справка по поддерживаемым сайтам.',
    fullLine: 'yt-dlp --list-extractor-descriptions'
  },
  {
    tool: 'yt-dlp',
    token: '· трассировка сети и tls -F',
    summary:
      'Печать HTTP и TLS трафика в stderr (--print-traffic -F); очень подробный вывод, только диагностика; допишите ссылку.',
    fullLine: 'yt-dlp --print-traffic -F '
  },
  {
    tool: 'yt-dlp',
    token: '· аудио → vorbis',
    summary:
      'Извлечь аудио в Ogg Vorbis (--extract-audio --audio-format vorbis); допишите ссылку и шаблон -o при необходимости.',
    fullLine: 'yt-dlp --extract-audio --audio-format vorbis '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id ролика',
    summary:
      'Записать идентификатор ролика (поле id) в flux-ytdlp-id.txt без скачивания (--print-to-file id …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file id flux-ytdlp-id.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· без самообновления -F',
    summary:
      'Запретить автообновление yt-dlp (self-update), даже если оно включено (--no-update -F); фиксируем версию из поставки; допишите ссылку.',
    fullLine: 'yt-dlp --no-update -F '
  },
  {
    tool: 'yt-dlp',
    token: '· консоль без цветного вывода (--no-color) -F',
    summary:
      'Вывод без цветов ANSI (--no-color -F); удобнее парсить или для непрерывной интеграции (CI); допишите ссылку.',
    fullLine: 'yt-dlp --no-color -F '
  },
  {
    tool: 'yt-dlp',
    token: '· цвет ansi всегда включён -F',
    summary:
      'Принудительно цвета ANSI в выводе (--color always -F); даже когда stdout не интерактивный терминал (не TTY); допишите ссылку.',
    fullLine: 'yt-dlp --color always -F '
  },
  {
    tool: 'yt-dlp',
    token: '· недостижимые форматы тоже в списке -F',
    summary:
      'Разрешить «недостижимые» форматы в листинге (--allow-unplayable-formats -F); диагностика DRM и недоступного контента; допишите ссылку.',
    fullLine: 'yt-dlp --allow-unplayable-formats -F '
  },
  {
    tool: 'yt-dlp',
    token: '· аудио → alac',
    summary:
      'Извлечь аудио в Apple Lossless (--extract-audio --audio-format alac); допишите ссылку и -o при необходимости.',
    fullLine: 'yt-dlp --extract-audio --audio-format alac '
  },
  {
    tool: 'yt-dlp',
    token: '· аудио → ac-3',
    summary:
      'Извлечь аудио в Dolby Digital AC-3 (--extract-audio --audio-format ac3); допишите ссылку.',
    fullLine: 'yt-dlp --extract-audio --audio-format ac3 '
  },
  {
    tool: 'yt-dlp',
    token: '· аудио, кач. макс. (q0)',
    summary:
      'Извлечь аудио с максимальным качеством постпроцессора (--audio-quality 0 --extract-audio); допишите ссылку и -f при необходимости.',
    fullLine: 'yt-dlp --audio-quality 0 --extract-audio '
  },
  {
    tool: 'yt-dlp',
    token: '· постпроц.: мультиплекс, 1 поток -F',
    summary:
      'Аргументы постпроцессора для FFmpeg (--postprocessor-args ffmpeg:-threads 1 -F); ограничить нагрузку при слиянии потоков (мультиплексировании); допишите ссылку.',
    fullLine: 'yt-dlp --postprocessor-args ffmpeg:-threads 1 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tw',
    summary: 'Гео-обход с кодом страны TW (--geo-bypass-country TW -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео md',
    summary: 'Гео-обход с кодом страны MD (--geo-bypass-country MD -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на страницу',
    summary:
      'Записать каноническую ссылку на страницу ролика (поле webpage_url) в flux-ytdlp-pageurl.txt без скачивания (--print-to-file …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file webpage_url flux-ytdlp-pageurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: длительность строкой',
    summary:
      'Записать длительность строкой HH:MM:SS (поле duration_string) в flux-ytdlp-durstr.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file duration_string flux-ytdlp-durstr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: автор',
    summary:
      'Записать имя автора (поле uploader) в flux-ytdlp-uploader.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file uploader flux-ytdlp-uploader.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на канал',
    summary:
      'Записать ссылку на канал или плейлист (поле channel_url) в flux-ytdlp-churl.txt без скачивания; допишите ссылку на ролик.',
    fullLine: 'yt-dlp --print-to-file channel_url flux-ytdlp-churl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео by',
    summary: 'Гео-обход с кодом страны BY (--geo-bypass-country BY -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео al',
    summary: 'Гео-обход с кодом страны AL (--geo-bypass-country AL -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mk',
    summary: 'Гео-обход с кодом страны MK (--geo-bypass-country MK -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MK -F '
  },
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
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: суммарный битрейт',
    summary:
      'Записать суммарный битрейт (поле tbr, kbps) в flux-ytdlp-tbr.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file tbr flux-ytdlp-tbr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: размер (прибл.)',
    summary:
      'Записать приблизительный размер файла (поле filesize_approx) в flux-ytdlp-fsize.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file filesize_approx flux-ytdlp-fsize.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: протокол',
    summary:
      'Записать протокол транспорта (поле protocol; варианты: https, m3u8 и т. п.) в flux-ytdlp-proto.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file protocol flux-ytdlp-proto.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· отклонить по title -F',
    summary:
      'Исключить элементы плейлиста по подстроке заголовка (--reject-title trailer -F); подстройте шаблон; допишите ссылку.',
    fullLine: 'yt-dlp --reject-title trailer -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео lc (Сент-Люсия) -F',
    summary: 'Гео-обход через Сент-Люсию (--geo-bypass-country LC -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country LC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gd (Гренада) -F',
    summary: 'Гео-обход через Гренаду (--geo-bypass-country GD -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео vc (Сент-Винсент) -F',
    summary:
      'Гео-обход через Сент-Винсент и Гренадины (--geo-bypass-country VC -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country VC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео kn (Сент-Китс и Невис) -F',
    summary: 'Гео-обход через Сент-Китс и Невис (--geo-bypass-country KN -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country KN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео dm (Доминика) -F',
    summary: 'Гео-обход через Доминику (--geo-bypass-country DM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country DM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: индекс в плейлисте',
    summary:
      'Записать индекс ролика в плейлисте (поле playlist_index) в flux-ytdlp-plidx.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist_index flux-ytdlp-plidx.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: автонумерация плейлиста',
    summary:
      'Записать авто-нумерацию плейлиста (поле playlist_autonumber) в flux-ytdlp-plauto.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file playlist_autonumber flux-ytdlp-plauto.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: число элементов плейлиста',
    summary:
      'Записать число элементов плейлиста (поле playlist_count) в flux-ytdlp-plcount.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file playlist_count flux-ytdlp-plcount.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id автора плейлиста',
    summary:
      'Записать идентификатор автора плейлиста (поле playlist_uploader_id) в flux-ytdlp-plupid.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist_uploader_id flux-ytdlp-plupid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id автора',
    summary:
      'Записать идентификатор автора на площадке (поле uploader_id) в flux-ytdlp-upid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file uploader_id flux-ytdlp-upid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: рейтинг',
    summary:
      'Записать среднюю оценку (поле average_rating) в flux-ytdlp-rating.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file average_rating flux-ytdlp-rating.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: доступность',
    summary:
      'Записать строку доступности (поле availability; частые значения: public — для всех, private — приватно, unlisted — только по ссылке, premium, needs_auth) в flux-ytdlp-avail.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file availability flux-ytdlp-avail.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: возрастной лимит',
    summary:
      'Записать возрастной лимит (поле age_limit) в flux-ytdlp-age.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file age_limit flux-ytdlp-age.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео aw (Аруба) -F',
    summary: 'Гео-обход через Арубу (--geo-bypass-country AW -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cw (Кюрасао) -F',
    summary: 'Гео-обход через Кюрасао (--geo-bypass-country CW -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sx (Синт-Мартен) -F',
    summary: 'Гео-обход через Синт-Мартен (--geo-bypass-country SX -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SX -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tc (Тёркс и Кайкос) -F',
    summary:
      'Гео-обход через острова Тёркс и Кайкос (--geo-bypass-country TC -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео vg (Британские Виргинские о-ва) -F',
    summary:
      'Гео-обход через Виргинские острова (Великобритания) (--geo-bypass-country VG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country VG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: домен страницы',
    summary:
      'Записать домен страницы ролика (поле webpage_url_domain) в flux-ytdlp-wudom.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file webpage_url_domain flux-ytdlp-wudom.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: исходная ссылка',
    summary:
      'Записать (поле original_url) (исходный запрос до редиректов) в flux-ytdlp-ourl.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file original_url flux-ytdlp-ourl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: аудиобитрейт',
    summary:
      'Записать средний битрейт аудио (поле abr; kbps) в flux-ytdlp-abr.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file abr flux-ytdlp-abr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: видеобитрейт',
    summary:
      'Записать средний битрейт видео (поле vbr; kbps) в flux-ytdlp-vbr.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file vbr flux-ytdlp-vbr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: размер файла',
    summary:
      'Записать (поле filesize) (байты, если известен) в flux-ytdlp-fszb.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file filesize flux-ytdlp-fszb.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: примечание к формату',
    summary:
      'Записать примечание к выбранному формату (поле format_note) в flux-ytdlp-fnote.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file format_note flux-ytdlp-fnote.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: автор плейлиста',
    summary:
      'Записать (поле playlist_uploader) (имя автора плейлиста) в flux-ytdlp-plup.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist_uploader flux-ytdlp-plup.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ag (Антигуа и Барбуда) -F',
    summary: 'Гео-обход через Антигуа и Барбуду (--geo-bypass-country AG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ms (Монтсеррат) -F',
    summary: 'Гео-обход через Монтсеррат (--geo-bypass-country MS -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ai (Ангилья) -F',
    summary: 'Гео-обход через Ангилью (--geo-bypass-country AI -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gp (Гваделупа) -F',
    summary: 'Гео-обход через Гваделупу (--geo-bypass-country GP -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GP -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bq (Карибские Нидерланды) -F',
    summary:
      'Гео-обход через Карибские Нидерланды: Бонайре, Синт-Эстатиус и Саба (--geo-bypass-country BQ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BQ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· макс. загрузок 5 -F',
    summary:
      'Остановка после N загрузок из плейлиста (--max-downloads 5 -F); подстройте число; допишите ссылку.',
    fullLine: 'yt-dlp --max-downloads 5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист: случайный порядок -F',
    summary:
      'Случайный порядок элементов плейлиста перед -F (--playlist-random -F); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --playlist-random -F '
  },
  {
    tool: 'yt-dlp',
    token: '· перезапись без вопроса -F',
    summary:
      'Перезапись существующих файлов без вопросов (--force-overwrites -F); допишите ссылку.',
    fullLine: 'yt-dlp --force-overwrites -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: полный заголовок',
    summary:
      'Записать полный заголовок (поле fulltitle) в flux-ytdlp-fulltitle.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file fulltitle flux-ytdlp-fulltitle.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: альтернативный заголовок',
    summary:
      'Записать альтернативный заголовок (поле alt_title) в flux-ytdlp-alttitle.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file alt_title flux-ytdlp-alttitle.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: исполнитель',
    summary:
      'Записать исполнителя (поле artist) в flux-ytdlp-artist.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file artist flux-ytdlp-artist.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: альбом',
    summary: 'Записать альбом (поле album) в flux-ytdlp-album.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file album flux-ytdlp-album.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: год релиза',
    summary:
      'Записать год релиза (поле release_year) в flux-ytdlp-relyear.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file release_year flux-ytdlp-relyear.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: эфир сейчас',
    summary:
      'Записать признак прямого эфира (поле is_live) в flux-ytdlp-islive.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file is_live flux-ytdlp-islive.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: статус эфира',
    summary:
      'Записать статус эфира (поле live_status) в flux-ytdlp-livestat.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file live_status flux-ytdlp-livestat.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: подписчики канала',
    summary:
      'Записать число подписчиков канала (поле channel_follower_count) в flux-ytdlp-chfol.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file channel_follower_count flux-ytdlp-chfol.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ck (о-ва Кука) -F',
    summary: 'Гео-обход через Острова Кука (--geo-bypass-country CK -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео nu (Ниуэ) -F',
    summary: 'Гео-обход через Ниуэ (--geo-bypass-country NU -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country NU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tk (Токелау) -F',
    summary: 'Гео-обход через Токелау (--geo-bypass-country TK -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео to (Тонга) -F',
    summary: 'Гео-обход через Тонга (--geo-bypass-country TO -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ws (Самоа) -F',
    summary: 'Гео-обход через Самоа (--geo-bypass-country WS -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country WS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· пропуск недоступных фрагментов -F',
    summary:
      'Потоки DASH и HLS: пропускать недоступные фрагменты вместо аварийной остановки (--skip-unavailable-fragments -F); допишите ссылку.',
    fullLine: 'yt-dlp --skip-unavailable-fragments -F '
  },
  {
    tool: 'yt-dlp',
    token: '· стоп при первой ошибке -F',
    summary:
      'Остановка при первой неустранимой ошибке (--abort-on-error -F); допишите ссылку на плейлист при необходимости.',
    fullLine: 'yt-dlp --abort-on-error -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: сериал',
    summary:
      'Записать (поле series) (шоу) в flux-ytdlp-series.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file series flux-ytdlp-series.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: номер сезона',
    summary:
      'Записать номер сезона (поле season_number) в flux-ytdlp-snum.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file season_number flux-ytdlp-snum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: номер эпизода',
    summary:
      'Записать номер эпизода (поле episode_number) в flux-ytdlp-epnum.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file episode_number flux-ytdlp-epnum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: название эпизода',
    summary:
      'Записать (поле episode) (строка площадки) в flux-ytdlp-epstr.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file episode flux-ytdlp-epstr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id эпизода',
    summary:
      'Записать идентификатор эпизода (поле episode_id) в flux-ytdlp-epid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file episode_id flux-ytdlp-epid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id сезона',
    summary:
      'Записать идентификатор сезона (поле season_id) в flux-ytdlp-sid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file season_id flux-ytdlp-sid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id канала плейлиста',
    summary:
      'Записать идентификатор канала плейлиста (поле playlist_channel_id) в flux-ytdlp-plchid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file playlist_channel_id flux-ytdlp-plchid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: частота дискретизации',
    summary:
      'Записать (поле asr) (Hz дискретизации аудио) в flux-ytdlp-asr.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file asr flux-ytdlp-asr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: защита контента (has_drm)',
    summary:
      'Записать признак DRM (поле has_drm) в flux-ytdlp-drm.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file has_drm flux-ytdlp-drm.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: встраивание в плеер',
    summary:
      'Записать ограничения встроенного плеера (поле playable_in_embed) в flux-ytdlp-embed.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file playable_in_embed flux-ytdlp-embed.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: был эфир',
    summary:
      'Записать признак «был эфир» (поле was_live) в flux-ytdlp-waslive.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file was_live flux-ytdlp-waslive.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: тип медиа',
    summary:
      'Записать тип медиа (поле media_type) в flux-ytdlp-mtype.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file media_type flux-ytdlp-mtype.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео pf (Французская Полинезия) -F',
    summary: 'Гео-обход через Французскую Полинезию (--geo-bypass-country PF -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео nc (Новая Каледония) -F',
    summary: 'Гео-обход через Новую Каледонию (--geo-bypass-country NC -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country NC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео fj (Фиджи) -F',
    summary: 'Гео-обход через Фиджи (--geo-bypass-country FJ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country FJ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео vu (Вануату) -F',
    summary: 'Гео-обход через Вануату (--geo-bypass-country VU -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country VU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sb (Соломоновы о-ва) -F',
    summary: 'Гео-обход через Соломоновы острова (--geo-bypass-country SB -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SB -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео fm (Микронезия) -F',
    summary:
      'Гео-обход через Федеративные Штаты Микронезии (--geo-bypass-country FM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country FM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mh (Маршалловы о-ва) -F',
    summary: 'Гео-обход через Маршалловы острова (--geo-bypass-country MH -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео pw (Палау) -F',
    summary: 'Гео-обход через Палау (--geo-bypass-country PW -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· не стоп при отклонении формата -F',
    summary:
      'Не останавливаться на отклонённом формате (--no-break-on-reject -F); допишите ссылку.',
    fullLine: 'yt-dlp --no-break-on-reject -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: тип записи',
    summary:
      'Записать тип объекта (поле _type: video, playlist и т. п.) в flux-ytdlp-otype.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file _type flux-ytdlp-otype.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на плейлист',
    summary:
      'Записать ссылку на плейлист (поле playlist_url) в flux-ytdlp-plurl.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist_url flux-ytdlp-plurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на манифест',
    summary:
      'Записать (поле manifest_url) (манифест HLS, DASH и др.) в flux-ytdlp-manurl.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file manifest_url flux-ytdlp-manurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: sar после растяжения кадра',
    summary:
      'Записать (поле stretched_ratio) (анаморфное растяжение кадра, если модуль извлечения отдаёт) в flux-ytdlp-sarfix.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file stretched_ratio flux-ytdlp-sarfix.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: запрошенные форматы',
    summary:
      'Записать (поле requested_formats) (JSON выбранных потоков) в flux-ytdlp-reqf.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file requested_formats flux-ytdlp-reqf.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео nr (Науру) -F',
    summary: 'Гео-обход через Науру (--geo-bypass-country NR -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country NR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tv (Тувалу) -F',
    summary: 'Гео-обход через Тувалу (--geo-bypass-country TV -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ki (Кирибати) -F',
    summary: 'Гео-обход через Кирибати (--geo-bypass-country KI -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country KI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео wf (Уоллис и Футуна) -F',
    summary: 'Гео-обход через Уоллис и Футуна (--geo-bypass-country WF -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country WF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· прогресс реже (Δ 5 с) -F',
    summary:
      'Реже обновлять строку прогресса (--progress-delta 5 -F); меньше шума в выводе при длинных списках с -F; допишите ссылку.',
    fullLine: 'yt-dlp --progress-delta 5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: список форматов',
    summary:
      'Записать список форматов (поле formats; JSON или текст от модуля извлечения) в flux-ytdlp-formats.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file formats flux-ytdlp-formats.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: прямая ссылка',
    summary:
      'Записать прямую ссылку на поток выбранного формата (поле url) в flux-ytdlp-url.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file url flux-ytdlp-url.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: миниатюры',
    summary:
      'Записать словарь миниатюр (поле thumbnails;, ссылки на обложки разных размеров) в flux-ytdlp-thumbs.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file thumbnails flux-ytdlp-thumbs.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: геометаданные',
    summary:
      'Записать (поле location) (местоположение из метаданных площадки) в flux-ytdlp-locmeta.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file location flux-ytdlp-locmeta.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ax (Аландские о-ва) -F',
    summary: 'Гео-обход через Аландские острова (--geo-bypass-country AX -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AX -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sj (Шпицберген и Ян-Майен) -F',
    summary: 'Гео-обход через Шпицберген и Ян-Майен (--geo-bypass-country SJ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SJ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sh (о. Вознесения) -F',
    summary: 'Гео-обход через остров Святой Елены (--geo-bypass-country SH -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· метаданные размера в расширенных атрибутах (xattr) -F',
    summary:
      'Писать ожидаемый размер файла в xattr где поддерживается ОС (--xattr-set-filesize -F); допишите ссылку.',
    fullLine: 'yt-dlp --xattr-set-filesize -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: эпоха публикации',
    summary:
      'Записать (поле epoch) (время публикации в UNIX, если модуль извлечения отдаёт) в flux-ytdlp-epoch.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file epoch flux-ytdlp-epoch.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: запрошенные субтитры',
    summary:
      'Записать (поле requested_subtitles) (JSON выбранных субтитров) в flux-ytdlp-reqsubs.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file requested_subtitles flux-ytdlp-reqsubs.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: канал плейлиста',
    summary:
      'Записать (поле playlist_channel) (имя канала плейлиста) в flux-ytdlp-plch.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist_channel flux-ytdlp-plch.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: число элементов',
    summary:
      'Записать (поле n_entries) (число элементов плейлиста) в flux-ytdlp-nent.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file n_entries flux-ytdlp-nent.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: дизлайки',
    summary:
      'Записать число дизлайков (поле dislike_count, часто NA) в flux-ytdlp-dislikes.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file dislike_count flux-ytdlp-dislikes.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· без метафайлов плейлиста -F',
    summary:
      'Не писать .info.json и .description рядом с плейлистом (--no-playlist-metafiles -F); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --no-playlist-metafiles -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bv (о. Буве) -F',
    summary: 'Гео-обход через остров Буве (--geo-bypass-country BV -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tf (Французские Южные территории) -F',
    summary:
      'Гео-обход через Французские Южные и Антарктические территории (--geo-bypass-country TF -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео hm (Херд и Макдональд) -F',
    summary:
      'Гео-обход через остров Херд и острова Макдональд (--geo-bypass-country HM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country HM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео io (Британская территория в Индийском океане) -F',
    summary:
      'Гео-обход через Британскую территорию в Индийском океане (--geo-bypass-country IO -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country IO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео pn (Питкэрн) -F',
    summary: 'Гео-обход через Питкэрн (--geo-bypass-country PN -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео aq (Антарктида) -F',
    summary: 'Гео-обход через Антарктиду (--geo-bypass-country AQ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AQ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gs (Южная Георгия) -F',
    summary:
      'Гео-обход через Южную Георгию и Южные Сандвичевы острова (--geo-bypass-country GS -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео pm (Сен-Пьер и Микелон) -F',
    summary: 'Гео-обход через Сен-Пьер и Микелон (--geo-bypass-country PM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: дата релиза',
    summary:
      'Записать (поле release_date) (поле YYYYMMDD) в flux-ytdlp-reldate.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file release_date flux-ytdlp-reldate.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: время изменения (unix)',
    summary:
      'Записать (поле modified_timestamp) (Unix, если модуль извлечения отдаёт) в flux-ytdlp-mts.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file modified_timestamp flux-ytdlp-mts.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: время загрузки (unix)',
    summary:
      'Записать (поле upload_timestamp) (Unix загрузки на площадку) в flux-ytdlp-upts.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file upload_timestamp flux-ytdlp-upts.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: соотношение сторон',
    summary:
      'Записать (поле aspect_ratio) (строка площадки) в flux-ytdlp-aspect.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file aspect_ratio flux-ytdlp-aspect.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: сорт эпизода',
    summary:
      'Записать (поле episode_sort) (сортировка эпизода в сериалах) в flux-ytdlp-epsort.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file episode_sort flux-ytdlp-epsort.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео fk (Фолкленды) -F',
    summary: 'Гео-обход через Фолклендские острова (--geo-bypass-country FK -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country FK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео eh (Западная Сахара) -F',
    summary: 'Гео-обход через Западную Сахару (--geo-bypass-country EH -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country EH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео dj (Джибути) -F',
    summary: 'Гео-обход через Джибути (--geo-bypass-country DJ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country DJ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео kg (Кыргызстан) -F',
    summary: 'Гео-обход через Киргизию (--geo-bypass-country KG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country KG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tj (Таджикистан) -F',
    summary: 'Гео-обход через Таджикистан (--geo-bypass-country TJ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TJ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео np (Непал) -F',
    summary: 'Гео-обход через Непал (--geo-bypass-country NP -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country NP -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео la (Лаос) -F',
    summary: 'Гео-обход через Лаос (--geo-bypass-country LA -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country LA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео kh (Камбоджа) -F',
    summary: 'Гео-обход через Камбоджу (--geo-bypass-country KH -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country KH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bn (Бруней) -F',
    summary: 'Гео-обход через Бруней (--geo-bypass-country BN -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: верификация канала',
    summary:
      'Записать (поле channel_is_verified) (флаг верификации канала) в flux-ytdlp-chverify.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file channel_is_verified flux-ytdlp-chverify.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: приватность',
    summary:
      'Записать (поле is_private) (признак приватного или ограниченного ролика) в flux-ytdlp-private.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file is_private flux-ytdlp-private.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: композиторы',
    summary:
      'Записать (поле composers) (если модуль извлечения отдаёт) в flux-ytdlp-composers.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file composers flux-ytdlp-composers.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: создатели',
    summary:
      'Записать (поле creators) (если модуль извлечения отдаёт) в flux-ytdlp-creators.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file creators flux-ytdlp-creators.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: номер трека',
    summary:
      'Записать (поле track_number) (номер трека в каталоге) в flux-ytdlp-trknum.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file track_number flux-ytdlp-trknum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mm (Мьянма) -F',
    summary: 'Гео-обход через Мьянму (--geo-bypass-country MM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bt (Бутан) -F',
    summary: 'Гео-обход через Бутан (--geo-bypass-country BT -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mv (Мальдивы) -F',
    summary: 'Гео-обход через Мальдивы (--geo-bypass-country MV -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mz (Мозамбик) -F',
    summary: 'Гео-обход через Мозамбик (--geo-bypass-country MZ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео zw (Зимбабве) -F',
    summary: 'Гео-обход через Зимбабве (--geo-bypass-country ZW -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country ZW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bw (Ботсвана) -F',
    summary: 'Гео-обход через Ботсвану (--geo-bypass-country BW -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео na (Намибия) -F',
    summary: 'Гео-обход через Намибию (--geo-bypass-country NA -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country NA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ls (Лесото) -F',
    summary: 'Гео-обход через Лесото (--geo-bypass-country LS -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country LS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mw (Малави) -F',
    summary: 'Гео-обход через Малави (--geo-bypass-country MW -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sz (Эсватини) -F',
    summary: 'Гео-обход через Эсватини (--geo-bypass-country SZ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: жанр',
    summary:
      'Записать (поле genre) (жанр, если модуль извлечения отдаёт) в flux-ytdlp-genre.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file genre flux-ytdlp-genre.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: тип альбома',
    summary:
      'Записать (поле album_type) (тип релиза: альбом, сингл и т. п.) в flux-ytdlp-albumtype.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file album_type flux-ytdlp-albumtype.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: лицензия',
    summary:
      'Записать (поле license) (лицензия, Creative Commons и т. п., если есть) в flux-ytdlp-license.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file license flux-ytdlp-license.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: трек',
    summary:
      'Записать (поле track) (номер трека как строка каталога) в flux-ytdlp-track.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file track flux-ytdlp-track.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: исполнитель альбома',
    summary:
      'Записать (поле album_artist) (альбомный исполнитель) в flux-ytdlp-albumartist.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file album_artist flux-ytdlp-albumartist.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: комментарий',
    summary:
      'Записать (поле comment) (комментарий площадки или автора, uploader comment) в flux-ytdlp-comment.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file comment flux-ytdlp-comment.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео td (Чад) -F',
    summary: 'Гео-обход через Чад (--geo-bypass-country TD -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ne (Нигер) -F',
    summary: 'Гео-обход через Нигер (--geo-bypass-country NE -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country NE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ml (Мали) -F',
    summary: 'Гео-обход через Мали (--geo-bypass-country ML -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country ML -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sn (Сенегал) -F',
    summary: 'Гео-обход через Сенегал (--geo-bypass-country SN -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ly (Ливия) -F',
    summary: 'Гео-обход через Ливию (--geo-bypass-country LY -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country LY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео so (Сомали) -F',
    summary: 'Гео-обход через Сомали (--geo-bypass-country SO -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео er (Эритрея) -F',
    summary: 'Гео-обход через Эритрею (--geo-bypass-country ER -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country ER -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ss (Южный Судан) -F',
    summary: 'Гео-обход через Южный Судан (--geo-bypass-country SS -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ye (Йемен) -F',
    summary: 'Гео-обход через Йемен (--geo-bypass-country YE -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country YE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mr (Мавритания) -F',
    summary: 'Гео-обход через Мавританию (--geo-bypass-country MR -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: текст песни',
    summary:
      'Записать (поле lyrics) (текст песни, если модуль извлечения отдаёт) в flux-ytdlp-lyrics.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file lyrics flux-ytdlp-lyrics.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: номер диска',
    summary:
      'Записать (поле disc_number) (номер диска в каталоге) в flux-ytdlp-discnum.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file disc_number flux-ytdlp-discnum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: издатель',
    summary:
      'Записать (поле publisher) (издатель и лейбл, если есть) в flux-ytdlp-publisher.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file publisher flux-ytdlp-publisher.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: настроение',
    summary:
      'Записать (поле mood) (настроение и тег настроения, если модуль извлечения отдаёт) в flux-ytdlp-mood.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file mood flux-ytdlp-mood.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cm (Камерун) -F',
    summary: 'Гео-обход через Камерун (--geo-bypass-country CM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ga (Габон) -F',
    summary: 'Гео-обход через Габон (--geo-bypass-country GA -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cg (Республика Конго) -F',
    summary: 'Гео-обход через Республику Конго (--geo-bypass-country CG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cd (ДР Конго) -F',
    summary: 'Гео-обход через ДР Конго (--geo-bypass-country CD -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cf (ЦАР) -F',
    summary: 'Гео-обход через ЦАР (--geo-bypass-country CF -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gq (Экваториальная Гвинея) -F',
    summary: 'Гео-обход через Экваториальную Гвинею (--geo-bypass-country GQ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GQ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео st (Сан-Томе и Принсипи) -F',
    summary: 'Гео-обход через Сан-Томе и Принсипи (--geo-bypass-country ST -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country ST -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bi (Бурунди) -F',
    summary: 'Гео-обход через Бурунди (--geo-bypass-country BI -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео rw (Руанда) -F',
    summary: 'Гео-обход через Руанду (--geo-bypass-country RW -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country RW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ug (Уганда) -F',
    summary: 'Гео-обход через Уганду (--geo-bypass-country UG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country UG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tz (Танзания) -F',
    summary: 'Гео-обход через Танзанию (--geo-bypass-country TZ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео zm (Замбия) -F',
    summary: 'Гео-обход через Замбию (--geo-bypass-country ZM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country ZM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: сортировка исполнителя',
    summary:
      'Записать (поле artist_sort) (сортировочное имя исполнителя) в flux-ytdlp-artistsort.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file artist_sort flux-ytdlp-artistsort.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: сортировка альбома',
    summary:
      'Записать (поле album_sort) (сортировочное имя альбома) в flux-ytdlp-albumsort.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file album_sort flux-ytdlp-albumsort.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: дирижёр',
    summary:
      'Записать (поле conductor) (дирижёр, если есть) в flux-ytdlp-conductor.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file conductor flux-ytdlp-conductor.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: исполнители',
    summary:
      'Записать (поле performers) (список исполнителей, если модуль извлечения отдаёт) в flux-ytdlp-performers.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file performers flux-ytdlp-performers.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: авторские права',
    summary:
      'Записать (поле copyright) (строка правообладателя) в flux-ytdlp-copy.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file copyright flux-ytdlp-copy.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на автора',
    summary:
      'Записать (поле uploader_url) (каноническая ссылка на страницу автора) в flux-ytdlp-upurl.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file uploader_url flux-ytdlp-upurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: продюсер',
    summary:
      'Записать producer (поле producer, если есть) в flux-ytdlp-producer.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file producer flux-ytdlp-producer.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: режиссёр',
    summary:
      'Записать (поле director) (режиссёр или автор видео, если модуль извлечения отдаёт) в flux-ytdlp-director.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file director flux-ytdlp-director.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· без предсборки путей -F',
    summary:
      'Не строить выходные пути до фактического скачивания (--no-build-paths -F); меньше лишних mkdir при -F; допишите ссылку.',
    fullLine: 'yt-dlp --no-build-paths -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bj (Бенин) -F',
    summary: 'Гео-обход через Бенин (--geo-bypass-country BJ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BJ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tg (Того) -F',
    summary: 'Гео-обход через Того (--geo-bypass-country TG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bf (Буркина-Фасо) -F',
    summary: 'Гео-обход через Буркина-Фасо (--geo-bypass-country BF -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ci (Кот-д\u2019Ивуар) -F',
    summary: "Гео-обход через Кот-д'Ивуар (--geo-bypass-country CI -F); допишите ссылку.",
    fullLine: 'yt-dlp --geo-bypass-country CI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео lr (Либерия) -F',
    summary: 'Гео-обход через Либерию (--geo-bypass-country LR -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country LR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sl (Сьерра-Леоне) -F',
    summary: 'Гео-обход через Сьерра-Леоне (--geo-bypass-country SL -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gn (Гвинея) -F',
    summary: 'Гео-обход через Гвинею (--geo-bypass-country GN -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gw (Гвинея-Бисау) -F',
    summary: 'Гео-обход через Гвинею-Бисау (--geo-bypass-country GW -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: аранжировщик',
    summary:
      'Записать (поле arranger) (аранжировка, если есть) в flux-ytdlp-arranger.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file arranger flux-ytdlp-arranger.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ремиксёр',
    summary:
      'Записать (поле remixer) (ремиксёр, если модуль извлечения отдаёт) в flux-ytdlp-remixer.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file remixer flux-ytdlp-remixer.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: звукорежиссёр',
    summary:
      'Записать (поле engineer) (звукорежиссёр или инженер записи, если есть) в flux-ytdlp-engineer.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file engineer flux-ytdlp-engineer.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: автор текста',
    summary:
      'Записать (поле lyricist) (автор текста, если есть) в flux-ytdlp-lyricist.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file lyricist flux-ytdlp-lyricist.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: группировка',
    summary:
      'Записать grouping (поле группировки треков, как в Apple Music и iTunes) в flux-ytdlp-grouping.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file grouping flux-ytdlp-grouping.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: сборник',
    summary:
      'Записать (поле compilation) (признак сборника, если модуль извлечения отдаёт) в flux-ytdlp-compilation.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file compilation flux-ytdlp-compilation.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: шоу',
    summary:
      'Записать (поле show) (название шоу или сериала, если модуль извлечения отдаёт) в flux-ytdlp-show.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file show flux-ytdlp-show.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: исполнители альбома',
    summary:
      'Записать (поле album_artists) (альбомные исполнители: сборники VA, приглашённые артисты feat. и т. п., если модуль извлечения отдаёт) в flux-ytdlp-albumartists.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file album_artists flux-ytdlp-albumartists.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: актёрский состав',
    summary:
      'Записать (поле cast) (актерский состав, если модуль извлечения отдаёт) в flux-ytdlp-cast.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file cast flux-ytdlp-cast.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: телесеть',
    summary:
      'Записать (поле network) (телесеть или студия вещания, если модуль извлечения отдаёт) в flux-ytdlp-network.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file network flux-ytdlp-network.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· лимит скорости 500k -F',
    summary:
      'Список форматов с ограничением скорости 500 KiB/s (--limit-rate 500K -F); меньше нагрузки на канал при -F; допишите ссылку.',
    fullLine: 'yt-dlp --limit-rate 500K -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sv (Сальвадор) -F',
    summary: 'Гео-обход через Сальвадор (--geo-bypass-country SV -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео hn (Гондурас) -F',
    summary: 'Гео-обход через Гондурас (--geo-bypass-country HN -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country HN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ni (Никарагуа) -F',
    summary: 'Гео-обход через Никарагуа (--geo-bypass-country NI -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country NI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gt (Гватемала) -F',
    summary: 'Гео-обход через Гватемалу (--geo-bypass-country GT -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bz (Белиз) -F',
    summary: 'Гео-обход через Белиз (--geo-bypass-country BZ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео do (Доминикана) -F',
    summary:
      'Гео-обход через Доминиканскую Республику (--geo-bypass-country DO -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country DO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ht (Гаити) -F',
    summary: 'Гео-обход через Гаити (--geo-bypass-country HT -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country HT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео xk (Косово) -F',
    summary: 'Гео-обход через Косово (--geo-bypass-country XK -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country XK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ve (Венесуэла) -F',
    summary: 'Гео-обход через Венесуэлу (--geo-bypass-country VE -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country VE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ec (Эквадор) -F',
    summary: 'Гео-обход через Эквадор (--geo-bypass-country EC -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country EC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео py (Парагвай) -F',
    summary: 'Гео-обход через Парагвай (--geo-bypass-country PY -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cu (Куба) -F',
    summary: 'Гео-обход через Кубу (--geo-bypass-country CU -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gy (Гайана) -F',
    summary: 'Гео-обход через Гайану (--geo-bypass-country GY -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sr (Суринам) -F',
    summary: 'Гео-обход через Суринам (--geo-bypass-country SR -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: схема ссылки страницы',
    summary:
      'Записать (поле webpage_url_scheme) (http и https страницы) в flux-ytdlp-wuscheme.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file webpage_url_scheme flux-ytdlp-wuscheme.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: плейлист',
    summary:
      'Записать (поле playlist) (имя элемента плейлиста, если модуль извлечения отдаёт) в flux-ytdlp-playlist.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist flux-ytdlp-playlist.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: аннотации',
    summary:
      'Записать (поле annotations) (если модуль извлечения отдаёт) в flux-ytdlp-annotations.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file annotations flux-ytdlp-annotations.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: раскадровки',
    summary:
      'Записать (поле storyboards) (доски превью, если модуль извлечения отдаёт) в flux-ytdlp-storyboards.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file storyboards flux-ytdlp-storyboards.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на страницу плейлиста',
    summary:
      'Записать ссылку на страницу плейлиста (поле playlist_webpage_url) в flux-ytdlp-plwpurl.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist_webpage_url flux-ytdlp-plwpurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· повторы запроса 20 -F',
    summary:
      'Список форматов с увеличенным числом повторов HTTP (--retries 20 -F); нестабильные сети доставки (CDN); допишите ссылку.',
    fullLine: 'yt-dlp --retries 20 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· повторы фрагментов 20 -F',
    summary:
      'Список форматов с повторами для фрагментов DASH и HLS (--fragment-retries 20 -F); допишите ссылку.',
    fullLine: 'yt-dlp --fragment-retries 20 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: метка времени',
    summary:
      'Записать (поле timestamp) (Unix-время публикации, если модуль извлечения отдаёт) в flux-ytdlp-ts.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file timestamp flux-ytdlp-ts.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ключ экстрактора',
    summary:
      'Записать (поле extractor_key) (внутренний ключ модуля извлечения) в flux-ytdlp-extkey.txt без скачивания; полезно для диагностики; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file extractor_key flux-ytdlp-extkey.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id трека',
    summary:
      'Записать (поле track_id) (идентификатор трека у модуля извлечения, если отдаёт) в flux-ytdlp-trackid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file track_id flux-ytdlp-trackid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id альбома',
    summary:
      'Записать (поле album_id) (идентификатор альбома, если модуль извлечения отдаёт) в flux-ytdlp-albumid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file album_id flux-ytdlp-albumid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: динамический диапазон',
    summary:
      'Записать динамический диапазон (поле dynamic_range: SDR, HDR, Dolby Vision — если модуль извлечения отдаёт) в flux-ytdlp-dynrange.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file dynamic_range flux-ytdlp-dynrange.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: расширение аудио',
    summary:
      'Записать расширение аудио (поле audio_ext) выбранного формата (m4a, webm, opus и т. п.) в flux-ytdlp-audext.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file audio_ext flux-ytdlp-audext.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: расширение видео',
    summary:
      'Записать расширение видео (поле video_ext) выбранного формата (mp4, webm, none и т. п.) в flux-ytdlp-vidext.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file video_ext flux-ytdlp-vidext.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на плеер',
    summary:
      'Записать (поле player_url) (ссылка на встраиваемый плеер, embed, если модуль извлечения отдаёт) в flux-ytdlp-playerurl.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file player_url flux-ytdlp-playerurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· параллельно 4 фрагмента -F',
    summary:
      'Список форматов с параллельной подкачкой фрагментов DASH и HLS (--concurrent-fragments 4 -F); допишите ссылку.',
    fullLine: 'yt-dlp --concurrent-fragments 4 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео re (Реюньон) -F',
    summary: 'Гео-обход через Реюньон (--geo-bypass-country RE -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country RE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mu (Маврикий) -F',
    summary: 'Гео-обход через Маврикий (--geo-bypass-country MU -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sc (Сейшелы) -F',
    summary: 'Гео-обход через Сейшелы (--geo-bypass-country SC -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tt (Тринидад и Тобаго) -F',
    summary: 'Гео-обход через Тринидад и Тобаго (--geo-bypass-country TT -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: каналы аудио',
    summary:
      'Записать число каналов аудио (поле audio_channels) в flux-ytdlp-achs.txt без скачивания (--print-to-file audio_channels …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file audio_channels flux-ytdlp-achs.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: глава',
    summary:
      'Записать (поле chapter) (название текущей главы) в flux-ytdlp-chapter.txt без скачивания (--print-to-file chapter …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file chapter flux-ytdlp-chapter.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id главы',
    summary:
      'Записать идентификатор главы (поле chapter_id) в flux-ytdlp-chapid.txt без скачивания (--print-to-file chapter_id …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file chapter_id flux-ytdlp-chapid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: номер главы',
    summary:
      'Записать номер главы (поле chapter_number) в flux-ytdlp-chapnum.txt без скачивания (--print-to-file chapter_number …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file chapter_number flux-ytdlp-chapnum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: время начала',
    summary:
      'Записать (поле start_time) (секунды начала фрагмента) в flux-ytdlp-stt.txt без скачивания (--print-to-file start_time …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file start_time flux-ytdlp-stt.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: время конца',
    summary:
      'Записать (поле end_time) (секунды окончания фрагмента) в flux-ytdlp-end.txt без скачивания (--print-to-file end_time …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file end_time flux-ytdlp-end.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: качество',
    summary:
      'Записать (поле quality) (оценка формата yt-dlp) в flux-ytdlp-quality.txt без скачивания (--print-to-file quality …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file quality flux-ytdlp-quality.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: таблица форматов',
    summary:
      'Записать (поле formats_table) (то, что показывает -F) в flux-ytdlp-ftbl.txt без скачивания (--print-to-file formats_table …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file formats_table flux-ytdlp-ftbl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео af (Афганистан) -F',
    summary: 'Гео-обход через Афганистан (--geo-bypass-country AF -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ao (Ангола) -F',
    summary: 'Гео-обход через Анголу (--geo-bypass-country AO -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео hk (Гонконг) -F',
    summary: 'Гео-обход через Гонконг (--geo-bypass-country HK -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country HK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео il (Израиль) -F',
    summary: 'Гео-обход через Израиль (--geo-bypass-country IL -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country IL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео kw (Кувейт) -F',
    summary: 'Гео-обход через Кувейт (--geo-bypass-country KW -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country KW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· чистый .info.json + -F',
    summary:
      'Чистить .info.json от приватных ссылок и токенов перед записью (--clean-info-json -F); допишите ссылку.',
    fullLine: 'yt-dlp --clean-info-json -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: строка формата',
    summary:
      'Записать человекочитаемую строку выбранного формата (поле format) в flux-ytdlp-fmtline.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file format flux-ytdlp-fmtline.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: предпочтение языка',
    summary:
      'Записать (поле language_preference) (предпочтение языка субтитров и аудио, если модуль извлечения отдаёт) в flux-ytdlp-langpref.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file language_preference flux-ytdlp-langpref.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: автонумерация',
    summary:
      'Записать (поле autonumber) (порядковый номер в плейлисте для шаблона -o) в flux-ytdlp-anum.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file autonumber flux-ytdlp-anum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео om (Оман) -F',
    summary: 'Гео-обход через Оман (--geo-bypass-country OM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country OM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео qa (Катар) -F',
    summary: 'Гео-обход через Катар (--geo-bypass-country QA -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country QA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bh (Бахрейн) -F',
    summary: 'Гео-обход через Бахрейн (--geo-bypass-country BH -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ae (ОАЭ) -F',
    summary: 'Гео-обход через ОАЭ (--geo-bypass-country AE -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sa (Саудовская Аравия) -F',
    summary: 'Гео-обход через Саудовскую Аравию (--geo-bypass-country SA -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: безопасное имя файла',
    summary:
      'Записать (поле filename_sanitized) (имя файла по шаблону -o после санитизации) в flux-ytdlp-fnsan.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file filename_sanitized flux-ytdlp-fnsan.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: запрошенные загрузки',
    summary:
      'Записать (поле requested_downloads) (список запланированных загрузок после слияния потоков) в flux-ytdlp-reqdl.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file requested_downloads flux-ytdlp-reqdl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· извлечение: до 5 повторов -F',
    summary:
      'Повторы модуля извлечения вместе со списком форматов (--extractor-retries 5 -F); ошибки страницы и кода 403; допишите ссылку.',
    fullLine: 'yt-dlp --extractor-retries 5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео jo (Иордания) -F',
    summary: 'Гео-обход через Иорданию (--geo-bypass-country JO -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country JO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео lb (Ливан) -F',
    summary: 'Гео-обход через Ливан (--geo-bypass-country LB -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country LB -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео uz (Узбекистан) -F',
    summary: 'Гео-обход через Узбекистан (--geo-bypass-country UZ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country UZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tm (Туркменистан) -F',
    summary: 'Гео-обход через Туркменистан (--geo-bypass-country TM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: дата изменения',
    summary:
      'Записать (поле modified_date) (YYYYMMDD правки метаданных, если модуль извлечения отдаёт) в flux-ytdlp-mdate.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file modified_date flux-ytdlp-mdate.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: заголовок эфира',
    summary:
      'Записать (поле live_title) (заголовок прямой трансляции, если есть) в flux-ytdlp-livetitle.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file live_title flux-ytdlp-livetitle.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· сетевой фрагмент 1 mib -F',
    summary:
      'Меньший HTTP-чанк 1 MiB (--http-chunk-size 1M -F); тонкая подстройка скорости и стабильности сетей доставки (CDN); допишите ссылку.',
    fullLine: 'yt-dlp --http-chunk-size 1M -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cv (Кабо-Верде) -F',
    summary: 'Гео-обход через Кабо-Верде (--geo-bypass-country CV -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gm (Гамбия) -F',
    summary: 'Гео-обход через Гамбию (--geo-bypass-country GM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео km (Коморы) -F',
    summary: 'Гео-обход через Коморы (--geo-bypass-country KM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country KM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: начало секции',
    summary:
      'Записать (поле section_start) (начало клипа по фрагменту в ссылке (#…) или параметру t=, если модуль извлечения отдаёт) в flux-ytdlp-segstart.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file section_start flux-ytdlp-segstart.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: конец секции',
    summary:
      'Записать (поле section_end) (конец клипа по фрагменту в ссылке (#…), если есть) в flux-ytdlp-segend.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file section_end flux-ytdlp-segend.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: число просмотров',
    summary:
      'Записать (поле played_count) (оценка числа воспроизведений, если сайт отдаёт) в flux-ytdlp-playcnt.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file played_count flux-ytdlp-playcnt.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: заголовок referer',
    summary:
      'Записать (поле referrer) (HTTP Referer страницы, если есть) в flux-ytdlp-refurl.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file referrer flux-ytdlp-refurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист наоборот -F',
    summary:
      'Плейлист в обратном порядке вместе со списком форматов (--playlist-reverse -F); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --playlist-reverse -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео yt (Майотта) -F',
    summary: 'Гео-обход через Майотту (--geo-bypass-country YT -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country YT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mg (Мадагаскар) -F',
    summary: 'Гео-обход через Мадагаскар (--geo-bypass-country MG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео pg (Папуа — Новая Гвинея) -F',
    summary: 'Гео-обход через Папуа — Новую Гвинею (--geo-bypass-country PG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PG -F '
  },
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
    token: '· заголовок ipv6-only',
    summary:
      'Заголовок без скачивания только по IPv6 (-6 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp -6 --skip-download --print title '
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
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок и архив загрузок',
    summary:
      'Заголовок без скачивания с файлом архива уже скачанного (--download-archive flux-terminal-archive.txt --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --download-archive flux-terminal-archive.txt --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· filename без перезаписи',
    summary:
      'Имя файла без скачивания и без перезаписи существующих (--no-overwrites --skip-download --print filename); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --no-overwrites --print filename '
  },
  {
    tool: 'yt-dlp',
    token: '· filename с перезаписью',
    summary:
      'Имя файла без скачивания с принудительной перезаписью (--force-overwrites --skip-download --print filename); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --force-overwrites --print filename '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок break-on-reject',
    summary:
      'Заголовок без скачивания с остановкой при отклонении формата (--break-on-reject --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --break-on-reject --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 7',
    summary:
      'Заголовок без скачивания с лимитом семи загрузок за прогон (--max-downloads 7 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 7 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 0.7',
    summary:
      'Заголовок без скачивания с паузой 0,7 с между HTTP-запросами (--sleep-requests 0.7 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 0.7 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 5',
    summary:
      'Заголовок без скачивания с пятью параллельными фрагментами DASH/HLS (--concurrent-fragments 5 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 5 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 6',
    summary:
      'Заголовок без скачивания с шестью повторами на фрагмент (--fragment-retries 6 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 6 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 45',
    summary:
      'Заголовок без скачивания с таймаутом сокета 45 с (--socket-timeout 45 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 45 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 4',
    summary:
      'Заголовок без скачивания с четырьмя повторами HTTP (--retries 4 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 4 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 750K',
    summary:
      'Заголовок без скачивания с ограничением скорости 750K (--limit-rate 750K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 750K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 3',
    summary:
      'Заголовок без скачивания с тремя повторами чтения и записи на диск (--file-access-retries 3 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 3 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass FR',
    summary:
      'Заголовок без скачивания с гео-обходом через регион FR (--geo-bypass-country FR --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country FR --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass JP print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион JP (--geo-bypass-country JP --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country JP --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 11',
    summary:
      'Заголовок без скачивания с лимитом одиннадцати загрузок за прогон (--max-downloads 11 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 11 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 1.1',
    summary:
      'Заголовок без скачивания с паузой 1,1 с между HTTP-запросами (--sleep-requests 1.1 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 1.1 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 8',
    summary:
      'Заголовок без скачивания с восемью параллельными фрагментами DASH/HLS (--concurrent-fragments 8 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 8 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 9',
    summary:
      'Заголовок без скачивания с девятью повторами на фрагмент (--fragment-retries 9 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 9 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 90',
    summary:
      'Заголовок без скачивания с таймаутом сокета 90 с (--socket-timeout 90 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 90 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 7',
    summary:
      'Заголовок без скачивания с семью повторами HTTP (--retries 7 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 7 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 1M print',
    summary:
      'Заголовок без скачивания с ограничением скорости 1M (--limit-rate 1M --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 1M --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 4',
    summary:
      'Заголовок без скачивания с четырьмя повторами извлечения (--extractor-retries 4 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 4 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 6',
    summary:
      'Заголовок без скачивания с шестью повторами чтения и записи на диск (--file-access-retries 6 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 6 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass US print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион US (--geo-bypass-country US --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country US --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass GB print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион GB (--geo-bypass-country GB --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country GB --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass IT print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион IT (--geo-bypass-country IT --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country IT --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 13',
    summary:
      'Заголовок без скачивания с лимитом тринадцати загрузок за прогон (--max-downloads 13 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 13 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 1.5',
    summary:
      'Заголовок без скачивания с паузой 1,5 с между HTTP-запросами (--sleep-requests 1.5 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 1.5 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 9',
    summary:
      'Заголовок без скачивания с девятью параллельными фрагментами DASH/HLS (--concurrent-fragments 9 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 9 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 11',
    summary:
      'Заголовок без скачивания с одиннадцатью повторами на фрагмент (--fragment-retries 11 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 11 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 120',
    summary:
      'Заголовок без скачивания с таймаутом сокета 120 с (--socket-timeout 120 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 120 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 8',
    summary:
      'Заголовок без скачивания с восемью повторами HTTP (--retries 8 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 8 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 400K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 400K (--limit-rate 400K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 400K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 5',
    summary:
      'Заголовок без скачивания с пятью повторами извлечения (--extractor-retries 5 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 5 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 7',
    summary:
      'Заголовок без скачивания с семью повторами чтения и записи на диск (--file-access-retries 7 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 7 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass ES print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион ES (--geo-bypass-country ES --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country ES --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass CA print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион CA (--geo-bypass-country CA --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country CA --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass AU print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион AU (--geo-bypass-country AU --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country AU --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass NL print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион NL (--geo-bypass-country NL --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country NL --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 15',
    summary:
      'Заголовок без скачивания с лимитом пятнадцати загрузок за прогон (--max-downloads 15 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 15 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 2',
    summary:
      'Заголовок без скачивания с паузой 2 с между HTTP-запросами (--sleep-requests 2 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 2 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 10',
    summary:
      'Заголовок без скачивания с десятью параллельными фрагментами DASH/HLS (--concurrent-fragments 10 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 10 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 12',
    summary:
      'Заголовок без скачивания с двенадцатью повторами на фрагмент (--fragment-retries 12 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 12 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 180',
    summary:
      'Заголовок без скачивания с таймаутом сокета 180 с (--socket-timeout 180 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 180 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 9',
    summary:
      'Заголовок без скачивания с девятью повторами HTTP (--retries 9 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 9 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 900K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 900K (--limit-rate 900K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 900K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 6',
    summary:
      'Заголовок без скачивания с шестью повторами извлечения (--extractor-retries 6 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 6 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 8',
    summary:
      'Заголовок без скачивания с восемью повторами чтения и записи на диск (--file-access-retries 8 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 8 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass SE print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион SE (--geo-bypass-country SE --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country SE --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass NO print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион NO (--geo-bypass-country NO --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country NO --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass PL print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион PL (--geo-bypass-country PL --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country PL --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass KR print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион KR (--geo-bypass-country KR --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country KR --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass MX print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион MX (--geo-bypass-country MX --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country MX --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 17',
    summary:
      'Заголовок без скачивания с лимитом семнадцати загрузок за прогон (--max-downloads 17 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 17 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 2.5',
    summary:
      'Заголовок без скачивания с паузой 2,5 с между HTTP-запросами (--sleep-requests 2.5 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 2.5 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 11',
    summary:
      'Заголовок без скачивания с одиннадцатью параллельными фрагментами DASH/HLS (--concurrent-fragments 11 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 11 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 13',
    summary:
      'Заголовок без скачивания с тринадцатью повторами на фрагмент (--fragment-retries 13 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 13 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 240',
    summary:
      'Заголовок без скачивания с таймаутом сокета 240 с (--socket-timeout 240 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 240 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 10',
    summary:
      'Заголовок без скачивания с десятью повторами HTTP (--retries 10 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 10 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 250K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 250K (--limit-rate 250K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 250K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 7',
    summary:
      'Заголовок без скачивания с семью повторами извлечения (--extractor-retries 7 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 7 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 9',
    summary:
      'Заголовок без скачивания с девятью повторами чтения и записи на диск (--file-access-retries 9 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 9 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass AR print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион AR (--geo-bypass-country AR --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country AR --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass CH print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион CH (--geo-bypass-country CH --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country CH --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass AT print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион AT (--geo-bypass-country AT --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country AT --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass BE print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион BE (--geo-bypass-country BE --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country BE --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass PT print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион PT (--geo-bypass-country PT --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country PT --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 19',
    summary:
      'Заголовок без скачивания с лимитом девятнадцати загрузок за прогон (--max-downloads 19 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 19 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 3',
    summary:
      'Заголовок без скачивания с паузой 3 с между HTTP-запросами (--sleep-requests 3 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 3 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 12',
    summary:
      'Заголовок без скачивания с двенадцатью параллельными фрагментами DASH/HLS (--concurrent-fragments 12 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 12 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 14',
    summary:
      'Заголовок без скачивания с четырнадцатью повторами на фрагмент (--fragment-retries 14 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 14 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 300',
    summary:
      'Заголовок без скачивания с таймаутом сокета 300 с (--socket-timeout 300 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 300 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 11',
    summary:
      'Заголовок без скачивания с одиннадцатью повторами HTTP (--retries 11 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 11 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 1200K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 1200K (--limit-rate 1200K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 1200K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 8',
    summary:
      'Заголовок без скачивания с восемью повторами извлечения (--extractor-retries 8 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 8 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 10',
    summary:
      'Заголовок без скачивания с десятью повторами чтения и записи на диск (--file-access-retries 10 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 10 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass GR print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион GR (--geo-bypass-country GR --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country GR --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass CZ print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион CZ (--geo-bypass-country CZ --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country CZ --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass IE print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион IE (--geo-bypass-country IE --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country IE --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass NZ print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион NZ (--geo-bypass-country NZ --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country NZ --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass FI print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион FI (--geo-bypass-country FI --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country FI --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 21',
    summary:
      'Заголовок без скачивания с лимитом двадцати одной загрузки за прогон (--max-downloads 21 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 21 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 3.5',
    summary:
      'Заголовок без скачивания с паузой 3,5 с между HTTP-запросами (--sleep-requests 3.5 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 3.5 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 13',
    summary:
      'Заголовок без скачивания с тринадцатью параллельными фрагментами DASH/HLS (--concurrent-fragments 13 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 13 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 15 print',
    summary:
      'Заголовок без скачивания с пятнадцатью повторами на фрагмент (--fragment-retries 15 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 15 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 360',
    summary:
      'Заголовок без скачивания с таймаутом сокета 360 с (--socket-timeout 360 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 360 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 12',
    summary:
      'Заголовок без скачивания с двенадцатью повторами HTTP (--retries 12 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 12 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 1100K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 1100K (--limit-rate 1100K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 1100K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 9',
    summary:
      'Заголовок без скачивания с девятью повторами извлечения (--extractor-retries 9 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 9 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 11',
    summary:
      'Заголовок без скачивания с одиннадцатью повторами чтения и записи на диск (--file-access-retries 11 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 11 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass DK print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион DK (--geo-bypass-country DK --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country DK --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass HU print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион HU (--geo-bypass-country HU --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country HU --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass RO print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион RO (--geo-bypass-country RO --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country RO --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass SG print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион SG (--geo-bypass-country SG --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country SG --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass TW print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион TW (--geo-bypass-country TW --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country TW --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 23',
    summary:
      'Заголовок без скачивания с лимитом двадцати трёх загрузок за прогон (--max-downloads 23 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 23 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 4',
    summary:
      'Заголовок без скачивания с паузой 4 с между HTTP-запросами (--sleep-requests 4 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 4 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 14',
    summary:
      'Заголовок без скачивания с четырнадцатью параллельными фрагментами DASH/HLS (--concurrent-fragments 14 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 14 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 16 print',
    summary:
      'Заголовок без скачивания с шестнадцатью повторами на фрагмент (--fragment-retries 16 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 16 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 420',
    summary:
      'Заголовок без скачивания с таймаутом сокета 420 с (--socket-timeout 420 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 420 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 13',
    summary:
      'Заголовок без скачивания с тринадцатью повторами HTTP (--retries 13 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 13 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 650K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 650K (--limit-rate 650K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 650K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 10',
    summary:
      'Заголовок без скачивания с десятью повторами извлечения (--extractor-retries 10 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 10 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 12',
    summary:
      'Заголовок без скачивания с двенадцатью повторами чтения и записи на диск (--file-access-retries 12 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 12 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass BR print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион BR (--geo-bypass-country BR --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country BR --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass TH print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион TH (--geo-bypass-country TH --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country TH --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass VN print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион VN (--geo-bypass-country VN --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country VN --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass ID print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион ID (--geo-bypass-country ID --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country ID --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass ZA print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион ZA (--geo-bypass-country ZA --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country ZA --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 25',
    summary:
      'Заголовок без скачивания с лимитом двадцати пяти загрузок за прогон (--max-downloads 25 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 25 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 4.5',
    summary:
      'Заголовок без скачивания с паузой 4,5 с между HTTP-запросами (--sleep-requests 4.5 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 4.5 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 15',
    summary:
      'Заголовок без скачивания с пятнадцатью параллельными фрагментами DASH/HLS (--concurrent-fragments 15 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 15 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 17 print',
    summary:
      'Заголовок без скачивания с семнадцатью повторами на фрагмент (--fragment-retries 17 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 17 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 480',
    summary:
      'Заголовок без скачивания с таймаутом сокета 480 с (--socket-timeout 480 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 480 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 14',
    summary:
      'Заголовок без скачивания с четырнадцатью повторами HTTP (--retries 14 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 14 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 550K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 550K (--limit-rate 550K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 550K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 11',
    summary:
      'Заголовок без скачивания с одиннадцатью повторами извлечения (--extractor-retries 11 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 11 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 13',
    summary:
      'Заголовок без скачивания с тринадцатью повторами чтения и записи на диск (--file-access-retries 13 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 13 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass CL print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион CL (--geo-bypass-country CL --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country CL --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass LY print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион LY (--geo-bypass-country LY --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country LY --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass UA print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион UA (--geo-bypass-country UA --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country UA --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass IL print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион IL (--geo-bypass-country IL --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country IL --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass PK print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион PK (--geo-bypass-country PK --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country PK --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 27',
    summary:
      'Заголовок без скачивания с лимитом двадцати семи загрузок за прогон (--max-downloads 27 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 27 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 5',
    summary:
      'Заголовок без скачивания с паузой 5 с между HTTP-запросами (--sleep-requests 5 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 5 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 16',
    summary:
      'Заголовок без скачивания с шестнадцатью параллельными фрагментами DASH/HLS (--concurrent-fragments 16 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 16 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 18',
    summary:
      'Заголовок без скачивания с восемнадцатью повторами на фрагмент (--fragment-retries 18 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 18 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 540',
    summary:
      'Заголовок без скачивания с таймаутом сокета 540 с (--socket-timeout 540 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 540 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 15',
    summary:
      'Заголовок без скачивания с пятнадцатью повторами HTTP (--retries 15 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 15 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 800K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 800K (--limit-rate 800K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 800K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 12',
    summary:
      'Заголовок без скачивания с двенадцатью повторами извлечения (--extractor-retries 12 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 12 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 14',
    summary:
      'Заголовок без скачивания с четырнадцатью повторами чтения и записи на диск (--file-access-retries 14 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 14 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass BD print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион BD (--geo-bypass-country BD --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country BD --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass NG print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион NG (--geo-bypass-country NG --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country NG --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass CO print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион CO (--geo-bypass-country CO --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country CO --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass PE print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион PE (--geo-bypass-country PE --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country PE --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass SA print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион SA (--geo-bypass-country SA --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country SA --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 29',
    summary:
      'Заголовок без скачивания с лимитом двадцати девяти загрузок за прогон (--max-downloads 29 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 29 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 5.5',
    summary:
      'Заголовок без скачивания с паузой 5,5 с между HTTP-запросами (--sleep-requests 5.5 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 5.5 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 17',
    summary:
      'Заголовок без скачивания с семнадцатью параллельными фрагментами DASH/HLS (--concurrent-fragments 17 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 17 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 19',
    summary:
      'Заголовок без скачивания с девятнадцатью повторами на фрагмент (--fragment-retries 19 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 19 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 600',
    summary:
      'Заголовок без скачивания с таймаутом сокета 600 с (--socket-timeout 600 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 600 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 16',
    summary:
      'Заголовок без скачивания с шестнадцатью повторами HTTP (--retries 16 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 16 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 700K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 700K (--limit-rate 700K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 700K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 13',
    summary:
      'Заголовок без скачивания с тринадцатью повторами извлечения (--extractor-retries 13 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 13 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 15',
    summary:
      'Заголовок без скачивания с пятнадцатью повторами чтения и записи на диск (--file-access-retries 15 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 15 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass SD print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион SD (--geo-bypass-country SD --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country SD --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass KE print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион KE (--geo-bypass-country KE --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country KE --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass PH print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион PH (--geo-bypass-country PH --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country PH --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass HR print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион HR (--geo-bypass-country HR --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country HR --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass SK print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион SK (--geo-bypass-country SK --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country SK --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 31',
    summary:
      'Заголовок без скачивания с лимитом тридцати одной загрузки за прогон (--max-downloads 31 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 31 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 6',
    summary:
      'Заголовок без скачивания с паузой 6 с между HTTP-запросами (--sleep-requests 6 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 6 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 18',
    summary:
      'Заголовок без скачивания с восемнадцатью параллельными фрагментами DASH/HLS (--concurrent-fragments 18 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 18 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 20',
    summary:
      'Заголовок без скачивания с двадцатью повторами на фрагмент (--fragment-retries 20 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 20 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 660',
    summary:
      'Заголовок без скачивания с таймаутом сокета 660 с (--socket-timeout 660 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 660 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 17',
    summary:
      'Заголовок без скачивания с семнадцатью повторами HTTP (--retries 17 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 17 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 950K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 950K (--limit-rate 950K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 950K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 14',
    summary:
      'Заголовок без скачивания с четырнадцатью повторами извлечения (--extractor-retries 14 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 14 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 16',
    summary:
      'Заголовок без скачивания с шестнадцатью повторами чтения и записи на диск (--file-access-retries 16 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 16 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass SI print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион SI (--geo-bypass-country SI --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country SI --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass LT print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион LT (--geo-bypass-country LT --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country LT --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass LV print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион LV (--geo-bypass-country LV --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country LV --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass EE print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион EE (--geo-bypass-country EE --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country EE --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass RS print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион RS (--geo-bypass-country RS --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country RS --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 33',
    summary:
      'Заголовок без скачивания с лимитом тридцати трёх загрузок за прогон (--max-downloads 33 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 33 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 6.5',
    summary:
      'Заголовок без скачивания с паузой 6,5 с между HTTP-запросами (--sleep-requests 6.5 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 6.5 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 19',
    summary:
      'Заголовок без скачивания с девятнадцатью параллельными фрагментами DASH/HLS (--concurrent-fragments 19 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 19 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 21',
    summary:
      'Заголовок без скачивания с двадцатью одним повтором на фрагмент (--fragment-retries 21 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 21 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 720',
    summary:
      'Заголовок без скачивания с таймаутом сокета 720 с (--socket-timeout 720 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 720 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 18',
    summary:
      'Заголовок без скачивания с восемнадцатью повторами HTTP (--retries 18 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 18 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 600K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 600K (--limit-rate 600K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 600K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 15',
    summary:
      'Заголовок без скачивания с пятнадцатью повторами извлечения (--extractor-retries 15 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 15 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 17',
    summary:
      'Заголовок без скачивания с семнадцатью повторами чтения и записи на диск (--file-access-retries 17 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 17 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass BG print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион BG (--geo-bypass-country BG --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country BG --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass MD print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион MD (--geo-bypass-country MD --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country MD --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass KZ print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион KZ (--geo-bypass-country KZ --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country KZ --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass UZ print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион UZ (--geo-bypass-country UZ --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country UZ --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass AZ print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион AZ (--geo-bypass-country AZ --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country AZ --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 35',
    summary:
      'Заголовок без скачивания с лимитом тридцати пяти загрузок за прогон (--max-downloads 35 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 35 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 7',
    summary:
      'Заголовок без скачивания с паузой 7 с между HTTP-запросами (--sleep-requests 7 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 7 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 20',
    summary:
      'Заголовок без скачивания с двадцатью параллельными фрагментами DASH/HLS (--concurrent-fragments 20 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 20 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 22',
    summary:
      'Заголовок без скачивания с двадцатью двумя повторами на фрагмент (--fragment-retries 22 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 22 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 780',
    summary:
      'Заголовок без скачивания с таймаутом сокета 780 с (--socket-timeout 780 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 780 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 19',
    summary:
      'Заголовок без скачивания с девятнадцатью повторами HTTP (--retries 19 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 19 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 520K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 520K (--limit-rate 520K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 520K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 16',
    summary:
      'Заголовок без скачивания с шестнадцатью повторами извлечения (--extractor-retries 16 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 16 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 18',
    summary:
      'Заголовок без скачивания с восемнадцатью повторами чтения и записи на диск (--file-access-retries 18 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 18 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass GE print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион GE (--geo-bypass-country GE --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country GE --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass AM print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион AM (--geo-bypass-country AM --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country AM --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass KG print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион KG (--geo-bypass-country KG --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country KG --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass TJ print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион TJ (--geo-bypass-country TJ --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country TJ --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass TM print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион TM (--geo-bypass-country TM --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country TM --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 51',
    summary:
      'Заголовок без скачивания с лимитом пятидесяти одной загрузки за прогон (--max-downloads 51 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 51 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 11',
    summary:
      'Заголовок без скачивания с паузой 11 с между HTTP-запросами (--sleep-requests 11 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 11 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 28',
    summary:
      'Заголовок без скачивания с двадцатью восемью параллельными фрагментами DASH/HLS (--concurrent-fragments 28 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 28 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 30',
    summary:
      'Заголовок без скачивания с тридцатью повторами на фрагмент (--fragment-retries 30 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 30 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 1260',
    summary:
      'Заголовок без скачивания с таймаутом сокета 1260 с (--socket-timeout 1260 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 1260 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 27',
    summary:
      'Заголовок без скачивания с двадцатью семью повторами HTTP (--retries 27 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 27 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 710K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 710K (--limit-rate 710K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 710K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 24',
    summary:
      'Заголовок без скачивания с двадцатью четырьмя повторами извлечения (--extractor-retries 24 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 24 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 26',
    summary:
      'Заголовок без скачивания с двадцатью шестью повторами чтения и записи на диск (--file-access-retries 26 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 26 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass NG print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион NG (--geo-bypass-country NG --socket-timeout 361 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country NG --socket-timeout 361 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass ZA print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион ZA (--geo-bypass-country ZA --socket-timeout 362 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country ZA --socket-timeout 362 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass MZ print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион MZ (--geo-bypass-country MZ --socket-timeout 363 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country MZ --socket-timeout 363 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass ZW print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион ZW (--geo-bypass-country ZW --socket-timeout 364 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country ZW --socket-timeout 364 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass BW print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион BW (--geo-bypass-country BW --socket-timeout 365 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country BW --socket-timeout 365 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· обновить yt-dlp → stable',
    summary: 'Обновить yt-dlp до стабильной ветки (--update-to stable); ссылка в команде не нужна.',
    fullLine: 'yt-dlp --update-to stable'
  }
]

/** §8 — ffprobe по текущему превью редактора (путь к файлу подставляется при запуске). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA: TerminalCommandHintEntry[] = [
  {
    tool: 'ffprobe',
    token: '· контейнер и дорожки',
    summary:
      'Полный отчёт утилиты ffprobe по текущему файлу превью; путь к медиа подставляется при запуске.',
    fullLine: `ffprobe -hide_banner -show_format -show_streams ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· длительность контейнера',
    summary:
      'Кратко: длительность, размер и битрейт (поля format: duration — длительность, size — размер в байтах, bit_rate — суммарный битрейт).',
    fullLine: `ffprobe -hide_banner -show_entries format=duration,size,bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы и сводка контейнера',
    summary:
      'Главы и метаданные контейнера (-show_chapters -show_format); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_format ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 кратко',
    summary:
      'Поток v:0: ширина, высота, частота кадров и формат пикселей (поля ffprobe: width — ширина кадра, height — высота кадра, r_frame_rate — номинальная частота кадров, pix_fmt — формат пикселей; одно поле на строку (шаблон default=nw=1)); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=width,height,r_frame_rate,pix_fmt -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 цвет',
    summary:
      'Поток v:0: цветовое пространство, первичные цвета и кривая переноса (поля ffprobe: color_space — цветовое пространство, color_primaries — первичные цвета, color_transfer — кривая переноса; диагностика HDR и SDR); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=color_space,color_primaries,color_transfer -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 битрейт и частота кадров',
    summary:
      'Поток v:0: битрейт и средняя частота кадров (поля ffprobe: bit_rate — битрейт дорожки, avg_frame_rate — средняя частота кадров; сверка с r_frame_rate из компактного шаблона); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=bit_rate,avg_frame_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 sar и dar',
    summary:
      'Поток v:0: SAR и DAR (поля ffprobe: sample_aspect_ratio — выборочное соотношение сторон пикселя, display_aspect_ratio — соотношение сторон кадра; анаморф и неквадратные пиксели); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=sample_aspect_ratio,display_aspect_ratio -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 кратко',
    summary:
      'Поток a:0: кодек, частота дискретизации и число каналов (поля ffprobe: codec_name — кодек, sample_rate — частота дискретизации, channels — число каналов; одно поле на строку (шаблон default=nw=1)); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 язык',
    summary:
      'Тег языка первой аудиодорожки (поле stream_tags.language); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream_tags=language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 икм (без сжатия)',
    summary:
      'Поток a:0: битность сэмпла и формат сэмпла (поля ffprobe: bits_per_sample — битность сэмпла, sample_fmt — формат сэмпла; PCM и глубина); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=bits_per_sample,sample_fmt -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 кратко',
    summary:
      'Поток s:0: кодек и строка тега кодека (поля ffprobe: codec_name — кодек, codec_tag_string — строка тега кодека; одно поле на строку (шаблон default=nw=1)); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· все дорожки (компактный формат)',
    summary:
      'Все дорожки одной строкой: индекс, тип и имя кодека (поля ffprobe: index — индекс дорожки, codec_type — тип (видео/аудио/субтитры), codec_name — имя кодека; вывод -of compact, компактная таблица); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries stream=index,codec_type,codec_name -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· дорожки и вложения',
    summary:
      'Все дорожки и теги имени файла и MIME (поля stream_tags: filename — имя вложения, mimetype — MIME-тип; вложения и шрифты MKV, типы data и attachment); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries stream=index,codec_type,codec_name:stream_tags=filename,mimetype -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер и дорожки, json',
    summary:
      'Сводка блоков format и streams в JSON (-of json); удобно скопировать в архив ZIP для поддержки или обработать утилитой jq.',
    fullLine: `ffprobe -hide_banner -of json -show_format -show_streams ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· только ошибки',
    summary:
      'Только ошибки контейнера или потока (-v error -show_error); пусто = файл читается без проблем.',
    fullLine: `ffprobe -hide_banner -v error -show_error ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги: заголовок и кодировщик',
    summary:
      'Теги контейнера: заголовок и кодировщик (поля format_tags: title — заголовок, encoder — кодировщик; ключ -show_entries format_tags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=title,encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 поле и диапазон',
    summary:
      'Поток v:0: порядок полей кадра и диапазон яркости (поля ffprobe: field_order — порядок полей кадра, color_range — диапазон яркости; чересстрочность и полный диапазон яркости — в терминах full range); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=field_order,color_range -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 теги',
    summary:
      'Поток s:0: теги заголовка и языка субтитров (поля stream_tags: title — заголовок дорожки, language — язык); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream_tags=title,language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 кратко',
    summary:
      'Вторая аудиодорожка a:1: кодек, частота дискретизации и каналы (поля ffprobe: codec_name, sample_rate, channels; мультиязык и комментарии); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 теги дорожки',
    summary:
      'Поток v:0: теги дорожки handler_name и encoder (поля stream_tags: имя обработчика и кодировщик; отдельно от тегов контейнера); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=handler_name,encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 кадры и длительность',
    summary:
      'Поток v:0: число кадров и длительность дорожки (поля ffprobe: nb_frames — оценка числа кадров, duration — длительность дорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=nb_frames,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: начало и длительность',
    summary:
      'Контейнер: start_time и duration на уровне format (поля format: смещение начала и длительность контейнера относительно дорожек); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:1 кратко',
    summary:
      'Вторая дорожка субтитров s:1: кодек и строка тега кодека (поля ffprobe: codec_name, codec_tag_string; несколько языков); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 профиль',
    summary:
      'Поток v:0: кодек, профиль и уровень (поля ffprobe: codec_name, profile, level — для транскодинга); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=codec_name,profile,level -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 профиль и битрейт',
    summary:
      'Поток a:0: кодек, профиль и битрейт (поля ffprobe: codec_name, profile, bit_rate); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=codec_name,profile,bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 опорные и двунаправленные кадры',
    summary:
      'Поток v:0: число опорных кадров и наличие B-кадров (поля ffprobe: refs — число опорных кадров, has_b_frames — есть ли двунаправленные кадры; сложность GOP); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=refs,has_b_frames -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· дорожки: атрибуты (все)',
    summary:
      'Все дорожки: индекс, тип и расклад (поля ffprobe: index, codec_type, блок disposition — default по умолчанию, forced принудительно, captions встроенные субтитры, attached_pic обложка); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries stream=index,codec_type,disposition -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: число потоков и имя формата',
    summary:
      'Контейнер: число потоков, программ и имя формата (поля format: nb_streams — число дорожек, nb_programs — число программ, format_name — имя формата); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=nb_streams,nb_programs,format_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 пересчёт кадров',
    summary:
      'Точный пересчёт кадров v:0 (-count_frames, поле ffprobe nb_read_frames — реально прочитанные кадры); медленно, но даёт реальный счёт; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 атрибуты дорожки',
    summary:
      'Поток a:0: раскладка дорожки disposition (поле ffprobe: default, forced, comment и др. — флаги назначения дорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 пиксели и цвет',
    summary:
      'Поток v:0: формат пикселей и цвет (поля ffprobe: pix_fmt — формат пикселей, color_space — цветовое пространство, color_range — диапазон яркости; контекст SDR и HDR без отдельного color_transfer); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=pix_fmt,color_space,color_range -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 размер кадра: хранение и отображение',
    summary:
      'Поток v:0: размеры хранения и отображения (поля ffprobe: coded_width и coded_height — сетка кодека, width и height — размер отображения; анаморф); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=coded_width,coded_height,width,height -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: время создания',
    summary:
      'Тег контейнера creation_time (поле format_tags: время записи файла или потока метаданных); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=creation_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 атрибуты дорожки',
    summary:
      'Поток s:0: disposition (поле ffprobe: default, forced, hearing_impaired для слабослышащих и т. д.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0: таймбаза и старт меток',
    summary:
      'Поток v:0: тактовая сетка и стартовая метка (поля ffprobe: time_base — знаменатель базы времени, start_pts — первый PTS дорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0: таймбаза и старт меток',
    summary:
      'Поток a:0: тактовая сетка и стартовая метка аудио (поля ffprobe: time_base — база времени, start_pts — смещение первого тика); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 битрейт и максимум',
    summary:
      'Поток v:0: битрейт и максимальный битрейт (поля ffprobe: bit_rate — средний, max_bit_rate — пик при VBR); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=bit_rate,max_bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: имя входа',
    summary:
      'Имя входа, которое видит демультиплексор (поле format.filename; путь к файлу); сверка пути и редиректов; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=filename -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 тег поворота',
    summary:
      'Устаревший тег поворота rotate в stream_tags (часто QuickTime и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=rotate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 расклад и битрейт',
    summary:
      'Поток a:0: расклад каналов и битрейт (поля ffprobe: channel_layout — строка расклада вроде stereo, bit_rate — битрейт дорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=channel_layout,bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: битрейт',
    summary:
      'Сводный битрейт контейнера (поле format.bit_rate и сверка с суммой дорожек); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 название и обработчик',
    summary:
      'Поток a:0: теги title и handler_name дорожки (поля stream_tags: название и обработчик дорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream_tags=title,handler_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 номинальная частота кадров',
    summary:
      'Только частота кадров r_frame_rate у видео v:0 (поле ffprobe: номинальная частота кадров; сверка с avg_frame_rate в других шаблонах); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=r_frame_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: бренды mp4/mov',
    summary:
      'Теги контейнера: основной бренд и совместимые бренды (поля format_tags: major_brand — основной бренд, compatible_brands — список совместимых; семейство MP4 и MOV); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=major_brand,compatible_brands -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:2 кратко',
    summary:
      'Третья дорожка субтитров s:2: кодек и строка тега кодека (поля ffprobe: codec_name, codec_tag_string); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:2 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0: встроенные субтитры и avc',
    summary:
      'Поток v:0: признаки субтитров и AVC (поля ffprobe: closed_captions — встроенные субтитры в потоке, is_avc — элементарный поток AVC; контекст CEA-608 и CEA-708); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=closed_captions,is_avc -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложение t:0 (контейнер mkv)',
    summary:
      'Первая вложенная дорожка t:0 (шрифты и обложки MKV): поля ffprobe codec_name и codec_tag_string; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:0 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· дорожка данных d:0',
    summary:
      'Первая data-дорожка d:0 (метаданные с привязкой ко времени и др.): поля ffprobe codec_name и codec_tag_string; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:0 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0: четырёхбуквенный тег кодека',
    summary:
      'Поток v:0: codec_tag_string (поле ffprobe: четырёхбуквенный идентификатор FourCC — бренд сырого кодека); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: оценка зондирования',
    summary:
      'Поле probe_score по контейнеру: насколько уверенно выбран демультиплексор; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=probe_score -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:2 кратко',
    summary:
      'Третья аудиодорожка a:2: кодек, частота дискретизации и каналы (поля ffprobe: codec_name, sample_rate, channels); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:2 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· дымовая проверка декода',
    summary:
      'Быстрый прогон декодера первых 10 с (-t 10), вывод в пустой мультиплексор (-f null); нагрузка на центральный процессор (CPU) и графический процессор (GPU).',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 10 -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· один кадр, пустой выход',
    summary:
      'Декод одного кадра с выводом в пустой мультиплексор (-f null, -frames:v 1); быстрее полной дымовой проверки на длинных файлах.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -frames:v 1 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: полное имя формата',
    summary:
      'Человекочитаемое имя контейнера (поле format.format_long_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=format_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 расположение цветности',
    summary:
      'Поток v:0: chroma_location (поле ffprobe: расположение субдискретизации цветности, напр. 4:2:0); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=chroma_location -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· программы в ts, компактно',
    summary:
      'MPEG-TS и M3U8: список программ демультиплексора (-show_programs, вывод -of compact, компактная таблица); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_programs -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 боковые данные дорожки',
    summary:
      'Поток v:0: боковые метаданные дорожки (поле side_data_list: матрица поворота Display Matrix, HDR и др.; вывод -of compact, компактная таблица); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=side_data_list -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы: таблица через запятую',
    summary:
      'Таблица глав построчно (-show_chapters, вывод -of csv — поля через запятую); без лишнего текста; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -of csv=p=0 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 начало и длительность',
    summary:
      'Поток v:0: start_time и duration дорожки (поля ffprobe: начало и длительность дорожки; сверка с format и смещениями); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 начало и длительность',
    summary:
      'Поток a:0: start_time и duration дорожки (поля ffprobe: начало и длительность аудио; рассинхрон с видео); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 битность сэмпла',
    summary:
      'Поток v:0: bits_per_raw_sample (поле ffprobe: глубина сырого сэмпла, 8, 10 или 12 бит и т. д.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=bits_per_raw_sample -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:1 кратко',
    summary:
      'Вторая видеодорожка v:1 (несколько ракурсов — редкий режим в контейнерах): кодек и размер кадра (поля ffprobe: codec_name, width, height); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:1 -show_entries stream=codec_name,width,height -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: размер и длительность',
    summary:
      'Контейнер: size и duration (поля format: размер файла и длительность; сверка с битрейтом и дорожками); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=size,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:1 кодек и язык',
    summary:
      'Вторая дорожка субтитров s:1: codec_name и тег stream_tags language (поля ffprobe: кодек дорожки и язык из stream_tags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=codec_name:stream_tags=language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 атрибуты дорожки',
    summary:
      'Вторая аудиодорожка a:1: disposition (поле ffprobe: forced, default и др. — флаги второй аудиодорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: тег языка',
    summary:
      'Тег языка контейнера (поле format_tags.language, если есть); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ремукс 5 с, пустой выход',
    summary:
      'Копирование потоков первых 5 с в пустой мультиплексор (-t 5 -c copy, -f null); дымовая проверка контейнера без перекодирования.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 5 -c copy -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· декод, игнор ошибок',
    summary:
      'Короткий декод с подавлением ошибок потока (-err_detect ignore_err -t 2); битые кадры и MPEG-TS; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -err_detect ignore_err -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 2 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги исполнитель и альбом',
    summary:
      'Теги контейнера artist и album (поля format_tags: исполнитель и альбом; аудиофайлы и мультимедиа); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=artist,album -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 средняя частота кадров',
    summary:
      'Поток v:0: только avg_frame_rate (поле ffprobe: средняя частота кадров; сверка с r_frame_rate в других шаблонах); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=avg_frame_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· аудио 3 с, пустой выход',
    summary:
      'Декодирование только аудио первых 3 с (-vn -sn); быстрее полной дымовой проверки на видеофайлах; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vn -sn -t 3 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 длинное имя кодека',
    summary:
      'Поток v:0: codec_long_name (поле ffprobe: человекочитаемое имя кодека); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· тег кодировщик (контейнер)',
    summary:
      'Тег контейнера encoder (поле format_tags.encoder — кодировщик контейнера); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:3 кратко',
    summary:
      'Четвёртая аудиодорожка a:3: кодек, частота дискретизации и каналы (поля ffprobe: codec_name, sample_rate, channels); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:3 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:3 кратко',
    summary:
      'Четвёртая дорожка субтитров s:3: кодек и строка тега кодека (поля ffprobe: codec_name, codec_tag_string); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:3 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· видео 2 с, пустой выход',
    summary:
      'Декодирование только видео первых 2 с (-an -sn); без аудио и субтитров; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -an -sn -t 2 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: удобочитаемый вывод',
    summary:
      'Секция format в удобочитаемом виде (-pretty -show_format); единицы и время форматированы; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -pretty -show_format ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: плоский вывод ключ=значение',
    summary:
      'Плоский вывод format ключ=значение (-of flat -show_format); удобно разбирать текстом (например, утилитами grep и awk); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -of flat -show_format ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 первые 5 пакетов',
    summary:
      'Первые 5 пакетов v:0 (-show_packets — пакеты потока, -read_intervals %+#5 — только первые пять, вывод -of compact, компактная таблица); метки времени и размеры; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#5 -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 первые 5 кадров',
    summary:
      'Первые 5 кадров v:0 (-show_frames — кадры декодера, -read_intervals %+#5 — только первые пять, вывод -of compact, компактная таблица); тип, размер и PTS; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#5 -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· сводка версии ffprobe',
    summary:
      'Версия ffprobe и быстрый разбор файла (-show_program_version); сверка сборки; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_program_version ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 первые 3 пакета',
    summary:
      'Первые 3 аудиопакета a:0 (поля пакета: PTS — метка времени, размер; вывод -of compact, компактная таблица); рваный MPEG-TS; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_packets -read_intervals %+#3 -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· декод после смещения 2 с',
    summary:
      'Дымовая проверка: декод с середины (-ss 10 -t 2); конец файла и индекс в длинных MP4; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -ss 10 -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 2 -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: громкость по стандарту ebu, 60с',
    summary:
      'Замер интегральной громкости фильтром loudnorm (print_format=summary — краткая сводка в stderr) за 60 с; -vn -sn; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af loudnorm=print_format=summary -t 60 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: комментарий и аннотация',
    summary:
      'Теги контейнера comment и synopsis (комментарий и краткая сводка в метаданных); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=comment,synopsis -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 таймбаза кодека',
    summary:
      'Поток s:0: таймбаза кодека и дорожки (поля ffprobe: codec_time_base — база времени кодека субтитров, time_base — база времени дорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=codec_time_base,time_base -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 размер доп. двоичника (extradata)',
    summary:
      'Поток v:0: extradata_size и initial_padding (поля ffprobe: размер декодер-заголовков extradata и начальный паддинг); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=extradata_size,initial_padding -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 битрейт',
    summary:
      'Первая дорожка субтитров s:0: битрейт (поле ffprobe bit_rate, если задан в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: длительность в тиках',
    summary:
      'Контейнер: duration_ts (поле format: длительность в тиках при знаменателе time_base); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=duration_ts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· тег авторские права',
    summary:
      'Тег контейнера copyright (поле format_tags=copyright — строка правообладателя); кто и когда задал; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=copyright -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0: битрейт и длительность (теги mkv)',
    summary:
      'MKV-статистика v:0: теги дорожки stream_tags BPS и DURATION (битрейт и длительность дорожки, если записаны mkvtoolnix); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=BPS,DURATION -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 длительность в теге',
    summary:
      'Поток s:0: теги дорожки stream_tags duration (длительность субтитров, если записана в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream_tags=duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· объём зондирования (байты)',
    summary:
      'Сколько байт ушло на зондирование демультиплексором (поле format.probe_size — объём прочитанных байт при зондировании); диагностика «глубины» анализа; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=probe_size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: dur_ts+tb+probe',
    summary:
      'Контейнер: duration_ts, time_base и probe_size одной командой (поля format: тики длительности, база времени и объём зондирования); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=duration_ts,time_base,probe_size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: start+timing',
    summary:
      'Контейнер: start_time, duration_ts, time_base и probe_size (поля format: смещение, тики длительности, база времени и объём зондирования); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=start_time,duration_ts,time_base,probe_size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: start+start_real',
    summary:
      'Контейнер: start_time и start_time_real (поля format: номинальное и реальное смещение начала; сверка при перепаковке); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=start_time,start_time_real -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: offset+timing',
    summary:
      'Контейнер: start_time, start_time_real, duration_ts, time_base и probe_size (поля format: смещение, тики, база времени и зондирование); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=start_time,start_time_real,duration_ts,time_base,probe_size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: flags',
    summary:
      'Контейнер: format.flags (поле format: битовая маска флагов демультиплексора); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=flags -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: probe layout',
    summary:
      'Контейнер: probe_score, nb_streams, nb_programs, flags и size (поля format: оценка демультиплексора и сводка контейнера); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=probe_score,nb_streams,nb_programs,flags,size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: diagnostics',
    summary:
      'Контейнер: probe_score, streams, flags, size, start/real, duration_ts, time_base и probe_size (поля format: сводка как в инспекторе FluxAlloy); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=probe_score,nb_streams,nb_programs,flags,size,start_time,start_time_real,duration_ts,time_base,probe_size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: масштаб 320, 1 с, пустой выход',
    summary:
      'Дымовая проверка: перекодирование масштаба 320:-1 за 1 с в пустой выход (-vf scale=320:-1 -t 1, -f null); проверка цепочки видеофильтров; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=320:-1 -t 1 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 время создания дорожки',
    summary:
      'Поток v:0: тег creation_time в stream_tags (поле дорожки: время создания; отличается от format при перепаковке); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=creation_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· тег имени обработчика',
    summary:
      'Тег контейнера handler_name (поле format_tags.handler_name — имя обработчика; часто QuickTime и MOV); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=handler_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: копия аудио 3 с, пустой выход',
    summary:
      'Перепаковка только аудио в пустой выход (-vn -sn -acodec copy -t 3, -f null); проверка дорожки без декода видео; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vn -sn -acodec copy -t 3 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0: глубина несжатого звука',
    summary:
      'Поток a:0: bits_per_raw_sample (поле ffprobe: глубина PCM при несжатом звуке и lossless) при наличии; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=bits_per_raw_sample -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 индекс и кодек',
    summary:
      'Поток v:0: index и codec_name (поля ffprobe: порядок дорожки и имя кодека в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=index,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 профиль и уровень',
    summary:
      'Поток v:0: profile и level (поля ffprobe: профиль и уровень H.264 и HEVC); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=profile,level -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:2 атрибуты дорожки',
    summary:
      'Третья дорожка субтитров s:2: disposition (поле ffprobe: forced, default, hearing_impaired и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:2 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:2 атрибуты дорожки',
    summary:
      'Третья аудиодорожка a:2: disposition (поле ffprobe: default, forced и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:2 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:1 профиль и уровень',
    summary:
      'Вторая видеодорожка v:1: profile и level (поля ffprobe: профиль и уровень; редкие случаи с несколькими ракурсами и дубликатами дорожек); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:1 -show_entries stream=profile,level -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:1 начало и длительность',
    summary:
      'Вторая дорожка субтитров s:1: start_time и duration дорожки (поля ffprobe: начало и длительность второй дорожки субтитров); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: поток v:0 без перекода 2с',
    summary:
      'Перепаковка только первой видеодорожки без перекодирования (-map 0:v:0 -c:v copy); без аудио и субтитров; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 2 -map 0:v:0 -c:v copy -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0: таймбаза и старт меток',
    summary:
      'Поток s:0: тактовая сетка и стартовая метка субтитров (поля ffprobe: time_base, start_pts — смещение относительно видео); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: замер громкости 10с',
    summary:
      'Замер громкости первых 10 с (-af volumedetect -vn -sn); средняя и максимальная громкость (в stderr строки mean_volume и max_volume — вывод фильтра volumedetect); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volumedetect -t 10 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: жанр и дата',
    summary:
      'Теги контейнера genre и date (поля format_tags: жанр и дата релиза; каталогизация и дата); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=genre,date -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: поиск тишины 30с',
    summary:
      'Поиск тишины в первых 30 с (-af silencedetect=noise=-50dB:d=0.3); в stderr — метки silence_start и silence_end (вывод фильтра silencedetect); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af silencedetect=noise=-50dB:d=0.3 -t 30 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 атрибуты дорожки',
    summary:
      'Первая видеодорожка v:0: disposition (поле ffprobe: default, forced, attached_pic и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 битрейт',
    summary:
      'Вторая аудиодорожка a:1: битрейт (поле ffprobe bit_rate; мультиязык, комментарии); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: статистика аудио 5с',
    summary:
      'Краткая статистика аудио первых 5 с (-af astats=metadata=1:reset=1); СКЗ и пик (в stderr фильтр astats пишет RMS и peak по метаданным); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af astats=metadata=1:reset=1 -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 кодировщик (тег дорожки)',
    summary:
      'Поток a:0: тег encoder в stream_tags (поле дорожки: кодировщик при мультиплексировании, если записан); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream_tags=encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: громкость по шкале ebu r128, 12с',
    summary:
      'EBU R128: интегральная громкость, диапазон громкости и истинный пик (Integrated — интегральная, LRA — диапазон, True Peak — истинный пик) первых 12 с (-af ebur128=framelog=verbose — подробный журнал по кадрам); в stderr строки Integrated, LRA и True Peak (вывод фильтра ebur128); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af ebur128=framelog=verbose -t 12 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 длинное имя кодека',
    summary:
      'Поток a:0: codec_long_name (поле ffprobe: человекочитаемое имя кодека); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 длинное имя кодека',
    summary:
      'Поток s:0: codec_long_name (поле ffprobe: тип субтитров в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: фазометр 10с',
    summary:
      'Стерео-фаза первых 10 с (-af aphasemeter=video=0); в stderr предупреждения о моно и фазе (вывод фильтра aphasemeter); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aphasemeter=video=0 -t 10 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 кодировщик (тег дорожки)',
    summary:
      'Поток a:1: тег encoder в stream_tags (поле дорожки второй аудио, если записан в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream_tags=encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: чересстрочность 5с',
    summary:
      'Детектор чересстрочности первых 5 с (-vf idet -t 5); в stderr метки TFF, BFF и progressive (вывод фильтра idet); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 5 -vf idet -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: издатель и строка кодировщика',
    summary:
      'Теги контейнера publisher и encoded_by (поля format_tags: издатель и строка кодировщика); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=publisher,encoded_by -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: чёрные кадры 30с',
    summary:
      'Поиск чёрных интервалов в первых 30 с (-vf blackdetect=d=0.1:pix_th=0.01); в stderr метки black_start и black_end (вывод фильтра blackdetect); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf blackdetect=d=0.1:pix_th=0.01 -t 30 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: автообрезка 30с',
    summary:
      'Оценка обрезки чёрных полей первых 30 с (-vf cropdetect=limit=24:round=16:reset=0); в stderr строки crop (вывод фильтра cropdetect); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf cropdetect=limit=24:round=16:reset=0 -t 30 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: залипание кадра 45с',
    summary:
      'Поиск залипших кадров первых 45 с (-vf freezedetect=n=-60dB:d=2); в stderr метки freeze_start и freeze_end (вывод фильтра freezedetect); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf freezedetect=n=-60dB:d=2 -t 45 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: статистика видео 8с',
    summary:
      'Статистика уровней и шума первых 8 с (-vf signalstats); YUV-средние и отклонения в stderr (вывод фильтра signalstats); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf signalstats -t 8 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· главы, json',
    summary:
      'Главы контейнера одним JSON (--show-chapters -of json=c=1); длительности и заголовки сегментов; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -of json=c=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 начало и длительность',
    summary:
      'Первая дорожка субтитров s:0: start_time и duration (смещение и длительность относительно видео); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 начало и длительность',
    summary:
      'Вторая аудиодорожка a:1: start_time и duration (мультиязык, сдвиг); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:1: таймбаза и старт меток',
    summary:
      'Вторая дорожка субтитров s:1: time_base и start_pts (поля ffprobe: база времени и смещение таймкодов второй дорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1: таймбаза и старт меток',
    summary:
      'Вторая аудиодорожка a:1: time_base и start_pts (поля ffprobe: база времени и смещение второй аудиодорожки в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: динам. нормализация 5с',
    summary:
      'Лёгкая динамическая нормализация громкости первых 5 с (-af dynaudnorm); проверка аудиофильтра; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af dynaudnorm=g=31:f=250:r=0.9 -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: вч-срез 5с',
    summary:
      'ВЧ-срез первых 5 с (-af highpass=f=200); проверка аудио-цепочки и тишины в низах; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=200 -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 тег геолокации',
    summary:
      'Поток v:0: тег location в stream_tags (поле дорожки: координаты GPS и текстовая метка в MOV и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=location -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 формат сэмпла',
    summary:
      'Поток a:0: только sample_fmt (поле ffprobe: формат сэмпла — s16, fltp и т. д.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=sample_fmt -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· тег текст песни',
    summary:
      'Тег контейнера lyrics (поле format_tags: текст песни в MP3, M4A и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=lyrics -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 расклад и формат сэмпла',
    summary:
      'Поток a:1: расклад и формат сэмпла (поля ffprobe: channel_layout, sample_fmt — например s16, fltp при PCM); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=channel_layout,sample_fmt -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: смена сцен 20с',
    summary:
      'Детектор смен сцен первых 20 с (-vf scenedetect=scene=0.3); в stderr оценка scene_score (вывод фильтра scenedetect); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scenedetect=scene=0.3 -t 20 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· метки времени (genpts) + ремукс 2 с',
    summary:
      'Короткая перепаковка без перекодирования с генерацией PTS (-fflags +genpts -c copy -t 2); битые таймстемпы MPEG-TS и MKV; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -fflags +genpts -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 2 -c copy -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 стереорежим',
    summary:
      'Поток v:0: тег stereo_mode в stream_tags (поле дорожки: метка 3D и стерео в MKV и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=stereo_mode -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 длительность в тиках',
    summary:
      'Поток a:0: длительность в тиках time_base (поле ffprobe stream=duration_ts — длительность в единицах time_base дорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=duration_ts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: размер, битрейт, число дорожек',
    summary:
      'Контейнер: размер, битрейт и число потоков (поля format: size, bit_rate, nb_streams); компактно; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=size,bit_rate,nb_streams -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: ресемпл 44.1 кГц 3с',
    summary:
      'Аудио: ресемплинг в 44,1 кГц первые 3 с (-af aresample=44100); проверка цепочки передискретизации (ресемплинг, SRC); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aresample=44100 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег доп. версия (minor)',
    summary:
      'Тег контейнера minor_version (поле format_tags: младшая версия формата; часто вместе с major_brand у MP4 и MOV); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=minor_version -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: спектральное шумоподавление 3с',
    summary:
      'Лёгкое шумоподавление в частотной области (FFT, -af afftdn=nf=-25) первых 3 с; проверка аудиофильтра; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afftdn=nf=-25 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: описание и ключевые слова',
    summary:
      'Теги контейнера description и keywords (поля format_tags: описание и ключевые слова для каталогизации и поиска в MP4, MKV и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=description,keywords -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· тег location (контейнер)',
    summary:
      'Тег контейнера location (поле format_tags: координаты GPS или URI в метаданных format); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=location -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: компрессор 5с',
    summary:
      'Лёгкая компрессия аудио первых 5 с (-af acompressor=threshold=-20dB:ratio=4:attack=5:release=100); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acompressor=threshold=-20dB:ratio=4:attack=5:release=100 -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:2 кодек, размер и профиль',
    summary:
      'Третья видеодорожка v:2: кодек, размеры, профиль и уровень (поля ffprobe: codec_name, width, height, profile, level; мультиракурс и редкие контейнеры); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:2 -show_entries stream=codec_name,width,height,profile,level -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: обрезка тишины 60с',
    summary:
      'Обрезка ведущей тишины в первых 60 с (-af silenceremove=…); проверка цепочки -af на речи и музыке; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af silenceremove=start_periods=1:start_duration=0.5:start_threshold=-50dB:detection=peak:stop_periods=-1 -t 60 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 тики на кадр',
    summary:
      'Поток v:0: ticks_per_frame (поле ffprobe: число тиков time_base на один кадр); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=ticks_per_frame -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: тембр вч 3с',
    summary:
      'Лёгкий эквалайзер ВЧ (treble) первых 3 с (-af treble=g=1); дымовая проверка цепочки аудиофильтров; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af treble=g=1 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег название по',
    summary:
      'Тег контейнера software (поле format_tags: название ПО кодирования и упаковки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=software -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги эпизода (сериал)',
    summary:
      'Теги сериала в контейнере (поля format_tags: episode_sort — порядок эпизода, season_number — сезон, episode_id — идентификатор); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=episode_sort,season_number,episode_id -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· громкость +3 дБ 2 с',
    summary:
      'Усиление аудио +3 dB первые 2 с (-af volume=3dB); дымовая проверка громкости без перекодирования видео; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volume=3dB -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: нч-срез 3.5 кГц 3с',
    summary:
      'НЧ-фильтр первых 3 с (-af lowpass=f=3500); проверка аудио-цепочки; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowpass=f=3500 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 таймбаза и поля частоты кадров',
    summary:
      'Поток a:0: time_base и дроби частоты кадров (поля ffprobe: time_base, avg_frame_rate и r_frame_rate — у аудио часто формальные значения, сверяйте с видео); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=time_base,avg_frame_rate,r_frame_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· полосовой вч и нч 4 с',
    summary:
      'Полосовой проход 200–3000 Hz первых 4 с (-af highpass=f=200,lowpass=f=3000); дымовая проверка цепочки из двух аудиофильтров (-af); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=200,lowpass=f=3000 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 только ключевые кадры',
    summary:
      'Поток v:0: is_intra_only (поле ffprobe: все кадры ключевые, без межкадрового предсказания; редкие кодеки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=is_intra_only -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги: композитор и дирижёр',
    summary:
      'Теги контейнера composer и conductor (поля format_tags: композитор и дирижёр); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=composer,conductor -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: шумовой гейт 5с',
    summary:
      'Шумовой гейт первых 5 с (-af agate=…); проверка динамики и тишины в цепочке -af; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af agate=threshold=0.005:ratio=2:attack=20:release=200 -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: деклик 5с',
    summary:
      'Клик-редактор первых 5 с (-af adeclick); диагностика щёлчков и дефектов записи; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af adeclick -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег исполнитель (solo)',
    summary:
      'Тег контейнера performer (поле format_tags=performer — имя исполнителя в каталогизации); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=performer -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 режим альфы',
    summary:
      'Поток v:0: теги дорожки stream_tags alpha_mode (альфа-канал VP9 и AV1 в WebM и MKV); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=alpha_mode -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: расширение стерео 3с',
    summary:
      'Усиление стерео-разницы первых 3 с (-af extrastereo); проверка ширины стерео-цепочки; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af extrastereo -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег дата покупки',
    summary:
      'Тег контейнера purchase_date (поле format_tags: дата покупки в iTunes Store и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=purchase_date -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги сортировки каталога',
    summary:
      'Теги сортировки каталога (поля format_tags: sort_artist, sort_album, sort_title); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=sort_artist,sort_album,sort_title -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: фазер 4с',
    summary:
      'Лёгкий фазовый эффект первых 4 с (-af aphaser); дымовая проверка стерео-цепочки аудиофильтров (-af); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aphaser=in_gain=0.4:out_gain=0.74 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег служба (service)',
    summary:
      'Теги service_provider и service_name (поля format_tags: поставщик и имя службы вещания; IPTV, OFFAIR и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=service_provider,service_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 битность кодированного сэмпла',
    summary:
      'Поток a:0: bits_per_coded_sample (поле ffprobe: глубина закодированного PCM при наличии); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=bits_per_coded_sample -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: флэнжер 4с',
    summary:
      'Лёгкий флэнжер (flanger) первых 4 с (-af flanger); дымовая проверка стерео-модуляции; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af flanger -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег isrc',
    summary:
      'Тег контейнера isrc (поле format_tags: код ISRC релиза); каталогизация аудио; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=isrc -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: де-ессер 4с',
    summary:
      'Де-эссер первых 4 с (-af deesser); диагностика свистящих согласных; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af deesser=i=0.5 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 кодировщик (тег дорожки)',
    summary:
      'Поток первых субтитров: тег encoder в stream_tags (кодировщик при мультиплексировании); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream_tags=encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: вибрато 4с',
    summary:
      'Лёгкая вибрато-модуляция первых 4 с (-af vibrato); дымовая проверка стерео-цепочки аудиофильтров (-af); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af vibrato=f=6.5:d=0.5 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги part и compilation',
    summary:
      'Теги контейнера part и compilation (поля format_tags: номер части и признак сборника; iTunes и многодисковые сборники); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=part,compilation -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: кристалайзер 4с',
    summary:
      'Психоакустический кристалайзер (crystalizer) первых 4 с (-af crystalizer); дымовая проверка лёгких аудио-эффектов; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af crystalizer=i=1.2 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 таймбазы кодека и потока',
    summary:
      'Поток v:0: codec_time_base и time_base (поля ffprobe: codec_time_base кодека, time_base дорожки в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=codec_time_base,time_base -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: тон + сдвиг частоты дискр. 3с',
    summary:
      'Лёгкий resample-питч первых 3 с (-af asetrate=44100*1.01,aresample=44100); дымовая проверка цепочки asetrate → aresample; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af asetrate=44100*1.01,aresample=44100 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: авторство и строка кодировщика',
    summary:
      'Теги контейнера copyright и encoded_by (поля format_tags: правообладатель и строка кодировщика); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=copyright,encoded_by -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: компандер 4с',
    summary:
      'Лёгкий компандер первых 4 с (-af compand); дымовая проверка динамической обработки; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af compand=attacks=0.02:decays=0.1:points=-80/-80|-25/-25|0/-10:gain=2 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег исполнитель альбома',
    summary:
      'Тег контейнера album_artist (поле format_tags: альбомный исполнитель; рядом с artist); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=album_artist -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги: трек и диск',
    summary:
      'Теги контейнера track и disc (поля format_tags: номер трека и номер диска в каталоге); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=track,disc -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: динам. нормализация 4с',
    summary:
      'Лёгкая динамическая нормализация громкости первых 4 с (-af dynaudnorm); дымовая проверка цепочки выравнивания воспринимаемой громкости (loudness); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af dynaudnorm=f=150:g=15 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: текст песни и аннотация',
    summary:
      'Теги контейнера lyrics и synopsis (поля format_tags: текст песни и краткая сводка — подкасты, аудиокниги и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=lyrics,synopsis -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: мягкое клипирование 4с',
    summary:
      'Мягкий клиппер первых 4 с (-af asoftclip); дымовая проверка ограничения пиков без жёсткого лимитера; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af asoftclip -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 каналы и расклад',
    summary:
      'Поток a:0: число каналов и расклад (поля ffprobe: channels — число каналов, channel_layout — строка расклада); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=channels,channel_layout -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: эхо 4с',
    summary:
      'Лёгкое эхо первых 4 с (-af aecho); дымовая проверка задержек и смешивания в цепочке -af; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aecho=0.8:0.9:40:0.3 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:1 атрибуты дорожки',
    summary:
      'Вторая дорожка субтитров s:1: disposition (поле ffprobe: default — дорожка по умолчанию, forced — принудительная, hearing_impaired — для слабослышащих и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: тремоло 4с',
    summary:
      'Лёгкая амплитудная модуляция первых 4 с (-af tremolo); дымовая проверка периодического аудиофильтра; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af tremolo=f=6:d=0.5 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: полосовой фильтр 4с',
    summary:
      'Узкополосный bandpass первых 4 с (-af bandpass); дымовая проверка частотной фильтрации; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af bandpass=f=1000:width_type=h:width=200 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 кодек и каналы',
    summary:
      'Вторая аудиодорожка a:1: кодек, число каналов и расклад (поля ffprobe: codec_name, channels, channel_layout; мультиязык и дорожка комментариев); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=codec_name,channels,channel_layout -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: полка вч 3с',
    summary:
      'Лёгкий highshelf: верхняя полка спектра первых 3 с (-af highshelf); дымовая проверка параметрического эквалайзера (-af); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highshelf=f=8000:width_type=o:width=2:g=-6 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:1 размер и кодек',
    summary:
      'Вторая видеодорожка v:1: кодек и размер кадра (поля ffprobe: codec_name, width, height; мультикамера и дополнительный ракурс); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:1 -show_entries stream=codec_name,width,height -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: пульсатор 3с',
    summary:
      'Лёгкий стерео-пульсатор первых 3 с (-af apulsator); дымовая проверка периодического pan и цепочки -af; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af apulsator=mode=sine:hz=1:width=2 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· дорожка данных d:1, кодек',
    summary:
      'Вторая data-дорожка d:1: поля ffprobe codec_name и codec_tag_string (таймкоды и метаданные в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:1 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: хорус 4с',
    summary:
      'Лёгкий хорус первых 4 с (-af chorus); дымовая проверка задержек и модуляции в цепочке -af; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af chorus=0.5:0.9:50:0.4:0.25:2 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: wmf sdk и кодировщик',
    summary:
      'Теги контейнера encoder и WMFSDKVersion (поля format_tags: кодировщик и версия Windows Media SDK; часто у WMV и ASF); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoder,WMFSDKVersion -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: нарастание громкости 3с',
    summary:
      'Плавное нарастание громкости первых 3 с (-af afade=t=in:st=0:d=0.6); дымовая проверка нарастания (afade in) без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afade=t=in:st=0:d=0.6 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег инструмент кодирования',
    summary:
      'Тег контейнера encoding_tool (поле format_tags: какой программой упакован файл — часто Mux, QuickTime и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoding_tool -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: затухание громкости 3с',
    summary:
      'Плавное затухание громкости в хвосте первых 3 с (-af afade=t=out:st=1.2:d=0.6); дымовая проверка затухания (afade out) без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afade=t=out:st=1.2:d=0.6 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: число глав',
    summary:
      'Контейнер: поле nb_chapters (сколько глав в файле; для навигации и DVD/Blu-ray структуры); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=nb_chapters -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: темп ×0.95, 3с',
    summary:
      'Лёгкое замедление темпа первых 3 с (-af atempo=0.95); дымовая проверка фильтра atempo без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af atempo=0.95 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:1 длинное имя кодека',
    summary:
      'Вторая видеодорожка v:1: codec_name и codec_long_name (поля ffprobe: короткое и длинное имя кодека; мультикамера и дополнительный поток); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:1 -show_entries stream=codec_name,codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: лимитер 3с',
    summary:
      'Мягкий лимитер пиков первых 3 с (-af alimiter=limit=0.8); дымовая проверка динамики в цепочке -af без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af alimiter=limit=0.8 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· бренды контейнера mp4 (теги)',
    summary:
      'Теги контейнера major_brand, minor_version и compatible_brands (поля format_tags: бренд, младшая версия и список совместимых; часто у MP4 и MOV); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=major_brand,minor_version,compatible_brands -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: стерео-коррекция 3с',
    summary:
      'Лёгкая стерео-коррекция первых 3 с (-af stereotools=mlev=0.05:phlev=0.05); дымовая проверка ширины и фазы; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af stereotools=mlev=0.05:phlev=0.05 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: непрерывность и сборник',
    summary:
      'Теги контейнера gapless_playback и compilation (поля format_tags: бесшовное воспроизведение и признак сборника; часто у AAC и ALAC из iTunes); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=gapless_playback,compilation -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: нормализация речи 4с',
    summary:
      'Лёгкая нормализация речи и подкаста первых 4 с (-af speechnorm=peak=0.25); дымовая проверка динамики диалога; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af speechnorm=peak=0.25 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: темп (bpm) и тональность',
    summary:
      'Теги контейнера BPM и initial_key (поля format_tags: темп в ударах в минуту и тональность, если записаны каталогизатором); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=BPM,initial_key -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: межканальный кроссфейд 4с',
    summary:
      'Лёгкий межканальный кроссфид bs2b первых 4 с (-af bs2b=profile=j2); дымовая проверка стерео-обработки; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af bs2b=profile=j2 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги исполнитель и альбом',
    summary:
      'Теги контейнера artist и album (поля format_tags: исполнитель и альбом; часто у музыкальных релизов и клипов); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=artist,album -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: акцент нч 4с',
    summary:
      'Лёгкий низкочастотный акцент первых 4 с (-af bass=g=2:f=120); дымовая проверка эквалайзера НЧ (bass); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af bass=g=2:f=120 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 индекс и кодек',
    summary:
      'Первая субтитровая дорожка s:0: index и codec_name (поля ffprobe: порядок и тип дорожки в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=index,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: многополосный эквалайзер 4с',
    summary:
      'Лёгкий 10-полосный superequalizer (полоса 3 +4 dB) первых 4 с; дымовая проверка графического эквалайзера; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af superequalizer=3b=4 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги сериала и эпизода',
    summary:
      'Теги контейнера show и episode_sort (поля format_tags: название шоу и сортировка эпизода; телекаталоги и сериалы); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=show,episode_sort -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: полка нч 4с',
    summary:
      'Лёгкий низкочастотный шельф первых 4 с (-af lowshelf=g=2:f=200); дымовая проверка нижнего полочного эквалайзера; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowshelf=g=2:f=200 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: жанр и дата',
    summary:
      'Теги контейнера genre и date (поля format_tags: жанр и дата; каталогизация музыки и релизов); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=genre,date -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: расширение стерео 4с',
    summary:
      'Лёгкое расширение стереобазы первых 4 с (-af extrastereo=m=1.2); дымовая проверка ширины и pan; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af extrastereo=m=1.2 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги подкаста и веб-адрес',
    summary:
      'Теги контейнера podcast и podcasturl (поля format_tags: признак подкаста и URL RSS); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=podcast,podcasturl -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: биткрашер 4с',
    summary:
      'Лёгкое битовое дробление (bit-crush) первых 4 с (-af acrusher=level_in=0.8:level_out=0.8:bits=8:mode=log); дымовая проверка зернистости; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acrusher=level_in=0.8:level_out=0.8:bits=8:mode=log -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· дорожка данных d:2, кодек',
    summary:
      'Третья data-дорожка d:2: поля ffprobe codec_name и codec_tag_string (дополнительные таймкоды и метаданные); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:2 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: кросс-пан стерео 4с',
    summary:
      'Лёгкое стереосмешивание через pan первых 4 с (каналы c0 и c1, кросс-фейд 0.6 и 0.4); дымовая проверка фильтра pan без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af pan=stereo|c0=0.6*c0+0.4*c1|c1=0.4*c0+0.6*c1 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:4 кодек',
    summary:
      'Пятая аудиодорожка a:4: codec_name, sample_rate и channels (поля ffprobe; мультиязык и комментарии); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:4 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:4 кратко',
    summary:
      'Пятая дорожка субтитров s:4: поля ffprobe codec_name и codec_tag_string; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:4 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги каталога и штрихкода',
    summary:
      'Теги контейнера catalog_number и barcode (поля format_tags: каталожный номер и штрихкод UPC); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=catalog_number,barcode -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: ресемпл с компенсацией рассинхрона 4с',
    summary:
      'Лёгкая компенсация рассинхрона через aresample=async=1 первых 4 с; дымовая проверка цепочки ресемплера (aresample); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aresample=async=1:first_pts=0 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: компрессор 4с',
    summary:
      'Лёгкий компрессор первых 4 с (-af acompressor=threshold=0.08:ratio=3:attack=5:release=50); дымовая проверка динамики; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acompressor=threshold=0.08:ratio=3:attack=5:release=50 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:2 размер и частота кадров',
    summary:
      'Третий видеопоток v:2: ширина, высота и частота кадров (поля ffprobe: width, height, r_frame_rate; несколько видеопотоков или альтернативы); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:2 -show_entries stream=width,height,r_frame_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: контраст 3с',
    summary:
      'Лёгкий аудио-контраст первых 3 с (-af acontrast=25); дымовая проверка динамики без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acontrast=25 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:5 кратко',
    summary:
      'Шестая аудиодорожка a:5: codec_name, sample_rate и channels (поля ffprobe; редкие мультиязыковые релизы); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:5 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:6 кратко',
    summary:
      'Седьмая аудиодорожка a:6: codec_name и channel_layout (поля ffprobe; комментарии и изоморфные миксы); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:6 -show_entries stream=codec_name,channel_layout -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:3 размер и pix_fmt',
    summary:
      'Четвёртый видеопоток v:3: width, height и pix_fmt (поля ffprobe; альтернативные углы или дубли); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:3 -show_entries stream=width,height,pix_fmt -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:5 индекс и кодек',
    summary:
      'Шестая дорожка субтитров s:5: index и codec_name (поля ffprobe; многоязыковые пакеты); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:5 -show_entries stream=index,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:6 кратко',
    summary:
      'Седьмая дорожка субтитров s:6: codec_name и codec_tag_string (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:6 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· дорожка данных d:3, кодек',
    summary:
      'Четвёртая data-дорожка d:3: codec_name и codec_tag_string (поля ffprobe; дополнительные метаданные); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:3 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги диск и дорожка',
    summary:
      'Теги контейнера disc и track (поля format_tags: номер диска и дорожки в альбомной разметке); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=disc,track -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги либретто и композитор',
    summary:
      'Теги контейнера lyricist и composer (поля format_tags: автор текста и композитор; музыкальные релизы); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=lyricist,composer -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги кодировщик и muxer',
    summary:
      'Теги контейнера encoded_by и muxing_app (поля format_tags: кто закодировал и чем упаковано; трассировка пайплайна); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoded_by,muxing_app -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· поток v:0 side_data list',
    summary:
      'Список side_data у v:0 (-show_entries stream_side_data_list — HDR10+, DOVI и др. без разбора каждого поля); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· поток a:0 side_data list',
    summary:
      'Список side_data у a:0 (например метаданные объёмного звука); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rubberband темп 4с',
    summary:
      'Лёгкое изменение темпа без сдвига тона первых 4 с (-af rubberband=tempo=1.03:pitch=1.0); дымовая проверка качественного растяжения; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af rubberband=tempo=1.03:pitch=1.0 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: firequalizer усиление 4с',
    summary:
      'Лёгкое частотное усиление через firequalizer первых 4 с (-af firequalizer=gain=6); дымовая проверка параметрического EQ; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af firequalizer=gain=6 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: кроссовер полос 4с',
    summary:
      'Разделение спектра через acrossover на 1.2 kHz первых 4 с; дымовая проверка многополосной цепочки; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acrossover=split=1200 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: наклон спектра 4с',
    summary:
      'Лёгкий наклон спектра (tilt) вокруг 1 kHz первых 4 с; дымовая проверка slope-EQ; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af tilt=frequency=1000:width=8:g=1 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: подъём саба 4с',
    summary:
      'Лёгкий подъём низов через asubboost первых 4 с; дымовая проверка НЧ-акцента; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af asubboost=dry=0.8:wet=0.8:boost=1.5 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: предыскажения CD 4с',
    summary:
      'Предыскажения в стиле CD (aemphasis mode=cd) первых 4 с; дымовая проверка лёгкой коррекции АЧХ; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aemphasis=mode=cd -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: хвостовая подкладка тишины 3с',
    summary:
      'Короткая подкладка тишины в хвосте через apad (pad_dur=0.25 с) первых 3 с выхода; дымовая проверка выравнивания длины буфера; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af apad=pad_dur=0.25 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: эффект Хааса 4с',
    summary:
      'Лёгкий эффект призрачного стерео (haas_effect) первых 4 с; дымовая проверка задержки между каналами; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af haas_effect=del_ms=12:side_gain=0.35 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: панорама моно→стерео 4с',
    summary:
      'Разведение моно в стерео через pan первых 4 с (центр в оба канала); дымовая проверка матрицы pan; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af pan=stereo|c0=0.5*c0|c1=0.5*c0 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: обрезка тишины в начале 8с',
    summary:
      'Удаление ведущей тишины в первых 8 с (-af silenceremove=start_periods=1:start_duration=0.3:start_threshold=-45dB); дымовая проверка детектора тишины; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af silenceremove=start_periods=1:start_duration=0.3:start_threshold=-45dB:detection=peak -t 8 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: демультиплекс a:0 в pcm 2с',
    summary:
      'Извлечь первую аудиодорожку в сырой PCM первых 2 с (-map 0:a:0 -f s16le); дымовая проверка -map и pcm без кавычек в argv; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -map 0:a:0 -t 2 -vn -sn -f s16le -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: масштаб lanczos 2с видео',
    summary:
      'Лёгкий ресайз видео lanczos до 640 ширины первых 2 с (-vf scale=640:-2:lanczos); дымовая проверка фильтра scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=640:-2:lanczos -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: телесинк ускорение 2с',
    summary:
      'Лёгкий pullup/деинтерлейс через fps=24000/1001 первых 2 с (-vf fps=fps=24000/1001); дымовая проверка cadence; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fps=fps=24000/1001 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 только color_transfer',
    summary:
      'Поток v:0: только color_transfer (поле ffprobe: кривая переноса, PQ, HLG и др.; отдельно от color_space); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=color_transfer -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: encoder и handler_name',
    summary:
      'Теги контейнера encoder и handler_name (поля format_tags: кодировщик и обработчик верхнего уровня; часто MOV/MP4); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoder,handler_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы: первая запись компактно',
    summary:
      'Только первая глава компактно (-read_intervals %+0#1 — ограничение чтения, -show_chapters — главы); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -read_intervals %+0#1 -show_chapters -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:3 disposition',
    summary:
      'Четвёртая дорожка субтитров s:3: disposition (поля ffprobe: default, forced, hearing_impaired и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:3 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:3 disposition',
    summary:
      'Четвёртая аудиодорожка a:3: disposition (поля ffprobe: default, forced и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:3 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:4 кратко',
    summary:
      'Пятый видеопоток v:4: codec_name, width и height (поля ffprobe; редкие мультиракурсные контейнеры); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:4 -show_entries stream=codec_name,width,height -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· дорожка данных d:4',
    summary:
      'Пятая data-дорожка d:4: codec_name (поле ffprobe; дополнительные метаданные); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:4 -show_entries stream=codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложение t:1',
    summary:
      'Вторая вложенная дорожка t:1 (шрифты и обложки): codec_name и codec_tag_string; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:1 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:1 side_data_list компактно',
    summary:
      'Вторая видеодорожка v:1: side_data_list компактно (поле ffprobe; метаданные второго ракурса); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:1 -show_entries stream=side_data_list -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги artist и sort_artist',
    summary:
      'Теги контейнера artist и sort_artist (поля format_tags: исполнитель и сортировочная строка каталога); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=artist,sort_artist -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 с приватными полями',
    summary:
      'Поток v:0 с флагом -show_private_data (дополнительные поля кодека, если демультиплексор их отдаёт) и codec_name; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_private_data -select_streams v:0 -show_entries stream=codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:2 start_pts',
    summary:
      'Третья дорожка субтитров s:2: start_pts (поле ffprobe: смещение первой метки субтитров); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:2 -show_entries stream=start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:2 index и codec_tag',
    summary:
      'Третья аудиодорожка a:2: index и codec_tag_string (поля ffprobe: порядок и FourCC кодека); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:2 -show_entries stream=index,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: обесцвечивание hue 2с',
    summary:
      'Обесцвечивание через hue=s=0 первых 2 с (-vf hue=s=0); дымовая проверка цветокоррекции; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=s=0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: оттенки серого 2с',
    summary:
      'Перевод в монохром через format=gray первых 2 с (-vf format=gray); дымовая проверка цепочки -vf; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf format=gray -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: unsharp 2с',
    summary:
      'Лёгкая резкость unsharp первых 2 с (-vf unsharp=3:3:1.0); дымовая проверка свёртки; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf unsharp=3:3:1.0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hqdn3d 2с',
    summary:
      'Лёгкое пространственно-временное шумоподавление hqdn3d первых 2 с; дымовая проверка -vf; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hqdn3d=2:1:2:3 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: поворот 90° 1с',
    summary:
      'Поворот кадра на 90° первую секунду (-vf transpose=2); дымовая проверка геометрии; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf transpose=2 -t 1 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: кроп от краёв 2с',
    summary:
      'Обрезка 32 px с каждой стороны первых 2 с (-vf crop=iw-32:ih-32:16:16); дымовая проверка crop; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf crop=iw-32:ih-32:16:16 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: setsar=1 на 2с',
    summary:
      'Нормализация SAR 1:1 первых 2 с (-vf setsar=1); дымовая проверка метаданных соотношения сторон; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf setsar=1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fps=30 на 2с',
    summary:
      'Принудительные 30 fps на выходе первых 2 с (-vf fps=30); дымовая проверка cadence; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fps=30 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: масштаб iw/2 на 2с',
    summary:
      'Уменьшение ширины вдвёое (-vf scale=iw/2:-2) первых 2 с; дымовая проверка scale с выражениями iw/ih; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=iw/2:-2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: смесь стерео в mono 3с',
    summary:
      'Сведение стерео в моно через pan первых 3 с (pan=mono|c0=0.5*c0+0.5*c1); дымовая проверка pan; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af pan=mono|c0=0.5*c0+0.5*c1 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aformat 48 kHz stereo 3с',
    summary:
      'Приведение аудио к 48 kHz stereo через aformat первых 3 с; дымовая проверка ограничений формата; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aformat=sample_rates=48000:channel_layouts=stereo -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tblend среднее 2с',
    summary:
      'Усреднение соседних кадров tblend=all_mode=average первых 2 с; дымовая проверка темпорального фильтра; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tblend=all_mode=average -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: mpdecimate 6с',
    summary:
      'Прореживание почти дубликатов кадров mpdecimate первых 6 с; дымовая проверка детектора статики; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf mpdecimate -t 6 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: silenceremove rms 10с',
    summary:
      'Удаление ведущей тишины по RMS первых 10 с (silenceremove с detection=rms и порогом -55 dB); дымовая проверка отличия от peak; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af silenceremove=start_periods=1:start_duration=0.25:start_threshold=-55dB:detection=rms:stop_periods=-1 -t 10 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: yadif 3с',
    summary:
      'Деинтерлейс yadif=0:0:0 первых 3 с; дымовая проверка чересстрочного фильтра; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf yadif=0:0:0 -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: eq яркость 2с',
    summary:
      'Лёгкая коррекция яркости через eq первых 2 с (brightness=0.04 contrast=1.02); дымовая проверка eq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf eq=brightness=0.04:contrast=1.02 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: map v:0 null 2с',
    summary:
      'Декод только первой видеодорожки (-map 0:v:0) первых 2 с в null; дымовая проверка -map индекса; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -map 0:v:0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 только color_primaries',
    summary:
      'Поток v:0: только color_primaries (поле ffprobe: первичные цвета дисплея); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=color_primaries -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 только color_space',
    summary:
      'Поток v:0: только color_space (поле ffprobe: цветовое пространство bt709 и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=color_space -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 duration_ts',
    summary:
      'Поток v:0: длительность в тиках time_base (поле ffprobe duration_ts; сверка с duration в секундах); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=duration_ts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 pix_fmt и profile',
    summary:
      'Поток v:0: pix_fmt и profile (поля ffprobe: формат пикселей и профиль кодека); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=pix_fmt,profile -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 первые 2 пакета',
    summary:
      'Первые два пакета v:0 (-read_intervals %+#2 — только два пакета, -show_packets); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#2 -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: time_base',
    summary:
      'Контейнер: format time_base (поле format.time_base — база времени контейнера); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=time_base -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 max_bit_rate',
    summary:
      'Поток a:0: max_bit_rate (поле ffprobe: пиковый битрейт при VBR, если задан); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=max_bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 codec_long_name',
    summary:
      'Поток s:0: codec_long_name (поле ffprobe: длинное имя кодека субтитров); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: map a:0 null 2с',
    summary:
      'Декод только первой аудиодорожки (-map 0:a:0) первых 2 с в null; дымовая проверка -map аудио; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -map 0:a:0 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: boxblur 2с',
    summary:
      'Лёгкое размытие boxblur первых 2 с (-vf boxblur=2:1); дымовая проверка пространственного фильтра; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf boxblur=2:1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: gblur 2с',
    summary:
      'Гауссово размытие gblur первых 2 с (-vf gblur=sigma=1.2); дымовая проверка gblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf gblur=sigma=1.2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: edgedetect 2с',
    summary:
      'Контуры edgedetect первых 2 с (-vf edgedetect=low=0.1:high=0.3); дымовая проверка высокочастотного фильтра; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf edgedetect=low=0.1:high=0.3 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: vignette 2с',
    summary:
      'Лёгкое затемнение по краям vignette первых 2 с (-vf vignette=PI/5); дымовая проверка vignette; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf vignette=PI/5 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: colorbalance 2с',
    summary:
      'Лёгкий сдвиг баланса белого colorbalance первых 2 с (rs=0.06); дымовая проверка цветокоррекции; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf colorbalance=rs=0.06 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: negate 2с',
    summary:
      'Инверсия яркости negate первых 2 с (-vf negate); дымовая проверка точечного видеофильтра; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf negate -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hue сдвиг 2с',
    summary:
      'Сдвиг оттенка hue=h=0.08 первых 2 с; дымовая проверка hue; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=h=0.08 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: gradfun 2с',
    summary:
      'Сглаживание бэнда gradfun первых 2 с (-vf gradfun=strength=0.9); дымовая проверка gradfun; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf gradfun=strength=0.9 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: dctdnoiz 2с',
    summary:
      'Лёгкое шумоподавление dctdnoiz первых 2 с (-vf dctdnoiz=s=4); дымовая проверка DCT-денойзера; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf dctdnoiz=s=4 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: weave 1с',
    summary:
      'Чересстрочное переплетение полей weave первую секунду (-vf weave); дымовая проверка weave; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf weave -t 1 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fieldorder tff 2с',
    summary:
      'Указание порядка полей fieldorder=tff первых 2 с; дымовая проверка метаданных чересстрочности; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fieldorder=tff -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tpad хвост 2с',
    summary:
      'Короткая подкладка кадров в хвост через tpad первых 2 с (stop_mode=add, stop_duration=0.08); дымовая проверка tpad; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tpad=stop_mode=add:stop_duration=0.08 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: sab 2с',
    summary:
      'Лёгкое сглаживание sab первых 2 с (-vf sab=strength=0.2); дымовая проверка shape adaptive blur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf sab=strength=0.2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: shuffleplanes 2с',
    summary:
      'Перестановка цветовых плоскостей shuffleplanes первых 2 с (map0g=1:map1g=0:map2g=2); дымовая проверка shuffleplanes без кавычек в argv; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf shuffleplanes=map0g=1:map1g=0:map2g=2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: extractplanes y 2с',
    summary:
      'Извлечь только плоскость Y через extractplanes=y первых 2 с; дымовая проверка планарного разбора; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf extractplanes=y -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: swapuv 2с',
    summary:
      'Обмен цветоразностных каналов swapuv первых 2 с; дымовая проверка цвета без перекодирования в файл; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf swapuv -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 start_pts',
    summary:
      'Поток v:0: только start_pts (поле ffprobe: первая метка времени видео в тиках time_base); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 index',
    summary:
      'Поток a:0: только index (поле ffprobe: порядковый индекс дорожки в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=index -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· тег comment (контейнер)',
    summary:
      'Тег контейнера comment (поле format_tags: длинный комментарий, если записан); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=comment -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· тег replaygain_track_gain',
    summary:
      'Тег контейнера REPLAYGAIN_TRACK_GAIN (поле format_tags: нормализация громкости ReplayGain); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=REPLAYGAIN_TRACK_GAIN -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 color_range',
    summary:
      'Поток v:0: только color_range (поле ffprobe: tv или pc и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=color_range -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:1 codec_long_name',
    summary:
      'Вторая дорожка субтитров s:1: codec_long_name (поле ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hflip 2с',
    summary:
      'Горизонтальное отражение hflip первых 2 с; дымовая проверка геометрии; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hflip -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: vflip 2с',
    summary:
      'Вертикальное отражение vflip первых 2 с; дымовая проверка геометрии; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf vflip -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: transpose=0 на 1с',
    summary:
      'Поворот transpose=0 на 90° против часовой первую секунду; дымовая проверка transpose; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf transpose=0 -t 1 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: deshake 3с',
    summary:
      'Стабилизация deshake первых 3 с; дымовая проверка motion compensation; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf deshake -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: median 2с',
    summary:
      'Медианное шумоподавление median=3 первых 2 с; дымовая проверка spatial median; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf median=3 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: decimate 5с',
    summary:
      'Прореживание дубликатов decimate первых 5 с; дымовая проверка decimate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf decimate -t 5 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: pullup 4с',
    summary:
      'Инверсия телесинка pullup первых 4 с; дымовая проверка pullup; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf pullup -t 4 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fps=film=24',
    summary:
      'Приведение к киношным 24 fps через fps=film=24 первых 3 с; дымовая проверка fps=film; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fps=film=24 -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tmix 2с',
    summary:
      'Усреднение соседних кадров tmix=frames=3 первых 2 с; дымовая проверка tmix; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tmix=frames=3 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: curves lighter 2с',
    summary:
      'Пресет curves=preset=lighter первых 2 с; дымовая проверка curves; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf curves=preset=lighter -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: colorchannelmixer 2с',
    summary:
      'Лёгкий микс каналов colorchannelmixer первых 2 с (rr=0.95:bb=1.05); дымовая проверка матрицы RGB; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf colorchannelmixer=rr=0.95:bb=1.05 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rotate 2° 2с',
    summary:
      'Поворот на ~2° через rotate=2*PI/180 первых 2 с; дымовая проверка rotate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf rotate=2*PI/180 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: yadif send_frame 2с',
    summary:
      'Деинтерлейс yadif=send_frame первых 2 с; дымовая проверка режима send_frame; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf yadif=mode=send_frame -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fps=60 2с',
    summary:
      'Принудительные 60 fps на выходе первых 2 с (-vf fps=60); дымовая проверка удвоения/прореживания cadence; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fps=60 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 field_order',
    summary:
      'Поток v:0: только field_order (поле ffprobe: чересстрочность tff/bff/progressive); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=field_order -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:2 handler_name',
    summary:
      'Третья аудиодорожка a:2: тег handler_name в stream_tags (поле ffprobe: имя обработчика дорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:2 -show_entries stream_tags=handler_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер format_tags=sort_album',
    summary:
      'Только тег sort_album контейнера (поле format_tags: сортировочное имя альбома); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=sort_album -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер format_name и flags',
    summary:
      'Контейнер: format_name и flags (поля format: имя и флаги демультиплексора); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=format_name,flags -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:2 start_time',
    summary:
      'Третья дорожка субтитров s:2: start_time дорожки (поле ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:2 -show_entries stream=start_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:3 index codec',
    summary:
      'Четвёртая аудиодорожка a:3: index и codec_name (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:3 -show_entries stream=index,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: nlmeans 2с',
    summary:
      'Нелокальное среднее nlmeans=s=4 первых 2 с; дымовая проверка тяжёлого шумоподавления; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf nlmeans=s=4 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: atadenoise 2с',
    summary:
      'Временной шумодав atadenoise первых 2 с (-vf atadenoise=0.01:0.01); дымовая проверка atadenoise; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf atadenoise=0.01:0.01 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: removegrain 2с',
    summary:
      'Пространственное сглаживание removegrain=m0=c2 первых 2 с; дымовая проверка removegrain; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf removegrain=m0=c2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: pp al 2с',
    summary:
      'Лёгкая постобработка pp=al первых 2 с; дымовая проверка фильтра pp; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf pp=al -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: dedot 2с',
    summary:
      'Подавление цветовых точек dedot первых 2 с (-vf dedot=spatial_mix=4); дымовая проверка dedot; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf dedot=spatial_mix=4 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: owdenoise 2с',
    summary:
      'Вейвлет-шумодав owdenoise первых 2 с (-vf owdenoise=6.0); дымовая проверка owdenoise; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf owdenoise=6.0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: estdif 2с',
    summary:
      'Деинтерлейс estdif первых 2 с; дымовая проверка estdif; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf estdif -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: w3fdif 2с',
    summary:
      'Деинтерлейс w3fdif первых 2 с; дымовая проверка w3fdif; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf w3fdif -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: kerndeint 2с',
    summary:
      'Деинтерлейс kerndeint=thresh=12 первых 2 с; дымовая проверка kerndeint; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf kerndeint=thresh=12 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: transpose=3 на 1с',
    summary:
      'Поворот transpose=3 (90° по часовой) первую секунду; дымовая проверка transpose; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf transpose=3 -t 1 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale flags neighbor 2с',
    summary:
      'Масштаб соседним пикселем flags=neighbor первых 2 с (-vf scale=320:240:flags=neighbor); дымовая проверка алгоритма scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=320:240:flags=neighbor -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: format yuv420p 2с',
    summary:
      'Принудительный формат пикселей yuv420p первых 2 с (-vf format=yuv420p); дымовая проверка format; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf format=yuv420p -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: stereo3d anaglyph 2с',
    summary:
      'Анаглиф red/cyan через stereo3d первых 2 с (in_sbsl:out_anaglyph); дымовая проверка stereo3d без кавычек в argv; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf stereo3d=sbsl:anaglyph_red_cyan -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: paletteuse dummy 1с',
    summary:
      'Квантование через palettegen+paletteuse первой секунды (256 цветов, однопроходный гиф-подобный путь); дымовая проверка palette*; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf palettegen=max_colors=128:reserve_transparent=0,paletteuse -t 1 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:3 codec_name',
    summary:
      'Четвёртая дорожка субтитров s:3: только codec_name (поле ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:3 -show_entries stream=codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· дорожка данных d:5',
    summary:
      'Шестая data-дорожка d:5: codec_name (поле ffprobe; редкие контейнеры с множеством data); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:5 -show_entries stream=codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:7 index',
    summary:
      'Восьмая аудиодорожка a:7: index (поле ffprobe; редкие мультипотоковые релизы); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:7 -show_entries stream=index -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 первые 10 pict_type',
    summary:
      'Типы кадров I/B/P первых 10 кадров v:0 (-show_frames, поле pict_type, -read_intervals %+#10); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -show_entries frame=pict_type -read_intervals %+#10 -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер tags=encoder,major_brand',
    summary:
      'Два тега контейнера encoder и major_brand (поля format_tags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoder,major_brand -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: histeq 2с',
    summary:
      'Адаптивная эквализация гистограммы histeq первых 2 с; дымовая проверка histeq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf histeq -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: deflicker 3с',
    summary:
      'Подавление мерцания deflicker первых 3 с (-vf deflicker=b=1); дымовая проверка deflicker; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf deflicker=b=1 -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lagfun 2с',
    summary:
      'Шлейф кадров lagfun первых 2 с (-vf lagfun=decay=0.92); дымовая проверка lagfun; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf lagfun=decay=0.92 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: noise 2с',
    summary:
      'Псевдослучайный шум noise первых 2 с (-vf noise=alls=8:allf=t); дымовая проверка noise; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf noise=alls=8:allf=t -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: shufflepixels 2с',
    summary:
      'Перемешивание блоков shufflepixels первых 2 с (56×56, 3 кадра); дымовая проверка shufflepixels; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf shufflepixels=56:56:3 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lenscorrection 2с',
    summary:
      'Лёгкая коррекция дисторсии lenscorrection первых 2 с (k1=-0.01,k2=-0.01); дымовая проверка lenscorrection; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf lenscorrection=cx=0.5:cy=0.5:k1=-0.01:k2=-0.01 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fps=24000/1001 явно 2с',
    summary:
      'Явные 24000/1001 fps на выходе первых 2 с (-vf fps=24000/1001); дымовая проверка дробного fps; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fps=24000/1001 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tinterlace merge 2с',
    summary:
      'Чересстрочное слияние tinterlace=merge + fieldorder=tff первых 2 с; дымовая проверка tinterlace; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tinterlace=merge,fieldorder=tff -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: pseudocolor 2с',
    summary:
      'Псевдоцветовая карта pseudocolor preset=rainbow первых 2 с; дымовая проверка pseudocolor; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf pseudocolor=preset=rainbow -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: colorhold 2с',
    summary:
      'Удержание узкого цветового диапазона colorhold первых 2 с (similarity=0.15); дымовая проверка colorhold; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf colorhold=similarity=0.15 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:4 start_pts',
    summary:
      'Пятая дорожка субтитров s:4: start_pts (поле ffprobe: смещение таймкодов субтитров); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:4 -show_entries stream=start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:5 codec_name',
    summary:
      'Шестой видеопоток v:5: codec_name (поле ffprobe; редкие мультиракурсные контейнеры); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:5 -show_entries stream=codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· дорожка данных d:6',
    summary:
      'Седьмая data-дорожка d:6: codec_tag_string (поле ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:6 -show_entries stream=codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы id и старт',
    summary:
      'Все главы: id и start_time (-show_chapters -show_entries chapter=id,start_time -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter=id,start_time -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 sample_aspect_ratio',
    summary:
      'Поток a:0: sample_aspect_ratio (поле ffprobe: формальный SAR у аудио, часто N/A); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=sample_aspect_ratio -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: bwdif 2с',
    summary:
      'Деинтерлейс bwdif=mode=send_field первых 2 с; дымовая проверка bwdif; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf bwdif=mode=send_field -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: il filter 2с',
    summary:
      'Чередование полей через il=d:c первых 2 с; дымовая проверка фильтра il; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf il=d:c -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: colormatrix 601→709 2с',
    summary:
      'Матрица цветов colormatrix=bt601:bt709 первых 2 с; дымовая проверка colormatrix; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf colormatrix=bt601:bt709 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: smartblur 2с',
    summary:
      'Умное размытие smartblur первых 2 с (-vf smartblur=luma_radius=1.2:luma_strength=0.4); дымовая проверка smartblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf smartblur=luma_radius=1.2:luma_strength=0.4 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: chromakey зелёный 2с',
    summary:
      'Ключ по зелёному chromakey первых 2 с (color=0x00ff00:similarity=0.02:blend=0.05); дымовая проверка chromakey; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf chromakey=color=0x00ff00:similarity=0.02:blend=0.05 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: yadif send_field 2с',
    summary:
      'Деинтерлейс yadif=1:-1:0 (режим send_field) первых 2 с; дымовая проверка числовых опций yadif; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf yadif=1:-1:0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: phase A 2с',
    summary:
      'Коррекция фазы chroma phase=A первых 2 с (-vf phase=A); дымовая проверка phase; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf phase=A -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lumakey 2с',
    summary:
      'Ключ по яркости lumakey первых 2 с (threshold=0.08); дымовая проверка lumakey; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf lumakey=threshold=0.08:tolerance=0.02 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: limiter 2с',
    summary:
      'Ограничитель яркости limiter первых 2 с (16-235); дымовая проверка limiter; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf limiter=16:235 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: colorbalance rgb 2с',
    summary:
      'Сдвиг баланса RGB через colorbalance первых 2 с (rs=0.08 gs=-0.02 bs=0.05); дымовая проверка colorbalance; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf colorbalance=rs=0.08:gs=-0.02:bs=0.05 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 codec_tag',
    summary:
      'Поток v:0: codec_tag (поле ffprobe: числовой тег кодека вместе с codec_tag_string); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=codec_tag -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:5 start_time',
    summary:
      'Шестая дорожка субтитров s:5: start_time (поле ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:5 -show_entries stream=start_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы end_time',
    summary:
      'Все главы: end_time (-show_chapters -show_entries chapter=end_time -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter=end_time -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 channels',
    summary:
      'Вторая аудиодорожка a:1: только channels (поле ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 bt601 709 цвет',
    summary:
      'Поток v:0: color_space, color_transfer и color_primaries одной строкой (поля ffprobe; сводка HDR/SDR); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=color_space,color_transfer,color_primaries -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale divisible 2с',
    summary:
      'Масштаб с force_divisible_by=2 первых 2 с (-vf scale=w=320:h=240:force_divisible_by=2); дымовая проверка выравнивания размеров; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=w=320:h=240:force_divisible_by=2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: colorspace fast 2с',
    summary:
      'Перевод цветового пространства colorspace=iall=bt601:all=bt709:fast=1 первых 2 с; дымовая проверка colorspace; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf colorspace=iall=bt601:all=bt709:fast=1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: framestep 2с',
    summary:
      'Прореживание кадров framestep=2 первых 4 с; дымовая проверка framestep; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf framestep=2 -t 4 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tmideint bob 2с',
    summary:
      'Деинтерлейс tmideint=mode=bob первых 2 с; дымовая проверка tmideint; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tmideint=mode=bob -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: erosion 2с',
    summary:
      'Морфологическое сужение erosion первых 2 с; дымовая проверка erosion; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf erosion -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: dilation 2с',
    summary:
      'Морфологическое расширение dilation первых 2 с; дымовая проверка dilation; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf dilation -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: shuffleplanes 2:1:0',
    summary:
      'Перестановка плоскостей shuffleplanes=2:1:0 первых 2 с; дымовая проверка shuffleplanes; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf shuffleplanes=2:1:0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: decimate cycle 12',
    summary:
      'Прореживание decimate=cycle=12 первых 6 с; дымовая проверка decimate с циклом; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf decimate=cycle=12 -t 6 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale bicubic full chroma 2с',
    summary:
      'Масштаб bicubic с full_chroma_inp первых 2 с (-vf scale=flags=bicubic+full_chroma_inp:interl=0); дымовая проверка scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=w=iw:h=ih:flags=bicubic+full_chroma_inp:interl=0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: avgblur 2с',
    summary:
      'Размытие avgblur 3×3 первых 2 с (-vf avgblur=3:1); дымовая проверка avgblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf avgblur=3:1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер тег album',
    summary: 'Тег контейнера album (поле format_tags=album); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=album -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер musicbrainz_trackid',
    summary:
      'Идентификатор трека MusicBrainz в контейнере (поле format_tags=musicbrainz_trackid); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=musicbrainz_trackid -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:6 кратко',
    summary:
      'Седьмой видеопоток v:6: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:6 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:7 кратко',
    summary:
      'Восьмой поток данных d:7: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:7 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:2 кратко',
    summary:
      'Третий поток вложений t:2: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:2 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:7 disposition',
    summary:
      'Восьмая дорожка субтитров s:7: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:7 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы теги title',
    summary:
      'Теги title у всех глав (-show_chapters -show_entries chapter_tags=title -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter_tags=title -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 pkt_duration_time 3',
    summary:
      'Первые три кадра v:0: длительность пакета pkt_duration_time (-show_frames -read_intervals %+#3); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#3 -show_entries frame=pkt_duration_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fftdnoiz 2с',
    summary:
      'Шумоподавление fftdnoiz=sigma=2 первых 2 с; дымовая проверка fftdnoiz; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fftdnoiz=sigma=2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: bitplanenoise 2с',
    summary:
      'Визуализация битовых плоскостей bitplanenoise=1 первых 2 с; дымовая проверка bitplanenoise; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf bitplanenoise=1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: extractplanes u 2с',
    summary:
      'Извлечь плоскость U через extractplanes=u первых 2 с; дымовая проверка extractplanes; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf extractplanes=u -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: extractplanes v 2с',
    summary:
      'Извлечь плоскость V через extractplanes=v первых 2 с; дымовая проверка extractplanes; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf extractplanes=v -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: setpts startpts 2с',
    summary:
      'Сброс отсчёта времени setpts=PTS-STARTPTS первых 2 с; дымовая проверка setpts; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf setpts=PTS-STARTPTS -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: drawbox 2с',
    summary:
      'Полупрозрачный прямоугольник drawbox первых 2 с; дымовая проверка drawbox; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf drawbox=x=8:y=8:w=80:h=60:color=yellow@0.35 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: format yuv444p 2с',
    summary:
      'Перевод в yuv444p через format=yuv444p первых 2 с; дымовая проверка format; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf format=yuv444p -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hue h s 2с',
    summary:
      'Сдвиг оттенка и насыщенности hue=h=0.15:s=0.92 первых 2 с; дымовая проверка hue; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=h=0.15:s=0.92 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: transpose=1 на 1с',
    summary:
      'Поворот transpose=1 (отражение по главной диагонали) первую секунду; дымовая проверка transpose; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf transpose=1 -t 1 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: volume 0.7 на 2с',
    summary:
      'Линейная громкость volume=0.7 первых 2 с (-af); дымовая проверка volume; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volume=0.7 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: bass g5 f100 4с',
    summary:
      'НЧ-акцент bass=g=5:f=100 первых 4 с; дымовая проверка bass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af bass=g=5:f=100 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: highpass 140 3с',
    summary:
      'ВЧ-срез highpass=f=140 первых 3 с; дымовая проверка highpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=140 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: atempo 1.08 3с',
    summary:
      'Ускорение темпа atempo=1.08 первых 3 с; дымовая проверка atempo; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af atempo=1.08 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер тег mood',
    summary:
      'Тег настроения в контейнере (поле format_tags=mood; каталогизация и плейлисты); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=mood -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:7 кратко',
    summary:
      'Восьмой видеопоток v:7: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:7 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:8 кратко',
    summary:
      'Девятый поток данных d:8: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:8 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:3 кратко',
    summary:
      'Четвёртый поток вложений t:3: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:3 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:8 disposition',
    summary:
      'Девятая дорожка субтитров s:8: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:8 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы start_time',
    summary:
      'Все главы: start_time (-show_chapters -show_entries chapter=start_time -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter=start_time -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 pkt_pos 2',
    summary:
      'Первые два кадра v:0: смещение пакета pkt_pos (-show_frames -read_intervals %+#2); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#2 -show_entries frame=pkt_pos -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер start_time_real duration',
    summary:
      'Поля format: start_time_real и duration (поля ffprobe; сверка времени контейнера); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=start_time_real,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 side_data_list',
    summary:
      'Вторая аудиодорожка a:1: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:8 битрейт',
    summary:
      'Девятая аудиодорожка a:8: кодек и битрейт (поля codec_name и bit_rate); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:8 -show_entries stream=codec_name,bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: blackframe 5с',
    summary:
      'Поиск чёрных кадров blackframe первых 5 с; дымовая проверка blackframe; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf blackframe=amount=99:threshold=16 -t 5 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scdet 4с',
    summary:
      'Детектор смены сцены scdet=s=1 первых 4 с; дымовая проверка scdet; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scdet=s=1 -t 4 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: vaguedenoiser 2с',
    summary:
      'Сглаживание vaguedenoiser=threshold=2 первых 2 с; дымовая проверка vaguedenoiser; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf vaguedenoiser=threshold=2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: chromashift 2с',
    summary:
      'Сдвиг цветности chromashift=h=3:v=1 первых 2 с; дымовая проверка chromashift; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf chromashift=h=3:v=1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale decrease 2с',
    summary:
      'Масштаб с сохранением пропорций force_original_aspect_ratio=decrease до 640×360 первых 2 с; дымовая проверка scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=w=640:h=360:force_original_aspect_ratio=decrease -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tblend multiply 2с',
    summary:
      'Темпоральное смешение tblend=all_mode=multiply первых 2 с; дымовая проверка tblend; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tblend=all_mode=multiply -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: firequalizer -4 3с',
    summary:
      'Лёгкое частотное ослабление firequalizer=gain=-4 первых 3 с; дымовая проверка firequalizer; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af firequalizer=gain=-4 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: stereotools mlev 3с',
    summary:
      'Стерео-коррекция stereotools=mlev=0.1:phlev=0.02 первых 3 с; дымовая проверка stereotools; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af stereotools=mlev=0.1:phlev=0.02 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: alimiter 0.9 2с',
    summary:
      'Лимитер пиков alimiter=limit=0.9 первых 2 с; дымовая проверка alimiter; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af alimiter=limit=0.9 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: geq offset 2с',
    summary:
      'Арифметика яркости geq=lum=lum(X,Y)+8:cb=128:cr=128 первых 2 с; дымовая проверка geq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf geq=lum=lum(X,Y)+8:cb=128:cr=128 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер title comment',
    summary:
      'Теги контейнера title и comment (поля format_tags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=title,comment -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер encoder_version',
    summary:
      'Версия кодировщика в контейнере (поле format_tags=encoder_version; сверка сборки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoder_version -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:8 кратко',
    summary:
      'Девятый видеопоток v:8: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:8 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:9 кратко',
    summary:
      'Десятый поток данных d:9: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:9 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:4 кратко',
    summary:
      'Пятый поток вложений t:4: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:4 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:9 disposition',
    summary:
      'Десятая дорожка субтитров s:9: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:9 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:1 field_order color_range',
    summary:
      'Второй видеопоток v:1: field_order и color_range (поля ffprobe; интерлейс и диапазон); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:1 -show_entries stream=field_order,color_range -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы id end_time',
    summary:
      'Все главы: id и end_time (-show_chapters -show_entries chapter=id,end_time -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter=id,end_time -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 key_frame 5',
    summary:
      'Первые пять кадров v:0: признак ключевого кадра key_frame (-show_frames -read_intervals %+#5); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#5 -show_entries frame=key_frame -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер bit_rate size',
    summary:
      'Поля format: bit_rate и size (поля ffprobe; сверка битрейта и размера файла); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=bit_rate,size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:2 side_data_list',
    summary:
      'Третья аудиодорожка a:2: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:2 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:9 кратко',
    summary:
      'Десятая аудиодорожка a:9: кодек и частота дискретизации (поля codec_name и sample_rate); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:9 -show_entries stream=codec_name,sample_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: minterpolate 3с',
    summary:
      'Интерполяция кадров minterpolate=fps=30:mi_mode=mci первых 3 с; дымовая проверка minterpolate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf minterpolate=fps=30:mi_mode=mci -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: deband 2с',
    summary:
      'Сглаживание полос deband=range=8:blur=16 первых 2 с; дымовая проверка deband; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf deband=range=8:blur=16 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: deflate 2с',
    summary:
      'Морфологическое сжатие deflate первых 2 с; дымовая проверка deflate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf deflate -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: colorlevels 2с',
    summary:
      'Подтяжка уровней colorlevels=rimin=0.02:gimin=0.02:bimin=0.02 первых 2 с; дымовая проверка colorlevels; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf colorlevels=rimin=0.02:gimin=0.02:bimin=0.02 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: unsharp 5x5 2с',
    summary:
      'Резкость unsharp=5:5:0.5:3:3:0.0 первых 2 с; дымовая проверка unsharp; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf unsharp=5:5:0.5:3:3:0.0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: pad even 2с',
    summary:
      'Поля pad до чётных размеров ceil(iw/2)*2 с отступами 12 и чёрной заливкой первых 2 с; дымовая проверка pad; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf pad=ceil(iw/2)*2:ceil(ih/2)*2:12:12:black -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: crop inset 2с',
    summary:
      'Кадрирование с отступами crop=iw-40:ih-30:20:20 первых 2 с; дымовая проверка crop; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf crop=iw-40:ih-30:20:20 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fps 15 3с',
    summary:
      'Прореживание до 15 fps первых 3 с (-vf fps=15); дымовая проверка fps; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fps=15 -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aecho 3с',
    summary:
      'Эхо aecho=0.5:0.55:200:0.2 первых 3 с; дымовая проверка aecho; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aecho=0.5:0.55:200:0.2 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: asetrate 48k 3с',
    summary:
      'Лёгкий resample-питч первых 3 с (-af asetrate=48000*1.03,aresample=48000); дымовая проверка asetrate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af asetrate=48000*1.03,aresample=48000 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:9 кратко',
    summary:
      'Десятый видеопоток v:9: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:9 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:10 кратко',
    summary:
      'Одиннадцатый поток данных d:10: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:10 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:5 кратко',
    summary:
      'Шестой поток вложений t:5: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:5 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:10 disposition',
    summary:
      'Одиннадцатая дорожка субтитров s:10: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:10 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер vendor_id',
    summary:
      'Идентификатор вендора в контейнере (поле format_tags=vendor_id; часто у QuickTime и MOV); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=vendor_id -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер title synopsis',
    summary:
      'Теги контейнера title и synopsis (поля format_tags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=title,synopsis -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы time_base',
    summary:
      'Все главы: time_base (-show_chapters -show_entries chapter=time_base -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter=time_base -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 interlaced 4',
    summary:
      'Первые четыре кадра v:0: признак interlaced_frame (-show_frames -read_intervals %+#4); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#4 -show_entries frame=interlaced_frame -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер flags start_time',
    summary:
      'Поля format: flags и start_time (поля ffprobe; сверка флагов контейнера и старта); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=flags,start_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:3 side_data_list',
    summary:
      'Четвёртая аудиодорожка a:3: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:3 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:10 каналы',
    summary:
      'Одиннадцатая аудиодорожка a:10: кодек и число каналов (поля codec_name и channels); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:10 -show_entries stream=codec_name,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакет v:0 dts_time 1',
    summary:
      'Первый пакет v:0: dts_time (-show_packets -read_intervals %+#1 -show_entries packet=dts_time); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#1 -show_entries packet=dts_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: inflate 2с',
    summary:
      'Морфологическое расширение inflate первых 2 с; дымовая проверка inflate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf inflate -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: despill 2с',
    summary:
      'Подавление зелёного ореола despill=mix=0.12 первых 2 с; дымовая проверка despill; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf despill=mix=0.12 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: exposure 2с',
    summary:
      'Экспозиция exposure=0.4 первых 2 с; дымовая проверка exposure; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf exposure=0.4 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: vibrance 2с',
    summary:
      'Локальная насыщенность vibrance=intensity=0.08 первых 2 с; дымовая проверка vibrance; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf vibrance=intensity=0.08 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hue s 0.75 2с',
    summary:
      'Повышение насыщенности hue=s=0.75 первых 2 с; дымовая проверка hue; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=s=0.75 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: geq scale lum 2с',
    summary:
      'Линейное ослабление яркости geq=lum=lum(X,Y)*0.95:cb=cb(X,Y):cr=cr(X,Y) первых 2 с; дымовая проверка geq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf geq=lum=lum(X,Y)*0.95:cb=cb(X,Y):cr=cr(X,Y) -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: sab 0.35 2с',
    summary:
      'Сглаживание sab=strength=0.35 первых 2 с; дымовая проверка sab; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf sab=strength=0.35 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: cropdetect 3с',
    summary:
      'Оценка обрезки cropdetect=limit=24:round=16 первых 3 с (чёрные поля в stderr); дымовая проверка cropdetect; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf cropdetect=limit=24:round=16 -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fade in 2с',
    summary:
      'Затемнение на входе fade=t=in:st=0:d=0.5 первых 2 с; дымовая проверка fade; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fade=t=in:st=0:d=0.5 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: acrossover 2k5 3с',
    summary:
      'Кроссовер спектра acrossover=split=2500 первых 3 с; дымовая проверка acrossover; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acrossover=split=2500 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: crystalizer 1.4 3с',
    summary:
      'Кристалайзер crystalizer=i=1.4 первых 3 с; дымовая проверка crystalizer; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af crystalizer=i=1.4 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: acrusher 6bit 3с',
    summary:
      'Бит-круш acrusher=bits=6:mode=log первых 3 с; дымовая проверка acrusher; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acrusher=bits=6:mode=log -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:10 кратко',
    summary:
      'Одиннадцатый видеопоток v:10: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:10 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:11 кратко',
    summary:
      'Двенадцатый поток данных d:11: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:11 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:6 кратко',
    summary:
      'Седьмой поток вложений t:6: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:6 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:11 disposition',
    summary:
      'Двенадцатая дорожка субтитров s:11: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:11 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер sort_title',
    summary:
      'Сортировочный заголовок в контейнере (поле format_tags=sort_title; каталоги и плейлисты); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=sort_title -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер genre sort_album',
    summary:
      'Теги контейнера genre и sort_album (поля format_tags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=genre,sort_album -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы id time_base',
    summary:
      'Все главы: id и time_base (-show_chapters -show_entries chapter=id,time_base -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter=id,time_base -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 pkt_size 3',
    summary:
      'Первые три кадра v:0: размер пакета pkt_size (-show_frames -read_intervals %+#3); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#3 -show_entries frame=pkt_size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер duration start_time',
    summary:
      'Поля format: duration и start_time (поля ffprobe; сверка длительности и старта); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=duration,start_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:4 side_data_list',
    summary:
      'Пятая аудиодорожка a:4: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:4 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:3 кратко',
    summary:
      'Четвёртый видеопоток v:3: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:3 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:4 time_base',
    summary:
      'Пятая дорожка субтитров s:4: codec_time_base и time_base (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:4 -show_entries stream=codec_time_base,time_base -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакет v:0 pts_time 1',
    summary:
      'Первый пакет v:0: pts_time (-show_packets -read_intervals %+#1 -show_entries packet=pts_time); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#1 -show_entries packet=pts_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fspp 2с',
    summary:
      'Сглаживание fspp=4 первых 2 с; дымовая проверка fspp; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fspp=4 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: spp 2с',
    summary:
      'Сглаживание spp=5 первых 2 с; дымовая проверка spp; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf spp=5 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rgbashift 2с',
    summary:
      'Сдвиг RGB-каналов rgbashift=rh=2:gh=-1 первых 2 с; дымовая проверка rgbashift; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf rgbashift=rh=2:gh=-1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hqdn3d alt 2с',
    summary:
      'Шумоподавление hqdn3d=4:2:3:4 первых 2 с; дымовая проверка hqdn3d; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hqdn3d=4:2:3:4 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: xbr 2с',
    summary:
      'Масштабирование xbr=n=2 первых 2 с; дымовая проверка xbr; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf xbr=n=2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: dedot mix2 2с',
    summary:
      'Подавление точек dedot=spatial_mix=2 первых 2 с; дымовая проверка dedot; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf dedot=spatial_mix=2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: gradfun 1.1 2с',
    summary:
      'Сглаживание бэнда gradfun=strength=1.1 первых 2 с; дымовая проверка gradfun; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf gradfun=strength=1.1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fade out 2с',
    summary:
      'Затемнение на выходе fade=t=out:st=0:d=0.5 первых 2 с; дымовая проверка fade; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fade=t=out:st=0:d=0.5 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: extrastereo 0.85 3с',
    summary:
      'Стерео-база extrastereo=m=0.85 первых 3 с; дымовая проверка extrastereo; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af extrastereo=m=0.85 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aresample 96k 2с',
    summary:
      'Ресемплинг в 96 kHz aresample=96000 первых 2 с; дымовая проверка aresample; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aresample=96000 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: treble g2 2с',
    summary:
      'ВЧ-полка treble=g=2 первых 2 с; дымовая проверка treble; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af treble=g=2 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: acompressor alt 3с',
    summary:
      'Компрессор acompressor=threshold=0.12:ratio=2.5:attack=3:release=80 первых 3 с; дымовая проверка acompressor; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acompressor=threshold=0.12:ratio=2.5:attack=3:release=80 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: dynaudnorm alt 4с',
    summary:
      'Динамическая нормализация dynaudnorm=g=21:f=200:r=0.85 первых 4 с; дымовая проверка dynaudnorm; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af dynaudnorm=g=21:f=200:r=0.85 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:11 кратко',
    summary:
      'Двенадцатый видеопоток v:11: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:11 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:12 кратко',
    summary:
      'Тринадцатый поток данных d:12: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:12 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:7 кратко',
    summary:
      'Восьмой поток вложений t:7: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:7 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:12 disposition',
    summary:
      'Тринадцатая дорожка субтитров s:12: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:12 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер grouping',
    summary:
      'Тег группировки в контейнере (поле format_tags=grouping; iTunes и каталоги); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=grouping -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер initial_key',
    summary:
      'Тональность initial_key в контейнере (поле format_tags; музыкальные метаданные); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=initial_key -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер BPM encoder',
    summary:
      'Теги контейнера BPM и encoder (поля format_tags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=BPM,encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы start end',
    summary:
      'Все главы: start_time и end_time (-show_chapters -show_entries chapter=start_time,end_time -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter=start_time,end_time -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 best_effort_ts 4',
    summary:
      'Первые четыре кадра v:0: best_effort_timestamp_time (-show_frames -read_intervals %+#4); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#4 -show_entries frame=best_effort_timestamp_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер format_name filename',
    summary:
      'Поля format: format_name и filename (поля ffprobe; имя контейнера и путь); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=format_name,filename -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:5 side_data_list',
    summary:
      'Шестая аудиодорожка a:5: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:5 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:11 кратко',
    summary:
      'Двенадцатая аудиодорожка a:11: кодек и число каналов (поля codec_name и channels); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:11 -show_entries stream=codec_name,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:2 side_data_list',
    summary:
      'Третий видеопоток v:2: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:2 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакет v:0 duration 1',
    summary:
      'Первый пакет v:0: duration (-show_packets -read_intervals %+#1 -show_entries packet=duration); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#1 -show_entries packet=duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: owdenoise 8 2с',
    summary:
      'Вейвлет-шумодав owdenoise=8.0 первых 2 с; дымовая проверка owdenoise; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf owdenoise=8.0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: nlmeans spr 2с',
    summary:
      'Нелокальное среднее nlmeans=s=3:p=5:r=9 первых 2 с; дымовая проверка nlmeans; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf nlmeans=s=3:p=5:r=9 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: atadenoise 0.02 2с',
    summary:
      'Временной шумодав atadenoise=0.02:0.02 первых 2 с; дымовая проверка atadenoise; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf atadenoise=0.02:0.02 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: removegrain m1 2с',
    summary:
      'Пространственное сглаживание removegrain=m1=c1 первых 2 с; дымовая проверка removegrain; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf removegrain=m1=c1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale bilinear 2с',
    summary:
      'Масштаб bilinear 320×240 первых 2 с (-vf scale=320:240:flags=bilinear); дымовая проверка scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=320:240:flags=bilinear -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: afftdn -18 2с',
    summary:
      'FFT-шумодав afftdn=nf=-18 первых 2 с; дымовая проверка afftdn; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afftdn=nf=-18 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lowpass 5k 2с',
    summary:
      'НЧ-срез lowpass=f=5000 первых 2 с; дымовая проверка lowpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowpass=f=5000 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: supereq 7b 3с',
    summary:
      'Десятиполосный superequalizer=7b=-5 первых 3 с; дымовая проверка superequalizer; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af superequalizer=7b=-5 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: agate 0.003 3с',
    summary:
      'Шумовой гейт agate=threshold=0.003:ratio=3:attack=10:release=100 первых 3 с; дымовая проверка agate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af agate=threshold=0.003:ratio=3:attack=10:release=100 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: volume 2dB 2с',
    summary:
      'Громкость volume=2dB первых 2 с; дымовая проверка volume; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volume=2dB -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: yadif 1:-1:1 2с',
    summary:
      'Деинтерлейс yadif=1:-1:1 первых 2 с; дымовая проверка yadif; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf yadif=1:-1:1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: pp hb vb 2с',
    summary:
      'Постобработка pp=hb/vb первых 2 с; дымовая проверка pp; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf pp=hb/vb -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: kerndeint 8 2с',
    summary:
      'Деинтерлейс kerndeint=thresh=8 первых 2 с; дымовая проверка kerndeint; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf kerndeint=thresh=8 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: bwdif send_frame 2с',
    summary:
      'Деинтерлейс bwdif=mode=send_frame первых 2 с; дымовая проверка bwdif; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf bwdif=mode=send_frame -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:12 кратко',
    summary:
      'Тринадцатый видеопоток v:12: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:12 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:13 кратко',
    summary:
      'Четырнадцатый поток данных d:13: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:13 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:8 кратко',
    summary:
      'Девятый поток вложений t:8: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:8 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:13 disposition',
    summary:
      'Четырнадцатая дорожка субтитров s:13: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:13 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер discsubtitle',
    summary:
      'Подзаголовок диска в контейнере (поле format_tags=discsubtitle; мультидисковые сборники); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=discsubtitle -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер media_type',
    summary:
      'Тип носителя в контейнере (поле format_tags=media_type; iTunes и каталоги); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=media_type -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер creation major_brand',
    summary:
      'Теги контейнера creation_time и major_brand (поля format_tags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=creation_time,major_brand -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы теги language',
    summary:
      'Теги language у всех глав (-show_chapters -show_entries chapter_tags=language -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter_tags=language -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 repeat_pict 6',
    summary:
      'Первые шесть кадров v:0: repeat_pict (-show_frames -read_intervals %+#6); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#6 -show_entries frame=repeat_pict -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер nb_streams duration',
    summary:
      'Поля format: nb_streams и duration (поля ffprobe; сверка числа дорожек и длительности); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=nb_streams,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:6 side_data_list',
    summary:
      'Седьмая аудиодорожка a:6: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:6 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:12 кратко',
    summary:
      'Тринадцатая аудиодорожка a:12: кодек и число каналов (поля codec_name и channels); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:12 -show_entries stream=codec_name,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:4 кратко',
    summary:
      'Пятый видеопоток v:4: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:4 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:3 start_pts',
    summary:
      'Четвёртая дорожка субтитров s:3: start_pts (поле ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:3 -show_entries stream=start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакет v:0 flags 1',
    summary:
      'Первый пакет v:0: flags (-show_packets -read_intervals %+#1 -show_entries packet=flags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#1 -show_entries packet=flags -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: mcdeint fast 2с',
    summary:
      'Деинтерлейс mcdeint=mode=fast первых 2 с; дымовая проверка mcdeint; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf mcdeint=mode=fast -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: il d t 2с',
    summary:
      'Чересстрочное поле il=d:t первых 2 с; дымовая проверка il; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf il=d:t -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: eq darker 2с',
    summary:
      'Яркость и контраст eq=brightness=-0.02:contrast=0.98 первых 2 с; дымовая проверка eq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf eq=brightness=-0.02:contrast=0.98 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: histeq str 2с',
    summary:
      'Эквализация histeq=strength=0.2 первых 2 с; дымовая проверка histeq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf histeq=strength=0.2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: deflicker b2 2с',
    summary:
      'Подавление мерцания deflicker=b=2 первых 2 с; дымовая проверка deflicker; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf deflicker=b=2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lagfun 0.85 2с',
    summary:
      'Шлейф кадров lagfun=decay=0.85 первых 2 с; дымовая проверка lagfun; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf lagfun=decay=0.85 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: noise u 2с',
    summary:
      'Шум noise=alls=5:allf=u первых 2 с; дымовая проверка noise; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf noise=alls=5:allf=u -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: weave 2с',
    summary:
      'Переплетение полей weave первых 2 с; дымовая проверка weave; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf weave -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: palettegen 64 1с',
    summary:
      'Палитра palettegen=max_colors=64:reserve_transparent=1,paletteuse первой секунды; дымовая проверка palette*; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf palettegen=max_colors=64:reserve_transparent=1,paletteuse -t 1 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: apad 0.35 3с',
    summary:
      'Тишина в хвосте apad=pad_dur=0.35 первых 3 с; дымовая проверка apad; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af apad=pad_dur=0.35 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: asoftclip tanh 2с',
    summary:
      'Мягкий клип asoftclip=threshold=0.8:type=tanh первых 2 с; дымовая проверка asoftclip; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af asoftclip=threshold=0.8:type=tanh -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: dcshift 2с',
    summary:
      'Постоянная составляющая dcshift=0.005 первых 2 с; дымовая проверка dcshift; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af dcshift=0.005 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: firequalizer +2 2с',
    summary:
      'Частотное усиление firequalizer=gain=2 первых 2 с; дымовая проверка firequalizer; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af firequalizer=gain=2 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: stereotools 0.15 2с',
    summary:
      'Стерео-коррекция stereotools=mlev=0.15:phlev=0.01 первых 2 с; дымовая проверка stereotools; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af stereotools=mlev=0.15:phlev=0.01 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: treble -1 2с',
    summary:
      'Ослабление ВЧ treble=g=-1 первых 2 с; дымовая проверка treble; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af treble=g=-1 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:13 кратко',
    summary:
      'Четырнадцатый видеопоток v:13: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:13 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:14 кратко',
    summary:
      'Пятнадцатый поток данных d:14: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:14 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:9 кратко',
    summary:
      'Десятый поток вложений t:9: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:9 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:14 disposition',
    summary:
      'Пятнадцатая дорожка субтитров s:14: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:14 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер keywords',
    summary:
      'Ключевые слова в контейнере (поле format_tags=keywords; каталогизация); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=keywords -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер podcast url',
    summary:
      'Ссылка на подкаст в контейнере (поле format_tags=podcastURL; iTunes); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=podcastURL -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы start duration',
    summary:
      'Все главы: start_time и duration (-show_chapters -show_entries chapter=start_time,duration -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter=start_time,duration -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 coded_pic 3',
    summary:
      'Первые три кадра v:0: coded_picture_number (-show_frames -read_intervals %+#3); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#3 -show_entries frame=coded_picture_number -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакет v:0 size 1',
    summary:
      'Первый пакет v:0: size (-show_packets -read_intervals %+#1 -show_entries packet=size); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#1 -show_entries packet=size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:5 pix_fmt profile',
    summary:
      'Шестой видеопоток v:5: pix_fmt и profile (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:5 -show_entries stream=pix_fmt,profile -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:3 side_data_list',
    summary:
      'Четвёртый видеопоток v:3: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:3 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:7 side_data_list',
    summary:
      'Восьмая аудиодорожка a:7: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:7 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:13 кратко',
    summary:
      'Четырнадцатая аудиодорожка a:13: кодек и частота дискретизации (поля codec_name и sample_rate); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:13 -show_entries stream=codec_name,sample_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:5 codec_long',
    summary:
      'Шестая дорожка субтитров s:5: codec_long_name (поле ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:5 -show_entries stream=codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: mpdecimate hi12 5с',
    summary:
      'Прореживание mpdecimate=hi=12:lo=640 первых 5 с; дымовая проверка mpdecimate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf mpdecimate=hi=12:lo=640 -t 5 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: deshake search32 2с',
    summary:
      'Стабилизация deshake=search=32:shake=8 первых 2 с; дымовая проверка deshake; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf deshake=search=32:shake=8 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: median 5 2с',
    summary:
      'Медианный фильтр median=5 первых 2 с; дымовая проверка median; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf median=5 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: boxblur 3 2с',
    summary:
      'Размытие boxblur=3:2 первых 2 с; дымовая проверка boxblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf boxblur=3:2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: gblur 0.8 2с',
    summary:
      'Гауссово размытие gblur=sigma=0.8 первых 2 с; дымовая проверка gblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf gblur=sigma=0.8 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: edgedetect 0.15 2с',
    summary:
      'Контуры edgedetect=low=0.15:high=0.35 первых 2 с; дымовая проверка edgedetect; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf edgedetect=low=0.15:high=0.35 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tpad start 2с',
    summary:
      'Паддинг кадров tpad=start_mode=add:start_duration=0.06 первых 2 с; дымовая проверка tpad; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tpad=start_mode=add:start_duration=0.06 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rotate 3° 2с',
    summary:
      'Поворот rotate=3*PI/180 первых 2 с; дымовая проверка rotate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf rotate=3*PI/180 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: shuffleplanes 1:2:0',
    summary:
      'Перестановка плоскостей shuffleplanes=1:2:0 первых 2 с; дымовая проверка shuffleplanes; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf shuffleplanes=1:2:0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: colorchannelmixer gg',
    summary:
      'Микс каналов colorchannelmixer=gg=0.92:rr=1:bb=1 первых 2 с; дымовая проверка colorchannelmixer; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf colorchannelmixer=gg=0.92:rr=1:bb=1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: phase U 2с',
    summary:
      'Фаза chroma phase=U первых 2 с; дымовая проверка phase; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf phase=U -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: pan 0.7 3с',
    summary:
      'Стерео-панорама pan=stereo|c0=0.7*c0+0.3*c1|c1=0.3*c0+0.7*c1 первых 3 с; дымовая проверка pan; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af pan=stereo|c0=0.7*c0+0.3*c1|c1=0.3*c0+0.7*c1 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: haas 8ms 3с',
    summary:
      'Эффект Хааса haas_effect=del_ms=8:side_gain=0.4 первых 3 с; дымовая проверка haas_effect; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af haas_effect=del_ms=8:side_gain=0.4 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rubberband pitch 3с',
    summary:
      'Сдвиг тона rubberband=tempo=1.0:pitch=1.02 первых 3 с; дымовая проверка rubberband; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af rubberband=tempo=1.0:pitch=1.02 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tilt -1 3с',
    summary:
      'Наклон АЧХ tilt=frequency=1200:width=6:g=-1 первых 3 с; дымовая проверка tilt; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af tilt=frequency=1200:width=6:g=-1 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: asubboost 2 3с',
    summary:
      'Подъём низов asubboost=dry=0.7:wet=0.7:boost=2 первых 3 с; дымовая проверка asubboost; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af asubboost=dry=0.7:wet=0.7:boost=2 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: afftdn -12 2с',
    summary:
      'FFT-шумодав afftdn=nf=-12 первых 2 с; дымовая проверка afftdn; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afftdn=nf=-12 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:14 кратко',
    summary:
      'Пятнадцатый видеопоток v:14: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:14 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:15 кратко',
    summary:
      'Шестнадцатый поток данных d:15: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:15 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:10 кратко',
    summary:
      'Одиннадцатый поток вложений t:10: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:10 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:15 disposition',
    summary:
      'Шестнадцатая дорожка субтитров s:15: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:15 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер website',
    summary:
      'Веб-страница в метаданных контейнера (поле format_tags=website; каталоги); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=website -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер encoded_by date',
    summary:
      'Теги контейнера encoded_by и date (поля format_tags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoded_by,date -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы id duration',
    summary:
      'Все главы: id и duration (-show_chapters -show_entries chapter=id,duration -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter=id,duration -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 display_pic 4',
    summary:
      'Первые четыре кадра v:0: display_picture_number (-show_frames -read_intervals %+#4); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#4 -show_entries frame=display_picture_number -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер duration bit_rate',
    summary:
      'Поля format: duration и bit_rate (поля ffprobe; сверка длительности и битрейта); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=duration,bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакет v:0 pos 1',
    summary:
      'Первый пакет v:0: pos (-show_packets -read_intervals %+#1 -show_entries packet=pos); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#1 -show_entries packet=pos -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:6 color range space',
    summary:
      'Седьмой видеопоток v:6: color_range и color_space (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:6 -show_entries stream=color_range,color_space -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:8 side_data_list',
    summary:
      'Девятая аудиодорожка a:8: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:8 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:14 кратко',
    summary:
      'Пятнадцатая аудиодорожка a:14: кодек и layout каналов (поля codec_name и channel_layout); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:14 -show_entries stream=codec_name,channel_layout -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:6 disposition',
    summary:
      'Седьмая дорожка субтитров s:6: disposition и codec_tag_string (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:6 -show_entries stream=disposition,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hflip vflip 2с',
    summary:
      'Цепочка hflip,vflip первых 2 с; дымовая проверка отражений; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hflip,vflip -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: setsar 4:3 2с',
    summary:
      'Выставление SAR 4:3 setsar=4/3 первых 2 с; дымовая проверка setsar; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf setsar=4/3 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fps 12 3с',
    summary:
      'Прореживание до 12 fps первых 3 с (-vf fps=12); дымовая проверка fps; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fps=12 -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: smartblur 1.5 2с',
    summary:
      'Умное размытие smartblur=luma_radius=1.5:luma_strength=0.35 первых 2 с; дымовая проверка smartblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf smartblur=luma_radius=1.5:luma_strength=0.35 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hqdn3d 3:2 2с',
    summary:
      'Шумодав hqdn3d=3:2:4:3 первых 2 с; дымовая проверка hqdn3d; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hqdn3d=3:2:4:3 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: curves darker 2с',
    summary:
      'Кривые curves=preset=darker первых 2 с; дымовая проверка curves; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf curves=preset=darker -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: colorbalance rs 2с',
    summary:
      'Баланс красного colorbalance=rs=-0.05 первых 2 с; дымовая проверка colorbalance; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf colorbalance=rs=-0.05 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: silenceremove 0.15 6с',
    summary:
      'Удаление ведущей тишины silenceremove=start_periods=1:start_duration=0.15:start_threshold=-48dB:detection=peak первых 6 с; дымовая проверка silenceremove; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af silenceremove=start_periods=1:start_duration=0.15:start_threshold=-48dB:detection=peak:stop_periods=-1 -t 6 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: apulsator tri 3с',
    summary:
      'Стерео-пульсатор apulsator=mode=triangle:hz=0.5:width=3 первых 3 с; дымовая проверка apulsator; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af apulsator=mode=triangle:hz=0.5:width=3 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: flanger delay 3с',
    summary:
      'Флэнжер flanger=delay=2:depth=1 первых 3 с; дымовая проверка flanger; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af flanger=delay=2:depth=1 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: deesser 0.3 3с',
    summary:
      'Де-эссер deesser=i=0.3 первых 3 с; дымовая проверка deesser; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af deesser=i=0.3 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aformat s32 2с',
    summary:
      'Формат сэмпла aformat=sample_fmts=s32 первых 2 с; дымовая проверка aformat; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aformat=sample_fmts=s32 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: acompressor 0.09 3с',
    summary:
      'Компрессор acompressor=threshold=0.09:ratio=2.8:attack=4:release=60 первых 3 с; дымовая проверка acompressor; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acompressor=threshold=0.09:ratio=2.8:attack=4:release=60 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:15 кратко',
    summary:
      'Шестнадцатый видеопоток v:15: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:15 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:16 кратко',
    summary:
      'Семнадцатый поток данных d:16: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:16 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:11 кратко',
    summary:
      'Двенадцатый поток вложений t:11: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:11 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:16 disposition',
    summary:
      'Семнадцатая дорожка субтитров s:16: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:16 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер compilation',
    summary:
      'Флаг сборника в контейнере (поле format_tags=compilation; iTunes compilation); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=compilation -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер replaygain album',
    summary:
      'ReplayGain альбома в контейнере (поле format_tags=replaygain_album_gain); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=replaygain_album_gain -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы tags genre',
    summary:
      'Теги genre у всех глав (-show_chapters -show_entries chapter_tags=genre -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter_tags=genre -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 pkt_pts 5',
    summary:
      'Первые пять кадров v:0: pkt_pts_time (-show_frames -read_intervals %+#5 -show_entries frame=pkt_pts_time); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#5 -show_entries frame=pkt_pts_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакеты v:0 duration 2',
    summary:
      'Первые два пакета v:0: duration (-show_packets -read_intervals %+#2 -show_entries packet=duration); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#2 -show_entries packet=duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакеты v:0 flags 2',
    summary:
      'Первые два пакета v:0: flags (-show_packets -read_intervals %+#2 -show_entries packet=flags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#2 -show_entries packet=flags -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер filename size',
    summary:
      'Поля format: filename и size (поля ffprobe; сверка имени файла и размера); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=filename,size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:7 color prim transfer',
    summary:
      'Восьмой видеопоток v:7: color_primaries и color_transfer (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:7 -show_entries stream=color_primaries,color_transfer -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:1 stream_tags title',
    summary:
      'Вторая дорожка субтитров s:1: stream_tags title (поле stream_tags=title); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream_tags=title -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:15 кратко',
    summary:
      'Шестнадцатая аудиодорожка a:15: кодек и битность (поля codec_name и bits_per_sample); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:15 -show_entries stream=codec_name,bits_per_sample -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:9 side_data_list',
    summary:
      'Десятая аудиодорожка a:9: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:9 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:2 field_order space',
    summary:
      'Третий видеопоток v:2: field_order и color_space (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:2 -show_entries stream=field_order,color_space -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:7 index codec',
    summary:
      'Восьмая дорожка субтитров s:7: индекс и кодек (поля index и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:7 -show_entries stream=index,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:16 кратко',
    summary:
      'Семнадцатая аудиодорожка a:16: кодек и число каналов (поля codec_name и channels); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:16 -show_entries stream=codec_name,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: transpose 2 2с',
    summary:
      'Поворот transpose=2 первых 2 с; дымовая проверка transpose; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf transpose=2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: crop inset 2с',
    summary:
      'Кадрирование crop=20:20:iw-40:ih-40 первых 2 с; дымовая проверка crop; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf crop=20:20:iw-40:ih-40 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: eq gamma 2с',
    summary:
      'Коррекция eq=gamma=1.08:saturation=1.05 первых 2 с; дымовая проверка eq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf eq=gamma=1.08:saturation=1.05 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hue h45 2с',
    summary:
      'Оттенок hue=h=45:s=0.9 первых 2 с; дымовая проверка hue; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=h=45:s=0.9 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: vignette angle 2с',
    summary:
      'Виньетка vignette=PI/4 первых 2 с; дымовая проверка vignette; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf vignette=PI/4 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tblend diff 2с',
    summary:
      'Смежные кадры tblend=all_mode=difference первых 2 с; дымовая проверка tblend; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tblend=all_mode=difference -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fps 24000/1001 3с',
    summary:
      'Частота кадров fps=24000/1001 первых 3 с; дымовая проверка fps; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fps=24000/1001 -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aecho 55ms 3с',
    summary:
      'Эхо aecho=0.65:0.72:55:0.25 первых 3 с; дымовая проверка aecho; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aecho=0.65:0.72:55:0.25 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: crystalizer 1.6 2с',
    summary:
      'Кристаллизатор crystalizer=i=1.6 первых 2 с; дымовая проверка crystalizer; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af crystalizer=i=1.6 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: extrastereo 1.2 2с',
    summary:
      'Расширение стереобазы extrastereo=m=1.2 первых 2 с; дымовая проверка extrastereo; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af extrastereo=m=1.2 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: alimiter 0.92 2с',
    summary:
      'Лимитер alimiter=limit=0.92:attack=2:release=80 первых 2 с; дымовая проверка alimiter; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af alimiter=limit=0.92:attack=2:release=80 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: asetrate 44k 2с',
    summary:
      'Сдвиг частоты дискретизации asetrate=44100*1.01,aresample=44100 первых 2 с; дымовая проверка asetrate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af asetrate=44100*1.01,aresample=44100 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: dynaudnorm f 2с',
    summary:
      'Динамическая нормализация dynaudnorm=f=150:g=15 первых 2 с; дымовая проверка dynaudnorm; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af dynaudnorm=f=150:g=15 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:16 кратко',
    summary:
      'Семнадцатый видеопоток v:16: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:16 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:17 кратко',
    summary:
      'Восемнадцатый поток данных d:17: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:17 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:12 кратко',
    summary:
      'Тринадцатый поток вложений t:12: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:12 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:17 disposition',
    summary:
      'Восемнадцатая дорожка субтитров s:17: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:17 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер show',
    summary:
      'Название шоу в контейнере (поле format_tags=show; сериалы и подкасты); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=show -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер season_number',
    summary:
      'Номер сезона в контейнере (поле format_tags=season_number; медиатеки сериалов); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=season_number -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер episode_id',
    summary:
      'Идентификатор эпизода в контейнере (поле format_tags=episode_id); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=episode_id -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы tags artist',
    summary:
      'Теги artist у всех глав (-show_chapters -show_entries chapter_tags=artist -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter_tags=artist -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 pkt_dts 5',
    summary:
      'Первые пять кадров v:0: pkt_dts_time (-show_frames -read_intervals %+#5 -show_entries frame=pkt_dts_time); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#5 -show_entries frame=pkt_dts_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакеты v:0 pos 2',
    summary:
      'Первые два пакета v:0: pos (-show_packets -read_intervals %+#2 -show_entries packet=pos); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#2 -show_entries packet=pos -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер format long name',
    summary:
      'Человекочитаемое имя контейнера (поле format_long_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=format_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:8 color range transfer',
    summary:
      'Девятый видеопоток v:8: color_range и color_transfer (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:8 -show_entries stream=color_range,color_transfer -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:2 stream_tags lang',
    summary:
      'Третья дорожка субтитров s:2: stream_tags language (поле stream_tags=language); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:2 -show_entries stream_tags=language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:17 кратко',
    summary:
      'Восемнадцатая аудиодорожка a:17: кодек и layout каналов (поля codec_name и channel_layout); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:17 -show_entries stream=codec_name,channel_layout -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:10 side_data_list',
    summary:
      'Одиннадцатая аудиодорожка a:10: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:10 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:3 refs level',
    summary:
      'Четвёртый видеопоток v:3: refs и level (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:3 -show_entries stream=refs,level -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rotate -2° 2с',
    summary:
      'Поворот rotate=-2*PI/180 первых 2 с; дымовая проверка rotate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf rotate=-2*PI/180 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale 1280x720 2с',
    summary:
      'Масштабирование scale=1280:720 первых 2 с; дымовая проверка scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=1280:720 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hue h-30 2с',
    summary:
      'Смещение оттенка hue=h=-30:s=1.05 первых 2 с; дымовая проверка hue; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=h=-30:s=1.05 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: eq contrast 2с',
    summary:
      'Контраст и яркость eq=contrast=1.08:brightness=0.01 первых 2 с; дымовая проверка eq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf eq=contrast=1.08:brightness=0.01 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tpad stop 2с',
    summary:
      'Паддинг в конце tpad=stop_mode=clone:stop_duration=0.08 первых 2 с; дымовая проверка tpad; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tpad=stop_mode=clone:stop_duration=0.08 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tmix 4 2с',
    summary:
      'Смешивание соседних кадров tmix=frames=4 первых 2 с; дымовая проверка tmix; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tmix=frames=4 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: avgblur 3 2с',
    summary:
      'Среднее размытие avgblur=3:3 первых 2 с; дымовая проверка avgblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf avgblur=3:3 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: deband r32 2с',
    summary:
      'Сглаживание полос deband=range=32:blur=1 первых 2 с; дымовая проверка deband; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf deband=range=32:blur=1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aecho 80ms 3с',
    summary:
      'Эхо aecho=0.7:0.75:80:0.3 первых 3 с; дымовая проверка aecho; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aecho=0.7:0.75:80:0.3 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lowpass 4200 2с',
    summary:
      'Срез ВЧ lowpass=f=4200 первых 2 с; дымовая проверка lowpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowpass=f=4200 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: highpass 90 2с',
    summary:
      'Срез НЧ highpass=f=90 первых 2 с; дымовая проверка highpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=90 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: atempo 1.03 3с',
    summary:
      'Ускорение atempo=1.03 первых 3 с; дымовая проверка atempo; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af atempo=1.03 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: afftdn -10 2с',
    summary:
      'FFT-шумодав afftdn=nf=-10 первых 2 с; дымовая проверка afftdn; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afftdn=nf=-10 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: volume -1dB 2с',
    summary:
      'Ослабление громкости volume=-1dB первых 2 с; дымовая проверка volume; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volume=-1dB -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: alimiter 0.95 2с',
    summary:
      'Лимитер alimiter=limit=0.95:attack=3:release=70 первых 2 с; дымовая проверка alimiter; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af alimiter=limit=0.95:attack=3:release=70 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:17 кратко',
    summary:
      'Восемнадцатый видеопоток v:17: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:17 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:18 кратко',
    summary:
      'Девятнадцатый поток данных d:18: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:18 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:13 кратко',
    summary:
      'Четырнадцатый поток вложений t:13: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:13 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:18 disposition',
    summary:
      'Девятнадцатая дорожка субтитров s:18: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:18 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер tv_network',
    summary:
      'Телеканал/сеть в контейнере (поле format_tags=tv_network); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=tv_network -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер episode_sort',
    summary:
      'Порядковый номер эпизода в контейнере (поле format_tags=episode_sort); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=episode_sort -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер service_provider',
    summary:
      'Поставщик сервиса в контейнере (поле format_tags=service_provider); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=service_provider -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы tags comment',
    summary:
      'Теги comment у всех глав (-show_chapters -show_entries chapter_tags=comment -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter_tags=comment -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 best_effort 5',
    summary:
      'Первые пять кадров v:0: best_effort_timestamp_time (-show_frames -read_intervals %+#5); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#5 -show_entries frame=best_effort_timestamp_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакеты v:0 dts 2',
    summary:
      'Первые два пакета v:0: dts_time (-show_packets -read_intervals %+#2 -show_entries packet=dts_time); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#2 -show_entries packet=dts_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер bit_rate size',
    summary:
      'Поля format: bit_rate и size (поля ffprobe; сверка веса и суммарного битрейта); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=bit_rate,size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:9 pix_fmt level',
    summary:
      'Десятый видеопоток v:9: pix_fmt и level (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:9 -show_entries stream=pix_fmt,level -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:3 stream_tags title',
    summary:
      'Четвёртая дорожка субтитров s:3: stream_tags title (поле stream_tags=title); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:3 -show_entries stream_tags=title -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:18 кратко',
    summary:
      'Девятнадцатая аудиодорожка a:18: кодек и битность (поля codec_name и bits_per_sample); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:18 -show_entries stream=codec_name,bits_per_sample -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:11 side_data_list',
    summary:
      'Двенадцатая аудиодорожка a:11: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:11 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:4 coded_width height',
    summary:
      'Пятый видеопоток v:4: coded_width и coded_height (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:4 -show_entries stream=coded_width,coded_height -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rotate 1° 2с',
    summary:
      'Поворот rotate=PI/180 первых 2 с; дымовая проверка rotate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf rotate=PI/180 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale 854x480 2с',
    summary:
      'Масштабирование scale=854:480 первых 2 с; дымовая проверка scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=854:480 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hue s1.15 2с',
    summary:
      'Насыщенность hue=s=1.15 первых 2 с; дымовая проверка hue; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=s=1.15 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: eq gamma_weight 2с',
    summary:
      'Коррекция eq=gamma=1.04:gamma_weight=0.9 первых 2 с; дымовая проверка eq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf eq=gamma=1.04:gamma_weight=0.9 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tpad start 2с clone',
    summary:
      'Паддинг в начале tpad=start_mode=clone:start_duration=0.08 первых 2 с; дымовая проверка tpad; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tpad=start_mode=clone:start_duration=0.08 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tmix 3 2с',
    summary:
      'Смешивание соседних кадров tmix=frames=3 первых 2 с; дымовая проверка tmix; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tmix=frames=3 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: gblur 1.2 2с',
    summary:
      'Гауссово размытие gblur=sigma=1.2 первых 2 с; дымовая проверка gblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf gblur=sigma=1.2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: gradfun 1.3 2с',
    summary:
      'Подавление бэндинга gradfun=1.3 первых 2 с; дымовая проверка gradfun; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf gradfun=1.3 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aecho 95ms 3с',
    summary:
      'Эхо aecho=0.72:0.78:95:0.35 первых 3 с; дымовая проверка aecho; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aecho=0.72:0.78:95:0.35 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lowpass 3600 2с',
    summary:
      'Срез ВЧ lowpass=f=3600 первых 2 с; дымовая проверка lowpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowpass=f=3600 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: highpass 120 2с',
    summary:
      'Срез НЧ highpass=f=120 первых 2 с; дымовая проверка highpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=120 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: atempo 0.97 3с',
    summary:
      'Замедление atempo=0.97 первых 3 с; дымовая проверка atempo; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af atempo=0.97 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: afftdn -9 2с',
    summary:
      'FFT-шумодав afftdn=nf=-9 первых 2 с; дымовая проверка afftdn; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afftdn=nf=-9 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: volume +0.8dB 2с',
    summary:
      'Подъём громкости volume=0.8dB первых 2 с; дымовая проверка volume; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volume=0.8dB -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: alimiter 0.9 2с',
    summary:
      'Лимитер alimiter=limit=0.9:attack=2:release=60 первых 2 с; дымовая проверка alimiter; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af alimiter=limit=0.9:attack=2:release=60 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:18 кратко',
    summary:
      'Девятнадцатый видеопоток v:18: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:18 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:19 кратко',
    summary:
      'Двадцатый поток данных d:19: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:19 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:14 кратко',
    summary:
      'Пятнадцатый поток вложений t:14: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:14 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:19 disposition',
    summary:
      'Двадцатая дорожка субтитров s:19: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:19 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер synopsis',
    summary:
      'Краткое описание в контейнере (поле format_tags=synopsis); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=synopsis -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер network',
    summary:
      'Сеть вещания в контейнере (поле format_tags=network); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=network -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер hd_video',
    summary:
      'Флаг HD-видео в контейнере (поле format_tags=hd_video); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=hd_video -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы tags encoder',
    summary:
      'Теги encoder у всех глав (-show_chapters -show_entries chapter_tags=encoder -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter_tags=encoder -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 pkt_duration 5',
    summary:
      'Первые пять кадров v:0: pkt_duration_time (-show_frames -read_intervals %+#5); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#5 -show_entries frame=pkt_duration_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакеты v:0 pts 2',
    summary:
      'Первые два пакета v:0: pts_time (-show_packets -read_intervals %+#2 -show_entries packet=pts_time); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#2 -show_entries packet=pts_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер start_time size',
    summary: 'Поля format: start_time и size (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=start_time,size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:10 field_order refs',
    summary:
      'Одиннадцатый видеопоток v:10: field_order и refs (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:10 -show_entries stream=field_order,refs -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:4 stream_tags lang',
    summary:
      'Пятая дорожка субтитров s:4: stream_tags language (поле stream_tags=language); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:4 -show_entries stream_tags=language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:19 кратко',
    summary:
      'Двадцатая аудиодорожка a:19: кодек и число каналов (поля codec_name и channels); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:19 -show_entries stream=codec_name,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:12 side_data_list',
    summary:
      'Тринадцатая аудиодорожка a:12: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:12 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:5 color_space primaries',
    summary:
      'Шестой видеопоток v:5: color_space и color_primaries (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:5 -show_entries stream=color_space,color_primaries -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rotate 4° 2с',
    summary:
      'Поворот rotate=4*PI/180 первых 2 с; дымовая проверка rotate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf rotate=4*PI/180 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale 1024x576 2с',
    summary:
      'Масштабирование scale=1024:576 первых 2 с; дымовая проверка scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=1024:576 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hue h15 2с',
    summary:
      'Смещение оттенка hue=h=15:s=1.0 первых 2 с; дымовая проверка hue; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=h=15:s=1.0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: eq contrast 0.96 2с',
    summary:
      'Контраст и яркость eq=contrast=0.96:brightness=-0.01 первых 2 с; дымовая проверка eq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf eq=contrast=0.96:brightness=-0.01 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tpad stop clone 3с',
    summary:
      'Паддинг в конце tpad=stop_mode=clone:stop_duration=0.12 первых 3 с; дымовая проверка tpad; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tpad=stop_mode=clone:stop_duration=0.12 -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tmix 5 2с',
    summary:
      'Смешивание соседних кадров tmix=frames=5 первых 2 с; дымовая проверка tmix; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tmix=frames=5 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: boxblur 2 2с',
    summary:
      'Размытие boxblur=2:1 первых 2 с; дымовая проверка boxblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf boxblur=2:1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: deband r28 2с',
    summary:
      'Сглаживание полос deband=range=28:blur=1 первых 2 с; дымовая проверка deband; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf deband=range=28:blur=1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aecho 110ms 3с',
    summary:
      'Эхо aecho=0.75:0.8:110:0.4 первых 3 с; дымовая проверка aecho; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aecho=0.75:0.8:110:0.4 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lowpass 3000 2с',
    summary:
      'Срез ВЧ lowpass=f=3000 первых 2 с; дымовая проверка lowpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowpass=f=3000 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: highpass 150 2с',
    summary:
      'Срез НЧ highpass=f=150 первых 2 с; дымовая проверка highpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=150 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: atempo 1.06 3с',
    summary:
      'Ускорение atempo=1.06 первых 3 с; дымовая проверка atempo; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af atempo=1.06 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: afftdn -8 2с',
    summary:
      'FFT-шумодав afftdn=nf=-8 первых 2 с; дымовая проверка afftdn; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afftdn=nf=-8 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: volume -0.6dB 2с',
    summary:
      'Ослабление громкости volume=-0.6dB первых 2 с; дымовая проверка volume; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volume=-0.6dB -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: alimiter 0.88 2с',
    summary:
      'Лимитер alimiter=limit=0.88:attack=3:release=75 первых 2 с; дымовая проверка alimiter; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af alimiter=limit=0.88:attack=3:release=75 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:19 кратко',
    summary:
      'Двадцатый видеопоток v:19: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:19 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:20 кратко',
    summary:
      'Двадцать первый поток данных d:20: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:20 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:15 кратко',
    summary:
      'Шестнадцатый поток вложений t:15: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:15 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:20 disposition',
    summary:
      'Двадцать первая дорожка субтитров s:20: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:20 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер season',
    summary: 'Сезон в контейнере (поле format_tags=season); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=season -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер episode',
    summary:
      'Эпизод в контейнере (поле format_tags=episode); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=episode -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер media_type',
    summary:
      'Тип медиа в контейнере (поле format_tags=media_type); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=media_type -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы tags language',
    summary:
      'Теги language у всех глав (-show_chapters -show_entries chapter_tags=language -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter_tags=language -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 pict_type 6',
    summary:
      'Первые шесть кадров v:0: pict_type (-show_frames -read_intervals %+#6); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#6 -show_entries frame=pict_type -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакеты v:0 size 2',
    summary:
      'Первые два пакета v:0: size (-show_packets -read_intervals %+#2 -show_entries packet=size); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#2 -show_entries packet=size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер duration size',
    summary: 'Поля format: duration и size (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=duration,size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:11 color_transfer primaries',
    summary:
      'Двенадцатый видеопоток v:11: color_transfer и color_primaries (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:11 -show_entries stream=color_transfer,color_primaries -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:5 stream_tags title',
    summary:
      'Шестая дорожка субтитров s:5: stream_tags title (поле stream_tags=title); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:5 -show_entries stream_tags=title -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:20 кратко',
    summary:
      'Двадцать первая аудиодорожка a:20: кодек и bit_rate (поля codec_name и bit_rate); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:20 -show_entries stream=codec_name,bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:13 side_data_list',
    summary:
      'Четырнадцатая аудиодорожка a:13: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:13 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:6 level refs',
    summary:
      'Седьмой видеопоток v:6: level и refs (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:6 -show_entries stream=level,refs -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rotate -5° 2с',
    summary:
      'Поворот rotate=-5*PI/180 первых 2 с; дымовая проверка rotate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf rotate=-5*PI/180 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale 960x540 2с',
    summary:
      'Масштабирование scale=960:540 первых 2 с; дымовая проверка scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=960:540 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hue h-20 2с',
    summary:
      'Смещение оттенка hue=h=-20:s=0.95 первых 2 с; дымовая проверка hue; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=h=-20:s=0.95 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: eq gamma 0.98 2с',
    summary:
      'Коррекция eq=gamma=0.98:contrast=1.02 первых 2 с; дымовая проверка eq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf eq=gamma=0.98:contrast=1.02 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tpad start add 3с',
    summary:
      'Паддинг в начале tpad=start_mode=add:start_duration=0.12 первых 3 с; дымовая проверка tpad; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tpad=start_mode=add:start_duration=0.12 -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tmix 6 2с',
    summary:
      'Смешивание соседних кадров tmix=frames=6 первых 2 с; дымовая проверка tmix; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tmix=frames=6 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: gblur 1.5 2с',
    summary:
      'Гауссово размытие gblur=sigma=1.5 первых 2 с; дымовая проверка gblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf gblur=sigma=1.5 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: gradfun 1.5 2с',
    summary:
      'Подавление бэндинга gradfun=1.5 первых 2 с; дымовая проверка gradfun; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf gradfun=1.5 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aecho 130ms 3с',
    summary:
      'Эхо aecho=0.78:0.82:130:0.42 первых 3 с; дымовая проверка aecho; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aecho=0.78:0.82:130:0.42 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lowpass 2600 2с',
    summary:
      'Срез ВЧ lowpass=f=2600 первых 2 с; дымовая проверка lowpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowpass=f=2600 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: highpass 180 2с',
    summary:
      'Срез НЧ highpass=f=180 первых 2 с; дымовая проверка highpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=180 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: atempo 0.94 3с',
    summary:
      'Замедление atempo=0.94 первых 3 с; дымовая проверка atempo; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af atempo=0.94 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: afftdn -7 2с',
    summary:
      'FFT-шумодав afftdn=nf=-7 первых 2 с; дымовая проверка afftdn; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afftdn=nf=-7 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: volume +1dB 2с',
    summary:
      'Подъём громкости volume=1dB первых 2 с; дымовая проверка volume; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volume=1dB -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: alimiter 0.86 2с',
    summary:
      'Лимитер alimiter=limit=0.86:attack=4:release=80 первых 2 с; дымовая проверка alimiter; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af alimiter=limit=0.86:attack=4:release=80 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:20 кратко',
    summary:
      'Двадцать первый видеопоток v:20: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:20 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:21 кратко',
    summary:
      'Двадцать второй поток данных d:21: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:21 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:16 кратко',
    summary:
      'Семнадцатый поток вложений t:16: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:16 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:21 disposition',
    summary:
      'Двадцать вторая дорожка субтитров s:21: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:21 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер station',
    summary:
      'Станция/канал в контейнере (поле format_tags=station); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=station -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер album_artist',
    summary:
      'Исполнитель альбома в контейнере (поле format_tags=album_artist); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=album_artist -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер purchase_date',
    summary:
      'Дата покупки в контейнере (поле format_tags=purchase_date); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=purchase_date -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы tags title',
    summary:
      'Теги title у всех глав (-show_chapters -show_entries chapter_tags=title -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter_tags=title -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 key_frame 6',
    summary:
      'Первые шесть кадров v:0: key_frame (-show_frames -read_intervals %+#6); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#6 -show_entries frame=key_frame -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакеты v:0 duration 2',
    summary:
      'Первые два пакета v:0: duration (-show_packets -read_intervals %+#2 -show_entries packet=duration); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#2 -show_entries packet=duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер filename duration',
    summary:
      'Поля format: filename и duration (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=filename,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:12 pix_fmt profile',
    summary:
      'Тринадцатый видеопоток v:12: pix_fmt и profile (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:12 -show_entries stream=pix_fmt,profile -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:6 stream_tags lang',
    summary:
      'Седьмая дорожка субтитров s:6: stream_tags language (поле stream_tags=language); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:6 -show_entries stream_tags=language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:21 кратко',
    summary:
      'Двадцать вторая аудиодорожка a:21: кодек и sample_rate (поля codec_name и sample_rate); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:21 -show_entries stream=codec_name,sample_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:14 side_data_list',
    summary:
      'Пятнадцатая аудиодорожка a:14: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:14 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:7 color_range transfer',
    summary:
      'Восьмой видеопоток v:7: color_range и color_transfer (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:7 -show_entries stream=color_range,color_transfer -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rotate 6° 2с',
    summary:
      'Поворот rotate=6*PI/180 первых 2 с; дымовая проверка rotate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf rotate=6*PI/180 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale 1280x544 2с',
    summary:
      'Масштабирование scale=1280:544 первых 2 с; дымовая проверка scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=1280:544 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hue h25 2с',
    summary:
      'Смещение оттенка hue=h=25:s=1.05 первых 2 с; дымовая проверка hue; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=h=25:s=1.05 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: eq brightness 2с',
    summary:
      'Коррекция eq=brightness=0.02:contrast=1.01 первых 2 с; дымовая проверка eq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf eq=brightness=0.02:contrast=1.01 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tpad stop add 3с',
    summary:
      'Паддинг в конце tpad=stop_mode=add:stop_duration=0.1 первых 3 с; дымовая проверка tpad; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tpad=stop_mode=add:stop_duration=0.1 -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tmix 7 2с',
    summary:
      'Смешивание соседних кадров tmix=frames=7 первых 2 с; дымовая проверка tmix; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tmix=frames=7 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: boxblur 3 2с',
    summary:
      'Размытие boxblur=3:1 первых 2 с; дымовая проверка boxblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf boxblur=3:1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: deband r24 2с',
    summary:
      'Сглаживание полос deband=range=24:blur=1 первых 2 с; дымовая проверка deband; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf deband=range=24:blur=1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aecho 145ms 3с',
    summary:
      'Эхо aecho=0.8:0.84:145:0.45 первых 3 с; дымовая проверка aecho; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aecho=0.8:0.84:145:0.45 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lowpass 2300 2с',
    summary:
      'Срез ВЧ lowpass=f=2300 первых 2 с; дымовая проверка lowpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowpass=f=2300 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: highpass 200 2с',
    summary:
      'Срез НЧ highpass=f=200 первых 2 с; дымовая проверка highpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=200 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: atempo 1.09 3с',
    summary:
      'Ускорение atempo=1.09 первых 3 с; дымовая проверка atempo; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af atempo=1.09 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: afftdn -6 2с',
    summary:
      'FFT-шумодав afftdn=nf=-6 первых 2 с; дымовая проверка afftdn; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afftdn=nf=-6 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: volume -1.2dB 2с',
    summary:
      'Ослабление громкости volume=-1.2dB первых 2 с; дымовая проверка volume; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volume=-1.2dB -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: alimiter 0.84 2с',
    summary:
      'Лимитер alimiter=limit=0.84:attack=4:release=85 первых 2 с; дымовая проверка alimiter; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af alimiter=limit=0.84:attack=4:release=85 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:27 кратко',
    summary:
      'Двадцать восьмой видеопоток v:27: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:27 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:28 кратко',
    summary:
      'Двадцать девятый поток данных d:28: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:28 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер network',
    summary:
      'Сеть вещания в контейнере (поле format_tags=network); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=network -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер service_provider',
    summary:
      'Поставщик сервиса в контейнере (поле format_tags=service_provider); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=service_provider -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 pkt_pts 9',
    summary:
      'Первые девять кадров v:0: pkt_pts_time (-show_frames -read_intervals %+#9); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#9 -show_entries frame=pkt_pts_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакеты v:0 dts 2',
    summary:
      'Первые два пакета v:0: dts_time (-show_packets -read_intervals %+#2 -show_entries packet=dts_time); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#2 -show_entries packet=dts_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:14 color range refs',
    summary:
      'Пятнадцатый видеопоток v:14: color_range и refs (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:14 -show_entries stream=color_range,refs -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:21 side_data_list',
    summary:
      'Двадцать вторая аудиодорожка a:21: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:21 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rotate -14° 2с',
    summary:
      'Поворот rotate=-14*PI/180 первых 2 с; дымовая проверка rotate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf rotate=-14*PI/180 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale 1792x1008 2с',
    summary:
      'Масштабирование scale=1792:1008 первых 2 с; дымовая проверка scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=1792:1008 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hue h-70 2с',
    summary:
      'Смещение оттенка hue=h=-70:s=1.0 первых 2 с; дымовая проверка hue; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=h=-70:s=1.0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: eq gamma 1.14 2с',
    summary:
      'Коррекция eq=gamma=1.14:contrast=0.96 первых 2 с; дымовая проверка eq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf eq=gamma=1.14:contrast=0.96 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tmix 14 2с',
    summary:
      'Смешивание соседних кадров tmix=frames=14 первых 2 с; дымовая проверка tmix; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tmix=frames=14 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: gblur 3.0 2с',
    summary:
      'Гауссово размытие gblur=sigma=3.0 первых 2 с; дымовая проверка gblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf gblur=sigma=3.0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aecho 320ms 3с',
    summary:
      'Эхо aecho=0.9:0.93:320:0.6 первых 3 с; дымовая проверка aecho; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aecho=0.9:0.93:320:0.6 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lowpass 1400 2с',
    summary:
      'Срез ВЧ lowpass=f=1400 первых 2 с; дымовая проверка lowpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowpass=f=1400 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: highpass 340 2с',
    summary:
      'Срез НЧ highpass=f=340 первых 2 с; дымовая проверка highpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=340 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: atempo 1.16 3с',
    summary:
      'Ускорение atempo=1.16 первых 3 с; дымовая проверка atempo; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af atempo=1.16 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: alimiter 0.7 2с',
    summary:
      'Лимитер alimiter=limit=0.7:attack=5:release=95 первых 2 с; дымовая проверка alimiter; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af alimiter=limit=0.7:attack=5:release=95 -t 2 -vn -sn -f null -`
  }
]

export type TerminalRunRequest = {
  line: string
  /** Путь открытого в редакторе файла; подставляется вместо `TERMINAL_CURRENT_FILE_PLACEHOLDER` в argv. */
  currentFilePath?: string | null
  /** Локаль UI для текстов ошибок валидации (main). */
  uiLocale?: DownloadsWindowUiLocale
}

export type TerminalRunResult =
  | {
      ok: true
      tool: TerminalToolId
      args: string[]
      code: number | null
      stdout: string
      stderr: string
      elapsedMs: number
    }
  | { ok: false; error: string }
