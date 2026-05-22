import type { TerminalCommandHintEntry } from './terminal-contract-types'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'

/** §8 — подсказки превью/ffprobe (часть 2/8; §8 audit prune). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_02: TerminalCommandHintEntry[] = [
  {
    tool: 'ffmpeg',
    token: '· ремукс 5 с, пустой выход',
    summary:
      'Копирование потоков первых 5 с в пустой мультиплексор (-t 5 -c copy, -f null); дымовая проверка контейнера без перекодирования.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 5 -c copy -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· декод, игнор ошибок',
    summary:
      'Короткий декод с подавлением ошибок потока (-err_detect ignore_err -t 2); битые кадры и MPEG-TS; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -err_detect ignore_err -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 2 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги исполнитель и альбом',
    summary:
      'Теги контейнера artist и album (поля format_tags: исполнитель и альбом; аудиофайлы и мультимедиа); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=artist,album -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 средняя частота кадров',
    summary:
      'Первая видеодорожка (v:0): только avg_frame_rate (поле ffprobe: средняя частота кадров; сверка с r_frame_rate в других шаблонах); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=avg_frame_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· аудио 3 с, пустой выход',
    summary:
      'Декодирование только аудио первых 3 с (-vn -sn); быстрее полной дымовой проверки на видеофайлах; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vn -sn -t 3 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 длинное имя кодека',
    summary:
      'Первая видеодорожка (v:0): codec_long_name (поле ffprobe: человекочитаемое имя кодека); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· тег кодировщик (контейнер)',
    summary:
      'Тег контейнера encoder (поле format_tags.encoder — кодировщик контейнера); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· видео 2 с, пустой выход',
    summary:
      'Декодирование только видео первых 2 с (-an -sn); без аудио и субтитров; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -an -sn -t 2 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: удобочитаемый вывод',
    summary:
      'Секция format в удобочитаемом виде (-pretty -show_format); единицы и время форматированы; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -pretty -show_format ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: плоский вывод ключ=значение',
    summary:
      'Плоский вывод format ключ=значение (-of flat -show_format); удобно разбирать текстом (например, утилитами grep и awk); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -of flat -show_format ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 первые 5 пакетов',
    summary:
      'Первые 5 пакетов первой видеодорожки (v:0) (-show_packets — пакеты потока, -read_intervals %+#5 — только первые пять, вывод -of compact, компактная таблица); метки времени и размеры; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#5 -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 первые 5 кадров',
    summary:
      'Первые 5 кадров первой видеодорожки (v:0) (-show_frames — кадры декодера, -read_intervals %+#5 — только первые пять, вывод -of compact, компактная таблица); тип, размер и PTS; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#5 -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· сводка версии ffprobe',
    summary:
      'Версия ffprobe и быстрый разбор файла (-show_program_version); сверка сборки; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_program_version ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 первые 3 пакета',
    summary:
      'Первые 3 аудиопакета a:0 (поля пакета: PTS — метка времени, размер; вывод -of compact, компактная таблица); рваный MPEG-TS; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_packets -read_intervals %+#3 -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· декод после смещения 2 с',
    summary:
      'Дымовая проверка: декод с середины (-ss 10 -t 2); конец файла и индекс в длинных MP4; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -ss 10 -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 2 -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: громкость по стандарту ebu, 60с',
    summary:
      'Замер интегральной громкости фильтром loudnorm (print_format=summary — краткая сводка в stderr) за 60 с; -vn -sn; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af loudnorm=print_format=summary -t 60 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: комментарий и аннотация',
    summary:
      'Теги контейнера comment и synopsis (комментарий и краткая сводка в метаданных); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=comment,synopsis -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 таймбаза кодека',
    summary:
      'Дорожка субтитров (s:0): таймбаза кодека и дорожки (поля ffprobe: codec_time_base — база времени кодека субтитров, time_base — база времени дорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=codec_time_base,time_base -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 размер доп. двоичника (extradata)',
    summary:
      'Первая видеодорожка (v:0): extradata_size и initial_padding (поля ffprobe: размер декодер-заголовков extradata и начальный паддинг); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=extradata_size,initial_padding -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 битрейт',
    summary:
      'Первая дорожка субтитров s:0: битрейт (поле ffprobe bit_rate, если задан в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: длительность в тиках',
    summary:
      'Контейнер: duration_ts (поле format: длительность в тиках при знаменателе time_base); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=duration_ts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· тег авторские права',
    summary:
      'Тег контейнера copyright (поле format_tags=copyright — строка правообладателя); кто и когда задал; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=copyright -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0: битрейт и длительность (теги mkv)',
    summary:
      'MKV-статистика v:0: теги дорожки stream_tags BPS и DURATION (битрейт и длительность дорожки, если записаны mkvtoolnix); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=BPS,DURATION -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 длительность в теге',
    summary:
      'Дорожка субтитров (s:0): теги дорожки stream_tags duration (длительность субтитров, если записана в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream_tags=duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· объём зондирования (байты)',
    summary:
      'Сколько байт ушло на зондирование демультиплексором (поле format.probe_size — объём прочитанных байт при зондировании); диагностика «глубины» анализа; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=probe_size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: dur_ts+tb+probe',
    summary:
      'Контейнер: duration_ts, time_base и probe_size одной командой (поля format: тики длительности, база времени и объём зондирования); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=duration_ts,time_base,probe_size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: start+timing',
    summary:
      'Контейнер: start_time, duration_ts, time_base и probe_size (поля format: смещение, тики длительности, база времени и объём зондирования); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=start_time,duration_ts,time_base,probe_size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: start+start_real',
    summary:
      'Контейнер: start_time и start_time_real (поля format: номинальное и реальное смещение начала; сверка при перепаковке); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=start_time,start_time_real -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: offset+timing',
    summary:
      'Контейнер: start_time, start_time_real, duration, duration_ts, time_base и probe_size (поля format: смещение, длительность, тики, база времени и зондирование); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=start_time,start_time_real,duration,duration_ts,time_base,probe_size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: flags',
    summary:
      'Контейнер: format.flags (поле format: битовая маска флагов демультиплексора); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=flags -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: probe layout',
    summary:
      'Контейнер: probe_score, nb_streams, nb_programs, flags и size (поля format: оценка демультиплексора и сводка контейнера); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=probe_score,nb_streams,nb_programs,flags,size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: diagnostics',
    summary:
      'Контейнер: filename, probe_score, streams, flags, size, bit_rate, duration, start/real, duration_ts, time_base и probe_size (поля format: сводка как в инспекторе Velorix); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=filename,probe_score,nb_streams,nb_programs,flags,size,bit_rate,duration,start_time,start_time_real,duration_ts,time_base,probe_size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: масштаб 320, 1 с, пустой выход',
    summary:
      'Дымовая проверка: перекодирование масштаба 320:-1 за 1 с в пустой выход (-vf scale=320:-1 -t 1, -f null); проверка цепочки видеофильтров; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=320:-1 -t 1 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 время создания дорожки',
    summary:
      'Первая видеодорожка (v:0): тег creation_time в stream_tags (поле дорожки: время создания; отличается от format при перепаковке); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=creation_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· тег имени обработчика',
    summary:
      'Тег контейнера handler_name (поле format_tags.handler_name — имя обработчика; часто QuickTime и MOV); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=handler_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: копия аудио 3 с, пустой выход',
    summary:
      'Перепаковка только аудио в пустой выход (-vn -sn -acodec copy -t 3, -f null); проверка дорожки без декода видео; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vn -sn -acodec copy -t 3 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0: глубина несжатого звука',
    summary:
      'Первая аудиодорожка (a:0): bits_per_raw_sample (поле ffprobe: глубина PCM при несжатом звуке и lossless) при наличии; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=bits_per_raw_sample -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 индекс и кодек',
    summary:
      'Первая видеодорожка (v:0): index и codec_name (поля ffprobe: порядок дорожки и имя кодека в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=index,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 профиль и уровень',
    summary:
      'Первая видеодорожка (v:0): profile и level (поля ffprobe: профиль и уровень H.264 и HEVC); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=profile,level -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 начало и длительность',
    summary:
      'Первая дорожка субтитров s:0: start_time и duration (смещение и длительность относительно видео); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: поток v:0 без перекода 2с',
    summary:
      'Перепаковка только первой видеодорожки без перекодирования (-map 0:v:0 — первая видеодорожка, -c:v copy); без аудио и субтитров; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 2 -map 0:v:0 -c:v copy -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0: таймбаза и старт меток',
    summary:
      'Дорожка субтитров (s:0): тактовая сетка и стартовая метка субтитров (поля ffprobe: time_base, start_pts — смещение относительно видео); путь к медиа подставляется из превью.',
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
      'Первая аудиодорожка (a:0): тег encoder в stream_tags (поле дорожки: кодировщик при мультиплексировании, если записан); путь к медиа подставляется из превью.',
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
      'Первая аудиодорожка (a:0): codec_long_name (поле ffprobe: человекочитаемое имя кодека); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 длинное имя кодека',
    summary:
      'Дорожка субтитров (s:0): codec_long_name (поле ffprobe: тип субтитров в контейнере); путь к медиа подставляется из превью.',
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
    tool: 'ffmpeg',
    token: '· ffmpeg: динам. нормализация 5с',
    summary:
      'Лёгкая динамическая нормализация громкости первых 5 с (-af dynaudnorm); проверка аудиофильтра; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af dynaudnorm=g=31:f=250:r=0.9 -t 5 -vn -sn -f null -`
  }
]
