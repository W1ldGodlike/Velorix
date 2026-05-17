import type { DownloadsWindowUiLocale } from '../../src/shared/downloads-window-ui-locale'
import type { YtdlpQueueFailureKind } from '../../src/main/ytdlp-progress-parser'

export type YtdlpQueueFailureStatusCase = {
  label: string
  exitCode: number | null
  signal: NodeJS.Signals | null
  errorHint: string | null
  stderrFallback: string | null
  failureKind?: YtdlpQueueFailureKind
  locale?: DownloadsWindowUiLocale
  expected: string
}

export const YTDLP_QUEUE_FAILURE_STATUS_CASES: readonly YtdlpQueueFailureStatusCase[] = [
  {
    label: 'сигнал без кода выхода',
    exitCode: null,
    signal: 'SIGTERM',
    errorHint: null,
    stderrFallback: null,
    expected: 'Ошибка (сигнал SIGTERM)'
  },
  {
    label: 'ERROR: текст предпочтительнее stderr',
    exitCode: 1,
    signal: null,
    errorHint: 'Video unavailable',
    stderrFallback: '[foo] last stderr line',
    expected: 'Ошибка (код 1): Video unavailable'
  },
  {
    label: 'stderr если ERROR: не распарсился',
    exitCode: 1,
    signal: null,
    errorHint: null,
    stderrFallback: 'WARNING: [youtube] Sign in to confirm',
    expected: 'Ошибка (код 1): WARNING: [youtube] Sign in to confirm'
  },
  {
    label: 'unknown без подписи',
    exitCode: 1,
    signal: null,
    errorHint: 'Odd message',
    stderrFallback: null,
    failureKind: 'unknown',
    expected: 'Ошибка (код 1): Odd message'
  },
  {
    label: 'подпись likely_source_block',
    exitCode: 1,
    signal: null,
    errorHint: 'Private video',
    stderrFallback: null,
    failureKind: 'likely_source_block',
    expected: 'отказ источника'
  },
  {
    label: 'подпись transient_network',
    exitCode: 1,
    signal: null,
    errorHint: 'Got server HTTP error: HTTP Error 503',
    stderrFallback: null,
    failureKind: 'transient_network',
    expected: 'вероятно сеть'
  },
  {
    label: 'exit 2 bad options',
    exitCode: 2,
    signal: null,
    errorHint: 'bad flag',
    stderrFallback: null,
    failureKind: 'exit_bad_options',
    expected: 'ошибка параметров'
  },
  {
    label: 'exit 100 restart',
    exitCode: 100,
    signal: null,
    errorHint: 'restart',
    stderrFallback: null,
    failureKind: 'exit_needs_restart',
    expected: 'перезапуск'
  },
  {
    label: 'exit 101 download limit',
    exitCode: 101,
    signal: null,
    errorHint: 'max dl',
    stderrFallback: null,
    failureKind: 'exit_download_limit',
    expected: 'лимит загрузок'
  },
  {
    label: 'en signal',
    exitCode: null,
    signal: 'SIGTERM',
    errorHint: null,
    stderrFallback: null,
    locale: 'en',
    expected: 'Ошибка (signal SIGTERM)'
  },
  {
    label: 'en source blocked',
    exitCode: 1,
    signal: null,
    errorHint: 'x',
    stderrFallback: null,
    failureKind: 'likely_source_block',
    locale: 'en',
    expected: 'source blocked'
  }
]

export type YtdlpErrorSummaryCase = {
  label: string
  line: string
  expected: string | null
}

export const YTDLP_ERROR_SUMMARY_CASES: readonly YtdlpErrorSummaryCase[] = [
  { label: 'без ERROR', line: '[download] 50%', expected: null },
  { label: 'пустая строка', line: '', expected: null },
  {
    label: 'после ERROR:',
    line: 'ERROR: HTTP Error 403: Forbidden',
    expected: 'HTTP Error 403: Forbidden'
  },
  { label: 'пустой хвост', line: 'ERROR:    ', expected: null }
]

export type YtdlpSkipQueueRetriesCase = {
  label: string
  errorHint: string | null
  stderrFallback: string | null
  exitCode?: number | null
  expected: boolean
}

export const YTDLP_SKIP_QUEUE_RETRIES_CASES: readonly YtdlpSkipQueueRetriesCase[] = [
  { label: 'private video', errorHint: 'Private video', stderrFallback: null, expected: true },
  {
    label: 'stderr unavailable',
    errorHint: null,
    stderrFallback: '[youtube] Video unavailable',
    expected: true
  },
  { label: '403', errorHint: 'HTTP Error 403: Forbidden', stderrFallback: null, expected: true },
  {
    label: 'transient webpage',
    errorHint: 'Unable to download webpage',
    stderrFallback: 'Connection timed out',
    expected: false
  },
  {
    label: 'premature close',
    errorHint: 'Premature close',
    stderrFallback: 'HTTP Error 408',
    expected: false
  },
  { label: 'null hints', errorHint: null, stderrFallback: null, expected: false },
  { label: 'live ended', errorHint: 'Live stream has ended', stderrFallback: null, expected: true },
  {
    label: 'premiere',
    errorHint: null,
    stderrFallback: 'Premiere will begin in 10 minutes',
    expected: true
  },
  { label: 'drm', errorHint: 'Video is DRM protected', stderrFallback: null, expected: true },
  {
    label: 'no space',
    errorHint: null,
    stderrFallback: 'OSError: [Errno 28] No space left on device',
    expected: true
  },
  { label: 'ffmpeg missing', errorHint: 'ffmpeg: not found', stderrFallback: null, expected: true },
  { label: 'no formats', errorHint: 'No video formats found', stderrFallback: null, expected: true },
  {
    label: 'format unavailable',
    errorHint: null,
    stderrFallback: 'ERROR: requested format is not available',
    expected: true
  },
  {
    label: 'unsupported url',
    errorHint: null,
    stderrFallback: 'Unsupported URL: foo',
    expected: true
  },
  {
    label: 'transient beats unavailable',
    errorHint: 'ERROR: Video unavailable',
    stderrFallback: 'ERROR: Unable to download webpage: HTTP Error 503',
    expected: false
  },
  { label: 'exit 2', errorHint: null, stderrFallback: null, exitCode: 2, expected: true },
  { label: 'exit 100', errorHint: null, stderrFallback: null, exitCode: 100, expected: true },
  { label: 'exit 101', errorHint: null, stderrFallback: null, exitCode: 101, expected: true },
  { label: 'exit 1', errorHint: null, stderrFallback: null, exitCode: 1, expected: false }
]

