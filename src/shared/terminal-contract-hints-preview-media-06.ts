import type { TerminalCommandHintEntry } from './terminal-contract-types'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'

/** §8 — подсказки превью/ffprobe (часть 6/8; §8 audit prune). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_06: TerminalCommandHintEntry[] = [
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: removegrain 2с',
    summary:
      'Пространственное сглаживание removegrain=m0=c2 первых 2 с; дымовая проверка removegrain; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf removegrain=m0=c2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: pp al 2с',
    summary:
      'Лёгкая постобработка pp=al первых 2 с; дымовая проверка фильтра pp; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf pp=al -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: dedot mix2 2с',
    summary:
      'Подавление точек dedot=spatial_mix=2 первых 2 с; дымовая проверка dedot; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf dedot=spatial_mix=2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: owdenoise 2с',
    summary:
      'Вейвлет-шумодав owdenoise первых 2 с (-vf owdenoise=6.0); дымовая проверка owdenoise; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf owdenoise=6.0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: estdif 2с',
    summary:
      'Деинтерлейс estdif первых 2 с; дымовая проверка estdif; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf estdif -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: w3fdif 2с',
    summary:
      'Деинтерлейс w3fdif первых 2 с; дымовая проверка w3fdif; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf w3fdif -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: kerndeint 8 2с',
    summary:
      'Деинтерлейс kerndeint=thresh=8 первых 2 с; дымовая проверка kerndeint; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf kerndeint=thresh=8 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale flags neighbor 2с',
    summary:
      'Масштаб соседним пикселем flags=neighbor первых 2 с (-vf scale=320:240:flags=neighbor); дымовая проверка алгоритма scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=320:240:flags=neighbor -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: format yuv420p 2с',
    summary:
      'Принудительный формат пикселей yuv420p первых 2 с (-vf format=yuv420p); дымовая проверка format; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf format=yuv420p -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: stereo3d anaglyph 2с',
    summary:
      'Анаглиф red/cyan через stereo3d первых 2 с (in_sbsl:out_anaglyph); дымовая проверка stereo3d без кавычек в argv; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf stereo3d=sbsl:anaglyph_red_cyan -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: paletteuse dummy 1с',
    summary:
      'Квантование через palettegen+paletteuse первой секунды (256 цветов, однопроходный гиф-подобный путь); дымовая проверка palette*; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf palettegen=max_colors=128:reserve_transparent=0,paletteuse -t 1 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:3 codec_name',
    summary:
      'Четвёртая дорожка субтитров s:3: только codec_name (поле ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:3 -show_entries stream=codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 первые 10 pict_type',
    summary:
      'Типы кадров I/B/P первых 10 кадров первой видеодорожки (v:0) (-show_frames, поле pict_type, -read_intervals %+#10); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -show_entries frame=pict_type -read_intervals %+#10 -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер tags=encoder,major_brand',
    summary:
      'Два тега контейнера encoder и major_brand (поля format_tags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoder,major_brand -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: histeq 2с',
    summary:
      'Адаптивная эквализация гистограммы histeq первых 2 с; дымовая проверка histeq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf histeq -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: deflicker b2 2с',
    summary:
      'Подавление мерцания deflicker=b=2 первых 2 с; дымовая проверка deflicker; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf deflicker=b=2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lagfun 2с',
    summary:
      'Шлейф кадров lagfun первых 2 с (-vf lagfun=decay=0.92); дымовая проверка lagfun; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf lagfun=decay=0.92 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: noise 2с',
    summary:
      'Псевдослучайный шум noise первых 2 с (-vf noise=alls=8:allf=t); дымовая проверка noise; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf noise=alls=8:allf=t -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: shufflepixels 2с',
    summary:
      'Перемешивание блоков shufflepixels первых 2 с (56×56, 3 кадра); дымовая проверка shufflepixels; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf shufflepixels=56:56:3 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lenscorrection 2с',
    summary:
      'Лёгкая коррекция дисторсии lenscorrection первых 2 с (k1=-0.01,k2=-0.01); дымовая проверка lenscorrection; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf lenscorrection=cx=0.5:cy=0.5:k1=-0.01:k2=-0.01 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fps=24000/1001 явно 2с',
    summary:
      'Явные 24000/1001 fps на выходе первых 2 с (-vf fps=24000/1001); дымовая проверка дробного fps; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fps=24000/1001 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tinterlace merge 2с',
    summary:
      'Чересстрочное слияние tinterlace=merge + fieldorder=tff первых 2 с; дымовая проверка tinterlace; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tinterlace=merge,fieldorder=tff -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: pseudocolor 2с',
    summary:
      'Псевдоцветовая карта pseudocolor preset=rainbow первых 2 с; дымовая проверка pseudocolor; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf pseudocolor=preset=rainbow -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: colorhold 2с',
    summary:
      'Удержание узкого цветового диапазона colorhold первых 2 с (similarity=0.15); дымовая проверка colorhold; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf colorhold=similarity=0.15 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:5 codec_name',
    summary:
      'Шестой видеопоток v:5: codec_name (поле ffprobe; редкие мультиракурсные контейнеры); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:5 -show_entries stream=codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· дорожка данных d:6',
    summary:
      'Седьмая data-дорожка d:6: codec_tag_string (поле ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:6 -show_entries stream=codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы id и старт',
    summary:
      'Все главы: id и start_time (-show_chapters -show_entries chapter=id,start_time -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter=id,start_time -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 sample_aspect_ratio',
    summary:
      'Первая аудиодорожка (a:0): sample_aspect_ratio (поле ffprobe: формальный SAR у аудио, часто N/A); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=sample_aspect_ratio -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: bwdif 2с',
    summary:
      'Деинтерлейс bwdif=mode=send_field первых 2 с; дымовая проверка bwdif; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf bwdif=mode=send_field -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: il filter 2с',
    summary:
      'Чередование полей через il=d:c первых 2 с; дымовая проверка фильтра il; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf il=d:c -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: colormatrix 601→709 2с',
    summary:
      'Матрица цветов colormatrix=bt601:bt709 первых 2 с; дымовая проверка colormatrix; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf colormatrix=bt601:bt709 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: smartblur 2с',
    summary:
      'Умное размытие smartblur первых 2 с (-vf smartblur=luma_radius=1.2:luma_strength=0.4); дымовая проверка smartblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf smartblur=luma_radius=1.2:luma_strength=0.4 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: chromakey зелёный 2с',
    summary:
      'Ключ по зелёному chromakey первых 2 с (color=0x00ff00:similarity=0.02:blend=0.05); дымовая проверка chromakey; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf chromakey=color=0x00ff00:similarity=0.02:blend=0.05 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: yadif send_field 2с',
    summary:
      'Деинтерлейс yadif=1:-1:0 (режим send_field) первых 2 с; дымовая проверка числовых опций yadif; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf yadif=1:-1:0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: phase A 2с',
    summary:
      'Коррекция фазы chroma phase=A первых 2 с (-vf phase=A); дымовая проверка phase; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf phase=A -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lumakey 2с',
    summary:
      'Ключ по яркости lumakey первых 2 с (threshold=0.08); дымовая проверка lumakey; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf lumakey=threshold=0.08:tolerance=0.02 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: limiter 2с',
    summary:
      'Ограничитель яркости limiter первых 2 с (16-235); дымовая проверка limiter; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf limiter=16:235 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: colorbalance rgb 2с',
    summary:
      'Сдвиг баланса RGB через colorbalance первых 2 с (rs=0.08 gs=-0.02 bs=0.05); дымовая проверка colorbalance; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf colorbalance=rs=0.08:gs=-0.02:bs=0.05 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 codec_tag',
    summary:
      'Первая видеодорожка (v:0): codec_tag (поле ffprobe: числовой тег кодека вместе с codec_tag_string); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=codec_tag -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы end_time',
    summary:
      'Все главы: end_time (-show_chapters -show_entries chapter=end_time -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter=end_time -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 channels',
    summary:
      'Вторая аудиодорожка a:1: только channels (поле ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 bt601 709 цвет',
    summary:
      'Первая видеодорожка (v:0): color_space, color_transfer и color_primaries одной строкой (поля ffprobe; сводка HDR/SDR); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=color_space,color_transfer,color_primaries -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale divisible 2с',
    summary:
      'Масштаб с force_divisible_by=2 первых 2 с (-vf scale=w=320:h=240:force_divisible_by=2); дымовая проверка выравнивания размеров; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=w=320:h=240:force_divisible_by=2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: colorspace fast 2с',
    summary:
      'Перевод цветового пространства colorspace=iall=bt601:all=bt709:fast=1 первых 2 с; дымовая проверка colorspace; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf colorspace=iall=bt601:all=bt709:fast=1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: framestep 2с',
    summary:
      'Прореживание кадров framestep=2 первых 4 с; дымовая проверка framestep; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf framestep=2 -t 4 -an -sn -f null -`
  },
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
    token: '· видео v:3 кратко',
    summary:
      'Четвёртый видеопоток v:3: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:3 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
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
    token: '· субтитры s:10 disposition',
    summary:
      'Одиннадцатая дорожка субтитров s:10: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:10 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
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
    summary:
      'Первые три кадра первой видеодорожки (v:0): длительность пакета pkt_duration_time (-show_frames -read_intervals %+#3); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#3 -show_entries frame=pkt_duration_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fftdnoiz 2с',
    summary:
      'Шумоподавление fftdnoiz=sigma=2 первых 2 с; дымовая проверка fftdnoiz; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fftdnoiz=sigma=2 -t 2 -an -sn -f null -`
  }
]
