import type { EngineId } from './engine-contract'

/** argv-токен: main подставляет абсолютный путь текущего превью (`isGrantedMediaPath`). */
export const TERMINAL_CURRENT_FILE_PLACEHOLDER = '__CURRENT_FILE__'

export type TerminalToolId = EngineId

export type TerminalCommandHintEntry = {
  token: string
  summary: string
  tool: TerminalToolId
  /** Если задано, клик по подсказке подставляет целую argv-строку вместо одного токена. */
  fullLine?: string
}

/** §8 — готовые строки для вкладки «Загрузки» (терминал рядом по workflow). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS: TerminalCommandHintEntry[] = [
  {
    tool: 'yt-dlp',
    token: '· -F',
    summary: 'Список форматов перед загрузкой; после клика допишите URL из поля очереди.',
    fullLine: 'yt-dlp -F '
  },
  {
    tool: 'yt-dlp',
    token: '· -g best',
    summary: 'Прямая ссылка на поток без скачивания (-g -f best); допишите URL.',
    fullLine: 'yt-dlp -g -f best '
  },
  {
    tool: 'yt-dlp',
    token: '· cookies chrome',
    summary: 'Сухой прогон с cookies из Chrome (--cookies-from-browser); допишите URL.',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser chrome '
  },
  {
    tool: 'yt-dlp',
    token: '· -J',
    summary: 'Полный JSON метаданных (-J) без скачивания; допишите URL (диагностика, Support ZIP).',
    fullLine: 'yt-dlp -J '
  },
  {
    tool: 'yt-dlp',
    token: '· --dump-single-json',
    summary: 'Один JSON на ролик без скачивания (--dump-single-json, эквивалент -J для одного URL); допишите URL.',
    fullLine: 'yt-dlp --dump-single-json '
  },
  {
    tool: 'yt-dlp',
    token: '· -v --skip-download',
    summary: 'Подробный лог без скачивания (-v --skip-download); допишите URL (ошибки extractor, geo, DRM).',
    fullLine: 'yt-dlp -v --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· --simulate',
    summary: 'Сухой прогон без файлов (--simulate); допишите URL (проверка доступности и форматов).',
    fullLine: 'yt-dlp --simulate '
  },
  {
    tool: 'yt-dlp',
    token: '· --list-subs',
    summary: 'Список субтитров на странице без скачивания (--list-subs); допишите URL.',
    fullLine: 'yt-dlp --list-subs '
  },
  {
    tool: 'yt-dlp',
    token: '· --flat-playlist -J',
    summary: 'Плейлист «плоско» + JSON (-J) без глубокого извлечения каждого ролика; допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist -J '
  },
  {
    tool: 'yt-dlp',
    token: '· --no-playlist -F',
    summary: 'Только один ролик из URL-плейлиста (--no-playlist -F); список форматов без разворачивания всего плейлиста.',
    fullLine: 'yt-dlp --no-playlist -F '
  },
  {
    tool: 'yt-dlp',
    token: '· --flat-playlist -F',
    summary: 'Плоский список элементов плейлиста + форматы по каждому (--flat-playlist -F); допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist -F '
  },
  {
    tool: 'yt-dlp',
    token: '· --list-thumbnails',
    summary: 'Доступные превью/thumbnail URL без скачивания (--list-thumbnails); допишите URL.',
    fullLine: 'yt-dlp --list-thumbnails '
  },
  {
    tool: 'yt-dlp',
    token: '· --print title',
    summary: 'Только заголовок ролика без скачивания (--skip-download --print title); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· --print duration_string',
    summary: 'Только длительность HH:MM:SS без скачивания (--skip-download --print duration_string); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print duration_string '
  },
  {
    tool: 'yt-dlp',
    token: '· --print uploader',
    summary: 'Имя автора/uploader без скачивания (--skip-download --print uploader); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print uploader '
  },
  {
    tool: 'yt-dlp',
    token: '· --print id',
    summary: 'Идентификатор ролика на площадке без скачивания (--skip-download --print id); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print id '
  },
  {
    tool: 'yt-dlp',
    token: '· --print webpage_url',
    summary: 'Канонический URL страницы без скачивания (--skip-download --print webpage_url); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print webpage_url '
  },
  {
    tool: 'yt-dlp',
    token: '· --print channel',
    summary: 'Имя канала/площадки без скачивания (--skip-download --print channel); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print channel '
  },
  {
    tool: 'yt-dlp',
    token: '· --print channel_id',
    summary: 'Идентификатор канала без скачивания (--skip-download --print channel_id); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print channel_id '
  },
  {
    tool: 'yt-dlp',
    token: '· --print thumbnail',
    summary: 'URL превью/thumbnail без скачивания (--skip-download --print thumbnail); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print thumbnail '
  },
  {
    tool: 'yt-dlp',
    token: '· --print view_count',
    summary: 'Счётчик просмотров без скачивания (--skip-download --print view_count); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print view_count '
  },
  {
    tool: 'yt-dlp',
    token: '· --print upload_date',
    summary: 'Дата публикации YYYYMMDD без скачивания (--skip-download --print upload_date); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print upload_date '
  },
  {
    tool: 'yt-dlp',
    token: '· --print playlist_title',
    summary: 'Заголовок плейлиста без скачивания (--skip-download --print playlist_title); допишите URL плейлиста.',
    fullLine: 'yt-dlp --skip-download --print playlist_title '
  },
  {
    tool: 'yt-dlp',
    token: '· --print playlist_count',
    summary: 'Число элементов в плейлисте без скачивания (--skip-download --print playlist_count); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print playlist_count '
  },
  {
    tool: 'yt-dlp',
    token: '· --print filename',
    summary: 'Имя выходного файла по текущим -o без скачивания (--skip-download --print filename); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print filename '
  },
  {
    tool: 'yt-dlp',
    token: '· --print description',
    summary: 'Текст описания ролика без скачивания (--skip-download --print description); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print description '
  },
  {
    tool: 'yt-dlp',
    token: '· --print categories',
    summary: 'Категории/тематики без скачивания (--skip-download --print categories); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print categories '
  },
  {
    tool: 'yt-dlp',
    token: '· --print language',
    summary: 'Язык по умолчанию без скачивания (--skip-download --print language); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print language '
  },
  {
    tool: 'yt-dlp',
    token: '· --print extractor',
    summary: 'Имя extractor без скачивания (--skip-download --print extractor); допишите URL (диагностика маршрута yt-dlp).',
    fullLine: 'yt-dlp --skip-download --print extractor '
  },
  {
    tool: 'yt-dlp',
    token: '· --print playlist_id',
    summary: 'Идентификатор плейлиста без скачивания (--skip-download --print playlist_id); допишите URL плейлиста.',
    fullLine: 'yt-dlp --skip-download --print playlist_id '
  },
  {
    tool: 'yt-dlp',
    token: '· --geo-bypass -F',
    summary: 'Обход гео-блока + список форматов (--geo-bypass -F); допишите URL (региональные ограничения).',
    fullLine: 'yt-dlp --geo-bypass -F '
  },
  {
    tool: 'yt-dlp',
    token: '· --print format_id',
    summary: 'Идентификатор выбранного формата без скачивания (--skip-download --print format_id); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print format_id '
  },
  {
    tool: 'yt-dlp',
    token: '· --print ext',
    summary: 'Расширение контейнера выбранного формата без скачивания (--skip-download --print ext); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print ext '
  },
  {
    tool: 'yt-dlp',
    token: '· --print resolution',
    summary: 'Строка разрешения выбранного формата без скачивания (--skip-download --print resolution); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print resolution '
  },
  {
    tool: 'yt-dlp',
    token: '· --print vcodec',
    summary: 'Видеокодек выбранного формата без скачивания (--skip-download --print vcodec); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print vcodec '
  },
  {
    tool: 'yt-dlp',
    token: '· --print acodec',
    summary: 'Аудиокодек выбранного формата без скачивания (--skip-download --print acodec); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print acodec '
  },
  {
    tool: 'yt-dlp',
    token: '· --list-extractors',
    summary: 'Список имён extractors без URL (диагностика сборки yt-dlp и маршрутизации сайтов).',
    fullLine: 'yt-dlp --list-extractors'
  },
  {
    tool: 'yt-dlp',
    token: '· --version',
    summary: 'Версия yt-dlp и зависимостей без URL (сверка с bundled/обновлениями).',
    fullLine: 'yt-dlp --version'
  },
  {
    tool: 'yt-dlp',
    token: '· -4 -F',
    summary: 'Список форматов через IPv4 (-4 -F); обходит часть проблем v6/маршрутизации; допишите URL.',
    fullLine: 'yt-dlp -4 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· --no-cache-dir -F',
    summary: 'Список форматов без кэша extractors (--no-cache-dir -F); при подозрении на битый кэш; допишите URL.',
    fullLine: 'yt-dlp --no-cache-dir -F '
  },
  {
    tool: 'yt-dlp',
    token: '· --print tags',
    summary: 'Сводка тегов/метаданных без скачивания (--skip-download --print tags); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print tags '
  },
  {
    tool: 'yt-dlp',
    token: '· --print filesize_approx',
    summary: 'Оценка размера выбранного формата без скачивания (--skip-download --print filesize_approx); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print filesize_approx '
  },
  {
    tool: 'yt-dlp',
    token: '· --ignore-errors -J',
    summary: 'Плоский плейлист + JSON с пропуском битых элементов (--ignore-errors --flat-playlist -J); допишите URL плейлиста.',
    fullLine: 'yt-dlp --ignore-errors --flat-playlist -J '
  },
  {
    tool: 'yt-dlp',
    token: '· --write-info-json',
    summary: 'Записать .info.json рядом с выходом без видео (--write-info-json --skip-download); допишите URL (трассировка для Support ZIP).',
    fullLine: 'yt-dlp --write-info-json --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· --no-warnings -F',
    summary: 'Список форматов без предупреждений в stderr (--no-warnings -F); допишите URL (чище лог).',
    fullLine: 'yt-dlp --no-warnings -F '
  },
  {
    tool: 'yt-dlp',
    token: '· --print fps',
    summary: 'Кадры в секунду выбранного формата без скачивания (--skip-download --print fps); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print fps '
  },
  {
    tool: 'yt-dlp',
    token: '· --print is_live',
    summary: 'Флаг прямого эфира true/false без скачивания (--skip-download --print is_live); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print is_live '
  },
  {
    tool: 'yt-dlp',
    token: '· --print live_status',
    summary: 'Статус трансляции (is_live / was_live / not_live / upcoming) без скачивания; допишите URL.',
    fullLine: 'yt-dlp --skip-download --print live_status '
  },
  {
    tool: 'yt-dlp',
    token: '· --print availability',
    summary: 'Доступность (public / unlisted / premium / needs_auth) без скачивания; допишите URL (диагностика 403/нужен логин).',
    fullLine: 'yt-dlp --skip-download --print availability '
  },
  {
    tool: 'yt-dlp',
    token: '· --print age_limit',
    summary: 'Возрастной лимит ролика без скачивания (--skip-download --print age_limit); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print age_limit '
  },
  {
    tool: 'yt-dlp',
    token: '· --print like_count',
    summary: 'Счётчик лайков без скачивания (--skip-download --print like_count); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print like_count '
  },
  {
    tool: 'yt-dlp',
    token: '· --print comment_count',
    summary: 'Число комментариев без скачивания (--skip-download --print comment_count); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print comment_count '
  },
  {
    tool: 'yt-dlp',
    token: '· --print aspect_ratio',
    summary: 'Соотношение сторон выбранного формата без скачивания (--skip-download --print aspect_ratio); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print aspect_ratio '
  },
  {
    tool: 'yt-dlp',
    token: '· --playlist-items 1 -F',
    summary: 'Только первый элемент плейлиста + список форматов (--playlist-items 1 -F); допишите URL плейлиста.',
    fullLine: 'yt-dlp --playlist-items 1 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· youtube:web -F',
    summary: 'YouTube: принудительно web-клиент extractor-args (обход части ограничений) + -F; допишите URL.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=web -F '
  },
  {
    tool: 'yt-dlp',
    token: '· cookies edge',
    summary: 'Сухой прогон с cookies из Edge (--cookies-from-browser); допишите URL (альтернатива Chrome).',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser edge '
  },
  {
    tool: 'yt-dlp',
    token: '· --print duration',
    summary: 'Длительность в секундах (число) без скачивания (--skip-download --print duration); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print duration '
  },
  {
    tool: 'yt-dlp',
    token: '· --print width',
    summary: 'Ширина выбранного формата в пикселях без скачивания (--skip-download --print width); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print width '
  },
  {
    tool: 'yt-dlp',
    token: '· --print height',
    summary: 'Высота выбранного формата в пикселях без скачивания (--skip-download --print height); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print height '
  },
  {
    tool: 'yt-dlp',
    token: '· --print tbr',
    summary: 'Сводный битрейт выбранного формата (kbps) без скачивания (--skip-download --print tbr); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print tbr '
  },
  {
    tool: 'yt-dlp',
    token: '· --print abr',
    summary: 'Аудио-битрейт выбранного формата (kbps) без скачивания (--skip-download --print abr); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print abr '
  },
  {
    tool: 'yt-dlp',
    token: '· --print vbr',
    summary: 'Видео-битрейт выбранного формата (kbps) без скачивания (--skip-download --print vbr); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print vbr '
  },
  {
    tool: 'yt-dlp',
    token: '· --print asr',
    summary: 'Частота дискретизации аудио (Hz) без скачивания (--skip-download --print asr); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print asr '
  },
  {
    tool: 'yt-dlp',
    token: '· --write-thumbnail',
    summary: 'Только миниатюра без видео (--write-thumbnail --skip-download); файл .jpg/.webp рядом; допишите URL.',
    fullLine: 'yt-dlp --write-thumbnail --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· --write-auto-sub',
    summary: 'Только авто-субтитры без видео (--write-auto-sub --skip-download); поможет проверить транскрипт; допишите URL.',
    fullLine: 'yt-dlp --write-auto-sub --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· --write-description',
    summary: 'Описание ролика в отдельный .description файл без видео (--write-description --skip-download); допишите URL.',
    fullLine: 'yt-dlp --write-description --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· --write-url-link',
    summary: 'Файл-ярлык на страницу без видео (--write-url-link --skip-download); допишите URL.',
    fullLine: 'yt-dlp --write-url-link --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· --check-formats',
    summary: 'Проверка доступности выбранных форматов без полного скачивания (--check-formats); допишите URL.',
    fullLine: 'yt-dlp --check-formats '
  },
  {
    tool: 'yt-dlp',
    token: '· cookies firefox',
    summary: 'Сухой прогон с cookies из Firefox (--cookies-from-browser); допишите URL (альтернатива Chrome/Edge).',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser firefox '
  },
  {
    tool: 'yt-dlp',
    token: '· --print has_drm',
    summary: 'Флаг DRM/шифрования без скачивания (--skip-download --print has_drm); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print has_drm '
  },
  {
    tool: 'yt-dlp',
    token: '· playable_in_embed',
    summary: 'Поле embed-ограничений без скачивания (--skip-download --print playable_in_embed); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print playable_in_embed '
  },
  {
    tool: 'yt-dlp',
    token: '· --print channel_url',
    summary: 'URL канала/плейлиста без скачивания (--skip-download --print channel_url); допишите URL ролика.',
    fullLine: 'yt-dlp --skip-download --print channel_url '
  },
  {
    tool: 'yt-dlp',
    token: '· --print uploader_id',
    summary: 'Идентификатор автора на площадке без скачивания (--skip-download --print uploader_id); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print uploader_id '
  },
  {
    tool: 'yt-dlp',
    token: '· --print was_live',
    summary: 'Был ли эфир live/stream без скачивания (--skip-download --print was_live); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print was_live '
  },
  {
    tool: 'yt-dlp',
    token: '· --print media_type',
    summary: 'Тип медиа (video/audio и т.п.) без скачивания (--skip-download --print media_type); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print media_type '
  },
  {
    tool: 'yt-dlp',
    token: '· --print release_year',
    summary: 'Год публикации (если есть) без скачивания (--skip-download --print release_year); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print release_year '
  },
  {
    tool: 'yt-dlp',
    token: '· --no-check-certificates -F',
    summary: 'Список форматов при сбоях проверки SSL (--no-check-certificates -F); только для диагностики, снижает безопасность.',
    fullLine: 'yt-dlp --no-check-certificates -F '
  },
  {
    tool: 'yt-dlp',
    token: '· --print filesize',
    summary: 'Размер файла выбранного формата (байты, если известен) без скачивания (--skip-download --print filesize); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print filesize '
  },
  {
    tool: 'yt-dlp',
    token: '· --print format_note',
    summary: 'Поле format_note выбранного формата без скачивания (--skip-download --print format_note); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print format_note '
  },
  {
    tool: 'yt-dlp',
    token: '· --print subtitles',
    summary: 'Словарь субтитров из метаданных без скачивания (--skip-download --print subtitles); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print subtitles '
  },
  {
    tool: 'yt-dlp',
    token: '· automatic_captions',
    summary: 'Авто-субтитры/ASR из метаданных без скачивания (--skip-download --print automatic_captions); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print automatic_captions '
  },
  {
    tool: 'yt-dlp',
    token: '· --print chapters',
    summary: 'Главы из метаданных без скачивания (--skip-download --print chapters); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print chapters '
  },
  {
    tool: 'yt-dlp',
    token: '· flat-playlist title',
    summary: 'Плоский плейлист: заголовок каждого элемента без глубокого извлечения (--flat-playlist --skip-download --print title); допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist --skip-download --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· --print original_url',
    summary: 'Исходный URL запроса без скачивания (--skip-download --print original_url); сверка редиректов; допишите URL.',
    fullLine: 'yt-dlp --skip-download --print original_url '
  },
  {
    tool: 'yt-dlp',
    token: '· print webpage_url_domain',
    summary: 'Домен страницы без скачивания (--skip-download --print webpage_url_domain); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print webpage_url_domain '
  },
  {
    tool: 'yt-dlp',
    token: '· flat-playlist print id',
    summary: 'Плоский плейлист: id каждого элемента без глубокого извлечения (--flat-playlist --skip-download --print id); допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist --skip-download --print id '
  },
  {
    tool: 'yt-dlp',
    token: '· --print playlist_index',
    summary: 'Индекс ролика в плейлисте без скачивания (--skip-download --print playlist_index); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print playlist_index '
  },
  {
    tool: 'yt-dlp',
    token: '· --write-sub',
    summary: 'Субтитры в файлы без видео (--write-sub --skip-download); допишите URL.',
    fullLine: 'yt-dlp --write-sub --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· --write-comments',
    summary: 'Комментарии в JSON без видео (--write-comments --skip-download); допишите URL (если поддерживается площадкой).',
    fullLine: 'yt-dlp --write-comments --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· -g bestaudio',
    summary: 'Прямая ссылка только на лучший аудиоформат (-g -f bestaudio/best); без видео; допишите URL.',
    fullLine: 'yt-dlp -g -f bestaudio/best '
  },
  {
    tool: 'yt-dlp',
    token: '· flat-playlist simulate',
    summary: 'Быстрая симуляция плейлиста без глубокого извлечения (--flat-playlist --simulate); допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist --simulate '
  },
  {
    tool: 'yt-dlp',
    token: '· --print filepath',
    summary: 'Шаблон выходного пути по текущим -o без скачивания (--skip-download --print filepath); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print filepath '
  },
  {
    tool: 'yt-dlp',
    token: '· --print epoch',
    summary: 'Unix epoch времени публикации (если есть) без скачивания (--skip-download --print epoch); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print epoch '
  }
]

/** §8 — ffprobe по текущему превью редактора (нужен токен плейсхолдера). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA: TerminalCommandHintEntry[] = [
  {
    tool: 'ffprobe',
    token: '· format+streams',
    summary: 'Полный отчёт ffprobe по файлу в превью (плейсхолдер подставится при запуске).',
    fullLine: `ffprobe -hide_banner -show_format -show_streams ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· duration',
    summary: 'Кратко: duration / size / bit_rate из format.',
    fullLine: `ffprobe -hide_banner -show_entries format=duration,size,bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· chapters',
    summary: 'Главы и метаданные контейнера (-show_chapters -show_format); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_format ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 compact',
    summary: 'Поток v:0: width/height/r_frame_rate/pix_fmt (default=nw=1); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=width,height,r_frame_rate,pix_fmt -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 color',
    summary: 'Поток v:0: color_space / color_primaries / color_transfer (HDR/SDR-диагностика); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=color_space,color_primaries,color_transfer -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 bitrate+fps',
    summary: 'Поток v:0: bit_rate + avg_frame_rate (сравнение с r_frame_rate из компактного шаблона); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=bit_rate,avg_frame_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 sar+dar',
    summary: 'Поток v:0: sample_aspect_ratio + display_aspect_ratio (анаморф/не-квадратные пиксели); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=sample_aspect_ratio,display_aspect_ratio -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:0 compact',
    summary: 'Поток a:0: codec_name/sample_rate/channels (default=nw=1); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:0 language',
    summary: 'Тег языка первой аудиодорожки (stream_tags=language); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream_tags=language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:0 pcm',
    summary: 'Поток a:0: bits_per_sample + sample_fmt (PCM/глубина); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=bits_per_sample,sample_fmt -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· s:0 compact',
    summary: 'Поток s:0: codec_name/codec_tag_string (default=nw=1); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· streams compact',
    summary: 'Все дорожки одной строкой: index/codec_type/codec_name (compact); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries stream=index,codec_type,codec_name -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· streams+attach',
    summary: 'Все дорожки + теги filename/mimetype (вложения/шрифты MKV, data/attachment); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries stream=index,codec_type,codec_name:stream_tags=filename,mimetype -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format JSON',
    summary: 'format+streams ffprobe в виде JSON (-of json); удобно скопировать в Support ZIP или jq.',
    fullLine: `ffprobe -hide_banner -of json -show_format -show_streams ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· show_error',
    summary: 'Только ошибки контейнера/потока (-v error -show_error); пусто = файл читается без проблем.',
    fullLine: `ffprobe -hide_banner -v error -show_error ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format tags',
    summary: 'Теги контейнера: title + encoder (-show_entries format_tags); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=title,encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 field+range',
    summary: 'Поток v:0: field_order + color_range (чересстрочность / full range); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=field_order,color_range -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· s:0 tags',
    summary: 'Поток s:0: теги title + language субтитров (stream_tags); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream_tags=title,language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:1 compact',
    summary: 'Вторая аудиодорожка a:1: codec_name/sample_rate/channels (мультиязык/комментарии); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 stream tags',
    summary: 'Поток v:0: stream_tags handler_name + encoder (отличие от тегов контейнера); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=handler_name,encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 frames+dur',
    summary: 'Поток v:0: nb_frames + duration (оценка кадров/длительности дорожки); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=nb_frames,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format start+dur',
    summary: 'Контейнер: start_time + duration format-уровня (смещение начала vs дорожки); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· s:1 compact',
    summary: 'Вторая дорожка субтитров s:1: codec_name/codec_tag_string (несколько языков); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 profile',
    summary: 'Поток v:0: codec_name + profile + level (кодек/профиль для транскодинга); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=codec_name,profile,level -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:0 profile+br',
    summary: 'Поток a:0: codec_name + profile + bit_rate (качество/битрейт дорожки); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=codec_name,profile,bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 refs+B',
    summary: 'Поток v:0: refs + has_b_frames (сложность GOP/B-кадры); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=refs,has_b_frames -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· streams disp',
    summary: 'Все дорожки: index/codec_type/disposition (default/forced/captions/attached_pic); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries stream=index,codec_type,disposition -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format nb',
    summary: 'Контейнер: nb_streams + nb_programs + format_name (число потоков и программ); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=nb_streams,nb_programs,format_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 count_frames',
    summary: 'Точный пересчёт кадров v:0 (-count_frames nb_read_frames); медленно, но даёт реальный счёт; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:0 disposition',
    summary: 'Поток a:0: disposition (default/forced/comment и т.д.); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 pix+cs',
    summary: 'Поток v:0: pix_fmt + color_space + color_range (SDR/HDR контекст без отдельного color_transfer); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=pix_fmt,color_space,color_range -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 coded+display',
    summary: 'Поток v:0: coded_width/height vs width/height (анаморф/масштаб хранения vs отображения); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=coded_width,coded_height,width,height -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format created',
    summary: 'Тег контейнера creation_time (когда записан файл/поток метаданных); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=creation_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· s:0 disposition',
    summary: 'Поток s:0: disposition (default/forced/hearing_impaired и т.д.); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 time_base',
    summary: 'Поток v:0: time_base + start_pts (точка отсчёта таймстемпов); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:0 time_base',
    summary: 'Поток a:0: time_base + start_pts (точка отсчёта аудио); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 max_br',
    summary: 'Поток v:0: bit_rate + max_bit_rate (средний vs пиковый битрейт, VBR-диагностика); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=bit_rate,max_bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format filename',
    summary: 'Имя входа, которое видит demuxer (format.filename); сверка пути/редиректов; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=filename -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 rotate tag',
    summary: 'Устаревший тег rotate у видео (QuickTime и др.); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=rotate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:0 layout+br',
    summary: 'Поток a:0: channel_layout + bit_rate (расклад каналов и битрейт дорожки); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=channel_layout,bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format bit_rate',
    summary: 'Сводный bit_rate контейнера (format.bit_rate vs сумма дорожек); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:0 tags title',
    summary: 'Поток a:0: stream_tags title + handler_name (название дорожки/обработчик); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream_tags=title,handler_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 r_frame_rate',
    summary: 'Только r_frame_rate видео v:0 (сравнение с avg_frame_rate в других шаблонах); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=r_frame_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format brands',
    summary: 'Теги контейнера major_brand + compatible_brands (MP4/MOV family); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=major_brand,compatible_brands -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· s:2 compact',
    summary: 'Третья дорожка субтитров s:2: codec_name/codec_tag_string; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:2 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 cc+avc',
    summary: 'Поток v:0: closed_captions + is_avc (CEA-608/708 vs AVC elementary); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=closed_captions,is_avc -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· t:0 attachment',
    summary: 'Первая вложенная дорожка t:0 (шрифты/обложки MKV): codec_name + codec_tag_string; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:0 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· d:0 data',
    summary: 'Первая data-дорожка d:0 (timed metadata и т.п.): codec_name/codec_tag_string; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:0 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 FourCC',
    summary: 'Поток v:0: codec_tag_string (FourCC/бренд сырого кодека); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format probe_score',
    summary: 'probe_score контейнера (уверенность demuxer); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=probe_score -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:2 compact',
    summary: 'Третья аудиодорожка a:2: codec_name/sample_rate/channels; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:2 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· decode smoke',
    summary: 'Быстрый прогон декодера первых 10 с в null muxer (-t 10); нагрузка на CPU/GPU.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 10 -f null -`
  }
]

export type TerminalRunRequest = {
  line: string
  /** Путь открытого в редакторе файла; подставляется вместо `TERMINAL_CURRENT_FILE_PLACEHOLDER` в argv. */
  currentFilePath?: string | null
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

