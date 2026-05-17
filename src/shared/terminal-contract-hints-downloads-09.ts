import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки вкладки «Загрузки» (часть 09). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_09: TerminalCommandHintEntry[] = [
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
  }
]
