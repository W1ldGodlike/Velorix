import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки Загрузки (часть 6/14; §8 audit prune). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_06: TerminalCommandHintEntry[] = [
  {
    tool: 'yt-dlp',
    token: '· плейлист: эл. 2–4 -F',
    summary:
      'Фрагмент плейлиста: только элементы 2…4 (--playlist-items 2:4 -F); середина без начала и конца; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --playlist-items 2:4 -F '
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
      'Записать (поле title) в рядом лежащий текстовый файл без скачивания (--print-to-file title velorix-ytdlp-title.txt --skip-download); допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file title velorix-ytdlp-title.txt --skip-download '
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
  }
]
