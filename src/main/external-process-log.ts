import { formatChildProcessExitCode } from '../shared/child-process-exit-code'
import { logInfo } from './logger-service'

export function formatExternalProcessExitCode(code: number | null | undefined): string {
  return formatChildProcessExitCode(code)
}

export type ExternalProcessStream = 'stdout' | 'stderr' | 'lifecycle'

const MAX_EXTERNAL_PROCESS_LINE_CHARS = 1200

export function sanitizeExternalProcessLogLine(raw: string): string {
  let out = ''
  for (let i = 0; i < raw.length && out.length < MAX_EXTERNAL_PROCESS_LINE_CHARS; i++) {
    const code = raw.charCodeAt(i)
    out += (code >= 0 && code < 32) || code === 127 ? ' ' : raw[i]
  }
  return raw.length > MAX_EXTERNAL_PROCESS_LINE_CHARS ? `${out}…[truncated]` : out
}

export function formatExternalProcessLogMessage(
  processName: string,
  stream: ExternalProcessStream,
  line: string
): string {
  const name = sanitizeExternalProcessLogLine(processName.trim() || 'process')
  const text = sanitizeExternalProcessLogLine(line.trimEnd())
  return `[${name}] [${stream}] ${text}`
}

/**
 * §18 — общий guarded-лог stdout/stderr внешних движков.
 * Полный argv намеренно не пишем: в нём могут быть URL, cookies и локальные приватные пути.
 */
export function logExternalProcessLine(
  processName: string,
  stream: ExternalProcessStream,
  line: string
): void {
  const text = line.trimEnd()
  if (text.length === 0) {
    return
  }
  logInfo('external-process', formatExternalProcessLogMessage(processName, stream, text))
}
