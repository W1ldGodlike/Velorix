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

