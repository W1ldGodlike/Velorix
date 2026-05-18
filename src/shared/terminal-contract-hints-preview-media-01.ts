import type { TerminalCommandHintEntry } from './terminal-contract-types'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'

/** §8 — подсказки превью/ffprobe (часть 01). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_01: TerminalCommandHintEntry[] = [
  {
    tool: 'ffprobe',
    token: '· контейнер и дорожки',
    summary:
      'Полный отчёт утилиты ffprobe по текущему файлу превью; путь к медиа подставляется при запуске.',
    fullLine: `ffprobe -hide_banner -show_format -show_streams ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· длительность контейнера',
    summary:
      'Кратко: длительность, размер и битрейт (поля format: duration — длительность, size — размер в байтах, bit_rate — суммарный битрейт).',
    fullLine: `ffprobe -hide_banner -show_entries format=duration,size,bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы и сводка контейнера',
    summary:
      'Главы и метаданные контейнера (-show_chapters -show_format); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_format ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 кратко',
    summary:
      'Первая видеодорожка (v:0): ширина, высота, частота кадров и формат пикселей (поля ffprobe: width — ширина кадра, height — высота кадра, r_frame_rate — номинальная частота кадров, pix_fmt — формат пикселей; одно поле на строку (шаблон default=nw=1)); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=width,height,r_frame_rate,pix_fmt -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 цвет',
    summary:
      'Первая видеодорожка (v:0): цветовое пространство, первичные цвета и кривая переноса (поля ffprobe: color_space — цветовое пространство, color_primaries — первичные цвета, color_transfer — кривая переноса; диагностика HDR и SDR); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=color_space,color_primaries,color_transfer -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 битрейт и частота кадров',
    summary:
      'Первая видеодорожка (v:0): битрейт и средняя частота кадров (поля ffprobe: bit_rate — битрейт дорожки, avg_frame_rate — средняя частота кадров; сверка с r_frame_rate из компактного шаблона); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=bit_rate,avg_frame_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 sar и dar',
    summary:
      'Первая видеодорожка (v:0): SAR и DAR (поля ffprobe: sample_aspect_ratio — выборочное соотношение сторон пикселя, display_aspect_ratio — соотношение сторон кадра; анаморф и неквадратные пиксели); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=sample_aspect_ratio,display_aspect_ratio -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 кратко',
    summary:
      'Первая аудиодорожка (a:0): кодек, частота дискретизации и число каналов (поля ffprobe: codec_name — кодек, sample_rate — частота дискретизации, channels — число каналов; одно поле на строку (шаблон default=nw=1)); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 язык',
    summary:
      'Тег языка первой аудиодорожки (поле stream_tags.language); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream_tags=language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 икм (без сжатия)',
    summary:
      'Первая аудиодорожка (a:0): битность сэмпла и формат сэмпла (поля ffprobe: bits_per_sample — битность сэмпла, sample_fmt — формат сэмпла; PCM и глубина); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=bits_per_sample,sample_fmt -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 кратко',
    summary: 'Дорожка субтитров (s:0): кодек и строка тега кодека (поля ffprobe: codec_name — кодек, codec_tag_string — строка тега кодека; одно поле на строку (шаблон default=nw=1)); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· все дорожки (компактный формат)',
    summary:
      'Все дорожки одной строкой: индекс, тип и имя кодека (поля ffprobe: index — индекс дорожки, codec_type — тип (видео/аудио/субтитры), codec_name — имя кодека; вывод -of compact, компактная таблица); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries stream=index,codec_type,codec_name -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· дорожки и вложения',
    summary:
      'Все дорожки и теги имени файла и MIME (поля stream_tags: filename — имя вложения, mimetype — MIME-тип; вложения и шрифты MKV, типы data и attachment); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries stream=index,codec_type,codec_name:stream_tags=filename,mimetype -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер и дорожки, json',
    summary:
      'Сводка блоков format и streams в JSON (-of json); удобно скопировать в архив ZIP для поддержки или обработать утилитой jq.',
    fullLine: `ffprobe -hide_banner -of json -show_format -show_streams ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· только ошибки',
    summary:
      'Только ошибки контейнера или потока (-v error -show_error); пусто = файл читается без проблем.',
    fullLine: `ffprobe -hide_banner -v error -show_error ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги: заголовок и кодировщик',
    summary:
      'Теги контейнера: заголовок и кодировщик (поля format_tags: title — заголовок, encoder — кодировщик; ключ -show_entries format_tags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=title,encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 поле и диапазон',
    summary:
      'Первая видеодорожка (v:0): порядок полей кадра и диапазон яркости (поля ffprobe: field_order — порядок полей кадра, color_range — диапазон яркости; чересстрочность и полный диапазон яркости — в терминах full range); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=field_order,color_range -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 теги',
    summary: 'Дорожка субтитров (s:0): теги заголовка и языка субтитров (поля stream_tags: title — заголовок дорожки, language — язык); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream_tags=title,language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 кратко',
    summary:
      'Вторая аудиодорожка a:1: кодек, частота дискретизации и каналы (поля ffprobe: codec_name, sample_rate, channels; мультиязык и комментарии); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 теги дорожки',
    summary:
      'Первая видеодорожка (v:0): теги дорожки handler_name и encoder (поля stream_tags: имя обработчика и кодировщик; отдельно от тегов контейнера); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=handler_name,encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 кадры и длительность',
    summary:
      'Первая видеодорожка (v:0): число кадров и длительность дорожки (поля ffprobe: nb_frames — оценка числа кадров, duration — длительность дорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=nb_frames,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: начало и длительность',
    summary:
      'Контейнер: start_time и duration на уровне format (поля format: смещение начала и длительность контейнера относительно дорожек); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:1 кратко',
    summary:
      'Вторая дорожка субтитров s:1: кодек и строка тега кодека (поля ffprobe: codec_name, codec_tag_string; несколько языков); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 профиль',
    summary:
      'Первая видеодорожка (v:0): кодек, профиль и уровень (поля ffprobe: codec_name, profile, level — для транскодинга); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=codec_name,profile,level -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 профиль и битрейт',
    summary:
      'Первая аудиодорожка (a:0): кодек, профиль и битрейт (поля ffprobe: codec_name, profile, bit_rate); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=codec_name,profile,bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 опорные и двунаправленные кадры',
    summary:
      'Первая видеодорожка (v:0): число опорных кадров и наличие B-кадров (поля ffprobe: refs — число опорных кадров, has_b_frames — есть ли двунаправленные кадры; сложность GOP); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=refs,has_b_frames -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· дорожки: атрибуты (все)',
    summary:
      'Все дорожки: индекс, тип и расклад (поля ffprobe: index, codec_type, блок disposition — default по умолчанию, forced принудительно, captions встроенные субтитры, attached_pic обложка); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries stream=index,codec_type,disposition -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: число потоков и имя формата',
    summary:
      'Контейнер: число потоков, программ и имя формата (поля format: nb_streams — число дорожек, nb_programs — число программ, format_name — имя формата); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=nb_streams,nb_programs,format_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 пересчёт кадров',
    summary:
      'Точный пересчёт кадров первой видеодорожки (v:0) (-count_frames, поле ffprobe nb_read_frames — реально прочитанные кадры); медленно, но даёт реальный счёт; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 атрибуты дорожки',
    summary:
      'Первая аудиодорожка (a:0): раскладка дорожки disposition (поле ffprobe: default, forced, comment и др. — флаги назначения дорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 пиксели и цвет',
    summary:
      'Первая видеодорожка (v:0): формат пикселей и цвет (поля ffprobe: pix_fmt — формат пикселей, color_space — цветовое пространство, color_range — диапазон яркости; контекст SDR и HDR без отдельного color_transfer); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=pix_fmt,color_space,color_range -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 размер кадра: хранение и отображение',
    summary:
      'Первая видеодорожка (v:0): размеры хранения и отображения (поля ffprobe: coded_width и coded_height — сетка кодека, width и height — размер отображения; анаморф); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=coded_width,coded_height,width,height -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: время создания',
    summary:
      'Тег контейнера creation_time (поле format_tags: время записи файла или потока метаданных); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=creation_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 атрибуты дорожки',
    summary: 'Дорожка субтитров (s:0): disposition (поле ffprobe: default, forced, hearing_impaired для слабослышащих и т. д.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0: таймбаза и старт меток',
    summary:
      'Первая видеодорожка (v:0): тактовая сетка и стартовая метка (поля ffprobe: time_base — знаменатель базы времени, start_pts — первый PTS дорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0: таймбаза и старт меток',
    summary:
      'Первая аудиодорожка (a:0): тактовая сетка и стартовая метка аудио (поля ffprobe: time_base — база времени, start_pts — смещение первого тика); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 битрейт и максимум',
    summary:
      'Первая видеодорожка (v:0): битрейт и максимальный битрейт (поля ffprobe: bit_rate — средний, max_bit_rate — пик при VBR); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=bit_rate,max_bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: имя входа',
    summary:
      'Имя входа, которое видит демультиплексор (поле format.filename; путь к файлу); сверка пути и редиректов; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=filename -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 тег поворота',
    summary:
      'Устаревший тег поворота rotate в stream_tags (часто QuickTime и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_tags=rotate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 расклад и битрейт',
    summary:
      'Первая аудиодорожка (a:0): расклад каналов и битрейт (поля ffprobe: channel_layout — строка расклада вроде stereo, bit_rate — битрейт дорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=channel_layout,bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: битрейт',
    summary:
      'Сводный битрейт контейнера (поле format.bit_rate и сверка с суммой дорожек); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 название и обработчик',
    summary:
      'Первая аудиодорожка (a:0): теги title и handler_name дорожки (поля stream_tags: название и обработчик дорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream_tags=title,handler_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 номинальная частота кадров',
    summary:
      'Только частота кадров r_frame_rate у видео v:0 (поле ffprobe: номинальная частота кадров; сверка с avg_frame_rate в других шаблонах); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=r_frame_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: бренды mp4/mov',
    summary:
      'Теги контейнера: основной бренд и совместимые бренды (поля format_tags: major_brand — основной бренд, compatible_brands — список совместимых; семейство MP4 и MOV); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=major_brand,compatible_brands -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:2 кратко',
    summary:
      'Третья дорожка субтитров s:2: кодек и строка тега кодека (поля ffprobe: codec_name, codec_tag_string); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:2 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0: встроенные субтитры и avc',
    summary:
      'Первая видеодорожка (v:0): признаки субтитров и AVC (поля ffprobe: closed_captions — встроенные субтитры в потоке, is_avc — элементарный поток AVC; контекст CEA-608 и CEA-708); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=closed_captions,is_avc -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложение t:0 (контейнер mkv)',
    summary:
      'Первая вложенная дорожка t:0 (шрифты и обложки MKV): поля ffprobe codec_name и codec_tag_string; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:0 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· дорожка данных d:0',
    summary:
      'Первая data-дорожка d:0 (метаданные с привязкой ко времени и др.): поля ffprobe codec_name и codec_tag_string; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:0 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0: четырёхбуквенный тег кодека',
    summary:
      'Первая видеодорожка (v:0): codec_tag_string (поле ffprobe: четырёхбуквенный идентификатор FourCC — бренд сырого кодека); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: оценка зондирования',
    summary:
      'Поле probe_score по контейнеру: насколько уверенно выбран демультиплексор; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=probe_score -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:2 кратко',
    summary:
      'Третья аудиодорожка a:2: кодек, частота дискретизации и каналы (поля ffprobe: codec_name, sample_rate, channels); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:2 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· дымовая проверка декода',
    summary:
      'Быстрый прогон декодера первых 10 с (-t 10), вывод в пустой мультиплексор (-f null); нагрузка на центральный процессор (CPU) и графический процессор (GPU).',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 10 -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· один кадр, пустой выход',
    summary:
      'Декод одного кадра с выводом в пустой мультиплексор (-f null, -frames:v 1); быстрее полной дымовой проверки на длинных файлах.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -frames:v 1 -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: полное имя формата',
    summary:
      'Человекочитаемое имя контейнера (поле format.format_long_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=format_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 расположение цветности',
    summary:
      'Первая видеодорожка (v:0): chroma_location (поле ffprobe: расположение субдискретизации цветности, напр. 4:2:0); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=chroma_location -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· программы в ts, компактно',
    summary:
      'MPEG-TS и M3U8: список программ демультиплексора (-show_programs, вывод -of compact, компактная таблица); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_programs -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  }
]
