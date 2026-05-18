import type { TerminalCommandHintEntry } from './terminal-contract-types'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'

/** §8 — подсказки превью/ffprobe (часть 07). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_07: TerminalCommandHintEntry[] = [
  {
    tool: 'ffprobe',
    token: '· контейнер format_tags=sort_album',
    summary:
      'Только тег sort_album контейнера (поле format_tags: сортировочное имя альбома); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=sort_album -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер format_name и flags',
    summary:
      'Контейнер: format_name и flags (поля format: имя и флаги демультиплексора); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=format_name,flags -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:2 start_time',
    summary:
      'Третья дорожка субтитров s:2: start_time дорожки (поле ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:2 -show_entries stream=start_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:3 index codec',
    summary:
      'Четвёртая аудиодорожка a:3: index и codec_name (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:3 -show_entries stream=index,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: nlmeans 2с',
    summary:
      'Нелокальное среднее nlmeans=s=4 первых 2 с; дымовая проверка тяжёлого шумоподавления; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf nlmeans=s=4 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: atadenoise 2с',
    summary:
      'Временной шумодав atadenoise первых 2 с (-vf atadenoise=0.01:0.01); дымовая проверка atadenoise; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf atadenoise=0.01:0.01 -t 2 -an -sn -f null -`
  },
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
    token: '· ffmpeg: dedot 2с',
    summary:
      'Подавление цветовых точек dedot первых 2 с (-vf dedot=spatial_mix=4); дымовая проверка dedot; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf dedot=spatial_mix=4 -t 2 -an -sn -f null -`
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
    token: '· ffmpeg: kerndeint 2с',
    summary:
      'Деинтерлейс kerndeint=thresh=12 первых 2 с; дымовая проверка kerndeint; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf kerndeint=thresh=12 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: transpose=3 на 1с',
    summary:
      'Поворот transpose=3 (90° по часовой) первую секунду; дымовая проверка transpose; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf transpose=3 -t 1 -an -sn -f null -`
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
    token: '· дорожка данных d:5',
    summary:
      'Шестая data-дорожка d:5: codec_name (поле ffprobe; редкие контейнеры с множеством data); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:5 -show_entries stream=codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:7 index',
    summary:
      'Восьмая аудиодорожка a:7: index (поле ffprobe; редкие мультипотоковые релизы); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:7 -show_entries stream=index -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
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
    token: '· ffmpeg: deflicker 3с',
    summary:
      'Подавление мерцания deflicker первых 3 с (-vf deflicker=b=1); дымовая проверка deflicker; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf deflicker=b=1 -t 3 -an -sn -f null -`
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
    token: '· субтитры s:4 start_pts',
    summary:
      'Пятая дорожка субтитров s:4: start_pts (поле ffprobe: смещение таймкодов субтитров); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:4 -show_entries stream=start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
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
    token: '· субтитры s:5 start_time',
    summary:
      'Шестая дорожка субтитров s:5: start_time (поле ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:5 -show_entries stream=start_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
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
  }
]
