/**
 * §7.2 — скалярный парсинг полей export из settings/IPC (без enum whitelist из parse-registry).
 */
import type { MediaExportTrimPayload } from './ffmpeg-export-contract'
import { normalizeFfmpegExportAudioGainDb } from './ffmpeg-export-argv'

const FFMPEG_EXPORT_FPS_WHITELIST = [24, 25, 30, 50, 60] as const

export function parseFfmpegExportCrf(raw: unknown): number | null {
  const n =
    typeof raw === 'number'
      ? raw
      : typeof raw === 'string' && raw.trim() !== ''
        ? Number(raw.trim())
        : NaN
  if (!Number.isInteger(n) || n < 0 || n > 51) {
    return null
  }
  return n
}

export function parseFfmpegExportAudioBitrate(raw: unknown): string | null {
  if (typeof raw !== 'string') {
    return null
  }
  const t = raw.trim().toLowerCase()
  if (!/^\d{2,3}k$/.test(t)) {
    return null
  }
  const kbps = Number(t.slice(0, -1))
  if (!Number.isInteger(kbps) || kbps < 32 || kbps > 512) {
    return null
  }
  return `${kbps}k`
}

export function parseFfmpegExportVideoBitrate(raw: unknown): string | null {
  if (typeof raw !== 'string') {
    return null
  }
  const t = raw.trim().toLowerCase()
  if (!/^\d{3,5}k$/.test(t)) {
    return null
  }
  const kbps = Number(t.slice(0, -1))
  if (!Number.isInteger(kbps) || kbps < 300 || kbps > 50000) {
    return null
  }
  return `${kbps}k`
}

export function parseFfmpegExportFps(raw: unknown): number | null {
  const n =
    typeof raw === 'number'
      ? raw
      : typeof raw === 'string' && raw.trim() !== ''
        ? Number(raw.trim())
        : NaN
  if (!(FFMPEG_EXPORT_FPS_WHITELIST as readonly number[]).includes(n)) {
    return null
  }
  return n
}

/** §7.2 — двухпроходное libx264; только явный `true`. */
export function parseFfmpegExportTwoPass(raw: unknown): boolean {
  return raw === true
}

/** §7.3 — экономный режим (`-threads 1`); только явный `true`. */
export function parseFfmpegExportEconomyMode(raw: unknown): boolean {
  return raw === true
}

/** §7.2 — strip-флаги; только явный `true` ставит `-map_metadata -1` / `-map_chapters -1`. */
export function parseFfmpegExportStripFlag(raw: unknown): boolean {
  return raw === true
}

export function parseFfmpegExportAudioGainDb(raw: unknown): number | null {
  return normalizeFfmpegExportAudioGainDb(raw)
}

/** §7.2 — IPC/renderer trim payload: только конечные неотрицательные маркеры In < Out. */
export function parseFfmpegExportTrim(raw: unknown): MediaExportTrimPayload | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined
  }
  const o = raw as Record<string, unknown>
  if (typeof o['inSec'] !== 'number' || typeof o['outSec'] !== 'number') {
    return undefined
  }
  const inSec = o['inSec']
  const outSec = o['outSec']
  if (!Number.isFinite(inSec) || !Number.isFinite(outSec)) {
    return undefined
  }
  if (inSec < 0 || outSec <= inSec) {
    return undefined
  }
  return { inSec, outSec }
}
