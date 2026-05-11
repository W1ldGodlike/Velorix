import type { EngineId } from './engine-contract'

/** argv-токен: main подставляет абсолютный путь текущего превью (`isGrantedMediaPath`). */
export const TERMINAL_CURRENT_FILE_PLACEHOLDER = '__CURRENT_FILE__'

export type TerminalToolId = EngineId

export type TerminalCommandHintEntry = {
  token: string
  summary: string
  tool: TerminalToolId
  /** Если задано, клик по подсказке подставляет целую argv-строку вместо одного токена. */
  fullLine?: string
}

/** §8 — готовые строки для вкладки «Загрузки» (терминал рядом по workflow). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS: TerminalCommandHintEntry[] = [
  {
    tool: 'yt-dlp',
    token: '· -F',
    summary: 'Список форматов перед загрузкой; после клика допишите URL из поля очереди.',
    fullLine: 'yt-dlp -F '
  },
  {
    tool: 'yt-dlp',
    token: '· -g best',
    summary: 'Прямая ссылка на поток без скачивания (-g -f best); допишите URL.',
    fullLine: 'yt-dlp -g -f best '
  },
  {
    tool: 'yt-dlp',
    token: '· cookies chrome',
    summary: 'Сухой прогон с cookies из Chrome (--cookies-from-browser); допишите URL.',
    fullLine: 'yt-dlp --skip-download --cookies-from-browser chrome '
  },
  {
    tool: 'yt-dlp',
    token: '· -J',
    summary: 'Полный JSON метаданных (-J) без скачивания; допишите URL (диагностика, Support ZIP).',
    fullLine: 'yt-dlp -J '
  },
  {
    tool: 'yt-dlp',
    token: '· -v --skip-download',
    summary: 'Подробный лог без скачивания (-v --skip-download); допишите URL (ошибки extractor, geo, DRM).',
    fullLine: 'yt-dlp -v --skip-download '
  },
  {
    tool: 'yt-dlp',
    token: '· --simulate',
    summary: 'Сухой прогон без файлов (--simulate); допишите URL (проверка доступности и форматов).',
    fullLine: 'yt-dlp --simulate '
  },
  {
    tool: 'yt-dlp',
    token: '· --list-subs',
    summary: 'Список субтитров на странице без скачивания (--list-subs); допишите URL.',
    fullLine: 'yt-dlp --list-subs '
  },
  {
    tool: 'yt-dlp',
    token: '· --flat-playlist -J',
    summary: 'Плейлист «плоско» + JSON (-J) без глубокого извлечения каждого ролика; допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist -J '
  },
  {
    tool: 'yt-dlp',
    token: '· --no-playlist -F',
    summary: 'Только один ролик из URL-плейлиста (--no-playlist -F); список форматов без разворачивания всего плейлиста.',
    fullLine: 'yt-dlp --no-playlist -F '
  },
  {
    tool: 'yt-dlp',
    token: '· --flat-playlist -F',
    summary: 'Плоский список элементов плейлиста + форматы по каждому (--flat-playlist -F); допишите URL плейлиста.',
    fullLine: 'yt-dlp --flat-playlist -F '
  },
  {
    tool: 'yt-dlp',
    token: '· --list-thumbnails',
    summary: 'Доступные превью/thumbnail URL без скачивания (--list-thumbnails); допишите URL.',
    fullLine: 'yt-dlp --list-thumbnails '
  }
]

/** §8 — ffprobe по текущему превью редактора (нужен токен плейсхолдера). */
export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA: TerminalCommandHintEntry[] = [
  {
    tool: 'ffprobe',
    token: '· format+streams',
    summary: 'Полный отчёт ffprobe по файлу в превью (плейсхолдер подставится при запуске).',
    fullLine: `ffprobe -hide_banner -show_format -show_streams ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· duration',
    summary: 'Кратко: duration / size / bit_rate из format.',
    fullLine: `ffprobe -hide_banner -show_entries format=duration,size,bit_rate -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· chapters',
    summary: 'Главы и метаданные контейнера (-show_chapters -show_format); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_chapters -show_format ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· v:0 compact',
    summary: 'Поток v:0: width/height/r_frame_rate/pix_fmt (default=nw=1); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams v:0 -show_entries stream=width,height,r_frame_rate,pix_fmt -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· a:0 compact',
    summary: 'Поток a:0: codec_name/sample_rate/channels (default=nw=1); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams a:0 -show_entries stream=codec_name,sample_rate,channels -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· s:0 compact',
    summary: 'Поток s:0: codec_name/codec_tag_string (default=nw=1); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -select_streams s:0 -show_entries stream=codec_name,codec_tag_string -of default=nw=1:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffprobe',
    token: '· streams compact',
    summary: 'Все дорожки одной строкой: index/codec_type/codec_name (compact); плейсхолдер = превью.',
    fullLine: `ffprobe -hide_banner -show_entries stream=index,codec_type,codec_name -of compact=p=0:nk=1 ${TERMINAL_CURRENT_FILE_PLACEHOLDER}`
  },
  {
    tool: 'ffmpeg',
    token: '· decode smoke',
    summary: 'Быстрый прогон декодера первых 10 с в null muxer (-t 10); нагрузка на CPU/GPU.',
    fullLine: `ffmpeg -hide_banner -nostats -i ${TERMINAL_CURRENT_FILE_PLACEHOLDER} -t 10 -f null -`
  }
]

export type TerminalRunRequest = {
  line: string
  /** Путь открытого в редакторе файла; подставляется вместо `TERMINAL_CURRENT_FILE_PLACEHOLDER` в argv. */
  currentFilePath?: string | null
}

export type TerminalRunResult =
  | {
      ok: true
      tool: TerminalToolId
      args: string[]
      code: number | null
      stdout: string
      stderr: string
      elapsedMs: number
    }
  | { ok: false; error: string }

