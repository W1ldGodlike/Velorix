import type { YtdlpDownloadProgressParts } from '../../src/main/services/ytdlp/ytdlp-progress-parser'

type PostProcessProgressCase = {
  label: string
  line: string
  locale?: 'ru' | 'en'
  expected: YtdlpDownloadProgressParts
}

export const YTDLP_PROGRESS_POST_PROCESS_CASES: readonly PostProcessProgressCase[] = [
  {
    label: 'Merger',
    line: '[Merger] Merging formats into "C:\\Downloads\\final.mkv"',
    expected: { percent: null, speed: 'слияние форматов', eta: null }
  },
  {
    label: 'ExtractAudio',
    line: '[ExtractAudio] Destination: /tmp/audio.m4a',
    expected: { percent: null, speed: 'извлечение аудио', eta: null }
  },
  {
    label: 'VideoRemuxer',
    line: '[VideoRemuxer] Remuxing video from mkv into "C:\\out\\final.mp4"',
    expected: { percent: null, speed: 'перепаковка', eta: null }
  },
  {
    label: 'FFmpegVideoConvertor',
    line: '[FFmpegVideoConvertor] Convert video from webm to mp4; Destination: C:\\out\\clip.mp4',
    expected: { percent: null, speed: 'перекодирование', eta: null }
  },
  {
    label: 'EmbedSubtitle',
    line: '[EmbedSubtitle] Embedding subtitles in "/media/out.mkv"',
    expected: { percent: null, speed: 'встраивание субтитров', eta: null }
  },
  {
    label: 'EmbedThumbnail',
    line: '[EmbedThumbnail] ffmpeg: Adding thumbnail to "C:\\Media\\song.m4a"',
    expected: { percent: null, speed: 'миниатюра в файл', eta: null }
  },
  {
    label: 'Metadata embed',
    line: '[Metadata] Adding metadata to "/home/u/track.mkv"',
    expected: { percent: null, speed: 'метаданные в файл', eta: null }
  },
  {
    label: 'Concat',
    line: '[Concat] Concatenating 3 files; Destination: C:\\merged.mp4',
    expected: { percent: null, speed: 'склейка', eta: null }
  },
  {
    label: 'MoveFiles',
    line: '[MoveFiles] Moving file "C:\\tmp\\a.mp4" to "C:\\tmp\\b.mp4"',
    expected: { percent: null, speed: 'перемещение', eta: null }
  },
  {
    label: 'FixupM3u8',
    line: '[FixupM3u8] Fixing MPEG-TS in MP4 container of "C:\\out\\hls.mp4"',
    expected: { percent: null, speed: 'исправление контейнера', eta: null }
  },
  {
    label: 'SponsorBlock',
    line: '[SponsorBlock] Removing sponsor segments from title',
    expected: { percent: null, speed: 'SponsorBlock', eta: null }
  },
  {
    label: 'SubtitlesConvertor',
    line: '[SubtitlesConvertor] Converting subtitles /tmp/a.en.vtt → /tmp/a.ru.srt',
    expected: { percent: null, speed: 'конвертация субтитров', eta: null }
  },
  {
    label: 'ffmpeg post-processing',
    line: '[ffmpeg] Post-processing: Adding metadata',
    expected: { percent: null, speed: 'постобработка ffmpeg', eta: null }
  },
  {
    label: 'Merger (en)',
    line: '[ffmpeg] Merging formats into /tmp/out.webm',
    locale: 'en',
    expected: { percent: null, speed: 'merging formats', eta: null }
  },
  {
    label: 'EmbedSubtitle (en)',
    line: '[EmbedSubtitle] Embedding subtitles in "/media/out.mkv"',
    locale: 'en',
    expected: { percent: null, speed: 'embedding subtitles', eta: null }
  }
]
