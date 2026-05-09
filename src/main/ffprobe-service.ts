import { execFile } from 'child_process'

import type { AppPaths } from './app-paths'
import { resolveEngineExecutablePath } from './engine-service'

/** Краткий срез JSON ffprobe для главного окна §7 (превью и таймлайн). */
export interface MediaProbeSuccess {
  ok: true
  /** Длительность в секундах; `null`, если контейнер её не даёт. */
  durationSec: number | null
  /** Первый видеопоток или `null` (только аудио и т.п.). */
  video: { width: number; height: number; codec: string } | null
  /** Кодек первой аудиодорожки или `null`. */
  audioCodec: string | null
  /** Короткое имя формата контейнера ffprobe. */
  formatName: string | null
}

export type MediaProbeResult = MediaProbeSuccess | { ok: false; error: string }

interface FfprobeJson {
  format?: { duration?: string; format_name?: string }
  streams?: Array<{ codec_type?: string; codec_name?: string; width?: number; height?: number }>
}

function runFfprobeJson(ffprobePath: string, mediaPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(
      ffprobePath,
      [
        '-hide_banner',
        '-v',
        'error',
        '-print_format',
        'json',
        '-show_format',
        '-show_streams',
        mediaPath
      ],
      { timeout: 60_000, windowsHide: true, maxBuffer: 20 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr.trim() || error.message))
          return
        }
        resolve(stdout)
      }
    )
  })
}

export async function probeMediaFile(
  paths: AppPaths,
  absoluteMediaPath: string
): Promise<MediaProbeResult> {
  const ffprobe = resolveEngineExecutablePath(paths, 'ffprobe')
  if (!ffprobe) {
    return { ok: false, error: 'ffprobe не найден — установите движки через «Скачать движки».' }
  }

  let rawJson: string
  try {
    rawJson = await runFfprobeJson(ffprobe, absoluteMediaPath)
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Ошибка ffprobe'
    }
  }

  let parsed: FfprobeJson
  try {
    parsed = JSON.parse(rawJson) as FfprobeJson
  } catch {
    return { ok: false, error: 'Некорректный JSON ffprobe' }
  }

  const durRaw = parsed.format?.duration
  const durationSec =
    typeof durRaw === 'string' && durRaw.trim() !== ''
      ? Number.parseFloat(durRaw)
      : typeof durRaw === 'number'
        ? durRaw
        : NaN

  let video: MediaProbeSuccess['video'] = null
  let audioCodec: string | null = null

  for (const s of parsed.streams ?? []) {
    if (
      s.codec_type === 'video' &&
      video === null &&
      s.width !== undefined &&
      s.height !== undefined
    ) {
      video = {
        width: s.width,
        height: s.height,
        codec: s.codec_name ?? 'unknown'
      }
    }
    if (s.codec_type === 'audio' && audioCodec === null && s.codec_name) {
      audioCodec = s.codec_name
    }
  }

  return {
    ok: true,
    durationSec: Number.isFinite(durationSec) ? durationSec : null,
    video,
    audioCodec,
    formatName:
      typeof parsed.format?.format_name === 'string'
        ? (parsed.format.format_name.split(',')[0] ?? null)
        : null
  }
}
