import type { TerminalCommandHintEntry } from './terminal-contract-types'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'

/** §8 — подсказки превью/ffprobe (часть 13). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_13: TerminalCommandHintEntry[] = [
  {
    tool: 'ffprobe',
    token: '· аудио a:17 кратко',
    summary:
      'Восемнадцатая аудиодорожка a:17: кодек и layout каналов (поля codec_name и channel_layout); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:17 -show_entries stream=codec_name,channel_layout -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:10 side_data_list',
    summary:
      'Одиннадцатая аудиодорожка a:10: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:10 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:3 refs level',
    summary:
      'Четвёртый видеопоток v:3: refs и level (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:3 -show_entries stream=refs,level -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rotate -2° 2с',
    summary:
      'Поворот rotate=-2*PI/180 первых 2 с; дымовая проверка rotate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf rotate=-2*PI/180 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale 1280x720 2с',
    summary:
      'Масштабирование scale=1280:720 первых 2 с; дымовая проверка scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=1280:720 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hue h-30 2с',
    summary:
      'Смещение оттенка hue=h=-30:s=1.05 первых 2 с; дымовая проверка hue; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=h=-30:s=1.05 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: eq contrast 2с',
    summary:
      'Контраст и яркость eq=contrast=1.08:brightness=0.01 первых 2 с; дымовая проверка eq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf eq=contrast=1.08:brightness=0.01 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tpad stop 2с',
    summary:
      'Паддинг в конце tpad=stop_mode=clone:stop_duration=0.08 первых 2 с; дымовая проверка tpad; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tpad=stop_mode=clone:stop_duration=0.08 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tmix 4 2с',
    summary:
      'Смешивание соседних кадров tmix=frames=4 первых 2 с; дымовая проверка tmix; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tmix=frames=4 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: avgblur 3 2с',
    summary:
      'Среднее размытие avgblur=3:3 первых 2 с; дымовая проверка avgblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf avgblur=3:3 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: deband r32 2с',
    summary:
      'Сглаживание полос deband=range=32:blur=1 первых 2 с; дымовая проверка deband; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf deband=range=32:blur=1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aecho 80ms 3с',
    summary:
      'Эхо aecho=0.7:0.75:80:0.3 первых 3 с; дымовая проверка aecho; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aecho=0.7:0.75:80:0.3 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lowpass 4200 2с',
    summary:
      'Срез ВЧ lowpass=f=4200 первых 2 с; дымовая проверка lowpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowpass=f=4200 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: highpass 90 2с',
    summary:
      'Срез НЧ highpass=f=90 первых 2 с; дымовая проверка highpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=90 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: atempo 1.03 3с',
    summary:
      'Ускорение atempo=1.03 первых 3 с; дымовая проверка atempo; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af atempo=1.03 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: afftdn -10 2с',
    summary:
      'FFT-шумодав afftdn=nf=-10 первых 2 с; дымовая проверка afftdn; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afftdn=nf=-10 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: volume -1dB 2с',
    summary:
      'Ослабление громкости volume=-1dB первых 2 с; дымовая проверка volume; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volume=-1dB -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: alimiter 0.95 2с',
    summary:
      'Лимитер alimiter=limit=0.95:attack=3:release=70 первых 2 с; дымовая проверка alimiter; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af alimiter=limit=0.95:attack=3:release=70 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:17 кратко',
    summary:
      'Восемнадцатый видеопоток v:17: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:17 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:18 кратко',
    summary:
      'Девятнадцатый поток данных d:18: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:18 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:13 кратко',
    summary:
      'Четырнадцатый поток вложений t:13: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:13 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:18 disposition',
    summary:
      'Девятнадцатая дорожка субтитров s:18: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:18 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер tv_network',
    summary:
      'Телеканал/сеть в контейнере (поле format_tags=tv_network); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=tv_network -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер episode_sort',
    summary:
      'Порядковый номер эпизода в контейнере (поле format_tags=episode_sort); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=episode_sort -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер service_provider',
    summary:
      'Поставщик сервиса в контейнере (поле format_tags=service_provider); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=service_provider -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы tags comment',
    summary:
      'Теги comment у всех глав (-show_chapters -show_entries chapter_tags=comment -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter_tags=comment -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 best_effort 5',
    summary:
      'Первые пять кадров v:0: best_effort_timestamp_time (-show_frames -read_intervals %+#5); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#5 -show_entries frame=best_effort_timestamp_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакеты v:0 dts 2',
    summary:
      'Первые два пакета v:0: dts_time (-show_packets -read_intervals %+#2 -show_entries packet=dts_time); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#2 -show_entries packet=dts_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер bit_rate size',
    summary:
      'Поля format: bit_rate и size (поля ffprobe; сверка веса и суммарного битрейта); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=bit_rate,size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:9 pix_fmt level',
    summary:
      'Десятый видеопоток v:9: pix_fmt и level (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:9 -show_entries stream=pix_fmt,level -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:3 stream_tags title',
    summary:
      'Четвёртая дорожка субтитров s:3: stream_tags title (поле stream_tags=title); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:3 -show_entries stream_tags=title -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:18 кратко',
    summary:
      'Девятнадцатая аудиодорожка a:18: кодек и битность (поля codec_name и bits_per_sample); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:18 -show_entries stream=codec_name,bits_per_sample -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:11 side_data_list',
    summary:
      'Двенадцатая аудиодорожка a:11: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:11 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:4 coded_width height',
    summary:
      'Пятый видеопоток v:4: coded_width и coded_height (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:4 -show_entries stream=coded_width,coded_height -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rotate 1° 2с',
    summary:
      'Поворот rotate=PI/180 первых 2 с; дымовая проверка rotate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf rotate=PI/180 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale 854x480 2с',
    summary:
      'Масштабирование scale=854:480 первых 2 с; дымовая проверка scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=854:480 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hue s1.15 2с',
    summary:
      'Насыщенность hue=s=1.15 первых 2 с; дымовая проверка hue; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=s=1.15 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: eq gamma_weight 2с',
    summary:
      'Коррекция eq=gamma=1.04:gamma_weight=0.9 первых 2 с; дымовая проверка eq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf eq=gamma=1.04:gamma_weight=0.9 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tpad start 2с clone',
    summary:
      'Паддинг в начале tpad=start_mode=clone:start_duration=0.08 первых 2 с; дымовая проверка tpad; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tpad=start_mode=clone:start_duration=0.08 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tmix 3 2с',
    summary:
      'Смешивание соседних кадров tmix=frames=3 первых 2 с; дымовая проверка tmix; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tmix=frames=3 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: gblur 1.2 2с',
    summary:
      'Гауссово размытие gblur=sigma=1.2 первых 2 с; дымовая проверка gblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf gblur=sigma=1.2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: gradfun 1.3 2с',
    summary:
      'Подавление бэндинга gradfun=1.3 первых 2 с; дымовая проверка gradfun; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf gradfun=1.3 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aecho 95ms 3с',
    summary:
      'Эхо aecho=0.72:0.78:95:0.35 первых 3 с; дымовая проверка aecho; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aecho=0.72:0.78:95:0.35 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lowpass 3600 2с',
    summary:
      'Срез ВЧ lowpass=f=3600 первых 2 с; дымовая проверка lowpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowpass=f=3600 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: highpass 120 2с',
    summary:
      'Срез НЧ highpass=f=120 первых 2 с; дымовая проверка highpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=120 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: atempo 0.97 3с',
    summary:
      'Замедление atempo=0.97 первых 3 с; дымовая проверка atempo; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af atempo=0.97 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: afftdn -9 2с',
    summary:
      'FFT-шумодав afftdn=nf=-9 первых 2 с; дымовая проверка afftdn; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afftdn=nf=-9 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: volume +0.8dB 2с',
    summary:
      'Подъём громкости volume=0.8dB первых 2 с; дымовая проверка volume; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volume=0.8dB -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: alimiter 0.9 2с',
    summary:
      'Лимитер alimiter=limit=0.9:attack=2:release=60 первых 2 с; дымовая проверка alimiter; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af alimiter=limit=0.9:attack=2:release=60 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:18 кратко',
    summary:
      'Девятнадцатый видеопоток v:18: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:18 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:19 кратко',
    summary:
      'Двадцатый поток данных d:19: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:19 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:14 кратко',
    summary:
      'Пятнадцатый поток вложений t:14: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:14 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:19 disposition',
    summary:
      'Двадцатая дорожка субтитров s:19: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:19 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер synopsis',
    summary:
      'Краткое описание в контейнере (поле format_tags=synopsis); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=synopsis -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер network',
    summary:
      'Сеть вещания в контейнере (поле format_tags=network); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=network -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер hd_video',
    summary:
      'Флаг HD-видео в контейнере (поле format_tags=hd_video); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=hd_video -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  }
]
