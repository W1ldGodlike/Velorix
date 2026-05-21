import type { TerminalCommandHintEntry } from './terminal-contract-types'
import { TERMINAL_CURRENT_FILE_PLACEHOLDER } from './terminal-contract-types'

/** §8 — подсказки превью/ffprobe (часть 4/8; §8 audit prune). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_04: TerminalCommandHintEntry[] = [
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: хорус 4с',
    summary:
      'Лёгкий хорус первых 4 с (-af chorus); дымовая проверка задержек и модуляции в цепочке -af; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af chorus=0.5:0.9:50:0.4:0.25:2 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: wmf sdk и кодировщик',
    summary:
      'Теги контейнера encoder и WMFSDKVersion (поля format_tags: кодировщик и версия Windows Media SDK; часто у WMV и ASF); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoder,WMFSDKVersion -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: нарастание громкости 3с',
    summary:
      'Плавное нарастание громкости первых 3 с (-af afade=t=in:st=0:d=0.6); дымовая проверка нарастания (afade in) без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afade=t=in:st=0:d=0.6 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· тег инструмент кодирования',
    summary:
      'Тег контейнера encoding_tool (поле format_tags: какой программой упакован файл — часто Mux, QuickTime и др.); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoding_tool -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: затухание громкости 3с',
    summary:
      'Плавное затухание громкости в хвосте первых 3 с (-af afade=t=out:st=1.2:d=0.6); дымовая проверка затухания (afade out) без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af afade=t=out:st=1.2:d=0.6 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: число глав',
    summary:
      'Контейнер: поле nb_chapters (сколько глав в файле; для навигации и DVD/Blu-ray структуры); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format=nb_chapters -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: темп ×0.95, 3с',
    summary:
      'Лёгкое замедление темпа первых 3 с (-af atempo=0.95); дымовая проверка фильтра atempo без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af atempo=0.95 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:1 длинное имя кодека',
    summary:
      'Вторая видеодорожка v:1: codec_name и codec_long_name (поля ffprobe: короткое и длинное имя кодека; мультикамера и дополнительный поток); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:1 -show_entries stream=codec_name,codec_long_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: лимитер 3с',
    summary:
      'Мягкий лимитер пиков первых 3 с (-af alimiter=limit=0.8); дымовая проверка динамики в цепочке -af без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af alimiter=limit=0.8 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· бренды контейнера mp4 (теги)',
    summary:
      'Теги контейнера major_brand, minor_version и compatible_brands (поля format_tags: бренд, младшая версия и список совместимых; часто у MP4 и MOV); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=major_brand,minor_version,compatible_brands -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: стерео-коррекция 3с',
    summary:
      'Лёгкая стерео-коррекция первых 3 с (-af stereotools=mlev=0.05:phlev=0.05); дымовая проверка ширины и фазы; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af stereotools=mlev=0.05:phlev=0.05 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: непрерывность и сборник',
    summary:
      'Теги контейнера gapless_playback и compilation (поля format_tags: бесшовное воспроизведение и признак сборника; часто у AAC и ALAC из iTunes); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=gapless_playback,compilation -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: нормализация речи 4с',
    summary:
      'Лёгкая нормализация речи и подкаста первых 4 с (-af speechnorm=peak=0.25); дымовая проверка динамики диалога; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af speechnorm=peak=0.25 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги: темп (bpm) и тональность',
    summary:
      'Теги контейнера BPM и initial_key (поля format_tags: темп в ударах в минуту и тональность, если записаны каталогизатором); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=BPM,initial_key -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: межканальный кроссфейд 4с',
    summary:
      'Лёгкий межканальный кроссфид bs2b первых 4 с (-af bs2b=profile=j2); дымовая проверка стерео-обработки; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af bs2b=profile=j2 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: акцент нч 4с',
    summary:
      'Лёгкий низкочастотный акцент первых 4 с (-af bass=g=2:f=120); дымовая проверка эквалайзера НЧ (bass); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af bass=g=2:f=120 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:0 индекс и кодек',
    summary:
      'Первая субтитровая дорожка s:0: index и codec_name (поля ffprobe: порядок и тип дорожки в контейнере); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=index,codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: многополосный эквалайзер 4с',
    summary:
      'Лёгкий 10-полосный superequalizer (полоса 3 +4 dB) первых 4 с; дымовая проверка графического эквалайзера; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af superequalizer=3b=4 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги сериала и эпизода',
    summary:
      'Теги контейнера show и episode_sort (поля format_tags: название шоу и сортировка эпизода; телекаталоги и сериалы); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=show,episode_sort -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: полка нч 4с',
    summary:
      'Лёгкий низкочастотный шельф первых 4 с (-af lowshelf=g=2:f=200); дымовая проверка нижнего полочного эквалайзера; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af lowshelf=g=2:f=200 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: extrastereo 0.85 3с',
    summary:
      'Стерео-база extrastereo=m=0.85 первых 3 с; дымовая проверка extrastereo; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af extrastereo=m=0.85 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги подкаста и веб-адрес',
    summary:
      'Теги контейнера podcast и podcasturl (поля format_tags: признак подкаста и URL RSS); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=podcast,podcasturl -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: биткрашер 4с',
    summary:
      'Лёгкое битовое дробление (bit-crush) первых 4 с (-af acrusher=level_in=0.8:level_out=0.8:bits=8:mode=log); дымовая проверка зернистости; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acrusher=level_in=0.8:level_out=0.8:bits=8:mode=log -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: кросс-пан стерео 4с',
    summary:
      'Лёгкое стереосмешивание через pan первых 4 с (каналы c0 и c1, кросс-фейд 0.6 и 0.4); дымовая проверка фильтра pan без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af pan=stereo|c0=0.6*c0+0.4*c1|c1=0.4*c0+0.6*c1 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· теги каталога и штрихкода',
    summary:
      'Теги контейнера catalog_number и barcode (поля format_tags: каталожный номер и штрихкод UPC); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=catalog_number,barcode -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: ресемпл с компенсацией рассинхрона 4с',
    summary:
      'Лёгкая компенсация рассинхрона через aresample=async=1 первых 4 с; дымовая проверка цепочки ресемплера (aresample); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aresample=async=1:first_pts=0 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: компрессор 4с',
    summary:
      'Лёгкий компрессор первых 4 с (-af acompressor=threshold=0.08:ratio=3:attack=5:release=50); дымовая проверка динамики; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acompressor=threshold=0.08:ratio=3:attack=5:release=50 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:2 размер и частота кадров',
    summary:
      'Третий видеопоток v:2: ширина, высота и частота кадров (поля ffprobe: width, height, r_frame_rate; несколько видеопотоков или альтернативы); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:2 -show_entries stream=width,height,r_frame_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: контраст 3с',
    summary:
      'Лёгкий аудио-контраст первых 3 с (-af acontrast=25); дымовая проверка динамики без кавычек в списке аргументов (argv); путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acontrast=25 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:6 кратко',
    summary:
      'Седьмая аудиодорожка a:6: codec_name и channel_layout (поля ffprobe; комментарии и изоморфные миксы); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:6 -show_entries stream=codec_name,channel_layout -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:3 размер и pix_fmt',
    summary:
      'Четвёртый видеопоток v:3: width, height и pix_fmt (поля ffprobe; альтернативные углы или дубли); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:3 -show_entries stream=width,height,pix_fmt -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги диск и дорожка',
    summary:
      'Теги контейнера disc и track (поля format_tags: номер диска и дорожки в альбомной разметке); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=disc,track -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги либретто и композитор',
    summary:
      'Теги контейнера lyricist и composer (поля format_tags: автор текста и композитор; музыкальные релизы); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=lyricist,composer -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги кодировщик и muxer',
    summary:
      'Теги контейнера encoded_by и muxing_app (поля format_tags: кто закодировал и чем упаковано; трассировка пайплайна); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoded_by,muxing_app -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· поток v:0 side_data list',
    summary:
      'Список side_data у первой видеодорожки (v:0) (-show_entries stream_side_data_list — HDR10+, DOVI и др. без разбора каждого поля); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· поток a:0 side_data list',
    summary:
      'Список side_data у первой аудиодорожки (a:0) (например метаданные объёмного звука); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream_side_data_list -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: rubberband темп 4с',
    summary:
      'Лёгкое изменение темпа без сдвига тона первых 4 с (-af rubberband=tempo=1.03:pitch=1.0); дымовая проверка качественного растяжения; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af rubberband=tempo=1.03:pitch=1.0 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: firequalizer усиление 4с',
    summary:
      'Лёгкое частотное усиление через firequalizer первых 4 с (-af firequalizer=gain=6); дымовая проверка параметрического EQ; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af firequalizer=gain=6 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: кроссовер полос 4с',
    summary:
      'Разделение спектра через acrossover на 1.2 kHz первых 4 с; дымовая проверка многополосной цепочки; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af acrossover=split=1200 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: наклон спектра 4с',
    summary:
      'Лёгкий наклон спектра (tilt) вокруг 1 kHz первых 4 с; дымовая проверка slope-EQ; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af tilt=frequency=1000:width=8:g=1 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: подъём саба 4с',
    summary:
      'Лёгкий подъём низов через asubboost первых 4 с; дымовая проверка НЧ-акцента; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af asubboost=dry=0.8:wet=0.8:boost=1.5 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: предыскажения CD 4с',
    summary:
      'Предыскажения в стиле CD (aemphasis mode=cd) первых 4 с; дымовая проверка лёгкой коррекции АЧХ; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af aemphasis=mode=cd -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: хвостовая подкладка тишины 3с',
    summary:
      'Короткая подкладка тишины в хвосте через apad (pad_dur=0.25 с) первых 3 с выхода; дымовая проверка выравнивания длины буфера; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af apad=pad_dur=0.25 -t 3 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: эффект Хааса 4с',
    summary:
      'Лёгкий эффект призрачного стерео (haas_effect) первых 4 с; дымовая проверка задержки между каналами; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af haas_effect=del_ms=12:side_gain=0.35 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: панорама моно→стерео 4с',
    summary:
      'Разведение моно в стерео через pan первых 4 с (центр в оба канала); дымовая проверка матрицы pan; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af pan=stereo|c0=0.5*c0|c1=0.5*c0 -t 4 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: обрезка тишины в начале 8с',
    summary:
      'Удаление ведущей тишины в первых 8 с (-af silenceremove=start_periods=1:start_duration=0.3:start_threshold=-45dB); дымовая проверка детектора тишины; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -af silenceremove=start_periods=1:start_duration=0.3:start_threshold=-45dB:detection=peak -t 8 -vn -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: демультиплекс a:0 в pcm 2с',
    summary:
      'Извлечь первую аудиодорожку в сырой PCM (-map 0:a:0 — первая аудиодорожка) первых 2 с (-f s16le); дымовая проверка -map и pcm без кавычек в argv; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -map 0:a:0 -t 2 -vn -sn -f s16le -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: масштаб lanczos 2с видео',
    summary:
      'Лёгкий ресайз видео lanczos до 640 ширины первых 2 с (-vf scale=640:-2:lanczos); дымовая проверка фильтра scale; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf scale=640:-2:lanczos -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: телесинк ускорение 2с',
    summary:
      'Лёгкий pullup/деинтерлейс через fps=24000/1001 первых 2 с (-vf fps=fps=24000/1001); дымовая проверка cadence; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf fps=fps=24000/1001 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 только color_transfer',
    summary:
      'Первая видеодорожка (v:0): только color_transfer (поле ffprobe: кривая переноса, PQ, HLG и др.; отдельно от color_space); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=color_transfer -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· контейнер: encoder и handler_name',
    summary:
      'Теги контейнера encoder и handler_name (поля format_tags: кодировщик и обработчик верхнего уровня; часто MOV/MP4); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=encoder,handler_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· главы: первая запись компактно',
    summary:
      'Только первая глава компактно (-read_intervals %+0#1 — ограничение чтения, -show_chapters — главы); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -read_intervals %+0#1 -show_chapters -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· дорожка данных d:4',
    summary:
      'Пятая data-дорожка d:4: codec_name (поле ffprobe; дополнительные метаданные); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams d:4 -show_entries stream=codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· теги artist и sort_artist',
    summary:
      'Теги контейнера artist и sort_artist (поля format_tags: исполнитель и сортировочная строка каталога); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_entries format_tags=artist,sort_artist -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· видео v:0 с приватными полями',
    summary:
      'Первая видеодорожка (v:0) с флагом -show_private_data (дополнительные поля кодека, если демультиплексор их отдаёт) и codec_name; путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -show_private_data -select_streams v:0 -show_entries stream=codec_name -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· субтитры s:2 start_pts',
    summary:
      'Третья дорожка субтитров s:2: start_pts (поле ffprobe: смещение первой метки субтитров); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:2 -show_entries stream=start_pts -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· аудио a:2 index и codec_tag',
    summary:
      'Третья аудиодорожка a:2: index и codec_tag_string (поля ffprobe: порядок и FourCC кодека); путь к медиа подставляется из превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:2 -show_entries stream=index,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: обесцвечивание hue 2с',
    summary:
      'Обесцвечивание через hue=s=0 первых 2 с (-vf hue=s=0); дымовая проверка цветокоррекции; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hue=s=0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: оттенки серого 2с',
    summary:
      'Перевод в монохром через format=gray первых 2 с (-vf format=gray); дымовая проверка цепочки -vf; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf format=gray -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: unsharp 2с',
    summary:
      'Лёгкая резкость unsharp первых 2 с (-vf unsharp=3:3:1.0); дымовая проверка свёртки; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf unsharp=3:3:1.0 -t 2 -an -sn -f null -`
  },
  {
    tool: 'ffmpeg',
    token: '· ffmpeg: hqdn3d 2с',
    summary:
      'Лёгкое пространственно-временное шумоподавление hqdn3d первых 2 с; дымовая проверка -vf; путь к медиа подставляется из превью.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -vf hqdn3d=2:1:2:3 -t 2 -an -sn -f null -`
  }
]
