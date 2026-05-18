import type { DownloadsHistoryListMode } from '../../../../shared/settings-contract'

export type { DownloadsHistoryListMode }

/** Карточек в режиме `compact` (как в legacy pop-out HTML). */
export const DOWNLOADS_HISTORY_COMPACT_VISIBLE_COUNT = 8

export function resolveDownloadsHistoryVisibleEntries<T>(
  entries: T[],
  listMode: DownloadsHistoryListMode
): T[] {
  return listMode === 'full'
    ? entries
    : entries.slice(0, DOWNLOADS_HISTORY_COMPACT_VISIBLE_COUNT)
}
