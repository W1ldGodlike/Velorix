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
    summary:
      'Записать (поле description) в velorix-ytdlp-desc.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file description velorix-ytdlp-desc.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: имя файла',
    summary:
      'Записать шаблон filename (поле метаданных) в velorix-ytdlp-fn.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file filename velorix-ytdlp-fn.txt --skip-download '
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
      'Записать (поле categories) в velorix-ytdlp-categories.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file categories velorix-ytdlp-categories.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: теги',
    summary: 'Записать (поле tags) в velorix-ytdlp-tags.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file tags velorix-ytdlp-tags.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: язык',
    summary:
      'Записать (поле language) в velorix-ytdlp-language.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file language velorix-ytdlp-language.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: авто-субтитры',
    summary:
      'Записать авто-субтитры и ASR (поле automatic_captions) в velorix-ytdlp-autocap.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file automatic_captions velorix-ytdlp-autocap.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: главы',
    summary:
      'Записать (поле chapters) в velorix-ytdlp-chapters.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file chapters velorix-ytdlp-chapters.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: аудиокодек',
    summary:
      'Записать выбранный или лучший аудиокодек (поле acodec) в velorix-ytdlp-acodec.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file acodec velorix-ytdlp-acodec.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: видеокодек',
    summary:
      'Записать выбранный или лучший видеокодек (поле vcodec) в velorix-ytdlp-vcodec.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file vcodec velorix-ytdlp-vcodec.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: лайки',
    summary:
      'Записать число лайков (поле like_count) в velorix-ytdlp-likes.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file like_count velorix-ytdlp-likes.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: длительность, сек',
    summary:
      'Записать (поле duration) (секунды, число) в velorix-ytdlp-duration.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file duration velorix-ytdlp-duration.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: субтитры',
    summary:
      'Записать (поле subtitles) (словари дорожек) в velorix-ytdlp-subs.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file subtitles velorix-ytdlp-subs.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id канала',
    summary:
      'Записать идентификатор канала (поле channel_id) в velorix-ytdlp-chid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file channel_id velorix-ytdlp-chid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id плейлиста',
    summary:
      'Записать идентификатор плейлиста (поле playlist_id) в velorix-ytdlp-plid.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist_id velorix-ytdlp-plid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: теплокарта',
    summary:
      'Записать тепловую карту просмотров (поле heatmap; если модуль извлечения отдаёт, напр. YouTube) в velorix-ytdlp-heatmap.txt; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file heatmap velorix-ytdlp-heatmap.txt --skip-download '
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
      'Записать число комментариев (поле comment_count) в velorix-ytdlp-ccount.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file comment_count velorix-ytdlp-ccount.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: последний сегмент пути страницы',
    summary:
      'Записать базовое имя пути страницы (поле webpage_url_basename) в velorix-ytdlp-wubase.txt без скачивания; допишите ссылку.',
    fullLine:
      'yt-dlp --print-to-file webpage_url_basename velorix-ytdlp-wubase.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: короткий id',
    summary:
      'Записать короткий идентификатор для отображения (поле display_id) в velorix-ytdlp-dispid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file display_id velorix-ytdlp-dispid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: ссылка на превью',
    summary:
      'Записать ссылку на обложку (поле thumbnail) в velorix-ytdlp-thumburl.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file thumbnail velorix-ytdlp-thumburl.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: время релиза (unix)',
    summary:
      'Записать (поле release_timestamp) (UNIX, если модуль извлечения отдаёт) в velorix-ytdlp-reltsepoch.txt без скачивания; допишите ссылку.',
    fullLine:
      'yt-dlp --print-to-file release_timestamp velorix-ytdlp-reltsepoch.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: путь вывода (-o)',
    summary:
      'Записать (поле filepath) (после -o) в velorix-ytdlp-fpath.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file filepath velorix-ytdlp-fpath.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: разрешение',
    summary:
      'Записать (поле resolution) (строка разрешения) в velorix-ytdlp-res.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file resolution velorix-ytdlp-res.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id формата',
    summary:
      'Записать идентификатор выбранного формата (поле format_id) в velorix-ytdlp-fmtid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file format_id velorix-ytdlp-fmtid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: расширение',
    summary:
      'Записать (поле ext) (расширение выбранного формата) в velorix-ytdlp-ext.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file ext velorix-ytdlp-ext.txt --skip-download '
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
      'Записать ширину выбранного формата (поле width) в velorix-ytdlp-width.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file width velorix-ytdlp-width.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: высота',
    summary:
      'Записать высоту выбранного формата (поле height) в velorix-ytdlp-height.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file height velorix-ytdlp-height.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: частота кадров (fps)',
    summary:
      'Записать частоту кадров (поле fps) выбранного формата в velorix-ytdlp-fps.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file fps velorix-ytdlp-fps.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: суммарный битрейт',
    summary:
      'Записать суммарный битрейт (поле tbr, kbps) в velorix-ytdlp-tbr.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file tbr velorix-ytdlp-tbr.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: размер (прибл.)',
    summary:
      'Записать приблизительный размер файла (поле filesize_approx) в velorix-ytdlp-fsize.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file filesize_approx velorix-ytdlp-fsize.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: протокол',
    summary:
      'Записать протокол транспорта (поле protocol; варианты: https, m3u8 и т. п.) в velorix-ytdlp-proto.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file protocol velorix-ytdlp-proto.txt --skip-download '
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
      'Записать индекс ролика в плейлисте (поле playlist_index) в velorix-ytdlp-plidx.txt без скачивания; допишите ссылку на плейлист.',
    fullLine: 'yt-dlp --print-to-file playlist_index velorix-ytdlp-plidx.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: автонумерация плейлиста',
    summary:
      'Записать авто-нумерацию плейлиста (поле playlist_autonumber) в velorix-ytdlp-plauto.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file playlist_autonumber velorix-ytdlp-plauto.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: число элементов плейлиста',
    summary:
      'Записать число элементов плейлиста (поле playlist_count) в velorix-ytdlp-plcount.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file playlist_count velorix-ytdlp-plcount.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id автора плейлиста',
    summary:
      'Записать идентификатор автора плейлиста (поле playlist_uploader_id) в velorix-ytdlp-plupid.txt без скачивания; допишите ссылку на плейлист.',
    fullLine:
      'yt-dlp --print-to-file playlist_uploader_id velorix-ytdlp-plupid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: id автора',
    summary:
      'Записать идентификатор автора на площадке (поле uploader_id) в velorix-ytdlp-upid.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file uploader_id velorix-ytdlp-upid.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: рейтинг',
    summary:
      'Записать среднюю оценку (поле average_rating) в velorix-ytdlp-rating.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file average_rating velorix-ytdlp-rating.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: доступность',
    summary:
      'Записать строку доступности (поле availability; частые значения: public — для всех, private — приватно, unlisted — только по ссылке, premium, needs_auth) в velorix-ytdlp-avail.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file availability velorix-ytdlp-avail.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: возрастной лимит',
    summary:
      'Записать возрастной лимит (поле age_limit) в velorix-ytdlp-age.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file age_limit velorix-ytdlp-age.txt --skip-download '
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
      'Записать домен страницы ролика (поле webpage_url_domain) в velorix-ytdlp-wudom.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file webpage_url_domain velorix-ytdlp-wudom.txt --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· в файл: исходная ссылка',
    summary:
      'Записать (поле original_url) (исходный запрос до редиректов) в velorix-ytdlp-ourl.txt без скачивания; допишите ссылку.',
    fullLine: 'yt-dlp --print-to-file original_url velorix-ytdlp-ourl.txt --skip-download '
  }
]
