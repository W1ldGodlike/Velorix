import type { TerminalCommandHintEntry } from './terminal-contract-types'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'

/** §8 — подсказки превью/ffprobe (часть 09). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_09: TerminalCommandHintEntry[] = [
  {
    tool: 'ffprobe',
    token: '· кадры v:0 key_frame 5',
    summary:
      'Первые пять кадров первой видеодорожки (v:0): признак ключевого кадра key_frame (-show_frames -read_intervals %+#5); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#5 -show_entries frame=key_frame -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер bit_rate size',
    summary:
      'Поля format: bit_rate и size (поля ffprobe; сверка битрейта и размера файла); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=bit_rate,size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:2 side_data_list',
    summary:
      'Третья аудиодорожка a:2: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:2 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:9 кратко',
    summary:
      'Десятая аудиодорожка a:9: кодек и частота дискретизации (поля codec_name и sample_rate); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:9 -show_entries stream=codec_name,sample_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: minterpolate 3с',
    summary:
      'Интерполяция кадров minterpolate=fps=30:mi_mode=mci первых 3 с; дымовая проверка minterpolate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf minterpolate=fps=30:mi_mode=mci -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: deband 2с',
    summary:
      'Сглаживание полос deband=range=8:blur=16 первых 2 с; дымовая проверка deband; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf deband=range=8:blur=16 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: deflate 2с',
    summary:
      'Морфологическое сжатие deflate первых 2 с; дымовая проверка deflate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf deflate -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: colorlevels 2с',
    summary:
      'Подтяжка уровней colorlevels=rimin=0.02:gimin=0.02:bimin=0.02 первых 2 с; дымовая проверка colorlevels; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf colorlevels=rimin=0.02:gimin=0.02:bimin=0.02 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: unsharp 5x5 2с',
    summary:
      'Резкость unsharp=5:5:0.5:3:3:0.0 первых 2 с; дымовая проверка unsharp; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf unsharp=5:5:0.5:3:3:0.0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: pad even 2с',
    summary:
      'Поля pad до чётных размеров ceil(iw/2)*2 с отступами 12 и чёрной заливкой первых 2 с; дымовая проверка pad; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf pad=ceil(iw/2)*2:ceil(ih/2)*2:12:12:black -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: crop inset 2с',
    summary:
      'Кадрирование с отступами crop=iw-40:ih-30:20:20 первых 2 с; дымовая проверка crop; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf crop=iw-40:ih-30:20:20 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fps 15 3с',
    summary:
      'Прореживание до 15 fps первых 3 с (-vf fps=15); дымовая проверка fps; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fps=15 -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aecho 3с',
    summary:
      'Эхо aecho=0.5:0.55:200:0.2 первых 3 с; дымовая проверка aecho; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aecho=0.5:0.55:200:0.2 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: asetrate 48k 3с',
    summary:
      'Лёгкий resample-питч первых 3 с (-af asetrate=48000*1.03,aresample=48000); дымовая проверка asetrate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af asetrate=48000*1.03,aresample=48000 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:9 кратко',
    summary:
      'Десятый видеопоток v:9: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:9 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:10 кратко',
    summary:
      'Одиннадцатый поток данных d:10: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:10 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:5 кратко',
    summary:
      'Шестой поток вложений t:5: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:5 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:10 disposition',
    summary:
      'Одиннадцатая дорожка субтитров s:10: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:10 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер vendor_id',
    summary:
      'Идентификатор вендора в контейнере (поле format_tags=vendor_id; часто у QuickTime и MOV); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=vendor_id -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер title synopsis',
    summary:
      'Теги контейнера title и synopsis (поля format_tags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=title,synopsis -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы time_base',
    summary:
      'Все главы: time_base (-show_chapters -show_entries chapter=time_base -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter=time_base -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 interlaced 4',
    summary: 'Первые четыре кадра первой видеодорожки (v:0): признак interlaced_frame (-show_frames -read_intervals %+#4); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#4 -show_entries frame=interlaced_frame -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер flags start_time',
    summary:
      'Поля format: flags и start_time (поля ffprobe; сверка флагов контейнера и старта); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=flags,start_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:3 side_data_list',
    summary:
      'Четвёртая аудиодорожка a:3: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:3 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:10 каналы',
    summary:
      'Одиннадцатая аудиодорожка a:10: кодек и число каналов (поля codec_name и channels); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:10 -show_entries stream=codec_name,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакет v:0 dts_time 1',
    summary: 'Первый пакет первой видеодорожки (v:0): dts_time (-show_packets -read_intervals %+#1 -show_entries packet=dts_time); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#1 -show_entries packet=dts_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: inflate 2с',
    summary:
      'Морфологическое расширение inflate первых 2 с; дымовая проверка inflate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf inflate -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: despill 2с',
    summary:
      'Подавление зелёного ореола despill=mix=0.12 первых 2 с; дымовая проверка despill; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf despill=mix=0.12 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: exposure 2с',
    summary:
      'Экспозиция exposure=0.4 первых 2 с; дымовая проверка exposure; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf exposure=0.4 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: vibrance 2с',
    summary:
      'Локальная насыщенность vibrance=intensity=0.08 первых 2 с; дымовая проверка vibrance; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf vibrance=intensity=0.08 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hue s 0.75 2с',
    summary:
      'Повышение насыщенности hue=s=0.75 первых 2 с; дымовая проверка hue; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=s=0.75 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: geq scale lum 2с',
    summary:
      'Линейное ослабление яркости geq=lum=lum(X,Y)*0.95:cb=cb(X,Y):cr=cr(X,Y) первых 2 с; дымовая проверка geq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf geq=lum=lum(X,Y)*0.95:cb=cb(X,Y):cr=cr(X,Y) -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: sab 0.35 2с',
    summary:
      'Сглаживание sab=strength=0.35 первых 2 с; дымовая проверка sab; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf sab=strength=0.35 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: cropdetect 3с',
    summary:
      'Оценка обрезки cropdetect=limit=24:round=16 первых 3 с (чёрные поля в stderr); дымовая проверка cropdetect; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf cropdetect=limit=24:round=16 -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fade in 2с',
    summary:
      'Затемнение на входе fade=t=in:st=0:d=0.5 первых 2 с; дымовая проверка fade; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fade=t=in:st=0:d=0.5 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: acrossover 2k5 3с',
    summary:
      'Кроссовер спектра acrossover=split=2500 первых 3 с; дымовая проверка acrossover; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acrossover=split=2500 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: crystalizer 1.4 3с',
    summary:
      'Кристалайзер crystalizer=i=1.4 первых 3 с; дымовая проверка crystalizer; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af crystalizer=i=1.4 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: acrusher 6bit 3с',
    summary:
      'Бит-круш acrusher=bits=6:mode=log первых 3 с; дымовая проверка acrusher; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acrusher=bits=6:mode=log -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:10 кратко',
    summary:
      'Одиннадцатый видеопоток v:10: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:10 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:11 кратко',
    summary:
      'Двенадцатый поток данных d:11: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:11 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:6 кратко',
    summary:
      'Седьмой поток вложений t:6: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:6 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:11 disposition',
    summary:
      'Двенадцатая дорожка субтитров s:11: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:11 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер sort_title',
    summary:
      'Сортировочный заголовок в контейнере (поле format_tags=sort_title; каталоги и плейлисты); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=sort_title -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер genre sort_album',
    summary:
      'Теги контейнера genre и sort_album (поля format_tags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=genre,sort_album -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы id time_base',
    summary:
      'Все главы: id и time_base (-show_chapters -show_entries chapter=id,time_base -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter=id,time_base -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 pkt_size 3',
    summary: 'Первые три кадра первой видеодорожки (v:0): размер пакета pkt_size (-show_frames -read_intervals %+#3); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#3 -show_entries frame=pkt_size -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер duration start_time',
    summary:
      'Поля format: duration и start_time (поля ffprobe; сверка длительности и старта); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=duration,start_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:4 side_data_list',
    summary:
      'Пятая аудиодорожка a:4: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:4 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:3 кратко',
    summary:
      'Четвёртый видеопоток v:3: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:3 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:4 time_base',
    summary:
      'Пятая дорожка субтитров s:4: codec_time_base и time_base (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:4 -show_entries stream=codec_time_base,time_base -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакет v:0 pts_time 1',
    summary: 'Первый пакет первой видеодорожки (v:0): pts_time (-show_packets -read_intervals %+#1 -show_entries packet=pts_time); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#1 -show_entries packet=pts_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fspp 2с',
    summary:
      'Сглаживание fspp=4 первых 2 с; дымовая проверка fspp; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fspp=4 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: spp 2с',
    summary:
      'Сглаживание spp=5 первых 2 с; дымовая проверка spp; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf spp=5 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rgbashift 2с',
    summary:
      'Сдвиг RGB-каналов rgbashift=rh=2:gh=-1 первых 2 с; дымовая проверка rgbashift; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf rgbashift=rh=2:gh=-1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hqdn3d alt 2с',
    summary:
      'Шумоподавление hqdn3d=4:2:3:4 первых 2 с; дымовая проверка hqdn3d; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hqdn3d=4:2:3:4 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: xbr 2с',
    summary:
      'Масштабирование xbr=n=2 первых 2 с; дымовая проверка xbr; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf xbr=n=2 -t 2 -an -sn -f null -`
  }
]
