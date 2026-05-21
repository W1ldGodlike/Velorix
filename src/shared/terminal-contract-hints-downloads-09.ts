import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки Загрузки (часть 9/14; §8 audit prune). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_09: TerminalCommandHintEntry[] = [
  {
    tool: 'yt-dlp',
    token: '· гео um',
    summary: 'Гео-обход с кодом страны UM (--geo-bypass-country UM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country UM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: описание',
    summary: 'Записать (поле description) в flux-ytdlp-desc.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file description flux-ytdlp-desc.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: имя файла',
    summary:
      'Записать шаблон filename (поле метаданных) в flux-ytdlp-fn.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file filename flux-ytdlp-fn.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· без приоритета «свободных» кодеков -F',
    summary:
      'Список форматов без приоритета «свободных» кодеков (--no-prefer-free-formats -F); контраст к --prefer-free-formats; допишите ссылку.',
    fullLine: 'yt-dlp --no-prefer-free-formats -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: категории',
    summary:
      'Записать (поле categories) в flux-ytdlp-categories.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file categories flux-ytdlp-categories.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: теги',
    summary: 'Записать (поле tags) в flux-ytdlp-tags.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file tags flux-ytdlp-tags.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: язык',
    summary: 'Записать (поле language) в flux-ytdlp-language.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file language flux-ytdlp-language.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: авто-субтитры',
    summary:
      'Записать авто-субтитры и ASR (поле automatic_captions) в flux-ytdlp-autocap.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file automatic_captions flux-ytdlp-autocap.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: главы',
    summary: 'Записать (поле chapters) в flux-ytdlp-chapters.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file chapters flux-ytdlp-chapters.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: аудиокодек',
    summary:
      'Записать выбранный или лучший аудиокодек (поле acodec) в flux-ytdlp-acodec.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file acodec flux-ytdlp-acodec.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: видеокодек',
    summary:
      'Записать выбранный или лучший видеокодек (поле vcodec) в flux-ytdlp-vcodec.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file vcodec flux-ytdlp-vcodec.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: лайки',
    summary:
      'Записать число лайков (поле like_count) в flux-ytdlp-likes.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file like_count flux-ytdlp-likes.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: длительность, сек',
    summary:
      'Записать (поле duration) (секунды, число) в flux-ytdlp-duration.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file duration flux-ytdlp-duration.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: субтитры',
    summary:
      'Записать (поле subtitles) (словари дорожек) в flux-ytdlp-subs.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file subtitles flux-ytdlp-subs.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id канала',
    summary:
      'Записать идентификатор канала (поле channel_id) в flux-ytdlp-chid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file channel_id flux-ytdlp-chid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id плейлиста',
    summary:
      'Записать идентификатор плейлиста (поле playlist_id) в flux-ytdlp-plid.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist_id flux-ytdlp-plid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: теплокарта',
    summary:
      'Записать тепловую карту просмотров (поле heatmap; если модуль извлечения отдаёт, напр. YouTube) в flux-ytdlp-heatmap.txt; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file heatmap flux-ytdlp-heatmap.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· ленивый плейлист -F',
    summary:
      'Ленивый плейлист вместе с листингом форматов (--lazy-playlist -F); не разворачивает все элементы заранее; допишите ссылку.',
    fullLine: 'yt-dlp --lazy-playlist -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без дозагрузки .part -F',
    summary:
      'Листинг форматов без дозагрузки частичных .part (--no-continue -F); при скачивании начать заново; допишите ссылку.',
    fullLine: 'yt-dlp --no-continue -F '
  },
  {
    tool: 'yt-dlp',
    token: '· без обратного порядка плейлиста -F',
    summary:
      'Не переворачивать порядок элементов плейлиста (--no-playlist-reverse -F); совместимость с плейлистами; допишите ссылку.',
    fullLine: 'yt-dlp --no-playlist-reverse -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: число комментариев',
    summary:
      'Записать число комментариев (поле comment_count) в flux-ytdlp-ccount.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file comment_count flux-ytdlp-ccount.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: последний сегмент пути страницы',
    summary:
      'Записать базовое имя пути страницы (поле webpage_url_basename) в flux-ytdlp-wubase.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file webpage_url_basename flux-ytdlp-wubase.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: короткий id',
    summary:
      'Записать короткий идентификатор для отображения (поле display_id) в flux-ytdlp-dispid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file display_id flux-ytdlp-dispid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на превью',
    summary:
      'Записать ссылку на обложку (поле thumbnail) в flux-ytdlp-thumburl.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file thumbnail flux-ytdlp-thumburl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: время релиза (unix)',
    summary:
      'Записать (поле release_timestamp) (UNIX, если модуль извлечения отдаёт) в flux-ytdlp-reltsepoch.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file release_timestamp flux-ytdlp-reltsepoch.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: путь вывода (-o)',
    summary:
      'Записать (поле filepath) (после -o) в flux-ytdlp-fpath.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file filepath flux-ytdlp-fpath.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: разрешение',
    summary:
      'Записать (поле resolution) (строка разрешения) в flux-ytdlp-res.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file resolution flux-ytdlp-res.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id формата',
    summary:
      'Записать идентификатор выбранного формата (поле format_id) в flux-ytdlp-fmtid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file format_id flux-ytdlp-fmtid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: расширение',
    summary:
      'Записать (поле ext) (расширение выбранного формата) в flux-ytdlp-ext.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file ext flux-ytdlp-ext.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bm (Бермуды) -F',
    summary: 'Гео-обход через Бермуды (--geo-bypass-country BM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео ky (Каймановы о-ва) -F',
    summary: 'Гео-обход через Каймановы острова (--geo-bypass-country KY -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country KY -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео jm (Ямайка) -F',
    summary: 'Гео-обход через Ямайку (--geo-bypass-country JM -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country JM -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bb (Барбадос) -F',
    summary: 'Гео-обход через Барбадос (--geo-bypass-country BB -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BB -F '
  },
  {
    tool: 'yt-dlp',
    token: '· гео bs (Багамы) -F',
    summary: 'Гео-обход через Багамы (--geo-bypass-country BS -F); допишите ссылку.',
    fullLine: 'yt-dlp --geo-bypass-country BS -F '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ширина',
    summary:
      'Записать ширину выбранного формата (поле width) в flux-ytdlp-width.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file width flux-ytdlp-width.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: высота',
    summary:
      'Записать высоту выбранного формата (поле height) в flux-ytdlp-height.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file height flux-ytdlp-height.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: частота кадров (fps)',
    summary:
      'Записать частоту кадров (поле fps) выбранного формата в flux-ytdlp-fps.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file fps flux-ytdlp-fps.txt --skip-download '
  },
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
  }
]
