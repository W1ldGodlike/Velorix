import type { YtdlpDownloadProgressParts } from '../../src/main/services/ytdlp/ytdlp-progress-parser'

type RareProgressCase = {
  label: string
  line: string
  locale?: 'ru' | 'en'
  expected: YtdlpDownloadProgressParts
}

export const YTDLP_PROGRESS_RARE_CASES: readonly RareProgressCase[] = [
  {
    label: 'Skipping videos in playlist',
    line: '[download] Skipping 3 of 10 videos',
    expected: { percent: null, speed: 'пропуск 3/10', eta: null }
  },
  {
    label: 'Unable to rename',
    line: '[download] Unable to rename file: "C:\\tmp\\a.part" - File exists',
    expected: { percent: null, speed: 'не удалось переименовать', eta: null }
  },
  {
    label: 'Downloading format ids',
    line: '[download] Downloading 1 format(s): 398+251',
    expected: { percent: null, speed: 'формат 398+251', eta: null }
  },
  {
    label: 'Downloading format shorthand',
    line: '[download] Downloading format 137+140',
    expected: { percent: null, speed: 'формат 137+140', eta: null }
  },
  {
    label: 'Already downloaded',
    line: '[download] C:\\Downloads\\clip.mp4 has already been downloaded',
    expected: { percent: '100%', speed: 'уже скачано', eta: null }
  },
  {
    label: 'Giving up after retries',
    line: '[download] Giving up after 10 retries',
    expected: { percent: null, speed: 'отмена · попытки 10', eta: null }
  },
  {
    label: 'Skipping videos (en)',
    line: '[download] Skipping 2 of 5 videos',
    locale: 'en',
    expected: { percent: null, speed: 'skip 2/5', eta: null }
  },
  {
    label: 'Already downloaded (en)',
    line: '[download] /tmp/out.webm has already been downloaded',
    locale: 'en',
    expected: { percent: '100%', speed: 'already downloaded', eta: null }
  },
  {
    label: 'Writing thumbnail',
    line: '[download] Writing thumbnail to: D:\\out\\thumb.webp',
    expected: { percent: null, speed: 'миниатюра', eta: null }
  },
  {
    label: 'Writing video subtitles',
    line: '[download] Writing video subtitles to: /tmp/sub.en.srt',
    expected: { percent: null, speed: 'субтитры', eta: null }
  },
  {
    label: 'Writing subtitles shorthand',
    line: '[download] Writing subtitles to: "/tmp/spaced sub.srt"',
    expected: { percent: null, speed: 'субтитры', eta: null }
  },
  {
    label: 'Writing metadata',
    line: '[download] Writing metadata to: D:\\Media\\clip.mp4',
    expected: { percent: null, speed: 'метаданные', eta: null }
  },
  {
    label: 'Download rate limit sleep',
    line: '[download] Download rate limit reached, sleeping for 12.34 seconds ...',
    expected: { percent: null, speed: 'лимит скорости · пауза 12.34 с', eta: null }
  },
  {
    label: 'Deleting original file',
    line: '[download] Deleting original file C:\\tmp\\clip.f140.m4a (pass -k)',
    expected: { percent: null, speed: 'удаление исходника', eta: null }
  },
  {
    label: 'Writing thumbnail (en)',
    line: '[download] Writing thumbnail to: /tmp/thumb.jpg',
    locale: 'en',
    expected: { percent: null, speed: 'thumbnail', eta: null }
  },
  {
    label: 'Rate limit sleep (en)',
    line: '[download] Download rate limit reached, sleeping for 3.0 seconds',
    locale: 'en',
    expected: { percent: null, speed: 'rate limit · pause 3.0 s', eta: null }
  }
]
