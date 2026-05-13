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
    summary: 'Список форматов перед загрузкой; после щелчка по подсказке допишите URL из поля очереди.',
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
    token: '· cookie из Chrome',
    summary: 'Сухой прогон с файлами cookie из Chrome (--cookies-from-browser); допишите URL.',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser chrome '
  },
  {
    tool: 'yt-dlp',
    token: '· -J',
    summary: 'Полный JSON метаданных (-J) без скачивания; допишите URL (диагностика, ZIP-архив для обращения в поддержку).',
    fullLine: 'yt-dlp -J '
  },
  {
    tool: 'yt-dlp',
    token: '· один JSON на URL (один ролик)',
    summary: 'Один JSON на ролик без скачивания (--dump-single-json, эквивалент -J для одного URL); допишите URL.',
    fullLine: 'yt-dlp --dump-single-json '
  },
  {
    tool: 'yt-dlp',
    token: '· подробный лог + сухой прогон',
    summary: 'Подробный журнал вывода без скачивания (-v --skip-download); допишите URL (ошибки модуля извлечения, геоблокировки (geo), защита контента (DRM)).',
    fullLine: 'yt-dlp -v --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· сухой прогон (имитация)',
    summary: 'Сухой прогон без файлов (--simulate); допишите URL (проверка доступности и форматов).',
    fullLine: 'yt-dlp --simulate '
  },
  {
    tool: 'yt-dlp',
    token: '· список субтитров',
    summary: 'Список субтитров на странице без скачивания (--list-subs); допишите URL.',
    fullLine: 'yt-dlp --list-subs '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист + полный JSON (-J)',
    summary: 'Плейлист «плоско» и JSON (-J) без глубокого извлечения каждого ролика; допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist -J '
  },
  {
    tool: 'yt-dlp',
    token: '· один ролик из плейлиста -F',
    summary: 'Только один ролик из URL-плейлиста (--no-playlist -F); список форматов без разворачивания всего плейлиста.',
    fullLine: 'yt-dlp --no-playlist -F '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист + форматы -F',
    summary: 'Плоский список элементов плейлиста и форматы по каждому (--flat-playlist -F); допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist -F '
  },
  {
    tool: 'yt-dlp',
    token: '· список миниатюр (превью)',
    summary: 'Доступные URL миниатюр (thumbnail) без скачивания (--list-thumbnails); допишите URL.',
    fullLine: 'yt-dlp --list-thumbnails '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: title',
    summary: 'Только заголовок ролика без скачивания (--skip-download --print title); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: duration_string',
    summary: 'Только длительность HH:MM:SS без скачивания (--skip-download --print duration_string); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print duration_string '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: uploader',
    summary: 'Имя автора (uploader) без скачивания (--skip-download --print uploader); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print uploader '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: id',
    summary: 'Идентификатор ролика на площадке без скачивания (--skip-download --print id); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print id '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: webpage_url',
    summary: 'Канонический URL страницы без скачивания (--skip-download --print webpage_url); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print webpage_url '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: channel',
    summary: 'Имя канала или площадки без скачивания (--skip-download --print channel); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print channel '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: channel_id',
    summary: 'Идентификатор канала без скачивания (--skip-download --print channel_id); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print channel_id '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: thumbnail',
    summary: 'URL миниатюры (thumbnail) без скачивания (--skip-download --print thumbnail); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print thumbnail '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: view_count',
    summary: 'Счётчик просмотров без скачивания (--skip-download --print view_count); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print view_count '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: upload_date',
    summary: 'Дата публикации YYYYMMDD без скачивания (--skip-download --print upload_date); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print upload_date '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: playlist_title',
    summary: 'Заголовок плейлиста без скачивания (--skip-download --print playlist_title); допишите URL плейлиста.',
    fullLine: 'yt-dlp --skip-download --print playlist_title '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: playlist_count',
    summary: 'Число элементов в плейлисте без скачивания (--skip-download --print playlist_count); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print playlist_count '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: filename',
    summary: 'Имя выходного файла по текущим -o без скачивания (--skip-download --print filename); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print filename '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: description',
    summary: 'Текст описания ролика без скачивания (--skip-download --print description); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print description '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: categories',
    summary: 'Категории и тематики без скачивания (--skip-download --print categories); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print categories '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: language',
    summary: 'Язык по умолчанию без скачивания (--skip-download --print language); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print language '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: extractor',
    summary: 'Имя модуля извлечения (extractor) без скачивания (--skip-download --print extractor); допишите URL (диагностика маршрута yt-dlp).',
    fullLine: 'yt-dlp --skip-download --print extractor '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: playlist_id',
    summary: 'Идентификатор плейлиста без скачивания (--skip-download --print playlist_id); допишите URL плейлиста.',
    fullLine: 'yt-dlp --skip-download --print playlist_id '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход + список форматов -F',
    summary: 'Обход гео-блока и список форматов (--geo-bypass -F); допишите URL (региональные ограничения).',
    fullLine: 'yt-dlp --geo-bypass -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: format_id',
    summary: 'Идентификатор выбранного формата без скачивания (--skip-download --print format_id); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print format_id '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: ext',
    summary: 'Расширение контейнера выбранного формата без скачивания (--skip-download --print ext); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print ext '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: resolution',
    summary: 'Строка разрешения выбранного формата без скачивания (--skip-download --print resolution); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print resolution '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: vcodec',
    summary: 'Видеокодек выбранного формата без скачивания (--skip-download --print vcodec); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print vcodec '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: acodec',
    summary: 'Аудиокодек выбранного формата без скачивания (--skip-download --print acodec); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print acodec '
  },
  {
    tool: 'yt-dlp',
    token: '· список экстракторов',
    summary: 'Список имён модулей извлечения сайтов без URL (диагностика сборки yt-dlp и поддерживаемых площадок).',
    fullLine: 'yt-dlp --list-extractors'
  },
  {
    tool: 'yt-dlp',
    token: '· версия yt-dlp',
    summary: 'Версия yt-dlp и зависимостей без URL (сверка с встроенной поставкой и обновлениями).',
    fullLine: 'yt-dlp --version'
  },
  {
    tool: 'yt-dlp',
    token: '· -4 -F',
    summary: 'Список форматов через IPv4 (-4 -F); обходит часть проблем IPv6 и маршрутизации; допишите URL.',
    fullLine: 'yt-dlp -4 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без кэша + -F',
    summary: 'Список форматов без кэша модулей извлечения (--no-cache-dir -F); при подозрении на битый кэш; допишите URL.',
    fullLine: 'yt-dlp --no-cache-dir -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: tags',
    summary: 'Сводка тегов и метаданных без скачивания (--skip-download --print tags); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print tags '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: filesize_approx',
    summary: 'Оценка размера выбранного формата без скачивания (--skip-download --print filesize_approx); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print filesize_approx '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист: игнор ошибок + -J',
    summary: 'Плоский плейлист и JSON с пропуском битых элементов (--ignore-errors --flat-playlist -J); допишите URL плейлиста.',
    fullLine: 'yt-dlp --ignore-errors --flat-playlist -J '
  },
  {
    tool: 'yt-dlp',
    token: '· запись .info.json',
    summary: 'Записать .info.json рядом с выходом без видео (--write-info-json --skip-download); допишите URL (трассировка для ZIP-архива поддержки).',
    fullLine: 'yt-dlp --write-info-json --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· без предупреждений + -F',
    summary: 'Список форматов без предупреждений в стандартном потоке ошибок (stderr) (--no-warnings -F); допишите URL (чище вывод).',
    fullLine: 'yt-dlp --no-warnings -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: fps',
    summary: 'Кадры в секунду выбранного формата без скачивания (--skip-download --print fps); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print fps '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: is_live',
    summary: 'Признак прямого эфира без скачивания (--skip-download --print is_live); в метаданных — да или нет (true/false); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print is_live '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: live_status',
    summary: 'Статус эфира без скачивания (--skip-download --print live_status): is_live (эфир сейчас), was_live (запись с эфира), not_live (не эфир), is_upcoming или upcoming (до начала эфира); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print live_status '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: availability',
    summary: 'Видимость ролика без скачивания (--skip-download --print availability): public (для всех), unlisted (только по ссылке), premium (ограниченный доступ), needs_auth (нужна авторизация); допишите URL (диагностика 403 и входа по логину).',
    fullLine: 'yt-dlp --skip-download --print availability '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: age_limit',
    summary: 'Возрастной лимит ролика без скачивания (--skip-download --print age_limit); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print age_limit '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: like_count',
    summary: 'Счётчик лайков без скачивания (--skip-download --print like_count); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print like_count '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: comment_count',
    summary: 'Число комментариев без скачивания (--skip-download --print comment_count); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print comment_count '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: aspect_ratio',
    summary: 'Соотношение сторон выбранного формата без скачивания (--skip-download --print aspect_ratio); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print aspect_ratio '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист: только 1-й + -F',
    summary: 'Только первый элемент плейлиста и список форматов (--playlist-items 1 -F); допишите URL плейлиста.',
    fullLine: 'yt-dlp --playlist-items 1 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· YouTube, web-клиент -F',
    summary: 'YouTube: принудительно веб-клиент через --extractor-args (обход части ограничений), затем ключ -F для списка форматов; допишите URL.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=web -F '
  },
  {
    tool: 'yt-dlp',
    token: '· cookie из Edge',
    summary: 'Сухой прогон с файлами cookie из Edge (--cookies-from-browser); допишите URL (альтернатива Chrome).',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser edge '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: duration (сек)',
    summary: 'Длительность в секундах (число) без скачивания (--skip-download --print duration); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print duration '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: width',
    summary: 'Ширина выбранного формата в пикселях без скачивания (--skip-download --print width); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print width '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: height',
    summary: 'Высота выбранного формата в пикселях без скачивания (--skip-download --print height); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print height '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: tbr',
    summary: 'Сводный битрейт выбранного формата (kbps) без скачивания (--skip-download --print tbr); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print tbr '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: abr',
    summary: 'Аудио-битрейт выбранного формата (kbps) без скачивания (--skip-download --print abr); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print abr '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: vbr',
    summary: 'Видео-битрейт выбранного формата (kbps) без скачивания (--skip-download --print vbr); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print vbr '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: asr',
    summary: 'Частота дискретизации аудио (Hz) без скачивания (--skip-download --print asr); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print asr '
  },
  {
    tool: 'yt-dlp',
    token: '· только миниатюра',
    summary: 'Только миниатюра без видео (--write-thumbnail --skip-download); файл .jpg или .webp рядом; допишите URL.',
    fullLine: 'yt-dlp --write-thumbnail --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· только авто-субтитры',
    summary: 'Только авто-субтитры без видео (--write-auto-sub --skip-download); поможет проверить транскрипт; допишите URL.',
    fullLine: 'yt-dlp --write-auto-sub --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· описание в .description',
    summary: 'Описание ролика в отдельный файл .description без видео (--write-description --skip-download); допишите URL.',
    fullLine: 'yt-dlp --write-description --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· ярлык .url на страницу',
    summary: 'Файл-ярлык на страницу без видео (--write-url-link --skip-download); допишите URL.',
    fullLine: 'yt-dlp --write-url-link --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· проверка форматов',
    summary: 'Проверка доступности выбранных форматов без полного скачивания (--check-formats); допишите URL.',
    fullLine: 'yt-dlp --check-formats '
  },
  {
    tool: 'yt-dlp',
    token: '· cookie из Firefox',
    summary: 'Сухой прогон с файлами cookie из Firefox (--cookies-from-browser); допишите URL (альтернатива Chrome и Edge).',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser firefox '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: has_drm',
    summary: 'Флаг DRM и шифрования без скачивания (--skip-download --print has_drm); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print has_drm '
  },
  {
    tool: 'yt-dlp',
    token: '· допуск встраивания',
    summary: 'Ограничения воспроизведения во встроенном плеере без скачивания (--skip-download --print playable_in_embed); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print playable_in_embed '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: channel_url',
    summary: 'URL канала или плейлиста без скачивания (--skip-download --print channel_url); допишите URL ролика.',
    fullLine: 'yt-dlp --skip-download --print channel_url '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: uploader_id',
    summary: 'Идентификатор автора на площадке без скачивания (--skip-download --print uploader_id); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print uploader_id '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: was_live',
    summary: 'Был ли эфир прямой трансляцией или записью стрима без скачивания (--skip-download --print was_live); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print was_live '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: media_type',
    summary: 'Тип медиа (видео или аудио и т. п.) без скачивания (--skip-download --print media_type); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print media_type '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: release_year',
    summary: 'Год публикации (если есть) без скачивания (--skip-download --print release_year); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print release_year '
  },
  {
    tool: 'yt-dlp',
    token: '· TLS без проверки + -F',
    summary: 'Список форматов при сбоях проверки TLS-сертификатов (--no-check-certificates -F); только для диагностики, снижает безопасность.',
    fullLine: 'yt-dlp --no-check-certificates -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: filesize',
    summary: 'Размер файла выбранного формата (байты, если известен) без скачивания (--skip-download --print filesize); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print filesize '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: format_note',
    summary: 'Поле примечания к формату (format_note) без скачивания (--skip-download --print format_note); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print format_note '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: subtitles',
    summary: 'Словарь субтитров из метаданных без скачивания (--skip-download --print subtitles); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print subtitles '
  },
  {
    tool: 'yt-dlp',
    token: '· автосубтитры',
    summary: 'Авто-субтитры и автоматическое распознавание речи (ASR) из метаданных без скачивания (--skip-download --print automatic_captions); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print automatic_captions '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: chapters',
    summary: 'Главы из метаданных без скачивания (--skip-download --print chapters); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print chapters '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист: заголовок',
    summary: 'Плоский плейлист: заголовок каждого элемента без глубокого извлечения (--flat-playlist --skip-download --print title); допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist --skip-download --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: original_url',
    summary: 'Исходный URL запроса без скачивания (--skip-download --print original_url); сверка редиректов; допишите URL.',
    fullLine: 'yt-dlp --skip-download --print original_url '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: webpage_url_domain',
    summary: 'Домен страницы без скачивания (--skip-download --print webpage_url_domain); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print webpage_url_domain '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист: вывод ID',
    summary: 'Плоский плейлист: идентификатор (id) каждого элемента без глубокого извлечения (--flat-playlist --skip-download --print id); допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist --skip-download --print id '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: playlist_index',
    summary: 'Индекс ролика в плейлисте без скачивания (--skip-download --print playlist_index); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print playlist_index '
  },
  {
    tool: 'yt-dlp',
    token: '· запись субтитров',
    summary: 'Субтитры в файлы без видео (--write-sub --skip-download); допишите URL.',
    fullLine: 'yt-dlp --write-sub --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· запись комментариев',
    summary: 'Комментарии в JSON без видео (--write-comments --skip-download); допишите URL (если поддерживается площадкой).',
    fullLine: 'yt-dlp --write-comments --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· -g bestaudio',
    summary: 'Прямая ссылка только на лучший аудиоформат (-g -f bestaudio/best, то есть bestaudio либо best); без видео; допишите URL.',
    fullLine: 'yt-dlp -g -f bestaudio/best '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист: симуляция',
    summary: 'Быстрая симуляция плейлиста без глубокого извлечения (--flat-playlist --simulate); допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist --simulate '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: filepath',
    summary: 'Шаблон выходного пути по текущим -o без скачивания (--skip-download --print filepath); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print filepath '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: epoch',
    summary: 'Время публикации в секундах с эпохи Unix (epoch), если есть, без скачивания (--skip-download --print epoch); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print epoch '
  },
  {
    tool: 'yt-dlp',
    token: '· -6 -F',
    summary: 'Список форматов через IPv6 (-6 -F); если IPv4 глушится провайдером; допишите URL.',
    fullLine: 'yt-dlp -6 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист: вывод URL',
    summary: 'Плоский плейлист: URL каждого элемента без глубокого извлечения (--flat-playlist --print url); допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist --print url '
  },
  {
    tool: 'yt-dlp',
    token: '· запись HTML-страниц',
    summary: 'Сохранить сырые HTML-страницы модуля извлечения (extractor) в .dump (--write-pages --skip-download); диагностика разметки и ответов 403; допишите URL.',
    fullLine: 'yt-dlp --write-pages --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: heatmap',
    summary: 'Данные тепловой карты просмотров (heatmap; если отдаёт площадка, напр. YouTube) без скачивания (--skip-download --print heatmap); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print heatmap '
  },
  {
    tool: 'yt-dlp',
    token: '· лимит скорости 1M',
    summary: 'Ограничить скорость загрузки (~1 MiB/s) для диагностики CDN и таймаутов; при необходимости измените суффикс; допишите URL.',
    fullLine: 'yt-dlp --limit-rate 1M '
  },
  {
    tool: 'yt-dlp',
    token: '· повторы 10',
    summary: 'Повторы HTTP и фрагментов для нестабильной сети (--retries 10 --fragment-retries 10); допишите URL и остальные ключи.',
    fullLine: 'yt-dlp --retries 10 --fragment-retries 10 '
  },
  {
    tool: 'yt-dlp',
    token: '· таймаут сокета 30 с',
    summary: 'Таймаут сокета 30 с против зависаний (--socket-timeout 30); допишите URL.',
    fullLine: 'yt-dlp --socket-timeout 30 '
  },
  {
    tool: 'yt-dlp',
    token: '· только IPv4 -F',
    summary: 'Список форматов только через IPv4 (--force-ipv4 -F); если -6 не подходит; допишите URL.',
    fullLine: 'yt-dlp --force-ipv4 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без .part -F',
    summary: 'Без временных .part (--no-part -F); локальный диск и сетевое хранилище (NAS); допишите URL.',
    fullLine: 'yt-dlp --no-part -F '
  },
  {
    tool: 'yt-dlp',
    token: '· параллельно фрагментов 4',
    summary: 'Параллельная подкачка фрагментов потоков DASH и HLS (--concurrent-fragments 4); допишите URL и остальные ключи.',
    fullLine: 'yt-dlp --concurrent-fragments 4 '
  },
  {
    tool: 'yt-dlp',
    token: '· слияние в MKV',
    summary: 'Слияние потоков в контейнер MKV при мультиплексировании (--merge-output-format mkv); допишите URL и -f …',
    fullLine: 'yt-dlp --merge-output-format mkv '
  },
  {
    tool: 'yt-dlp',
    token: '· предпочесть бесплатные -F',
    summary: 'Список форматов с приоритетом свободных кодеков (--prefer-free-formats -F); допишите URL.',
    fullLine: 'yt-dlp --prefer-free-formats -F '
  },
  {
    tool: 'yt-dlp',
    token: '· сортировка форматов 720p -F',
    summary: 'Сортировка форматов: сначала около 720p (--format-sort +res:720 -F); при необходимости поменяйте res; допишите URL.',
    fullLine: 'yt-dlp --format-sort +res:720 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· HLS встроенный -F',
    summary: 'HLS: встроенный загрузчик вместо утилиты ffmpeg, где возможно (--hls-prefer-native -F); допишите URL.',
    fullLine: 'yt-dlp --hls-prefer-native -F '
  },
  {
    tool: 'yt-dlp',
    token: '· стрим с начала буфера',
    summary: 'Прямой эфир: начать с начала буфера (--live-from-start); допишите URL трансляции и прочие ключи.',
    fullLine: 'yt-dlp --live-from-start '
  },
  {
    tool: 'yt-dlp',
    token: '· пауза между запросами 1 с',
    summary: 'Пауза 1 с между HTTP-запросами (--sleep-requests 1); снижает риск ответа 429 и блокировок; допишите URL.',
    fullLine: 'yt-dlp --sleep-requests 1 '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист до 10-го -J',
    summary: 'Первые 10 элементов плейлиста в JSON (--playlist-end 10 -J); допишите URL плейлиста.',
    fullLine: 'yt-dlp --playlist-end 10 -J '
  },
  {
    tool: 'yt-dlp',
    token: '· гео US -F',
    summary: 'Обход гео через страну-подсказку (--geo-bypass-country US -F); при необходимости замените ISO-код; допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country US -F '
  },
  {
    tool: 'yt-dlp',
    token: '· повторы извлечения 5',
    summary: 'Повторы на этапе модуля извлечения (extractor) против кода 403 и таймаутов страницы (--extractor-retries 5); допишите URL и остальные ключи.',
    fullLine: 'yt-dlp --extractor-retries 5 '
  },
  {
    tool: 'yt-dlp',
    token: '· размер чанка HTTP 10M',
    summary: 'Размер HTTP-чанка 10 MiB (--http-chunk-size 10M); иногда стабилизирует медленные CDN; допишите URL.',
    fullLine: 'yt-dlp --http-chunk-size 10M '
  },
  {
    tool: 'yt-dlp',
    token: '· без перезаписи -F',
    summary: 'Не перезаписывать уже скачанные файлы (--no-overwrites -F); допишите URL.',
    fullLine: 'yt-dlp --no-overwrites -F '
  },
  {
    tool: 'yt-dlp',
    token: '· имена под Windows -F',
    summary: 'Имена файлов без зарезервированных символов Windows (--windows-filenames -F); допишите URL и -o при необходимости.',
    fullLine: 'yt-dlp --windows-filenames -F '
  },
  {
    tool: 'yt-dlp',
    token: '· перевод строки в журнале -F',
    summary: 'Прогресс с переводом строки (--newline -F); удобнее разбирать вывод и перенаправлять его в другие программы; допишите URL.',
    fullLine: 'yt-dlp --newline -F '
  },
  {
    tool: 'yt-dlp',
    token: '· пропуск недоступных фрагментов',
    summary: 'Потоки DASH и HLS: пропускать недоступные фрагменты вместо аварийной остановки (--skip-unavailable-fragments); допишите URL.',
    fullLine: 'yt-dlp --skip-unavailable-fragments '
  },
  {
    tool: 'yt-dlp',
    token: '· журнал archive.txt',
    summary: 'Журнал скачанных идентификаторов (id) в archive.txt (--download-archive archive.txt); поменяйте имя файла под свою папку; допишите URL.',
    fullLine: 'yt-dlp --download-archive archive.txt '
  },
  {
    tool: 'yt-dlp',
    token: '· стоп при отказе формата -F',
    summary: 'Остановиться при отклонённом формате (--break-on-reject -F); диагностика -f; допишите URL.',
    fullLine: 'yt-dlp --break-on-reject -F '
  },
  {
    tool: 'yt-dlp',
    token: '· обрезка имён 80 -F',
    summary: 'Обрезка длины имён файлов (--trim-file-names 80 -F); длинные заголовки; допишите URL.',
    fullLine: 'yt-dlp --trim-file-names 80 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без времени файла',
    summary: 'Не выставлять время файла из метаданных ролика (--no-mtime); допишите URL и остальные ключи.',
    fullLine: 'yt-dlp --no-mtime '
  },
  {
    tool: 'yt-dlp',
    token: '· докачка',
    summary: 'Докачка частично скачанного (.part) при повторном запуске (--continue); допишите URL и -o.',
    fullLine: 'yt-dlp --continue '
  },
  {
    tool: 'yt-dlp',
    token: '· стоп при первой ошибке',
    summary: 'Остановить весь запуск при первой неустранимой ошибке (--abort-on-error); допишите URL и плейлист при необходимости.',
    fullLine: 'yt-dlp --abort-on-error '
  },
  {
    tool: 'yt-dlp',
    token: '· фрагмент плейлиста -J',
    summary: 'Фрагмент плейлиста в JSON (элементы 5–15, ключи --playlist-start и --playlist-end с -J); допишите URL плейлиста.',
    fullLine: 'yt-dlp --playlist-start 5 --playlist-end 15 -J '
  },
  {
    tool: 'yt-dlp',
    token: '· макс. размер -F',
    summary: 'Показать только форматы до ~512 MiB (--max-filesize 512M -F); подстройте лимит; допишите URL.',
    fullLine: 'yt-dlp --max-filesize 512M -F '
  },
  {
    tool: 'yt-dlp',
    token: '· ограничить символы в именах -F',
    summary: 'Только ASCII в именах файлов (--restrict-filenames -F); допишите URL и -o при необходимости.',
    fullLine: 'yt-dlp --restrict-filenames -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без ANSI-цвета -F',
    summary: 'Без цветов ANSI в выводе (--color never -F); проще читать вывод и перенаправлять его; допишите URL.',
    fullLine: 'yt-dlp --color never -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вшить метаданные',
    summary: 'Вшить метаданные в контейнер после скачивания (--embed-metadata); допишите URL и -f/-o.',
    fullLine: 'yt-dlp --embed-metadata '
  },
  {
    tool: 'yt-dlp',
    token: '· вшить обложку',
    summary: 'Вшить обложку в файл после скачивания (--embed-thumbnail); допишите URL и формат.',
    fullLine: 'yt-dlp --embed-thumbnail '
  },
  {
    tool: 'yt-dlp',
    token: '· ждать появления трансляции',
    summary: 'Ждать появления трансляции до N минут (--wait-for-video 10); допишите URL стрима.',
    fullLine: 'yt-dlp --wait-for-video 10 '
  },
  {
    tool: 'yt-dlp',
    token: '· пропуск ошибок плейлиста',
    summary: 'Пропустить до N ошибок подряд в плейлисте (--skip-playlist-after-errors 5); допишите URL плейлиста.',
    fullLine: 'yt-dlp --skip-playlist-after-errors 5 '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: title либо н/д',
    summary: 'Печать title с заменителем для пустых полей (--output-na-placeholder NA --skip-download --print title); в консоли будет NA, если поле пустое; допишите URL.',
    fullLine: 'yt-dlp --output-na-placeholder NA --skip-download --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок Referer для YouTube -F',
    summary: 'Заголовок Referer для HTTP: обход ограничений хотлинка и CDN (--referer https://www.youtube.com/ -F); замените домен под сайт; допишите URL.',
    fullLine: 'yt-dlp --referer https://www.youtube.com/ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок языка (Accept-Language) -F',
    summary: 'Произвольный заголовок без пробелов в значении (--add-header Accept-Language:en-US -F); при сложных значениях соберите список аргументов (в терминах argv) вручную; допишите URL.',
    fullLine: 'yt-dlp --add-header Accept-Language:en-US -F '
  },
  {
    tool: 'yt-dlp',
    token: '· прокси 127.0.0.1 -F',
    summary: 'HTTP(S)-прокси (--proxy http://127.0.0.1:8080 -F); замените хост и порт; допишите URL.',
    fullLine: 'yt-dlp --proxy http://127.0.0.1:8080 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· TLS как Chrome -F',
    summary: 'TLS и HTTP: отпечаток как у Chrome (--impersonate chrome -F); помогает обходить антибот-защиту; допишите URL.',
    fullLine: 'yt-dlp --impersonate chrome -F '
  },
  {
    tool: 'yt-dlp',
    token: '· фильтр по длительности -F',
    summary: 'Отбор по длительности без пробелов в выражении (--match-filter duration<600 -F); подстройте порог; допишите URL.',
    fullLine: 'yt-dlp --match-filter duration<600 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· пакет из urls.txt',
    summary: 'Пакет из файла со списком URL (--batch-file urls.txt); создайте urls.txt рядом с cwd или укажите полный путь без пробелов.',
    fullLine: 'yt-dlp --batch-file urls.txt '
  },
  {
    tool: 'yt-dlp',
    token: '· загрузить info.json',
    summary: 'Повторная обработка из сохранённого JSON (--load-info-json video.info.json); путь без пробелов; допишите -f/-o при необходимости.',
    fullLine: 'yt-dlp --load-info-json video.info.json '
  },
  {
    tool: 'yt-dlp',
    token: '· явно весь плейлист -J',
    summary: 'Явно скачать или разобрать весь плейлист (--yes-playlist -J); когда URL похож на один ролик, но это плейлист; допишите URL.',
    fullLine: 'yt-dlp --yes-playlist -J '
  },
  {
    tool: 'yt-dlp',
    token: '· без конфигов -F',
    summary: 'Игнорировать пользовательские конфиги yt-dlp (--no-config -F); воспроизводимая диагностика; допишите URL.',
    fullLine: 'yt-dlp --no-config -F '
  },
  {
    tool: 'yt-dlp',
    token: '· cookie из файла -F',
    summary: 'Файл cookie в классическом текстовом формате (совместим с Netscape, cookies.txt) (--cookies cookies.txt -F); путь без пробелов; допишите URL.',
    fullLine: 'yt-dlp --cookies cookies.txt -F '
  },
  {
    tool: 'yt-dlp',
    token: '· пауза между скачиваниями',
    summary: 'Пауза между запросами в секундах (--sleep-interval 2); снижает нагрузку на сайт; допишите URL.',
    fullLine: 'yt-dlp --sleep-interval 2 '
  },
  {
    tool: 'yt-dlp',
    token: '· возрастной лимит -F',
    summary: 'Пропуск контента старше возрастного рейтинга (--age-limit 18 -F); подстройте порог; допишите URL.',
    fullLine: 'yt-dlp --age-limit 18 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· ленивый плейлист -J',
    summary: 'Плейлист без глубокого извлечения до скачивания (--lazy-playlist -J); быстрее на длинных списках; допишите URL.',
    fullLine: 'yt-dlp --lazy-playlist -J '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: season_number',
    summary: 'Номер сезона из метаданных без скачивания (--skip-download --print season_number); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print season_number '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: episode_number',
    summary: 'Номер эпизода без скачивания (--skip-download --print episode_number); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print episode_number '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: track',
    summary: 'Название трека (аудио) без скачивания (--skip-download --print track); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print track '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: artists',
    summary: 'Исполнители без скачивания (--skip-download --print artists); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print artists '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: album',
    summary: 'Альбом без скачивания (--skip-download --print album); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print album '
  },
  {
    tool: 'yt-dlp',
    token: '· ремукс в MKV',
    summary: 'После скачивания принудительная перепаковка в MKV (--remux-video mkv); допишите URL и -f/-o.',
    fullLine: 'yt-dlp --remux-video mkv '
  },
  {
    tool: 'yt-dlp',
    token: '· субтитры SRT -F',
    summary: 'Предпочесть субтитры в SRT при выборе форматов (--sub-format srt -F); допишите URL.',
    fullLine: 'yt-dlp --sub-format srt -F '
  },
  {
    tool: 'yt-dlp',
    token: '· превью в JPG',
    summary: 'Конвертировать обложку в JPEG при скачивании (--convert-thumbnails jpg); допишите URL и ключи вывода.',
    fullLine: 'yt-dlp --convert-thumbnails jpg '
  },
  {
    tool: 'yt-dlp',
    token: '· только IPv6 -F',
    summary: 'Список форматов через IPv6 (--force-ipv6 -F); обход части проблем IPv4 и NAT; допишите URL.',
    fullLine: 'yt-dlp --force-ipv6 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· не раньше даты -F',
    summary: 'Только записи после YYYYMMDD (--dateafter 20240101 -F); фильтр плейлиста; допишите URL.',
    fullLine: 'yt-dlp --dateafter 20240101 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· лимит числа скачиваний',
    summary: 'Лимит скачиваний за прогон (--max-downloads 5); удобно для частичных плейлистов; допишите URL.',
    fullLine: 'yt-dlp --max-downloads 5 '
  },
  {
    tool: 'yt-dlp',
    token: '· фильтр по заголовку -F',
    summary: 'Фильтр элементов плейлиста по подстроке заголовка (--match-title trailer -F); регистр по yt-dlp; допишите URL.',
    fullLine: 'yt-dlp --match-title trailer -F '
  },
  {
    tool: 'yt-dlp',
    token: '· ярлык .url',
    summary: 'Записать ярлык .url рядом с медиа без скачивания (--write-link --skip-download); допишите URL.',
    fullLine: 'yt-dlp --write-link --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· SponsorBlock: главы',
    summary: 'Сохранить главы сервиса SponsorBlock для всех категорий (--sponsorblock-mark all); допишите URL.',
    fullLine: 'yt-dlp --sponsorblock-mark all '
  },
  {
    tool: 'yt-dlp',
    token: '· только аудио MP3',
    summary: 'После скачивания извлечь аудиодорожку в MP3 (--extract-audio --audio-format mp3); допишите URL.',
    fullLine: 'yt-dlp --extract-audio --audio-format mp3 '
  },
  {
    tool: 'yt-dlp',
    token: '· качество аудио 192K',
    summary: 'Целевое качество аудио при извлечении (--audio-quality 192K --extract-audio); допишите URL.',
    fullLine: 'yt-dlp --audio-quality 192K --extract-audio '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: n_entries',
    summary: 'Число записей плейлиста без скачивания (--skip-download --print n_entries); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print n_entries '
  },
  {
    tool: 'yt-dlp',
    token: '· вшить главы',
    summary: 'Вшить главы в файл после скачивания (--embed-chapters); допишите URL и -f/-o.',
    fullLine: 'yt-dlp --embed-chapters '
  },
  {
    tool: 'yt-dlp',
    token: '· отметить просмотренным',
    summary: 'Отметить как просмотренное без скачивания (--mark-watched --skip-download); допишите URL (YouTube и др.).',
    fullLine: 'yt-dlp --mark-watched --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· все превью',
    summary: 'Сохранить все превью без видео (--write-all-thumbnails --skip-download); допишите URL.',
    fullLine: 'yt-dlp --write-all-thumbnails --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· без проверки форматов -F',
    summary: 'Список форматов без проверки URL каждого (--no-check-formats -F); быстрее, но менее надёжно; допишите URL.',
    fullLine: 'yt-dlp --no-check-formats -F '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист в обратном порядке -J',
    summary: 'Плейлист в обратном порядке и JSON (--playlist-reverse -J); допишите URL.',
    fullLine: 'yt-dlp --playlist-reverse -J '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист в случайном порядке -J',
    summary: 'Случайный порядок элементов плейлиста и JSON (--playlist-random -J); допишите URL.',
    fullLine: 'yt-dlp --playlist-random -J '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок UA как curl -F',
    summary: 'Подменить заголовок User-Agent (--user-agent curl/8.5.0 -F; типичная строка curl); CDN и WAF; допишите URL.',
    fullLine: 'yt-dlp --user-agent curl/8.5.0 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· лимит при ограничении скорости -F',
    summary: 'Лимит скорости при намеренном снижении отдачи (throttling; ключ --throttled-rate 100K -F); допишите URL.',
    fullLine: 'yt-dlp --throttled-rate 100K -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вшить субтитры',
    summary: 'Вшить субтитры в контейнер после скачивания (--embed-subs; обычно вместе с --write-subs); допишите URL и -f.',
    fullLine: 'yt-dlp --embed-subs '
  },
  {
    tool: 'yt-dlp',
    token: '· субтитры в SRT',
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
    token: '· нарезка по главам',
    summary: 'Разрезать выход по главам (--split-chapters; нужна утилита ffmpeg в каталогах из PATH); допишите URL.',
    fullLine: 'yt-dlp --split-chapters '
  },
  {
    tool: 'yt-dlp',
    token: '· вырезать главы спонсора',
    summary: 'Вырезать главы категории sponsor из финального файла (--remove-chapters sponsor); допишите URL.',
    fullLine: 'yt-dlp --remove-chapters sponsor '
  },
  {
    tool: 'yt-dlp',
    token: '· метаданные плейлиста',
    summary: 'Сохранить метаданные плейлиста рядом с файлами (--write-playlist-metafiles); допишите URL плейлиста.',
    fullLine: 'yt-dlp --write-playlist-metafiles '
  },
  {
    tool: 'yt-dlp',
    token: '· принудительная перезапись',
    summary: 'Перезаписывать существующие файлы без вопросов (--force-overwrites); допишите URL.',
    fullLine: 'yt-dlp --force-overwrites '
  },
  {
    tool: 'yt-dlp',
    token: '· без докачки',
    summary: 'Не продолжать частичные загрузки с .part (--no-continue; начать заново); допишите URL.',
    fullLine: 'yt-dlp --no-continue '
  },
  {
    tool: 'yt-dlp',
    token: '· перекод в MP4',
    summary: 'Перекодировать итог в MP4 постпроцессором (--recode-video mp4); допишите URL и формат источника.',
    fullLine: 'yt-dlp --recode-video mp4 '
  },
  {
    tool: 'yt-dlp',
    token: '· скачать фрагмент по времени',
    summary: 'Скачать только фрагмент времени (--download-sections *0:00-2:00; правый конец правьте вручную); допишите URL.',
    fullLine: 'yt-dlp --download-sections *0:00-2:00 '
  },
  {
    tool: 'yt-dlp',
    token: '· стоп при несовпадении фильтров',
    summary: 'Прервать весь прогон при первом несовпадении --match-filter (--break-match-filters); допишите URL и фильтр.',
    fullLine: 'yt-dlp --break-match-filters '
  },
  {
    tool: 'yt-dlp',
    token: '· без перезаписи после поста',
    summary: 'Не перезаписывать файлы, уже обработанные постпроцессором (--no-post-overwrites); допишите URL.',
    fullLine: 'yt-dlp --no-post-overwrites '
  },
  {
    tool: 'yt-dlp',
    token: '· добавить метаданные',
    summary: 'Записать в файл базовые теги из метаданных площадки (--add-metadata); допишите URL и -f/-o.',
    fullLine: 'yt-dlp --add-metadata '
  },
  {
    tool: 'yt-dlp',
    token: '· HLS через внешний ffmpeg -F',
    summary: 'HLS: тянуть поток через утилиту ffmpeg вместо встроенного загрузчика (--hls-prefer-ffmpeg -F); обход части CDN-глюков; допишите URL.',
    fullLine: 'yt-dlp --hls-prefer-ffmpeg -F '
  },
  {
    tool: 'yt-dlp',
    token: '· путь к ffmpeg',
    summary: 'Явный путь к утилите ffmpeg для постпроцессоров и слияния потоков (--ffmpeg-location ffmpeg); при необходимости замените на полный путь без пробелов; допишите URL.',
    fullLine: 'yt-dlp --ffmpeg-location ffmpeg '
  },
  {
    tool: 'yt-dlp',
    token: '· каталоги в домашней папке',
    summary: 'Переопределить подпапку типа home для вывода (--paths home:ytdl-out); поменяйте ytdl-out под свою структуру; допишите URL.',
    fullLine: 'yt-dlp --paths home:ytdl-out '
  },
  {
    tool: 'yt-dlp',
    token: '· без журнала archive.txt',
    summary: 'Игнорировать журнал archive.txt даже если он в конфиге (--no-download-archive); допишите URL.',
    fullLine: 'yt-dlp --no-download-archive '
  },
  {
    tool: 'yt-dlp',
    token: '· консоль в UTF-8',
    summary: 'Принудительно UTF-8 для вывода yt-dlp (--encoding utf-8); кириллица и символы Unicode в консоли Windows; допишите URL.',
    fullLine: 'yt-dlp --encoding utf-8 '
  },
  {
    tool: 'yt-dlp',
    token: '· ошибка по URL не рвёт плейлист -F',
    summary: 'Плейлист: не прерывать весь прогон при ошибке одного URL (--break-per-input -F); допишите URL.',
    fullLine: 'yt-dlp --break-per-input -F '
  },
  {
    tool: 'yt-dlp',
    token: '· проверка всех форматов -F',
    summary: 'Проверить каждый формат по URL (--check-all-formats -F); медленно, зато без сюрпризов при скачивании; допишите URL.',
    fullLine: 'yt-dlp --check-all-formats -F '
  },
  {
    tool: 'yt-dlp',
    token: '· таймаут сокета 60 с',
    summary: 'Таймаут сокета 60 с (--socket-timeout 60); медленные CDN и прокси; допишите URL.',
    fullLine: 'yt-dlp --socket-timeout 60 '
  },
  {
    tool: 'yt-dlp',
    token: '· метаданные в xattr',
    summary: 'Записать метаданные в xattr файла где поддерживается ОС (--xattrs); допишите URL.',
    fullLine: 'yt-dlp --xattrs '
  },
  {
    tool: 'yt-dlp',
    token: '· обновление yt-dlp (-U)',
    summary: 'Обновить yt-dlp до последней стабильной сборки (-U); URL не нужен; закройте процессы, если бинарь залочен.',
    fullLine: 'yt-dlp -U '
  },
  {
    tool: 'yt-dlp',
    token: '· совместимость: без заглушек YT',
    summary: 'Совместимость: не подменять недоступные ролики YouTube заглушкой (--compat-options no-youtube-unavailable-videos -F); допишите URL.',
    fullLine: 'yt-dlp --compat-options no-youtube-unavailable-videos -F '
  },
  {
    tool: 'yt-dlp',
    token: '· очистка кэша модулей',
    summary: 'Сбросить кэш модулей извлечения yt-dlp (--rm-cache-dir); URL не нужен; помогает при «битом» кэше и неверных форматах.',
    fullLine: 'yt-dlp --rm-cache-dir'
  },
  {
    tool: 'yt-dlp',
    token: '· папка кэша -F',
    summary: 'Альтернативный путь кэша модулей извлечения (--cache-dir cache -F); путь без пробелов; допишите URL.',
    fullLine: 'yt-dlp --cache-dir cache -F '
  },
  {
    tool: 'yt-dlp',
    token: '· сохранять фрагменты -F',
    summary: 'Не удалять промежуточные фрагменты после слияния (--keep-fragments -F); диагностика потоков DASH и HLS; допишите URL.',
    fullLine: 'yt-dlp --keep-fragments -F '
  },
  {
    tool: 'yt-dlp',
    token: '· буфер чтения 16K -F',
    summary: 'Размер буфера чтения для медленных CDN (--buffer-size 16K -F); подстройте при необходимости; допишите URL.',
    fullLine: 'yt-dlp --buffer-size 16K -F '
  },
  {
    tool: 'yt-dlp',
    token: '· стоп при недоступном фрагменте',
    summary: 'Прервать загрузку при первом недоступном фрагменте (--abort-on-unavailable-fragments); жёсткий режим; допишите URL.',
    fullLine: 'yt-dlp --abort-on-unavailable-fragments '
  },
  {
    tool: 'yt-dlp',
    token: '· субтитры en и ru -F',
    summary: 'Выбор языков субтитров без кавычек (--sub-langs en.*,ru.* -F); пары «язык и регион» регуляркой; допишите URL.',
    fullLine: 'yt-dlp --sub-langs en.*,ru.* -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: release_date',
    summary: 'Дата релиза YYYYMMDD без скачивания (--skip-download --print release_date); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print release_date '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: album_artist',
    summary: 'Исполнитель альбома без скачивания (--skip-download --print album_artist); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print album_artist '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: track_number',
    summary: 'Номер трека внутри альбома без скачивания (--skip-download --print track_number); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print track_number '
  },
  {
    tool: 'yt-dlp',
    token: '· cookie из Brave',
    summary: 'Сухой прогон с файлами cookie из Brave (--skip-download --cookies-from-browser brave); допишите URL.',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser brave '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: series',
    summary: 'Название серии или шоу без скачивания (--skip-download --print series); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print series '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: season',
    summary: 'Сезон (строка площадки) без скачивания (--skip-download --print season); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print season '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: episode',
    summary: 'Эпизод (строка площадки) без скачивания (--skip-download --print episode); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print episode '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: display_id',
    summary: 'Короткий display_id без скачивания (--skip-download --print display_id); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print display_id '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: webpage_url_basename',
    summary: 'Последний сегмент пути страницы без скачивания (--skip-download --print webpage_url_basename); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print webpage_url_basename '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: fulltitle',
    summary: 'Полный заголовок с плейлистом или серией без скачивания (--skip-download --print fulltitle); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print fulltitle '
  },
  {
    tool: 'yt-dlp',
    token: '· SponsorBlock: вырезать',
    summary: 'Вырезать вставки категории sponsor (реклама в ролике, SponsorBlock) постпроцессором (--sponsorblock-remove sponsor); допишите URL и -f.',
    fullLine: 'yt-dlp --sponsorblock-remove sponsor '
  },
  {
    tool: 'yt-dlp',
    token: '· встроенный загрузчик -F',
    summary: 'Встроенный загрузчик фрагментов (--downloader native -F); обход части сбоев утилиты ffmpeg; допишите URL.',
    fullLine: 'yt-dlp --downloader native -F '
  },
  {
    tool: 'yt-dlp',
    token: '· TLS: старое повторное согласование -F',
    summary: 'Небезопасное повторное согласование TLS по старой схеме (legacy renegotiation, --legacy-server-connect -F) для старых CDN; допишите URL.',
    fullLine: 'yt-dlp --legacy-server-connect -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без проверки обновлений -F',
    summary: 'Не запрашивать в сети проверку обновлений yt-dlp (--no-call-home -F); допишите URL.',
    fullLine: 'yt-dlp --no-call-home -F '
  },
  {
    tool: 'yt-dlp',
    token: '· не новее даты -F',
    summary: 'Только ролики не новее даты (--datebefore 20991231 -F; поменяйте дату YYYYMMDD); допишите URL.',
    fullLine: 'yt-dlp --datebefore 20991231 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вшить info.json',
    summary: 'Встроить .info.json в контейнер после скачивания (--embed-info-json); допишите URL и -f/-o.',
    fullLine: 'yt-dlp --embed-info-json '
  },
  {
    tool: 'yt-dlp',
    token: '· логин из .netrc -F',
    summary: 'Учётные данные из ~/.netrc (--netrc -F); для сайтов с логином; допишите URL.',
    fullLine: 'yt-dlp --netrc -F '
  },
  {
    tool: 'yt-dlp',
    token: '· принудительно общий экстрактор -F',
    summary: 'Принудительно общий модуль извлечения generic (--force-generic-extractor -F) при сбое распознавания; допишите URL.',
    fullLine: 'yt-dlp --force-generic-extractor -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: channel_follower_count',
    summary: 'Число подписчиков канала без скачивания (--skip-download --print channel_follower_count); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print channel_follower_count '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: average_rating',
    summary: 'Средний рейтинг и оценка без скачивания (--skip-download --print average_rating); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print average_rating '
  },
  {
    tool: 'yt-dlp',
    token: '· все URL в журнал',
    summary: 'Список всех извлечённых URL в журнал (--write-all-urls --skip-download); допишите URL.',
    fullLine: 'yt-dlp --write-all-urls --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· дамп HTML-страниц',
    summary: 'Сырой дамп HTML-страниц модуля извлечения (extractor) в файлы (--dump-pages --skip-download); диагностика разметки и ответов API; допишите URL.',
    fullLine: 'yt-dlp --dump-pages --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· без прогресс-бара -F',
    summary: 'Без прогресс-бара в консоли (--no-progress -F); чище вывод в длинных списках; допишите URL.',
    fullLine: 'yt-dlp --no-progress -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: is_private',
    summary: 'Признак приватного или ограниченного ролика без скачивания (--skip-download --print is_private); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print is_private '
  },
  {
    tool: 'yt-dlp',
    token: '· один ролик -J',
    summary: 'JSON метаданных только для одного ролика из URL-плейлиста (--no-playlist -J); допишите URL.',
    fullLine: 'yt-dlp --no-playlist -J '
  },
  {
    tool: 'yt-dlp',
    token: '· HLS в контейнере MPEG-TS -F',
    summary: 'HLS: сохранять как MPEG-TS сегменты (--hls-use-mpegts -F) при проблемах с фрагментами; допишите URL.',
    fullLine: 'yt-dlp --hls-use-mpegts -F '
  },
  {
    tool: 'yt-dlp',
    token: '· субтитры без видео',
    summary: 'Скачать ручные субтитры без видео (--write-subs --skip-download); допишите URL.',
    fullLine: 'yt-dlp --write-subs --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· макс. пауза HTTP -F',
    summary: 'Верхняя граница пауз между HTTP-запросами (--max-sleep-interval 10 -F); подстройте секунды; допишите URL.',
    fullLine: 'yt-dlp --max-sleep-interval 10 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· пауза перед повтором -F',
    summary: 'Пауза между повторными попытками загрузки (--retry-sleep 5 -F); допишите URL.',
    fullLine: 'yt-dlp --retry-sleep 5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· мин. размер файла -F',
    summary: 'Пропускать форматы меньше порога (--min-filesize 100K -F); поменяйте размер при необходимости; допишите URL.',
    fullLine: 'yt-dlp --min-filesize 100K -F '
  },
  {
    tool: 'yt-dlp',
    token: '· повторы доступа к диску -F',
    summary: 'Повторы при ошибках чтения и записи на диске (--file-access-retries 5 -F); допишите URL.',
    fullLine: 'yt-dlp --file-access-retries 5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: playlist',
    summary: 'Название плейлиста без скачивания (--skip-download --print playlist); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print playlist '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: playlist_autonumber',
    summary: 'Автонумерация в шаблоне -o без скачивания (--skip-download --print playlist_autonumber); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print playlist_autonumber '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: modified_timestamp',
    summary: 'Unix-время последнего изменения метаданных без скачивания (--skip-download --print modified_timestamp); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print modified_timestamp '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: release_timestamp',
    summary: 'Unix-время релиза и премьеры без скачивания (--skip-download --print release_timestamp); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print release_timestamp '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: upload_timestamp',
    summary: 'Unix-время загрузки на площадку без скачивания (--skip-download --print upload_timestamp); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print upload_timestamp '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: stretched_ratio',
    summary: 'Соотношение сторон после растяжения (stretched_ratio) без скачивания (--skip-download --print stretched_ratio); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print stretched_ratio '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: location',
    summary: 'Данные о местоположении из метаданных без скачивания (--skip-download --print location); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print location '
  },
  {
    tool: 'yt-dlp',
    token: '· YouTube, Android-клиент -F',
    summary: 'YouTube: клиент Android через --extractor-args (--extractor-args youtube:player_client=android -F); обход части веб-ограничений; допишите URL.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=android -F '
  },
  {
    tool: 'yt-dlp',
    token: '· YouTube, встроенный TV -F',
    summary: 'YouTube: встроенный TV-клиент (--extractor-args youtube:player_client=tv_embedded -F); допишите URL.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=tv_embedded -F '
  },
  {
    tool: 'yt-dlp',
    token: '· YouTube, iOS-клиент -F',
    summary: 'YouTube: iOS-клиент через --extractor-args (--extractor-args youtube:player_client=ios -F); допишите URL.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=ios -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: alternate_title',
    summary: 'Альтернативный заголовок без скачивания (--skip-download --print alternate_title); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print alternate_title '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: extractor_key',
    summary: 'Внутренний ключ модуля извлечения (extractor_key) без скачивания (--skip-download --print extractor_key); сверка с `--print extractor`; допишите URL.',
    fullLine: 'yt-dlp --skip-download --print extractor_key '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист: URL страницы',
    summary: 'Плоский плейлист: URL страницы каждого элемента без глубокого извлечения (--flat-playlist --skip-download --print webpage_url); допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist --skip-download --print webpage_url '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход DE -F',
    summary: 'Гео-обход с кодом страны DE (--geo-bypass-country DE -F); поменяйте ISO-код при необходимости; допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country DE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: channel_is_verified',
    summary: 'Флаг верифицированного канала без скачивания (--skip-download --print channel_is_verified); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print channel_is_verified '
  },
  {
    tool: 'yt-dlp',
    token: '· cookie из Opera',
    summary: 'Сухой прогон с файлами cookie из Opera (--skip-download --cookies-from-browser opera); допишите URL.',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser opera '
  },
  {
    tool: 'yt-dlp',
    token: '· cookie из Chromium',
    summary: 'Сухой прогон с файлами cookie из Chromium (--skip-download --cookies-from-browser chromium); допишите URL.',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser chromium '
  },
  {
    tool: 'yt-dlp',
    token: '· cookie из Vivaldi',
    summary: 'Сухой прогон с файлами cookie из Vivaldi (--skip-download --cookies-from-browser vivaldi); допишите URL.',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser vivaldi '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход FR -F',
    summary: 'Гео-обход с кодом страны FR (--geo-bypass-country FR -F); поменяйте ISO-код при необходимости; допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country FR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· YouTube, моб. веб-клиент -F',
    summary: 'YouTube: мобильный веб-клиент mweb через --extractor-args (--extractor-args youtube:player_client=mweb -F); допишите URL.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=mweb -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: requested_formats',
    summary: 'Список запрошенных и выбранных форматов без скачивания (--skip-download --print requested_formats); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print requested_formats '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: requested_subtitles',
    summary: 'Запрошенные субтитры без скачивания (--skip-download --print requested_subtitles); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print requested_subtitles '
  },
  {
    tool: 'yt-dlp',
    token: '· cookie из Safari',
    summary: 'Сухой прогон с файлами cookie из Safari (--skip-download --cookies-from-browser safari); macOS и Windows — по наличию профиля; допишите URL.',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser safari '
  },
  {
    tool: 'yt-dlp',
    token: '· YouTube, веб-автор -F',
    summary: 'YouTube: web_creator через --extractor-args (--extractor-args youtube:player_client=web_creator -F); YouTube Studio и ограниченные кейсы; допишите URL.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=web_creator -F '
  },
  {
    tool: 'yt-dlp',
    token: '· YouTube, встраиваемый веб -F',
    summary: 'YouTube: web_embedded через --extractor-args (--extractor-args youtube:player_client=web_embedded -F); встраиваемый плеер; допишите URL.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=web_embedded -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход GB -F',
    summary: 'Гео-обход с кодом страны GB (--geo-bypass-country GB -F); поменяйте ISO-код при необходимости; допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GB -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: formats',
    summary: 'Словарь доступных форматов без скачивания (--skip-download --print formats); тяжёлый вывод — для диагностики; допишите URL.',
    fullLine: 'yt-dlp --skip-download --print formats '
  },
  {
    tool: 'yt-dlp',
    token: '· симуляция слияния best',
    summary: 'Сухой прогон выбора слияния видео и аудио (--simulate -f bestvideo+bestaudio/best, шаблон «лучшее видео плюс лучшее аудио» или best); без файлов; допишите URL.',
    fullLine: 'yt-dlp --simulate -f bestvideo+bestaudio/best '
  },
  {
    tool: 'yt-dlp',
    token: '· несколько потоков -F',
    summary: 'Список форматов с учётом мультипотока (--multi-streams -F); DASH и HLS с раздельными потоками; допишите URL.',
    fullLine: 'yt-dlp --multi-streams -F '
  },
  {
    tool: 'yt-dlp',
    token: '· совместимость 2024 -F',
    summary: 'Совместимость «как в 2024+» (--compat-options 2024 -F); задел под будущие изменения yt-dlp; допишите URL.',
    fullLine: 'yt-dlp --compat-options 2024 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· один ролик: заголовок',
    summary: 'Только один ролик из URL-плейлиста и заголовок без скачивания (--no-playlist --skip-download --print title); допишите URL.',
    fullLine: 'yt-dlp --no-playlist --skip-download --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист: модуль извлечения',
    summary: 'Плоский плейлист: имя модуля извлечения (extractor) у каждого элемента без глубокого извлечения (--flat-playlist --skip-download --print extractor); допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist --skip-download --print extractor '
  },
  {
    tool: 'yt-dlp',
    token: '· без внешних плейлистов -J',
    summary: 'JSON плейлиста без разрешения внешних ссылок на другие плейлисты (--no-remote-playlist -J); меньше сетевых обходов; допишите URL.',
    fullLine: 'yt-dlp --no-remote-playlist -J '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход JP -F',
    summary: 'Гео-обход с кодом страны JP (--geo-bypass-country JP -F); региональные ограничения; допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country JP -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход CA -F',
    summary: 'Гео-обход с кодом страны CA (--geo-bypass-country CA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: thumbnails',
    summary: 'Словарь URL миниатюр (thumbnails) без скачивания (--skip-download --print thumbnails); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print thumbnails '
  },
  {
    tool: 'yt-dlp',
    token: '· YouTube, Safari-веб -F',
    summary: 'YouTube: web_safari через --extractor-args (--extractor-args youtube:player_client=web_safari -F); Safari-подобный веб-клиент; допишите URL.',
    fullLine: 'yt-dlp --extractor-args youtube:player_client=web_safari -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: playlist_channel',
    summary: 'Имя канала плейлиста без скачивания (--skip-download --print playlist_channel); допишите URL плейлиста.',
    fullLine: 'yt-dlp --skip-download --print playlist_channel '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: playlist_channel_id',
    summary: 'Идентификатор канала плейлиста без скачивания (--skip-download --print playlist_channel_id); допишите URL плейлиста.',
    fullLine: 'yt-dlp --skip-download --print playlist_channel_id '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: playlist_uploader',
    summary: 'Автор плейлиста (uploader) без скачивания (--skip-download --print playlist_uploader); допишите URL плейлиста.',
    fullLine: 'yt-dlp --skip-download --print playlist_uploader '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: playlist_uploader_id',
    summary: 'ID автора плейлиста без скачивания (--skip-download --print playlist_uploader_id); допишите URL плейлиста.',
    fullLine: 'yt-dlp --skip-download --print playlist_uploader_id '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист: тип записи',
    summary: 'Плоский плейлист: тип записи (video, playlist и т. д., поле _type) (--flat-playlist --skip-download --print _type); допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist --skip-download --print _type '
  },
  {
    tool: 'yt-dlp',
    token: '· слияние в MP4',
    summary: 'Слияние потоков в MP4 при мультиплексировании (--merge-output-format mp4); допишите URL и -f …',
    fullLine: 'yt-dlp --merge-output-format mp4 '
  },
  {
    tool: 'yt-dlp',
    token: '· без сохранения видео',
    summary: 'После извлечения аудио не оставлять исходное видео (--no-keep-video); допишите URL и --extract-audio при необходимости.',
    fullLine: 'yt-dlp --no-keep-video '
  },
  {
    tool: 'yt-dlp',
    token: '· загрузчик ffmpeg',
    summary: 'Тянуть фрагменты через внешнюю утилиту ffmpeg (--external-downloader ffmpeg); обход части встроенных загрузчиков; допишите URL.',
    fullLine: 'yt-dlp --external-downloader ffmpeg '
  },
  {
    tool: 'yt-dlp',
    token: '· разбор метаданных title',
    summary: 'Постобработка метаданных: перезапись title из шаблона (--parse-metadata title:%(title)s); допишите URL.',
    fullLine: 'yt-dlp --parse-metadata title:%(title)s '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход AU -F',
    summary: 'Гео-обход с кодом страны AU (--geo-bypass-country AU -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход BR -F',
    summary: 'Гео-обход с кодом страны BR (--geo-bypass-country BR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход IT -F',
    summary: 'Гео-обход с кодом страны IT (--geo-bypass-country IT -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country IT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: playlist_webpage_url',
    summary: 'URL страницы плейлиста без скачивания (--skip-download --print playlist_webpage_url); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print playlist_webpage_url '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: webpage_url_scheme',
    summary: 'Схема URL страницы (http и https) без скачивания (--skip-download --print webpage_url_scheme); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print webpage_url_scheme '
  },
  {
    tool: 'yt-dlp',
    token: '· несколько видеопотоков -F',
    summary: 'Список форматов с учётом нескольких видеопотоков (--video-multistreams -F); редкие дорожки с несколькими ракурсами; допишите URL.',
    fullLine: 'yt-dlp --video-multistreams -F '
  },
  {
    tool: 'yt-dlp',
    token: '· несколько аудиопотоков -F',
    summary: 'Список форматов с учётом нескольких аудиопотоков (--audio-multistreams -F); мультиязык; допишите URL.',
    fullLine: 'yt-dlp --audio-multistreams -F '
  },
  {
    tool: 'yt-dlp',
    token: '· тихий режим -F',
    summary: 'Минимум служебного вывода при списке форматов (--quiet -F); допишите URL.',
    fullLine: 'yt-dlp --quiet -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без cookie -F',
    summary: 'Игнорировать файлы cookie из браузера или с диска (--no-cookies -F); изолированный прогон; допишите URL.',
    fullLine: 'yt-dlp --no-cookies -F '
  },
  {
    tool: 'yt-dlp',
    token: '· совместимость 2025 -F',
    summary: 'Совместимость с поведением yt-dlp 2025 (--compat-options 2025 -F); допишите URL.',
    fullLine: 'yt-dlp --compat-options 2025 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· стоп если файл есть -F',
    summary: 'Остановиться, если целевой файл уже существует (--break-on-existing -F); допишите URL и шаблон -o при необходимости.',
    fullLine: 'yt-dlp --break-on-existing -F '
  },
  {
    tool: 'yt-dlp',
    token: '· время файла с сервера',
    summary: 'Выставлять время файла по Last-Modified с сервера (--mtime); противоположность --no-mtime; допишите URL.',
    fullLine: 'yt-dlp --mtime '
  },
  {
    tool: 'yt-dlp',
    token: '· порог проверки форматов -F',
    summary: 'Порог для --check-formats (доля битрейта, здесь 1.5) и список форматов; допишите URL.',
    fullLine: 'yt-dlp --check-formats-threshold 1.5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без SponsorBlock -F',
    summary: 'Не обращаться к веб-API сервиса SponsorBlock (--no-sponsorblock -F); чистый список форматов; допишите URL.',
    fullLine: 'yt-dlp --no-sponsorblock -F '
  },
  {
    tool: 'yt-dlp',
    token: '· динамический MPD -F',
    summary: 'Разрешить динамический манифест DASH (MPD) с обновлением (--allow-dynamic-mpd -F); допишите URL.',
    fullLine: 'yt-dlp --allow-dynamic-mpd -F '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок окна консоли -F',
    summary: 'Заголовок окна консоли с прогрессом (--console-title -F); допишите URL.',
    fullLine: 'yt-dlp --console-title -F '
  },
  {
    tool: 'yt-dlp',
    token: '· только встроенный загрузчик -F',
    summary: 'Только встроенный загрузчик, без внешних обёрток (--no-external-downloader -F); допишите URL.',
    fullLine: 'yt-dlp --no-external-downloader -F '
  },
  {
    tool: 'yt-dlp',
    token: '· чистить info.json',
    summary:
      'Удалить временный .info.json после успешной загрузки (--clean-infojson); обычно вместе с --write-info-json; допишите URL и ключи вывода.',
    fullLine: 'yt-dlp --clean-infojson '
  },
  {
    tool: 'yt-dlp',
    token: '· не писать info.json -F',
    summary: 'Не записывать .info.json рядом с выходом (--no-write-info-json -F); допишите URL.',
    fullLine: 'yt-dlp --no-write-info-json -F '
  },
  {
    tool: 'yt-dlp',
    token: '· аргументы внешнего загрузчика -F',
    summary: 'Доп. аргументы внешней программе загрузки (downloader) без кавычек (--external-downloader-args ffmpeg_i:-nostdin -F); префикс ffmpeg_i и флаг -nostdin отключают stdin у утилиты ffmpeg; допишите URL при использовании внешнего загрузчика.',
    fullLine: 'yt-dlp --external-downloader-args ffmpeg_i:-nostdin -F '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист: все URL',
    summary: 'Плоский плейлист: все URL элементов без скачивания (--flat-playlist --print urls --skip-download); допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist --print urls --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· свой шаблон прогресса -F',
    summary: 'Свой шаблон строки прогресса (--progress-template predownload:Preparing %(info.title)s -F); допишите URL.',
    fullLine: 'yt-dlp --progress-template predownload:Preparing %(info.title)s -F '
  },
  {
    tool: 'yt-dlp',
    token: '· пауза перед субтитрами -F',
    summary: 'Пауза перед скачиванием субтитров (--sleep-subtitles 5 -F); допишите URL.',
    fullLine: 'yt-dlp --sleep-subtitles 5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· лучший формат субтитров -F',
    summary: 'Предпочесть лучший доступный формат субтитров (--sub-format best -F); допишите URL.',
    fullLine: 'yt-dlp --sub-format best -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход NL -F',
    summary: 'Гео-обход с кодом страны NL (--geo-bypass-country NL -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country NL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· ключевые кадры на резах',
    summary: 'Принудительные ключевые кадры на границах нарезки и склейки (--force-keyframes-at-cuts); для постпроцессора утилиты ffmpeg; допишите URL и -f …',
    fullLine: 'yt-dlp --force-keyframes-at-cuts '
  },
  {
    tool: 'yt-dlp',
    token: '· без MPEG-TS в HLS -F',
    summary: 'Отключить MPEG-TS для HLS (--no-hls-use-mpegts -F); противоположность --hls-use-mpegts; допишите URL.',
    fullLine: 'yt-dlp --no-hls-use-mpegts -F '
  },
  {
    tool: 'yt-dlp',
    token: '· совместимость: без прямого слияния -F',
    summary: 'Не сливать потоки напрямую в mkv и webm (--compat-options no-direct-merge -F); диагностика слияния потоков и вызовов ffmpeg; допишите URL.',
    fullLine: 'yt-dlp --compat-options no-direct-merge -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход ES -F',
    summary: 'Гео-обход с кодом страны ES (--geo-bypass-country ES -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country ES -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход PL -F',
    summary: 'Гео-обход с кодом страны PL (--geo-bypass-country PL -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео-обход SE -F',
    summary: 'Гео-обход с кодом страны SE (--geo-bypass-country SE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· не вшивать метаданные',
    summary: 'Не встраивать метаданные в выходной файл (--no-embed-metadata); противоположность --embed-metadata; допишите URL.',
    fullLine: 'yt-dlp --no-embed-metadata '
  },
  {
    tool: 'yt-dlp',
    token: '· элементы плейлиста 1–10 -F',
    summary: 'Только элементы плейлиста 1…10 (--playlist-items 1:10 -F); без полного разбора хвоста; допишите URL плейлиста.',
    fullLine: 'yt-dlp --playlist-items 1:10 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· слияние в WebM',
    summary: 'Слияние потоков в WebM при мультиплексировании (--merge-output-format webm); допишите URL и -f …',
    fullLine: 'yt-dlp --merge-output-format webm '
  },
  {
    tool: 'yt-dlp',
    token: '· нет форматов — не ошибка -F',
    summary: 'Не падать, если форматов нет (--ignore-no-formats-error -F); диагностика геоблокировок, DRM и возрастных ограничений; допишите URL.',
    fullLine: 'yt-dlp --ignore-no-formats-error -F '
  },
  {
    tool: 'yt-dlp',
    token: '· не сохранять превью -F',
    summary: 'Не сохранять миниатюру (thumbnail), даже если шаблон подразумевает (--no-write-thumbnail -F); допишите URL.',
    fullLine: 'yt-dlp --no-write-thumbnail -F '
  },
  {
    tool: 'yt-dlp',
    token: '· только аудио AAC',
    summary: 'Извлечь аудио в AAC (--extract-audio --audio-format aac); допишите URL.',
    fullLine: 'yt-dlp --extract-audio --audio-format aac '
  },
  {
    tool: 'yt-dlp',
    token: '· не вшивать обложку',
    summary: 'Не встраивать обложку в контейнер (--no-embed-thumbnail); противоположность --embed-thumbnail; допишите URL.',
    fullLine: 'yt-dlp --no-embed-thumbnail '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: title',
    summary: 'Записать поле title в рядом лежащий текстовый файл без скачивания (--print-to-file title flux-ytdlp-title.txt --skip-download); допишите URL.',
    fullLine: 'yt-dlp --print-to-file title flux-ytdlp-title.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· разрешить file:// -F',
    summary: 'Разрешить file:// URL в аргументах (--enable-file-urls -F); только для доверенных путей; допишите URL.',
    fullLine: 'yt-dlp --enable-file-urls -F '
  },
  {
    tool: 'yt-dlp',
    token: '· исходящий IP (bind) -F',
    summary: 'Исходящий IP через bind (--source-address 198.51.100.2 -F, TEST-NET-2); допишите URL.',
    fullLine: 'yt-dlp --source-address 198.51.100.2 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: annotations',
    summary: 'Сырые аннотации метаданных без скачивания (--skip-download --print annotations); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print annotations '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: storyboards',
    summary: 'Доски storyboard (если отдаёт площадка) без скачивания (--skip-download --print storyboards); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print storyboards '
  },
  {
    tool: 'yt-dlp',
    token: '· SponsorBlock: заголовки глав',
    summary: 'Сервис SponsorBlock: главы и шаблон заголовка сегмента (--sponsorblock-mark all --sponsorblock-chapter-title %(category)s); допишите URL.',
    fullLine: 'yt-dlp --sponsorblock-mark all --sponsorblock-chapter-title %(category)s '
  },
  {
    tool: 'yt-dlp',
    token: '· склейка плейлиста: никогда -F',
    summary: 'Политика склейки плейлиста в один поток (--concat-playlist never -F); допишите URL.',
    fullLine: 'yt-dlp --concat-playlist never -F '
  },
  {
    tool: 'yt-dlp',
    token: '· постправка контейнера: только предупреждения -F',
    summary: 'Политика постправок контейнера после скачивания (--fixup warn -F); допишите URL.',
    fullLine: 'yt-dlp --fixup warn -F '
  },
  {
    tool: 'yt-dlp',
    token: '· только модуль youtube -F',
    summary: 'Ограничить набор модулей извлечения (--use-extractors youtube -F); допишите URL.',
    fullLine: 'yt-dlp --use-extractors youtube -F '
  },
  {
    tool: 'yt-dlp',
    token: '· поиск по умолчанию -F',
    summary: 'Поиск по умолчанию, если ввод не похож на URL (--default-search auto: -F); допишите запрос.',
    fullLine: 'yt-dlp --default-search auto: -F '
  },
  {
    tool: 'yt-dlp',
    token: '· игнор динамики MPD -F',
    summary: 'Игнорировать динамическое обновление манифеста DASH (MPD) (--ignore-dynamic-mpd -F); стабильнее на коротком окне; допишите URL.',
    fullLine: 'yt-dlp --ignore-dynamic-mpd -F '
  },
  {
    tool: 'yt-dlp',
    token: '· другой API SponsorBlock -F',
    summary: 'Альтернативный адрес веб-API сервиса SponsorBlock (--sponsorblock-api https://sponsor.ajay.app -F) при сбоях сервера по умолчанию; допишите URL.',
    fullLine: 'yt-dlp --sponsorblock-api https://sponsor.ajay.app -F '
  },
  {
    tool: 'yt-dlp',
    token: '· пути к конфигам -F',
    summary: 'Доп. файл конфигурации рядом с задачей (--config-locations yt-dlp.conf -F); создайте yt-dlp.conf при необходимости; допишите URL.',
    fullLine: 'yt-dlp --config-locations yt-dlp.conf -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео MX -F',
    summary: 'Гео-обход с кодом страны MX (--geo-bypass-country MX -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MX -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео KR -F',
    summary: 'Гео-обход с кодом страны KR (--geo-bypass-country KR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country KR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео IN -F',
    summary: 'Гео-обход с кодом страны IN (--geo-bypass-country IN -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country IN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео TR -F',
    summary: 'Гео-обход с кодом страны TR (--geo-bypass-country TR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео NO -F',
    summary: 'Гео-обход с кодом страны NO (--geo-bypass-country NO -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country NO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео CH -F',
    summary: 'Гео-обход с кодом страны CH (--geo-bypass-country CH -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовки «клиент за прокси» (--xfwd) -F',
    summary: 'Добавить заголовки X-Forwarded-For и X-Forwarded-Proto к HTTP (--xfwd -F); для обратного прокси и отладки запросов; допишите URL.',
    fullLine: 'yt-dlp --xfwd -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без cookie из браузера -F',
    summary: 'Явно отключить подстановку cookie из браузера (--no-cookies-from-browser -F); если мешают профили браузера и переменные среды; допишите URL.',
    fullLine: 'yt-dlp --no-cookies-from-browser -F '
  },
  {
    tool: 'yt-dlp',
    token: '· аргументы ffmpeg для загрузчика -F',
    summary: 'Доп. аргументы встроенному загрузчику на базе ffmpeg (--downloader-args ffmpeg:-nostdin -F); -nostdin отключает stdin у утилиты ffmpeg; допишите URL.',
    fullLine: 'yt-dlp --downloader-args ffmpeg:-nostdin -F '
  },
  {
    tool: 'yt-dlp',
    token: '· с рекламой -F',
    summary: 'Не вырезать рекламные вставки в плейлистах (--include-ads -F); допишите URL.',
    fullLine: 'yt-dlp --include-ads -F '
  },
  {
    tool: 'yt-dlp',
    token: '· двухфакторный код',
    summary: 'TV Everywhere и двухфакторная проверка (2FA): одноразовый код (--twofactor 123456); замените на актуальный TOTP; допишите URL.',
    fullLine: 'yt-dlp --twofactor 123456 '
  },
  {
    tool: 'yt-dlp',
    token: '· пароль к видео',
    summary: 'Пароль возрастного или закрытого видео (--video-password PASSWORD); замените PASSWORD на реальный; допишите URL.',
    fullLine: 'yt-dlp --video-password PASSWORD '
  },
  {
    tool: 'yt-dlp',
    token: '· TV Everywhere: Rogers -F',
    summary: 'Adobe Pass MSO id для TV Everywhere (--ap-mso Rogers -F); подставьте своего провайдера; допишите URL.',
    fullLine: 'yt-dlp --ap-mso Rogers -F '
  },
  {
    tool: 'yt-dlp',
    token: '· TV Everywhere: логин -F',
    summary: 'Логин TV Everywhere (--ap-username user@example.com -F); замените на свой аккаунт; допишите URL.',
    fullLine: 'yt-dlp --ap-username user@example.com -F '
  },
  {
    tool: 'yt-dlp',
    token: '· параллельно загрузок 2 -F',
    summary: 'Параллельные загрузки фрагментов и потоков (--concurrent-downloads 2 -F); подстройте число; допишите URL.',
    fullLine: 'yt-dlp --concurrent-downloads 2 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео NZ -F',
    summary: 'Гео-обход с кодом страны NZ (--geo-bypass-country NZ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country NZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ZA -F',
    summary: 'Гео-обход с кодом страны ZA (--geo-bypass-country ZA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country ZA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· TV Everywhere: пароль',
    summary: 'Пароль TV Everywhere и Adobe Pass (--ap-password PASSWORD); замените PASSWORD на реальный; допишите URL.',
    fullLine: 'yt-dlp --ap-password PASSWORD '
  },
  {
    tool: 'yt-dlp',
    token: '· клиентский сертификат PEM',
    summary: 'Клиентский TLS-сертификат (--client-certificate client.pem); положите PEM рядом с рабочим каталогом или укажите абсолютный путь без кавычек; допишите URL.',
    fullLine: 'yt-dlp --client-certificate client.pem '
  },
  {
    tool: 'yt-dlp',
    token: '· гео: прокси проверки -F',
    summary: 'Прокси только для гео-проверки (--geo-verification-proxy … -F); замените хост и порт при необходимости; допишите URL.',
    fullLine: 'yt-dlp --geo-verification-proxy http://127.0.0.1:8888 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео AT -F',
    summary: 'Гео-обход с кодом страны AT (--geo-bypass-country AT -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео DK -F',
    summary: 'Гео-обход с кодом страны DK (--geo-bypass-country DK -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country DK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео FI -F',
    summary: 'Гео-обход с кодом страны FI (--geo-bypass-country FI -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country FI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео GR -F',
    summary: 'Гео-обход с кодом страны GR (--geo-bypass-country GR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео PT -F',
    summary: 'Гео-обход с кодом страны PT (--geo-bypass-country PT -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео BE -F',
    summary: 'Гео-обход с кодом страны BE (--geo-bypass-country BE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео IE -F',
    summary: 'Гео-обход с кодом страны IE (--geo-bypass-country IE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country IE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· ключ к сертификату PEM',
    summary: 'Приватный ключ к клиентскому TLS-сертификату (--client-certificate-key key.pem); положите PEM рядом с рабочим каталогом или укажите путь без кавычек; допишите URL.',
    fullLine: 'yt-dlp --client-certificate-key key.pem '
  },
  {
    tool: 'yt-dlp',
    token: '· TLS как Firefox -F',
    summary: 'TLS и HTTP: отпечаток как у Firefox (--impersonate firefox -F); помогает обходить антибот-защиту; допишите URL.',
    fullLine: 'yt-dlp --impersonate firefox -F '
  },
  {
    tool: 'yt-dlp',
    token: '· TLS как Edge -F',
    summary: 'TLS и HTTP: отпечаток как у Edge (--impersonate edge -F); помогает обходить антибот-защиту; допишите URL.',
    fullLine: 'yt-dlp --impersonate edge -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео CZ -F',
    summary: 'Гео-обход с кодом страны CZ (--geo-bypass-country CZ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео HU -F',
    summary: 'Гео-обход с кодом страны HU (--geo-bypass-country HU -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country HU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео RO -F',
    summary: 'Гео-обход с кодом страны RO (--geo-bypass-country RO -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country RO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео BG -F',
    summary: 'Гео-обход с кодом страны BG (--geo-bypass-country BG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео HR -F',
    summary: 'Гео-обход с кодом страны HR (--geo-bypass-country HR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country HR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео LV -F',
    summary: 'Гео-обход с кодом страны LV (--geo-bypass-country LV -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country LV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео LT -F',
    summary: 'Гео-обход с кодом страны LT (--geo-bypass-country LT -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country LT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео EE -F',
    summary: 'Гео-обход с кодом страны EE (--geo-bypass-country EE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country EE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео IS -F',
    summary: 'Гео-обход с кодом страны IS (--geo-bypass-country IS -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country IS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· превью в PNG',
    summary: 'Конвертировать обложку в PNG при скачивании (--convert-thumbnails png); допишите URL и ключи вывода.',
    fullLine: 'yt-dlp --convert-thumbnails png '
  },
  {
    tool: 'yt-dlp',
    token: '· аудио Opus',
    summary: 'Извлечь аудио в Opus (--extract-audio --audio-format opus); допишите URL и ключи вывода.',
    fullLine: 'yt-dlp --extract-audio --audio-format opus '
  },
  {
    tool: 'yt-dlp',
    token: '· аудио FLAC',
    summary: 'Извлечь аудио в FLAC без потерь (--extract-audio --audio-format flac); допишите URL и ключи вывода.',
    fullLine: 'yt-dlp --extract-audio --audio-format flac '
  },
  {
    tool: 'yt-dlp',
    token: '· аудио WAV',
    summary: 'Извлечь аудио в WAV (--extract-audio --audio-format wav); допишите URL и ключи вывода.',
    fullLine: 'yt-dlp --extract-audio --audio-format wav '
  },
  {
    tool: 'yt-dlp',
    token: '· аудио M4A',
    summary: 'Извлечь аудио в M4A или AAC (--extract-audio --audio-format m4a); допишите URL и ключи вывода.',
    fullLine: 'yt-dlp --extract-audio --audio-format m4a '
  },
  {
    tool: 'yt-dlp',
    token: '· без «просмотрено» -F',
    summary: 'Не отмечать видео просмотренным на платформе (--no-mark-watched -F); допишите URL.',
    fullLine: 'yt-dlp --no-mark-watched -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без JSON комментариев -F',
    summary: 'Не сохранять JSON комментариев (--no-write-comments -F); допишите URL.',
    fullLine: 'yt-dlp --no-write-comments -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без .description -F',
    summary: 'Не сохранять .description рядом с файлом (--no-write-description -F); допишите URL.',
    fullLine: 'yt-dlp --no-write-description -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео MY -F',
    summary: 'Гео-обход с кодом страны MY (--geo-bypass-country MY -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео SG -F',
    summary: 'Гео-обход с кодом страны SG (--geo-bypass-country SG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео TH -F',
    summary: 'Гео-обход с кодом страны TH (--geo-bypass-country TH -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео VN -F',
    summary: 'Гео-обход с кодом страны VN (--geo-bypass-country VN -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country VN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео AR -F',
    summary: 'Гео-обход с кодом страны AR (--geo-bypass-country AR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео UA -F',
    summary: 'Гео-обход с кодом страны UA (--geo-bypass-country UA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country UA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео PH -F',
    summary: 'Гео-обход с кодом страны PH (--geo-bypass-country PH -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ID -F',
    summary: 'Гео-обход с кодом страны ID (--geo-bypass-country ID -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country ID -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео PK -F',
    summary: 'Гео-обход с кодом страны PK (--geo-bypass-country PK -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео BD -F',
    summary: 'Гео-обход с кодом страны BD (--geo-bypass-country BD -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео EG -F',
    summary: 'Гео-обход с кодом страны EG (--geo-bypass-country EG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country EG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео CL -F',
    summary: 'Гео-обход с кодом страны CL (--geo-bypass-country CL -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео PE -F',
    summary: 'Гео-обход с кодом страны PE (--geo-bypass-country PE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео KE -F',
    summary: 'Гео-обход с кодом страны KE (--geo-bypass-country KE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country KE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео CO -F',
    summary: 'Гео-обход с кодом страны CO (--geo-bypass-country CO -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео NG -F',
    summary: 'Гео-обход с кодом страны NG (--geo-bypass-country NG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country NG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· модуль generic: не плейлист -F',
    summary: 'Общий модуль (generic): не разворачивать плейлист (--extractor-args generic:noplaylist -F); допишите URL.',
    fullLine: 'yt-dlp --extractor-args generic:noplaylist -F '
  },
  {
    tool: 'yt-dlp',
    token: '· до 10 ош. плейлиста -F',
    summary: 'Пропустить до 10 ошибок подряд в плейлисте (--skip-playlist-after-errors 10 -F); допишите URL плейлиста.',
    fullLine: 'yt-dlp --skip-playlist-after-errors 10 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· повторы HTTP 15 -F',
    summary: 'Больше повторов HTTP (--retries 15 -F); нестабильные CDN; допишите URL.',
    fullLine: 'yt-dlp --retries 15 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· повторы фрагментов 15 -F',
    summary: 'Повторы для обрывов фрагментов HLS и DASH (--fragment-retries 15 -F); допишите URL.',
    fullLine: 'yt-dlp --fragment-retries 15 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· обход BiDi -F',
    summary: 'Обход багов RTL и двунаправленного текста (BiDi) в именах файлов и метаданных (--bidi-workaround -F); допишите URL.',
    fullLine: 'yt-dlp --bidi-workaround -F '
  },
  {
    tool: 'yt-dlp',
    token: '· даты: широкий диапазон -F',
    summary: 'Ограничить по дате загрузки и релиза (--daterange 20000101-20991231 -F); подстройте диапазон; допишите URL.',
    fullLine: 'yt-dlp --daterange 20000101-20991231 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист с 2-го -F',
    summary: 'Плейлист начиная со 2-го элемента (--playlist-start 2 -F); допишите URL плейлиста.',
    fullLine: 'yt-dlp --playlist-start 2 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео SK -F',
    summary: 'Гео-обход с кодом страны SK (--geo-bypass-country SK -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео SI -F',
    summary: 'Гео-обход с кодом страны SI (--geo-bypass-country SI -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео LU -F',
    summary: 'Гео-обход с кодом страны LU (--geo-bypass-country LU -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country LU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео MT -F',
    summary: 'Гео-обход с кодом страны MT (--geo-bypass-country MT -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео CY -F',
    summary: 'Гео-обход с кодом страны CY (--geo-bypass-country CY -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео BA -F',
    summary: 'Гео-обход с кодом страны BA (--geo-bypass-country BA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео RS -F',
    summary: 'Гео-обход с кодом страны RS (--geo-bypass-country RS -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country RS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео MN -F',
    summary: 'Гео-обход с кодом страны MN (--geo-bypass-country MN -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео KZ -F',
    summary: 'Гео-обход с кодом страны KZ (--geo-bypass-country KZ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country KZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео GE -F',
    summary: 'Гео-обход с кодом страны GE (--geo-bypass-country GE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео AM -F',
    summary: 'Гео-обход с кодом страны AM (--geo-bypass-country AM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео AZ -F',
    summary: 'Гео-обход с кодом страны AZ (--geo-bypass-country AZ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео IQ -F',
    summary: 'Гео-обход с кодом страны IQ (--geo-bypass-country IQ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country IQ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео LK -F',
    summary: 'Гео-обход с кодом страны LK (--geo-bypass-country LK -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country LK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео TN -F',
    summary: 'Гео-обход с кодом страны TN (--geo-bypass-country TN -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео MA -F',
    summary: 'Гео-обход с кодом страны MA (--geo-bypass-country MA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео DZ -F',
    summary: 'Гео-обход с кодом страны DZ (--geo-bypass-country DZ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country DZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео GH -F',
    summary: 'Гео-обход с кодом страны GH (--geo-bypass-country GH -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ET -F',
    summary: 'Гео-обход с кодом страны ET (--geo-bypass-country ET -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country ET -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео UY -F',
    summary: 'Гео-обход с кодом страны UY (--geo-bypass-country UY -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country UY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео BO -F',
    summary: 'Гео-обход с кодом страны BO (--geo-bypass-country BO -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео CR -F',
    summary: 'Гео-обход с кодом страны CR (--geo-bypass-country CR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео PA -F',
    summary: 'Гео-обход с кодом страны PA (--geo-bypass-country PA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· загрузчик ffmpeg -F',
    summary: 'Явно качать через встроенный загрузчик на базе ffmpeg (--downloader ffmpeg -F); потоки HLS и DASH; допишите URL.',
    fullLine: 'yt-dlp --downloader ffmpeg -F '
  },
  {
    tool: 'yt-dlp',
    token: '· загрузчик aria2c -F',
    summary: 'Внешний aria2c как загрузчик (--downloader aria2c -F; aria2c должен быть в каталогах из PATH); допишите URL.',
    fullLine: 'yt-dlp --downloader aria2c -F '
  },
  {
    tool: 'yt-dlp',
    token: '· не ждать эфир -F',
    summary: 'Не ждать появления трансляции (--no-wait-for-video -F); быстрый -F для стримов; допишите URL.',
    fullLine: 'yt-dlp --no-wait-for-video -F '
  },
  {
    tool: 'yt-dlp',
    token: '· подробный вывод -F',
    summary: 'Подробный журнал yt-dlp при списке форматов (--verbose -F); диагностика модуля извлечения (extractor); допишите URL.',
    fullLine: 'yt-dlp --verbose -F '
  },
  {
    tool: 'yt-dlp',
    token: '· обрезка длинных имён -F',
    summary: 'Обрезать слишком длинные имена файлов (--trim-filenames 180 -F); сетевые хранилища (NAS) и ограничение длины полного пути в Windows (около 260 символов, MAX_PATH); допишите URL.',
    fullLine: 'yt-dlp --trim-filenames 180 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· HLS по разрывам -F',
    summary: 'HLS: резать плейлист по границам разрыва (discontinuity, --hls-split-discontinuity -F); стабильнее MPEG-TS-сегменты; допишите URL.',
    fullLine: 'yt-dlp --hls-split-discontinuity -F '
  },
  {
    tool: 'yt-dlp',
    token: '· буфер динам. MPD -F',
    summary: 'DASH: буфер динамического манифеста MPD в секундах (--dynamic-mpd-buffer-size 100 -F); «живые» манифесты; допишите URL.',
    fullLine: 'yt-dlp --dynamic-mpd-buffer-size 100 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без сырого HTML -F',
    summary: 'Не сохранять сырые HTML-страницы модуля извлечения (extractor) (--no-write-pages -F); чище диск при -F; допишите URL.',
    fullLine: 'yt-dlp --no-write-pages -F '
  },
  {
    tool: 'yt-dlp',
    token: '· таймаут сокета 120 с -F',
    summary: 'Таймаут сокета 120 с (--socket-timeout 120 -F); очень медленные CDN и прокси; допишите URL.',
    fullLine: 'yt-dlp --socket-timeout 120 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· сорт -S: ~1080p AV1 -F',
    summary: 'Сортировка форматов: приоритет ~1080p и AV1 (-S +res:1080,+codec:av01 -F); подстройте res и codec; допишите URL.',
    fullLine: 'yt-dlp -S +res:1080,+codec:av01 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· сорт -S: ~5 Мбит/с 720p -F',
    summary: 'Сортировка: битрейт ~5 Mbit/s и около 720p (-S +br:5000000,+res:720 -F); диагностика выбора -f; допишите URL.',
    fullLine: 'yt-dlp -S +br:5000000,+res:720 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без прогресс-бара -F',
    summary: 'Список форматов без прогресс-бара (--hide-progress -F); чище вывод в терминале; допишите URL.',
    fullLine: 'yt-dlp --hide-progress -F '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист: последний -F',
    summary: 'Только последний элемент плейлиста и список форматов (--playlist-items -1 -F); хвост плейлиста без полного разбора; допишите URL.',
    fullLine: 'yt-dlp --playlist-items -1 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: genres',
    summary: 'Жанры и теги без скачивания (--skip-download --print genres); музыка и каталоги; допишите URL.',
    fullLine: 'yt-dlp --skip-download --print genres '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: cast',
    summary: 'Актёрский состав (cast) без скачивания (--skip-download --print cast); если отдаёт площадка; допишите URL.',
    fullLine: 'yt-dlp --skip-download --print cast '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист: эл. 2–4 -F',
    summary: 'Фрагмент плейлиста: только элементы 2…4 (--playlist-items 2:4 -F); середина без начала и конца; допишите URL плейлиста.',
    fullLine: 'yt-dlp --playlist-items 2:4 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· постпроц.: FFmpeg, 1 поток -F',
    summary: 'Дополнительные аргументы постпроцессору ffmpeg через --ppa (FFmpeg:-threads:1 -F); в списке аргументов без кавычек (как в argv); допишите URL.',
    fullLine: 'yt-dlp --ppa FFmpeg:-threads:1 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· явно плейлист -F',
    summary: 'Явно развернуть плейлист и показать форматы (--yes-playlist -F); когда URL выглядит как один ролик, но это плейлист; допишите URL.',
    fullLine: 'yt-dlp --yes-playlist -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео AD -F',
    summary: 'Гео-обход через Андорру (--geo-bypass-country AD -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео MC -F',
    summary: 'Гео-обход через Монако (--geo-bypass-country MC -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео LI -F',
    summary: 'Гео-обход через Лихтенштейн (--geo-bypass-country LI -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country LI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео SM -F',
    summary: 'Гео-обход через Сан-Марино (--geo-bypass-country SM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео VA -F',
    summary: 'Гео-обход через Ватикан (--geo-bypass-country VA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country VA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео GI -F',
    summary: 'Гео-обход через Гибралтар (--geo-bypass-country GI -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео JE -F',
    summary: 'Гео-обход через Джерси (--geo-bypass-country JE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country JE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео GG -F',
    summary: 'Гео-обход через Гернси (--geo-bypass-country GG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео IM -F',
    summary: 'Гео-обход через Остров Мэн (--geo-bypass-country IM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country IM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео FO -F',
    summary: 'Гео-обход через Фарерские острова (--geo-bypass-country FO -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country FO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео GL -F',
    summary: 'Гео-обход через Гренландию (--geo-bypass-country GL -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· проверка всех URL -F',
    summary: 'Проверить все HTTP-URL фрагментов перед загрузкой (--check-all-urls -F); диагностика кодов 403 и 410 на потоках HLS и DASH; допишите URL.',
    fullLine: 'yt-dlp --check-all-urls -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без лимита имён Win -F',
    summary: 'Отключить санитизацию имён под Windows (--no-windows-filenames -F); как в POSIX-шаблонах -o; допишите URL.',
    fullLine: 'yt-dlp --no-windows-filenames -F '
  },
  {
    tool: 'yt-dlp',
    token: '· подмена в title (_→-) -F',
    summary: 'Замена в метаданных до имени файла (--replace-in-metadata title,_,- — подчёркивание → дефис); допишите URL.',
    fullLine: 'yt-dlp --replace-in-metadata title,_,- -F '
  },
  {
    tool: 'yt-dlp',
    token: '· один ролик: симуляция',
    summary: 'Сухой прогон одного ролика из URL-плейлиста (--no-playlist --simulate); без файлов; допишите URL.',
    fullLine: 'yt-dlp --no-playlist --simulate '
  },
  {
    tool: 'yt-dlp',
    token: '· вывод: dislike_count',
    summary: 'Счётчик дизлайков без скачивания (--skip-download --print dislike_count; часто NA); допишите URL.',
    fullLine: 'yt-dlp --skip-download --print dislike_count '
  },
  {
    tool: 'yt-dlp',
    token: '· плоский плейлист: длительность',
    summary: 'Плоский плейлист: длительность каждого элемента без глубокого извлечения (--flat-playlist --skip-download --print duration); допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist --skip-download --print duration '
  },
  {
    tool: 'yt-dlp',
    token: '· список модулей с описанием',
    summary: 'Имена и краткие описания модулей извлечения (extractors) без URL (--list-extractor-descriptions); справка по поддерживаемым сайтам.',
    fullLine: 'yt-dlp --list-extractor-descriptions'
  },
  {
    tool: 'yt-dlp',
    token: '· трассировка HTTP и TLS -F',
    summary: 'Печать HTTP и TLS трафика в стандартный поток ошибок (stderr) (--print-traffic -F); очень подробный вывод, только диагностика; допишите URL.',
    fullLine: 'yt-dlp --print-traffic -F '
  },
  {
    tool: 'yt-dlp',
    token: '· аудио → Vorbis',
    summary: 'Извлечь аудио в Ogg Vorbis (--extract-audio --audio-format vorbis); допишите URL и шаблон -o при необходимости.',
    fullLine: 'yt-dlp --extract-audio --audio-format vorbis '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id',
    summary: 'Записать id ролика в flux-ytdlp-id.txt без скачивания (--print-to-file id …); допишите URL.',
    fullLine: 'yt-dlp --print-to-file id flux-ytdlp-id.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· без самообновления -F',
    summary: 'Запретить автообновление yt-dlp (self-update), даже если оно включено (--no-update -F); фиксируем версию из поставки; допишите URL.',
    fullLine: 'yt-dlp --no-update -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без ANSI-цвета -F',
    summary: 'Вывод без цветов ANSI (--no-color -F); удобнее парсить или для непрерывной интеграции (CI); допишите URL.',
    fullLine: 'yt-dlp --no-color -F '
  },
  {
    tool: 'yt-dlp',
    token: '· ANSI-цвет всегда -F',
    summary: 'Принудительно цвета ANSI в выводе (--color always -F); даже когда стандартный вывод не терминал (не TTY); допишите URL.',
    fullLine: 'yt-dlp --color always -F '
  },
  {
    tool: 'yt-dlp',
    token: '· форматы с DRM в списке -F',
    summary: 'Разрешить «недостижимые» форматы в листинге (--allow-unplayable-formats -F); диагностика DRM и недоступного контента; допишите URL.',
    fullLine: 'yt-dlp --allow-unplayable-formats -F '
  },
  {
    tool: 'yt-dlp',
    token: '· аудио → ALAC',
    summary: 'Извлечь аудио в Apple Lossless (--extract-audio --audio-format alac); допишите URL и -o при необходимости.',
    fullLine: 'yt-dlp --extract-audio --audio-format alac '
  },
  {
    tool: 'yt-dlp',
    token: '· аудио → AC-3',
    summary: 'Извлечь аудио в Dolby Digital AC-3 (--extract-audio --audio-format ac3); допишите URL.',
    fullLine: 'yt-dlp --extract-audio --audio-format ac3 '
  },
  {
    tool: 'yt-dlp',
    token: '· аудио, кач. макс. (q0)',
    summary: 'Извлечь аудио с максимальным качеством постпроцессора (--audio-quality 0 --extract-audio); допишите URL и -f при необходимости.',
    fullLine: 'yt-dlp --audio-quality 0 --extract-audio '
  },
  {
    tool: 'yt-dlp',
    token: '· постпроц.: mux, 1 поток -F',
    summary: 'Аргументы постпроцессора для ffmpeg (--postprocessor-args ffmpeg:-threads 1 -F); ограничить нагрузку при слиянии потоков (мультиплексировании); допишите URL.',
    fullLine: 'yt-dlp --postprocessor-args ffmpeg:-threads 1 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео TW',
    summary: 'Гео-обход с кодом страны TW (--geo-bypass-country TW -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео MD',
    summary: 'Гео-обход с кодом страны MD (--geo-bypass-country MD -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: pageurl',
    summary: 'Записать webpage_url в flux-ytdlp-pageurl.txt без скачивания (--print-to-file …); допишите URL.',
    fullLine: 'yt-dlp --print-to-file webpage_url flux-ytdlp-pageurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: durstr',
    summary: 'Записать duration_string в flux-ytdlp-durstr.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file duration_string flux-ytdlp-durstr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: uploader',
    summary: 'Записать uploader в flux-ytdlp-uploader.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file uploader flux-ytdlp-uploader.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: churl',
    summary: 'Записать channel_url в flux-ytdlp-churl.txt без скачивания; допишите URL ролика.',
    fullLine: 'yt-dlp --print-to-file channel_url flux-ytdlp-churl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео BY',
    summary: 'Гео-обход с кодом страны BY (--geo-bypass-country BY -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео AL',
    summary: 'Гео-обход с кодом страны AL (--geo-bypass-country AL -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео MK',
    summary: 'Гео-обход с кодом страны MK (--geo-bypass-country MK -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: views',
    summary: 'Записать view_count в flux-ytdlp-views.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file view_count flux-ytdlp-views.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: имя канала',
    summary: 'Записать имя канала (поле channel) в flux-ytdlp-channel.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file channel flux-ytdlp-channel.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: extractor',
    summary: 'Записать имя модуля извлечения (extractor) в flux-ytdlp-extractor.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file extractor flux-ytdlp-extractor.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: pltitle',
    summary: 'Записать playlist_title в flux-ytdlp-pltitle.txt без скачивания; допишите URL плейлиста.',
    fullLine: 'yt-dlp --print-to-file playlist_title flux-ytdlp-pltitle.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: uploaddate',
    summary: 'Записать upload_date в flux-ytdlp-update.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file upload_date flux-ytdlp-update.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ME',
    summary: 'Гео-обход с кодом страны ME (--geo-bypass-country ME -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country ME -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео PS',
    summary: 'Гео-обход с кодом страны PS (--geo-bypass-country PS -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео TL',
    summary: 'Гео-обход с кодом страны TL (--geo-bypass-country TL -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· аудио WMA',
    summary: 'Извлечь аудио в WMA (--extract-audio --audio-format wma); допишите URL и шаблон -o при необходимости.',
    fullLine: 'yt-dlp --extract-audio --audio-format wma '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист: не стоп при ошибке -F',
    summary: 'Плейлист: продолжать после ошибки отдельного URL (--no-abort-on-error -F); допишите URL.',
    fullLine: 'yt-dlp --no-abort-on-error -F '
  },
  {
    tool: 'yt-dlp',
    token: '· имена не только ASCII -F',
    summary: 'Не ограничивать имена файлов ASCII (--no-restrict-filenames -F); кириллица в -o; допишите URL.',
    fullLine: 'yt-dlp --no-restrict-filenames -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео PR',
    summary: 'Гео-обход с кодом страны PR (--geo-bypass-country PR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео GU',
    summary: 'Гео-обход с кодом страны GU (--geo-bypass-country GU -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео VI',
    summary: 'Гео-обход с кодом страны VI (--geo-bypass-country VI -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country VI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео AS',
    summary: 'Гео-обход с кодом страны AS (--geo-bypass-country AS -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео MP',
    summary: 'Гео-обход с кодом страны MP (--geo-bypass-country MP -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MP -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео UM',
    summary: 'Гео-обход с кодом страны UM (--geo-bypass-country UM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country UM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: description',
    summary: 'Записать поле description в flux-ytdlp-desc.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file description flux-ytdlp-desc.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: поле filename',
    summary: 'Записать шаблон filename (поле метаданных) в flux-ytdlp-fn.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file filename flux-ytdlp-fn.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· без приоритета «свободных» кодеков -F',
    summary: 'Список форматов без приоритета «свободных» кодеков (--no-prefer-free-formats -F); контраст к --prefer-free-formats; допишите URL.',
    fullLine: 'yt-dlp --no-prefer-free-formats -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: categories',
    summary: 'Записать поле categories в flux-ytdlp-categories.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file categories flux-ytdlp-categories.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: tags',
    summary: 'Записать поле tags в flux-ytdlp-tags.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file tags flux-ytdlp-tags.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: language',
    summary: 'Записать поле language в flux-ytdlp-language.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file language flux-ytdlp-language.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: autocap',
    summary: 'Записать automatic_captions в flux-ytdlp-autocap.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file automatic_captions flux-ytdlp-autocap.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: chapters',
    summary: 'Записать поле chapters в flux-ytdlp-chapters.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file chapters flux-ytdlp-chapters.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: acodec',
    summary: 'Записать выбранный или лучший аудиокодек (acodec) в flux-ytdlp-acodec.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file acodec flux-ytdlp-acodec.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: vcodec',
    summary: 'Записать выбранный или лучший видеокодек (vcodec) в flux-ytdlp-vcodec.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file vcodec flux-ytdlp-vcodec.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: likes',
    summary: 'Записать like_count в flux-ytdlp-likes.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file like_count flux-ytdlp-likes.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: длительность, сек',
    summary: 'Записать duration (секунды, число) в flux-ytdlp-duration.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file duration flux-ytdlp-duration.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: subtitles',
    summary: 'Записать поле subtitles (словари дорожек) в flux-ytdlp-subs.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file subtitles flux-ytdlp-subs.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: chid',
    summary: 'Записать channel_id в flux-ytdlp-chid.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file channel_id flux-ytdlp-chid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: plid',
    summary: 'Записать playlist_id в flux-ytdlp-plid.txt без скачивания; допишите URL плейлиста.',
    fullLine: 'yt-dlp --print-to-file playlist_id flux-ytdlp-plid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: heatmap',
    summary: 'Записать тепловую карту просмотров (heatmap; если модуль извлечения отдаёт, напр. YouTube) в flux-ytdlp-heatmap.txt; допишите URL.',
    fullLine: 'yt-dlp --print-to-file heatmap flux-ytdlp-heatmap.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· ленивый плейлист -F',
    summary: 'Ленивый плейлист вместе с листингом форматов (--lazy-playlist -F); не разворачивает все элементы заранее; допишите URL.',
    fullLine: 'yt-dlp --lazy-playlist -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без дозагрузки .part -F',
    summary: 'Листинг форматов без дозагрузки частичных .part (--no-continue -F); при скачивании начать заново; допишите URL.',
    fullLine: 'yt-dlp --no-continue -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без обратного порядка плейлиста -F',
    summary: 'Не переворачивать порядок элементов плейлиста (--no-playlist-reverse -F); совместимость с плейлистами; допишите URL.',
    fullLine: 'yt-dlp --no-playlist-reverse -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ccount',
    summary: 'Записать comment_count в flux-ytdlp-ccount.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file comment_count flux-ytdlp-ccount.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: wubase',
    summary: 'Записать webpage_url_basename в flux-ytdlp-wubase.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file webpage_url_basename flux-ytdlp-wubase.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: dispid',
    summary: 'Записать display_id в flux-ytdlp-dispid.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file display_id flux-ytdlp-dispid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: URL превью',
    summary: 'Записать поле миниатюры (thumbnail, URL обложки) в flux-ytdlp-thumburl.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file thumbnail flux-ytdlp-thumburl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: rel_ts',
    summary: 'Записать release_timestamp (UNIX, если модуль извлечения отдаёт) в flux-ytdlp-reltsepoch.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file release_timestamp flux-ytdlp-reltsepoch.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: filepath',
    summary: 'Записать filepath (после -o) в flux-ytdlp-fpath.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file filepath flux-ytdlp-fpath.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: resolution',
    summary: 'Записать resolution (строка разрешения) в flux-ytdlp-res.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file resolution flux-ytdlp-res.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: format_id',
    summary: 'Записать format_id в flux-ytdlp-fmtid.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file format_id flux-ytdlp-fmtid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ext',
    summary: 'Записать ext (расширение выбранного формата) в flux-ytdlp-ext.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file ext flux-ytdlp-ext.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео BM -F',
    summary: 'Гео-обход через Бермуды (--geo-bypass-country BM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео KY -F',
    summary: 'Гео-обход через Каймановы острова (--geo-bypass-country KY -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country KY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео JM -F',
    summary: 'Гео-обход через Ямайку (--geo-bypass-country JM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country JM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео BB -F',
    summary: 'Гео-обход через Барбадос (--geo-bypass-country BB -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BB -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео BS -F',
    summary: 'Гео-обход через Багамы (--geo-bypass-country BS -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: width',
    summary: 'Записать ширину выбранного формата (width) в flux-ytdlp-width.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file width flux-ytdlp-width.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: height',
    summary: 'Записать высоту выбранного формата (height) в flux-ytdlp-height.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file height flux-ytdlp-height.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: fps',
    summary: 'Записать fps выбранного формата в flux-ytdlp-fps.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file fps flux-ytdlp-fps.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: tbr',
    summary: 'Записать суммарный битрейт (tbr, kbps) в flux-ytdlp-tbr.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file tbr flux-ytdlp-tbr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: fsize',
    summary: 'Записать filesize_approx в flux-ytdlp-fsize.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file filesize_approx flux-ytdlp-fsize.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: protocol',
    summary: 'Записать protocol выбранного формата (https, m3u8 и т. п.) в flux-ytdlp-proto.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file protocol flux-ytdlp-proto.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· отклонить по title -F',
    summary: 'Исключить элементы плейлиста по подстроке заголовка (--reject-title trailer -F); подстройте шаблон; допишите URL.',
    fullLine: 'yt-dlp --reject-title trailer -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео LC -F',
    summary: 'Гео-обход через Сент-Люсию (--geo-bypass-country LC -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country LC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео GD -F',
    summary: 'Гео-обход через Гренаду (--geo-bypass-country GD -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео VC -F',
    summary: 'Гео-обход через Сент-Винсент и Гренадины (--geo-bypass-country VC -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country VC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео KN -F',
    summary: 'Гео-обход через Сент-Китс и Невис (--geo-bypass-country KN -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country KN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео DM -F',
    summary: 'Гео-обход через Доминику (--geo-bypass-country DM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country DM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: plidx',
    summary: 'Записать индекс в плейлисте (playlist_index) в flux-ytdlp-plidx.txt без скачивания; допишите URL плейлиста.',
    fullLine: 'yt-dlp --print-to-file playlist_index flux-ytdlp-plidx.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: plauto',
    summary: 'Записать авто-нумерацию плейлиста (playlist_autonumber) в flux-ytdlp-plauto.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file playlist_autonumber flux-ytdlp-plauto.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: plcount',
    summary: 'Записать число элементов плейлиста (playlist_count) в flux-ytdlp-plcount.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file playlist_count flux-ytdlp-plcount.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: plupid',
    summary: 'Записать playlist_uploader_id в flux-ytdlp-plupid.txt без скачивания; допишите URL плейлиста.',
    fullLine: 'yt-dlp --print-to-file playlist_uploader_id flux-ytdlp-plupid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: upid',
    summary: 'Записать uploader_id в flux-ytdlp-upid.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file uploader_id flux-ytdlp-upid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: rating',
    summary: 'Записать average_rating в flux-ytdlp-rating.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file average_rating flux-ytdlp-rating.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: avail',
    summary: 'Записать availability (значения вроде public, private, unlisted) в flux-ytdlp-avail.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file availability flux-ytdlp-avail.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: age',
    summary: 'Записать age_limit в flux-ytdlp-age.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file age_limit flux-ytdlp-age.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео AW -F',
    summary: 'Гео-обход через Арубу (--geo-bypass-country AW -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео CW -F',
    summary: 'Гео-обход через Кюрасао (--geo-bypass-country CW -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео SX -F',
    summary: 'Гео-обход через Синт-Мартен (--geo-bypass-country SX -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SX -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео TC -F',
    summary: 'Гео-обход через острова Тёркс и Кайкос (--geo-bypass-country TC -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео VG -F',
    summary: 'Гео-обход через Виргинские острова (Великобритания) (--geo-bypass-country VG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country VG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: wudom',
    summary: 'Записать webpage_url_domain в flux-ytdlp-wudom.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file webpage_url_domain flux-ytdlp-wudom.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ourl',
    summary: 'Записать original_url (исходный запрос до редиректов) в flux-ytdlp-ourl.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file original_url flux-ytdlp-ourl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: abr',
    summary: 'Записать abr выбранного формата (аудио kbps) в flux-ytdlp-abr.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file abr flux-ytdlp-abr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: vbr',
    summary: 'Записать vbr выбранного формата (видео kbps) в flux-ytdlp-vbr.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file vbr flux-ytdlp-vbr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: fsz',
    summary: 'Записать filesize (байты, если известен) в flux-ytdlp-fszb.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file filesize flux-ytdlp-fszb.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: fnote',
    summary: 'Записать примечание к выбранному формату (format_note) в flux-ytdlp-fnote.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file format_note flux-ytdlp-fnote.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: plup',
    summary: 'Записать playlist_uploader (имя автора плейлиста) в flux-ytdlp-plup.txt без скачивания; допишите URL плейлиста.',
    fullLine: 'yt-dlp --print-to-file playlist_uploader flux-ytdlp-plup.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео AG -F',
    summary: 'Гео-обход через Антигуа и Барбуду (--geo-bypass-country AG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео MS -F',
    summary: 'Гео-обход через Монтсеррат (--geo-bypass-country MS -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео AI -F',
    summary: 'Гео-обход через Ангилью (--geo-bypass-country AI -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео GP -F',
    summary: 'Гео-обход через Гваделупу (--geo-bypass-country GP -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GP -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео BQ -F',
    summary: 'Гео-обход через Карибские Нидерланды: Бонайре, Синт-Эстатиус и Саба (--geo-bypass-country BQ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BQ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· макс. загрузок 5 -F',
    summary: 'Остановка после N загрузок из плейлиста (--max-downloads 5 -F); подстройте число; допишите URL.',
    fullLine: 'yt-dlp --max-downloads 5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист: случайный порядок -F',
    summary: 'Случайный порядок элементов плейлиста перед -F (--playlist-random -F); допишите URL плейлиста.',
    fullLine: 'yt-dlp --playlist-random -F '
  },
  {
    tool: 'yt-dlp',
    token: '· перезапись без вопроса -F',
    summary: 'Перезапись существующих файлов без вопросов (--force-overwrites -F); допишите URL.',
    fullLine: 'yt-dlp --force-overwrites -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: fulltitle',
    summary: 'Записать fulltitle в flux-ytdlp-fulltitle.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file fulltitle flux-ytdlp-fulltitle.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: alttitle',
    summary: 'Записать alt_title в flux-ytdlp-alttitle.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file alt_title flux-ytdlp-alttitle.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: artist',
    summary: 'Записать artist в flux-ytdlp-artist.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file artist flux-ytdlp-artist.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: album',
    summary: 'Записать album в flux-ytdlp-album.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file album flux-ytdlp-album.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: relyear',
    summary: 'Записать release_year в flux-ytdlp-relyear.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file release_year flux-ytdlp-relyear.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: is_live',
    summary: 'Записать is_live в flux-ytdlp-islive.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file is_live flux-ytdlp-islive.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: live_stat',
    summary: 'Записать live_status в flux-ytdlp-livestat.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file live_status flux-ytdlp-livestat.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: chfol',
    summary: 'Записать channel_follower_count в flux-ytdlp-chfol.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file channel_follower_count flux-ytdlp-chfol.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео CK -F',
    summary: 'Гео-обход через Острова Кука (--geo-bypass-country CK -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео NU -F',
    summary: 'Гео-обход через Ниуэ (--geo-bypass-country NU -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country NU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео TK -F',
    summary: 'Гео-обход через Токелау (--geo-bypass-country TK -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео TO -F',
    summary: 'Гео-обход через Тонга (--geo-bypass-country TO -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео WS -F',
    summary: 'Гео-обход через Самоа (--geo-bypass-country WS -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country WS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· пропуск недоступных фрагментов -F',
    summary: 'Потоки DASH и HLS: пропускать недоступные фрагменты вместо аварийной остановки (--skip-unavailable-fragments -F); допишите URL.',
    fullLine: 'yt-dlp --skip-unavailable-fragments -F '
  },
  {
    tool: 'yt-dlp',
    token: '· стоп при первой ошибке -F',
    summary: 'Остановка при первой неустранимой ошибке (--abort-on-error -F); допишите URL плейлиста при необходимости.',
    fullLine: 'yt-dlp --abort-on-error -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: series',
    summary: 'Записать series (шоу) в flux-ytdlp-series.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file series flux-ytdlp-series.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: snum',
    summary: 'Записать season_number в flux-ytdlp-snum.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file season_number flux-ytdlp-snum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: epnum',
    summary: 'Записать episode_number в flux-ytdlp-epnum.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file episode_number flux-ytdlp-epnum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: epstr',
    summary: 'Записать episode (строка площадки) в flux-ytdlp-epstr.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file episode flux-ytdlp-epstr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: epid',
    summary: 'Записать episode_id в flux-ytdlp-epid.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file episode_id flux-ytdlp-epid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: sid',
    summary: 'Записать season_id в flux-ytdlp-sid.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file season_id flux-ytdlp-sid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: plchid',
    summary: 'Записать playlist_channel_id в flux-ytdlp-plchid.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file playlist_channel_id flux-ytdlp-plchid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: asr',
    summary: 'Записать asr (Hz дискретизации аудио) в flux-ytdlp-asr.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file asr flux-ytdlp-asr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: drm',
    summary: 'Записать has_drm в flux-ytdlp-drm.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file has_drm flux-ytdlp-drm.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: embed',
    summary: 'Записать playable_in_embed в flux-ytdlp-embed.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file playable_in_embed flux-ytdlp-embed.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: waslive',
    summary: 'Записать was_live в flux-ytdlp-waslive.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file was_live flux-ytdlp-waslive.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: mtype',
    summary: 'Записать media_type в flux-ytdlp-mtype.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file media_type flux-ytdlp-mtype.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео PF -F',
    summary: 'Гео-обход через Французскую Полинезию (--geo-bypass-country PF -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео NC -F',
    summary: 'Гео-обход через Новую Каледонию (--geo-bypass-country NC -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country NC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео FJ -F',
    summary: 'Гео-обход через Фиджи (--geo-bypass-country FJ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country FJ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео VU -F',
    summary: 'Гео-обход через Вануату (--geo-bypass-country VU -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country VU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео SB -F',
    summary: 'Гео-обход через Соломоновы острова (--geo-bypass-country SB -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SB -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео FM -F',
    summary: 'Гео-обход через Федеративные Штаты Микронезии (--geo-bypass-country FM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country FM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео MH -F',
    summary: 'Гео-обход через Маршалловы острова (--geo-bypass-country MH -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео PW -F',
    summary: 'Гео-обход через Палау (--geo-bypass-country PW -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· не стоп при отклонении формата -F',
    summary: 'Не останавливаться на отклонённом формате (--no-break-on-reject -F); допишите URL.',
    fullLine: 'yt-dlp --no-break-on-reject -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: otype',
    summary: 'Записать тип объекта (_type: video, playlist и т. п.) в flux-ytdlp-otype.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file _type flux-ytdlp-otype.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: plurl',
    summary: 'Записать playlist_url в flux-ytdlp-plurl.txt без скачивания; допишите URL плейлиста.',
    fullLine: 'yt-dlp --print-to-file playlist_url flux-ytdlp-plurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: manurl',
    summary: 'Записать manifest_url (манифест HLS, DASH и др.) в flux-ytdlp-manurl.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file manifest_url flux-ytdlp-manurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: sarfix',
    summary: 'Записать stretched_ratio (анаморфное растяжение кадра, если модуль извлечения отдаёт) в flux-ytdlp-sarfix.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file stretched_ratio flux-ytdlp-sarfix.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: reqf',
    summary: 'Записать requested_formats (JSON выбранных потоков) в flux-ytdlp-reqf.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file requested_formats flux-ytdlp-reqf.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео NR -F',
    summary: 'Гео-обход через Науру (--geo-bypass-country NR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country NR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео TV -F',
    summary: 'Гео-обход через Тувалу (--geo-bypass-country TV -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео KI -F',
    summary: 'Гео-обход через Кирибати (--geo-bypass-country KI -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country KI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео WF -F',
    summary: 'Гео-обход через Уоллис и Футуна (--geo-bypass-country WF -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country WF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· прогресс реже (Δ 5 с) -F',
    summary: 'Реже обновлять строку прогресса (--progress-delta 5 -F); меньше шума в выводе при длинных списках с -F; допишите URL.',
    fullLine: 'yt-dlp --progress-delta 5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: formats',
    summary: 'Записать список форматов (JSON или текст от модуля извлечения) в flux-ytdlp-formats.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file formats flux-ytdlp-formats.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: url',
    summary: 'Записать прямой URL выбранного формата в flux-ytdlp-url.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file url flux-ytdlp-url.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: thumbs',
    summary: 'Записать словарь миниатюр (thumbnails, URL обложек разных размеров) в flux-ytdlp-thumbs.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file thumbnails flux-ytdlp-thumbs.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: locmeta',
    summary: 'Записать поле location (местоположение из метаданных площадки) в flux-ytdlp-locmeta.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file location flux-ytdlp-locmeta.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео AX -F',
    summary: 'Гео-обход через Аландские острова (--geo-bypass-country AX -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AX -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео SJ -F',
    summary: 'Гео-обход через Шпицберген и Ян-Майен (--geo-bypass-country SJ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SJ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео SH -F',
    summary: 'Гео-обход через остров Святой Елены (--geo-bypass-country SH -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· метаданные размера в xattr -F',
    summary: 'Писать ожидаемый размер файла в xattr где поддерживается ОС (--xattr-set-filesize -F); допишите URL.',
    fullLine: 'yt-dlp --xattr-set-filesize -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: epoch',
    summary: 'Записать epoch (время публикации в UNIX, если модуль извлечения отдаёт) в flux-ytdlp-epoch.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file epoch flux-ytdlp-epoch.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: reqsubs',
    summary: 'Записать requested_subtitles (JSON выбранных субтитров) в flux-ytdlp-reqsubs.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file requested_subtitles flux-ytdlp-reqsubs.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: plch',
    summary: 'Записать playlist_channel (имя канала плейлиста) в flux-ytdlp-plch.txt без скачивания; допишите URL плейлиста.',
    fullLine: 'yt-dlp --print-to-file playlist_channel flux-ytdlp-plch.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: nent',
    summary: 'Записать n_entries (число элементов плейлиста) в flux-ytdlp-nent.txt без скачивания; допишите URL плейлиста.',
    fullLine: 'yt-dlp --print-to-file n_entries flux-ytdlp-nent.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: dislikes',
    summary: 'Записать dislike_count в flux-ytdlp-dislikes.txt без скачивания (часто NA); допишите URL.',
    fullLine: 'yt-dlp --print-to-file dislike_count flux-ytdlp-dislikes.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· без метафайлов плейлиста -F',
    summary: 'Не писать .info.json и .description рядом с плейлистом (--no-playlist-metafiles -F); допишите URL плейлиста.',
    fullLine: 'yt-dlp --no-playlist-metafiles -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео BV -F',
    summary: 'Гео-обход через остров Буве (--geo-bypass-country BV -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео TF -F',
    summary: 'Гео-обход через Французские Южные и Антарктические территории (--geo-bypass-country TF -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео HM -F',
    summary: 'Гео-обход через остров Херд и острова Макдональд (--geo-bypass-country HM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country HM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео IO -F',
    summary: 'Гео-обход через Британскую территорию в Индийском океане (--geo-bypass-country IO -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country IO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео PN -F',
    summary: 'Гео-обход через Питкэрн (--geo-bypass-country PN -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео AQ -F',
    summary: 'Гео-обход через Антарктиду (--geo-bypass-country AQ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AQ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео GS -F',
    summary: 'Гео-обход через Южную Георгию и Южные Сандвичевы острова (--geo-bypass-country GS -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео PM -F',
    summary: 'Гео-обход через Сен-Пьер и Микелон (--geo-bypass-country PM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: reldate',
    summary: 'Записать release_date (YYYYMMDD) в flux-ytdlp-reldate.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file release_date flux-ytdlp-reldate.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: mts',
    summary: 'Записать modified_timestamp (Unix, если модуль извлечения отдаёт) в flux-ytdlp-mts.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file modified_timestamp flux-ytdlp-mts.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: upts',
    summary: 'Записать upload_timestamp (Unix загрузки на площадку) в flux-ytdlp-upts.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file upload_timestamp flux-ytdlp-upts.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: aspect',
    summary: 'Записать aspect_ratio (строка площадки) в flux-ytdlp-aspect.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file aspect_ratio flux-ytdlp-aspect.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: epsort',
    summary: 'Записать episode_sort (сортировка эпизода в сериалах) в flux-ytdlp-epsort.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file episode_sort flux-ytdlp-epsort.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео FK -F',
    summary: 'Гео-обход через Фолклендские острова (--geo-bypass-country FK -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country FK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео EH -F',
    summary: 'Гео-обход через Западную Сахару (--geo-bypass-country EH -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country EH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео DJ -F',
    summary: 'Гео-обход через Джибути (--geo-bypass-country DJ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country DJ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео KG -F',
    summary: 'Гео-обход через Киргизию (--geo-bypass-country KG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country KG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео TJ -F',
    summary: 'Гео-обход через Таджикистан (--geo-bypass-country TJ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TJ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео NP -F',
    summary: 'Гео-обход через Непал (--geo-bypass-country NP -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country NP -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео LA -F',
    summary: 'Гео-обход через Лаос (--geo-bypass-country LA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country LA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео KH -F',
    summary: 'Гео-обход через Камбоджу (--geo-bypass-country KH -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country KH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео BN -F',
    summary: 'Гео-обход через Бруней (--geo-bypass-country BN -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: chverify',
    summary: 'Записать channel_is_verified (флаг верификации канала) в flux-ytdlp-chverify.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file channel_is_verified flux-ytdlp-chverify.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: private',
    summary: 'Записать is_private (признак приватного или ограниченного ролика) в flux-ytdlp-private.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file is_private flux-ytdlp-private.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: composers',
    summary: 'Записать composers (если модуль извлечения отдаёт) в flux-ytdlp-composers.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file composers flux-ytdlp-composers.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: creators',
    summary: 'Записать creators (если модуль извлечения отдаёт) в flux-ytdlp-creators.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file creators flux-ytdlp-creators.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: trknum',
    summary: 'Записать track_number (номер трека в каталоге) в flux-ytdlp-trknum.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file track_number flux-ytdlp-trknum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео MM -F',
    summary: 'Гео-обход через Мьянму (--geo-bypass-country MM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео BT -F',
    summary: 'Гео-обход через Бутан (--geo-bypass-country BT -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео MV -F',
    summary: 'Гео-обход через Мальдивы (--geo-bypass-country MV -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео MZ -F',
    summary: 'Гео-обход через Мозамбик (--geo-bypass-country MZ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ZW -F',
    summary: 'Гео-обход через Зимбабве (--geo-bypass-country ZW -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country ZW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео BW -F',
    summary: 'Гео-обход через Ботсвану (--geo-bypass-country BW -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео NA (Намибия) -F',
    summary: 'Гео-обход через Намибию (--geo-bypass-country NA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country NA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео LS -F',
    summary: 'Гео-обход через Лесото (--geo-bypass-country LS -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country LS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео MW -F',
    summary: 'Гео-обход через Малави (--geo-bypass-country MW -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео SZ -F',
    summary: 'Гео-обход через Эсватини (--geo-bypass-country SZ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: genre',
    summary: 'Записать genre (жанр, если модуль извлечения отдаёт) в flux-ytdlp-genre.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file genre flux-ytdlp-genre.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: album_type',
    summary: 'Записать album_type (тип релиза: альбом, сингл и т. п.) в flux-ytdlp-albumtype.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file album_type flux-ytdlp-albumtype.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: license',
    summary: 'Записать license (лицензия, Creative Commons и т. п., если есть) в flux-ytdlp-license.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file license flux-ytdlp-license.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: track',
    summary: 'Записать track (номер трека как строка каталога) в flux-ytdlp-track.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file track flux-ytdlp-track.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: album_artist',
    summary: 'Записать album_artist (альбомный исполнитель) в flux-ytdlp-albumartist.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file album_artist flux-ytdlp-albumartist.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: comment',
    summary: 'Записать comment (комментарий площадки или автора, uploader comment) в flux-ytdlp-comment.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file comment flux-ytdlp-comment.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео TD -F',
    summary: 'Гео-обход через Чад (--geo-bypass-country TD -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео NE -F',
    summary: 'Гео-обход через Нигер (--geo-bypass-country NE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country NE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ML -F',
    summary: 'Гео-обход через Мали (--geo-bypass-country ML -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country ML -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео SN -F',
    summary: 'Гео-обход через Сенегал (--geo-bypass-country SN -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео LY -F',
    summary: 'Гео-обход через Ливию (--geo-bypass-country LY -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country LY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео SO -F',
    summary: 'Гео-обход через Сомали (--geo-bypass-country SO -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ER -F',
    summary: 'Гео-обход через Эритрею (--geo-bypass-country ER -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country ER -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео SS -F',
    summary: 'Гео-обход через Южный Судан (--geo-bypass-country SS -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео YE -F',
    summary: 'Гео-обход через Йемен (--geo-bypass-country YE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country YE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео MR -F',
    summary: 'Гео-обход через Мавританию (--geo-bypass-country MR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: lyrics',
    summary: 'Записать lyrics (текст песни, если модуль извлечения отдаёт) в flux-ytdlp-lyrics.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file lyrics flux-ytdlp-lyrics.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: disc_number',
    summary: 'Записать disc_number (номер диска в каталоге) в flux-ytdlp-discnum.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file disc_number flux-ytdlp-discnum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: publisher',
    summary: 'Записать publisher (издатель и лейбл, если есть) в flux-ytdlp-publisher.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file publisher flux-ytdlp-publisher.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: mood',
    summary: 'Записать mood (настроение и тег настроения, если модуль извлечения отдаёт) в flux-ytdlp-mood.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file mood flux-ytdlp-mood.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео CM -F',
    summary: 'Гео-обход через Камерун (--geo-bypass-country CM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео GA -F',
    summary: 'Гео-обход через Габон (--geo-bypass-country GA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео CG -F',
    summary: 'Гео-обход через Республику Конго (--geo-bypass-country CG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео CD -F',
    summary: 'Гео-обход через ДР Конго (--geo-bypass-country CD -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео CF -F',
    summary: 'Гео-обход через ЦАР (--geo-bypass-country CF -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео GQ -F',
    summary: 'Гео-обход через Экваториальную Гвинею (--geo-bypass-country GQ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GQ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ST -F',
    summary: 'Гео-обход через Сан-Томе и Принсипи (--geo-bypass-country ST -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country ST -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео BI -F',
    summary: 'Гео-обход через Бурунди (--geo-bypass-country BI -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео RW -F',
    summary: 'Гео-обход через Руанду (--geo-bypass-country RW -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country RW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео UG -F',
    summary: 'Гео-обход через Уганду (--geo-bypass-country UG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country UG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео TZ -F',
    summary: 'Гео-обход через Танзанию (--geo-bypass-country TZ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ZM -F',
    summary: 'Гео-обход через Замбию (--geo-bypass-country ZM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country ZM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: artist_sort',
    summary: 'Записать artist_sort (сортировочное имя исполнителя) в flux-ytdlp-artistsort.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file artist_sort flux-ytdlp-artistsort.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: album_sort',
    summary: 'Записать album_sort (сортировочное имя альбома) в flux-ytdlp-albumsort.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file album_sort flux-ytdlp-albumsort.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: conductor',
    summary: 'Записать conductor (дирижёр, если есть) в flux-ytdlp-conductor.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file conductor flux-ytdlp-conductor.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: performers',
    summary: 'Записать performers (список исполнителей, если модуль извлечения отдаёт) в flux-ytdlp-performers.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file performers flux-ytdlp-performers.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: copyright',
    summary: 'Записать поле copyright (строка правообладателя) в flux-ytdlp-copy.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file copyright flux-ytdlp-copy.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: uploader_url',
    summary: 'Записать uploader_url (канонический URL страницы автора) в flux-ytdlp-upurl.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file uploader_url flux-ytdlp-upurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: producer',
    summary: 'Записать producer (поле producer, если есть) в flux-ytdlp-producer.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file producer flux-ytdlp-producer.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: director',
    summary: 'Записать director (режиссёр или автор видео, если модуль извлечения отдаёт) в flux-ytdlp-director.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file director flux-ytdlp-director.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· без предсборки путей -F',
    summary: 'Не строить выходные пути до фактического скачивания (--no-build-paths -F); меньше лишних mkdir при -F; допишите URL.',
    fullLine: 'yt-dlp --no-build-paths -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео BJ -F',
    summary: 'Гео-обход через Бенин (--geo-bypass-country BJ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BJ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео TG -F',
    summary: 'Гео-обход через Того (--geo-bypass-country TG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео BF -F',
    summary: 'Гео-обход через Буркина-Фасо (--geo-bypass-country BF -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео CI -F',
    summary: 'Гео-обход через Кот-д\'Ивуар (--geo-bypass-country CI -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео LR -F',
    summary: 'Гео-обход через Либерию (--geo-bypass-country LR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country LR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео SL -F',
    summary: 'Гео-обход через Сьерра-Леоне (--geo-bypass-country SL -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео GN -F',
    summary: 'Гео-обход через Гвинею (--geo-bypass-country GN -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео GW -F',
    summary: 'Гео-обход через Гвинею-Бисау (--geo-bypass-country GW -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: arranger',
    summary: 'Записать arranger (аранжировка, если есть) в flux-ytdlp-arranger.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file arranger flux-ytdlp-arranger.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: remixer',
    summary: 'Записать remixer (ремиксёр, если модуль извлечения отдаёт) в flux-ytdlp-remixer.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file remixer flux-ytdlp-remixer.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: engineer',
    summary: 'Записать engineer (звукорежиссёр или инженер записи, если есть) в flux-ytdlp-engineer.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file engineer flux-ytdlp-engineer.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: lyricist',
    summary: 'Записать lyricist (автор текста, если есть) в flux-ytdlp-lyricist.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file lyricist flux-ytdlp-lyricist.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: grouping',
    summary: 'Записать grouping (поле группировки треков, как в Apple Music и iTunes) в flux-ytdlp-grouping.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file grouping flux-ytdlp-grouping.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: compilation',
    summary: 'Записать compilation (признак сборника, если модуль извлечения отдаёт) в flux-ytdlp-compilation.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file compilation flux-ytdlp-compilation.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: show',
    summary: 'Записать show (название шоу или сериала, если модуль извлечения отдаёт) в flux-ytdlp-show.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file show flux-ytdlp-show.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: album_artists',
    summary: 'Записать album_artists (альбомные исполнители: сборники VA, приглашённые артисты feat. и т. п., если модуль извлечения отдаёт) в flux-ytdlp-albumartists.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file album_artists flux-ytdlp-albumartists.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: cast',
    summary: 'Записать cast (актерский состав, если модуль извлечения отдаёт) в flux-ytdlp-cast.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file cast flux-ytdlp-cast.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: network',
    summary: 'Записать network (телесеть или студия вещания, если модуль извлечения отдаёт) в flux-ytdlp-network.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file network flux-ytdlp-network.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· лимит скорости 500K -F',
    summary: 'Список форматов с ограничением скорости 500 KiB/s (--limit-rate 500K -F); меньше нагрузки на канал при -F; допишите URL.',
    fullLine: 'yt-dlp --limit-rate 500K -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео SV -F',
    summary: 'Гео-обход через Сальвадор (--geo-bypass-country SV -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео HN -F',
    summary: 'Гео-обход через Гондурас (--geo-bypass-country HN -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country HN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео NI -F',
    summary: 'Гео-обход через Никарагуа (--geo-bypass-country NI -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country NI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео GT -F',
    summary: 'Гео-обход через Гватемалу (--geo-bypass-country GT -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео BZ -F',
    summary: 'Гео-обход через Белиз (--geo-bypass-country BZ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео DO -F',
    summary: 'Гео-обход через Доминиканскую Республику (--geo-bypass-country DO -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country DO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео HT -F',
    summary: 'Гео-обход через Гаити (--geo-bypass-country HT -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country HT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео XK -F',
    summary: 'Гео-обход через Косово (--geo-bypass-country XK -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country XK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео VE -F',
    summary: 'Гео-обход через Венесуэлу (--geo-bypass-country VE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country VE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео EC -F',
    summary: 'Гео-обход через Эквадор (--geo-bypass-country EC -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country EC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео PY -F',
    summary: 'Гео-обход через Парагвай (--geo-bypass-country PY -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео CU -F',
    summary: 'Гео-обход через Кубу (--geo-bypass-country CU -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео GY -F',
    summary: 'Гео-обход через Гайану (--geo-bypass-country GY -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео SR -F',
    summary: 'Гео-обход через Суринам (--geo-bypass-country SR -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: webpage_url_scheme',
    summary: 'Записать webpage_url_scheme (http и https страницы) в flux-ytdlp-wuscheme.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file webpage_url_scheme flux-ytdlp-wuscheme.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: playlist',
    summary: 'Записать поле playlist (имя элемента плейлиста, если модуль извлечения отдаёт) в flux-ytdlp-playlist.txt без скачивания; допишите URL плейлиста.',
    fullLine: 'yt-dlp --print-to-file playlist flux-ytdlp-playlist.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: annotations',
    summary: 'Записать annotations (если модуль извлечения отдаёт) в flux-ytdlp-annotations.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file annotations flux-ytdlp-annotations.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: storyboards',
    summary: 'Записать storyboards (доски превью, если модуль извлечения отдаёт) в flux-ytdlp-storyboards.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file storyboards flux-ytdlp-storyboards.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: playlist_webpage_url',
    summary: 'Записать playlist_webpage_url в flux-ytdlp-plwpurl.txt без скачивания; допишите URL плейлиста.',
    fullLine: 'yt-dlp --print-to-file playlist_webpage_url flux-ytdlp-plwpurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· повторы HTTP 20 -F',
    summary: 'Список форматов с увеличенным числом повторов HTTP (--retries 20 -F); нестабильные CDN; допишите URL.',
    fullLine: 'yt-dlp --retries 20 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· повторы фрагментов 20 -F',
    summary: 'Список форматов с повторами для фрагментов DASH и HLS (--fragment-retries 20 -F); допишите URL.',
    fullLine: 'yt-dlp --fragment-retries 20 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: timestamp',
    summary: 'Записать timestamp (Unix-время публикации, если модуль извлечения отдаёт) в flux-ytdlp-ts.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file timestamp flux-ytdlp-ts.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: extractor_key',
    summary: 'Записать extractor_key (внутренний ключ модуля извлечения) в flux-ytdlp-extkey.txt без скачивания; полезно для диагностики; допишите URL.',
    fullLine: 'yt-dlp --print-to-file extractor_key flux-ytdlp-extkey.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: track_id',
    summary: 'Записать track_id (идентификатор трека у модуля извлечения, если отдаёт) в flux-ytdlp-trackid.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file track_id flux-ytdlp-trackid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: album_id',
    summary: 'Записать album_id (идентификатор альбома, если модуль извлечения отдаёт) в flux-ytdlp-albumid.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file album_id flux-ytdlp-albumid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: dynamic_range',
    summary: 'Записать динамический диапазон (поле dynamic_range: SDR, HDR, Dolby Vision — если модуль извлечения отдаёт) в flux-ytdlp-dynrange.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file dynamic_range flux-ytdlp-dynrange.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: audio_ext',
    summary: 'Записать audio_ext выбранного формата (m4a, webm, opus и т. п.) в flux-ytdlp-audext.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file audio_ext flux-ytdlp-audext.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: video_ext',
    summary: 'Записать video_ext выбранного формата (mp4, webm, none и т. п.) в flux-ytdlp-vidext.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file video_ext flux-ytdlp-vidext.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: player_url',
    summary: 'Записать player_url (URL встраиваемого плеера, embed, если модуль извлечения отдаёт) в flux-ytdlp-playerurl.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file player_url flux-ytdlp-playerurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· параллельно 4 фрагмента -F',
    summary: 'Список форматов с параллельной подкачкой фрагментов DASH и HLS (--concurrent-fragments 4 -F); допишите URL.',
    fullLine: 'yt-dlp --concurrent-fragments 4 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео RE -F',
    summary: 'Гео-обход через Реюньон (--geo-bypass-country RE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country RE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео MU -F',
    summary: 'Гео-обход через Маврикий (--geo-bypass-country MU -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео SC -F',
    summary: 'Гео-обход через Сейшелы (--geo-bypass-country SC -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео TT -F',
    summary: 'Гео-обход через Тринидад и Тобаго (--geo-bypass-country TT -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: audio_channels',
    summary: 'Записать audio_channels в flux-ytdlp-achs.txt без скачивания (--print-to-file audio_channels …); допишите URL.',
    fullLine: 'yt-dlp --print-to-file audio_channels flux-ytdlp-achs.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: chapter',
    summary: 'Записать chapter (название текущей главы) в flux-ytdlp-chapter.txt без скачивания (--print-to-file chapter …); допишите URL.',
    fullLine: 'yt-dlp --print-to-file chapter flux-ytdlp-chapter.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: chapter_id',
    summary: 'Записать chapter_id в flux-ytdlp-chapid.txt без скачивания (--print-to-file chapter_id …); допишите URL.',
    fullLine: 'yt-dlp --print-to-file chapter_id flux-ytdlp-chapid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: chapter_number',
    summary: 'Записать chapter_number в flux-ytdlp-chapnum.txt без скачивания (--print-to-file chapter_number …); допишите URL.',
    fullLine: 'yt-dlp --print-to-file chapter_number flux-ytdlp-chapnum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: start_time',
    summary: 'Записать start_time (секунды начала фрагмента) в flux-ytdlp-stt.txt без скачивания (--print-to-file start_time …); допишите URL.',
    fullLine: 'yt-dlp --print-to-file start_time flux-ytdlp-stt.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: end_time',
    summary: 'Записать end_time (секунды окончания фрагмента) в flux-ytdlp-end.txt без скачивания (--print-to-file end_time …); допишите URL.',
    fullLine: 'yt-dlp --print-to-file end_time flux-ytdlp-end.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: quality',
    summary: 'Записать quality (оценка формата yt-dlp) в flux-ytdlp-quality.txt без скачивания (--print-to-file quality …); допишите URL.',
    fullLine: 'yt-dlp --print-to-file quality flux-ytdlp-quality.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: formats_table',
    summary: 'Записать formats_table (то, что показывает -F) в flux-ytdlp-ftbl.txt без скачивания (--print-to-file formats_table …); допишите URL.',
    fullLine: 'yt-dlp --print-to-file formats_table flux-ytdlp-ftbl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео AF -F',
    summary: 'Гео-обход через Афганистан (--geo-bypass-country AF -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео AO -F',
    summary: 'Гео-обход через Анголу (--geo-bypass-country AO -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео HK -F',
    summary: 'Гео-обход через Гонконг (--geo-bypass-country HK -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country HK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео IL -F',
    summary: 'Гео-обход через Израиль (--geo-bypass-country IL -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country IL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео KW -F',
    summary: 'Гео-обход через Кувейт (--geo-bypass-country KW -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country KW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· чистый info.json + -F',
    summary: 'Чистить .info.json от приватных URL и токенов перед записью (--clean-info-json -F); допишите URL.',
    fullLine: 'yt-dlp --clean-info-json -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: format',
    summary: 'Записать человекочитаемую строку выбранного формата (format) в flux-ytdlp-fmtline.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file format flux-ytdlp-fmtline.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: language_preference',
    summary: 'Записать language_preference (предпочтение языка субтитров и аудио, если модуль извлечения отдаёт) в flux-ytdlp-langpref.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file language_preference flux-ytdlp-langpref.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: autonumber',
    summary: 'Записать autonumber (порядковый номер в плейлисте для шаблона -o) в flux-ytdlp-anum.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file autonumber flux-ytdlp-anum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео OM -F',
    summary: 'Гео-обход через Оман (--geo-bypass-country OM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country OM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео QA -F',
    summary: 'Гео-обход через Катар (--geo-bypass-country QA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country QA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео BH -F',
    summary: 'Гео-обход через Бахрейн (--geo-bypass-country BH -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country BH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео AE -F',
    summary: 'Гео-обход через ОАЭ (--geo-bypass-country AE -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country AE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео SA -F',
    summary: 'Гео-обход через Саудовскую Аравию (--geo-bypass-country SA -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country SA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: filename_sanitized',
    summary: 'Записать filename_sanitized (имя файла по шаблону -o после санитизации) в flux-ytdlp-fnsan.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file filename_sanitized flux-ytdlp-fnsan.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: requested_downloads',
    summary: 'Записать requested_downloads (список запланированных загрузок после слияния потоков) в flux-ytdlp-reqdl.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file requested_downloads flux-ytdlp-reqdl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· извлечение: до 5 повторов -F',
    summary: 'Повторы модуля извлечения вместе со списком форматов (--extractor-retries 5 -F); ошибки страницы и кода 403; допишите URL.',
    fullLine: 'yt-dlp --extractor-retries 5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео JO -F',
    summary: 'Гео-обход через Иорданию (--geo-bypass-country JO -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country JO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео LB -F',
    summary: 'Гео-обход через Ливан (--geo-bypass-country LB -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country LB -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео UZ -F',
    summary: 'Гео-обход через Узбекистан (--geo-bypass-country UZ -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country UZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео TM -F',
    summary: 'Гео-обход через Туркменистан (--geo-bypass-country TM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country TM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: modified_date',
    summary: 'Записать modified_date (YYYYMMDD правки метаданных, если модуль извлечения отдаёт) в flux-ytdlp-mdate.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file modified_date flux-ytdlp-mdate.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: live_title',
    summary: 'Записать live_title (заголовок прямой трансляции, если есть) в flux-ytdlp-livetitle.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file live_title flux-ytdlp-livetitle.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· HTTP-фрагмент 1 MiB -F',
    summary: 'Меньший HTTP-чанк 1 MiB (--http-chunk-size 1M -F); тонкая подстройка скорости и стабильности CDN; допишите URL.',
    fullLine: 'yt-dlp --http-chunk-size 1M -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео CV -F',
    summary: 'Гео-обход через Кабо-Верде (--geo-bypass-country CV -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country CV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео GM -F',
    summary: 'Гео-обход через Гамбию (--geo-bypass-country GM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country GM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео KM -F',
    summary: 'Гео-обход через Коморы (--geo-bypass-country KM -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country KM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: section_start',
    summary: 'Записать section_start (начало клипа по URL-фрагменту или параметру t=, если модуль извлечения отдаёт) в flux-ytdlp-segstart.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file section_start flux-ytdlp-segstart.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: section_end',
    summary: 'Записать section_end (конец клипа по URL-фрагменту, если есть) в flux-ytdlp-segend.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file section_end flux-ytdlp-segend.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: played_count',
    summary: 'Записать played_count (оценка числа воспроизведений, если сайт отдаёт) в flux-ytdlp-playcnt.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file played_count flux-ytdlp-playcnt.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: referrer',
    summary: 'Записать referrer (HTTP Referer страницы, если есть) в flux-ytdlp-refurl.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file referrer flux-ytdlp-refurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист наоборот -F',
    summary: 'Плейлист в обратном порядке вместе со списком форматов (--playlist-reverse -F); допишите URL плейлиста.',
    fullLine: 'yt-dlp --playlist-reverse -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео YT -F',
    summary: 'Гео-обход через Майотту (--geo-bypass-country YT -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country YT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео MG -F',
    summary: 'Гео-обход через Мадагаскар (--geo-bypass-country MG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country MG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео PG -F',
    summary: 'Гео-обход через Папуа — Новую Гвинею (--geo-bypass-country PG -F); допишите URL.',
    fullLine: 'yt-dlp --geo-bypass-country PG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: extractor_key',
    summary: 'Записать extractor_key (внутренний ключ модуля извлечения yt-dlp) в flux-ytdlp-extractor-key.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file extractor_key flux-ytdlp-extractor-key.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: uploader_url',
    summary: 'Записать uploader_url (канонический URL канала или автора, если есть) в flux-ytdlp-uploader-url.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file uploader_url flux-ytdlp-uploader-url.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: thumbnail',
    summary: 'Записать миниатюру (thumbnail, основной URL обложки) в flux-ytdlp-thumb-url.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file thumbnail flux-ytdlp-thumb-url.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: keywords',
    summary: 'Записать keywords (теги и SEO-ключи, если модуль извлечения отдаёт) в flux-ytdlp-keywords.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file keywords flux-ytdlp-keywords.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: plchurl',
    summary: 'Записать playlist_channel_url (канонический URL вкладки или канала плейлиста, если есть) в flux-ytdlp-plchurl.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file playlist_channel_url flux-ytdlp-plchurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: starring',
    summary: 'Записать starring (верхний актёрский блок, если модуль извлечения отдаёт) в flux-ytdlp-starring.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file starring flux-ytdlp-starring.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: title_sort',
    summary: 'Записать title_sort (сортировочный заголовок каталога, если есть) в flux-ytdlp-titlesort.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file title_sort flux-ytdlp-titlesort.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: season',
    summary: 'Записать season (название или метка сезона, если модуль извлечения отдаёт) в flux-ytdlp-season.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file season flux-ytdlp-season.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: section_number',
    summary: 'Записать section_number (номер секции или части релиза, если модуль извлечения отдаёт) в flux-ytdlp-secnum.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file section_number flux-ytdlp-secnum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: isrc',
    summary: 'Записать isrc (код ISRC трека или релиза, если площадка отдаёт) в flux-ytdlp-isrc.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file isrc flux-ytdlp-isrc.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: track_sort',
    summary: 'Записать track_sort (сортировочный номер или имя трека, если модуль извлечения отдаёт) в flux-ytdlp-tracksort.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file track_sort flux-ytdlp-tracksort.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: alt_description',
    summary: 'Записать alt_description (краткое или альтернативное описание, если модуль извлечения отдаёт) в flux-ytdlp-altdesc.txt без скачивания; допишите URL.',
    fullLine: 'yt-dlp --print-to-file alt_description flux-ytdlp-altdesc.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: view_count alt file',
    summary: 'Записать view_count в отдельный flux-ytdlp-viewcount.txt без скачивания (дубль поля для кастомных сценариев рядом с другими txt); допишите URL.',
    fullLine: 'yt-dlp --print-to-file view_count flux-ytdlp-viewcount.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· обновить yt-dlp → stable',
    summary: 'Обновить yt-dlp до стабильной ветки (--update-to stable); URL не нужен.',
    fullLine: 'yt-dlp --update-to stable'
  }
]

