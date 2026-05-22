import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки Загрузки (часть 8/14; §8 audit prune). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_08: TerminalCommandHintEntry[] = [
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
      'Записать идентификатор ролика (поле id) в velorix-ytdlp-id.txt без скачивания (--print-to-file id …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file id velorix-ytdlp-id.txt --skip-download '
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
      'Записать каноническую ссылку на страницу ролика (поле webpage_url) в velorix-ytdlp-pageurl.txt без скачивания (--print-to-file …); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file webpage_url velorix-ytdlp-pageurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: длительность строкой',
    summary:
      'Записать длительность строкой HH:MM:SS (поле duration_string) в velorix-ytdlp-durstr.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file duration_string velorix-ytdlp-durstr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: автор',
    summary:
      'Записать имя автора (поле uploader) в velorix-ytdlp-uploader.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file uploader velorix-ytdlp-uploader.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на канал',
    summary:
      'Записать ссылку на канал или плейлист (поле channel_url) в velorix-ytdlp-churl.txt без скачивания; допишите ссылку на ролик.',
    fullLine: 'yt-dlp --print-to-file channel_url velorix-ytdlp-churl.txt --skip-download '
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
      'Записать число просмотров (поле view_count) в velorix-ytdlp-views.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file view_count velorix-ytdlp-views.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: имя канала',
    summary:
      'Записать имя канала (поле channel) в velorix-ytdlp-channel.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file channel velorix-ytdlp-channel.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: имя экстрактора',
    summary:
      'Записать имя модуля извлечения (поле extractor) в velorix-ytdlp-extractor.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file extractor velorix-ytdlp-extractor.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: название плейлиста',
    summary:
      'Записать заголовок плейлиста (поле playlist_title) в velorix-ytdlp-pltitle.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist_title velorix-ytdlp-pltitle.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: дата загрузки',
    summary:
      'Записать дату публикации YYYYMMDD (поле upload_date) в velorix-ytdlp-update.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file upload_date velorix-ytdlp-update.txt --skip-download '
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
  }
]
