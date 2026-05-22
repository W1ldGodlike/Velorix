import { pathExtname } from './path-lite'

/** §7.5 — HEIC/HEIF только при libheif в bundled ffmpeg. */
export const MEDIA_UTILITIES_HEIF_INPUT_EXTENSIONS = new Set(['.heic', '.heif'])

export function isMediaUtilitiesHeifInputPath(filePath: string): boolean {
  return MEDIA_UTILITIES_HEIF_INPUT_EXTENSIONS.has(pathExtname(filePath))
}

/** Разбор stdout `ffmpeg -hide_banner -decoders`. */
export function parseFfmpegHeifDecoderAvailable(decodersOutput: string): boolean {
  for (const rawLine of decodersOutput.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line.startsWith('V')) {
      continue
    }
    if (
      /\blibheif\b/i.test(line) ||
      /\bheif_heif\b/i.test(line) ||
      /\bheif\s+image\b/i.test(line)
    ) {
      return true
    }
  }
  return false
}

export function mediaUtilitiesSlideshowPickExtensions(heifDecoder: boolean): readonly string[] {
  const base = ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif', 'tif', 'tiff'] as const
  if (!heifDecoder) {
    return base
  }
  return [...base, 'heic', 'heif']
}
