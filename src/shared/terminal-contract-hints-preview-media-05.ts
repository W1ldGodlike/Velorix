import type { TerminalCommandHintEntry } from './terminal-contract-types'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'

/** §8 — подсказки превью/ffprobe (часть 5/8; §8 audit prune). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_05: TerminalCommandHintEntry[] = [
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: transpose=0 на 1с',
    summary:
      'Поворот transpose=0 на 90° против часовой первую секунду; дымовая проверка transpose; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf transpose=0 -t 1 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: кроп от краёв 2с',
    summary:
      'Обрезка 32 px с каждой стороны первых 2 с (-vf crop=iw-32:ih-32:16:16); дымовая проверка crop; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf crop=iw-32:ih-32:16:16 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: setsar=1 на 2с',
    summary:
      'Нормализация SAR 1:1 первых 2 с (-vf setsar=1); дымовая проверка метаданных соотношения сторон; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf setsar=1 -t 2 -an -sn -f null -`
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
    token: '· ffmpeg: масштаб iw/2 на 2с',
    summary:
      'Уменьшение ширины вдвёое (-vf scale=iw/2:-2) первых 2 с; дымовая проверка scale с выражениями iw/ih; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=iw/2:-2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: смесь стерео в mono 3с',
    summary:
      'Сведение стерео в моно через pan первых 3 с (pan=mono|c0=0.5*c0+0.5*c1); дымовая проверка pan; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af pan=mono|c0=0.5*c0+0.5*c1 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aformat 48 kHz stereo 3с',
    summary:
      'Приведение аудио к 48 kHz stereo через aformat первых 3 с; дымовая проверка ограничений формата; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aformat=sample_rates=48000:channel_layouts=stereo -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tblend среднее 2с',
    summary:
      'Усреднение соседних кадров tblend=all_mode=average первых 2 с; дымовая проверка темпорального фильтра; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tblend=all_mode=average -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: mpdecimate 6с',
    summary:
      'Прореживание почти дубликатов кадров mpdecimate первых 6 с; дымовая проверка детектора статики; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf mpdecimate -t 6 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: silenceremove rms 10с',
    summary:
      'Удаление ведущей тишины по RMS первых 10 с (silenceremove с detection=rms и порогом -55 dB); дымовая проверка отличия от peak; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af silenceremove=start_periods=1:start_duration=0.25:start_threshold=-55dB:detection=rms:stop_periods=-1 -t 10 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: yadif 3с',
    summary:
      'Деинтерлейс yadif=0:0:0 первых 3 с; дымовая проверка чересстрочного фильтра; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf yadif=0:0:0 -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: eq яркость 2с',
    summary:
      'Лёгкая коррекция яркости через eq первых 2 с (brightness=0.04 contrast=1.02); дымовая проверка eq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf eq=brightness=0.04:contrast=1.02 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: map v:0 null 2с',
    summary:
      'Декод только первой видеодорожки (-map 0:v:0 — индекс в команде) первых 2 с в null; дымовая проверка -map индекса; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -map 0:v:0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 только color_primaries',
    summary:
      'Первая видеодорожка (v:0): только color_primaries (поле ffprobe: первичные цвета дисплея); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=color_primaries -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 только color_space',
    summary:
      'Первая видеодорожка (v:0): только color_space (поле ffprobe: цветовое пространство bt709 и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=color_space -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 duration_ts',
    summary:
      'Первая видеодорожка (v:0): длительность в тиках time_base (поле ffprobe duration_ts; сверка с duration в секундах); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=duration_ts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 pix_fmt и profile',
    summary:
      'Первая видеодорожка (v:0): pix_fmt и profile (поля ffprobe: формат пикселей и профиль кодека); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=pix_fmt,profile -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: time_base',
    summary:
      'Контейнер: format time_base (поле format.time_base — база времени контейнера); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=time_base -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 max_bit_rate',
    summary:
      'Первая аудиодорожка (a:0): max_bit_rate (поле ffprobe: пиковый битрейт при VBR, если задан); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=max_bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: map a:0 null 2с',
    summary:
      'Декод только первой аудиодорожки (-map 0:a:0 — индекс в команде) первых 2 с в null; дымовая проверка -map аудио; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -map 0:a:0 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: boxblur 2с',
    summary:
      'Лёгкое размытие boxblur первых 2 с (-vf boxblur=2:1); дымовая проверка пространственного фильтра; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf boxblur=2:1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: gblur 2с',
    summary:
      'Гауссово размытие gblur первых 2 с (-vf gblur=sigma=1.2); дымовая проверка gblur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf gblur=sigma=1.2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: edgedetect 2с',
    summary:
      'Контуры edgedetect первых 2 с (-vf edgedetect=low=0.1:high=0.3); дымовая проверка высокочастотного фильтра; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf edgedetect=low=0.1:high=0.3 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: vignette 2с',
    summary:
      'Лёгкое затемнение по краям vignette первых 2 с (-vf vignette=PI/5); дымовая проверка vignette; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf vignette=PI/5 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: colorbalance 2с',
    summary:
      'Лёгкий сдвиг баланса белого colorbalance первых 2 с (rs=0.06); дымовая проверка цветокоррекции; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf colorbalance=rs=0.06 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: negate 2с',
    summary:
      'Инверсия яркости negate первых 2 с (-vf negate); дымовая проверка точечного видеофильтра; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf negate -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hue сдвиг 2с',
    summary:
      'Сдвиг оттенка hue=h=0.08 первых 2 с; дымовая проверка hue; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=h=0.08 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: gradfun 2с',
    summary:
      'Сглаживание бэнда gradfun первых 2 с (-vf gradfun=strength=0.9); дымовая проверка gradfun; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf gradfun=strength=0.9 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: dctdnoiz 2с',
    summary:
      'Лёгкое шумоподавление dctdnoiz первых 2 с (-vf dctdnoiz=s=4); дымовая проверка DCT-денойзера; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf dctdnoiz=s=4 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: weave 1с',
    summary:
      'Чересстрочное переплетение полей weave первую секунду (-vf weave); дымовая проверка weave; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf weave -t 1 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fieldorder tff 2с',
    summary:
      'Указание порядка полей fieldorder=tff первых 2 с; дымовая проверка метаданных чересстрочности; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fieldorder=tff -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tpad хвост 2с',
    summary:
      'Короткая подкладка кадров в хвост через tpad первых 2 с (stop_mode=add, stop_duration=0.08); дымовая проверка tpad; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tpad=stop_mode=add:stop_duration=0.08 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: sab 2с',
    summary:
      'Лёгкое сглаживание sab первых 2 с (-vf sab=strength=0.2); дымовая проверка shape adaptive blur; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf sab=strength=0.2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: shuffleplanes 2с',
    summary:
      'Перестановка цветовых плоскостей shuffleplanes первых 2 с (map0g=1:map1g=0:map2g=2); дымовая проверка shuffleplanes без кавычек в argv; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf shuffleplanes=map0g=1:map1g=0:map2g=2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: extractplanes y 2с',
    summary:
      'Извлечь только плоскость Y через extractplanes=y первых 2 с; дымовая проверка планарного разбора; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf extractplanes=y -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: swapuv 2с',
    summary:
      'Обмен цветоразностных каналов swapuv первых 2 с; дымовая проверка цвета без перекодирования в файл; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf swapuv -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 start_pts',
    summary:
      'Первая видеодорожка (v:0): только start_pts (поле ffprobe: первая метка времени видео в тиках time_base); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:0 index',
    summary:
      'Первая аудиодорожка (a:0): только index (поле ffprobe: порядковый индекс дорожки в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=index -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· тег comment (контейнер)',
    summary:
      'Тег контейнера comment (поле format_tags: длинный комментарий, если записан); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=comment -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· тег replaygain_track_gain',
    summary:
      'Тег контейнера REPLAYGAIN_TRACK_GAIN (поле format_tags: нормализация громкости ReplayGain); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=REPLAYGAIN_TRACK_GAIN -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 color_range',
    summary:
      'Первая видеодорожка (v:0): только color_range (поле ffprobe: tv или pc и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=color_range -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hflip 2с',
    summary:
      'Горизонтальное отражение hflip первых 2 с; дымовая проверка геометрии; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hflip -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: vflip 2с',
    summary:
      'Вертикальное отражение vflip первых 2 с; дымовая проверка геометрии; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf vflip -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: deshake 3с',
    summary:
      'Стабилизация deshake первых 3 с; дымовая проверка motion compensation; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf deshake -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: median 2с',
    summary:
      'Медианное шумоподавление median=3 первых 2 с; дымовая проверка spatial median; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf median=3 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: decimate 5с',
    summary:
      'Прореживание дубликатов decimate первых 5 с; дымовая проверка decimate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf decimate -t 5 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: pullup 4с',
    summary:
      'Инверсия телесинка pullup первых 4 с; дымовая проверка pullup; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf pullup -t 4 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fps=film=24',
    summary:
      'Приведение к киношным 24 fps через fps=film=24 первых 3 с; дымовая проверка fps=film; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fps=film=24 -t 3 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: tmix 2с',
    summary:
      'Усреднение соседних кадров tmix=frames=3 первых 2 с; дымовая проверка tmix; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf tmix=frames=3 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: curves lighter 2с',
    summary:
      'Пресет curves=preset=lighter первых 2 с; дымовая проверка curves; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf curves=preset=lighter -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: colorchannelmixer 2с',
    summary:
      'Лёгкий микс каналов colorchannelmixer первых 2 с (rr=0.95:bb=1.05); дымовая проверка матрицы RGB; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf colorchannelmixer=rr=0.95:bb=1.05 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rotate 2° 2с',
    summary:
      'Поворот на ~2° через rotate=2*PI/180 первых 2 с; дымовая проверка rotate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf rotate=2*PI/180 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: yadif send_frame 2с',
    summary:
      'Деинтерлейс yadif=send_frame первых 2 с; дымовая проверка режима send_frame; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf yadif=mode=send_frame -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 field_order',
    summary:
      'Первая видеодорожка (v:0): только field_order (поле ffprobe: чересстрочность tff/bff/progressive); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=field_order -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:2 handler_name',
    summary:
      'Третья аудиодорожка a:2: тег handler_name в stream_tags (поле ffprobe: имя обработчика дорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:2 -show_entries stream_tags=handler_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
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
  }
]
