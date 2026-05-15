/**
 * §16 — разбор `ffmpeg -hide_banner -encoders`: какие HW-видеокодеки присутствуют в сборке ffmpeg.
 * Только whitelist имён; spawn/IPC — в main (`ffmpeg-hw-encoder-probe-main.ts`).
 */

export const FFMPEG_HW_VIDEO_ENCODER_IDS = [
  'h264_nvenc',
  'hevc_nvenc',
  'av1_nvenc',
  'h264_amf',
  'hevc_amf',
  'av1_amf',
  'h264_qsv',
  'hevc_qsv',
  'av1_qsv',
  'h264_vaapi',
  'hevc_vaapi'
] as const

export type FfmpegHwVideoEncoderId = (typeof FFMPEG_HW_VIDEO_ENCODER_IDS)[number]

export type FfmpegHwEncodersSnapshot = { [K in FfmpegHwVideoEncoderId]: boolean } & {
  /** Строк вывода, в которых встретилось хотя бы одно имя из whitelist. */
  matchedEncoderLines: number
}

export type FfmpegHwEncodersProbeResult =
  | { ok: true; snapshot: FfmpegHwEncodersSnapshot }
  | { ok: false; error: string }

const HW_ALT_PATTERN = FFMPEG_HW_VIDEO_ENCODER_IDS.map((id) =>
  id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
).join('|')

const LINE_HAS_HW_RE = new RegExp(`\\b(?:${HW_ALT_PATTERN})\\b`)

function idPattern(id: FfmpegHwVideoEncoderId): RegExp {
  return new RegExp(`\\b${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`)
}

const ID_PATTERNS: ReadonlyArray<{ id: FfmpegHwVideoEncoderId; re: RegExp }> =
  FFMPEG_HW_VIDEO_ENCODER_IDS.map((id) => ({ id, re: idPattern(id) }))

export function createEmptyFfmpegHwEncodersSnapshot(): FfmpegHwEncodersSnapshot {
  const snap = { matchedEncoderLines: 0 } as FfmpegHwEncodersSnapshot
  for (const id of FFMPEG_HW_VIDEO_ENCODER_IDS) {
    snap[id] = false
  }
  return snap
}

/** Разбор stdout/stderr `ffmpeg -encoders` (или объединённого лога). */
export function parseFfmpegEncodersListOutput(text: string): FfmpegHwEncodersSnapshot {
  const snap = createEmptyFfmpegHwEncodersSnapshot()
  for (const rawLine of text.split(/\r?\n/)) {
    if (!LINE_HAS_HW_RE.test(rawLine)) {
      continue
    }
    snap.matchedEncoderLines += 1
    for (const { id, re } of ID_PATTERNS) {
      if (re.test(rawLine)) {
        snap[id] = true
      }
    }
  }
  return snap
}
