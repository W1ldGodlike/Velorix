/** RU summary replace pairs (part 02). */
export const TERMINAL_SUMMARY_RU_PAIRS_02 = [
  ['программе загрузки (downloader)', 'программе загрузки (загрузчик)'],
  ['внешней программе загрузки (downloader)', 'внешней программе загрузки (загрузчик)'],
  ['в терминах argv', 'как в argv (поэлементно, без кавычек в значениях)'],
  ['стандартный вывод не терминал (не TTY)', 'stdout не интерактивный терминал (не TTY)'],
  ['CDN и WAF', 'CDN (сеть доставки) и WAF (защита на периметре)'],
  ['медленные CDN', 'медленные сети доставки (CDN)'],
  ['нестабильные CDN', 'нестабильные сети доставки (CDN)'],
  ['стабильности CDN', 'стабильности сетей доставки (CDN)'],
  ['диагностики CDN', 'диагностики сетей доставки (CDN)'],
  ['обход части CDN-глюков', 'обход части сбоев на стороне CDN'],
  ['для старых CDN', 'для старых узлов CDN'],
  [
    'диагностика, ZIP-архив для обращения в поддержку',
    'диагностика, архив ZIP для обращения в поддержку'
  ],
  [
    'трассировка для ZIP-архива поддержки',
    'трассировка для обращения в поддержку в виде архива ZIP'
  ],
  ['скопировать в ZIP-архив для поддержки', 'скопировать в архив ZIP для поддержки'],
  ['создайте urls.txt рядом с cwd или', 'создайте urls.txt рядом с текущей папкой (cwd) или'],
  ['геоблокировки (geo), защита', 'геоблокировки по региону (geo), защита'],
  [
    'TV Everywhere и двухфакторная проверка (2FA): одноразовый код (--twofactor 123456); замените на актуальный TOTP',
    'TV Everywhere (ТВ по подписке провайдера) и двухфакторная проверка (2FA): одноразовый код (--twofactor 123456); замените на актуальный код TOTP (одноразовый по времени)'
  ],
  ['Adobe Pass MSO id для TV Everywhere', 'Идентификатор MSO в Adobe Pass для TV Everywhere'],
  [
    '(discontinuity, --hls-split-discontinuity',
    '(метка разрыва discontinuity в плейлисте, --hls-split-discontinuity'
  ],
  [
    'probe_score контейнера (насколько уверенно выбран демультиплексор)',
    'Поле probe_score по контейнеру: насколько уверенно выбран демультиплексор'
  ],
  [
    'Контейнер: probe_score (уверенность ffprobe в формате)',
    'Контейнер: поле probe_score (уверенность ffprobe в формате)'
  ],
  [
    'EBU R128: интегральная громкость, диапазон громкости и истинный пик (Integrated, LRA и True Peak) первых 12 с',
    'EBU R128: интегральная громкость, диапазон громкости и истинный пик (Integrated — интегральная, LRA — диапазон, True Peak — истинный пик) первых 12 с'
  ],
  [
    'Признак прямого эфира без скачивания (--skip-download --print is_live); в метаданных — да или нет (true/false); допишите ссылку.',
    'Признак прямого эфира без скачивания (--skip-download --print is_live); в выводе булевы литералы true и false (да/нет в JSON); допишите ссылку.'
  ],
  [
    'Статус эфира без скачивания (--skip-download --print live_status): is_live (эфир сейчас), was_live (запись с эфира), not_live (не эфир), is_upcoming или upcoming (до начала эфира); допишите ссылку.',
    'Статус эфира без скачивания (--skip-download --print live_status): is_live (идёт прямой эфир), was_live (после прямого эфира), not_live (не прямой эфир), is_upcoming или upcoming (ожидается старт эфира); допишите ссылку.'
  ],
  [
    'Видимость ролика без скачивания (--skip-download --print availability): public (для всех), unlisted (только по ссылке), premium (ограниченный доступ), needs_auth (нужна авторизация); допишите ссылку (диагностика 403 и входа по логину).',
    'Видимость ролика без скачивания (--skip-download --print availability): строковые значения поля — public (для всех), unlisted (только по ссылке), premium (платный или ограниченный доступ), needs_auth (нужна авторизация); допишите ссылку (диагностика 403 и входа по логину).'
  ],
  [
    'Записать availability (значения вроде public, private, unlisted) в flux-ytdlp-avail.txt без скачивания; допишите ссылку.',
    'Записать availability (частые значения: public — для всех, private — приватно, unlisted — только по ссылке, premium, needs_auth) в flux-ytdlp-avail.txt без скачивания; допишите ссылку.'
  ],
  ['YouTube: мобильный веб-клиент mweb через', 'YouTube: мобильный веб-клиент (mweb) через'],
  ['YouTube: web_creator через', 'YouTube: клиент web_creator через'],
  ['YouTube: web_embedded через', 'YouTube: клиент web_embedded через'],
  ['YouTube: web_safari через', 'YouTube: клиент web_safari через'],
  ['вывод -of compact)', 'вывод -of compact, компактная таблица)'],
  ['вывод -of csv)', 'вывод -of csv — поля через запятую)'],
  ['обработать в jq.', 'обработать утилитой jq.'],
  ['обработать в jq,', 'обработать утилитой jq,'],
  ['Поток v:0: stream_tags BPS и DURATION', 'Поток v:0: теги дорожки stream_tags BPS и DURATION'],
  ['Поток s:0: stream_tags duration', 'Поток s:0: теги дорожки stream_tags duration'],
  ['Поток v:0: stream_tags creation_time', 'Поток v:0: теги дорожки stream_tags creation_time'],
  ['Поток a:0: stream_tags encoder', 'Поток a:0: теги дорожки stream_tags encoder'],
  ['Поток a:1: stream_tags encoder', 'Поток a:1: теги дорожки stream_tags encoder'],
  ['Поток v:0: stream_tags location', 'Поток v:0: теги дорожки stream_tags location'],
  ['Поток v:0: stream_tags stereo_mode', 'Поток v:0: теги дорожки stream_tags stereo_mode'],
  ['Поток v:0: stream_tags alpha_mode', 'Поток v:0: теги дорожки stream_tags alpha_mode'],
  [
    'Тег языка первой аудиодорожки (stream_tags: language)',
    'Тег языка первой аудиодорожки (теги дорожки stream_tags: language)'
  ],
  ['(stream_tags: title, language)', '(теги дорожки stream_tags: title, language)'],
  ['(stream_tags: название и обработчик)', '(теги дорожки stream_tags: название и обработчик)'],
  ['codec_name и stream_tags language', 'codec_name и тег stream_tags language'],
  [
    'Поток v:0: боковые метаданные дорожки (side_data_list: матрица поворота Display Matrix, HDR и др.; компактно)',
    'Поток v:0: боковые метаданные дорожки (поле side_data_list: матрица поворота Display Matrix, HDR и др.; вывод -of compact, компактная таблица)'
  ],
  [
    'MKV-статистика v:0: stream_tags BPS и DURATION',
    'MKV-статистика v:0: теги дорожки stream_tags BPS и DURATION'
  ],
  ['(поле side_data_list (боковые данные): матрица', '(поле side_data_list: матрица'],
  [
    '(-af ebur128=framelog=verbose);',
    '(-af ebur128=framelog=verbose — подробный журнал по кадрам);'
  ],
  [
    'одно поле на строку (шаблон default=nw=1); путь к медиа подставляется из превью.',
    'одно поле на строку (шаблон default=nw=1)); путь к медиа подставляется из превью.'
  ],
  ['одно поле на строку — default=nw=1)', 'одно поле на строку (шаблон default=nw=1))'],
  [
    'Кратко: длительность, размер и битрейт (duration, size, bit_rate) из блока format.',
    'Кратко: длительность, размер и битрейт (поля format: duration — длительность, size — размер в байтах, bit_rate — суммарный битрейт).'
  ],
  [
    '(width, height, r_frame_rate, pix_fmt; одно поле на строку (шаблон default=nw=1))',
    '(поля ffprobe: width — ширина кадра, height — высота кадра, r_frame_rate — номинальная частота кадров, pix_fmt — формат пикселей; одно поле на строку (шаблон default=nw=1))'
  ]
]
