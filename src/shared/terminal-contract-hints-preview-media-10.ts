import type { TerminalCommandHintEntry } from './terminal-contract-types'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'

/** §8 — подсказки превью/ffprobe (часть 10). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_10: TerminalCommandHintEntry[] = [
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: dedot mix2 2с',
    summary:
      'Подавление точек dedot=spatial_mix=2 первых 2 с; дымовая проверка dedot; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf dedot=spatial_mix=2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: gradfun 1.1 2с',
    summary:
      'Сглаживание бэнда gradfun=strength=1.1 первых 2 с; дымовая проверка gradfun; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf gradfun=strength=1.1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: fade out 2с',
    summary:
      'Затемнение на выходе fade=t=out:st=0:d=0.5 первых 2 с; дымовая проверка fade; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fade=t=out:st=0:d=0.5 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: extrastereo 0.85 3с',
    summary:
      'Стерео-база extrastereo=m=0.85 первых 3 с; дымовая проверка extrastereo; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af extrastereo=m=0.85 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: aresample 96k 2с',
    summary:
      'Ресемплинг в 96 kHz aresample=96000 первых 2 с; дымовая проверка aresample; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aresample=96000 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: treble g2 2с',
    summary:
      'ВЧ-полка treble=g=2 первых 2 с; дымовая проверка treble; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af treble=g=2 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: acompressor alt 3с',
    summary:
      'Компрессор acompressor=threshold=0.12:ratio=2.5:attack=3:release=80 первых 3 с; дымовая проверка acompressor; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acompressor=threshold=0.12:ratio=2.5:attack=3:release=80 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: dynaudnorm alt 4с',
    summary:
      'Динамическая нормализация dynaudnorm=g=21:f=200:r=0.85 первых 4 с; дымовая проверка dynaudnorm; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af dynaudnorm=g=21:f=200:r=0.85 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:11 кратко',
    summary:
      'Двенадцатый видеопоток v:11: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:11 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:12 кратко',
    summary:
      'Тринадцатый поток данных d:12: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:12 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:7 кратко',
    summary:
      'Восьмой поток вложений t:7: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:7 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:12 disposition',
    summary:
      'Тринадцатая дорожка субтитров s:12: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:12 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
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
  },
  {
    tool: 'ffprobe',
    token: '· главы start end',
    summary:
      'Все главы: start_time и end_time (-show_chapters -show_entries chapter=start_time,end_time -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter=start_time,end_time -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 best_effort_ts 4',
    summary:
      'Первые четыре кадра первой видеодорожки (v:0): best_effort_timestamp_time (-show_frames -read_intervals %+#4); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#4 -show_entries frame=best_effort_timestamp_time -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер format_name filename',
    summary:
      'Поля format: format_name и filename (поля ffprobe; имя контейнера и путь); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=format_name,filename -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:5 side_data_list',
    summary:
      'Шестая аудиодорожка a:5: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:5 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:11 кратко',
    summary:
      'Двенадцатая аудиодорожка a:11: кодек и число каналов (поля codec_name и channels); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:11 -show_entries stream=codec_name,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:2 side_data_list',
    summary:
      'Третий видеопоток v:2: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:2 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакет v:0 duration 1',
    summary:
      'Первый пакет первой видеодорожки (v:0): duration (-show_packets -read_intervals %+#1 -show_entries packet=duration); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#1 -show_entries packet=duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: owdenoise 8 2с',
    summary:
      'Вейвлет-шумодав owdenoise=8.0 первых 2 с; дымовая проверка owdenoise; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf owdenoise=8.0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: nlmeans spr 2с',
    summary:
      'Нелокальное среднее nlmeans=s=3:p=5:r=9 первых 2 с; дымовая проверка nlmeans; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf nlmeans=s=3:p=5:r=9 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: atadenoise 0.02 2с',
    summary:
      'Временной шумодав atadenoise=0.02:0.02 первых 2 с; дымовая проверка atadenoise; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf atadenoise=0.02:0.02 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: removegrain m1 2с',
    summary:
      'Пространственное сглаживание removegrain=m1=c1 первых 2 с; дымовая проверка removegrain; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf removegrain=m1=c1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: scale bilinear 2с',
    summary:
      'Масштаб bilinear 320×240 первых 2 с (-vf scale=320:240:flags=bilinear); дымовая проверка scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=320:240:flags=bilinear -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: afftdn -18 2с',
    summary:
      'FFT-шумодав afftdn=nf=-18 первых 2 с; дымовая проверка afftdn; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afftdn=nf=-18 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: lowpass 5k 2с',
    summary:
      'НЧ-срез lowpass=f=5000 первых 2 с; дымовая проверка lowpass; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowpass=f=5000 -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: supereq 7b 3с',
    summary:
      'Десятиполосный superequalizer=7b=-5 первых 3 с; дымовая проверка superequalizer; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af superequalizer=7b=-5 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: agate 0.003 3с',
    summary:
      'Шумовой гейт agate=threshold=0.003:ratio=3:attack=10:release=100 первых 3 с; дымовая проверка agate; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af agate=threshold=0.003:ratio=3:attack=10:release=100 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: volume 2dB 2с',
    summary:
      'Громкость volume=2dB первых 2 с; дымовая проверка volume; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af volume=2dB -t 2 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: yadif 1:-1:1 2с',
    summary:
      'Деинтерлейс yadif=1:-1:1 первых 2 с; дымовая проверка yadif; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf yadif=1:-1:1 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: pp hb vb 2с',
    summary:
      'Постобработка pp=hb/vb первых 2 с; дымовая проверка pp; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf pp=hb/vb -t 2 -an -sn -f null -`
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
    token: '· ffmpeg: bwdif send_frame 2с',
    summary:
      'Деинтерлейс bwdif=mode=send_frame первых 2 с; дымовая проверка bwdif; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf bwdif=mode=send_frame -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:12 кратко',
    summary:
      'Тринадцатый видеопоток v:12: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:12 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· данные d:13 кратко',
    summary:
      'Четырнадцатый поток данных d:13: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:13 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· вложения t:8 кратко',
    summary:
      'Девятый поток вложений t:8: тип и кодек (поля codec_type и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams t:8 -show_entries stream=codec_type,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:13 disposition',
    summary:
      'Четырнадцатая дорожка субтитров s:13: disposition и кодек (поля disposition и codec_name); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:13 -show_entries stream=disposition,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер discsubtitle',
    summary:
      'Подзаголовок диска в контейнере (поле format_tags=discsubtitle; мультидисковые сборники); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=discsubtitle -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер media_type',
    summary:
      'Тип носителя в контейнере (поле format_tags=media_type; iTunes и каталоги); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=media_type -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер creation major_brand',
    summary:
      'Теги контейнера creation_time и major_brand (поля format_tags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=creation_time,major_brand -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы теги language',
    summary:
      'Теги language у всех глав (-show_chapters -show_entries chapter_tags=language -of compact); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_entries chapter_tags=language -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· кадры v:0 repeat_pict 6',
    summary:
      'Первые шесть кадров первой видеодорожки (v:0): repeat_pict (-show_frames -read_intervals %+#6); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_frames -read_intervals %+#6 -show_entries frame=repeat_pict -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер nb_streams duration',
    summary:
      'Поля format: nb_streams и duration (поля ffprobe; сверка числа дорожек и длительности); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=nb_streams,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:6 side_data_list',
    summary:
      'Седьмая аудиодорожка a:6: список side_data_list (поле stream_side_data_list); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:6 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:12 кратко',
    summary:
      'Тринадцатая аудиодорожка a:12: кодек и число каналов (поля codec_name и channels); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:12 -show_entries stream=codec_name,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:4 кратко',
    summary:
      'Пятый видеопоток v:4: ширина, высота и кодек (поля ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:4 -show_entries stream=width,height,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:3 start_pts',
    summary:
      'Четвёртая дорожка субтитров s:3: start_pts (поле ffprobe); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:3 -show_entries stream=start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· пакет v:0 flags 1',
    summary:
      'Первый пакет первой видеодорожки (v:0): flags (-show_packets -read_intervals %+#1 -show_entries packet=flags); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#1 -show_entries packet=flags -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: mcdeint fast 2с',
    summary:
      'Деинтерлейс mcdeint=mode=fast первых 2 с; дымовая проверка mcdeint; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf mcdeint=mode=fast -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: il d t 2с',
    summary:
      'Чересстрочное поле il=d:t первых 2 с; дымовая проверка il; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf il=d:t -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: eq darker 2с',
    summary:
      'Яркость и контраст eq=brightness=-0.02:contrast=0.98 первых 2 с; дымовая проверка eq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf eq=brightness=-0.02:contrast=0.98 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: histeq str 2с',
    summary:
      'Эквализация histeq=strength=0.2 первых 2 с; дымовая проверка histeq; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf histeq=strength=0.2 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: deflicker b2 2с',
    summary:
      'Подавление мерцания deflicker=b=2 первых 2 с; дымовая проверка deflicker; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf deflicker=b=2 -t 2 -an -sn -f null -`
  }
]
