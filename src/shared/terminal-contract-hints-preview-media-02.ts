import type { TerminalCommandHintEntry } from './terminal-contract-types'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'

/** §8 — подсказки превью/ffprobe (часть 02). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_02: TerminalCommandHintEntry[] = [
  {
    tool: 'ffprobe',
    token: '· видео v:0 боковые данные дорожки',
    summary:
      'Первая видеодорожка (v:0): боковые метаданные дорожки (поле side_data_list: матрица поворота Display Matrix, HDR и др.; вывод -of compact, компактная таблица); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=side_data_list -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы: таблица через запятую',
    summary:
      'Таблица глав построчно (-show_chapters, вывод -of csv — поля через запятую); без лишнего текста; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -of csv=p=0 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 начало и длительность',
    summary:
      'Первая видеодорожка (v:0): start_time и duration дорожки (поля ffprobe: начало и длительность дорожки; сверка с format и смещениями); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 начало и длительность',
    summary:
      'Первая аудиодорожка (a:0): start_time и duration дорожки (поля ffprobe: начало и длительность аудио; рассинхрон с видео); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 битность сэмпла',
    summary:
      'Первая видеодорожка (v:0): bits_per_raw_sample (поле ffprobe: глубина сырого сэмпла, 8, 10 или 12 бит и т. д.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=bits_per_raw_sample -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:1 кратко',
    summary:
      'Вторая видеодорожка v:1 (несколько ракурсов — редкий режим в контейнерах): кодек и размер кадра (поля ffprobe: codec_name, width, height); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:1 -show_entries stream=codec_name,width,height -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: размер и длительность',
    summary:
      'Контейнер: size и duration (поля format: размер файла и длительность; сверка с битрейтом и дорожками); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=size,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:1 кодек и язык',
    summary:
      'Вторая дорожка субтитров s:1: codec_name и тег stream_tags language (поля ffprobe: кодек дорожки и язык из stream_tags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=codec_name:stream_tags=language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 атрибуты дорожки',
    summary:
      'Вторая аудиодорожка a:1: disposition (поле ffprobe: forced, default и др. — флаги второй аудиодорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: тег языка',
    summary:
      'Тег языка контейнера (поле format_tags.language, если есть); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
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
    tool: 'ffprobe',
    token: '· аудио a:3 кратко',
    summary:
      'Четвёртая аудиодорожка a:3: кодек, частота дискретизации и каналы (поля ffprobe: codec_name, sample_rate, channels); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:3 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:3 кратко',
    summary:
      'Четвёртая дорожка субтитров s:3: кодек и строка тега кодека (поля ffprobe: codec_name, codec_tag_string); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:3 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
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
      'Контейнер: filename, probe_score, streams, flags, size, bit_rate, duration, start/real, duration_ts, time_base и probe_size (поля format: сводка как в инспекторе FluxAlloy); путь к медиа подставляется из превью.',
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
    token: '· субтитры s:2 атрибуты дорожки',
    summary:
      'Третья дорожка субтитров s:2: disposition (поле ffprobe: forced, default, hearing_impaired и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:2 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:2 атрибуты дорожки',
    summary:
      'Третья аудиодорожка a:2: disposition (поле ffprobe: default, forced и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:2 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:1 профиль и уровень',
    summary:
      'Вторая видеодорожка v:1: profile и level (поля ffprobe: профиль и уровень; редкие случаи с несколькими ракурсами и дубликатами дорожек); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:1 -show_entries stream=profile,level -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:1 начало и длительность',
    summary:
      'Вторая дорожка субтитров s:1: start_time и duration дорожки (поля ffprobe: начало и длительность второй дорожки субтитров); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: поток v:0 без перекода 2с',
    summary:
      'Перепаковка только первой видеодорожки без перекодирования (-map 0:v:0 — первая видеодорожка, -c:v copy); без аудио и субтитров; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 2 -map 0:v:0 -c:v copy -an -sn -f null -`
  }
]
