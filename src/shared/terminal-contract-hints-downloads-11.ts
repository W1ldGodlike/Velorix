import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки вкладки «Загрузки» (часть 11). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_11: TerminalCommandHintEntry[] = [
  {
    tool: 'yt-dlp',
    token: '· в файл: суммарный битрейт',
    summary:
      'Записать суммарный битрейт (поле tbr, kbps) в flux-ytdlp-tbr.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file tbr flux-ytdlp-tbr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: размер (прибл.)',
    summary:
      'Записать приблизительный размер файла (поле filesize_approx) в flux-ytdlp-fsize.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file filesize_approx flux-ytdlp-fsize.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: протокол',
    summary:
      'Записать протокол транспорта (поле protocol; варианты: https, m3u8 и т. п.) в flux-ytdlp-proto.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file protocol flux-ytdlp-proto.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· отклонить по title -F',
    summary:
      'Исключить элементы плейлиста по подстроке заголовка (--reject-title trailer -F); подстройте шаблон; допишите ссылку.',
    fullLine: 'yt-dlp --reject-title trailer -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео lc (Сент-Люсия) -F',
    summary: 'Гео-обход через Сент-Люсию (--geo-bypass-country LC -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country LC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gd (Гренада) -F',
    summary: 'Гео-обход через Гренаду (--geo-bypass-country GD -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео vc (Сент-Винсент) -F',
    summary:
      'Гео-обход через Сент-Винсент и Гренадины (--geo-bypass-country VC -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country VC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео kn (Сент-Китс и Невис) -F',
    summary: 'Гео-обход через Сент-Китс и Невис (--geo-bypass-country KN -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country KN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео dm (Доминика) -F',
    summary: 'Гео-обход через Доминику (--geo-bypass-country DM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country DM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: индекс в плейлисте',
    summary:
      'Записать индекс ролика в плейлисте (поле playlist_index) в flux-ytdlp-plidx.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist_index flux-ytdlp-plidx.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: автонумерация плейлиста',
    summary:
      'Записать авто-нумерацию плейлиста (поле playlist_autonumber) в flux-ytdlp-plauto.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file playlist_autonumber flux-ytdlp-plauto.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: число элементов плейлиста',
    summary:
      'Записать число элементов плейлиста (поле playlist_count) в flux-ytdlp-plcount.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file playlist_count flux-ytdlp-plcount.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id автора плейлиста',
    summary:
      'Записать идентификатор автора плейлиста (поле playlist_uploader_id) в flux-ytdlp-plupid.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist_uploader_id flux-ytdlp-plupid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id автора',
    summary:
      'Записать идентификатор автора на площадке (поле uploader_id) в flux-ytdlp-upid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file uploader_id flux-ytdlp-upid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: рейтинг',
    summary:
      'Записать среднюю оценку (поле average_rating) в flux-ytdlp-rating.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file average_rating flux-ytdlp-rating.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: доступность',
    summary:
      'Записать строку доступности (поле availability; частые значения: public — для всех, private — приватно, unlisted — только по ссылке, premium, needs_auth) в flux-ytdlp-avail.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file availability flux-ytdlp-avail.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: возрастной лимит',
    summary:
      'Записать возрастной лимит (поле age_limit) в flux-ytdlp-age.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file age_limit flux-ytdlp-age.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео aw (Аруба) -F',
    summary: 'Гео-обход через Арубу (--geo-bypass-country AW -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country AW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cw (Кюрасао) -F',
    summary: 'Гео-обход через Кюрасао (--geo-bypass-country CW -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sx (Синт-Мартен) -F',
    summary: 'Гео-обход через Синт-Мартен (--geo-bypass-country SX -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SX -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tc (Тёркс и Кайкос) -F',
    summary:
      'Гео-обход через острова Тёркс и Кайкос (--geo-bypass-country TC -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео vg (Британские Виргинские о-ва) -F',
    summary:
      'Гео-обход через Виргинские острова (Великобритания) (--geo-bypass-country VG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country VG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: домен страницы',
    summary:
      'Записать домен страницы ролика (поле webpage_url_domain) в flux-ytdlp-wudom.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file webpage_url_domain flux-ytdlp-wudom.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: исходная ссылка',
    summary:
      'Записать (поле original_url) (исходный запрос до редиректов) в flux-ytdlp-ourl.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file original_url flux-ytdlp-ourl.txt --skip-download '
  },
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
  }
]
