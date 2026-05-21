import type { TerminalToolId } from '../../../shared/terminal-contract'

export const TERMINAL_ALLOWED_TOOLS: readonly TerminalToolId[] = ['ffmpeg', 'ffprobe', 'yt-dlp']
export const TERMINAL_MAX_LINE_CHARS = 2000
export const TERMINAL_MAX_TOKENS = 64
export const TERMINAL_MAX_OUTPUT_CHARS = 64_000
export const TERMINAL_CLI_LOG_MAX_BYTES = 512 * 1024
export const TERMINAL_CLI_LOG_KEEP_BYTES = 400 * 1024
export const TERMINAL_CLI_LOG_STDERR_CAP = 12_000
