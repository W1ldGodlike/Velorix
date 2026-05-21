import type { TerminalCommandHintEntry } from './terminal-contract-types'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'

/** §8 — подсказки превью/ffprobe (часть 3/8; §8 audit prune). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_03: TerminalCommandHintEntry[] = [
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: вч-срез 5с',
    summary:
      'ВЧ-срез первых 5 с (-af highpass=f=200); проверка аудио-цепочки и тишины в низах; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=200 -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 тег геолокации',
    summary:
      'Первая видеодорожка (v:0): тег location в stream_tags (поле дорожки: координаты GPS и текстовая метка в MOV и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=location -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 формат сэмпла',
    summary:
      'Первая аудиодорожка (a:0): только sample_fmt (поле ffprobe: формат сэмпла — s16, fltp и т. д.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=sample_fmt -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· тег текст песни',
    summary:
      'Тег контейнера lyrics (поле format_tags: текст песни в MP3, M4A и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=lyrics -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 расклад и формат сэмпла',
    summary:
      'Вторая аудиодорожка (a:1): расклад и формат сэмпла (поля ffprobe: channel_layout, sample_fmt — например s16, fltp при PCM); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=channel_layout,sample_fmt -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: смена сцен 20с',
    summary:
      'Детектор смен сцен первых 20 с (-vf scenedetect=scene=0.3); в stderr оценка scene_score (вывод фильтра scenedetect); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scenedetect=scene=0.3 -t 20 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· метки времени (genpts) + ремукс 2 с',
    summary:
      'Короткая перепаковка без перекодирования с генерацией PTS (-fflags +genpts -c copy -t 2); битые таймстемпы MPEG-TS и MKV; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -fflags +genpts -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 2 -c copy -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 стереорежим',
    summary:
      'Первая видеодорожка (v:0): тег stereo_mode в stream_tags (поле дорожки: метка 3D и стерео в MKV и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=stereo_mode -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 длительность в тиках',
    summary:
      'Первая аудиодорожка (a:0): длительность в тиках time_base (поле ffprobe stream=duration_ts — длительность в единицах time_base дорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=duration_ts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: размер, битрейт, число дорожек',
    summary:
      'Контейнер: размер, битрейт и число потоков (поля format: size, bit_rate, nb_streams); компактно; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=size,bit_rate,nb_streams -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: ресемпл 44.1 кГц 3с',
    summary:
      'Аудио: ресемплинг в 44,1 кГц первые 3 с (-af aresample=44100); проверка цепочки передискретизации (ресемплинг, SRC); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aresample=44100 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег доп. версия (minor)',
    summary:
      'Тег контейнера minor_version (поле format_tags: младшая версия формата; часто вместе с major_brand у MP4 и MOV); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=minor_version -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: спектральное шумоподавление 3с',
    summary:
      'Лёгкое шумоподавление в частотной области (FFT, -af afftdn=nf=-25) первых 3 с; проверка аудиофильтра; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afftdn=nf=-25 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: описание и ключевые слова',
    summary:
      'Теги контейнера description и keywords (поля format_tags: описание и ключевые слова для каталогизации и поиска в MP4, MKV и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=description,keywords -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· тег location (контейнер)',
    summary:
      'Тег контейнера location (поле format_tags: координаты GPS или URI в метаданных format); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=location -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: компрессор 5с',
    summary:
      'Лёгкая компрессия аудио первых 5 с (-af acompressor=threshold=-20dB:ratio=4:attack=5:release=100); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acompressor=threshold=-20dB:ratio=4:attack=5:release=100 -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:2 кодек, размер и профиль',
    summary:
      'Третья видеодорожка v:2: кодек, размеры, профиль и уровень (поля ffprobe: codec_name, width, height, profile, level; мультиракурс и редкие контейнеры); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:2 -show_entries stream=codec_name,width,height,profile,level -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: обрезка тишины 60с',
    summary:
      'Обрезка ведущей тишины в первых 60 с (-af silenceremove=…); проверка цепочки -af на речи и музыке; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af silenceremove=start_periods=1:start_duration=0.5:start_threshold=-50dB:detection=peak:stop_periods=-1 -t 60 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 тики на кадр',
    summary:
      'Первая видеодорожка (v:0): ticks_per_frame (поле ffprobe: число тиков time_base на один кадр); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=ticks_per_frame -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: тембр вч 3с',
    summary:
      'Лёгкий эквалайзер ВЧ (treble) первых 3 с (-af treble=g=1); дымовая проверка цепочки аудиофильтров; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af treble=g=1 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег название по',
    summary:
      'Тег контейнера software (поле format_tags: название ПО кодирования и упаковки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=software -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги эпизода (сериал)',
    summary:
      'Теги сериала в контейнере (поля format_tags: episode_sort — порядок эпизода, season_number — сезон, episode_id — идентификатор); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=episode_sort,season_number,episode_id -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· громкость +3 дБ 2 с',
    summary:
      'Усиление аудио +3 dB первые 2 с (-af volume=3dB); дымовая проверка громкости без перекодирования видео; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volume=3dB -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: нч-срез 3.5 кГц 3с',
    summary:
      'НЧ-фильтр первых 3 с (-af lowpass=f=3500); проверка аудио-цепочки; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowpass=f=3500 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 таймбаза и поля частоты кадров',
    summary:
      'Первая аудиодорожка (a:0): time_base и дроби частоты кадров (поля ffprobe: time_base, avg_frame_rate и r_frame_rate — у аудио часто формальные значения, сверяйте с видео); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=time_base,avg_frame_rate,r_frame_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· полосовой вч и нч 4 с',
    summary:
      'Полосовой проход 200–3000 Hz первых 4 с (-af highpass=f=200,lowpass=f=3000); дымовая проверка цепочки из двух аудиофильтров (-af); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=200,lowpass=f=3000 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 только ключевые кадры',
    summary:
      'Первая видеодорожка (v:0): is_intra_only (поле ffprobe: все кадры ключевые, без межкадрового предсказания; редкие кодеки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=is_intra_only -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги: композитор и дирижёр',
    summary:
      'Теги контейнера composer и conductor (поля format_tags: композитор и дирижёр); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=composer,conductor -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: шумовой гейт 5с',
    summary:
      'Шумовой гейт первых 5 с (-af agate=…); проверка динамики и тишины в цепочке -af; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af agate=threshold=0.005:ratio=2:attack=20:release=200 -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: деклик 5с',
    summary:
      'Клик-редактор первых 5 с (-af adeclick); диагностика щёлчков и дефектов записи; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af adeclick -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег исполнитель (solo)',
    summary:
      'Тег контейнера performer (поле format_tags=performer — имя исполнителя в каталогизации); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=performer -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 режим альфы',
    summary:
      'Первая видеодорожка (v:0): теги дорожки stream_tags alpha_mode (альфа-канал VP9 и AV1 в WebM и MKV); путь к медиа подставляется из превью.',
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
      'Первая аудиодорожка (a:0): bits_per_coded_sample (поле ffprobe: глубина закодированного PCM при наличии); путь к медиа подставляется из превью.',
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
      'Первая видеодорожка (v:0): codec_time_base и time_base (поля ffprobe: codec_time_base кодека, time_base дорожки в контейнере); путь к медиа подставляется из превью.',
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
      'Первая аудиодорожка (a:0): число каналов и расклад (поля ffprobe: channels — число каналов, channel_layout — строка расклада); путь к медиа подставляется из превью.',
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
    tool: 'ffmpeg',
    token: '· ffmpeg: пульсатор 3с',
    summary:
      'Лёгкий стерео-пульсатор первых 3 с (-af apulsator); дымовая проверка периодического pan и цепочки -af; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af apulsator=mode=sine:hz=1:width=2 -t 3 -vn -sn -f null -`
  }
]
