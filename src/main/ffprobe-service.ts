import { execFile } from 'child_process'

import type { AppPaths } from './app-paths'
import { resolveEngineExecutablePath, type EnginePathOverrides } from './engine-service'
import { logExternalProcessLine } from './external-process-log'
import { formatFfprobeDispositionSummary } from '../shared/ffprobe-disposition'
import { buildChapterRowsFromFfprobeJson } from '../shared/ffprobe-chapters'
import { parseFfprobeRationalFps, resolveVideoFpsApprox } from '../shared/ffprobe-video-fps'
import {
  extractFfprobeDisplayMatrixRotation,
  summarizeFfprobeSideDataList
} from '../shared/ffprobe-side-data'
import type {
  MediaProbeResult,
  MediaProbeSuccess,
  MediaProbeTrackRow
} from '../shared/ffprobe-contract'

export type {
  MediaProbeResult,
  MediaProbeSuccess,
  MediaProbeTrackRow
} from '../shared/ffprobe-contract'

interface FfprobeJson {
  chapters?: unknown[]
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
    nb_frames?: string
    pix_fmt?: string
    sample_aspect_ratio?: string
    display_aspect_ratio?: string
    color_space?: string
    color_primaries?: string
    /** Основное имя в актуальных сборках ffprobe; иначе смотрим `color_trc`. */
    color_transfer?: string
    color_trc?: string
    color_range?: string
    /** H.264/HEVC и др.: baseline/main/high … */
    profile?: string
    /** Уровень кодека (часто целое вроде `41` у H.264). */
    level?: string | number
    /** progressive / tt / tb / tff / bff … */
    field_order?: string
    chroma_location?: string
    bits_per_raw_sample?: string | number
    /** Размер кодируемого кадра; иногда отличается от `width`/`height` (crop/padding). */
    coded_width?: number
    coded_height?: number
    /** H.264/HEVC: число опорных кадров. */
    refs?: number
    /** Число буферизуемых B-кадров (ffprobe legacy). */
    has_b_frames?: number
    /** FourCC / тег кодека в контейнере (`avc1`, `hvc1` …). */
    codec_tag_string?: string
    bit_rate?: string
    disposition?: Record<string, unknown>
    tags?: Record<string, string | number | undefined>
    side_data_list?: unknown
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

/** Строки полей ffprobe вроде ratio/pix_fmt: пусто и `N/A` не показываем. */
function ffprobeScalarDisplay(raw: string | undefined): string | null {
  if (typeof raw !== 'string') {
    return null
  }
  const t = raw.trim()
  if (t === '' || /^n\/a$/i.test(t)) {
    return null
  }
  return t
}

/** SAR 1:1 и варианты не дублируем в компактной строке detail. */
function isSquarePixelSar(raw: string): boolean {
  const t = raw.replace(/\s+/g, '').toLowerCase()
  return t === '1:1' || t === '1/1' || t === '1'
}

function parseTagRotateDegrees(raw: string | null): number | null {
  if (raw === null) {
    return null
  }
  const n = Number.parseFloat(raw.trim().replace(',', '.'))
  if (!Number.isFinite(n) || n === 0) {
    return null
  }
  return Math.trunc(n)
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
    const haveWh = typeof w === 'number' && typeof h === 'number'
    if (haveWh) {
      parts.push(`${w}×${h}`)
    }
    const sarShown = ffprobeScalarDisplay(stream.sample_aspect_ratio)
    if (sarShown !== null && !isSquarePixelSar(sarShown)) {
      parts.push(`SAR ${sarShown}`)
    }
    const darShown = ffprobeScalarDisplay(stream.display_aspect_ratio)
    if (darShown !== null) {
      parts.push(`DAR ${darShown}`)
    }
    const matrixDeg = extractFfprobeDisplayMatrixRotation(stream.side_data_list)
    const tagRotDeg = parseTagRotateDegrees(tagString(stream.tags, 'rotate'))
    if (matrixDeg !== null && matrixDeg !== 0) {
      const label = Number.isInteger(matrixDeg) ? String(matrixDeg) : matrixDeg.toFixed(2)
      parts.push(`matrix ${label}°`)
    } else if (tagRotDeg !== null) {
      parts.push(`rot ${tagRotDeg}°`)
    }
    const fps =
      parseFfprobeRationalFps(stream.avg_frame_rate) ?? parseFfprobeRationalFps(stream.r_frame_rate)
    if (fps !== null) {
      const label =
        fps >= 100 ? fps.toFixed(0) : Number.isInteger(fps) ? String(fps) : fps.toFixed(3)
      parts.push(`${label} fps`)
    }
    const sideData = summarizeFfprobeSideDataList(stream.side_data_list)
    if (sideData !== null) {
      parts.push(sideData)
    }
    const profile = ffprobeScalarDisplay(
      typeof stream.profile === 'string' ? stream.profile : undefined
    )
    if (profile) {
      parts.push(profile)
    }
    const levelRaw = stream.level
    const levelStr =
      typeof levelRaw === 'number' && Number.isFinite(levelRaw)
        ? String(Math.trunc(levelRaw))
        : typeof levelRaw === 'string'
          ? levelRaw.trim()
          : ''
    if (levelStr !== '' && !/^n\/a$/i.test(levelStr)) {
      parts.push(`level ${levelStr}`)
    }
    const fieldOrder = ffprobeScalarDisplay(
      typeof stream.field_order === 'string' ? stream.field_order : undefined
    )
    if (fieldOrder) {
      parts.push(fieldOrder)
    }
    const chroma = ffprobeScalarDisplay(
      typeof stream.chroma_location === 'string' ? stream.chroma_location : undefined
    )
    if (chroma) {
      parts.push(`chroma ${chroma}`)
    }
    const bitsRaw = stream.bits_per_raw_sample
    if (typeof bitsRaw === 'number' && Number.isFinite(bitsRaw) && bitsRaw > 0) {
      parts.push(`${Math.trunc(bitsRaw)}-bit`)
    } else {
      const bitsS = ffprobeScalarDisplay(typeof bitsRaw === 'string' ? bitsRaw : undefined)
      if (bitsS) {
        parts.push(`${bitsS}-bit`)
      }
    }
    const cw = stream.coded_width
    const ch = stream.coded_height
    if (
      haveWh &&
      typeof cw === 'number' &&
      typeof ch === 'number' &&
      Number.isFinite(cw) &&
      Number.isFinite(ch) &&
      cw > 0 &&
      ch > 0 &&
      (cw !== w || ch !== h)
    ) {
      parts.push(`coded ${cw}×${ch}`)
    }
    const refsN = stream.refs
    if (typeof refsN === 'number' && Number.isFinite(refsN) && refsN > 0) {
      parts.push(`${refsN} ref`)
    }
    const bFrames = stream.has_b_frames
    if (typeof bFrames === 'number' && Number.isFinite(bFrames) && bFrames > 0) {
      parts.push(`B${bFrames}`)
    }
    const fourcc = ffprobeScalarDisplay(
      typeof stream.codec_tag_string === 'string' ? stream.codec_tag_string : undefined
    )
    if (fourcc) {
      parts.push(fourcc)
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
    const isVideo = stream.codec_type === 'video'
    const colorTransferRaw = stream.color_transfer ?? stream.color_trc
    rows.push({
      index,
      kind: mapCodecType(stream.codec_type),
      codec:
        typeof stream.codec_name === 'string' && stream.codec_name.trim() !== ''
          ? stream.codec_name
          : '?',
      detail: buildTrackDetail(stream),
      language: tagString(stream.tags, 'language'),
      titleTag: tagString(stream.tags, 'title'),
      streamBitrateKbps: formatBitrateKbps(
        typeof stream.bit_rate === 'string' ? stream.bit_rate : undefined
      ),
      dispositionSummary: formatFfprobeDispositionSummary(stream.disposition),
      pixelFormat: isVideo ? ffprobeScalarDisplay(stream.pix_fmt) : null,
      sampleAspectRatio: isVideo ? ffprobeScalarDisplay(stream.sample_aspect_ratio) : null,
      displayAspectRatio: isVideo ? ffprobeScalarDisplay(stream.display_aspect_ratio) : null,
      colorSpace: isVideo ? ffprobeScalarDisplay(stream.color_space) : null,
      colorPrimaries: isVideo ? ffprobeScalarDisplay(stream.color_primaries) : null,
      colorTransfer: isVideo ? ffprobeScalarDisplay(colorTransferRaw) : null,
      colorRange: isVideo ? ffprobeScalarDisplay(stream.color_range) : null
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
        '-show_chapters',
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

  const durationSecResolved = Number.isFinite(durationSec) ? durationSec : null

  let video: MediaProbeSuccess['video'] = null
  let videoFpsApprox: number | null = null
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
      videoFpsApprox = resolveVideoFpsApprox({
        durationSec: durationSecResolved,
        ...(typeof s.avg_frame_rate === 'string' ? { avgFrameRate: s.avg_frame_rate } : {}),
        ...(typeof s.r_frame_rate === 'string' ? { rFrameRate: s.r_frame_rate } : {}),
        ...(typeof s.nb_frames === 'string' ? { nbFrames: s.nb_frames } : {})
      })
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
    durationSec: durationSecResolved,
    video,
    videoFpsApprox,
    audioCodec,
    formatName:
      typeof parsed.format?.format_name === 'string'
        ? (parsed.format.format_name.split(',')[0]?.trim() ?? null)
        : null,
    formatLongName: formatLong,
    bitrateKbps: formatBitrateKbps(parsed.format?.bit_rate),
    tracks: buildTrackRows(parsed.streams),
    chapters: buildChapterRowsFromFfprobeJson(parsed.chapters),
    rawJson
  }
}
