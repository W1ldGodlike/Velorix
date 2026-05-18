import type { TerminalCommandHintEntry } from './terminal-contract-types'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'

/** §8 — подсказки превью/ffprobe (часть 08). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_08: TerminalCommandHintEntry[] = [
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tmideint bob 2с',
    summary:
      'Деинтерлейс tmideint=mode=bob первых 2 с; дымовая проверка tmideint; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tmideint=mode=bob -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: erosion 2с',
    summary:
      'Морфологическое сужение erosion первых 2 с; дымовая проверка erosion; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf erosion -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: dilation 2с',
    summary:
      'Морфологическое расширение dilation первых 2 с; дымовая проверка dilation; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf dilation -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: shuffleplanes 2:1:0',
    summary:
      'Перестановка плоскостей shuffleplanes=2:1:0 первых 2 с; дымовая проверка shuffleplanes; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf shuffleplanes=2:1:0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: decimate cycle 12',
    summary:
      'Прореживание decimate=cycle=12 первых 6 с; дымовая проверка decimate с циклом; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf decimate=cycle=12 -t 6 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale bicubic full chroma 2с',
    summary:
      'Масштаб bicubic с full_chroma_inp первых 2 с (-vf scale=flags=bicubic+full_chroma_inp:interl=0); дымовая проверка scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=w=iw:h=ih:flags=bicubic+full_chroma_inp:interl=0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: avgblur 2с',
    summary:
      'Размытие avgblur 3×3 первых 2 с (-vf avgblur=3:1); дымовая проверка avgblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf avgblur=3:1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер тег album',
    summary: 'Тег контейнера album (поле format_tags=album); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=album -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер musicbrainz_trackid',
    summary:
      'Идентификатор трека MusicBrainz в контейнере (поле format_tags=musicbrainz_trackid); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=musicbrainz_trackid -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:6 кратко',
    summary:
      'Седьмой видеопоток v:6: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:6 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:7 кратко',
    summary:
      'Восьмой поток данных d:7: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:7 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:2 кратко',
    summary:
      'Третий поток вложений t:2: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:2 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:7 disposition',
    summary:
      'Восьмая дорожка субтитров s:7: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:7 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы теги title',
    summary:
      'Теги title у всех глав (-show_chapters -show_entries chapter_tags=title -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter_tags=title -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 pkt_duration_time 3',
    summary: 'Первые три кадра первой видеодорожки (v:0): длительность пакета pkt_duration_time (-show_frames -read_intervals %+#3); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#3 -show_entries frame=pkt_duration_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fftdnoiz 2с',
    summary:
      'Шумоподавление fftdnoiz=sigma=2 первых 2 с; дымовая проверка fftdnoiz; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fftdnoiz=sigma=2 -t 2 -an -sn -f null -`
  },
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
    token: '· ffmpeg: format yuv444p 2с',
    summary:
      'Перевод в yuv444p через format=yuv444p первых 2 с; дымовая проверка format; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf format=yuv444p -t 2 -an -sn -f null -`
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
    token: '· ffmpeg: transpose=1 на 1с',
    summary:
      'Поворот transpose=1 (отражение по главной диагонали) первую секунду; дымовая проверка transpose; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf transpose=1 -t 1 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: volume 0.7 на 2с',
    summary:
      'Линейная громкость volume=0.7 первых 2 с (-af); дымовая проверка volume; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volume=0.7 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: bass g5 f100 4с',
    summary:
      'НЧ-акцент bass=g=5:f=100 первых 4 с; дымовая проверка bass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af bass=g=5:f=100 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: highpass 140 3с',
    summary:
      'ВЧ-срез highpass=f=140 первых 3 с; дымовая проверка highpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af highpass=f=140 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: atempo 1.08 3с',
    summary:
      'Ускорение темпа atempo=1.08 первых 3 с; дымовая проверка atempo; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af atempo=1.08 -t 3 -vn -sn -f null -`
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
    token: '· видео v:7 кратко',
    summary:
      'Восьмой видеопоток v:7: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:7 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:8 кратко',
    summary:
      'Девятый поток данных d:8: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:8 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:3 кратко',
    summary:
      'Четвёртый поток вложений t:3: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:3 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:8 disposition',
    summary:
      'Девятая дорожка субтитров s:8: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:8 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
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
    summary: 'Первые два кадра первой видеодорожки (v:0): смещение пакета pkt_pos (-show_frames -read_intervals %+#2); путь к медиа подставляется из превью.',
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
    token: '· аудио a:1 side_data_list',
    summary:
      'Вторая аудиодорожка a:1: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
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
    token: '· ffmpeg: stereotools mlev 3с',
    summary:
      'Стерео-коррекция stereotools=mlev=0.1:phlev=0.02 первых 3 с; дымовая проверка stereotools; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af stereotools=mlev=0.1:phlev=0.02 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: alimiter 0.9 2с',
    summary:
      'Лимитер пиков alimiter=limit=0.9 первых 2 с; дымовая проверка alimiter; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af alimiter=limit=0.9 -t 2 -vn -sn -f null -`
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
    token: '· видео v:8 кратко',
    summary:
      'Девятый видеопоток v:8: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:8 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:9 кратко',
    summary:
      'Десятый поток данных d:9: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:9 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:4 кратко',
    summary:
      'Пятый поток вложений t:4: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:4 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:9 disposition',
    summary:
      'Десятая дорожка субтитров s:9: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:9 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:1 field_order color_range',
    summary:
      'Второй видеопоток v:1: field_order и color_range (поля ffprobe; интерлейс и диапазон); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:1 -show_entries stream=field_order,color_range -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы id end_time',
    summary:
      'Все главы: id и end_time (-show_chapters -show_entries chapter=id,end_time -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter=id,end_time -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  }
]
