import type { TerminalCommandHintEntry } from '../../shared/terminal-contract'
import type { YtdlpCommandHintEntry } from '../../shared/ytdlp-download-contract'
import { uiText, uiTextVars } from './locales/ui-text'

export type WorkspaceTab = 'editor' | 'downloads' | 'terminal'

/** §8 — расширенный порядок подсказок терминала при открытом медиа в превью. */
export const TERMINAL_HINT_VIDEO_EXTS = new Set([
  '3gp',
  'asf',
  'avi',
  'flv',
  'm2ts',
  'm4v',
  'mkv',
  'mov',
  'mp4',
  'mpeg',
  'mpg',
  'mts',
  'ogv',
  'ts',
  'webm',
  'wmv'
])

export const TERMINAL_HINT_AUDIO_EXTS = new Set([
  'aac',
  'aiff',
  'alac',
  'flac',
  'm4a',
  'mp3',
  'ogg',
  'opus',
  'wav',
  'wma'
])

/** §15 — slug `Help/ffmpeg-terminal-hints.md` для deep-link из подсказок UI. */
export const KNOWLEDGE_SLUG_FFMPEG_TERMINAL_HINTS = 'ffmpeg-terminal-hints'

export function previewPathExtensionLower(path: string | null): string | null {
  if (typeof path !== 'string' || path.trim().length === 0) {
    return null
  }
  const base = path.replace(/\\/g, '/').split('/').pop() ?? ''
  const dot = base.lastIndexOf('.')
  if (dot <= 0 || dot >= base.length - 1) {
    return null
  }
  return base.slice(dot + 1).toLowerCase()
}

export function terminalHintToolRank(
  tool: TerminalCommandHintEntry['tool'],
  workspaceTab: WorkspaceTab,
  mediaInPreview: boolean
): number {
  if (workspaceTab === 'downloads') {
    return tool === 'yt-dlp' ? 0 : tool === 'ffmpeg' ? 1 : 2
  }
  if (mediaInPreview) {
    return tool === 'ffprobe' ? 0 : tool === 'ffmpeg' ? 1 : 2
  }
  return tool === 'ffmpeg' ? 0 : tool === 'ffprobe' ? 1 : 2
}

export function terminalHintInsertAccessibleDescription(hint: TerminalCommandHintEntry): string {
  const summaryRaw = hint.summary?.trim() ?? ''
  const summary =
    summaryRaw.length > 180
      ? `${summaryRaw.slice(0, 178)}${uiText('commonUnicodeEllipsis')}`
      : summaryRaw
  if (summary.length > 0) {
    return uiTextVars('terminalHintInsertButtonAriaTemplate', {
      token: hint.token,
      tool: hint.tool,
      summary
    })
  }
  return uiTextVars('terminalHintInsertButtonAriaNoSummaryTemplate', {
    token: hint.token,
    tool: hint.tool
  })
}

export function downloadsCatalogHintTokenAccessibleDescription(
  category: string,
  hint: YtdlpCommandHintEntry
): string {
  const summaryRaw = hint.summary?.trim() ?? ''
  const summary =
    summaryRaw.length > 180
      ? `${summaryRaw.slice(0, 178)}${uiText('commonUnicodeEllipsis')}`
      : summaryRaw
  if (summary.length > 0) {
    return uiTextVars('downloadsHintTokenButtonAriaTemplate', {
      category,
      token: hint.token,
      summary
    })
  }
  return uiTextVars('downloadsHintTokenButtonAriaNoSummaryTemplate', {
    category,
    token: hint.token
  })
}
