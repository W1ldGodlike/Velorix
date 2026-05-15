/** §4.6 / §7.4 — куда направлять глобальную вставку URL из буфера. */
export type EditorUrlPasteBehaviorId = 'downloads_window' | 'download_open_editor'

export const DEFAULT_EDITOR_URL_PASTE_BEHAVIOR: EditorUrlPasteBehaviorId = 'downloads_window'

export function parseEditorUrlPasteBehavior(raw: unknown): EditorUrlPasteBehaviorId {
  if (raw === 'download_open_editor') {
    return 'download_open_editor'
  }
  return DEFAULT_EDITOR_URL_PASTE_BEHAVIOR
}
