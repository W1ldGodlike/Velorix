import type { TerminalCommandHintEntry } from './terminal-contract-types'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'

/** §8 — подсказки превью/ffprobe (часть 15). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_15: TerminalCommandHintEntry[] = [
  {
    tool: 'ffprobe',
    token: '· данные d:21 кратко',
    summary:
      'Двадцать второй поток данных d:21: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:21 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:16 кратко',
    summary:
      'Семнадцатый поток вложений t:16: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:16 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:21 disposition',
    summary:
      'Двадцать вторая дорожка субтитров s:21: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:21 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер station',
    summary:
      'Станция/канал в контейнере (поле format_tags=station); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=station -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер album_artist',
    summary:
      'Исполнитель альбома в контейнере (поле format_tags=album_artist); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=album_artist -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер purchase_date',
    summary:
      'Дата покупки в контейнере (поле format_tags=purchase_date); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=purchase_date -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы tags title',
    summary:
      'Теги title у всех глав (-show_chapters -show_entries chapter_tags=title -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter_tags=title -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 key_frame 6',
    summary:
      'Первые шесть кадров v:0: key_frame (-show_frames -read_intervals %+#6); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#6 -show_entries frame=key_frame -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакеты v:0 duration 2',
    summary:
      'Первые два пакета v:0: duration (-show_packets -read_intervals %+#2 -show_entries packet=duration); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#2 -show_entries packet=duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер filename duration',
    summary:
      'Поля format: filename и duration (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=filename,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:12 pix_fmt profile',
    summary:
      'Тринадцатый видеопоток v:12: pix_fmt и profile (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:12 -show_entries stream=pix_fmt,profile -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:6 stream_tags lang',
    summary:
      'Седьмая дорожка субтитров s:6: stream_tags language (поле stream_tags=language); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:6 -show_entries stream_tags=language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:21 кратко',
    summary:
      'Двадцать вторая аудиодорожка a:21: кодек и sample_rate (поля codec_name и sample_rate); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:21 -show_entries stream=codec_name,sample_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:14 side_data_list',
    summary:
      'Пятнадцатая аудиодорожка a:14: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:14 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:7 color_range transfer',
    summary:
      'Восьмой видеопоток v:7: color_range и color_transfer (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:7 -show_entries stream=color_range,color_transfer -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rotate 6° 2с',
    summary:
      'Поворот rotate=6*PI/180 первых 2 с; дымовая проверка rotate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf rotate=6*PI/180 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale 1280x544 2с',
    summary:
      'Масштабирование scale=1280:544 первых 2 с; дымовая проверка scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=1280:544 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hue h25 2с',
    summary:
      'Смещение оттенка hue=h=25:s=1.05 первых 2 с; дымовая проверка hue; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=h=25:s=1.05 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: eq brightness 2с',
    summary:
      'Коррекция eq=brightness=0.02:contrast=1.01 первых 2 с; дымовая проверка eq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf eq=brightness=0.02:contrast=1.01 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tpad stop add 3с',
    summary:
      'Паддинг в конце tpad=stop_mode=add:stop_duration=0.1 первых 3 с; дымовая проверка tpad; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tpad=stop_mode=add:stop_duration=0.1 -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tmix 7 2с',
    summary:
      'Смешивание соседних кадров tmix=frames=7 первых 2 с; дымовая проверка tmix; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tmix=frames=7 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: boxblur 3 2с',
    summary:
      'Размытие boxblur=3:1 первых 2 с; дымовая проверка boxblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf boxblur=3:1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: deband r24 2с',
    summary:
      'Сглаживание полос deband=range=24:blur=1 первых 2 с; дымовая проверка deband; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf deband=range=24:blur=1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aecho 145ms 3с',
    summary:
      'Эхо aecho=0.8:0.84:145:0.45 первых 3 с; дымовая проверка aecho; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aecho=0.8:0.84:145:0.45 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lowpass 2300 2с',
    summary:
      'Срез ВЧ lowpass=f=2300 первых 2 с; дымовая проверка lowpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowpass=f=2300 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: highpass 200 2с',
    summary:
      'Срез НЧ highpass=f=200 первых 2 с; дымовая проверка highpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=200 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: atempo 1.09 3с',
    summary:
      'Ускорение atempo=1.09 первых 3 с; дымовая проверка atempo; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af atempo=1.09 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: afftdn -6 2с',
    summary:
      'FFT-шумодав afftdn=nf=-6 первых 2 с; дымовая проверка afftdn; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afftdn=nf=-6 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: volume -1.2dB 2с',
    summary:
      'Ослабление громкости volume=-1.2dB первых 2 с; дымовая проверка volume; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volume=-1.2dB -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: alimiter 0.84 2с',
    summary:
      'Лимитер alimiter=limit=0.84:attack=4:release=85 первых 2 с; дымовая проверка alimiter; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af alimiter=limit=0.84:attack=4:release=85 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:27 кратко',
    summary:
      'Двадцать восьмой видеопоток v:27: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:27 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:28 кратко',
    summary:
      'Двадцать девятый поток данных d:28: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:28 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
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
    token: '· контейнер service_provider',
    summary:
      'Поставщик сервиса в контейнере (поле format_tags=service_provider); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=service_provider -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 pkt_pts 9',
    summary:
      'Первые девять кадров v:0: pkt_pts_time (-show_frames -read_intervals %+#9); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#9 -show_entries frame=pkt_pts_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
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
    token: '· видео v:14 color range refs',
    summary:
      'Пятнадцатый видеопоток v:14: color_range и refs (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:14 -show_entries stream=color_range,refs -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:21 side_data_list',
    summary:
      'Двадцать вторая аудиодорожка a:21: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:21 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rotate -14° 2с',
    summary:
      'Поворот rotate=-14*PI/180 первых 2 с; дымовая проверка rotate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf rotate=-14*PI/180 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale 1792x1008 2с',
    summary:
      'Масштабирование scale=1792:1008 первых 2 с; дымовая проверка scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=1792:1008 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hue h-70 2с',
    summary:
      'Смещение оттенка hue=h=-70:s=1.0 первых 2 с; дымовая проверка hue; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=h=-70:s=1.0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: eq gamma 1.14 2с',
    summary:
      'Коррекция eq=gamma=1.14:contrast=0.96 первых 2 с; дымовая проверка eq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf eq=gamma=1.14:contrast=0.96 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tmix 14 2с',
    summary:
      'Смешивание соседних кадров tmix=frames=14 первых 2 с; дымовая проверка tmix; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tmix=frames=14 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: gblur 3.0 2с',
    summary:
      'Гауссово размытие gblur=sigma=3.0 первых 2 с; дымовая проверка gblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf gblur=sigma=3.0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aecho 320ms 3с',
    summary:
      'Эхо aecho=0.9:0.93:320:0.6 первых 3 с; дымовая проверка aecho; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aecho=0.9:0.93:320:0.6 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lowpass 1400 2с',
    summary:
      'Срез ВЧ lowpass=f=1400 первых 2 с; дымовая проверка lowpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowpass=f=1400 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: highpass 340 2с',
    summary:
      'Срез НЧ highpass=f=340 первых 2 с; дымовая проверка highpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=340 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: atempo 1.16 3с',
    summary:
      'Ускорение atempo=1.16 первых 3 с; дымовая проверка atempo; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af atempo=1.16 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: alimiter 0.7 2с',
    summary:
      'Лимитер alimiter=limit=0.7:attack=5:release=95 первых 2 с; дымовая проверка alimiter; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af alimiter=limit=0.7:attack=5:release=95 -t 2 -vn -sn -f null -`
  }
]
