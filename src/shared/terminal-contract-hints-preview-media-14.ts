import type { TerminalCommandHintEntry } from './terminal-contract-types'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'

/** §8 — подсказки превью/ffprobe (часть 14). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_14: TerminalCommandHintEntry[] = [
  {
    tool: 'ffprobe',
    token: '· главы tags encoder',
    summary:
      'Теги encoder у всех глав (-show_chapters -show_entries chapter_tags=encoder -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter_tags=encoder -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 pkt_duration 5',
    summary:
      'Первые пять кадров v:0: pkt_duration_time (-show_frames -read_intervals %+#5); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#5 -show_entries frame=pkt_duration_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакеты v:0 pts 2',
    summary:
      'Первые два пакета v:0: pts_time (-show_packets -read_intervals %+#2 -show_entries packet=pts_time); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#2 -show_entries packet=pts_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер start_time size',
    summary: 'Поля format: start_time и size (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=start_time,size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:10 field_order refs',
    summary:
      'Одиннадцатый видеопоток v:10: field_order и refs (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:10 -show_entries stream=field_order,refs -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:4 stream_tags lang',
    summary:
      'Пятая дорожка субтитров s:4: stream_tags language (поле stream_tags=language); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:4 -show_entries stream_tags=language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:19 кратко',
    summary:
      'Двадцатая аудиодорожка a:19: кодек и число каналов (поля codec_name и channels); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:19 -show_entries stream=codec_name,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:12 side_data_list',
    summary:
      'Тринадцатая аудиодорожка a:12: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:12 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:5 color_space primaries',
    summary:
      'Шестой видеопоток v:5: color_space и color_primaries (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:5 -show_entries stream=color_space,color_primaries -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rotate 4° 2с',
    summary:
      'Поворот rotate=4*PI/180 первых 2 с; дымовая проверка rotate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf rotate=4*PI/180 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale 1024x576 2с',
    summary:
      'Масштабирование scale=1024:576 первых 2 с; дымовая проверка scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=1024:576 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hue h15 2с',
    summary:
      'Смещение оттенка hue=h=15:s=1.0 первых 2 с; дымовая проверка hue; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=h=15:s=1.0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: eq contrast 0.96 2с',
    summary:
      'Контраст и яркость eq=contrast=0.96:brightness=-0.01 первых 2 с; дымовая проверка eq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf eq=contrast=0.96:brightness=-0.01 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tpad stop clone 3с',
    summary:
      'Паддинг в конце tpad=stop_mode=clone:stop_duration=0.12 первых 3 с; дымовая проверка tpad; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tpad=stop_mode=clone:stop_duration=0.12 -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tmix 5 2с',
    summary:
      'Смешивание соседних кадров tmix=frames=5 первых 2 с; дымовая проверка tmix; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tmix=frames=5 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: boxblur 2 2с',
    summary:
      'Размытие boxblur=2:1 первых 2 с; дымовая проверка boxblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf boxblur=2:1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: deband r28 2с',
    summary:
      'Сглаживание полос deband=range=28:blur=1 первых 2 с; дымовая проверка deband; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf deband=range=28:blur=1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aecho 110ms 3с',
    summary:
      'Эхо aecho=0.75:0.8:110:0.4 первых 3 с; дымовая проверка aecho; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aecho=0.75:0.8:110:0.4 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lowpass 3000 2с',
    summary:
      'Срез ВЧ lowpass=f=3000 первых 2 с; дымовая проверка lowpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowpass=f=3000 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: highpass 150 2с',
    summary:
      'Срез НЧ highpass=f=150 первых 2 с; дымовая проверка highpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=150 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: atempo 1.06 3с',
    summary:
      'Ускорение atempo=1.06 первых 3 с; дымовая проверка atempo; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af atempo=1.06 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: afftdn -8 2с',
    summary:
      'FFT-шумодав afftdn=nf=-8 первых 2 с; дымовая проверка afftdn; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afftdn=nf=-8 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: volume -0.6dB 2с',
    summary:
      'Ослабление громкости volume=-0.6dB первых 2 с; дымовая проверка volume; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volume=-0.6dB -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: alimiter 0.88 2с',
    summary:
      'Лимитер alimiter=limit=0.88:attack=3:release=75 первых 2 с; дымовая проверка alimiter; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af alimiter=limit=0.88:attack=3:release=75 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:19 кратко',
    summary:
      'Двадцатый видеопоток v:19: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:19 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:20 кратко',
    summary:
      'Двадцать первый поток данных d:20: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:20 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:15 кратко',
    summary:
      'Шестнадцатый поток вложений t:15: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:15 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:20 disposition',
    summary:
      'Двадцать первая дорожка субтитров s:20: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:20 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер season',
    summary: 'Сезон в контейнере (поле format_tags=season); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=season -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер episode',
    summary:
      'Эпизод в контейнере (поле format_tags=episode); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=episode -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер media_type',
    summary:
      'Тип медиа в контейнере (поле format_tags=media_type); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=media_type -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы tags language',
    summary:
      'Теги language у всех глав (-show_chapters -show_entries chapter_tags=language -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter_tags=language -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 pict_type 6',
    summary:
      'Первые шесть кадров v:0: pict_type (-show_frames -read_intervals %+#6); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#6 -show_entries frame=pict_type -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакеты v:0 size 2',
    summary:
      'Первые два пакета v:0: size (-show_packets -read_intervals %+#2 -show_entries packet=size); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#2 -show_entries packet=size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер duration size',
    summary: 'Поля format: duration и size (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=duration,size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:11 color_transfer primaries',
    summary:
      'Двенадцатый видеопоток v:11: color_transfer и color_primaries (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:11 -show_entries stream=color_transfer,color_primaries -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:5 stream_tags title',
    summary:
      'Шестая дорожка субтитров s:5: stream_tags title (поле stream_tags=title); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:5 -show_entries stream_tags=title -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:20 кратко',
    summary:
      'Двадцать первая аудиодорожка a:20: кодек и bit_rate (поля codec_name и bit_rate); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:20 -show_entries stream=codec_name,bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:13 side_data_list',
    summary:
      'Четырнадцатая аудиодорожка a:13: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:13 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:6 level refs',
    summary:
      'Седьмой видеопоток v:6: level и refs (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:6 -show_entries stream=level,refs -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rotate -5° 2с',
    summary:
      'Поворот rotate=-5*PI/180 первых 2 с; дымовая проверка rotate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf rotate=-5*PI/180 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale 960x540 2с',
    summary:
      'Масштабирование scale=960:540 первых 2 с; дымовая проверка scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=960:540 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hue h-20 2с',
    summary:
      'Смещение оттенка hue=h=-20:s=0.95 первых 2 с; дымовая проверка hue; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=h=-20:s=0.95 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: eq gamma 0.98 2с',
    summary:
      'Коррекция eq=gamma=0.98:contrast=1.02 первых 2 с; дымовая проверка eq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf eq=gamma=0.98:contrast=1.02 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tpad start add 3с',
    summary:
      'Паддинг в начале tpad=start_mode=add:start_duration=0.12 первых 3 с; дымовая проверка tpad; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tpad=start_mode=add:start_duration=0.12 -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tmix 6 2с',
    summary:
      'Смешивание соседних кадров tmix=frames=6 первых 2 с; дымовая проверка tmix; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tmix=frames=6 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: gblur 1.5 2с',
    summary:
      'Гауссово размытие gblur=sigma=1.5 первых 2 с; дымовая проверка gblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf gblur=sigma=1.5 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: gradfun 1.5 2с',
    summary:
      'Подавление бэндинга gradfun=1.5 первых 2 с; дымовая проверка gradfun; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf gradfun=1.5 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aecho 130ms 3с',
    summary:
      'Эхо aecho=0.78:0.82:130:0.42 первых 3 с; дымовая проверка aecho; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aecho=0.78:0.82:130:0.42 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lowpass 2600 2с',
    summary:
      'Срез ВЧ lowpass=f=2600 первых 2 с; дымовая проверка lowpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowpass=f=2600 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: highpass 180 2с',
    summary:
      'Срез НЧ highpass=f=180 первых 2 с; дымовая проверка highpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=180 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: atempo 0.94 3с',
    summary:
      'Замедление atempo=0.94 первых 3 с; дымовая проверка atempo; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af atempo=0.94 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: afftdn -7 2с',
    summary:
      'FFT-шумодав afftdn=nf=-7 первых 2 с; дымовая проверка afftdn; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afftdn=nf=-7 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: volume +1dB 2с',
    summary:
      'Подъём громкости volume=1dB первых 2 с; дымовая проверка volume; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volume=1dB -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: alimiter 0.86 2с',
    summary:
      'Лимитер alimiter=limit=0.86:attack=4:release=80 первых 2 с; дымовая проверка alimiter; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af alimiter=limit=0.86:attack=4:release=80 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:20 кратко',
    summary:
      'Двадцать первый видеопоток v:20: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:20 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  }
]
