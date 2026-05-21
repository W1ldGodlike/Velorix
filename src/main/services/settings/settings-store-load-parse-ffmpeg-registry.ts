import { isAbsolute, normalize } from 'path'

import type { FfmpegExportVideoCodecId } from '../../../shared/ffmpeg-export-contract'
import { parseFfmpegExportVideoCodec } from '../../../shared/ffmpeg-export-video-codec'
import {
  parseStoredTrimmedWhitelistEnum,
  parseStoredWhitelistEnum
} from '../../../shared/settings-stored-parse'

export function parseFfmpegExportDirectoryStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return undefined
  }
  const n = normalize(raw.trim())
  return isAbsolute(n) && n.length <= 4096 ? n : undefined
}

export function parseFfmpegSnapshotDirectoryStored(raw: unknown): string | undefined {
  return parseFfmpegExportDirectoryStored(raw)
}

export function parseFfmpegSnapshotFormatStored(raw: unknown): 'png' | 'jpg' | 'webp' | undefined {
  return parseStoredWhitelistEnum(raw, ['png', 'jpg', 'webp'])
}

export function parseFfmpegExportEncodePresetStored(raw: unknown): string | undefined {
  return parseStoredTrimmedWhitelistEnum(raw, ['balance', 'smaller', 'quality'])
}

export function parseFfmpegExportVideoCodecStored(
  raw: unknown
): FfmpegExportVideoCodecId | undefined {
  const id = parseFfmpegExportVideoCodec(raw)
  if (id === 'libx264') {
    return undefined
  }
  return id
}

export function parseFfmpegExportContainerStored(raw: unknown): 'mp4' | 'mkv' | 'mov' | undefined {
  return parseStoredWhitelistEnum(raw, ['mp4', 'mkv', 'mov'])
}

export function parseFfmpegExportCrfStored(raw: unknown): number | undefined {
  if (typeof raw !== 'number' || !Number.isInteger(raw) || raw < 0 || raw > 51) {
    return undefined
  }
  return raw
}

export function parseFfmpegExportAudioBitrateStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const t = raw.trim().toLowerCase()
  if (!/^\d{2,3}k$/.test(t)) {
    return undefined
  }
  const kbps = Number(t.slice(0, -1))
  if (!Number.isInteger(kbps) || kbps < 32 || kbps > 512) {
    return undefined
  }
  return `${kbps}k`
}

export function parseFfmpegExportVideoBitrateStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const t = raw.trim().toLowerCase()
  if (!/^\d{3,5}k$/.test(t)) {
    return undefined
  }
  const kbps = Number(t.slice(0, -1))
  if (!Number.isInteger(kbps) || kbps < 300 || kbps > 50000) {
    return undefined
  }
  return `${kbps}k`
}

export function parseFfmpegExportAudioModeStored(
  raw: unknown
):
  | 'aac'
  | 'libmp3lame'
  | 'ac3'
  | 'copy'
  | 'none'
  | 'pcm_s16le'
  | 'libvorbis'
  | 'libopus'
  | 'flac'
  | 'alac'
  | undefined {
  return parseStoredWhitelistEnum(raw, [
    'aac',
    'libmp3lame',
    'ac3',
    'copy',
    'none',
    'pcm_s16le',
    'libvorbis',
    'libopus',
    'flac',
    'alac'
  ])
}

export function parseFfmpegExportFpsStored(raw: unknown): number | undefined {
  if (typeof raw !== 'number' || ![24, 25, 30, 50, 60].includes(raw)) {
    return undefined
  }
  return raw
}

export function parseFfmpegExportScalePresetStored(
  raw: unknown
): 'source' | '480p' | '720p' | '1080p' | undefined {
  return parseStoredWhitelistEnum(raw, ['source', '480p', '720p', '1080p'])
}
