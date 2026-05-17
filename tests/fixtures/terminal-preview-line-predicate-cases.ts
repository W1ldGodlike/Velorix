/** Составные предикаты fullLine для smoke preview/ffprobe (§8 терминал). */
export type { TerminalPreviewLinePredicate } from './terminal-preview-line-predicate-cases-types'
import { TERMINAL_PREVIEW_LINE_PREDICATE_CASES_JSON } from './terminal-preview-line-predicate-cases-json'
import { TERMINAL_PREVIEW_LINE_PREDICATE_CASES_STREAM_A } from './terminal-preview-line-predicate-cases-stream-a'
import { TERMINAL_PREVIEW_LINE_PREDICATE_CASES_STREAM_B } from './terminal-preview-line-predicate-cases-stream-b'
import { TERMINAL_PREVIEW_LINE_PREDICATE_CASES_FORMAT } from './terminal-preview-line-predicate-cases-format'

export const TERMINAL_PREVIEW_LINE_PREDICATES = [
  ...TERMINAL_PREVIEW_LINE_PREDICATE_CASES_JSON,
  ...TERMINAL_PREVIEW_LINE_PREDICATE_CASES_STREAM_A,
  ...TERMINAL_PREVIEW_LINE_PREDICATE_CASES_STREAM_B,
  ...TERMINAL_PREVIEW_LINE_PREDICATE_CASES_FORMAT
] as const
