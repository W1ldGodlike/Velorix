/** §8 — пакеты expected fullLine для smoke downloads-сценариев терминала. */
export type { TerminalDownloadsLineBatch } from './terminal-downloads-line-batches-types'
import { TERMINAL_DOWNLOADS_LINE_BATCHES_A } from './terminal-downloads-line-batches-a'
import { TERMINAL_DOWNLOADS_LINE_BATCHES_B } from './terminal-downloads-line-batches-b'
import { TERMINAL_DOWNLOADS_LINE_BATCHES_C } from './terminal-downloads-line-batches-c'

export const TERMINAL_DOWNLOADS_LINE_BATCHES = [
  ...TERMINAL_DOWNLOADS_LINE_BATCHES_A,
  ...TERMINAL_DOWNLOADS_LINE_BATCHES_B,
  ...TERMINAL_DOWNLOADS_LINE_BATCHES_C
] as const