/** §8 — ffprobe по текущему превью редактора (путь к файлу подставляется при запуске). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA: TerminalCommandHintEntry[] = [
  {
    tool: 'ffprobe',
    token: '· контейнер и дорожки',
    summary: 'Полный отчёт утилиты ffprobe по текущему файлу превью; путь к медиа подставляется при запуске.',
    fullLine: `ffprobe -hide_banner -show_format -show_streams ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· длительность контейнера',
    summary: 'Кратко: длительность, размер и битрейт (duration, size, bit_rate) из блока format.',
    fullLine: `ffprobe -hide_banner -show_entries format=duration,size,bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы и сводка контейнера',
    summary: 'Главы и метаданные контейнера (-show_chapters -show_format); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_format ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 кратко',
    summary: 'Поток v:0: ширина, высота, частота кадров и формат пикселей (width, height, r_frame_rate, pix_fmt; одно поле на строку — default=nw=1); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=width,height,r_frame_rate,pix_fmt -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 цвет',
    summary: 'Поток v:0: цветовое пространство, первичные цвета и кривая переноса (color_space, color_primaries, color_transfer; диагностика HDR и SDR); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=color_space,color_primaries,color_transfer -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 битрейт и частота кадров',
    summary: 'Поток v:0: битрейт и средняя частота кадров (bit_rate, avg_frame_rate; сверка с r_frame_rate из компактного шаблона); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=bit_rate,avg_frame_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 SAR и DAR',
    summary: 'Поток v:0: sample_aspect_ratio и display_aspect_ratio (анаморф и неквадратные пиксели); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=sample_aspect_ratio,display_aspect_ratio -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 кратко',
    summary: 'Поток a:0: кодек, частота дискретизации и число каналов (codec_name, sample_rate, channels; одно поле на строку — default=nw=1); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 язык',
    summary: 'Тег языка первой аудиодорожки (stream_tags: language); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream_tags=language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 PCM',
    summary: 'Поток a:0: битность сэмпла и формат сэмпла (bits_per_sample, sample_fmt; PCM и глубина); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=bits_per_sample,sample_fmt -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 кратко',
    summary: 'Поток s:0: кодек и строка тега кодека (codec_name, codec_tag_string; одно поле на строку — default=nw=1); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· все дорожки (формат compact)',
    summary: 'Все дорожки одной строкой: индекс, тип и имя кодека (index, codec_type, codec_name; вывод -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries stream=index,codec_type,codec_name -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· дорожки и вложения',
    summary: 'Все дорожки и теги имени файла и MIME (filename, mimetype; вложения и шрифты MKV, типы data и attachment); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries stream=index,codec_type,codec_name:stream_tags=filename,mimetype -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер и дорожки: JSON',
    summary: 'Сводка блоков format и streams в JSON (-of json); удобно скопировать в ZIP-архив для поддержки или обработать в jq.',
    fullLine: `ffprobe -hide_banner -of json -show_format -show_streams ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· только ошибки',
    summary: 'Только ошибки контейнера или потока (-v error -show_error); пусто = файл читается без проблем.',
    fullLine: `ffprobe -hide_banner -v error -show_error ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги: заголовок и кодировщик',
    summary: 'Теги контейнера: заголовок и кодировщик (title, encoder; -show_entries format_tags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=title,encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 поле и диапазон',
    summary: 'Поток v:0: порядок полей кадра и диапазон яркости (field_order, color_range; чересстрочность и полный диапазон яркости — в терминах full range); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=field_order,color_range -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 теги',
    summary: 'Поток s:0: теги заголовка и языка субтитров (stream_tags: title, language); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream_tags=title,language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 кратко',
    summary: 'Вторая аудиодорожка a:1: кодек, частота дискретизации и каналы (codec_name, sample_rate, channels; мультиязык и комментарии); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 теги дорожки',
    summary: 'Поток v:0: теги дорожки handler_name и encoder (stream_tags; отдельно от тегов контейнера); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=handler_name,encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 кадры и длительность',
    summary: 'Поток v:0: число кадров и длительность дорожки (nb_frames, duration); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=nb_frames,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: начало и длительность',
    summary: 'Контейнер: start_time и duration на уровне format (смещение начала и длительность контейнера относительно дорожек); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:1 кратко',
    summary: 'Вторая дорожка субтитров s:1: кодек и строка тега кодека (codec_name, codec_tag_string; несколько языков); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 профиль',
    summary: 'Поток v:0: кодек, профиль и уровень (codec_name, profile, level — для транскодинга); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=codec_name,profile,level -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 профиль и битрейт',
    summary: 'Поток a:0: кодек, профиль и битрейт (codec_name, profile, bit_rate); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=codec_name,profile,bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 опорные и двунаправленные кадры',
    summary: 'Поток v:0: число опорных кадров и наличие B-кадров (refs, has_b_frames; сложность группы кадров GOP); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=refs,has_b_frames -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· дорожки: атрибуты (все)',
    summary: 'Все дорожки: индекс, тип и disposition (index, codec_type, disposition: default, forced, captions, attached_pic — по умолчанию, принудительно, субтитры, обложка); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries stream=index,codec_type,disposition -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: число потоков и имя формата',
    summary: 'Контейнер: число потоков, программ и имя формата (nb_streams, nb_programs, format_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=nb_streams,nb_programs,format_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 пересчёт кадров',
    summary: 'Точный пересчёт кадров v:0 (-count_frames, поле nb_read_frames); медленно, но даёт реальный счёт; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 атрибуты дорожки',
    summary: 'Поток a:0: раскладка дорожки disposition (default, forced, comment и т. д.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 пиксели и цвет',
    summary: 'Поток v:0: формат пикселей и цвет (pix_fmt, color_space, color_range; контекст SDR и HDR без отдельного color_transfer); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=pix_fmt,color_space,color_range -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 размер кадра: хранение и отображение',
    summary: 'Поток v:0: coded_width, coded_height и width, height (размер хранения и отображения, анаморф); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=coded_width,coded_height,width,height -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: время создания',
    summary: 'Тег контейнера creation_time (время записи файла или потока метаданных); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=creation_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 атрибуты дорожки',
    summary: 'Поток s:0: disposition (default, forced, hearing_impaired для слабослышащих и т. д.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 таймбаза и начальный PTS',
    summary: 'Поток v:0: time_base и start_pts (база времени и точка отсчёта меток); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 таймбаза и начальный PTS',
    summary: 'Поток a:0: time_base и start_pts (база времени и точка отсчёта аудио); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 битрейт и максимум',
    summary: 'Поток v:0: битрейт и максимальный битрейт (bit_rate, max_bit_rate; средний и пиковый при переменном битрейте, VBR); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=bit_rate,max_bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: имя входа',
    summary: 'Имя входа, которое видит демультиплексор (format.filename); сверка пути и редиректов; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=filename -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 тег поворота',
    summary: 'Устаревший тег поворота rotate у видео (часто QuickTime и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=rotate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 расклад и битрейт',
    summary: 'Поток a:0: расклад каналов и битрейт (channel_layout, bit_rate); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=channel_layout,bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: битрейт',
    summary: 'Сводный битрейт контейнера (format.bit_rate и сумма дорожек); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 название и обработчик',
    summary: 'Поток a:0: теги title и handler_name дорожки (stream_tags: название и обработчик); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream_tags=title,handler_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 номинальная частота кадров',
    summary: 'Только частота кадров r_frame_rate у видео v:0 (сверка с avg_frame_rate в других шаблонах); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=r_frame_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: бренды совместимости (MP4/MOV)',
    summary: 'Теги контейнера: основной бренд и совместимые бренды (major_brand, compatible_brands; семейство контейнеров MP4 и MOV); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=major_brand,compatible_brands -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:2 кратко',
    summary: 'Третья дорожка субтитров s:2: кодек и строка тега кодека (codec_name, codec_tag_string); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:2 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 субтитры в потоке и тип AVC',
    summary: 'Поток v:0: признаки субтитров и AVC (closed_captions, is_avc; стандарты CEA-608 и CEA-708 и элементарный поток AVC); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=closed_captions,is_avc -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложение t:0 (MKV)',
    summary: 'Первая вложенная дорожка t:0 (шрифты и обложки MKV): codec_name и codec_tag_string; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:0 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· data-дорожка d:0',
    summary: 'Первая data-дорожка d:0 (метаданные с привязкой ко времени и др.): codec_name и codec_tag_string; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:0 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 идентификатор FourCC',
    summary: 'Поток v:0: codec_tag_string (четырёхбуквенный идентификатор FourCC — бренд сырого кодека); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: оценка зондирования',
    summary: 'probe_score контейнера (насколько уверенно выбран демультиплексор); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=probe_score -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:2 кратко',
    summary: 'Третья аудиодорожка a:2: кодек, частота дискретизации и каналы (codec_name, sample_rate, channels); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:2 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· дымовая проверка декода',
    summary: 'Быстрый прогон декодера первых 10 с (-t 10), вывод в пустой мультиплексор (-f null); нагрузка на центральный процессор (CPU) и графический процессор (GPU).',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 10 -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· один кадр, пустой выход',
    summary: 'Декод одного кадра с выводом в пустой мультиплексор (-f null, -frames:v 1); быстрее полной дымовой проверки на длинных файлах.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -frames:v 1 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: полное имя формата',
    summary: 'Человекочитаемое имя контейнера (format.format_long_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=format_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 расположение цветности',
    summary: 'Поток v:0: chroma_location (расположение субдискретизации цветности, напр. 4:2:0); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=chroma_location -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· программы TS (формат compact)',
    summary: 'MPEG-TS и M3U8: список программ демультиплексора (-show_programs, вывод -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_programs -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 боковые данные дорожки',
    summary: 'Поток v:0: боковые метаданные дорожки (side_data_list: матрица поворота Display Matrix, HDR и др.; компактно); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=side_data_list -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы: таблица (CSV)',
    summary: 'Таблица глав построчно (-show_chapters, вывод -of csv); без лишнего текста; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -of csv=p=0 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 начало и длительность',
    summary: 'Поток v:0: start_time и duration дорожки (сверка с format и смещениями); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 начало и длительность',
    summary: 'Поток a:0: start_time и duration дорожки (рассинхрон с видео); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 битность сэмпла',
    summary: 'Поток v:0: bits_per_raw_sample (глубина сырого сэмпла: 8, 10 или 12 бит и т. д.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=bits_per_raw_sample -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:1 кратко',
    summary: 'Вторая видеодорожка v:1 (несколько ракурсов — редкий режим в контейнерах): кодек, ширина и высота (codec_name, width, height); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:1 -show_entries stream=codec_name,width,height -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: размер и длительность',
    summary: 'Контейнер: size и duration (сверка с битрейтом и дорожками); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=size,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:1 кодек и язык',
    summary: 'Вторая дорожка субтитров s:1: codec_name и stream_tags language; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=codec_name:stream_tags=language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 атрибуты дорожки',
    summary: 'Вторая аудиодорожка a:1: disposition (forced, default и т. д.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: тег языка',
    summary: 'Тег языка контейнера format_tags language (если есть); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ремукс 5 с, пустой выход',
    summary: 'Копирование потоков первых 5 с в пустой мультиплексор (-t 5 -c copy, -f null); дымовая проверка контейнера без перекодирования.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 5 -c copy -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· декод, игнор ошибок',
    summary: 'Короткий декод с подавлением ошибок потока (-err_detect ignore_err -t 2); битые кадры и MPEG-TS; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -err_detect ignore_err -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 2 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги исполнитель и альбом',
    summary: 'Теги контейнера artist и album (аудиофайлы и мультимедиа); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=artist,album -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 средняя частота кадров',
    summary: 'Поток v:0: только avg_frame_rate (сверка с r_frame_rate в других шаблонах); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=avg_frame_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· аудио 3 с, пустой выход',
    summary: 'Декодирование только аудио первых 3 с (-vn -sn); быстрее полной дымовой проверки на видеофайлах; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vn -sn -t 3 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 длинное имя кодека',
    summary: 'Поток v:0: codec_long_name (человекочитаемое имя кодека); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· тег кодировщик (контейнер)',
    summary: 'Тег контейнера encoder (format_tags.encoder); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:3 кратко',
    summary: 'Четвёртая аудиодорожка a:3: кодек, частота дискретизации и каналы (codec_name, sample_rate, channels); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:3 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:3 кратко',
    summary: 'Четвёртая дорожка субтитров s:3: кодек и строка тега кодека (codec_name, codec_tag_string); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:3 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· видео 2 с, пустой выход',
    summary: 'Декодирование только видео первых 2 с (-an -sn); без аудио и субтитров; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -an -sn -t 2 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: читаемый вывод (-pretty)',
    summary: 'Секция format в удобочитаемом виде (-pretty -show_format); единицы и время форматированы; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -pretty -show_format ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: плоский вывод (-of flat)',
    summary: 'Плоский вывод format ключ=значение (-of flat -show_format); удобно разбирать текстом (например, утилитами grep и awk); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -of flat -show_format ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 первые 5 пакетов',
    summary: 'Первые 5 пакетов v:0 (-show_packets -read_intervals %+#5, вывод -of compact); метки времени и размеры; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#5 -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 первые 5 кадров',
    summary: 'Первые 5 кадров v:0 (-show_frames -read_intervals %+#5, вывод -of compact); тип, размер и PTS; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#5 -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· версия ffprobe',
    summary: 'Версия ffprobe и быстрый разбор файла (-show_program_version); сверка сборки; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_program_version ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 первые 3 пакета',
    summary: 'Первые 3 аудиопакета a:0 (PTS, размер; вывод -of compact); рваный MPEG-TS; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_packets -read_intervals %+#3 -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· декод после смещения 2 с',
    summary: 'Дымовая проверка: декод с середины (-ss 10 -t 2); конец файла и индекс в длинных MP4; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -ss 10 -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 2 -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: громкость EBU (loudnorm) 60с',
    summary: 'Замер интегральной громкости фильтром loudnorm (print_format=summary) за 60 с; -vn -sn; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af loudnorm=print_format=summary -t 60 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: комментарий и аннотация',
    summary: 'Теги контейнера comment и synopsis (комментарий и краткая сводка в метаданных); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=comment,synopsis -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 таймбаза кодека',
    summary: 'Поток s:0: codec_time_base и time_base (таймбаза субтитров и видео); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=codec_time_base,time_base -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 размер extradata',
    summary: 'Поток v:0: extradata_size (размер декодер-заголовков) и initial_padding; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=extradata_size,initial_padding -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 битрейт',
    summary: 'Первая дорожка субтитров s:0: битрейт (bit_rate, если задан в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: длительность в тиках',
    summary: 'Контейнер: duration_ts (длительность в единицах time_base); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=duration_ts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· тег авторские права',
    summary: 'Тег контейнера copyright (format_tags=copyright); кто и когда задал; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=copyright -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 битрейт и длительность (MKV-теги)',
    summary: 'MKV-статистика v:0: stream_tags BPS и DURATION (битрейт и длительность дорожки, если записаны mkvtoolnix); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=BPS,DURATION -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 длительность в теге',
    summary: 'Поток s:0: stream_tags duration (длительность субтитров, если записана в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream_tags=duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· объём зондирования (байты)',
    summary: 'Сколько байт ушло на зондирование демультиплексором (-show_entries format=probe_size); диагностика «глубины» анализа; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=probe_size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: масштаб 320, 1 с, пустой выход',
    summary: 'Дымовая проверка: перекодирование масштаба 320:-1 за 1 с в пустой выход (-vf scale=320:-1 -t 1, -f null); проверка цепочки видеофильтров; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=320:-1 -t 1 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 время создания дорожки',
    summary: 'Поток v:0: stream_tags creation_time (отличается от format при перепаковке); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=creation_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· тег имени обработчика',
    summary: 'Тег контейнера handler_name (format_tags.handler_name; часто QuickTime и MOV); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=handler_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: копия аудио 3 с, пустой выход',
    summary: 'Перепаковка только аудио в пустой выход (-vn -sn -acodec copy -t 3, -f null); проверка дорожки без декода видео; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vn -sn -acodec copy -t 3 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 глубина PCM',
    summary: 'Поток a:0: bits_per_raw_sample (глубина PCM при несжатом звуке и форматах без потерь, lossless) при наличии; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=bits_per_raw_sample -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 индекс и кодек',
    summary: 'Поток v:0: index и codec_name (порядок дорожек в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=index,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 профиль и уровень',
    summary: 'Поток v:0: profile и level (профиль и уровень H.264 и HEVC); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=profile,level -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:2 атрибуты дорожки',
    summary: 'Третья дорожка субтитров s:2: disposition (forced, default, hearing_impaired и т. д.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:2 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:2 атрибуты дорожки',
    summary: 'Третья аудиодорожка a:2: disposition (default, forced и т. д.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:2 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:1 профиль и уровень',
    summary: 'Вторая видеодорожка v:1: profile и level (редкие случаи с несколькими ракурсами и дубликатами дорожек); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:1 -show_entries stream=profile,level -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:1 начало и длительность',
    summary: 'Вторая дорожка субтитров s:1: start_time и duration дорожки; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: поток v:0 без перекода 2с',
    summary: 'Перепаковка только первой видеодорожки без перекодирования (-map 0:v:0 -c:v copy); без аудио и субтитров; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 2 -map 0:v:0 -c:v copy -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 таймбаза и начальный PTS',
    summary: 'Поток s:0: time_base и start_pts (смещение субтитров относительно видео); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: замер громкости 10с',
    summary: 'Замер громкости первых 10 с (-af volumedetect -vn -sn); средняя и максимальная громкость (поля mean_volume и max_volume) попадают в стандартный поток ошибок (stderr); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volumedetect -t 10 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: жанр и дата',
    summary: 'Теги контейнера genre и date (каталогизация и дата); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=genre,date -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: поиск тишины 30с',
    summary: 'Поиск тишины в первых 30 с (-af silencedetect=noise=-50dB:d=0.3); в стандартном потоке ошибок (stderr) — метки silence_start и silence_end; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af silencedetect=noise=-50dB:d=0.3 -t 30 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 атрибуты дорожки',
    summary: 'Первая видеодорожка v:0: disposition (default, forced, attached_pic и т. д.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 битрейт',
    summary: 'Вторая аудиодорожка a:1: битрейт (bit_rate; мультиязык, комментарии); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: статистика аудио 5с',
    summary: 'Краткая статистика аудио первых 5 с (-af astats=metadata=1:reset=1); СКЗ и пик (RMS и peak) попадают в стандартный поток ошибок (stderr); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af astats=metadata=1:reset=1 -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 кодировщик (тег дорожки)',
    summary: 'Поток a:0: stream_tags encoder (кодировщик дорожки, если записан); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream_tags=encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: громкость EBU R128, 12с',
    summary: 'EBU R128: интегральная громкость, диапазон громкости и истинный пик (Integrated, LRA и True Peak) первых 12 с (-af ebur128=framelog=verbose); метрики попадают в стандартный поток ошибок (stderr); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af ebur128=framelog=verbose -t 12 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 длинное имя кодека',
    summary: 'Поток a:0: codec_long_name (человекочитаемое имя кодека); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 длинное имя кодека',
    summary: 'Поток s:0: codec_long_name (тип субтитров в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: фазометр 10с',
    summary: 'Стерео-фаза первых 10 с (-af aphasemeter=video=0); предупреждения о моно и фазе попадают в стандартный поток ошибок (stderr); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aphasemeter=video=0 -t 10 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 кодировщик (тег дорожки)',
    summary: 'Поток a:1: stream_tags encoder (если записан в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream_tags=encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: чересстрочность 5с',
    summary: 'Детектор чересстрочности первых 5 с (-vf idet -t 5); метки чересстрочности сверху и снизу и прогрессивной развёртки (TFF, BFF, progressive) попадают в стандартный поток ошибок (stderr); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 5 -vf idet -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: издатель и строка кодировщика',
    summary: 'Теги контейнера publisher и encoded_by (издатель и кодировщик); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=publisher,encoded_by -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: чёрные кадры 30с',
    summary: 'Поиск чёрных интервалов в первых 30 с (-vf blackdetect=d=0.1:pix_th=0.01); метки black_start и black_end попадают в стандартный поток ошибок (stderr); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf blackdetect=d=0.1:pix_th=0.01 -t 30 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: автообрезка 30с',
    summary: 'Оценка обрезки чёрных полей первых 30 с (-vf cropdetect=limit=24:round=16:reset=0); параметры обрезки (crop) попадают в стандартный поток ошибок (stderr); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf cropdetect=limit=24:round=16:reset=0 -t 30 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: залипание кадра 45с',
    summary: 'Поиск залипших кадров первых 45 с (-vf freezedetect=n=-60dB:d=2); метки freeze_start и freeze_end попадают в стандартный поток ошибок (stderr); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf freezedetect=n=-60dB:d=2 -t 45 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: статистика видео 8с',
    summary: 'Статистика уровней и шума первых 8 с (-vf signalstats); YUV-средние и отклонения попадают в стандартный поток ошибок (stderr); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf signalstats -t 8 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· главы: вывод JSON',
    summary: 'Главы контейнера одним JSON (--show-chapters -of json=c=1); длительности и заголовки сегментов; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -of json=c=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 начало и длительность',
    summary: 'Первая дорожка субтитров s:0: start_time и duration (смещение и длительность относительно видео); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 начало и длительность',
    summary: 'Вторая аудиодорожка a:1: start_time и duration (мультиязык, сдвиг); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:1 PTS и таймбаза',
    summary: 'Вторая дорожка субтитров s:1: time_base и start_pts (смещение таймстемпов); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 PTS и таймбаза',
    summary: 'Вторая аудиодорожка a:1: time_base и start_pts (сдвиг относительно контейнера); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: динам. нормализация 5с',
    summary: 'Лёгкая динамическая нормализация громкости первых 5 с (-af dynaudnorm); проверка аудиофильтра; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af dynaudnorm=g=31:f=250:r=0.9 -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: ВЧ-срез 5с',
    summary: 'ВЧ-срез первых 5 с (-af highpass=f=200); проверка аудио-цепочки и тишины в низах; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=200 -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 тег геолокации',
    summary: 'Поток v:0: stream_tags location (координаты GPS и текстовая метка в MOV и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=location -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 формат сэмпла',
    summary: 'Поток a:0: только sample_fmt (s16, fltp и т. д.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=sample_fmt -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· тег текст песни',
    summary: 'Тег контейнера lyrics (текстовые вставки в MP3, M4A и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=lyrics -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 расклад и формат сэмпла',
    summary: 'Поток a:1: channel_layout и sample_fmt (мультиязык, разрядность сэмпла PCM); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=channel_layout,sample_fmt -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: смена сцен 20с',
    summary: 'Детектор смен сцен первых 20 с (-vf scenedetect=scene=0.3); оценка смены кадра (scene_score) попадает в стандартный поток ошибок (stderr); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scenedetect=scene=0.3 -t 20 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· +genpts, ремукс 2 с',
    summary: 'Короткая перепаковка без перекодирования с генерацией PTS (-fflags +genpts -c copy -t 2); битые таймстемпы MPEG-TS и MKV; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -fflags +genpts -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 2 -c copy -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 стереорежим',
    summary: 'Поток v:0: stream_tags stereo_mode (метка 3D и стерео в MKV и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=stereo_mode -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 длительность в тиках',
    summary: 'Поток a:0: длительность в тиках time_base (stream=duration_ts); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=duration_ts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: размер, битрейт, число дорожек',
    summary: 'Контейнер: размер, битрейт и число потоков (size, bit_rate, nb_streams); компактно; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=size,bit_rate,nb_streams -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: ресемпл 44.1 кГц 3с',
    summary: 'Аудио: ресемплинг в 44,1 кГц первые 3 с (-af aresample=44100); проверка цепочки передискретизации (ресемплинг, SRC); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aresample=44100 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег доп. версия (minor)',
    summary: 'Тег контейнера minor_version (младшая версия формата; часто вместе с major_brand у MP4 и MOV); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=minor_version -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: шумоподавление FFT 3с',
    summary: 'Лёгкое шумоподавление в частотной области (FFT, -af afftdn=nf=-25) первых 3 с; проверка аудиофильтра; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afftdn=nf=-25 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: описание и ключевые слова',
    summary: 'Теги контейнера description и keywords (описание и ключевые слова для каталогизации и поиска в MP4, MKV и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=description,keywords -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· тег location (контейнер)',
    summary: 'Тег контейнера location (координаты GPS или URI в метаданных format); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=location -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: компрессор 5с',
    summary: 'Лёгкая компрессия аудио первых 5 с (-af acompressor=threshold=-20dB:ratio=4:attack=5:release=100); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acompressor=threshold=-20dB:ratio=4:attack=5:release=100 -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:2 кодек, размер и профиль',
    summary: 'Третья видеодорожка v:2: кодек, размеры, профиль и уровень (codec_name, width, height, profile, level; мультиракурс и редкие контейнеры); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:2 -show_entries stream=codec_name,width,height,profile,level -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: обрезка тишины 60с',
    summary: 'Обрезка ведущей тишины в первых 60 с (-af silenceremove=…); проверка цепочки -af на речи и музыке; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af silenceremove=start_periods=1:start_duration=0.5:start_threshold=-50dB:detection=peak:stop_periods=-1 -t 60 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 тики на кадр',
    summary: 'Поток v:0: ticks_per_frame (квант времени на кадр относительно time_base); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=ticks_per_frame -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: тембр ВЧ 3с',
    summary: 'Лёгкий эквалайзер ВЧ (treble) первых 3 с (-af treble=g=1); дымовая проверка цепочки аудиофильтров; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af treble=g=1 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег название ПО',
    summary: 'Тег контейнера software (кодировщик и упаковщик контейнера); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=software -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги эпизода (сериал)',
    summary: 'Теги сериала в контейнере (episode_sort, season_number, episode_id); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=episode_sort,season_number,episode_id -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· громкость +3 дБ 2 с',
    summary: 'Усиление аудио +3 dB первые 2 с (-af volume=3dB); дымовая проверка громкости без перекодирования видео; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volume=3dB -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: НЧ-срез 3.5 кГц 3с',
    summary: 'НЧ-фильтр первых 3 с (-af lowpass=f=3500); проверка аудио-цепочки; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowpass=f=3500 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 таймбаза и поля FPS',
    summary: 'Поток a:0: time_base и avg_frame_rate и r_frame_rate (тактовая сетка и дробь FPS у аудио-потока); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=time_base,avg_frame_rate,r_frame_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· полосовой ВЧ и НЧ 4 с',
    summary: 'Полосовой проход 200–3000 Hz первых 4 с (-af highpass=f=200,lowpass=f=3000); дымовая проверка цепочки из двух аудиофильтров (-af); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=200,lowpass=f=3000 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 только intra',
    summary: 'Поток v:0: is_intra_only (все кадры ключевые, без межкадрового предсказания; редкие кодеки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=is_intra_only -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги: композитор и дирижёр',
    summary: 'Теги контейнера composer и conductor (классика и метаданные каталога); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=composer,conductor -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: шумовой гейт 5с',
    summary: 'Шумовой гейт первых 5 с (-af agate=…); проверка динамики и тишины в цепочке -af; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af agate=threshold=0.005:ratio=2:attack=20:release=200 -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: деклик 5с',
    summary: 'Клик-редактор первых 5 с (-af adeclick); диагностика щёлчков и дефектов записи; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af adeclick -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег исполнитель (solo)',
    summary: 'Тег контейнера performer (format_tags=performer); имя исполнителя в каталогизации; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=performer -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 режим альфы',
    summary: 'Поток v:0: stream_tags alpha_mode (альфа-канал VP9 и AV1 в WebM и MKV); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=alpha_mode -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: расширение стерео 3с',
    summary: 'Усиление стерео-разницы первых 3 с (-af extrastereo); проверка ширины стерео-цепочки; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af extrastereo -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег дата покупки',
    summary: 'Тег контейнера purchase_date (iTunes Store и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=purchase_date -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги сортировки каталога',
    summary: 'Теги сортировки каталога (sort_artist, sort_album, sort_title) в format_tags; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=sort_artist,sort_album,sort_title -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: фазер 4с',
    summary: 'Лёгкий фазовый эффект первых 4 с (-af aphaser); дымовая проверка стерео-цепочки аудиофильтров (-af); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aphaser=in_gain=0.4:out_gain=0.74 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег служба (service)',
    summary: 'Теги service_provider и service_name контейнера (IPTV, OFFAIR и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=service_provider,service_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 битность кодированного сэмпла',
    summary: 'Поток a:0: bits_per_coded_sample (глубина закодированного PCM при наличии); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=bits_per_coded_sample -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: флэнжер 4с',
    summary: 'Лёгкий флэнжер (flanger) первых 4 с (-af flanger); дымовая проверка стерео-модуляции; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af flanger -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег ISRC',
    summary: 'Тег контейнера isrc (ISRC релиза); каталогизация аудио; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=isrc -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: де-ессер 4с',
    summary: 'Де-эссер первых 4 с (-af deesser); диагностика свистящих согласных; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af deesser=i=0.5 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 кодировщик (тег дорожки)',
    summary: 'Поток первых субтитров: тег encoder в stream_tags (кодировщик при мультиплексировании); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream_tags=encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: вибрато 4с',
    summary: 'Лёгкая вибрато-модуляция первых 4 с (-af vibrato); дымовая проверка стерео-цепочки аудиофильтров (-af); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af vibrato=f=6.5:d=0.5 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги part и compilation',
    summary: 'Теги контейнера part и compilation (iTunes и многодисковые сборники); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=part,compilation -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: кристалайзер 4с',
    summary: 'Психоакустический кристалайзер (crystalizer) первых 4 с (-af crystalizer); дымовая проверка лёгких аудио-эффектов; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af crystalizer=i=1.2 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 таймбазы кодека и потока',
    summary: 'Поток v:0: codec_time_base и time_base (таймбаза видео и контейнера); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=codec_time_base,time_base -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: тон + сдвиг частоты дискр. 3с',
    summary: 'Лёгкий resample-питч первых 3 с (-af asetrate=44100*1.01,aresample=44100); дымовая проверка цепочки asetrate → aresample; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af asetrate=44100*1.01,aresample=44100 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: авторство и строка кодировщика',
    summary: 'Теги контейнера copyright и encoded_by (право и кодировщик); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=copyright,encoded_by -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: компандер 4с',
    summary: 'Лёгкий компандер первых 4 с (-af compand); дымовая проверка динамической обработки; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af compand=attacks=0.02:decays=0.1:points=-80/-80|-25/-25|0/-10:gain=2 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег исполнитель альбома',
    summary: 'Тег контейнера album_artist (альбомный исполнитель и поле artist); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=album_artist -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги: трек и диск',
    summary: 'Теги контейнера track и disc (номер трека и диска в каталоге); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=track,disc -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: динам. нормализация 4с',
    summary: 'Лёгкая динамическая нормализация громкости первых 4 с (-af dynaudnorm); дымовая проверка цепочки выравнивания воспринимаемой громкости (loudness); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af dynaudnorm=f=150:g=15 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: текст песни и аннотация',
    summary: 'Теги контейнера lyrics и synopsis (текст песни и краткая сводка — подкасты, аудиокниги и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=lyrics,synopsis -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: мягкое клипирование 4с',
    summary: 'Мягкий клиппер первых 4 с (-af asoftclip); дымовая проверка ограничения пиков без жёсткого лимитера; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af asoftclip -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 каналы и расклад',
    summary: 'Поток a:0: число каналов и расклад (channels, channel_layout); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=channels,channel_layout -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: эхо 4с',
    summary: 'Лёгкое эхо первых 4 с (-af aecho); дымовая проверка задержек и смешивания в цепочке -af; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aecho=0.8:0.9:40:0.3 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:1 атрибуты дорожки',
    summary: 'Вторая дорожка субтитров s:1: disposition (forced, default, hearing_impaired и т. д.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: тремоло 4с',
    summary: 'Лёгкая амплитудная модуляция первых 4 с (-af tremolo); дымовая проверка периодического аудиофильтра; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af tremolo=f=6:d=0.5 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: полосовой фильтр 4с',
    summary: 'Узкополосный bandpass первых 4 с (-af bandpass); дымовая проверка частотной фильтрации; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af bandpass=f=1000:width_type=h:width=200 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 кодек и каналы',
    summary: 'Вторая аудиодорожка a:1: кодек, число каналов и расклад (codec_name, channels, channel_layout; мультиязык и комментарии); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=codec_name,channels,channel_layout -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: полка ВЧ 3с',
    summary: 'Лёгкий highshelf: верхняя полка спектра первых 3 с (-af highshelf); дымовая проверка параметрического эквалайзера (-af); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highshelf=f=8000:width_type=o:width=2:g=-6 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:1 размер и кодек',
    summary: 'Вторая видеодорожка v:1: codec_name и width и height (мультикамера и дополнительный ракурс); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:1 -show_entries stream=codec_name,width,height -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: пульсатор 3с',
    summary: 'Лёгкий стерео-пульсатор первых 3 с (-af apulsator); дымовая проверка периодического pan и цепочки -af; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af apulsator=mode=sine:hz=1:width=2 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· data-дорожка d:1 кодек',
    summary: 'Вторая data-дорожка d:1: codec_name и codec_tag_string (таймкоды и метаданные в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:1 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: хорус 4с',
    summary: 'Лёгкий хорус первых 4 с (-af chorus); дымовая проверка задержек и модуляции в цепочке -af; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af chorus=0.5:0.9:50:0.4:0.25:2 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: WMF SDK и кодировщик',
    summary: 'Теги контейнера encoder и WMFSDKVersion (часто у WMV и ASF); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoder,WMFSDKVersion -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: нарастание громкости 3с',
    summary: 'Плавное нарастание громкости первых 3 с (-af afade=t=in:st=0:d=0.6); дымовая проверка нарастания (afade in) без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afade=t=in:st=0:d=0.6 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег инструмент кодирования',
    summary: 'Тег контейнера encoding_tool (какой программой упакован файл — часто Mux, QuickTime и др., если записан); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoding_tool -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: затухание громкости 3с',
    summary: 'Плавное затухание громкости в хвосте первых 3 с (-af afade=t=out:st=1.2:d=0.6); дымовая проверка затухания (afade out) без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afade=t=out:st=1.2:d=0.6 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: оценка зондирования',
    summary: 'Контейнер: probe_score (уверенность ffprobe в формате); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=probe_score -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: темп ×0.95, 3с',
    summary: 'Лёгкое замедление темпа первых 3 с (-af atempo=0.95); дымовая проверка фильтра atempo без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af atempo=0.95 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:1 длинное имя кодека',
    summary: 'Вторая видеодорожка v:1: codec_name и codec_long_name (мультикамера и дополнительный поток); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:1 -show_entries stream=codec_name,codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: лимитер 3с',
    summary: 'Мягкий лимитер пиков первых 3 с (-af alimiter=limit=0.8); дымовая проверка динамики в цепочке -af без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af alimiter=limit=0.8 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· бренды MP4 (теги)',
    summary: 'Теги контейнера major_brand, minor_version и compatible_brands (часто у MP4 и MOV); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=major_brand,minor_version,compatible_brands -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: стерео-коррекция 3с',
    summary: 'Лёгкая стерео-коррекция первых 3 с (-af stereotools=mlev=0.05:phlev=0.05); дымовая проверка ширины и фазы; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af stereotools=mlev=0.05:phlev=0.05 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: непрерывность и сборник',
    summary: 'Теги контейнера gapless_playback и compilation (часто у AAC и ALAC из iTunes); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=gapless_playback,compilation -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: нормализация речи 4с',
    summary: 'Лёгкая нормализация речи и подкаста первых 4 с (-af speechnorm=peak=0.25); дымовая проверка динамики диалога; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af speechnorm=peak=0.25 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: темп (BPM) и тональность',
    summary: 'Теги контейнера BPM и initial_key (если записаны каталогизатором); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=BPM,initial_key -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: межканальный кроссфейд 4с',
    summary: 'Лёгкий межканальный кроссфид bs2b первых 4 с (-af bs2b=profile=j2); дымовая проверка стерео-обработки; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af bs2b=profile=j2 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги исполнитель и альбом',
    summary: 'Теги контейнера artist и album (часто у музыкальных релизов и клипов); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=artist,album -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: акцент НЧ 4с',
    summary: 'Лёгкий низкочастотный акцент первых 4 с (-af bass=g=2:f=120); дымовая проверка эквалайзера НЧ (bass); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af bass=g=2:f=120 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 индекс и кодек',
    summary: 'Первая субтитровая дорожка s:0: index и codec_name (порядок и тип в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=index,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: многополосный эквалайзер 4с',
    summary: 'Лёгкий 10-полосный superequalizer (полоса 3 +4 dB) первых 4 с; дымовая проверка графического эквалайзера; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af superequalizer=3b=4 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги сериала и эпизода',
    summary: 'Теги контейнера show и episode_sort (телекаталоги и сериалы); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=show,episode_sort -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: полка НЧ 4с',
    summary: 'Лёгкий низкочастотный шельф первых 4 с (-af lowshelf=g=2:f=200); дымовая проверка нижнего полочного эквалайзера; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowshelf=g=2:f=200 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: жанр и дата',
    summary: 'Теги контейнера genre и date (каталогизация музыки и релизов); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=genre,date -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: расширение стерео 4с',
    summary: 'Лёгкое расширение стереобазы первых 4 с (-af extrastereo=m=1.2); дымовая проверка ширины и pan; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af extrastereo=m=1.2 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги подкаста и URL',
    summary: 'Теги контейнера podcast и podcasturl (RSS-источник аудио-подкаста); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=podcast,podcasturl -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: биткрашер 4с',
    summary: 'Лёгкое битовое дробление (bit-crush) первых 4 с (-af acrusher=level_in=0.8:level_out=0.8:bits=8:mode=log); дымовая проверка зернистости; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acrusher=level_in=0.8:level_out=0.8:bits=8:mode=log -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· data-дорожка d:2 кодек',
    summary: 'Третья data-дорожка d:2: codec_name и codec_tag_string (дополнительные таймкоды и метаданные); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:2 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: смешение pan-стерео 4с',
    summary: 'Лёгкое стереосмешивание через pan первых 4 с (каналы c0 и c1, кросс-фейд 0.6 и 0.4); дымовая проверка фильтра pan без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af pan=stereo|c0=0.6*c0+0.4*c1|c1=0.4*c0+0.6*c1 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:4 кодек',
    summary: 'Пятая аудиодорожка a:4: codec_name и sample_rate и channels (мультиязык и комментарии); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:4 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:4 кратко',
    summary: 'Пятая дорожка субтитров s:4: codec_name и codec_tag_string; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:4 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги каталога и штрихкода',
    summary: 'Теги контейнера catalog_number и barcode (музыкальные каталоги и UPC); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=catalog_number,barcode -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: ресемпл с компенсацией async 4с',
    summary: 'Лёгкая компенсация рассинхрона через aresample=async=1 первых 4 с; дымовая проверка цепочки ресемплера (aresample); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aresample=async=1:first_pts=0 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: компрессор 4с',
    summary: 'Лёгкий компрессор первых 4 с (-af acompressor=threshold=0.08:ratio=3:attack=5:release=50); дымовая проверка динамики; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acompressor=threshold=0.08:ratio=3:attack=5:release=50 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:2 размер и FPS',
    summary: 'Третий видеопоток v:2: ширина, высота и частота кадров (width, height, r_frame_rate; несколько видеопотоков или альтернативы); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:2 -show_entries stream=width,height,r_frame_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: контраст 3с',
    summary: 'Лёгкий аудио-контраст первых 3 с (-af acontrast=25); дымовая проверка динамики без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acontrast=25 -t 3 -vn -sn -f null -`
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

