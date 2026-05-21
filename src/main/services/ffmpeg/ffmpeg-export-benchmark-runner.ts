import { mkdirSync, mkdtempSync, rmSync, unlinkSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

import { FLUXALLOY_APP_DATA_ENV, resolveAppTempDirectory } from '../../core/app-data-root-paths'
import { buildFfmpegExportArgv } from '../../../shared/ffmpeg-export-argv'
import {
  FFMPEG_EXPORT_BENCHMARK_SAMPLE_SEC,
  type FfmpegExportBenchmarkProgressPayload,
  type FfmpegExportBenchmarkRequestPayload,
  type FfmpegExportBenchmarkResult,
  type FfmpegExportBenchmarkRow
} from '../../../shared/ffmpeg-export-benchmark-contract'
import { buildFfmpegExportBenchmarkCandidates } from '../../../shared/ffmpeg-export-benchmark-candidates'
import { buildFfmpegExportBenchmarkHardwareHintsFromHwProbe } from '../../../shared/ffmpeg-export-benchmark-hardware'
import { estimateFfmpegBenchmarkFullEncodeSec } from '../../../shared/ffmpeg-export-benchmark-metrics'
import { parseFfmpegExportBenchmarkLoadThreshold } from '../../../shared/ffmpeg-export-benchmark-load-threshold'
import {
  ffmpegExportBenchmarkOnlyAvailable,
  pickFfmpegExportBenchmarkRecommended
} from '../../../shared/ffmpeg-export-benchmark-rank'
import { FFMPEG_EXPORT_CANCELLED_ERROR } from '../../../shared/ffmpeg-export-contract'
import { resolveFfmpegExportJobOptionsFromAppSettings } from './ffmpeg-export-resolve-from-settings'
import { resolveFfmpegExportJobPlan } from './ffmpeg-export-service-job-resolve'
import { runFfmpegExportBenchmarkTrial } from './ffmpeg-export-benchmark-trial'
import { probeNvidiaSmiOnce } from '../../core/system-gpu-load-sampler'
import { probeFfmpegHwEncoders } from './ffmpeg-hw-encoder-probe-main'
import { createEmptyFfmpegHwEncodersSnapshot } from '../../../shared/ffmpeg-hw-encoder-probe'
import type { AppSettings } from '../../../shared/settings-contract'

export async function runFfmpegExportBenchmark(params: {
  ffmpegPath: string
  inputPath: string
  settings: AppSettings
  request: FfmpegExportBenchmarkRequestPayload
  lutResourcesRoot: string
  signal: AbortSignal
  onProgress?: (p: FfmpegExportBenchmarkProgressPayload) => void
}): Promise<FfmpegExportBenchmarkResult> {
  const uloc = params.request.uiLocale ?? 'ru'
  const exportOpts = resolveFfmpegExportJobOptionsFromAppSettings(params.settings, {
    ...params.request,
    twoPass: false
  })
  const sampleSec = FFMPEG_EXPORT_BENCHMARK_SAMPLE_SEC
  const trim = { inSec: 0, outSec: sampleSec }
  const probeDurationSec = params.request.probeDurationSec ?? null
  const fullDurationSec =
    probeDurationSec !== null && probeDurationSec > sampleSec ? probeDurationSec : sampleSec

  let hwSnap = createEmptyFfmpegHwEncodersSnapshot()
  let benchmarkHardware = undefined
  try {
    const pr = await probeFfmpegHwEncoders(params.ffmpegPath)
    if (pr.ok) {
      hwSnap = pr.snapshot
      benchmarkHardware = buildFfmpegExportBenchmarkHardwareHintsFromHwProbe(pr)
    }
  } catch {
    /* probe optional */
  }

  const candidates = buildFfmpegExportBenchmarkCandidates(hwSnap, benchmarkHardware)
  const loadThresholdPercent = parseFfmpegExportBenchmarkLoadThreshold(
    params.settings.ffmpegExportBenchmarkLoadThresholdPercent
  )
  const economyLowPriority = exportOpts.economyMode === true
  const nvidiaSmi = await probeNvidiaSmiOnce()
  const nvidiaSmiPath = nvidiaSmi.ok ? nvidiaSmi.path : null
  const rows: FfmpegExportBenchmarkRow[] = []

  let tmpDir: string | null = null
  try {
    const appDataRoot = process.env[FLUXALLOY_APP_DATA_ENV]
    const appTemp = appDataRoot
      ? resolveAppTempDirectory(appDataRoot)
      : join(tmpdir(), 'fluxalloy-export-temp')
    mkdirSync(appTemp, { recursive: true })
    tmpDir = mkdtempSync(join(appTemp, 'fa-bench-'))

    let index = 0
    for (const candidate of candidates) {
      if (params.signal.aborted) {
        return { ok: false, cancelled: true }
      }
      index += 1
      params.onProgress?.({
        index,
        total: candidates.length,
        videoCodec: candidate,
        message: candidate
      })

      const outPath = join(tmpDir, `bench-${candidate.replace(/[^a-z0-9_-]+/gi, '_')}.mp4`)
      const plan = await resolveFfmpegExportJobPlan({
        ffmpegPath: params.ffmpegPath,
        inputPath: params.inputPath,
        outputPath: outPath,
        trim,
        probeDurationSec: fullDurationSec,
        ...exportOpts,
        videoCodec: candidate,
        twoPass: false,
        lutResourcesRoot: params.lutResourcesRoot,
        signal: params.signal,
        uiLocale: uloc
      })

      if (!plan.ok) {
        rows.push({
          videoCodec: candidate,
          ok: false,
          elapsedMs: null,
          avgFps: null,
          estimatedFullSec: null,
          outputBytes: null,
          cpuLoadPeakPercent: null,
          cpuLoadAvgPercent: null,
          gpuLoadPeakPercent: null,
          gpuLoadAvgPercent: null,
          error: plan.error
        })
        continue
      }

      const args = buildFfmpegExportArgv(plan.baseArgvParams)
      const trial = await runFfmpegExportBenchmarkTrial({
        ffmpegPath: params.ffmpegPath,
        args,
        outputPath: outPath,
        signal: params.signal,
        ...(economyLowPriority ? { lowProcessPriority: true } : {}),
        ...(nvidiaSmiPath !== null ? { nvidiaSmiPath } : {})
      })

      try {
        unlinkSync(outPath)
      } catch {
        /* temp */
      }

      if (!trial.ok) {
        if (trial.error === FFMPEG_EXPORT_CANCELLED_ERROR) {
          return { ok: false, cancelled: true }
        }
        rows.push({
          videoCodec: candidate,
          ok: false,
          elapsedMs: null,
          avgFps: null,
          estimatedFullSec: null,
          outputBytes: null,
          cpuLoadPeakPercent: null,
          cpuLoadAvgPercent: null,
          gpuLoadPeakPercent: null,
          gpuLoadAvgPercent: null,
          error: trial.error
        })
        continue
      }

      rows.push({
        videoCodec: candidate,
        ok: true,
        elapsedMs: trial.elapsedMs,
        avgFps: trial.avgFps,
        estimatedFullSec: estimateFfmpegBenchmarkFullEncodeSec(
          trial.elapsedMs,
          sampleSec,
          fullDurationSec
        ),
        outputBytes: trial.outputBytes,
        cpuLoadPeakPercent: trial.cpuLoadPeakPercent,
        cpuLoadAvgPercent: trial.cpuLoadAvgPercent,
        gpuLoadPeakPercent: trial.gpuLoadPeakPercent,
        gpuLoadAvgPercent: trial.gpuLoadAvgPercent,
        error: null
      })
    }
  } finally {
    if (tmpDir !== null) {
      try {
        rmSync(tmpDir, { recursive: true, force: true })
      } catch {
        /* temp */
      }
    }
  }

  if (params.signal.aborted) {
    return { ok: false, cancelled: true }
  }

  const recommendation = pickFfmpegExportBenchmarkRecommended(rows, loadThresholdPercent)
  if (recommendation === null) {
    return {
      ok: false,
      error: uloc === 'ru' ? 'Ни один кодер не завершил тест' : 'No encoder finished the benchmark'
    }
  }

  return {
    ok: true,
    sampleSec,
    fullDurationSec,
    loadThresholdPercent,
    recommendedCodec: recommendation.codec,
    onlyAvailable: ffmpegExportBenchmarkOnlyAvailable(rows),
    recommendedIgnoredLoadThreshold: recommendation.ignoredLoadThreshold,
    rows
  }
}
