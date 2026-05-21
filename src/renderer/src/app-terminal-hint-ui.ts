import type { TerminalCommandHintEntry } from '../../shared/terminal-contract'
import { primaryTerminalHintExample } from '../../shared/terminal-hint-json-display'
import {
  formatTerminalHintRowLabel,
  formatTerminalHintRowSummary
} from '../../shared/terminal-hint-ui-copy'
import { getUiLocale } from './locales/ui-text'
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

export { KNOWLEDGE_SLUG_FFMPEG_TERMINAL_HINTS } from '../../shared/knowledge-contract'

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
  const locale = getUiLocale()
  const summaryRaw = formatTerminalHintRowSummary(hint, locale)
  const summary =
    summaryRaw.length > 180
      ? `${summaryRaw.slice(0, 178)}${uiText('commonUnicodeEllipsis')}`
      : summaryRaw
  const example = primaryTerminalHintExample(hint)
  const exampleShort =
    example !== undefined && example.length > 80
      ? `${example.slice(0, 78)}${uiText('commonUnicodeEllipsis')}`
      : example
  const tokenLabel = formatTerminalHintRowLabel(hint, locale)
  if (summary.length > 0) {
    return uiTextVars('terminalHintInsertButtonAriaTemplate', {
      token: tokenLabel,
      tool: hint.tool,
      summary:
        exampleShort !== undefined && exampleShort.length > 0
          ? `${summary}. ${uiText('terminalHintExampleLabel')} ${exampleShort}`
          : summary
    })
  }
  return uiTextVars('terminalHintInsertButtonAriaNoSummaryTemplate', {
    token: tokenLabel,
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
