import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки Загрузки (часть 10/14; §8 audit prune). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_10: TerminalCommandHintEntry[] = [
  {
    tool: 'yt-dlp',
    token: '· в файл: аудиобитрейт',
    summary:
      'Записать средний битрейт аудио (поле abr; kbps) в flux-ytdlp-abr.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file abr flux-ytdlp-abr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: видеобитрейт',
    summary:
      'Записать средний битрейт видео (поле vbr; kbps) в flux-ytdlp-vbr.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file vbr flux-ytdlp-vbr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: размер файла',
    summary:
      'Записать (поле filesize) (байты, если известен) в flux-ytdlp-fszb.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file filesize flux-ytdlp-fszb.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: примечание к формату',
    summary:
      'Записать примечание к выбранному формату (поле format_note) в flux-ytdlp-fnote.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file format_note flux-ytdlp-fnote.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: автор плейлиста',
    summary:
      'Записать (поле playlist_uploader) (имя автора плейлиста) в flux-ytdlp-plup.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist_uploader flux-ytdlp-plup.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ag (Антигуа и Барбуда) -F',
    summary: 'Гео-обход через Антигуа и Барбуду (--geo-bypass-country AG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ms (Монтсеррат) -F',
    summary: 'Гео-обход через Монтсеррат (--geo-bypass-country MS -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ai (Ангилья) -F',
    summary: 'Гео-обход через Ангилью (--geo-bypass-country AI -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gp (Гваделупа) -F',
    summary: 'Гео-обход через Гваделупу (--geo-bypass-country GP -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GP -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bq (Карибские Нидерланды) -F',
    summary:
      'Гео-обход через Карибские Нидерланды: Бонайре, Синт-Эстатиус и Саба (--geo-bypass-country BQ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BQ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· макс. загрузок 5 -F',
    summary:
      'Остановка после N загрузок из плейлиста (--max-downloads 5 -F); подстройте число; допишите ссылку.',
    fullLine: 'yt-dlp --max-downloads 5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· плейлист: случайный порядок -F',
    summary:
      'Случайный порядок элементов плейлиста перед -F (--playlist-random -F); допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --playlist-random -F '
  },
  {
    tool: 'yt-dlp',
    token: '· перезапись без вопроса -F',
    summary:
      'Перезапись существующих файлов без вопросов (--force-overwrites -F); допишите ссылку.',
    fullLine: 'yt-dlp --force-overwrites -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: полный заголовок',
    summary:
      'Записать полный заголовок (поле fulltitle) в flux-ytdlp-fulltitle.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file fulltitle flux-ytdlp-fulltitle.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: альтернативный заголовок',
    summary:
      'Записать альтернативный заголовок (поле alt_title) в flux-ytdlp-alttitle.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file alt_title flux-ytdlp-alttitle.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: исполнитель',
    summary:
      'Записать исполнителя (поле artist) в flux-ytdlp-artist.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file artist flux-ytdlp-artist.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: альбом',
    summary: 'Записать альбом (поле album) в flux-ytdlp-album.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file album flux-ytdlp-album.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: год релиза',
    summary:
      'Записать год релиза (поле release_year) в flux-ytdlp-relyear.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file release_year flux-ytdlp-relyear.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: эфир сейчас',
    summary:
      'Записать признак прямого эфира (поле is_live) в flux-ytdlp-islive.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file is_live flux-ytdlp-islive.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: статус эфира',
    summary:
      'Записать статус эфира (поле live_status) в flux-ytdlp-livestat.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file live_status flux-ytdlp-livestat.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: подписчики канала',
    summary:
      'Записать число подписчиков канала (поле channel_follower_count) в flux-ytdlp-chfol.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file channel_follower_count flux-ytdlp-chfol.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ck (о-ва Кука) -F',
    summary: 'Гео-обход через Острова Кука (--geo-bypass-country CK -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео nu (Ниуэ) -F',
    summary: 'Гео-обход через Ниуэ (--geo-bypass-country NU -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country NU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tk (Токелау) -F',
    summary: 'Гео-обход через Токелау (--geo-bypass-country TK -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео to (Тонга) -F',
    summary: 'Гео-обход через Тонга (--geo-bypass-country TO -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ws (Самоа) -F',
    summary: 'Гео-обход через Самоа (--geo-bypass-country WS -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country WS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· пропуск недоступных фрагментов -F',
    summary:
      'Потоки DASH и HLS: пропускать недоступные фрагменты вместо аварийной остановки (--skip-unavailable-fragments -F); допишите ссылку.',
    fullLine: 'yt-dlp --skip-unavailable-fragments -F '
  },
  {
    tool: 'yt-dlp',
    token: '· стоп при первой ошибке -F',
    summary:
      'Остановка при первой неустранимой ошибке (--abort-on-error -F); допишите ссылку на плейлист при необходимости.',
    fullLine: 'yt-dlp --abort-on-error -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: сериал',
    summary:
      'Записать (поле series) (шоу) в flux-ytdlp-series.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file series flux-ytdlp-series.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: номер сезона',
    summary:
      'Записать номер сезона (поле season_number) в flux-ytdlp-snum.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file season_number flux-ytdlp-snum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: номер эпизода',
    summary:
      'Записать номер эпизода (поле episode_number) в flux-ytdlp-epnum.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file episode_number flux-ytdlp-epnum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: название эпизода',
    summary:
      'Записать (поле episode) (строка площадки) в flux-ytdlp-epstr.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file episode flux-ytdlp-epstr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id эпизода',
    summary:
      'Записать идентификатор эпизода (поле episode_id) в flux-ytdlp-epid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file episode_id flux-ytdlp-epid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id сезона',
    summary:
      'Записать идентификатор сезона (поле season_id) в flux-ytdlp-sid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file season_id flux-ytdlp-sid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id канала плейлиста',
    summary:
      'Записать идентификатор канала плейлиста (поле playlist_channel_id) в flux-ytdlp-plchid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file playlist_channel_id flux-ytdlp-plchid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: частота дискретизации',
    summary:
      'Записать (поле asr) (Hz дискретизации аудио) в flux-ytdlp-asr.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file asr flux-ytdlp-asr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: защита контента (has_drm)',
    summary:
      'Записать признак DRM (поле has_drm) в flux-ytdlp-drm.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file has_drm flux-ytdlp-drm.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: встраивание в плеер',
    summary:
      'Записать ограничения встроенного плеера (поле playable_in_embed) в flux-ytdlp-embed.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file playable_in_embed flux-ytdlp-embed.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: был эфир',
    summary:
      'Записать признак «был эфир» (поле was_live) в flux-ytdlp-waslive.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file was_live flux-ytdlp-waslive.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: тип медиа',
    summary:
      'Записать тип медиа (поле media_type) в flux-ytdlp-mtype.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file media_type flux-ytdlp-mtype.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео pf (Французская Полинезия) -F',
    summary: 'Гео-обход через Французскую Полинезию (--geo-bypass-country PF -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео nc (Новая Каледония) -F',
    summary: 'Гео-обход через Новую Каледонию (--geo-bypass-country NC -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country NC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео fj (Фиджи) -F',
    summary: 'Гео-обход через Фиджи (--geo-bypass-country FJ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country FJ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео vu (Вануату) -F',
    summary: 'Гео-обход через Вануату (--geo-bypass-country VU -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country VU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sb (Соломоновы о-ва) -F',
    summary: 'Гео-обход через Соломоновы острова (--geo-bypass-country SB -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SB -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео fm (Микронезия) -F',
    summary:
      'Гео-обход через Федеративные Штаты Микронезии (--geo-bypass-country FM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country FM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mh (Маршалловы о-ва) -F',
    summary: 'Гео-обход через Маршалловы острова (--geo-bypass-country MH -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MH -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео pw (Палау) -F',
    summary: 'Гео-обход через Палау (--geo-bypass-country PW -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· не стоп при отклонении формата -F',
    summary:
      'Не останавливаться на отклонённом формате (--no-break-on-reject -F); допишите ссылку.',
    fullLine: 'yt-dlp --no-break-on-reject -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: тип записи',
    summary:
      'Записать тип объекта (поле _type: video, playlist и т. п.) в flux-ytdlp-otype.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file _type flux-ytdlp-otype.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на плейлист',
    summary:
      'Записать ссылку на плейлист (поле playlist_url) в flux-ytdlp-plurl.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist_url flux-ytdlp-plurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на манифест',
    summary:
      'Записать (поле manifest_url) (манифест HLS, DASH и др.) в flux-ytdlp-manurl.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file manifest_url flux-ytdlp-manurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: sar после растяжения кадра',
    summary:
      'Записать (поле stretched_ratio) (анаморфное растяжение кадра, если модуль извлечения отдаёт) в flux-ytdlp-sarfix.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file stretched_ratio flux-ytdlp-sarfix.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: запрошенные форматы',
    summary:
      'Записать (поле requested_formats) (JSON выбранных потоков) в flux-ytdlp-reqf.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file requested_formats flux-ytdlp-reqf.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео nr (Науру) -F',
    summary: 'Гео-обход через Науру (--geo-bypass-country NR -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country NR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tv (Тувалу) -F',
    summary: 'Гео-обход через Тувалу (--geo-bypass-country TV -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ki (Кирибати) -F',
    summary: 'Гео-обход через Кирибати (--geo-bypass-country KI -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country KI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео wf (Уоллис и Футуна) -F',
    summary: 'Гео-обход через Уоллис и Футуна (--geo-bypass-country WF -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country WF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· прогресс реже (Δ 5 с) -F',
    summary:
      'Реже обновлять строку прогресса (--progress-delta 5 -F); меньше шума в выводе при длинных списках с -F; допишите ссылку.',
    fullLine: 'yt-dlp --progress-delta 5 -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: список форматов',
    summary:
      'Записать список форматов (поле formats; JSON или текст от модуля извлечения) в flux-ytdlp-formats.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file formats flux-ytdlp-formats.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: прямая ссылка',
    summary:
      'Записать прямую ссылку на поток выбранного формата (поле url) в flux-ytdlp-url.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file url flux-ytdlp-url.txt --skip-download '
  }
]
