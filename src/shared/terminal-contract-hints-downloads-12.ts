import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки Загрузки (часть 12/14; §8 audit prune). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_12: TerminalCommandHintEntry[] = [
  {
    tool: 'yt-dlp',
    token: '· гео er (Эритрея) -F',
    summary: 'Гео-обход через Эритрею (--geo-bypass-country ER -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country ER -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ss (Южный Судан) -F',
    summary: 'Гео-обход через Южный Судан (--geo-bypass-country SS -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ye (Йемен) -F',
    summary: 'Гео-обход через Йемен (--geo-bypass-country YE -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country YE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео mr (Мавритания) -F',
    summary: 'Гео-обход через Мавританию (--geo-bypass-country MR -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country MR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: текст песни',
    summary:
      'Записать (поле lyrics) (текст песни, если модуль извлечения отдаёт) в velorix-ytdlp-lyrics.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file lyrics velorix-ytdlp-lyrics.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: номер диска',
    summary:
      'Записать (поле disc_number) (номер диска в каталоге) в velorix-ytdlp-discnum.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file disc_number velorix-ytdlp-discnum.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: издатель',
    summary:
      'Записать (поле publisher) (издатель и лейбл, если есть) в velorix-ytdlp-publisher.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file publisher velorix-ytdlp-publisher.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: настроение',
    summary:
      'Записать (поле mood) (настроение и тег настроения, если модуль извлечения отдаёт) в velorix-ytdlp-mood.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file mood velorix-ytdlp-mood.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cm (Камерун) -F',
    summary: 'Гео-обход через Камерун (--geo-bypass-country CM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ga (Габон) -F',
    summary: 'Гео-обход через Габон (--geo-bypass-country GA -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GA -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cg (Республика Конго) -F',
    summary: 'Гео-обход через Республику Конго (--geo-bypass-country CG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cd (ДР Конго) -F',
    summary: 'Гео-обход через ДР Конго (--geo-bypass-country CD -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CD -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cf (ЦАР) -F',
    summary: 'Гео-обход через ЦАР (--geo-bypass-country CF -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gq (Экваториальная Гвинея) -F',
    summary: 'Гео-обход через Экваториальную Гвинею (--geo-bypass-country GQ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GQ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео st (Сан-Томе и Принсипи) -F',
    summary: 'Гео-обход через Сан-Томе и Принсипи (--geo-bypass-country ST -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country ST -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bi (Бурунди) -F',
    summary: 'Гео-обход через Бурунди (--geo-bypass-country BI -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео rw (Руанда) -F',
    summary: 'Гео-обход через Руанду (--geo-bypass-country RW -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country RW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ug (Уганда) -F',
    summary: 'Гео-обход через Уганду (--geo-bypass-country UG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country UG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tz (Танзания) -F',
    summary: 'Гео-обход через Танзанию (--geo-bypass-country TZ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео zm (Замбия) -F',
    summary: 'Гео-обход через Замбию (--geo-bypass-country ZM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country ZM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: сортировка исполнителя',
    summary:
      'Записать (поле artist_sort) (сортировочное имя исполнителя) в velorix-ytdlp-artistsort.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file artist_sort velorix-ytdlp-artistsort.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: сортировка альбома',
    summary:
      'Записать (поле album_sort) (сортировочное имя альбома) в velorix-ytdlp-albumsort.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file album_sort velorix-ytdlp-albumsort.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: дирижёр',
    summary:
      'Записать (поле conductor) (дирижёр, если есть) в velorix-ytdlp-conductor.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file conductor velorix-ytdlp-conductor.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: исполнители',
    summary:
      'Записать (поле performers) (список исполнителей, если модуль извлечения отдаёт) в velorix-ytdlp-performers.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file performers velorix-ytdlp-performers.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: авторские права',
    summary:
      'Записать (поле copyright) (строка правообладателя) в velorix-ytdlp-copy.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file copyright velorix-ytdlp-copy.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на автора',
    summary:
      'Записать (поле uploader_url) (каноническая ссылка на страницу автора) в velorix-ytdlp-upurl.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file uploader_url velorix-ytdlp-upurl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: продюсер',
    summary:
      'Записать producer (поле producer, если есть) в velorix-ytdlp-producer.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file producer velorix-ytdlp-producer.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: режиссёр',
    summary:
      'Записать (поле director) (режиссёр или автор видео, если модуль извлечения отдаёт) в velorix-ytdlp-director.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file director velorix-ytdlp-director.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· без предсборки путей -F',
    summary:
      'Не строить выходные пути до фактического скачивания (--no-build-paths -F); меньше лишних mkdir при -F; допишите ссылку.',
    fullLine: 'yt-dlp --no-build-paths -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bj (Бенин) -F',
    summary: 'Гео-обход через Бенин (--geo-bypass-country BJ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BJ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео tg (Того) -F',
    summary: 'Гео-обход через Того (--geo-bypass-country TG -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country TG -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bf (Буркина-Фасо) -F',
    summary: 'Гео-обход через Буркина-Фасо (--geo-bypass-country BF -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BF -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео lr (Либерия) -F',
    summary: 'Гео-обход через Либерию (--geo-bypass-country LR -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country LR -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sl (Сьерра-Леоне) -F',
    summary: 'Гео-обход через Сьерра-Леоне (--geo-bypass-country SL -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SL -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gn (Гвинея) -F',
    summary: 'Гео-обход через Гвинею (--geo-bypass-country GN -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gw (Гвинея-Бисау) -F',
    summary: 'Гео-обход через Гвинею-Бисау (--geo-bypass-country GW -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GW -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: аранжировщик',
    summary:
      'Записать (поле arranger) (аранжировка, если есть) в velorix-ytdlp-arranger.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file arranger velorix-ytdlp-arranger.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ремиксёр',
    summary:
      'Записать (поле remixer) (ремиксёр, если модуль извлечения отдаёт) в velorix-ytdlp-remixer.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file remixer velorix-ytdlp-remixer.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: звукорежиссёр',
    summary:
      'Записать (поле engineer) (звукорежиссёр или инженер записи, если есть) в velorix-ytdlp-engineer.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file engineer velorix-ytdlp-engineer.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: автор текста',
    summary:
      'Записать (поле lyricist) (автор текста, если есть) в velorix-ytdlp-lyricist.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file lyricist velorix-ytdlp-lyricist.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: группировка',
    summary:
      'Записать grouping (поле группировки треков, как в Apple Music и iTunes) в velorix-ytdlp-grouping.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file grouping velorix-ytdlp-grouping.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: сборник',
    summary:
      'Записать (поле compilation) (признак сборника, если модуль извлечения отдаёт) в velorix-ytdlp-compilation.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file compilation velorix-ytdlp-compilation.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: шоу',
    summary:
      'Записать (поле show) (название шоу или сериала, если модуль извлечения отдаёт) в velorix-ytdlp-show.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file show velorix-ytdlp-show.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: исполнители альбома',
    summary:
      'Записать (поле album_artists) (альбомные исполнители: сборники VA, приглашённые артисты feat. и т. п., если модуль извлечения отдаёт) в velorix-ytdlp-albumartists.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file album_artists velorix-ytdlp-albumartists.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: актёрский состав',
    summary:
      'Записать (поле cast) (актерский состав, если модуль извлечения отдаёт) в velorix-ytdlp-cast.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file cast velorix-ytdlp-cast.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: телесеть',
    summary:
      'Записать (поле network) (телесеть или студия вещания, если модуль извлечения отдаёт) в velorix-ytdlp-network.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file network velorix-ytdlp-network.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· лимит скорости 500k -F',
    summary:
      'Список форматов с ограничением скорости 500 KiB/s (--limit-rate 500K -F); меньше нагрузки на канал при -F; допишите ссылку.',
    fullLine: 'yt-dlp --limit-rate 500K -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sv (Сальвадор) -F',
    summary: 'Гео-обход через Сальвадор (--geo-bypass-country SV -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SV -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео hn (Гондурас) -F',
    summary: 'Гео-обход через Гондурас (--geo-bypass-country HN -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country HN -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ni (Никарагуа) -F',
    summary: 'Гео-обход через Никарагуа (--geo-bypass-country NI -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country NI -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gt (Гватемала) -F',
    summary: 'Гео-обход через Гватемалу (--geo-bypass-country GT -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bz (Белиз) -F',
    summary: 'Гео-обход через Белиз (--geo-bypass-country BZ -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BZ -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео do (Доминикана) -F',
    summary:
      'Гео-обход через Доминиканскую Республику (--geo-bypass-country DO -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country DO -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ht (Гаити) -F',
    summary: 'Гео-обход через Гаити (--geo-bypass-country HT -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country HT -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео xk (Косово) -F',
    summary: 'Гео-обход через Косово (--geo-bypass-country XK -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country XK -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ve (Венесуэла) -F',
    summary: 'Гео-обход через Венесуэлу (--geo-bypass-country VE -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country VE -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ec (Эквадор) -F',
    summary: 'Гео-обход через Эквадор (--geo-bypass-country EC -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country EC -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео py (Парагвай) -F',
    summary: 'Гео-обход через Парагвай (--geo-bypass-country PY -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country PY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео cu (Куба) -F',
    summary: 'Гео-обход через Кубу (--geo-bypass-country CU -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country CU -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео gy (Гайана) -F',
    summary: 'Гео-обход через Гайану (--geo-bypass-country GY -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country GY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео sr (Суринам) -F',
    summary: 'Гео-обход через Суринам (--geo-bypass-country SR -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country SR -F '
  }
]