export type YtdlpClassifyFailureCase = {
  label: string
  errorHint: string | null
  stderrFallback: string | null
  exitCode?: number | null
  expected: YtdlpQueueFailureKind
}

export const YTDLP_CLASSIFY_TRANSIENT_CASES: readonly YtdlpClassifyFailureCase[] = [
  {
    label: '503',
    errorHint: 'Got server HTTP error: HTTP Error 503',
    stderrFallback: null,
    expected: 'transient_network'
  },
  {
    label: '504',
    errorHint: 'HTTP Error 504: Gateway Timeout',
    stderrFallback: null,
    expected: 'transient_network'
  },
  { label: 'broken pipe', errorHint: null, stderrFallback: 'Broken pipe', expected: 'transient_network' },
  {
    label: '502',
    errorHint: null,
    stderrFallback: '502 Bad Gateway',
    expected: 'transient_network'
  },
  {
    label: '408',
    errorHint: 'HTTP Error 408: Request Timeout',
    stderrFallback: null,
    expected: 'transient_network'
  },
  {
    label: 'premature close',
    errorHint: null,
    stderrFallback: 'Connection prematurely closed',
    expected: 'transient_network'
  },
  {
    label: 'signature',
    errorHint: 'Signature extraction failed',
    stderrFallback: null,
    expected: 'transient_network'
  },
  {
    label: 'rate limit',
    errorHint: null,
    stderrFallback: 'Rate limit exceeded',
    expected: 'transient_network'
  },
  {
    label: '521',
    errorHint: 'HTTP Error 521: Web Server Is Down',
    stderrFallback: null,
    expected: 'transient_network'
  },
  {
    label: 'eof protocol',
    errorHint: null,
    stderrFallback: 'EOF occurred in violation of protocol',
    expected: 'transient_network'
  },
  {
    label: 'timeout beats exit 2',
    errorHint: 'Connection timed out',
    stderrFallback: null,
    exitCode: 2,
    expected: 'transient_network'
  }
]

export const YTDLP_CLASSIFY_SOURCE_BLOCK_CASES: readonly YtdlpClassifyFailureCase[] = [
  {
    label: 'private',
    errorHint: 'Private video',
    stderrFallback: null,
    expected: 'likely_source_block'
  },
  {
    label: 'geo',
    errorHint: 'Not available in your country',
    stderrFallback: null,
    expected: 'likely_source_block'
  },
  {
    label: 'location',
    errorHint: 'Not available from your location',
    stderrFallback: null,
    expected: 'likely_source_block'
  },
  {
    label: 'bot',
    errorHint: "Sign in to confirm you're not a bot",
    stderrFallback: null,
    expected: 'likely_source_block'
  },
  {
    label: 'inappropriate',
    errorHint: 'This video may be inappropriate for some users',
    stderrFallback: null,
    expected: 'likely_source_block'
  },
  {
    label: 'drm',
    errorHint: 'DRM protected video',
    stderrFallback: null,
    expected: 'likely_source_block'
  },
  {
    label: 'no formats',
    errorHint: 'No video formats found',
    stderrFallback: null,
    expected: 'likely_source_block'
  },
  {
    label: 'no space stderr',
    errorHint: null,
    stderrFallback: 'ERROR: No space left on device',
    expected: 'likely_source_block'
  },
  {
    label: 'empty file',
    errorHint: 'The downloaded file is empty',
    stderrFallback: null,
    expected: 'likely_source_block'
  }
]

export const YTDLP_CLASSIFY_EXIT_CODE_CASES: readonly YtdlpClassifyFailureCase[] = [
  {
    label: 'exit 2',
    errorHint: null,
    stderrFallback: null,
    exitCode: 2,
    expected: 'exit_bad_options'
  },
  {
    label: 'exit 100',
    errorHint: null,
    stderrFallback: null,
    exitCode: 100,
    expected: 'exit_needs_restart'
  },
  {
    label: 'exit 101',
    errorHint: null,
    stderrFallback: null,
    exitCode: 101,
    expected: 'exit_download_limit'
  },
  {
    label: 'exit 1 unknown',
    errorHint: null,
    stderrFallback: null,
    exitCode: 1,
    expected: 'unknown'
  }
]

export type YtdlpSkipRetriesForKindCase = {
  label: string
  kind: YtdlpQueueFailureKind
  expected: boolean
}

export const YTDLP_SKIP_RETRIES_FOR_KIND_CASES: readonly YtdlpSkipRetriesForKindCase[] = [
  { label: 'transient', kind: 'transient_network', expected: false },
  { label: 'unknown', kind: 'unknown', expected: false },
  { label: 'source', kind: 'likely_source_block', expected: true },
  { label: 'exit 2', kind: 'exit_bad_options', expected: true },
  { label: 'exit 100', kind: 'exit_needs_restart', expected: true },
  { label: 'exit 101', kind: 'exit_download_limit', expected: true }
]
