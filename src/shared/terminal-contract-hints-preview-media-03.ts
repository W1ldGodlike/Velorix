import type { TerminalCommandHintEntry } from './terminal-contract-types'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'

/** §8 — подсказки превью/ffprobe (часть 03). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_03: TerminalCommandHintEntry[] = [
  {
    tool: 'ffprobe',
    token: '· субтитры s:0: таймбаза и старт меток',
    summary:
      'Поток s:0: тактовая сетка и стартовая метка субтитров (поля ffprobe: time_base, start_pts — смещение относительно видео); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: замер громкости 10с',
    summary:
      'Замер громкости первых 10 с (-af volumedetect -vn -sn); средняя и максимальная громкость (в stderr строки mean_volume и max_volume — вывод фильтра volumedetect); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volumedetect -t 10 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: жанр и дата',
    summary:
      'Теги контейнера genre и date (поля format_tags: жанр и дата релиза; каталогизация и дата); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=genre,date -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: поиск тишины 30с',
    summary:
      'Поиск тишины в первых 30 с (-af silencedetect=noise=-50dB:d=0.3); в stderr — метки silence_start и silence_end (вывод фильтра silencedetect); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af silencedetect=noise=-50dB:d=0.3 -t 30 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 атрибуты дорожки',
    summary:
      'Первая видеодорожка v:0: disposition (поле ffprobe: default, forced, attached_pic и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 битрейт',
    summary:
      'Вторая аудиодорожка a:1: битрейт (поле ffprobe bit_rate; мультиязык, комментарии); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: статистика аудио 5с',
    summary:
      'Краткая статистика аудио первых 5 с (-af astats=metadata=1:reset=1); СКЗ и пик (в stderr фильтр astats пишет RMS и peak по метаданным); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af astats=metadata=1:reset=1 -t 5 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 кодировщик (тег дорожки)',
    summary:
      'Поток a:0: тег encoder в stream_tags (поле дорожки: кодировщик при мультиплексировании, если записан); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream_tags=encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: громкость по шкале ebu r128, 12с',
    summary:
      'EBU R128: интегральная громкость, диапазон громкости и истинный пик (Integrated — интегральная, LRA — диапазон, True Peak — истинный пик) первых 12 с (-af ebur128=framelog=verbose — подробный журнал по кадрам); в stderr строки Integrated, LRA и True Peak (вывод фильтра ebur128); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af ebur128=framelog=verbose -t 12 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 длинное имя кодека',
    summary:
      'Поток a:0: codec_long_name (поле ffprobe: человекочитаемое имя кодека); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 длинное имя кодека',
    summary:
      'Поток s:0: codec_long_name (поле ffprobe: тип субтитров в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: фазометр 10с',
    summary:
      'Стерео-фаза первых 10 с (-af aphasemeter=video=0); в stderr предупреждения о моно и фазе (вывод фильтра aphasemeter); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aphasemeter=video=0 -t 10 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 кодировщик (тег дорожки)',
    summary:
      'Поток a:1: тег encoder в stream_tags (поле дорожки второй аудио, если записан в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream_tags=encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: чересстрочность 5с',
    summary:
      'Детектор чересстрочности первых 5 с (-vf idet -t 5); в stderr метки TFF, BFF и progressive (вывод фильтра idet); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 5 -vf idet -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: издатель и строка кодировщика',
    summary:
      'Теги контейнера publisher и encoded_by (поля format_tags: издатель и строка кодировщика); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=publisher,encoded_by -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: чёрные кадры 30с',
    summary:
      'Поиск чёрных интервалов в первых 30 с (-vf blackdetect=d=0.1:pix_th=0.01); в stderr метки black_start и black_end (вывод фильтра blackdetect); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf blackdetect=d=0.1:pix_th=0.01 -t 30 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: автообрезка 30с',
    summary:
      'Оценка обрезки чёрных полей первых 30 с (-vf cropdetect=limit=24:round=16:reset=0); в stderr строки crop (вывод фильтра cropdetect); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf cropdetect=limit=24:round=16:reset=0 -t 30 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: залипание кадра 45с',
    summary:
      'Поиск залипших кадров первых 45 с (-vf freezedetect=n=-60dB:d=2); в stderr метки freeze_start и freeze_end (вывод фильтра freezedetect); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf freezedetect=n=-60dB:d=2 -t 45 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: статистика видео 8с',
    summary:
      'Статистика уровней и шума первых 8 с (-vf signalstats); YUV-средние и отклонения в stderr (вывод фильтра signalstats); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf signalstats -t 8 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· главы, json',
    summary:
      'Главы контейнера одним JSON (--show-chapters -of json=c=1); длительности и заголовки сегментов; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -of json=c=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 начало и длительность',
    summary:
      'Первая дорожка субтитров s:0: start_time и duration (смещение и длительность относительно видео); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 начало и длительность',
    summary:
      'Вторая аудиодорожка a:1: start_time и duration (мультиязык, сдвиг); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:1: таймбаза и старт меток',
    summary:
      'Вторая дорожка субтитров s:1: time_base и start_pts (поля ffprobe: база времени и смещение таймкодов второй дорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1: таймбаза и старт меток',
    summary:
      'Вторая аудиодорожка a:1: time_base и start_pts (поля ffprobe: база времени и смещение второй аудиодорожки в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: динам. нормализация 5с',
    summary:
      'Лёгкая динамическая нормализация громкости первых 5 с (-af dynaudnorm); проверка аудиофильтра; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af dynaudnorm=g=31:f=250:r=0.9 -t 5 -vn -sn -f null -`
  },
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
      'Поток v:0: тег location в stream_tags (поле дорожки: координаты GPS и текстовая метка в MOV и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=location -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 формат сэмпла',
    summary:
      'Поток a:0: только sample_fmt (поле ffprobe: формат сэмпла — s16, fltp и т. д.); путь к медиа подставляется из превью.',
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
      'Поток a:1: расклад и формат сэмпла (поля ffprobe: channel_layout, sample_fmt — например s16, fltp при PCM); путь к медиа подставляется из превью.',
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
      'Поток v:0: тег stereo_mode в stream_tags (поле дорожки: метка 3D и стерео в MKV и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=stereo_mode -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 длительность в тиках',
    summary:
      'Поток a:0: длительность в тиках time_base (поле ffprobe stream=duration_ts — длительность в единицах time_base дорожки); путь к медиа подставляется из превью.',
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
      'Поток v:0: ticks_per_frame (поле ffprobe: число тиков time_base на один кадр); путь к медиа подставляется из превью.',
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
      'Поток a:0: time_base и дроби частоты кадров (поля ffprobe: time_base, avg_frame_rate и r_frame_rate — у аудио часто формальные значения, сверяйте с видео); путь к медиа подставляется из превью.',
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
      'Поток v:0: is_intra_only (поле ffprobe: все кадры ключевые, без межкадрового предсказания; редкие кодеки); путь к медиа подставляется из превью.',
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
  }
]
