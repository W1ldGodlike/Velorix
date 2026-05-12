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
  },
  {
    tool: 'yt-dlp',
    token: '· dateafter -F',
    summary: 'Только записи после YYYYMMDD (--dateafter 20240101 -F); фильтр плейлиста; допишите URL.',
    fullLine: 'yt-dlp --dateafter 20240101 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· max-downloads',
    summary: 'Лимит скачиваний за прогон (--max-downloads 5); удобно для частичных плейлистов; допишите URL.',
    fullLine: 'yt-dlp --max-downloads 5 '
  },
  {
    tool: 'yt-dlp',
    token: '· match-title -F',
    summary: 'Фильтр элементов плейлиста по подстроке заголовка (--match-title trailer -F); регистр по yt-dlp; допишите URL.',
    fullLine: 'yt-dlp --match-title trailer -F '
  },
  {
    tool: 'yt-dlp',
    token: '· write-link',
    summary: 'Записать ярлык .url рядом с медиа без скачивания (--write-link --skip-download); допишите URL.',
    fullLine: 'yt-dlp --write-link --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· sponsorblock-mark',
    summary: 'Сохранить SponsorBlock-главы для всех категорий (--sponsorblock-mark all); допишите URL.',
    fullLine: 'yt-dlp --sponsorblock-mark all '
  },
  {
    tool: 'yt-dlp',
    token: '· extract-audio mp3',
    summary: 'После скачивания извлечь аудиодорожку в MP3 (--extract-audio --audio-format mp3); допишите URL.',
    fullLine: 'yt-dlp --extract-audio --audio-format mp3 '
  },
  {
    tool: 'yt-dlp',
    token: '· audio-quality 192K',
    summary: 'Целевое качество аудио при извлечении (--audio-quality 192K --extract-audio); допишите URL.',
    fullLine: 'yt-dlp --audio-quality 192K --extract-audio '
  },
  {
    tool: 'yt-dlp',
    token: '· print n_entries',
    summary: 'Число записей плейлиста без скачивания (--skip-download --print n_entries); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print n_entries '
  },
  {
    tool: 'yt-dlp',
    token: '· embed-chapters',
    summary: 'Вшить главы в файл после скачивания (--embed-chapters); допишите URL и -f/-o.',
    fullLine: 'yt-dlp --embed-chapters '
  },
  {
    tool: 'yt-dlp',
    token: '· mark-watched',
    summary: 'Отметить как просмотренное без скачивания (--mark-watched --skip-download); допишите URL (YouTube и др.).',
    fullLine: 'yt-dlp --mark-watched --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· write-all-thumbnails',
    summary: 'Сохранить все превью без видео (--write-all-thumbnails --skip-download); допишите URL.',
    fullLine: 'yt-dlp --write-all-thumbnails --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· no-check-formats -F',
    summary: 'Список форматов без проверки URL каждого (--no-check-formats -F); быстрее, но менее надёжно; допишите URL.',
    fullLine: 'yt-dlp --no-check-formats -F '
  },
  {
    tool: 'yt-dlp',
    token: '· playlist-reverse -J',
    summary: 'Плейлист в обратном порядке + JSON (--playlist-reverse -J); допишите URL.',
    fullLine: 'yt-dlp --playlist-reverse -J '
  },
  {
    tool: 'yt-dlp',
    token: '· playlist-random -J',
    summary: 'Случайный порядок элементов плейлиста + JSON (--playlist-random -J); допишите URL.',
    fullLine: 'yt-dlp --playlist-random -J '
  },
  {
    tool: 'yt-dlp',
    token: '· user-agent curl -F',
    summary: 'Подменить User-Agent (--user-agent curl/8.5.0 -F); CDN/WAF; допишите URL.',
    fullLine: 'yt-dlp --user-agent curl/8.5.0 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· throttled-rate -F',
    summary: 'Лимит скорости после детекта throttling (--throttled-rate 100K -F); допишите URL.',
    fullLine: 'yt-dlp --throttled-rate 100K -F '
  },
  {
    tool: 'yt-dlp',
    token: '· embed-subs',
    summary: 'Вшить субтитры в контейнер после скачивания (--embed-subs; обычно вместе с --write-subs); допишите URL и -f.',
    fullLine: 'yt-dlp --embed-subs '
  },
  {
    tool: 'yt-dlp',
    token: '· convert-subs srt',
    summary: 'Конвертировать субтитры в SRT постпроцессором (--convert-subs srt); допишите URL.',
    fullLine: 'yt-dlp --convert-subs srt '
  },
  {
    tool: 'yt-dlp',
    token: '· -o title.ext',
    summary: 'Шаблон имени без пробелов (-o %(title)s.%(ext)s); допишите URL (при необходимости смените шаблон вручную).',
    fullLine: 'yt-dlp -o %(title)s.%(ext)s '
  },
  {
    tool: 'yt-dlp',
    token: '· split-chapters',
    summary: 'Разрезать выход по главам (--split-chapters; нужен ffmpeg); допишите URL.',
    fullLine: 'yt-dlp --split-chapters '
  },
  {
    tool: 'yt-dlp',
    token: '· remove-chapters sponsor',
    summary: 'Вырезать главы категории sponsor из финального файла (--remove-chapters sponsor); допишите URL.',
    fullLine: 'yt-dlp --remove-chapters sponsor '
  },
  {
    tool: 'yt-dlp',
    token: '· write-playlist-meta',
    summary: 'Сохранить метаданные плейлиста рядом с файлами (--write-playlist-metafiles); допишите URL плейлиста.',
    fullLine: 'yt-dlp --write-playlist-metafiles '
  },
  {
    tool: 'yt-dlp',
    token: '· force-overwrites',
    summary: 'Перезаписывать существующие файлы без вопросов (--force-overwrites); допишите URL.',
    fullLine: 'yt-dlp --force-overwrites '
  },
  {
    tool: 'yt-dlp',
    token: '· no-continue',
    summary: 'Не продолжать частичные загрузки с .part (--no-continue; начать заново); допишите URL.',
    fullLine: 'yt-dlp --no-continue '
  },
  {
    tool: 'yt-dlp',
    token: '· recode mp4',
    summary: 'Перекодировать итог в MP4 постпроцессором (--recode-video mp4); допишите URL и формат источника.',
    fullLine: 'yt-dlp --recode-video mp4 '
  },
  {
    tool: 'yt-dlp',
    token: '· download-section clip',
    summary: 'Скачать только фрагмент времени (--download-sections *0:00-2:00; правый конец правьте вручную); допишите URL.',
    fullLine: 'yt-dlp --download-sections *0:00-2:00 '
  },
  {
    tool: 'yt-dlp',
    token: '· break-match-filters',
    summary: 'Прервать весь прогон при первом несовпадении --match-filter (--break-match-filters); допишите URL и фильтр.',
    fullLine: 'yt-dlp --break-match-filters '
  },
  {
    tool: 'yt-dlp',
    token: '· no-post-overwrites',
    summary: 'Не перезаписывать уже смерженные постпроцессингом файлы (--no-post-overwrites); допишите URL.',
    fullLine: 'yt-dlp --no-post-overwrites '
  },
  {
    tool: 'yt-dlp',
    token: '· add-metadata',
    summary: 'Записать в файл базовые теги из метаданных площадки (--add-metadata); допишите URL и -f/-o.',
    fullLine: 'yt-dlp --add-metadata '
  },
  {
    tool: 'yt-dlp',
    token: '· hls-prefer-ffmpeg -F',
    summary: 'HLS: тянуть через ffmpeg вместо нативного загрузчика (--hls-prefer-ffmpeg -F); обход части CDN-глюков; допишите URL.',
    fullLine: 'yt-dlp --hls-prefer-ffmpeg -F '
  },
  {
    tool: 'yt-dlp',
    token: '· ffmpeg-location',
    summary: 'Явный ffmpeg для постпроцессоров/мержа (--ffmpeg-location ffmpeg); при необходимости замените на полный путь без пробелов; допишите URL.',
    fullLine: 'yt-dlp --ffmpeg-location ffmpeg '
  },
  {
    tool: 'yt-dlp',
    token: '· paths home',
    summary: 'Переопределить подпапку типа home для вывода (--paths home:ytdl-out); поменяйте ytdl-out под свою структуру; допишите URL.',
    fullLine: 'yt-dlp --paths home:ytdl-out '
  },
  {
    tool: 'yt-dlp',
    token: '· no-download-archive',
    summary: 'Игнорировать журнал archive.txt даже если он в конфиге (--no-download-archive); допишите URL.',
    fullLine: 'yt-dlp --no-download-archive '
  },
  {
    tool: 'yt-dlp',
    token: '· encoding utf-8',
    summary: 'Принудительно UTF-8 для вывода yt-dlp (--encoding utf-8); кириллица/юникод в консоли Windows; допишите URL.',
    fullLine: 'yt-dlp --encoding utf-8 '
  },
  {
    tool: 'yt-dlp',
    token: '· break-per-input -F',
    summary: 'Плейлист: не прерывать весь прогон при ошибке одного URL (--break-per-input -F); допишите URL.',
    fullLine: 'yt-dlp --break-per-input -F '
  },
  {
    tool: 'yt-dlp',
    token: '· check-all-formats -F',
    summary: 'Проверить каждый формат по URL (--check-all-formats -F); медленно, зато без сюрпризов при скачивании; допишите URL.',
    fullLine: 'yt-dlp --check-all-formats -F '
  },
  {
    tool: 'yt-dlp',
    token: '· socket-timeout 60',
    summary: 'Таймаут сокета 60 с (--socket-timeout 60); медленные CDN/прокси; допишите URL.',
    fullLine: 'yt-dlp --socket-timeout 60 '
  },
  {
    tool: 'yt-dlp',
    token: '· xattrs',
    summary: 'Записать метаданные в xattr файла где поддерживается ОС (--xattrs); допишите URL.',
    fullLine: 'yt-dlp --xattrs '
  },
  {
    tool: 'yt-dlp',
    token: '· -U update',
    summary: 'Обновить yt-dlp до последней стабильной сборки (-U); URL не нужен; закройте процессы, если бинарь залочен.',
    fullLine: 'yt-dlp -U '
  },
  {
    tool: 'yt-dlp',
    token: '· compat no-unavail',
    summary: 'Совместимость: не подменять недоступные ролики YouTube заглушкой (--compat-options no-youtube-unavailable-videos -F); допишите URL.',
    fullLine: 'yt-dlp --compat-options no-youtube-unavailable-videos -F '
  },
  {
    tool: 'yt-dlp',
    token: '· --rm-cache-dir',
    summary: 'Сбросить кэш extractors yt-dlp (--rm-cache-dir); URL не нужен; помогает при «битом» кэше/неверных форматах.',
    fullLine: 'yt-dlp --rm-cache-dir'
  },
  {
    tool: 'yt-dlp',
    token: '· cache-dir -F',
    summary: 'Альтернативный путь кэша extractors (--cache-dir cache -F); путь без пробелов; допишите URL.',
    fullLine: 'yt-dlp --cache-dir cache -F '
  },
  {
    tool: 'yt-dlp',
    token: '· keep-fragments -F',
    summary: 'Не удалять промежуточные фрагменты после мержа (--keep-fragments -F); диагностика DASH/HLS; допишите URL.',
    fullLine: 'yt-dlp --keep-fragments -F '
  },
  {
    tool: 'yt-dlp',
    token: '· buffer-size 16K -F',
    summary: 'Размер буфера чтения для медленных CDN (--buffer-size 16K -F); подстройте при необходимости; допишите URL.',
    fullLine: 'yt-dlp --buffer-size 16K -F '
  },
  {
    tool: 'yt-dlp',
    token: '· abort-unavail-frag',
    summary: 'Прервать загрузку при первом недоступном фрагменте (--abort-on-unavailable-fragments); жёсткий режим; допишите URL.',
    fullLine: 'yt-dlp --abort-on-unavailable-fragments '
  },
  {
    tool: 'yt-dlp',
    token: '· sub-langs en,ru -F',
    summary: 'Выбор языков субтитров без кавычек (--sub-langs en.*,ru.* -F); пары язык/регион регуляркой; допишите URL.',
    fullLine: 'yt-dlp --sub-langs en.*,ru.* -F '
  },
  {
    tool: 'yt-dlp',
    token: '· --print release_date',
    summary: 'Дата релиза YYYYMMDD без скачивания (--skip-download --print release_date); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print release_date '
  },
  {
    tool: 'yt-dlp',
    token: '· --print album_artist',
    summary: 'Исполнитель альбома без скачивания (--skip-download --print album_artist); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print album_artist '
  },
  {
    tool: 'yt-dlp',
    token: '· --print track_number',
    summary: 'Номер трека внутри альбома без скачивания (--skip-download --print track_number); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print track_number '
  },
  {
    tool: 'yt-dlp',
    token: '· cookies brave',
    summary: 'Сухой прогон с cookies Brave (--skip-download --cookies-from-browser brave); допишите URL.',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser brave '
  },
  {
    tool: 'yt-dlp',
    token: '· --print series',
    summary: 'Название серии/шоу без скачивания (--skip-download --print series); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print series '
  },
  {
    tool: 'yt-dlp',
    token: '· --print season',
    summary: 'Сезон (строка площадки) без скачивания (--skip-download --print season); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print season '
  },
  {
    tool: 'yt-dlp',
    token: '· --print episode',
    summary: 'Эпизод (строка площадки) без скачивания (--skip-download --print episode); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print episode '
  },
  {
    tool: 'yt-dlp',
    token: '· --print display_id',
    summary: 'Короткий display_id без скачивания (--skip-download --print display_id); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print display_id '
  },
  {
    tool: 'yt-dlp',
    token: '· --print webpage_url_basename',
    summary: 'Последний сегмент пути страницы без скачивания (--skip-download --print webpage_url_basename); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print webpage_url_basename '
  },
  {
    tool: 'yt-dlp',
    token: '· --print fulltitle',
    summary: 'Полный заголовок с плейлистом/серией без скачивания (--skip-download --print fulltitle); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print fulltitle '
  },
  {
    tool: 'yt-dlp',
    token: '· sponsorblock-remove',
    summary: 'Вырезать сегменты sponsor из файла постпроцессором (--sponsorblock-remove sponsor); допишите URL и -f.',
    fullLine: 'yt-dlp --sponsorblock-remove sponsor '
  },
  {
    tool: 'yt-dlp',
    token: '· downloader native -F',
    summary: 'Нативный загрузчик фрагментов (--downloader native -F); обход части ffmpeg-глюков; допишите URL.',
    fullLine: 'yt-dlp --downloader native -F '
  },
  {
    tool: 'yt-dlp',
    token: '· legacy-server-connect -F',
    summary: 'TLS legacy renegotiation (--legacy-server-connect -F) для старых CDN; допишите URL.',
    fullLine: 'yt-dlp --legacy-server-connect -F '
  },
  {
    tool: 'yt-dlp',
    token: '· no-call-home -F',
    summary: 'Не слать update-проверку yt-dlp (--no-call-home -F); допишите URL.',
    fullLine: 'yt-dlp --no-call-home -F '
  },
  {
    tool: 'yt-dlp',
    token: '· datebefore -F',
    summary: 'Только ролики не новее даты (--datebefore 20991231 -F; поменяйте дату YYYYMMDD); допишите URL.',
    fullLine: 'yt-dlp --datebefore 20991231 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· embed-info-json',
    summary: 'Встроить .info.json в контейнер после скачивания (--embed-info-json); допишите URL и -f/-o.',
    fullLine: 'yt-dlp --embed-info-json '
  },
  {
    tool: 'yt-dlp',
    token: '· netrc -F',
    summary: 'Учётные данные из ~/.netrc (--netrc -F); для сайтов с логином; допишите URL.',
    fullLine: 'yt-dlp --netrc -F '
  },
  {
    tool: 'yt-dlp',
    token: '· force-generic -F',
    summary: 'Форс generic-extractor (--force-generic-extractor -F) при сбое распознавания; допишите URL.',
    fullLine: 'yt-dlp --force-generic-extractor -F '
  },
  {
    tool: 'yt-dlp',
    token: '· --print follower_count',
    summary: 'Число подписчиков канала без скачивания (--skip-download --print channel_follower_count); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print channel_follower_count '
  },
  {
    tool: 'yt-dlp',
    token: '· --print average_rating',
    summary: 'Средний рейтинг/оценка без скачивания (--skip-download --print average_rating); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print average_rating '
  },
  {
    tool: 'yt-dlp',
    token: '· write-all-urls',
    summary: 'Список всех извлечённых URL в лог (--write-all-urls --skip-download); допишите URL.',
    fullLine: 'yt-dlp --write-all-urls --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· dump-pages',
    summary: 'Сырой дамп страниц extractor в файлы (--dump-pages --skip-download); диагностика HTML/API; допишите URL.',
    fullLine: 'yt-dlp --dump-pages --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· no-progress -F',
    summary: 'Без прогресс-бара в консоли (--no-progress -F); чище логи в длинных списках; допишите URL.',
    fullLine: 'yt-dlp --no-progress -F '
  },
  {
    tool: 'yt-dlp',
    token: '· --print is_private',
    summary: 'Признак приватного/ограниченного ролика без скачивания (--skip-download --print is_private); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print is_private '
  },
  {
    tool: 'yt-dlp',
    token: '· no-playlist -J',
    summary: 'JSON метаданных только для одного ролика из URL-плейлиста (--no-playlist -J); допишите URL.',
    fullLine: 'yt-dlp --no-playlist -J '
  },
  {
    tool: 'yt-dlp',
    token: '· hls-use-mpegts -F',
    summary: 'HLS: сохранять как MPEG-TS сегменты (--hls-use-mpegts -F) при проблемах с фрагментами; допишите URL.',
    fullLine: 'yt-dlp --hls-use-mpegts -F '
  },
  {
    tool: 'yt-dlp',
    token: '· write-subs skip',
    summary: 'Скачать ручные субтитры без видео (--write-subs --skip-download); допишите URL.',
    fullLine: 'yt-dlp --write-subs --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· max-sleep-interval -F',
    summary: 'Верхняя граница пауз между HTTP-запросами (--max-sleep-interval 10 -F); подстройте секунды; допишите URL.',
    fullLine: 'yt-dlp --max-sleep-interval 10 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· retry-sleep -F',
    summary: 'Пауза между повторными попытками загрузки (--retry-sleep 5 -F); допишите URL.',
    fullLine: 'yt-dlp --retry-sleep 5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· min-filesize -F',
    summary: 'Пропускать форматы меньше порога (--min-filesize 100K -F); поменяйте размер при необходимости; допишите URL.',
    fullLine: 'yt-dlp --min-filesize 100K -F '
  },
  {
    tool: 'yt-dlp',
    token: '· file-access-retries -F',
    summary: 'Повторы при ошибках чтения/записи на диске (--file-access-retries 5 -F); допишите URL.',
    fullLine: 'yt-dlp --file-access-retries 5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· --print playlist',
    summary: 'Название плейлиста без скачивания (--skip-download --print playlist); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print playlist '
  },
  {
    tool: 'yt-dlp',
    token: '· print playlist_autonumber',
    summary: 'Автонумерация в шаблоне -o без скачивания (--skip-download --print playlist_autonumber); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print playlist_autonumber '
  },
  {
    tool: 'yt-dlp',
    token: '· print modified_timestamp',
    summary: 'Unix-время последнего изменения метаданных без скачивания (--skip-download --print modified_timestamp); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print modified_timestamp '
  },
  {
    tool: 'yt-dlp',
    token: '· print release_timestamp',
    summary: 'Unix-время релиза/премьеры без скачивания (--skip-download --print release_timestamp); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print release_timestamp '
  },
  {
    tool: 'yt-dlp',
    token: '· print upload_timestamp',
    summary: 'Unix-время загрузки на площадку без скачивания (--skip-download --print upload_timestamp); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print upload_timestamp '
  },
  {
    tool: 'yt-dlp',
    token: '· print stretched_ratio',
    summary: 'Соотношение сторон после растяжения (stretched_ratio) без скачивания (--skip-download --print stretched_ratio); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print stretched_ratio '
  },
  {
    tool: 'yt-dlp',
    token: '· print location',
    summary: 'Гео/локация из метаданных без скачивания (--skip-download --print location); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print location '
  },
  {
    tool: 'yt-dlp',
    token: '· player_client=android -F',
    summary: 'YouTube: клиент Android в extractor-args (--extractor-args youtube:player_client=android -F); обход части web-ограничений; допишите URL.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=android -F '
  },
  {
    tool: 'yt-dlp',
    token: '· player_client=tv_embedded -F',
    summary: 'YouTube: встроенный TV-клиент (--extractor-args youtube:player_client=tv_embedded -F); допишите URL.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=tv_embedded -F '
  },
  {
    tool: 'yt-dlp',
    token: '· player_client=ios -F',
    summary: 'YouTube: iOS-клиент в extractor-args (--extractor-args youtube:player_client=ios -F); допишите URL.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=ios -F '
  },
  {
    tool: 'yt-dlp',
    token: '· --print alternate_title',
    summary: 'Альтернативный заголовок без скачивания (--skip-download --print alternate_title); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print alternate_title '
  },
  {
    tool: 'yt-dlp',
    token: '· --print extractor_key',
    summary: 'Внутренний ключ extractor без скачивания (--skip-download --print extractor_key); сверка с `--print extractor`; допишите URL.',
    fullLine: 'yt-dlp --skip-download --print extractor_key '
  },
  {
    tool: 'yt-dlp',
    token: '· flat print webpage_url',
    summary: 'Плоский плейлист: URL страницы каждого элемента без глубокого извлечения (--flat-playlist --skip-download --print webpage_url); допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist --skip-download --print webpage_url '
  },
  {
    tool: 'yt-dlp',
    token: '· geo-bypass DE -F',
    summary: 'Гео-обход с кодом страны DE (--geo-bypass-country DE -F); поменяйте ISO-код при необходимости; допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country DE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· --print channel_is_verified',
    summary: 'Флаг верифицированного канала без скачивания (--skip-download --print channel_is_verified); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print channel_is_verified '
  },
  {
    tool: 'yt-dlp',
    token: '· cookies opera',
    summary: 'Сухой прогон с cookies Opera (--skip-download --cookies-from-browser opera); допишите URL.',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser opera '
  },
  {
    tool: 'yt-dlp',
    token: '· cookies chromium',
    summary: 'Сухой прогон с cookies Chromium (--skip-download --cookies-from-browser chromium); допишите URL.',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser chromium '
  },
  {
    tool: 'yt-dlp',
    token: '· cookies vivaldi',
    summary: 'Сухой прогон с cookies Vivaldi (--skip-download --cookies-from-browser vivaldi); допишите URL.',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser vivaldi '
  },
  {
    tool: 'yt-dlp',
    token: '· geo-bypass FR -F',
    summary: 'Гео-обход с кодом страны FR (--geo-bypass-country FR -F); поменяйте ISO-код при необходимости; допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country FR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· player_client=mweb -F',
    summary: 'YouTube: мобильный web-клиент mweb в extractor-args (--extractor-args youtube:player_client=mweb -F); допишите URL.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=mweb -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print requested_formats',
    summary: 'Список запрошенных/выбранных форматов без скачивания (--skip-download --print requested_formats); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print requested_formats '
  },
  {
    tool: 'yt-dlp',
    token: '· print requested_subtitles',
    summary: 'Запрошенные субтитры без скачивания (--skip-download --print requested_subtitles); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print requested_subtitles '
  },
  {
    tool: 'yt-dlp',
    token: '· cookies safari',
    summary: 'Сухой прогон с cookies Safari (--skip-download --cookies-from-browser safari); macOS/Windows — по наличию профиля; допишите URL.',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser safari '
  },
  {
    tool: 'yt-dlp',
    token: '· player_client=web_creator -F',
    summary: 'YouTube: web_creator в extractor-args (--extractor-args youtube:player_client=web_creator -F); Studio/ограниченные кейсы; допишите URL.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=web_creator -F '
  },
  {
    tool: 'yt-dlp',
    token: '· player_client=web_embedded -F',
    summary: 'YouTube: web_embedded в extractor-args (--extractor-args youtube:player_client=web_embedded -F); встраиваемый плеер; допишите URL.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=web_embedded -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo-bypass GB -F',
    summary: 'Гео-обход с кодом страны GB (--geo-bypass-country GB -F); поменяйте ISO-код при необходимости; допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GB -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print formats',
    summary: 'Словарь доступных форматов без скачивания (--skip-download --print formats); тяжёлый вывод — для диагностики; допишите URL.',
    fullLine: 'yt-dlp --skip-download --print formats '
  },
  {
    tool: 'yt-dlp',
    token: '· simulate merge best',
    summary: 'Сухой прогон выбора слияния видео+аудио (--simulate -f bestvideo+bestaudio/best); без файлов; допишите URL.',
    fullLine: 'yt-dlp --simulate -f bestvideo+bestaudio/best '
  },
  {
    tool: 'yt-dlp',
    token: '· multi-streams -F',
    summary: 'Список форматов с учётом multi-stream (--multi-streams -F); DASH/HLS с раздельными потоками; допишите URL.',
    fullLine: 'yt-dlp --multi-streams -F '
  },
  {
    tool: 'yt-dlp',
    token: '· compat-options 2024 -F',
    summary: 'Совместимость «как в 2024+» (--compat-options 2024 -F); задел под будущие изменения yt-dlp; допишите URL.',
    fullLine: 'yt-dlp --compat-options 2024 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· no-playlist print title',
    summary: 'Только один ролик из URL-плейлиста + заголовок без скачивания (--no-playlist --skip-download --print title); допишите URL.',
    fullLine: 'yt-dlp --no-playlist --skip-download --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· flat print extractor',
    summary: 'Плоский плейлист: имя extractor каждого элемента без глубокого извлечения (--flat-playlist --skip-download --print extractor); допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist --skip-download --print extractor '
  },
  {
    tool: 'yt-dlp',
    token: '· no-remote-playlist -J',
    summary: 'JSON плейлиста без разрешения внешних ссылок на другие плейлисты (--no-remote-playlist -J); меньше сетевых обходов; допишите URL.',
    fullLine: 'yt-dlp --no-remote-playlist -J '
  },
  {
    tool: 'yt-dlp',
    token: '· geo-bypass JP -F',
    summary: 'Гео-обход с кодом страны JP (--geo-bypass-country JP -F); региональные ограничения; допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country JP -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo-bypass CA -F',
    summary: 'Гео-обход с кодом страны CA (--geo-bypass-country CA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print thumbnails',
    summary: 'Словарь URL превью/thumbnail без скачивания (--skip-download --print thumbnails); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print thumbnails '
  },
  {
    tool: 'yt-dlp',
    token: '· player_client=web_safari -F',
    summary: 'YouTube: web_safari в extractor-args (--extractor-args youtube:player_client=web_safari -F); Safari-подобный web-клиент; допишите URL.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=web_safari -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print playlist_channel',
    summary: 'Имя канала плейлиста без скачивания (--skip-download --print playlist_channel); допишите URL плейлиста.',
    fullLine: 'yt-dlp --skip-download --print playlist_channel '
  },
  {
    tool: 'yt-dlp',
    token: '· print playlist_channel_id',
    summary: 'Идентификатор канала плейлиста без скачивания (--skip-download --print playlist_channel_id); допишите URL плейлиста.',
    fullLine: 'yt-dlp --skip-download --print playlist_channel_id '
  },
  {
    tool: 'yt-dlp',
    token: '· print playlist_uploader',
    summary: 'Автор/uploader плейлиста без скачивания (--skip-download --print playlist_uploader); допишите URL плейлиста.',
    fullLine: 'yt-dlp --skip-download --print playlist_uploader '
  },
  {
    tool: 'yt-dlp',
    token: '· print playlist_uploader_id',
    summary: 'ID автора плейлиста без скачивания (--skip-download --print playlist_uploader_id); допишите URL плейлиста.',
    fullLine: 'yt-dlp --skip-download --print playlist_uploader_id '
  },
  {
    tool: 'yt-dlp',
    token: '· flat print _type',
    summary: 'Плоский плейлист: тип записи video/playlist/… (--flat-playlist --skip-download --print _type); допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist --skip-download --print _type '
  },
  {
    tool: 'yt-dlp',
    token: '· merge mp4',
    summary: 'Слияние потоков в MP4 при мультиплексировании (--merge-output-format mp4); допишите URL и -f …',
    fullLine: 'yt-dlp --merge-output-format mp4 '
  },
  {
    tool: 'yt-dlp',
    token: '· no-keep-video',
    summary: 'После извлечения аудио не оставлять исходное видео (--no-keep-video); допишите URL и --extract-audio при необходимости.',
    fullLine: 'yt-dlp --no-keep-video '
  },
  {
    tool: 'yt-dlp',
    token: '· ext-downloader ffmpeg',
    summary: 'Тянуть фрагменты через внешний ffmpeg (--external-downloader ffmpeg); обход части нативных загрузчиков; допишите URL.',
    fullLine: 'yt-dlp --external-downloader ffmpeg '
  },
  {
    tool: 'yt-dlp',
    token: '· parse-metadata title',
    summary: 'Постобработка метаданных: перезапись title из шаблона (--parse-metadata title:%(title)s); допишите URL.',
    fullLine: 'yt-dlp --parse-metadata title:%(title)s '
  },
  {
    tool: 'yt-dlp',
    token: '· geo-bypass AU -F',
    summary: 'Гео-обход с кодом страны AU (--geo-bypass-country AU -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo-bypass BR -F',
    summary: 'Гео-обход с кодом страны BR (--geo-bypass-country BR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo-bypass IT -F',
    summary: 'Гео-обход с кодом страны IT (--geo-bypass-country IT -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country IT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print playlist_webpage_url',
    summary: 'URL страницы плейлиста без скачивания (--skip-download --print playlist_webpage_url); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print playlist_webpage_url '
  },
  {
    tool: 'yt-dlp',
    token: '· print webpage_url_scheme',
    summary: 'Схема URL страницы (http/https) без скачивания (--skip-download --print webpage_url_scheme); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print webpage_url_scheme '
  },
  {
    tool: 'yt-dlp',
    token: '· video-multistreams -F',
    summary: 'Список форматов с учётом нескольких видеопотоков (--video-multistreams -F); редкие мульти-angle; допишите URL.',
    fullLine: 'yt-dlp --video-multistreams -F '
  },
  {
    tool: 'yt-dlp',
    token: '· audio-multistreams -F',
    summary: 'Список форматов с учётом нескольких аудиопотоков (--audio-multistreams -F); мультиязык; допишите URL.',
    fullLine: 'yt-dlp --audio-multistreams -F '
  },
  {
    tool: 'yt-dlp',
    token: '· quiet -F',
    summary: 'Минимум служебного вывода при списке форматов (--quiet -F); допишите URL.',
    fullLine: 'yt-dlp --quiet -F '
  },
  {
    tool: 'yt-dlp',
    token: '· no-cookies -F',
    summary: 'Игнорировать cookies из браузера/файла (--no-cookies -F); изолированный прогон; допишите URL.',
    fullLine: 'yt-dlp --no-cookies -F '
  },
  {
    tool: 'yt-dlp',
    token: '· compat-options 2025 -F',
    summary: 'Совместимость с поведением yt-dlp 2025 (--compat-options 2025 -F); допишите URL.',
    fullLine: 'yt-dlp --compat-options 2025 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· break-on-existing -F',
    summary: 'Остановиться, если целевой файл уже существует (--break-on-existing -F); допишите URL и шаблон -o при необходимости.',
    fullLine: 'yt-dlp --break-on-existing -F '
  },
  {
    tool: 'yt-dlp',
    token: '· mtime',
    summary: 'Выставлять время файла по Last-Modified с сервера (--mtime); противоположность --no-mtime; допишите URL.',
    fullLine: 'yt-dlp --mtime '
  },
  {
    tool: 'yt-dlp',
    token: '· check-formats-threshold -F',
    summary: 'Порог для --check-formats (доля битрейта, здесь 1.5) + список форматов; допишите URL.',
    fullLine: 'yt-dlp --check-formats-threshold 1.5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· no-sponsorblock -F',
    summary: 'Не обращаться к SponsorBlock API (--no-sponsorblock -F); чистый список форматов; допишите URL.',
    fullLine: 'yt-dlp --no-sponsorblock -F '
  },
  {
    tool: 'yt-dlp',
    token: '· allow-dynamic-mpd -F',
    summary: 'Разрешить «живые» DASH MPD с обновлением манифеста (--allow-dynamic-mpd -F); допишите URL.',
    fullLine: 'yt-dlp --allow-dynamic-mpd -F '
  },
  {
    tool: 'yt-dlp',
    token: '· console-title -F',
    summary: 'Заголовок окна консоли с прогрессом (--console-title -F); допишите URL.',
    fullLine: 'yt-dlp --console-title -F '
  },
  {
    tool: 'yt-dlp',
    token: '· no-external-downloader -F',
    summary: 'Только встроенный загрузчик, без внешних обёрток (--no-external-downloader -F); допишите URL.',
    fullLine: 'yt-dlp --no-external-downloader -F '
  },
  {
    tool: 'yt-dlp',
    token: '· clean-infojson',
    summary: 'Удалить временный .info.json после успешной загрузки (--clean-infojson); обычно вместе с --write-info-json; допишите URL и ключи вывода.',
    fullLine: 'yt-dlp --clean-infojson '
  },
  {
    tool: 'yt-dlp',
    token: '· no-write-info-json -F',
    summary: 'Не записывать .info.json рядом с выходом (--no-write-info-json -F); допишите URL.',
    fullLine: 'yt-dlp --no-write-info-json -F '
  },
  {
    tool: 'yt-dlp',
    token: '· ext-downloader-args -F',
    summary: 'Доп. аргументы внешнему downloader без кавычек (--external-downloader-args ffmpeg_i:-nostdin -F); допишите URL при использовании внешнего downloader.',
    fullLine: 'yt-dlp --external-downloader-args ffmpeg_i:-nostdin -F '
  },
  {
    tool: 'yt-dlp',
    token: '· flat-print urls',
    summary: 'Плоский плейлист: все URL элементов без скачивания (--flat-playlist --print urls --skip-download); допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist --print urls --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· progress-template -F',
    summary: 'Свой шаблон строки прогресса (--progress-template predownload:Preparing %(info.title)s -F); допишите URL.',
    fullLine: 'yt-dlp --progress-template predownload:Preparing %(info.title)s -F '
  },
  {
    tool: 'yt-dlp',
    token: '· sleep-subtitles -F',
    summary: 'Пауза перед скачиванием субтитров (--sleep-subtitles 5 -F); допишите URL.',
    fullLine: 'yt-dlp --sleep-subtitles 5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· sub-format best -F',
    summary: 'Предпочесть лучший доступный формат субтитров (--sub-format best -F); допишите URL.',
    fullLine: 'yt-dlp --sub-format best -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo-bypass NL -F',
    summary: 'Гео-обход с кодом страны NL (--geo-bypass-country NL -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country NL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· force-keyframes-at-cuts',
    summary: 'Принудительные ключевые кадры на границах нарезки/склейки (--force-keyframes-at-cuts); для ffmpeg postprocessor; допишите URL и -f …',
    fullLine: 'yt-dlp --force-keyframes-at-cuts '
  },
  {
    tool: 'yt-dlp',
    token: '· no-hls-use-mpegts -F',
    summary: 'Отключить MPEG-TS для HLS (--no-hls-use-mpegts -F); противоположность --hls-use-mpegts; допишите URL.',
    fullLine: 'yt-dlp --no-hls-use-mpegts -F '
  },
  {
    tool: 'yt-dlp',
    token: '· compat no-direct-merge -F',
    summary: 'Не сливать потоки напрямую в mkv/webm (--compat-options no-direct-merge -F); диагностика merge/ffmpeg; допишите URL.',
    fullLine: 'yt-dlp --compat-options no-direct-merge -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo-bypass ES -F',
    summary: 'Гео-обход с кодом страны ES (--geo-bypass-country ES -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country ES -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo-bypass PL -F',
    summary: 'Гео-обход с кодом страны PL (--geo-bypass-country PL -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo-bypass SE -F',
    summary: 'Гео-обход с кодом страны SE (--geo-bypass-country SE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· no-embed-metadata',
    summary: 'Не встраивать метаданные в выходной файл (--no-embed-metadata); противоположность --embed-metadata; допишите URL.',
    fullLine: 'yt-dlp --no-embed-metadata '
  },
  {
    tool: 'yt-dlp',
    token: '· playlist-items range -F',
    summary: 'Только элементы плейлиста 1…10 (--playlist-items 1:10 -F); без полного разбора хвоста; допишите URL плейлиста.',
    fullLine: 'yt-dlp --playlist-items 1:10 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· merge webm',
    summary: 'Слияние потоков в WebM при мультиплексировании (--merge-output-format webm); допишите URL и -f …',
    fullLine: 'yt-dlp --merge-output-format webm '
  },
  {
    tool: 'yt-dlp',
    token: '· ignore-no-formats-error -F',
    summary: 'Не падать, если форматов нет (--ignore-no-formats-error -F); диагностика гео/DRM/возраста; допишите URL.',
    fullLine: 'yt-dlp --ignore-no-formats-error -F '
  },
  {
    tool: 'yt-dlp',
    token: '· no-write-thumbnail -F',
    summary: 'Не сохранять thumbnail даже если шаблон подразумевает (--no-write-thumbnail -F); допишите URL.',
    fullLine: 'yt-dlp --no-write-thumbnail -F '
  },
  {
    tool: 'yt-dlp',
    token: '· extract-audio aac',
    summary: 'Извлечь аудио в AAC (--extract-audio --audio-format aac); допишите URL.',
    fullLine: 'yt-dlp --extract-audio --audio-format aac '
  },
  {
    tool: 'yt-dlp',
    token: '· no-embed-thumbnail',
    summary: 'Не встраивать обложку в контейнер (--no-embed-thumbnail); противоположность --embed-thumbnail; допишите URL.',
    fullLine: 'yt-dlp --no-embed-thumbnail '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file title',
    summary: 'Записать поле title в рядом лежащий текстовый файл без скачивания (--print-to-file title flux-ytdlp-title.txt --skip-download); допишите URL.',
    fullLine: 'yt-dlp --print-to-file title flux-ytdlp-title.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· enable-file-urls -F',
    summary: 'Разрешить file:// URL в аргументах (--enable-file-urls -F); только для доверенных путей; допишите URL.',
    fullLine: 'yt-dlp --enable-file-urls -F '
  },
  {
    tool: 'yt-dlp',
    token: '· source-address -F',
    summary: 'Исходящий IP через bind (--source-address 198.51.100.2 -F, TEST-NET-2); допишите URL.',
    fullLine: 'yt-dlp --source-address 198.51.100.2 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print annotations',
    summary: 'Сырые аннотации метаданных без скачивания (--skip-download --print annotations); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print annotations '
  },
  {
    tool: 'yt-dlp',
    token: '· print storyboards',
    summary: 'Доски storyboard (если отдаёт площадка) без скачивания (--skip-download --print storyboards); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print storyboards '
  },
  {
    tool: 'yt-dlp',
    token: '· sponsorblock chapter title',
    summary: 'SponsorBlock: главы + шаблон заголовка сегмента (--sponsorblock-mark all --sponsorblock-chapter-title %(category)s); допишите URL.',
    fullLine: 'yt-dlp --sponsorblock-mark all --sponsorblock-chapter-title %(category)s '
  },
  {
    tool: 'yt-dlp',
    token: '· concat-playlist never -F',
    summary: 'Политика склейки плейлиста в один поток (--concat-playlist never -F); допишите URL.',
    fullLine: 'yt-dlp --concat-playlist never -F '
  },
  {
    tool: 'yt-dlp',
    token: '· fixup warn -F',
    summary: 'Политика пост-ремонта контейнера (--fixup warn -F); допишите URL.',
    fullLine: 'yt-dlp --fixup warn -F '
  },
  {
    tool: 'yt-dlp',
    token: '· use-extractors youtube -F',
    summary: 'Ограничить набор экстракторов (--use-extractors youtube -F); допишите URL.',
    fullLine: 'yt-dlp --use-extractors youtube -F '
  },
  {
    tool: 'yt-dlp',
    token: '· default-search auto -F',
    summary: 'Поиск по умолчанию, если ввод не похож на URL (--default-search auto: -F); допишите запрос.',
    fullLine: 'yt-dlp --default-search auto: -F '
  },
  {
    tool: 'yt-dlp',
    token: '· ignore-dynamic-mpd -F',
    summary: 'Игнорировать обновляемые «живые» DASH MPD (--ignore-dynamic-mpd -F); стабильнее на коротком окне; допишите URL.',
    fullLine: 'yt-dlp --ignore-dynamic-mpd -F '
  },
  {
    tool: 'yt-dlp',
    token: '· sponsorblock-api -F',
    summary: 'Кастомный HTTP API SponsorBlock (--sponsorblock-api https://sponsor.ajay.app -F); при сбоях дефолтного сервера; допишите URL.',
    fullLine: 'yt-dlp --sponsorblock-api https://sponsor.ajay.app -F '
  },
  {
    tool: 'yt-dlp',
    token: '· config-locations -F',
    summary: 'Доп. файл конфигурации рядом с задачей (--config-locations yt-dlp.conf -F); создайте yt-dlp.conf при необходимости; допишите URL.',
    fullLine: 'yt-dlp --config-locations yt-dlp.conf -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo MX -F',
    summary: 'Гео-обход с кодом страны MX (--geo-bypass-country MX -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MX -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo KR -F',
    summary: 'Гео-обход с кодом страны KR (--geo-bypass-country KR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country KR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo IN -F',
    summary: 'Гео-обход с кодом страны IN (--geo-bypass-country IN -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country IN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo TR -F',
    summary: 'Гео-обход с кодом страны TR (--geo-bypass-country TR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo NO -F',
    summary: 'Гео-обход с кодом страны NO (--geo-bypass-country NO -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country NO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo CH -F',
    summary: 'Гео-обход с кодом страны CH (--geo-bypass-country CH -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· xfwd -F',
    summary: 'Добавить X-Forwarded-For/-Proto к HTTP (--xfwd -F); за reverse-proxy/интроспекцию; допишите URL.',
    fullLine: 'yt-dlp --xfwd -F '
  },
  {
    tool: 'yt-dlp',
    token: '· no-cookies-browser -F',
    summary: 'Явно отключить cookies из браузера (--no-cookies-from-browser -F); если мешают профили/переменные; допишите URL.',
    fullLine: 'yt-dlp --no-cookies-from-browser -F '
  },
  {
    tool: 'yt-dlp',
    token: '· downloader-args ffmpeg -F',
    summary: 'Доп. аргументы встроенному ffmpeg-downloader (--downloader-args ffmpeg:-nostdin -F); допишите URL.',
    fullLine: 'yt-dlp --downloader-args ffmpeg:-nostdin -F '
  },
  {
    tool: 'yt-dlp',
    token: '· include-ads -F',
    summary: 'Не вырезать рекламные вставки в плейлистах (--include-ads -F); допишите URL.',
    fullLine: 'yt-dlp --include-ads -F '
  },
  {
    tool: 'yt-dlp',
    token: '· twofactor code',
    summary: 'TV Provider/2FA: одноразовый код (--twofactor 123456); замените на актуальный TOTP; допишите URL.',
    fullLine: 'yt-dlp --twofactor 123456 '
  },
  {
    tool: 'yt-dlp',
    token: '· video-password',
    summary: 'Пароль возрастного/закрытого видео (--video-password PASSWORD); замените PASSWORD на реальный; допишите URL.',
    fullLine: 'yt-dlp --video-password PASSWORD '
  },
  {
    tool: 'yt-dlp',
    token: '· ap-mso Rogers -F',
    summary: 'Adobe Pass MSO id для TV Everywhere (--ap-mso Rogers -F); подставьте своего провайдера; допишите URL.',
    fullLine: 'yt-dlp --ap-mso Rogers -F '
  },
  {
    tool: 'yt-dlp',
    token: '· ap-username -F',
    summary: 'Логин TV Everywhere (--ap-username user@example.com -F); замените на свой аккаунт; допишите URL.',
    fullLine: 'yt-dlp --ap-username user@example.com -F '
  },
  {
    tool: 'yt-dlp',
    token: '· concurrent-downloads 2 -F',
    summary: 'Параллельные загрузки фрагментов/потоков (--concurrent-downloads 2 -F); подстройте число; допишите URL.',
    fullLine: 'yt-dlp --concurrent-downloads 2 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo NZ -F',
    summary: 'Гео-обход с кодом страны NZ (--geo-bypass-country NZ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country NZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo ZA -F',
    summary: 'Гео-обход с кодом страны ZA (--geo-bypass-country ZA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country ZA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· ap-password',
    summary: 'Пароль TV Everywhere / Adobe Pass (--ap-password PASSWORD); замените PASSWORD на реальный; допишите URL.',
    fullLine: 'yt-dlp --ap-password PASSWORD '
  },
  {
    tool: 'yt-dlp',
    token: '· client-cert pem',
    summary: 'Клиентский TLS-сертификат (--client-certificate client.pem); положите PEM рядом с рабочим каталогом или укажите абсолютный путь без кавычек; допишите URL.',
    fullLine: 'yt-dlp --client-certificate client.pem '
  },
  {
    tool: 'yt-dlp',
    token: '· geo-verify-proxy -F',
    summary: 'Прокси только для гео-проверки (--geo-verification-proxy … -F); замените хост/порт при необходимости; допишите URL.',
    fullLine: 'yt-dlp --geo-verification-proxy http://127.0.0.1:8888 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo AT -F',
    summary: 'Гео-обход с кодом страны AT (--geo-bypass-country AT -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo DK -F',
    summary: 'Гео-обход с кодом страны DK (--geo-bypass-country DK -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country DK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo FI -F',
    summary: 'Гео-обход с кодом страны FI (--geo-bypass-country FI -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country FI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo GR -F',
    summary: 'Гео-обход с кодом страны GR (--geo-bypass-country GR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo PT -F',
    summary: 'Гео-обход с кодом страны PT (--geo-bypass-country PT -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo BE -F',
    summary: 'Гео-обход с кодом страны BE (--geo-bypass-country BE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo IE -F',
    summary: 'Гео-обход с кодом страны IE (--geo-bypass-country IE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country IE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· client-cert-key pem',
    summary: 'Приватный ключ к клиентскому TLS-сертификату (--client-certificate-key key.pem); положите PEM рядом с рабочим каталогом или укажите путь без кавычек; допишите URL.',
    fullLine: 'yt-dlp --client-certificate-key key.pem '
  },
  {
    tool: 'yt-dlp',
    token: '· impersonate firefox -F',
    summary: 'TLS/HTTP fingerprint как у Firefox (--impersonate firefox -F); допишите URL.',
    fullLine: 'yt-dlp --impersonate firefox -F '
  },
  {
    tool: 'yt-dlp',
    token: '· impersonate edge -F',
    summary: 'TLS/HTTP fingerprint как у Edge (--impersonate edge -F); допишите URL.',
    fullLine: 'yt-dlp --impersonate edge -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo CZ -F',
    summary: 'Гео-обход с кодом страны CZ (--geo-bypass-country CZ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo HU -F',
    summary: 'Гео-обход с кодом страны HU (--geo-bypass-country HU -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country HU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo RO -F',
    summary: 'Гео-обход с кодом страны RO (--geo-bypass-country RO -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country RO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo BG -F',
    summary: 'Гео-обход с кодом страны BG (--geo-bypass-country BG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo HR -F',
    summary: 'Гео-обход с кодом страны HR (--geo-bypass-country HR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country HR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo LV -F',
    summary: 'Гео-обход с кодом страны LV (--geo-bypass-country LV -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country LV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo LT -F',
    summary: 'Гео-обход с кодом страны LT (--geo-bypass-country LT -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country LT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo EE -F',
    summary: 'Гео-обход с кодом страны EE (--geo-bypass-country EE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country EE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo IS -F',
    summary: 'Гео-обход с кодом страны IS (--geo-bypass-country IS -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country IS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· convert-thumbnails png',
    summary: 'Конвертировать обложку в PNG при скачивании (--convert-thumbnails png); допишите URL и ключи вывода.',
    fullLine: 'yt-dlp --convert-thumbnails png '
  },
  {
    tool: 'yt-dlp',
    token: '· audio opus',
    summary: 'Извлечь аудио в Opus (--extract-audio --audio-format opus); допишите URL и ключи вывода.',
    fullLine: 'yt-dlp --extract-audio --audio-format opus '
  },
  {
    tool: 'yt-dlp',
    token: '· audio flac',
    summary: 'Извлечь аудио в FLAC без потерь (--extract-audio --audio-format flac); допишите URL и ключи вывода.',
    fullLine: 'yt-dlp --extract-audio --audio-format flac '
  },
  {
    tool: 'yt-dlp',
    token: '· audio wav',
    summary: 'Извлечь аудио в WAV (--extract-audio --audio-format wav); допишите URL и ключи вывода.',
    fullLine: 'yt-dlp --extract-audio --audio-format wav '
  },
  {
    tool: 'yt-dlp',
    token: '· audio m4a',
    summary: 'Извлечь аудио в M4A/AAC (--extract-audio --audio-format m4a); допишите URL и ключи вывода.',
    fullLine: 'yt-dlp --extract-audio --audio-format m4a '
  },
  {
    tool: 'yt-dlp',
    token: '· no-mark-watched -F',
    summary: 'Не отмечать видео просмотренным на платформе (--no-mark-watched -F); допишите URL.',
    fullLine: 'yt-dlp --no-mark-watched -F '
  },
  {
    tool: 'yt-dlp',
    token: '· no-write-comments -F',
    summary: 'Не сохранять JSON комментариев (--no-write-comments -F); допишите URL.',
    fullLine: 'yt-dlp --no-write-comments -F '
  },
  {
    tool: 'yt-dlp',
    token: '· no-write-description -F',
    summary: 'Не сохранять .description рядом с файлом (--no-write-description -F); допишите URL.',
    fullLine: 'yt-dlp --no-write-description -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo MY -F',
    summary: 'Гео-обход с кодом страны MY (--geo-bypass-country MY -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo SG -F',
    summary: 'Гео-обход с кодом страны SG (--geo-bypass-country SG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo TH -F',
    summary: 'Гео-обход с кодом страны TH (--geo-bypass-country TH -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo VN -F',
    summary: 'Гео-обход с кодом страны VN (--geo-bypass-country VN -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country VN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo AR -F',
    summary: 'Гео-обход с кодом страны AR (--geo-bypass-country AR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo UA -F',
    summary: 'Гео-обход с кодом страны UA (--geo-bypass-country UA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country UA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo PH -F',
    summary: 'Гео-обход с кодом страны PH (--geo-bypass-country PH -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo ID -F',
    summary: 'Гео-обход с кодом страны ID (--geo-bypass-country ID -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country ID -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo PK -F',
    summary: 'Гео-обход с кодом страны PK (--geo-bypass-country PK -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo BD -F',
    summary: 'Гео-обход с кодом страны BD (--geo-bypass-country BD -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo EG -F',
    summary: 'Гео-обход с кодом страны EG (--geo-bypass-country EG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country EG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo CL -F',
    summary: 'Гео-обход с кодом страны CL (--geo-bypass-country CL -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo PE -F',
    summary: 'Гео-обход с кодом страны PE (--geo-bypass-country PE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo KE -F',
    summary: 'Гео-обход с кодом страны KE (--geo-bypass-country KE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country KE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo CO -F',
    summary: 'Гео-обход с кодом страны CO (--geo-bypass-country CO -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo NG -F',
    summary: 'Гео-обход с кодом страны NG (--geo-bypass-country NG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country NG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· extractor-args generic noplaylist -F',
    summary: 'Generic extractor: не разворачивать плейлист (--extractor-args generic:noplaylist -F); допишите URL.',
    fullLine: 'yt-dlp --extractor-args generic:noplaylist -F '
  },
  {
    tool: 'yt-dlp',
    token: '· skip-pl-err 10 -F',
    summary: 'Пропустить до 10 ошибок подряд в плейлисте (--skip-playlist-after-errors 10 -F); допишите URL плейлиста.',
    fullLine: 'yt-dlp --skip-playlist-after-errors 10 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· retries 15 -F',
    summary: 'Больше повторов HTTP (--retries 15 -F); нестабильные CDN; допишите URL.',
    fullLine: 'yt-dlp --retries 15 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· fragment-retries 15 -F',
    summary: 'Повторы для обрывов фрагментов HLS/DASH (--fragment-retries 15 -F); допишите URL.',
    fullLine: 'yt-dlp --fragment-retries 15 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· bidi-workaround -F',
    summary: 'Обход багов RTL/BiDi в именах/метаданных (--bidi-workaround -F); допишите URL.',
    fullLine: 'yt-dlp --bidi-workaround -F '
  },
  {
    tool: 'yt-dlp',
    token: '· daterange wide -F',
    summary: 'Ограничить по дате загрузки/релиза (--daterange 20000101-20991231 -F); подстройте диапазон; допишите URL.',
    fullLine: 'yt-dlp --daterange 20000101-20991231 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· playlist-start 2 -F',
    summary: 'Плейлист начиная со 2-го элемента (--playlist-start 2 -F); допишите URL плейлиста.',
    fullLine: 'yt-dlp --playlist-start 2 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo SK -F',
    summary: 'Гео-обход с кодом страны SK (--geo-bypass-country SK -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo SI -F',
    summary: 'Гео-обход с кодом страны SI (--geo-bypass-country SI -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo LU -F',
    summary: 'Гео-обход с кодом страны LU (--geo-bypass-country LU -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country LU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo MT -F',
    summary: 'Гео-обход с кодом страны MT (--geo-bypass-country MT -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo CY -F',
    summary: 'Гео-обход с кодом страны CY (--geo-bypass-country CY -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo BA -F',
    summary: 'Гео-обход с кодом страны BA (--geo-bypass-country BA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo RS -F',
    summary: 'Гео-обход с кодом страны RS (--geo-bypass-country RS -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country RS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo MN -F',
    summary: 'Гео-обход с кодом страны MN (--geo-bypass-country MN -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo KZ -F',
    summary: 'Гео-обход с кодом страны KZ (--geo-bypass-country KZ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country KZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo GE -F',
    summary: 'Гео-обход с кодом страны GE (--geo-bypass-country GE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo AM -F',
    summary: 'Гео-обход с кодом страны AM (--geo-bypass-country AM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo AZ -F',
    summary: 'Гео-обход с кодом страны AZ (--geo-bypass-country AZ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo IQ -F',
    summary: 'Гео-обход с кодом страны IQ (--geo-bypass-country IQ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country IQ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo LK -F',
    summary: 'Гео-обход с кодом страны LK (--geo-bypass-country LK -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country LK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo TN -F',
    summary: 'Гео-обход с кодом страны TN (--geo-bypass-country TN -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo MA -F',
    summary: 'Гео-обход с кодом страны MA (--geo-bypass-country MA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo DZ -F',
    summary: 'Гео-обход с кодом страны DZ (--geo-bypass-country DZ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country DZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo GH -F',
    summary: 'Гео-обход с кодом страны GH (--geo-bypass-country GH -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo ET -F',
    summary: 'Гео-обход с кодом страны ET (--geo-bypass-country ET -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country ET -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo UY -F',
    summary: 'Гео-обход с кодом страны UY (--geo-bypass-country UY -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country UY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo BO -F',
    summary: 'Гео-обход с кодом страны BO (--geo-bypass-country BO -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo CR -F',
    summary: 'Гео-обход с кодом страны CR (--geo-bypass-country CR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo PA -F',
    summary: 'Гео-обход с кодом страны PA (--geo-bypass-country PA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· downloader ffmpeg -F',
    summary: 'Явно качать через встроенный ffmpeg-даунлоадер (--downloader ffmpeg -F); HLS/DASH; допишите URL.',
    fullLine: 'yt-dlp --downloader ffmpeg -F '
  },
  {
    tool: 'yt-dlp',
    token: '· downloader aria2c -F',
    summary: 'Внешний aria2c как даунлоадер (--downloader aria2c -F; нужен aria2c в PATH); допишите URL.',
    fullLine: 'yt-dlp --downloader aria2c -F '
  },
  {
    tool: 'yt-dlp',
    token: '· no-wait-for-video -F',
    summary: 'Не ждать появления трансляции (--no-wait-for-video -F); быстрый -F для стримов; допишите URL.',
    fullLine: 'yt-dlp --no-wait-for-video -F '
  },
  {
    tool: 'yt-dlp',
    token: '· verbose -F',
    summary: 'Подробный лог yt-dlp при списке форматов (--verbose -F); диагностика extractor; допишите URL.',
    fullLine: 'yt-dlp --verbose -F '
  },
  {
    tool: 'yt-dlp',
    token: '· trim-filenames -F',
    summary: 'Обрезать слишком длинные имена файлов (--trim-filenames 180 -F); NAS/Windows MAX_PATH; допишите URL.',
    fullLine: 'yt-dlp --trim-filenames 180 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· hls-split-discontinuity -F',
    summary: 'HLS: резать плейлист по discontinuity (--hls-split-discontinuity -F); стабильнее TS-сегменты; допишите URL.',
    fullLine: 'yt-dlp --hls-split-discontinuity -F '
  },
  {
    tool: 'yt-dlp',
    token: '· dynamic-mpd-buffer -F',
    summary: 'DASH: буфер динамического MPD в секундах (--dynamic-mpd-buffer-size 100 -F); живые манифесты; допишите URL.',
    fullLine: 'yt-dlp --dynamic-mpd-buffer-size 100 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· no-write-pages -F',
    summary: 'Не сохранять сырые HTML-страницы extractor (--no-write-pages -F); чище диск при -F; допишите URL.',
    fullLine: 'yt-dlp --no-write-pages -F '
  },
  {
    tool: 'yt-dlp',
    token: '· socket-timeout 120 -F',
    summary: 'Таймаут сокета 120 с (--socket-timeout 120 -F); очень медленные CDN/прокси; допишите URL.',
    fullLine: 'yt-dlp --socket-timeout 120 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· -S 1080 av1 -F',
    summary: 'Сортировка форматов: приоритет ~1080p и AV1 (-S +res:1080,+codec:av01 -F); подстройте res/codec; допишите URL.',
    fullLine: 'yt-dlp -S +res:1080,+codec:av01 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· -S br5M 720p -F',
    summary: 'Сортировка: битрейт ~5 Mbit/s и около 720p (-S +br:5000000,+res:720 -F); диагностика выбора -f; допишите URL.',
    fullLine: 'yt-dlp -S +br:5000000,+res:720 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· hide-progress -F',
    summary: 'Список форматов без прогресс-бара (--hide-progress -F); чище лог в терминале; допишите URL.',
    fullLine: 'yt-dlp --hide-progress -F '
  },
  {
    tool: 'yt-dlp',
    token: '· playlist last -F',
    summary: 'Только последний элемент плейлиста + -F (--playlist-items -1 -F); хвост плейлиста без полного разбора; допишите URL.',
    fullLine: 'yt-dlp --playlist-items -1 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print genres',
    summary: 'Жанры/теги без скачивания (--skip-download --print genres); музыка/каталоги; допишите URL.',
    fullLine: 'yt-dlp --skip-download --print genres '
  },
  {
    tool: 'yt-dlp',
    token: '· print cast',
    summary: 'Участники/акты без скачивания (--skip-download --print cast); если отдаёт площадка; допишите URL.',
    fullLine: 'yt-dlp --skip-download --print cast '
  },
  {
    tool: 'yt-dlp',
    token: '· playlist mid slice -F',
    summary: 'Фрагмент плейлиста: только элементы 2…4 (--playlist-items 2:4 -F); середина без начала/конца; допишите URL плейлиста.',
    fullLine: 'yt-dlp --playlist-items 2:4 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· ppa FFmpeg threads -F',
    summary: 'Передать ffmpeg в postprocessor один поток (--ppa FFmpeg:-threads:1 -F); без кавычек в argv; допишите URL.',
    fullLine: 'yt-dlp --ppa FFmpeg:-threads:1 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· yes-playlist -F',
    summary: 'Явно развернуть плейлист и показать форматы (--yes-playlist -F); когда URL выглядит как один ролик, но это плейлист; допишите URL.',
    fullLine: 'yt-dlp --yes-playlist -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo AD -F',
    summary: 'Гео-обход через Андорру (--geo-bypass-country AD -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo MC -F',
    summary: 'Гео-обход через Монако (--geo-bypass-country MC -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo LI -F',
    summary: 'Гео-обход через Лихтенштейн (--geo-bypass-country LI -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country LI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo SM -F',
    summary: 'Гео-обход через Сан-Марино (--geo-bypass-country SM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo VA -F',
    summary: 'Гео-обход через Ватикан (--geo-bypass-country VA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country VA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo GI -F',
    summary: 'Гео-обход через Гибралтар (--geo-bypass-country GI -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo JE -F',
    summary: 'Гео-обход через Джерси (--geo-bypass-country JE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country JE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo GG -F',
    summary: 'Гео-обход через Гернси (--geo-bypass-country GG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo IM -F',
    summary: 'Гео-обход через Остров Мэн (--geo-bypass-country IM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country IM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo FO -F',
    summary: 'Гео-обход через Фарерские острова (--geo-bypass-country FO -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country FO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo GL -F',
    summary: 'Гео-обход через Гренландию (--geo-bypass-country GL -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· check-all-urls -F',
    summary: 'Проверить все HTTP-URL фрагментов перед загрузкой (--check-all-urls -F); диагностика 403/410 на HLS/DASH; допишите URL.',
    fullLine: 'yt-dlp --check-all-urls -F '
  },
  {
    tool: 'yt-dlp',
    token: '· no-windows-filenames -F',
    summary: 'Отключить санитизацию имён под Windows (--no-windows-filenames -F); как в POSIX-шаблонах -o; допишите URL.',
    fullLine: 'yt-dlp --no-windows-filenames -F '
  },
  {
    tool: 'yt-dlp',
    token: '· replace-meta title -F',
    summary: 'Замена в метаданных до имени файла (--replace-in-metadata title,_,- — подчёркивание → дефис); допишите URL.',
    fullLine: 'yt-dlp --replace-in-metadata title,_,- -F '
  },
  {
    tool: 'yt-dlp',
    token: '· no-playlist simulate',
    summary: 'Сухой прогон одного ролика из URL-плейлиста (--no-playlist --simulate); без файлов; допишите URL.',
    fullLine: 'yt-dlp --no-playlist --simulate '
  },
  {
    tool: 'yt-dlp',
    token: '· print dislike_count',
    summary: 'Счётчик дизлайков без скачивания (--skip-download --print dislike_count; часто NA); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print dislike_count '
  },
  {
    tool: 'yt-dlp',
    token: '· flat-pl skip print dur',
    summary: 'Плоский плейлист: длительность каждого элемента без глубокого извлечения (--flat-playlist --skip-download --print duration); допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist --skip-download --print duration '
  },
  {
    tool: 'yt-dlp',
    token: '· list extr descr',
    summary: 'Имена и краткие описания extractors без URL (--list-extractor-descriptions); справка по поддерживаемым сайтам.',
    fullLine: 'yt-dlp --list-extractor-descriptions'
  },
  {
    tool: 'yt-dlp',
    token: '· print traffic -F',
    summary: 'Печать HTTP/TLS трафика в stderr (--print-traffic -F); тяжёлый лог, только диагностика; допишите URL.',
    fullLine: 'yt-dlp --print-traffic -F '
  },
  {
    tool: 'yt-dlp',
    token: '· audio vorbis',
    summary: 'Извлечь аудио в Ogg Vorbis (--extract-audio --audio-format vorbis); допишите URL и шаблон -o при необходимости.',
    fullLine: 'yt-dlp --extract-audio --audio-format vorbis '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file id',
    summary: 'Записать id ролика в flux-ytdlp-id.txt без скачивания (--print-to-file id …); допишите URL.',
    fullLine: 'yt-dlp --print-to-file id flux-ytdlp-id.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· --no-update -F',
    summary: 'Запретить yt-dlp self-update даже если он включён (--no-update -F); фиксируем bundled-версию; допишите URL.',
    fullLine: 'yt-dlp --no-update -F '
  },
  {
    tool: 'yt-dlp',
    token: '· --no-color -F',
    summary: 'Лог без ANSI-цвета (--no-color -F); удобнее парсить или для CI; допишите URL.',
    fullLine: 'yt-dlp --no-color -F '
  },
  {
    tool: 'yt-dlp',
    token: '· --color always -F',
    summary: 'Принудительно ANSI-цвет в логе (--color always -F); даже когда stdout не TTY; допишите URL.',
    fullLine: 'yt-dlp --color always -F '
  },
  {
    tool: 'yt-dlp',
    token: '· allow-unplayable -F',
    summary: 'Разрешить «недостижимые» форматы в листинге (--allow-unplayable-formats -F); диагностика DRM/недоступного; допишите URL.',
    fullLine: 'yt-dlp --allow-unplayable-formats -F '
  },
  {
    tool: 'yt-dlp',
    token: '· audio alac',
    summary: 'Извлечь аудио в Apple Lossless (--extract-audio --audio-format alac); допишите URL и -o при необходимости.',
    fullLine: 'yt-dlp --extract-audio --audio-format alac '
  },
  {
    tool: 'yt-dlp',
    token: '· audio ac3',
    summary: 'Извлечь аудио в Dolby Digital AC-3 (--extract-audio --audio-format ac3); допишите URL.',
    fullLine: 'yt-dlp --extract-audio --audio-format ac3 '
  },
  {
    tool: 'yt-dlp',
    token: '· audio q0',
    summary: 'Извлечь аудио с максимальным качеством постпроцессора (--audio-quality 0 --extract-audio); допишите URL и -f при необходимости.',
    fullLine: 'yt-dlp --audio-quality 0 --extract-audio '
  },
  {
    tool: 'yt-dlp',
    token: '· ppa ffmpeg threads 1',
    summary: 'Аргументы постпроцессора ffmpeg (--postprocessor-args ffmpeg:-threads 1 -F); ограничить нагрузку при mux; допишите URL.',
    fullLine: 'yt-dlp --postprocessor-args ffmpeg:-threads 1 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo TW',
    summary: 'Гео-обход с кодом страны TW (--geo-bypass-country TW -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo MD',
    summary: 'Гео-обход с кодом страны MD (--geo-bypass-country MD -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file pageurl',
    summary: 'Записать webpage_url в flux-ytdlp-pageurl.txt без скачивания (--print-to-file …); допишите URL.',
    fullLine: 'yt-dlp --print-to-file webpage_url flux-ytdlp-pageurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file durstr',
    summary: 'Записать duration_string в flux-ytdlp-durstr.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file duration_string flux-ytdlp-durstr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file uploader',
    summary: 'Записать uploader в flux-ytdlp-uploader.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file uploader flux-ytdlp-uploader.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file churl',
    summary: 'Записать channel_url в flux-ytdlp-churl.txt без скачивания; допишите URL ролика.',
    fullLine: 'yt-dlp --print-to-file channel_url flux-ytdlp-churl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· geo BY',
    summary: 'Гео-обход с кодом страны BY (--geo-bypass-country BY -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo AL',
    summary: 'Гео-обход с кодом страны AL (--geo-bypass-country AL -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo MK',
    summary: 'Гео-обход с кодом страны MK (--geo-bypass-country MK -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file views',
    summary: 'Записать view_count в flux-ytdlp-views.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file view_count flux-ytdlp-views.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file channel name',
    summary: 'Записать имя канала (поле channel) в flux-ytdlp-channel.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file channel flux-ytdlp-channel.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file extractor',
    summary: 'Записать имя extractor в flux-ytdlp-extractor.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file extractor flux-ytdlp-extractor.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file pltitle',
    summary: 'Записать playlist_title в flux-ytdlp-pltitle.txt без скачивания; допишите URL плейлиста.',
    fullLine: 'yt-dlp --print-to-file playlist_title flux-ytdlp-pltitle.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file uploaddate',
    summary: 'Записать upload_date в flux-ytdlp-update.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file upload_date flux-ytdlp-update.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· geo ME',
    summary: 'Гео-обход с кодом страны ME (--geo-bypass-country ME -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country ME -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo PS',
    summary: 'Гео-обход с кодом страны PS (--geo-bypass-country PS -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo TL',
    summary: 'Гео-обход с кодом страны TL (--geo-bypass-country TL -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· extract-audio wma',
    summary: 'Извлечь аудио в WMA (--extract-audio --audio-format wma); допишите URL и шаблон -o при необходимости.',
    fullLine: 'yt-dlp --extract-audio --audio-format wma '
  },
  {
    tool: 'yt-dlp',
    token: '· no-abort-on-error -F',
    summary: 'Плейлист: продолжать после ошибки отдельного URL (--no-abort-on-error -F); допишите URL.',
    fullLine: 'yt-dlp --no-abort-on-error -F '
  },
  {
    tool: 'yt-dlp',
    token: '· no-restrict-filenames -F',
    summary: 'Не ограничивать имена файлов ASCII (--no-restrict-filenames -F); кириллица в -o; допишите URL.',
    fullLine: 'yt-dlp --no-restrict-filenames -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo PR',
    summary: 'Гео-обход с кодом страны PR (--geo-bypass-country PR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo GU',
    summary: 'Гео-обход с кодом страны GU (--geo-bypass-country GU -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo VI',
    summary: 'Гео-обход с кодом страны VI (--geo-bypass-country VI -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country VI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo AS',
    summary: 'Гео-обход с кодом страны AS (--geo-bypass-country AS -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo MP',
    summary: 'Гео-обход с кодом страны MP (--geo-bypass-country MP -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MP -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo UM',
    summary: 'Гео-обход с кодом страны UM (--geo-bypass-country UM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country UM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file description',
    summary: 'Записать поле description в flux-ytdlp-desc.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file description flux-ytdlp-desc.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file filename field',
    summary: 'Записать шаблон filename (поле метаданных) в flux-ytdlp-fn.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file filename flux-ytdlp-fn.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· no-prefer-free -F',
    summary: 'Список форматов без приоритета «свободных» кодеков (--no-prefer-free-formats -F); контраст к --prefer-free-formats; допишите URL.',
    fullLine: 'yt-dlp --no-prefer-free-formats -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file categories',
    summary: 'Записать поле categories в flux-ytdlp-categories.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file categories flux-ytdlp-categories.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file tags',
    summary: 'Записать поле tags в flux-ytdlp-tags.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file tags flux-ytdlp-tags.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file language',
    summary: 'Записать поле language в flux-ytdlp-language.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file language flux-ytdlp-language.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file autocap',
    summary: 'Записать automatic_captions в flux-ytdlp-autocap.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file automatic_captions flux-ytdlp-autocap.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file chapters',
    summary: 'Записать поле chapters в flux-ytdlp-chapters.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file chapters flux-ytdlp-chapters.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file acodec',
    summary: 'Записать выбранный/лучший аудиокодек (acodec) в flux-ytdlp-acodec.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file acodec flux-ytdlp-acodec.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file vcodec',
    summary: 'Записать выбранный/лучший видеокодек (vcodec) в flux-ytdlp-vcodec.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file vcodec flux-ytdlp-vcodec.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file likes',
    summary: 'Записать like_count в flux-ytdlp-likes.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file like_count flux-ytdlp-likes.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file duration num',
    summary: 'Записать duration (секунды, число) в flux-ytdlp-duration.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file duration flux-ytdlp-duration.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file subtitles',
    summary: 'Записать поле subtitles (словари дорожек) в flux-ytdlp-subs.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file subtitles flux-ytdlp-subs.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file chid',
    summary: 'Записать channel_id в flux-ytdlp-chid.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file channel_id flux-ytdlp-chid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file plid',
    summary: 'Записать playlist_id в flux-ytdlp-plid.txt без скачивания; допишите URL плейлиста.',
    fullLine: 'yt-dlp --print-to-file playlist_id flux-ytdlp-plid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file heatmap',
    summary: 'Записать heatmap (если extractor отдаёт, напр. YouTube) в flux-ytdlp-heatmap.txt; допишите URL.',
    fullLine: 'yt-dlp --print-to-file heatmap flux-ytdlp-heatmap.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· lazy-pl -F',
    summary: 'Ленивый плейлист вместе с листингом форматов (--lazy-playlist -F); не разворачивает все элементы заранее; допишите URL.',
    fullLine: 'yt-dlp --lazy-playlist -F '
  },
  {
    tool: 'yt-dlp',
    token: '· no-continue -F',
    summary: 'Листинг форматов без дозагрузки частичных .part (--no-continue -F); при скачивании начать заново; допишите URL.',
    fullLine: 'yt-dlp --no-continue -F '
  },
  {
    tool: 'yt-dlp',
    token: '· no-pl-reverse -F',
    summary: 'Не переворачивать порядок плейлиста extractor (--no-playlist-reverse -F); совместимость с плейлистами; допишите URL.',
    fullLine: 'yt-dlp --no-playlist-reverse -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file ccount',
    summary: 'Записать comment_count в flux-ytdlp-ccount.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file comment_count flux-ytdlp-ccount.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file wubase',
    summary: 'Записать webpage_url_basename в flux-ytdlp-wubase.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file webpage_url_basename flux-ytdlp-wubase.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file dispid',
    summary: 'Записать display_id в flux-ytdlp-dispid.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file display_id flux-ytdlp-dispid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file thumb field',
    summary: 'Записать поле thumbnail (URL обложки) в flux-ytdlp-thumburl.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file thumbnail flux-ytdlp-thumburl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file rel_ts',
    summary: 'Записать release_timestamp (UNIX, если extractor отдаёт) в flux-ytdlp-reltsepoch.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file release_timestamp flux-ytdlp-reltsepoch.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file filepath',
    summary: 'Записать filepath (после -o) в flux-ytdlp-fpath.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file filepath flux-ytdlp-fpath.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file resolution',
    summary: 'Записать resolution (строка разрешения) в flux-ytdlp-res.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file resolution flux-ytdlp-res.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file format_id',
    summary: 'Записать format_id в flux-ytdlp-fmtid.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file format_id flux-ytdlp-fmtid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file ext',
    summary: 'Записать ext (расширение выбранного формата) в flux-ytdlp-ext.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file ext flux-ytdlp-ext.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· geo BM -F',
    summary: 'Гео-обход через Бермуды (--geo-bypass-country BM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo KY -F',
    summary: 'Гео-обход через Каймановы острова (--geo-bypass-country KY -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country KY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo JM -F',
    summary: 'Гео-обход через Ямайку (--geo-bypass-country JM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country JM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo BB -F',
    summary: 'Гео-обход через Барбадос (--geo-bypass-country BB -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BB -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo BS -F',
    summary: 'Гео-обход через Багамы (--geo-bypass-country BS -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file width',
    summary: 'Записать ширину выбранного формата (width) в flux-ytdlp-width.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file width flux-ytdlp-width.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file height',
    summary: 'Записать высоту выбранного формата (height) в flux-ytdlp-height.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file height flux-ytdlp-height.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file fps',
    summary: 'Записать fps выбранного формата в flux-ytdlp-fps.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file fps flux-ytdlp-fps.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file tbr',
    summary: 'Записать суммарный битрейт (tbr, kbps) в flux-ytdlp-tbr.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file tbr flux-ytdlp-tbr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file fsize',
    summary: 'Записать filesize_approx в flux-ytdlp-fsize.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file filesize_approx flux-ytdlp-fsize.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file protocol',
    summary: 'Записать protocol выбранного формата (https/m3u8/…) в flux-ytdlp-proto.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file protocol flux-ytdlp-proto.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· reject-title -F',
    summary: 'Исключить элементы плейлиста по подстроке заголовка (--reject-title trailer -F); подстройте шаблон; допишите URL.',
    fullLine: 'yt-dlp --reject-title trailer -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo LC -F',
    summary: 'Гео-обход через Сент-Люсию (--geo-bypass-country LC -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country LC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo GD -F',
    summary: 'Гео-обход через Гренаду (--geo-bypass-country GD -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo VC -F',
    summary: 'Гео-обход через Сент-Винсент и Гренадины (--geo-bypass-country VC -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country VC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo KN -F',
    summary: 'Гео-обход через Сент-Китс и Невис (--geo-bypass-country KN -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country KN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo DM -F',
    summary: 'Гео-обход через Доминику (--geo-bypass-country DM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country DM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file plidx',
    summary: 'Записать индекс в плейлисте (playlist_index) в flux-ytdlp-plidx.txt без скачивания; допишите URL плейлиста.',
    fullLine: 'yt-dlp --print-to-file playlist_index flux-ytdlp-plidx.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file plauto',
    summary: 'Записать авто-нумерацию плейлиста (playlist_autonumber) в flux-ytdlp-plauto.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file playlist_autonumber flux-ytdlp-plauto.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file plcount',
    summary: 'Записать число элементов плейлиста (playlist_count) в flux-ytdlp-plcount.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file playlist_count flux-ytdlp-plcount.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file plupid',
    summary: 'Записать playlist_uploader_id в flux-ytdlp-plupid.txt без скачивания; допишите URL плейлиста.',
    fullLine: 'yt-dlp --print-to-file playlist_uploader_id flux-ytdlp-plupid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file upid',
    summary: 'Записать uploader_id в flux-ytdlp-upid.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file uploader_id flux-ytdlp-upid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file rating',
    summary: 'Записать average_rating в flux-ytdlp-rating.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file average_rating flux-ytdlp-rating.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file avail',
    summary: 'Записать availability (public/private/unlisted и т.п.) в flux-ytdlp-avail.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file availability flux-ytdlp-avail.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file age',
    summary: 'Записать age_limit в flux-ytdlp-age.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file age_limit flux-ytdlp-age.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· geo AW -F',
    summary: 'Гео-обход через Арубу (--geo-bypass-country AW -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo CW -F',
    summary: 'Гео-обход через Кюрасао (--geo-bypass-country CW -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo SX -F',
    summary: 'Гео-обход через Синт-Мартен (--geo-bypass-country SX -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SX -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo TC -F',
    summary: 'Гео-обход через острова Тёркс и Кайкос (--geo-bypass-country TC -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo VG -F',
    summary: 'Гео-обход через Виргинские острова (Великобритания) (--geo-bypass-country VG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country VG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file wudom',
    summary: 'Записать webpage_url_domain в flux-ytdlp-wudom.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file webpage_url_domain flux-ytdlp-wudom.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file ourl',
    summary: 'Записать original_url (исходный запрос до редиректов) в flux-ytdlp-ourl.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file original_url flux-ytdlp-ourl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file abr',
    summary: 'Записать abr выбранного формата (аудио kbps) в flux-ytdlp-abr.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file abr flux-ytdlp-abr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file vbr',
    summary: 'Записать vbr выбранного формата (видео kbps) в flux-ytdlp-vbr.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file vbr flux-ytdlp-vbr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file fsz',
    summary: 'Записать filesize (байты, если известен) в flux-ytdlp-fszb.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file filesize flux-ytdlp-fszb.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file fnote',
    summary: 'Записать format_note выбранного формата в flux-ytdlp-fnote.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file format_note flux-ytdlp-fnote.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file plup',
    summary: 'Записать playlist_uploader (имя автора плейлиста) в flux-ytdlp-plup.txt без скачивания; допишите URL плейлиста.',
    fullLine: 'yt-dlp --print-to-file playlist_uploader flux-ytdlp-plup.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· geo AG -F',
    summary: 'Гео-обход через Антигуа и Барбуду (--geo-bypass-country AG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo MS -F',
    summary: 'Гео-обход через Монтсеррат (--geo-bypass-country MS -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo AI -F',
    summary: 'Гео-обход через Ангилью (--geo-bypass-country AI -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo GP -F',
    summary: 'Гео-обход через Гваделупу (--geo-bypass-country GP -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GP -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo BQ -F',
    summary: 'Гео-обход через Bonaire/Sint Eustatius/Saba (--geo-bypass-country BQ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BQ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· max-dls -F',
    summary: 'Остановка после N загрузок из плейлиста (--max-downloads 5 -F); подстройте число; допишите URL.',
    fullLine: 'yt-dlp --max-downloads 5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· pl-random -F',
    summary: 'Случайный порядок элементов плейлиста перед -F (--playlist-random -F); допишите URL плейлиста.',
    fullLine: 'yt-dlp --playlist-random -F '
  },
  {
    tool: 'yt-dlp',
    token: '· force-over -F',
    summary: 'Перезапись существующих файлов без вопросов (--force-overwrites -F); допишите URL.',
    fullLine: 'yt-dlp --force-overwrites -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file fulltitle',
    summary: 'Записать fulltitle в flux-ytdlp-fulltitle.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file fulltitle flux-ytdlp-fulltitle.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file alttitle',
    summary: 'Записать alt_title в flux-ytdlp-alttitle.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file alt_title flux-ytdlp-alttitle.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file artist',
    summary: 'Записать artist в flux-ytdlp-artist.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file artist flux-ytdlp-artist.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file album',
    summary: 'Записать album в flux-ytdlp-album.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file album flux-ytdlp-album.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file relyear',
    summary: 'Записать release_year в flux-ytdlp-relyear.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file release_year flux-ytdlp-relyear.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file is_live',
    summary: 'Записать is_live в flux-ytdlp-islive.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file is_live flux-ytdlp-islive.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file live_stat',
    summary: 'Записать live_status в flux-ytdlp-livestat.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file live_status flux-ytdlp-livestat.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file chfol',
    summary: 'Записать channel_follower_count в flux-ytdlp-chfol.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file channel_follower_count flux-ytdlp-chfol.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· geo CK -F',
    summary: 'Гео-обход через Острова Кука (--geo-bypass-country CK -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo NU -F',
    summary: 'Гео-обход через Ниуэ (--geo-bypass-country NU -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country NU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo TK -F',
    summary: 'Гео-обход через Токелау (--geo-bypass-country TK -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo TO -F',
    summary: 'Гео-обход через Тонга (--geo-bypass-country TO -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo WS -F',
    summary: 'Гео-обход через Самоа (--geo-bypass-country WS -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country WS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· skip-unavail -F',
    summary: 'DASH/HLS: пропускать недоступные фрагменты вместо фатала (--skip-unavailable-fragments -F); допишите URL.',
    fullLine: 'yt-dlp --skip-unavailable-fragments -F '
  },
  {
    tool: 'yt-dlp',
    token: '· abort-on-err -F',
    summary: 'Остановка при первой фатальной ошибке (--abort-on-error -F); допишите URL плейлиста при необходимости.',
    fullLine: 'yt-dlp --abort-on-error -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file series',
    summary: 'Записать series (шоу) в flux-ytdlp-series.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file series flux-ytdlp-series.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file snum',
    summary: 'Записать season_number в flux-ytdlp-snum.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file season_number flux-ytdlp-snum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file epnum',
    summary: 'Записать episode_number в flux-ytdlp-epnum.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file episode_number flux-ytdlp-epnum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file epstr',
    summary: 'Записать episode (строка площадки) в flux-ytdlp-epstr.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file episode flux-ytdlp-epstr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file epid',
    summary: 'Записать episode_id в flux-ytdlp-epid.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file episode_id flux-ytdlp-epid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file sid',
    summary: 'Записать season_id в flux-ytdlp-sid.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file season_id flux-ytdlp-sid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file plchid',
    summary: 'Записать playlist_channel_id в flux-ytdlp-plchid.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file playlist_channel_id flux-ytdlp-plchid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file asr',
    summary: 'Записать asr (Hz дискретизации аудио) в flux-ytdlp-asr.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file asr flux-ytdlp-asr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file drm',
    summary: 'Записать has_drm в flux-ytdlp-drm.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file has_drm flux-ytdlp-drm.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file embed',
    summary: 'Записать playable_in_embed в flux-ytdlp-embed.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file playable_in_embed flux-ytdlp-embed.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file waslive',
    summary: 'Записать was_live в flux-ytdlp-waslive.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file was_live flux-ytdlp-waslive.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file mtype',
    summary: 'Записать media_type в flux-ytdlp-mtype.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file media_type flux-ytdlp-mtype.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· geo PF -F',
    summary: 'Гео-обход через Французскую Полинезию (--geo-bypass-country PF -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo NC -F',
    summary: 'Гео-обход через Новую Каледонию (--geo-bypass-country NC -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country NC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo FJ -F',
    summary: 'Гео-обход через Фиджи (--geo-bypass-country FJ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country FJ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo VU -F',
    summary: 'Гео-обход через Вануату (--geo-bypass-country VU -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country VU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo SB -F',
    summary: 'Гео-обход через Соломоновы острова (--geo-bypass-country SB -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SB -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo FM -F',
    summary: 'Гео-обход через Федеративные Штаты Микронезии (--geo-bypass-country FM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country FM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo MH -F',
    summary: 'Гео-обход через Маршалловы острова (--geo-bypass-country MH -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo PW -F',
    summary: 'Гео-обход через Палау (--geo-bypass-country PW -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· no-brk-reject -F',
    summary: 'Не останавливаться на отклонённом формате (--no-break-on-reject -F); допишите URL.',
    fullLine: 'yt-dlp --no-break-on-reject -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file otype',
    summary: 'Записать тип объекта (_type: video/playlist и т.п.) в flux-ytdlp-otype.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file _type flux-ytdlp-otype.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file plurl',
    summary: 'Записать playlist_url в flux-ytdlp-plurl.txt без скачивания; допишите URL плейлиста.',
    fullLine: 'yt-dlp --print-to-file playlist_url flux-ytdlp-plurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file manurl',
    summary: 'Записать manifest_url (HLS/DASH и др.) в flux-ytdlp-manurl.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file manifest_url flux-ytdlp-manurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file sarfix',
    summary: 'Записать stretched_ratio (анаморф/растяжение, если extractor отдаёт) в flux-ytdlp-sarfix.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file stretched_ratio flux-ytdlp-sarfix.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file reqf',
    summary: 'Записать requested_formats (JSON выбранных потоков) в flux-ytdlp-reqf.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file requested_formats flux-ytdlp-reqf.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· geo NR -F',
    summary: 'Гео-обход через Науру (--geo-bypass-country NR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country NR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo TV -F',
    summary: 'Гео-обход через Тувалу (--geo-bypass-country TV -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo KI -F',
    summary: 'Гео-обход через Кирибати (--geo-bypass-country KI -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country KI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo WF -F',
    summary: 'Гео-обход через Уоллис и Футуна (--geo-bypass-country WF -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country WF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· prog-delta -F',
    summary: 'Реже обновлять строку прогресса (--progress-delta 5 -F); меньше шума в логе при -F/длинных списках; допишите URL.',
    fullLine: 'yt-dlp --progress-delta 5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file formats',
    summary: 'Записать список форматов (JSON/текст extractor) в flux-ytdlp-formats.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file formats flux-ytdlp-formats.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file url',
    summary: 'Записать прямой URL выбранного формата в flux-ytdlp-url.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file url flux-ytdlp-url.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file thumbs',
    summary: 'Записать словарь thumbnails (URL превью разных размеров) в flux-ytdlp-thumbs.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file thumbnails flux-ytdlp-thumbs.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file locmeta',
    summary: 'Записать поле location (гео/локация из метаданных площадки) в flux-ytdlp-locmeta.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file location flux-ytdlp-locmeta.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· geo AX -F',
    summary: 'Гео-обход через Аландские острова (--geo-bypass-country AX -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AX -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo SJ -F',
    summary: 'Гео-обход через Шпицберген и Ян-Майен (--geo-bypass-country SJ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SJ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo SH -F',
    summary: 'Гео-обход через остров Святой Елены (--geo-bypass-country SH -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· xattr-fsize -F',
    summary: 'Писать ожидаемый размер файла в xattr где поддерживается ОС (--xattr-set-filesize -F); допишите URL.',
    fullLine: 'yt-dlp --xattr-set-filesize -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file epoch',
    summary: 'Записать epoch (время публикации в UNIX, если extractor отдаёт) в flux-ytdlp-epoch.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file epoch flux-ytdlp-epoch.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file reqsubs',
    summary: 'Записать requested_subtitles (JSON выбранных субтитров) в flux-ytdlp-reqsubs.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file requested_subtitles flux-ytdlp-reqsubs.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file plch',
    summary: 'Записать playlist_channel (имя канала плейлиста) в flux-ytdlp-plch.txt без скачивания; допишите URL плейлиста.',
    fullLine: 'yt-dlp --print-to-file playlist_channel flux-ytdlp-plch.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file nent',
    summary: 'Записать n_entries (число элементов плейлиста) в flux-ytdlp-nent.txt без скачивания; допишите URL плейлиста.',
    fullLine: 'yt-dlp --print-to-file n_entries flux-ytdlp-nent.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file dislikes',
    summary: 'Записать dislike_count в flux-ytdlp-dislikes.txt без скачивания (часто NA); допишите URL.',
    fullLine: 'yt-dlp --print-to-file dislike_count flux-ytdlp-dislikes.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· no-pl-metafiles -F',
    summary: 'Не писать .info.json/.description рядом с плейлистом (--no-playlist-metafiles -F); допишите URL плейлиста.',
    fullLine: 'yt-dlp --no-playlist-metafiles -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo BV -F',
    summary: 'Гео-обход через остров Буве (--geo-bypass-country BV -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo TF -F',
    summary: 'Гео-обход через Французские Южные и Антарктические территории (--geo-bypass-country TF -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo HM -F',
    summary: 'Гео-обход через остров Херд и острова Макдональд (--geo-bypass-country HM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country HM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo IO -F',
    summary: 'Гео-обход через Британскую территорию в Индийском океане (--geo-bypass-country IO -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country IO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo PN -F',
    summary: 'Гео-обход через Питкэрн (--geo-bypass-country PN -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo AQ -F',
    summary: 'Гео-обход через Антарктиду (--geo-bypass-country AQ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AQ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo GS -F',
    summary: 'Гео-обход через Южную Георгию и Южные Сандвичевы острова (--geo-bypass-country GS -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo PM -F',
    summary: 'Гео-обход через Сен-Пьер и Микелон (--geo-bypass-country PM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file reldate',
    summary: 'Записать release_date (YYYYMMDD) в flux-ytdlp-reldate.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file release_date flux-ytdlp-reldate.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file mts',
    summary: 'Записать modified_timestamp (Unix, если extractor отдаёт) в flux-ytdlp-mts.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file modified_timestamp flux-ytdlp-mts.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file upts',
    summary: 'Записать upload_timestamp (Unix загрузки на площадку) в flux-ytdlp-upts.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file upload_timestamp flux-ytdlp-upts.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file aspect',
    summary: 'Записать aspect_ratio (строка площадки) в flux-ytdlp-aspect.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file aspect_ratio flux-ytdlp-aspect.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file epsort',
    summary: 'Записать episode_sort (сортировка эпизода в сериалах) в flux-ytdlp-epsort.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file episode_sort flux-ytdlp-epsort.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· geo FK -F',
    summary: 'Гео-обход через Фолклендские острова (--geo-bypass-country FK -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country FK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo EH -F',
    summary: 'Гео-обход через Западную Сахару (--geo-bypass-country EH -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country EH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo DJ -F',
    summary: 'Гео-обход через Джибути (--geo-bypass-country DJ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country DJ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo KG -F',
    summary: 'Гео-обход через Киргизию (--geo-bypass-country KG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country KG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo TJ -F',
    summary: 'Гео-обход через Таджикистан (--geo-bypass-country TJ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TJ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo NP -F',
    summary: 'Гео-обход через Непал (--geo-bypass-country NP -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country NP -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo LA -F',
    summary: 'Гео-обход через Лаос (--geo-bypass-country LA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country LA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo KH -F',
    summary: 'Гео-обход через Камбоджу (--geo-bypass-country KH -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country KH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo BN -F',
    summary: 'Гео-обход через Бруней (--geo-bypass-country BN -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file chverify',
    summary: 'Записать channel_is_verified (флаг верификации канала) в flux-ytdlp-chverify.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file channel_is_verified flux-ytdlp-chverify.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file private',
    summary: 'Записать is_private (признак приватного/ограниченного ролика) в flux-ytdlp-private.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file is_private flux-ytdlp-private.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file composers',
    summary: 'Записать composers (если extractor отдаёт) в flux-ytdlp-composers.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file composers flux-ytdlp-composers.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file creators',
    summary: 'Записать creators (если extractor отдаёт) в flux-ytdlp-creators.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file creators flux-ytdlp-creators.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file trknum',
    summary: 'Записать track_number (номер трека в каталоге) в flux-ytdlp-trknum.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file track_number flux-ytdlp-trknum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· geo MM -F',
    summary: 'Гео-обход через Мьянму (--geo-bypass-country MM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo BT -F',
    summary: 'Гео-обход через Бутан (--geo-bypass-country BT -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo MV -F',
    summary: 'Гео-обход через Мальдивы (--geo-bypass-country MV -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo MZ -F',
    summary: 'Гео-обход через Мозамбик (--geo-bypass-country MZ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo ZW -F',
    summary: 'Гео-обход через Зимбабве (--geo-bypass-country ZW -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country ZW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo BW -F',
    summary: 'Гео-обход через Ботсвану (--geo-bypass-country BW -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo NA -F',
    summary: 'Гео-обход через Намибию (--geo-bypass-country NA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country NA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo LS -F',
    summary: 'Гео-обход через Лесото (--geo-bypass-country LS -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country LS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo MW -F',
    summary: 'Гео-обход через Малави (--geo-bypass-country MW -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo SZ -F',
    summary: 'Гео-обход через Эсватини (--geo-bypass-country SZ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file genre',
    summary: 'Записать genre (жанр, если extractor отдаёт) в flux-ytdlp-genre.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file genre flux-ytdlp-genre.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file album_type',
    summary: 'Записать album_type (тип релиза: album/single и т.п.) в flux-ytdlp-albumtype.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file album_type flux-ytdlp-albumtype.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file license',
    summary: 'Записать license (лицензия/CC и т.п., если есть) в flux-ytdlp-license.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file license flux-ytdlp-license.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file track',
    summary: 'Записать track (номер трека как строка каталога) в flux-ytdlp-track.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file track flux-ytdlp-track.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file album_artist',
    summary: 'Записать album_artist (альбомный исполнитель) в flux-ytdlp-albumartist.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file album_artist flux-ytdlp-albumartist.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file comment',
    summary: 'Записать comment (комментарий/uploader comment) в flux-ytdlp-comment.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file comment flux-ytdlp-comment.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· geo TD -F',
    summary: 'Гео-обход через Чад (--geo-bypass-country TD -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo NE -F',
    summary: 'Гео-обход через Нигер (--geo-bypass-country NE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country NE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo ML -F',
    summary: 'Гео-обход через Мали (--geo-bypass-country ML -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country ML -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo SN -F',
    summary: 'Гео-обход через Сенегал (--geo-bypass-country SN -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo LY -F',
    summary: 'Гео-обход через Ливию (--geo-bypass-country LY -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country LY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo SO -F',
    summary: 'Гео-обход через Сомали (--geo-bypass-country SO -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo ER -F',
    summary: 'Гео-обход через Эритрею (--geo-bypass-country ER -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country ER -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo SS -F',
    summary: 'Гео-обход через Южный Судан (--geo-bypass-country SS -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo YE -F',
    summary: 'Гео-обход через Йемен (--geo-bypass-country YE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country YE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo MR -F',
    summary: 'Гео-обход через Мавританию (--geo-bypass-country MR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file lyrics',
    summary: 'Записать lyrics (текст песни, если extractor отдаёт) в flux-ytdlp-lyrics.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file lyrics flux-ytdlp-lyrics.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file disc_number',
    summary: 'Записать disc_number (номер диска в каталоге) в flux-ytdlp-discnum.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file disc_number flux-ytdlp-discnum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file publisher',
    summary: 'Записать publisher (издатель/лейбл, если есть) в flux-ytdlp-publisher.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file publisher flux-ytdlp-publisher.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file mood',
    summary: 'Записать mood (настроение/тег настроения, если extractor отдаёт) в flux-ytdlp-mood.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file mood flux-ytdlp-mood.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· geo CM -F',
    summary: 'Гео-обход через Камерун (--geo-bypass-country CM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo GA -F',
    summary: 'Гео-обход через Габон (--geo-bypass-country GA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo CG -F',
    summary: 'Гео-обход через Республику Конго (--geo-bypass-country CG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo CD -F',
    summary: 'Гео-обход через ДР Конго (--geo-bypass-country CD -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo CF -F',
    summary: 'Гео-обход через ЦАР (--geo-bypass-country CF -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo GQ -F',
    summary: 'Гео-обход через Экваториальную Гвинею (--geo-bypass-country GQ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GQ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo ST -F',
    summary: 'Гео-обход через Сан-Томе и Принсипи (--geo-bypass-country ST -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country ST -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo BI -F',
    summary: 'Гео-обход через Бурунди (--geo-bypass-country BI -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo RW -F',
    summary: 'Гео-обход через Руанду (--geo-bypass-country RW -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country RW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo UG -F',
    summary: 'Гео-обход через Уганду (--geo-bypass-country UG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country UG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo TZ -F',
    summary: 'Гео-обход через Танзанию (--geo-bypass-country TZ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· geo ZM -F',
    summary: 'Гео-обход через Замбию (--geo-bypass-country ZM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country ZM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file artist_sort',
    summary: 'Записать artist_sort (сортировочное имя исполнителя) в flux-ytdlp-artistsort.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file artist_sort flux-ytdlp-artistsort.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file album_sort',
    summary: 'Записать album_sort (сортировочное имя альбома) в flux-ytdlp-albumsort.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file album_sort flux-ytdlp-albumsort.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file conductor',
    summary: 'Записать conductor (дирижёр, если есть) в flux-ytdlp-conductor.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file conductor flux-ytdlp-conductor.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file performers',
    summary: 'Записать performers (список исполнителей, если extractor отдаёт) в flux-ytdlp-performers.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file performers flux-ytdlp-performers.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file copyright',
    summary: 'Записать copyright (строка правообладателя) в flux-ytdlp-copy.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file copyright flux-ytdlp-copy.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file uploader_url',
    summary: 'Записать uploader_url (канонический URL страницы автора) в flux-ytdlp-upurl.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file uploader_url flux-ytdlp-upurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file producer',
    summary: 'Записать producer (поле producer, если есть) в flux-ytdlp-producer.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file producer flux-ytdlp-producer.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· print-to-file director',
    summary: 'Записать director (режиссёр/автор видео, если extractor отдаёт) в flux-ytdlp-director.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file director flux-ytdlp-director.txt --skip-download '
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
  },
  {
    tool: 'ffprobe',
    token: '· format pretty',
    summary: 'format-секция в человекочитаемом виде (-pretty -show_format); единицы и время форматированы; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -pretty -show_format ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format flat',
    summary: 'Плоский ключ-значение вывод format (-of flat -show_format); удобно для grep/awk; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -of flat -show_format ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 packets 5',
    summary: 'Первые 5 пакетов v:0 (-show_packets -read_intervals %+#5 compact); таймстемпы/размеры; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#5 -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 frames 5',
    summary: 'Первые 5 кадров v:0 (-show_frames -read_intervals %+#5 compact); тип/размер/PTS; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#5 -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· program version',
    summary: 'Версия ffprobe + быстрый разбор файла (-show_program_version); сверка сборки; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_program_version ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:0 packets 3',
    summary: 'Первые 3 аудиопакета a:0 (PTS/размер compact); рваный TS; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_packets -read_intervals %+#3 -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· seek decode 2s',
    summary: 'Smoke-декод с середины (-ss 10 -t 2); EOF/индекс в длинных MP4; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -ss 10 -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 2 -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· loudnorm summary',
    summary: 'Замер интегральной громкости -af loudnorm=print_format=summary за 60 с; -vn -sn; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af loudnorm=print_format=summary -t 60 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· format comment',
    summary: 'Теги контейнера comment + synopsis (описание/сводка из метаданных); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=comment,synopsis -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· s:0 timebase',
    summary: 'Поток s:0: codec_time_base + time_base (таймбаза субтитров vs видео); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=codec_time_base,time_base -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 extradata',
    summary: 'Поток v:0: extradata_size (размер декодер-заголовков) + initial_padding; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=extradata_size,initial_padding -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· s:0 bit_rate',
    summary: 'Первая дорожка субтитров s:0: bit_rate (если задан в контейнере); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format duration_ts',
    summary: 'Контейнер: duration_ts (длительность в единицах time_base); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=duration_ts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format copyright',
    summary: 'Тег контейнера copyright (format_tags=copyright); кто и когда задал; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=copyright -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 BPS+DURATION',
    summary: 'MKV-статистика v:0: stream_tags BPS + DURATION (битрейт/длительность дорожки, если записаны mkvtoolnix); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=BPS,DURATION -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· s:0 tag duration',
    summary: 'Поток s:0: stream_tags duration (длительность субтитров, если записана в контейнере); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream_tags=duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format probe_size',
    summary: 'Сколько байт ушло на probe demuxer (-show_entries format=probe_size); диагностика «глубины» анализа; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=probe_size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· scale 320 null',
    summary: 'Smoke-перекодировка масштаба 320:-1 за 1 c в null muxer (-vf scale=320:-1 -t 1); проверка фильтр-цепочки; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=320:-1 -t 1 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 stream created',
    summary: 'Поток v:0: stream_tags creation_time (отличается от format при ремуксе); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=creation_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format handler_name',
    summary: 'Тег контейнера handler_name (format_tags.handler_name, часто QuickTime/MOV); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=handler_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· acopy null 3s',
    summary: 'Remux только аудио в null muxer (-vn -sn -acodec copy -t 3); проверка дорожки без видеодекода; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vn -sn -acodec copy -t 3 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· a:0 pcm depth',
    summary: 'Поток a:0: bits_per_raw_sample (глубина PCM/lossless) при наличии; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=bits_per_raw_sample -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 index codec',
    summary: 'Поток v:0: index + codec_name (порядок дорожек в контейнере); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=index,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 profile level',
    summary: 'Поток v:0: profile + level (H.264/HEVC профиль и уровень); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=profile,level -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· s:2 disposition',
    summary: 'Третья дорожка субтитров s:2: disposition (forced/default/hearing_impaired и т.д.); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:2 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:2 disposition',
    summary: 'Третья аудиодорожка a:2: disposition (default/forced и т.д.); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:2 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:1 profile level',
    summary: 'Вторая видеодорожка v:1: profile + level (редкие мультиangle/дубли); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:1 -show_entries stream=profile,level -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· s:1 stream dur',
    summary: 'Вторая дорожка субтитров s:1: start_time + duration дорожки; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· map v:0 copy 2s',
    summary: 'Remux только первой видеодорожки без перекодирования (-map 0:v:0 -c:v copy); без аудио/субтитров; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 2 -map 0:v:0 -c:v copy -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· s:0 pts+tb',
    summary: 'Поток s:0: time_base + start_pts (смещение субтитров vs видео); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· volumedetect 10s',
    summary: 'Замер громкости первых 10 с (-af volumedetect -vn -sn); mean_volume/max_volume в stderr; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volumedetect -t 10 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· format genre+date',
    summary: 'Теги контейнера genre + date (каталогизация/камера); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=genre,date -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· silencedetect 30s',
    summary: 'Поиск тишины в первых 30 с (-af silencedetect=noise=-50dB:d=0.3); stderr: silence_start/end; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af silencedetect=noise=-50dB:d=0.3 -t 30 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 disposition',
    summary: 'Первая видеодорожка v:0: disposition (default/forced/attached_pic и т.д.); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:1 bit_rate',
    summary: 'Вторая аудиодорожка a:1: bit_rate (мультиязык, комментарии); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· astats 5s',
    summary: 'Краткая статистика аудио первых 5 с (-af astats=metadata=1:reset=1); RMS/peak в stderr; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af astats=metadata=1:reset=1 -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· a:0 stream encoder',
    summary: 'Поток a:0: stream_tags encoder (кодировщик дорожки, если записан); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream_tags=encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ebur128 12s',
    summary: 'EBU R128 громкость первых 12 с (-af ebur128=framelog=verbose); Integrated/LRA/TP в stderr; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af ebur128=framelog=verbose -t 12 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· a:0 codec long',
    summary: 'Поток a:0: codec_long_name (человекочитаемое имя кодека); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· s:0 codec long',
    summary: 'Поток s:0: codec_long_name (тип субтитров в контейнере); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· aphasemeter 10s',
    summary: 'Стерео-фаза первых 10 с (-af aphasemeter=video=0); предупреждения о моно/фазе в stderr; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aphasemeter=video=0 -t 10 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· a:1 stream encoder',
    summary: 'Поток a:1: stream_tags encoder (если записан в контейнере); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream_tags=encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· idet 5s',
    summary: 'Детектор чересстрочности первых 5 с (-vf idet -t 5); TFF/BFF/progressive в stderr; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 5 -vf idet -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· format publisher+encby',
    summary: 'Теги контейнера publisher + encoded_by (каталогизация/студия); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=publisher,encoded_by -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· blackdetect 30s',
    summary: 'Поиск чёрных интервалов в первых 30 с (-vf blackdetect=d=0.1:pix_th=0.01); black_start/end в stderr; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf blackdetect=d=0.1:pix_th=0.01 -t 30 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· cropdetect 30s',
    summary: 'Оценка обрезки чёрных полей первых 30 с (-vf cropdetect=limit=24:round=16:reset=0); crop-параметры в stderr; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf cropdetect=limit=24:round=16:reset=0 -t 30 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· freezedetect 45s',
    summary: 'Поиск залипших кадров первых 45 с (-vf freezedetect=n=-60dB:d=2); freeze_start/end в stderr; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf freezedetect=n=-60dB:d=2 -t 45 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· signalstats 8s',
    summary: 'Статистика уровней/шума первых 8 с (-vf signalstats); YUV-средние/отклонения в stderr; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf signalstats -t 8 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· chapters json',
    summary: 'Главы контейнера одним JSON (--show-chapters -of json=c=1); длительности/титры сегментов; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -of json=c=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· s:0 stream dur',
    summary: 'Первая дорожка субтитров s:0: start_time + duration (смещение/длина vs видео); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:1 stream dur',
    summary: 'Вторая аудиодорожка a:1: start_time + duration (мультиязык, сдвиг); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· s:1 pts tb',
    summary: 'Вторая дорожка субтитров s:1: time_base + start_pts (смещение таймстемпов); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:1 pts tb',
    summary: 'Вторая аудиодорожка a:1: time_base + start_pts (сдвиг vs контейнер); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· dynaudnorm 5s',
    summary: 'Лёгкая динамическая нормализация громкости первых 5 с (-af dynaudnorm); проверка аудиофильтра; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af dynaudnorm=g=31:f=250:r=0.9 -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· highpass 5s',
    summary: 'ВЧ-срез первых 5 с (-af highpass=f=200); проверка аудио-цепочки/тишины в низах; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=200 -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 location tag',
    summary: 'Поток v:0: stream_tags location (GPS/локация в MOV/др.); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=location -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:0 sample_fmt',
    summary: 'Поток a:0: только sample_fmt (s16/fltp и т.д.); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=sample_fmt -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format lyrics tag',
    summary: 'Тег контейнера lyrics (текстовые вставки в MP3/M4A и др.); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=lyrics -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:1 layout+sfmt',
    summary: 'Поток a:1: channel_layout + sample_fmt (мультиязык, разрядность PCM); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=channel_layout,sample_fmt -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· scenedetect 20s',
    summary: 'Детектор смен сцен первых 20 с (-vf scenedetect=scene=0.3); scene_score в stderr; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scenedetect=scene=0.3 -t 20 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· genpts remux 2s',
    summary: 'Короткий remux с генерацией PTS (-fflags +genpts -c copy -t 2); битые/рваные таймстемпы TS/MKV; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -fflags +genpts -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 2 -c copy -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 stereo_mode',
    summary: 'Поток v:0: stream_tags stereo_mode (3D/стерео-метка в MKV/др.); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=stereo_mode -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:0 duration_ts',
    summary: 'Поток a:0: длительность в тиках time_base (stream=duration_ts); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=duration_ts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format size+br+nb',
    summary: 'Контейнер: size + bit_rate + nb_streams (компактно); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=size,bit_rate,nb_streams -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· aresample 44k1 3s',
    summary: 'Аудио ресэмпл в 44.1 kHz первые 3 с (-af aresample=44100); проверка SRC цепочки; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aresample=44100 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· format minor_version',
    summary: 'Тег контейнера minor_version (версия isom/brand в MP4/MOV); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=minor_version -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· afftdn 3s',
    summary: 'Лёгкое FFT-шумоподавление первых 3 с (-af afftdn=nf=-25); проверка аудиофильтра; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afftdn=nf=-25 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· format desc+kw',
    summary: 'Теги контейнера description + keywords (каталогизация/SEO в MP4/MKV и др.); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=description,keywords -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format location tag',
    summary: 'Тег контейнера location (GPS/URI в format metadata); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=location -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· acompressor 5s',
    summary: 'Лёгкая компрессия аудио первых 5 с (-af acompressor=threshold=-20dB:ratio=4:attack=5:release=100); плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acompressor=threshold=-20dB:ratio=4:attack=5:release=100 -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· v:2 codec+size+prof',
    summary: 'Вторая видеодорожка v:2: codec_name/width/height/profile/level (мульти-угол/редкие контейнеры); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:2 -show_entries stream=codec_name,width,height,profile,level -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· silenceremove 60s',
    summary: 'Обрезка ведущей тишины в первых 60 с (-af silenceremove=…); проверка цепочки af на речи/музыке; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af silenceremove=start_periods=1:start_duration=0.5:start_threshold=-50dB:detection=peak:stop_periods=-1 -t 60 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 ticks/frame',
    summary: 'Поток v:0: ticks_per_frame (квант времени кадра vs time_base); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=ticks_per_frame -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· treble 3s',
    summary: 'Лёгкий EQ treble первых 3 с (-af treble=g=1); smoke цепочки аудиофильтра; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af treble=g=1 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· format software tag',
    summary: 'Тег контейнера software (кодировщик/пакер контейнера); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=software -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format ep meta',
    summary: 'Теги сериала в контейнере (episode_sort, season_number, episode_id); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=episode_sort,season_number,episode_id -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· volume +3dB 2s',
    summary: 'Усиление аудио +3 dB первые 2 с (-af volume=3dB); smoke громкости без перекодирования видео; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volume=3dB -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· lowpass 3.5k 3s',
    summary: 'НЧ-фильтр первых 3 с (-af lowpass=f=3500); проверка аудио-цепочки; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowpass=f=3500 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· a:0 tb+fps',
    summary: 'Поток a:0: time_base + avg_frame_rate + r_frame_rate (тактовая сетка и дробь FPS у аудио-потока); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=time_base,avg_frame_rate,r_frame_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· bandpass hp+lp 4s',
    summary: 'Полосовой проход 200–3000 Hz первых 4 с (-af highpass=f=200,lowpass=f=3000); smoke цепочки из двух af; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=200,lowpass=f=3000 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 intra_only',
    summary: 'Поток v:0: is_intra_only (все-I GOP / редкие кодеки); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=is_intra_only -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format composer',
    summary: 'Теги контейнера composer + conductor (классика/метаданные каталога); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=composer,conductor -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· agate 5s',
    summary: 'Шумовой гейт первых 5 с (-af agate=…); проверка динамики/тишины в af-цепочке; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af agate=threshold=0.005:ratio=2:attack=20:release=200 -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· adeclick 5s',
    summary: 'Клик-редактор первых 5 с (-af adeclick); диагностика щёлчков/дефектов записи; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af adeclick -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· format performer',
    summary: 'Тег контейнера performer (format_tags=performer); исполнитель/артист в каталогизации; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=performer -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 alpha_mode',
    summary: 'Поток v:0: stream_tags alpha_mode (VP9/AV1 альфа-канал в WebM/MKV); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=alpha_mode -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· extrastereo 3s',
    summary: 'Усиление стерео-разницы первых 3 с (-af extrastereo); проверка ширины стерео-цепочки; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af extrastereo -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· format purchase_date',
    summary: 'Тег контейнера purchase_date (iTunes Store и др.); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=purchase_date -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format sort meta',
    summary: 'Теги сортировки каталога (sort_artist, sort_album, sort_title) в format_tags; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=sort_artist,sort_album,sort_title -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· aphaser 4s',
    summary: 'Лёгкий фазовый эффект первых 4 с (-af aphaser); smoke цепочки stereo af; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aphaser=in_gain=0.4:out_gain=0.74 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· format service',
    summary: 'Теги service_provider + service_name контейнера (IPTV/OFFAIR и др.); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=service_provider,service_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:0 bpc_sample',
    summary: 'Поток a:0: bits_per_coded_sample (глубина закодированного PCM при наличии); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=bits_per_coded_sample -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· flanger 4s',
    summary: 'Лёгкий flanger первых 4 с (-af flanger); smoke стерео-модуляции; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af flanger -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· format isrc',
    summary: 'Тег контейнера isrc (ISRC релиза); каталогизация аудио; плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=isrc -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· deesser 4s',
    summary: 'Де-эссер первых 4 с (-af deesser); диагностика свистящих согласных; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af deesser=i=0.5 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· s:0 encoder',
    summary: 'Поток первых субтитров: stream_tags encoder (mux/authoring tool); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream_tags=encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· vibrato 4s',
    summary: 'Лёгкая вибрато-модуляция первых 4 с (-af vibrato); smoke цепочки stereo af; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af vibrato=f=6.5:d=0.5 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· format part+comp',
    summary: 'Теги контейнера part + compilation (iTunes/мультидисковые сборники); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=part,compilation -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· crystalizer 4s',
    summary: 'Психоакустический crystalizer первых 4 с (-af crystalizer); лёгкий smoke audio FX; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af crystalizer=i=1.2 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 tb codec',
    summary: 'Поток v:0: codec_time_base + time_base (таймбаза видео vs контейнер); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=codec_time_base,time_base -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· asetrate pitch 3s',
    summary: 'Лёгкий resample-питч первых 3 с (-af asetrate=44100*1.01,aresample=44100); smoke цепочки asetrate→aresample; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af asetrate=44100*1.01,aresample=44100 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· format copy enc',
    summary: 'Теги контейнера copyright + encoded_by (право/кодировщик); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=copyright,encoded_by -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· compand 4s',
    summary: 'Лёгкий компандер первых 4 с (-af compand); smoke динамической обработки; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af compand=attacks=0.02:decays=0.1:points=-80/-80|-25/-25|0/-10:gain=2 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· format album_artist',
    summary: 'Тег контейнера album_artist (альбомный исполнитель vs artist); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=album_artist -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· format track+disc',
    summary: 'Теги контейнера track + disc (номер трека/диска в каталоге); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=track,disc -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· dynaudnorm 4s',
    summary: 'Лёгкая динамическая нормализация громкости первых 4 с (-af dynaudnorm); smoke loudness chain; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af dynaudnorm=f=150:g=15 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· format lyrics',
    summary: 'Теги контейнера lyrics + synopsis (подкасты/аудиокниги/расширенные метаданные); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=lyrics,synopsis -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· asoftclip 4s',
    summary: 'Мягкий клиппер первых 4 с (-af asoftclip); smoke ограничения пиков без жёсткого лимитера; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af asoftclip -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· a:0 chans',
    summary: 'Поток a:0: channels + channel_layout (карта каналов vs число); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=channels,channel_layout -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· aecho 4s',
    summary: 'Лёгкое эхо первых 4 с (-af aecho); smoke задержек/смешивания в af; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aecho=0.8:0.9:40:0.3 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· s:1 disposition',
    summary: 'Вторая дорожка субтитров s:1: disposition (forced/default/hearing_impaired и т.д.); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· tremolo 4s',
    summary: 'Лёгкая амплитудная модуляция первых 4 с (-af tremolo); smoke периодического af; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af tremolo=f=6:d=0.5 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· bandpass 4s',
    summary: 'Узкополосный bandpass первых 4 с (-af bandpass); smoke частотной фильтрации; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af bandpass=f=1000:width_type=h:width=200 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· a:1 codec+ch',
    summary: 'Вторая аудиодорожка a:1: codec_name + channels + channel_layout (мультиязык/комментарии); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=codec_name,channels,channel_layout -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· highshelf 3s',
    summary: 'Лёгкий highshelf EQ первых 3 с (-af highshelf); smoke параметрического af; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highshelf=f=8000:width_type=o:width=2:g=-6 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· v:1 WxH',
    summary: 'Вторая видеодорожка v:1: codec_name + width + height (мультикамера/доп. угол); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:1 -show_entries stream=codec_name,width,height -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· apulsator 3s',
    summary: 'Лёгкий стерео-пульсатор первых 3 с (-af apulsator); smoke периодического pan/af; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af apulsator=mode=sine:hz=1:width=2 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· d:1 codec',
    summary: 'Вторая data-дорожка d:1: codec_name + codec_tag_string (таймкоды/метаданные в контейнере); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:1 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· chorus 4s',
    summary: 'Лёгкий хорус первых 4 с (-af chorus); smoke задержек/модуляции в af; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af chorus=0.5:0.9:50:0.4:0.25:2 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· format WM/ASFT',
    summary: 'Теги контейнера encoder + WMFSDKVersion (часто у WMV/ASF); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoder,WMFSDKVersion -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· afade in 3s',
    summary: 'Плавное нарастание громкости первых 3 с (-af afade=t=in:st=0:d=0.6); smoke afade без кавычек; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afade=t=in:st=0:d=0.6 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· format enc_tool',
    summary: 'Тег контейнера encoding_tool (Mux/QuickTime authoring, если записан); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoding_tool -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· afade out 3s',
    summary: 'Плавное затухание громкости в хвосте первых 3 с (-af afade=t=out:st=1.2:d=0.6); smoke afade out; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afade=t=out:st=1.2:d=0.6 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· format probe_score',
    summary: 'Контейнер: probe_score (уверенность ffprobe в формате); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=probe_score -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· atempo 0.95 3s',
    summary: 'Лёгкое замедление темпа первых 3 с (-af atempo=0.95); smoke atempo без кавычек; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af atempo=0.95 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· v:1 codec long',
    summary: 'Вторая видеодорожка v:1: codec_name + codec_long_name (мультикамера/доп. поток); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:1 -show_entries stream=codec_name,codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· alimiter 3s',
    summary: 'Мягкий лимитер пиков первых 3 с (-af alimiter=limit=0.8); smoke динамики/af без кавычек; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af alimiter=limit=0.8 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· format MP4 brands',
    summary: 'Теги контейнера major_brand + minor_version + compatible_brands (часто у MP4/MOV); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=major_brand,minor_version,compatible_brands -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· stereotools 3s',
    summary: 'Лёгкая стерео-коррекция первых 3 с (-af stereotools=mlev=0.05:phlev=0.05); smoke ширины/фазы; плейсхолдер = превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af stereotools=mlev=0.05:phlev=0.05 -t 3 -vn -sn -f null -`
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

