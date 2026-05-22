import { mkdirSync, mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

import { VELORIX_APP_DATA_ENV, resolveAppTempDirectory } from '../../core/app-data-root-paths'
import type { FfmpegExportVideoCodecId } from '../../../shared/ffmpeg-export-contract'
import { FFMPEG_EXPORT_CANCELLED_ERROR } from '../../../shared/ffmpeg-export-contract'
import type { FfmpegExportArgvParams } from '../../../shared/ffmpeg-export-argv'
import { buildFfmpegExportArgv } from '../../../shared/ffmpeg-export-argv'
import {
  ffmpegExportArgvParamsWithCpuFallback,
  ffmpegExportSpawnFailureLooksLikeHwEncoder,
  ffmpegHwEncoderCpuFallback,
  isFfmpegHwExportVideoCodec
} from '../../../shared/ffmpeg-export-video-codec'
import { runFfmpegExportOnce } from './ffmpeg-export-spawn-once'
import { nativeMainDevNullPath } from '../../platform'
import { resolveFfmpegExportJobPlan } from './ffmpeg-export-service-job-resolve'
import type { FfmpegExportJobParams } from './ffmpeg-export-service-job-resolve-types'

type ExportOnceResult = { ok: true } | { ok: false; error: string }

/**
 * §7 — экспорт: один или два прохода libx264; двухпроход только с валидным `videoBitrate`.
 */
export async function runFfmpegExportJob(
  params: FfmpegExportJobParams
): Promise<
  | { ok: true; videoCodecUsed: FfmpegExportVideoCodecId }
  | { ok: false; error: string; videoCodecUsed: FfmpegExportVideoCodecId }
> {
  const plan = await resolveFfmpegExportJobPlan(params)
  if (!plan.ok) {
    return { ok: false, error: plan.error, videoCodecUsed: plan.videoCodecUsed }
  }

  const {
    videoCodec,
    wantTwoPass,
    baseArgvParams,
    segmentDur,
    uloc,
    secondPassProgressMessage,
    jobOnProgress
  } = plan

  let videoCodecUsed: FfmpegExportVideoCodecId = videoCodec

  const runOnce = async (argvParams: FfmpegExportArgvParams): Promise<ExportOnceResult> => {
    const args = buildFfmpegExportArgv(argvParams)
    return runFfmpegExportOnce({
      ffmpegPath: params.ffmpegPath,
      args,
      signal: params.signal,
      segmentDur,
      uiLocale: uloc,
      ...(argvParams.economyMode === true ? { lowProcessPriority: true } : {}),
      ...(jobOnProgress !== undefined ? { onProgress: jobOnProgress } : {})
    })
  }

  const runOnceWithHwCpuFallback = async (
    argvParams: FfmpegExportArgvParams
  ): Promise<ExportOnceResult> => {
    const r = await runOnce(argvParams)
    if (
      r.ok ||
      !isFfmpegHwExportVideoCodec(videoCodec) ||
      !ffmpegExportSpawnFailureLooksLikeHwEncoder(r.error)
    ) {
      return r
    }
    const fallback = ffmpegHwEncoderCpuFallback(videoCodec)
    videoCodecUsed = fallback
    return runOnce(ffmpegExportArgvParamsWithCpuFallback(argvParams, fallback))
  }

  if (!wantTwoPass) {
    const r = await runOnceWithHwCpuFallback(baseArgvParams)
    return r.ok ? { ok: true, videoCodecUsed } : { ok: false, error: r.error, videoCodecUsed }
  }

  let tmpDir: string | null = null
  try {
    const appDataRoot = process.env[VELORIX_APP_DATA_ENV]
    const appTemp = appDataRoot
      ? resolveAppTempDirectory(appDataRoot)
      : join(tmpdir(), 'VELORIX-export-temp')
    mkdirSync(appTemp, { recursive: true })
    tmpDir = mkdtempSync(join(appTemp, 'fa-x264tw-'))
    const passlogBase = join(tmpDir, 'pass')
    const nullSink = nativeMainDevNullPath()

    const argsPass1 = buildFfmpegExportArgv({
      ...baseArgvParams,
      twoPass: { pass: 1, passlogfile: passlogBase, nullDevice: nullSink }
    })
    const r1 = await runFfmpegExportOnce({
      ffmpegPath: params.ffmpegPath,
      args: argsPass1,
      signal: params.signal,
      segmentDur,
      uiLocale: uloc,
      mapPercent: (p) => p * 0.5,
      ...(baseArgvParams.economyMode === true ? { lowProcessPriority: true } : {}),
      ...(jobOnProgress !== undefined ? { onProgress: jobOnProgress } : {})
    })
    if (!r1.ok) {
      return { ok: false, error: r1.error, videoCodecUsed }
    }
    if (params.signal.aborted) {
      return { ok: false, error: FFMPEG_EXPORT_CANCELLED_ERROR, videoCodecUsed }
    }

    jobOnProgress?.({ percent: 50, message: secondPassProgressMessage })

    const argsPass2 = buildFfmpegExportArgv({
      ...baseArgvParams,
      twoPass: { pass: 2, passlogfile: passlogBase, nullDevice: nullSink }
    })
    const r2 = await runFfmpegExportOnce({
      ffmpegPath: params.ffmpegPath,
      args: argsPass2,
      signal: params.signal,
      segmentDur,
      uiLocale: uloc,
      mapPercent: (p) => 50 + p * 0.5,
      ...(baseArgvParams.economyMode === true ? { lowProcessPriority: true } : {}),
      ...(jobOnProgress !== undefined ? { onProgress: jobOnProgress } : {})
    })
    return r2.ok ? { ok: true, videoCodecUsed } : { ok: false, error: r2.error, videoCodecUsed }
  } finally {
    if (tmpDir !== null) {
      try {
        rmSync(tmpDir, { recursive: true, force: true })
      } catch {
        /* каталог временный — ошибки очистки не блокируют UI */
      }
    }
  }
}
