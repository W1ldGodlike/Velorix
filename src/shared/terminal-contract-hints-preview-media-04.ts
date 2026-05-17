import type { TerminalCommandHintEntry } from './terminal-contract-types'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'

/** §8 — подсказки превью/ffprobe (часть 04). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_04: TerminalCommandHintEntry[] = [
  {
    tool: 'ffprobe',
    token: '· видео v:0 режим альфы',
    summary:
      'Поток v:0: теги дорожки stream_tags alpha_mode (альфа-канал VP9 и AV1 в WebM и MKV); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=alpha_mode -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: расширение стерео 3с',
    summary:
      'Усиление стерео-разницы первых 3 с (-af extrastereo); проверка ширины стерео-цепочки; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af extrastereo -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег дата покупки',
    summary:
      'Тег контейнера purchase_date (поле format_tags: дата покупки в iTunes Store и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=purchase_date -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги сортировки каталога',
    summary:
      'Теги сортировки каталога (поля format_tags: sort_artist, sort_album, sort_title); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=sort_artist,sort_album,sort_title -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: фазер 4с',
    summary:
      'Лёгкий фазовый эффект первых 4 с (-af aphaser); дымовая проверка стерео-цепочки аудиофильтров (-af); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aphaser=in_gain=0.4:out_gain=0.74 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег служба (service)',
    summary:
      'Теги service_provider и service_name (поля format_tags: поставщик и имя службы вещания; IPTV, OFFAIR и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=service_provider,service_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 битность кодированного сэмпла',
    summary:
      'Поток a:0: bits_per_coded_sample (поле ffprobe: глубина закодированного PCM при наличии); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=bits_per_coded_sample -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: флэнжер 4с',
    summary:
      'Лёгкий флэнжер (flanger) первых 4 с (-af flanger); дымовая проверка стерео-модуляции; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af flanger -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег isrc',
    summary:
      'Тег контейнера isrc (поле format_tags: код ISRC релиза); каталогизация аудио; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=isrc -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: де-ессер 4с',
    summary:
      'Де-эссер первых 4 с (-af deesser); диагностика свистящих согласных; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af deesser=i=0.5 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 кодировщик (тег дорожки)',
    summary:
      'Поток первых субтитров: тег encoder в stream_tags (кодировщик при мультиплексировании); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream_tags=encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: вибрато 4с',
    summary:
      'Лёгкая вибрато-модуляция первых 4 с (-af vibrato); дымовая проверка стерео-цепочки аудиофильтров (-af); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af vibrato=f=6.5:d=0.5 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги part и compilation',
    summary:
      'Теги контейнера part и compilation (поля format_tags: номер части и признак сборника; iTunes и многодисковые сборники); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=part,compilation -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: кристалайзер 4с',
    summary:
      'Психоакустический кристалайзер (crystalizer) первых 4 с (-af crystalizer); дымовая проверка лёгких аудио-эффектов; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af crystalizer=i=1.2 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 таймбазы кодека и потока',
    summary:
      'Поток v:0: codec_time_base и time_base (поля ffprobe: codec_time_base кодека, time_base дорожки в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=codec_time_base,time_base -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: тон + сдвиг частоты дискр. 3с',
    summary:
      'Лёгкий resample-питч первых 3 с (-af asetrate=44100*1.01,aresample=44100); дымовая проверка цепочки asetrate → aresample; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af asetrate=44100*1.01,aresample=44100 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: авторство и строка кодировщика',
    summary:
      'Теги контейнера copyright и encoded_by (поля format_tags: правообладатель и строка кодировщика); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=copyright,encoded_by -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: компандер 4с',
    summary:
      'Лёгкий компандер первых 4 с (-af compand); дымовая проверка динамической обработки; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af compand=attacks=0.02:decays=0.1:points=-80/-80|-25/-25|0/-10:gain=2 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег исполнитель альбома',
    summary:
      'Тег контейнера album_artist (поле format_tags: альбомный исполнитель; рядом с artist); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=album_artist -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги: трек и диск',
    summary:
      'Теги контейнера track и disc (поля format_tags: номер трека и номер диска в каталоге); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=track,disc -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: динам. нормализация 4с',
    summary:
      'Лёгкая динамическая нормализация громкости первых 4 с (-af dynaudnorm); дымовая проверка цепочки выравнивания воспринимаемой громкости (loudness); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af dynaudnorm=f=150:g=15 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: текст песни и аннотация',
    summary:
      'Теги контейнера lyrics и synopsis (поля format_tags: текст песни и краткая сводка — подкасты, аудиокниги и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=lyrics,synopsis -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: мягкое клипирование 4с',
    summary:
      'Мягкий клиппер первых 4 с (-af asoftclip); дымовая проверка ограничения пиков без жёсткого лимитера; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af asoftclip -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 каналы и расклад',
    summary:
      'Поток a:0: число каналов и расклад (поля ffprobe: channels — число каналов, channel_layout — строка расклада); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=channels,channel_layout -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: эхо 4с',
    summary:
      'Лёгкое эхо первых 4 с (-af aecho); дымовая проверка задержек и смешивания в цепочке -af; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aecho=0.8:0.9:40:0.3 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:1 атрибуты дорожки',
    summary:
      'Вторая дорожка субтитров s:1: disposition (поле ffprobe: default — дорожка по умолчанию, forced — принудительная, hearing_impaired — для слабослышащих и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: тремоло 4с',
    summary:
      'Лёгкая амплитудная модуляция первых 4 с (-af tremolo); дымовая проверка периодического аудиофильтра; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af tremolo=f=6:d=0.5 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: полосовой фильтр 4с',
    summary:
      'Узкополосный bandpass первых 4 с (-af bandpass); дымовая проверка частотной фильтрации; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af bandpass=f=1000:width_type=h:width=200 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 кодек и каналы',
    summary:
      'Вторая аудиодорожка a:1: кодек, число каналов и расклад (поля ffprobe: codec_name, channels, channel_layout; мультиязык и дорожка комментариев); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=codec_name,channels,channel_layout -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: полка вч 3с',
    summary:
      'Лёгкий highshelf: верхняя полка спектра первых 3 с (-af highshelf); дымовая проверка параметрического эквалайзера (-af); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highshelf=f=8000:width_type=o:width=2:g=-6 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:1 размер и кодек',
    summary:
      'Вторая видеодорожка v:1: кодек и размер кадра (поля ffprobe: codec_name, width, height; мультикамера и дополнительный ракурс); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:1 -show_entries stream=codec_name,width,height -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: пульсатор 3с',
    summary:
      'Лёгкий стерео-пульсатор первых 3 с (-af apulsator); дымовая проверка периодического pan и цепочки -af; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af apulsator=mode=sine:hz=1:width=2 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· дорожка данных d:1, кодек',
    summary:
      'Вторая data-дорожка d:1: поля ffprobe codec_name и codec_tag_string (таймкоды и метаданные в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:1 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: хорус 4с',
    summary:
      'Лёгкий хорус первых 4 с (-af chorus); дымовая проверка задержек и модуляции в цепочке -af; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af chorus=0.5:0.9:50:0.4:0.25:2 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: wmf sdk и кодировщик',
    summary:
      'Теги контейнера encoder и WMFSDKVersion (поля format_tags: кодировщик и версия Windows Media SDK; часто у WMV и ASF); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoder,WMFSDKVersion -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: нарастание громкости 3с',
    summary:
      'Плавное нарастание громкости первых 3 с (-af afade=t=in:st=0:d=0.6); дымовая проверка нарастания (afade in) без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afade=t=in:st=0:d=0.6 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег инструмент кодирования',
    summary:
      'Тег контейнера encoding_tool (поле format_tags: какой программой упакован файл — часто Mux, QuickTime и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoding_tool -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: затухание громкости 3с',
    summary:
      'Плавное затухание громкости в хвосте первых 3 с (-af afade=t=out:st=1.2:d=0.6); дымовая проверка затухания (afade out) без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afade=t=out:st=1.2:d=0.6 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: число глав',
    summary:
      'Контейнер: поле nb_chapters (сколько глав в файле; для навигации и DVD/Blu-ray структуры); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=nb_chapters -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: темп ×0.95, 3с',
    summary:
      'Лёгкое замедление темпа первых 3 с (-af atempo=0.95); дымовая проверка фильтра atempo без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af atempo=0.95 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:1 длинное имя кодека',
    summary:
      'Вторая видеодорожка v:1: codec_name и codec_long_name (поля ffprobe: короткое и длинное имя кодека; мультикамера и дополнительный поток); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:1 -show_entries stream=codec_name,codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: лимитер 3с',
    summary:
      'Мягкий лимитер пиков первых 3 с (-af alimiter=limit=0.8); дымовая проверка динамики в цепочке -af без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af alimiter=limit=0.8 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· бренды контейнера mp4 (теги)',
    summary:
      'Теги контейнера major_brand, minor_version и compatible_brands (поля format_tags: бренд, младшая версия и список совместимых; часто у MP4 и MOV); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=major_brand,minor_version,compatible_brands -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: стерео-коррекция 3с',
    summary:
      'Лёгкая стерео-коррекция первых 3 с (-af stereotools=mlev=0.05:phlev=0.05); дымовая проверка ширины и фазы; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af stereotools=mlev=0.05:phlev=0.05 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: непрерывность и сборник',
    summary:
      'Теги контейнера gapless_playback и compilation (поля format_tags: бесшовное воспроизведение и признак сборника; часто у AAC и ALAC из iTunes); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=gapless_playback,compilation -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: нормализация речи 4с',
    summary:
      'Лёгкая нормализация речи и подкаста первых 4 с (-af speechnorm=peak=0.25); дымовая проверка динамики диалога; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af speechnorm=peak=0.25 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: темп (bpm) и тональность',
    summary:
      'Теги контейнера BPM и initial_key (поля format_tags: темп в ударах в минуту и тональность, если записаны каталогизатором); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=BPM,initial_key -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: межканальный кроссфейд 4с',
    summary:
      'Лёгкий межканальный кроссфид bs2b первых 4 с (-af bs2b=profile=j2); дымовая проверка стерео-обработки; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af bs2b=profile=j2 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги исполнитель и альбом',
    summary:
      'Теги контейнера artist и album (поля format_tags: исполнитель и альбом; часто у музыкальных релизов и клипов); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=artist,album -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: акцент нч 4с',
    summary:
      'Лёгкий низкочастотный акцент первых 4 с (-af bass=g=2:f=120); дымовая проверка эквалайзера НЧ (bass); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af bass=g=2:f=120 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 индекс и кодек',
    summary:
      'Первая субтитровая дорожка s:0: index и codec_name (поля ffprobe: порядок и тип дорожки в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=index,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: многополосный эквалайзер 4с',
    summary:
      'Лёгкий 10-полосный superequalizer (полоса 3 +4 dB) первых 4 с; дымовая проверка графического эквалайзера; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af superequalizer=3b=4 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги сериала и эпизода',
    summary:
      'Теги контейнера show и episode_sort (поля format_tags: название шоу и сортировка эпизода; телекаталоги и сериалы); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=show,episode_sort -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: полка нч 4с',
    summary:
      'Лёгкий низкочастотный шельф первых 4 с (-af lowshelf=g=2:f=200); дымовая проверка нижнего полочного эквалайзера; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowshelf=g=2:f=200 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: жанр и дата',
    summary:
      'Теги контейнера genre и date (поля format_tags: жанр и дата; каталогизация музыки и релизов); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=genre,date -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: расширение стерео 4с',
    summary:
      'Лёгкое расширение стереобазы первых 4 с (-af extrastereo=m=1.2); дымовая проверка ширины и pan; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af extrastereo=m=1.2 -t 4 -vn -sn -f null -`
  }
]
