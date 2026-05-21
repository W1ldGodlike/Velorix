import type { TerminalCommandHintEntry } from './terminal-contract-types'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'

/** §8 — подсказки превью/ffprobe (часть 7/8; §8 audit prune). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_07: TerminalCommandHintEntry[] = [
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: bitplanenoise 2с',
    summary:
      'Визуализация битовых плоскостей bitplanenoise=1 первых 2 с; дымовая проверка bitplanenoise; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf bitplanenoise=1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: extractplanes u 2с',
    summary:
      'Извлечь плоскость U через extractplanes=u первых 2 с; дымовая проверка extractplanes; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf extractplanes=u -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: extractplanes v 2с',
    summary:
      'Извлечь плоскость V через extractplanes=v первых 2 с; дымовая проверка extractplanes; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf extractplanes=v -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: setpts startpts 2с',
    summary:
      'Сброс отсчёта времени setpts=PTS-STARTPTS первых 2 с; дымовая проверка setpts; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf setpts=PTS-STARTPTS -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: drawbox 2с',
    summary:
      'Полупрозрачный прямоугольник drawbox первых 2 с; дымовая проверка drawbox; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf drawbox=x=8:y=8:w=80:h=60:color=yellow@0.35 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hue h s 2с',
    summary:
      'Сдвиг оттенка и насыщенности hue=h=0.15:s=0.92 первых 2 с; дымовая проверка hue; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=h=0.15:s=0.92 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: volume 0.7 на 2с',
    summary:
      'Линейная громкость volume=0.7 первых 2 с (-af); дымовая проверка volume; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volume=0.7 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер тег mood',
    summary:
      'Тег настроения в контейнере (поле format_tags=mood; каталогизация и плейлисты); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=mood -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы start_time',
    summary:
      'Все главы: start_time (-show_chapters -show_entries chapter=start_time -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter=start_time -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 pkt_pos 2',
    summary:
      'Первые два кадра первой видеодорожки (v:0): смещение пакета pkt_pos (-show_frames -read_intervals %+#2); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#2 -show_entries frame=pkt_pos -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер start_time_real duration',
    summary:
      'Поля format: start_time_real и duration (поля ffprobe; сверка времени контейнера); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=start_time_real,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:8 битрейт',
    summary:
      'Девятая аудиодорожка a:8: кодек и битрейт (поля codec_name и bit_rate); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:8 -show_entries stream=codec_name,bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: blackframe 5с',
    summary:
      'Поиск чёрных кадров blackframe первых 5 с; дымовая проверка blackframe; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf blackframe=amount=99:threshold=16 -t 5 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scdet 4с',
    summary:
      'Детектор смены сцены scdet=s=1 первых 4 с; дымовая проверка scdet; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scdet=s=1 -t 4 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: vaguedenoiser 2с',
    summary:
      'Сглаживание vaguedenoiser=threshold=2 первых 2 с; дымовая проверка vaguedenoiser; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf vaguedenoiser=threshold=2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: chromashift 2с',
    summary:
      'Сдвиг цветности chromashift=h=3:v=1 первых 2 с; дымовая проверка chromashift; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf chromashift=h=3:v=1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale decrease 2с',
    summary:
      'Масштаб с сохранением пропорций force_original_aspect_ratio=decrease до 640×360 первых 2 с; дымовая проверка scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=w=640:h=360:force_original_aspect_ratio=decrease -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tblend multiply 2с',
    summary:
      'Темпоральное смешение tblend=all_mode=multiply первых 2 с; дымовая проверка tblend; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tblend=all_mode=multiply -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: firequalizer -4 3с',
    summary:
      'Лёгкое частотное ослабление firequalizer=gain=-4 первых 3 с; дымовая проверка firequalizer; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af firequalizer=gain=-4 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: geq offset 2с',
    summary:
      'Арифметика яркости geq=lum=lum(X,Y)+8:cb=128:cr=128 первых 2 с; дымовая проверка geq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf geq=lum=lum(X,Y)+8:cb=128:cr=128 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер title comment',
    summary:
      'Теги контейнера title и comment (поля format_tags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=title,comment -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер encoder_version',
    summary:
      'Версия кодировщика в контейнере (поле format_tags=encoder_version; сверка сборки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoder_version -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы id end_time',
    summary:
      'Все главы: id и end_time (-show_chapters -show_entries chapter=id,end_time -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter=id,end_time -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
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
    summary:
      'Первые четыре кадра первой видеодорожки (v:0): признак interlaced_frame (-show_frames -read_intervals %+#4); путь к медиа подставляется из превью.',
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
    token: '· аудио a:10 каналы',
    summary:
      'Одиннадцатая аудиодорожка a:10: кодек и число каналов (поля codec_name и channels); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:10 -show_entries stream=codec_name,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакет v:0 dts_time 1',
    summary:
      'Первый пакет первой видеодорожки (v:0): dts_time (-show_packets -read_intervals %+#1 -show_entries packet=dts_time); путь к медиа подставляется из превью.',
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
    token: '· ffmpeg: geq scale lum 2с',
    summary:
      'Линейное ослабление яркости geq=lum=lum(X,Y)*0.95:cb=cb(X,Y):cr=cr(X,Y) первых 2 с; дымовая проверка geq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf geq=lum=lum(X,Y)*0.95:cb=cb(X,Y):cr=cr(X,Y) -t 2 -an -sn -f null -`
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
    token: '· ffmpeg: acrusher 6bit 3с',
    summary:
      'Бит-круш acrusher=bits=6:mode=log первых 3 с; дымовая проверка acrusher; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acrusher=bits=6:mode=log -t 3 -vn -sn -f null -`
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
    summary:
      'Первые три кадра первой видеодорожки (v:0): размер пакета pkt_size (-show_frames -read_intervals %+#3); путь к медиа подставляется из превью.',
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
    token: '· пакет v:0 pts_time 1',
    summary:
      'Первый пакет первой видеодорожки (v:0): pts_time (-show_packets -read_intervals %+#1 -show_entries packet=pts_time); путь к медиа подставляется из превью.',
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
    token: '· ffmpeg: xbr 2с',
    summary:
      'Масштабирование xbr=n=2 первых 2 с; дымовая проверка xbr; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf xbr=n=2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fade out 2с',
    summary:
      'Затемнение на выходе fade=t=out:st=0:d=0.5 первых 2 с; дымовая проверка fade; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fade=t=out:st=0:d=0.5 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер grouping',
    summary:
      'Тег группировки в контейнере (поле format_tags=grouping; iTunes и каталоги); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=grouping -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер initial_key',
    summary:
      'Тональность initial_key в контейнере (поле format_tags; музыкальные метаданные); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=initial_key -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер BPM encoder',
    summary:
      'Теги контейнера BPM и encoder (поля format_tags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=BPM,encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  }
]
