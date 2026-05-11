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
  },
  {
    tool: 'yt-dlp',
    token: '· -6 -F',
    summary: 'Список форматов через IPv6 (-6 -F); если v4 глушится провайдером; допишите URL.',
    fullLine: 'yt-dlp -6 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· flat-playlist print url',
    summary: 'Плоский плейлист: URL каждого элемента без глубокого извлечения (--flat-playlist --print url); допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist --print url '
  },
  {
    tool: 'yt-dlp',
    token: '· --write-pages',
    summary: 'Сохранить сырые страницы extractor в .dump (--write-pages --skip-download); диагностика HTML/403; допишите URL.',
    fullLine: 'yt-dlp --write-pages --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· --print heatmap',
    summary: 'Данные heatmap просмотров (если отдаёт площадка, напр. YouTube) без скачивания (--skip-download --print heatmap); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print heatmap '
  },
  {
    tool: 'yt-dlp',
    token: '· limit-rate 1M',
    summary: 'Ограничить скорость загрузки (~1 MiB/s) для диагностики CDN/таймаутов; при необходимости измените суффикс; допишите URL.',
    fullLine: 'yt-dlp --limit-rate 1M '
  },
  {
    tool: 'yt-dlp',
    token: '· retries 10',
    summary: 'Повторы HTTP и фрагментов для нестабильной сети (--retries 10 --fragment-retries 10); допишите URL и остальные ключи.',
    fullLine: 'yt-dlp --retries 10 --fragment-retries 10 '
  },
  {
    tool: 'yt-dlp',
    token: '· socket-timeout 30',
    summary: 'Таймаут сокета 30 с против зависаний (--socket-timeout 30); допишите URL.',
    fullLine: 'yt-dlp --socket-timeout 30 '
  },
  {
    tool: 'yt-dlp',
    token: '· force-ipv4 -F',
    summary: 'Список форматов только через IPv4 (--force-ipv4 -F); если -6 не подходит; допишите URL.',
    fullLine: 'yt-dlp --force-ipv4 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· no-part -F',
    summary: 'Без временных .part (--no-part -F); диск/NAS; допишите URL.',
    fullLine: 'yt-dlp --no-part -F '
  },
  {
    tool: 'yt-dlp',
    token: '· concurrent-frags 4',
    summary: 'Параллельная подкачка фрагментов DASH/HLS (--concurrent-fragments 4); допишите URL и остальные ключи.',
    fullLine: 'yt-dlp --concurrent-fragments 4 '
  },
  {
    tool: 'yt-dlp',
    token: '· merge mkv',
    summary: 'Слияние потоков в контейнер MKV при мультиплексировании (--merge-output-format mkv); допишите URL и -f …',
    fullLine: 'yt-dlp --merge-output-format mkv '
  },
  {
    tool: 'yt-dlp',
    token: '· prefer-free -F',
    summary: 'Список форматов с приоритетом свободных кодеков (--prefer-free-formats -F); допишите URL.',
    fullLine: 'yt-dlp --prefer-free-formats -F '
  },
  {
    tool: 'yt-dlp',
    token: '· format-sort 720p -F',
    summary: 'Сортировка форматов: сначала около 720p (--format-sort +res:720 -F); при необходимости поменяйте res; допишите URL.',
    fullLine: 'yt-dlp --format-sort +res:720 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· hls-native -F',
    summary: 'HLS: нативный загрузчик вместо ffmpeg где возможно (--hls-prefer-native -F); допишите URL.',
    fullLine: 'yt-dlp --hls-prefer-native -F '
  },
  {
    tool: 'yt-dlp',
    token: '· live-from-start',
    summary: 'Прямой эфир: начать с начала буфера (--live-from-start); допишите URL трансляции и прочие ключи.',
    fullLine: 'yt-dlp --live-from-start '
  },
  {
    tool: 'yt-dlp',
    token: '· sleep-requests 1',
    summary: 'Пауза 1 с между HTTP-запросами (--sleep-requests 1); снижение 429/банов; допишите URL.',
    fullLine: 'yt-dlp --sleep-requests 1 '
  },
  {
    tool: 'yt-dlp',
    token: '· playlist-end 10 -J',
    summary: 'Первые 10 элементов плейлиста в JSON (--playlist-end 10 -J); допишите URL плейлиста.',
    fullLine: 'yt-dlp --playlist-end 10 -J '
  },
  {
    tool: 'yt-dlp',
    token: '· geo-country US -F',
    summary: 'Обход гео через страну-подсказку (--geo-bypass-country US -F); при необходимости замените ISO-код; допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country US -F '
  },
  {
    tool: 'yt-dlp',
    token: '· extractor-retries 5',
    summary: 'Повторы на этапе extractor против 403/таймаутов страницы (--extractor-retries 5); допишите URL и остальные ключи.',
    fullLine: 'yt-dlp --extractor-retries 5 '
  },
  {
    tool: 'yt-dlp',
    token: '· http-chunk 10M',
    summary: 'Размер HTTP-чанка 10 MiB (--http-chunk-size 10M); иногда стабилизирует медленные CDN; допишите URL.',
    fullLine: 'yt-dlp --http-chunk-size 10M '
  },
  {
    tool: 'yt-dlp',
    token: '· no-overwrites -F',
    summary: 'Не перезаписывать уже скачанные файлы (--no-overwrites -F); допишите URL.',
    fullLine: 'yt-dlp --no-overwrites -F '
  },
  {
    tool: 'yt-dlp',
    token: '· win filenames -F',
    summary: 'Имена файлов без зарезервированных символов Windows (--windows-filenames -F); допишите URL и -o при необходимости.',
    fullLine: 'yt-dlp --windows-filenames -F '
  },
  {
    tool: 'yt-dlp',
    token: '· newline -F',
    summary: 'Прогресс с переводом строки (--newline -F); удобнее парсить логи/пайпы; допишите URL.',
    fullLine: 'yt-dlp --newline -F '
  },
  {
    tool: 'yt-dlp',
    token: '· skip-unavail frags',
    summary: 'DASH/HLS: пропускать недоступные фрагменты вместо фатала (--skip-unavailable-fragments); допишите URL.',
    fullLine: 'yt-dlp --skip-unavailable-fragments '
  },
  {
    tool: 'yt-dlp',
    token: '· download-archive',
    summary: 'Журнал скачанных id в archive.txt (--download-archive archive.txt); поменяйте имя файла под свою папку; допишите URL.',
    fullLine: 'yt-dlp --download-archive archive.txt '
  },
  {
    tool: 'yt-dlp',
    token: '· break-on-reject -F',
    summary: 'Остановиться при отклонённом формате (--break-on-reject -F); диагностика -f; допишите URL.',
    fullLine: 'yt-dlp --break-on-reject -F '
  },
  {
    tool: 'yt-dlp',
    token: '· trim-names 80 -F',
    summary: 'Обрезка длины имён файлов (--trim-file-names 80 -F); длинные заголовки; допишите URL.',
    fullLine: 'yt-dlp --trim-file-names 80 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· no-mtime',
    summary: 'Не выставлять время файла из метаданных ролика (--no-mtime); допишите URL и остальные ключи.',
    fullLine: 'yt-dlp --no-mtime '
  },
  {
    tool: 'yt-dlp',
    token: '· continue',
    summary: 'Докачка частично скачанного (.part) при повторном запуске (--continue); допишите URL и -o.',
    fullLine: 'yt-dlp --continue '
  },
  {
    tool: 'yt-dlp',
    token: '· abort-on-error',
    summary: 'Остановить весь запуск при первой фатальной ошибке (--abort-on-error); допишите URL и плейлист при необходимости.',
    fullLine: 'yt-dlp --abort-on-error '
  },
  {
    tool: 'yt-dlp',
    token: '· playlist slice -J',
    summary: 'Фрагмент плейлиста в JSON (элементы 5–15, --playlist-start/--playlist-end с -J); допишите URL плейлиста.',
    fullLine: 'yt-dlp --playlist-start 5 --playlist-end 15 -J '
  },
  {
    tool: 'yt-dlp',
    token: '· max-size -F',
    summary: 'Показать только форматы до ~512 MiB (--max-filesize 512M -F); подстройте лимит; допишите URL.',
    fullLine: 'yt-dlp --max-filesize 512M -F '
  },
  {
    tool: 'yt-dlp',
    token: '· restrict-names -F',
    summary: 'Только ASCII в именах файлов (--restrict-filenames -F); допишите URL и -o при необходимости.',
    fullLine: 'yt-dlp --restrict-filenames -F '
  },
  {
    tool: 'yt-dlp',
    token: '· color never -F',
    summary: 'Без ANSI-цветов в выводе (--color never -F); удобнее логи/пайпы; допишите URL.',
    fullLine: 'yt-dlp --color never -F '
  },
  {
    tool: 'yt-dlp',
    token: '· embed-metadata',
    summary: 'Вшить метаданные в контейнер после скачивания (--embed-metadata); допишите URL и -f/-o.',
    fullLine: 'yt-dlp --embed-metadata '
  },
  {
    tool: 'yt-dlp',
    token: '· embed-thumbnail',
    summary: 'Вшить обложку в файл после скачивания (--embed-thumbnail); допишите URL и формат.',
    fullLine: 'yt-dlp --embed-thumbnail '
  },
  {
    tool: 'yt-dlp',
    token: '· wait-for-video',
    summary: 'Ждать появления трансляции до N минут (--wait-for-video 10); допишите URL стрима.',
    fullLine: 'yt-dlp --wait-for-video 10 '
  },
  {
    tool: 'yt-dlp',
    token: '· skip-pl-errors',
    summary: 'Пропустить до N ошибок подряд в плейлисте (--skip-playlist-after-errors 5); допишите URL плейлиста.',
    fullLine: 'yt-dlp --skip-playlist-after-errors 5 '
  },
  {
    tool: 'yt-dlp',
    token: '· print title NA',
    summary: 'Печать title с плейсхолдером NA вместо пустого поля (--output-na-placeholder NA --skip-download --print title); допишите URL.',
    fullLine: 'yt-dlp --output-na-placeholder NA --skip-download --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· referer YT -F',
    summary: 'HTTP Referer для обхода hotlink/CDN-ограничений (--referer https://www.youtube.com/ -F); замените домен под сайт; допишите URL.',
    fullLine: 'yt-dlp --referer https://www.youtube.com/ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· header Accept-Lang -F',
    summary: 'Произвольный заголовок без пробелов в значении (--add-header Accept-Language:en-US -F); при сложных значениях соберите argv вручную; допишите URL.',
    fullLine: 'yt-dlp --add-header Accept-Language:en-US -F '
  },
  {
    tool: 'yt-dlp',
    token: '· proxy localhost -F',
    summary: 'HTTP(S)-прокси (--proxy http://127.0.0.1:8080 -F); замените хост/порт; допишите URL.',
    fullLine: 'yt-dlp --proxy http://127.0.0.1:8080 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· impersonate chrome -F',
    summary: 'TLS/HTTP fingerprint как у Chrome (--impersonate chrome -F); помогает против антибота; допишите URL.',
    fullLine: 'yt-dlp --impersonate chrome -F '
  },
  {
    tool: 'yt-dlp',
    token: '· match-filter dur -F',
    summary: 'Отбор по длительности без пробелов в выражении (--match-filter duration<600 -F); подстройте порог; допишите URL.',
    fullLine: 'yt-dlp --match-filter duration<600 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· batch-file urls.txt',
    summary: 'Пакет из файла со списком URL (--batch-file urls.txt); создайте urls.txt рядом с cwd или укажите полный путь без пробелов.',
    fullLine: 'yt-dlp --batch-file urls.txt '
  },
  {
    tool: 'yt-dlp',
    token: '· load-info-json',
    summary: 'Повторная обработка из сохранённого JSON (--load-info-json video.info.json); путь без пробелов; допишите -f/-o при необходимости.',
    fullLine: 'yt-dlp --load-info-json video.info.json '
  },
  {
    tool: 'yt-dlp',
    token: '· yes-playlist -J',
    summary: 'Явно скачать/разобрать весь плейлист (--yes-playlist -J); когда URL похож на один ролик, но это плейлист; допишите URL.',
    fullLine: 'yt-dlp --yes-playlist -J '
  },
  {
    tool: 'yt-dlp',
    token: '· no-config -F',
    summary: 'Игнорировать пользовательские конфиги yt-dlp (--no-config -F); воспроизводимая диагностика; допишите URL.',
    fullLine: 'yt-dlp --no-config -F '
  },
  {
    tool: 'yt-dlp',
    token: '· cookies file -F',
    summary: 'Файл cookies Netscape (--cookies cookies.txt -F); путь без пробелов; допишите URL.',
    fullLine: 'yt-dlp --cookies cookies.txt -F '
  },
  {
    tool: 'yt-dlp',
    token: '· sleep-interval',
    summary: 'Пауза между запросами в секундах (--sleep-interval 2); снижает нагрузку на сайт; допишите URL.',
    fullLine: 'yt-dlp --sleep-interval 2 '
  },
  {
    tool: 'yt-dlp',
    token: '· age-limit -F',
    summary: 'Пропуск контента старше возрастного рейтинга (--age-limit 18 -F); подстройте порог; допишите URL.',
    fullLine: 'yt-dlp --age-limit 18 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· lazy-playlist -J',
    summary: 'Плейлист без глубокого извлечения до скачивания (--lazy-playlist -J); быстрее на длинных списках; допишите URL.',
    fullLine: 'yt-dlp --lazy-playlist -J '
  },
  {
    tool: 'yt-dlp',
    token: '· print season_number',
    summary: 'Номер сезона из метаданных без скачивания (--skip-download --print season_number); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print season_number '
  },
  {
    tool: 'yt-dlp',
    token: '· print episode_number',
    summary: 'Номер эпизода без скачивания (--skip-download --print episode_number); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print episode_number '
  },
  {
    tool: 'yt-dlp',
    token: '· print track',
    summary: 'Название трека (аудио) без скачивания (--skip-download --print track); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print track '
  },
  {
    tool: 'yt-dlp',
    token: '· print artists',
    summary: 'Исполнители без скачивания (--skip-download --print artists); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print artists '
  },
  {
    tool: 'yt-dlp',
    token: '· print album',
    summary: 'Альбом без скачивания (--skip-download --print album); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print album '
  },
  {
    tool: 'yt-dlp',
    token: '· remux-video mkv',
    summary: 'После скачивания принудительный remux в MKV (--remux-video mkv); допишите URL и -f/-o.',
    fullLine: 'yt-dlp --remux-video mkv '
  },
  {
    tool: 'yt-dlp',
    token: '· sub-format srt -F',
    summary: 'Предпочесть субтитры в SRT при выборе форматов (--sub-format srt -F); допишите URL.',
    fullLine: 'yt-dlp --sub-format srt -F '
  },
  {
    tool: 'yt-dlp',
    token: '· convert-thumbnails jpg',
    summary: 'Конвертировать обложку в JPEG при скачивании (--convert-thumbnails jpg); допишите URL и ключи вывода.',
    fullLine: 'yt-dlp --convert-thumbnails jpg '
  },
  {
    tool: 'yt-dlp',
    token: '· force-ipv6 -F',
    summary: 'Список форматов через IPv6 (--force-ipv6 -F); обход части IPv4/NAT; допишите URL.',
    fullLine: 'yt-dlp --force-ipv6 -F '
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
  },
  {
    tool: 'ffmpeg',
    token: '· 1 frame null',
    summary: 'Декод ровно одного кадра в null muxer (-frames:v 1); быстрее smoke на длинных файлах.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -frames:v 1 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· format long_name',
    summary: 'Человекочитаемое имя контейнера (format.format_long_name); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=format_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 chroma_loc',
    summary: 'Поток v:0: chroma_location (сэмплинг цветности 4:2:0 и т.п.); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=chroma_location -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· programs compact',
    summary: 'MPEG-TS/M3U8: список программ demuxer (-show_programs compact); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_programs -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 side_data',
    summary: 'Поток v:0: side_data_list (Display Matrix, HDR metadata и т.п., компактно); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=side_data_list -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· chapters csv',
    summary: 'Таблица глав построчно (-show_chapters -of csv); без лишнего текста; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -of csv=p=0 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 stream dur',
    summary: 'Поток v:0: start_time + duration дорожки (сверка с format и смещениями); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:0 stream dur',
    summary: 'Поток a:0: start_time + duration дорожки (рассинхрон с видео); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 bit depth',
    summary: 'Поток v:0: bits_per_raw_sample (глубина сырого сэмпла, 8/10/12-bit и т.д.); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=bits_per_raw_sample -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:1 compact',
    summary: 'Вторая видеодорожка v:1 (мультиangle/редкие контейнеры): codec_name/width/height; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:1 -show_entries stream=codec_name,width,height -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format size+dur',
    summary: 'Контейнер: size + duration (сверка с битрейтом и дорожками); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=size,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· s:1 codec+lang',
    summary: 'Вторая дорожка субтитров s:1: codec_name + stream_tags language; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=codec_name:stream_tags=language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:1 disposition',
    summary: 'Вторая аудиодорожка a:1: disposition (forced/default и т.д.); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format tags lang',
    summary: 'Тег языка контейнера format_tags language (если есть); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· remux 5s null',
    summary: 'Копирование потоков первых 5 с в null muxer (-t 5 -c copy); быстрая проверка контейнера без перекодирования.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 5 -c copy -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· decode ignore_err',
    summary: 'Короткий декод с игнором ошибок потока (-err_detect ignore_err -t 2); битые кадры/TS; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -err_detect ignore_err -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 2 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· format artist+album',
    summary: 'Теги контейнера artist + album (аудиофайлы/мультимедиа); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=artist,album -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 avg_fps',
    summary: 'Поток v:0: только avg_frame_rate (сверка с r_frame_rate в других шаблонах); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=avg_frame_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· audio decode 3s',
    summary: 'Декод только аудио первых 3 с (-vn -sn); быстрее полного smoke на видеофайлах; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vn -sn -t 3 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 codec long',
    summary: 'Поток v:0: codec_long_name (человекочитаемое имя кодека); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format encoder tag',
    summary: 'Тег контейнера encoder (format_tags.encoder); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:3 compact',
    summary: 'Четвёртая аудиодорожка a:3: codec_name/sample_rate/channels; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:3 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· s:3 compact',
    summary: 'Четвёртая дорожка субтитров s:3: codec_name/codec_tag_string; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:3 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· video decode 2s',
    summary: 'Декод только видео первых 2 с (-an -sn); без аудио/субтитров; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -an -sn -t 2 -f null -`
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

