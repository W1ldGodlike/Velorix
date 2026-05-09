import { execFile } from 'child_process'

import type { AppPaths } from './app-paths'
import { resolveEngineExecutablePath, type EnginePathOverrides } from './engine-service'
import { logExternalProcessLine } from './external-process-log'

/** Строка таблицы дорожек §9 (компактный инспектор под превью). */
export interface MediaProbeTrackRow {
  index: number
  kind: 'video' | 'audio' | 'subtitle' | 'attachment' | 'data' | 'other'
  codec: string
  /** Одна строка: разрешение, fps, каналы, язык и т.д. */
  detail: string
}

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
  /** Расширенное имя контейнера (если есть). */
  formatLongName: string | null
  /** Средний битрейт файла в килобитах/с из `format.bit_rate`; `null`, если неизвестен. */
  bitrateKbps: number | null
  /** Все потоки в порядке индекса ffprobe. */
  tracks: MediaProbeTrackRow[]
  /** Сырой JSON stdout ffprobe (для §9: просмотр / копирование). */
  rawJson: string
}

export type MediaProbeResult = MediaProbeSuccess | { ok: false; error: string }

interface FfprobeJson {
  format?: {
    duration?: string
    format_name?: string
    format_long_name?: string
    bit_rate?: string
  }
  streams?: Array<{
    index?: number
    codec_type?: string
    codec_name?: string
    width?: number
    height?: number
    channels?: number
    sample_rate?: string
    channel_layout?: string
    avg_frame_rate?: string
    r_frame_rate?: string
    tags?: Record<string, string | number | undefined>
  }>
}

function parsePositiveNumber(raw: string | undefined): number | null {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return null
  }
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) && n > 0 ? n : null
}

/** Битрейт контейнера из ffprobe (`bit_rate` в бит/с) → килобиты/с для UI. */
function formatBitrateKbps(bitRateBitsPerSec: string | undefined): number | null {
  const bps = parsePositiveNumber(bitRateBitsPerSec)
  return bps === null ? null : bps / 1000
}

function parseFraction(rate: string | undefined): number | null {
  if (!rate || rate === '0/0') {
    return null
  }
  const parts = rate.split('/')
  if (parts.length !== 2) {
    return null
  }
  const a = Number(parts[0])
  const b = Number(parts[1])
  if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) {
    return null
  }
  const q = a / b
  return Number.isFinite(q) && q > 0 ? q : null
}

function tagString(
  tags: Record<string, string | number | undefined> | undefined,
  key: string
): string | null {
  if (!tags) {
    return null
  }
  const v = tags[key]
  if (typeof v === 'string' && v.trim() !== '') {
    return v.trim()
  }
  if (typeof v === 'number' && Number.isFinite(v)) {
    return String(v)
  }
  return null
}

function mapCodecType(raw: string | undefined): MediaProbeTrackRow['kind'] {
  switch (raw) {
    case 'video':
      return 'video'
    case 'audio':
      return 'audio'
    case 'subtitle':
      return 'subtitle'
    case 'attachment':
      return 'attachment'
    case 'data':
      return 'data'
    default:
      return 'other'
  }
}

function buildTrackDetail(stream: NonNullable<FfprobeJson['streams']>[number]): string {
  const parts: string[] = []
  const ct = stream.codec_type

  if (ct === 'video') {
    const w = stream.width
    const h = stream.height
    if (typeof w === 'number' && typeof h === 'number') {
      parts.push(`${w}×${h}`)
    }
    const fps = parseFraction(stream.avg_frame_rate) ?? parseFraction(stream.r_frame_rate)
    if (fps !== null) {
      const label =
        fps >= 100 ? fps.toFixed(0) : Number.isInteger(fps) ? String(fps) : fps.toFixed(3)
      parts.push(`${label} fps`)
    }
  } else if (ct === 'audio') {
    const ch = stream.channels
    if (typeof ch === 'number') {
      parts.push(`${ch} кан.`)
    }
    const sr = parsePositiveNumber(stream.sample_rate)
    if (sr !== null) {
      if (sr >= 1000) {
        const k = sr / 1000
        parts.push(`${Number.isInteger(k) ? String(k) : k.toFixed(1)} kHz`)
      } else {
        parts.push(`${sr} Hz`)
      }
    }
    if (typeof stream.channel_layout === 'string' && stream.channel_layout.trim() !== '') {
      parts.push(stream.channel_layout.trim())
    }
  } else if (ct === 'subtitle') {
    const lang = tagString(stream.tags, 'language')
    const title = tagString(stream.tags, 'title')
    if (lang) {
      parts.push(lang)
    }
    if (title) {
      parts.push(title)
    }
  } else {
    const lang = tagString(stream.tags, 'language')
    const title = tagString(stream.tags, 'title')
    if (lang) {
      parts.push(lang)
    }
    if (title) {
      parts.push(title)
    }
  }

  return parts.length > 0 ? parts.join(' · ') : '—'
}

function buildTrackRows(streams: FfprobeJson['streams']): MediaProbeTrackRow[] {
  const list = streams ?? []
  const rows: MediaProbeTrackRow[] = []
  list.forEach((stream, i) => {
    const index = typeof stream.index === 'number' ? stream.index : i
    rows.push({
      index,
      kind: mapCodecType(stream.codec_type),
      codec:
        typeof stream.codec_name === 'string' && stream.codec_name.trim() !== ''
          ? stream.codec_name
          : '?',
      detail: buildTrackDetail(stream)
    })
  })
  rows.sort((a, b) => a.index - b.index)
  return rows
}

function runFfprobeJson(ffprobePath: string, mediaPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    logExternalProcessLine('ffprobe', 'lifecycle', 'started')
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
        if (stdout.trim().length > 0) {
          logExternalProcessLine('ffprobe', 'stdout', `json bytes=${Buffer.byteLength(stdout)}`)
        }
        if (stderr.trim().length > 0) {
          for (const line of stderr.split(/\r?\n/)) {
            logExternalProcessLine('ffprobe', 'stderr', line)
          }
        }
        if (error) {
          logExternalProcessLine('ffprobe', 'lifecycle', `error ${error.message}`)
          reject(new Error(stderr.trim() || error.message))
          return
        }
        logExternalProcessLine('ffprobe', 'lifecycle', 'closed exitCode=0')
        resolve(stdout)
      }
    )
  })
}

export async function probeMediaFile(
  paths: AppPaths,
  absoluteMediaPath: string,
  engineOverrides?: EnginePathOverrides
): Promise<MediaProbeResult> {
  const ffprobe = resolveEngineExecutablePath(paths, 'ffprobe', engineOverrides)
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

  const formatLong =
    typeof parsed.format?.format_long_name === 'string' &&
    parsed.format.format_long_name.trim() !== ''
      ? parsed.format.format_long_name.trim()
      : null

  return {
    ok: true,
    durationSec: Number.isFinite(durationSec) ? durationSec : null,
    video,
    audioCodec,
    formatName:
      typeof parsed.format?.format_name === 'string'
        ? (parsed.format.format_name.split(',')[0]?.trim() ?? null)
        : null,
    formatLongName: formatLong,
    bitrateKbps: formatBitrateKbps(parsed.format?.bit_rate),
    tracks: buildTrackRows(parsed.streams),
    rawJson
  }
}
