import type { TerminalCommandHintEntry } from './terminal-contract-types'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'

/** §8 — подсказки превью/ffprobe (часть 11). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_11: TerminalCommandHintEntry[] = [
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lagfun 0.85 2с',
    summary:
      'Шлейф кадров lagfun=decay=0.85 первых 2 с; дымовая проверка lagfun; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf lagfun=decay=0.85 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: noise u 2с',
    summary:
      'Шум noise=alls=5:allf=u первых 2 с; дымовая проверка noise; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf noise=alls=5:allf=u -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: weave 2с',
    summary:
      'Переплетение полей weave первых 2 с; дымовая проверка weave; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf weave -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: palettegen 64 1с',
    summary:
      'Палитра palettegen=max_colors=64:reserve_transparent=1,paletteuse первой секунды; дымовая проверка palette*; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf palettegen=max_colors=64:reserve_transparent=1,paletteuse -t 1 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: apad 0.35 3с',
    summary:
      'Тишина в хвосте apad=pad_dur=0.35 первых 3 с; дымовая проверка apad; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af apad=pad_dur=0.35 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: asoftclip tanh 2с',
    summary:
      'Мягкий клип asoftclip=threshold=0.8:type=tanh первых 2 с; дымовая проверка asoftclip; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af asoftclip=threshold=0.8:type=tanh -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: dcshift 2с',
    summary:
      'Постоянная составляющая dcshift=0.005 первых 2 с; дымовая проверка dcshift; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af dcshift=0.005 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: firequalizer +2 2с',
    summary:
      'Частотное усиление firequalizer=gain=2 первых 2 с; дымовая проверка firequalizer; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af firequalizer=gain=2 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: stereotools 0.15 2с',
    summary:
      'Стерео-коррекция stereotools=mlev=0.15:phlev=0.01 первых 2 с; дымовая проверка stereotools; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af stereotools=mlev=0.15:phlev=0.01 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: treble -1 2с',
    summary:
      'Ослабление ВЧ treble=g=-1 первых 2 с; дымовая проверка treble; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af treble=g=-1 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:13 кратко',
    summary:
      'Четырнадцатый видеопоток v:13: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:13 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:14 кратко',
    summary:
      'Пятнадцатый поток данных d:14: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:14 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:9 кратко',
    summary:
      'Десятый поток вложений t:9: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:9 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:14 disposition',
    summary:
      'Пятнадцатая дорожка субтитров s:14: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:14 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер keywords',
    summary:
      'Ключевые слова в контейнере (поле format_tags=keywords; каталогизация); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=keywords -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер podcast url',
    summary:
      'Ссылка на подкаст в контейнере (поле format_tags=podcastURL; iTunes); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=podcastURL -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы start duration',
    summary:
      'Все главы: start_time и duration (-show_chapters -show_entries chapter=start_time,duration -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter=start_time,duration -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 coded_pic 3',
    summary:
      'Первые три кадра первой видеодорожки (v:0): coded_picture_number (-show_frames -read_intervals %+#3); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#3 -show_entries frame=coded_picture_number -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакет v:0 size 1',
    summary:
      'Первый пакет первой видеодорожки (v:0): size (-show_packets -read_intervals %+#1 -show_entries packet=size); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#1 -show_entries packet=size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:5 pix_fmt profile',
    summary:
      'Шестой видеопоток v:5: pix_fmt и profile (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:5 -show_entries stream=pix_fmt,profile -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:3 side_data_list',
    summary:
      'Четвёртый видеопоток v:3: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:3 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:7 side_data_list',
    summary:
      'Восьмая аудиодорожка a:7: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:7 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:13 кратко',
    summary:
      'Четырнадцатая аудиодорожка a:13: кодек и частота дискретизации (поля codec_name и sample_rate); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:13 -show_entries stream=codec_name,sample_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:5 codec_long',
    summary:
      'Шестая дорожка субтитров s:5: codec_long_name (поле ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:5 -show_entries stream=codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: mpdecimate hi12 5с',
    summary:
      'Прореживание mpdecimate=hi=12:lo=640 первых 5 с; дымовая проверка mpdecimate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf mpdecimate=hi=12:lo=640 -t 5 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: deshake search32 2с',
    summary:
      'Стабилизация deshake=search=32:shake=8 первых 2 с; дымовая проверка deshake; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf deshake=search=32:shake=8 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: median 5 2с',
    summary:
      'Медианный фильтр median=5 первых 2 с; дымовая проверка median; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf median=5 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: boxblur 3 2с',
    summary:
      'Размытие boxblur=3:2 первых 2 с; дымовая проверка boxblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf boxblur=3:2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: gblur 0.8 2с',
    summary:
      'Гауссово размытие gblur=sigma=0.8 первых 2 с; дымовая проверка gblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf gblur=sigma=0.8 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: edgedetect 0.15 2с',
    summary:
      'Контуры edgedetect=low=0.15:high=0.35 первых 2 с; дымовая проверка edgedetect; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf edgedetect=low=0.15:high=0.35 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tpad start 2с',
    summary:
      'Паддинг кадров tpad=start_mode=add:start_duration=0.06 первых 2 с; дымовая проверка tpad; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tpad=start_mode=add:start_duration=0.06 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rotate 3° 2с',
    summary:
      'Поворот rotate=3*PI/180 первых 2 с; дымовая проверка rotate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf rotate=3*PI/180 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: shuffleplanes 1:2:0',
    summary:
      'Перестановка плоскостей shuffleplanes=1:2:0 первых 2 с; дымовая проверка shuffleplanes; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf shuffleplanes=1:2:0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: colorchannelmixer gg',
    summary:
      'Микс каналов colorchannelmixer=gg=0.92:rr=1:bb=1 первых 2 с; дымовая проверка colorchannelmixer; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf colorchannelmixer=gg=0.92:rr=1:bb=1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: phase U 2с',
    summary:
      'Фаза chroma phase=U первых 2 с; дымовая проверка phase; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf phase=U -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: pan 0.7 3с',
    summary:
      'Стерео-панорама pan=stereo|c0=0.7*c0+0.3*c1|c1=0.3*c0+0.7*c1 первых 3 с; дымовая проверка pan; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af pan=stereo|c0=0.7*c0+0.3*c1|c1=0.3*c0+0.7*c1 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: haas 8ms 3с',
    summary:
      'Эффект Хааса haas_effect=del_ms=8:side_gain=0.4 первых 3 с; дымовая проверка haas_effect; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af haas_effect=del_ms=8:side_gain=0.4 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rubberband pitch 3с',
    summary:
      'Сдвиг тона rubberband=tempo=1.0:pitch=1.02 первых 3 с; дымовая проверка rubberband; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af rubberband=tempo=1.0:pitch=1.02 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tilt -1 3с',
    summary:
      'Наклон АЧХ tilt=frequency=1200:width=6:g=-1 первых 3 с; дымовая проверка tilt; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af tilt=frequency=1200:width=6:g=-1 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: asubboost 2 3с',
    summary:
      'Подъём низов asubboost=dry=0.7:wet=0.7:boost=2 первых 3 с; дымовая проверка asubboost; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af asubboost=dry=0.7:wet=0.7:boost=2 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: afftdn -12 2с',
    summary:
      'FFT-шумодав afftdn=nf=-12 первых 2 с; дымовая проверка afftdn; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afftdn=nf=-12 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:14 кратко',
    summary:
      'Пятнадцатый видеопоток v:14: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:14 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:15 кратко',
    summary:
      'Шестнадцатый поток данных d:15: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:15 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:10 кратко',
    summary:
      'Одиннадцатый поток вложений t:10: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:10 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:15 disposition',
    summary:
      'Шестнадцатая дорожка субтитров s:15: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:15 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер website',
    summary:
      'Веб-страница в метаданных контейнера (поле format_tags=website; каталоги); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=website -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер encoded_by date',
    summary:
      'Теги контейнера encoded_by и date (поля format_tags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoded_by,date -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы id duration',
    summary:
      'Все главы: id и duration (-show_chapters -show_entries chapter=id,duration -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter=id,duration -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 display_pic 4',
    summary:
      'Первые четыре кадра первой видеодорожки (v:0): display_picture_number (-show_frames -read_intervals %+#4); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#4 -show_entries frame=display_picture_number -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер duration bit_rate',
    summary:
      'Поля format: duration и bit_rate (поля ffprobe; сверка длительности и битрейта); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=duration,bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакет v:0 pos 1',
    summary:
      'Первый пакет первой видеодорожки (v:0): pos (-show_packets -read_intervals %+#1 -show_entries packet=pos); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#1 -show_entries packet=pos -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:6 color range space',
    summary:
      'Седьмой видеопоток v:6: color_range и color_space (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:6 -show_entries stream=color_range,color_space -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:8 side_data_list',
    summary:
      'Девятая аудиодорожка a:8: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:8 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:14 кратко',
    summary:
      'Пятнадцатая аудиодорожка a:14: кодек и layout каналов (поля codec_name и channel_layout); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:14 -show_entries stream=codec_name,channel_layout -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:6 disposition',
    summary:
      'Седьмая дорожка субтитров s:6: disposition и codec_tag_string (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:6 -show_entries stream=disposition,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hflip vflip 2с',
    summary:
      'Цепочка hflip,vflip первых 2 с; дымовая проверка отражений; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hflip,vflip -t 2 -an -sn -f null -`
  }
]
