import { execFile } from 'child_process'
import { dirname } from 'path'

import type { AppUiLocale } from '../../../shared/app-ui-locale'
import {
  formatTerminalEngineMissingInSettings,
  getMainApplicationStrings
} from '../../../shared/main-application-locale'
import type { TerminalRunResult } from '../../../shared/terminal-contract'
import type { AppPaths } from '../../core/app-paths'
import { nativeMainPathEnvSeparator } from '../../platform'
import { resolveEngineExecutablePath, type EnginePathOverrides } from '../engines/engine-service'
import { logInfo, logWarn } from '../../core/logger-service'
import { isGrantedMediaPath } from '../../core/media-protocol'
import { appendTerminalCliSessionLog, terminalCliLogIsoStamp } from './terminal-service-log'
import {
  parseTerminalCommandLine,
  resolveTerminalCurrentFileArgs,
  trimTerminalOutput
} from './terminal-service-parse'
import {
  TERMINAL_CLI_LOG_STDERR_CAP,
  TERMINAL_MAX_OUTPUT_CHARS
} from './terminal-service-constants'

export function runTerminalCommand(params: {
  paths: AppPaths
  overrides?: EnginePathOverrides | undefined
  line: unknown
  currentFilePath?: string | null
  locale: AppUiLocale
}): Promise<TerminalRunResult> {
  const ud = params.paths.userData
  const S = getMainApplicationStrings(params.locale)
  const parsed = parseTerminalCommandLine(params.line, S)
  if (!parsed.ok) {
    if (typeof params.line === 'string' && params.line.trim().length > 0) {
      const brief = params.line.trim().slice(0, 400)
      logWarn('terminal', `blocked: ${parsed.error}`, brief)
      appendTerminalCliSessionLog({
        userData: ud,
        block: `\n=== ${terminalCliLogIsoStamp()} BLOCKED ===\n${brief}\n${parsed.error}\n`
      })
    }
    return Promise.resolve(parsed)
  }
  const sub = resolveTerminalCurrentFileArgs({
    args: parsed.args,
    currentFilePath: params.currentFilePath,
    grantPath: isGrantedMediaPath,
    strings: S
  })
  if (!sub.ok) {
    if (typeof params.line === 'string' && params.line.trim().length > 0) {
      const brief = params.line.trim().slice(0, 400)
      logWarn('terminal', `blocked: ${sub.error}`, brief)
      appendTerminalCliSessionLog({
        userData: ud,
        block: `\n=== ${terminalCliLogIsoStamp()} BLOCKED ===\n${brief}\n${sub.error}\n`
      })
    }
    return Promise.resolve(sub)
  }
  const argv = sub.args
  const executablePath = resolveEngineExecutablePath(params.paths, parsed.tool, params.overrides)
  if (!executablePath) {
    logWarn('terminal', `blocked: engine ${parsed.tool} not found`)
    const toolLine = S.terminalBlockedLogToolLine.replace(/\{tool\}/g, parsed.tool)
    const miss = formatTerminalEngineMissingInSettings(params.locale, parsed.tool)
    appendTerminalCliSessionLog({
      userData: ud,
      block: `\n=== ${terminalCliLogIsoStamp()} BLOCKED ===\n${toolLine}\n${miss}\n`
    })
    return Promise.resolve({
      ok: false,
      error: formatTerminalEngineMissingInSettings(params.locale, parsed.tool)
    })
  }
  const started = Date.now()
  return new Promise((resolve) => {
    execFile(
      executablePath,
      argv,
      {
        windowsHide: true,
        timeout: 120_000,
        maxBuffer: TERMINAL_MAX_OUTPUT_CHARS * 4,
        env: {
          ...process.env,
          PATH: `${dirname(executablePath)}${nativeMainPathEnvSeparator()}${process.env['PATH'] ?? ''}`
        }
      },
      (error, stdout, stderr) => {
        const code =
          error && 'code' in error && typeof (error as { code?: unknown }).code === 'number'
            ? (error as { code: number }).code
            : error
              ? 1
              : 0
        const elapsedMs = Date.now() - started
        const argvBrief = JSON.stringify([parsed.tool, ...argv]).slice(0, 520)
        if (code === 0) {
          logInfo('terminal', `run ok tool=${parsed.tool} code=0 ${elapsedMs}ms`, argvBrief)
        } else {
          logWarn(
            'terminal',
            `run tool=${parsed.tool} code=${code ?? 'n/a'} ${elapsedMs}ms`,
            argvBrief,
            trimTerminalOutput(stderr).slice(0, 600)
          )
        }
        const errTail = trimTerminalOutput(stderr)
        const errForLog =
          errTail.length > TERMINAL_CLI_LOG_STDERR_CAP
            ? `${errTail.slice(0, TERMINAL_CLI_LOG_STDERR_CAP)}\n… stderr truncated …\n`
            : errTail
        appendTerminalCliSessionLog({
          userData: ud,
          block: `\n=== ${terminalCliLogIsoStamp()} code=${code ?? 'n/a'} tool=${parsed.tool} ${elapsedMs}ms ===\nargv: ${argvBrief}\nstderr:\n${errForLog.trim() ? errForLog : '(empty)'}\n`
        })
        resolve({
          ok: true,
          tool: parsed.tool,
          args: argv,
          code,
          stdout: trimTerminalOutput(stdout),
          stderr: trimTerminalOutput(stderr),
          elapsedMs
        })
      }
    )
  })
}
