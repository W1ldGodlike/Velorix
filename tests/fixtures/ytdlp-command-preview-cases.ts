import type { AppSettings } from '../../src/main/services/settings/settings-store'
import type { YtdlpCommandPreviewContext } from '../../src/main/services/ytdlp/ytdlp-download-options-preview'

export type YtdlpCommandPreviewCase = {
  name: string
  settings: AppSettings
  previewCtx?: YtdlpCommandPreviewContext
  mustContain: string[]
  mustNotContain?: string[]
}

const BASE: AppSettings = { theme: 'dark' }

export const YTDLP_COMMAND_PREVIEW_CASES: YtdlpCommandPreviewCase[] = [
  {
    name: 'merge_bv_ba preset',
    settings: { ...BASE, ytdlpFormatPreset: 'merge_bv_ba' },
    mustContain: ['-f', 'bv*+ba/b'],
    mustNotContain: ['--merge-output-format']
  },
  {
    name: 'best_single preset',
    settings: { ...BASE, ytdlpFormatPreset: 'best_single' },
    mustContain: ['-f', 'best'],
    mustNotContain: ['bv*+ba']
  },
  {
    name: 'default preset без -f',
    settings: { ...BASE, ytdlpFormatPreset: 'default' },
    mustContain: ['--no-playlist'],
    mustNotContain: ['-f bv', '-f best', '--merge-output-format']
  },
  {
    name: 'audioOnly без format -f',
    settings: {
      ...BASE,
      ytdlpFormatPreset: 'editor_mp4',
      ytdlpAudioOnly: true
    },
    mustContain: ['-x', '--audio-format', 'best'],
    mustNotContain: ['--merge-output-format', '-f bv']
  },
  {
    name: 'playlist mode',
    settings: { ...BASE, ytdlpDownloadPlaylist: true },
    mustContain: ['--yes-playlist'],
    mustNotContain: ['--no-playlist']
  },
  {
    name: 'subs manual_auto + sub-langs',
    settings: {
      ...BASE,
      ytdlpSubtitlePreset: 'manual_auto',
      ytdlpSubLangs: 'ru,en'
    },
    mustContain: ['--write-subs', '--write-auto-subs', '--sub-langs', 'ru,en']
  },
  {
    name: 'cookies-from-browser с профилем',
    settings: {
      ...BASE,
      ytdlpCookiesBrowser: 'chrome',
      ytdlpCookiesBrowserProfile: 'Profile 1'
    },
    mustContain: ['--cookies-from-browser', 'chrome:Profile 1'],
    mustNotContain: ['--cookies ']
  },
  {
    name: 'impersonate firefox',
    settings: { ...BASE, ytdlpImpersonate: 'firefox' },
    mustContain: ['--impersonate', 'firefox']
  },
  {
    name: 'rate limit и retries',
    settings: {
      ...BASE,
      ytdlpRateLimit: '2M',
      ytdlpRetries: 5,
      ytdlpFragmentRetries: 3
    },
    mustContain: ['--limit-rate', '2M', '--retries', '5', '--fragment-retries', '3']
  },
  {
    name: 'доп. argv в preview',
    settings: { ...BASE, ytdlpExtraArgsLine: '--geo-bypass' },
    mustContain: ['--geo-bypass']
  },
  {
    name: 'битый cookies-файл не попадает в argv',
    settings: {
      ...BASE,
      ytdlpCookiesFile: 'C:\\fluxalloy-missing-cookies-989.txt'
    },
    mustContain: ['--no-playlist'],
    mustNotContain: ['fluxalloy-missing-cookies', '--cookies-from-browser', '--cookies ']
  },
  {
    name: 'битый cookies-файл не подменяется browser из settings',
    settings: {
      ...BASE,
      ytdlpCookiesFile: 'C:\\fluxalloy-missing-cookies-989.txt',
      ytdlpCookiesBrowser: 'edge'
    },
    mustContain: ['--no-playlist'],
    mustNotContain: ['--cookies-from-browser', 'fluxalloy-missing-cookies']
  }
]
