import { spawn } from 'child_process'
import { statSync } from 'fs'

import { FFMPEG_EXPORT_CANCELLED_ERROR } from '../../../shared/ffmpeg-export-contract'
import { collectFfmpegBenchmarkStatsFromStderr } from '../../../shared/ffmpeg-export-benchmark-metrics'
import { SystemCpuLoadSampler } from '../../../shared/system-cpu-util'
import { SystemGpuLoadSampler } from '../../core/system-gpu-load-sampler'
import { normalizeChildProcessExitCode } from '../../../shared/child-process-exit-code'
import {
  formatExternalProcessExitCode,
  logExternalProcessLine
} from '../../core/external-process-log'

/**
 * Один прогон бенчмарка: короткий encode в файл, wall time + fps из stderr.
 */
export function runFfmpegExportBenchmarkTrial(params: {
  ffmpegPath: string
  args: string[]
  outputPath: string
  signal: AbortSignal
  lowProcessPriority?: boolean
  nvidiaSmiPath?: string | null
}): Promise<
  | {
      ok: true
      elapsedMs: number
      avgFps: number | null
      outputBytes: number
      cpuLoadPeakPercent: number | null
      cpuLoadAvgPercent: number | null
      gpuLoadPeakPercent: number | null
      gpuLoadAvgPercent: number | null
    }
  | { ok: false; error: string }
> {
  return new Promise((resolve) => {
    const started = performance.now()
    let stderrBuf = ''
    const cpuSampler = new SystemCpuLoadSampler()
    cpuSampler.start()
    const gpuSampler =
      typeof params.nvidiaSmiPath === 'string' && params.nvidiaSmiPath.length > 0
        ? new SystemGpuLoadSampler(params.nvidiaSmiPath)
        : null
    gpuSampler?.start()
    const child = spawn(params.ffmpegPath, params.args, {
      windowsHide: true,
      stdio: ['ignore', 'ignore', 'pipe'],
      signal: params.signal,
      ...(params.lowProcessPriority === true ? { priority: 'belowNormal' as const } : {})
    })
    logExternalProcessLine('ffmpeg-export-benchmark', 'lifecycle', 'started')

    child.stderr?.setEncoding('utf8')
    child.stderr?.on('data', (chunk: string) => {
      stderrBuf += chunk
    })

    child.on('error', (err) => {
      logExternalProcessLine('ffmpeg-export-benchmark', 'lifecycle', `error ${err.message}`)
      if (params.signal.aborted || err.name === 'AbortError') {
        resolve({ ok: false, error: FFMPEG_EXPORT_CANCELLED_ERROR })
        return
      }
      resolve({ ok: false, error: err.message })
    })

    child.on('close', (code) => {
      logExternalProcessLine(
        'ffmpeg-export-benchmark',
        'lifecycle',
        `closed exitCode=${formatExternalProcessExitCode(code)}`
      )
      const cpuLoad = cpuSampler.stop()
      const gpuLoad = gpuSampler?.stop() ?? { peakPercent: null, avgPercent: null }
      if (params.signal.aborted) {
        resolve({ ok: false, error: FFMPEG_EXPORT_CANCELLED_ERROR })
        return
      }
      const elapsedMs = Math.max(1, Math.round(performance.now() - started))
      const stats = collectFfmpegBenchmarkStatsFromStderr(stderrBuf)
      const exitNorm = normalizeChildProcessExitCode(code)
      if (exitNorm !== 0) {
        const tail = stderrBuf.trim().split(/\r?\n/).slice(-3).join(' ')
        const exitLabel = formatExternalProcessExitCode(code)
        const hint = tail.length > 0 ? tail.slice(0, 240) : `exit ${exitLabel}`
        resolve({ ok: false, error: hint })
        return
      }
      try {
        const st = statSync(params.outputPath)
        resolve({
          ok: true,
          elapsedMs,
          avgFps: stats.avgFps,
          outputBytes: st.size,
          cpuLoadPeakPercent: cpuLoad.peakPercent,
          cpuLoadAvgPercent: cpuLoad.avgPercent,
          gpuLoadPeakPercent: gpuLoad.peakPercent,
          gpuLoadAvgPercent: gpuLoad.avgPercent
        })
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        resolve({ ok: false, error: msg })
      }
    })
  })
}
