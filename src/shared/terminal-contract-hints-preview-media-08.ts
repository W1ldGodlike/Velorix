import type { TerminalCommandHintEntry } from './terminal-contract-types'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'

/** §8 — подсказки превью/ffprobe (часть 8/8; §8 audit prune). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_08: TerminalCommandHintEntry[] = [
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
    token: '· пакет v:0 duration 1',
    summary:
      'Первый пакет первой видеодорожки (v:0): duration (-show_packets -read_intervals %+#1 -show_entries packet=duration); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_packets -read_intervals %+#1 -show_entries packet=duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
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
    token: '· ffmpeg: scale bilinear 2с',
    summary:
      'Масштаб bilinear 320×240 первых 2 с (-vf scale=320:240:flags=bilinear); дымовая проверка scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=320:240:flags=bilinear -t 2 -an -sn -f null -`
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
    token: '· ffmpeg: pp hb vb 2с',
    summary:
      'Постобработка pp=hb/vb первых 2 с; дымовая проверка pp; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf pp=hb/vb -t 2 -an -sn -f null -`
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
    tool: 'ffprobe',
    token: '· субтитры s:2 кратко',
    summary:
      'Третья дорожка субтитров s:2: кодек и строка тега кодека (поля ffprobe: codec_name, codec_tag_string); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:2 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:2 кратко',
    summary:
      'Третья аудиодорожка a:2: кодек, частота дискретизации и каналы (поля ffprobe: codec_name, sample_rate, channels); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:2 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 атрибуты дорожки',
    summary:
      'Вторая аудиодорожка a:1: disposition (поле ffprobe: forced, default и др. — флаги второй аудиодорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:3 кратко',
    summary:
      'Четвёртая аудиодорожка a:3: кодек, частота дискретизации и каналы (поля ffprobe: codec_name, sample_rate, channels); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:3 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:3 кратко',
    summary:
      'Четвёртая дорожка субтитров s:3: кодек и строка тега кодека (поля ffprobe: codec_name, codec_tag_string); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:3 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:2 атрибуты дорожки',
    summary:
      'Третья дорожка субтитров s:2: disposition (поле ffprobe: forced, default, hearing_impaired и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:2 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:2 атрибуты дорожки',
    summary:
      'Третья аудиодорожка a:2: disposition (поле ffprobe: default, forced и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:2 -show_entries stream=disposition -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:1 профиль и уровень',
    summary:
      'Вторая видеодорожка v:1: profile и level (поля ffprobe: профиль и уровень; редкие случаи с несколькими ракурсами и дубликатами дорожек); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:1 -show_entries stream=profile,level -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:1 начало и длительность',
    summary:
      'Вторая дорожка субтитров s:1: start_time и duration дорожки (поля ffprobe: начало и длительность второй дорожки субтитров); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 кодировщик (тег дорожки)',
    summary:
      'Вторая аудиодорожка (a:1): тег encoder в stream_tags (поле дорожки второй аудио, если записан в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream_tags=encoder -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1 начало и длительность',
    summary:
      'Вторая аудиодорожка a:1: start_time и duration (мультиязык, сдвиг); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=start_time,duration -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:1: таймбаза и старт меток',
    summary:
      'Вторая дорожка субтитров s:1: time_base и start_pts (поля ffprobe: база времени и смещение таймкодов второй дорожки); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:1 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:1: таймбаза и старт меток',
    summary:
      'Вторая аудиодорожка a:1: time_base и start_pts (поля ffprobe: база времени и смещение второй аудиодорожки в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:1 -show_entries stream=time_base,start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· дорожка данных d:1, кодек',
    summary:
      'Вторая data-дорожка d:1: поля ffprobe codec_name и codec_tag_string (таймкоды и метаданные в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:1 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: расширение стерео 4с',
    summary:
      'Лёгкое расширение стереобазы первых 4 с (-af extrastereo=m=1.2); дымовая проверка ширины и pan; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af extrastereo=m=1.2 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· дорожка данных d:2, кодек',
    summary:
      'Третья data-дорожка d:2: поля ffprobe codec_name и codec_tag_string (дополнительные таймкоды и метаданные); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:2 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:4 кодек',
    summary:
      'Пятая аудиодорожка a:4: codec_name, sample_rate и channels (поля ffprobe; мультиязык и комментарии); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:4 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:4 кратко',
    summary:
      'Пятая дорожка субтитров s:4: поля ffprobe codec_name и codec_tag_string; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:4 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  }
]
