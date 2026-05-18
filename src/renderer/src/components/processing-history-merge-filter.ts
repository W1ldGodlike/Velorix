import type {
  ProcessingHistoryFilter,
  ProcessingHistoryKind,
  ProcessingHistoryOutcome
} from '../../../shared/processing-history-contract'

export function mergeProcessingHistoryFilter(
  current: ProcessingHistoryFilter,
  patch: {
    kind?: ProcessingHistoryKind | ''
    outcome?: ProcessingHistoryOutcome | ''
    query?: string
  }
): ProcessingHistoryFilter {
  return {
    ...(patch.kind !== undefined
      ? patch.kind
        ? { kind: patch.kind }
        : {}
      : current.kind
        ? { kind: current.kind }
        : {}),
    ...(patch.outcome !== undefined
      ? patch.outcome
        ? { outcome: patch.outcome }
        : {}
      : current.outcome
        ? { outcome: current.outcome }
        : {}),
    ...(patch.query !== undefined
      ? patch.query.trim()
        ? { query: patch.query.trim() }
        : {}
      : current.query
        ? { query: current.query }
        : {})
  }
}
