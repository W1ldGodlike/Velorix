import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки вкладки «Загрузки» (часть 02). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_02: TerminalCommandHintEntry[] = [
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
  }
]
