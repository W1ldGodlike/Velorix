import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

import type { FfmpegExportVideoCodecId } from '../shared/ffmpeg-export-contract'
import { FFMPEG_EXPORT_CANCELLED_ERROR } from '../shared/ffmpeg-export-contract'
import { buildFfmpegExportArgv } from '../shared/ffmpeg-export-argv'
import { runFfmpegExportOnce } from './ffmpeg-export-spawn-once'
import { resolveFfmpegExportJobPlan } from './ffmpeg-export-service-job-resolve'
import type { FfmpegExportJobParams } from './ffmpeg-export-service-job-resolve-types'

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
    wantTwoPass,
    baseArgvParams,
    segmentDur,
    uloc,
    secondPassProgressMessage,
    jobOnProgress,
    doneOk,
    doneErr
  } = plan

  if (!wantTwoPass) {
    const args = buildFfmpegExportArgv(baseArgvParams)
    const r = await runFfmpegExportOnce({
      ffmpegPath: params.ffmpegPath,
      args,
      signal: params.signal,
      segmentDur,
      uiLocale: uloc,
      ...(jobOnProgress !== undefined ? { onProgress: jobOnProgress } : {})
    })
    return r.ok ? doneOk() : doneErr(r.error)
  }

  let tmpDir: string | null = null
  try {
    tmpDir = mkdtempSync(join(tmpdir(), 'fa-x264tw-'))
    const passlogBase = join(tmpDir, 'pass')
    const nullSink = process.platform === 'win32' ? 'NUL' : '/dev/null'

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
      ...(jobOnProgress !== undefined ? { onProgress: jobOnProgress } : {})
    })
    if (!r1.ok) {
      return doneErr(r1.error)
    }
    if (params.signal.aborted) {
      return doneErr(FFMPEG_EXPORT_CANCELLED_ERROR)
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
      ...(jobOnProgress !== undefined ? { onProgress: jobOnProgress } : {})
    })
    return r2.ok ? doneOk() : doneErr(r2.error)
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
