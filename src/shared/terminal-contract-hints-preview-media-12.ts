import type { TerminalCommandHintEntry } from './terminal-contract-types'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'

/** §8 — подсказки превью/ffprobe (часть 12). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_12: TerminalCommandHintEntry[] = [
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: setsar 4:3 2с',
    summary:
      'Выставление SAR 4:3 setsar=4/3 первых 2 с; дымовая проверка setsar; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf setsar=4/3 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fps 12 3с',
    summary:
      'Прореживание до 12 fps первых 3 с (-vf fps=12); дымовая проверка fps; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fps=12 -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: smartblur 1.5 2с',
    summary:
      'Умное размытие smartblur=luma_radius=1.5:luma_strength=0.35 первых 2 с; дымовая проверка smartblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf smartblur=luma_radius=1.5:luma_strength=0.35 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hqdn3d 3:2 2с',
    summary:
      'Шумодав hqdn3d=3:2:4:3 первых 2 с; дымовая проверка hqdn3d; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hqdn3d=3:2:4:3 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: curves darker 2с',
    summary:
      'Кривые curves=preset=darker первых 2 с; дымовая проверка curves; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf curves=preset=darker -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: colorbalance rs 2с',
    summary:
      'Баланс красного colorbalance=rs=-0.05 первых 2 с; дымовая проверка colorbalance; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf colorbalance=rs=-0.05 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: silenceremove 0.15 6с',
    summary:
      'Удаление ведущей тишины silenceremove=start_periods=1:start_duration=0.15:start_threshold=-48dB:detection=peak первых 6 с; дымовая проверка silenceremove; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af silenceremove=start_periods=1:start_duration=0.15:start_threshold=-48dB:detection=peak:stop_periods=-1 -t 6 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: apulsator tri 3с',
    summary:
      'Стерео-пульсатор apulsator=mode=triangle:hz=0.5:width=3 первых 3 с; дымовая проверка apulsator; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af apulsator=mode=triangle:hz=0.5:width=3 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: flanger delay 3с',
    summary:
      'Флэнжер flanger=delay=2:depth=1 первых 3 с; дымовая проверка flanger; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af flanger=delay=2:depth=1 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: deesser 0.3 3с',
    summary:
      'Де-эссер deesser=i=0.3 первых 3 с; дымовая проверка deesser; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af deesser=i=0.3 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aformat s32 2с',
    summary:
      'Формат сэмпла aformat=sample_fmts=s32 первых 2 с; дымовая проверка aformat; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aformat=sample_fmts=s32 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: acompressor 0.09 3с',
    summary:
      'Компрессор acompressor=threshold=0.09:ratio=2.8:attack=4:release=60 первых 3 с; дымовая проверка acompressor; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acompressor=threshold=0.09:ratio=2.8:attack=4:release=60 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:15 кратко',
    summary:
      'Шестнадцатый видеопоток v:15: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:15 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:16 кратко',
    summary:
      'Семнадцатый поток данных d:16: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:16 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:11 кратко',
    summary:
      'Двенадцатый поток вложений t:11: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:11 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:16 disposition',
    summary:
      'Семнадцатая дорожка субтитров s:16: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:16 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер compilation',
    summary:
      'Флаг сборника в контейнере (поле format_tags=compilation; iTunes compilation); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=compilation -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер replaygain album',
    summary:
      'ReplayGain альбома в контейнере (поле format_tags=replaygain_album_gain); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=replaygain_album_gain -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы tags genre',
    summary:
      'Теги genre у всех глав (-show_chapters -show_entries chapter_tags=genre -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter_tags=genre -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 pkt_pts 5',
    summary:
      'Первые пять кадров v:0: pkt_pts_time (-show_frames -read_intervals %+#5 -show_entries frame=pkt_pts_time); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#5 -show_entries frame=pkt_pts_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
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
    token: '· пакеты v:0 flags 2',
    summary:
      'Первые два пакета v:0: flags (-show_packets -read_intervals %+#2 -show_entries packet=flags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#2 -show_entries packet=flags -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер filename size',
    summary:
      'Поля format: filename и size (поля ffprobe; сверка имени файла и размера); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=filename,size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:7 color prim transfer',
    summary:
      'Восьмой видеопоток v:7: color_primaries и color_transfer (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:7 -show_entries stream=color_primaries,color_transfer -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:1 stream_tags title',
    summary:
      'Вторая дорожка субтитров s:1: stream_tags title (поле stream_tags=title); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream_tags=title -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:15 кратко',
    summary:
      'Шестнадцатая аудиодорожка a:15: кодек и битность (поля codec_name и bits_per_sample); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:15 -show_entries stream=codec_name,bits_per_sample -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:9 side_data_list',
    summary:
      'Десятая аудиодорожка a:9: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:9 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:2 field_order space',
    summary:
      'Третий видеопоток v:2: field_order и color_space (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:2 -show_entries stream=field_order,color_space -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:7 index codec',
    summary:
      'Восьмая дорожка субтитров s:7: индекс и кодек (поля index и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:7 -show_entries stream=index,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:16 кратко',
    summary:
      'Семнадцатая аудиодорожка a:16: кодек и число каналов (поля codec_name и channels); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:16 -show_entries stream=codec_name,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: transpose 2 2с',
    summary:
      'Поворот transpose=2 первых 2 с; дымовая проверка transpose; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf transpose=2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: crop inset 2с',
    summary:
      'Кадрирование crop=20:20:iw-40:ih-40 первых 2 с; дымовая проверка crop; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf crop=20:20:iw-40:ih-40 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: eq gamma 2с',
    summary:
      'Коррекция eq=gamma=1.08:saturation=1.05 первых 2 с; дымовая проверка eq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf eq=gamma=1.08:saturation=1.05 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hue h45 2с',
    summary:
      'Оттенок hue=h=45:s=0.9 первых 2 с; дымовая проверка hue; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=h=45:s=0.9 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: vignette angle 2с',
    summary:
      'Виньетка vignette=PI/4 первых 2 с; дымовая проверка vignette; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf vignette=PI/4 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tblend diff 2с',
    summary:
      'Смежные кадры tblend=all_mode=difference первых 2 с; дымовая проверка tblend; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tblend=all_mode=difference -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fps 24000/1001 3с',
    summary:
      'Частота кадров fps=24000/1001 первых 3 с; дымовая проверка fps; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fps=24000/1001 -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aecho 55ms 3с',
    summary:
      'Эхо aecho=0.65:0.72:55:0.25 первых 3 с; дымовая проверка aecho; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aecho=0.65:0.72:55:0.25 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: crystalizer 1.6 2с',
    summary:
      'Кристаллизатор crystalizer=i=1.6 первых 2 с; дымовая проверка crystalizer; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af crystalizer=i=1.6 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: extrastereo 1.2 2с',
    summary:
      'Расширение стереобазы extrastereo=m=1.2 первых 2 с; дымовая проверка extrastereo; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af extrastereo=m=1.2 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: alimiter 0.92 2с',
    summary:
      'Лимитер alimiter=limit=0.92:attack=2:release=80 первых 2 с; дымовая проверка alimiter; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af alimiter=limit=0.92:attack=2:release=80 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: asetrate 44k 2с',
    summary:
      'Сдвиг частоты дискретизации asetrate=44100*1.01,aresample=44100 первых 2 с; дымовая проверка asetrate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af asetrate=44100*1.01,aresample=44100 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: dynaudnorm f 2с',
    summary:
      'Динамическая нормализация dynaudnorm=f=150:g=15 первых 2 с; дымовая проверка dynaudnorm; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af dynaudnorm=f=150:g=15 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:16 кратко',
    summary:
      'Семнадцатый видеопоток v:16: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:16 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:17 кратко',
    summary:
      'Восемнадцатый поток данных d:17: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:17 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:12 кратко',
    summary:
      'Тринадцатый поток вложений t:12: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:12 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:17 disposition',
    summary:
      'Восемнадцатая дорожка субтитров s:17: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:17 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер show',
    summary:
      'Название шоу в контейнере (поле format_tags=show; сериалы и подкасты); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=show -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер season_number',
    summary:
      'Номер сезона в контейнере (поле format_tags=season_number; медиатеки сериалов); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=season_number -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер episode_id',
    summary:
      'Идентификатор эпизода в контейнере (поле format_tags=episode_id); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=episode_id -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы tags artist',
    summary:
      'Теги artist у всех глав (-show_chapters -show_entries chapter_tags=artist -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter_tags=artist -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 pkt_dts 5',
    summary:
      'Первые пять кадров v:0: pkt_dts_time (-show_frames -read_intervals %+#5 -show_entries frame=pkt_dts_time); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#5 -show_entries frame=pkt_dts_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакеты v:0 pos 2',
    summary:
      'Первые два пакета v:0: pos (-show_packets -read_intervals %+#2 -show_entries packet=pos); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#2 -show_entries packet=pos -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер format long name',
    summary:
      'Человекочитаемое имя контейнера (поле format_long_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=format_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:8 color range transfer',
    summary:
      'Девятый видеопоток v:8: color_range и color_transfer (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:8 -show_entries stream=color_range,color_transfer -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:2 stream_tags lang',
    summary:
      'Третья дорожка субтитров s:2: stream_tags language (поле stream_tags=language); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:2 -show_entries stream_tags=language -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  }
]
